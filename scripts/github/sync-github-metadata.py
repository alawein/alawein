#!/usr/bin/env python3
"""Sync GitHub repository metadata and workflow settings from the Alawein catalog feed."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "catalog"))
from catalog_lib import GENERATED_DIR

GITHUB_METADATA_JSON = GENERATED_DIR / "github-metadata.json"
DEFAULT_GITHUB_API_VERSION = "2022-11-28"
ROLLOUT_GROUPS = {
    "canary": ["design-system"],
    "cohort-1": ["workspace-tools", "knowledge-base", "alawein"],
}


def load_feed() -> dict[str, Any]:
    return json.loads(GITHUB_METADATA_JSON.read_text(encoding="utf-8"))


def build_args(gh_bin: str, endpoint: str, method: str, api_version: str) -> list[str]:
    return [
        gh_bin,
        "api",
        "--method",
        method,
        endpoint,
        "-H",
        "Accept: application/vnd.github+json",
        "-H",
        f"X-GitHub-Api-Version: {api_version}",
        "--input",
        "-",
    ]


def command_plan(
    repo_entry: dict[str, Any],
    gh_bin: str,
    api_version: str,
    include_custom_properties: bool,
) -> list[dict[str, Any]]:
    owner, repo_name = str(repo_entry["repo"]).split("/", 1)
    commands = [
        {
            "name": "repository",
            "method": "PATCH",
            "endpoint": f"repos/{owner}/{repo_name}",
            "argv": build_args(gh_bin, f"repos/{owner}/{repo_name}", "PATCH", api_version),
            "body": {
                "description": repo_entry["description"],
                "homepage": repo_entry.get("homepage") or "",
            },
        },
        {
            "name": "topics",
            "method": "PUT",
            "endpoint": f"repos/{owner}/{repo_name}/topics",
            "argv": build_args(gh_bin, f"repos/{owner}/{repo_name}/topics", "PUT", api_version),
            "body": {"names": sorted({topic.lower() for topic in repo_entry.get("topics") or []})},
        },
    ]
    actions_settings = repo_entry.get("actions_settings") or {}
    if actions_settings:
        commands.append(
            {
                "name": "actions_permissions",
                "method": "PUT",
                "endpoint": f"repos/{owner}/{repo_name}/actions/permissions/workflow",
                "argv": build_args(
                    gh_bin,
                    f"repos/{owner}/{repo_name}/actions/permissions/workflow",
                    "PUT",
                    api_version,
                ),
                "body": actions_settings,
            }
        )
    custom_properties = repo_entry.get("custom_properties") or {}
    if include_custom_properties and custom_properties:
        commands.append(
            {
                "name": "custom_properties",
                "method": "PATCH",
                "endpoint": f"repos/{owner}/{repo_name}/properties/values",
                "argv": build_args(
                    gh_bin,
                    f"repos/{owner}/{repo_name}/properties/values",
                    "PATCH",
                    api_version,
                ),
                "body": {
                    "properties": [
                        {"property_name": key, "value": value}
                        for key, value in custom_properties.items()
                    ]
                },
            }
        )
    return commands


def run_command(command: dict[str, Any]) -> dict[str, Any]:
    completed = subprocess.run(
        command["argv"],
        input=json.dumps(command["body"]),
        text=True,
        capture_output=True,
        check=True,
    )
    return {
        "name": command["name"],
        "method": command["method"],
        "endpoint": command["endpoint"],
        "status": "applied",
        "returncode": completed.returncode,
        "stdout": completed.stdout.strip(),
        "stderr": completed.stderr.strip(),
    }


def blocked_command_result(
    command: dict[str, Any],
    exc: subprocess.CalledProcessError,
) -> dict[str, Any]:
    return {
        "name": command["name"],
        "method": command["method"],
        "endpoint": command["endpoint"],
        "status": "blocked",
        "blocked_reason": "custom-properties-unsupported",
        "returncode": exc.returncode,
        "stdout": (exc.stdout or "").strip(),
        "stderr": (exc.stderr or "").strip(),
    }


def _repo_index(feed: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {str(repo["slug"]): repo for repo in (feed.get("repos") or [])}


def _select_group(feed: dict[str, Any], group_name: str) -> list[dict[str, Any]]:
    index = _repo_index(feed)
    missing = [slug for slug in ROLLOUT_GROUPS[group_name] if slug not in index]
    if missing:
        raise KeyError(
            f"Rollout group '{group_name}' references missing repo slugs: {', '.join(missing)}"
        )
    return [index[slug] for slug in ROLLOUT_GROUPS[group_name]]


def select_repos(
    feed: dict[str, Any],
    slug: str | None,
    cohort: str | None,
    include_all: bool,
    apply: bool,
) -> tuple[str, str, list[dict[str, Any]]]:
    repos = feed.get("repos") or []
    selection_count = sum(bool(value) for value in (slug, cohort, include_all))
    if selection_count > 1:
        raise ValueError("Choose only one of --repo, --cohort, or --all")
    if include_all:
        if apply:
            raise ValueError("Apply mode does not support --all. Use --cohort or --repo.")
        return ("all", "all", repos)
    if cohort:
        if cohort not in ROLLOUT_GROUPS:
            raise KeyError(
                f"Unknown rollout group '{cohort}'. Available groups: {', '.join(sorted(ROLLOUT_GROUPS))}"
            )
        return ("cohort", cohort, _select_group(feed, cohort))
    if slug:
        selected = [repo for repo in repos if repo.get("slug") == slug]
        if not selected:
            raise KeyError(f"Repo slug '{slug}' not found in {GITHUB_METADATA_JSON}")
        return ("repo", slug, selected)
    raise ValueError("Provide exactly one of --repo <slug>, --cohort <name>, or --all")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Sync GitHub repository descriptions, topics, workflow settings, and custom properties from the Alawein catalog feed"
    )
    parser.add_argument("--repo", default=None, help="Catalog repo slug to sync")
    parser.add_argument(
        "--cohort",
        default=None,
        help=f"Named rollout target ({', '.join(sorted(ROLLOUT_GROUPS))})",
    )
    parser.add_argument("--all", action="store_true", help="Sync every repo in github-metadata.json")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Execute gh api commands instead of only printing the sync plan",
    )
    parser.add_argument("--gh-bin", default="gh", help="GitHub CLI executable")
    parser.add_argument(
        "--api-version",
        default=DEFAULT_GITHUB_API_VERSION,
        help="GitHub API version header to send",
    )
    parser.add_argument(
        "--no-custom-properties",
        action="store_true",
        help="Skip repository custom property updates",
    )
    args = parser.parse_args(argv)

    try:
        feed = load_feed()
        selection_mode, selection_name, selected = select_repos(
            feed,
            args.repo,
            args.cohort,
            args.all,
            args.apply,
        )
    except (KeyError, ValueError) as exc:
        parser.exit(status=1, message=f"{exc}\n")

    payload: dict[str, Any] = {
        "generatedAt": feed.get("generatedAt"),
        "count": len(selected),
        "apply": args.apply,
        "api_version": args.api_version,
        "custom_properties": not args.no_custom_properties,
        "selection_mode": selection_mode,
        "selection_name": selection_name,
        "selected_repo_slugs": [repo["slug"] for repo in selected],
        "repos": [],
    }

    for repo in selected:
        commands = command_plan(
            repo,
            gh_bin=args.gh_bin,
            api_version=args.api_version,
            include_custom_properties=not args.no_custom_properties,
        )
        repo_payload: dict[str, Any] = {
            **repo,
            "status": "planned",
            "commands": [
                {
                    "name": command["name"],
                    "method": command["method"],
                    "endpoint": command["endpoint"],
                    "argv": command["argv"],
                    "body": command["body"],
                }
                for command in commands
            ],
        }
        if args.apply:
            results: list[dict[str, Any]] = []
            repo_payload["status"] = "applied"
            for command in commands:
                try:
                    results.append(run_command(command))
                except subprocess.CalledProcessError as exc:
                    if command["name"] != "custom_properties":
                        raise
                    repo_payload["status"] = "applied-with-blockers"
                    results.append(blocked_command_result(command, exc))
            repo_payload["results"] = results
        payload["repos"].append(repo_payload)

    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
