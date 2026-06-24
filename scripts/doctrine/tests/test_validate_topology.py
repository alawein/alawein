"""Tests for validate-topology.py."""

import pytest

from validate_topology import (
    ALLOWED_BUCKET,
    ALLOWED_TYPE,
    TopologyError,
    is_archived,
    check_repo_data,
    validate,
)


def _repo(**kw):
    base = {
        "slug": "demo",
        "bucket": "research",
        "type": "research",
        "status": "active",
        "local_path": "research/demo",
    }
    base.update(kw)
    return base


def test_clean_repo_has_no_problems():
    assert check_repo_data(_repo()) == []


def test_bucket_not_in_set_is_flagged():
    problems = check_repo_data(_repo(bucket="widgets", local_path="widgets/demo"))
    assert any("bucket" in p for p in problems)


def test_type_not_in_set_is_flagged():
    problems = check_repo_data(_repo(type="gadget"))
    assert any("type" in p for p in problems)


def test_slug_must_match_local_path_folder():
    problems = check_repo_data(_repo(slug="demo", local_path="research/other"))
    assert any("does not match slug" in p for p in problems)


def test_bucket_must_match_local_path_root():
    problems = check_repo_data(_repo(bucket="research", local_path="tools/demo"))
    assert any("does not match bucket" in p for p in problems)


def test_archived_repo_is_exempt_from_slug_and_bucket():
    r = _repo(
        slug="old-thing",
        type="archive",
        status="archived",
        bucket="research",
        local_path="_archive/2026-06-old",
    )
    assert check_repo_data(r) == []


def test_archived_markers_must_agree():
    problems = check_repo_data(_repo(type="archive", status="active"))
    assert any("archived markers disagree" in p for p in problems)


def test_hub_is_exempt_from_path_checks():
    r = _repo(slug="alawein", bucket="tools", type="governance", local_path="alawein")
    assert check_repo_data(r) == []


def test_missing_local_path_is_flagged():
    r = _repo()
    del r["local_path"]
    assert any("missing local_path" in p for p in check_repo_data(r))


def test_is_archived_true_for_archive_type():
    assert is_archived(_repo(type="archive", status="archived")) is True
    assert is_archived(_repo()) is False


def test_validate_aggregates_problems_across_repos():
    repos = [_repo(), _repo(slug="bad", bucket="widgets", local_path="widgets/bad")]
    assert len(validate(repos)) >= 1
