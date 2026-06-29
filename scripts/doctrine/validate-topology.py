"""Validate repo-topology coherence in catalog/repos.json.

Two declared axes:
  - bucket: ownership/layout axis; governs on-disk location via local_path.
  - type:   functional-role axis; drives the architecture role diagram.

Data-coherence checks run anywhere (no disk needed). Disk-existence checks run
only when --workspace-root is given, because sibling repos live outside this repo.

Exit codes: 0 = clean, 1 = problems found, 2 = error loading input.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ALLOWED_BUCKET = {
    "products", "personal", "family", "research", "ventures", "tools", "jobs-projects",
}
ALLOWED_TYPE = {
    "governance", "infra", "product", "research", "tooling", "archive",
}

# The hub itself has no bucket folder (local_path == "alawein").
HUB_SLUGS = {"alawein"}

REPOS_JSON = Path(__file__).resolve().parents[2] / "catalog" / "repos.json"


class TopologyError(Exception):
    pass


def load_repos(path: Path = REPOS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    repos = data.get("repos")
    if not isinstance(repos, list):
        raise TopologyError(f"{path}: no 'repos' list")
    return repos


def is_archived(r: dict) -> bool:
    return r.get("type") == "archive" or r.get("status") == "archived"


def check_repo_data(r: dict) -> list[str]:
    """Disk-free coherence checks for one repo. Returns a list of problems."""
    if not isinstance(r, dict):
        return [f"<non-mapping repo entry in repos.json>: {r!r}"]
    slug = r.get("slug") or "<no-slug>"
    problems: list[str] = []

    if r.get("bucket") not in ALLOWED_BUCKET:
        problems.append(f"{slug}: bucket {r.get('bucket')!r} not in allowed set")
    if r.get("type") not in ALLOWED_TYPE:
        problems.append(f"{slug}: type {r.get('type')!r} not in allowed set")

    if (r.get("type") == "archive") != (r.get("status") == "archived"):
        problems.append(
            f"{slug}: archived markers disagree "
            f"(type={r.get('type')!r}, status={r.get('status')!r})"
        )

    if slug in HUB_SLUGS:
        return problems

    lp = r.get("local_path")
    if not lp:
        problems.append(f"{slug}: missing local_path")
        return problems

    parts = Path(lp).parts
    if not is_archived(r):
        if len(parts) < 2:
            problems.append(
                f"{slug}: local_path {lp!r} must be 'bucket/slug'"
            )
        else:
            if parts[-1] != slug:
                problems.append(
                    f"{slug}: local_path folder {parts[-1]!r} does not match slug"
                )
            if parts[0] != r.get("bucket"):
                problems.append(
                    f"{slug}: local_path root {parts[0]!r} does not match "
                    f"bucket {r.get('bucket')!r}"
                )
    return problems


def check_repo_disk(r: dict, workspace_root: Path) -> list[str]:
    """Disk-existence check for one repo. Requires the workspace root."""
    slug = r.get("slug") or "<no-slug>"
    if slug in HUB_SLUGS:
        return []
    lp = r.get("local_path")
    if not lp:
        return []  # the data check already reports a missing local_path
    if not (workspace_root / lp).is_dir():
        return [f"{slug}: local_path {lp!r} does not exist under {workspace_root}"]
    return []


def validate(repos: list[dict], workspace_root: Path | None = None) -> list[str]:
    problems: list[str] = []
    for r in repos:
        problems.extend(check_repo_data(r))
        if workspace_root is not None:
            problems.extend(check_repo_disk(r, workspace_root))
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate repo-topology coherence.")
    parser.add_argument("--repos-json", type=Path, default=REPOS_JSON)
    parser.add_argument(
        "--workspace-root",
        type=Path,
        default=None,
        help="If given, also check that each local_path exists on disk.",
    )
    args = parser.parse_args(argv)
    try:
        repos = load_repos(args.repos_json)
    except (TopologyError, OSError, json.JSONDecodeError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    problems = validate(repos, args.workspace_root)
    if problems:
        print(f"topology: {len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
        return 1
    print(f"topology: OK ({len(repos)} repos)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
