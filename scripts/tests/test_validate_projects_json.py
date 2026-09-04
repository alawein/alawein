"""Tests for projects.json local-path validation."""

from __future__ import annotations

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "catalog" / "validate-projects-json.py"

_spec = importlib.util.spec_from_file_location("validate_projects_json", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_mod)
validator = _mod


def test_validate_local_paths_uses_configured_workspace_root(tmp_path, monkeypatch) -> None:
    (tmp_path / "lab" / "example").mkdir(parents=True)
    monkeypatch.setenv("ALAWEIN_WORKSPACE_ROOT", str(tmp_path))

    assert validator.validate_local_paths(
        [{"slug": "example", "local_path": "lab/example"}]
    ) == []
