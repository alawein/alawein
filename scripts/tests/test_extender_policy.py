"""Exercise policy retention through the real Extender proposal/write path."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPT = (
    Path(__file__).resolve().parents[2]
    / "claude-agent-platform/bin/generate-local-claude.sh"
)
LEGACY = b"""---
type: local-claude-config
generated: true
source: claude-agent-platform-extender
---
# Project Claude Configuration: fixture

## Detected Project Profile

- Root: `obsolete/location`

## Local Memory

- Keep session summaries to five lines max.
"""
POLICY = b"\n## Org Policy Overlay\n\n- Preserve forbidden paths.\n\n## Local commands\n\nUse the existing operator command."


def bash() -> str:
    if sys.platform == "win32":
        for candidate in (
            "C:/Program Files/Git/bin/bash.exe",
            "C:/Program Files/Git/usr/bin/bash.exe",
        ):
            if Path(candidate).is_file():
                return candidate
    return shutil.which("bash") or "bash"


@pytest.fixture
def fixture(tmp_path: Path):
    root = tmp_path / "project"
    (root / ".claude").mkdir(parents=True)
    scanner = tmp_path / "scanner.sh"
    values = {
        "PROJECT_NAME": "fixture",
        "PROJECT_TYPE": "python",
        "STACK": "python",
        "FRAMEWORKS": "none",
        "MANIFESTS": "pyproject.toml",
        "CI": "none",
        "TOOLS": "python",
        "SOURCE_DIRS": "src",
        "TEST_DIRS": "tests",
        "TEST_COMMAND": "pytest",
        "BUILD_COMMAND": "python -m build",
        "LINT_COMMAND": "ruff check .",
        "PACKAGE_MANAGER": "pip",
        "ROOT_DISPLAY": "core/fixture",
        "INSTALL_COMMAND": "python -m pip install -e .",
        "REGISTRY_FOUND": "true",
    }
    scanner.write_text(
        "#!/bin/sh\ncat <<'EOF'\n"
        + "\n".join(f"{key}='{value}'" for key, value in values.items())
        + "\nEOF\n",
        encoding="utf-8",
        newline="\n",
    )
    scanner.chmod(0o700)
    env = dict(
        os.environ,
        REPO_SCANNER=scanner.as_posix(),
        CLAUDE_HOME=(tmp_path / "global").as_posix(),
    )

    def run(*arguments):
        return subprocess.run(
            [bash(), SCRIPT.as_posix(), "--root", root.as_posix(), *arguments],
            cwd=tmp_path,
            env=env,
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
        )

    return root, run


@pytest.mark.parametrize(
    "mode", [("--dry-run",), ("--dry-run", "--brief"), ("--approve",)]
)
@pytest.mark.parametrize("newline", [b"\n", b"\r\n"])
def test_refresh_retains_unmanaged_suffix_verbatim(fixture, mode, newline):
    root, run = fixture
    target = root / ".claude/CLAUDE.md"
    original = (LEGACY + POLICY).replace(b"\n", newline)
    suffix = POLICY.replace(b"\n", newline)
    target.write_bytes(original)

    result = run(*mode)

    assert result.returncode == 0, result.stderr
    proposal = (root / ".claude/proposals/CLAUDE.md.proposed").read_bytes()
    assert proposal.endswith(suffix)
    assert b"obsolete/location" not in proposal
    assert b"core/fixture" in proposal
    if mode == ("--approve",):
        assert target.read_bytes() == proposal
        backups = list((root / ".claude/backups").glob("*.bak"))
        assert len(backups) == 1 and backups[0].read_bytes() == original
        assert run("--rollback").returncode == 0
    assert target.read_bytes() == original


def test_repeated_approval_keeps_all_existing_local_text_once(fixture):
    root, run = fixture
    target = root / ".claude/CLAUDE.md"
    suffix = POLICY + b"\n## Org Policy Overlay\nAn existing second policy section.\n"
    target.write_bytes(LEGACY + suffix)
    for _ in range(2):
        assert run("--approve", "--force").returncode == 0
        assert target.read_bytes().endswith(suffix)
        assert target.read_bytes().count(b"## Org Policy Overlay") == 2


def test_fenced_footer_example_does_not_hide_local_policy(fixture):
    root, run = fixture
    target = root / ".claude/CLAUDE.md"
    example = b"```markdown\n- Keep session summaries to five lines max.\n```\n\n"
    target.write_bytes(
        LEGACY.replace(b"## Local Memory\n\n", b"## Local Memory\n\n" + example)
        + POLICY
    )
    assert run("--dry-run").returncode == 0
    proposal = (root / ".claude/proposals/CLAUDE.md.proposed").read_bytes()
    assert proposal.endswith(POLICY)
    assert proposal.count(b"- Keep session summaries to five lines max.") == 1


@pytest.mark.parametrize(
    "existing",
    [
        b"# Maintained instructions\nKeep this policy.\n",
        LEGACY.replace(
            b"- Keep session summaries to five lines max.", b"An edited footer."
        ),
    ],
)
def test_unrecognized_existing_file_is_not_overwritten(fixture, existing):
    root, run = fixture
    target = root / ".claude/CLAUDE.md"
    target.write_bytes(existing)
    result = run("--approve", "--force")
    assert result.returncode != 0
    assert "preserve" in result.stderr.lower()
    assert target.read_bytes() == existing
    assert not list((root / ".claude/backups").glob("*.bak"))
    assert not (root / ".claude/state.json").exists()


def test_new_project_still_initializes(fixture):
    root, run = fixture
    result = run("--approve")
    assert result.returncode == 0, result.stderr
    assert (root / ".claude/CLAUDE.md").is_file()
    assert (root / ".claude/MEMORY.md").is_file()
    assert (root / ".claude/state.json").is_file()
