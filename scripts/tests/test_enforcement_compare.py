"""Offline enforcement floor comparator using panel ghsnap fixtures."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "github" / "github-baseline-audit.py"
FIXTURES = ROOT / "scripts" / "tests" / "fixtures" / "enforcement"

_spec = importlib.util.spec_from_file_location("github_baseline_audit", SCRIPT)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod


def _load(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def test_derive_floor_hub_minimum_frozen_none_out_of_scope_unknown() -> None:
    assert audit.derive_floor({"type": "governance", "lifecycle": "active", "owner": "alawein"}) == "hub"
    assert audit.derive_floor({"type": "product", "lifecycle": "active", "owner": "alawein"}) == "minimum"
    assert audit.derive_floor({"type": "tooling", "lifecycle": "frozen", "owner": "alawein"}) == "frozen"
    assert audit.derive_floor({"type": "archive", "lifecycle": "archived", "archived": True, "owner": "alawein"}) == "none"
    assert audit.derive_floor({"type": "product", "lifecycle": "active", "owner": "kohyr"}) == "out_of_scope"
    assert audit.derive_floor({"lifecycle": "active", "owner": "alawein"}) == "unknown"  # missing type


def test_hub_fixture_matches_hub_controls() -> None:
    fixture = _load("alawein_alawein.json")
    result = audit.compare_repo_enforcement(
        {"slug": "alawein", "type": "governance", "lifecycle": "active", "owner": "alawein"},
        fixture,
    )
    assert result["floor"] == "hub"
    assert result["redundancy"] is False
    for control in (
        "deletion",
        "non_fast_forward",
        "linear_history",
        "signatures",
        "required_contexts",
        "approvals",
        "merge_methods",
        "bypass",
    ):
        assert result["classification"][control] == "match", control


def test_chshlab_minimum_match_plus_redundancy() -> None:
    fixture = _load("alawein_chshlab.json")
    result = audit.compare_repo_enforcement(
        {"slug": "chshlab", "type": "product", "lifecycle": "active", "owner": "alawein"},
        fixture,
    )
    assert result["floor"] == "minimum"
    assert result["redundancy"] is True
    assert result["classification"]["deletion"] == "match"
    assert result["classification"]["non_fast_forward"] == "match"


def test_meshal_web_mismatch_on_deletion_and_non_fast_forward() -> None:
    fixture = _load("alawein_meshal-web.json")
    result = audit.compare_repo_enforcement(
        {"slug": "meshal-web", "type": "product", "lifecycle": "active", "owner": "alawein"},
        fixture,
    )
    assert result["floor"] == "minimum"
    assert result["classification"]["deletion"] == "mismatch"
    assert result["classification"]["non_fast_forward"] == "mismatch"


def test_bolts_legacy_only_bypassable_signatures_reported() -> None:
    fixture = _load("alawein_bolts.json")
    observed = audit.normalize_observed(
        fixture["rulesets"],
        fixture["protection"],
        fixture["actions_permissions"],
        meta={**(fixture.get("meta") or {}), "ruleset_details": fixture.get("ruleset_details") or []},
    )
    assert observed["source"] == "legacy"
    assert observed["redundancy"] is False
    sig = observed["controls"]["signatures"]
    assert isinstance(sig, dict)
    assert sig["enabled"] is True
    assert sig["bypassable"] is True


def test_kohyr_unknown_everywhere_with_reason() -> None:
    fixture = _load("kohyr_kohyr.json")
    result = audit.compare_repo_enforcement(
        {"slug": "kohyr", "type": "product", "lifecycle": "active", "owner": "kohyr"},
        fixture,
    )
    assert result["floor"] == "out_of_scope"
    for control in audit.ENFORCEMENT_CONTROLS:
        assert result["classification"][control] == "unknown"
    assert result["unknown_reason"]


def test_sync_exemption_never_yields_exception_on_platform_control() -> None:
    desired = audit._desired_for_floor("minimum")
    observed = {
        "unknown": False,
        "controls": {
            "deletion": False,
            "non_fast_forward": False,
            "linear_history": None,
            "signatures": None,
            "required_contexts": None,
            "approvals": None,
            "code_owner_review": None,
            "merge_methods": None,
            "bypass": None,
            "token_default": None,
            "allowed_actions": None,
        },
        "redundancy": False,
    }
    # Even if a caller tried to pass sync: manual as an exception channel, classify
    # never emits exception for platform controls.
    classes = audit.classify_enforcement(desired, observed)
    assert "exception" not in classes.values()
