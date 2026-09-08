from __future__ import annotations

from kernel.config import RepoContext
from kernel.manifest import build_manifest, compare_manifests, is_conformant
from kernel.render import apply_managed_block, render_file, render_repo


def _ctx(**overrides) -> RepoContext:
    defaults = dict(
        slug="widget",
        repo_name="Widget",
        canonical_description="A widget.",
        profile="python-lib",
        type="tooling",
        owner="alawein",
        maintainer="Meshal Alawein",
        visibility="private",
        local_path="core/widget",
        archived=False,
        kernel_version="0.1.0",
    )
    defaults.update(overrides)
    return RepoContext(**defaults)


def test_archive_profile_is_renderer_exempt():
    ctx = _ctx(profile="archive")
    assert render_repo(ctx) == []


def test_archived_flag_is_renderer_exempt_regardless_of_profile():
    ctx = _ctx(profile="python-lib", archived=True)
    assert render_repo(ctx) == []


def test_render_repo_produces_expected_relpaths():
    ctx = _ctx()
    managed_files = render_repo(ctx)
    relpaths = {mf.relpath for mf in managed_files}
    assert relpaths == {
        "README.md",
        "AGENTS.md",
        "service-metadata.yaml",
        ".drift-rules.yaml",
        ".editorconfig",
        ".gitattributes",
        ".kernel/hooks/pre-commit",
        ".kernel/hooks/commit-msg",
        ".kernel/hooks/pre-push",
    }


def test_hook_files_keep_shebang_as_first_line():
    ctx = _ctx()
    managed_files = render_repo(ctx)
    for relpath in (".kernel/hooks/pre-commit", ".kernel/hooks/commit-msg", ".kernel/hooks/pre-push"):
        mf = next(m for m in managed_files if m.relpath == relpath)
        rendered = render_file(None, mf, ctx.kernel_version)
        first_line = rendered.splitlines()[0]
        assert first_line == "#!/bin/sh", f"{relpath}: shebang not on line 1: {first_line!r}"
        assert rendered.splitlines()[1].startswith("# kernel:managed:start")


def test_hook_files_are_in_executable_paths():
    from kernel.render import EXECUTABLE_PATHS

    assert EXECUTABLE_PATHS == {
        ".kernel/hooks/pre-commit",
        ".kernel/hooks/commit-msg",
        ".kernel/hooks/pre-push",
    }


def test_render_is_idempotent_across_two_runs():
    ctx = _ctx()
    managed_files = render_repo(ctx)

    # First pass: no existing file.
    first_pass = {mf.relpath: render_file(None, mf, ctx.kernel_version) for mf in managed_files}

    # Second pass: feed each first-pass output back in as "existing" content.
    second_pass = {
        mf.relpath: render_file(first_pass[mf.relpath], mf, ctx.kernel_version) for mf in managed_files
    }

    assert first_pass == second_pass


def test_block_marker_preserves_local_body():
    managed_body = "Managed line."
    existing = apply_managed_block("", managed_body, "0.1.0", "markdown")
    existing_with_local = existing + "\nHuman-written local content.\n"

    updated = apply_managed_block(existing_with_local, "Managed line, updated.", "0.1.0", "markdown")

    assert "Human-written local content." in updated
    assert "Managed line, updated." in updated
    assert "Managed line." not in updated  # old managed body replaced, not duplicated


def test_block_marker_new_file_has_no_local_body_duplication():
    out = apply_managed_block("", "Managed line.", "0.1.0", "markdown")
    assert out.count("kernel:managed:start") == 1
    assert out.count("kernel:managed:end") == 1


def test_full_file_kind_ignores_prior_local_edits_outside_markers():
    ctx = _ctx()
    managed_files = render_repo(ctx)
    editorconfig = next(mf for mf in managed_files if mf.relpath == ".editorconfig")
    existing_with_junk = "some stray line that should not survive\n"
    rendered = render_file(existing_with_junk, editorconfig, ctx.kernel_version)
    assert "stray line" not in rendered
    assert "kernel:managed:start" in rendered


def test_manifest_stable_across_repeated_builds():
    ctx = _ctx()
    managed_files = render_repo(ctx)
    m1 = build_manifest(managed_files, ctx.kernel_version)
    m2 = build_manifest(managed_files, ctx.kernel_version)
    assert m1 == m2


def test_manifest_unaffected_by_local_body_changes():
    ctx = _ctx()
    managed_files = render_repo(ctx)
    manifest_a = build_manifest(managed_files, ctx.kernel_version)

    # Local-body edits happen after rendering and do not touch ManagedFile.content,
    # so the manifest built from the same managed_files is unchanged.
    manifest_b = build_manifest(managed_files, ctx.kernel_version)
    assert manifest_a == manifest_b


def test_compare_manifests_detects_missing_drifted_extra():
    expected = {"kernel_version": "0.1.0", "files": {"a": "hash-a", "b": "hash-b"}}
    actual = {"kernel_version": "0.1.0", "files": {"b": "different-hash", "c": "hash-c"}}
    comparison = compare_manifests(expected, actual)
    assert comparison["missing"] == ["a"]
    assert comparison["drifted"] == ["b"]
    assert comparison["extra"] == ["c"]
    assert not is_conformant(comparison)


def test_compare_manifests_conformant_when_identical():
    manifest = {"kernel_version": "0.1.0", "files": {"a": "hash-a"}}
    comparison = compare_manifests(manifest, dict(manifest))
    assert is_conformant(comparison)


def test_compare_manifests_flags_kernel_version_mismatch():
    expected = {"kernel_version": "0.2.0", "files": {}}
    actual = {"kernel_version": "0.1.0", "files": {}}
    comparison = compare_manifests(expected, actual)
    assert not is_conformant(comparison)
    assert "kernel_version_mismatch" in comparison


# --- Workflow files (.github/workflows/{ci,codeql,docs-doctrine,drift}.yml) ---
#
# Gated on ctx.workflow_pin_ready / ctx.drift_pin_ready (ADR 0008, Phase 6-8
# execution plan step 3): absent from the managed set until a real kernel
# release tag / repo-drift release SHA exists, so a repo never gets an
# unpinned reusable-workflow reference.


def test_workflow_files_absent_when_pin_not_set():
    ctx = _ctx()  # workflow_pin_sha=None by default
    relpaths = {mf.relpath for mf in render_repo(ctx)}
    assert ".github/workflows/ci.yml" not in relpaths
    assert ".github/workflows/codeql.yml" not in relpaths
    assert ".github/workflows/docs-doctrine.yml" not in relpaths
    assert ".github/workflows/drift.yml" not in relpaths


def test_ci_and_docs_doctrine_appear_once_workflow_pin_is_set():
    ctx = _ctx(workflow_pin_sha="kernel-v0.1.0")
    relpaths = {mf.relpath for mf in render_repo(ctx)}
    assert ".github/workflows/ci.yml" in relpaths
    assert ".github/workflows/docs-doctrine.yml" in relpaths
    # codeql.yml requires a codeql_languages mapping for the profile
    # (python-lib has one); drift.yml additionally requires
    # repo_drift_release_sha, which is still unset here.
    assert ".github/workflows/codeql.yml" in relpaths
    assert ".github/workflows/drift.yml" not in relpaths


def test_drift_yml_requires_both_pins_set():
    ctx = _ctx(workflow_pin_sha="kernel-v0.1.0", repo_drift_release_sha="abc123deadbeef")
    relpaths = {mf.relpath for mf in render_repo(ctx)}
    assert ".github/workflows/drift.yml" in relpaths


def test_codeql_absent_for_profile_with_no_codeql_languages_mapping():
    ctx = _ctx(profile="docs-hub", workflow_pin_sha="kernel-v0.1.0")
    relpaths = {mf.relpath for mf in render_repo(ctx)}
    assert ".github/workflows/codeql.yml" not in relpaths
    assert ".github/workflows/ci.yml" in relpaths  # docs-hub still gets a no-op ci.yml


def test_ci_yml_picks_template_by_profile_ci_kind():
    node_ctx = _ctx(profile="node-lib", workflow_pin_sha="kernel-v0.1.0")
    python_ctx = _ctx(profile="python-lib", workflow_pin_sha="kernel-v0.1.0")
    none_ctx = _ctx(profile="paper", workflow_pin_sha="kernel-v0.1.0")

    node_ci = next(mf for mf in render_repo(node_ctx) if mf.relpath == ".github/workflows/ci.yml")
    python_ci = next(mf for mf in render_repo(python_ctx) if mf.relpath == ".github/workflows/ci.yml")
    none_ci = next(mf for mf in render_repo(none_ctx) if mf.relpath == ".github/workflows/ci.yml")

    assert "ci-node.yml" in node_ci.content
    assert "ci-python.yml" in python_ci.content
    assert "No build runtime for this profile" in none_ci.content


def test_workflow_pin_sha_is_substituted_into_uses_line():
    ctx = _ctx(workflow_pin_sha="kernel-v0.1.0")
    ci = next(mf for mf in render_repo(ctx) if mf.relpath == ".github/workflows/ci.yml")
    assert "@kernel-v0.1.0" in ci.content
    # GitHub Actions expression syntax must survive safe_substitute untouched.
    assert "${{ github.workflow }}" in ci.content


def test_workflow_files_are_idempotent_across_two_runs():
    ctx = _ctx(workflow_pin_sha="kernel-v0.1.0", repo_drift_release_sha="abc123deadbeef")
    managed_files = [mf for mf in render_repo(ctx) if mf.relpath.startswith(".github/workflows/")]
    assert managed_files, "expected at least one rendered workflow file"

    first_pass = {mf.relpath: render_file(None, mf, ctx.kernel_version) for mf in managed_files}
    second_pass = {
        mf.relpath: render_file(first_pass[mf.relpath], mf, ctx.kernel_version) for mf in managed_files
    }
    assert first_pass == second_pass


def test_workflow_files_included_in_manifest_once_pin_ready():
    ctx = _ctx(workflow_pin_sha="kernel-v0.1.0", repo_drift_release_sha="abc123deadbeef")
    managed_files = render_repo(ctx)
    manifest = build_manifest(managed_files, ctx.kernel_version)
    assert ".github/workflows/ci.yml" in manifest["files"]
    assert ".github/workflows/drift.yml" in manifest["files"]


def test_kernel_sync_guard_appears_once_workflow_pin_is_set_only():
    unset_ctx = _ctx()
    set_ctx = _ctx(workflow_pin_sha="kernel-v0.1.0")

    unset_relpaths = {mf.relpath for mf in render_repo(unset_ctx)}
    set_relpaths = {mf.relpath for mf in render_repo(set_ctx)}

    assert ".github/workflows/kernel-sync-guard.yml" not in unset_relpaths
    # Unlike drift.yml, the guard does not need repo_drift_release_sha.
    assert ".github/workflows/kernel-sync-guard.yml" in set_relpaths


def test_kernel_sync_guard_references_pinned_hub_ref():
    ctx = _ctx(workflow_pin_sha="kernel-v0.1.0")
    guard = next(mf for mf in render_repo(ctx) if mf.relpath == ".github/workflows/kernel-sync-guard.yml")
    assert "ref: kernel-v0.1.0" in guard.content
    assert "repository: alawein/alawein" in guard.content
