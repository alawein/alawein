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
