"""Tests for version-coherence.py (D2 version-anchor check).

Policy: the git tag and the top CHANGELOG entry are the canonical version
anchor; pyproject/package.json/__init__ derive from it. The checker compares
every present source and reports a mismatch when they disagree. It is
warn-only, so it stays out of the blocking gate.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import version_coherence as vc  # noqa: E402


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _git(root: Path, *args: str) -> None:
    subprocess.run(
        ["git", *args],
        cwd=root,
        check=True,
        capture_output=True,
        text=True,
    )


def _init_repo_with_tag(root: Path, tag: str) -> None:
    _git(root, "init")
    _git(root, "config", "user.email", "t@example.com")
    _git(root, "config", "user.name", "t")
    _git(root, "add", "-A")
    _git(root, "commit", "-m", "init", "--no-gpg-sign")
    _git(root, "tag", tag)


# --- individual source readers ---

def test_read_pyproject_version(tmp_path):
    _write(tmp_path / "pyproject.toml", '[project]\nname = "x"\nversion = "0.1.0"\n')
    assert vc.read_pyproject_version(tmp_path) == "0.1.0"


def test_read_package_json_version(tmp_path):
    _write(tmp_path / "package.json", '{\n  "name": "x",\n  "version": "2.3.4"\n}\n')
    assert vc.read_package_json_version(tmp_path) == "2.3.4"


def test_read_changelog_top_entry(tmp_path):
    _write(
        tmp_path / "CHANGELOG.md",
        "# Changelog\n\n## [Unreleased]\n\n## [1.0.0] - 2026-01-01\n\n- thing\n",
    )
    # The top *released* entry is canonical; [Unreleased] is skipped.
    assert vc.read_changelog_version(tmp_path) == "1.0.0"


def test_tag_normalization_strips_v_prefix(tmp_path):
    _write(tmp_path / "x.txt", "x\n")
    _init_repo_with_tag(tmp_path, "v1.1.0")
    assert vc.read_latest_git_tag(tmp_path) == "1.1.0"


# --- the coherence check itself ---

def test_three_way_mismatch_is_reported(tmp_path):
    # The plan's fixture: pyproject 0.1.0 vs CHANGELOG 1.0.0 vs tag v1.1.0.
    _write(tmp_path / "pyproject.toml", '[project]\nname = "x"\nversion = "0.1.0"\n')
    _write(
        tmp_path / "CHANGELOG.md",
        "# Changelog\n\n## [1.0.0] - 2026-01-01\n\n- thing\n",
    )
    _init_repo_with_tag(tmp_path, "v1.1.0")

    versions = vc.collect_versions(tmp_path)
    assert versions.get("pyproject.toml") == "0.1.0"
    assert versions.get("CHANGELOG.md") == "1.0.0"
    assert versions.get("git-tag") == "1.1.0"

    mismatches = vc.find_mismatches(versions)
    assert mismatches, "a three-way disagreement must be reported"


def test_coherent_versions_have_no_mismatch(tmp_path):
    _write(tmp_path / "pyproject.toml", '[project]\nname = "x"\nversion = "1.2.0"\n')
    _write(
        tmp_path / "CHANGELOG.md",
        "# Changelog\n\n## [1.2.0] - 2026-01-01\n\n- thing\n",
    )
    _init_repo_with_tag(tmp_path, "v1.2.0")

    versions = vc.collect_versions(tmp_path)
    assert vc.find_mismatches(versions) == []


def test_main_strict_exits_nonzero_on_mismatch(tmp_path):
    _write(tmp_path / "pyproject.toml", '[project]\nname = "x"\nversion = "0.1.0"\n')
    _write(
        tmp_path / "CHANGELOG.md",
        "# Changelog\n\n## [1.0.0] - 2026-01-01\n\n- thing\n",
    )
    rc = vc.main(["--root", str(tmp_path), "--strict"])
    assert rc == 1


def test_main_default_is_warn_only(tmp_path):
    # Without --strict the check warns but returns 0 so it never blocks a gate.
    _write(tmp_path / "pyproject.toml", '[project]\nname = "x"\nversion = "0.1.0"\n')
    _write(
        tmp_path / "CHANGELOG.md",
        "# Changelog\n\n## [1.0.0] - 2026-01-01\n\n- thing\n",
    )
    rc = vc.main(["--root", str(tmp_path)])
    assert rc == 0
