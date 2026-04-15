#!/usr/bin/env python3
"""Audit GitHub baseline coverage for alawein-managed repos."""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
WORKSPACE = ROOT.parent
MANIFEST = yaml.safe_load((ROOT / "github-baseline.yaml").read_text(encoding="utf-8")) or {}
REPOS = MANIFEST.get("repos", [])

BANNED_WIDGET_PATTERNS = [
    "github-readme-stats",
    "github-profile-trophy",
    "github-readme-activity-graph",
    "readme-typing-svg",
    "spotify-github-profile",
    "capsule-render",
]


def load_yaml(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def exact_path_exists(path: Path) -> bool:
    if not path.parent.exists():
        return False
    return any(child.name == path.name for child in path.parent.iterdir())


def add_error(errors: list[str], message: str) -> None:
    errors.append(message)


def check_readme(errors: list[str]) -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for pattern in BANNED_WIDGET_PATTERNS:
        if pattern in readme:
            add_error(errors, f"README contains banned widget pattern: {pattern}")


def check_repo(entry: dict, errors: list[str]) -> None:
    if entry.get("sync") != "auto":
        return

    repo_dir = WORKSPACE / entry["repo"]
    if not repo_dir.exists():
        add_error(errors, f"{entry['repo']}: repo directory missing")
        return

    required = [
        repo_dir / ".github" / "CODEOWNERS",
        repo_dir / ".github" / "PULL_REQUEST_TEMPLATE.md",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "bug_report.yml",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "feature_request.yml",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "config.yml",
        repo_dir / ".github" / "dependabot.yml",
        repo_dir / ".github" / "workflows" / "ci.yml",
    ]

    for path in required:
        if not exact_path_exists(path):
            add_error(errors, f"{entry['repo']}: missing {path.relative_to(repo_dir).as_posix()}")

    legacy = [
        repo_dir / ".github" / "pull_request_template.md",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "bug_report.md",
        repo_dir / ".github" / "ISSUE_TEMPLATE" / "feature_request.md",
    ]
    for path in legacy:
        if exact_path_exists(path):
            add_error(errors, f"{entry['repo']}: legacy template still present at {path.relative_to(repo_dir).as_posix()}")

    dependabot = repo_dir / ".github" / "dependabot.yml"
    if dependabot.exists():
        config = load_yaml(dependabot)
        ecosystems = {item.get("package-ecosystem") for item in config.get("updates", [])}
        if "github-actions" not in ecosystems:
            add_error(errors, f"{entry['repo']}: dependabot missing github-actions ecosystem")

    ci = repo_dir / ".github" / "workflows" / "ci.yml"
    if ci.exists():
        text = ci.read_text(encoding="utf-8")
        if "alawein/alawein/.github/workflows/ci-" not in text:
            add_error(errors, f"{entry['repo']}: ci.yml does not use central reusable workflows")

    codeql_path = repo_dir / ".github" / "workflows" / "codeql.yml"
    if entry.get("codeql_languages"):
        if not codeql_path.exists():
            add_error(errors, f"{entry['repo']}: missing .github/workflows/codeql.yml")
        else:
            text = codeql_path.read_text(encoding="utf-8")
            if "alawein/alawein/.github/workflows/codeql.yml@main" not in text:
                add_error(errors, f"{entry['repo']}: codeql.yml does not use central reusable workflow")
    elif codeql_path.exists():
        add_error(errors, f"{entry['repo']}: unexpected codeql.yml for repo without CodeQL languages")


def main() -> int:
    errors: list[str] = []
    check_readme(errors)
    for entry in REPOS:
        check_repo(entry, errors)

    if errors:
        print("GitHub baseline audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    managed = [entry["repo"] for entry in REPOS if entry.get("sync") == "auto"]
    print(f"GitHub baseline audit passed for {len(managed)} managed repos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
