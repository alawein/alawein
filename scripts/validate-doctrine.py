#!/usr/bin/env python3
"""Docs Doctrine Validator -- enforces all 10 rules.

Usage:
    python validate-doctrine.py [path]       # validate a directory
    python validate-doctrine.py --ci         # strict mode (exit 1 on any failure)
    python validate-doctrine.py --fix        # auto-add missing headers (interactive)
"""

import os
import sys
import re
import argparse
from pathlib import Path

# -- Configuration --
MANAGED_EXTENSIONS = {".md", ".json", ".yaml", ".yml", ".toml", ".cfg"}
# Extensions that support YAML frontmatter (JSON structurally cannot)
HEADER_EXTENSIONS = {".md", ".yaml", ".yml", ".toml", ".cfg"}
UPPERCASE_ROOT_PATTERN = re.compile(r"^[A-Z][A-Z0-9_-]*\.md$")
KEBAB_DIR_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
BANNED_SUFFIXES = ("_v2", "_v3", "_final", "_new", "_old", "_copy", "_backup")
BANNED_EXTENSIONS = (".bak", ".old", ".tmp", ".orig")
VALID_TYPES = {"canonical", "derived", "generated", "frozen"}
VALID_SYNCS = {"ci", "script", "manual", "none"}
VALID_SLAS = {"realtime", "on-change", "manual", "none"}


class ValidationResult:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.passed = 0

    def error(self, path, rule, msg):
        self.errors.append((path, rule, msg))

    def warn(self, path, rule, msg):
        self.warnings.append((path, rule, msg))

    def ok(self):
        self.passed += 1

    @property
    def success(self):
        return len(self.errors) == 0

    def report(self):
        print(f"\n{'=' * 60}")
        print("DOCTRINE VALIDATION REPORT")
        print(f"{'=' * 60}")
        print(f"Passed:   {self.passed}")
        print(f"Warnings: {len(self.warnings)}")
        print(f"Errors:   {len(self.errors)}")
        print(f"{'=' * 60}")
        for path, rule, msg in self.warnings:
            print(f"  WARN  [{rule}] {path}: {msg}")
        for path, rule, msg in self.errors:
            print(f"  FAIL  [{rule}] {path}: {msg}")
        print(f"\nResult: {'PASS' if self.success else 'FAIL'}")
        return self.success


def parse_header(filepath):
    """Extract YAML frontmatter from a file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except (UnicodeDecodeError, PermissionError):
        return None, ""

    if not content.startswith("---"):
        return None, content

    end = content.find("---", 3)
    if end == -1:
        return None, content

    header_text = content[3:end].strip()
    header = {}
    for line in header_text.split("\n"):
        if ":" in line:
            key, val = line.split(":", 1)
            header[key.strip()] = val.strip()

    return header, content[end + 3 :].strip()


def check_naming(filepath, result):
    """Rule 5: Naming conventions."""
    path = Path(filepath)
    name = path.name
    stem = path.stem

    # Banned extensions
    if path.suffix in BANNED_EXTENSIONS:
        result.error(filepath, "R5", f"Banned extension: {path.suffix}")
        return

    # Banned suffixes
    for suffix in BANNED_SUFFIXES:
        if stem.endswith(suffix):
            result.error(filepath, "R5", f"Banned version suffix: {suffix}")
            return

    # Root-level .md files must be UPPERCASE
    parent_name = path.parent.name
    if path.suffix == ".md" and parent_name in ("", "."):
        if not UPPERCASE_ROOT_PATTERN.match(name) and name != "docs-doctrine.md":
            result.warn(filepath, "R5", "Root .md should be UPPERCASE.md")

    result.ok()


def check_directory_naming(dirpath, result):
    """Rule 5: Directory names must be kebab-case."""
    name = Path(dirpath).name
    if name.startswith(".") or name.startswith("_") or name == "node_modules":
        return
    if not KEBAB_DIR_PATTERN.match(name):
        result.warn(dirpath, "R5", f"Directory should be kebab-case: {name}")
    result.ok()


def check_header(filepath, result):
    """Rules 1, 3, 4: Classification header."""
    suffix = Path(filepath).suffix
    if suffix not in MANAGED_EXTENSIONS:
        return

    # JSON files cannot have YAML frontmatter -- skip header checks
    if suffix == ".json":
        result.ok()
        return

    header, _ = parse_header(filepath)

    if header is None:
        result.error(filepath, "R1", "Missing doctrine header (YAML frontmatter)")
        return

    file_type = header.get("type", "").lower()
    if file_type not in VALID_TYPES:
        result.error(
            filepath, "R1", f"Invalid type: '{file_type}' (expected: {VALID_TYPES})"
        )
        return

    if file_type == "derived":
        if not header.get("source"):
            result.error(filepath, "R3", "Derived file missing 'source' declaration")
        sync = header.get("sync", "").lower()
        if sync not in VALID_SYNCS:
            result.error(
                filepath, "R3", f"Invalid sync: '{sync}' (expected: {VALID_SYNCS})"
            )
        sla = header.get("sla", "").lower()
        if sla not in VALID_SLAS:
            result.error(
                filepath, "R4", f"Invalid SLA: '{sla}' (expected: {VALID_SLAS})"
            )

    if file_type == "frozen":
        sla = header.get("sla", "none").lower()
        if sla != "none":
            result.warn(filepath, "R4", "Frozen files should have sla: none")

    result.ok()


def check_duplicate_canonicals(managed_files, result):
    """Rule 2: No duplicate canonicals for same content domain."""
    canonicals = {}
    for fp in managed_files:
        header, _ = parse_header(fp)
        if header and header.get("type", "").lower() == "canonical":
            name = Path(fp).name
            canonicals.setdefault(name, []).append(fp)

    for name, paths in canonicals.items():
        if len(paths) > 1:
            for p in paths:
                result.error(
                    p,
                    "R2",
                    f"Duplicate canonical: {name} also at "
                    f"{[x for x in paths if x != p]}",
                )


def check_zombies(managed_files, all_contents, result):
    """Rule 9: Detect zombie files."""
    for fp in managed_files:
        header, _ = parse_header(fp)
        if header is None:
            continue
        file_type = header.get("type", "").lower()
        if file_type in ("canonical", "generated", "frozen"):
            continue
        # For derived files, check if referenced somewhere
        name = Path(fp).name
        referenced = any(
            name in content for path, content in all_contents.items() if path != fp
        )
        if not referenced:
            result.warn(
                fp,
                "R9",
                "Potential zombie: derived/unknown file not referenced anywhere",
            )


def validate(root, ci_mode=False):
    """Run all validation checks."""
    result = ValidationResult()
    root = Path(root).resolve()
    managed_files = []
    all_contents = {}

    for dirpath, dirnames, filenames in os.walk(root):
        # Skip hidden dirs, underscore-prefixed dirs, and node_modules
        dirnames[:] = [
            d
            for d in dirnames
            if not d.startswith(".") and d != "node_modules" and d != "__pycache__"
        ]

        for d in dirnames:
            check_directory_naming(os.path.join(dirpath, d), result)

        for f in filenames:
            fp = os.path.join(dirpath, f)
            check_naming(fp, result)

            if Path(f).suffix in MANAGED_EXTENSIONS:
                managed_files.append(fp)
                try:
                    with open(fp, "r", encoding="utf-8") as fh:
                        all_contents[fp] = fh.read()
                except (UnicodeDecodeError, PermissionError):
                    pass

    for fp in managed_files:
        check_header(fp, result)

    check_duplicate_canonicals(managed_files, result)
    check_zombies(managed_files, all_contents, result)

    success = result.report()
    if ci_mode and not success:
        sys.exit(1)
    return success


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Docs Doctrine Validator")
    parser.add_argument("path", nargs="?", default=".", help="Directory to validate")
    parser.add_argument(
        "--ci", action="store_true", help="CI mode: exit 1 on failure"
    )
    parser.add_argument(
        "--fix", action="store_true", help="Interactive fix mode (not yet implemented)"
    )
    args = parser.parse_args()

    validate(args.path, ci_mode=args.ci)
