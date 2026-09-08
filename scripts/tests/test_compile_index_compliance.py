"""compliance passes from catalog/index.yaml entries to repos.json and back.

Contract mirrored from the readme_archetype sibling override
(test_compile_index_promotion.py's ReadmeArchetypeTests): compile-set,
compile-clear, slim_entry emit, and back, plus an enum check against
catalog/taxonomy.json's compliance axis.
"""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

CATALOG_DIR = Path(__file__).resolve().parents[1] / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from compile_index import compile_repo, slim_entry  # noqa: E402
from catalog_lib import load_catalogs, validate_catalogs  # noqa: E402


def _entry(**kw):
    base = {"slug": "demo", "about": "Demo repo.", "visibility": "public"}
    base.update(kw)
    return base


class ComplianceOverrideTests(unittest.TestCase):
    def test_compile_sets_compliance_when_present(self) -> None:
        repo = compile_repo("platform", "core", _entry(compliance="internal-only"), None)
        self.assertEqual(repo["github_custom_properties"]["compliance"], "internal-only")

    def test_compile_clears_compliance_when_removed(self) -> None:
        prior = compile_repo("platform", "core", _entry(compliance="internal-only"), None)
        repo = compile_repo("platform", "core", _entry(), prior)
        self.assertNotIn("compliance", repo["github_custom_properties"])

    def test_slim_entry_retains_compliance(self) -> None:
        repo = compile_repo("platform", "core", _entry(compliance="pii"), None)
        slim = slim_entry(repo, bucket="core")
        self.assertEqual(slim.get("compliance"), "pii")

    def test_invalid_compliance_value_rejected(self) -> None:
        repo = compile_repo("platform", "core", _entry(compliance="not-a-real-value"), None)
        # validate_catalogs() is where this should be caught; compile_repo itself
        # still sets it (the enum check is a separate validation pass).
        catalogs = load_catalogs()
        catalogs["repos"] = {"repos": [repo]}
        issues = validate_catalogs(catalogs)
        self.assertTrue(any("compliance" in str(issue).lower() for issue in issues))


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
