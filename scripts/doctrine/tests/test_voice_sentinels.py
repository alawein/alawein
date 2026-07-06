"""Tests for voice-check ignore sentinels and register coverage in validate.py.

Docs that legitimately quote the banned register wrap the quoted block in
`<!-- voice-check:ignore-start -->` / `<!-- voice-check:ignore-end -->`.
Covers the cases named in
docs/internal/issues/2026-05-11-voice-check-ignore-sentinels.md: ignored
regions skip matches, an unterminated start warns, sentinels inside code
fences do not toggle, and nesting is not supported.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import validate  # noqa: E402


def _run_voice(path: Path) -> validate.Report:
    report = validate.Report()
    validate.run_checks([path.resolve()], {"voice"}, report)
    return report


def _rule(report: validate.Report, rule: str):
    return [v for v in report.violations if v.rule == rule]


def test_banned_word_inside_sentinels_is_skipped(tmp_path):
    doc = tmp_path / "docs" / "note.md"
    doc.parent.mkdir(parents=True)
    doc.write_text(
        "# Note\n\n"
        "<!-- voice-check:ignore-start -->\n"
        "Banned words quoted here: comprehensive, robust, leverage.\n"
        "<!-- voice-check:ignore-end -->\n\n"
        "Plain prose after the block.\n",
        encoding="utf-8",
    )
    report = _run_voice(doc)
    assert not _rule(report, "forbidden-register")
    assert not _rule(report, "ignore-sentinel")


def test_banned_word_outside_sentinels_still_flags(tmp_path):
    doc = tmp_path / "docs" / "note.md"
    doc.parent.mkdir(parents=True)
    doc.write_text(
        "<!-- voice-check:ignore-start -->\n"
        "comprehensive\n"
        "<!-- voice-check:ignore-end -->\n"
        "This robust sentence is a real violation.\n",
        encoding="utf-8",
    )
    report = _run_voice(doc)
    hits = _rule(report, "forbidden-register")
    assert len(hits) == 1
    assert hits[0].line == 4


def test_unterminated_start_warns_advisory(tmp_path):
    doc = tmp_path / "docs" / "note.md"
    doc.parent.mkdir(parents=True)
    doc.write_text(
        "# Note\n\n<!-- voice-check:ignore-start -->\ncomprehensive\n",
        encoding="utf-8",
    )
    report = _run_voice(doc)
    warnings = _rule(report, "ignore-sentinel")
    assert len(warnings) == 1
    assert warnings[0].tier == "advisory"
    assert warnings[0].line == 3
    # The open region still suppresses matches up to EOF.
    assert not _rule(report, "forbidden-register")


def test_sentinel_inside_code_fence_does_not_toggle(tmp_path):
    doc = tmp_path / "docs" / "note.md"
    doc.parent.mkdir(parents=True)
    doc.write_text(
        "```\n<!-- voice-check:ignore-start -->\n```\n"
        "A comprehensive sentence outside any real ignore region.\n",
        encoding="utf-8",
    )
    report = _run_voice(doc)
    assert len(_rule(report, "forbidden-register")) == 1
    assert not _rule(report, "ignore-sentinel")


def test_nested_sentinels_not_supported(tmp_path):
    # A second start inside a region is inert; the first end closes it.
    doc = tmp_path / "docs" / "note.md"
    doc.parent.mkdir(parents=True)
    doc.write_text(
        "<!-- voice-check:ignore-start -->\n"
        "<!-- voice-check:ignore-start -->\n"
        "comprehensive\n"
        "<!-- voice-check:ignore-end -->\n"
        "This seamless line is a real violation.\n",
        encoding="utf-8",
    )
    report = _run_voice(doc)
    hits = _rule(report, "forbidden-register")
    assert len(hits) == 1
    assert hits[0].line == 5


def test_register_covers_voice_md_additions(tmp_path):
    doc = tmp_path / "docs" / "note.md"
    doc.parent.mkdir(parents=True)
    doc.write_text(
        "comprehensive\nrobust\nleverage\nstreamlined\nseamless\n"
        "moreover\nfurthermore\npowerful\nthat being said\ndelve\n",
        encoding="utf-8",
    )
    report = _run_voice(doc)
    assert len(_rule(report, "forbidden-register")) == 10


def test_collector_scans_governance_and_skips_exempt(tmp_path):
    (tmp_path / "docs" / "governance").mkdir(parents=True)
    (tmp_path / "docs" / "internal").mkdir(parents=True)
    (tmp_path / "claude-agent-platform").mkdir()
    governed = tmp_path / "docs" / "governance" / "canon.md"
    governed.write_text("# Canon\n", encoding="utf-8")
    root_doc = tmp_path / "LESSONS.md"
    root_doc.write_text("# Lessons\n", encoding="utf-8")
    exempt_internal = tmp_path / "docs" / "internal" / "plan.md"
    exempt_internal.write_text("# Plan\n", encoding="utf-8")
    exempt_platform = tmp_path / "claude-agent-platform" / "AGENTS.md"
    exempt_platform.write_text("# Vendored\n", encoding="utf-8")

    collected = {p.name for p in validate.collect_paths(tmp_path)}
    assert "canon.md" in collected
    assert "LESSONS.md" in collected
    assert "plan.md" not in collected
    assert "AGENTS.md" not in collected


def test_nested_blocking_filenames_are_advisory_with_root(tmp_path):
    # With a root, only the root README/CLAUDE/AGENTS, docs/README, and
    # prompt-kits/ block; nested copies of those filenames are advisory.
    (tmp_path / "packages" / "pkg").mkdir(parents=True)
    nested = tmp_path / "packages" / "pkg" / "README.md"
    nested.write_text("A comprehensive package.\n", encoding="utf-8")
    top = tmp_path / "README.md"
    top.write_text("A comprehensive repo.\n", encoding="utf-8")

    report = validate.Report()
    validate.run_checks([top.resolve(), nested.resolve()], {"voice"}, report, root=tmp_path.resolve())
    tiers = {v.path.name: v.tier for v in report.violations}
    blocking_paths = {v.path for v in report.blocking}
    assert top.resolve() in blocking_paths
    assert all(p == top.resolve() for p in blocking_paths)
    assert len(report.advisory) == 1
