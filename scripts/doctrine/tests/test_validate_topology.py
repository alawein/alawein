"""Tests for validate-topology.py."""

from pathlib import Path

import pytest

from validate_topology import (
    ALLOWED_BUCKET,
    ALLOWED_TYPE,
    TopologyError,
    is_archived,
    check_repo_data,
    check_repo_disk,
    validate,
    main,
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


def test_non_dict_repo_entry_is_flagged_not_crash():
    problems = check_repo_data("not-a-dict")
    assert problems and any("mapping" in p for p in problems)


def test_single_segment_local_path_flagged_for_non_archived():
    problems = check_repo_data(_repo(slug="foo", bucket="research", local_path="foo"))
    assert any("bucket/slug" in p for p in problems)


def test_disk_check_passes_when_folder_exists(tmp_path):
    (tmp_path / "research" / "demo").mkdir(parents=True)
    r = _repo(slug="demo", bucket="research", local_path="research/demo")
    assert check_repo_disk(r, tmp_path) == []


def test_disk_check_flags_missing_folder(tmp_path):
    r = _repo(slug="ghost", bucket="research", local_path="research/ghost")
    problems = check_repo_disk(r, tmp_path)
    assert any("does not exist" in p for p in problems)


def test_disk_check_skips_hub(tmp_path):
    r = _repo(slug="alawein", local_path="alawein")
    assert check_repo_disk(r, tmp_path) == []


def test_validate_runs_disk_checks_when_root_given(tmp_path):
    r = _repo(slug="ghost", bucket="research", local_path="research/ghost")
    assert validate([r], workspace_root=tmp_path)  # missing folder -> problem
    assert validate([r]) == []  # data-only: clean


def test_main_returns_zero_on_clean_repos_json(tmp_path):
    good = tmp_path / "repos.json"
    good.write_text(
        '{"repos": [{"slug": "demo", "bucket": "research", "type": "research",'
        ' "status": "active", "local_path": "research/demo"}]}',
        encoding="utf-8",
    )
    assert main(["--repos-json", str(good)]) == 0


def test_main_returns_one_on_dirty_repos_json(tmp_path):
    bad = tmp_path / "repos.json"
    bad.write_text(
        '{"repos": [{"slug": "demo", "bucket": "widgets", "type": "research",'
        ' "status": "active", "local_path": "widgets/demo"}]}',
        encoding="utf-8",
    )
    assert main(["--repos-json", str(bad)]) == 1


def test_main_returns_two_on_missing_file(tmp_path):
    assert main(["--repos-json", str(tmp_path / "nope.json")]) == 2
