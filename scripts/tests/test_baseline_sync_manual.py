"""C6: sync:manual loader / no-auto-enrollment fixtures (W1-C6)."""

from __future__ import annotations

import importlib.util
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GITHUB_DIR = ROOT / "scripts" / "github"
AUDIT_SCRIPT = GITHUB_DIR / "github-baseline-audit.py"
SYNC_MANUAL = GITHUB_DIR / "_sync_manual.py"

sys.path.insert(0, str(GITHUB_DIR))
import _sync_manual as sm  # noqa: E402

_spec = importlib.util.spec_from_file_location("github_baseline_audit", AUDIT_SCRIPT)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod

TODAY = date(2026, 9, 14)

DEBT_ANCHOR = """
### design-system sync: manual open-ended
- **Date:** 2026-09-14
- **Where:** github-baseline.yaml `design-system` manual_until: null
- **What:** Native-binding shim; keep sync:manual until template models the install line.
- **Owner:** alawein
"""


def _entry(repo: str = "demo", **kwargs):
    row = {"repo": repo, "sync": "manual"}
    row.update(kwargs)
    return row


def test_auto_is_write_eligible() -> None:
    status = sm.classify_sync_entry({"repo": "bolts", "sync": "auto"}, today=TODAY)
    assert status.kind == "auto"
    assert status.write_eligible is True
    assert sm.is_write_eligible({"repo": "bolts", "sync": "auto"}) is True


def test_legacy_manual_not_write_eligible_and_not_blocking() -> None:
    status = sm.classify_sync_entry(_entry("alawein"), today=TODAY)
    assert status.kind == "legacy"
    assert status.write_eligible is False
    assert status.errors == []
    assert status.findings
    msgs = sm.validate_manifest_sync_manual([_entry("alawein")], today=TODAY)
    assert msgs == []


def test_active_manual_schema_ok_not_write_eligible() -> None:
    entry = _entry(
        "alembiq",
        manual_reason="extra website-app CI job",
        manual_until="2026-12-01",
    )
    status = sm.classify_sync_entry(entry, today=TODAY)
    assert status.kind == "active"
    assert status.write_eligible is False
    assert status.errors == []
    assert sm.auto_enroll_candidates([entry], today=TODAY) == []


def test_expired_is_finding_only_never_auto_enrolled() -> None:
    entry = _entry(
        "scicomp",
        manual_reason="pytest collection blocked",
        manual_until="2026-08-01",
    )
    status = sm.classify_sync_entry(entry, today=TODAY)
    assert status.kind == "expired"
    assert status.write_eligible is False
    assert status.errors
    assert "still not write-eligible" in status.errors[0]
    # Critical C6 invariant: expiry must not flip write eligibility.
    assert sm.is_write_eligible(entry) is False
    assert sm.auto_enroll_candidates([entry, {"repo": "adil", "sync": "auto"}], today=TODAY) == [
        "adil"
    ]


def test_malformed_missing_reason() -> None:
    entry = _entry("provegate", manual_until="2026-12-01")
    status = sm.classify_sync_entry(entry, today=TODAY)
    assert status.kind == "malformed"
    assert status.write_eligible is False
    assert any("manual_reason" in e for e in status.errors)


def test_malformed_bad_until_type() -> None:
    entry = _entry("helios", manual_reason="docs archive", manual_until=123)
    status = sm.classify_sync_entry(entry, today=TODAY)
    assert status.kind == "malformed"
    assert any("manual_until" in e for e in status.errors)


def test_open_ended_null_requires_debt_anchor() -> None:
    entry = _entry(
        "design-system",
        manual_reason="native binding shim",
        manual_until=None,
    )
    bare = sm.classify_sync_entry(entry, today=TODAY, debt_text="")
    assert bare.kind == "malformed"
    assert any("DEBT.md anchor" in e for e in bare.errors)

    ok = sm.classify_sync_entry(entry, today=TODAY, debt_text=DEBT_ANCHOR)
    assert ok.kind == "open_ended"
    assert ok.write_eligible is False
    assert ok.errors == []


def test_live_manifest_manual_repos_stay_unenrolled() -> None:
    """Live github-baseline.yaml: all sync:manual repos are legacy and skipped."""
    import yaml

    data = yaml.safe_load((ROOT / "github-baseline.yaml").read_text(encoding="utf-8")) or {}
    entries = data.get("repos") or []
    manual = [e for e in entries if e.get("sync") == "manual"]
    assert len(manual) >= 12
    enrolled = sm.auto_enroll_candidates(entries, today=TODAY)
    for entry in manual:
        assert entry["repo"] not in enrolled
        status = sm.classify_sync_entry(entry, today=TODAY)
        assert status.write_eligible is False
        assert status.kind == "legacy"


def test_audit_hook_reports_expired_and_skips_legacy() -> None:
    errors: list[str] = []
    entries = [
        _entry("legacy-repo"),
        _entry(
            "expired-repo",
            manual_reason="temporary",
            manual_until="2026-01-01",
        ),
        {"repo": "ok-auto", "sync": "auto"},
    ]
    audit.check_sync_manual_entries(
        errors,
        entries=entries,
        today=TODAY,
        debt_text="",
    )
    assert any("expired-repo" in e for e in errors)
    assert not any("legacy-repo" in e for e in errors)


def test_audit_local_path_includes_sync_manual_check() -> None:
    source = AUDIT_SCRIPT.read_text(encoding="utf-8")
    assert "check_sync_manual_entries" in source
    assert "_sync_manual" in source or "sync_manual" in source


def test_module_file_exists() -> None:
    assert SYNC_MANUAL.is_file()
