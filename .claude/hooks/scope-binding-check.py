#!/usr/bin/env python3
"""Scope-binding PreToolUse hook with guaranteed JSON on stdout.

Mirrors .claude/hooks/scope-binding-check.sh for environments where bash is
unreliable (Windows Cursor PreToolUse). Always prints Cursor permission JSON.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def emit(decision: str, reason: str, *, exit_code: int = 0) -> int:
    payload = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": decision,
            "permissionDecisionReason": reason,
        }
    }
    sys.stdout.write(json.dumps(payload, indent=2) + "\n")
    sys.stdout.flush()
    return exit_code


def cached_file_count(repo_root: Path) -> int:
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only"],
            cwd=repo_root,
            check=False,
            capture_output=True,
            text=True,
            timeout=30,
        )
    except (OSError, subprocess.SubprocessError):
        return 0
    lines = [line for line in result.stdout.splitlines() if line.strip()]
    return len(lines)


DEFAULT_SCOPE_THRESHOLD = 10


def load_threshold(repo_root: Path) -> int:
    # Match scope-binding-check.sh: env wins, then config.env, then default 10.
    env_raw = os.environ.get("SCOPE_THRESHOLD", "").strip()
    if env_raw.isdigit():
        return int(env_raw)

    threshold = DEFAULT_SCOPE_THRESHOLD
    config_path = repo_root / ".claude" / "hooks" / "config.env"
    if not config_path.is_file():
        return threshold
    for line in config_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("SCOPE_THRESHOLD="):
            raw = stripped.split("=", 1)[1].strip().strip("'\"")
            if raw.isdigit():
                return int(raw)
    return threshold


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--warn-only", action="store_true")
    args = parser.parse_args(argv)

    repo_root = Path(__file__).resolve().parents[2]
    if env_root := os.environ.get("CLAUDE_PROJECT_DIR"):
        repo_root = Path(env_root)

    threshold = load_threshold(repo_root)
    file_count = cached_file_count(repo_root)
    reason = f"Scope within threshold ({file_count} files, limit {threshold})."
    if file_count <= threshold:
        return emit("allow", reason)

    msg = (
        f"About to commit changes to {file_count} files "
        f"(threshold: {threshold}). Verify this is one logical unit, "
        "not scope creep (I-4)."
    )
    if args.warn_only:
        print(f"WARNING: {msg}", file=sys.stderr)
        return emit("allow", f"WARNING: {msg}")
    print(f"ERROR: {msg}", file=sys.stderr)
    return emit("deny", f"ERROR: {msg}", exit_code=1)


if __name__ == "__main__":
    raise SystemExit(main())
