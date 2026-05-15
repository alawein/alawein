#!/usr/bin/env python3
"""Validate the Repo Framework metadata header in every repo's README.

This validator hardcodes the doctrine's five enums (Status, Category, Owner,
Visibility, Next action) as constants below. The doctrine source of truth
lives in docs/governance/repo-framework.md; when that file's enums change,
the constants here MUST be updated in the same commit. There is no automated
link between the two. The exhaustiveness tests assert the constants are
consistent with themselves, not consistent with the doctrine.

Usage:
    python validate-repo-framework.py [--root <path>]

Exit codes:
    0 -- all repos pass
    1 -- one or more repos fail
    2 -- usage error, or no repos found under --root
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED_FIELDS = ["Status", "Category", "Owner", "Visibility", "Purpose", "Next action"]

ALLOWED_STATUS = {"active", "paused", "experimental", "deprecated", "archived"}
ALLOWED_CATEGORY = {
    "products", "personal", "family", "research",
    "tools", "ventures", "jobs-projects", "archive",
}
ALLOWED_OWNER = {
    # Active orgs only. The validator walks active bucket dirs; archive
    # content is intentionally outside its scope, so historical owners
    # (e.g., sunsetted holder orgs) are not enforced here.
    "alawein", "menax-inc", "blackmalejournal", "kohyr",
}
ALLOWED_VISIBILITY = {"public", "private"}
ALLOWED_NEXT_ACTION = {"continue", "refactor", "merge", "archive", "delete"}

_FIELD_RE = re.compile(
    r"^(Status|Category|Owner|Visibility|Purpose|Next action)\s*:\s*(.+?)\s*$",
    re.MULTILINE,
)


class ValidationError(Exception):
    """Raised when the README header is missing or malformed."""


def parse_header(text: str) -> dict[str, str]:
    """Extract the metadata header block from a README.

    Scans the first 60 lines and identifies the contiguous block of header
    field lines (allowing blank lines inside the block). Stops at the first
    non-blank, non-matching line after a field has been seen. This prevents
    README body prose containing field-like patterns (e.g., `## Status`
    followed by `Status: paused`) from silently overriding the real header.

    Returns a dict keyed by field name. Raises ValidationError if any required
    field is missing.
    """
    lines = text.splitlines()[:60]
    block: list[str] = []
    started = False
    for line in lines:
        if _FIELD_RE.match(line):
            started = True
            block.append(line)
        elif started:
            if line.strip() == "":
                # tolerate blank lines inside the header block
                continue
            # block ended
            break
    head = "\n".join(block)
    found = {m.group(1): m.group(2) for m in _FIELD_RE.finditer(head)}
    missing = [f for f in REQUIRED_FIELDS if f not in found]
    if missing:
        raise ValidationError(
            f"README header missing required fields: {', '.join(missing)}"
        )
    return found


def validate_repo(repo_path: Path, bucket: str | None = None) -> list[str]:
    """Validate one repo. Returns a list of human-readable findings.

    `bucket` is the parent directory name (e.g., 'products', 'tools'); when
    provided, the function asserts header.Category == bucket.
    """
    readme = repo_path / "README.md"
    findings: list[str] = []
    if not readme.exists():
        return [f"{repo_path.name}: README.md missing"]
    try:
        header = parse_header(readme.read_text(encoding="utf-8"))
    except ValidationError as e:
        return [f"{repo_path.name}: {e}"]

    if header["Status"] not in ALLOWED_STATUS:
        findings.append(f"{repo_path.name}: Status '{header['Status']}' not in allowed set")
    if header["Category"] not in ALLOWED_CATEGORY:
        findings.append(f"{repo_path.name}: Category '{header['Category']}' not in allowed set")
    if header["Owner"] not in ALLOWED_OWNER:
        findings.append(f"{repo_path.name}: Owner '{header['Owner']}' not in allowed set")
    if header["Visibility"] not in ALLOWED_VISIBILITY:
        findings.append(f"{repo_path.name}: Visibility '{header['Visibility']}' not in allowed set")
    if header["Next action"] not in ALLOWED_NEXT_ACTION:
        findings.append(f"{repo_path.name}: Next action '{header['Next action']}' not in allowed set")
    if bucket is not None and header["Category"] != bucket:
        findings.append(
            f"{repo_path.name}: Category '{header['Category']}' does not match bucket '{bucket}'"
        )
    return findings


_BUCKET_DIRS = (
    "products", "personal", "family", "research", "tools", "ventures", "jobs-projects",
)

# Doctrine consistency: _BUCKET_DIRS must equal ALLOWED_CATEGORY minus
# 'archive'. The 'archive' bucket lives at _archive/ outside this walk, so
# it is intentionally excluded here. Anyone adding a new active category
# must update both sets.
assert set(_BUCKET_DIRS) == ALLOWED_CATEGORY - {"archive"}, (
    f"doctrine drift: _BUCKET_DIRS={_BUCKET_DIRS} does not match "
    f"ALLOWED_CATEGORY - {{'archive'}} = {ALLOWED_CATEGORY - {'archive'}}"
)


def walk_alawein(root: Path) -> list[tuple[Path, str]]:
    """Return [(repo_path, bucket_name), ...] for every repo under alawein/<bucket>/."""
    out: list[tuple[Path, str]] = []
    for bucket in _BUCKET_DIRS:
        bucket_dir = root / bucket
        if not bucket_dir.is_dir():
            continue
        for child in sorted(bucket_dir.iterdir()):
            if child.is_dir() and (child / ".git").exists():
                out.append((child, bucket))
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate Repo Framework headers.")
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Path to alawein/ workspace root (contains products/, tools/, etc.). Defaults to current working directory.",
    )
    args = parser.parse_args(argv)

    if not args.root.is_dir():
        print(f"error: root not a directory: {args.root}", file=sys.stderr)
        return 2

    all_findings: list[str] = []
    repos = walk_alawein(args.root)
    if not repos:
        print(f"error: no repos found under {args.root}", file=sys.stderr)
        print(f"       expected at least one of: {', '.join(_BUCKET_DIRS)}", file=sys.stderr)
        return 2
    for repo, bucket in repos:
        findings = validate_repo(repo, bucket=bucket)
        if findings:
            all_findings.extend(findings)
        else:
            print(f"PASS  {bucket}/{repo.name}")

    if all_findings:
        print("\nFAIL:")
        for f in all_findings:
            print(f"  {f}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
