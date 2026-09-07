"""CLI behaviour and exit-code tests for tools/repo-audit/scan.py (no network)."""

from __future__ import annotations

import importlib.util
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / "tools" / "repo-audit" / "scan.py"

_spec = importlib.util.spec_from_file_location("repo_audit_scan_cli", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["repo_audit_scan_cli"] = _mod
_spec.loader.exec_module(_mod)
scan = _mod


def sample_record(repo: str = "o/r") -> dict:
    return {
        "repo": repo,
        "url": f"https://github.test/{repo}",
        "visibility": "public",
        "archived": False,
        "primary_language": "Python",
        "description": "example",
        "default_branch": "main",
        "last_commit_date": "2026-09-01T00:00:00Z",
        "contributors": ["alawein"],
        "contributor_activity": ["alawein:2026-09-01"],
        "contributor_activity_state": scan.PASS,
        "open_pull_requests": 1,
        "open_pull_request_urls": ["https://github.test/o/r/pull/1"],
        "open_issues": 0,
        "open_issue_urls": [],
        "branch_protection_state": scan.FAIL,
        "required_status_checks": [],
        "ci_state": scan.PASS,
        "recent_workflow_runs": ["CI:success"],
        "workflows": [".github/workflows/ci.yml"],
        "workflows_state": scan.PASS,
        "codeowners_state": scan.PASS,
        "codeowners_path": "CODEOWNERS",
        "owner_dri": "@alawein",
        "readme_state": scan.PASS,
        "docs_state": scan.PASS,
        "dependabot_config_state": scan.FAIL,
        "dependency_alerts_state": scan.PASS,
        "secret_scanning_state": scan.UNAVAILABLE,
        "webhooks_state": scan.UNAVAILABLE,
        "webhooks": [],
        "github_apps_state": scan.FAIL,
        "github_apps": [],
        "external_services": [],
        "collected_at": "2026-09-01T00:00:00+00:00",
        "evidence": [
            {
                "endpoint": "https://api.github.test/repos/o/r",
                "status": 200,
                "collected_at": "2026-09-01T00:00:00+00:00",
                "state": scan.PASS,
            }
        ],
        "evidence_sources": ["https://api.github.test/repos/o/r"],
    }


def write_outputs(directory: Path, records: list[dict]) -> None:
    findings = []
    for record in records:
        findings.extend(scan.build_findings(record))
    scan.write_csv(directory / "repo-inventory.csv", records)
    scan.write_json(directory / "repo-inventory.json", records, findings, "repos:o/r")
    (directory / "integration-map.mmd").write_text(scan.build_mermaid(records), encoding="utf-8")
    scan.write_report(directory / "AUDIT-REPORT.md", records, findings, "repos:o/r")
    scan.write_backlog(directory / "backlog.md", findings)


class TestOutputWriters(unittest.TestCase):
    def test_outputs_are_written_and_validate(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            write_outputs(directory, [sample_record()])
            self.assertEqual(scan.validate_outputs(directory), [])

            payload = json.loads((directory / "repo-inventory.json").read_text(encoding="utf-8"))
            self.assertEqual(payload["repository_count"], 1)
            self.assertTrue(payload["findings"])

            report = (directory / "AUDIT-REPORT.md").read_text(encoding="utf-8")
            self.assertTrue(report.startswith("---\n"))
            self.assertIn("## Evidence", report)

            backlog = (directory / "backlog.md").read_text(encoding="utf-8")
            self.assertIn(scan.PRIORITY_LABELS[scan.PRIORITY_SECURITY], backlog)

            mermaid = (directory / "integration-map.mmd").read_text(encoding="utf-8")
            self.assertTrue(mermaid.startswith("flowchart LR"))
            self.assertIn("-->", mermaid)

    def test_validation_detects_csv_json_drift(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            write_outputs(directory, [sample_record()])
            csv_path = directory / "repo-inventory.csv"
            csv_path.write_text(
                csv_path.read_text(encoding="utf-8").replace("o/r", "o/other", 1), encoding="utf-8"
            )
            errors = scan.validate_outputs(directory)
            self.assertTrue(any("keys differ" in error for error in errors))

    def test_validation_reports_missing_outputs(self):
        with tempfile.TemporaryDirectory() as tmp:
            errors = scan.validate_outputs(Path(tmp))
            self.assertEqual(len(errors), 5)


class TestCli(unittest.TestCase):
    def run_main(self, argv: list[str]) -> tuple[int, str, str]:
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = scan.main(argv)
        return code, out.getvalue(), err.getvalue()

    def test_check_outputs_passes_on_valid_directory(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            write_outputs(directory, [sample_record()])
            code, stdout, _ = self.run_main(["--check-outputs", str(directory)])
            self.assertEqual(code, scan.EXIT_OK)
            self.assertIn("Output validation passed", stdout)

    def test_check_outputs_fails_on_empty_directory(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, _, stderr = self.run_main(["--check-outputs", tmp])
            self.assertEqual(code, scan.EXIT_VALIDATION_FAILED)
            self.assertIn("missing expected output", stderr)

    def test_missing_target_is_a_usage_error(self):
        with self.assertRaises(SystemExit) as raised:
            self.run_main([])
        self.assertEqual(raised.exception.code, 2)

    def test_org_and_repos_are_mutually_exclusive(self):
        with self.assertRaises(SystemExit) as raised:
            self.run_main(["--org", "alawein", "--repos", "alawein/alawein"])
        self.assertEqual(raised.exception.code, 2)

    def test_missing_repos_file_exits_nonzero(self):
        code, _, stderr = self.run_main(["--repos-file", "/nonexistent/list.txt"])
        self.assertEqual(code, scan.EXIT_COLLECTION_FAILED)
        self.assertIn("repository list file not found", stderr)

    def test_invalid_slug_exits_nonzero(self):
        code, _, stderr = self.run_main(["--repos", "not-a-slug"])
        self.assertEqual(code, scan.EXIT_COLLECTION_FAILED)
        self.assertIn("owner/repo", stderr)

    def test_help_runs_from_the_command_line(self):
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--help"], capture_output=True, text=True, check=False
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("--check-outputs", result.stdout)

    def test_token_value_is_never_printed(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, stdout, stderr = self.run_main(["--repos", "not-a-slug", "--output-dir", tmp])
            self.assertEqual(code, scan.EXIT_COLLECTION_FAILED)
            self.assertNotIn("Bearer", stdout + stderr)


if __name__ == "__main__":
    unittest.main()
