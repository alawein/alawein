#!/usr/bin/env python3
"""Build derived catalog artifacts from the canonical Alawein catalog manifests."""

from __future__ import annotations

import argparse
import json
import sys

from catalog_lib import (
    GENERATED_DIR,
    INVENTORY_JSON,
    PROJECTS_JSON,
    build_github_metadata_feed,
    build_inventory_manifest,
    derive_discovery_feed,
    derive_projects_manifest,
    dump_json,
    load_catalogs,
    repo_entries,
    validate_catalogs,
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build derived Alawein catalog outputs")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if derived files would change.",
    )
    args = parser.parse_args(argv)

    catalogs = load_catalogs()
    issues = validate_catalogs(catalogs)
    errors = [issue for issue in issues if issue.level == "error"]
    if errors:
        for issue in issues:
            print(f"[{issue.level}] {issue.message}")
        return 1

    projects_manifest = derive_projects_manifest(catalogs)
    discovery_feed = derive_discovery_feed(catalogs)
    github_feed = build_github_metadata_feed(repo_entries(catalogs))
    inventory = build_inventory_manifest(repo_entries(catalogs))

    outputs = {
        PROJECTS_JSON: json.dumps(projects_manifest, indent=2) + "\n",
        GENERATED_DIR / "discovery-feed.json": json.dumps(discovery_feed, indent=2) + "\n",
        GENERATED_DIR / "repo-switcher.json": json.dumps(
            discovery_feed["projectSwitcher"], indent=2
        )
        + "\n",
        GENERATED_DIR / "github-metadata.json": json.dumps(github_feed, indent=2) + "\n",
        GENERATED_DIR / "asset-assignments.json": json.dumps(
            discovery_feed["assetAssignments"], indent=2
        )
        + "\n",
        INVENTORY_JSON: json.dumps(inventory, indent=2) + "\n",
    }

    changed_paths = []
    for path, rendered in outputs.items():
        current = path.read_text(encoding="utf-8") if path.exists() else ""
        if current != rendered:
            changed_paths.append(path)
            if not args.check:
                dump_json(path, json.loads(rendered))

    if args.check and changed_paths:
        print("Derived catalog outputs are out of date:")
        for path in changed_paths:
            print(f"- {path}")
        return 1

    for issue in issues:
        print(f"[{issue.level}] {issue.message}")
    if changed_paths and not args.check:
        print("Updated derived catalog outputs:")
        for path in changed_paths:
            print(f"- {path}")
    elif not changed_paths:
        print("Derived catalog outputs are up to date.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
