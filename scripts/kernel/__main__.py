"""CLI: ``python -m kernel render --repo <name> --out <path> [--check]``.

Run from ``core/alawein/scripts`` (or with ``PYTHONPATH=scripts``) so the
``kernel`` package is importable, e.g.::

    cd core/alawein/scripts
    python -m kernel render --repo bolts --out ../../../apps/bolts --check
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .config import load_kernel_config, load_repo_context
from .diff import diff_repo, format_report
from .manifest import build_manifest, manifest_json
from .render import render_file, render_repo


def _cmd_render(args: argparse.Namespace) -> int:
    kernel_cfg = load_kernel_config()
    ctx = load_repo_context(args.repo, kernel_cfg)
    out_dir = Path(args.out)

    if args.check:
        diffs = diff_repo(ctx, out_dir, kernel_cfg)
        report = format_report(args.repo, diffs)
        print(report)
        return 1 if any(d.changed for d in diffs) else 0

    managed_files = render_repo(ctx)
    if not managed_files:
        print(f"{args.repo}: renderer-exempt (archived profile). Nothing to write.")
        return 0

    for mf in managed_files:
        target = out_dir / mf.relpath
        existing = target.read_text(encoding="utf-8") if target.exists() else None
        rendered = render_file(existing, mf, kernel_cfg.kernel_version)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(rendered, encoding="utf-8", newline="\n")

    manifest = build_manifest(managed_files, kernel_cfg.kernel_version)
    (out_dir / ".kernel-manifest.json").write_text(
        manifest_json(manifest), encoding="utf-8", newline="\n"
    )
    print(f"{args.repo}: rendered {len(managed_files)} managed file(s) to {out_dir}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="kernel")
    sub = parser.add_subparsers(dest="command", required=True)

    render_parser = sub.add_parser("render", help="Render managed files for one repo")
    render_parser.add_argument("--repo", required=True, help="Catalog slug")
    render_parser.add_argument("--out", required=True, help="Target repo checkout path")
    render_parser.add_argument(
        "--check", action="store_true", help="Dry-run: report diffs, write nothing"
    )
    render_parser.set_defaults(func=_cmd_render)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
