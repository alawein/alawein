"""Render kernel-managed files for one repo.

Two file kinds:

* ``full`` -- the entire file is kernel-managed (e.g. ``.editorconfig``,
  ``.drift-rules.yaml``, ``service-metadata.yaml``). The renderer's output
  *is* the file content.
* ``block`` -- the file is a mix of managed and local content (e.g.
  ``README.md``, ``AGENTS.md``, ``.gitattributes``). The renderer only owns
  the text between the markers; everything else in the file is preserved
  untouched.

Markers use the comment syntax appropriate to the file: ``<!-- ... -->`` for
Markdown, ``# ...`` for YAML/ini-style text. Never re-render on ``check``;
``diff.py`` is the read-only comparison path and ``manifest.py`` is the
verification surface ``repo-drift`` uses instead of re-rendering.
"""

from __future__ import annotations

import string
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

from .config import RepoContext
from .paths import COMMON_TEMPLATES_DIR

MarkerStyle = Literal["markdown", "hash"]

_MARKER_TEXT = {
    "markdown": ("<!-- kernel:managed:start v{version} -->", "<!-- kernel:managed:end -->"),
    "hash": ("# kernel:managed:start v{version}", "# kernel:managed:end"),
}


def markers_for(style: MarkerStyle, version: str) -> tuple[str, str]:
    start_tmpl, end = _MARKER_TEXT[style]
    return start_tmpl.format(version=version), end


@dataclass(frozen=True)
class ManagedFile:
    relpath: str
    kind: Literal["full", "block"]
    marker_style: MarkerStyle
    content: str  # for "full": the whole file; for "block": the managed block body only


# (relpath, template filename, kind, marker style)
#
# Known Phase 1 simplification: kernel-spec.md's canonical tree describes
# .drift-rules.yaml as "managed block + local overrides", but YAML has no
# generic block-splice merge for a structured key like `detector_config:`.
# Until a real YAML-aware merge exists, .drift-rules.yaml renders as "full"
# (kernel-owned baseline only). A repo needing local detector_config entries
# beyond the kernel baseline has to add them by hand outside this renderer
# for now; re-rendering will overwrite them. Tracked as an open item, not
# silently glossed over.
_MANAGED_SPECS: list[tuple[str, str, Literal["full", "block"], MarkerStyle]] = [
    ("README.md", "README.header.md.tmpl", "block", "markdown"),
    ("AGENTS.md", "AGENTS.section.md.tmpl", "block", "markdown"),
    ("service-metadata.yaml", "service-metadata.yaml.tmpl", "full", "hash"),
    (".drift-rules.yaml", "drift-rules.yaml.tmpl", "full", "hash"),
    (".editorconfig", "editorconfig.tmpl", "full", "hash"),
    (".gitattributes", "gitattributes.tmpl", "block", "hash"),
    (".kernel/hooks/pre-commit", "hooks-pre-commit.tmpl", "full", "hash"),
    (".kernel/hooks/commit-msg", "hooks-commit-msg.tmpl", "full", "hash"),
    (".kernel/hooks/pre-push", "hooks-pre-push.tmpl", "full", "hash"),
]

# Profile -> ci.yml template filename, keyed by RepoContext.ci_kind.
_CI_TEMPLATE_BY_KIND = {
    "node": "ci-node.yml.tmpl",
    "python": "ci-python.yml.tmpl",
    "none": "ci-none.yml.tmpl",
}

# .github/workflows/{ci,codeql,docs-doctrine,drift}.yml (relpath, template
# filename). Gated behind ctx.workflow_pin_ready / ctx.drift_pin_ready in
# render_repo below -- rendering these before a real kernel release tag
# exists would ship an unpinned reusable-workflow reference fleet-wide
# (ADR 0008, Phase 6-8 execution plan step 3).
_WORKFLOW_KIND = "full"
_WORKFLOW_MARKER_STYLE: MarkerStyle = "hash"

# Relative paths (from _MANAGED_SPECS above) that need the executable bit
# once written to disk. Windows/NTFS has no real POSIX exec bit; git tracks
# mode via its index instead, and git for Windows commonly runs with
# core.fileMode=false, so writing chmod 0o755 here is best-effort only. A
# repo adopting these hooks for the first time on Windows still needs one
# explicit `git update-index --chmod=+x .kernel/hooks/pre-commit` (etc.) as
# part of that repo's Phase 6 wave -- the renderer does not run that command
# itself, since it is a one-time index-mode change, not a file write.
EXECUTABLE_PATHS = frozenset(
    {".kernel/hooks/pre-commit", ".kernel/hooks/commit-msg", ".kernel/hooks/pre-push"}
)


def _render_template(template_path: Path, variables: dict[str, str]) -> str:
    text = template_path.read_text(encoding="utf-8")
    # safe_substitute (not substitute): the .kernel/hooks/* shell templates
    # are full of literal `$1`, `$(...)`, `$SUBJECT` shell syntax that is not
    # a kernel template placeholder. `substitute()` raises on any bare `$`
    # it can't resolve as an identifier; `safe_substitute()` only replaces
    # placeholders that match a known variable and leaves everything else
    # (including shell `$` syntax) untouched.
    return string.Template(text).safe_substitute(variables)


def render_repo(
    ctx: RepoContext, templates_dir: Path = COMMON_TEMPLATES_DIR
) -> list[ManagedFile]:
    """Render the managed file set for one repo. Empty list for renderer-exempt repos."""
    if ctx.is_renderer_exempt:
        return []

    variables = ctx.template_vars()
    out: list[ManagedFile] = []
    for relpath, template_name, kind, marker_style in _MANAGED_SPECS:
        template_path = templates_dir / template_name
        rendered = _render_template(template_path, variables)
        out.append(
            ManagedFile(
                relpath=relpath,
                kind=kind,
                marker_style=marker_style,
                content=rendered,
            )
        )

    # .github/workflows/{ci,codeql,docs-doctrine,drift}.yml: gated on a real
    # kernel release tag existing (ctx.workflow_pin_ready). Until then these
    # stay absent from the managed set rather than rendering with an empty
    # or guessed pin.
    if ctx.workflow_pin_ready:
        ci_template = _CI_TEMPLATE_BY_KIND[ctx.ci_kind]
        out.append(
            ManagedFile(
                relpath=".github/workflows/ci.yml",
                kind=_WORKFLOW_KIND,
                marker_style=_WORKFLOW_MARKER_STYLE,
                content=_render_template(templates_dir / ci_template, variables),
            )
        )
        out.append(
            ManagedFile(
                relpath=".github/workflows/docs-doctrine.yml",
                kind=_WORKFLOW_KIND,
                marker_style=_WORKFLOW_MARKER_STYLE,
                content=_render_template(templates_dir / "docs-doctrine.yml.tmpl", variables),
            )
        )
        if ctx.codeql_languages:
            out.append(
                ManagedFile(
                    relpath=".github/workflows/codeql.yml",
                    kind=_WORKFLOW_KIND,
                    marker_style=_WORKFLOW_MARKER_STYLE,
                    content=_render_template(templates_dir / "codeql.yml.tmpl", variables),
                )
            )
        if ctx.drift_pin_ready:
            out.append(
                ManagedFile(
                    relpath=".github/workflows/drift.yml",
                    kind=_WORKFLOW_KIND,
                    marker_style=_WORKFLOW_MARKER_STYLE,
                    content=_render_template(templates_dir / "drift.yml.tmpl", variables),
                )
            )

    return out


def apply_managed_block(existing_text: str, managed_body: str, version: str, style: MarkerStyle) -> str:
    """Merge a managed block into existing file content, preserving local body.

    If markers are already present, the text between them is replaced
    in-place. Otherwise the managed block is prepended, followed by a blank
    line and whatever local content already existed (empty string if the
    file is new).
    """
    start, end = markers_for(style, version)
    block = f"{start}\n{managed_body.rstrip()}\n{end}"

    if start in existing_text and end in existing_text:
        pre, rest = existing_text.split(start, 1)
        _, post = rest.split(end, 1)
        return f"{pre}{block}{post}"

    if existing_text.strip():
        return f"{block}\n\n{existing_text}"
    return f"{block}\n"


def render_full_file(existing_text: str | None, managed_content: str, version: str, style: MarkerStyle) -> str:
    """For 'full' kind files: the managed content wrapped in markers is the entire file.

    Any content outside the markers in a pre-existing full-managed file is
    dropped intentionally -- these paths are declared fully kernel-owned in
    docs/governance/kernel-spec.md's canonical tree.

    A leading shebang line (``#!...``) is kept outside the markers, on line
    one, since a shebang only works there -- this matters for the
    ``.kernel/hooks/*`` scripts, which git invokes directly.
    """
    start, end = markers_for(style, version)
    content = managed_content.rstrip()
    shebang = ""
    if content.startswith("#!"):
        first_line, _, content = content.partition("\n")
        shebang = f"{first_line}\n"
        content = content.rstrip()
    return f"{shebang}{start}\n{content}\n{end}\n"


def render_file(existing_text: str | None, managed_file: ManagedFile, version: str) -> str:
    if managed_file.kind == "full":
        return render_full_file(existing_text, managed_file.content, version, managed_file.marker_style)
    return apply_managed_block(existing_text or "", managed_file.content, version, managed_file.marker_style)
