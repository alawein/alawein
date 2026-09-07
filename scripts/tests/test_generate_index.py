"""Generated index dates use UTC commit time on every platform."""

import os
from pathlib import Path
import shutil
import subprocess
import sys

import pytest

ROOT = Path(__file__).resolve().parents[2]


@pytest.mark.parametrize("commit_date, expected", [
    ("2026-09-06T23:30:00-07:00", "2026-09-07"),
    ("2026-09-07T00:30:00+09:00", "2026-09-06"),
])
def test_index_date_uses_utc_and_regeneration_is_stable(tmp_path, commit_date, expected):
    bash = r"C:\Program Files\Git\bin\bash.exe" if sys.platform == "win32" else shutil.which("bash")
    repo = tmp_path / "demo"
    (repo / "docs").mkdir(parents=True)
    (repo / "docs/README.md").write_text("# Docs\n", encoding="utf-8")
    env = dict(os.environ, GIT_AUTHOR_DATE=commit_date, GIT_COMMITTER_DATE=commit_date, TZ="Pacific/Honolulu")
    subprocess.run(["git", "init", "-q", str(repo)], check=True, env=env)
    subprocess.run(["git", "-C", str(repo), "add", "--", "docs/README.md"], check=True, env=env)
    subprocess.run([
        "git", "-C", str(repo), "-c", "user.name=Test", "-c", "user.email=test@example.invalid",
        "-c", "commit.gpgsign=false", "commit", "-qm", "Add docs",
    ], check=True, env=env)
    command = [bash, str(ROOT / "scripts/ops/generate-index.sh"), str(repo)]
    subprocess.run(command, check=True, env=env, capture_output=True)
    first = (repo / "docs/INDEX.md").read_bytes()
    assert f"last_updated: {expected}\n".encode() in first
    subprocess.run(command, check=True, env=env, capture_output=True)
    assert (repo / "docs/INDEX.md").read_bytes() == first
