"""promotion passes from catalog/index.yaml entries to repos.json and back."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

CATALOG_DIR = Path(__file__).resolve().parents[1] / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from compile_index import compile_repo, slim_entry  # noqa: E402

PROMOTION = {"tier": "P1", "scanned": "2026-08-27", "notes": "scan v1"}


def _entry(**kw):
    base = {"slug": "demo", "about": "Demo repo.", "visibility": "public"}
    base.update(kw)
    return base


class CompileRepoPromotionTests(unittest.TestCase):
    def test_promotion_is_carried_from_entry(self) -> None:
        repo = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        self.assertEqual(repo["promotion"], PROMOTION)

    def test_promotion_absent_when_entry_has_none(self) -> None:
        repo = compile_repo("lab", "lab", _entry(), None)
        self.assertNotIn("promotion", repo)

    def test_prior_promotion_is_dropped_when_entry_has_none(self) -> None:
        prior = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        repo = compile_repo("lab", "lab", _entry(), prior)
        self.assertNotIn("promotion", repo)

    def test_entry_promotion_overrides_prior(self) -> None:
        prior = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        newer = {"tier": "P0", "scanned": "2026-09-01"}
        repo = compile_repo("lab", "lab", _entry(promotion=newer), prior)
        self.assertEqual(repo["promotion"], newer)


class SlimEntryPromotionTests(unittest.TestCase):
    def test_slim_entry_keeps_promotion(self) -> None:
        repo = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        slim = slim_entry(repo, bucket="lab")
        self.assertEqual(slim["promotion"], PROMOTION)

    def test_slim_entry_omits_missing_promotion(self) -> None:
        repo = compile_repo("lab", "lab", _entry(), None)
        slim = slim_entry(repo, bucket="lab")
        self.assertNotIn("promotion", slim)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
