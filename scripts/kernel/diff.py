"""Dry-run diff: what would change on disk if the renderer applied its output."""

from __future__ import annotations

import difflib
from dataclasses import dataclass
from pathlib import Path

from .config import KernelConfig, RepoContext
from .render import ManagedFile, render_file, render_repo


@dataclass(frozen=True)
class FileDiff:
    relpath: str
    changed: bool
    unified_diff: str


def diff_repo(ctx: RepoContext, repo_root: Path, kernel_cfg: KernelConfig) -> list[FileDiff]:
    managed_files = render_repo(ctx)
    diffs: list[FileDiff] = []
    for mf in managed_files:
        target = repo_root / mf.relpath
        existing = target.read_text(encoding="utf-8") if target.exists() else None
        rendered = render_file(existing, mf, kernel_cfg.kernel_version)
        current = existing or ""
        changed = current != rendered
        unified = (
            "".join(
                difflib.unified_diff(
                    current.splitlines(keepends=True),
                    rendered.splitlines(keepends=True),
                    fromfile=f"a/{mf.relpath}",
                    tofile=f"b/{mf.relpath}",
                )
            )
            if changed
            else ""
        )
        diffs.append(FileDiff(relpath=mf.relpath, changed=changed, unified_diff=unified))
    return diffs


def format_report(repo_slug: str, diffs: list[ManagedFile] | list[FileDiff]) -> str:
    changed = [d for d in diffs if d.changed]
    lines = [f"# kernel render dry-run: {repo_slug}", ""]
    if not diffs:
        lines.append("Renderer-exempt (archived profile). No managed files.")
        return "\n".join(lines) + "\n"
    if not changed:
        lines.append("No changes. Renderer output is byte-stable with what's on disk.")
        return "\n".join(lines) + "\n"
    lines.append(f"{len(changed)} of {len(diffs)} managed file(s) would change:")
    for d in changed:
        lines.append(f"\n## {d.relpath}\n")
        lines.append(d.unified_diff)
    return "\n".join(lines) + "\n"
