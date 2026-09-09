"""Build and compare ``.kernel-manifest.json``.

The manifest hashes the *managed block content*, not the full file on disk.
Local prose outside the markers must never affect conformance -- only the
kernel-owned block does. This keeps the manifest stable across human edits
to local sections and keeps ``repo-drift``'s ``kernel_conformance`` detector
dependency-free: it compares hashes, it never re-renders.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

from .render import ManagedFile

MANIFEST_FILENAME = ".kernel-manifest.json"


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def build_manifest(managed_files: list[ManagedFile], kernel_version: str) -> dict[str, Any]:
    files = {mf.relpath: _sha256(mf.content) for mf in managed_files}
    return {
        "kernel_version": kernel_version,
        "files": dict(sorted(files.items())),
    }


def manifest_json(manifest: dict[str, Any]) -> str:
    return json.dumps(manifest, indent=2, sort_keys=True) + "\n"


def compare_manifests(expected: dict[str, Any], actual: dict[str, Any]) -> dict[str, list[str]]:
    """Return {"missing": [...], "drifted": [...], "extra": [...]} paths."""
    expected_files = expected.get("files", {})
    actual_files = actual.get("files", {})
    missing = sorted(set(expected_files) - set(actual_files))
    extra = sorted(set(actual_files) - set(expected_files))
    drifted = sorted(
        path
        for path in set(expected_files) & set(actual_files)
        if expected_files[path] != actual_files[path]
    )
    result = {"missing": missing, "drifted": drifted, "extra": extra}
    if expected.get("kernel_version") != actual.get("kernel_version"):
        result["kernel_version_mismatch"] = [
            f"expected={expected.get('kernel_version')} actual={actual.get('kernel_version')}"
        ]
    return result


def is_conformant(comparison: dict[str, list[str]]) -> bool:
    return not comparison.get("missing") and not comparison.get("drifted") and not comparison.get(
        "kernel_version_mismatch"
    )
