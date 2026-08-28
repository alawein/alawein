"""Offline promotion rules: shape, freshness, public-without-scan, pinned-below-P0."""

from __future__ import annotations

import sys
import unittest
from datetime import date
from pathlib import Path

CATALOG_DIR = Path(__file__).resolve().parents[1] / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from catalog_lib import grace_active, promotion_is_current, validate_promotion  # noqa: E402

TODAY = date(2026, 8, 27)


def _repo(slug="demo", visibility="private", promotion=None, status="active"):
    repo = {"slug": slug, "visibility": visibility, "status": status}
    if promotion is not None:
        repo["promotion"] = promotion
    return repo


def _messages(issues):
    return [i.message for i in issues]


class PromotionHelpersTests(unittest.TestCase):
    def test_current_when_scanned_within_90_days(self) -> None:
        self.assertTrue(promotion_is_current({"tier": "P1", "scanned": "2026-06-01"}, today=TODAY))

    def test_stale_after_90_days(self) -> None:
        self.assertFalse(promotion_is_current({"tier": "P1", "scanned": "2026-05-01"}, today=TODAY))

    def test_not_current_when_absent(self) -> None:
        self.assertFalse(promotion_is_current(None, today=TODAY))

    def test_grace_active_before_deadline(self) -> None:
        self.assertTrue(grace_active({"tier": "P1", "scanned": "2026-08-27", "grace_until": "2026-09-30"}, today=TODAY))

    def test_grace_inactive_on_or_after_deadline(self) -> None:
        self.assertFalse(grace_active({"tier": "P1", "scanned": "2026-08-27", "grace_until": "2026-08-27"}, today=TODAY))


class ValidatePromotionTests(unittest.TestCase):
    def test_private_without_promotion_is_clean(self) -> None:
        self.assertEqual(validate_promotion([_repo()], [], today=TODAY), [])

    def test_public_without_promotion_is_error(self) -> None:
        issues = validate_promotion([_repo(visibility="public")], [], today=TODAY)
        self.assertEqual(len(issues), 1)
        self.assertEqual(issues[0].level, "error")
        self.assertIn("'demo' is public without a promotion record", issues[0].message)

    def test_public_with_current_p1_is_clean(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-08-27"})
        self.assertEqual(validate_promotion([repo], [], today=TODAY), [])

    def test_public_with_p2_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P2", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("tier 'P2' does not allow public" in m for m in msgs), msgs)

    def test_public_with_stale_scan_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-05-01"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("scan from 2026-05-01 is older than 90 days" in m for m in msgs), msgs)

    def test_public_with_stale_scan_under_grace_is_clean(self) -> None:
        # CI runs validate-catalog.py --strict, which fails on warnings, so an
        # active grace is silent here; validate-visibility.py reports it.
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-05-01", "grace_until": "2026-09-30"})
        self.assertEqual(validate_promotion([repo], [], today=TODAY), [])

    def test_public_with_expired_grace_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-05-01", "grace_until": "2026-08-01"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("older than 90 days" in m for m in msgs), msgs)

    def test_bad_tier_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P9", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("invalid promotion tier 'P9'" in m for m in msgs), msgs)

    def test_missing_scanned_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("promotion is missing scanned" in m for m in msgs), msgs)

    def test_bad_date_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "yesterday"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("invalid promotion date 'yesterday'" in m for m in msgs), msgs)

    def test_pinned_requires_public_and_p0(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], ["demo"], today=TODAY))
        self.assertTrue(any("pinned repo 'demo' is not tier P0" in m for m in msgs), msgs)

    def test_pinned_private_is_error(self) -> None:
        repo = _repo(visibility="private", promotion={"tier": "P0", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], ["demo"], today=TODAY))
        self.assertTrue(any("pinned repo 'demo' is not public" in m for m in msgs), msgs)

    def test_pinned_p1_under_grace_is_clean(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-08-27", "grace_until": "2026-09-30"})
        self.assertEqual(validate_promotion([repo], ["demo"], today=TODAY), [])

    def test_pinned_p0_public_is_clean(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P0", "scanned": "2026-08-27"})
        self.assertEqual(validate_promotion([repo], ["demo"], today=TODAY), [])

    def test_archived_repo_is_exempt(self) -> None:
        repo = _repo(visibility="public", status="archived")
        self.assertEqual(validate_promotion([repo], [], today=TODAY), [])


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
