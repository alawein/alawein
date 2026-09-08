"""Unit tests for the repo-audit API parsing layer (no network)."""

from __future__ import annotations

import base64
import importlib.util
import sys
import unittest
from pathlib import Path
from urllib.parse import urlsplit

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
        best = None
        for prefix, response in self.routes.items():
            if url.startswith(prefix) and (best is None or len(prefix) > len(best[0])):
                best = (prefix, response)
        return best[1] if best else (404, None, {})


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

    def test_mid_sequence_failure_is_not_reported_as_complete(self):
        # Page 1 succeeds, page 2 is forbidden: the collection is partial and
        # must never be presented as an authoritative count.
        page_two = "https://api.github.test/repos/o/r/pulls?page=2"
        client = client_with(
            {
                page_two: (403, {"message": "forbidden"}, {}),
                "https://api.github.test/repos/o/r/pulls": (
                    200,
                    [{"id": 1}],
                    {"link": f'<{page_two}>; rel="next"'},
                ),
            }
        )
        result = client.paginate("/repos/o/r/pulls")
        self.assertFalse(result["complete"])
        self.assertEqual(result["state"], scan.UNAVAILABLE)
        # Every page attempted is retained as evidence, not just the first.
        self.assertEqual(len(result["evidence_pages"]), 2)

    def test_partial_pagination_marks_counts_unavailable(self):
        routes = TestCollectRepository().base_routes()
        page_two = "https://api.github.test/repos/o/r/pulls?page=2"
        routes["https://api.github.test/repos/o/r/pulls?state=open&per_page=100"] = (
            200,
            [{"html_url": "https://github.test/o/r/pull/1"}],
            {"link": f'<{page_two}>; rel="next"'},
        )
        routes[page_two] = (500, None, {})
        record = scan.collect_repository(client_with(routes), "o/r")
        self.assertEqual(record["open_pull_requests"], scan.UNAVAILABLE)
        self.assertEqual(record["open_pull_request_urls"], [])

    def test_pagination_ignores_link_to_other_host(self):
        # The Authorization header travels with every request, so a Link header
        # pointing at another host must not be followed.
        evil = "https://evil.test/repos/o/r/pulls?page=2"
        client = client_with(
            {
                "https://api.github.test/repos/o/r/pulls": (
                    200,
                    [{"id": 1}],
                    {"link": f'<{evil}>; rel="next"'},
                ),
                evil: (200, [{"id": 99}], {}),
            }
        )
        result = client.paginate("/repos/o/r/pulls")
        self.assertEqual([item["id"] for item in result["items"]], [1])
        self.assertFalse(result["complete"])
        self.assertEqual(result["state"], scan.UNAVAILABLE)
        requested_hosts = {urlsplit(call).netloc for call in client.open.calls}
        self.assertEqual(requested_hosts, {"api.github.test"})

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

    def test_webhook_url_redacts_every_sensitive_component(self):
        value = "https://user:password@hooks.example.test:8443/services/account/credential?token=x#fragment"
        self.assertEqual(scan.redact_webhook_url(value), "https://hooks.example.test:8443/[redacted]")
        self.assertEqual(scan.redact_webhook_url("not-a-url"), scan.UNKNOWN)

    def test_required_checks_are_extracted_from_effective_rules(self):
        rules = [
            {
                "type": "required_status_checks",
                "parameters": {
                    "required_status_checks": [
                        {"context": "test"},
                        {"context": "lint", "integration_id": 1},
                    ]
                },
            },
            {"type": "pull_request", "parameters": {}},
        ]
        self.assertEqual(scan.required_checks_from_rules(rules), ["test", "lint"])


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
            f"{api}/repos/o/r/rules/branches/main": (200, [], {}),
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
        self.assertEqual(record["required_status_checks_state"], scan.FAIL)
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
        self.assertTrue(all("/installation" not in item["endpoint"] for item in record["evidence"]))

    def test_effective_rules_protect_branch_without_classic_rule(self):
        routes = self.base_routes()
        routes["https://api.github.test/repos/o/r/rules/branches/main"] = (
            200,
            [
                {
                    "type": "required_status_checks",
                    "parameters": {"required_status_checks": [{"context": "CI"}]},
                }
            ],
            {},
        )
        record = scan.collect_repository(client_with(routes), "o/r")
        self.assertEqual(record["branch_protection_state"], scan.PASS)
        self.assertEqual(record["required_status_checks"], ["CI"])
        self.assertEqual(record["required_status_checks_state"], scan.PASS)

    def test_unreadable_rules_prevent_false_unprotected_finding(self):
        routes = self.base_routes()
        routes["https://api.github.test/repos/o/r/rules/branches/main"] = (403, None, {})
        record = scan.collect_repository(client_with(routes), "o/r")
        self.assertEqual(record["branch_protection_state"], scan.UNAVAILABLE)
        self.assertEqual(record["required_status_checks_state"], scan.UNAVAILABLE)

    def test_unreadable_rules_do_not_create_false_missing_checks_finding(self):
        routes = self.base_routes()
        routes["https://api.github.test/repos/o/r/branches/main/protection"] = (
            200,
            {"required_status_checks": None},
            {},
        )
        routes["https://api.github.test/repos/o/r/rules/branches/main"] = (403, None, {})
        record = scan.collect_repository(client_with(routes), "o/r")
        findings = scan.build_findings(record)
        status_check_findings = [
            finding for finding in findings if finding["field"] == "required_status_checks"
        ]
        self.assertEqual(record["branch_protection_state"], scan.PASS)
        self.assertEqual(record["required_status_checks_state"], scan.UNAVAILABLE)
        self.assertEqual(
            [finding["finding"] for finding in status_check_findings],
            ["Required status-check coverage is unavailable to the audit token."],
        )

    def test_webhook_destination_is_redacted_before_recording(self):
        routes = self.base_routes()
        routes["https://api.github.test/repos/o/r/hooks"] = (
            200,
            [
                {
                    "config": {
                        "url": "https://user:password@hooks.example.test/services/account/credential?token=x#fragment"
                    }
                }
            ],
            {},
        )
        record = scan.collect_repository(client_with(routes), "o/r")
        self.assertEqual(record["webhooks_state"], scan.PASS)
        self.assertEqual(record["webhooks"], ["https://hooks.example.test/[redacted]"])

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

    def test_unavailable_controls_do_not_claim_the_control_is_absent(self):
        record = scan.collect_repository(client_with(self.base_routes()), "o/r")
        for field in ("codeowners_state", "dependabot_config_state", "readme_state", "docs_state"):
            record[field] = scan.UNAVAILABLE
        findings = {finding["field"]: finding["finding"] for finding in scan.build_findings(record)}
        self.assertEqual(findings["codeowners_state"], "CODEOWNERS status could not be determined.")
        self.assertEqual(
            findings["dependabot_config_state"],
            "Dependabot configuration status could not be determined.",
        )
        self.assertEqual(findings["readme_state"], "README status could not be determined.")
        self.assertEqual(findings["docs_state"], "Docs directory status could not be determined.")
        self.assertTrue(all("No " not in findings[field] for field in findings if field.endswith("_state")))

    def test_listing_failure_raises(self):
        client = client_with({"https://api.github.test/orgs/none": (404, None, {})})
        with self.assertRaises(scan.GitHubError):
            scan.list_repositories(client, "none")

    def test_user_fallback_occurs_only_after_initial_org_not_found(self):
        client = client_with(
            {
                "https://api.github.test/orgs/person/repos": (404, None, {}),
                "https://api.github.test/users/person/repos": (
                    200,
                    [{"full_name": "person/repo"}],
                    {},
                ),
            }
        )
        self.assertEqual(scan.list_repositories(client, "person"), ["person/repo"])

    def test_partial_org_pagination_never_falls_back_to_user_listing(self):
        page_two = "https://api.github.test/orgs/acme/repos?page=2"
        client = client_with(
            {
                page_two: (500, None, {}),
                "https://api.github.test/orgs/acme/repos": (
                    200,
                    [{"full_name": "acme/first"}],
                    {"link": f'<{page_two}>; rel="next"'},
                ),
                "https://api.github.test/users/acme/repos": (
                    200,
                    [{"full_name": "acme/public-only"}],
                    {},
                ),
            }
        )
        with self.assertRaises(scan.GitHubError):
            scan.list_repositories(client, "acme")
        self.assertFalse(any("/users/acme/repos" in call for call in client.open.calls))


if __name__ == "__main__":
    unittest.main()
