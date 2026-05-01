#!/usr/bin/env python3
"""Validate Alawein catalog manifests and report inventory drift."""

from __future__ import annotations

import argparse
import json
import sys

from catalog_lib import load_catalogs, validate_catalogs


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate Alawein catalog manifests")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as failures.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit the validation summary as JSON.",
    )
    args = parser.parse_args(argv)

    catalogs = load_catalogs()
    issues = validate_catalogs(catalogs)

    payload = {
        "errors": [issue.message for issue in issues if issue.level == "error"],
        "warnings": [issue.message for issue in issues if issue.level == "warning"],
    }

    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        for issue in issues:
            print(f"[{issue.level}] {issue.message}")
        if not issues:
            print("Catalog validation passed.")

    if payload["errors"]:
        return 1
    if args.strict and payload["warnings"]:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
