from __future__ import annotations

import tempfile
import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import vercel_alias_audit as audit  # noqa: E402


class VercelAliasAuditTests(unittest.TestCase):
    def test_repo_key_candidates_support_hidden_workspace_dirs(self) -> None:
        self.assertEqual(audit.repo_key_candidates("_devkit"), ["_devkit", "devkit"])
        self.assertEqual(audit.repo_key_candidates("repz"), ["repz"])

    def test_expected_alias_uses_repo_name_only_when_dns_safe(self) -> None:
        self.assertEqual(audit.expected_alias("repz"), "repz.vercel.app")
        self.assertIsNone(audit.expected_alias("bad_repo"))

    def test_match_local_repo_uses_stripped_hidden_dir_name(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            root = Path(tmp_dir)
            hidden_repo = root / "_devkit"
            visible_repo = root / "repz"
            for repo_dir in (hidden_repo, visible_repo):
                (repo_dir / ".git").mkdir(parents=True)

            index = audit.index_local_repos(root)
            project_id_index = audit.index_local_project_ids(root)
            project = {
                "name": "devkit-storybook",
                "link": {"repo": "devkit"},
            }
            match = audit.match_local_repo(project, index, project_id_index)
            self.assertIsNotNone(match)
            self.assertEqual(match.name, "_devkit")

    def test_match_local_repo_prefers_project_id_mapping(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            root = Path(tmp_dir)
            repo_dir = root / "gainboy"
            (repo_dir / ".git").mkdir(parents=True)
            (repo_dir / ".vercel").mkdir(parents=True)
            (repo_dir / ".vercel" / "project.json").write_text(
                '{"projectId":"prj_gainboy","orgId":"team_test","projectName":"gymboy"}',
                encoding="utf-8",
            )

            project = {
                "id": "prj_gainboy",
                "name": "gainboy",
                "link": {"repo": "gymboy"},
            }
            match = audit.match_local_repo(
                project,
                audit.index_local_repos(root),
                audit.index_local_project_ids(root),
            )
            self.assertIsNotNone(match)
            self.assertEqual(match.name, "gainboy")


if __name__ == "__main__":
    unittest.main()
