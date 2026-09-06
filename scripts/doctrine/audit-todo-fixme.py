#!/usr/bin/env python3
"""Audit TODO/FIXME markers in executable source files only.

Scope is deliberately narrow: this walks executable source extensions
(Python, shell, JS/TS family, Go, Rust) and skips documentation, generated,
vendor, build, cache, and archive surfaces so the count reflects real code
debt rather than doc placeholders (see `validate-doctrine.py`'s separate
`PLACEHOLDER_TODO_RE` check) or third-party/derived content.

Usage:
  python scripts/doctrine/audit-todo-fixme.py            # print findings
  python scripts/doctrine/audit-todo-fixme.py --check    # exit 1 if any found
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent

# Executable source only. Markdown/docs are out of scope for this audit;
# `validate-doctrine.py` already covers doc placeholder TODOs separately.
INCLUDE_SUFFIXES = {".py", ".sh", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".go", ".rs"}

# Directory *names*, matched anywhere in the relative path, that are excluded
# regardless of file extension: docs, generated, vendor, build, cache, and
# archive surfaces.
EXCLUDE_DIR_NAMES = {
    "docs",
    "generated",
    "vendor",
    "vendored",
    "third_party",
    "build",
    "dist",
    ".next",
    ".turbo",
    "node_modules",
    ".venv",
    "venv",
    ".cache",
    ".pytest_cache",
    ".mypy_cache",
    "__pycache__",
    "coverage",
    "test-results",
    "playwright-report",
    "archive",
    "_archive",
    ".git",
}

MARKER_RE = re.compile(r"\b(TODO|FIXME)\b")


def is_excluded(rel_path: Path) -> bool:
    return any(part in EXCLUDE_DIR_NAMES for part in rel_path.parts[:-1])


def iter_source_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in INCLUDE_SUFFIXES:
            continue
        rel = path.relative_to(root)
        if is_excluded(rel):
            continue
        files.append(path)
    return sorted(files)


def find_markers(path: Path) -> list[tuple[int, str]]:
    hits: list[tuple[int, str]] = []
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return hits
    for lineno, line in enumerate(text.splitlines(), start=1):
        if MARKER_RE.search(line):
            hits.append((lineno, line.strip()))
    return hits


def run_audit(root: Path) -> dict[Path, list[tuple[int, str]]]:
    findings: dict[Path, list[tuple[int, str]]] = {}
    for path in iter_source_files(root):
        hits = find_markers(path)
        if hits:
            findings[path] = hits
    return findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Exit 1 if any TODO/FIXME found")
    parser.add_argument("--root", default=str(ROOT), help="Root directory to scan")
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    findings = run_audit(root)

    total = sum(len(hits) for hits in findings.values())
    for path, hits in findings.items():
        rel = path.relative_to(root)
        for lineno, line in hits:
            print(f"{rel}:{lineno}: {line}")

    print(f"\nTODO/FIXME audit: {total} marker(s) in {len(findings)} executable source file(s)")

    if args.check and total:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
