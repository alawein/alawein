"""Migration preserves automation/history and stops on ambiguous classifications."""

import importlib.util
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("plan_work_labels", ROOT / "scripts/catalog/plan-work-labels.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
VOCAB = json.loads((ROOT / "catalog/taxonomy.json").read_text())["workRecords"]


def record(**changes):
    value = {"repo": "example/demo", "number": 1, "state": "open", "title": "docs: update guide", "labels": ["docs", "auto-generated", "P3"]}
    value.update(changes)
    return value


def test_additive_and_idempotent():
    source = record()
    first = MODULE.plan([source], VOCAB)[0]
    assert first["add"] == ["type:docs"]
    assert source["labels"] == ["docs", "auto-generated", "P3"]
    source["labels"] += first["add"]
    assert MODULE.plan([source], VOCAB)[0]["action"] == "unchanged"


@pytest.mark.parametrize("source", [record(labels=["bug", "docs"]), record(labels=["type:bug", "type:docs"]), record(labels=["bug"]), record(title="Unclassified work", labels=[])])
def test_conflicting_or_missing_evidence_stays_for_review(source):
    assert MODULE.plan([source], VOCAB)[0]["action"] == "review"


@pytest.mark.parametrize("changes", [{"state": "closed"}, {"archived": True}])
def test_historical_records_are_preserved(changes):
    assert MODULE.plan([record(**changes)], VOCAB)[0]["action"] == "preserve"


def test_repo_specific_namespace_is_preserved():
    source = record(labels=["type:gap", "scope:audit", "risk:medium"])
    result = MODULE.plan([source], VOCAB)[0]
    assert result["add"] == ["type:docs"]
    assert "type:gap" in result["before_labels"]


def test_duplicate_identity_rejected():
    with pytest.raises(ValueError):
        MODULE.plan([record(), record()], VOCAB)


def test_check_exit_status_tracks_observed_drift(tmp_path, capsys):
    observations = tmp_path / "records.json"
    observations.write_text(json.dumps([record()]))
    assert MODULE.main([str(observations)]) == 0
    assert MODULE.main([str(observations), "--check"]) == 1
    observations.write_text(json.dumps([record(labels=["type:docs"])]))
    assert MODULE.main([str(observations), "--check"]) == 0
    capsys.readouterr()
