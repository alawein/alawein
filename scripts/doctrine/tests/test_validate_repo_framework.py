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
    main,
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


def test_main_repo_mode_passes(capsys):
    rc = main([
        "--repo", str(FIX / "repo_passing"),
        "--registry", str(FIX / "registry_sample.json"),
        "--repo-slug", "alawein/repo-passing",
    ])
    assert rc == 0
    assert "PASS" in capsys.readouterr().out


def test_main_repo_mode_fails_on_mismatch(capsys):
    rc = main([
        "--repo", str(FIX / "repo_wrong_category"),
        "--registry", str(FIX / "registry_sample.json"),
        "--repo-slug", "alawein/repo-wrong",
    ])
    assert rc == 1
    assert "FAIL" in capsys.readouterr().out


def test_main_repo_mode_requires_registry_and_slug():
    rc = main(["--repo", str(FIX / "repo_passing")])
    assert rc == 2


def test_main_rejects_root_and_repo_together():
    with pytest.raises(SystemExit):
        main(["--root", str(FIX), "--repo", str(FIX / "repo_passing")])


def test_main_root_mode_still_reaches_walk(tmp_path, capsys):
    # An empty dir has no bucket subdirs; walk mode must still run and
    # report 'no repos found' with exit code 2.
    rc = main(["--root", str(tmp_path)])
    assert rc == 2
    assert "no repos found" in capsys.readouterr().err


# Fix 1: empty 'repo' field raises RegistryError.
def test_load_registry_raises_on_empty_repo_field(tmp_path):
    registry_file = tmp_path / "bad_empty_repo.json"
    registry_file.write_text(
        '{"repos": [{"name": "oops", "repo": ""}]}', encoding="utf-8"
    )
    with pytest.raises(RegistryError) as excinfo:
        load_registry(registry_file)
    assert "empty" in str(excinfo.value).lower()
    assert "'repo'" in str(excinfo.value)


# Fix 2: --repo-slug without a '/' returns exit code 2.
def test_main_repo_mode_rejects_malformed_slug(capsys):
    rc = main([
        "--repo", str(FIX / "repo_passing"),
        "--registry", str(FIX / "registry_sample.json"),
        "--repo-slug", "noslash",
    ])
    assert rc == 2
    assert "owner/name" in capsys.readouterr().err


# Fix 3: --registry with workspace walk mode returns exit code 2.
def test_main_root_mode_rejects_registry_flag(tmp_path, capsys):
    rc = main(["--root", str(tmp_path), "--registry", str(FIX / "registry_sample.json")])
    assert rc == 2
    assert "--registry" in capsys.readouterr().err


# Fix 4: partial --repo combos (one of the two required flags missing) return 2.
def test_main_repo_mode_missing_only_slug(capsys):
    rc = main([
        "--repo", str(FIX / "repo_passing"),
        "--registry", str(FIX / "registry_sample.json"),
    ])
    assert rc == 2
    assert "error" in capsys.readouterr().err.lower()


def test_main_repo_mode_missing_only_registry(capsys):
    rc = main([
        "--repo", str(FIX / "repo_passing"),
        "--repo-slug", "alawein/repo-passing",
    ])
    assert rc == 2
    assert "error" in capsys.readouterr().err.lower()


# Duplicate-slug tolerance tests (cross-list listings in projects.json).

def test_load_registry_tolerates_duplicate_slug_same_bucket(tmp_path):
    """A slug in two lists with identical bucket values must not raise; the
    indexed entry must carry that bucket."""
    reg_file = tmp_path / "dup_same_bucket.json"
    reg_file.write_text(
        '{"featured": [{"repo": "alawein/foo", "bucket": "products"}],'
        ' "ventures": [{"repo": "alawein/foo", "bucket": "products"}]}',
        encoding="utf-8",
    )
    reg = load_registry(reg_file)
    assert "alawein/foo" in reg
    assert reg["alawein/foo"]["bucket"] == "products"


def test_load_registry_tolerates_duplicate_slug_one_has_bucket(tmp_path):
    """A slug appearing once with a bucket and once without must not raise;
    the indexed entry must carry the bucket (prefer bucket-bearing entry)."""
    reg_file = tmp_path / "dup_one_bucket.json"
    reg_file.write_text(
        '{"featured": [{"repo": "alawein/bar"}],'
        ' "products": [{"repo": "alawein/bar", "bucket": "products"}]}',
        encoding="utf-8",
    )
    reg = load_registry(reg_file)
    assert "alawein/bar" in reg
    assert reg["alawein/bar"].get("bucket") == "products"


def test_load_registry_raises_on_duplicate_slug_conflicting_buckets(tmp_path):
    """A slug in two lists with different bucket values is a data error and
    must raise RegistryError naming the slug and both bucket values."""
    reg_file = tmp_path / "dup_conflict.json"
    reg_file.write_text(
        '{"featured": [{"repo": "alawein/baz", "bucket": "products"}],'
        ' "research": [{"repo": "alawein/baz", "bucket": "research"}]}',
        encoding="utf-8",
    )
    with pytest.raises(RegistryError) as excinfo:
        load_registry(reg_file)
    msg = str(excinfo.value)
    assert "alawein/baz" in msg
    assert "products" in msg
    assert "research" in msg
