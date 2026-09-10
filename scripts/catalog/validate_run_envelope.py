#!/usr/bin/env python3
"""Validate control-plane run envelopes.

Read-only. A passing check is not Meshal acceptance and is not stronger
than native IDs on the owning system.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SCHEMA_PATH = ROOT / "schemas" / "run-envelope.schema.json"
EXAMPLE_PATH = ROOT / "catalog" / "examples" / "run-envelope.example.yaml"

EXECUTED_PHASES = frozenset({"executed", "verified", "accepted"})
VERIFIED_PHASES = frozenset({"verified", "accepted"})

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None


@dataclass(frozen=True)
class Issue:
    level: str
    message: str


def _parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    text = value.strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed


def load_envelope(path: Path) -> dict[str, Any]:
    if yaml is None:
        raise RuntimeError("PyYAML required: pip install pyyaml")
    payload = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"{path}: envelope must be a mapping")
    return payload


def validate_schema(payload: dict[str, Any]) -> list[Issue]:
    issues: list[Issue] = []
    if not SCHEMA_PATH.exists():
        return [Issue("error", f"missing schema: {SCHEMA_PATH}")]
    try:
        import jsonschema
    except ImportError:
        return [Issue("warning", "jsonschema not installed; skipping schema check")]

    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(
        schema,
        format_checker=jsonschema.Draft202012Validator.FORMAT_CHECKER,
    )
    for error in sorted(validator.iter_errors(payload), key=lambda item: list(item.path)):
        path = ".".join(str(part) for part in error.path) or "<root>"
        issues.append(Issue("error", f"schema: {path}: {error.message}"))
    return issues


def validate_semantics(payload: dict[str, Any]) -> list[Issue]:
    issues: list[Issue] = []
    phase = payload.get("phase")
    level = payload.get("control_level")
    authorization = payload.get("authorization") or {}
    receipt = payload.get("receipt") or {}
    executor = payload.get("executor") or {}
    gate = payload.get("native_gate")
    acceptance = payload.get("acceptance") or {}

    if phase in {"authorized", *EXECUTED_PHASES} and not authorization:
        issues.append(Issue("error", f"phase {phase} requires authorization"))

    if level == "enforced":
        if not isinstance(gate, dict):
            issues.append(
                Issue(
                    "error",
                    "enforced requires native_gate; an agent credential is not a gate",
                )
            )
        else:
            if gate.get("agent_can_bypass") is True:
                issues.append(
                    Issue("error", "enforced native_gate must not be bypassable by the agent")
                )
        if executor.get("independently_credentialed") is True and (
            not isinstance(gate, dict) or gate.get("agent_can_bypass") is not False
        ):
            issues.append(
                Issue(
                    "error",
                    "independently credentialed executor cannot be labeled enforced",
                )
            )

    if phase in EXECUTED_PHASES:
        count = receipt.get("execute_count")
        if not isinstance(count, int) or count < 1:
            issues.append(Issue("error", f"phase {phase} requires receipt.execute_count >= 1"))
        if authorization.get("one_attempt") is True and isinstance(count, int) and count > 1:
            issues.append(
                Issue("error", "one_attempt authorization cannot record execute_count > 1")
            )
        executed_at = _parse_time(receipt.get("executed_at"))
        expires_at = _parse_time(authorization.get("expires_at"))
        if receipt.get("executed_at") and executed_at is None:
            issues.append(Issue("error", "receipt.executed_at is not a valid timestamp"))
        if authorization.get("expires_at") and expires_at is None:
            issues.append(Issue("error", "authorization.expires_at is not a valid timestamp"))
        if executed_at and expires_at and executed_at > expires_at:
            issues.append(Issue("error", "executed_at is after authorization.expires_at"))

    if phase in VERIFIED_PHASES:
        readback = receipt.get("readback") or []
        native_hits = [
            row
            for row in readback
            if isinstance(row, dict) and row.get("native_id")
        ]
        if not native_hits:
            if receipt.get("digest_sha256") or receipt.get("summary"):
                issues.append(
                    Issue(
                        "error",
                        "hash or summary is not enough for verified/accepted; need native-id readback",
                    )
                )
            else:
                issues.append(
                    Issue("error", f"phase {phase} requires receipt.readback native IDs")
                )
        for ref_list_name in ("policy_refs", "prompt_refs"):
            for index, ref in enumerate(payload.get(ref_list_name) or []):
                if not isinstance(ref, dict):
                    continue
                if ref.get("committed_revision") and not ref.get("loaded_revision"):
                    issues.append(
                        Issue(
                            "warning",
                            f"{ref_list_name}[{index}] records committed_revision without loaded_revision",
                        )
                    )

    if phase == "accepted":
        if acceptance.get("status") != "accepted":
            issues.append(Issue("error", "phase accepted requires acceptance.status=accepted"))
        if not acceptance.get("by"):
            issues.append(Issue("error", "phase accepted requires acceptance.by"))

    if payload.get("write_set") not in {None, "none"} and level == "observed":
        issues.append(Issue("error", "observed runs must use write_set: none"))

    return issues


def validate_envelope(payload: dict[str, Any]) -> list[Issue]:
    return [*validate_schema(payload), *validate_semantics(payload)]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate control-plane run envelopes")
    parser.add_argument(
        "paths",
        nargs="*",
        type=Path,
        help="Envelope YAML files. Default: the checked-in example.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate the shipped example envelope.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as failures.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit issues as JSON.",
    )
    args = parser.parse_args(argv)

    targets = list(args.paths)
    if args.check or not targets:
        targets.append(EXAMPLE_PATH)

    all_issues: list[tuple[Path, Issue]] = []
    for path in targets:
        try:
            payload = load_envelope(path)
        except (OSError, RuntimeError, ValueError) as exc:
            all_issues.append((path, Issue("error", str(exc))))
            continue
        for issue in validate_envelope(payload):
            all_issues.append((path, issue))

    errors = [item for item in all_issues if item[1].level == "error"]
    warnings = [item for item in all_issues if item[1].level == "warning"]

    if args.json:
        print(
            json.dumps(
                {
                    "errors": [f"{path}: {issue.message}" for path, issue in errors],
                    "warnings": [f"{path}: {issue.message}" for path, issue in warnings],
                },
                indent=2,
            )
        )
    else:
        if not all_issues:
            print("Run-envelope validation passed.")
        for path, issue in all_issues:
            print(f"[{issue.level}] {path}: {issue.message}")

    if errors:
        return 1
    if args.strict and warnings:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
