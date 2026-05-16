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
