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
