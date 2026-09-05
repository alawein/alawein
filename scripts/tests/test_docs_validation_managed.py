"""Regression test for the managed documentation workflow shell step."""

from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / ".github" / "workflows" / "docs-validation-managed.yml"

def _bash() -> str:
    if os.name == "nt":
        git = shutil.which("git")
        candidate = Path(git).parent.parent / "bin" / "bash.exe" if git else None
        if candidate and candidate.is_file():
            return str(candidate)
        pytest.skip("Git Bash is required on Windows")
    bash = shutil.which("bash")
    if not bash:
        pytest.skip("Bash is required")
    return bash


def test_managed_markdown_lint_step_dispatches_skips_and_propagates(
    tmp_path: Path,
) -> None:
    """Execute the checked-in run block against its three required outcomes."""
    workflow = yaml.safe_load(WORKFLOW.read_text(encoding="utf-8"))
    steps = workflow["jobs"]["validate-docs"]["steps"]
    run_block = next(
        step["run"] for step in steps if step.get("name") == "Lint managed markdown files"
    )

    stub_dir = tmp_path / "bin"
    stub_dir.mkdir()
    stub = stub_dir / "npx"
    stub.write_text(
        "#!/usr/bin/env bash\n"
        "printf '%s\\n' \"$@\" > \"$NPX_LOG\"\n"
        "exit \"${NPX_EXIT:-0}\"\n",
        encoding="utf-8",
        newline="\n",
    )
    stub.chmod(stub.stat().st_mode | 0o111)

    env = os.environ.copy()
    env["PATH"] = f"{stub_dir}{os.pathsep}{env['PATH']}"
    env["NPX_LOG"] = str(tmp_path / "npx.log")

    (tmp_path / "CLAUDE.md").write_text("# Claude\n", encoding="utf-8")
    (tmp_path / "AGENTS.md").write_text("# Agents\n", encoding="utf-8")
    dispatched = subprocess.run(
        [_bash(), "-c", run_block],
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    assert dispatched.returncode == 0, dispatched.stderr
    assert (tmp_path / "npx.log").read_text(encoding="utf-8").splitlines() == [
        "--yes",
        "markdownlint-cli@0.39.0",
        "CLAUDE.md",
        "AGENTS.md",
    ]

    (tmp_path / "CLAUDE.md").unlink()
    (tmp_path / "AGENTS.md").unlink()
    (tmp_path / "npx.log").unlink()
    missing = subprocess.run(
        [_bash(), "-c", run_block],
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    assert missing.returncode == 0, missing.stderr
    assert "No managed markdown files found -- skipping markdownlint." in missing.stdout
    assert not (tmp_path / "npx.log").exists()

    (tmp_path / "AGENTS.md").write_text("# Agents\n", encoding="utf-8")
    env["NPX_EXIT"] = "23"
    failed = subprocess.run(
        [_bash(), "-c", run_block],
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    assert failed.returncode == 23
