#!/usr/bin/env python3
"""Validate agent/integration inventory and detect Slack topology drift."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from agent_integrations_lib import (
    INVENTORY_PATH,
    SNAPSHOT_PATH,
    load_inventory,
    validate_inventory,
)


def write_snapshot(payload: dict, path: Path) -> None:
    snapshot = {
        "generated_from": "catalog/agent-integrations.yaml",
        "lastVerified": payload.get("lastVerified"),
        "slack_channels": [
            {
                "id": row["id"],
                "slack_id": row["slack_id"],
                "cursor_can_read": row.get("cursor_can_read"),
            }
            for row in payload.get("slack_channels", [])
        ],
        "agents": [{"id": row["id"]} for row in payload.get("agents", [])],
        "integrations": [{"id": row["id"]} for row in payload.get("integrations", [])],
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Validate catalog/agent-integrations.yaml and drift baseline",
    )
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
    parser.add_argument(
        "--no-snapshot",
        action="store_true",
        help="Skip snapshot drift comparison.",
    )
    parser.add_argument(
        "--write-snapshot",
        action="store_true",
        help="Refresh catalog/generated/agent-integrations.snapshot.json.",
    )
    parser.add_argument(
        "--inventory",
        type=Path,
        default=INVENTORY_PATH,
        help="Path to agent-integrations.yaml",
    )
    args = parser.parse_args(argv)

    payload = load_inventory(args.inventory)
    if args.write_snapshot:
        write_snapshot(payload, SNAPSHOT_PATH)

    issues = validate_inventory(
        payload,
        strict=args.strict,
        check_snapshot=not args.no_snapshot,
    )
    errors = [issue.message for issue in issues if issue.level == "error"]
    warnings = [issue.message for issue in issues if issue.level == "warning"]

    if args.json:
        print(json.dumps({"errors": errors, "warnings": warnings}, indent=2))
    else:
        for issue in issues:
            print(f"[{issue.level}] {issue.message}")
        if not issues:
            print("Agent integration validation passed.")

    if errors:
        return 1
    if args.strict and warnings:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
