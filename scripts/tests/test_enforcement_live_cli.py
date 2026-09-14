"""Offline unit tests for live enforcement fetch (monkeypatched gh; no network)."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "github" / "github-baseline-audit.py"
FIXTURES = ROOT / "scripts" / "tests" / "fixtures" / "enforcement"

_spec = importlib.util.spec_from_file_location("github_baseline_audit_live", SCRIPT)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit_live"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod


def _load(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def test_fetch_repo_enforcement_helper_exists() -> None:
    assert hasattr(audit, "fetch_repo_enforcement")
    assert callable(audit.fetch_repo_enforcement)


def test_fetch_repo_enforcement_fixture_shape(monkeypatch: pytest.MonkeyPatch) -> None:
    fixture = _load("alawein_alawein.json")
    calls: list[str] = []

    def fake_gh_api(endpoint: str) -> tuple[object, dict]:
        calls.append(endpoint)
        if endpoint == "repos/alawein/alawein/rulesets":
            return fixture["rulesets"], {"rc": 0, "http_status": None, "error": None}
        if endpoint.startswith("repos/alawein/alawein/rulesets/"):
            return fixture["ruleset_details"][0], {"rc": 0, "http_status": None, "error": None}
        if endpoint == "repos/alawein/alawein":
            return {"default_branch": "main"}, {"rc": 0, "http_status": None, "error": None}
        if endpoint == "repos/alawein/alawein/branches/main/protection":
            return fixture["protection"], fixture["meta"]["protection"]
        if endpoint == "repos/alawein/alawein/actions/permissions":
            return {"allowed_actions": "selected"}, {"rc": 0, "http_status": None, "error": None}
        if endpoint == "repos/alawein/alawein/actions/permissions/workflow":
            return {"default_workflow_permissions": "read"}, {
                "rc": 0,
                "http_status": None,
                "error": None,
            }
        raise AssertionError(f"unexpected endpoint: {endpoint}")

    monkeypatch.setattr(audit, "_gh_api", fake_gh_api)
    payload = audit.fetch_repo_enforcement("alawein/alawein")
    assert payload["repo"] == "alawein/alawein"
    assert isinstance(payload["rulesets"], list)
    assert isinstance(payload["ruleset_details"], list)
    assert payload["ruleset_details"][0]["id"] == 10399573
    assert payload["protection"]["status"] == "404"
    assert payload["actions_permissions"]["default_workflow_permissions"] == "read"
    assert payload["actions_permissions"]["allowed_actions"] == "selected"
    assert "rulesets" in payload["meta"]
    assert "protection" in payload["meta"]
    assert "actions_permissions" in payload["meta"]
    assert any(c.endswith("/rulesets") for c in calls)


def test_ruleset_list_without_details_is_not_false_unprotected(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """List nonempty + all detail GETs fail must not look like unprotected hub."""
    list_payload = [
        {
            "id": 10399573,
            "name": "Branch Protection",
            "enforcement": "active",
        }
    ]

    def fake_gh_api(endpoint: str) -> tuple[object, dict]:
        if endpoint == "repos/alawein/alawein/rulesets":
            return list_payload, {"rc": 0, "http_status": None, "error": None}
        if endpoint.startswith("repos/alawein/alawein/rulesets/"):
            return (
                {"message": "Not Found", "status": "404"},
                {
                    "rc": 1,
                    "http_status": 404,
                    "error": "gh: Not Found (HTTP 404)",
                },
            )
        if endpoint == "repos/alawein/alawein":
            return {"default_branch": "main"}, {"rc": 0, "http_status": None, "error": None}
        if endpoint == "repos/alawein/alawein/branches/main/protection":
            return (
                {
                    "message": "Branch protection has been disabled on this repository.",
                    "status": "404",
                },
                {
                    "rc": 1,
                    "http_status": 404,
                    "error": "gh: Branch protection has been disabled (HTTP 404)",
                },
            )
        if endpoint.endswith("/actions/permissions") or endpoint.endswith(
            "/actions/permissions/workflow"
        ):
            return None, {
                "rc": 1,
                "http_status": 404,
                "error": "gh: Not Found (HTTP 404)",
            }
        raise AssertionError(f"unexpected endpoint: {endpoint}")

    monkeypatch.setattr(audit, "_gh_api", fake_gh_api)
    fixture = audit.fetch_repo_enforcement("alawein/alawein")
    assert fixture["ruleset_details"] == []
    assert fixture["meta"]["rulesets"].get("error")
    assert "incomplete" in str(fixture["meta"]["rulesets"]["error"]).lower()

    result = audit.compare_repo_enforcement(
        {
            "slug": "alawein",
            "repo": "alawein/alawein",
            "type": "governance",
            "lifecycle": "active",
            "owner": "alawein",
        },
        fixture,
    )
    assert result["floor"] == "hub"
    assert result["classification"]["deletion"] != "mismatch"
    assert result["classification"]["deletion"] == "unknown"
    assert not audit._observation_succeeded(fixture, result)


def test_run_live_snapshot_writes_non_null_classification(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    fixture = _load("alawein_alawein.json")

    def fake_fetch(owner_repo: str) -> dict:
        assert owner_repo == "alawein/alawein"
        return fixture

    monkeypatch.setattr(audit, "fetch_repo_enforcement", fake_fetch)
    out = tmp_path / "enforcement-snapshot.json"
    repos = [
        {
            "slug": "alawein",
            "repo": "alawein/alawein",
            "type": "governance",
            "lifecycle": "active",
            "owner": "alawein",
        }
    ]
    snapshot = audit.run_live_snapshot(repos, out)
    assert out.is_file()
    written = json.loads(out.read_text(encoding="utf-8"))
    assert written["repos"][0]["classification"] is not None
    assert written["repos"][0]["floor"] == "hub"
    assert snapshot["repos"][0]["classification"]["deletion"] == "match"


def test_run_live_snapshot_fail_closed_on_zero_success(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    def boom(_owner_repo: str) -> dict:
        raise RuntimeError("simulated gh failure")

    monkeypatch.setattr(audit, "fetch_repo_enforcement", boom)
    out = tmp_path / "empty.json"
    with pytest.raises(SystemExit) as caught:
        audit.run_live_snapshot(
            [{"slug": "alawein", "repo": "alawein/alawein", "type": "governance", "lifecycle": "active"}],
            out,
        )
    assert caught.value.code != 0 or "zero" in str(caught.value).lower()


def test_live_stub_no_longer_writes_null_classification(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    """main(--live) must not leave classification null (stub removed)."""
    fixture = _load("alawein_chshlab.json")
    monkeypatch.setattr(audit, "fetch_repo_enforcement", lambda _r: fixture)
    out = tmp_path / "snap.json"
    catalog = {
        "repos": [
            {
                "slug": "chshlab",
                "repo": "alawein/chshlab",
                "type": "product",
                "lifecycle": "active",
                "owner": "alawein",
            }
        ]
    }
    (tmp_path / "catalog").mkdir()
    (tmp_path / "catalog" / "repos.json").write_text(json.dumps(catalog), encoding="utf-8")

    class _Args:
        live = True
        local = False

    args = _Args()
    args.out = out  # type: ignore[attr-defined]
    monkeypatch.setattr(audit.argparse.ArgumentParser, "parse_args", lambda self: args)
    monkeypatch.setattr(audit, "ROOT", tmp_path)

    rc = audit.main()
    assert rc == 0
    snap = json.loads(out.read_text(encoding="utf-8"))
    assert snap["repos"], "expected at least one repo row"
    assert snap["repos"][0]["classification"] is not None
    assert "live fetch not run" not in str(snap["repos"][0].get("unknown_reason") or "")
