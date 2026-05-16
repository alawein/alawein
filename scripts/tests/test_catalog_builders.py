"""Unit tests for catalog_lib builder functions.

Covers field propagation for the three entry builders:
  - project_entry_from_repo
  - research_entry_from_repo
  - infrastructure_entry_from_repo
"""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
CATALOG_DIR = SCRIPTS_DIR / "catalog"
for d in (str(SCRIPTS_DIR), str(CATALOG_DIR)):
    if d not in sys.path:
        sys.path.insert(0, d)

from catalog_lib import (  # noqa: E402
    infrastructure_entry_from_repo,
    project_entry_from_repo,
    research_entry_from_repo,
)

# ---------------------------------------------------------------------------
# Shared sample repo dict used by all builder tests.
# ---------------------------------------------------------------------------

SAMPLE_REPO: dict = {
    "name": "Example Repo",
    "slug": "example",
    "repo": "alawein/example",
    "canonical_description": "Example purpose.",
    "tags": ["python"],
    "stack": ["python"],
    "lifecycle": "active",
    "homepage": None,
    "research_domain": "systems",
    "bucket": "tools",
    "status": "active",
    "visibility": "private",
}


class ProjectEntryBucketPropagationTests(unittest.TestCase):
    """Existing bucket-propagation coverage for project_entry_from_repo."""

    def test_bucket_is_carried_when_set(self) -> None:
        entry = project_entry_from_repo(SAMPLE_REPO)
        self.assertEqual(entry["bucket"], "tools")

    def test_bucket_is_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "bucket"}
        entry = project_entry_from_repo(repo)
        self.assertNotIn("bucket", entry)


class ResearchEntryBucketPropagationTests(unittest.TestCase):
    """Existing bucket-propagation coverage for research_entry_from_repo."""

    def test_bucket_is_carried_when_set(self) -> None:
        entry = research_entry_from_repo(SAMPLE_REPO)
        self.assertEqual(entry["bucket"], "tools")

    def test_bucket_is_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "bucket"}
        entry = research_entry_from_repo(repo)
        self.assertNotIn("bucket", entry)


class InfrastructureEntryBucketPropagationTests(unittest.TestCase):
    """Existing bucket-propagation coverage for infrastructure_entry_from_repo."""

    def test_bucket_is_carried_when_set(self) -> None:
        entry = infrastructure_entry_from_repo(SAMPLE_REPO)
        self.assertEqual(entry["bucket"], "tools")

    def test_bucket_is_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "bucket"}
        entry = infrastructure_entry_from_repo(repo)
        self.assertNotIn("bucket", entry)


class ProjectEntryStatusVisibilityDescriptionTests(unittest.TestCase):
    """project_entry_from_repo must carry status, visibility, and description."""

    def setUp(self) -> None:
        self.entry = project_entry_from_repo(SAMPLE_REPO)

    def test_description_is_carried(self) -> None:
        self.assertEqual(self.entry["description"], "Example purpose.")

    def test_status_is_carried(self) -> None:
        self.assertEqual(self.entry["status"], "active")

    def test_visibility_is_carried(self) -> None:
        self.assertEqual(self.entry["visibility"], "private")

    def test_status_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "status"}
        entry = project_entry_from_repo(repo)
        self.assertNotIn("status", entry)

    def test_visibility_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "visibility"}
        entry = project_entry_from_repo(repo)
        self.assertNotIn("visibility", entry)


class ResearchEntryStatusVisibilityDescriptionTests(unittest.TestCase):
    """research_entry_from_repo must carry status, visibility, and description."""

    def setUp(self) -> None:
        self.entry = research_entry_from_repo(SAMPLE_REPO)

    def test_description_is_carried(self) -> None:
        self.assertEqual(self.entry["description"], "Example purpose.")

    def test_status_is_carried(self) -> None:
        self.assertEqual(self.entry["status"], "active")

    def test_visibility_is_carried(self) -> None:
        self.assertEqual(self.entry["visibility"], "private")

    def test_status_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "status"}
        entry = research_entry_from_repo(repo)
        self.assertNotIn("status", entry)

    def test_visibility_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "visibility"}
        entry = research_entry_from_repo(repo)
        self.assertNotIn("visibility", entry)


class InfrastructureEntryStatusVisibilityDescriptionTests(unittest.TestCase):
    """infrastructure_entry_from_repo must carry status, visibility, and description."""

    def setUp(self) -> None:
        self.entry = infrastructure_entry_from_repo(SAMPLE_REPO)

    def test_description_is_carried(self) -> None:
        self.assertEqual(self.entry["description"], "Example purpose.")

    def test_status_is_carried(self) -> None:
        self.assertEqual(self.entry["status"], "active")

    def test_visibility_is_carried(self) -> None:
        self.assertEqual(self.entry["visibility"], "private")

    def test_visibility_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "visibility"}
        entry = infrastructure_entry_from_repo(repo)
        self.assertNotIn("visibility", entry)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
