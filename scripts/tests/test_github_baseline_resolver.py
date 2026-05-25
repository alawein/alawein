"""Regression tests for github-baseline-audit.py repo-dir resolution.

The audit (and the matching resolver in sync-github.sh) must resolve repos by the
bucketed local_path in catalog/repos.json (WORKSPACE/<bucket>/<slug>), not the old
flat layout (WORKSPACE/<slug>). The script filename is hyphenated and not
importable directly, so it is loaded by file path (same pattern as
test_sync_vercel.py).
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "github" / "github-baseline-audit.py"

_spec = importlib.util.spec_from_file_location("github_baseline_audit", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod

sys.path.insert(0, str(ROOT / "scripts" / "github"))
import _repo_paths  # noqa: E402  (shared resolver module both callers use)


def test_catalog_local_paths_loaded() -> None:
    # The catalog must load into a non-empty slug -> local_path map.
    assert audit.LOCAL_PATHS, "LOCAL_PATHS is empty; catalog/repos.json did not load"


def test_resolve_uses_bucketed_local_path() -> None:
    # Every catalogued slug resolves to WORKSPACE / local_path (bucketed), and that
    # differs from the old flat WORKSPACE / slug whenever the repo lives in a bucket.
    bucketed = [slug for slug, lp in audit.LOCAL_PATHS.items() if "/" in lp]
    assert bucketed, "expected at least one bucketed local_path in the catalog"
    for slug in bucketed:
        expected = audit.WORKSPACE / audit.LOCAL_PATHS[slug]
        assert audit.resolve_repo_dir(slug) == expected
        # Regression guard: must NOT fall back to the flat layout.
        assert audit.resolve_repo_dir(slug) != audit.WORKSPACE / slug


def test_resolve_concrete_known_repo() -> None:
    # incore lives at tools/incore; the old flat layout looked for WORKSPACE/incore.
    if "incore" in audit.LOCAL_PATHS:
        assert audit.resolve_repo_dir("incore") == audit.WORKSPACE / "tools" / "incore"


def test_resolve_falls_back_to_flat_for_uncatalogued_slug() -> None:
    # A slug absent from the catalog keeps the flat fallback (e.g. the control-plane
    # repo itself, which is sync: manual and skipped by the per-repo checks anyway).
    fake = "definitely-not-a-real-repo-slug-xyz"
    assert fake not in audit.LOCAL_PATHS
    assert audit.resolve_repo_dir(fake) == audit.WORKSPACE / fake


# --- _local_path_map parsing and load-failure behavior (fixture-injected) ---

def test_local_path_map_parses_dict_with_repos(tmp_path) -> None:
    cat = tmp_path / "repos.json"
    cat.write_text('{"repos": [{"slug": "x", "local_path": "tools/x"}]}', encoding="utf-8")
    assert _repo_paths.load_local_path_map(tmp_path,cat) == {"x": "tools/x"}


def test_local_path_map_accepts_top_level_list_and_strips_slashes(tmp_path) -> None:
    cat = tmp_path / "repos.json"
    cat.write_text('[{"slug": "y", "local_path": "/research/y/"}]', encoding="utf-8")
    assert _repo_paths.load_local_path_map(tmp_path,cat) == {"y": "research/y"}


def test_local_path_map_accepts_dict_of_dicts(tmp_path) -> None:
    cat = tmp_path / "repos.json"
    cat.write_text(
        '{"repos": {"x": {"slug": "x", "local_path": "tools/x"}}}', encoding="utf-8"
    )
    assert _repo_paths.load_local_path_map(tmp_path,cat) == {"x": "tools/x"}


def test_local_path_map_drops_entries_missing_keys(tmp_path) -> None:
    cat = tmp_path / "repos.json"
    cat.write_text(
        '{"repos": [{"slug": "ok", "local_path": "tools/ok"}, {"slug": "noPath"}, '
        '{"local_path": "x/y"}]}',
        encoding="utf-8",
    )
    assert _repo_paths.load_local_path_map(tmp_path,cat) == {"ok": "tools/ok"}


def test_local_path_map_returns_empty_on_malformed_json(tmp_path) -> None:
    cat = tmp_path / "repos.json"
    cat.write_text("{ this is not valid json", encoding="utf-8")
    assert _repo_paths.load_local_path_map(tmp_path,cat) == {}


def test_local_path_map_returns_empty_on_missing_file(tmp_path) -> None:
    assert _repo_paths.load_local_path_map(tmp_path,tmp_path / "does-not-exist.json") == {}


# --- check_repo surfaces catalog drift / load failure loudly (no silent flat-resolve) ---

def test_check_repo_flags_auto_slug_missing_from_catalog() -> None:
    errors: list[str] = []
    audit.check_repo({"repo": "definitely-not-a-real-repo-slug-xyz", "sync": "auto"}, errors)
    assert errors, "an uncatalogued auto repo must produce an error, not a silent flat-resolve"
    assert any("catalog" in e for e in errors)


def test_check_repo_skips_manual_repos() -> None:
    errors: list[str] = []
    audit.check_repo({"repo": "some-uncatalogued-manual-repo", "sync": "manual"}, errors)
    assert errors == []
