"""Per-repo commit authority from catalog/repos.json. Absent means 'full'."""
from __future__ import annotations

VALID_MODES = {"full", "guardrailed", "local"}


def commit_mode(entry: dict) -> str:
    mode = entry.get("commit_mode", "full")
    if mode not in VALID_MODES:
        raise ValueError(
            f"invalid commit_mode {mode!r} for {entry.get('slug')!r}; "
            f"expected one of {sorted(VALID_MODES)}"
        )
    return mode
