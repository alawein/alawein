from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "doctrine" / "commit_lint.py"
_spec = importlib.util.spec_from_file_location("commit_lint", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["commit_lint"] = _mod
_spec.loader.exec_module(_mod)
cl = _mod


def test_valid_subject_passes() -> None:
    assert cl.lint_subject("feat(catalog): add commit_mode field") == []


def test_unknown_type_fails() -> None:
    assert cl.lint_subject("widget(catalog): do a thing")


def test_missing_colon_fails() -> None:
    assert cl.lint_subject("feat add a thing")


def test_em_dash_fails() -> None:
    assert cl.lint_subject("feat(x): tidy the thing " + chr(0x2014) + " and another")


def test_too_long_fails() -> None:
    assert cl.lint_subject("feat(x): " + "a" * 80)


def test_trailing_period_fails() -> None:
    assert cl.lint_subject("feat(x): add a thing.")


def test_ai_attribution_in_body_fails() -> None:
    msg = "feat(x): add a thing\n\nCo-Authored-By: Claude <noreply@anthropic.com>"
    assert cl.lint_message(msg)
