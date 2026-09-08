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
_MANAGED_SPECS: list[tuple[str, str, Literal["full", "block"], MarkerStyle]] = [
    ("README.md", "README.header.md.tmpl", "block", "markdown"),
    ("AGENTS.md", "AGENTS.section.md.tmpl", "block", "markdown"),
    ("service-metadata.yaml", "service-metadata.yaml.tmpl", "full", "hash"),
    (".drift-rules.yaml", "drift-rules.yaml.tmpl", "full", "hash"),
    (".editorconfig", "editorconfig.tmpl", "full", "hash"),
    (".gitattributes", "gitattributes.tmpl", "block", "hash"),
]


def _render_template(template_path: Path, variables: dict[str, str]) -> str:
    text = template_path.read_text(encoding="utf-8")
    return string.Template(text).substitute(variables)


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
    """
    start, end = markers_for(style, version)
    return f"{start}\n{managed_content.rstrip()}\n{end}\n"


def render_file(existing_text: str | None, managed_file: ManagedFile, version: str) -> str:
    if managed_file.kind == "full":
        return render_full_file(existing_text, managed_file.content, version, managed_file.marker_style)
    return apply_managed_block(existing_text or "", managed_file.content, version, managed_file.marker_style)
