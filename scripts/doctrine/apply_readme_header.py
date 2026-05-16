#!/usr/bin/env python3
"""Idempotently inject the Repo Framework header into repo READMEs.

Reads the generated projects.json registry, derives the six mandatory
header fields per repo, and splices a canonical metadata block in after
the level-1 title of each README. Running twice is a no-op.

See docs/governance/repo-framework.md for the header specification.
"""
from __future__ import annotations

import argparse
import difflib
import os
import re
import subprocess
import sys
from pathlib import Path

from validate_repo_framework import RegistryError, load_registry

# Canonical field order (matches docs/governance/repo-framework.md).
HEADER_FIELDS = ["Status", "Category", "Owner", "Visibility", "Purpose", "Next action"]

# Catalog status vocabulary -> doctrine ALLOWED_STATUS enum.
STATUS_MAP = {
    "active": "active",
    "maintained": "active",
    "paused": "paused",
    "experimental": "experimental",
    "prototype": "experimental",
    "deprecated": "deprecated",
    "archived": "archived",
}

DEFAULT_NEXT_ACTION = "continue"


class DeriveError(Exception):
    """Raised when a registry entry lacks data needed to build a header."""


def derive_header_fields(slug: str, entry: dict) -> dict[str, str]:
    """Map a projects.json registry entry to the six header field values."""
    bucket = entry.get("bucket")
    if not bucket:
        raise DeriveError(f"{slug}: registry entry has no 'bucket'")

    raw_status = entry.get("status")
    if not raw_status:
        raise DeriveError(f"{slug}: registry entry has no 'status'")
    raw_status = str(raw_status).lower()
    if raw_status not in STATUS_MAP:
        raise DeriveError(
            f"{slug}: unknown status '{raw_status}' (extend STATUS_MAP or fix catalog)"
        )

    owner = entry.get("owner")
    if not owner:
        if "/" not in slug:
            raise DeriveError(f"{slug}: cannot derive owner from slug without '/'")
        owner = slug.split("/", 1)[0]

    visibility = str(entry.get("visibility") or "").lower()
    if visibility not in ("public", "private"):
        raise DeriveError(
            f"{slug}: visibility must be public|private, got '{visibility}'"
        )

    purpose = " ".join(str(entry.get("description") or "").split())
    if not purpose:
        raise DeriveError(f"{slug}: registry entry has no 'description'")

    return {
        "Status": STATUS_MAP[raw_status],
        "Category": bucket,
        "Owner": owner,
        "Visibility": visibility,
        "Purpose": purpose,
        "Next action": DEFAULT_NEXT_ACTION,
    }


LABEL_WIDTH = 13  # len("Next action:") + 1, so values align at column 14.

_FIELD_LINE = re.compile(
    r"^(Status|Category|Owner|Visibility|Purpose|Next action):"
)


def render_header(fields: dict[str, str]) -> str:
    """Render the six fields as an aligned metadata block (no blank lines)."""
    lines = []
    for name in HEADER_FIELDS:
        label = f"{name}:"
        lines.append(f"{label:<{LABEL_WIDTH}}{fields[name]}")
    return "\n".join(lines)


def _header_block_after_title(
    lines: list[str], title_idx: int
) -> tuple[int, int] | None:
    """Return (start, end-exclusive) of an existing six-field header block.

    Only a contiguous run of exactly the six canonical fields, sitting
    immediately after the title (blank lines between are allowed), counts.
    This prevents body prose like 'Status: see issues' from being mistaken
    for the header and destroyed.
    """
    i = title_idx + 1
    while i < len(lines) and lines[i].strip() == "":
        i += 1
    start = i
    names: list[str] = []
    while i < len(lines):
        match = _FIELD_LINE.match(lines[i])
        if not match:
            break
        names.append(match.group(1))
        i += 1
    if sorted(names) == sorted(HEADER_FIELDS):
        return (start, i)
    return None


def splice_header(readme_text: str, fields: dict[str, str]) -> str:
    """Insert or replace the Repo Framework block. Idempotent."""
    block_lines = render_header(fields).splitlines()
    lines = readme_text.splitlines()

    title_idx = next(
        (i for i, ln in enumerate(lines) if ln.startswith("# ")), None
    )
    if title_idx is None:
        raise DeriveError("README has no level-1 '# ' heading; cannot place header")

    existing = _header_block_after_title(lines, title_idx)
    if existing:
        start, end = existing
        if end < len(lines) and lines[end].strip() == "":
            end += 1
        body = lines[end:]
    else:
        body = lines[title_idx + 1:]
    while body and body[0].strip() == "":
        body.pop(0)

    result = lines[: title_idx + 1] + [""] + block_lines + [""] + body
    return "\n".join(result).rstrip("\n") + "\n"


# ---------------------------------------------------------------------------
# CLI layer: slug resolution, repo discovery, per-repo apply, entry point
# ---------------------------------------------------------------------------

_SLUG_RE = re.compile(r"[:/]([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+?)(?:\.git)?/?$")


def parse_slug(remote_url: str) -> str | None:
    """Extract an 'owner/name' slug from a Git remote URL, or None."""
    match = _SLUG_RE.search(remote_url.strip())
    if not match:
        return None
    slug = match.group(1)
    owner = slug.split("/", 1)[0]
    # Reject a host-like owner (e.g. 'github.com/org' from a single-segment URL).
    return None if "." in owner else slug


def slug_from_remote(repo_path: Path) -> str | None:
    """Resolve a repo's 'owner/name' slug from its origin remote."""
    try:
        out = subprocess.run(
            ["git", "-C", str(repo_path), "remote", "get-url", "origin"],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
        )
    except FileNotFoundError:
        return None
    if out.returncode != 0:
        return None
    return parse_slug(out.stdout)


def find_repos(root: Path) -> list[Path]:
    """Return every Git repo under root (no descent into nested repos)."""
    repos: list[Path] = []
    for dirpath, dirnames, _ in os.walk(root):
        if ".git" in dirnames:
            repos.append(Path(dirpath))
            dirnames[:] = []
            continue
        dirnames[:] = [
            d for d in dirnames if d not in {"node_modules", ".git", "_archive"}
        ]
    return repos


def apply_to_repo(
    repo_path: Path, slug: str, registry: dict, dry_run: bool
) -> tuple[str, str]:
    """Apply (or preview) the header for one repo. Returns (status, detail)."""
    entry = registry.get(slug)
    if entry is None:
        return ("skipped", f"{slug}: not in registry")
    fields = derive_header_fields(slug, entry)
    readme = repo_path / "README.md"
    if not readme.exists():
        return ("error", f"{slug}: no README.md")
    original = readme.read_text(encoding="utf-8")
    updated = splice_header(original, fields)
    if updated == original:
        return ("unchanged", slug)
    if dry_run:
        diff = "".join(difflib.unified_diff(
            original.splitlines(keepends=True),
            updated.splitlines(keepends=True),
            fromfile=f"{slug}/README.md",
            tofile=f"{slug}/README.md (proposed)",
        ))
        return ("would-change", diff)
    readme.write_text(updated, encoding="utf-8", newline="\n")
    return ("changed", slug)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Inject Repo Framework README headers."
    )
    parser.add_argument("--registry", required=True, type=Path,
                        help="Path to projects.json")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--repo", type=Path,
                       help="Apply to a single repo directory")
    group.add_argument("--root", type=Path,
                       help="Apply to every Git repo under root")
    parser.add_argument("--slug", help="Override slug for --repo mode")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print diffs; write nothing")
    args = parser.parse_args(argv)

    try:
        registry = load_registry(args.registry)
    except RegistryError as exc:
        print(f"ERROR: cannot load registry: {exc}", file=sys.stderr)
        return 2

    targets = [args.repo] if args.repo else find_repos(args.root)
    if not targets:
        print(f"ERROR: no git repos found under {args.root}", file=sys.stderr)
        return 2
    if args.root and args.slug:
        print("WARNING: --slug is ignored with --root", file=sys.stderr)

    counts = {"changed": 0, "would-change": 0, "unchanged": 0,
              "skipped": 0, "error": 0}
    for repo_path in sorted(targets):
        slug = args.slug if (args.repo and args.slug) else slug_from_remote(repo_path)
        if slug is None:
            print(f"skipped  {repo_path}: no resolvable origin slug")
            counts["skipped"] += 1
            continue
        try:
            status, detail = apply_to_repo(repo_path, slug, registry, args.dry_run)
        except DeriveError as exc:
            print(f"error    {exc}", file=sys.stderr)
            counts["error"] += 1
            continue
        counts[status] += 1
        if status == "would-change":
            print(detail)
        elif status == "error":
            print(f"error    {detail}", file=sys.stderr)
        else:
            print(f"{status:<8} {slug}")

    print("\nsummary: " + ", ".join(f"{k}={v}" for k, v in counts.items()))
    return 1 if counts["error"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
