"""A failed or incomplete source read must not become a clean taxonomy audit."""

import importlib.util
import json
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("audit_work_labels", ROOT / "scripts/github/audit-work-labels.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
REPO = {"full_name": "example/demo", "archived": False}


def issue(number=1, **changes):
    row = {"id": number, "number": number, "title": "docs: update guide", "state": "open",
           "updated_at": "2026-09-06T00:00:00Z", "labels": [{"name": "type:docs"}]}
    row.update(changes)
    return row


def run_audit(monkeypatch, tmp_path, pages, metadata=None):
    replies = iter([metadata or REPO, pages])
    monkeypatch.setattr(MODULE, "github_get", lambda *args: next(replies))
    report = tmp_path / "report.json"
    code = MODULE.main(["--repo", "example/demo", "--output", str(report)])
    return code, json.loads(report.read_text())


def test_all_pages_and_prs_count(monkeypatch, tmp_path):
    code, report = run_audit(monkeypatch, tmp_path, [[issue()], [issue(2, pull_request={"url": "unused"})]])
    assert code == 0
    assert report["counts"] == {"unchanged": 2}
    assert [row["number"] for row in report["plan"]] == [1, 2]


def test_missing_and_conflicting_labels_report_drift(monkeypatch, tmp_path):
    source = [issue(labels=[]), issue(2, labels=[{"name": "type:docs"}, {"name": "type:bug"}])]
    code, report = run_audit(monkeypatch, tmp_path, [source])
    assert code == 1
    assert report["counts"] == {"add": 1, "review": 1}
    assert source[0]["labels"] == []


@pytest.mark.parametrize("pages", [[], {"message": "Forbidden"}, [[issue(labels=None)]], [[issue(), issue()]]])
def test_incomplete_or_duplicate_observations_are_unverified(monkeypatch, tmp_path, pages):
    code, report = run_audit(monkeypatch, tmp_path, pages)
    assert code == 2
    assert report["coverage"] == "unverified"
    assert report["result"] == "unverified"
    assert report["plan"] == []


def test_empty_complete_collection_is_valid(monkeypatch, tmp_path):
    code, report = run_audit(monkeypatch, tmp_path, [[]])
    assert code == 0
    assert report["coverage"] == "observed"
    assert report["counts"] == {}


def test_archived_records_are_preserved(monkeypatch, tmp_path):
    code, report = run_audit(monkeypatch, tmp_path, [[issue(labels=[])]], {**REPO, "archived": True})
    assert code == 0
    assert report["counts"] == {"preserve": 1}


def test_permission_failure_is_not_empty_success(monkeypatch, tmp_path):
    def denied(*args):
        raise subprocess.CalledProcessError(1, ["gh"], output="private provider body")
    monkeypatch.setattr(MODULE, "github_get", denied)
    path = tmp_path / "report.json"
    assert MODULE.main(["--repo", "example/demo", "--output", str(path)]) == 2
    assert "private provider body" not in path.read_text()
    assert json.loads(path.read_text())["coverage"] == "unverified"


def test_api_calls_are_read_only_and_paginated(monkeypatch):
    calls = []
    def completed(argv, **kwargs):
        calls.append(argv)
        return subprocess.CompletedProcess(argv, 0, stdout="[[]]")
    monkeypatch.setattr(MODULE.subprocess, "run", completed)
    MODULE.github_get("repos/example/demo/issues?state=open&per_page=100", "gh", True)
    assert calls[0][1:4] == ["api", "--method", "GET"]
    assert calls[0][-2:] == ["--paginate", "--slurp"]


@pytest.mark.parametrize("repo", ["../secret", "example/demo/extra", "example/demo?state=all", "example/.."])
def test_invalid_repository_path_is_rejected(tmp_path, repo):
    with pytest.raises(SystemExit):
        MODULE.main(["--repo", repo, "--output", str(tmp_path / "report.json")])
