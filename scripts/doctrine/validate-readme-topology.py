"""Validate fleet README section contracts and architecture topology docs.

Tier 1: required ## headings per catalog ``type``, accepting canon aliases.
Requires ``docs/architecture/topology.md`` with a non-empty fenced tree block.

Modes:
  Catalog + GitHub API (hub CI):
    python validate-readme-topology.py --github-api
  Local fleet (workspace checkout):
    python validate-readme-topology.py --workspace-root /path/to/alawein
  Single repo (reusable doctrine workflow):
    python validate-readme-topology.py --repo-path ./repo \\
        --repos-json catalog/repos.json --repo-slug alawein/bolts

Exit codes: 0 clean, 1 problems, 2 usage/load error.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Callable

REPOS_JSON = Path(__file__).resolve().parents[2] / "catalog" / "repos.json"
HUB_SLUGS = {"alawein"}
TOPOLOGY_REL = Path("docs/architecture/topology.md")

CATALOG_COLLECTION_SLUGS = frozenset({"mercor", "handshake-hai", "turing"})

SECTIONS_BY_TYPE: dict[str, list[str]] = {
    "product": [
        "Value proposition",
        "Demo and status",
        "Quick start",
        "Architecture",
        "Deployment",
        "Docs map",
        "Ownership",
    ],
    "research": [
        "Abstract",
        "Status",
        "Runtime requirements",
        "Reproducibility",
        "Datasets",
        "Docs map",
    ],
    "tooling": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Docs map",
        "Consumers",
        "Release and versioning",
    ],
    "infra": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Docs map",
        "Consumers",
        "Release and versioning",
    ],
    "archive": [
        "Status",
        "Archive reason",
        "Contents",
        "Access rules",
        "Docs map",
    ],
}

SECTIONS_CATALOG_COLLECTION: list[str] = [
    "Purpose",
    "Structure",
    "Add new work",
    "Separation policy",
    "Docs map",
]

# Tier 1 aliases from docs/governance/repo-topology-canon.md
SECTION_ALIASES: dict[str, list[str]] = {
    "Value proposition": ["Public value", "What it does", "What ships"],
    "Quick start": ["Setup", "Development", "Install"],
    "Docs map": ["Documentation", "Governance"],
    "Abstract": ["Public value", "About", "The Problem"],
    "Purpose": ["What it owns", "Public value"],
    "Install": ["Quick start", "Setup"],
    "Commands": ["Development", "Core commands", "Usage"],
    "Structure": ["Architecture"],
    "Add new work": ["Add work", "Commands"],
    "Separation policy": ["Consumers", "Release and versioning"],
}

OPTIONAL_SECTION: dict[tuple[str, str], Callable[[dict], bool]] = {
    ("product", "Deployment"): lambda r: (
        r.get("surface") not in ("web", "service")
        or (r.get("github_custom_properties") or {}).get("repo_archetype") == "game-project"
    ),
}

_HEADING_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
_TREE_BLOCK_RE = re.compile(r"```(?:text)?\s*\n(.+?\n)```", re.DOTALL)


class ReadmeTopologyError(Exception):
    pass


def load_repos(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    repos = data.get("repos")
    if not isinstance(repos, list):
        raise ReadmeTopologyError(f"{path}: no 'repos' list")
    return repos


def section_present(readme: str, section: str) -> bool:
    candidates = [section, *SECTION_ALIASES.get(section, [])]
    headings = {h.strip().casefold() for h in _HEADING_RE.findall(readme)}
    return any(name.casefold() in headings for name in candidates)


def topology_has_tree(content: str) -> bool:
    for block in _TREE_BLOCK_RE.findall(content):
        lines = [ln for ln in block.splitlines() if ln.strip()]
        if len(lines) >= 2:
            return True
    tree_match = re.search(r"^##\s+Tree\s*$", content, re.MULTILINE | re.IGNORECASE)
    if tree_match:
        tail = content[tree_match.end() :]
        tree_lines = [
            ln
            for ln in tail.splitlines()[:40]
            if "├──" in ln or "└──" in ln or (ln.strip().endswith("/") and "/" in ln)
        ]
        if len(tree_lines) >= 2:
            return True
    return False


def sections_for_repo(repo: dict) -> list[str]:
    slug = repo.get("slug") or ""
    if slug in CATALOG_COLLECTION_SLUGS:
        return SECTIONS_CATALOG_COLLECTION
    rtype = repo.get("type")
    if rtype in SECTIONS_BY_TYPE:
        return SECTIONS_BY_TYPE[rtype]
    return []


def check_readme_sections(readme: str, repo: dict) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    rtype = repo.get("type")
    if slug in HUB_SLUGS or rtype == "governance":
        return []
    required = sections_for_repo(repo)
    if not required:
        return [f"{slug}: unknown type {rtype!r} for README section check"]
    problems: list[str] = []
    for section in required:
        if OPTIONAL_SECTION.get((rtype, section), lambda _r: False)(repo):
            continue
        if not section_present(readme, section):
            problems.append(f"{slug}: missing README section {section!r} (type={rtype})")
    return problems


def check_topology_file(content: str | None, repo: dict) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    if slug in HUB_SLUGS or repo.get("type") == "governance":
        return []
    if content is None:
        return [f"{slug}: missing {TOPOLOGY_REL.as_posix()}"]
    if not topology_has_tree(content):
        return [f"{slug}: {TOPOLOGY_REL.as_posix()} has no ASCII tree fenced block"]
    return []


def check_repo_local(repo: dict, workspace_root: Path) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    if slug in HUB_SLUGS:
        return []
    lp = repo.get("local_path")
    if not lp:
        return [f"{slug}: missing local_path"]
    root = workspace_root / lp
    readme_path = root / "README.md"
    if not readme_path.is_file():
        return [f"{slug}: missing README.md under {lp}"]
    readme = readme_path.read_text(encoding="utf-8")
    topo_path = root / TOPOLOGY_REL
    topo = topo_path.read_text(encoding="utf-8") if topo_path.is_file() else None
    return check_readme_sections(readme, repo) + check_topology_file(topo, repo)


def _github_request(path: str, token: str) -> tuple[int, bytes]:
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()


def _github_file(repo_full: str, file_path: str, token: str) -> str | None:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(
        f"/repos/{owner}/{name}/contents/{file_path}?ref=main",
        token,
    )
    if status == 404:
        return None
    if status != 200:
        raise ReadmeTopologyError(
            f"GitHub API {status} for {repo_full}:{file_path}: {body[:200]!r}"
        )
    payload = json.loads(body.decode("utf-8"))
    raw = payload.get("content")
    if not raw:
        return ""
    return base64.b64decode(raw).decode("utf-8")


def _github_repo_exists(repo_full: str, token: str) -> bool:
    owner, name = repo_full.split("/", 1)
    status, _ = _github_request(f"/repos/{owner}/{name}", token)
    return status == 200


def check_repo_github(repo: dict, token: str) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    if slug in HUB_SLUGS:
        return []
    repo_full = repo.get("repo")
    if not repo_full or "/" not in repo_full:
        return [f"{slug}: missing repo field for GitHub API check"]
    if not _github_repo_exists(repo_full, token):
        return []
    try:
        readme = _github_file(repo_full, "README.md", token)
        topo = _github_file(repo_full, TOPOLOGY_REL.as_posix(), token)
    except ReadmeTopologyError as exc:
        return [f"{slug}: {exc}"]
    if readme is None:
        return [f"{slug}: missing README.md on main"]
    return check_readme_sections(readme, repo) + check_topology_file(topo, repo)


def find_repo_by_slug(repos: list[dict], repo_slug: str) -> dict | None:
    """Match ``alawein/bolts`` or catalog slug ``bolts``."""
    slug = repo_slug.split("/")[-1] if "/" in repo_slug else repo_slug
    for repo in repos:
        if repo.get("slug") == slug or repo.get("repo") == repo_slug:
            return repo
    return None


def check_single_repo(repo_path: Path, repo: dict) -> list[str]:
    readme_path = repo_path / "README.md"
    if not readme_path.is_file():
        return [f"{repo.get('slug')}: missing README.md"]
    readme = readme_path.read_text(encoding="utf-8")
    topo_path = repo_path / TOPOLOGY_REL
    topo = topo_path.read_text(encoding="utf-8") if topo_path.is_file() else None
    return check_readme_sections(readme, repo) + check_topology_file(topo, repo)


def validate_all(
    repos: list[dict],
    *,
    workspace_root: Path | None = None,
    github_token: str | None = None,
) -> list[str]:
    problems: list[str] = []
    for repo in repos:
        if workspace_root is not None:
            problems.extend(check_repo_local(repo, workspace_root))
        elif github_token:
            problems.extend(check_repo_github(repo, github_token))
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate README topology contracts.")
    parser.add_argument("--repos-json", type=Path, default=REPOS_JSON)
    parser.add_argument("--workspace-root", type=Path, default=None)
    parser.add_argument(
        "--github-api",
        action="store_true",
        help="Fetch README and topology from GitHub main via GITHUB_TOKEN.",
    )
    parser.add_argument("--repo-path", type=Path, default=None, help="Single-repo checkout root.")
    parser.add_argument(
        "--repo-slug",
        type=str,
        default=None,
        help="GitHub repo slug owner/name or catalog slug for --repo-path mode.",
    )
    args = parser.parse_args(argv)

    try:
        repos = load_repos(args.repos_json)
    except (ReadmeTopologyError, OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    if args.repo_path is not None:
        if not args.repo_slug:
            print("error: --repo-slug required with --repo-path", file=sys.stderr)
            return 2
        repo = find_repo_by_slug(repos, args.repo_slug)
        if repo is None:
            print(f"error: no catalog entry for {args.repo_slug!r}", file=sys.stderr)
            return 2
        problems = check_single_repo(args.repo_path, repo)
    elif args.github_api:
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            print("error: GITHUB_TOKEN required for --github-api", file=sys.stderr)
            return 2
        problems = validate_all(repos, github_token=token)
    elif args.workspace_root is not None:
        problems = validate_all(repos, workspace_root=args.workspace_root)
    else:
        print("error: specify --github-api, --workspace-root, or --repo-path", file=sys.stderr)
        return 2

    if problems:
        print(f"readme-topology: {len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
        return 1
    mode = "github-api" if args.github_api else "local"
    print(f"readme-topology: OK ({len(repos)} catalog entries, mode={mode})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
