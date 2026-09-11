#!/usr/bin/env python3
"""Validate control-plane run envelopes.

Read-only. A passing check is not Meshal acceptance and is not stronger
than native IDs on the owning system.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime
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


TIMESTAMP = re.compile(
    r"\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})"
)
SUCCESSFUL_READBACK = frozenset({"readable", "matched", "verified", "succeeded", "passed", "ok"})


def _parse_time(value: Any) -> datetime | None:
    """Parse an explicit-offset timestamp, never infer a missing timezone."""
    if not isinstance(value, str) or TIMESTAMP.fullmatch(value) is None:
        return None
    text = value.replace("t", "T")
    if text.endswith(("Z", "z")):
        text = text[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    return parsed if parsed.tzinfo is not None else None


def load_envelope(path: Path) -> dict[str, Any]:
    if yaml is None:
        raise RuntimeError("PyYAML required: pip install pyyaml")
    try:
        payload = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise ValueError("invalid YAML") from exc
    if not isinstance(payload, dict):
        raise ValueError("envelope must be a mapping")
    return payload


def validate_schema(payload: Any) -> list[Issue]:
    """Fail closed if structural validation cannot run."""
    try:
        import jsonschema
        from referencing.exceptions import Unresolvable
    except ImportError:
        return [Issue("error", "jsonschema>=4.18 not installed; schema validation unavailable")]
    try:
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        jsonschema.Draft202012Validator.check_schema(schema)
        validator = jsonschema.Draft202012Validator(
            schema,
            format_checker=jsonschema.Draft202012Validator.FORMAT_CHECKER,
        )
        errors = sorted(
            validator.iter_errors(payload),
            key=lambda item: tuple(str(part) for part in item.path),
        )
    except (OSError, ValueError, jsonschema.exceptions.SchemaError, Unresolvable) as exc:
        return [Issue("error", f"schema validation unavailable: {type(exc).__name__}")]
    return [
        Issue("error", f"schema: {'.'.join(str(part) for part in error.path) or '<root>'}: {error.message}")
        for error in errors
    ]


def _structural_issues(payload: Any) -> list[Issue]:
    """Protect direct semantic callers as well as schema-validated callers."""
    if not isinstance(payload, dict):
        return [Issue("error", "envelope must be a mapping")]
    issues: list[Issue] = []
    for key in ("phase", "control_level", "write_set"):
        if key in payload and not isinstance(payload[key], str):
            issues.append(Issue("error", f"{key} must be a string"))
    for key in ("authorization", "receipt", "executor", "native_gate", "acceptance", "model_identity"):
        if key in payload and not isinstance(payload[key], dict):
            issues.append(Issue("error", f"{key} must be a mapping"))
    for key in ("policy_refs", "prompt_refs", "inputs", "outputs"):
        if key in payload and (
            not isinstance(payload[key], list)
            or any(not isinstance(row, dict) for row in payload[key])
        ):
            issues.append(Issue("error", f"{key} must be a list of mappings"))
    receipt = payload.get("receipt")
    if isinstance(receipt, dict) and "readback" in receipt and (
        not isinstance(receipt["readback"], list)
        or any(not isinstance(row, dict) for row in receipt["readback"])
    ):
        issues.append(Issue("error", "receipt.readback must be a list of mappings"))
    return issues


def _nonempty(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_semantics(payload: Any) -> list[Issue]:
    issues = _structural_issues(payload)
    if issues:
        return issues
    phase = payload.get("phase")
    level = payload.get("control_level")
    authorization = payload.get("authorization") or {}
    receipt = payload.get("receipt") or {}
    executor = payload.get("executor") or {}
    gate = payload.get("native_gate")
    acceptance = payload.get("acceptance") or {}

    if phase in {"authorized", *EXECUTED_PHASES} and not authorization:
        issues.append(Issue("error", f"phase {phase} requires authorization"))

    # This validates a declared restriction, not actual credential isolation.
    if level == "enforced":
        if not isinstance(gate, dict) or gate.get("agent_can_bypass") is not False:
            issues.append(Issue("error", "enforced requires native_gate.agent_can_bypass=false"))
        if executor.get("independently_credentialed") is not False:
            issues.append(Issue("error", "independently credentialed or unknown executor cannot be labeled enforced"))

    expires_at = _parse_time(authorization.get("expires_at"))
    if authorization and expires_at is None:
        issues.append(Issue("error", "authorization.expires_at requires a valid explicit-offset timestamp"))

    executed_at = _parse_time(receipt.get("executed_at"))
    if "executed_at" in receipt and executed_at is None:
        issues.append(Issue("error", "receipt.executed_at is not a valid explicit-offset timestamp"))
    accepted_at = _parse_time(acceptance.get("at"))
    if "at" in acceptance and accepted_at is None:
        issues.append(Issue("error", "acceptance.at is not a valid explicit-offset timestamp"))
    if phase in EXECUTED_PHASES:
        count = receipt.get("execute_count")
        if type(count) is not int or count < 1:
            issues.append(Issue("error", f"phase {phase} requires receipt.execute_count >= 1"))
        if authorization.get("one_attempt") is True and type(count) is int and count > 1:
            issues.append(Issue("error", "one_attempt authorization cannot record execute_count > 1"))
        if executed_at is None:
            issues.append(Issue("error", f"phase {phase} requires valid receipt.executed_at"))
        if executed_at and expires_at and executed_at > expires_at:
            issues.append(Issue("error", "executed_at is after authorization.expires_at"))
        if not _nonempty(receipt.get("recovery_status")):
            issues.append(Issue("error", f"phase {phase} requires receipt.recovery_status"))
        for name in ("policy_refs", "prompt_refs"):
            refs = payload.get(name) or []
            if not refs:
                issues.append(Issue("error", f"phase {phase} requires {name}"))
            for index, ref in enumerate(refs):
                if not _nonempty(ref.get("path")) or not _nonempty(ref.get("loaded_revision")):
                    issues.append(Issue("error", f"{name}[{index}] requires path and loaded_revision"))
        if not _nonempty((payload.get("model_identity") or {}).get("product")):
            issues.append(Issue("error", f"phase {phase} requires observed model_identity.product"))
        for name in ("inputs", "outputs"):
            if not payload.get(name):
                issues.append(Issue("error", f"phase {phase} requires native-ID {name}"))

    if phase in VERIFIED_PHASES:
        readback = receipt.get("readback") or []
        if not readback:
            message = (
                "hash or summary is not enough for verified/accepted; need native-id readback"
                if receipt.get("digest_sha256") or receipt.get("summary")
                else f"phase {phase} requires receipt.readback native IDs"
            )
            issues.append(Issue("error", message))
        for index, row in enumerate(readback):
            result = row.get("result")
            if not _nonempty(row.get("native_id")):
                issues.append(Issue("error", f"receipt.readback[{index}] requires a native ID"))
            if not isinstance(result, str) or result.strip().casefold() not in SUCCESSFUL_READBACK:
                issues.append(Issue("error", f"receipt.readback[{index}] does not record successful readback"))

    if phase == "accepted":
        if acceptance.get("status") != "accepted":
            issues.append(Issue("error", "phase accepted requires acceptance.status=accepted"))
        for key in ("by", "revision"):
            if not _nonempty(acceptance.get(key)):
                issues.append(Issue("error", f"phase accepted requires acceptance.{key}"))
        if "at" not in acceptance:
            issues.append(Issue("error", "phase accepted requires acceptance.at"))
        elif accepted_at and executed_at and accepted_at < executed_at:
            issues.append(Issue("error", "acceptance.at precedes receipt.executed_at"))

    if payload.get("write_set") not in {None, "none"} and level == "observed":
        issues.append(Issue("error", "observed runs must use write_set: none"))
    return issues


def validate_envelope(payload: Any) -> list[Issue]:
    issues = validate_schema(payload)
    if any(issue.level == "error" for issue in issues):
        return issues
    return [*issues, *validate_semantics(payload)]


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
