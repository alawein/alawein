"""Produce catalog/generated/kernel-conformance.json from local checkouts.

Read-only: never writes into a target repo. For each repo in
catalog/repos.json, compares the manifest the renderer *would* produce
against ``<local_path>/.kernel-manifest.json`` if present on disk.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import iter_repo_contexts, load_kernel_config
from .manifest import build_manifest, compare_manifests, is_conformant
from .paths import GENERATED_DIR, WORKSPACE_ROOT
from .render import render_repo

CONFORMANCE_JSON = GENERATED_DIR / "kernel-conformance.json"


def _load_actual_manifest(repo_root: Path) -> dict[str, Any] | None:
    manifest_path = repo_root / ".kernel-manifest.json"
    if not manifest_path.exists():
        return None
    try:
        return json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def build_report(workspace_root: Path = WORKSPACE_ROOT) -> dict[str, Any]:
    kernel_cfg = load_kernel_config()
    repos_report: dict[str, Any] = {}
    conformant_count = 0
    active_count = 0

    for ctx in iter_repo_contexts(kernel_cfg):
        if ctx.is_renderer_exempt:
            repos_report[ctx.slug] = {
                "status": "exempt",
                "profile": ctx.profile,
                "reason": "archived profile, renderer-exempt",
            }
            continue

        active_count += 1
        repo_root = workspace_root / ctx.local_path
        managed_files = render_repo(ctx)
        expected = build_manifest(managed_files, kernel_cfg.kernel_version)

        if not repo_root.exists():
            repos_report[ctx.slug] = {
                "status": "unreachable",
                "profile": ctx.profile,
                "reason": f"local_path not found: {ctx.local_path}",
            }
            continue

        actual = _load_actual_manifest(repo_root)
        if actual is None:
            repos_report[ctx.slug] = {
                "status": "not_adopted",
                "profile": ctx.profile,
                "reason": ".kernel-manifest.json absent",
            }
            continue

        comparison = compare_manifests(expected, actual)
        conformant = is_conformant(comparison)
        if conformant:
            conformant_count += 1
        repos_report[ctx.slug] = {
            "status": "conformant" if conformant else "drifted",
            "profile": ctx.profile,
            "comparison": comparison,
        }

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "active_repos": active_count,
            "conformant_repos": conformant_count,
        },
        "repos": repos_report,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="kernel-report")
    parser.add_argument(
        "--out", default=str(CONFORMANCE_JSON), help="Output path for the conformance report"
    )
    args = parser.parse_args(argv)

    report = build_report()
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    print(
        f"kernel-conformance report: {report['summary']['conformant_repos']}/"
        f"{report['summary']['active_repos']} active repos conformant -> {out_path}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
