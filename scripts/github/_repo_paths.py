"""Shared repo-path resolution for the GitHub sync tooling.

Repos live in the bucketed layout (alawein/<bucket>/<slug>), so resolving by the
bare slug under the workspace (the old flat layout) fails. Resolve by the
catalog's authoritative `local_path` instead, mirroring the registry-aware
Extender (claude-agent-platform/bin/repo-scanner.sh).

This is the single source of truth imported by both `github-baseline-audit.py`
and the embedded python in `sync-github.sh`, so the two callers cannot drift.
Callers that require resolution must check `repo in local_paths` first and report
a miss loudly; a load failure returns an empty map rather than raising, so module
import stays safe in `--local` CI, partial clones, and tests.
"""

from __future__ import annotations

import json
from pathlib import Path


def load_local_path_map(org_repo: Path, catalog_path: Path | None = None) -> dict[str, str]:
    """Map repo slug to its bucketed local_path from `<org_repo>/catalog/repos.json`.

    Returns an empty map if the catalog is missing, unreadable, or malformed.
    """
    path = catalog_path if catalog_path is not None else org_repo / "catalog" / "repos.json"
    try:
        catalog = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    repos = catalog.get("repos", catalog) if isinstance(catalog, dict) else catalog
    if isinstance(repos, dict):
        repos = list(repos.values())
    mapping: dict[str, str] = {}
    for item in repos or []:
        if isinstance(item, dict) and item.get("slug") and item.get("local_path"):
            mapping[item["slug"]] = str(item["local_path"]).strip("/")
    return mapping


def resolve_repo_dir(workspace: Path, local_paths: dict[str, str], repo: str) -> Path:
    """Bucketed directory for `repo` under `workspace`.

    The flat-slug fallback is a last resort, not a silent default: callers should
    verify `repo in local_paths` first and surface a miss as drift or a catalog
    load failure.
    """
    return workspace / local_paths.get(repo, repo)
