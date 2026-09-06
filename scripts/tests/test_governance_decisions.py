"""Focused validation for the Phase 3 governance decision extension."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))

from catalog_lib import load_catalogs, repo_entries, validate_governance_decisions  # noqa: E402


def test_phase3_governance_decisions_are_evidence_backed() -> None:
    catalogs = load_catalogs()
    issues = validate_governance_decisions(
        catalogs["governance_decisions"],
        {repo["slug"] for repo in repo_entries(catalogs)},
    )
    assert issues == []
