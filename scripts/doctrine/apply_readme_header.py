#!/usr/bin/env python3
"""Idempotently inject the Repo Framework header into repo READMEs.

Reads the generated projects.json registry, derives the six mandatory
header fields per repo, and splices a canonical metadata block in after
the level-1 title of each README. Running twice is a no-op.

See docs/governance/repo-framework.md for the header specification.
"""
from __future__ import annotations

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
