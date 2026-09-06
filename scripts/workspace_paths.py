"""Resolve the local alawein workspace root."""

from __future__ import annotations

import os
from collections.abc import Mapping
from pathlib import Path


WORKSPACE_BUCKETS = frozenset({"_archive", "apps", "core", "lab", "sites", "work"})


def workspace_root_for(
    repo_root: Path, environ: Mapping[str, str] | None = None
) -> Path:
    """Return the workspace root containing bucket directories for ``repo_root``."""
    environment = os.environ if environ is None else environ
    configured_root = environment.get("ALAWEIN_WORKSPACE_ROOT", "").strip()
    if configured_root:
        return Path(configured_root).expanduser().resolve()

    resolved_repo_root = repo_root.resolve()
    if resolved_repo_root.parent.name in WORKSPACE_BUCKETS:
        return resolved_repo_root.parent.parent
    return resolved_repo_root.parent
