"""Base-ref resolution guards for validate-doc-contract.sh.

The doc-freshness gate diffs the working tree against a base ref. If that base
ref cannot be resolved, an earlier version silently produced an empty changed
set, so the gate passed while validating nothing. These tests pin the hardened
behaviour: an unusable base must fail loud (--changed-only) or fall back with a
notice (--full), never silently no-op.

The script is bash wrapping an embedded Python heredoc, so it is exercised via
subprocess rather than imported. base_ref_for_mode() runs first in main(), so
the guard fires before any repository-content check and these assertions do not
depend on the working tree's state.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "doctrine" / "validate-doc-contract.sh"


def _bash() -> str:
    # On Linux/CI plain bash is correct. On Windows the System32 `bash.exe` is the
    # WSL launcher, which cannot see the repo's drive-letter path; prefer Git Bash.
    if sys.platform.startswith("win"):
        for cand in (
            r"C:\Program Files\Git\bin\bash.exe",
            r"C:\Program Files\Git\usr\bin\bash.exe",
        ):
            if os.path.exists(cand):
                return cand
    return shutil.which("bash") or "bash"


def _run(args: list[str], base_ref_env: str | None = None) -> subprocess.CompletedProcess[str]:
    env = dict(os.environ)
    env.pop("DOC_CONTRACT_BASE_REF", None)
    if base_ref_env is not None:
        env["DOC_CONTRACT_BASE_REF"] = base_ref_env
    return subprocess.run(
        [_bash(), SCRIPT.as_posix(), *args],
        cwd=ROOT,
        text=True,
        capture_output=True,
        env=env,
    )


def test_changed_only_unresolvable_base_fails_loud() -> None:
    result = _run(["--changed-only", "origin/__no_such_base_ref__"])
    assert result.returncode != 0
    assert "does not resolve" in result.stderr


def test_changed_only_empty_base_fails_loud() -> None:
    result = _run(["--changed-only", ""])
    assert result.returncode != 0
    assert "requires a base ref" in result.stderr


def test_changed_only_resolvable_base_is_not_rejected() -> None:
    # Control: a real ref must not trip the new guard (no resolve error).
    result = _run(["--changed-only", "HEAD"])
    assert "does not resolve" not in result.stderr
    assert "requires a base ref" not in result.stderr


def test_full_orphaned_before_falls_back_with_notice() -> None:
    orphan = "0" * 39 + "1"  # 40 hex, not the zero-sha, does not resolve
    result = _run(["--full"], base_ref_env=orphan)
    assert "falling back to HEAD" in result.stderr
