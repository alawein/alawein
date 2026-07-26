"""Tests for validate-readme-voice.py."""

from __future__ import annotations

import json
from pathlib import Path

from validate_readme_voice import (
    check_readme_text,
    check_single_repo,
    main,
    should_skip,
)


def _repo(**kw):
    base = {
        "slug": "demo",
        "bucket": "research",
        "type": "research",
        "status": "active",
        "local_path": "research/demo",
        "repo": "alawein/demo",
        "surface": "library",
    }
    base.update(kw)
    return base


def test_should_skip_hub_and_archive():
    assert should_skip(_repo(slug="alawein", type="governance"))
    assert should_skip(_repo(slug="helios", type="archive"))
    assert not should_skip(_repo())


def test_clean_readme_passes():
    readme = """# Demo

## Abstract

A clean research README.

## Status

Active.
"""
    assert check_readme_text(readme, "demo") == []


def test_emdash_is_blocking():
    readme = "# Demo — bad title\n"
    problems = check_readme_text(readme, "demo")
    assert problems
    assert any("em-dash" in p for p in problems)


def test_forbidden_register_is_blocking():
    readme = "# Demo\n\nA comprehensive solution for everything.\n"
    problems = check_readme_text(readme, "demo")
    assert problems
    assert any("forbidden-register" in p for p in problems)


def test_fenced_emdash_exempt():
    readme = "# Demo\n\n```text\nbad — example\n```\n\nClean prose.\n"
    assert check_readme_text(readme, "demo") == []


def test_single_repo_mode(tmp_path):
    (tmp_path / "README.md").write_text("# Demo\n\nClean.\n", encoding="utf-8")
    assert check_single_repo(tmp_path, _repo()) == []


def test_main_repo_path_mode(tmp_path):
    repo_root = tmp_path / "repo"
    repo_root.mkdir()
    (repo_root / "README.md").write_text("# Demo\n\nClean.\n", encoding="utf-8")
    repos_json = tmp_path / "repos.json"
    repos_json.write_text(json.dumps({"repos": [_repo()]}), encoding="utf-8")
    assert (
        main(
            [
                "--repos-json",
                str(repos_json),
                "--repo-path",
                str(repo_root),
                "--repo-slug",
                "demo",
            ]
        )
        == 0
    )


def test_main_requires_mode(tmp_path):
    repos_json = tmp_path / "repos.json"
    repos_json.write_text(json.dumps({"repos": [_repo()]}), encoding="utf-8")
    assert main(["--repos-json", str(repos_json)]) == 2
