"""Unit tests for the README header injector."""
import pytest

from apply_readme_header import (
    STATUS_MAP,
    DeriveError,
    apply_to_repo,
    derive_header_fields,
    parse_slug,
    render_header,
    splice_header,
)
from validate_repo_framework import ALLOWED_STATUS

SAMPLE = {
    "name": "Bolts",
    "slug": "bolts",
    "repo": "alawein/bolts",
    "bucket": "products",
    "owner": "alawein",
    "visibility": "private",
    "status": "maintained",
    "description": "Fitness transformation plans with Next.js, Stripe, Supabase.",
}

# Independent of SAMPLE: a pre-built header-fields dict used directly by the
# render/splice tests, without going through derive_header_fields.
FIELDS = {
    "Status": "active",
    "Category": "products",
    "Owner": "alawein",
    "Visibility": "private",
    "Purpose": "Fitness transformation plans.",
    "Next action": "continue",
}

EXPECTED_BLOCK = (
    "Status:      active\n"
    "Category:    products\n"
    "Owner:       alawein\n"
    "Visibility:  private\n"
    "Purpose:     Fitness transformation plans.\n"
    "Next action: continue"
)


def test_derive_maps_status_and_copies_fields():
    fields = derive_header_fields("alawein/bolts", SAMPLE)
    assert fields["Status"] == "active"          # maintained -> active
    assert fields["Category"] == "products"      # from bucket
    assert fields["Owner"] == "alawein"
    assert fields["Visibility"] == "private"
    assert fields["Purpose"].startswith("Fitness transformation")
    assert fields["Next action"] == "continue"


def test_derive_owner_falls_back_to_slug_segment():
    entry = {k: v for k, v in SAMPLE.items() if k != "owner"}
    fields = derive_header_fields("alawein/bolts", entry)
    assert fields["Owner"] == "alawein"


def test_derive_collapses_multiline_description():
    entry = dict(SAMPLE, description="Line one.\n  Line two.")
    fields = derive_header_fields("alawein/bolts", entry)
    assert fields["Purpose"] == "Line one. Line two."


def test_derive_missing_bucket_raises():
    entry = {k: v for k, v in SAMPLE.items() if k != "bucket"}
    with pytest.raises(DeriveError, match="bucket"):
        derive_header_fields("alawein/bolts", entry)


def test_derive_unknown_status_raises():
    entry = dict(SAMPLE, status="mothballed")
    with pytest.raises(DeriveError, match="status"):
        derive_header_fields("alawein/bolts", entry)


def test_derive_bad_visibility_raises():
    entry = dict(SAMPLE, visibility="")
    with pytest.raises(DeriveError, match="visibility"):
        derive_header_fields("alawein/bolts", entry)


def test_derive_missing_description_raises():
    entry = {k: v for k, v in SAMPLE.items() if k != "description"}
    with pytest.raises(DeriveError, match="description"):
        derive_header_fields("alawein/bolts", entry)


def test_status_map_targets_are_valid_doctrine_enums():
    assert set(STATUS_MAP.values()) <= set(ALLOWED_STATUS)


def test_derive_missing_status_raises():
    entry = {k: v for k, v in SAMPLE.items() if k != "status"}
    with pytest.raises(DeriveError, match="status"):
        derive_header_fields("alawein/bolts", entry)


def test_derive_none_status_raises():
    entry = dict(SAMPLE, status=None)
    with pytest.raises(DeriveError, match="status"):
        derive_header_fields("alawein/bolts", entry)


def test_derive_owner_fallback_without_slash_raises():
    entry = {k: v for k, v in SAMPLE.items() if k != "owner"}
    with pytest.raises(DeriveError, match="owner"):
        derive_header_fields("bolts", entry)


def test_render_header_aligns_values_at_column_14():
    assert render_header(FIELDS) == EXPECTED_BLOCK


def test_splice_inserts_after_title_when_no_block_present():
    readme = "# bolts\n\nBolts is a fitness product.\n"
    result = splice_header(readme, FIELDS)
    assert result == (
        "# bolts\n\n"
        + EXPECTED_BLOCK
        + "\n\nBolts is a fitness product.\n"
    )


def test_splice_inserts_when_no_blank_after_title():
    readme = "# bolts\nBolts is a fitness product.\n"
    result = splice_header(readme, FIELDS)
    assert result == (
        "# bolts\n\n"
        + EXPECTED_BLOCK
        + "\n\nBolts is a fitness product.\n"
    )


def test_splice_is_idempotent():
    readme = "# bolts\n\nBolts is a fitness product.\n"
    once = splice_header(readme, FIELDS)
    twice = splice_header(once, FIELDS)
    assert once == twice


def test_splice_replaces_existing_block_in_place():
    stale = {**FIELDS, "Category": "research", "Status": "paused"}
    readme = splice_header("# bolts\n\nBody.\n", stale)
    fixed = splice_header(readme, FIELDS)
    assert "Category:    products" in fixed
    assert "research" not in fixed
    assert fixed.count("Status:") == 1


def test_splice_raises_when_no_level1_heading():
    with pytest.raises(DeriveError, match="heading"):
        splice_header("No title here.\n\nBody.\n", FIELDS)


def test_splice_preserves_body_lines_that_look_like_fields():
    readme = (
        "# bolts\n\nBody intro.\n\n"
        "Status: see the GitHub issues for current state.\n\n"
        "More body.\n"
    )
    result = splice_header(readme, FIELDS)
    assert "Status: see the GitHub issues for current state." in result
    assert "Body intro." in result
    assert "More body." in result


def test_splice_ignores_partial_field_run_in_body():
    readme = "# bolts\n\nIntro.\n\nStatus: alpha\nCategory: web\n\nEnd.\n"
    result = splice_header(readme, FIELDS)
    assert "Status: alpha" in result
    assert "Category: web" in result
    assert "Intro." in result


@pytest.mark.parametrize("url,expected", [
    ("git@github.com:alawein/bolts.git", "alawein/bolts"),
    ("https://github.com/alawein/bolts.git", "alawein/bolts"),
    ("https://github.com/alawein/bolts", "alawein/bolts"),
    ("ssh://git@github.com/alawein/repz.git", "alawein/repz"),
])
def test_parse_slug_extracts_owner_and_name(url, expected):
    assert parse_slug(url) == expected


def test_parse_slug_returns_none_for_garbage():
    assert parse_slug("not-a-url") is None


def test_apply_to_repo_changes_readme(tmp_path):
    readme = tmp_path / "README.md"
    readme.write_text("# bolts\n\nBody.\n", encoding="utf-8")
    registry = {"alawein/bolts": SAMPLE}
    status, _ = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    assert status == "changed"
    assert "Category:    products" in readme.read_text(encoding="utf-8")


def test_apply_to_repo_second_run_is_unchanged(tmp_path):
    readme = tmp_path / "README.md"
    readme.write_text("# bolts\n\nBody.\n", encoding="utf-8")
    registry = {"alawein/bolts": SAMPLE}
    apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    status, _ = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    assert status == "unchanged"


def test_apply_to_repo_dry_run_does_not_write(tmp_path):
    readme = tmp_path / "README.md"
    original = "# bolts\n\nBody.\n"
    readme.write_text(original, encoding="utf-8")
    registry = {"alawein/bolts": SAMPLE}
    status, _ = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=True)
    assert status == "would-change"
    assert readme.read_text(encoding="utf-8") == original


def test_apply_to_repo_skips_unknown_slug(tmp_path):
    (tmp_path / "README.md").write_text("# x\n\nBody.\n", encoding="utf-8")
    status, _ = apply_to_repo(tmp_path, "alawein/ghost", {}, dry_run=True)
    assert status == "skipped"


def test_apply_to_repo_error_when_no_readme(tmp_path):
    registry = {"alawein/bolts": SAMPLE}
    status, detail = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    assert status == "error"
    assert "no README" in detail


@pytest.mark.parametrize("raw,expected", [
    ("active", "active"),
    ("maintained", "active"),
    ("paused", "paused"),
    ("experimental", "experimental"),
    ("prototype", "experimental"),
    ("deprecated", "deprecated"),
    ("archived", "archived"),
])
def test_derive_status_mappings(raw, expected):
    fields = derive_header_fields("alawein/bolts", dict(SAMPLE, status=raw))
    assert fields["Status"] == expected


@pytest.mark.parametrize("url", [
    "https://github.com/bolts",
    "https://github.com/bolts.git",
])
def test_parse_slug_returns_none_for_single_segment_url(url):
    assert parse_slug(url) is None


def test_splice_preserves_content_before_title():
    readme = "[![CI](badge.svg)](link)\n\n# bolts\n\nBody.\n"
    result = splice_header(readme, FIELDS)
    assert result.startswith("[![CI](badge.svg)](link)\n\n# bolts\n")
    assert "Status:      active" in result
    assert "Body." in result


def test_splice_raises_on_malformed_block_after_title():
    readme = (
        "# bolts\n\n"
        "Status:      active\n"
        "Category:    products\n"
        "Owner:       alawein\n"
        "Visibility:  private\n"
        "Purpose:     Something.\n\n"
        "Body.\n"
    )
    with pytest.raises(DeriveError, match="malformed"):
        splice_header(readme, FIELDS)


def test_apply_to_repo_error_when_readme_has_no_heading(tmp_path):
    readme = tmp_path / "README.md"
    readme.write_text("No heading here.\n\nBody.\n", encoding="utf-8")
    registry = {"alawein/bolts": SAMPLE}
    status, detail = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    assert status == "error"
    assert "heading" in detail
    assert "alawein/bolts" in detail


def test_apply_to_repo_crlf_readme_normalizes_to_lf(tmp_path):
    readme = tmp_path / "README.md"
    readme.write_bytes(b"# bolts\r\n\r\nBody.\r\n")
    registry = {"alawein/bolts": SAMPLE}
    status, _ = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    assert status == "changed"
    assert b"\r\n" not in readme.read_bytes()


def test_apply_to_repo_crlf_readme_second_run_unchanged(tmp_path):
    readme = tmp_path / "README.md"
    readme.write_bytes(b"# bolts\r\n\r\nBody.\r\n")
    registry = {"alawein/bolts": SAMPLE}
    apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    status, _ = apply_to_repo(tmp_path, "alawein/bolts", registry, dry_run=False)
    assert status == "unchanged"
