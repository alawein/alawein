"""Regression tests for github-baseline-audit.py repo-dir resolution.

The audit (and the matching resolver in sync-github.sh) must resolve repos by the
bucketed local_path in catalog/repos.json (WORKSPACE/<bucket>/<slug>), not the old
flat layout (WORKSPACE/<slug>). The script filename is hyphenated and not
importable directly, so it is loaded by file path (same pattern as
test_sync_vercel.py).
"""

from __future__ import annotations

import importlib.util
import ast
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "github" / "github-baseline-audit.py"

_spec = importlib.util.spec_from_file_location("github_baseline_audit", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod

sys.path.insert(0, str(ROOT / "scripts" / "github"))
import _repo_paths  # noqa: E402  (shared resolver module both callers use)

sys.path.insert(0, str(ROOT / "scripts"))
import workspace_paths  # noqa: E402


def test_workspace_root_uses_explicit_environment_override(tmp_path) -> None:
    configured = tmp_path / "configured-workspace"

    assert workspace_paths.workspace_root_for(
        tmp_path / "core" / "alawein",
        {"ALAWEIN_WORKSPACE_ROOT": str(configured)},
    ) == configured.resolve()


def test_workspace_root_uses_parent_of_bucket_for_bucketed_repo(tmp_path) -> None:
    repo_root = tmp_path / "workspace" / "core" / "alawein"

    assert workspace_paths.workspace_root_for(repo_root, {}) == repo_root.parent.parent


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
    # incore lives at core/incore; the old flat layout looked for WORKSPACE/incore.
    if "incore" in audit.LOCAL_PATHS:
        assert audit.resolve_repo_dir("incore") == audit.WORKSPACE / "core" / "incore"


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


def test_local_path_map_accepts_top_level_list_and_strips_trailing_slash(tmp_path) -> None:
    cat = tmp_path / "repos.json"
    cat.write_text('[{"slug": "y", "local_path": "/research/y/"}]', encoding="utf-8")
    # Only the trailing "/" is stripped; the leading "/" survives so that a
    # genuinely absolute local_path still trips resolve_repo_dir's
    # Path.is_absolute() guard instead of being silently made relative.
    assert _repo_paths.load_local_path_map(tmp_path, cat) == {"y": "/research/y"}


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


# --- resolve_repo_dir rejects catalog data that would escape the workspace ---


def test_resolve_rejects_absolute_local_path(tmp_path) -> None:
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    absolute = str((tmp_path / "elsewhere").resolve())
    with pytest.raises(_repo_paths.PathEscapesWorkspaceError):
        _repo_paths.resolve_repo_dir(workspace, {"evil": absolute}, "evil")


def test_resolve_rejects_parent_traversal(tmp_path) -> None:
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    with pytest.raises(_repo_paths.PathEscapesWorkspaceError):
        _repo_paths.resolve_repo_dir(workspace, {"evil": "../../etc/passwd"}, "evil")


def test_resolve_still_returns_flat_fallback_for_uncatalogued_slug_after_fix(tmp_path) -> None:
    # The traversal/absolute guard only applies to catalogued local_path values;
    # the uncatalogued flat-slug fallback (a plain repo slug, not catalog data)
    # must keep working exactly as before.
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    resolved = _repo_paths.resolve_repo_dir(workspace, {}, "not-catalogued")
    assert resolved == workspace / "not-catalogued"


def test_resolve_still_returns_normal_bucketed_path(tmp_path) -> None:
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    resolved = _repo_paths.resolve_repo_dir(workspace, {"incore": "core/incore"}, "incore")
    assert resolved == workspace / "core" / "incore"


def test_resolve_rejects_symlink_escaping_workspace(tmp_path) -> None:
    # A symlink whose target lands outside the workspace must be rejected even
    # though the *lexical* local_path never contains ".." or a leading "/".
    workspace = tmp_path / "workspace"
    (workspace / "core").mkdir(parents=True)
    outside = tmp_path / "outside"
    outside.mkdir()
    (workspace / "core" / "evilrepo").symlink_to(outside)
    with pytest.raises(_repo_paths.PathEscapesWorkspaceError):
        _repo_paths.resolve_repo_dir(workspace, {"evil": "core/evilrepo"}, "evil")


def test_resolve_rejects_symlink_redirecting_to_another_repo_within_workspace(tmp_path) -> None:
    # Regression: a symlink planted *inside* the workspace that redirects one
    # repo's bucketed directory onto another repo's checkout (e.g. this
    # control-plane repo) never escapes the workspace boundary, so the plain
    # relative_to(workspace) containment check alone does not catch it. A
    # mutation caller (sync-github.sh's sync_repo) that trusted this path
    # would silently write/delete files in the wrong checkout.
    workspace = tmp_path / "workspace"
    control_plane = workspace / "core" / "alawein"
    control_plane.mkdir(parents=True)
    (control_plane / "SENSITIVE.md").write_text("do not touch", encoding="utf-8")
    (workspace / "apps").mkdir()
    (workspace / "apps" / "evilrepo").symlink_to(control_plane)
    with pytest.raises(_repo_paths.PathEscapesWorkspaceError):
        _repo_paths.resolve_repo_dir(workspace, {"evil": "apps/evilrepo"}, "evil")


def test_resolve_accepts_real_bucketed_directory_with_no_symlinks(tmp_path) -> None:
    # Sanity check: the new symlink-consistency guard must not reject a
    # perfectly normal, symlink-free bucketed checkout.
    workspace = tmp_path / "workspace"
    real_dir = workspace / "core" / "incore"
    real_dir.mkdir(parents=True)
    resolved = _repo_paths.resolve_repo_dir(workspace, {"incore": "core/incore"}, "incore")
    assert resolved == real_dir


def test_load_local_path_map_preserves_absolute_paths_for_the_guard(tmp_path) -> None:
    # Regression: load_local_path_map used to strip() both leading and trailing
    # "/" off local_path, so a catalogued absolute path like "/etc/passwd" came
    # back as the relative "etc/passwd" and sailed past resolve_repo_dir's
    # Path.is_absolute() guard. The two functions must be tested together --
    # calling resolve_repo_dir directly with a hand-built dict (as the tests
    # above do) does not exercise this normalization at all.
    catalog_path = tmp_path / "repos.json"
    catalog_path.write_text(
        '{"repos": [{"slug": "evil", "local_path": "/etc/passwd"}]}',
        encoding="utf-8",
    )
    local_paths = _repo_paths.load_local_path_map(tmp_path, catalog_path=catalog_path)
    assert local_paths["evil"] == "/etc/passwd"

    workspace = tmp_path / "workspace"
    workspace.mkdir()
    with pytest.raises(_repo_paths.PathEscapesWorkspaceError):
        _repo_paths.resolve_repo_dir(workspace, local_paths, "evil")


def _checkout(path: Path, remote: str) -> Path:
    subprocess.run(["git", "init", str(path)], check=True, capture_output=True)
    subprocess.run(["git", "-C", str(path), "remote", "add", "origin", remote], check=True)
    return path


@pytest.mark.parametrize("remote", [
    "https://github.com/alawein/demo.git", "git@github.com:alawein/demo.git",
    "ssh://git@github.com/alawein/demo.git", "ssh://git@ssh.github.com:443/alawein/demo.git",
])
def test_expected_checkout_accepts_git_repository(tmp_path, remote):
    repo = _checkout(tmp_path / "demo", remote)
    _repo_paths.require_repo_checkout(repo, "alawein/demo")


@pytest.mark.parametrize("remote", [
    "ssh://git@ssh.github.com.evil.test:443/alawein/demo.git",
    "https://ssh.github.com:443/alawein/demo.git",
    "ssh://git@ssh.github.com:22/alawein/demo.git",
    "ssh://git@ssh.github.com/alawein/demo.git",
])
def test_expected_checkout_rejects_unrecognized_host(tmp_path, remote):
    repo = _checkout(tmp_path / "demo", remote)
    with pytest.raises(ValueError, match="checkout origin"):
        _repo_paths.require_repo_checkout(repo, "alawein/demo")


@pytest.mark.parametrize("case", ["wrong-repo", "wrong-owner", "nested", "not-git"])
def test_sync_refuses_unexpected_checkout_before_writing(tmp_path, case):
    remote = "https://github.com/alawein/demo.git"
    if case == "wrong-repo":
        remote = "https://github.com/alawein/control-plane.git"
    elif case == "wrong-owner":
        remote = "https://github.com/other/demo.git"
    repo = tmp_path / "demo"
    if case == "not-git":
        repo.mkdir()
    else:
        _checkout(repo, remote)
    if case == "nested":
        repo = repo / "nested"
        repo.mkdir()
    sentinel = repo / "sentinel.txt"
    sentinel.write_text("preserve", encoding="utf-8")
    shell = (ROOT / "scripts/github/sync-github.sh").read_text(encoding="utf-8")
    body = shell.split("<<'PY'\n", 1)[1].rsplit("\nPY", 1)[0]
    node = next(n for n in ast.parse(body).body if isinstance(n, ast.FunctionDef) and n.name == "sync_repo")
    def reject_write(*args, **kwargs):
        pytest.fail("sync attempted a write before checking repository identity")
    namespace = {
        "LOCAL_PATHS": {"demo": str(repo)}, "resolve_repo_dir": lambda _: repo,
        "_repo_paths": _repo_paths, "TEMPLATE_MAP": {"sentinel.txt": sentinel},
        "ensure_text": reject_write,
    }
    exec(compile(ast.Module(body=[node], type_ignores=[]), "sync_repo", "exec"), namespace)
    with pytest.raises(SystemExit, match="checkout"):
        namespace["sync_repo"]({"repo": "demo"}, check=False)
    assert sentinel.read_text(encoding="utf-8") == "preserve"
