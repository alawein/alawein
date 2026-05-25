"""Tests for the em-dash blocking rule in validate.py (the governed-surface
style validator).

Policy D1: em-dashes (U+2014) are prohibited on governed surfaces. The rule is
BLOCKING on Blocking surfaces (README.md, CLAUDE.md, AGENTS.md, docs/README.md,
prompt-kits/*.md) and ADVISORY elsewhere. Fenced code blocks are exempt so that
quoted examples and shell snippets do not trip the gate.

Tests assert against the structured `Report.violations` (rule + tier + path),
not just process exit, so a failure attributes to the right surface and tier.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import validate  # noqa: E402


EM_DASH = "—"


def _run_emdash(path: Path) -> validate.Report:
    """Run only the emdash check over a single concrete file path."""
    report = validate.Report()
    validate.run_checks([path.resolve()], {"emdash"}, report)
    return report


def _emdash_violations(report: validate.Report):
    return [v for v in report.violations if v.rule == "em-dash"]


def test_emdash_on_blocking_surface_fails(tmp_path):
    # A CLAUDE.md anywhere is a Blocking surface; an em-dash must block.
    surface = tmp_path / "CLAUDE.md"
    surface.write_text(
        f"# Title\n\nThis clause is wrong {EM_DASH} it uses an em-dash.\n",
        encoding="utf-8",
    )
    report = _run_emdash(surface)
    violations = _emdash_violations(report)
    assert violations, "expected an em-dash violation on a Blocking surface"
    assert all(v.tier == "blocking" for v in violations)
    assert report.blocking, "Blocking-surface em-dash must populate report.blocking"


def test_emdash_on_advisory_surface_passes_gate(tmp_path):
    # A non-blocking governed doc (advisory tier) still records the finding but
    # must NOT be blocking, so the gate stays green.
    surface = tmp_path / "docs" / "notes.md"
    surface.parent.mkdir(parents=True, exist_ok=True)
    surface.write_text(
        f"# Notes\n\nAn advisory clause {EM_DASH} not gating.\n",
        encoding="utf-8",
    )
    report = _run_emdash(surface)
    violations = _emdash_violations(report)
    assert violations, "expected the finding to be recorded as advisory"
    assert all(v.tier == "advisory" for v in violations)
    assert not report.blocking, "advisory-surface em-dash must not block the gate"


def test_clean_blocking_surface_has_no_emdash_violation(tmp_path):
    surface = tmp_path / "AGENTS.md"
    surface.write_text(
        "# Title\n\nThis clause is clean: it uses a colon and commas.\n",
        encoding="utf-8",
    )
    report = _run_emdash(surface)
    assert not _emdash_violations(report)


def test_emdash_inside_fenced_code_block_is_exempt(tmp_path):
    # Quoted examples and shell snippets inside fences must not trip the rule.
    surface = tmp_path / "README.md"
    surface.write_text(
        "# Title\n\n```text\nbad example {dash} inside a fence\n```\n".replace(
            "{dash}", EM_DASH
        ),
        encoding="utf-8",
    )
    report = _run_emdash(surface)
    assert not _emdash_violations(report), "fenced em-dash should be exempt"


def test_prompt_kit_markdown_is_blocking(tmp_path):
    surface = tmp_path / "prompt-kits" / "AGENT.md"
    surface.parent.mkdir(parents=True, exist_ok=True)
    surface.write_text(
        f"# Kit\n\nThe owner is here {EM_DASH} PhD EECS.\n",
        encoding="utf-8",
    )
    report = _run_emdash(surface)
    violations = _emdash_violations(report)
    assert violations
    assert all(v.tier == "blocking" for v in violations)
