"""Assemble alawein/docs/style/voice-unified.md from block source files.

Reads four block source files (VOICE.md, voice-software-register.md,
voice-surfaces.md, voice-workflow.md), strips frontmatter, drops the leading
block-naming H1, demotes remaining headers one level, synthesizes block headers
from the BLOCKS config, and writes voice-unified.md with frontmatter whose
last_updated reflects the regeneration date in UTC.

Run from the alawein repo root: python scripts/ops/build_voice_unified.py
"""
from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
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


def main() -> int:
    missing = [str(spec["file"]) for spec in BLOCKS if not spec["file"].exists()]
    if missing:
        print(f"ERROR: missing source files: {', '.join(missing)}", file=sys.stderr)
        return 1

    # last_updated is the UTC date of *this regeneration*, not the source-file
    # commit date. The doctrine validator (validate-doc-contract.sh) requires
    # the field to advance whenever the file changes; using `git log %cs` of
    # the sources would return their last-commit date, which doesn't change
    # between regen runs and so wouldn't satisfy the freshness rule. UTC also
    # matches the validator's `today_iso` comparison in CI.
    today_utc = datetime.now(timezone.utc).date().isoformat()

    try:
        body = assemble(BLOCKS, today=today_utc, last_updated=today_utc)
    except (RuntimeError, ValueError) as e:
        print(f"ERROR: assembly failed: {e}", file=sys.stderr)
        return 1

    try:
        OUTPUT_PATH.write_text(body, encoding="utf-8", newline="\n")
    except OSError as e:
        print(f"ERROR: failed to write {OUTPUT_PATH}: {e}", file=sys.stderr)
        return 1

    print(f"Wrote {OUTPUT_PATH} ({len(body):,} chars, last_updated={today_utc})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
