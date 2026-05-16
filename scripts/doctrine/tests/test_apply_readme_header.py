"""Unit tests for the README header injector."""
import pytest

from apply_readme_header import (
    STATUS_MAP,
    DeriveError,
    derive_header_fields,
)

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
    allowed = {"active", "paused", "experimental", "deprecated", "archived"}
    assert set(STATUS_MAP.values()) <= allowed


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


from apply_readme_header import render_header, splice_header

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
