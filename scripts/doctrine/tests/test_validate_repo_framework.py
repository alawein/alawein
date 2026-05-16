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
    RegistryError,
    parse_header,
    validate_repo,
    load_registry,
    validate_repo_single,
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


def test_validate_repo_handles_non_utf8_readme(tmp_path):
    """Non-UTF-8 README returns a per-repo finding instead of crashing the run."""
    repo = tmp_path / "bad-encoding"
    repo.mkdir()
    readme = repo / "README.md"
    # Latin-1 byte 0xff isn't valid UTF-8; this would crash read_text("utf-8") raw.
    readme.write_bytes(b"# title\n\nStatus:\xff active\n")
    findings = validate_repo(repo, bucket="products")
    assert len(findings) == 1
    assert "not UTF-8" in findings[0]
    assert "bad-encoding" in findings[0]


def test_parse_header_raises_on_duplicate_field():
    """NEW-2: two `Status:` lines back-to-back inside the header block must
    raise ValidationError, not silently keep the last value (the dict-comp
    last-wins bug that survived the first C2 round)."""
    text = (
        "# repo-x\n\n"
        "Status:      active\n"
        "Status:      archived\n"
        "Category:    products\n"
        "Owner:       alawein\n"
        "Visibility:  private\n"
        "Purpose:     duplicate field test.\n"
        "Next action: continue\n"
    )
    with pytest.raises(ValidationError) as excinfo:
        parse_header(text)
    msg = str(excinfo.value).lower()
    assert "duplicate" in msg
    assert "status" in msg


def test_parse_header_ignores_field_like_body_prose():
    """C2 regression: body prose with `Status: paused` after a section
    heading must NOT override the real header value. Previously, the
    dict comprehension's last-wins semantics let body content silently
    overwrite the header."""
    text = (
        "# repo-x\n\n"
        "Status:      active\n"
        "Category:    products\n"
        "Owner:       alawein\n"
        "Visibility:  private\n"
        "Purpose:     real header.\n"
        "Next action: continue\n\n"
        "## Status\n\n"
        "Status: paused\n"
    )
    header = parse_header(text)
    assert header["Status"] == "active"
    assert header["Next action"] == "continue"


def test_parse_header_tolerates_blank_lines_inside_block():
    """C2: blank lines inside the contiguous header block are allowed.
    The parser only stops collecting at the first non-blank, non-matching
    line after a field has been seen."""
    text = (
        "# repo-x\n\n"
        "Status:      active\n"
        "Category:    products\n\n"
        "Owner:       alawein\n"
        "Visibility:  private\n"
        "Purpose:     blank-line tolerance test.\n"
        "Next action: continue\n"
    )
    header = parse_header(text)
    assert header["Owner"] == "alawein"
    assert header["Status"] == "active"
    assert header["Next action"] == "continue"


def test_load_registry_indexes_repo_entries():
    reg = load_registry(FIX / "registry_sample.json")
    assert "alawein/repo-passing" in reg
    assert reg["alawein/repo-passing"]["bucket"] == "products"
    assert "menax-inc/cross-thing" in reg


def test_load_registry_skips_entries_without_repo():
    reg = load_registry(FIX / "registry_sample.json")
    # The 'packages' list entry has no 'repo' key and must not be indexed.
    assert "@alawein/tokens" not in reg
    assert all("/" in slug for slug in reg)


def test_load_registry_raises_on_malformed_json(tmp_path):
    bad = tmp_path / "bad.json"
    bad.write_text("{ not json", encoding="utf-8")
    with pytest.raises(RegistryError):
        load_registry(bad)


def test_load_registry_raises_on_missing_file(tmp_path):
    with pytest.raises(RegistryError):
        load_registry(tmp_path / "does-not-exist.json")


def test_validate_repo_single_passes_for_matching_bucket():
    reg = load_registry(FIX / "registry_sample.json")
    findings = validate_repo_single(
        FIX / "repo_passing", "alawein/repo-passing", reg
    )
    assert findings == [], f"unexpected findings: {findings}"


def test_validate_repo_single_flags_category_bucket_mismatch():
    reg = load_registry(FIX / "registry_sample.json")
    findings = validate_repo_single(
        FIX / "repo_wrong_category", "alawein/repo-wrong", reg
    )
    assert len(findings) == 1
    assert "category" in findings[0].lower()


def test_validate_repo_single_fails_when_repo_not_registered():
    reg = load_registry(FIX / "registry_sample.json")
    findings = validate_repo_single(
        FIX / "repo_passing", "alawein/not-registered", reg
    )
    assert len(findings) == 1
    assert "not registered" in findings[0].lower()


def test_validate_repo_single_fails_for_alawein_entry_without_bucket():
    reg = load_registry(FIX / "registry_sample.json")
    findings = validate_repo_single(
        FIX / "repo_passing", "alawein/repo-nobucket", reg
    )
    assert len(findings) == 1
    assert "bucket" in findings[0].lower()


def test_validate_repo_single_shape_only_for_cross_org_without_bucket():
    reg = load_registry(FIX / "registry_sample.json")
    # Cross-org entry has no bucket; only header shape is checked, and
    # repo_passing's header is well formed, so it passes.
    findings = validate_repo_single(
        FIX / "repo_passing", "menax-inc/cross-thing", reg
    )
    assert findings == [], f"unexpected findings: {findings}"


def test_validate_repo_single_cross_org_still_catches_bad_enums():
    reg = load_registry(FIX / "registry_sample.json")
    # Shape-only mode must still reject invalid enum values.
    findings = validate_repo_single(
        FIX / "repo_bad_enums", "menax-inc/cross-thing", reg
    )
    assert findings, "expected enum findings even in shape-only mode"


def test_validate_repo_uses_display_name_in_findings():
    findings = validate_repo(
        FIX / "repo_bad_enums", bucket=None, display_name="alawein/demo"
    )
    assert findings
    assert all(f.startswith("alawein/demo:") for f in findings)
