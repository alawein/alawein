"""Tests for validate-readme-topology.py."""

import json

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
        "bucket": "research",
        "type": "research",
        "status": "active",
        "local_path": "research/demo",
        "repo": "alawein/demo",
        "surface": "library",
    }
    base.update(kw)
    return base


GOOD_README = """# Demo

Status: active
Category: research
Owner: alawein
Visibility: public
Purpose: Demo repo.
Next action: continue

## Abstract

About the work.

## Status

- Lifecycle: active

## Runtime requirements

Python 3.11+

## Reproducibility

```bash
pytest
```

## Datasets

None.

## Docs map

- docs/README.md
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


def test_topology_has_tree_requires_block():
    assert topology_has_tree(GOOD_TOPOLOGY)
    assert not topology_has_tree("# empty\n")


def test_research_readme_sections_pass():
    assert check_readme_sections(GOOD_README, _repo()) == []


def test_missing_section_flagged():
    readme = "## Abstract\n\nOnly one section.\n"
    problems = check_readme_sections(readme, _repo())
    assert any("Runtime requirements" in p for p in problems)


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
    repo = _repo(type="product", bucket="products", surface="library")
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
    repo = _repo(slug="turing", type="tooling")
    assert check_readme_sections(readme, repo) == []


def test_topology_file_missing():
    problems = check_topology_file(None, _repo())
    assert any("topology.md" in p for p in problems)


def test_find_repo_by_slug():
    repos = [_repo(slug="demo", repo="alawein/demo")]
    assert find_repo_by_slug(repos, "alawein/demo") is not None
    assert find_repo_by_slug(repos, "demo") is not None


def test_main_requires_mode(tmp_path):
    repos_json = tmp_path / "repos.json"
    repos_json.write_text(
        '{"repos": [{"slug": "demo", "type": "research", "local_path": "research/demo",'
        ' "repo": "alawein/demo", "bucket": "research", "status": "active"}]}',
        encoding="utf-8",
    )
    assert main(["--repos-json", str(repos_json)]) == 2


def test_main_workspace_mode_passes(tmp_path):
    (tmp_path / "research" / "demo").mkdir(parents=True)
    root = tmp_path / "research" / "demo"
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
