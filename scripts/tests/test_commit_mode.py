from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "catalog" / "commit_mode.py"
_spec = importlib.util.spec_from_file_location("commit_mode", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["commit_mode"] = _mod
_spec.loader.exec_module(_mod)
cm = _mod

VALID = {"full", "guardrailed", "local"}


def test_absent_defaults_to_full() -> None:
    assert cm.commit_mode({"slug": "x"}) == "full"


def test_explicit_mode_is_returned() -> None:
    assert cm.commit_mode({"slug": "x", "commit_mode": "guardrailed"}) == "guardrailed"


def test_invalid_mode_raises() -> None:
    with pytest.raises(ValueError):
        cm.commit_mode({"slug": "x", "commit_mode": "yolo"})


def test_valid_modes_constant() -> None:
    assert cm.VALID_MODES == VALID
