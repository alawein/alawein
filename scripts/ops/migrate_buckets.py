#!/usr/bin/env python3
"""Migrate alawein workspace from legacy 8-bucket layout to minimal 6-bucket layout.

Reads catalog/buckets.yaml for the legacy->new map, updates catalog/repos.json,
moves sibling repos on disk, and patches README Category headers.

Usage (dry-run):
    python scripts/ops/migrate_buckets.py --workspace-root .. --dry-run

Apply:
    python scripts/ops/migrate_buckets.py --workspace-root .. --apply
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]

REPO_ROOT = Path(__file__).resolve().parents[2]
BUCKETS_PATH = REPO_ROOT / "catalog" / "buckets.yaml"
REPOS_PATH = REPO_ROOT / "catalog" / "repos.json"
CATEGORY_RE = re.compile(r"^(Category:\s*)(\S+)(\s*)$", re.MULTILINE)


def load_buckets(path: Path = BUCKETS_PATH) -> dict[str, str]:
    if yaml is None:
        raise SystemExit("PyYAML required: pip install pyyaml")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    mapping = data.get("legacy_bucket_map") or {}
    return {str(k): str(v) for k, v in mapping.items()}


def new_local_path(old_path: str, legacy_map: dict[str, str]) -> str:
    if old_path == "alawein":
        return "core/alawein"
    parts = Path(old_path).parts
    if not parts:
        return old_path
    if parts[0] == "_archive":
        return old_path
    new_root = legacy_map.get(parts[0], parts[0])
    if len(parts) == 1:
        return new_root
    return str(Path(new_root, *parts[1:]))


def new_bucket(entry: dict[str, Any], legacy_map: dict[str, str]) -> str:
    if entry.get("type") == "archive" or entry.get("status") == "archived":
        return "archive"
    old = entry.get("bucket") or ""
    return legacy_map.get(old, old)


def patch_readme_category(readme: Path, category: str, dry_run: bool) -> bool:
    if not readme.is_file():
        return False
    text = readme.read_text(encoding="utf-8")
    if not CATEGORY_RE.search(text):
        return False
    new_text = CATEGORY_RE.sub(rf"\1{category}\3", text, count=1)
    if new_text == text:
        return False
    if not dry_run:
        readme.write_text(new_text, encoding="utf-8")
    return True


def migrate_entry_paths(
    entry: dict[str, Any], legacy_map: dict[str, str]
) -> tuple[str, str]:
    bucket = new_bucket(entry, legacy_map)
    lp = new_local_path(str(entry.get("local_path") or ""), legacy_map)
    return bucket, lp


def move_repo(
    workspace: Path,
    old_path: str,
    new_path: str,
    *,
    dry_run: bool,
) -> None:
    if old_path == new_path:
        return
    src = workspace / old_path
    dst = workspace / new_path
    if not src.exists():
        print(f"  skip move (missing): {old_path}")
        return
    if dst.exists():
        print(f"  skip move (dest exists): {new_path}")
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    print(f"  move {old_path} -> {new_path}")
    if dry_run:
        return
    if sys.platform == "win32":
        import stat

        def _on_rm_error(func, path, exc_info) -> None:  # noqa: ANN001
            try:
                os.chmod(path, stat.S_IWRITE)
            except OSError:
                pass
            func(path)

        shutil.copytree(src, dst, dirs_exist_ok=False)
        try:
            shutil.rmtree(src, onerror=_on_rm_error)
        except OSError as exc:
            print(
                f"  warn: copied {old_path} but could not remove source ({exc}); "
                "delete the old folder after closing handles"
            )
    else:
        shutil.move(str(src), str(dst))


def collapse_empty_dirs(workspace: Path, names: list[str], dry_run: bool) -> None:
    for name in names:
        path = workspace / name
        if not path.is_dir():
            continue
        try:
            remaining = list(path.iterdir())
        except OSError:
            continue
        if remaining:
            print(f"  keep non-empty dir: {name}/ ({len(remaining)} items)")
            continue
        print(f"  rmdir empty: {name}/")
        if not dry_run:
            path.rmdir()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Migrate alawein bucket layout")
    parser.add_argument(
        "--workspace-root",
        type=Path,
        required=True,
        help="Parent alawein/ folder containing bucket dirs (not the control-plane repo)",
    )
    parser.add_argument("--apply", action="store_true", help="Apply moves and writes")
    parser.add_argument("--dry-run", action="store_true", help="Print plan only (default)")
    args = parser.parse_args(argv)
    dry_run = not args.apply
    if args.apply and args.dry_run:
        parser.error("use either --apply or --dry-run")

    legacy_map = load_buckets()
    data = json.loads(REPOS_PATH.read_text(encoding="utf-8"))
    repos: list[dict[str, Any]] = data.get("repos") or []
    workspace = args.workspace_root.resolve()

    planned: list[tuple[dict[str, Any], str, str, str]] = []
    for entry in repos:
        old_lp = str(entry.get("local_path") or "")
        bucket, lp = migrate_entry_paths(entry, legacy_map)
        planned.append((entry, old_lp, bucket, lp))
        entry["bucket"] = bucket
        entry["local_path"] = lp

    moves = [(e, o, n) for e, o, b, n in planned if o and o != n]
    print(f"catalog: {len(repos)} repos, {len(moves)} path moves")
    for _entry, old_lp, _bucket, lp in planned:
        if old_lp != lp:
            move_repo(workspace, old_lp, lp, dry_run=dry_run)

    for _entry, _old_lp, bucket, lp in planned:
        readme = workspace / lp / "README.md"
        if patch_readme_category(readme, bucket, dry_run):
            print(f"  readme Category -> {bucket}: {_entry.get('slug')}")

    legacy_dirs = [
        "tools", "products", "family", "research", "ventures", "personal", "jobs-projects",
    ]
    collapse_empty_dirs(workspace, legacy_dirs, dry_run)

    extra_moves = [
        ("tools/outpost-rewrite2", "core/outpost-rewrite2"),
    ]
    for old, new in extra_moves:
        move_repo(workspace, old, new, dry_run=dry_run)

    if not dry_run:
        REPOS_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {REPOS_PATH}")
    else:
        print("dry-run: repos.json not written; re-run with --apply")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
