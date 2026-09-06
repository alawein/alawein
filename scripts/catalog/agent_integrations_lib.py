#!/usr/bin/env python3
"""Shared validation helpers for catalog/agent-integrations.yaml."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
INVENTORY_PATH = ROOT / "catalog" / "agent-integrations.yaml"
RUNBOOK_PATH = ROOT / "docs" / "governance" / "slack-agent-runbook.md"
SCHEMA_PATH = ROOT / "schemas" / "agent-integrations.schema.json"
SNAPSHOT_PATH = ROOT / "catalog" / "generated" / "agent-integrations.snapshot.json"

STALE_WARN_DAYS = 31
STALE_ERROR_DAYS = 45

SLACK_ID_PATTERN = re.compile(r"`(C[A-Z0-9]+)`")


@dataclass(frozen=True)
class ValidationIssue:
    level: str
    message: str


def _normalize_yaml_dates(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _normalize_yaml_dates(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_normalize_yaml_dates(item) for item in value]
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return value


def load_inventory(path: Path | None = None) -> dict[str, Any]:
    target = path or INVENTORY_PATH
    with target.open(encoding="utf-8") as handle:
        payload = yaml.safe_load(handle)
    if not isinstance(payload, dict):
        raise ValueError(f"{target}: expected mapping at root")
    return _normalize_yaml_dates(payload)


def parse_last_verified(value: str | date | datetime) -> datetime:
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, date):
        return datetime(value.year, value.month, value.day, tzinfo=timezone.utc)
    normalized = str(value).strip()
    if normalized.endswith("Z"):
        return datetime.fromisoformat(normalized.replace("Z", "+00:00"))
    if "T" in normalized:
        return datetime.fromisoformat(normalized)
    return datetime.fromisoformat(f"{normalized}T00:00:00+00:00")


def inventory_age_days(payload: dict[str, Any], today: date | None = None) -> int:
    anchor = today or date.today()
    try:
        verified = parse_last_verified(str(payload["lastVerified"]))
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError(f"invalid lastVerified: {exc}") from exc
    verified_date = verified.astimezone(timezone.utc).date()
    return (anchor - verified_date).days


def _row_id(row: dict[str, Any], label: str) -> str:
    value = row.get("id")
    if not value:
        raise KeyError(f"missing {label} id")
    return str(value)


def _channel_snapshot_key(row: dict[str, Any]) -> tuple[str, str, bool]:
    channel_id = _row_id(row, "channel")
    slack_id = row.get("slack_id")
    if not slack_id:
        raise KeyError(f"channel {channel_id} missing slack_id")
    cursor_can_read = bool(row.get("cursor_can_read", False))
    return channel_id, str(slack_id), cursor_can_read


def _integration_snapshot_key(row: dict[str, Any]) -> str:
    return _row_id(row, "integration")


def unique_field_values(
    rows: list[dict[str, Any]],
    field: str,
    label: str,
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    seen: dict[str, str] = {}
    for row in rows:
        value = row.get(field)
        if not value:
            continue
        text = str(value)
        prior = seen.get(text)
        if prior and prior != row.get("id", "<unknown>"):
            issues.append(
                ValidationIssue(
                    "error",
                    f"duplicate {label} '{text}' on '{prior}' and '{row.get('id')}'",
                )
            )
        seen[text] = str(row.get("id", "<unknown>"))
    return issues


def validate_schema(payload: dict[str, Any]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    if not SCHEMA_PATH.exists():
        issues.append(
            ValidationIssue("warning", f"missing schema file: {SCHEMA_PATH}")
        )
        return issues

    try:
        import jsonschema
    except ImportError:
        issues.append(
            ValidationIssue(
                "warning",
                "jsonschema not installed; skipping schema validation",
            )
        )
        return issues

    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(
        schema,
        format_checker=jsonschema.Draft202012Validator.FORMAT_CHECKER,
    )
    for error in sorted(validator.iter_errors(payload), key=lambda item: list(item.path)):
        path = ".".join(str(part) for part in error.path) or "<root>"
        issues.append(ValidationIssue("error", f"schema: {path}: {error.message}"))
    return issues


def validate_runbook_channel_ids(payload: dict[str, Any]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    if not RUNBOOK_PATH.exists():
        issues.append(
            ValidationIssue("warning", f"missing runbook: {RUNBOOK_PATH}")
        )
        return issues

    runbook_ids = set(SLACK_ID_PATTERN.findall(RUNBOOK_PATH.read_text(encoding="utf-8")))
    yaml_ids = {str(row["slack_id"]) for row in payload.get("slack_channels", [])}

    missing_from_runbook = sorted(yaml_ids - runbook_ids)
    missing_from_yaml = sorted(runbook_ids - yaml_ids)
    for slack_id in missing_from_runbook:
        issues.append(
            ValidationIssue(
                "error",
                f"slack channel id {slack_id} missing from slack-agent-runbook.md",
            )
        )
    for slack_id in missing_from_yaml:
        issues.append(
            ValidationIssue(
                "warning",
                f"slack-agent-runbook.md references {slack_id} absent from inventory YAML",
            )
        )
    return issues


def validate_snapshot(payload: dict[str, Any]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    if not SNAPSHOT_PATH.exists():
        issues.append(
            ValidationIssue(
                "warning",
                f"missing snapshot baseline: {SNAPSHOT_PATH}",
            )
        )
        return issues

    snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    current_channels: list[tuple[str, str, bool]] = []
    for row in payload.get("slack_channels", []):
        if not isinstance(row, dict):
            issues.append(ValidationIssue("error", "slack_channels row must be a mapping"))
            continue
        try:
            current_channels.append(_channel_snapshot_key(row))
        except KeyError as exc:
            issues.append(ValidationIssue("error", f"snapshot: {exc}"))

    baseline_channels: list[tuple[str, str, bool]] = []
    for row in snapshot.get("slack_channels", []):
        if not isinstance(row, dict):
            issues.append(
                ValidationIssue("error", "snapshot slack_channels row must be a mapping")
            )
            continue
        try:
            baseline_channels.append(_channel_snapshot_key(row))
        except KeyError as exc:
            issues.append(ValidationIssue("error", f"snapshot baseline: {exc}"))

    if sorted(current_channels) != sorted(baseline_channels):
        issues.append(
            ValidationIssue(
                "error",
                "slack channel topology drifted from catalog/generated/"
                "agent-integrations.snapshot.json; update snapshot after review",
            )
        )

    current_integration_ids: list[str] = []
    for row in payload.get("integrations", []):
        if not isinstance(row, dict):
            issues.append(ValidationIssue("error", "integrations row must be a mapping"))
            continue
        try:
            current_integration_ids.append(_integration_snapshot_key(row))
        except KeyError as exc:
            issues.append(ValidationIssue("error", f"snapshot: {exc}"))

    baseline_integration_ids: list[str] = []
    for row in snapshot.get("integrations", []):
        if not isinstance(row, dict):
            issues.append(
                ValidationIssue("error", "snapshot integrations row must be a mapping")
            )
            continue
        try:
            baseline_integration_ids.append(_integration_snapshot_key(row))
        except KeyError as exc:
            issues.append(ValidationIssue("error", f"snapshot baseline: {exc}"))

    if sorted(current_integration_ids) != sorted(baseline_integration_ids):
        issues.append(
            ValidationIssue(
                "error",
                "integration roster drifted from catalog/generated/"
                "agent-integrations.snapshot.json; update snapshot after review",
            )
        )

    current_agent_ids: list[str] = []
    for row in payload.get("agents", []):
        if not isinstance(row, dict):
            issues.append(ValidationIssue("error", "agents row must be a mapping"))
            continue
        try:
            current_agent_ids.append(_row_id(row, "agent"))
        except KeyError as exc:
            issues.append(ValidationIssue("error", f"snapshot: {exc}"))

    baseline_agent_ids: list[str] = []
    for row in snapshot.get("agents", []):
        if not isinstance(row, dict):
            issues.append(ValidationIssue("error", "snapshot agents row must be a mapping"))
            continue
        try:
            baseline_agent_ids.append(_row_id(row, "agent"))
        except KeyError as exc:
            issues.append(ValidationIssue("error", f"snapshot baseline: {exc}"))

    if sorted(current_agent_ids) != sorted(baseline_agent_ids):
        issues.append(
            ValidationIssue(
                "warning",
                "agent roster changed since last snapshot; confirm intentional",
            )
        )
    return issues


def validate_inventory(
    payload: dict[str, Any],
    *,
    strict: bool = False,
    check_snapshot: bool = True,
    today: date | None = None,
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    schema_issues = validate_schema(payload)
    issues.extend(schema_issues)
    has_schema_errors = any(issue.level == "error" for issue in schema_issues)
    if has_schema_errors:
        return issues

    try:
        age_days = inventory_age_days(payload, today=today)
    except ValueError as exc:
        issues.append(ValidationIssue("error", str(exc)))
        age_days = None

    if age_days is not None and age_days < 0:
        issues.append(
            ValidationIssue(
                "error",
                "lastVerified is in the future; fix inventory timestamp",
            )
        )
    elif age_days is not None and age_days > STALE_ERROR_DAYS:
        issues.append(
            ValidationIssue(
                "error",
                f"lastVerified is {age_days} days old; re-run live rescan",
            )
        )
    elif age_days is not None and age_days > STALE_WARN_DAYS:
        issues.append(
            ValidationIssue(
                "warning",
                f"lastVerified is {age_days} days old; monthly rescan due",
            )
        )

    issues.extend(unique_field_values(payload.get("agents", []), "id", "agent id"))
    issues.extend(
        unique_field_values(payload.get("agents", []), "slack_user_id", "slack user id")
    )
    issues.extend(
        unique_field_values(payload.get("integrations", []), "id", "integration id")
    )
    issues.extend(
        unique_field_values(payload.get("slack_channels", []), "id", "channel id")
    )
    issues.extend(
        unique_field_values(payload.get("slack_channels", []), "slack_id", "slack id")
    )

    issues.extend(validate_runbook_channel_ids(payload))
    if check_snapshot:
        issues.extend(validate_snapshot(payload))

    if strict:
        return issues
    return [issue for issue in issues if issue.level != "warning"]
