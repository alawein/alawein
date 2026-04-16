#!/usr/bin/env python3
"""Sync Vercel project settings from the generated Alawein catalog feed."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any
from urllib.parse import quote

from catalog_lib import GENERATED_DIR
from vercel_alias_audit import api_request, load_token

VERCEL_PROJECTS_JSON = GENERATED_DIR / "vercel-projects.json"
FIELD_MAP = {
    "framework": "framework",
    "install_command": "installCommand",
    "build_command": "buildCommand",
    "output_directory": "outputDirectory",
    "root_directory": "rootDirectory",
    "node_version": "nodeVersion",
}


def load_feed() -> dict[str, Any]:
    return json.loads(VERCEL_PROJECTS_JSON.read_text(encoding="utf-8"))


def current_settings(project: dict[str, Any]) -> dict[str, str]:
    return {
        field: str(project.get(api_field) or "")
        for field, api_field in FIELD_MAP.items()
    }


def desired_settings(entry: dict[str, Any]) -> dict[str, str]:
    return {
        field: str(entry.get(field) or "")
        for field in FIELD_MAP
    }


def diff_settings(current: dict[str, str], desired: dict[str, str]) -> dict[str, dict[str, str]]:
    return {
        field: {"current": current[field], "desired": desired[field]}
        for field in FIELD_MAP
        if current[field] != desired[field]
    }


def select_projects(feed: dict[str, Any], slug: str | None, include_all: bool) -> list[dict[str, Any]]:
    projects = feed.get("projects") or []
    if include_all:
        return projects
    if slug:
        selected = [project for project in projects if project.get("slug") == slug]
        if not selected:
            raise KeyError(f"Repo slug '{slug}' not found in {VERCEL_PROJECTS_JSON}")
        return selected
    raise ValueError("Provide --repo <slug> or --all")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Sync Vercel project settings from catalog/generated/vercel-projects.json"
    )
    parser.add_argument("--repo", default=None, help="Catalog repo slug to sync")
    parser.add_argument(
        "--all", action="store_true", help="Sync every Vercel-managed catalog repo"
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Execute Vercel API updates instead of only printing the plan",
    )
    parser.add_argument(
        "--token",
        default=None,
        help="Vercel API token. Defaults to $VERCEL_TOKEN or local CLI auth",
    )
    args = parser.parse_args(argv)

    try:
        feed = load_feed()
        selected = select_projects(feed, args.repo, args.all)
    except (KeyError, ValueError) as exc:
        parser.exit(status=1, message=f"{exc}\n")

    token = load_token(args.token) if args.apply or selected else None
    payload: dict[str, Any] = {
        "generatedAt": feed.get("generatedAt"),
        "count": len(selected),
        "apply": args.apply,
        "projects": [],
    }

    for entry in selected:
        project_id = str(entry.get("project_id") or "")
        team_id = str(entry.get("team_id") or "")
        repo_payload: dict[str, Any] = {
            **entry,
            "status": "planned",
        }
        if not project_id or not team_id:
            repo_payload["status"] = "blocked"
            repo_payload["blocked_reason"] = "missing-project-link"
            payload["projects"].append(repo_payload)
            continue

        project = api_request(
            token,
            method="GET",
            path=f"/v9/projects/{quote(project_id)}?teamId={quote(team_id)}",
        )
        current = current_settings(project)
        desired = desired_settings(entry)
        diff = diff_settings(current, desired)
        repo_payload["current_settings"] = current
        repo_payload["desired_settings"] = desired
        repo_payload["diff"] = diff

        if not diff:
            repo_payload["status"] = "in-sync"
            payload["projects"].append(repo_payload)
            continue

        if args.apply:
            update_body = {
                api_field: desired[field]
                for field, api_field in FIELD_MAP.items()
                if field in diff
            }
            result = api_request(
                token,
                method="PATCH",
                path=f"/v9/projects/{quote(project_id)}?teamId={quote(team_id)}",
                body=update_body,
            )
            repo_payload["status"] = "applied"
            repo_payload["result"] = {
                key: result.get(key)
                for key in [
                    "name",
                    "framework",
                    "nodeVersion",
                    "installCommand",
                    "buildCommand",
                    "outputDirectory",
                    "rootDirectory",
                ]
            }

        payload["projects"].append(repo_payload)

    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
