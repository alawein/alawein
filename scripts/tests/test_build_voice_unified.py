from __future__ import annotations

import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
OPS_DIR = SCRIPTS_DIR / "ops"
for d in (str(SCRIPTS_DIR), str(OPS_DIR)):
    if d not in sys.path:
        sys.path.insert(0, d)

import build_voice_unified  # noqa: E402
from build_voice_unified import (  # noqa: E402
    _process_block,
    assemble,
    demote_headers,
    drop_leading_h1,
    main,
    strip_frontmatter,
)

FIXTURES = Path(__file__).parent / "fixtures" / "voice_unified"


class StripFrontmatterTests(unittest.TestCase):
    def test_strips_well_formed_frontmatter(self):
        text = "---\ntype: canonical\n---\n\n# Heading\n\nBody.\n"
        self.assertEqual(strip_frontmatter(text), "# Heading\n\nBody.\n")

    def test_no_frontmatter_returns_unchanged(self):
        text = "# Heading\n\nBody.\n"
        self.assertEqual(strip_frontmatter(text), text)

    def test_unterminated_frontmatter_raises(self):
        text = "---\ntype: canonical\n\n# Heading\n"
        with self.assertRaisesRegex(ValueError, "unterminated"):
            strip_frontmatter(text)

    def test_empty_body_after_frontmatter(self):
        text = "---\ntype: canonical\n---\n"
        self.assertEqual(strip_frontmatter(text), "")


class DropLeadingH1Tests(unittest.TestCase):
    def test_drops_first_h1_line(self):
        text = "# Block A · Test\n\nBody.\n"
        self.assertEqual(drop_leading_h1(text), "Body.\n")

    def test_preserves_subtitle_after_h1(self):
        text = "# Block A · Test\n\n_Subtitle._\n\n## §1\n"
        self.assertEqual(drop_leading_h1(text), "_Subtitle._\n\n## §1\n")

    def test_no_h1_returns_unchanged(self):
        text = "## §1 First section\n\nBody.\n"
        self.assertEqual(drop_leading_h1(text), text)

    def test_h2_is_not_h1(self):
        text = "## Subsection\n\nBody.\n"
        self.assertEqual(drop_leading_h1(text), text)

    def test_blank_lines_before_h1_skipped(self):
        text = "\n\n# Block A · Test\n\nBody.\n"
        self.assertEqual(drop_leading_h1(text), "Body.\n")

    def test_h1_with_no_following_blank(self):
        text = "# Block A · Test\nBody.\n"
        self.assertEqual(drop_leading_h1(text), "Body.\n")


class DemoteHeadersTests(unittest.TestCase):
    def test_h1_to_h2(self):
        self.assertEqual(demote_headers("# Title\n"), "## Title\n")

    def test_h2_to_h3(self):
        self.assertEqual(demote_headers("## Section\n"), "### Section\n")

    def test_h6_to_h7(self):
        self.assertEqual(demote_headers("###### Six\n"), "####### Six\n")

    def test_only_demotes_at_line_start(self):
        text = "Inline #foo and ## bar should not change.\n"
        self.assertEqual(demote_headers(text), text)

    def test_demotes_multiple_lines(self):
        text = "# H1\n\n## H2\n\n### H3\n"
        expected = "## H1\n\n### H2\n\n#### H3\n"
        self.assertEqual(demote_headers(text), expected)

    def test_preserves_content_after_hashes(self):
        self.assertEqual(demote_headers("## §7 Contribution\n"), "### §7 Contribution\n")

    def test_skips_inside_fenced_code_blocks(self):
        text = (
            "## Heading before fence\n"
            "\n"
            "```python\n"
            "# k-points must be in reduced coordinates\n"
            "## not a heading either\n"
            "```\n"
            "\n"
            "## Heading after fence\n"
        )
        expected = (
            "### Heading before fence\n"
            "\n"
            "```python\n"
            "# k-points must be in reduced coordinates\n"
            "## not a heading either\n"
            "```\n"
            "\n"
            "### Heading after fence\n"
        )
        self.assertEqual(demote_headers(text), expected)

    def test_skips_inside_tilde_fenced_blocks(self):
        text = (
            "## Heading\n"
            "\n"
            "~~~bash\n"
            "# shell comment\n"
            "~~~\n"
            "\n"
            "## After\n"
        )
        expected = (
            "### Heading\n"
            "\n"
            "~~~bash\n"
            "# shell comment\n"
            "~~~\n"
            "\n"
            "### After\n"
        )
        self.assertEqual(demote_headers(text), expected)

    def test_indented_fence_opener_recognized(self):
        text = "  ```python\n# comment\n  ```\n## After\n"
        result = demote_headers(text)
        self.assertIn("# comment\n", result)
        self.assertIn("### After\n", result)

    def test_unbalanced_fence_raises(self):
        text = "## Heading\n\n```python\n# unclosed code\n## not a real header\n"
        with self.assertRaisesRegex(ValueError, "unbalanced"):
            demote_headers(text)


class AssembleTests(unittest.TestCase):
    def test_assembles_two_fixtures_with_block_headers(self):
        blocks = [
            {
                "file": FIXTURES / "source_a.md",
                "title": "Block A · Test Block",
                "subtitle": "_Subtitle line for Block A._",
            },
            {
                "file": FIXTURES / "source_b.md",
                "title": "Block B · Another Test Block",
                "subtitle": None,
            },
        ]
        result = assemble(blocks, today="2026-05-11", last_updated="2026-05-11")

        self.assertIn("---\ntype: generated\n", result)
        self.assertIn("last_updated: 2026-05-11\n", result)
        self.assertIn("# Meshal Alawein — Voice Guide\n", result)
        self.assertIn("<!-- Generated by scripts/ops/build_voice_unified.py", result)

        self.assertIn("## Block A · Test Block\n", result)
        self.assertIn("_Subtitle line for Block A._\n", result)
        self.assertIn("## Block B · Another Test Block\n", result)

        self.assertIn("### §1 First section\n", result)
        self.assertIn("#### Subsection of §1\n", result)
        self.assertIn("### §3 Section three\n", result)

        # Source's leading H1 must be dropped, not just demoted — no line in
        # the output should be exactly the dropped H1 (precise check, not
        # substring-based, so it doesn't conflate H1 level with H2 + content).
        for title in ("Block A · Test Block", "Block B · Another Test Block"):
            self.assertIsNone(
                re.search(rf"^# {re.escape(title)}$", result, re.MULTILINE),
                f"dropped H1 reappears as H1 level: {title}",
            )

    def test_block_header_followed_by_blank_line(self):
        blocks = [
            {
                "file": FIXTURES / "source_b.md",  # no synth subtitle, no source subtitle
                "title": "Block X · No Subtitle",
                "subtitle": None,
            },
        ]
        result = assemble(blocks, today="2026-05-11", last_updated="2026-05-11")
        self.assertIn("## Block X · No Subtitle\n\n", result)

    def test_block_separator_between_blocks(self):
        blocks = [
            {
                "file": FIXTURES / "source_a.md",
                "title": "Block A · Test Block",
                "subtitle": None,
            },
            {
                "file": FIXTURES / "source_b.md",
                "title": "Block B · Another Test Block",
                "subtitle": None,
            },
        ]
        result = assemble(blocks, today="2026-05-11", last_updated="2026-05-11")
        self.assertIn("\n---\n\n## Block B", result)

    def test_idempotent(self):
        blocks = [
            {
                "file": FIXTURES / "source_a.md",
                "title": "Block A · Test Block",
                "subtitle": "_Subtitle line for Block A._",
            },
        ]
        first = assemble(blocks, today="2026-05-11", last_updated="2026-05-11")
        second = assemble(blocks, today="2026-05-11", last_updated="2026-05-11")
        self.assertEqual(first, second)

    def test_frontmatter_well_formed(self):
        blocks = [
            {
                "file": FIXTURES / "source_a.md",
                "title": "Block A · Test Block",
                "subtitle": None,
            },
        ]
        result = assemble(blocks, today="2026-05-11", last_updated="2026-05-11")
        # Frontmatter is exactly one block bounded by --- on its own lines.
        self.assertTrue(result.startswith("---\n"))
        end = result.find("\n---\n", 4)
        self.assertGreater(end, 0, "closing --- not found")
        # Exactly one H1 in the whole output.
        h1_count = len(re.findall(r"^# (?!#)", result, re.MULTILINE))
        self.assertEqual(h1_count, 1, "expected exactly one H1")


class ProcessBlockTests(unittest.TestCase):
    def test_composition_strip_then_drop_then_demote(self):
        # source_a.md has frontmatter, leading H1, ##/### nested headers.
        # Final output: no frontmatter, no leading H1, headers demoted by 1.
        spec = {
            "file": FIXTURES / "source_a.md",
            "title": "anything",
            "subtitle": None,
        }
        result = _process_block(spec)
        self.assertNotIn("---\ntype: canonical", result)
        self.assertNotIn("# Block A · Test Block", result.splitlines())
        self.assertIn("### §1 First section", result)
        self.assertIn("#### Subsection of §1", result)
        self.assertIn("### §2 Second section", result)

    def test_missing_file_raises_runtime_error(self):
        spec = {
            "file": FIXTURES / "does-not-exist.md",
            "title": "x",
            "subtitle": None,
        }
        with self.assertRaisesRegex(RuntimeError, "failed to read"):
            _process_block(spec)


class BlockOrderAndCountTests(unittest.TestCase):
    """Tests that all blocks are emitted in input order and none are silently dropped."""

    _blocks = [
        {
            "file": FIXTURES / "source_a.md",
            "title": "Block A · Test Block",
            "subtitle": "_Subtitle line for Block A._",
        },
        {
            "file": FIXTURES / "source_b.md",
            "title": "Block B · Another Test Block",
            "subtitle": None,
        },
    ]

    def test_blocks_emitted_in_input_order(self):
        result = assemble(self._blocks, today="2026-05-11", last_updated="2026-05-11")
        # "Block A" must appear before "Block B" in the assembled output.
        self.assertLess(
            result.index("Block A"),
            result.index("Block B"),
            "Block A header must appear before Block B header",
        )

    def test_all_blocks_present(self):
        result = assemble(self._blocks, today="2026-05-11", last_updated="2026-05-11")
        # Each block is introduced by a "## Block" section header; count must
        # equal the number of input block specs.
        header_count = len(re.findall(r"^## Block", result, re.MULTILINE))
        self.assertEqual(
            header_count,
            len(self._blocks),
            f"expected {len(self._blocks)} block headers, found {header_count}",
        )

    def test_production_blocks_config(self):
        # The production BLOCKS tuple must list sources in this exact order and
        # all subtitle values must be strings or None (type contract).
        names = [b["file"].name for b in build_voice_unified.BLOCKS]
        self.assertEqual(
            names,
            [
                "VOICE.md",
                "voice-software-register.md",
                "voice-surfaces.md",
                "voice-workflow.md",
            ],
        )
        for spec in build_voice_unified.BLOCKS:
            self.assertIn(
                "title",
                spec,
                f"BLOCKS entry for {spec['file'].name} missing 'title'",
            )
            subtitle = spec.get("subtitle")
            self.assertTrue(
                subtitle is None or isinstance(subtitle, str),
                f"BLOCKS entry for {spec['file'].name}: subtitle must be str or None",
            )


class MainTests(unittest.TestCase):
    def test_returns_1_on_missing_source(self):
        bad_blocks: tuple = (
            {"file": FIXTURES / "missing.md", "title": "x", "subtitle": None},
        )
        with mock.patch.object(build_voice_unified, "BLOCKS", bad_blocks):
            with mock.patch("sys.stderr"):
                self.assertEqual(main(argv=[]), 1)

    def test_writes_output_on_success(self):
        good_blocks: tuple = (
            {"file": FIXTURES / "source_a.md", "title": "Block X · Test", "subtitle": None},
        )
        out_path = FIXTURES.parent / "tmp_voice_unified_main_test.md"
        try:
            with mock.patch.object(build_voice_unified, "BLOCKS", good_blocks), \
                 mock.patch.object(build_voice_unified, "OUTPUT_PATH", out_path):
                self.assertEqual(main(argv=[]), 0)
            self.assertTrue(out_path.exists())
            content = out_path.read_text(encoding="utf-8")
            self.assertIn("# Meshal Alawein — Voice Guide\n", content)
            self.assertIn("## Block X · Test\n", content)
        finally:
            if out_path.exists():
                out_path.unlink()


if __name__ == "__main__":
    unittest.main()
