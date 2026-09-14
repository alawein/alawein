"""Managed-path ownership: baseline-sync vs kernel allowlist must not conflict.

Two mechanisms declare write interest in overlapping paths. Until an authorized
transfer, every overlap must be recorded under ``baseline_owned_until_transfer``
in ``catalog/kernel.yaml``. A pin alone never transfers ownership.
"""

from __future__ import annotations

import sys
from datetime import date
from pathlib import Path
from typing import Any

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "github"))

import _repo_paths  # noqa: E402

KERNEL_YAML = ROOT / "catalog" / "kernel.yaml"

REQUIRED_TRANSFER_FIELDS = {
    "owner": "baseline-sync",
    "decided": "2026-09-13",
    "review": "2026-10-13",
    "decision_owner": "Meshal",
    "transfer_requires": [
        "pin",
        "parity",
        "accepted_canary",
        "explicit_transfer",
    ],
}


def _strip_slash(path: str) -> str:
    return path.strip().rstrip("/")


def _allowlist_directories(kernel_allowlist: list[str] | set[str]) -> set[str]:
    """Directory prefixes from the allowlist (trailing slash, normalized to end with /)."""
    directories: set[str] = set()
    for raw in kernel_allowlist:
        text = raw.strip()
        if text.endswith("/"):
            directories.add(_strip_slash(text) + "/")
    return directories


def overlapping_declarations(
    managed_paths: set[str] | frozenset[str],
    kernel_allowlist: list[str] | set[str],
) -> set[str]:
    """Return normalized paths claimed by both baseline sync and the kernel allowlist.

    File paths under an allowlisted directory collapse to that directory entry so
    ``.github/ISSUE_TEMPLATE/bug_report.yml`` and ``.github/ISSUE_TEMPLATE/`` count
    as one overlapping declaration.
    """
    managed = {_strip_slash(p) for p in managed_paths}
    allow_files = {_strip_slash(p) for p in kernel_allowlist if not str(p).strip().endswith("/")}
    directories = _allowlist_directories(kernel_allowlist)

    # Treat an allowlist file entry as a directory when managed paths live under it.
    for entry in list(allow_files):
        prefix = entry + "/"
        if any(m.startswith(prefix) for m in managed):
            directories.add(prefix)
            allow_files.discard(entry)

    overlaps: set[str] = set()
    for path in managed:
        matched_dir = None
        for directory in directories:
            if path == directory.rstrip("/") or path.startswith(directory):
                matched_dir = directory
                break
        if matched_dir is not None:
            overlaps.add(matched_dir)
        elif path in allow_files:
            overlaps.add(path)
    return overlaps


def _load_kernel() -> dict[str, Any]:
    return yaml.safe_load(KERNEL_YAML.read_text(encoding="utf-8")) or {}


def _transfer_lookup(transfers: dict[str, Any], path: str) -> Any | None:
    for key in (path, _strip_slash(path), _strip_slash(path) + "/"):
        if key in transfers:
            return transfers[key]
    return None


def _validate_transfer_entry(path: str, entry: Any, *, today: date) -> list[str]:
    errors: list[str] = []
    if not isinstance(entry, dict):
        return [f"{path}: transfer entry must be a mapping"]
    for key, expected in REQUIRED_TRANSFER_FIELDS.items():
        if key not in entry:
            errors.append(f"{path}: missing field {key!r}")
            continue
        if key == "transfer_requires":
            if list(entry[key]) != list(expected):
                errors.append(f"{path}: transfer_requires must be {expected!r}")
        elif entry[key] != expected:
            errors.append(f"{path}: {key} must be {expected!r}, got {entry[key]!r}")
    review = entry.get("review")
    if isinstance(review, str):
        try:
            review_date = date.fromisoformat(review)
        except ValueError:
            errors.append(f"{path}: review is not an ISO date")
        else:
            if review_date < today:
                errors.append(f"{path}: ownership decision expired (review {review})")
    return errors


def assert_managed_path_ownership(
    *,
    managed_paths: set[str] | frozenset[str],
    kernel: dict[str, Any],
    today: date | None = None,
) -> None:
    """Raise AssertionError on undeclared or invalid overlapping declarations."""
    today = today or date.today()
    allowlist = kernel.get("kernel_sync_path_allowlist") or []
    overlaps = overlapping_declarations(set(managed_paths), allowlist)
    transfers = kernel.get("baseline_owned_until_transfer") or {}
    if not isinstance(transfers, dict):
        raise AssertionError("baseline_owned_until_transfer must be a mapping")

    # A non-null workflow_pin_sha never satisfies ownership by itself.
    if overlaps and kernel.get("workflow_pin_sha") and not transfers:
        raise AssertionError(
            "overlapping declarations: non-null workflow_pin_sha does not transfer ownership; "
            + ", ".join(sorted(overlaps))
        )

    undeclared = sorted(path for path in overlaps if _transfer_lookup(transfers, path) is None)
    if undeclared:
        raise AssertionError(
            "overlapping declarations without baseline_owned_until_transfer entry: "
            + ", ".join(undeclared)
        )

    errors: list[str] = []
    for path in sorted(overlaps):
        entry = _transfer_lookup(transfers, path)
        assert entry is not None
        errors.extend(_validate_transfer_entry(path, entry, today=today))
    if errors:
        raise AssertionError("; ".join(errors))


def test_live_catalog_managed_path_ownership() -> None:
    kernel = _load_kernel()
    assert_managed_path_ownership(
        managed_paths=_repo_paths.MANAGED_PATHS,
        kernel=kernel,
    )


def test_disjoint_sets_pass() -> None:
    assert_managed_path_ownership(
        managed_paths={".github/workflows/ci.yml"},
        kernel={
            "kernel_sync_path_allowlist": ["README.md"],
            "baseline_owned_until_transfer": {},
            "workflow_pin_sha": None,
        },
    )


def test_declared_overlap_passes() -> None:
    entry = dict(REQUIRED_TRANSFER_FIELDS)
    assert_managed_path_ownership(
        managed_paths={".github/CODEOWNERS"},
        kernel={
            "kernel_sync_path_allowlist": [".github/CODEOWNERS"],
            "baseline_owned_until_transfer": {".github/CODEOWNERS": entry},
            "workflow_pin_sha": None,
        },
    )


def test_undeclared_overlap_fails() -> None:
    with pytest.raises(AssertionError, match="overlapping declarations"):
        assert_managed_path_ownership(
            managed_paths={".github/CODEOWNERS"},
            kernel={
                "kernel_sync_path_allowlist": [".github/CODEOWNERS"],
                "baseline_owned_until_transfer": {},
                "workflow_pin_sha": None,
            },
        )


def test_conflicting_owner_fails() -> None:
    entry = dict(REQUIRED_TRANSFER_FIELDS)
    entry["owner"] = "kernel"
    with pytest.raises(AssertionError, match="owner"):
        assert_managed_path_ownership(
            managed_paths={".github/CODEOWNERS"},
            kernel={
                "kernel_sync_path_allowlist": [".github/CODEOWNERS"],
                "baseline_owned_until_transfer": {".github/CODEOWNERS": entry},
                "workflow_pin_sha": None,
            },
        )


def test_past_review_date_fails() -> None:
    entry = dict(REQUIRED_TRANSFER_FIELDS)
    entry["review"] = "2020-01-01"
    with pytest.raises(AssertionError, match="ownership decision expired"):
        assert_managed_path_ownership(
            managed_paths={".github/CODEOWNERS"},
            kernel={
                "kernel_sync_path_allowlist": [".github/CODEOWNERS"],
                "baseline_owned_until_transfer": {".github/CODEOWNERS": entry},
                "workflow_pin_sha": None,
            },
            today=date(2026, 9, 13),
        )


def test_pin_alone_does_not_transfer_ownership() -> None:
    with pytest.raises(AssertionError, match="overlapping declarations"):
        assert_managed_path_ownership(
            managed_paths={".github/CODEOWNERS"},
            kernel={
                "kernel_sync_path_allowlist": [".github/CODEOWNERS"],
                "baseline_owned_until_transfer": {},
                "workflow_pin_sha": "deadbeef",
            },
        )
