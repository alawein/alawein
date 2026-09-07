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
from typing import Any

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
CATALOG_DIR = SCRIPTS_DIR / "catalog"
for d in (str(SCRIPTS_DIR), str(CATALOG_DIR)):
    if d not in sys.path:
        sys.path.insert(0, d)

from catalog_lib import (  # noqa: E402
    build_featured_collections,
    infrastructure_entry_from_repo,
    prefer_public_repos,
    project_entry_from_repo,
    research_entry_from_repo,
)

# ---------------------------------------------------------------------------
# Shared sample repo dict used by all builder tests.
# ---------------------------------------------------------------------------

SAMPLE_REPO: dict[str, Any] = {
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

    def test_status_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "status"}
        entry = infrastructure_entry_from_repo(repo)
        self.assertNotIn("status", entry)

    def test_visibility_absent_when_not_set(self) -> None:
        repo = {k: v for k, v in SAMPLE_REPO.items() if k != "visibility"}
        entry = infrastructure_entry_from_repo(repo)
        self.assertNotIn("visibility", entry)


def _ops_repo(slug: str, *, visibility: str, type_: str = "tooling") -> dict[str, Any]:
    return {
        "name": slug,
        "slug": slug,
        "repo": f"alawein/{slug}",
        "type": type_,
        "surface": "cli",
        "domain": "governance",
        "lifecycle": "active",
        "visibility": visibility,
        "theme_family": "midnight",
        "brand_family": "midnight",
        "stack": ["python"],
        "audience": ["internal"],
        "homepage": f"https://github.com/alawein/{slug}",
        "canonical_description": f"{slug} purpose.",
        "github_topics": [slug],
        "maintainer": "Meshal Alawein",
        "docs_owner": "Meshal Alawein",
        "local_path": f"core/{slug}",
        "catalog_groups": ["infrastructure"],
        "depends_on": [],
        "provides": [],
        "version_source": "CHANGELOG.md",
        "github_custom_properties": {},
    }


class PreferPublicReposTests(unittest.TestCase):
    def test_public_repos_precede_private(self) -> None:
        ordered = prefer_public_repos(
            [
                _ops_repo("private-a", visibility="private"),
                _ops_repo("public-b", visibility="public"),
                _ops_repo("private-c", visibility="private"),
                _ops_repo("public-a", visibility="public"),
            ]
        )
        self.assertEqual([repo["slug"] for repo in ordered], ["public-b", "public-a", "private-a", "private-c"])


class FeaturedInternalOpsTests(unittest.TestCase):
    def test_private_insert_does_not_evict_public_outpost(self) -> None:
        # Nine tooling repos: eight private earlier in list order, one public later.
        # Without prefer-public, a [:8] cap would drop the public repo.
        repos = [
            _ops_repo("alpha-private", visibility="private"),
            _ops_repo("android-coding-phone", visibility="private"),
            _ops_repo("bravo-private", visibility="private"),
            _ops_repo("charlie-private", visibility="private"),
            _ops_repo("delta-private", visibility="private"),
            _ops_repo("echo-private", visibility="private"),
            _ops_repo("foxtrot-private", visibility="private"),
            _ops_repo("golf-private", visibility="private"),
            _ops_repo("outpost", visibility="public"),
        ]
        featured = build_featured_collections(repos)["internal_ops"]
        slugs = [entry["slug"] for entry in featured]
        self.assertIn("outpost", slugs)
        self.assertEqual(slugs[0], "outpost")
        self.assertEqual(len(featured), 8)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
