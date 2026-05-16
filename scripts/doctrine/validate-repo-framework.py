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
import json
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
ALAWEIN_OWNER = "alawein"

_FIELD_RE = re.compile(
    r"^(Status|Category|Owner|Visibility|Purpose|Next action)\s*:\s*(.+?)\s*$",
    re.MULTILINE,
)


class ValidationError(Exception):
    """Raised when the README header is missing or malformed."""


class RegistryError(Exception):
    """Raised when projects.json cannot be read, parsed, or indexed."""


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
    found: dict[str, str] = {}
    for m in _FIELD_RE.finditer(head):
        name, value = m.group(1), m.group(2)
        if name in found:
            raise ValidationError(
                f"README header has duplicate field '{name}': "
                f"first={found[name]!r}, second={value!r}"
            )
        found[name] = value
    missing = [f for f in REQUIRED_FIELDS if f not in found]
    if missing:
        raise ValidationError(
            f"README header missing required fields: {', '.join(missing)}"
        )
    return found


def validate_repo(
    repo_path: Path,
    bucket: str | None = None,
    display_name: str | None = None,
) -> list[str]:
    """Validate one repo. Returns a list of human-readable findings.

    `bucket` is the expected Category; when provided, the function asserts
    header.Category == bucket. `display_name` overrides the repo directory
    name in finding messages; --repo mode passes the GitHub slug here so
    messages name the real repo rather than the generic 'repo/' checkout.
    """
    name = display_name or repo_path.name
    readme = repo_path / "README.md"
    findings: list[str] = []
    if not readme.exists():
        return [f"{name}: README.md missing"]
    try:
        text = readme.read_text(encoding="utf-8")
    except UnicodeDecodeError as e:
        return [f"{name}: README.md not UTF-8 ({e.reason} at byte {e.start})"]
    except OSError as e:
        return [f"{name}: README.md unreadable: {e}"]
    try:
        header = parse_header(text)
    except ValidationError as e:
        return [f"{name}: {e}"]

    if header["Status"] not in ALLOWED_STATUS:
        findings.append(f"{name}: Status '{header['Status']}' not in allowed set")
    if header["Category"] not in ALLOWED_CATEGORY:
        findings.append(f"{name}: Category '{header['Category']}' not in allowed set")
    if header["Owner"] not in ALLOWED_OWNER:
        findings.append(f"{name}: Owner '{header['Owner']}' not in allowed set")
    if header["Visibility"] not in ALLOWED_VISIBILITY:
        findings.append(f"{name}: Visibility '{header['Visibility']}' not in allowed set")
    if header["Next action"] not in ALLOWED_NEXT_ACTION:
        findings.append(f"{name}: Next action '{header['Next action']}' not in allowed set")
    if bucket is not None and header["Category"] != bucket:
        findings.append(
            f"{name}: Category '{header['Category']}' does not match bucket '{bucket}'"
        )
    return findings


def load_registry(path: Path) -> dict[str, dict]:
    """Load projects.json and return a map of repo slug to entry.

    Iterates every top-level list value; within each list, indexes every
    dict entry that carries a 'repo' key (a GitHub 'owner/name' slug).
    Entries with no 'repo' key (for example the 'packages' list) are
    skipped.

    Raises RegistryError if the file is missing, unreadable, not valid
    JSON, not a JSON object at the top level, or contains two entries
    sharing the same 'repo' slug.
    """
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as e:
        raise RegistryError(f"cannot read registry {path}: {e}") from e
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise RegistryError(f"registry {path} is not valid JSON: {e}") from e
    if not isinstance(data, dict):
        raise RegistryError(f"registry {path} top level is not a JSON object")
    out: dict[str, dict] = {}
    for value in data.values():
        if not isinstance(value, list):
            continue
        for entry in value:
            if not isinstance(entry, dict):
                continue
            slug = entry.get("repo")
            if not slug:
                continue
            if slug in out:
                raise RegistryError(
                    f"registry {path} has duplicate repo slug '{slug}'"
                )
            out[slug] = entry
    return out


def validate_repo_single(
    repo_path: Path, repo_slug: str, registry: dict[str, dict]
) -> list[str]:
    """Validate one repo's README header against the projects.json registry.

    `repo_slug` is the GitHub 'owner/name' slug, matched against the
    registry's 'repo' field. The expected Category comes from the matched
    entry's 'bucket'.

    Rules:
      - slug absent from the registry: fail.
      - matched entry has a 'bucket': full check; Category must equal it.
      - matched entry has no 'bucket' and owner is alawein: fail.
      - matched entry has no 'bucket' and owner is cross-org: validate
        header shape only (skip the Category cross-check).
    """
    entry = registry.get(repo_slug)
    if entry is None:
        return [
            f"{repo_slug}: not registered in projects.json "
            f"(no entry with repo == '{repo_slug}')"
        ]
    bucket = entry.get("bucket")
    owner = repo_slug.split("/", 1)[0]
    if bucket is None:
        if owner == ALAWEIN_OWNER:
            return [
                f"{repo_slug}: projects.json entry has no 'bucket' field; "
                f"every alawein-org repo must declare a bucket"
            ]
        return validate_repo(repo_path, bucket=None, display_name=repo_slug)
    return validate_repo(repo_path, bucket=bucket, display_name=repo_slug)


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
