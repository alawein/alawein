#!/usr/bin/env python3
"""Read-only probe over catalog/agent-integrations.yaml.

Does not send Slack, mutate auth, print secret values, or write a second
inventory. Live Slack/MCP/OAuth checks stay in a Cloud Agent session; this
CLI covers static layer A and optional evidence merge.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent_integrations_lib import (
    INVENTORY_PATH,
    load_inventory,
    validate_inventory,
)

LAYER_A_COMMANDS = frozenset({"inventory", "static", "report"})
LIVE_COMMANDS = frozenset(
    {
        "auth",
        "mcp",
        "slack",
        "notion",
        "codex",
        "chatgpt",
        "e2e",
    }
)
LIVE_BLOCK_REASON = (
    "BLOCKED: live Slack/MCP/OAuth probes are session-only. "
    "Do not put tokens in CI. Re-run from a Cloud Agent and record "
    "evidence in docs/internal/audits/."
)

REDACT_KEYS = frozenset(
    {
        "token",
        "secret",
        "password",
        "cookie",
        "authorization",
        "api_key",
        "apikey",
        "private_key",
    }
)


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _redact(value: Any) -> Any:
    if isinstance(value, dict):
        redacted: dict[str, Any] = {}
        for key, item in value.items():
            lowered = str(key).lower()
            if any(marker in lowered for marker in REDACT_KEYS):
                redacted[key] = "[redacted]"
            else:
                redacted[key] = _redact(item)
        return redacted
    if isinstance(value, list):
        return [_redact(item) for item in value]
    return value


def _row_summary(row: dict[str, Any], kind: str) -> dict[str, Any]:
    return {
        "kind": kind,
        "id": row.get("id"),
        "display_name": row.get("display_name") or row.get("provider"),
        "status": row.get("status"),
        "slack_handle": row.get("slack_handle"),
        "slack_user_id": row.get("slack_user_id"),
        "cursor_mcp": row.get("cursor_mcp"),
        "last_verified": row.get("last_verified"),
        "account": row.get("account"),
        "workspace": row.get("workspace") or row.get("workspace_id"),
    }


def inventory_payload(catalog: dict[str, Any]) -> dict[str, Any]:
    return {
        "generated_from": "catalog/agent-integrations.yaml",
        "generated_at": _utc_now(),
        "lastVerified": catalog.get("lastVerified"),
        "account_canon": catalog.get("account_canon"),
        "slack": catalog.get("slack"),
        "agents": [_row_summary(row, "agent") for row in catalog.get("agents", [])],
        "workflow_bots": [
            _row_summary(row, "workflow_bot") for row in catalog.get("workflow_bots", [])
        ],
        "integrations": [
            _row_summary(row, "integration") for row in catalog.get("integrations", [])
        ],
        "layer": "A-static",
        "classification": "PROVED",
    }


def static_payload(
    catalog: dict[str, Any],
    *,
    strict: bool,
) -> dict[str, Any]:
    issues = validate_inventory(catalog, strict=strict)
    errors = [issue.message for issue in issues if issue.level == "error"]
    warnings = [issue.message for issue in issues if issue.level == "warning"]
    return {
        "layer": "A-static",
        "generated_at": _utc_now(),
        "errors": errors,
        "warnings": warnings,
        "ok": not errors and (not strict or not warnings),
        "classification": "PROVED" if not errors else "FAILED",
    }


def live_blocked(command: str) -> dict[str, Any]:
    return {
        "command": command,
        "layer": "C-online",
        "generated_at": _utc_now(),
        "classification": "BLOCKED",
        "reason": LIVE_BLOCK_REASON,
    }


def render_report(catalog: dict[str, Any], static: dict[str, Any]) -> str:
    lines = [
        "# Integration probe (static)",
        "",
        f"Generated: `{static['generated_at']}`",
        f"Catalog `lastVerified`: `{catalog.get('lastVerified')}`",
        f"Static: `{static['classification']}`",
        "",
        "| Kind | ID | Status | Slack ID | Last verified |",
        "| --- | --- | --- | --- | --- |",
    ]
    for row in inventory_payload(catalog)["agents"]:
        lines.append(
            f"| agent | `{row['id']}` | `{row['status']}` | "
            f"`{row.get('slack_user_id') or '-'}` | `{row.get('last_verified') or '-'}` |"
        )
    for row in inventory_payload(catalog)["integrations"]:
        lines.append(
            f"| integration | `{row['id']}` | `{row['status']}` | - | "
            f"`{row.get('last_verified') or '-'}` |"
        )
    lines.extend(
        [
            "",
            "Live Slack/MCP/OAuth: BLOCKED in this CLI. Record session evidence in",
            "`docs/internal/audits/`. Do not create a second inventory file.",
            "",
        ]
    )
    return "\n".join(lines)


def merge_evidence(base: dict[str, Any], evidence_path: Path) -> dict[str, Any]:
    raw = json.loads(evidence_path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{evidence_path}: expected a JSON object")
    merged = dict(base)
    merged["evidence"] = _redact(raw)
    merged["evidence_path"] = str(evidence_path)
    return merged


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Read-only probe of catalog/agent-integrations.yaml",
    )
    parser.add_argument(
        "command",
        choices=sorted(LAYER_A_COMMANDS | LIVE_COMMANDS),
        help="inventory/static/report are static. Other commands stay BLOCKED.",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON.")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat validator warnings as failures for static.",
    )
    parser.add_argument(
        "--inventory",
        type=Path,
        default=INVENTORY_PATH,
        help="Path to agent-integrations.yaml",
    )
    parser.add_argument(
        "--evidence",
        type=Path,
        help="Optional redacted live-evidence JSON to attach to the report.",
    )
    args = parser.parse_args(argv)

    if args.command in LIVE_COMMANDS:
        payload = live_blocked(args.command)
        print(json.dumps(payload, indent=2) if args.json else payload["reason"])
        return 2

    catalog = load_inventory(args.inventory)
    if args.command == "inventory":
        payload = inventory_payload(catalog)
    elif args.command == "static":
        payload = static_payload(catalog, strict=args.strict)
    else:
        static = static_payload(catalog, strict=args.strict)
        if args.json:
            payload = {
                "report": "static",
                "static": static,
                "inventory": inventory_payload(catalog),
            }
        else:
            text = render_report(catalog, static)
            if args.evidence:
                payload = merge_evidence({"markdown": text}, args.evidence)
                print(json.dumps(payload, indent=2))
                return 0 if static["ok"] else 1
            print(text, end="")
            return 0 if static["ok"] else 1

    if args.evidence:
        payload = merge_evidence(payload, args.evidence)
    print(json.dumps(payload, indent=2) if args.json or args.command != "report" else "")
    if args.command == "static":
        return 0 if payload["ok"] else 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
