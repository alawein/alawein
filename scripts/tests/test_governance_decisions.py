"""Focused validation for the Phase 3 governance decision extension."""

from __future__ import annotations

import sys
import unittest
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))

from catalog_lib import load_catalogs, repo_entries, validate_governance_decisions  # noqa: E402


class GovernanceDecisionValidationTests(unittest.TestCase):
    def setUp(self) -> None:
        catalogs = load_catalogs()
        self.decisions = catalogs["governance_decisions"]
        self.slugs = {repo["slug"] for repo in repo_entries(catalogs)}

    def test_phase3_governance_decisions_are_evidence_backed(self) -> None:
        catalogs = load_catalogs()
        issues = validate_governance_decisions(
            catalogs["governance_decisions"],
            {repo["slug"] for repo in repo_entries(catalogs)},
        )
        self.assertEqual(issues, [])

    def test_issue_references_survive_yaml_parsing(self) -> None:
        self.assertIn("#20", self.decisions["acknowledgements"][0]["subject"])
        note = self.decisions["workspace_batch"]["installation_and_auth"]["note"]
        self.assertIn("#25 is reviewed and merged", note)

    def test_malformed_decision_entries_are_rejected(self) -> None:
        for section in ("roles", "fitness_products", "research_clusters"):
            for value in (None, "invalid", {}):
                with self.subTest(section=section, value=value):
                    data = deepcopy(self.decisions)
                    data[section] = [value]
                    self.assertTrue(validate_governance_decisions(data, self.slugs))

    def test_missing_installation_contract_is_rejected(self) -> None:
        for value in (None, {}, [], "unknown"):
            with self.subTest(value=value):
                data = deepcopy(self.decisions)
                data["workspace_batch"]["installation_and_auth"] = value
                self.assertTrue(validate_governance_decisions(data, self.slugs))

    def test_evidence_and_review_flags_have_required_values(self) -> None:
        for section in ("roles", "fitness_products"):
            for field, value in (("evidence", []), ("review_required", "false")):
                with self.subTest(section=section, field=field):
                    data = deepcopy(self.decisions)
                    data[section][0][field] = value
                    self.assertTrue(validate_governance_decisions(data, self.slugs))
