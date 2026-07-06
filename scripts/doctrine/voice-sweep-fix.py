#!/usr/bin/env python3
"""Apply house-voice fixes to README.md and in-scope docs/**/*.md."""

from __future__ import annotations

import re
import sys
from pathlib import Path

EM_DASH = "\u2014"

EXCLUDE_DIR_PARTS = frozenset(
    {"archive", "imports", "internal", "superpowers", "reports", "_archive"}
)

WORD_REPLACEMENTS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"[_*]?\bcomprehensive\b", re.I), "thorough"),
    (re.compile(r"\brobust solution\b", re.I), "reliable solution"),
    (re.compile(r"\brobust\b", re.I), "reliable"),
    (re.compile(r"\bleveraging\b", re.I), "using"),
    (re.compile(r"\bleverages\b", re.I), "uses"),
    (re.compile(r"\bleverage\b", re.I), "use"),
    (re.compile(r"\bstreamlined\b", re.I), "efficient"),
    (re.compile(r"\bstreamline\b", re.I), "simplify"),
    (re.compile(r"\bseamlessly\b", re.I), "smoothly"),
    (re.compile(r"\bseamless\b", re.I), "integrated"),
    (re.compile(r"\bcutting-edge\b", re.I), "advanced"),
    (re.compile(r"\butilize\b", re.I), "use"),
    (re.compile(r"\butilizes\b", re.I), "uses"),
    (re.compile(r"\butilizing\b", re.I), "using"),
    (re.compile(r"\bempowering\b", re.I), "enabling"),
    (re.compile(r"\bempower\b", re.I), "enable"),
    (re.compile(r"\bpowerful\b", re.I), "capable"),
    (re.compile(r"\binnovative\b", re.I), "novel"),
    (re.compile(r"\bdeep dive\b", re.I), "detailed look"),
    (re.compile(r"\bdelve into\b", re.I), "explore"),
    (re.compile(r"\bdelve\b", re.I), "explore"),
    (re.compile(r"\bholistic\b", re.I), "integrated"),
    (re.compile(r"\bmoreover\b", re.I), "also"),
    (re.compile(r"\bfurthermore\b", re.I), "also"),
    (re.compile(r"\btransformative\b", re.I), "significant"),
    (re.compile(r"\bgroundbreaking\b", re.I), "notable"),
    (re.compile(r"\bgame-changing\b", re.I), "major"),
    (re.compile(r"\bsynergy\b", re.I), "alignment"),
    (re.compile(r"\bpassionate about\b", re.I), "focused on"),
    (re.compile(r"\bexcited to\b", re.I), "ready to"),
    (re.compile(r"\bit'?s worth noting\b", re.I), "note that"),
    (re.compile(r"\binterestingly\b", re.I), ""),
    (re.compile(r"\bin today'?s world\b", re.I), "today"),
    (re.compile(r"\bmoving forward\b", re.I), "next"),
    (re.compile(r"\bI am pleased to\b", re.I), "I will"),
    (re.compile(r"\bI hope this helps\b", re.I), ""),
    (re.compile(r"\bfeel free to\b", re.I), "you can"),
    (re.compile(r"\bas mentioned above\b", re.I), "as noted"),
    (re.compile(r"\bthat being said\b", re.I), "still"),
    (re.compile(r"\bComprehensiveEvaluator\b"), "ThoroughEvaluator"),
]


def in_scope(path: Path, root: Path) -> bool:
    rel = path.relative_to(root)
    rel_posix = rel.as_posix()
    if path.name == "README.md" and path.parent == root:
        return True
    if not rel_posix.startswith("docs/") or path.suffix.lower() != ".md":
        return False
    if any(part in EXCLUDE_DIR_PARTS for part in rel.parts):
        return False
    if rel_posix.startswith("docs/internal/"):
        return False
    return True


def fix_em_dash_line(line: str) -> str:
    if EM_DASH not in line:
        return line
    # Heading: "# Title — subtitle"
    if re.match(r"^#{1,6}\s+.+" + re.escape(EM_DASH), line):
        return line.replace(EM_DASH, ": ", 1)
    # Table placeholder cell
    if re.search(r"\|\s*" + re.escape(EM_DASH) + r"\s*\|", line):
        return line.replace(EM_DASH, "n/a")
    # Quoted workflow names: "Ops — GitHub" -> "Ops: GitHub"
    line = re.sub(
        r"([\"*][^\"*]*?)" + re.escape(EM_DASH) + r"([^\"*]*?[\"*])",
        r"\1: \2",
        line,
    )
    # List items and prose: replace em-dash with comma + space when sandwiched
    line = line.replace(EM_DASH, ", ")
    # Cleanup double spaces from interestingly removal etc.
    line = re.sub(r"  +", " ", line)
    line = re.sub(r",\s+,", ", ", line)
    return line.rstrip()


def fix_content(content: str) -> str:
    lines: list[str] = []
    for line in content.splitlines():
        updated = line
        for pattern, replacement in WORD_REPLACEMENTS:
            updated = pattern.sub(replacement, updated)
        updated = fix_em_dash_line(updated)
        lines.append(updated)
    return "\n".join(lines) + ("\n" if content.endswith("\n") else "")


def collect_files(root: Path) -> list[Path]:
    files: list[Path] = []
    readme = root / "README.md"
    if readme.is_file():
        files.append(readme)
    docs = root / "docs"
    if docs.is_dir():
        for path in sorted(docs.rglob("*.md")):
            if in_scope(path, root):
                files.append(path)
    return files


def main() -> int:
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <repo-root>", file=sys.stderr)
        return 2
    root = Path(sys.argv[1]).resolve()
    changed: list[Path] = []
    for path in collect_files(root):
        original = path.read_text(encoding="utf-8")
        fixed = fix_content(original)
        if fixed != original:
            path.write_text(fixed, encoding="utf-8", newline="\n")
            changed.append(path)
    for path in changed:
        print(path.relative_to(root).as_posix())
    print(f"changed {len(changed)} file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
