"""Pure rule tests for scripts/github/validate-visibility.py (no network)."""

from __future__ import annotations

import importlib.util
import json
import os
import sys
import unittest
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "github" / "validate-visibility.py"
CATALOG_DIR = ROOT / "scripts" / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

_spec = importlib.util.spec_from_file_location("validate_visibility", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["validate_visibility"] = _mod
_spec.loader.exec_module(_mod)
evaluate = _mod.evaluate

TODAY = date(2026, 8, 27)
CURRENT_P1 = {"tier": "P1", "scanned": "2026-08-27"}
CURRENT_P0 = {"tier": "P0", "scanned": "2026-08-27"}


def _repo(slug="demo", visibility="public", rtype="research", status="active", promotion=None):
    repo = {"slug": slug, "repo": f"alawein/{slug}", "visibility": visibility, "type": rtype, "status": status}
    if promotion is not None:
        repo["promotion"] = promotion
    return repo


def _live(visibility="public", size=100, archived=False, has_readme=True, has_license=True, exists=True):
    return {
        "exists": exists,
        "visibility": visibility,
        "size": size,
        "archived": archived,
        "has_readme": has_readme,
        "has_license": has_license,
    }


def _codes(findings):
    return sorted(f.code for f in findings)


class EvaluateTests(unittest.TestCase):
    def test_clean_public_p1(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_clean_private(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(visibility="private")}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_v1_visibility_mismatch(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(visibility="public")}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V1"])
        self.assertIn("catalog private, GitHub public", findings[0].message)

    def test_v2_public_and_empty(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live(size=0, has_readme=False)}, None, today=TODAY)
        self.assertIn("V2", _codes(findings))

    def test_v3_public_without_readme(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live(has_readme=False)}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V3"])

    def test_v4_public_without_promotion(self) -> None:
        findings = evaluate([_repo()], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V4"])
        self.assertEqual(findings[0].level, "error")

    def test_v4_stale_scan(self) -> None:
        findings = evaluate([_repo(promotion={"tier": "P1", "scanned": "2026-04-01"})], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V4"])

    def test_v4_grace_downgrades_to_warning(self) -> None:
        promo = {"tier": "P1", "scanned": "2026-04-01", "grace_until": "2026-09-30"}
        findings = evaluate([_repo(promotion=promo)], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual([(f.code, f.level) for f in findings], [("V4", "warning")])

    def test_v4_grace_expired_is_error(self) -> None:
        promo = {"tier": "P1", "scanned": "2026-04-01", "grace_until": "2026-08-01"}
        findings = evaluate([_repo(promotion=promo)], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual([(f.code, f.level) for f in findings], [("V4", "error")])

    def test_v5_pinned_not_p0(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], ["demo"], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V5"])

    def test_v5_pinned_p0_clean(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P0)], ["demo"], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_v5_pinned_private(self) -> None:
        findings = evaluate([_repo(visibility="private", promotion=CURRENT_P0)], ["demo"], {"demo": _live(visibility="private")}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V5"])

    def test_v6_public_research_without_license(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live(has_license=False)}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V6"])

    def test_v6_not_applied_to_product(self) -> None:
        findings = evaluate([_repo(rtype="product", promotion=CURRENT_P1)], [], {"demo": _live(has_license=False)}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_v7_live_pin_private(self) -> None:
        repos = [_repo(slug="hidden", visibility="private")]
        live = {"hidden": _live(visibility="private")}
        findings = evaluate(repos, [], live, ["hidden"], today=TODAY)
        self.assertEqual(_codes(findings), ["V7"])

    def test_v7_live_pin_unknown_slug(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live()}, ["ghost"], today=TODAY)
        self.assertEqual(_codes(findings), ["V7"])
        self.assertIn("not in catalog", findings[0].message)

    def test_v8_archived_mismatch_is_warning(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(visibility="private", archived=True)}, None, today=TODAY)
        self.assertEqual([(f.code, f.level) for f in findings], [("V8", "warning")])

    def test_archived_catalog_repo_is_exempt(self) -> None:
        repo = _repo(visibility="public", status="archived")
        findings = evaluate([repo], [], {"demo": _live(archived=True)}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_missing_on_github_is_error(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(exists=False)}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V1"])
        self.assertIn("not found on GitHub", findings[0].message)

    def test_offline_mode_ignores_live_pins(self) -> None:
        repo = _repo(slug="hidden", visibility="private")
        findings = evaluate([repo], [], None, ["hidden"], today=TODAY)
        self.assertEqual(findings, [])

    def test_hub_slug_skips_readme_and_license_checks(self) -> None:
        repo = _repo(slug="alawein", rtype="research", promotion=CURRENT_P1)
        live = {"alawein": _live(has_readme=False, has_license=False)}
        self.assertEqual(evaluate([repo], [], live, None, today=TODAY), [])

    def test_hub_slug_still_gets_visibility_and_empty_checks(self) -> None:
        repo = _repo(slug="alawein", rtype="research", promotion=CURRENT_P1)
        live = {"alawein": _live(visibility="private", size=0, has_readme=False, has_license=False)}
        self.assertEqual(_codes(evaluate([repo], [], live, None, today=TODAY)), ["V1", "V2"])


import subprocess  # noqa: E402


class LiveMappingTests(unittest.TestCase):
    def test_live_from_payloads_maps_fields(self) -> None:
        meta = {"visibility": "public", "size": 42, "archived": False, "default_branch": "main"}
        live = _mod.live_from_payloads(meta, readme_status=200, license_status=404)
        self.assertEqual(
            live,
            {"exists": True, "visibility": "public", "size": 42, "archived": False, "has_readme": True, "has_license": False},
        )

    def test_live_from_payloads_missing_repo(self) -> None:
        self.assertEqual(_mod.live_from_payloads(None, readme_status=404, license_status=404), {"exists": False})

    def test_parse_pinned_graphql(self) -> None:
        payload = {"data": {"user": {"pinnedItems": {"nodes": [{"name": "fallax"}, {"name": "qmatsim"}, {}]}}}}
        self.assertEqual(_mod.parse_pinned(payload), ["fallax", "qmatsim"])


class CliTests(unittest.TestCase):
    def test_help_lists_flags(self) -> None:
        result = subprocess.run([sys.executable, str(SCRIPT), "--help"], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        for flag in ("--github-api", "--offline", "--slug", "--json", "--today"):
            self.assertIn(flag, result.stdout)

    def test_github_api_without_token_exits_2(self) -> None:
        env = {k: v for k, v in os.environ.items() if k != "GITHUB_TOKEN"}
        result = subprocess.run([sys.executable, str(SCRIPT), "--github-api"], capture_output=True, text=True, env=env)
        self.assertEqual(result.returncode, 2)
        self.assertIn("GITHUB_TOKEN", result.stderr)

    def test_offline_json_on_real_catalog_parses(self) -> None:
        result = subprocess.run([sys.executable, str(SCRIPT), "--offline", "--json"], capture_output=True, text=True)
        self.assertIn(result.returncode, (0, 1))
        payload = json.loads(result.stdout)
        self.assertIn("findings", payload)
        self.assertIn("mode", payload)
        self.assertEqual(payload["mode"], "offline")


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
