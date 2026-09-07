#!/usr/bin/env python3
"""Audit TODO/FIXME annotations in Python comments.

Uses Python's tokenizer to exclude strings and docstrings, including fixtures.
Other languages are outside this audit's coverage. Documentation, generated,
vendor, build, cache, and archive surfaces are skipped. Documentation
placeholders are covered by `validate-doctrine.py` separately.

Usage:
  python scripts/doctrine/audit-todo-fixme.py            # print findings
  python scripts/doctrine/audit-todo-fixme.py --check    # exit 1 if any found
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import tokenize
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent

# Only advertise languages with comment parsing supplied by the standard library.
INCLUDE_SUFFIXES = {".py"}

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

MARKER_RE = re.compile(r"#\s*(TODO|FIXME)\b")


def is_excluded(rel_path: Path) -> bool:
    return any(part in EXCLUDE_DIR_NAMES for part in rel_path.parts[:-1])


def iter_source_files(root: Path) -> list[Path]:
    files: list[Path] = []
    def fail_scan(error: OSError) -> None:
        raise error
    for directory, dirs, names in os.walk(root, onerror=fail_scan):
        dirs[:] = [name for name in dirs if name not in EXCLUDE_DIR_NAMES]
        for name in names:
            path = Path(directory) / name
            if path.suffix in INCLUDE_SUFFIXES and path.is_file():
                files.append(path)
    return sorted(files)


def find_markers(path: Path) -> list[tuple[int, str]]:
    hits: list[tuple[int, str]] = []
    with tokenize.open(path) as source:
        for token in tokenize.generate_tokens(source.readline):
            if token.type == tokenize.ERRORTOKEN and not token.string.isspace():
                raise SyntaxError(f"invalid token at line {token.start[0]}")
            if token.type == tokenize.COMMENT and MARKER_RE.match(token.string):
                hits.append((token.start[0], token.line.strip()))
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
    if not root.is_dir():
        print(f"could not audit Python comments: root is not a directory: {root}", file=sys.stderr)
        return 2
    try:
        findings = run_audit(root)
    except (OSError, UnicodeError, SyntaxError, tokenize.TokenError) as exc:
        print(f"could not audit Python comments: {exc}", file=sys.stderr)
        return 2

    total = sum(len(hits) for hits in findings.values())
    for path, hits in findings.items():
        rel = path.relative_to(root)
        for lineno, line in hits:
            print(f"{rel}:{lineno}: {line}")

    print(f"\nPython-comment TODO/FIXME audit: {total} marker(s) in {len(findings)} file(s); other languages excluded")

    if args.check and total:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
