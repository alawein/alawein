from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
GITHUB_DIR = SCRIPTS_DIR / "github"
for d in (str(SCRIPTS_DIR), str(GITHUB_DIR)):
    if d not in sys.path:
        sys.path.insert(0, d)

from github_dashboard_lib import (  # noqa: E402
    attention_flags,
    build_payload,
    build_static_outputs,
    fetch_repos,
    make_scope_key,
    parse_roadmap_tag,
    prune_snapshot_paths,
    resolve_category,
)


class GitHubDashboardLibTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        fixture_path = Path(__file__).parent / "fixtures" / "github_dashboard_fixture.json"
        cls.fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
        cls.owners = ["alawein"]
        cls.repos, cls.rate_limit, cls.request_count = fetch_repos(
            owners=cls.owners, fixture=cls.fixture
        )

    def test_roadmap_normalization(self) -> None:
        roadmap_tag, source = parse_roadmap_tag(["status-planned", "api"])
        self.assertEqual(roadmap_tag, "roadmap-planned")
        self.assertEqual(source, "status-planned")

    def test_category_resolution(self) -> None:
        self.assertEqual(resolve_category(["roadmap-active", "governance"]), "governance")
        self.assertEqual(resolve_category([]), "uncategorized")

    def test_attention_scoring_flags(self) -> None:
        beta = next(repo for repo in self.repos if repo["name"] == "beta")
        flags = attention_flags(beta)
        labels = {flag["label"] for flag in flags}
        self.assertIn("Missing license", labels)
        self.assertIn("No releases", labels)
        self.assertIn("Issue backlog", labels)
        self.assertIn("PR queue", labels)
        self.assertIn("Inactive 90+d", labels)

    def test_deltas_are_computed_from_previous_snapshot(self) -> None:
        previous_payload = {
            "kpis": {
                "totalRepos": 1,
                "openIssues": 0,
                "openPullRequests": 0,
                "totalStars": 10,
                "reposWithLatestRelease": 0,
                "reposWithLicense": 0,
                "pushedLast30Days": 0,
            },
            "snapshot": {"currentId": "prev-1"},
        }
        payload = build_payload(
            owners=self.owners,
            repos=self.repos,
            cache_status="fresh",
            rate_limit=self.rate_limit,
            previous_payload=previous_payload,
            current_snapshot_id="curr-1",
            history_depth=2,
        )
        self.assertEqual(payload["snapshot"]["previousId"], "prev-1")
        self.assertEqual(payload["snapshot"]["deltas"]["totalRepos"], 1)
        self.assertGreaterEqual(payload["snapshot"]["deltas"]["openIssues"], 1)

    def test_retention_prunes_old_snapshots(self) -> None:
        paths = [Path(f"snapshot-{idx}") for idx in range(5)]
        pruned = prune_snapshot_paths(paths, retention=2)
        self.assertEqual(pruned, paths[2:])

    def test_static_outputs_contract_files_exist(self) -> None:
        payload = build_payload(
            owners=self.owners,
            repos=self.repos,
            cache_status="fresh",
            rate_limit=self.rate_limit,
            previous_payload=None,
            current_snapshot_id="curr-2",
            history_depth=1,
        )
        outputs = build_static_outputs(
            payload=payload,
            output_dir=Path("docs/dashboard"),
            scope_key=make_scope_key(self.owners),
            current_snapshot_id="curr-2",
            include_snapshot_file=True,
        )
        normalized = {str(path).replace("\\", "/") for path in outputs}
        self.assertIn("docs/dashboard/latest.json", normalized)
        self.assertIn("docs/dashboard/index.md", normalized)
        self.assertIn("docs/dashboard/index.html", normalized)
        self.assertIn("docs/dashboard/app.js", normalized)
        self.assertIn("docs/dashboard/styles.css", normalized)


if __name__ == "__main__":
    unittest.main()
