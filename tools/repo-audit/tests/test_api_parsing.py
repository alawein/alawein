"""Unit tests for the repo-audit API parsing layer (no network)."""

from __future__ import annotations

import base64
import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / "tools" / "repo-audit" / "scan.py"

_spec = importlib.util.spec_from_file_location("repo_audit_scan", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["repo_audit_scan"] = _mod
_spec.loader.exec_module(_mod)
scan = _mod


class FakeTransport:
    """Replaces GitHubClient.open with scripted responses keyed by URL prefix."""

    def __init__(self, routes):
        self.routes = routes
        self.calls = []

    def __call__(self, url):
        self.calls.append(url)
        for prefix, response in self.routes.items():
            if url.startswith(prefix):
                return response
        return 404, None, {}


def client_with(routes):
    client = scan.GitHubClient("https://api.github.test", token="unused-test-value")
    client.open = FakeTransport(routes)
    return client


class TestStatusClassification(unittest.TestCase):
    def test_states_map_from_http_status(self):
        cases = {
            200: scan.PASS,
            204: scan.PASS,
            202: scan.PENDING,
            401: scan.UNAVAILABLE,
            403: scan.UNAVAILABLE,
            404: scan.FAIL,
            0: scan.UNAVAILABLE,
            500: scan.UNAVAILABLE,
            301: scan.UNKNOWN,
        }
        for status, expected in cases.items():
            with self.subTest(status=status):
                self.assertEqual(scan.classify_status(status), expected)
                self.assertIn(scan.classify_status(status), scan.STATES)


class TestPagination(unittest.TestCase):
    def test_follows_link_next_until_exhausted(self):
        page_two = "https://api.github.test/repos/o/r/pulls?page=2"
        transport_routes = {
            page_two: (200, [{"id": 3}], {}),
            "https://api.github.test/repos/o/r/pulls": (
                200,
                [{"id": 1}, {"id": 2}],
                {"link": f'<{page_two}>; rel="next", <{page_two}>; rel="last"'},
            ),
        }
        client = client_with(transport_routes)
        result = client.paginate("/repos/o/r/pulls")
        self.assertEqual(result["status"], 200)
        self.assertEqual([item["id"] for item in result["items"]], [1, 2, 3])
        self.assertEqual(len(client.open.calls), 2)

    def test_pagination_stops_on_forbidden_and_reports_unavailable(self):
        client = client_with({"https://api.github.test/repos/o/r/hooks": (403, {"message": "x"}, {})})
        result = client.paginate("/repos/o/r/hooks")
        self.assertEqual(result["items"], [])
        self.assertEqual(result["evidence"]["state"], scan.UNAVAILABLE)

    def test_next_page_url_parsing(self):
        header = '<https://api.github.test/x?page=2>; rel="next", <https://api.github.test/x?page=9>; rel="last"'
        self.assertEqual(scan.next_page_url(header), "https://api.github.test/x?page=2")
        self.assertIsNone(scan.next_page_url(""))
        self.assertIsNone(scan.next_page_url('<https://api.github.test/x?page=9>; rel="last"'))

    def test_evidence_records_endpoint_and_timestamp(self):
        client = client_with({"https://api.github.test/repos/o/r": (200, {"full_name": "o/r"}, {})})
        response = client.get("/repos/o/r")
        evidence = response["evidence"]
        self.assertEqual(evidence["endpoint"], "https://api.github.test/repos/o/r")
        self.assertEqual(evidence["status"], 200)
        self.assertTrue(evidence["collected_at"].endswith("+00:00"))


class TestWorkflowRunState(unittest.TestCase):
    def test_failure_wins_over_success(self):
        runs = [{"status": "completed", "conclusion": "success"}, {"status": "completed", "conclusion": "failure"}]
        self.assertEqual(scan.workflow_run_state(runs), scan.FAIL)

    def test_in_progress_is_pending(self):
        runs = [{"status": "in_progress", "conclusion": None}]
        self.assertEqual(scan.workflow_run_state(runs), scan.PENDING)

    def test_no_runs_is_unknown(self):
        self.assertEqual(scan.workflow_run_state([]), scan.UNKNOWN)

    def test_all_success_is_pass(self):
        self.assertEqual(
            scan.workflow_run_state([{"status": "completed", "conclusion": "success"}]), scan.PASS
        )


class TestHelpers(unittest.TestCase):
    def test_codeowners_parsing(self):
        content = "# comment\n* @alawein @second\ndocs/ @docs-team\n"
        self.assertEqual(scan.parse_codeowners_owners(content), ["@alawein", "@second", "@docs-team"])

    def test_decode_contents(self):
        payload = {"encoding": "base64", "content": base64.b64encode(b"* @alawein").decode()}
        self.assertEqual(scan.decode_contents(payload), "* @alawein")
        self.assertIsNone(scan.decode_contents({"encoding": "none", "content": "x"}))

    def test_detect_services_from_workflow_paths(self):
        services = scan.detect_services([".github/workflows/sync-vercel.yml", ".github/workflows/codeql.yml"])
        self.assertEqual(services, ["GitHub code scanning", "Vercel"])

    def test_split_repo_rejects_bad_slug(self):
        self.assertEqual(scan.split_repo("alawein/alawein"), ("alawein", "alawein"))
        with self.assertRaises(ValueError):
            scan.split_repo("alawein")

    def test_mermaid_label_strips_diagram_syntax(self):
        self.assertEqual(scan.mermaid_label('a["b"]|c'), "a  b   c")


class TestCollectRepository(unittest.TestCase):
    def base_routes(self, **overrides):
        api = "https://api.github.test"
        routes = {
            f"{api}/repos/o/r/stats/contributors": (202, None, {}),
            f"{api}/repos/o/r/contributors": (200, [{"login": "alawein"}], {}),
            f"{api}/repos/o/r/commits": (
                200,
                [{"commit": {"committer": {"date": "2026-09-01T00:00:00Z"}}}],
                {},
            ),
            f"{api}/repos/o/r/pulls": (200, [{"html_url": "https://github.test/o/r/pull/1"}], {}),
            f"{api}/repos/o/r/issues": (
                200,
                [
                    {"html_url": "https://github.test/o/r/issues/2"},
                    {"html_url": "https://github.test/o/r/pull/1", "pull_request": {}},
                ],
                {},
            ),
            f"{api}/repos/o/r/branches/main/protection": (404, None, {}),
            f"{api}/repos/o/r/actions/runs": (
                200,
                {"workflow_runs": [{"name": "CI", "status": "completed", "conclusion": "success"}]},
                {},
            ),
            f"{api}/repos/o/r/actions/workflows": (
                200,
                {"workflows": [{"path": ".github/workflows/ci.yml"}]},
                {},
            ),
            f"{api}/repos/o/r/contents/CODEOWNERS": (
                200,
                {"encoding": "base64", "content": base64.b64encode(b"* @alawein").decode()},
                {},
            ),
            f"{api}/repos/o/r/contents/docs": (200, [{"name": "README.md"}], {}),
            f"{api}/repos/o/r/contents/.github/dependabot.yml": (404, None, {}),
            f"{api}/repos/o/r/readme": (200, {"name": "README.md"}, {}),
            f"{api}/repos/o/r/vulnerability-alerts": (204, None, {}),
            f"{api}/repos/o/r/hooks": (403, {"message": "forbidden"}, {}),
            f"{api}/repos/o/r/installation": (404, None, {}),
            f"{api}/repos/o/r": (
                200,
                {
                    "full_name": "o/r",
                    "html_url": "https://github.test/o/r",
                    "visibility": "public",
                    "archived": False,
                    "language": "Python",
                    "description": "example",
                    "default_branch": "main",
                },
                {},
            ),
        }
        routes.update(overrides)
        return routes

    def test_states_are_recorded_per_field(self):
        record = scan.collect_repository(client_with(self.base_routes()), "o/r")
        self.assertEqual(record["repo"], "o/r")
        self.assertEqual(record["last_commit_date"], "2026-09-01T00:00:00Z")
        self.assertEqual(record["open_pull_requests"], 1)
        self.assertEqual(record["open_issues"], 1)
        # 404 on a readable repository means "no protection configured".
        self.assertEqual(record["branch_protection_state"], scan.FAIL)
        self.assertEqual(record["ci_state"], scan.PASS)
        # 202 from the statistics endpoint is still being computed.
        self.assertEqual(record["contributor_activity_state"], scan.PENDING)
        # 403 must never be reported as a pass.
        self.assertEqual(record["webhooks_state"], scan.UNAVAILABLE)
        self.assertEqual(record["secret_scanning_state"], scan.UNAVAILABLE)
        self.assertEqual(record["dependabot_config_state"], scan.FAIL)
        self.assertEqual(record["dependency_alerts_state"], scan.PASS)
        self.assertEqual(record["owner_dri"], "@alawein")
        self.assertTrue(record["evidence_sources"])
        self.assertTrue(all(item["endpoint"] for item in record["evidence"]))

    def test_unreadable_repository_raises(self):
        routes = self.base_routes()
        routes["https://api.github.test/repos/o/r"] = (403, {"message": "forbidden"}, {})
        with self.assertRaises(scan.GitHubError):
            scan.collect_repository(client_with(routes), "o/r")

    def test_archived_repository_is_preserved_with_cleanup_finding(self):
        routes = self.base_routes()
        repo = dict(routes["https://api.github.test/repos/o/r"][1])
        repo["archived"] = True
        routes["https://api.github.test/repos/o/r"] = (200, repo, {})
        record = scan.collect_repository(client_with(routes), "o/r")
        self.assertTrue(record["archived"])
        fields = {finding["field"] for finding in scan.build_findings(record)}
        self.assertIn("archived", fields)
        self.assertNotIn("codeowners_state", fields)

    def test_findings_are_prioritized(self):
        record = scan.collect_repository(client_with(self.base_routes()), "o/r")
        findings = scan.build_findings(record)
        priorities = [finding["priority"] for finding in findings]
        self.assertEqual(min(priorities), scan.PRIORITY_SECURITY)
        by_field = {finding["field"]: finding["priority"] for finding in findings}
        self.assertEqual(by_field["branch_protection_state"], scan.PRIORITY_PROTECTIONS)
        self.assertEqual(by_field["dependabot_config_state"], scan.PRIORITY_DEPENDENCIES)

    def test_listing_failure_raises(self):
        client = client_with({"https://api.github.test/orgs/none": (404, None, {})})
        with self.assertRaises(scan.GitHubError):
            scan.list_repositories(client, "none")


if __name__ == "__main__":
    unittest.main()
