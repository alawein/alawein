#!/usr/bin/env python3
"""Audit GitHub baseline coverage for alawein-managed repos."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

try:
    import yaml
except ModuleNotFoundError:  # needed for a real run, not for importing the resolver in tests
    yaml = None

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from workspace_paths import workspace_root_for  # noqa: E402

WORKSPACE = workspace_root_for(ROOT)
MANIFEST = (yaml.safe_load((ROOT / "github-baseline.yaml").read_text(encoding="utf-8")) if yaml else {}) or {}
REPOS = MANIFEST.get("repos", [])
WORKFLOW_REF = str(MANIFEST.get("workflow_ref") or "").strip()
WORKFLOW_DIR = ROOT / ".github" / "workflows"

# Shared, tested repo-path resolver: one source of truth for this script and the
# sync-github.sh heredoc (scripts/github/_repo_paths.py). The sys.path insert
# makes the import work both as a script and when loaded by file path in tests.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import _repo_paths  # noqa: E402
import _sync_manual  # noqa: E402

LOCAL_PATHS = _repo_paths.load_local_path_map(ROOT)


def resolve_repo_dir(repo: str) -> Path:
    return _repo_paths.resolve_repo_dir(WORKSPACE, LOCAL_PATHS, repo)

BANNED_WIDGET_PATTERNS = [
    "github-readme-stats",
    "github-profile-trophy",
    "github-readme-activity-graph",
    "readme-typing-svg",
    "spotify-github-profile",
    "capsule-render",
]

# Patterns intentionally used in the control-plane org profile README (decorative
# header/banner use, not vanity-stat inflation). Excluded from check_readme.
# check_readme only ever scans ROOT/README.md (the control-plane itself); this
# exemption never applies to sibling repos. Keep this set minimal; additions
# must have an explicit rationale comment.
CONTROL_PLANE_README_EXEMPT: frozenset[str] = frozenset({"capsule-render"})
if len(CONTROL_PLANE_README_EXEMPT) > 2:
    raise ValueError(
        "CONTROL_PLANE_README_EXEMPT has grown beyond 2 entries. "
        "Review each entry, add a rationale comment, and raise this cap deliberately."
    )
PINNED_REF_RE = re.compile(r"^[0-9a-f]{40}$")
USES_LINE_RE = re.compile(r"^\s*-?\s*uses:\s*([^\s#]+)")


def load_yaml(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def exact_path_exists(path: Path) -> bool:
    if not path.parent.exists():
        return False
    return any(child.name == path.name for child in path.parent.iterdir())


def add_error(errors: list[str], message: str) -> None:
    errors.append(message)


def check_manifest(errors: list[str]) -> None:
    if not PINNED_REF_RE.fullmatch(WORKFLOW_REF):
        add_error(errors, "github-baseline.yaml workflow_ref must be a 40-character SHA")


def check_sync_manual_entries(
    errors: list[str],
    *,
    entries: list[dict] | None = None,
    today: date | None = None,
    debt_text: str | None = None,
    debt_path: Path | None = None,
) -> None:
    """Validate C6 sync:manual schema; expiry never auto-enrolls.

    Legacy bare ``sync: manual`` rows stay non-blocking until an explicit
    migration PR adds ``manual_reason`` / ``manual_until``. Malformed and
    expired schema rows fail the audit. Write eligibility is unchanged.
    """
    rows = entries if entries is not None else REPOS
    if debt_text is None:
        path = debt_path or (ROOT / "docs" / "DEBT.md")
        try:
            debt_text = path.read_text(encoding="utf-8") if path.is_file() else ""
        except OSError:
            debt_text = ""
    for message in _sync_manual.validate_manifest_sync_manual(
        rows,
        today=today,
        debt_text=debt_text or "",
    ):
        add_error(errors, message)


def check_readme(errors: list[str]) -> None:
    readme_path = ROOT / "README.md"
    if not readme_path.exists():
        add_error(errors, "README.md is missing from the control-plane repo root")
        return
    try:
        readme = readme_path.read_text(encoding="utf-8")
    except OSError as exc:
        add_error(errors, f"README.md could not be read: {exc}")
        return
    for pattern in BANNED_WIDGET_PATTERNS:
        if pattern in CONTROL_PLANE_README_EXEMPT:
            continue
        if pattern in readme:
            add_error(errors, f"README contains banned widget pattern: {pattern}")


def check_control_plane_workflows(errors: list[str]) -> None:
    for path in sorted(WORKFLOW_DIR.glob("*.yml")):
        for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            match = USES_LINE_RE.match(stripped)
            if not match:
                continue
            target = match.group(1)
            if "@" not in target:
                add_error(errors, f"{path.relative_to(ROOT).as_posix()}:{line_number}: uses target missing ref: {target}")
                continue
            action, ref = target.rsplit("@", maxsplit=1)
            if action.startswith("alawein/alawein/.github/workflows/"):
                if ref != WORKFLOW_REF:
                    add_error(
                        errors,
                        f"{path.relative_to(ROOT).as_posix()}:{line_number}: reusable workflow ref '{ref}' does not match workflow_ref '{WORKFLOW_REF}'",
                    )
                continue
            if not PINNED_REF_RE.fullmatch(ref):
                add_error(
                    errors,
                    f"{path.relative_to(ROOT).as_posix()}:{line_number}: action ref must be SHA pinned, found '{target}'",
                )
    check_hub_workflow_permissions(errors)
    check_hub_secret_references(errors)


_WRITE_ACTION_RE = re.compile(
    r"createComment|create-pull-request|peter-evans/|"
    r"upload-sarif|softprops/action-gh-release",
    re.IGNORECASE,
)
_GH_CLI_WRITE_RE = re.compile(r"\bgh\s+(pr|issue)\b", re.IGNORECASE)
_ALT_TOKEN_SECRET_RE = re.compile(
    r"secrets\.(?!GITHUB_TOKEN\b)[A-Z0-9_]+",
)
# Wider scan for secrets.NAME candidates; validate the name separately.
# Capture may be empty (secrets. followed by delimiter) so we can fail it.
# Stop at whitespace, quotes, braces, parens, brackets, and commas so
# expressions like fromJSON(secrets.NAME) still yield a clean NAME token.
_SECRET_REF_SCAN_RE = re.compile(r"secrets\.([^\s}'\"`()\[\],]*)")
_VALID_SECRET_NAME_RE = re.compile(r"^[A-Z0-9_]+$")
_DEBT_HUB_SECRET_HEADING_RE = re.compile(r"^### Hub secret ([A-Z0-9_]+)\b", re.MULTILINE)
_DEBT_EXPIRES_RE = re.compile(r"^\s*-\s*\*\*Expires:\*\*\s*(\d{4}-\d{2}-\d{2})\s*$", re.MULTILINE)
_DEBT_RETIRED_RE = re.compile(
    r"^\s*-\s*\*\*(?:Status|Retired):\*\*\s*(retired|true)\s*$",
    re.MULTILINE | re.IGNORECASE,
)


@dataclass(frozen=True)
class DebtSecretEntry:
    """Named hub credential tracked in docs/DEBT.md."""

    name: str
    expires: date | None = None
    retired: bool = False


def parse_workflow_secret_references(text: str) -> tuple[list[str], list[str]]:
    """Return (valid_alt_names, unparseable_snippets) for secrets.* expressions.

    `secrets.GITHUB_TOKEN` is ignored. Valid names match `[A-Z0-9_]+`.
    """
    names: list[str] = []
    bad: list[str] = []
    seen: set[str] = set()
    for match in _SECRET_REF_SCAN_RE.finditer(text):
        raw = match.group(1)
        snippet = match.group(0)
        if raw == "GITHUB_TOKEN":
            continue
        if _VALID_SECRET_NAME_RE.fullmatch(raw):
            if raw not in seen:
                seen.add(raw)
                names.append(raw)
            continue
        bad.append(snippet)
    return names, bad


def parse_debt_secret_entries(debt_text: str) -> list[DebtSecretEntry]:
    """Parse `### Hub secret NAME ...` sections from DEBT.md."""
    entries: list[DebtSecretEntry] = []
    headings = list(_DEBT_HUB_SECRET_HEADING_RE.finditer(debt_text))
    for index, heading in enumerate(headings):
        name = heading.group(1)
        start = heading.end()
        end = headings[index + 1].start() if index + 1 < len(headings) else len(debt_text)
        body = debt_text[start:end]
        expires: date | None = None
        expires_match = _DEBT_EXPIRES_RE.search(body)
        if expires_match:
            expires = date.fromisoformat(expires_match.group(1))
        retired = _DEBT_RETIRED_RE.search(body) is not None
        entries.append(DebtSecretEntry(name=name, expires=expires, retired=retired))
    return entries


def check_hub_secret_references(
    errors: list[str],
    *,
    today: date | None = None,
    workflow_dir: Path | None = None,
    debt_path: Path | None = None,
) -> None:
    """Fail Baseline Audit on unparseable secrets.* and retired/expired DEBT names.

    Future `Expires:` dates are inventory only; they do not fail until `today`
    is on or after the expires date. `Status: retired` / `Retired: true` fail
    immediately when still referenced.
    """
    workflows = workflow_dir if workflow_dir is not None else WORKFLOW_DIR
    debt_file = debt_path if debt_path is not None else (ROOT / "docs" / "DEBT.md")
    as_of = today if today is not None else datetime.now(timezone.utc).date()

    debt_entries: list[DebtSecretEntry] = []
    if debt_file.is_file():
        debt_entries = parse_debt_secret_entries(debt_file.read_text(encoding="utf-8"))
    retired_names = {entry.name for entry in debt_entries if entry.retired}
    expired_names = {
        entry.name
        for entry in debt_entries
        if entry.expires is not None and as_of >= entry.expires and not entry.retired
    }

    for path in sorted(workflows.glob("*.yml")):
        rel = path.as_posix() if workflow_dir is not None else path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8")
        names, bad = parse_workflow_secret_references(text)
        for snippet in bad:
            add_error(errors, f"{rel}: unparseable secret expression '{snippet}'")
        for name in names:
            if name in retired_names:
                add_error(
                    errors,
                    f"{rel}: references retired DEBT secret name '{name}'",
                )
            elif name in expired_names:
                add_error(
                    errors,
                    f"{rel}: references expired DEBT secret name '{name}'",
                )


_WRITE_PERMISSION_KEYS = frozenset(
    {
        "contents",
        "pull-requests",
        "issues",
        "security-events",
        "actions",
        "id-token",
        "packages",
        "deployments",
    }
)


def _job_body_text(job: dict) -> str:
    chunks: list[str] = []
    for step in job.get("steps") or []:
        if not isinstance(step, dict):
            continue
        for key in ("run", "uses"):
            value = step.get(key)
            if isinstance(value, str):
                chunks.append(value)
        with_block = step.get("with")
        if isinstance(with_block, dict):
            for value in with_block.values():
                if isinstance(value, str):
                    chunks.append(value)
    env = job.get("env")
    if isinstance(env, dict):
        for value in env.values():
            if isinstance(value, str):
                chunks.append(value)
    for step in job.get("steps") or []:
        if isinstance(step, dict) and isinstance(step.get("env"), dict):
            for value in step["env"].values():
                if isinstance(value, str):
                    chunks.append(value)
    return "\n".join(chunks)


def _permissions_grant_write(permissions: object) -> bool:
    if not isinstance(permissions, dict):
        return False
    for key, value in permissions.items():
        if key in _WRITE_PERMISSION_KEYS and str(value).lower() == "write":
            return True
    return False


def _job_writes_via_github_token(job: dict) -> bool:
    """True when the job appears to mutate GitHub state using GITHUB_TOKEN."""
    body = _job_body_text(job)
    if _WRITE_ACTION_RE.search(body):
        return True
    if _GH_CLI_WRITE_RE.search(body):
        # PAT-backed jobs (KERNEL_SYNC_TOKEN, AUTO_PR_TOKEN, ...) are outside
        # GITHUB_TOKEN permission hygiene; Task 2.x covers those references.
        if _ALT_TOKEN_SECRET_RE.search(body):
            return False
        return True
    return False


def check_hub_workflow_permissions(errors: list[str]) -> None:
    """Require top-level permissions on every hub workflow; writers declare job-level."""
    if yaml is None:
        add_error(errors, "PyYAML is required to audit hub workflow permissions")
        return
    for path in sorted(WORKFLOW_DIR.glob("*.yml")):
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        rel = path.relative_to(ROOT).as_posix()
        if "permissions" not in data:
            add_error(errors, f"{rel}: missing top-level permissions block")
            continue
        jobs = data.get("jobs") or {}
        for job_name, job in jobs.items():
            if not isinstance(job, dict):
                continue
            if not _job_writes_via_github_token(job):
                continue
            job_perms = job.get("permissions")
            if _permissions_grant_write(job_perms):
                continue
            if job_perms is None and _permissions_grant_write(data.get("permissions")):
                continue
            add_error(
                errors,
                f"{rel}: job '{job_name}' performs a write but lacks job-level write permissions",
            )


def internal_workflow_refs(text: str) -> list[str]:
    refs: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        match = USES_LINE_RE.match(stripped)
        if not match:
            continue
        target = match.group(1)
        if target.startswith("alawein/alawein/.github/workflows/") and "@" in target:
            refs.append(target.rsplit("@", maxsplit=1)[-1])
    return refs


def check_repo(entry: dict, errors: list[str]) -> None:
    if entry.get("sync") != "auto":
        return

    if entry["repo"] not in LOCAL_PATHS:
        add_error(
            errors,
            f"{entry['repo']}: not found in catalog/repos.json; cannot resolve a "
            "bucketed path (catalog failed to load, or the manifest and catalog have drifted)",
        )
        return

    repo_dir = resolve_repo_dir(entry["repo"])
    if not repo_dir.exists():
        add_error(errors, f"{entry['repo']}: repo directory missing")
        return

    required = [
        repo_dir / ".github" / "CODEOWNERS",
        repo_dir / ".github" / "PULL_REQUEST_TEMPLATE.md",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "bug_report.yml",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "feature_request.yml",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "config.yml",
        repo_dir / ".github" / "dependabot.yml",
        repo_dir / ".github" / "workflows" / "ci.yml",
    ]

    for path in required:
        if not exact_path_exists(path):
            add_error(errors, f"{entry['repo']}: missing {path.relative_to(repo_dir).as_posix()}")

    legacy = [
        repo_dir / ".github" / "pull_request_template.md",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "bug_report.md",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "feature_request.md",
    ]
    for path in legacy:
        if exact_path_exists(path):
            add_error(errors, f"{entry['repo']}: legacy template still present at {path.relative_to(repo_dir).as_posix()}")

    dependabot = repo_dir / ".github" / "dependabot.yml"
    if dependabot.exists():
        config = load_yaml(dependabot)
        ecosystems = {item.get("package-ecosystem") for item in config.get("updates", [])}
        if "github-actions" not in ecosystems:
            add_error(errors, f"{entry['repo']}: dependabot missing github-actions ecosystem")

    ci = repo_dir / ".github" / "workflows" / "ci.yml"
    if ci.exists():
        text = ci.read_text(encoding="utf-8")
        refs = internal_workflow_refs(text)
        if "alawein/alawein/.github/workflows/ci-" not in text:
            add_error(errors, f"{entry['repo']}: ci.yml does not use central reusable workflows")
        elif not refs:
            add_error(errors, f"{entry['repo']}: ci.yml missing reusable workflow ref")
        elif any(ref != WORKFLOW_REF for ref in refs):
            add_error(errors, f"{entry['repo']}: ci.yml reusable workflow refs must equal workflow_ref {WORKFLOW_REF}")

    codeql_path = repo_dir / ".github" / "workflows" / "codeql.yml"
    if entry.get("codeql_languages"):
        if not codeql_path.exists():
            add_error(errors, f"{entry['repo']}: missing .github/workflows/codeql.yml")
        else:
            text = codeql_path.read_text(encoding="utf-8")
            refs = internal_workflow_refs(text)
            if "alawein/alawein/.github/workflows/codeql.yml@" not in text:
                add_error(errors, f"{entry['repo']}: codeql.yml does not use central reusable workflow")
            elif refs != [WORKFLOW_REF]:
                add_error(errors, f"{entry['repo']}: codeql.yml must use workflow_ref {WORKFLOW_REF}")
    elif codeql_path.exists():
        add_error(errors, f"{entry['repo']}: unexpected codeql.yml for repo without CodeQL languages")

    claude_review_path = repo_dir / ".github" / "workflows" / "claude-review.yml"
    if entry.get("claude_review"):
        if not claude_review_path.exists():
            add_error(errors, f"{entry['repo']}: missing .github/workflows/claude-review.yml (claude_review: true)")
    elif claude_review_path.exists():
        add_error(errors, f"{entry['repo']}: unexpected claude-review.yml for repo without claude_review flag")


ENFORCEMENT_CONTROLS = (
    "deletion",
    "non_fast_forward",
    "linear_history",
    "signatures",
    "required_contexts",
    "approvals",
    "code_owner_review",
    "merge_methods",
    "bypass",
    "token_default",
    "allowed_actions",
)


def derive_floor(record: dict) -> str:
    """Derive enforcement floor from catalog fields only.

    Returns one of: hub | minimum | frozen | none | out_of_scope | unknown
    """
    if not isinstance(record, dict):
        return "unknown"
    owner = str(record.get("owner") or "").strip().lower()
    if owner == "kohyr" or owner.startswith("kohyr/"):
        return "out_of_scope"
    if "type" not in record or "lifecycle" not in record:
        return "unknown"
    if record.get("type") in (None, "") or record.get("lifecycle") in (None, ""):
        return "unknown"
    if record.get("archived") is True:
        return "none"
    if record.get("type") == "governance":
        return "hub"
    lifecycle = record.get("lifecycle")
    if lifecycle == "frozen":
        return "frozen"
    if lifecycle in {"active", "maintained"} and owner in {"", "alawein"}:
        # Catalog entries often omit owner; alawein is the default user account.
        return "minimum"
    if lifecycle in {"active", "maintained"}:
        return "minimum"
    return "unknown"


def _is_http_error_payload(value: object) -> bool:
    return isinstance(value, dict) and str(value.get("status")) in {"403", "404"}


def normalize_observed(
    rulesets: object,
    protection: object,
    actions_permissions: object,
    *,
    meta: dict | None = None,
) -> dict:
    """Normalize raw API payloads into comparable control observations."""
    meta = meta or {}
    reasons: list[str] = []

    def _blocked(kind: str, payload: object) -> bool:
        info = meta.get(kind) or {}
        status = info.get("http_status")
        if status in {403, 404} or _is_http_error_payload(payload):
            reason = info.get("error") or (
                payload.get("message") if isinstance(payload, dict) else None
            ) or f"{kind} inaccessible"
            reasons.append(str(reason))
            return True
        if payload is None:
            reasons.append(info.get("error") or f"{kind} missing")
            return True
        return False

    rulesets_blocked = _blocked("rulesets", rulesets)
    protection_blocked = _blocked("protection", protection)
    actions_blocked = _blocked("actions_permissions", actions_permissions)

    if rulesets_blocked and protection_blocked:
        return {
            "unknown": True,
            "reason": "; ".join(dict.fromkeys(reasons)) or "rulesets and protection inaccessible",
            "redundancy": False,
            "controls": {name: None for name in ENFORCEMENT_CONTROLS},
            "source": "unknown",
        }

    details: list[dict] = []
    if isinstance(rulesets, list):
        # Callers may pass detailed ruleset bodies via meta['ruleset_details'].
        details = [d for d in (meta.get("ruleset_details") or []) if isinstance(d, dict)]
        if not details:
            details = [r for r in rulesets if isinstance(r, dict) and "rules" in r]

    has_ruleset = bool(details) or (isinstance(rulesets, list) and len(rulesets) > 0 and not rulesets_blocked)
    has_legacy = (
        isinstance(protection, dict)
        and not protection_blocked
        and not _is_http_error_payload(protection)
        and "url" in protection
    )

    observed: dict[str, object] = {name: None for name in ENFORCEMENT_CONTROLS}
    source = "none"

    if has_ruleset and details:
        source = "ruleset"
        rule_types: set[str] = set()
        contexts: list[str] = []
        approvals = None
        codeowners = None
        merge_methods = None
        for detail in details:
            for rule in detail.get("rules") or []:
                if not isinstance(rule, dict):
                    continue
                rtype = rule.get("type")
                params = rule.get("parameters") or {}
                rule_types.add(str(rtype))
                if rtype == "required_status_checks":
                    checks = params.get("required_status_checks") or params.get("contexts") or []
                    for item in checks:
                        if isinstance(item, dict) and item.get("context"):
                            contexts.append(str(item["context"]))
                        elif isinstance(item, str):
                            contexts.append(item)
                if rtype == "pull_request":
                    approvals = params.get("required_approving_review_count")
                    codeowners = params.get("require_code_owner_review")
                    merge_methods = params.get("allowed_merge_methods")
        observed["deletion"] = "deletion" in rule_types
        observed["non_fast_forward"] = "non_fast_forward" in rule_types
        observed["linear_history"] = "required_linear_history" in rule_types
        observed["signatures"] = {
            "enabled": "required_signatures" in rule_types,
            "bypassable": False,  # hub ruleset has no bypass actors in fixtures
        }
        observed["required_contexts"] = contexts
        observed["approvals"] = approvals
        observed["code_owner_review"] = codeowners
        observed["merge_methods"] = merge_methods
        observed["bypass"] = False

    if has_legacy and isinstance(protection, dict):
        source = "legacy" if source == "none" else "ruleset+legacy"
        allow_deletions = (protection.get("allow_deletions") or {}).get("enabled")
        allow_force = (protection.get("allow_force_pushes") or {}).get("enabled")
        linear = (protection.get("required_linear_history") or {}).get("enabled")
        sig = protection.get("required_signatures") or {}
        sig_enabled = bool(sig.get("enabled"))
        enforce_admins = (protection.get("enforce_admins") or {}).get("enabled")
        contexts = (protection.get("required_status_checks") or {}).get("contexts") or []
        reviews = protection.get("required_pull_request_reviews") or {}
        if observed["deletion"] is None:
            observed["deletion"] = allow_deletions is False
        if observed["non_fast_forward"] is None:
            observed["non_fast_forward"] = allow_force is False
        if observed["linear_history"] is None:
            observed["linear_history"] = bool(linear)
        if observed["signatures"] is None:
            observed["signatures"] = {
                "enabled": sig_enabled,
                "bypassable": sig_enabled and enforce_admins is False,
            }
        elif isinstance(observed["signatures"], dict) and sig_enabled:
            # Prefer the more cautionary bypassable signal when both exist.
            observed["signatures"] = {
                "enabled": True,
                "bypassable": bool(observed["signatures"].get("bypassable"))
                or (enforce_admins is False),
            }
        if observed["required_contexts"] is None:
            observed["required_contexts"] = list(contexts)
        if observed["approvals"] is None and isinstance(reviews, dict):
            observed["approvals"] = reviews.get("required_approving_review_count")
            observed["code_owner_review"] = reviews.get("require_code_owner_reviews")
        if observed["bypass"] is None:
            observed["bypass"] = enforce_admins is False

    if source == "none" and not (rulesets_blocked and protection_blocked):
        # Successfully observed that neither rulesets nor legacy protection enforce.
        if observed["deletion"] is None:
            observed["deletion"] = False
        if observed["non_fast_forward"] is None:
            observed["non_fast_forward"] = False

    if not actions_blocked and isinstance(actions_permissions, dict):
        observed["token_default"] = actions_permissions.get("default_workflow_permissions")
        observed["allowed_actions"] = actions_permissions.get("allowed_actions")
    else:
        observed["token_default"] = None
        observed["allowed_actions"] = None
        if actions_blocked or actions_permissions is None:
            reasons.append(
                (meta.get("actions_permissions") or {}).get("error")
                or "actions_permissions missing"
            )

    return {
        "unknown": False,
        "reason": "; ".join(dict.fromkeys(reasons)) if reasons else None,
        "redundancy": bool(has_ruleset and has_legacy),
        "controls": observed,
        "source": source,
    }


def _desired_for_floor(floor: str) -> dict[str, object]:
    if floor == "hub":
        return {
            "deletion": True,
            "non_fast_forward": True,
            "linear_history": True,
            "signatures": {"enabled": True, "bypassable": False},
            "required_contexts": "nonempty",
            "approvals": 0,
            "code_owner_review": False,
            "merge_methods": ["squash"],
            "bypass": False,
            "token_default": "read",
            "allowed_actions": "not_all",
        }
    if floor == "minimum":
        return {
            "deletion": True,
            "non_fast_forward": True,
            "linear_history": None,  # optional
            "signatures": None,  # Q4: not required
            "required_contexts": None,
            "approvals": None,
            "code_owner_review": None,
            "merge_methods": None,
            "bypass": None,
            "token_default": "read",
            "allowed_actions": "not_all",
        }
    if floor == "frozen":
        return {
            "deletion": True,
            "non_fast_forward": True,
            "linear_history": None,
            "signatures": None,
            "required_contexts": [],  # no required checks
            "approvals": None,
            "code_owner_review": None,
            "merge_methods": None,
            "bypass": None,
            "token_default": None,
            "allowed_actions": None,
        }
    return {name: None for name in ENFORCEMENT_CONTROLS}


def classify_enforcement(desired: dict, observed: dict) -> dict[str, str]:
    """Classify each control as match | mismatch | exception | unknown.

    A sync exemption never yields ``exception`` on a platform control.
    """
    if observed.get("unknown"):
        reason = observed.get("reason") or "observation unknown"
        return {name: "unknown" for name in ENFORCEMENT_CONTROLS} | {"_reason": reason}

    controls = observed.get("controls") or {}
    result: dict[str, str] = {}
    for name in ENFORCEMENT_CONTROLS:
        want = desired.get(name)
        got = controls.get(name)
        if want is None:
            result[name] = "match"  # no floor obligation
            continue
        if got is None:
            result[name] = "unknown"
            continue
        if name == "required_contexts":
            if want == "nonempty":
                result[name] = "match" if isinstance(got, list) and len(got) > 0 else "mismatch"
            elif want == []:
                # frozen: no required checks obligation -> match when empty or absent obligation
                result[name] = "match" if got == [] or got is None else "match"
            else:
                result[name] = "match" if got == want else "mismatch"
            continue
        if name == "signatures":
            if not isinstance(want, dict) or not isinstance(got, dict):
                result[name] = "unknown"
                continue
            if want.get("enabled") and not got.get("enabled"):
                result[name] = "mismatch"
            elif want.get("enabled") and got.get("bypassable") and want.get("bypassable") is False:
                result[name] = "mismatch"
            else:
                result[name] = "match"
            continue
        if name == "allowed_actions":
            if want == "not_all":
                result[name] = "match" if got not in {None, "all"} else (
                    "unknown" if got is None else "mismatch"
                )
            else:
                result[name] = "match" if got == want else "mismatch"
            continue
        if name == "merge_methods":
            result[name] = "match" if got == want else "mismatch"
            continue
        result[name] = "match" if got == want else "mismatch"
    return result


def compare_repo_enforcement(record: dict, fixture: dict) -> dict:
    """Full per-repo comparison used by tests and ``--live``."""
    floor = derive_floor(record)
    observed = normalize_observed(
        fixture.get("rulesets"),
        fixture.get("protection"),
        fixture.get("actions_permissions"),
        meta={
            **(fixture.get("meta") or {}),
            "ruleset_details": fixture.get("ruleset_details") or [],
        },
    )
    if floor in {"out_of_scope", "unknown"}:
        classification = {name: "unknown" for name in ENFORCEMENT_CONTROLS}
        if floor == "out_of_scope":
            classification["_reason"] = "owner out of scope"
        else:
            classification["_reason"] = "desired floor unknown"
    elif floor == "none":
        classification = {name: "match" for name in ENFORCEMENT_CONTROLS}
        classification["_reason"] = "archived: observed only"
    else:
        classification = classify_enforcement(_desired_for_floor(floor), observed)
    return {
        "floor": floor,
        "classification": classification,
        "redundancy": observed.get("redundancy"),
        "source": observed.get("source"),
        "unknown_reason": observed.get("reason") or classification.get("_reason"),
    }


def _parse_gh_http_status(stderr: str, stdout: str) -> int | None:
    match = re.search(r"\(HTTP (\d{3})\)", stderr or "")
    if match:
        return int(match.group(1))
    text = (stdout or "").strip()
    if not text:
        return None
    try:
        body = json.loads(text)
    except json.JSONDecodeError:
        return None
    if isinstance(body, dict) and body.get("status") is not None:
        try:
            return int(body["status"])
        except (TypeError, ValueError):
            return None
    return None


def _gh_api(
    endpoint: str, *, gh_bin: str = "gh", paginate: bool = False
) -> tuple[Any, dict[str, Any]]:
    """Run ``gh api <endpoint>`` and return ``(payload, meta_channel)``.

    Network stays out of pytest: tests monkeypatch this helper.
    Pass ``paginate=True`` for list endpoints that may span pages.
    """
    argv = [gh_bin, "api"]
    if paginate:
        argv.append("--paginate")
    argv.append(endpoint)
    try:
        completed = subprocess.run(
            argv,
            capture_output=True,
            text=True,
            check=False,
            timeout=120,
        )
    except FileNotFoundError:
        return None, {
            "rc": None,
            "http_status": None,
            "error": f"{gh_bin} executable not found",
        }
    except subprocess.TimeoutExpired:
        return None, {
            "rc": None,
            "http_status": None,
            "error": f"gh api timed out: {endpoint}",
        }

    stdout = completed.stdout or ""
    stderr = completed.stderr or ""
    http_status = _parse_gh_http_status(stderr, stdout)
    payload: Any = None
    if stdout.strip():
        try:
            payload = json.loads(stdout)
        except json.JSONDecodeError:
            payload = None

    if completed.returncode == 0:
        return payload, {"rc": 0, "http_status": None, "error": None}

    error = stderr.strip() or stdout.strip() or f"gh api failed rc={completed.returncode}"
    if http_status is None and isinstance(payload, dict) and payload.get("status") is not None:
        try:
            http_status = int(payload["status"])
        except (TypeError, ValueError):
            pass
    return payload, {
        "rc": completed.returncode,
        "http_status": http_status,
        "error": error,
    }


def _merge_actions_permissions(
    perms_payload: Any,
    perms_meta: dict[str, Any],
    workflow_payload: Any,
    workflow_meta: dict[str, Any],
) -> tuple[Any, dict[str, Any]]:
    """Combine actions/permissions + workflow endpoints into one fixture field."""
    merged: dict[str, Any] = {}
    if perms_meta.get("rc") == 0 and isinstance(perms_payload, dict):
        merged.update(perms_payload)
    if workflow_meta.get("rc") == 0 and isinstance(workflow_payload, dict):
        merged.update(workflow_payload)
    if merged:
        return merged, {"rc": 0, "http_status": None, "error": None}

    # Prefer an HTTP error body when present (403/404 fixtures).
    for payload, meta in ((perms_payload, perms_meta), (workflow_payload, workflow_meta)):
        if meta.get("error") or meta.get("rc") not in (None, 0):
            return payload, {
                "rc": meta.get("rc"),
                "http_status": meta.get("http_status"),
                "error": meta.get("error"),
            }
    return None, {
        "rc": None,
        "http_status": None,
        "error": "actions_permissions not fetched",
    }


def fetch_repo_enforcement(owner_repo: str) -> dict:
    """Fetch live rulesets, protection, and actions permissions for one repo.

    Returns a fixture-shaped payload consumed by ``compare_repo_enforcement``.
    """
    owner_repo = str(owner_repo or "").strip()
    if not owner_repo or "/" not in owner_repo:
        raise ValueError(f"owner_repo must be 'owner/name', got {owner_repo!r}")

    rulesets_payload, rulesets_meta = _gh_api(
        f"repos/{owner_repo}/rulesets", paginate=True
    )
    details: list[dict] = []
    listed_ids: list[object] = []
    detail_errors: list[str] = []
    if isinstance(rulesets_payload, list):
        for item in rulesets_payload:
            if not isinstance(item, dict) or item.get("id") is None:
                continue
            listed_ids.append(item["id"])
            detail, detail_meta = _gh_api(f"repos/{owner_repo}/rulesets/{item['id']}")
            if detail_meta.get("rc") == 0 and isinstance(detail, dict):
                details.append(detail)
            else:
                detail_errors.append(
                    str(detail_meta.get("error") or f"ruleset {item['id']} detail failed")
                )
        # Any failed detail fetch is incomplete: partial rule bodies misclassify.
        if listed_ids and len(details) < len(listed_ids):
            rulesets_payload = None
            rulesets_meta = {
                "rc": 1,
                "http_status": None,
                "incomplete": True,
                "error": (
                    f"ruleset details incomplete: {len(details)}/{len(listed_ids)} fetched"
                    + (f" ({detail_errors[0]})" if detail_errors else "")
                ),
            }
            details = []

    repo_payload, repo_meta = _gh_api(f"repos/{owner_repo}")
    if (
        repo_meta.get("rc") == 0
        and isinstance(repo_payload, dict)
        and repo_payload.get("default_branch")
    ):
        branch = str(repo_payload["default_branch"])
        protection_payload, protection_meta = _gh_api(
            f"repos/{owner_repo}/branches/{branch}/protection"
        )
    else:
        # Do not invent "main": unknown default branch means protection is inaccessible.
        protection_payload = None
        protection_meta = {
            "rc": repo_meta.get("rc") if repo_meta.get("rc") not in (None, 0) else 1,
            "http_status": repo_meta.get("http_status"),
            "error": repo_meta.get("error")
            or "repository metadata unavailable; default branch unknown",
        }

    perms_payload, perms_meta = _gh_api(f"repos/{owner_repo}/actions/permissions")
    workflow_payload, workflow_meta = _gh_api(
        f"repos/{owner_repo}/actions/permissions/workflow"
    )
    actions_permissions, actions_meta = _merge_actions_permissions(
        perms_payload, perms_meta, workflow_payload, workflow_meta
    )

    return {
        "repo": owner_repo,
        "rulesets": rulesets_payload,
        "ruleset_details": details,
        "protection": protection_payload,
        "actions_permissions": actions_permissions,
        "meta": {
            "rulesets": rulesets_meta,
            "protection": protection_meta,
            "actions_permissions": actions_meta,
        },
    }


def _owner_repo_for(record: dict) -> str:
    explicit = str(record.get("repo") or "").strip()
    if explicit and "/" in explicit:
        return explicit
    owner = str(record.get("owner") or "alawein").strip() or "alawein"
    slug = str(record.get("slug") or "").strip()
    if not slug:
        raise ValueError(f"catalog record missing repo/slug: {record!r}")
    return f"{owner}/{slug}"


def _observation_succeeded(fixture: dict, result: dict) -> bool:
    """True when at least one enforcement channel was contacted successfully."""
    if result.get("classification") is None:
        return False
    meta = fixture.get("meta") or {}
    rulesets_meta = meta.get("rulesets") or {}
    # Incomplete detail fetch is not a successful observation (avoids false negatives).
    if rulesets_meta.get("incomplete"):
        return False
    for kind in ("rulesets", "protection", "actions_permissions"):
        channel = meta.get(kind) or {}
        if channel.get("rc") == 0:
            return True
        # 403/404 still counts as a successful observation of inaccessibility.
        if channel.get("http_status") in {403, 404}:
            return True
        payload = fixture.get(kind)
        if _is_http_error_payload(payload):
            return True
    return False


def _snapshot_row(
    *,
    slug: object,
    repo: object | None,
    floor: object,
    classification: object,
    redundancy: object,
    source: object = None,
    unknown_reason: object = None,
) -> dict[str, Any]:
    """Uniform per-repo snapshot row (same keys on every branch)."""
    return {
        "slug": slug,
        "repo": repo,
        "floor": floor,
        "classification": classification,
        "redundancy": redundancy,
        "source": source,
        "unknown_reason": unknown_reason,
    }


def run_live_snapshot(repos: list[dict], out: Path) -> dict:
    """Fetch live enforcement, classify, and write snapshot JSON.

    Fails closed with ``SystemExit`` when zero repos are observed successfully.
    Writes ``out`` only after at least one successful observation.
    """
    snapshot: dict[str, Any] = {
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "scope": "catalog/repos.json",
        "repos": [],
        "note": "--live writes derived evidence only; it is not a required check.",
    }
    success_count = 0
    for item in repos:
        if not isinstance(item, dict):
            continue
        try:
            owner_repo = _owner_repo_for(item)
        except ValueError as exc:
            snapshot["repos"].append(
                _snapshot_row(
                    slug=item.get("slug"),
                    repo=None,
                    floor=derive_floor(item),
                    classification=None,
                    redundancy=None,
                    unknown_reason=str(exc),
                )
            )
            continue
        try:
            fixture = fetch_repo_enforcement(owner_repo)
            result = compare_repo_enforcement(item, fixture)
            row = _snapshot_row(
                slug=item.get("slug"),
                repo=owner_repo,
                floor=result["floor"],
                classification=result["classification"],
                redundancy=result["redundancy"],
                source=result.get("source"),
                unknown_reason=result.get("unknown_reason"),
            )
            snapshot["repos"].append(row)
            if _observation_succeeded(fixture, result):
                success_count += 1
        except (OSError, ValueError, subprocess.SubprocessError, RuntimeError) as exc:
            snapshot["repos"].append(
                _snapshot_row(
                    slug=item.get("slug"),
                    repo=owner_repo,
                    floor=derive_floor(item),
                    classification=None,
                    redundancy=None,
                    unknown_reason=f"live fetch failed: {exc}",
                )
            )

    if success_count == 0:
        raise SystemExit(
            "ERROR: --live observed zero repos successfully; fail closed"
        )
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    return snapshot


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit GitHub baseline coverage.")
    parser.add_argument(
        "--local",
        action="store_true",
        help="Skip per-repo checks that require sibling repos on disk (for CI use).",
    )
    parser.add_argument(
        "--live",
        action="store_true",
        help="Fetch live enforcement observations and write a derived snapshot (never a required check).",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "catalog" / "generated" / "enforcement-snapshot.json",
        help="Output path for --live snapshot JSON.",
    )
    args = parser.parse_args()

    if args.live:
        # Live network path is intentionally separate from required CI checks.
        catalog_path = ROOT / "catalog" / "repos.json"
        catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
        repos = catalog.get("repos") or []
        try:
            snapshot = run_live_snapshot(repos, args.out)
        except SystemExit as exc:
            message = str(exc) if exc.code is None or isinstance(exc.code, str) else None
            if message:
                print(message, file=sys.stderr)
            code = exc.code if isinstance(exc.code, int) else 1
            if code == 0:
                code = 1
            return code
        print(
            f"Wrote enforcement snapshot ({len(snapshot.get('repos') or [])} repos) to {args.out}"
        )
        return 0

    errors: list[str] = []
    check_manifest(errors)
    check_sync_manual_entries(errors)
    check_control_plane_workflows(errors)
    if not args.local:
        # check_readme audits ROOT/README.md (the control-plane org profile page).
        # Skipped in --local mode because the org profile README has design latitude
        # (capsule-render is exempted via CONTROL_PLANE_README_EXEMPT for full runs).
        check_readme(errors)
        for entry in REPOS:
            check_repo(entry, errors)

    if errors:
        print("GitHub baseline audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    if args.local:
        print("GitHub baseline audit passed (control-plane only; --local skips repo checks).")
    else:
        managed = [
            entry["repo"] for entry in REPOS if _sync_manual.is_write_eligible(entry)
        ]
        print(f"GitHub baseline audit passed for {len(managed)} managed repos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
