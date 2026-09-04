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


def test_validate_local_paths_rejects_absolute_path(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("ALAWEIN_WORKSPACE_ROOT", str(tmp_path))
    # Build a path that is absolute on whichever platform the test runs on
    # (a bare "/etc/passwd" literal is not absolute per Windows pathlib).
    absolute = str((tmp_path / "elsewhere" / "passwd").resolve())

    errors = validator.validate_local_paths(
        [{"slug": "evil", "local_path": absolute}]
    )
    assert len(errors) == 1
    assert "evil" in errors[0]


def test_validate_local_paths_rejects_traversal_outside_workspace(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("ALAWEIN_WORKSPACE_ROOT", str(tmp_path))
    (tmp_path / "workspace").mkdir()
    outside = tmp_path / "outside"
    outside.mkdir()

    errors = validator.validate_local_paths(
        [{"slug": "evil", "local_path": "../outside"}]
    )
    assert len(errors) == 1
    assert "escapes the workspace root" in errors[0]
