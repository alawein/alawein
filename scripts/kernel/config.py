"""Load catalog and kernel configuration for the renderer."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

import yaml

from .paths import KERNEL_YAML, REPOS_JSON

ARCHIVE_PROFILE = "archive"

# Profile -> CI runtime family. "none" means the profile has no source
# language to build/test (docs-hub, paper): ci.yml renders a no-op job
# instead of a node/python build so the file still exists (canonical tree
# requires it) without inventing a build step nobody asked for. "none"
# profiles also get no codeql.yml -- CodeQL needs a `languages` input and
# there is no code to scan.
PROFILE_CI_KIND: dict[str, str] = {
    "web-app-next": "node",
    "node-lib": "node",
    "python-lib": "python",
    "python-research": "python",
    "docs-hub": "none",
    "paper": "none",
}

# Profile -> CodeQL `languages` input (comma-separated, matches codeql.yml's
# workflow_call contract). Profiles absent here get no codeql.yml at all
# (see PROFILE_CI_KIND "none").
PROFILE_CODEQL_LANGUAGES: dict[str, str] = {
    "web-app-next": "javascript-typescript",
    "node-lib": "javascript-typescript",
    "python-lib": "python",
    "python-research": "python",
}


@dataclass(frozen=True)
class KernelConfig:
    kernel_version: str
    workflow_pin_sha: str | None
    kernel_sync_path_allowlist: list[str]
    auto_merge_enabled: bool
    repo_drift_release_sha: str | None
    raw: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class RepoContext:
    slug: str
    repo_name: str
    canonical_description: str
    profile: str
    type: str
    owner: str
    maintainer: str
    visibility: str
    local_path: str
    archived: bool
    kernel_version: str
    workflow_pin_sha: str | None = None
    repo_drift_release_sha: str | None = None

    def template_vars(self) -> dict[str, str]:
        return {
            "repo_name": self.repo_name,
            "slug": self.slug,
            "canonical_description": self.canonical_description,
            "profile": self.profile,
            "type": self.type,
            "owner": self.owner,
            "maintainer": self.maintainer,
            "visibility": self.visibility,
            "kernel_version": self.kernel_version,
            "workflow_pin_sha": self.workflow_pin_sha or "",
            "repo_drift_release_sha": self.repo_drift_release_sha or "",
            "ci_kind": self.ci_kind,
            "codeql_languages": self.codeql_languages or "",
        }

    @property
    def is_renderer_exempt(self) -> bool:
        return self.archived or self.profile == ARCHIVE_PROFILE

    @property
    def ci_kind(self) -> str:
        """CI runtime family for this profile: "node", "python", or "none"."""
        return PROFILE_CI_KIND.get(self.profile, "none")

    @property
    def codeql_languages(self) -> str | None:
        """CodeQL `languages` input for this profile, or None if not applicable."""
        return PROFILE_CODEQL_LANGUAGES.get(self.profile)

    @property
    def workflow_pin_ready(self) -> bool:
        """True once a real kernel release tag exists to pin reusable workflows to.

        Guards rendering of .github/workflows/{ci,codeql,docs-doctrine}.yml:
        rendering these with an empty pin would ship an unpinned reusable
        workflow reference fleet-wide (see ADR 0008). Stays False until
        catalog/kernel.yaml.workflow_pin_sha is set to a real tag.
        """
        return bool(self.workflow_pin_sha)

    @property
    def drift_pin_ready(self) -> bool:
        """True once a repo-drift release SHA exists to pin drift.yml to."""
        return self.workflow_pin_ready and bool(self.repo_drift_release_sha)


def load_kernel_config(path=KERNEL_YAML) -> KernelConfig:
    with open(path, encoding="utf-8") as f:
        raw = yaml.safe_load(f) or {}
    return KernelConfig(
        kernel_version=str(raw.get("kernel_version", "0.0.0")),
        workflow_pin_sha=raw.get("workflow_pin_sha"),
        kernel_sync_path_allowlist=list(raw.get("kernel_sync_path_allowlist", [])),
        auto_merge_enabled=bool(raw.get("auto_merge_enabled", False)),
        repo_drift_release_sha=raw.get("repo_drift_release_sha"),
        raw=raw,
    )


def _load_repos_raw(path=REPOS_JSON) -> list[dict[str, Any]]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data["repos"]


def load_repo_context(slug: str, kernel_cfg: KernelConfig, path=REPOS_JSON) -> RepoContext:
    for entry in _load_repos_raw(path):
        if entry.get("slug") == slug:
            return RepoContext(
                slug=entry["slug"],
                repo_name=entry.get("name", entry["slug"]),
                canonical_description=entry.get("canonical_description", ""),
                profile=entry.get("profile", "unclassified"),
                type=entry.get("type", "unknown"),
                owner=entry.get("owner", ""),
                maintainer=entry.get("maintainer", ""),
                visibility=entry.get("visibility", "private"),
                local_path=entry.get("local_path", ""),
                archived=bool(entry.get("archived", False)),
                kernel_version=kernel_cfg.kernel_version,
                workflow_pin_sha=kernel_cfg.workflow_pin_sha,
                repo_drift_release_sha=kernel_cfg.repo_drift_release_sha,
            )
    raise KeyError(f"No catalog entry for slug={slug!r}")


def iter_repo_contexts(kernel_cfg: KernelConfig, path=REPOS_JSON):
    for entry in _load_repos_raw(path):
        yield RepoContext(
            slug=entry["slug"],
            repo_name=entry.get("name", entry["slug"]),
            canonical_description=entry.get("canonical_description", ""),
            profile=entry.get("profile", "unclassified"),
            type=entry.get("type", "unknown"),
            owner=entry.get("owner", ""),
            maintainer=entry.get("maintainer", ""),
            visibility=entry.get("visibility", "private"),
            local_path=entry.get("local_path", ""),
            archived=bool(entry.get("archived", False)),
            kernel_version=kernel_cfg.kernel_version,
            workflow_pin_sha=kernel_cfg.workflow_pin_sha,
            repo_drift_release_sha=kernel_cfg.repo_drift_release_sha,
        )
