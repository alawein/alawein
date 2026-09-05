"""Validate fleet root README.md voice (banned register, em dashes, AI attribution).

Reuses ``validate.py`` rule engines. Scope is README-only so fleet CI stays
cheap and matches canon §D (Voice linter: README scope).

Modes:
  Catalog + GitHub API (hub CI):
    python validate-readme-voice.py --github-api
  Local fleet (workspace checkout):
    python validate-readme-voice.py --workspace-root /path/to/alawein
  Single repo (reusable doctrine workflow):
    python validate-readme-voice.py --repo-path ./repo \\
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
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

import validate as style_validate
from readme_contract import rendered_lines, sections, strip_markdown_prefix, uses_public_contract

REPOS_JSON = Path(__file__).resolve().parents[2] / "catalog" / "repos.json"
HUB_SLUGS = {"alawein"}
SKIP_TYPES = frozenset({"governance", "archive"})
README_CHECKS = {"voice", "emdash", "attribution"}


class ReadmeVoiceError(Exception):
    pass


def load_repos(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    repos = data.get("repos")
    if not isinstance(repos, list):
        raise ReadmeVoiceError(f"{path}: no 'repos' list")
    return repos


def find_repo_by_slug(repos: list[dict], repo_slug: str) -> dict | None:
    slug = repo_slug.split("/")[-1] if "/" in repo_slug else repo_slug
    for repo in repos:
        if repo.get("slug") == slug or repo.get("repo") == repo_slug:
            return repo
    return None


def should_skip(repo: dict) -> bool:
    slug = repo.get("slug") or ""
    if slug in HUB_SLUGS:
        return True
    if repo.get("visibility") != "public" and repo.get("type") in SKIP_TYPES:
        return True
    return False


def check_readme_text(readme: str, slug: str) -> list[str]:
    with tempfile.TemporaryDirectory(prefix="readme-voice-") as tmp:
        root = Path(tmp)
        path = root / "README.md"
        path.write_text(readme, encoding="utf-8")
        report = style_validate.Report()
        style_validate.run_checks([path], README_CHECKS, report, root=root)
        problems: list[str] = []
        for v in report.blocking:
            problems.append(f"{slug}: README {v.rule} at line {v.line}: {v.detail}")
        return problems


def check_public_contract(readme: str, repo: dict, *, allow_legacy_public: bool = False) -> list[str]:
    if not uses_public_contract(readme, repo, allow_legacy_public=allow_legacy_public):
        return []
    slug = repo.get("slug") or "<no-slug>"
    problems: list[str] = []
    prose_lines = rendered_lines(readme)
    normalized = [strip_markdown_prefix(line.text) for line in prose_lines]
    if any(re.match(r"^(Status|Category|Owner|Visibility|Purpose|Next action)\s*:", line, re.I)
           for line in normalized):
        problems.append(f"{slug}: public README contains a banned record-card field")
    if re.search(r"<!--\s*GENERATED(?::[^-]*)?-->", readme, re.IGNORECASE):
        problems.append(f"{slug}: public README contains a generated marker comment")
    if any(re.match(r"^Verification date\s*:", line, re.I) for line in normalized):
        problems.append(f"{slug}: public README contains a banned Verification date line")
    parsed = sections(readme)
    reproduction_ranges = [
        (section.line, parsed[i + 1].line if i + 1 < len(parsed) else 10**9)
        for i, section in enumerate(parsed)
        if section.heading.casefold() == "reproducibility"
    ]
    for line, normalized_line in zip(prose_lines, normalized):
        if not re.match(r"^Verified\s+\d{4}-\d{2}-\d{2}\s*:", normalized_line, re.I):
            continue
        if not any(start < line.number < end for start, end in reproduction_ranges):
            problems.append(
                f"{slug}: public README evidence date must appear under Reproducibility"
            )
    return problems


def check_repo_local(repo: dict, workspace_root: Path) -> list[str]:
    if should_skip(repo):
        return []
    slug = repo.get("slug") or "<no-slug>"
    lp = repo.get("local_path")
    if not lp:
        return [f"{slug}: missing local_path"]
    readme_path = workspace_root / lp / "README.md"
    if not readme_path.is_file():
        return [f"{slug}: missing README.md under {lp}"]
    readme = readme_path.read_text(encoding="utf-8")
    return check_readme_text(readme, slug) + check_public_contract(readme, repo)


def check_single_repo(repo_path: Path, repo: dict) -> list[str]:
    if should_skip(repo):
        return []
    slug = repo.get("slug") or "<no-slug>"
    readme_path = repo_path / "README.md"
    if not readme_path.is_file():
        return [f"{slug}: missing README.md"]
    readme = readme_path.read_text(encoding="utf-8")
    return check_readme_text(readme, slug) + check_public_contract(readme, repo)


def _github_request(path: str, token: str, *, retries: int = 2) -> tuple[int, bytes]:
    last_status = 0
    last_body = b""
    for attempt in range(retries + 1):
        req = urllib.request.Request(
            f"https://api.github.com{path}",
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {token}",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "alawein-readme-voice",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.status, resp.read()
        except urllib.error.HTTPError as exc:
            last_status, last_body = exc.code, exc.read()
            if last_status in {502, 503, 504} and attempt < retries:
                continue
            return last_status, last_body
    return last_status, last_body


def _github_repo(repo_full: str, token: str) -> dict | None:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(f"/repos/{owner}/{name}", token)
    if status == 404:
        return None
    if status != 200:
        raise ReadmeVoiceError(f"GitHub API {status} for {repo_full}: {body[:200]!r}")
    payload = json.loads(body.decode("utf-8"))
    return payload if isinstance(payload, dict) else None


def _github_default_branch(repo_full: str, token: str) -> str | None:
    payload = _github_repo(repo_full, token)
    if payload is None:
        return None
    branch = payload.get("default_branch")
    return branch if isinstance(branch, str) and branch else "main"


def _github_readme(repo_full: str, token: str, *, ref: str) -> str | None:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(
        f"/repos/{owner}/{name}/contents/README.md?ref={ref}",
        token,
    )
    if status == 404:
        return None
    if status != 200:
        raise ReadmeVoiceError(
            f"GitHub API {status} for {repo_full}:README.md@{ref}: {body[:200]!r}"
        )
    payload = json.loads(body.decode("utf-8"))
    raw = payload.get("content")
    if not raw:
        return ""
    return base64.b64decode(raw).decode("utf-8")


def check_repo_github(repo: dict, token: str, *, allow_legacy_public: bool = False) -> list[str]:
    if should_skip(repo):
        return []
    slug = repo.get("slug") or "<no-slug>"
    repo_full = repo.get("repo")
    if not repo_full or "/" not in repo_full:
        return [f"{slug}: missing repo field for GitHub API check"]
    try:
        meta = _github_repo(repo_full, token)
    except ReadmeVoiceError as exc:
        return [f"{slug}: {exc}"]
    if meta is None:
        return []
    if not meta.get("size"):
        return []
    default_branch = meta.get("default_branch") if isinstance(meta.get("default_branch"), str) else "main"
    if not default_branch:
        default_branch = "main"
    try:
        readme = _github_readme(repo_full, token, ref=default_branch)
    except ReadmeVoiceError as exc:
        return [f"{slug}: {exc}"]
    if readme is None:
        return [f"{slug}: missing README.md on {default_branch}"]
    return check_readme_text(readme, slug) + check_public_contract(readme, repo, allow_legacy_public=allow_legacy_public)


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
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser(description="Validate README voice contracts.")
    parser.add_argument("--repos-json", type=Path, default=REPOS_JSON)
    parser.add_argument("--workspace-root", type=Path, default=None)
    parser.add_argument(
        "--github-api",
        action="store_true",
        help="Fetch README from each repo default branch via GITHUB_TOKEN.",
    )
    parser.add_argument("--repo-path", type=Path, default=None)
    parser.add_argument("--repo-slug", type=str, default=None)
    parser.add_argument("--allow-legacy-public", action="store_true",
                        help="During staged rollout, accept the prior contract in GitHub fleet audits.")
    args = parser.parse_args(argv)
    if args.allow_legacy_public and (not args.github_api or args.repo_path is not None or args.workspace_root is not None):
        parser.error("--allow-legacy-public requires GitHub fleet mode only")

    try:
        repos = load_repos(args.repos_json)
    except (ReadmeVoiceError, OSError, json.JSONDecodeError) as exc:
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
        print(f"readme-voice: {len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
        return 1
    mode = "github-api" if args.github_api else "local"
    print(f"readme-voice: OK ({len(repos)} catalog entries, mode={mode})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
