"""Tests for validate-repo-framework.py."""

from pathlib import Path

import pytest

from validate_repo_framework import (
    REQUIRED_FIELDS,
    ALLOWED_STATUS,
    ALLOWED_CATEGORY,
    ALLOWED_OWNER,
    ALLOWED_VISIBILITY,
    ALLOWED_NEXT_ACTION,
    ValidationError,
    parse_header,
    validate_repo,
    walk_alawein,
)

FIX = Path(__file__).parent / "fixtures"


def test_parse_header_extracts_all_six_fields():
    text = (FIX / "repo_passing" / "README.md").read_text(encoding="utf-8")
    header = parse_header(text)
    for field in REQUIRED_FIELDS:
        assert field in header, f"missing field: {field}"
    assert header["Status"] == "active"
    assert header["Category"] == "products"


def test_parse_header_raises_when_block_missing():
    text = (FIX / "repo_missing_header" / "README.md").read_text(encoding="utf-8")
    with pytest.raises(ValidationError) as excinfo:
        parse_header(text)
    assert "header" in str(excinfo.value).lower()


def test_validate_repo_passes_for_consistent_fixture():
    findings = validate_repo(FIX / "repo_passing", bucket="products")
    assert findings == [], f"unexpected findings: {findings}"


def test_validate_repo_flags_category_bucket_mismatch():
    findings = validate_repo(FIX / "repo_wrong_category", bucket="products")
    assert len(findings) == 1
    assert "category" in findings[0].lower()
    assert "research" in findings[0]
    assert "products" in findings[0]


def test_status_enum_is_exhaustive():
    assert ALLOWED_STATUS == {
        "active", "paused", "experimental", "deprecated", "archived",
    }


def test_category_enum_is_exhaustive():
    assert ALLOWED_CATEGORY == {
        "products", "personal", "family", "research",
        "tools", "ventures", "jobs-projects", "archive",
    }


def test_owner_enum_is_exhaustive():
    assert ALLOWED_OWNER == {
        "alawein", "menax-inc", "blackmalejournal", "kohyr",
    }


def test_visibility_enum_is_exhaustive():
    assert ALLOWED_VISIBILITY == {"public", "private"}


def test_next_action_enum_is_exhaustive():
    assert ALLOWED_NEXT_ACTION == {
        "continue", "refactor", "merge", "archive", "delete",
    }


def test_validate_repo_flags_each_invalid_enum_value():
    """Validator's primary job: rejecting invalid enum values."""
    findings = validate_repo(FIX / "repo_bad_enums", bucket="products")
    joined = "\n".join(findings)
    assert "Status 'wip'" in joined
    assert "Owner 'meshal'" in joined
    assert "Visibility 'internal'" in joined
    assert "Next action 'ship'" in joined
    assert len(findings) >= 4


def test_walk_alawein_skips_non_bucket_and_non_git_dirs(tmp_path):
    """walk_alawein only yields children that have a .git/ subdir, and
    only inside the active bucket directories (not _archive, not docs)."""
    (tmp_path / "products" / "real-repo" / ".git").mkdir(parents=True)
    (tmp_path / "products" / "no-git-dir").mkdir(parents=True)
    (tmp_path / "_archive" / "old-repo" / ".git").mkdir(parents=True)
    (tmp_path / "docs").mkdir()
    results = walk_alawein(tmp_path)
    assert results == [(tmp_path / "products" / "real-repo", "products")]


def test_validate_repo_flags_missing_readme(tmp_path):
    """A repo without a README.md returns a single missing-readme finding."""
    repo = tmp_path / "ghost-repo"
    repo.mkdir()
    findings = validate_repo(repo, bucket="products")
    assert findings == ["ghost-repo: README.md missing"]
