"""Unit tests for scripts/vercel/sync-vercel.py.

sync-vercel.py syncs `vercel:` blocks in catalog/repos.json (the catalog
source of truth) against the live Vercel API, then regenerates the derived
catalog outputs. Each behavior gets a focused test with the Vercel API
stubbed via unittest.mock.patch on the api_request callable.
"""

from __future__ import annotations

import importlib.util
import io
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "vercel" / "sync-vercel.py"
FIXTURES = ROOT / "scripts" / "tests" / "fixtures" / "sync-vercel"

_spec = importlib.util.spec_from_file_location("sync_vercel", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["sync_vercel"] = _mod
_spec.loader.exec_module(_mod)
sync_vercel = _mod


# --------------------------------------------------------------------------
# CLI surface
# --------------------------------------------------------------------------
class CliSurface(unittest.TestCase):
    def test_help_lists_modes(self) -> None:
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--help"],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0)
        for flag in ("--check", "--dry-run", "--repos-json"):
            self.assertIn(flag, result.stdout)


# --------------------------------------------------------------------------
# Token resolution
# --------------------------------------------------------------------------
class TokenResolution(unittest.TestCase):
    def test_env_var_wins(self) -> None:
        with mock.patch.dict("os.environ", {"VERCEL_TOKEN": "tok_env"}, clear=False):
            self.assertEqual(sync_vercel.resolve_token(), "tok_env")

    def test_missing_token_raises(self) -> None:
        with mock.patch.dict("os.environ", {}, clear=True):
            with mock.patch.object(sync_vercel, "_read_cli_auth_token", return_value=None):
                with self.assertRaises(SystemExit):
                    sync_vercel.resolve_token()


# --------------------------------------------------------------------------
# api_request
# --------------------------------------------------------------------------
class ApiRequest(unittest.TestCase):
    def test_builds_authorized_request(self) -> None:
        captured = {}

        def fake_urlopen(req, timeout):  # noqa: ANN001
            captured["url"] = req.full_url
            captured["headers"] = dict(req.header_items())

            class _Resp:
                def read(self_inner):
                    return b'{"ok": true}'

                def __enter__(self_inner):
                    return self_inner

                def __exit__(self_inner, *a):
                    return False

            return _Resp()

        with mock.patch.object(sync_vercel, "urlopen", side_effect=fake_urlopen):
            body = sync_vercel.api_request("tok_test", method="GET", path="/v2/teams")

        self.assertEqual(body, {"ok": True})
        self.assertEqual(captured["url"], "https://api.vercel.com/v2/teams")
        self.assertEqual(captured["headers"]["Authorization"], "Bearer tok_test")


# --------------------------------------------------------------------------
# Pagination (CRITICAL fix #3 — orphans / teams must not truncate)
# --------------------------------------------------------------------------
class Pagination(unittest.TestCase):
    def test_follows_next_cursor_across_pages(self) -> None:
        pages = [
            {"projects": [{"name": "p1"}, {"name": "p2"}], "pagination": {"next": 111}},
            {"projects": [{"name": "p3"}], "pagination": {"next": 222}},
            {"projects": [{"name": "p4"}], "pagination": {"next": None}},
        ]
        seen_paths = []

        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            seen_paths.append(path)
            return pages[len(seen_paths) - 1]

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            items = sync_vercel.api_request_paginated(
                "tok", path="/v9/projects?teamId=t&limit=100", items_key="projects",
            )

        self.assertEqual([p["name"] for p in items], ["p1", "p2", "p3", "p4"])
        self.assertEqual(len(seen_paths), 3)
        self.assertIn("until=111", seen_paths[1])
        self.assertIn("until=222", seen_paths[2])

    def test_orphans_paginated_no_truncation(self) -> None:
        pages = [
            {"projects": [{"name": "auditraise"}, {"name": "web"}],
             "pagination": {"next": 999}},
            {"projects": [{"name": "blackmalejournal"}], "pagination": {"next": None}},
        ]
        calls = []

        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            calls.append(path)
            return pages[len(calls) - 1]

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            orphans = sync_vercel.find_orphans(
                token="tok", team_id="tm", team_slug="morphism-systems",
                claimed_slugs={"auditraise"},
            )

        self.assertEqual(
            sorted(o.project_slug for o in orphans), ["blackmalejournal", "web"],
        )


# --------------------------------------------------------------------------
# compute_entry_state
# --------------------------------------------------------------------------
def _stub_project(project_id: str = "prj_test") -> dict:
    return {"id": project_id, "name": "auditraise", "alias": [], "framework": "nextjs"}


def _stub_deployment(created_days_ago: int, url: str = "auditraise-abc.vercel.app") -> dict:
    created_ms = int(
        (datetime.now(timezone.utc) - timedelta(days=created_days_ago)).timestamp() * 1000
    )
    return {"deployments": [{"uid": "dpl_test", "url": url, "createdAt": created_ms}]}


class ComputeEntryState(unittest.TestCase):
    def test_missing_project_returns_missing(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            raise sync_vercel.VercelAPIError("not found", status=404)

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            result = sync_vercel.compute_entry_state(
                token="tok", team_id="tm", team_slug="morphism-systems",
                project_slug="auditraise",
            )
        self.assertEqual(result.state, "missing")

    def test_non_404_error_propagates(self) -> None:
        """A 500 must not be swallowed into a benign state (CRITICAL fix #2)."""
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            raise sync_vercel.VercelAPIError("server error", status=500)

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            with self.assertRaises(sync_vercel.VercelAPIError):
                sync_vercel.compute_entry_state(
                    token="tok", team_id="tm", team_slug="morphism-systems",
                    project_slug="auditraise",
                )

    def test_no_deployments_returns_preview_only(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v9/projects/"):
                return _stub_project()
            return {"deployments": []}

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            result = sync_vercel.compute_entry_state(
                token="tok", team_id="tm", team_slug="morphism-systems",
                project_slug="auditraise",
            )
        self.assertEqual(result.state, "preview-only")

    def test_recent_deployment_returns_production(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v9/projects/"):
                return _stub_project()
            return _stub_deployment(created_days_ago=2)

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            result = sync_vercel.compute_entry_state(
                token="tok", team_id="tm", team_slug="morphism-systems",
                project_slug="auditraise",
            )
        self.assertEqual(result.state, "production")
        self.assertEqual(result.production_url, "https://auditraise-abc.vercel.app")

    def test_old_deployment_returns_stale(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v9/projects/"):
                return _stub_project()
            return _stub_deployment(created_days_ago=45)

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            result = sync_vercel.compute_entry_state(
                token="tok", team_id="tm", team_slug="morphism-systems",
                project_slug="auditraise",
            )
        self.assertEqual(result.state, "stale")

    def test_custom_domain_extracted(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v9/projects/"):
                resp = _stub_project()
                resp["alias"] = [
                    {"domain": "auditraise-abc.vercel.app"},
                    {"domain": "auditraise.com"},
                ]
                return resp
            return _stub_deployment(created_days_ago=2)

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            result = sync_vercel.compute_entry_state(
                token="tok", team_id="tm", team_slug="morphism-systems",
                project_slug="auditraise",
            )
        self.assertEqual(result.custom_domain, "auditraise.com")


# --------------------------------------------------------------------------
# Team lookup
# --------------------------------------------------------------------------
class TeamLookup(unittest.TestCase):
    def test_resolve_team_id_by_slug(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            self.assertEqual(path, "/v2/teams?limit=100")
            return {"teams": [
                {"id": "tm_alpha", "slug": "alpha"},
                {"id": "tm_beta", "slug": "morphism-systems"},
            ]}

        with mock.patch.object(sync_vercel, "api_request", side_effect=fake):
            mapping = sync_vercel.load_team_id_map("tok")

        self.assertEqual(mapping["morphism-systems"], "tm_beta")
        self.assertEqual(mapping["alpha"], "tm_alpha")


# --------------------------------------------------------------------------
# Serialization
# --------------------------------------------------------------------------
class StableWriteback(unittest.TestCase):
    def test_vercel_block_field_order_pinned(self) -> None:
        block = {
            "last_synced_at": "2026-05-14T00:00:00Z",
            "state": "preview-only",
            "custom_domain": None,
            "production_url": None,
            "project_slug": "x",
            "team_slug": "morphism-systems",
        }
        ordered = sync_vercel._reorder_vercel_block(block)
        self.assertEqual(list(ordered.keys()), list(sync_vercel.VERCEL_FIELD_ORDER))

    def test_idempotent_serialization(self) -> None:
        data = json.loads((FIXTURES / "repos-clean.json").read_text(encoding="utf-8"))
        buf = io.StringIO()
        sync_vercel.dump_repos_json(data, buf)
        first = buf.getvalue()
        buf = io.StringIO()
        sync_vercel.dump_repos_json(json.loads(first), buf)
        self.assertEqual(first, buf.getvalue(), "serialization is not idempotent")


# --------------------------------------------------------------------------
# Sync integration (default mode)
# --------------------------------------------------------------------------
class SyncIntegration(unittest.TestCase):
    def _run(self, fixture: str, api_stub, argv_extra=()):  # noqa: ANN001
        with tempfile.TemporaryDirectory() as tmpdir:
            target = Path(tmpdir) / "repos.json"
            shutil.copy(FIXTURES / fixture, target)
            with mock.patch.object(sync_vercel, "api_request", side_effect=api_stub), \
                 mock.patch.object(sync_vercel, "resolve_token", return_value="tok"), \
                 mock.patch.object(sync_vercel, "regenerate_catalog", return_value=0):
                rc = sync_vercel.main(
                    ["--repos-json", str(target), *argv_extra]
                )
            after = json.loads(target.read_text(encoding="utf-8"))
            return rc, after

    def test_sync_updates_synced_fields(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                return {"id": "prj_a", "name": "auditraise", "alias": []}
            if path.startswith("/v6/deployments"):
                return {"deployments": []}
            if path.startswith("/v9/projects?"):
                return {"projects": [{"id": "prj_a", "name": "auditraise"}]}
            self.fail(f"unexpected path {path}")

        rc, after = self._run("repos-clean.json", fake)
        self.assertEqual(rc, 0)
        block = after["repos"][0]["vercel"]
        self.assertEqual(block["state"], "preview-only")
        self.assertNotEqual(block["last_synced_at"], "2026-05-01T00:00:00Z")
        self.assertEqual(list(block.keys()), list(sync_vercel.VERCEL_FIELD_ORDER))

    def test_api_failure_aborts_write(self) -> None:
        """A non-404 API error must not produce a clean exit (CRITICAL fix #2)."""
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                raise sync_vercel.VercelAPIError("rate limited", status=429)
            if path.startswith("/v9/projects?"):
                return {"projects": [{"id": "prj_a", "name": "auditraise"}]}
            return {}

        rc, after = self._run("repos-clean.json", fake)
        self.assertEqual(rc, 1)
        # The block must be untouched — no partial write.
        self.assertEqual(after["repos"][0]["vercel"]["last_synced_at"],
                         "2026-05-01T00:00:00Z")

    def test_unknown_team_aborts_write(self) -> None:
        """A block on a team the token cannot see is a failure, not a skip."""
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_other", "slug": "some-other-team"}]}
            if path.startswith("/v9/projects?"):
                return {"projects": []}
            return {}

        rc, after = self._run("repos-clean.json", fake)
        self.assertEqual(rc, 1)
        self.assertEqual(after["repos"][0]["vercel"]["last_synced_at"],
                         "2026-05-01T00:00:00Z")

    def test_empty_team_map_aborts(self) -> None:
        """Zero visible teams must abort, never read as a clean run (fix #2)."""
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": []}
            return {}

        rc, _after = self._run("repos-clean.json", fake)
        self.assertEqual(rc, 1)


# --------------------------------------------------------------------------
# --check mode (CRITICAL fix #1 — must recompute, not inspect stale file)
# --------------------------------------------------------------------------
class CheckMode(unittest.TestCase):
    def _run_check(self, fixture: str, api_stub):  # noqa: ANN001
        with tempfile.TemporaryDirectory() as tmpdir:
            target = Path(tmpdir) / "repos.json"
            shutil.copy(FIXTURES / fixture, target)
            before = target.read_text(encoding="utf-8")
            with mock.patch.object(sync_vercel, "api_request", side_effect=api_stub), \
                 mock.patch.object(sync_vercel, "resolve_token", return_value="tok"):
                rc = sync_vercel.main(["--check", "--repos-json", str(target)])
            # --check must never write.
            self.assertEqual(target.read_text(encoding="utf-8"), before)
            return rc

    def test_clean_state_returns_zero(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                return {"id": "prj_a", "name": "auditraise", "alias": []}
            if path.startswith("/v6/deployments"):
                return {"deployments": []}
            if path.startswith("/v9/projects?"):
                return {"projects": [{"id": "prj_a", "name": "auditraise"}]}
            return {}

        self.assertEqual(self._run_check("repos-clean.json", fake), 0)

    def test_live_drift_detected(self) -> None:
        """Stored preview-only but live has a fresh production deploy → drift."""
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                return {"id": "prj_a", "name": "auditraise", "alias": []}
            if path.startswith("/v6/deployments"):
                return _stub_deployment(created_days_ago=1)
            if path.startswith("/v9/projects?"):
                return {"projects": [{"id": "prj_a", "name": "auditraise"}]}
            return {}

        self.assertEqual(self._run_check("repos-clean.json", fake), 1)

    def test_orphan_returns_one(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                return {"id": "prj_a", "name": "auditraise", "alias": []}
            if path.startswith("/v6/deployments"):
                return {"deployments": []}
            if path.startswith("/v9/projects?"):
                return {"projects": [
                    {"id": "prj_a", "name": "auditraise"},
                    {"id": "prj_b", "name": "blackmalejournal"},
                ]}
            return {}

        self.assertEqual(self._run_check("repos-clean.json", fake), 1)

    def test_missing_project_returns_one(self) -> None:
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                raise sync_vercel.VercelAPIError("not found", status=404)
            if path.startswith("/v9/projects?"):
                return {"projects": []}
            return {}

        self.assertEqual(self._run_check("repos-clean.json", fake), 1)

    def test_api_failure_returns_one(self) -> None:
        """A transient API error in --check must fail, never read clean (fix #2)."""
        def fake(token, *, method, path, body=None, timeout=30.0):  # noqa: ANN001
            if path.startswith("/v2/teams"):
                return {"teams": [{"id": "tm_x", "slug": "morphism-systems"}]}
            if path.startswith("/v9/projects/"):
                raise sync_vercel.VercelAPIError("server error", status=500)
            if path.startswith("/v9/projects?"):
                return {"projects": [{"id": "prj_a", "name": "auditraise"}]}
            return {}

        self.assertEqual(self._run_check("repos-clean.json", fake), 1)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
