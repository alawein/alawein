from __future__ import annotations

import json

import pytest
import yaml

from kernel.skills_drift import (
    OPS_SHARED_INVENTORY,
    FlatIdentifierSet,
    build_report,
    diff_flat_identifier_sets,
    extract_alawein_catalog_identifiers,
    extract_grok_bot_taxonomy_identifiers,
)


@pytest.fixture
def fake_inventory(tmp_path):
    """Synthetic ops-shared-inventory fixture -- hermetic, no dependency on
    this machine's real Desktop/ops-shared-inventory (which does not exist
    on a CI runner)."""
    (tmp_path / "agents.yaml").write_text(
        yaml.safe_dump(
            {
                "agents": [
                    {"ui_name": "Intake", "skills": ["getting-started"]},
                    {"ui_name": "Cleanup", "skills": ["declutter-housekeeping"]},
                ]
            }
        ),
        encoding="utf-8",
    )
    (tmp_path / "workflows.yaml").write_text(
        yaml.safe_dump({"workflows": [{"id": "weekday-morning-brief"}]}),
        encoding="utf-8",
    )
    (tmp_path / "routines.yaml").write_text(
        yaml.safe_dump({"routines": [{"id": "monday-sole-writer-proof"}]}),
        encoding="utf-8",
    )
    return tmp_path


def test_extract_alawein_catalog_identifiers_covers_expected_kinds():
    flat = extract_alawein_catalog_identifiers()
    assert set(flat.by_kind) == {
        "repo_domain",
        "agent_surface",
        "workflow_bot",
        "external_integration",
    }
    assert "frontend" in flat.by_kind["repo_domain"]
    assert "cursor-cloud" in flat.by_kind["agent_surface"]


def test_extract_grok_bot_taxonomy_identifiers_covers_expected_kinds(fake_inventory):
    flat = extract_grok_bot_taxonomy_identifiers(ops_shared_inventory=fake_inventory)
    assert set(flat.by_kind) == {"agent_surface", "workflow_bot", "bot_skill"}
    assert flat.by_kind["agent_surface"] == ["Cleanup", "Intake"]
    assert flat.by_kind["workflow_bot"] == ["monday-sole-writer-proof", "weekday-morning-brief"]
    assert flat.by_kind["bot_skill"] == ["declutter-housekeeping", "getting-started"]


def test_diff_only_compares_shared_kinds():
    alawein = FlatIdentifierSet(
        source="alawein-catalog",
        by_kind={"agent_surface": ["cursor-cloud"], "repo_domain": ["frontend"]},
    )
    grok = FlatIdentifierSet(
        source="grok-bot-taxonomy",
        by_kind={"agent_surface": ["Intake"], "bot_skill": ["declutter-housekeeping"]},
    )
    diff = diff_flat_identifier_sets(alawein, grok)
    assert diff["shared_kinds"] == ["agent_surface"]
    assert diff["alawein_only_kinds"] == ["repo_domain"]
    assert diff["grok_only_kinds"] == ["bot_skill"]
    assert diff["by_kind"]["agent_surface"]["alawein_only"] == ["cursor-cloud"]
    assert diff["by_kind"]["agent_surface"]["grok_only"] == ["Intake"]
    assert diff["by_kind"]["agent_surface"]["overlap"] == []
    assert "repo_domain" not in diff["by_kind"]
    assert "bot_skill" not in diff["by_kind"]


def test_build_report_never_references_a_grok_bot_profile_write_path():
    report = build_report()
    assert report["report_only"] is True
    assert "never writes" in report["writer_boundary"].lower()
    assert "Name, Label, Description" in report["writer_boundary"]


def test_build_report_is_json_serializable_and_has_diff():
    report = build_report()
    json.dumps(report)  # raises if not serializable
    assert "diff" in report
    assert "by_kind" in report["diff"]


@pytest.mark.skipif(
    not OPS_SHARED_INVENTORY.exists(),
    reason="Desktop/ops-shared-inventory is machine-local, not present in CI",
)
def test_build_report_against_real_inventory_on_this_machine():
    """Smoke test against the real local inventory when it exists (this
    machine); skipped everywhere else, including CI."""
    report = build_report()
    assert report["grok_bot_taxonomy"]["agent_surface"]
