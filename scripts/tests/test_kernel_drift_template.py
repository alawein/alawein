"""Kernel drift.yml.tmpl must keep a blocking repo-drift job named ``drift``."""

from __future__ import annotations

from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = ROOT / "templates" / "kernel" / "_common" / "drift.yml.tmpl"


def test_drift_template_is_blocking_repo_drift_named_drift() -> None:
    rendered = TEMPLATE.read_text(encoding="utf-8").replace(
        "${repo_drift_release_sha}", "deadbeef" * 5
    )
    data = yaml.safe_load(rendered)
    assert data["name"] == "drift"
    jobs = data["jobs"]
    assert set(jobs) == {"drift"}
    job = jobs["drift"]
    assert job["name"] == "drift"
    assert "continue-on-error" not in job
    run_steps = [step.get("run", "") for step in job["steps"] if isinstance(step, dict)]
    joined = "\n".join(run_steps)
    assert "repo-drift" in joined
    assert "workspace-batch" not in joined
    assert "workspace-batch-drift" not in yaml.safe_dump(data)
