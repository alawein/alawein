"""Source ownership survives compilation, regeneration and export."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "catalog"))
from compile_index import compile_index, export_index  # noqa: E402


def test_source_defaults_replace_placeholder_but_preserve_account_owner():
    index = {
        "lastVerified": "2026-09-06",
        "ownership_defaults": {"maintainer": "Meshal Alawein", "docs_owner": "Meshal Alawein"},
        "lanes": {"platform": [{"slug": "demo", "about": "Demo"}]},
    }
    prior = {"repos": [{"slug": "demo", "owner": "alawein", "maintainer": "alawein-core", "docs_owner": "alawein-core"}]}
    result = compile_index(index, prior)
    repo = result["repos"][0]
    assert repo["maintainer"] == repo["docs_owner"] == "Meshal Alawein"
    assert repo["owner"] == "alawein"
    assert compile_index(index, result) == result


def test_per_repo_override_and_export_round_trip():
    index = {
        "ownership_defaults": {"maintainer": "Meshal Alawein", "docs_owner": "Meshal Alawein"},
        "lanes": {"platform": [{"slug": "demo", "docs_owner": "Recorded external owner"}]},
    }
    compiled = compile_index(index, {"repos": []})
    assert compiled["repos"][0]["docs_owner"] == "Recorded external owner"
    exported = export_index(compiled)
    rebuilt = compile_index(exported, compiled)
    for key in ("owner", "maintainer", "docs_owner"):
        assert rebuilt["repos"][0][key] == compiled["repos"][0][key]


def test_legacy_index_keeps_prior_known_ownership():
    prior = {"repos": [{"slug": "demo", "maintainer": "Known maintainer", "docs_owner": "Known editor"}]}
    result = compile_index({"lanes": {"platform": [{"slug": "demo"}]}}, prior)
    assert result["repos"][0]["maintainer"] == "Known maintainer"
    assert result["repos"][0]["docs_owner"] == "Known editor"


def test_namespace_override_keeps_repository_identity_consistent():
    index = {"lanes": {"platform": [{"slug": "demo", "owner": "example-org"}]}}
    compiled = compile_index(index, {"repos": []})
    repo = compiled["repos"][0]
    assert repo["owner"] == "example-org"
    assert repo["repo"] == "example-org/demo"
    assert repo["homepage"] == "https://github.com/example-org/demo"
    assert compile_index(export_index(compiled), compiled)["repos"][0] == repo


def test_namespace_override_preserves_explicit_product_homepage():
    index = {"lanes": {"platform": [{"slug": "demo", "owner": "example-org", "url": "https://example.org"}]}}
    repo = compile_index(index, {"repos": []})["repos"][0]
    assert repo["repo"] == "example-org/demo"
    assert repo["homepage"] == "https://example.org"
