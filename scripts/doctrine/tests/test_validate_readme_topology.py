"""Tests for validate-readme-topology.py."""

import json

import pytest

from validate_readme_topology import (
    check_readme_sections,
    check_topology_file,
    find_repo_by_slug,
    section_present,
    topology_has_tree,
    main,
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


GOOD_README = """# Demo

> A measured demo.

## The claim

About the work.

## Run it

```bash
pytest
```

## What it is

A Python 3.11+ benchmark for model evaluators.

## What it is not

It does not rank models for general use.

## Docs map

- docs/README.md

## License

MIT.
"""

GOOD_TOPOLOGY = """# Repository topology

```text
demo/
├── src/
└── docs/
```
"""


def test_section_present_exact_and_alias():
    assert section_present("## Abstract\n", "Abstract")
    assert section_present("## Public value\n", "Abstract")
    assert not section_present("## Features\n", "Abstract")
    assert section_present("## What Fallax measures\n", "The claim")


def test_topology_has_tree_requires_block():
    assert topology_has_tree(GOOD_TOPOLOGY)
    assert not topology_has_tree("# empty\n")


def test_research_readme_sections_pass():
    assert check_readme_sections(GOOD_README, _repo()) == []


def test_fleet_transition_validates_legacy_without_relaxing_default():
    legacy = "\n".join(f"## {name}\nText.\n" for name in (
        "Abstract", "Status", "Runtime requirements", "Reproducibility",
        "Datasets", "Docs map",
    ))
    assert check_readme_sections(legacy, _repo())
    assert check_readme_sections(legacy, _repo(), allow_legacy_public=True) == []
    assert check_readme_sections(legacy.replace("## Datasets", "## Removed"),
                                 _repo(), allow_legacy_public=True)
    assert check_readme_sections(GOOD_README, _repo(), allow_legacy_public=True) == []
    assert check_readme_sections(GOOD_README.replace("## License", "## Removed"),
                                 _repo(), allow_legacy_public=True)


def test_transition_option_is_restricted_to_github_fleet():
    with pytest.raises(SystemExit) as exc:
        main(["--allow-legacy-public", "--repo-path", ".", "--repo-slug", "demo"])
    assert exc.value.code == 2


def test_github_transition_still_requires_legacy_topology(monkeypatch):
    from validate_readme_topology import _m as validator

    legacy = "\n".join(f"## {name}\nText.\n" for name in (
        "Abstract", "Status", "Runtime requirements", "Reproducibility",
        "Datasets", "Docs map",
    ))
    monkeypatch.setattr(validator, "_github_repo", lambda *args: {"size": 1, "default_branch": "main"})
    monkeypatch.setattr(validator, "_github_file", lambda _repo, path, *_args, **_kw:
                        legacy if path == "README.md" else None)
    problems = validator.validate_all([_repo()], github_token="test", allow_legacy_public=True)
    assert len(problems) == 1
    assert "missing docs/architecture/topology.md" in problems[0]


def test_missing_section_flagged():
    readme = "## The claim\n\nOnly one section.\n"
    problems = check_readme_sections(readme, _repo())
    assert any("Run it" in p for p in problems)


def test_run_it_fence_requires_a_command():
    for content in ("A benchmark exists.", "# TODO: add an invocation"):
        problems = check_readme_sections(GOOD_README.replace("pytest", content), _repo())
        assert any("runnable invocation" in problem for problem in problems)


def test_longer_closing_fence_preserves_following_sections():
    readme = GOOD_README.replace("pytest\n```", "pytest\n````")
    assert check_readme_sections(readme, _repo()) == []


def test_private_repo_keeps_legacy_type_contract():
    repo = _repo(visibility="private")
    legacy = """# Demo

## Abstract
Text.
## Status
Active.
## Runtime requirements
Python.
## Reproducibility
Tested.
## Datasets
None.
## Docs map
- docs/
"""
    assert check_readme_sections(legacy, repo) == []


def test_public_readme_enforces_first_screen_and_badge_limit():
    readme = GOOD_README.replace(
        "> A measured demo.\n", "[![a](a)](a) [![b](b)](b) [![c](c)](c) [![d](d)](d)\n"
    )
    problems = check_readme_sections(readme, _repo())
    assert any("badge" in problem for problem in problems)


def test_public_readme_rejects_reversed_canonical_order():
    sections = GOOD_README.split("## ")
    readme = sections[0] + "## " + "## ".join(reversed(sections[1:]))
    problems = check_readme_sections(readme, _repo())
    assert any("canonical order" in problem for problem in problems)


def test_public_readme_rejects_empty_section_and_run_without_invocation():
    readme = GOOD_README.replace("About the work.\n", "").replace(
        "```bash\npytest\n```", "Explain how to run it."
    )
    problems = check_readme_sections(readme, _repo())
    assert any("empty" in problem and "The claim" in problem for problem in problems)
    assert any("runnable" in problem for problem in problems)


def test_public_readme_keeps_audience_wording_flexible_for_human_review():
    padding = "\n".join(f"Context line {i}." for i in range(45))
    readme = GOOD_README.replace(
        "A Python 3.11+ benchmark for model evaluators.", padding + "\nFor model evaluators."
    )
    assert check_readme_sections(readme, _repo()) == []


def test_archive_public_readme_may_omit_claim():
    readme = GOOD_README.replace("## The claim\n\nAbout the work.\n\n", "")
    assert check_readme_sections(readme, _repo(status="archived", type="archive")) == []


def test_active_public_readme_may_not_omit_claim():
    readme = GOOD_README.replace("## The claim\n\nAbout the work.\n\n", "")
    assert any("The claim" in p for p in check_readme_sections(readme, _repo()))


def test_badges_after_first_screen_still_count_and_fences_do_not():
    late = "\n".join(f"Line {i}" for i in range(45))
    badges = "\n".join(
        f"[![badge {i}](badge-{i}.svg)](https://example.com/{i})" for i in range(4)
    )
    readme = GOOD_README + late + "\n" + badges
    assert any("badge" in p for p in check_readme_sections(readme, _repo()))
    fenced = GOOD_README + "\n```markdown\n" + badges + "\n```\n"
    assert not any("badge" in p for p in check_readme_sections(fenced, _repo()))


def test_fences_and_comments_do_not_supply_headings_or_bodies():
    readme = """# Demo

> A demo.

```markdown
## The claim
Fake evidence.
## Run it
demo
```
<!-- ## What it is -->
## What it is not

<!-- hidden boundary -->
## Docs map

- docs/
## License

MIT.
"""
    problems = check_readme_sections(readme, _repo())
    assert any("The claim" in p for p in problems)
    assert any("Run it" in p for p in problems)
    assert any("What it is" in p for p in problems)
    assert any("empty body" in p and "What it is not" in p for p in problems)


def test_empty_run_fence_is_not_an_invocation():
    readme = GOOD_README.replace("```bash\npytest\n```", "```bash\n\n```")
    assert any("runnable" in p for p in check_readme_sections(readme, _repo()))


def test_later_example_does_not_supply_run_invocation():
    readme = GOOD_README.replace("```bash\npytest\n```", "Python `3.12` is required.")
    readme += "\n## Examples\n\n```bash\npytest\n```\n"
    assert any("runnable" in p for p in check_readme_sections(readme, _repo()))


def test_run_invocation_itself_must_be_in_first_40_lines():
    preface = "\n".join(f"Prerequisite detail {i}." for i in range(35))
    readme = GOOD_README.replace("```bash\npytest\n```", preface + "\n```bash\npytest\n```")
    assert any("first 40 lines" in p and "invocation" in p for p in check_readme_sections(readme, _repo()))


@pytest.mark.parametrize(
    "wrapper",
    [
        lambda content: f"<!--\n{content}\n-->",
        lambda content: f"```markdown\n{content}\n```",
    ],
    ids=["comment", "fence"],
)
def test_hidden_heading_does_not_satisfy_public_required_presence(wrapper):
    visible = "## What it is\n\nA Python 3.11+ benchmark for model evaluators."
    readme = GOOD_README.replace(visible, wrapper(visible))
    problems = check_readme_sections(readme, _repo())
    assert any("missing README section 'What it is'" in p for p in problems)


def test_product_deployment_optional_for_non_web():
    readme = """# Lib

## Value proposition

Ships a library.

## Demo and status

Active.

## Quick start

pip install lib

## Architecture

See topology doc.

## Docs map

- docs/

## Ownership

Maintainer.
"""
    repo = _repo(type="product", bucket="apps", surface="library")
    problems = check_readme_sections(readme, repo)
    assert not any("Deployment" in p for p in problems)


def test_hub_exempt_from_checks():
    repo = _repo(slug="alawein", type="governance")
    assert check_readme_sections("# profile\n", repo) == []
    assert check_topology_file(None, repo) == []


def test_topology_tree_section_without_fence():
    content = """# topo

## Tree

edfp/
├── src/
└── docs/
"""
    assert topology_has_tree(content)


def test_catalog_collection_sections_pass():
    readme = """# Turing

## Purpose

Catalog.

## Structure

Layout.

## Add new work

Steps.

## Separation policy

Rules.

## Docs map

- docs/
"""
    repo = _repo(slug="turing", type="tooling", visibility="private")
    assert check_readme_sections(readme, repo) == []


def test_topology_file_missing():
    problems = check_topology_file(None, _repo(visibility="private"))
    assert any("topology.md" in p for p in problems)


def test_find_repo_by_slug():
    repos = [_repo(slug="demo", repo="alawein/demo")]
    assert find_repo_by_slug(repos, "alawein/demo") is not None
    assert find_repo_by_slug(repos, "demo") is not None


def test_main_requires_mode(tmp_path):
    repos_json = tmp_path / "repos.json"
    repos_json.write_text(
        '{"repos": [{"slug": "demo", "type": "research", "local_path": "lab/demo",'
        ' "repo": "alawein/demo", "bucket": "lab", "status": "active"}]}',
        encoding="utf-8",
    )
    assert main(["--repos-json", str(repos_json)]) == 2


def test_main_workspace_mode_passes(tmp_path):
    (tmp_path / "lab" / "demo").mkdir(parents=True)
    root = tmp_path / "lab" / "demo"
    (root / "README.md").write_text(GOOD_README, encoding="utf-8")
    topo_dir = root / "docs" / "architecture"
    topo_dir.mkdir(parents=True)
    (topo_dir / "topology.md").write_text(GOOD_TOPOLOGY, encoding="utf-8")
    repos_json = tmp_path / "repos.json"
    repos_json.write_text(json.dumps({"repos": [_repo()]}), encoding="utf-8")
    assert (
        main(
            [
                "--repos-json",
                str(repos_json),
                "--workspace-root",
                str(tmp_path),
            ]
        )
        == 0
    )


def test_main_single_repo_mode(tmp_path):
    repo_root = tmp_path / "repo"
    repo_root.mkdir()
    (repo_root / "README.md").write_text(GOOD_README, encoding="utf-8")
    topo = repo_root / "docs" / "architecture"
    topo.mkdir(parents=True)
    (topo / "topology.md").write_text(GOOD_TOPOLOGY, encoding="utf-8")
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
                "alawein/demo",
            ]
        )
        == 0
    )
