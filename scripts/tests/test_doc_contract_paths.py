"""Path classification regressions for the documentation contract gate."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "doctrine" / "validate-doc-contract.sh"


def _bash() -> str:
    if sys.platform.startswith("win"):
        for candidate in (
            r"C:\Program Files\Git\bin\bash.exe",
            r"C:\Program Files\Git\usr\bin\bash.exe",
        ):
            if os.path.exists(candidate):
                return candidate
    return shutil.which("bash") or "bash"


def _run_gate(root: Path) -> subprocess.CompletedProcess[str]:
    env = dict(os.environ)
    env.pop("DOC_CONTRACT_BASE_REF", None)
    return subprocess.run(
        [_bash(), (root / SCRIPT.relative_to(ROOT)).as_posix(), "--full"],
        cwd=root,
        text=True,
        capture_output=True,
        env=env,
    )


@pytest.fixture(scope="module")
def linked_worktree(tmp_path_factory: pytest.TempPathFactory) -> Path:
    base = tmp_path_factory.mktemp("doc-contract-git")
    source = base / "source"
    linked = base / "linked"
    (source / "scripts" / "doctrine").mkdir(parents=True)
    shutil.copy2(SCRIPT, source / SCRIPT.relative_to(ROOT))
    subprocess.run(["git", "init", "-q", source], check=True)
    subprocess.run(["git", "-C", source, "config", "user.email", "test@example.com"], check=True)
    subprocess.run(["git", "-C", source, "config", "user.name", "Doc Contract Test"], check=True)
    subprocess.run(["git", "-C", source, "add", "scripts/doctrine/validate-doc-contract.sh"], check=True)
    subprocess.run(["git", "-C", source, "commit", "-qm", "fixture"], check=True)
    subprocess.run(["git", "-C", source, "worktree", "add", "-q", linked], check=True)
    return linked


def test_linked_worktree_git_pointer_is_not_an_r8_root_file(linked_worktree: Path) -> None:
    assert (linked_worktree / ".git").is_file()
    result = _run_gate(linked_worktree)
    assert ".git:1: root file not in R8 whitelist" not in result.stderr


def test_scaffolding_readme_links_are_validated_at_runtime_destination(
    linked_worktree: Path,
) -> None:
    template = linked_worktree / "templates" / "scaffolding" / "README.product.md"
    template.parent.mkdir(parents=True, exist_ok=True)
    template.write_text("[docs](docs/README.md)\n", encoding="utf-8")
    try:
        result = _run_gate(linked_worktree)
        assert "templates/scaffolding/README.product.md" not in result.stderr
    finally:
        template.unlink()


def test_live_readme_broken_link_still_fails(linked_worktree: Path) -> None:
    test_dir = linked_worktree / "live"
    readme = test_dir / "README.md"
    test_dir.mkdir()
    readme.write_text("[missing](does-not-exist.md)\n", encoding="utf-8")
    try:
        result = _run_gate(linked_worktree)
        rel = readme.relative_to(linked_worktree).as_posix()
        assert result.returncode != 0
        assert f"{rel}:1: broken local link target `does-not-exist.md`" in result.stderr
    finally:
        readme.unlink()
        test_dir.rmdir()
