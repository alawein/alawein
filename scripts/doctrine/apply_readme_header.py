#!/usr/bin/env python3
"""Idempotently inject the Repo Framework header into repo READMEs.

Reads the generated projects.json registry, derives the six mandatory
header fields per repo, and splices a canonical metadata block in after
the level-1 title of each README. Running twice is a no-op.

See docs/governance/repo-framework.md for the header specification.
"""
from __future__ import annotations

import re

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
