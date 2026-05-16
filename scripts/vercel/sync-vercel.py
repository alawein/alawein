#!/usr/bin/env python3
"""Sync `vercel:` blocks in catalog/repos.json against the live Vercel API.

`catalog/repos.json` is the catalog source of truth; `projects.json` and the
`catalog/generated/*` feeds are derived from it by
`scripts/catalog/build-catalog.py`. This tool rewrites the *synced* fields of
each catalog entry's `vercel:` block, then regenerates the derived outputs so
the catalog stays internally consistent and `build-catalog.py --check` passes.

Modes:
  default     — sync catalog/repos.json, then regenerate derived catalog outputs
  --check     — read-only audit; exit 1 on drift, orphans, or any API failure
  --dry-run   — show the unified diff sync would write; do not write or regenerate

Authenticates via $VERCEL_TOKEN, falling back to the Vercel CLI auth file on
Windows the same way scripts/github/vercel_alias_audit.py:load_token does.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib import error, request
from urllib.request import urlopen  # noqa: F401  re-exported for tests to patch


VERCEL_API_BASE = "https://api.vercel.com"

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_REPOS_JSON = REPO_ROOT / "catalog" / "repos.json"
BUILD_CATALOG = REPO_ROOT / "scripts" / "catalog" / "build-catalog.py"


def _read_cli_auth_token() -> Optional[str]:
    """Fall back to the local Vercel CLI auth file on Windows.

    Mirrors scripts/github/vercel_alias_audit.py:load_token to stay consistent
    across Vercel-touching tools in this repo. Returns None on any failure.
    """
    appdata = os.environ.get("APPDATA")
    if not appdata:
        return None
    auth_path = Path(appdata) / "com.vercel.cli" / "Data" / "auth.json"
    if not auth_path.exists():
        return None
    try:
        data = json.loads(auth_path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    token = data.get("token")
    return token if isinstance(token, str) and token else None


def resolve_token() -> str:
    explicit = os.environ.get("VERCEL_TOKEN")
    if explicit:
        return explicit
    cli = _read_cli_auth_token()
    if cli:
        return cli
    raise SystemExit(
        "Unable to resolve a Vercel token. Set VERCEL_TOKEN or log in with the Vercel CLI first."
    )


class VercelAPIError(RuntimeError):
    def __init__(self, message: str, *, status: int) -> None:
        super().__init__(message)
        self.status = status


def api_request(
    token: str,
    *,
    method: str,
    path: str,
    body: Optional[Dict[str, Any]] = None,
    timeout: float = 30.0,
) -> Dict[str, Any]:
    url = f"{VERCEL_API_BASE}{path}"
    payload = None if body is None else json.dumps(body).encode("utf-8")
    req = request.Request(url=url, method=method, data=payload)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/json")
    if payload is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
    except error.HTTPError as exc:
        raise VercelAPIError(
            f"Vercel API {method} {path} returned {exc.code}",
            status=exc.code,
        ) from exc
    except error.URLError as exc:  # network failure, DNS, timeout
        raise VercelAPIError(
            f"Vercel API {method} {path} failed: {exc.reason}",
            status=0,
        ) from exc
    return json.loads(raw.decode("utf-8")) if raw else {}


def api_request_paginated(
    token: str, *, path: str, items_key: str
) -> List[Dict[str, Any]]:
    """Return every item from a paginated Vercel list endpoint.

    Vercel list endpoints (`/v2/teams`, `/v9/projects`) cap each response and
    return a ``pagination.next`` cursor (a millisecond timestamp) when more
    rows exist. Follow the cursor via ``&until=`` until it is null so large
    teams are never silently truncated. A defensive page cap guards against a
    malformed cursor that never terminates.
    """
    items: List[Dict[str, Any]] = []
    until: Optional[Any] = None
    sep = "&" if "?" in path else "?"
    for _ in range(1000):  # defensive: no real account paginates this far
        page_path = path if until is None else f"{path}{sep}until={until}"
        resp = api_request(token, method="GET", path=page_path)
        page = resp.get(items_key) or []
        items.extend(item for item in page if isinstance(item, dict))
        nxt = (resp.get("pagination") or {}).get("next")
        if not nxt:
            return items
        until = nxt
    raise VercelAPIError(
        f"Vercel API {path} pagination did not terminate after 1000 pages",
        status=0,
    )


VERCEL_STALE_DAYS = int(os.environ.get("VERCEL_STALE_DAYS", "30"))
VERCEL_APP_SUFFIX = ".vercel.app"


@dataclass(frozen=True)
class EntryState:
    state: str
    production_url: Optional[str]
    custom_domain: Optional[str]


def _extract_custom_domain(aliases: Any) -> Optional[str]:
    if not isinstance(aliases, list):
        return None
    for alias in aliases:
        if isinstance(alias, dict):
            domain = alias.get("domain")
        else:
            domain = alias
        if isinstance(domain, str) and not domain.endswith(VERCEL_APP_SUFFIX):
            return domain
    return None


def compute_entry_state(
    *, token: str, team_id: str, team_slug: str, project_slug: str
) -> EntryState:
    """Fetch project + latest production deployment; compute (state, urls).

    Returns an EntryState. A 404 on the project becomes ``state="missing"``;
    any other API error propagates as VercelAPIError for the caller to handle.
    """
    try:
        project = api_request(
            token, method="GET",
            path=f"/v9/projects/{project_slug}?teamId={team_id}",
        )
    except VercelAPIError as exc:
        if exc.status == 404:
            return EntryState(state="missing", production_url=None, custom_domain=None)
        raise

    custom_domain = _extract_custom_domain(project.get("alias"))

    deployments_resp = api_request(
        token, method="GET",
        path=f"/v6/deployments?projectId={project['id']}&target=production&limit=1&teamId={team_id}",
    )
    deployments = deployments_resp.get("deployments") or []
    if not deployments:
        return EntryState(
            state="preview-only", production_url=None, custom_domain=custom_domain,
        )

    latest = deployments[0]
    created_ms = latest.get("createdAt")
    if not isinstance(created_ms, (int, float)):
        return EntryState(
            state="preview-only", production_url=None, custom_domain=custom_domain,
        )
    created = datetime.fromtimestamp(created_ms / 1000, tz=timezone.utc)
    age_days = (datetime.now(timezone.utc) - created).days
    state = "production" if age_days < VERCEL_STALE_DAYS else "stale"

    url = latest.get("url")
    production_url = f"https://{url}" if isinstance(url, str) and url else None
    return EntryState(
        state=state, production_url=production_url, custom_domain=custom_domain,
    )


@dataclass(frozen=True)
class Orphan:
    team_slug: str
    project_slug: str
    dashboard_url: str


def load_team_id_map(token: str) -> Dict[str, str]:
    """Return {team_slug: team_id} for every team the token can see.

    Fully paginated — a token that can reach more teams than one API page
    holds is enumerated in full, not truncated.
    """
    teams = api_request_paginated(token, path="/v2/teams?limit=100", items_key="teams")
    return {
        team["slug"]: team["id"]
        for team in teams
        if team.get("slug") and team.get("id")
    }


def find_orphans(
    *, token: str, team_id: str, team_slug: str, claimed_slugs: set[str]
) -> list[Orphan]:
    """Return Vercel projects in this team that no catalog entry claims.

    Fully paginated — teams with more projects than one API page holds are
    enumerated in full, so no orphan is silently dropped.
    """
    projects = api_request_paginated(
        token, path=f"/v9/projects?teamId={team_id}&limit=100", items_key="projects",
    )
    orphans: list[Orphan] = []
    for proj in projects:
        slug = proj.get("name") or proj.get("id")
        if not isinstance(slug, str):
            continue
        if slug in claimed_slugs:
            continue
        orphans.append(
            Orphan(
                team_slug=team_slug,
                project_slug=slug,
                dashboard_url=f"https://vercel.com/{team_slug}/{slug}",
            )
        )
    return orphans


VERCEL_FIELD_ORDER = (
    "team_slug",
    "project_slug",
    "production_url",
    "custom_domain",
    "state",
    "last_synced_at",
)

SYNCED_FIELDS = ("state", "production_url", "custom_domain")


def _reorder_vercel_block(block: Dict[str, Any]) -> Dict[str, Any]:
    """Return a new dict with the vercel sub-keys in the pinned order.

    Unknown keys (none expected, but defensive) are appended after the known
    ones to surface them via diff rather than dropping them.
    """
    ordered: Dict[str, Any] = {}
    for key in VERCEL_FIELD_ORDER:
        if key in block:
            ordered[key] = block[key]
    for key, value in block.items():
        if key not in ordered:
            ordered[key] = value
    return ordered


def iter_vercel_repos(data: Dict[str, Any]):
    """Yield (repo_entry, vercel_block) for every catalog repo with a block."""
    for entry in data.get("repos") or []:
        if not isinstance(entry, dict):
            continue
        block = entry.get("vercel")
        if isinstance(block, dict):
            yield entry, block


def dump_repos_json(data: Dict[str, Any], dest: Any) -> None:
    """Serialize catalog/repos.json.

    Uses ``ensure_ascii=False`` to match the existing catalog/repos.json
    convention (raw UTF-8, no \\uXXXX escapes); 2-space indent, insertion
    order preserved.
    """
    json.dump(data, dest, indent=2, sort_keys=False, ensure_ascii=False)
    dest.write("\n")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sync catalog/repos.json vercel: blocks against the live Vercel API.",
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true",
                     help="Audit mode — exit 1 on any drift; never writes.")
    mode.add_argument("--dry-run", action="store_true",
                     help="Show unified diff; do not write or regenerate.")
    parser.add_argument(
        "--repos-json",
        default=str(DEFAULT_REPOS_JSON),
        help="Path to catalog/repos.json (defaults to the repo's catalog).",
    )
    return parser.parse_args(argv)


def _gather_claimed(data: Dict[str, Any]) -> Dict[str, set[str]]:
    """Return {team_slug: {project_slug, ...}} from current vercel: blocks."""
    out: Dict[str, set[str]] = {}
    for _entry, block in iter_vercel_repos(data):
        t, p = block.get("team_slug"), block.get("project_slug")
        if isinstance(t, str) and isinstance(p, str):
            out.setdefault(t, set()).add(p)
    return out


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _synced_block(block: Dict[str, Any], state: EntryState, *, stamp: str) -> Dict[str, Any]:
    """Return the vercel block with synced fields applied, in pinned order."""
    new_block = dict(block)
    new_block["state"] = state.state
    new_block["production_url"] = state.production_url
    new_block["custom_domain"] = state.custom_domain
    new_block["last_synced_at"] = stamp
    return _reorder_vercel_block(new_block)


def regenerate_catalog() -> int:
    """Run build-catalog.py so projects.json and the feeds follow repos.json."""
    result = subprocess.run(
        [sys.executable, str(BUILD_CATALOG)],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.stdout:
        sys.stdout.write(result.stdout)
    if result.returncode != 0:
        sys.stderr.write(result.stderr or "")
        print("[sync-vercel] ERROR: build-catalog.py failed; catalog not regenerated.",
              file=sys.stderr)
    return result.returncode


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    repos_path = Path(args.repos_json)
    data = json.loads(repos_path.read_text(encoding="utf-8"))

    token = resolve_token()

    # Enumerate teams. A failure here is fatal: an empty team map would make
    # every project look like an orphan and every block unsyncable, which must
    # never be reported as a clean run.
    try:
        team_ids = load_team_id_map(token)
    except VercelAPIError as exc:
        print(f"[sync-vercel] ERROR: cannot enumerate Vercel teams: {exc}",
              file=sys.stderr)
        return 1
    if not team_ids:
        print("[sync-vercel] ERROR: the token sees zero Vercel teams; aborting.",
              file=sys.stderr)
        return 1

    claimed = _gather_claimed(data)
    stamp = _now_iso()

    # Compute fresh state for every catalog vercel block.
    failures: List[Tuple[str, str]] = []   # (repo_slug, reason)
    computed: List[Tuple[Dict[str, Any], Dict[str, Any]]] = []  # (entry, new_block)
    for entry, block in iter_vercel_repos(data):
        repo_slug = entry.get("slug") or entry.get("repo") or "<unknown>"
        team_slug = block.get("team_slug")
        project_slug = block.get("project_slug")
        if not isinstance(team_slug, str) or not isinstance(project_slug, str):
            failures.append((repo_slug, "vercel block missing team_slug/project_slug"))
            continue
        if team_slug not in team_ids:
            failures.append((repo_slug, f"team {team_slug!r} not visible to this token"))
            continue
        try:
            state = compute_entry_state(
                token=token, team_id=team_ids[team_slug],
                team_slug=team_slug, project_slug=project_slug,
            )
        except VercelAPIError as exc:
            failures.append((repo_slug, f"Vercel API error: {exc}"))
            continue
        computed.append((entry, _synced_block(block, state, stamp=stamp)))

    # Orphans across every reachable team.
    all_orphans: list[Orphan] = []
    try:
        for team_slug, team_id in team_ids.items():
            orphans = find_orphans(
                token=token, team_id=team_id, team_slug=team_slug,
                claimed_slugs=claimed.get(team_slug, set()),
            )
            for o in orphans:
                print(
                    f"ORPHAN team={o.team_slug} project={o.project_slug} url={o.dashboard_url}",
                    file=sys.stderr,
                )
            all_orphans.extend(orphans)
    except VercelAPIError as exc:
        print(f"[sync-vercel] ERROR: orphan enumeration failed: {exc}", file=sys.stderr)
        return 1

    for repo_slug, reason in failures:
        print(f"[sync-vercel] FAILURE repo={repo_slug}: {reason}", file=sys.stderr)

    if args.check:
        # Audit: recompute against the live API and compare to the stored
        # block. Drift, an orphan, or any failure all fail the check — a
        # transient API error must never read as "clean".
        rc = 0
        if failures:
            rc = 1
        if all_orphans:
            rc = 1
        for entry, new_block in computed:
            old_block = entry.get("vercel") or {}
            for field in SYNCED_FIELDS:
                if old_block.get(field) != new_block.get(field):
                    print(
                        f"DRIFT repo={entry.get('slug')} field={field} "
                        f"stored={old_block.get(field)!r} live={new_block.get(field)!r}",
                        file=sys.stderr,
                    )
                    rc = 1
            if new_block.get("state") == "missing":
                rc = 1
        return rc

    # Default / dry-run: a failure means the sync is incomplete. Never write a
    # partial result that looks authoritative; surface the failure and stop.
    if failures:
        print("[sync-vercel] ERROR: sync incomplete; not writing. Resolve the "
              "failures above and re-run.", file=sys.stderr)
        return 1

    for entry, new_block in computed:
        entry["vercel"] = new_block

    buf = io.StringIO()
    dump_repos_json(data, buf)
    new_content = buf.getvalue()
    existing = repos_path.read_text(encoding="utf-8")

    if new_content == existing:
        print("[sync-vercel] catalog/repos.json already in sync.")
        return 0

    if args.dry_run:
        import difflib
        diff = difflib.unified_diff(
            existing.splitlines(keepends=True),
            new_content.splitlines(keepends=True),
            fromfile=str(repos_path), tofile=f"{repos_path} (new)",
        )
        sys.stdout.writelines(diff)
        return 0

    repos_path.write_text(new_content, encoding="utf-8")
    print(f"[sync-vercel] wrote {repos_path}")
    return regenerate_catalog()


if __name__ == "__main__":
    sys.exit(main())
