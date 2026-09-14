"""C6 loader: `sync: manual` schema and no-auto-enrollment semantics.

Adjudicated W1-C6 (directive D redirected):
- `sync: manual` with the new schema must carry `manual_reason` and `manual_until`.
- `manual_until: null` is allowed only with a DEBT.md anchor for that repo.
- An expired `manual_until` is an audit finding only; expiry never makes a repo
  write-eligible for sync-github `--all` (reclassification is an explicit
  manifest edit under exact yes).
- Legacy entries (`sync: manual` without the new fields) stay manual during the
  schema transition; they are not errors and are not write-eligible.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any, Literal

SyncKind = Literal["auto", "other", "legacy", "active", "expired", "open_ended", "malformed"]


@dataclass(frozen=True)
class SyncManualStatus:
    """Classification of one github-baseline.yaml repo entry."""

    repo: str
    kind: SyncKind
    write_eligible: bool
    errors: list[str] = field(default_factory=list)
    findings: list[str] = field(default_factory=list)


def is_write_eligible(entry: dict[str, Any]) -> bool:
    """True only for explicit `sync: auto`. Never true for manual or expired."""
    return entry.get("sync") == "auto"


def _parse_until(value: Any) -> date | None | str:
    """Return a date, None for open-ended null, or an error token string."""
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, str):
        try:
            return date.fromisoformat(value.strip())
        except ValueError:
            return f"invalid-date:{value}"
    return f"invalid-type:{type(value).__name__}"


def debt_anchors_open_ended_manual(debt_text: str, repo: str) -> bool:
    """True when DEBT.md has a section anchoring open-ended sync:manual for repo."""
    if not debt_text or not repo:
        return False
    needle = repo.strip().lower()
    sections = _debt_sections(debt_text)
    for heading, body in sections:
        hay = f"{heading}\n{body}".lower()
        if needle not in hay:
            continue
        if "sync: manual" in hay or "sync:manual" in hay or "manual_until" in hay:
            return True
    return False


def _debt_sections(debt_text: str) -> list[tuple[str, str]]:
    lines = debt_text.splitlines()
    sections: list[tuple[str, str]] = []
    current_heading = ""
    body: list[str] = []
    for line in lines:
        if line.startswith("### "):
            if current_heading or body:
                sections.append((current_heading, "\n".join(body)))
            current_heading = line[4:].strip()
            body = []
        else:
            body.append(line)
    if current_heading or body:
        sections.append((current_heading, "\n".join(body)))
    return sections


def classify_sync_entry(
    entry: dict[str, Any],
    *,
    today: date | None = None,
    debt_text: str = "",
) -> SyncManualStatus:
    """Classify one manifest entry for C6 sync:manual validation."""
    today = today or date.today()
    repo = str(entry.get("repo") or "<unknown>")
    sync = entry.get("sync")

    if sync == "auto":
        return SyncManualStatus(repo=repo, kind="auto", write_eligible=True)

    if sync != "manual":
        return SyncManualStatus(
            repo=repo,
            kind="other",
            write_eligible=False,
            errors=[f"{repo}: sync must be 'auto' or 'manual' (got {sync!r})"],
        )

    has_reason = "manual_reason" in entry
    has_until = "manual_until" in entry

    # Transition: bare sync:manual stays manual; no schema error yet.
    if not has_reason and not has_until:
        return SyncManualStatus(
            repo=repo,
            kind="legacy",
            write_eligible=False,
            findings=[f"{repo}: sync:manual legacy entry (missing manual_reason/manual_until)"],
        )

    errors: list[str] = []
    findings: list[str] = []

    reason = entry.get("manual_reason")
    if not has_reason or not isinstance(reason, str) or not reason.strip():
        errors.append(f"{repo}: sync:manual requires non-empty string manual_reason")

    if not has_until:
        errors.append(f"{repo}: sync:manual requires manual_until (ISO date or null with DEBT anchor)")
        return SyncManualStatus(
            repo=repo,
            kind="malformed",
            write_eligible=False,
            errors=errors,
            findings=findings,
        )

    until = _parse_until(entry.get("manual_until"))
    if isinstance(until, str):
        errors.append(f"{repo}: manual_until is invalid ({until})")
        return SyncManualStatus(
            repo=repo,
            kind="malformed",
            write_eligible=False,
            errors=errors,
            findings=findings,
        )

    if until is None:
        if not debt_anchors_open_ended_manual(debt_text, repo):
            errors.append(
                f"{repo}: manual_until is null without a DEBT.md anchor "
                "(section must name the repo and sync: manual / manual_until)"
            )
            return SyncManualStatus(
                repo=repo,
                kind="malformed",
                write_eligible=False,
                errors=errors,
                findings=findings,
            )
        if errors:
            return SyncManualStatus(
                repo=repo,
                kind="malformed",
                write_eligible=False,
                errors=errors,
                findings=findings,
            )
        return SyncManualStatus(
            repo=repo,
            kind="open_ended",
            write_eligible=False,
            errors=errors,
            findings=findings,
        )

    if until < today:
        findings.append(
            f"{repo}: sync:manual expired on {until.isoformat()} "
            "(finding only; still not write-eligible)"
        )
        # Expired is an audit finding (blocking once schema is present) but never
        # write-eligible. Callers treat findings as errors for the audit gate.
        if errors:
            return SyncManualStatus(
                repo=repo,
                kind="malformed",
                write_eligible=False,
                errors=errors + list(findings),
                findings=findings,
            )
        return SyncManualStatus(
            repo=repo,
            kind="expired",
            write_eligible=False,
            errors=list(findings),
            findings=findings,
        )

    if errors:
        return SyncManualStatus(
            repo=repo,
            kind="malformed",
            write_eligible=False,
            errors=errors,
            findings=findings,
        )

    return SyncManualStatus(
        repo=repo,
        kind="active",
        write_eligible=False,
        errors=errors,
        findings=findings,
    )


def validate_manifest_sync_manual(
    entries: list[dict[str, Any]],
    *,
    today: date | None = None,
    debt_text: str = "",
    include_legacy_findings: bool = False,
) -> list[str]:
    """Return blocking messages for sync:manual schema / expiry issues.

    Legacy transition entries do not block unless ``include_legacy_findings``.
    """
    today = today or date.today()
    messages: list[str] = []
    for entry in entries:
        status = classify_sync_entry(entry, today=today, debt_text=debt_text)
        messages.extend(status.errors)
        if include_legacy_findings and status.kind == "legacy":
            messages.extend(status.findings)
    return messages


def auto_enroll_candidates(
    entries: list[dict[str, Any]],
    *,
    today: date | None = None,
    debt_text: str = "",
) -> list[str]:
    """Repo names that sync-github --all may write. Never includes manual/expired."""
    today = today or date.today()
    names: list[str] = []
    for entry in entries:
        status = classify_sync_entry(entry, today=today, debt_text=debt_text)
        if status.write_eligible and is_write_eligible(entry):
            names.append(status.repo)
    return names
