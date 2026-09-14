"""Hub workflow permission hygiene for the GitHub Baseline Audit gate."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "github" / "github-baseline-audit.py"

_spec = importlib.util.spec_from_file_location("github_baseline_audit", SCRIPT)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod


def test_every_hub_workflow_declares_top_level_permissions() -> None:
    errors: list[str] = []
    audit.check_hub_workflow_permissions(errors)
    missing = [e for e in errors if "missing top-level permissions" in e]
    assert missing == [], "\n".join(missing)


def test_write_jobs_declare_job_level_write_permissions() -> None:
    errors: list[str] = []
    audit.check_hub_workflow_permissions(errors)
    writers = [e for e in errors if "performs a write" in e]
    assert writers == [], "\n".join(writers)


def test_audit_local_path_includes_permission_hygiene() -> None:
    """Required context 'GitHub Baseline Audit' runs --local and must call the check."""
    source = SCRIPT.read_text(encoding="utf-8")
    assert "check_hub_workflow_permissions" in source
    assert "check_control_plane_workflows(errors)" in source
