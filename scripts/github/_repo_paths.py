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
import os
import subprocess
from pathlib import Path
from urllib.parse import urlsplit


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
            # Strip only a trailing separator here. A leading "/" must survive
            # into resolve_repo_dir's Path.is_absolute() check below -- an
            # earlier version stripped both ends and silently turned an
            # absolute local_path (e.g. "/etc/passwd") into a relative one
            # ("etc/passwd"), defeating the absolute-path guard entirely.
            mapping[item["slug"]] = str(item["local_path"]).rstrip("/")
    return mapping


class PathEscapesWorkspaceError(ValueError):
    """Raised when a catalog `local_path` would resolve outside the workspace."""


def require_repo_checkout(repo_dir: Path, expected_repo: str) -> None:
    """Reject nested paths and unrelated checkouts before sync mutates files."""
    try:
        top = subprocess.run(
            ["git", "-C", str(repo_dir), "rev-parse", "--show-toplevel"],
            check=True, capture_output=True, text=True, timeout=10,
        ).stdout.strip()
        origin = subprocess.run(
            ["git", "-C", str(repo_dir), "remote", "get-url", "origin"],
            check=True, capture_output=True, text=True, timeout=10,
        ).stdout.strip()
    except (OSError, subprocess.SubprocessError):
        raise ValueError(f"{expected_repo}: checkout identity could not be verified") from None
    if Path(top).resolve() != repo_dir.resolve():
        raise ValueError(f"{expected_repo}: target must be the checkout root")
    if origin.startswith("git@github.com:"):
        identity = origin.removeprefix("git@github.com:")
    else:
        remote = urlsplit(origin)
        github_host = remote.hostname == "github.com" and remote.scheme in {"https", "ssh"}
        ssh_over_https = (
            remote.scheme == "ssh" and remote.hostname == "ssh.github.com" and remote.port == 443
        )
        identity = remote.path.lstrip("/") if github_host or ssh_over_https else ""
    identity = identity.rstrip("/").removesuffix(".git")
    if identity.casefold() != expected_repo.casefold():
        raise ValueError(f"{expected_repo}: checkout origin does not match the expected repository")


def resolve_repo_dir(workspace: Path, local_paths: dict[str, str], repo: str) -> Path:
    """Bucketed directory for `repo` under `workspace`.

    The flat-slug fallback is a last resort, not a silent default: callers should
    verify `repo in local_paths` first and surface a miss as drift or a catalog
    load failure.

    Raises `PathEscapesWorkspaceError` when `repo` is catalogued and its
    `local_path` is absolute, escapes `workspace` via `..` traversal, or
    resolves (following symlinks) somewhere other than its own lexical
    location under `workspace`. That last check catches a symlink planted
    *inside* the workspace that redirects a repo's bucketed directory onto
    another repo's checkout (e.g. this control-plane repo) without ever
    escaping the workspace boundary itself, which the traversal check alone
    would not detect. Catalog data must never let this tooling write or
    delete files outside the expected repository checkout (callers use this
    path for file writes and legacy-file deletion). The uncatalogued
    flat-slug fallback (`repo` itself) is not validated here since it is a
    plain repo slug, not catalog-sourced input.
    """
    raw = local_paths.get(repo)
    if raw is None:
        return workspace / repo
    if Path(raw).is_absolute():
        raise PathEscapesWorkspaceError(f"{repo}: local_path must be relative, got {raw!r}")
    candidate = workspace / raw
    resolved_workspace = workspace.resolve()
    resolved_candidate = candidate.resolve()
    try:
        resolved_candidate.relative_to(resolved_workspace)
    except ValueError:
        raise PathEscapesWorkspaceError(f"{repo}: local_path escapes workspace ({raw!r})") from None
    # Lexical (symlink-blind) expectation: workspace's own resolved root plus
    # a `..`-collapsed but otherwise untouched `raw`. If a symlink anywhere
    # under the workspace redirects the path, the filesystem-resolved
    # `resolved_candidate` above will diverge from this expectation.
    expected = resolved_workspace / os.path.normpath(raw)
    if resolved_candidate != expected:
        raise PathEscapesWorkspaceError(
            f"{repo}: local_path resolves through an unexpected symlink ({raw!r})"
        )
    return candidate
