#!/usr/bin/env python3
"""Operational helper for dashboard rollout, dirty-state audit, and rollback planning."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Iterable, List, Sequence

DEFAULT_ALLOW = [
    "docs/dashboard/",
    "scripts/build-github-dashboard.py",
    "scripts/github_dashboard_lib.py",
    "scripts/tests/",
    "docs/governance/dashboard-governance.md",
    ".github/workflows/github-dashboard-sync.yml",
    "scripts/set-dashboard-token.ps1",
    "scripts/dashboard-rollout.py",
    "docs/archive/dashboard-rollout-playbook.md",
    ".env.example",
    ".tools/dashboard-rollout/",
    ".tools/",
]


@dataclass
class DirtyEntry:
    index_status: str
    worktree_status: str
    path: str


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def run_git(args: Sequence[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=repo_root(),
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        check=check,
    )


def git_output(args: Sequence[str]) -> str:
    return run_git(args).stdout


def parse_dirty_entries() -> List[DirtyEntry]:
    out = run_git(["status", "--porcelain=v1"], check=False).stdout
    rows: List[DirtyEntry] = []
    for line in out.splitlines():
        if len(line) < 4:
            continue
        index_status = line[0]
        worktree_status = line[1]
        path = line[3:]
        if " -> " in path:
            # For rename/copy porcelain rows, use destination path for pathspec-safe operations.
            path = path.split(" -> ", 1)[1]
        rows.append(DirtyEntry(index_status=index_status, worktree_status=worktree_status, path=path))
    return rows


def split_allow(raw: str | None) -> List[str]:
    if not raw:
        return list(DEFAULT_ALLOW)
    return [entry.strip() for entry in raw.split(",") if entry.strip()]


def is_allowed(path: str, allow: Iterable[str]) -> bool:
    for prefix in allow:
        if path == prefix or path.startswith(prefix):
            return True
    return False


def snapshot_dir(label: str) -> Path:
    stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    safe_label = "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in label.strip() or "manual")
    return repo_root() / ".tools" / "dashboard-rollout" / f"{stamp}-{safe_label}"


def cmd_snapshot(label: str) -> int:
    target = snapshot_dir(label)
    target.mkdir(parents=True, exist_ok=True)

    (target / "git-status-short.txt").write_text(git_output(["status", "--short"]), encoding="utf-8")
    (target / "git-status-porcelain.txt").write_text(git_output(["status", "--porcelain=v1"]), encoding="utf-8")
    (target / "git-diff.patch").write_text(git_output(["diff"]), encoding="utf-8")
    (target / "git-diff-staged.patch").write_text(git_output(["diff", "--cached"]), encoding="utf-8")
    (target / "git-untracked.txt").write_text(
        run_git(["ls-files", "--others", "--exclude-standard"], check=False).stdout,
        encoding="utf-8",
    )

    metadata = {
        "capturedAt": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "repoRoot": str(repo_root()),
        "branch": run_git(["rev-parse", "--abbrev-ref", "HEAD"], check=False).stdout.strip(),
        "head": run_git(["rev-parse", "HEAD"], check=False).stdout.strip(),
    }
    (target / "metadata.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    print(f"Snapshot created: {target}")
    return 0


def cmd_audit(allow_raw: str | None, strict: bool, as_json: bool) -> int:
    allow = split_allow(allow_raw)
    entries = parse_dirty_entries()
    outside = [entry.path for entry in entries if not is_allowed(entry.path, allow)]

    report = {
        "repoRoot": str(repo_root()),
        "dirtyCount": len(entries),
        "outsideAllowCount": len(outside),
        "allowList": allow,
        "dirtyPaths": [entry.path for entry in entries],
        "outsideAllowPaths": outside,
    }

    if as_json:
        print(json.dumps(report, indent=2))
    else:
        print(f"Dirty entries: {report['dirtyCount']}")
        print(f"Outside allow list: {report['outsideAllowCount']}")
        if outside:
            print("Outside paths:")
            for path in outside:
                print(f"- {path}")

    if strict and outside:
        return 2
    return 0


def cmd_remediate(allow_raw: str | None) -> int:
    allow = split_allow(allow_raw)
    entries = parse_dirty_entries()
    outside = [entry.path for entry in entries if not is_allowed(entry.path, allow)]

    print("Recommended remediation sequence:")
    print("1) Capture backup snapshot")
    print("   python scripts/dashboard-rollout.py snapshot --label pre-remediation")
    print("2) Review dirty files")
    print("   python scripts/dashboard-rollout.py audit --strict")

    if outside:
        quoted = " ".join(f'"{path}"' for path in outside)
        print("3) Stash or restore out-of-scope files")
        print(f"   git stash push -u -m \"dashboard-remediation\" -- {quoted}")
        print("   # or restore tracked files:")
        print(f"   git restore -- {quoted}")
    else:
        print("3) No out-of-scope files detected; proceed.")

    print("4) Validate dashboard state")
    print("   python scripts/dashboard-rollout.py validate --skip-generator-check")
    return 0


def cmd_validate(owners: str, output: str, retention: int, fixture: str | None, skip_generator_check: bool) -> int:
    root = repo_root()

    test = subprocess.run(
        ["python", "-m", "unittest", "discover", "-s", "scripts/tests", "-p", "test_*.py"],
        cwd=root,
        text=True,
    )
    if test.returncode != 0:
        return test.returncode

    if skip_generator_check:
        return 0

    cmd = [
        "python",
        "scripts/build-github-dashboard.py",
        "--owners",
        owners,
        "--output",
        output,
        "--retention",
        str(retention),
        "--check",
    ]
    if fixture:
        cmd.extend(["--fixture", fixture])

    check = subprocess.run(cmd, cwd=root, text=True)
    return check.returncode


def cmd_rollback(snapshot: str, execute: bool) -> int:
    snap_dir = Path(snapshot).resolve()
    patch_worktree = snap_dir / "git-diff.patch"
    patch_staged = snap_dir / "git-diff-staged.patch"

    if not patch_worktree.exists() or not patch_staged.exists():
        print(f"Snapshot patches not found in: {snap_dir}", file=sys.stderr)
        return 1

    print("Rollback plan:")
    print(f"- Staged patch: {patch_staged}")
    print(f"- Worktree patch: {patch_worktree}")
    print("Commands:")
    print(f"  git apply --reject --whitespace=nowarn \"{patch_staged}\"")
    print(f"  git apply --reject --whitespace=nowarn \"{patch_worktree}\"")

    if not execute:
        return 0

    stage = run_git(["apply", "--reject", "--whitespace=nowarn", str(patch_staged)], check=False)
    work = run_git(["apply", "--reject", "--whitespace=nowarn", str(patch_worktree)], check=False)
    return 0 if stage.returncode == 0 and work.returncode == 0 else 2


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Dashboard rollout and remediation operations.")
    sub = parser.add_subparsers(dest="command", required=True)

    p_snapshot = sub.add_parser("snapshot", help="Capture backup patches and status.")
    p_snapshot.add_argument("--label", default="manual", help="Label added to snapshot folder name.")

    p_audit = sub.add_parser("audit", help="Audit dirty files against allow list.")
    p_audit.add_argument("--allow", help="Comma-separated path prefixes allowed to be dirty.")
    p_audit.add_argument("--strict", action="store_true", help="Exit non-zero when out-of-scope dirty files exist.")
    p_audit.add_argument("--json", action="store_true", help="Emit machine-readable JSON report.")

    p_remediate = sub.add_parser("remediate", help="Print remediation plan for dirty files.")
    p_remediate.add_argument("--allow", help="Comma-separated path prefixes allowed to be dirty.")

    p_validate = sub.add_parser("validate", help="Run dashboard validations.")
    p_validate.add_argument("--owners", default="alawein", help="Owner list for generator checks.")
    p_validate.add_argument("--output", default="docs/dashboard", help="Dashboard output directory.")
    p_validate.add_argument("--retention", type=int, default=180, help="Snapshot retention.")
    p_validate.add_argument("--fixture", help="Fixture file for deterministic generator check.")
    p_validate.add_argument("--skip-generator-check", action="store_true", help="Skip generator --check command.")

    p_rollback = sub.add_parser("rollback", help="Print or execute rollback from a snapshot directory.")
    p_rollback.add_argument("--snapshot", required=True, help="Snapshot directory created by 'snapshot' command.")
    p_rollback.add_argument("--execute", action="store_true", help="Execute rollback patch apply commands.")

    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.command == "snapshot":
        return cmd_snapshot(args.label)
    if args.command == "audit":
        return cmd_audit(args.allow, args.strict, args.json)
    if args.command == "remediate":
        return cmd_remediate(args.allow)
    if args.command == "validate":
        return cmd_validate(args.owners, args.output, args.retention, args.fixture, args.skip_generator_check)
    if args.command == "rollback":
        return cmd_rollback(args.snapshot, args.execute)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
