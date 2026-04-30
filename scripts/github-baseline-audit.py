#!/usr/bin/env python3
"""Audit GitHub baseline coverage for alawein-managed repos."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
WORKSPACE = ROOT.parent
MANIFEST = yaml.safe_load((ROOT / "github-baseline.yaml").read_text(encoding="utf-8")) or {}
REPOS = MANIFEST.get("repos", [])
WORKFLOW_REF = str(MANIFEST.get("workflow_ref") or "").strip()
WORKFLOW_DIR = ROOT / ".github" / "workflows"

BANNED_WIDGET_PATTERNS = [
    "github-readme-stats",
    "github-profile-trophy",
    "github-readme-activity-graph",
    "readme-typing-svg",
    "spotify-github-profile",
    "capsule-render",
]

# Patterns intentionally used in the control-plane org profile README (decorative
# header/banner use, not vanity-stat inflation). Excluded from check_readme.
CONTROL_PLANE_README_EXEMPT = {"capsule-render"}
PINNED_REF_RE = re.compile(r"^[0-9a-f]{40}$")
USES_LINE_RE = re.compile(r"^\s*-?\s*uses:\s*([^\s#]+)")


def load_yaml(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def exact_path_exists(path: Path) -> bool:
    if not path.parent.exists():
        return False
    return any(child.name == path.name for child in path.parent.iterdir())


def add_error(errors: list[str], message: str) -> None:
    errors.append(message)


def check_manifest(errors: list[str]) -> None:
    if not PINNED_REF_RE.fullmatch(WORKFLOW_REF):
        add_error(errors, "github-baseline.yaml workflow_ref must be a 40-character SHA")


def check_readme(errors: list[str]) -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for pattern in BANNED_WIDGET_PATTERNS:
        if pattern in CONTROL_PLANE_README_EXEMPT:
            continue
        if pattern in readme:
            add_error(errors, f"README contains banned widget pattern: {pattern}")


def check_control_plane_workflows(errors: list[str]) -> None:
    for path in sorted(WORKFLOW_DIR.glob("*.yml")):
        for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            match = USES_LINE_RE.match(stripped)
            if not match:
                continue
            target = match.group(1)
            if "@" not in target:
                add_error(errors, f"{path.relative_to(ROOT).as_posix()}:{line_number}: uses target missing ref: {target}")
                continue
            action, ref = target.rsplit("@", maxsplit=1)
            if action.startswith("alawein/alawein/.github/workflows/"):
                if ref != WORKFLOW_REF:
                    add_error(
                        errors,
                        f"{path.relative_to(ROOT).as_posix()}:{line_number}: reusable workflow ref '{ref}' does not match workflow_ref '{WORKFLOW_REF}'",
                    )
                continue
            if not PINNED_REF_RE.fullmatch(ref):
                add_error(
                    errors,
                    f"{path.relative_to(ROOT).as_posix()}:{line_number}: action ref must be SHA pinned, found '{target}'",
                )


def internal_workflow_refs(text: str) -> list[str]:
    refs: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        match = USES_LINE_RE.match(stripped)
        if not match:
            continue
        target = match.group(1)
        if target.startswith("alawein/alawein/.github/workflows/") and "@" in target:
            refs.append(target.rsplit("@", maxsplit=1)[-1])
    return refs


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
        refs = internal_workflow_refs(text)
        if "alawein/alawein/.github/workflows/ci-" not in text:
            add_error(errors, f"{entry['repo']}: ci.yml does not use central reusable workflows")
        elif not refs:
            add_error(errors, f"{entry['repo']}: ci.yml missing reusable workflow ref")
        elif any(ref != WORKFLOW_REF for ref in refs):
            add_error(errors, f"{entry['repo']}: ci.yml reusable workflow refs must equal workflow_ref {WORKFLOW_REF}")

    codeql_path = repo_dir / ".github" / "workflows" / "codeql.yml"
    if entry.get("codeql_languages"):
        if not codeql_path.exists():
            add_error(errors, f"{entry['repo']}: missing .github/workflows/codeql.yml")
        else:
            text = codeql_path.read_text(encoding="utf-8")
            refs = internal_workflow_refs(text)
            if "alawein/alawein/.github/workflows/codeql.yml@" not in text:
                add_error(errors, f"{entry['repo']}: codeql.yml does not use central reusable workflow")
            elif refs != [WORKFLOW_REF]:
                add_error(errors, f"{entry['repo']}: codeql.yml must use workflow_ref {WORKFLOW_REF}")
    elif codeql_path.exists():
        add_error(errors, f"{entry['repo']}: unexpected codeql.yml for repo without CodeQL languages")


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit GitHub baseline coverage.")
    parser.add_argument(
        "--local",
        action="store_true",
        help="Skip per-repo checks that require sibling repos on disk (for CI use).",
    )
    args = parser.parse_args()

    errors: list[str] = []
    check_manifest(errors)
    check_control_plane_workflows(errors)
    if not args.local:
        # check_readme scans for banned widgets in sibling repo READMEs.
        # In --local mode we only have the control-plane repo; its README is the
        # org GitHub profile page, which has design latitude and is exempt.
        check_readme(errors)
        for entry in REPOS:
            check_repo(entry, errors)

    if errors:
        print("GitHub baseline audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    if args.local:
        print("GitHub baseline audit passed (control-plane only; --local skips repo checks).")
    else:
        managed = [entry["repo"] for entry in REPOS if entry.get("sync") == "auto"]
        print(f"GitHub baseline audit passed for {len(managed)} managed repos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
