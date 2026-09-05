"""Tests for validate-readme-voice.py."""

from __future__ import annotations

import json
import pytest
from pathlib import Path

from validate_readme_voice import (
    check_public_contract,
    check_readme_text,
    check_single_repo,
    main,
    should_skip,
)


def _repo(**kw):
    base = {
        "slug": "demo",
        "bucket": "lab",
        "type": "research",
        "status": "active",
        "local_path": "lab/demo",
        "repo": "alawein/demo",
        "surface": "library",
        "visibility": "public",
    }
    base.update(kw)
    return base


def test_should_skip_hub_and_archive():
    assert should_skip(_repo(slug="alawein", type="governance"))
    assert not should_skip(_repo(slug="helios", type="archive"))
    assert should_skip(_repo(slug="helios", type="archive", visibility="private"))
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


def test_public_readme_rejects_record_card_and_generated_markers(tmp_path):
    (tmp_path / "README.md").write_text(
        "# Demo\n\nStatus: active\n<!-- GENERATED:README -->\n", encoding="utf-8"
    )
    problems = check_single_repo(tmp_path, _repo())
    assert any("record-card" in problem for problem in problems)
    assert any("generated marker" in problem for problem in problems)


def test_fleet_transition_preserves_legacy_presentation_only():
    legacy = "# Demo\n\nStatus: active\n<!-- GENERATED:README -->\n"
    assert check_public_contract(legacy, _repo())
    assert check_public_contract(legacy, _repo(), allow_legacy_public=True) == []
    adopted = legacy + "\n## Run it\n\n`pytest`\n"
    assert check_public_contract(adopted, _repo(), allow_legacy_public=True)
    assert check_readme_text(legacy + "\nA comprehensive solution.\n", "demo")


def test_transition_option_is_restricted_to_github_fleet():
    with pytest.raises(SystemExit) as exc:
        main(["--allow-legacy-public", "--workspace-root", "."])
    assert exc.value.code == 2


def test_github_transition_keeps_basic_voice_checks(monkeypatch):
    from validate_readme_voice import _m as validator

    monkeypatch.setattr(validator, "_github_repo", lambda *args: {"size": 1, "default_branch": "main"})
    monkeypatch.setattr(validator, "_github_readme", lambda *args, **kw:
                        "# Demo\n\nStatus: active\n\nA comprehensive solution.\n")
    problems = validator.validate_all([_repo()], github_token="test", allow_legacy_public=True)
    assert problems
    assert all("forbidden-register" in problem for problem in problems)


def test_public_presentation_rules_cover_rendered_prose_at_any_line():
    padding = "\n".join(f"Line {i}." for i in range(65))
    cases = [
        "- **Verification date:** 2026-09-05",
        "Verified 2026-09-05: 10 passed.",
        "**Status:** active",
    ]
    for line in cases:
        problems = check_public_contract(padding + "\n" + line, _repo())
        assert problems, line


def test_verified_date_allowed_only_in_reproducibility():
    readme = "# Demo\n\n## Reproducibility\n\nVerified 2026-09-05: 10 passed.\n"
    assert check_public_contract(readme, _repo()) == []


def test_fenced_and_commented_presentation_examples_are_ignored():
    readme = """# Demo

```markdown
Status: active
Verification date: 2026-09-05
```
<!-- Status: active -->
"""
    assert check_public_contract(readme, _repo()) == []


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
