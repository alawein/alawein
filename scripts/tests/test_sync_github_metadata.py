"""Unit tests for scripts/github/sync-github-metadata.py.

sync-github-metadata.py applies catalog-sourced repo settings (description,
topics, actions permissions, custom properties) to GitHub via `gh api`. The
custom_properties call is expected to fail permanently for personal-account
repos, since custom properties are an organization-only GitHub feature; that
specific, documented failure must be downgraded to "applied-with-blockers"
(exit 0). Every other gh api failure (bad credentials, permission denial, a
different 404, validation errors, rate limiting, server errors) must
propagate as a real error, not be silently swallowed.
"""

from __future__ import annotations

import importlib.util
import io
import json
import subprocess
import sys
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "github" / "sync-github-metadata.py"

_spec = importlib.util.spec_from_file_location("sync_github_metadata", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["sync_github_metadata"] = _mod
_spec.loader.exec_module(_mod)
sync_github_metadata = _mod


def _gh_error(stdout: str, stderr: str = "", returncode: int = 1) -> subprocess.CalledProcessError:
    return subprocess.CalledProcessError(returncode, ["gh", "api"], output=stdout, stderr=stderr)


# Real body captured from `gh api repos/alawein/adil/properties/values
# --method PATCH` against a repo owned by a User (non-org) account.
UNSUPPORTED_BODY = json.dumps(
    {
        "message": "Not Found",
        "documentation_url": (
            "https://docs.github.com/rest/repos/custom-properties"
            "#create-or-update-custom-property-values-for-a-repository"
        ),
        "status": "404",
    }
)
UNSUPPORTED_STDERR = "gh: Not Found (HTTP 404)"

# Real body captured from an invalid token against the same endpoint.
BAD_CREDENTIALS_BODY = json.dumps(
    {"message": "Bad credentials", "documentation_url": "https://docs.github.com/rest", "status": "401"}
)
BAD_CREDENTIALS_STDERR = "gh: Bad credentials (HTTP 401)"

# A 404 from a different endpoint's docs (e.g. the plain repo-update
# endpoint) -- same status, different documentation_url, must not match.
OTHER_404_BODY = json.dumps(
    {"message": "Not Found", "documentation_url": "https://docs.github.com/rest/repos/repos#update-a-repository", "status": "404"}
)


class IsCustomPropertiesUnsupported(unittest.TestCase):
    def test_genuine_unsupported_response_matches(self) -> None:
        exc = _gh_error(UNSUPPORTED_BODY, UNSUPPORTED_STDERR)
        self.assertTrue(sync_github_metadata.is_custom_properties_unsupported(exc))

    def test_bad_credentials_does_not_match(self) -> None:
        exc = _gh_error(BAD_CREDENTIALS_BODY, BAD_CREDENTIALS_STDERR)
        self.assertFalse(sync_github_metadata.is_custom_properties_unsupported(exc))

    def test_different_404_does_not_match(self) -> None:
        exc = _gh_error(OTHER_404_BODY, "gh: Not Found (HTTP 404)")
        self.assertFalse(sync_github_metadata.is_custom_properties_unsupported(exc))

    def test_unparseable_body_does_not_match(self) -> None:
        exc = _gh_error("", "connection reset by peer")
        self.assertFalse(sync_github_metadata.is_custom_properties_unsupported(exc))

    def test_non_json_body_does_not_match(self) -> None:
        exc = _gh_error("<html>502 Bad Gateway</html>", "gh: HTTP 502")
        self.assertFalse(sync_github_metadata.is_custom_properties_unsupported(exc))


def _repo_entry() -> dict:
    return {
        "slug": "test-repo",
        "repo": "acme/test-repo",
        "description": "A test repo",
        "homepage": "",
        "topics": ["foo"],
        "custom_properties": {"lifecycle": "active"},
    }


def _feed() -> dict:
    return {"generatedAt": "2026-09-04", "repos": [_repo_entry()]}


class ApplyModeCustomPropertiesHandling(unittest.TestCase):
    """Exercise the real apply loop in main(), only faking run_command."""

    def _run_apply(self, custom_properties_exc: subprocess.CalledProcessError):
        def fake_run_command(command):  # noqa: ANN001
            if command["name"] == "custom_properties":
                raise custom_properties_exc
            return {
                "name": command["name"],
                "method": command["method"],
                "endpoint": command["endpoint"],
                "status": "applied",
                "returncode": 0,
                "stdout": "",
                "stderr": "",
            }

        with mock.patch.object(sync_github_metadata, "load_feed", return_value=_feed()), \
             mock.patch.object(sync_github_metadata, "run_command", side_effect=fake_run_command):
            buf = io.StringIO()
            with redirect_stdout(buf):
                rc = sync_github_metadata.main(["--repo", "test-repo", "--apply"])
            return rc, buf.getvalue()

    def test_genuine_unsupported_case_downgrades_with_exit_zero(self) -> None:
        rc, out = self._run_apply(_gh_error(UNSUPPORTED_BODY, UNSUPPORTED_STDERR))
        self.assertEqual(rc, 0)
        payload = json.loads(out)
        repo_payload = payload["repos"][0]
        self.assertEqual(repo_payload["status"], "applied-with-blockers")
        blocked = next(r for r in repo_payload["results"] if r["name"] == "custom_properties")
        self.assertEqual(blocked["status"], "blocked")
        self.assertEqual(blocked["blocked_reason"], "custom-properties-unsupported")

    def test_other_failure_propagates_instead_of_being_swallowed(self) -> None:
        """A 403/401/etc must not be caught and downgraded like the
        documented unsupported case -- it has to surface as a real error."""
        with self.assertRaises(subprocess.CalledProcessError):
            self._run_apply(_gh_error(BAD_CREDENTIALS_BODY, BAD_CREDENTIALS_STDERR))

    def test_different_404_also_propagates(self) -> None:
        with self.assertRaises(subprocess.CalledProcessError):
            self._run_apply(_gh_error(OTHER_404_BODY, "gh: Not Found (HTTP 404)"))


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
