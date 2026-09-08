#!/usr/bin/env python3
"""Repository audit scanner.

Collects reproducible evidence about GitHub repositories (metadata, protections,
CI state, ownership, documentation, dependency management, integrations) and
writes a CSV inventory, a JSON inventory, a Mermaid integration map, a Markdown
audit report, and a prioritized remediation backlog.

The scanner is read-only: it never writes to the GitHub API and never prints or
persists credential values. Fields that cannot be read with the supplied token
are recorded as `unavailable` rather than silently treated as passing.

Usage:
    python tools/repo-audit/scan.py --org alawein --output-dir out
    python tools/repo-audit/scan.py --repos alawein/alawein --output-dir out
    python tools/repo-audit/scan.py --check-outputs out
"""

from __future__ import annotations

import argparse
import base64
import csv
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

USER_AGENT = "alawein-repo-audit/1.0"
DEFAULT_API_URL = "https://api.github.com"
DEFAULT_TOKEN_ENV = "GITHUB_TOKEN"

# Finding states. `unknown` means a readable response carried no determinable
# value; `unavailable` means the endpoint itself could not be read.
PASS = "pass"
FAIL = "fail"
PENDING = "pending"
UNKNOWN = "unknown"
UNAVAILABLE = "unavailable"
STATES = (PASS, FAIL, PENDING, UNKNOWN, UNAVAILABLE)

EXIT_OK = 0
EXIT_COLLECTION_FAILED = 1
EXIT_VALIDATION_FAILED = 3

# Priority bands for the remediation backlog, highest risk first.
PRIORITY_SECURITY = 1
PRIORITY_CI = 2
PRIORITY_PROTECTIONS = 3
PRIORITY_RELIABILITY = 4
PRIORITY_OWNERSHIP = 5
PRIORITY_DEPENDENCIES = 6
PRIORITY_DOCUMENTATION = 7
PRIORITY_CLEANUP = 8

PRIORITY_LABELS = {
    PRIORITY_SECURITY: "P1 security or credential exposure",
    PRIORITY_CI: "P2 broken or missing required CI",
    PRIORITY_PROTECTIONS: "P3 unsafe repository protections or merge controls",
    PRIORITY_RELIABILITY: "P4 reliability and deployment risk",
    PRIORITY_OWNERSHIP: "P5 missing ownership or unclear integration responsibility",
    PRIORITY_DEPENDENCIES: "P6 dependency-management gap",
    PRIORITY_DOCUMENTATION: "P7 documentation and observability gap",
    PRIORITY_CLEANUP: "P8 low-risk cleanup",
}

CODEOWNERS_PATHS = ("CODEOWNERS", ".github/CODEOWNERS", "docs/CODEOWNERS")

# Workflow path fragments that indicate a deployment or infrastructure step.
DEPLOY_HINTS = ("deploy", "release", "vercel", "netlify", "pages", "publish", "sync")

# Workflow path fragments that map to an external service. Only non-sensitive
# service names are recorded; workflow contents and secrets are never read.
SERVICE_HINTS = {
    "vercel": "Vercel",
    "netlify": "Netlify",
    "slack": "Slack",
    "codecov": "Codecov",
    "notion": "Notion",
    "codeql": "GitHub code scanning",
    "dependabot": "Dependabot",
    "docker": "Container registry",
    "npm": "npm registry",
    "pypi": "PyPI",
    "claude": "Anthropic Claude",
    "vale": "Vale",
}

CSV_COLUMNS = [
    "repo",
    "url",
    "visibility",
    "archived",
    "primary_language",
    "description",
    "default_branch",
    "last_commit_date",
    "contributors",
    "contributors_state",
    "contributor_activity",
    "contributor_activity_state",
    "open_pull_requests",
    "open_pull_request_urls",
    "open_issues",
    "open_issue_urls",
    "branch_protection_state",
    "required_status_checks",
    "required_status_checks_state",
    "ci_state",
    "recent_workflow_runs",
    "workflows",
    "workflows_state",
    "codeowners_state",
    "codeowners_path",
    "owner_dri",
    "readme_state",
    "docs_state",
    "dependabot_config_state",
    "dependency_alerts_state",
    "secret_scanning_state",
    "webhooks_state",
    "external_services",
    "collected_at",
    "evidence_sources",
]

JSON_ONLY_REPOSITORY_FIELDS = ("webhooks", "evidence")
STATE_FIELDS = {
    "contributors_state",
    "contributor_activity_state",
    "branch_protection_state",
    "required_status_checks_state",
    "ci_state",
    "workflows_state",
    "codeowners_state",
    "readme_state",
    "docs_state",
    "dependabot_config_state",
    "dependency_alerts_state",
    "secret_scanning_state",
    "webhooks_state",
}
LIST_FIELDS = {
    "contributors",
    "contributor_activity",
    "open_pull_request_urls",
    "open_issue_urls",
    "required_status_checks",
    "recent_workflow_runs",
    "workflows",
    "webhooks",
    "external_services",
    "evidence_sources",
}
FINDING_FIELDS = {
    "repo",
    "priority",
    "category",
    "field",
    "finding",
    "evidence",
    "collected_at",
}


def utc_now() -> str:
    """Current UTC timestamp, or the pinned one when SOURCE_DATE_EPOCH is set.

    Honouring SOURCE_DATE_EPOCH lets a fixture replay reproduce the committed
    example outputs byte for byte, so CI can detect drift.
    """
    pinned = os.environ.get("SOURCE_DATE_EPOCH", "").strip()
    if pinned:
        try:
            return datetime.fromtimestamp(int(pinned), tz=timezone.utc).replace(microsecond=0).isoformat()
        except (ValueError, OverflowError, OSError):
            pass
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


class GitHubError(Exception):
    """Raised when a mandatory collection step cannot complete."""


class SameHostRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Refuse redirects that leave the configured API host.

    The stock handler copies every request header, including Authorization,
    onto the redirect target. Blocking cross-host redirects keeps the audit
    token from reaching any host other than the configured API.
    """

    def __init__(self, scheme: str, netloc: str) -> None:
        self.scheme = scheme
        self.netloc = netloc

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: D102 - stdlib signature
        parts = urllib.parse.urlsplit(newurl)
        if (parts.scheme, parts.netloc) != (self.scheme, self.netloc):
            raise urllib.error.HTTPError(newurl, code, "cross-host redirect refused", headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class FixtureTransport:
    """Replay recorded API responses instead of calling the network.

    A fixture file maps an endpoint suffix (path plus optional query) to
    `{"status": int, "body": any, "headers": {...}}`. Unlisted endpoints reply
    404, which the scanner classifies exactly as it would in a live run. This
    keeps example generation and offline reviews deterministic.
    """

    def __init__(self, fixture: dict[str, Any]) -> None:
        self.routes = fixture

    def __call__(self, url: str) -> tuple[int, Any, dict[str, str]]:
        best: tuple[int, dict[str, Any]] | None = None
        for suffix, response in self.routes.items():
            if url.endswith(suffix) and (best is None or len(suffix) > best[0]):
                best = (len(suffix), response)
        if best is None:
            return 404, None, {}
        response = best[1]
        headers = {str(key).lower(): str(value) for key, value in (response.get("headers") or {}).items()}
        return int(response.get("status", 200)), response.get("body"), headers


class GitHubClient:
    """Minimal read-only GitHub REST client with pagination and an evidence log."""

    def __init__(self, api_url: str, token: str | None, timeout: int = 30) -> None:
        self.api_url = api_url.rstrip("/")
        self._token = token
        self.timeout = timeout
        self.evidence: list[dict[str, Any]] = []
        parts = urllib.parse.urlsplit(self.api_url)
        self._opener = urllib.request.build_opener(
            SameHostRedirectHandler(parts.scheme, parts.netloc)
        )

    def _headers(self) -> dict[str, str]:
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": USER_AGENT,
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if self._token:
            # The token value is only ever placed in this header; it is never
            # logged, printed, or written to any output file.
            headers["Authorization"] = "Bearer " + self._token
        return headers

    def _absolute(self, path: str) -> str:
        if path.startswith("https://") or path.startswith("http://"):
            return path
        return f"{self.api_url}/{path.lstrip('/')}"

    def _same_host(self, url: str | None) -> str | None:
        """Drop a pagination URL that points off the configured API host.

        The Authorization header travels with every request, so a Link header
        naming another host must never be followed.
        """
        if not url:
            return None
        configured = urllib.parse.urlsplit(self.api_url)
        candidate = urllib.parse.urlsplit(url)
        if (candidate.scheme, candidate.netloc) != (configured.scheme, configured.netloc):
            print(
                f"warning: ignoring pagination link to unexpected host '{candidate.netloc}'",
                file=sys.stderr,
            )
            return None
        return url

    def open(self, url: str) -> tuple[int, Any, dict[str, str]]:
        """Perform one request and return (status, parsed_body, headers).

        Network and HTTP errors become a status code with a `None` body so
        callers can classify them instead of aborting the whole scan.
        """
        request = urllib.request.Request(url, headers=self._headers(), method="GET")
        try:
            with self._opener.open(request, timeout=self.timeout) as response:
                raw = response.read()
                headers = {key.lower(): value for key, value in response.headers.items()}
                status = response.status
        except urllib.error.HTTPError as error:
            raw = error.read() if hasattr(error, "read") else b""
            headers = {key.lower(): value for key, value in (error.headers or {}).items()}
            status = error.code
        except (urllib.error.URLError, TimeoutError, OSError):
            return 0, None, {}

        if status == 204 or not raw:
            return status, None, headers
        try:
            return status, json.loads(raw.decode("utf-8")), headers
        except (ValueError, UnicodeDecodeError):
            return status, None, headers

    def _record(self, url: str, status: int) -> dict[str, Any]:
        entry = {
            "endpoint": url,
            "status": status,
            "collected_at": utc_now(),
            "state": classify_status(status),
        }
        self.evidence.append(entry)
        return entry

    def get(self, path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        """Fetch a single resource and record evidence for it."""
        url = self._absolute(path)
        if params:
            url = f"{url}?{urllib.parse.urlencode(params)}"
        status, body, headers = self.open(url)
        return {"status": status, "body": body, "headers": headers, "evidence": self._record(url, status)}

    def paginate(
        self, path: str, params: dict[str, Any] | None = None, max_pages: int = 20
    ) -> dict[str, Any]:
        """Follow RFC 5988 `Link: rel="next"` pagination and collect all items."""
        query = dict(params or {})
        query.setdefault("per_page", 100)
        url: str | None = f"{self._absolute(path)}?{urllib.parse.urlencode(query)}"
        items: list[Any] = []
        records: list[dict[str, Any]] = []
        status = 0
        complete = False

        while url and len(records) < max_pages:
            status, body, headers = self.open(url)
            records.append(self._record(url, status))
            if status != 200 or not isinstance(body, list):
                # A page that fails mid-sequence makes the whole collection
                # partial; the caller must not treat the items as complete.
                break
            items.extend(body)
            next_url = next_page_url(headers.get("link", ""))
            if not next_url:
                complete = True
                url = None
                break
            url = self._same_host(next_url)
            if not url:
                # A next page existed but was unsafe to request. Preserve the
                # collected page as evidence while reporting the collection as
                # incomplete, never as an authoritative truncated result.
                break

        if url and len(records) >= max_pages:
            print(
                f"warning: stopped paginating {self._absolute(path)} after {max_pages} pages",
                file=sys.stderr,
            )

        if not records:
            records.append(
                {
                    "endpoint": self._absolute(path),
                    "status": 0,
                    "collected_at": utc_now(),
                    "state": UNAVAILABLE,
                }
            )

        last = records[-1]
        return {
            # `status` and `state` describe the last page attempted, and
            # `complete` is true only when every page was collected. Callers
            # must gate on `complete`, never on the first page's status.
            "status": last["status"],
            "state": last["state"] if complete else UNAVAILABLE,
            "complete": complete,
            "items": items,
            "evidence": records[0],
            "evidence_pages": records,
        }


def next_page_url(link_header: str) -> str | None:
    """Extract the `rel="next"` URL from a Link header, if present."""
    if not link_header:
        return None
    for part in link_header.split(","):
        segments = part.split(";")
        if len(segments) < 2:
            continue
        target = segments[0].strip()
        if not (target.startswith("<") and target.endswith(">")):
            continue
        for attribute in segments[1:]:
            key, _, value = attribute.strip().partition("=")
            if key.strip() == "rel" and value.strip().strip('"') == "next":
                return target[1:-1]
    return None


def classify_status(status: int) -> str:
    """Map an HTTP status onto an audit state."""
    if status == 202:
        return PENDING
    if 200 <= status < 300:
        return PASS
    if status in (401, 403):
        return UNAVAILABLE
    if status == 404:
        return FAIL
    if status == 0 or status >= 500:
        return UNAVAILABLE
    return UNKNOWN


def workflow_run_state(runs: Iterable[dict[str, Any]]) -> str:
    """Summarize recent workflow runs into a single audit state."""
    runs = list(runs)
    if not runs:
        return UNKNOWN
    conclusions = [str(run.get("conclusion") or "").lower() for run in runs]
    statuses = [str(run.get("status") or "").lower() for run in runs]
    if any(value in ("failure", "timed_out", "startup_failure") for value in conclusions):
        return FAIL
    if any(value in ("queued", "in_progress", "waiting", "requested", "pending") for value in statuses):
        return PENDING
    if any(value == "success" for value in conclusions):
        return PASS
    return UNKNOWN


def parse_codeowners_owners(content: str) -> list[str]:
    """Return the owner handles referenced by a CODEOWNERS file."""
    owners: list[str] = []
    for line in content.splitlines():
        stripped = line.split("#", 1)[0].strip()
        if not stripped:
            continue
        for token in stripped.split()[1:]:
            if (token.startswith("@") or "@" in token) and token not in owners:
                owners.append(token)
    return owners


def decode_contents(body: Any) -> str | None:
    """Decode a GitHub contents API payload into text, when possible."""
    if not isinstance(body, dict) or body.get("encoding") != "base64" or not body.get("content"):
        return None
    try:
        return base64.b64decode(body["content"]).decode("utf-8", errors="replace")
    except (ValueError, TypeError):
        return None


def detect_services(workflow_paths: Iterable[str]) -> list[str]:
    """Infer external services from workflow file paths. No secrets are read."""
    services: list[str] = []
    for path in workflow_paths:
        lowered = path.lower()
        for hint, service in SERVICE_HINTS.items():
            if hint in lowered and service not in services:
                services.append(service)
    return sorted(services)


def redact_webhook_url(value: Any) -> str:
    """Return a non-sensitive webhook origin without credentials or route data."""
    try:
        parts = urllib.parse.urlsplit(str(value or ""))
        port = parts.port
    except ValueError:
        return UNKNOWN
    if parts.scheme.lower() not in {"http", "https"} or not parts.hostname:
        return UNKNOWN
    hostname = parts.hostname
    if ":" in hostname:
        hostname = f"[{hostname}]"
    netloc = f"{hostname}:{port}" if port is not None else hostname
    return urllib.parse.urlunsplit((parts.scheme.lower(), netloc, "/[redacted]", "", ""))


def required_checks_from_rules(rules: Iterable[dict[str, Any]]) -> list[str]:
    """Collect required status-check names from effective branch rules."""
    checks: list[str] = []
    for rule in rules:
        if not isinstance(rule, dict) or rule.get("type") != "required_status_checks":
            continue
        parameters = rule.get("parameters") or {}
        for item in parameters.get("required_status_checks", []):
            if not isinstance(item, dict):
                continue
            context = str(item.get("context") or "").strip()
            if context and context not in checks:
                checks.append(context)
    return checks


def split_repo(slug: str) -> tuple[str, str]:
    owner, _, name = slug.strip().partition("/")
    if not owner or not name or "/" in name:
        raise ValueError(f"repository must use owner/repo form, got '{slug}'")
    return owner, name


def collect_repository(client: GitHubClient, slug: str) -> dict[str, Any]:
    """Collect one repository record. Unreadable fields stay explicit."""
    owner, name = split_repo(slug)
    base = f"/repos/{owner}/{name}"
    evidence: list[dict[str, Any]] = []

    repo_response = client.get(base)
    evidence.append(repo_response["evidence"])
    if repo_response["status"] != 200 or not isinstance(repo_response["body"], dict):
        raise GitHubError(
            f"cannot read repository {slug} (HTTP {repo_response['status']}); "
            "the audit token may lack read access to repository contents"
        )

    repo = repo_response["body"]
    default_branch = str(repo.get("default_branch") or "")
    record: dict[str, Any] = {
        "repo": repo.get("full_name") or slug,
        "url": repo.get("html_url") or f"https://github.com/{slug}",
        "visibility": repo.get("visibility") or ("private" if repo.get("private") else "public"),
        "archived": bool(repo.get("archived")),
        "primary_language": repo.get("language") or UNKNOWN,
        "description": (repo.get("description") or "").replace("\n", " ").strip() or UNKNOWN,
        "default_branch": default_branch or UNKNOWN,
        "collected_at": utc_now(),
    }

    if default_branch:
        commits = client.get(f"{base}/commits", {"sha": default_branch, "per_page": 1})
        evidence.append(commits["evidence"])
        body = commits["body"]
        if commits["status"] == 200 and isinstance(body, list) and body:
            record["last_commit_date"] = body[0].get("commit", {}).get("committer", {}).get("date") or UNKNOWN
        else:
            record["last_commit_date"] = commits["evidence"]["state"]
    else:
        record["last_commit_date"] = UNKNOWN

    contributors = client.paginate(f"{base}/contributors", {"per_page": 100})
    evidence.extend(contributors["evidence_pages"])
    record["contributors"] = (
        [str(item.get("login") or UNKNOWN) for item in contributors["items"]]
        if contributors["complete"]
        else []
    )
    record["contributors_state"] = PASS if contributors["complete"] else contributors["state"]

    stats = client.get(f"{base}/stats/contributors")
    evidence.append(stats["evidence"])
    if stats["status"] == 200 and isinstance(stats["body"], list):
        activity: list[str] = []
        for entry in stats["body"]:
            login = str((entry.get("author") or {}).get("login") or UNKNOWN)
            weeks = [week for week in entry.get("weeks", []) if week.get("c")]
            if weeks:
                last = max(int(week.get("w", 0)) for week in weeks)
                stamp = datetime.fromtimestamp(last, tz=timezone.utc).date().isoformat()
            else:
                stamp = UNKNOWN
            activity.append(f"{login}:{stamp}")
        record["contributor_activity"] = activity
        record["contributor_activity_state"] = PASS if activity else UNKNOWN
    else:
        # A 202 means GitHub is still computing the statistics: pending, not failed.
        record["contributor_activity"] = []
        record["contributor_activity_state"] = stats["evidence"]["state"]

    pulls = client.paginate(f"{base}/pulls", {"state": "open", "per_page": 100})
    evidence.extend(pulls["evidence_pages"])
    record["open_pull_requests"] = len(pulls["items"]) if pulls["complete"] else UNAVAILABLE
    record["open_pull_request_urls"] = (
        [str(item.get("html_url") or "") for item in pulls["items"]] if pulls["complete"] else []
    )

    issues = client.paginate(f"{base}/issues", {"state": "open", "per_page": 100})
    evidence.extend(issues["evidence_pages"])
    only_issues = [item for item in issues["items"] if "pull_request" not in item]
    record["open_issues"] = len(only_issues) if issues["complete"] else UNAVAILABLE
    record["open_issue_urls"] = (
        [str(item.get("html_url") or "") for item in only_issues] if issues["complete"] else []
    )

    if default_branch:
        encoded_branch = urllib.parse.quote(default_branch, safe="")
        protection = client.get(f"{base}/branches/{encoded_branch}/protection")
        evidence.append(protection["evidence"])
        rules = client.get(f"{base}/rules/branches/{encoded_branch}")
        evidence.append(rules["evidence"])

        classic_protected = protection["status"] == 200 and isinstance(protection["body"], dict)
        effective_rules = rules["body"] if rules["status"] == 200 and isinstance(rules["body"], list) else []
        rules_protected = bool(effective_rules)
        classic_resolved = protection["status"] in (200, 404)
        rules_resolved = rules["status"] == 200
        if classic_protected or rules_protected:
            record["branch_protection_state"] = PASS
            required_checks: list[str] = []
            if classic_protected:
                classic_checks = protection["body"].get("required_status_checks") or {}
                for item in classic_checks.get("contexts", []):
                    context = str(item).strip()
                    if context and context not in required_checks:
                        required_checks.append(context)
                for item in classic_checks.get("checks", []):
                    context = str((item or {}).get("context") or "").strip()
                    if context and context not in required_checks:
                        required_checks.append(context)
            for context in required_checks_from_rules(effective_rules):
                if context not in required_checks:
                    required_checks.append(context)
            record["required_status_checks"] = required_checks
            if required_checks:
                record["required_status_checks_state"] = PASS
            elif classic_resolved and rules_resolved:
                record["required_status_checks_state"] = FAIL
            else:
                record["required_status_checks_state"] = UNAVAILABLE
        elif protection["status"] == 404 and rules["status"] == 200:
            # A classic 404 proves only that no classic rule applies. The
            # effective rules endpoint must also be readable and empty before
            # the scanner can conclude that the branch is unprotected.
            record["branch_protection_state"] = FAIL
            record["required_status_checks"] = []
            record["required_status_checks_state"] = FAIL
        else:
            record["branch_protection_state"] = UNAVAILABLE
            record["required_status_checks"] = []
            record["required_status_checks_state"] = UNAVAILABLE
    else:
        record["branch_protection_state"] = UNKNOWN
        record["required_status_checks"] = []
        record["required_status_checks_state"] = UNKNOWN

    runs = client.get(f"{base}/actions/runs", {"per_page": 10})
    evidence.append(runs["evidence"])
    if runs["status"] == 200 and isinstance(runs["body"], dict):
        recent = runs["body"].get("workflow_runs") or []
        record["ci_state"] = workflow_run_state(recent)
        record["recent_workflow_runs"] = [
            f"{run.get('name') or UNKNOWN}:{run.get('conclusion') or run.get('status') or UNKNOWN}"
            for run in recent
        ]
    else:
        record["ci_state"] = runs["evidence"]["state"]
        record["recent_workflow_runs"] = []

    workflows = client.get(f"{base}/actions/workflows", {"per_page": 100})
    evidence.append(workflows["evidence"])
    if workflows["status"] == 200 and isinstance(workflows["body"], dict):
        record["workflows"] = [str(item.get("path") or "") for item in workflows["body"].get("workflows", [])]
        record["workflows_state"] = PASS if record["workflows"] else FAIL
    else:
        record["workflows"] = []
        record["workflows_state"] = workflows["evidence"]["state"]

    record["codeowners_state"] = FAIL
    record["codeowners_path"] = UNKNOWN
    owners: list[str] = []
    for candidate in CODEOWNERS_PATHS:
        response = client.get(f"{base}/contents/{candidate}")
        evidence.append(response["evidence"])
        if response["status"] == 200:
            record["codeowners_state"] = PASS
            record["codeowners_path"] = candidate
            owners = parse_codeowners_owners(decode_contents(response["body"]) or "")
            break
        if response["evidence"]["state"] == UNAVAILABLE:
            record["codeowners_state"] = UNAVAILABLE
            break
    record["owner_dri"] = owners[0] if owners else f"@{owner}"

    readme = client.get(f"{base}/readme")
    evidence.append(readme["evidence"])
    record["readme_state"] = PASS if readme["status"] == 200 else readme["evidence"]["state"]

    docs = client.get(f"{base}/contents/docs")
    evidence.append(docs["evidence"])
    record["docs_state"] = PASS if docs["status"] == 200 else docs["evidence"]["state"]

    dependabot = client.get(f"{base}/contents/.github/dependabot.yml")
    evidence.append(dependabot["evidence"])
    record["dependabot_config_state"] = PASS if dependabot["status"] == 200 else dependabot["evidence"]["state"]

    alerts = client.get(f"{base}/vulnerability-alerts")
    evidence.append(alerts["evidence"])
    if alerts["status"] == 204:
        record["dependency_alerts_state"] = PASS
    elif alerts["status"] == 404:
        record["dependency_alerts_state"] = FAIL
    else:
        record["dependency_alerts_state"] = alerts["evidence"]["state"]

    security = repo.get("security_and_analysis")
    if isinstance(security, dict):
        secret_scanning = (security.get("secret_scanning") or {}).get("status")
        record["secret_scanning_state"] = PASS if secret_scanning == "enabled" else FAIL
    else:
        # `security_and_analysis` is returned only to tokens with admin read.
        record["secret_scanning_state"] = UNAVAILABLE

    hooks = client.paginate(f"{base}/hooks", {"per_page": 100})
    evidence.extend(hooks["evidence_pages"])
    if hooks["complete"]:
        record["webhooks_state"] = PASS if hooks["items"] else FAIL
        record["webhooks"] = [redact_webhook_url((item.get("config") or {}).get("url")) for item in hooks["items"]]
    else:
        record["webhooks_state"] = hooks["state"]
        record["webhooks"] = []

    record["external_services"] = detect_services(record["workflows"])
    record["evidence"] = evidence
    record["evidence_sources"] = [item["endpoint"] for item in evidence]
    return record


def list_repositories(client: GitHubClient, account: str) -> list[str]:
    """List repositories for an organization, falling back to a user account."""
    response = client.paginate(f"/orgs/{account}/repos", {"per_page": 100, "type": "all"})
    first_status = response["evidence_pages"][0]["status"]
    if not response["complete"] and first_status == 404 and not response["items"]:
        response = client.paginate(f"/users/{account}/repos", {"per_page": 100, "type": "all"})
    if not response["complete"]:
        raise GitHubError(
            f"cannot list repositories for '{account}' (HTTP {response['status']}); "
            "cross-repository reads need a token with repository read scope"
        )
    return [str(item.get("full_name")) for item in response["items"] if item.get("full_name")]


def build_findings(record: dict[str, Any]) -> list[dict[str, Any]]:
    """Derive prioritized findings from one repository record."""
    findings: list[dict[str, Any]] = []

    def add(priority: int, field: str, message: str) -> None:
        findings.append(
            {
                "repo": record["repo"],
                "priority": priority,
                "category": PRIORITY_LABELS[priority],
                "field": field,
                "finding": message,
                "evidence": record["url"],
                "collected_at": record["collected_at"],
            }
        )

    if record.get("secret_scanning_state") == FAIL:
        add(PRIORITY_SECURITY, "secret_scanning_state", "Secret scanning is not enabled.")
    elif record.get("secret_scanning_state") == UNAVAILABLE:
        add(
            PRIORITY_SECURITY,
            "secret_scanning_state",
            "Secret scanning status is unavailable to the audit token; admin read is required.",
        )

    if record.get("archived"):
        add(
            PRIORITY_CLEANUP,
            "archived",
            "Repository is archived; it stays in the inventory and is not modified.",
        )
        return findings

    if record.get("ci_state") == FAIL:
        add(PRIORITY_CI, "ci_state", "Recent workflow runs include a failure.")
    if record.get("workflows_state") == FAIL:
        add(PRIORITY_CI, "workflows_state", "No GitHub Actions workflow is configured.")
    if record.get("branch_protection_state") == FAIL:
        add(PRIORITY_PROTECTIONS, "branch_protection_state", "Default branch has no protection rule.")
    elif record.get("branch_protection_state") == PASS and record.get("required_status_checks_state") == FAIL:
        add(
            PRIORITY_PROTECTIONS,
            "required_status_checks",
            "Branch protection defines no required status checks.",
        )
    elif record.get("branch_protection_state") == PASS and record.get("required_status_checks_state") == UNAVAILABLE:
        add(
            PRIORITY_PROTECTIONS,
            "required_status_checks",
            "Required status-check coverage is unavailable to the audit token.",
        )
    elif record.get("branch_protection_state") == UNAVAILABLE:
        add(
            PRIORITY_PROTECTIONS,
            "branch_protection_state",
            "Branch protection is unavailable to the audit token; admin read is required.",
        )
    if record.get("webhooks_state") == UNAVAILABLE:
        add(
            PRIORITY_RELIABILITY,
            "integrations",
            "Webhook inventory is unavailable to the audit token.",
        )
    if record.get("codeowners_state") == FAIL:
        add(PRIORITY_OWNERSHIP, "codeowners_state", "No CODEOWNERS file was found.")
    elif record.get("codeowners_state") != PASS:
        add(PRIORITY_OWNERSHIP, "codeowners_state", "CODEOWNERS status could not be determined.")
    if record.get("dependabot_config_state") == FAIL:
        add(PRIORITY_DEPENDENCIES, "dependabot_config_state", "No Dependabot configuration was found.")
    elif record.get("dependabot_config_state") != PASS:
        add(
            PRIORITY_DEPENDENCIES,
            "dependabot_config_state",
            "Dependabot configuration status could not be determined.",
        )
    if record.get("dependency_alerts_state") == FAIL:
        add(PRIORITY_DEPENDENCIES, "dependency_alerts_state", "Dependency alerts are disabled.")
    if record.get("readme_state") == FAIL:
        add(PRIORITY_DOCUMENTATION, "readme_state", "No README was found.")
    elif record.get("readme_state") != PASS:
        add(PRIORITY_DOCUMENTATION, "readme_state", "README status could not be determined.")
    if record.get("docs_state") == FAIL:
        add(PRIORITY_DOCUMENTATION, "docs_state", "No docs directory was found.")
    elif record.get("docs_state") != PASS:
        add(PRIORITY_DOCUMENTATION, "docs_state", "Docs directory status could not be determined.")
    if record.get("description") == UNKNOWN:
        add(PRIORITY_CLEANUP, "description", "Repository has no description.")
    return findings


def csv_cell(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, list):
        return ";".join(str(item) for item in value)
    return "" if value is None else str(value)


def write_csv(path: Path, records: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(CSV_COLUMNS)
        for record in records:
            writer.writerow([csv_cell(record.get(column)) for column in CSV_COLUMNS])


def write_json(path: Path, records: list[dict[str, Any]], findings: list[dict[str, Any]], scope: str) -> None:
    payload = {
        "schema": "tools/repo-audit/schema.json",
        "generated_at": utc_now(),
        "scope": scope,
        "states": list(STATES),
        "repository_count": len(records),
        "repositories": records,
        "findings": findings,
    }
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def mermaid_id(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_]", "_", value)


def mermaid_label(value: str) -> str:
    return re.sub(r"[\"\[\]{}()|]", " ", value).strip() or UNKNOWN


def build_mermaid(records: list[dict[str, Any]]) -> str:
    """Render repo to CI to service to notification edges. Carries no secrets."""
    lines = ["flowchart LR"]
    for record in records:
        repo_id = mermaid_id(record["repo"])
        ci_id = f"{repo_id}_ci"
        notify_id = f"{repo_id}_notify"
        lines.append(f'    {repo_id}["{mermaid_label(record["repo"])}"]')
        lines.append(f'    {ci_id}["CI checks: {mermaid_label(str(record.get("ci_state", UNKNOWN)))}"]')
        lines.append(f"    {repo_id} --> {ci_id}")
        for workflow in record.get("workflows", [])[:10]:
            workflow_id = f"{repo_id}_wf_{mermaid_id(workflow)}"
            lines.append(f'    {workflow_id}["{mermaid_label(Path(workflow).name)}"]')
            lines.append(f"    {ci_id} --> {workflow_id}")
        deployment_workflows = [
            Path(path).name
            for path in record.get("workflows", [])
            if any(hint in path.lower() for hint in DEPLOY_HINTS)
        ]
        service_source = ci_id
        if deployment_workflows:
            deploy_id = f"{repo_id}_deploy"
            label = mermaid_label(", ".join(deployment_workflows[:3]))
            lines.append(f'    {deploy_id}["Deployment and infrastructure: {label}"]')
            lines.append(f"    {ci_id} --> {deploy_id}")
            service_source = deploy_id
        for service in record.get("external_services", []):
            service_id = f"svc_{mermaid_id(service)}"
            lines.append(f'    {service_id}(["{mermaid_label(service)}"])')
            lines.append(f"    {service_source} --> {service_id}")
        lines.append(f'    {notify_id}["Notifications: GitHub email"]')
        lines.append(f"    {ci_id} --> {notify_id}")
    return "\n".join(lines) + "\n"


def doctrine_header(title: str) -> str:
    """Frontmatter required by the workspace docs doctrine for generated files."""
    today = utc_now()[:10]
    return (
        "---\n"
        "type: generated\n"
        "source: tools/repo-audit/scan.py\n"
        "sync: script\n"
        "sla: manual\n"
        f"last_updated: {today}\n"
        "---\n\n"
        "<!-- AUTO-GENERATED by tools/repo-audit/scan.py. Do not edit by hand. -->\n\n"
        f"# {title}\n\n"
    )


def write_report(path: Path, records: list[dict[str, Any]], findings: list[dict[str, Any]], scope: str) -> None:
    lines = [doctrine_header("Repository audit report")]
    lines.append(f"- Scope: `{scope}`\n")
    lines.append(f"- Generated at: `{utc_now()}`\n")
    lines.append(f"- Repositories audited: {len(records)}\n")
    lines.append(f"- Findings: {len(findings)}\n\n")
    lines.append(
        "States: `pass`, `fail`, `pending`, `unknown` (readable response with no "
        "determinable value), `unavailable` (endpoint not readable with the audit token).\n\n"
    )

    lines.append("## Inventory\n\n")
    lines.append(
        "| Repository | Visibility | Archived | Default branch | CI | Branch protection | CODEOWNERS | Owner |\n"
    )
    lines.append("| --- | --- | --- | --- | --- | --- | --- | --- |\n")
    for record in records:
        lines.append(
            "| [{repo}]({url}) | {visibility} | {archived} | {branch} | {ci} | {protection} | {codeowners} | {dri} |\n".format(
                repo=record["repo"],
                url=record["url"],
                visibility=record.get("visibility", UNKNOWN),
                archived="yes" if record.get("archived") else "no",
                branch=record.get("default_branch", UNKNOWN),
                ci=record.get("ci_state", UNKNOWN),
                protection=record.get("branch_protection_state", UNKNOWN),
                codeowners=record.get("codeowners_state", UNKNOWN),
                dri=record.get("owner_dri", UNKNOWN),
            )
        )

    lines.append("\n## Coverage limits\n\n")
    by_state: dict[str, set[str]] = {UNAVAILABLE: set(), UNKNOWN: set()}
    for record in records:
        for key, value in record.items():
            if isinstance(value, str) and value in by_state:
                by_state[value].add(key)
    for state in (UNAVAILABLE, UNKNOWN):
        fields = sorted(by_state[state])
        rendered = ", ".join(f"`{field}`" for field in fields) if fields else "none"
        lines.append(f"- Fields recorded as `{state}`: {rendered}\n")

    lines.append("\n## Evidence\n\n")
    for record in records:
        lines.append(f"### {record['repo']}\n\n")
        lines.append(f"Collected at `{record['collected_at']}`.\n\n")
        for item in record.get("evidence", []):
            lines.append(
                f"- `{item['status']}` {item['state']} from `{item['endpoint']}` at `{item['collected_at']}`\n"
            )
        lines.append("\n")

    path.write_text("".join(lines).rstrip() + "\n", encoding="utf-8")


def write_backlog(path: Path, findings: list[dict[str, Any]]) -> None:
    lines = [doctrine_header("Repository audit remediation backlog")]
    lines.append("Ordered by risk band: security first, low-risk cleanup last.\n\n")
    if not findings:
        lines.append("No findings were produced for the audited scope.\n")
        path.write_text("".join(lines), encoding="utf-8")
        return

    ordered = sorted(findings, key=lambda item: (item["priority"], item["repo"], item["field"]))
    current_priority: int | None = None
    for finding in ordered:
        if finding["priority"] != current_priority:
            if current_priority is not None:
                lines.append("\n")
            current_priority = int(finding["priority"])
            lines.append(f"## {PRIORITY_LABELS[current_priority]}\n\n")
        lines.append(
            f"- `{finding['repo']}`: {finding['finding']} "
            f"(field `{finding['field']}`, evidence {finding['evidence']}, "
            f"observed `{finding['collected_at']}`)\n"
        )
    path.write_text("".join(lines), encoding="utf-8")


def validate_evidence_entry(entry: Any, location: str) -> list[str]:
    errors: list[str] = []
    expected = {"endpoint", "status", "collected_at", "state"}
    if not isinstance(entry, dict):
        return [f"{location} must be an object"]
    missing = expected - set(entry)
    extra = set(entry) - expected
    if missing:
        errors.append(f"{location} is missing fields: {', '.join(sorted(missing))}")
    if extra:
        errors.append(f"{location} has unexpected fields: {', '.join(sorted(extra))}")
    for field in ("endpoint", "collected_at"):
        if field in entry and not isinstance(entry[field], str):
            errors.append(f"{location}.{field} must be a string")
    if "status" in entry and (isinstance(entry["status"], bool) or not isinstance(entry["status"], int)):
        errors.append(f"{location}.status must be an integer")
    if "state" in entry and entry["state"] not in STATES:
        errors.append(f"{location}.state must be one of {', '.join(STATES)}")
    return errors


def validate_repository_record(record: Any, index: int) -> list[str]:
    errors: list[str] = []
    location = f"repositories[{index}]"
    expected = set(CSV_COLUMNS) | set(JSON_ONLY_REPOSITORY_FIELDS)
    if not isinstance(record, dict):
        return [f"{location} must be an object"]
    missing = expected - set(record)
    extra = set(record) - expected
    if missing:
        errors.append(f"{location} is missing fields: {', '.join(sorted(missing))}")
    if extra:
        errors.append(f"{location} has unexpected fields: {', '.join(sorted(extra))}")

    if "archived" in record and not isinstance(record["archived"], bool):
        errors.append(f"{location}.archived must be a boolean")
    if "visibility" in record and record["visibility"] not in {"public", "private", "internal"}:
        errors.append(f"{location}.visibility must be public, private, or internal")
    for field in STATE_FIELDS:
        if field in record and record[field] not in STATES:
            errors.append(f"{location}.{field} must be one of {', '.join(STATES)}")
    for field in LIST_FIELDS:
        if field not in record:
            continue
        if not isinstance(record[field], list) or not all(isinstance(item, str) for item in record[field]):
            errors.append(f"{location}.{field} must be an array of strings")
    for field in ("open_pull_requests", "open_issues"):
        if field not in record:
            continue
        value = record[field]
        if not ((isinstance(value, int) and not isinstance(value, bool) and value >= 0) or value == UNAVAILABLE):
            errors.append(f"{location}.{field} must be a non-negative integer or unavailable")
    for field in expected - STATE_FIELDS - LIST_FIELDS - {"archived", "open_pull_requests", "open_issues", "evidence"}:
        if field in record and not isinstance(record[field], str):
            errors.append(f"{location}.{field} must be a string")
    if "evidence" in record:
        if not isinstance(record["evidence"], list):
            errors.append(f"{location}.evidence must be an array")
        else:
            for evidence_index, entry in enumerate(record["evidence"]):
                errors.extend(validate_evidence_entry(entry, f"{location}.evidence[{evidence_index}]"))
    return errors


def validate_finding(finding: Any, index: int) -> list[str]:
    errors: list[str] = []
    location = f"findings[{index}]"
    if not isinstance(finding, dict):
        return [f"{location} must be an object"]
    missing = FINDING_FIELDS - set(finding)
    extra = set(finding) - FINDING_FIELDS
    if missing:
        errors.append(f"{location} is missing fields: {', '.join(sorted(missing))}")
    if extra:
        errors.append(f"{location} has unexpected fields: {', '.join(sorted(extra))}")
    for field in FINDING_FIELDS - {"priority"}:
        if field in finding and not isinstance(finding[field], str):
            errors.append(f"{location}.{field} must be a string")
    priority = finding.get("priority")
    if priority is not None and (
        isinstance(priority, bool) or not isinstance(priority, int) or not PRIORITY_SECURITY <= priority <= PRIORITY_CLEANUP
    ):
        errors.append(f"{location}.priority must be an integer from 1 through 8")
    return errors


def validate_json_payload(payload: Any) -> list[str]:
    """Validate the generated JSON shape without adding a runtime dependency."""
    errors: list[str] = []
    expected = {"schema", "generated_at", "scope", "states", "repository_count", "repositories", "findings"}
    if not isinstance(payload, dict):
        return ["repo-inventory.json must contain an object"]
    missing = expected - set(payload)
    extra = set(payload) - expected
    if missing:
        errors.append(f"JSON is missing top-level fields: {', '.join(sorted(missing))}")
    if extra:
        errors.append(f"JSON has unexpected top-level fields: {', '.join(sorted(extra))}")
    for field in ("schema", "generated_at", "scope"):
        if field in payload and not isinstance(payload[field], str):
            errors.append(f"JSON field '{field}' must be a string")
    if payload.get("schema") != "tools/repo-audit/schema.json":
        errors.append("JSON schema field must point to tools/repo-audit/schema.json")
    if payload.get("states") != list(STATES):
        errors.append("JSON states must list every supported state in canonical order")
    records = payload.get("repositories")
    findings = payload.get("findings")
    if not isinstance(records, list):
        errors.append("JSON repositories must be an array")
        records = []
    if not isinstance(findings, list):
        errors.append("JSON findings must be an array")
        findings = []
    count = payload.get("repository_count")
    if isinstance(count, bool) or not isinstance(count, int) or count < 0:
        errors.append("JSON repository_count must be a non-negative integer")
    elif count != len(records):
        errors.append("JSON repository_count does not match the number of repositories")
    for index, record in enumerate(records):
        errors.extend(validate_repository_record(record, index))
    for index, finding in enumerate(findings):
        errors.extend(validate_finding(finding, index))
    return errors


def validate_outputs(output_dir: Path) -> list[str]:
    """Check that the CSV and JSON inventories agree and the Mermaid file parses."""
    errors: list[str] = []
    csv_path = output_dir / "repo-inventory.csv"
    json_path = output_dir / "repo-inventory.json"
    mermaid_path = output_dir / "integration-map.mmd"

    for path in (
        csv_path,
        json_path,
        mermaid_path,
        output_dir / "AUDIT-REPORT.md",
        output_dir / "backlog.md",
    ):
        if not path.exists():
            errors.append(f"missing expected output: {path.as_posix()}")
    if errors:
        return errors

    try:
        with csv_path.open(encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            rows = list(reader)
            if reader.fieldnames != CSV_COLUMNS:
                errors.append("CSV columns do not match the canonical inventory columns")
    except (OSError, csv.Error) as error:
        errors.append(f"cannot read repo-inventory.csv: {error}")
        return errors
    try:
        payload = json.loads(json_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        errors.append(f"cannot read repo-inventory.json: {error}")
        return errors
    errors.extend(validate_json_payload(payload))
    records = payload.get("repositories", []) if isinstance(payload, dict) else []
    if not isinstance(records, list):
        return errors

    if len(rows) != len(records):
        errors.append(f"CSV has {len(rows)} records but JSON has {len(records)}")
    if [row.get("repo") for row in rows] != [
        record.get("repo") if isinstance(record, dict) else None for record in records
    ]:
        errors.append("CSV and JSON repository keys differ")

    for row, record in zip(rows, records):
        if not isinstance(record, dict):
            continue
        for column in CSV_COLUMNS:
            if column not in row:
                errors.append(f"CSV is missing column '{column}'")
                continue
            if row[column] != csv_cell(record.get(column)):
                errors.append(f"CSV and JSON disagree for {row.get('repo')} field '{column}'")

    try:
        mermaid = mermaid_path.read_text(encoding="utf-8").strip().splitlines()
    except OSError as error:
        errors.append(f"cannot read integration-map.mmd: {error}")
        return errors
    if not mermaid or not mermaid[0].strip().startswith("flowchart"):
        errors.append("integration-map.mmd must start with a `flowchart` declaration")
    for line_no, line in enumerate(mermaid[1:], start=2):
        stripped = line.strip()
        if not stripped:
            continue
        if not (re.match(r"^[A-Za-z0-9_]+(\[|\(\[)", stripped) or "-->" in stripped):
            errors.append(f"integration-map.mmd:{line_no}: unrecognized Mermaid statement")
    return errors


def resolve_targets(args: argparse.Namespace, client: GitHubClient) -> tuple[list[str], str]:
    if args.org:
        return list_repositories(client, args.org), f"org:{args.org}"
    slugs: list[str] = []
    if args.repos:
        slugs.extend(part.strip() for part in args.repos.split(",") if part.strip())
    if args.repos_file:
        file_path = Path(args.repos_file)
        if not file_path.exists():
            raise GitHubError(f"repository list file not found: {file_path.as_posix()}")
        for line in file_path.read_text(encoding="utf-8").splitlines():
            entry = line.split("#", 1)[0].strip()
            if entry:
                slugs.append(entry)
    if not slugs:
        raise GitHubError("no repositories were resolved from the provided arguments")
    for slug in slugs:
        split_repo(slug)
    return slugs, "repos:" + ",".join(slugs)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="scan.py",
        description="Read-only GitHub repository audit scanner.",
    )
    parser.add_argument("--org", help="Organization or user account to enumerate.")
    parser.add_argument("--repos", help="Comma-separated owner/repo list.")
    parser.add_argument("--repos-file", help="File containing one owner/repo per line.")
    parser.add_argument(
        "--output-dir",
        default="tools/repo-audit/examples",
        help="Directory to write outputs into (default: tools/repo-audit/examples).",
    )
    parser.add_argument(
        "--token-env",
        default=DEFAULT_TOKEN_ENV,
        help=f"Environment variable holding the API token (default: {DEFAULT_TOKEN_ENV}).",
    )
    parser.add_argument("--api-url", default=DEFAULT_API_URL, help="GitHub API base URL.")
    parser.add_argument("--max-repos", type=int, default=0, help="Limit the number of repositories scanned.")
    parser.add_argument(
        "--fixture",
        metavar="FILE",
        help="Replay recorded API responses from FILE instead of calling GitHub.",
    )
    parser.add_argument(
        "--check-outputs",
        metavar="DIR",
        help="Validate CSV and JSON parity plus Mermaid syntax in DIR, then exit.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.check_outputs:
        errors = validate_outputs(Path(args.check_outputs))
        for error in errors:
            print(f"validation error: {error}", file=sys.stderr)
        if errors:
            return EXIT_VALIDATION_FAILED
        print("Output validation passed.")
        return EXIT_OK

    if not (args.org or args.repos or args.repos_file):
        parser.error("one of --org, --repos, --repos-file, or --check-outputs is required")
    if args.org and (args.repos or args.repos_file):
        parser.error("--org cannot be combined with --repos or --repos-file")

    if args.fixture:
        fixture_path = Path(args.fixture)
        if not fixture_path.exists():
            print(f"error: fixture file not found: {fixture_path.as_posix()}", file=sys.stderr)
            return EXIT_COLLECTION_FAILED
        client = GitHubClient(args.api_url, None)
        client.open = FixtureTransport(json.loads(fixture_path.read_text(encoding="utf-8")))
        return run_scan(args, client)

    token = os.environ.get(args.token_env) or None
    if not token:
        print(
            f"warning: no token found in ${args.token_env}; unauthenticated reads are "
            "rate limited and non-public fields are reported as unavailable",
            file=sys.stderr,
        )
    client = GitHubClient(args.api_url, token)
    return run_scan(args, client)


def run_scan(args: argparse.Namespace, client: GitHubClient) -> int:
    """Resolve targets, collect records, and write every output file."""
    try:
        targets, scope = resolve_targets(args, client)
    except (GitHubError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return EXIT_COLLECTION_FAILED

    if args.max_repos > 0:
        targets = targets[: args.max_repos]

    records: list[dict[str, Any]] = []
    findings: list[dict[str, Any]] = []
    for slug in targets:
        try:
            record = collect_repository(client, slug)
        except (GitHubError, ValueError) as error:
            print(f"error: {error}", file=sys.stderr)
            return EXIT_COLLECTION_FAILED
        records.append(record)
        findings.extend(build_findings(record))

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    write_csv(output_dir / "repo-inventory.csv", records)
    write_json(output_dir / "repo-inventory.json", records, findings, scope)
    (output_dir / "integration-map.mmd").write_text(build_mermaid(records), encoding="utf-8")
    write_report(output_dir / "AUDIT-REPORT.md", records, findings, scope)
    write_backlog(output_dir / "backlog.md", findings)

    errors = validate_outputs(output_dir)
    for error in errors:
        print(f"validation error: {error}", file=sys.stderr)
    if errors:
        return EXIT_VALIDATION_FAILED

    print(f"Audited {len(records)} repositories; wrote outputs to {output_dir.as_posix()}.")
    return EXIT_OK


if __name__ == "__main__":
    raise SystemExit(main())
