"""Spot-checks for projects.schema.json.

Only covers the vercel block — the broader schema is exercised by
scripts/catalog/validate-projects-json.py against the real projects.json
on every commit (via docs-doctrine), so this file focuses on the new
validation surface.
"""

from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

try:
    import jsonschema
except ImportError:  # optional dep — validate-projects-json.py covers CI
    jsonschema = None

ROOT = Path(__file__).resolve().parent.parent.parent
SCHEMA_PATH = ROOT / "projects.schema.json"


def _load_validator() -> jsonschema.protocols.Validator:
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    return jsonschema.Draft202012Validator(schema)


def _valid_envelope(featured_entry: dict) -> dict:
    return {
        "$schema": "./projects.schema.json",
        "lastUpdated": "2026-05-14",
        "featured": [featured_entry],
        "research": [],
        "infrastructure": [],
        "notion_sync": [],
        "packages": [],
    }


VALID_VERCEL = {
    "team_slug": "morphism-systems",
    "project_slug": "auditraise",
    "production_url": None,
    "custom_domain": None,
    "state": "preview-only",
    "last_synced_at": "2026-05-14T00:00:00Z",
}


@unittest.skipUnless(jsonschema is not None, "jsonschema not installed")
class VercelBlockValidation(unittest.TestCase):
    def setUp(self) -> None:
        self.validator = _load_validator()

    def _entry(self, vercel: dict | None) -> dict:
        # A fully valid projectEntry so iter_errors isolates the vercel block.
        entry = {
            "name": "Example",
            "slug": "example",
            "repo": "alawein/example",
            "description": "Example project.",
            "tags": ["python"],
            "category": "active",
        }
        if vercel is not None:
            entry["vercel"] = vercel
        return entry

    def test_valid_vercel_block_passes(self) -> None:
        doc = _valid_envelope(self._entry(VALID_VERCEL))
        errors = list(self.validator.iter_errors(doc))
        self.assertEqual(errors, [])

    def test_missing_state_field_fails(self) -> None:
        bad = dict(VALID_VERCEL)
        del bad["state"]
        doc = _valid_envelope(self._entry(bad))
        errors = list(self.validator.iter_errors(doc))
        self.assertTrue(any("state" in str(e) for e in errors))

    def test_invalid_state_enum_fails(self) -> None:
        bad = dict(VALID_VERCEL)
        bad["state"] = "purple"
        doc = _valid_envelope(self._entry(bad))
        errors = list(self.validator.iter_errors(doc))
        self.assertTrue(any("'purple'" in str(e) or "enum" in str(e) for e in errors))

    def test_empty_team_slug_fails(self) -> None:
        bad = dict(VALID_VERCEL)
        bad["team_slug"] = ""
        doc = _valid_envelope(self._entry(bad))
        errors = list(self.validator.iter_errors(doc))
        self.assertTrue(any("team_slug" in str(e) or "minLength" in str(e) for e in errors))

    def test_no_vercel_block_is_valid(self) -> None:
        doc = _valid_envelope(self._entry(None))
        errors = list(self.validator.iter_errors(doc))
        self.assertEqual(errors, [])


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
