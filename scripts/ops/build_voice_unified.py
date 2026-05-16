"""Assemble alawein/docs/style/voice-unified.md from block source files.

Reads four block source files (VOICE.md, voice-software-register.md,
voice-surfaces.md, voice-workflow.md), strips frontmatter, drops the leading
block-naming H1, demotes remaining headers one level, synthesizes block headers
from the BLOCKS config, and writes voice-unified.md with frontmatter whose
last_updated reflects the maximum last_updated across the source block files.

Run from the alawein repo root:
  python scripts/ops/build_voice_unified.py          # build and write
  python scripts/ops/build_voice_unified.py --check  # diff in-memory vs on-disk
"""
from __future__ import annotations

import argparse
import difflib
import re
import sys
from pathlib import Path
from typing import TypedDict

REPO_ROOT = Path(__file__).resolve().parents[2]
STYLE_DIR = REPO_ROOT / "docs" / "style"
OUTPUT_PATH = STYLE_DIR / "voice-unified.md"

# Matches both backtick-fence and tilde-fence openers/closers, with optional
# leading whitespace. ` ```python `, `~~~`, ` ```` ` (4+ backticks) all count.
_FENCE_RE = re.compile(r"^\s*(```+|~~~+)")


class BlockSpec(TypedDict):
    file: Path
    title: str
    subtitle: str | None


BLOCKS: tuple[BlockSpec, ...] = (
    {
        "file": STYLE_DIR / "VOICE.md",
        "title": "Block 1 · Universal Core",
        "subtitle": "_Source: `alawein/docs/style/VOICE.md`. Applies to every surface, no exceptions._",
    },
    # Blocks 2-4 source files carry their own subtitle paragraph after the
    # leading H1, so the assembler should not synthesize one (would duplicate).
    # Block 1 (VOICE.md) does not, so its subtitle is synthesized above.
    {
        "file": STYLE_DIR / "voice-software-register.md",
        "title": "Block 2 · Design-Defense Register",
        "subtitle": None,
    },
    {
        "file": STYLE_DIR / "voice-surfaces.md",
        "title": "Block 3 · Surface Adjustments",
        "subtitle": None,
    },
    {
        "file": STYLE_DIR / "voice-workflow.md",
        "title": "Block 4 · Polish Workflow",
        "subtitle": None,
    },
)


def _read_source_last_updated(spec: "BlockSpec") -> str:
    """Return the last_updated frontmatter value from a source block file.

    Raises RuntimeError naming the file if the field is absent or unparseable.
    The generated guide's freshness IS its sources' freshness: when any source
    is edited its own last_updated advances to that day, so the derived max is
    current whenever a real rebuild happens; when nothing changed, the date
    legitimately doesn't move.  This makes the build a pure function of its
    inputs.
    """
    try:
        raw = spec["file"].read_text(encoding="utf-8")
    except (FileNotFoundError, PermissionError, UnicodeDecodeError) as e:
        raise RuntimeError(f"failed to read source {spec['file']}: {e}") from e
    if not raw.startswith("---\n"):
        raise RuntimeError(
            f"source {spec['file']} has no YAML frontmatter; cannot read last_updated"
        )
    end = raw.find("\n---\n", 4)
    if end == -1:
        raise RuntimeError(f"source {spec['file']} has unterminated YAML frontmatter")
    frontmatter_block = raw[4:end]
    for line in frontmatter_block.splitlines():
        if line.startswith("last_updated:"):
            value = line[len("last_updated:"):].strip()
            if value:
                return value
    raise RuntimeError(
        f"source {spec['file']} has no last_updated field in its frontmatter"
    )


def derive_last_updated(blocks: "tuple[BlockSpec, ...] | list[BlockSpec]") -> str:
    """Return the lexically greatest last_updated across all source block files.

    ISO-8601 date strings sort correctly as plain strings, so a lexical max is
    equivalent to a chronological max.  Raises RuntimeError (naming the file)
    if any source is missing the field.
    """
    return max(_read_source_last_updated(spec) for spec in blocks)


def strip_frontmatter(text: str) -> str:
    """Strip leading YAML frontmatter (--- ... ---) if present.

    Raises ValueError if the text starts with `---\\n` but never closes
    the frontmatter block; silently returning unchanged in that case would
    let malformed source files ship with raw frontmatter in the output.
    """
    if not text.startswith("---\n"):
        return text
    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError("unterminated YAML frontmatter (opening `---` with no closing `---`)")
    return text[end + len("\n---\n"):].lstrip("\n")


def drop_leading_h1(text: str) -> str:
    """Drop the first non-blank line if it is an H1 (`# `).

    Also drops any leading blank lines before the H1 and one immediately-
    following blank line for clean spacing.
    Leaves text unchanged if the first non-blank line is not an H1.
    """
    lines = text.splitlines(keepends=True)
    for i, line in enumerate(lines):
        if not line.strip():
            continue
        stripped = line.lstrip()
        if stripped.startswith("# ") and not stripped.startswith("## "):
            del lines[: i + 1]
            if lines and not lines[0].strip():
                del lines[0]
            return "".join(lines)
        return text
    return text


def demote_headers(text: str) -> str:
    """Add one `#` to every line beginning with `#+ ` (markdown header).

    Skips lines inside fenced code blocks (between ``` or ~~~ markers) so
    that code comments using `#` (Python, shell, etc.) are not corrupted.

    Raises ValueError if the text has an unbalanced fence (in_fence at end
    of input) — silently treating the rest of the doc as code would skip
    real headers and produce structurally broken output.
    """
    lines = text.splitlines(keepends=True)
    in_fence = False
    out: list[str] = []
    for line in lines:
        if _FENCE_RE.match(line):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
        else:
            out.append(re.sub(r"^(#+)(\s)", r"#\1\2", line))
    if in_fence:
        raise ValueError("unbalanced fenced code block (opening fence with no matching close)")
    return "".join(out)


def _process_block(spec: BlockSpec) -> str:
    """Read one block source, strip frontmatter, drop leading H1, demote headers.

    Wraps file I/O so that read failures (missing file, permission, decode
    error) surface as a RuntimeError naming the offending source file rather
    than a bare traceback.
    """
    try:
        raw = spec["file"].read_text(encoding="utf-8")
    except (FileNotFoundError, PermissionError, UnicodeDecodeError) as e:
        raise RuntimeError(f"failed to read source {spec['file']}: {e}") from e
    body = drop_leading_h1(strip_frontmatter(raw))
    if not body.strip():
        raise RuntimeError(
            f"source {spec['file']} produced an empty block "
            "(file may be frontmatter-only or have no content after the leading H1)"
        )
    return demote_headers(body).rstrip() + "\n"


def assemble(blocks: tuple[BlockSpec, ...] | list[BlockSpec], today: str, last_updated: str) -> str:
    """Assemble all blocks into the unified guide text.

    `today` and `last_updated` are accepted as separate arguments so callers
    can pin them deterministically (used by tests). `main()` passes the same
    UTC date for both — they happen to coincide in production but the API
    leaves room for them to diverge if a future change needs that.
    """
    sources_field = ", ".join(f"docs/style/{spec['file'].name}" for spec in blocks)
    parts = [
        "---\n",
        "type: generated\n",
        f"source: {sources_field}\n",
        "sync: scripts/ops/build_voice_unified.py\n",
        "sla: regenerate on source change\n",
        "authority: derived\n",
        "audience: [contributors, agents, llm-system-prompts]\n",
        f"last_updated: {last_updated}\n",
        "---\n\n",
        "<!-- Generated by scripts/ops/build_voice_unified.py from docs/style/. Do not hand-edit. -->\n",
        "<!-- markdownlint-disable MD049 -->\n\n",
        "# Meshal Alawein — Voice Guide\n\n",
        f"_Generated: {today}. Unified reference for all writing surfaces._\n",
        "_Works as an AI system prompt and as a personal review checklist._\n\n",
        "## How to use\n\n",
        "**As an AI system prompt:** paste this guide in full, then tag the target surface: "
        "`[software-doc]`, `[notebook]`, `[readme]`, `[physics-paper]`, `[claude-md]`, or `[prompt-kit]`. "
        "Apply Block 1 universally. Apply Block 2 to `[software-doc]` and `[notebook]` surfaces. "
        "For `[physics-paper]`, apply only §10 and §11 from Block 2; all other Block 2 sections are inactive. "
        "Apply the matching § from Block 3 for surface-specific adjustments. "
        "Run §24 as a final audit pass before returning output.\n\n",
        "**As a personal checklist:** use §23 before writing and §24 after.\n",
    ]

    for spec in blocks:
        parts.append("\n---\n\n")
        parts.append(f"## {spec['title']}\n\n")
        if spec["subtitle"] is not None:
            parts.append(f"{spec['subtitle']}\n\n")
        parts.append(_process_block(spec))

    return "".join(parts)


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Assemble docs/style/voice-unified.md from source block files.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help=(
            "Build in memory and compare to the on-disk voice-unified.md. "
            "Exit 0 if identical, exit 1 (with unified diff on stderr) if different."
        ),
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)

    missing = [str(spec["file"]) for spec in BLOCKS if not spec["file"].exists()]
    if missing:
        print(f"ERROR: missing source files: {', '.join(missing)}", file=sys.stderr)
        return 1

    # last_updated is derived from the maximum last_updated across the source
    # block files, not the wall-clock UTC date.  The generated guide's freshness
    # IS its sources' freshness: when any source is edited its own last_updated
    # advances, so the derived max is current whenever a real rebuild happens;
    # when nothing changed, the date legitimately doesn't move.  This makes the
    # build a pure function of its inputs, which is what --check requires.
    try:
        last_updated = derive_last_updated(BLOCKS)
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    try:
        body = assemble(BLOCKS, today=last_updated, last_updated=last_updated)
    except (RuntimeError, ValueError) as e:
        print(f"ERROR: assembly failed: {e}", file=sys.stderr)
        return 1

    if args.check:
        if not OUTPUT_PATH.exists():
            print(f"ERROR: {OUTPUT_PATH} does not exist; run without --check first.", file=sys.stderr)
            return 1
        on_disk = OUTPUT_PATH.read_text(encoding="utf-8")
        if body == on_disk:
            print(f"OK: {OUTPUT_PATH} is in sync with its sources.")
            return 0
        diff_lines = list(
            difflib.unified_diff(
                on_disk.splitlines(keepends=True),
                body.splitlines(keepends=True),
                fromfile=str(OUTPUT_PATH),
                tofile="<assembled-from-sources>",
            )
        )
        print(
            f"DRIFT: {OUTPUT_PATH} is out of sync with its sources. "
            "Run build_voice_unified.py (without --check) to regenerate.",
            file=sys.stderr,
        )
        sys.stderr.writelines(diff_lines)
        return 1

    try:
        OUTPUT_PATH.write_text(body, encoding="utf-8", newline="\n")
    except OSError as e:
        print(f"ERROR: failed to write {OUTPUT_PATH}: {e}", file=sys.stderr)
        return 1

    print(f"Wrote {OUTPUT_PATH} ({len(body):,} chars, last_updated={last_updated})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
