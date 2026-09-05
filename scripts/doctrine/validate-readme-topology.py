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

from readme_contract import meaningful_body, rendered_lines, runnable_body, sections, uses_public_contract

REPOS_JSON = Path(__file__).resolve().parents[2] / "catalog" / "repos.json"
HUB_SLUGS = {"alawein"}
TOPOLOGY_REL = Path("docs/architecture/topology.md")

CATALOG_COLLECTION_SLUGS = frozenset({"mercor", "handshake", "turing"})

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

PUBLIC_REQUIRED_SECTIONS = ["Run it", "What it is", "What it is not", "Docs map", "License"]

SECTIONS_CATALOG_COLLECTION: list[str] = [
    "Purpose",
    "Structure",
    "Add new work",
    "Separation policy",
    "Docs map",
]

# Tier 1 aliases from docs/governance/repo-topology-canon.md
SECTION_ALIASES: dict[str, list[str]] = {
    "The claim": ["What Fallax measures", "Status"],
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


def check_readme_sections(readme: str, repo: dict, *, allow_legacy_public: bool = False) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    rtype = repo.get("type")
    if slug in HUB_SLUGS:
        return []
    is_public = uses_public_contract(readme, repo, allow_legacy_public=allow_legacy_public)
    if is_public:
        required = list(PUBLIC_REQUIRED_SECTIONS)
        if repo.get("status") not in {"archived", "frozen", "deprecated"}:
            required.insert(0, "The claim")
    else:
        required = sections_for_repo(repo)
    if not required:
        return [f"{slug}: unknown type {rtype!r} for README section check"]
    problems: list[str] = []
    if not is_public:
        for section in required:
            if OPTIONAL_SECTION.get((rtype, section), lambda _r: False)(repo):
                continue
            if not section_present(readme, section):
                problems.append(f"{slug}: missing README section {section!r} (type={rtype})")
    if is_public:
        parsed = sections(readme)
        canonical = ["The claim", *PUBLIC_REQUIRED_SECTIONS]
        if repo.get("status") in {"archived", "frozen", "deprecated"}:
            canonical.remove("The claim")

        def canonical_name(heading: str) -> str | None:
            folded = heading.casefold()
            for expected in canonical:
                names = [expected, *SECTION_ALIASES.get(expected, [])]
                if folded in {name.casefold() for name in names}:
                    return expected
            return None

        observed = [name for section in parsed if (name := canonical_name(section.heading))]
        positions = [canonical.index(name) for name in observed]
        if positions != sorted(positions):
            problems.append(f"{slug}: public README sections are not in canonical order")

        by_name = {
            name: section
            for section in parsed
            if (name := canonical_name(section.heading)) is not None
        }
        for name in required:
            if name not in by_name:
                problems.append(f"{slug}: missing README section {name!r} (type={rtype})")
        for name in canonical:
            section = by_name.get(name)
            if section is not None and not meaningful_body(section) and name != "Run it":
                problems.append(f"{slug}: {name!r} has an empty body")

        first_screen_required = ["Run it"]
        if "The claim" in canonical:
            first_screen_required.insert(0, "The claim")
        raw_lines = readme.splitlines()

        def has_fenced_invocation(section, *, through_line=None):
            next_heading = next(
                (candidate.line for candidate in parsed if candidate.line > section.line),
                len(raw_lines) + 1,
            )
            end = min(through_line or len(raw_lines), next_heading - 1)
            body = "\n".join(raw_lines[section.line:min(end, len(raw_lines))])
            match = re.search(
                r"^\s*```(?:bash|sh|shell|console|powershell|ps1)?\s*$\n([\s\S]*?)^\s*```\s*$",
                body,
                re.MULTILINE,
            )
            return bool(match and match.group(1).strip())

        for name in first_screen_required:
            section = by_name.get(name)
            if section is None or section.line > 40:
                problems.append(f"{slug}: {name!r} must appear in the first 40 lines")
            elif not meaningful_body(section, through_line=40) and not (
                name == "Run it" and has_fenced_invocation(section, through_line=40)
            ):
                problems.append(f"{slug}: {name!r} has an empty body in the first 40 lines")

        run_section = by_name.get("Run it")
        if run_section is not None:
            if not runnable_body(
                run_section, through_line=40
            ) and not has_fenced_invocation(run_section, through_line=40):
                problems.append(
                    f"{slug}: 'Run it' must contain a runnable invocation in the first 40 lines"
                )

        prose = "\n".join(line.text for line in rendered_lines(readme))
        linked_badges = re.findall(r"\[!\[[^]]*\]\([^)]*\)\]\([^)]*\)", prose)
        shield_badges = re.findall(
            r"(?<!\[)!\[[^]]*\]\([^)]*(?:shields\.io|badge)[^)]*\)",
            prose,
            re.IGNORECASE,
        )
        badges = len(linked_badges) + len(shield_badges)
        if badges > 3:
            problems.append(f"{slug}: public README has {badges} badges; maximum is 3")
    return problems


def check_topology_file(content: str | None, repo: dict, *, legacy_public: bool = False) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    if (slug in HUB_SLUGS or repo.get("type") == "governance"
            or (repo.get("visibility") == "public" and not legacy_public)):
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


def _github_repo(repo_full: str, token: str) -> dict | None:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(f"/repos/{owner}/{name}", token)
    if status == 404:
        return None
    if status != 200:
        raise ReadmeTopologyError(
            f"GitHub API {status} for {repo_full}: {body[:200]!r}"
        )
    payload = json.loads(body.decode("utf-8"))
    return payload if isinstance(payload, dict) else None


def _github_default_branch(repo_full: str, token: str) -> str | None:
    payload = _github_repo(repo_full, token)
    if payload is None:
        return None
    branch = payload.get("default_branch")
    return branch if isinstance(branch, str) and branch else "main"


def _github_file(
    repo_full: str, file_path: str, token: str, *, ref: str
) -> str | None:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(
        f"/repos/{owner}/{name}/contents/{file_path}?ref={ref}",
        token,
    )
    if status == 404:
        return None
    if status != 200:
        raise ReadmeTopologyError(
            f"GitHub API {status} for {repo_full}:{file_path}@{ref}: {body[:200]!r}"
        )
    payload = json.loads(body.decode("utf-8"))
    raw = payload.get("content")
    if not raw:
        return ""
    return base64.b64decode(raw).decode("utf-8")


def check_repo_github(repo: dict, token: str, *, allow_legacy_public: bool = False) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    if slug in HUB_SLUGS:
        return []
    repo_full = repo.get("repo")
    if not repo_full or "/" not in repo_full:
        return [f"{slug}: missing repo field for GitHub API check"]
    try:
        meta = _github_repo(repo_full, token)
    except ReadmeTopologyError as exc:
        return [f"{slug}: {exc}"]
    if meta is None:
        return []
    if not meta.get("size"):
        return []
    default_branch = meta.get("default_branch") if isinstance(meta.get("default_branch"), str) else "main"
    if not default_branch:
        default_branch = "main"
    try:
        readme = _github_file(repo_full, "README.md", token, ref=default_branch)
        topo = _github_file(
            repo_full, TOPOLOGY_REL.as_posix(), token, ref=default_branch
        )
    except ReadmeTopologyError as exc:
        return [f"{slug}: {exc}"]
    if readme is None:
        return [f"{slug}: missing README.md on {default_branch}"]
    legacy_public = repo.get("visibility") == "public" and not uses_public_contract(
        readme, repo, allow_legacy_public=allow_legacy_public
    )
    return check_readme_sections(readme, repo, allow_legacy_public=allow_legacy_public) + check_topology_file(
        topo, repo, legacy_public=legacy_public
    )


def find_repo_by_slug(repos: list[dict], repo_slug: str) -> dict | None:
    """Match ``alawein/bolts`` or catalog slug ``bolts``."""
    slug = repo_slug.split("/")[-1] if "/" in repo_slug else repo_slug
    for repo in repos:
        if repo.get("slug") == slug or repo.get("repo") == repo_slug:
            return repo
    return None


def check_single_repo(repo_path: Path, repo: dict) -> list[str]:
    slug = repo.get("slug") or "<no-slug>"
    if slug in HUB_SLUGS:
        return []
    readme_path = repo_path / "README.md"
    if not readme_path.is_file():
        return [f"{slug}: missing README.md"]
    readme = readme_path.read_text(encoding="utf-8")
    topo_path = repo_path / TOPOLOGY_REL
    topo = topo_path.read_text(encoding="utf-8") if topo_path.is_file() else None
    return check_readme_sections(readme, repo) + check_topology_file(topo, repo)


def validate_all(
    repos: list[dict],
    *,
    workspace_root: Path | None = None,
    github_token: str | None = None,
    allow_legacy_public: bool = False,
) -> list[str]:
    problems: list[str] = []
    for repo in repos:
        if workspace_root is not None:
            problems.extend(check_repo_local(repo, workspace_root))
        elif github_token:
            problems.extend(check_repo_github(repo, github_token, allow_legacy_public=allow_legacy_public))
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
    parser.add_argument("--allow-legacy-public", action="store_true",
                        help="During staged rollout, accept the prior contract in GitHub fleet audits.")
    args = parser.parse_args(argv)
    if args.allow_legacy_public and (not args.github_api or args.repo_path is not None or args.workspace_root is not None):
        parser.error("--allow-legacy-public requires GitHub fleet mode only")

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
        problems = validate_all(repos, github_token=token, allow_legacy_public=args.allow_legacy_public)
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
