"""Optional catalog local_path checks against a workspace checkout.

Observed: catalog paths are relative to the Dropbox/GitHub workspace root that
contains sibling repos (see catalog/repos.json).

This module is skipped unless ALAWEIN_WORKSPACE_ROOT is set so CI and partial
clones stay green by default.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = REPO_ROOT / "catalog" / "repos.json"
EXEMPT_PATH = REPO_ROOT / "catalog" / "local_path_exemptions.json"


def _skip_slugs() -> set[str]:
    if not EXEMPT_PATH.is_file():
        return set()
    data = json.loads(EXEMPT_PATH.read_text(encoding="utf-8"))
    raw = data.get("skip_slugs") or []
    return {str(s) for s in raw}


@pytest.mark.skipif(
    not os.environ.get("ALAWEIN_WORKSPACE_ROOT"),
    reason="Set ALAWEIN_WORKSPACE_ROOT to run catalog local_path resolution checks",
)
def test_catalog_local_paths_resolve_when_workspace_env_set() -> None:
    workspace = Path(os.environ["ALAWEIN_WORKSPACE_ROOT"]).expanduser().resolve()
    assert workspace.is_dir(), "ALAWEIN_WORKSPACE_ROOT must be an existing directory"

    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    repos = catalog.get("repos") or []
    skip = _skip_slugs()

    missing: list[str] = []
    skipped_parent = 0
    for entry in repos:
        slug = entry.get("slug")
        local_path = entry.get("local_path")
        if not isinstance(slug, str) or not isinstance(local_path, str):
            continue
        if slug in skip:
            continue
        if local_path.startswith("../"):
            skipped_parent += 1
            continue

        target = (workspace / local_path).resolve()
        try:
            target.relative_to(workspace)
        except ValueError:
            missing.append(f"{slug}: local_path escapes workspace ({local_path})")
            continue

        if not target.is_dir():
            missing.append(f"{slug}: missing directory at {local_path}")

    assert not missing, "Catalog local_path mismatches:\n" + "\n".join(missing)
