"""Tests for agent integration inventory validation."""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))

from agent_integrations_lib import (  # noqa: E402
    SNAPSHOT_PATH,
    load_inventory,
    validate_inventory,
    validate_runbook_channel_ids,
)


@pytest.fixture()
def inventory_payload() -> dict:
    return load_inventory()


def test_inventory_loads() -> None:
    payload = load_inventory()
    assert payload["schemaVersion"]
    assert payload["slack_channels"]


def test_inventory_passes_validation(inventory_payload: dict) -> None:
    issues = validate_inventory(inventory_payload, strict=True)
    assert [issue.message for issue in issues if issue.level == "error"] == []


def test_runbook_contains_all_channel_ids(inventory_payload: dict) -> None:
    issues = validate_runbook_channel_ids(inventory_payload)
    assert [issue.message for issue in issues if issue.level == "error"] == []


def test_stale_inventory_fails_strict(tmp_path: Path) -> None:
    payload = load_inventory()
    payload["lastVerified"] = "2020-01-01T00:00:00Z"
    stale_path = tmp_path / "stale.yaml"
    stale_path.write_text(yaml.safe_dump(payload), encoding="utf-8")
    stale_payload = load_inventory(stale_path)
    issues = validate_inventory(
        stale_payload,
        strict=True,
        check_snapshot=False,
        today=date(2026, 9, 6),
    )
    assert any("re-run live rescan" in issue.message for issue in issues)


def test_future_last_verified_fails_strict(inventory_payload: dict) -> None:
    payload = dict(inventory_payload)
    payload["lastVerified"] = "2099-01-01T00:00:00Z"
    issues = validate_inventory(
        payload,
        strict=True,
        check_snapshot=False,
        today=date(2026, 9, 6),
    )
    assert any("in the future" in issue.message for issue in issues)


def test_snapshot_missing_channel_keys_return_issues(tmp_path: Path) -> None:
    import agent_integrations_lib as lib

    payload = {
        "slack_channels": [{"slack_id": "C0000000000"}],
        "integrations": [],
        "agents": [],
    }
    snapshot_path = tmp_path / "snapshot.json"
    snapshot_path.write_text(
        json.dumps({"slack_channels": [], "integrations": [], "agents": []}),
        encoding="utf-8",
    )
    original = lib.SNAPSHOT_PATH
    lib.SNAPSHOT_PATH = snapshot_path
    try:
        issues = lib.validate_snapshot(payload)
    finally:
        lib.SNAPSHOT_PATH = original
    assert any("missing channel id" in issue.message for issue in issues)


def test_snapshot_drift_detected(tmp_path: Path, inventory_payload: dict) -> None:
    snapshot_path = tmp_path / "snapshot.json"
    snapshot_path.write_text(
        json.dumps(
            {
                "slack_channels": [
                    {"id": "ghost", "slack_id": "C0000000000", "cursor_can_read": False},
                ],
                "agents": [],
                "integrations": [],
            }
        ),
        encoding="utf-8",
    )
    original = SNAPSHOT_PATH
    import agent_integrations_lib as lib

    lib.SNAPSHOT_PATH = snapshot_path
    try:
        issues = validate_inventory(inventory_payload, check_snapshot=True)
    finally:
        lib.SNAPSHOT_PATH = original
    assert any("topology drifted" in issue.message for issue in issues)
