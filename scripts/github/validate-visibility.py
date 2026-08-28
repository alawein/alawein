#!/usr/bin/env python3
"""Public readiness gate: compare catalog visibility and pins with live GitHub.

Read-only. Never flips visibility or edits pins.

Modes:
  python scripts/github/validate-visibility.py --github-api      # default; needs GITHUB_TOKEN
  python scripts/github/validate-visibility.py --offline         # V4 and V5 only, no network
  python scripts/github/validate-visibility.py --slug qmatsim    # one repo
  python scripts/github/validate-visibility.py --json

Exit codes: 0 clean, 1 findings at error level, 2 usage or API error.

Checks:
  V1 catalog visibility differs from live GitHub (or repo missing)
  V2 catalog public and repo is empty (size 0)
  V3 catalog public and no README on the default branch
  V4 catalog public without a current P0/P1 promotion record
  V5 pinned in profile-from-guides.yaml but not (public and P0)
  V6 catalog public, type research, tooling, or infra, no LICENSE
  V7 live pinned repo is private, archived, empty, or not in catalog
  V8 archived on GitHub but catalog status is not archived (warning)
V4 and V5 downgrade to warning while promotion.grace_until is in the future.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from typing import Any, NamedTuple

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))
from catalog_lib import PUBLIC_TIERS, grace_active, profile_config, promotion_is_current  # noqa: E402

REPOS_JSON = ROOT / "catalog" / "repos.json"
HUB_SLUGS = {"alawein"}
LICENSE_TYPES = {"research", "tooling", "infra"}
OWNER = "alawein"


class Finding(NamedTuple):
    slug: str
    code: str
    level: str
    message: str


class VisibilityError(Exception):
    pass


def _tier(repo: dict[str, Any]) -> str | None:
    promotion = repo.get("promotion")
    return promotion.get("tier") if isinstance(promotion, dict) else None


def _graced(repo: dict[str, Any], today: date) -> bool:
    return grace_active(repo.get("promotion"), today=today)


def _grace_suffix(repo: dict[str, Any]) -> str:
    promotion = repo.get("promotion") or {}
    return f" (grace until {promotion.get('grace_until')})" if promotion.get("grace_until") else ""


def evaluate(
    repos: list[dict[str, Any]],
    profile_pins: list[str],
    live: dict[str, dict[str, Any]] | None,
    live_pins: list[str] | None,
    *,
    today: date,
) -> list[Finding]:
    """Apply V1..V8. `live` None means offline mode (V4 and V5 only)."""
    findings: list[Finding] = []
    by_slug = {r.get("slug"): r for r in repos}
    pins = [str(p).strip() for p in profile_pins]

    for repo in repos:
        slug = str(repo.get("slug") or "<unknown>")
        if repo.get("status") == "archived":
            continue
        catalog_public = repo.get("visibility") == "public"
        graced = _graced(repo, today)
        suffix = _grace_suffix(repo)

        # V4: public needs a current public-tier scan.
        if catalog_public and not promotion_is_current(repo.get("promotion"), today=today):
            level = "warning" if graced else "error"
            findings.append(Finding(slug, "V4", level, f"{slug}: public without a current P0/P1 promotion record{suffix}"))

        # V5: pinned needs public and P0.
        if slug in pins:
            if not catalog_public:
                findings.append(Finding(slug, "V5", "error", f"{slug}: pinned but catalog visibility is not public"))
            elif _tier(repo) != "P0":
                level = "warning" if graced else "error"
                findings.append(Finding(slug, "V5", level, f"{slug}: pinned but tier is {_tier(repo) or 'none'}, not P0{suffix}"))

        if live is None:
            continue
        meta = live.get(slug)
        if not meta or not meta.get("exists", True):
            findings.append(Finding(slug, "V1", "error", f"{slug}: not found on GitHub, or GITHUB_TOKEN cannot see it"))
            continue

        # V1: visibility must agree.
        live_vis = meta.get("visibility")
        catalog_vis = repo.get("visibility")
        if live_vis != catalog_vis:
            findings.append(Finding(slug, "V1", "error", f"{slug}: catalog {catalog_vis}, GitHub {live_vis}"))

        # V8: archived on GitHub but catalog not archived.
        if meta.get("archived"):
            findings.append(Finding(slug, "V8", "warning", f"{slug}: archived on GitHub but catalog status is {repo.get('status')}"))

        if not catalog_public:
            continue
        # V2 / V3 / V6 apply only to public repos; the hub profile repo skips V3 and V6.
        if not meta.get("size"):
            findings.append(Finding(slug, "V2", "error", f"{slug}: public but the repository is empty"))
        if slug not in HUB_SLUGS:
            if not meta.get("has_readme"):
                findings.append(Finding(slug, "V3", "error", f"{slug}: public but no README.md on the default branch"))
            if repo.get("type") in LICENSE_TYPES and not meta.get("has_license"):
                findings.append(Finding(slug, "V6", "error", f"{slug}: public {repo.get('type')} repo without LICENSE"))

    # V7: every live pin must be a public, non-archived, non-empty catalog repo.
    if live is not None:
        for slug in live_pins or []:
            repo = by_slug.get(slug)
            meta = (live or {}).get(slug) or {}
            if repo is None:
                findings.append(Finding(slug, "V7", "error", f"{slug}: live profile pin is not in catalog"))
                continue
            problems = []
            if meta.get("visibility", repo.get("visibility")) != "public":
                problems.append("private")
            if meta.get("archived") or repo.get("status") == "archived":
                problems.append("archived")
            if not meta.get("size", 1):
                problems.append("empty")
            if problems:
                findings.append(Finding(slug, "V7", "error", f"{slug}: live profile pin is {', '.join(problems)}"))

    return findings


def _github_request(path: str, token: str, *, method: str = "GET", body: bytes | None = None) -> tuple[int, bytes]:
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        data=body,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()
    except (urllib.error.URLError, TimeoutError) as exc:
        raise VisibilityError(f"GitHub API request failed for {path}: {exc}") from exc


def _decode_json(body: bytes, context: str) -> Any:
    try:
        return json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError) as exc:
        raise VisibilityError(f"GitHub API returned non-JSON for {context}: {body[:200]!r}") from exc


def live_from_payloads(meta: dict[str, Any] | None, *, readme_status: int, license_status: int) -> dict[str, Any]:
    """Map raw GitHub payloads to the shape evaluate() reads."""
    if meta is None:
        return {"exists": False}
    return {
        "exists": True,
        "visibility": meta.get("visibility"),
        "size": int(meta.get("size") or 0),
        "archived": bool(meta.get("archived")),
        "has_readme": readme_status == 200,
        "has_license": license_status == 200,
    }


def fetch_live(repo_full: str, token: str) -> dict[str, Any]:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(f"/repos/{owner}/{name}", token)
    if status == 404:
        return live_from_payloads(None, readme_status=404, license_status=404)
    if status != 200:
        raise VisibilityError(f"GitHub API {status} for {repo_full}: {body[:200]!r}")
    meta = _decode_json(body, repo_full)
    if not meta.get("size"):
        return live_from_payloads(meta, readme_status=404, license_status=404)
    ref = meta.get("default_branch") or "main"
    readme_status, _ = _github_request(f"/repos/{owner}/{name}/readme?ref={ref}", token)
    license_status, _ = _github_request(f"/repos/{owner}/{name}/contents/LICENSE?ref={ref}", token)
    return live_from_payloads(meta, readme_status=readme_status, license_status=license_status)


def parse_pinned(payload: dict[str, Any]) -> list[str]:
    errors = payload.get("errors")
    if errors:
        raise VisibilityError(f"GitHub GraphQL errors: {errors[:3]!r}")
    nodes = (((payload.get("data") or {}).get("user") or {}).get("pinnedItems") or {}).get("nodes") or []
    return [n["name"] for n in nodes if isinstance(n, dict) and n.get("name")]


def fetch_live_pins(login: str, token: str) -> list[str]:
    query = (
        '{ user(login: "%s") { pinnedItems(first: 6, types: REPOSITORY) '
        "{ nodes { ... on Repository { name } } } } }" % login
    )
    status, body = _github_request("/graphql", token, method="POST", body=json.dumps({"query": query}).encode("utf-8"))
    if status != 200:
        raise VisibilityError(f"GitHub GraphQL {status}: {body[:200]!r}")
    return parse_pinned(_decode_json(body, f"pinned repos for {login}"))


def load_repos(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    repos = data.get("repos")
    if not isinstance(repos, list):
        raise VisibilityError(f"{path}: no 'repos' list")
    return repos


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Public readiness gate: catalog visibility vs live GitHub.")
    parser.add_argument("--repos-json", type=Path, default=REPOS_JSON)
    parser.add_argument("--github-api", action="store_true", help="Compare with live GitHub (default; needs GITHUB_TOKEN).")
    parser.add_argument("--offline", action="store_true", help="Catalog-only checks V4 and V5; no network.")
    parser.add_argument("--slug", type=str, default=None, help="Check one catalog slug.")
    parser.add_argument("--json", action="store_true", help="Emit findings as JSON.")
    parser.add_argument("--today", type=str, default=None, help="ISO date override for freshness math (tests).")
    args = parser.parse_args(argv)

    try:
        repos = load_repos(args.repos_json)
    except (VisibilityError, OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    if args.slug:
        repos = [r for r in repos if r.get("slug") == args.slug]
        if not repos:
            print(f"error: no catalog entry for {args.slug!r}", file=sys.stderr)
            return 2

    try:
        today = date.fromisoformat(args.today) if args.today else date.today()
    except ValueError:
        print(f"error: --today must be an ISO date, got {args.today!r}", file=sys.stderr)
        return 2

    mode = "offline" if args.offline else "github-api"
    token = None
    if mode == "github-api":
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            print("error: GITHUB_TOKEN required for --github-api (use --offline for catalog-only checks)", file=sys.stderr)
            return 2

    pins = [str(p) for p in (profile_config().get("profile_pins") or [])]
    live: dict[str, dict[str, Any]] | None = None
    live_pins: list[str] | None = None
    if mode == "github-api":
        try:
            live = {str(r.get("slug")): fetch_live(str(r.get("repo")), token) for r in repos if r.get("repo")}
            live_pins = fetch_live_pins(OWNER, token) if not args.slug else None
        except VisibilityError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return 2

    findings = evaluate(repos, pins, live, live_pins, today=today)
    errors = [f for f in findings if f.level == "error"]

    if args.json:
        print(json.dumps({"mode": mode, "findings": [f._asdict() for f in findings]}, indent=2))
    else:
        if findings:
            print(f"visibility-gate: {len(errors)} error(s), {len(findings) - len(errors)} warning(s) [mode={mode}]")
            for f in findings:
                print(f"  - [{f.level}] {f.code} {f.message}")
        else:
            print(f"visibility-gate: OK ({len(repos)} catalog entries, mode={mode})")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
