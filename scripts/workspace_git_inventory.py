#!/usr/bin/env python3
"""Read-only workspace git inventory — remotes and HEAD metadata per checkout.

Use this for deterministic reconciliation with ``catalog/repos.json`` paths
(the same drift class ``validate-projects-json.py --strict`` enforces).

Examples::

    # From workspace container (parent directory of apps/, tools/, hub checkout folder):
    py -3.12 alawein/scripts/workspace_git_inventory.py --compare-catalog

    # From the control-plane checkout (repository root alongside catalog/, scripts/, ...):
    py -3.12 scripts/workspace_git_inventory.py --compare-catalog
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

SKIP_DIR_NAMES = frozenset(
    {
        "node_modules",
        ".git",
        "dist",
        "build",
        ".next",
        ".nuxt",
        "coverage",
        "__pycache__",
        ".mypy_cache",
        ".pytest_cache",
        ".ruff_cache",
        ".tox",
        ".venv",
        "venv",
        ".jupyter-local-runtime",
        ".playwright-cli",
        "target",
        ".turbo",
    }
)


def _control_plane_root(script_path: Path) -> Path:
    # .../alawein/scripts/workspace_git_inventory.py -> .../alawein
    return script_path.resolve().parents[1]


def _workspace_root(control_plane: Path) -> Path:
    return control_plane.resolve().parent


def _git(
    cwd: Path,
    *args: str,
    timeout_s: float = 40.0,
) -> subprocess.CompletedProcess[str]:
    env = dict(os.environ)
    env.setdefault("GIT_TERMINAL_PROMPT", "0")
    return subprocess.run(
        ("git",) + args,
        cwd=str(cwd),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout_s,
        env=env,
    )


def _git_line(cwd: Path, *args: str, default: str = "") -> str:
    proc = _git(cwd, *args)
    if proc.returncode != 0:
        return default
    return proc.stdout.strip()


def repo_metadata(top: Path, workspace_root: Path) -> dict[str, Any]:
    origin = _git_line(top, "remote", "get-url", "origin")
    short = _git_line(top, "rev-parse", "--short", "HEAD")
    full_hash = _git_line(top, "rev-parse", "HEAD")
    subject = _git_line(top, "log", "-1", "--format=%s")
    iso = _git_line(top, "log", "-1", "--format=%cI")
    branch = _git_line(
        top,
        "rev-parse",
        "--abbrev-ref",
        "HEAD",
        default="(detached)",
    )
    try:
        relative = Path(os.path.relpath(top, workspace_root.resolve())).as_posix()
    except ValueError:
        relative = str(top)

    dot_git = top / ".git"
    dot_git_kind: str | None = None
    if dot_git.is_symlink():
        dot_git_kind = "symlink"
    elif dot_git.is_file():
        dot_git_kind = "file(gitdir)"
    elif dot_git.is_dir():
        dot_git_kind = "directory"

    return {
        "git_toplevel": str(top),
        "relative_path": relative,
        "origin_url": origin,
        "HEAD_short": short,
        "HEAD": full_hash,
        "HEAD_subject": subject,
        "HEAD_date": iso,
        "branch": branch,
        ".git_present": dot_git.exists(),
        ".git_kind": dot_git_kind,
    }


def collect_git_roots(workspace_root: Path) -> dict[str, dict[str, Any]]:
    """Map relative POSIX path → metadata."""

    found: dict[str, dict[str, Any]] = {}
    stack = [workspace_root.resolve()]
    seen_toplevels: set[str] = set()

    while stack:
        cur = stack.pop()
        try:
            with os.scandir(cur) as it:
                child_paths = sorted(
                    (Path(ent.path) for ent in it if ent.is_dir(follow_symlinks=False)),
                    key=lambda p: str(p).lower(),
                    reverse=True,
                )
        except OSError:
            continue

        children = [ch for ch in child_paths if ch.name not in SKIP_DIR_NAMES]

        dot_git_entry = cur / ".git"
        if dot_git_entry.exists():
            top_txt = _git_line(cur, "rev-parse", "--show-toplevel")
            if not top_txt:
                stack.extend(children)
                continue
            top = Path(top_txt).resolve()
            ident = os.path.normcase(os.path.normpath(str(top)))
            if ident in seen_toplevels:
                continue
            seen_toplevels.add(ident)

            md = repo_metadata(top, workspace_root.resolve())
            key = md["relative_path"].rstrip("/")
            found[key] = md
            continue

        stack.extend(children)

    return dict(sorted(found.items(), key=lambda item: item[0].lower()))


def load_catalog_repos(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("repos", []))


def load_catalog_compare_extras(path: Path) -> tuple[frozenset[str], frozenset[str]]:
    """Return (
    paths suppressed from ``git_roots_on_disk_uncatalogued``,
    extra paths counted as catalogued-only for traversal parity
    (duplicate checkouts sharing a GitHub ``repo`` with another row).
    )."""

    data = json.loads(path.read_text(encoding="utf-8"))

    def norm_paths(raw: Any) -> frozenset[str]:
        if not isinstance(raw, list):
            return frozenset()
        out: set[str] = set()
        for item in raw:
            if item is None or item is False:
                continue
            n = str(item).replace("\\", "/").strip().rstrip("/")
            if n:
                out.add(n)
        return frozenset(out)

    return (
        norm_paths(data.get("git_inventory_suppress_uncatalogued")),
        norm_paths(data.get("git_inventory_treat_paths_as_catalogued")),
    )


def compare_with_catalog(
    inventory: dict[str, dict[str, Any]],
    repos: list[dict[str, Any]],
    workspace: Path,
    *,
    suppress_uncatalogued: frozenset[str] | None = None,
    treat_as_catalogued_paths: frozenset[str] | None = None,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    catalog_paths_expect_git = {
        (r.get("local_path") or "").replace("\\", "/").rstrip("/")
        for r in repos
        if r.get("local_path") and not str(r["local_path"]).startswith("../")
    }
    if treat_as_catalogued_paths:
        catalog_paths_expect_git |= set(treat_as_catalogued_paths)

    suppress = suppress_uncatalogued or frozenset()

    unchecked_roots = sorted(
        rel
        for rel in inventory
        if rel not in catalog_paths_expect_git and rel not in suppress
    )

    rows: list[dict[str, Any]] = []
    for repo in repos:
        slug = str(repo.get("slug", "") or "?")
        lp = repo.get("local_path")
        if not lp:
            rows.append({"slug": slug, "catalog_path": lp, "status": "skipped_no_path"})
            continue

        posix_lp = lp.replace("\\", "/")
        if posix_lp.startswith("../"):
            rows.append(
                {"slug": slug, "catalog_path": posix_lp, "status": "external_or_parent_path"}
            )
            continue

        path = workspace / posix_lp.replace("/", os.sep)
        path = path.resolve()

        diag: dict[str, Any] = {"slug": slug, "catalog_path": posix_lp, "resolved": str(path)}
        if not path.is_dir():
            diag["status"] = "missing_path"
            rows.append(diag)
            continue

        if not (path / ".git").exists():
            diag["status"] = "not_a_git_clone"
            diag["hint"] = "no .git at catalog path; reclone the repo from GitHub."
            rows.append(diag)
            continue

        top_txt = _git_line(path, "rev-parse", "--show-toplevel")
        try:
            rel_root = Path(
                os.path.relpath(top_txt if top_txt else path, workspace),
            ).as_posix()
        except ValueError:
            diag["status"] = "git_outside_workspace"
            diag["toplevel_reported"] = top_txt
            rows.append(diag)
            continue

        inv = inventory.get(rel_root)

        gh_repo = repo.get("repo") or ""

        diag["computed_git_relative_root"] = rel_root

        if inv:
            diag["origin_url"] = inv["origin_url"]
            diag["HEAD_short"] = inv["HEAD_short"]
            diag["branch"] = inv["branch"]
            diag["status"] = "ok"
            tail_expected = gh_repo.split("/")[-1].lower() if "/" in gh_repo else ""
            url_l = inv["origin_url"].lower().replace(".git", "").rstrip("/")
            mismatch = tail_expected != "" and tail_expected not in url_l and slug.lower() not in url_l
            if mismatch:
                diag["possible_origin_slug_mismatch"] = True
        else:
            diag["status"] = "ok_but_git_root_missing_from_inventory_scan"
            diag["hint"] = "git works at catalog_path but traversal did not classify this relative root."

        rows.append(diag)

    summary = {
        "git_roots_on_disk_uncatalogued": unchecked_roots,
        "git_inventory_suppressed_paths": sorted(suppress),
        "git_inventory_parity_only_paths": sorted(treat_as_catalogued_paths or []),
        "catalog_clone_rows_evaluated": len(rows),
        "blocking_statuses_present": sorted(
            {r["status"] for r in rows if r["status"] not in ("ok", "external_or_parent_path", "skipped_no_path")}
        ),
    }

    rows_sorted = sorted(rows, key=lambda r: (r.get("status", ""), r.get("slug", "")))
    return summary, rows_sorted


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Read-only workspace git checkout inventory.")
    parser.add_argument(
        "--workspace-root",
        type=Path,
        default=None,
        help=(
            "Container root holding apps/, tools/, research/, jobs-projects/, ... "
            "(default: parent of the control-plane checkout)."
        ),
    )
    parser.add_argument(
        "--compare-catalog",
        action="store_true",
        help="Include catalog parity rows versus catalog/repos.json local_path.",
    )
    args = parser.parse_args(argv)

    ctrl = _control_plane_root(Path(__file__))
    ws_root = (
        args.workspace_root.expanduser().resolve()
        if args.workspace_root
        else _workspace_root(ctrl)
    )

    keyed = collect_git_roots(ws_root)

    envelope: dict[str, Any] = {
        "workspace_root": str(ws_root),
        "control_plane_repo": str(ctrl.resolve()),
        "repo_count": len(keyed),
        "repos": keyed,
    }

    if args.compare_catalog:
        cat = ctrl / "catalog" / "repos.json"
        if not cat.is_file():
            print(f"--compare-catalog: missing {cat}", file=sys.stderr)
            return 2
        repos = load_catalog_repos(cat)
        suppress, parity_paths = load_catalog_compare_extras(cat)
        summary, crows = compare_with_catalog(
            keyed,
            repos,
            ws_root,
            suppress_uncatalogued=suppress,
            treat_as_catalogued_paths=parity_paths,
        )
        envelope["catalog_compare"] = summary
        envelope["catalog_compare_rows"] = crows

    print(json.dumps(envelope, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
