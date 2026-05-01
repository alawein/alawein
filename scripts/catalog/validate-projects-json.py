#!/usr/bin/env python3
"""Validate projects.json against projects.schema.json and derived invariants.

Complements scripts/validate-catalog.py (which owns catalog/repos.json) by
checking the derived surface that downstream consumers (Notion, profile
README) read from. Catches three classes of drift that catalog validation
alone does not:

1. Schema drift -- projects.json shape no longer matches projects.schema.json.
2. Path drift -- catalog/repos.json local_path values no longer resolve on
   disk relative to the workspace root.
3. Lifecycle drift -- a projects.json entry is marked category=archived but
   the source catalog entry still says lifecycle=active (or status=active),
   which means CI is still running against a repo the portfolio has retired.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

try:
    import jsonschema
except ImportError:
    print(
        "validate-projects-json.py requires jsonschema>=4.18. "
        "Install with: python -m pip install 'jsonschema>=4.18'",
        file=sys.stderr,
    )
    sys.exit(2)


ROOT = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = ROOT.parent
PROJECTS = ROOT / "projects.json"
SCHEMA = ROOT / "projects.schema.json"
CATALOG_REPOS = ROOT / "catalog" / "repos.json"

PROJECT_SECTIONS = ("featured", "research", "notion_sync", "infrastructure")


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_schema(projects: dict[str, Any]) -> list[str]:
    schema = load_json(SCHEMA)
    validator = jsonschema.Draft202012Validator(schema)
    errors: list[str] = []
    for err in sorted(validator.iter_errors(projects), key=lambda e: list(e.absolute_path)):
        location = "/".join(str(part) for part in err.absolute_path) or "<root>"
        errors.append(f"schema: {location}: {err.message}")
    return errors


def validate_local_paths(catalog_repos: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    for repo in catalog_repos:
        local = repo.get("local_path")
        slug = repo.get("slug", "<unknown>")
        if not local:
            continue
        resolved = (WORKSPACE_ROOT / local).resolve()
        if not resolved.exists():
            errors.append(
                f"local_path: '{local}' (slug={slug}) does not resolve relative to workspace root"
            )
    return errors


def validate_archived_without_active_ci(
    projects: dict[str, Any],
    catalog_repos: list[dict[str, Any]],
) -> list[str]:
    catalog_by_slug = {repo.get("slug"): repo for repo in catalog_repos}
    errors: list[str] = []
    for section in PROJECT_SECTIONS:
        entries = projects.get(section) or []
        for entry in entries:
            category = (entry.get("category") or "").lower()
            if category != "archived":
                continue
            slug = entry.get("slug")
            catalog_entry = catalog_by_slug.get(slug)
            if catalog_entry is None:
                errors.append(
                    f"archived-orphan: projects.json[{section}] entry '{slug}' "
                    f"has no corresponding catalog/repos.json entry"
                )
                continue
            lifecycle = (catalog_entry.get("lifecycle") or "").lower()
            status = (catalog_entry.get("status") or "").lower()
            if lifecycle != "archived":
                errors.append(
                    f"archived-drift: '{slug}' marked archived in projects.json[{section}] "
                    f"but catalog lifecycle='{lifecycle or 'unset'}'"
                )
            if status == "active":
                errors.append(
                    f"archived-ci: '{slug}' marked archived in projects.json[{section}] "
                    f"but catalog status='active' -- CI may still be running"
                )
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate projects.json")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat local_path drift as an error instead of a warning.",
    )
    args = parser.parse_args(argv)

    if not PROJECTS.exists():
        print(f"projects.json not found at {PROJECTS}", file=sys.stderr)
        return 2
    if not SCHEMA.exists():
        print(f"projects.schema.json not found at {SCHEMA}", file=sys.stderr)
        return 2
    if not CATALOG_REPOS.exists():
        print(f"catalog/repos.json not found at {CATALOG_REPOS}", file=sys.stderr)
        return 2

    projects = load_json(PROJECTS)
    catalog = load_json(CATALOG_REPOS).get("repos", [])

    errors: list[str] = []
    warnings: list[str] = []

    errors.extend(validate_schema(projects))
    errors.extend(validate_archived_without_active_ci(projects, catalog))

    path_issues = validate_local_paths(catalog)
    # Path drift is a warning by default because CI runs in an ephemeral
    # checkout that does not include sibling workspace repos; --strict is for
    # local runs on a fully populated workspace.
    if args.strict:
        errors.extend(path_issues)
    else:
        warnings.extend(path_issues)

    for warn in warnings:
        print(f"[warning] {warn}", file=sys.stderr)
    for err in errors:
        print(f"[error] {err}", file=sys.stderr)

    if errors:
        print(
            f"\nprojects.json validation failed with {len(errors)} error(s) "
            f"and {len(warnings)} warning(s).",
            file=sys.stderr,
        )
        return 1

    print(f"projects.json validation passed ({len(warnings)} warning(s)).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
