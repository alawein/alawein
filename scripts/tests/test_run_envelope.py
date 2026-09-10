"""Tests for control-plane run-envelope semantics."""

from __future__ import annotations

import copy
import sys
import unittest
from pathlib import Path
from typing import Any

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
CATALOG_DIR = SCRIPTS_DIR / "catalog"
for directory in (str(SCRIPTS_DIR), str(CATALOG_DIR)):
    if directory not in sys.path:
        sys.path.insert(0, directory)

from validate_run_envelope import (  # noqa: E402
    EXAMPLE_PATH,
    load_envelope,
    validate_envelope,
    validate_semantics,
)


def _base() -> dict[str, Any]:
    return load_envelope(EXAMPLE_PATH)


class ExampleEnvelopeTests(unittest.TestCase):
    def test_shipped_example_has_no_errors(self) -> None:
        issues = validate_envelope(_base())
        errors = [issue.message for issue in issues if issue.level == "error"]
        self.assertEqual(errors, [])


class SemanticRuleTests(unittest.TestCase):
    def test_enforced_agent_credential_is_rejected(self) -> None:
        payload = _base()
        payload["control_level"] = "enforced"
        payload["write_set"] = "docs/governance/control-plane.md"
        issues = validate_semantics(payload)
        self.assertTrue(
            any("independently credentialed" in issue.message for issue in issues)
        )

    def test_enforced_with_unbypassable_gate_passes(self) -> None:
        payload = _base()
        payload["executor"]["independently_credentialed"] = False
        payload["control_level"] = "enforced"
        payload["write_set"] = "docs/governance/control-plane.md"
        payload["native_gate"] = {
            "kind": "github_ruleset",
            "id": "alawein/alawein required checks",
            "agent_can_bypass": False,
        }
        issues = [issue for issue in validate_semantics(payload) if issue.level == "error"]
        self.assertEqual(issues, [])

    def test_hash_only_verified_is_rejected(self) -> None:
        payload = _base()
        payload["receipt"] = {
            "execute_count": 1,
            "executed_at": "2026-09-10T10:05:00Z",
            "digest_sha256": "abc123",
            "summary": "looks good",
            "recovery_status": "not_required",
        }
        issues = validate_semantics(payload)
        self.assertTrue(any("hash or summary" in issue.message for issue in issues))

    def test_second_execute_under_one_attempt_is_rejected(self) -> None:
        payload = _base()
        payload["receipt"]["execute_count"] = 2
        issues = validate_semantics(payload)
        self.assertTrue(any("one_attempt" in issue.message for issue in issues))

    def test_execute_after_expiry_is_rejected(self) -> None:
        payload = _base()
        payload["authorization"]["expires_at"] = "2026-09-10T09:00:00Z"
        payload["receipt"]["executed_at"] = "2026-09-10T10:05:00Z"
        issues = validate_semantics(payload)
        self.assertTrue(any("expires_at" in issue.message for issue in issues))

    def test_accepted_without_meshal_record_is_rejected(self) -> None:
        payload = copy.deepcopy(_base())
        payload["phase"] = "accepted"
        issues = validate_semantics(payload)
        self.assertTrue(any("acceptance.status" in issue.message for issue in issues))

    def test_observed_write_set_is_rejected(self) -> None:
        payload = _base()
        payload["write_set"] = "catalog/index.yaml"
        issues = validate_semantics(payload)
        self.assertTrue(any("write_set: none" in issue.message for issue in issues))


if __name__ == "__main__":
    unittest.main()
