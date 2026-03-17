#!/usr/bin/env python3
"""Audit and enforce workspace Vercel production aliases."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence
from urllib import error, parse, request

VERCEL_API_BASE = "https://api.vercel.com"
VERCEL_APP_SUFFIX = ".vercel.app"
HOST_LABEL_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$")


@dataclass(frozen=True)
class LocalRepo:
    name: str
    path: Path
    originRepo: Optional[str] = None


@dataclass
class AuditRow:
    repo: str
    localDir: Optional[str]
    projectName: str
    projectId: str
    teamId: str
    expectedAlias: Optional[str]
    productionAliases: List[str]
    deploymentId: Optional[str]
    deploymentUrl: Optional[str]
    status: str
    note: str = ""


class VercelAPIError(RuntimeError):
    def __init__(self, message: str, *, status: int, code: Optional[str] = None) -> None:
        super().__init__(message)
        self.status = status
        self.code = code


def parse_args() -> argparse.Namespace:
    default_workspace = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description="Audit local workspace repos against expected Vercel aliases.")
    parser.add_argument(
        "--workspace-root",
        default=str(default_workspace),
        help="Workspace root that contains sibling repositories.",
    )
    parser.add_argument(
        "--team-id",
        action="append",
        help="Specific Vercel team ID to query. Defaults to IDs discovered from local .vercel/project.json files.",
    )
    parser.add_argument(
        "--repo",
        action="append",
        help="Limit to one or more GitHub repo names. Repeatable.",
    )
    parser.add_argument(
        "--token",
        help="Vercel API token. Defaults to $VERCEL_TOKEN or the local Vercel CLI auth file.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Create the expected alias on the current production deployment when it is missing.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit machine-readable JSON instead of a table.",
    )
    return parser.parse_args()


def load_token(explicit_token: Optional[str]) -> str:
    if explicit_token:
        return explicit_token

    env_token = os.environ.get("VERCEL_TOKEN")
    if env_token:
        return env_token

    appdata = os.environ.get("APPDATA")
    if appdata:
        auth_path = Path(appdata) / "com.vercel.cli" / "Data" / "auth.json"
        if auth_path.exists():
            data = json.loads(auth_path.read_text(encoding="utf-8"))
            token = data.get("token")
            if token:
                return token

    raise SystemExit("Unable to resolve a Vercel token. Set VERCEL_TOKEN or log in with the Vercel CLI first.")


def api_request(
    token: str,
    *,
    method: str,
    path: str,
    body: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    url = f"{VERCEL_API_BASE}{path}"
    payload = None if body is None else json.dumps(body).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    if payload is not None:
        headers["Content-Type"] = "application/json"

    req = request.Request(url, data=payload, headers=headers, method=method)
    try:
        with request.urlopen(req) as response:
            content = response.read().decode("utf-8")
            return json.loads(content) if content else {}
    except error.HTTPError as exc:
        raw = exc.read().decode("utf-8")
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {}
        err = parsed.get("error") or {}
        message = err.get("message") or raw or f"HTTP {exc.code}"
        raise VercelAPIError(message, status=exc.code, code=err.get("code")) from exc


def repo_key_candidates(name: str) -> List[str]:
    base = name.strip().lower()
    if not base:
        return []

    keys = [base]
    stripped = base.lstrip("_")
    if stripped and stripped not in keys:
        keys.append(stripped)
    return keys


def resolve_origin_repo_name(repo_path: Path) -> Optional[str]:
    result = subprocess.run(
        ["git", "-C", str(repo_path), "config", "--get", "remote.origin.url"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None

    remote = result.stdout.strip()
    if not remote:
        return None

    match = re.search(r"[:/](?P<name>[^/]+?)(?:\.git)?$", remote)
    if not match:
        return None
    return match.group("name")


def index_local_repos(workspace_root: Path) -> Dict[str, List[LocalRepo]]:
    index: Dict[str, List[LocalRepo]] = {}
    for child in sorted(workspace_root.iterdir(), key=lambda path: path.name.lower()):
        if not child.is_dir():
            continue
        if not (child / ".git").exists():
            continue

        repo = LocalRepo(name=child.name, path=child, originRepo=resolve_origin_repo_name(child))
        candidate_names = [child.name]
        if repo.originRepo:
            candidate_names.append(repo.originRepo)

        seen_keys: set[str] = set()
        for candidate_name in candidate_names:
            for key in repo_key_candidates(candidate_name):
                if key in seen_keys:
                    continue
                seen_keys.add(key)
                index.setdefault(key, []).append(repo)
    return index


def index_local_project_ids(workspace_root: Path) -> Dict[str, LocalRepo]:
    index: Dict[str, LocalRepo] = {}
    for child in sorted(workspace_root.iterdir(), key=lambda path: path.name.lower()):
        project_file = child / ".vercel" / "project.json"
        if not project_file.exists():
            continue
        try:
            payload = json.loads(project_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        project_id = payload.get("projectId")
        if project_id:
            index[str(project_id)] = LocalRepo(
                name=child.name,
                path=child,
                originRepo=resolve_origin_repo_name(child),
            )
    return index


def discover_team_ids(workspace_root: Path) -> List[str]:
    team_ids: List[str] = []
    for child in sorted(workspace_root.iterdir(), key=lambda path: path.name.lower()):
        project_file = child / ".vercel" / "project.json"
        if not project_file.exists():
            continue
        try:
            payload = json.loads(project_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        team_id = payload.get("orgId")
        if team_id and team_id not in team_ids:
            team_ids.append(team_id)
    return team_ids


def list_projects(token: str, team_id: str) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    next_cursor: Optional[Any] = None

    while True:
        path = f"/v9/projects?limit=100&teamId={parse.quote(team_id)}"
        if next_cursor is not None:
            path += f"&until={parse.quote(str(next_cursor))}"

        payload = api_request(token, method="GET", path=path)
        rows.extend(payload.get("projects", []))
        next_cursor = (payload.get("pagination") or {}).get("next")
        if next_cursor is None:
            return rows


def list_aliases(token: str, team_id: str) -> List[Dict[str, Any]]:
    payload = api_request(
        token,
        method="GET",
        path=f"/v2/aliases?limit=200&teamId={parse.quote(team_id)}",
    )
    return [alias for alias in payload.get("aliases", []) if not alias.get("deletedAt")]


def expected_alias(repo_name: str) -> Optional[str]:
    candidate = repo_name.strip().lower()
    if not HOST_LABEL_RE.fullmatch(candidate):
        return None
    return f"{candidate}{VERCEL_APP_SUFFIX}"


def unique_repos(repos: Iterable[LocalRepo]) -> List[LocalRepo]:
    deduped: Dict[str, LocalRepo] = {}
    for repo in repos:
        deduped[str(repo.path)] = repo
    return list(deduped.values())


def match_local_repo(
    project: Dict[str, Any],
    local_index: Dict[str, List[LocalRepo]],
    project_id_index: Dict[str, LocalRepo],
) -> Optional[LocalRepo]:
    project_id = str(project.get("id") or "")
    if project_id and project_id in project_id_index:
        return project_id_index[project_id]

    repo_name = ((project.get("link") or {}).get("repo") or project.get("name") or "").strip()
    if not repo_name:
        return None

    matches: List[LocalRepo] = []
    for key in repo_key_candidates(repo_name):
        matches.extend(local_index.get(key, []))
    unique_matches = unique_repos(matches)
    if len(unique_matches) == 1:
        return unique_matches[0]
    return None


def make_row(
    project: Dict[str, Any],
    team_id: str,
    local_repo: LocalRepo,
    deployment_aliases: Sequence[str],
) -> AuditRow:
    repo_name = (
        (project.get("link") or {}).get("repo")
        or local_repo.originRepo
        or local_repo.name
    ).strip()
    target = (project.get("targets") or {}).get("production") or {}
    alias_expected = expected_alias(repo_name)
    deployment_id = target.get("id")
    deployment_url = target.get("url")
    aliases = list(dict.fromkeys([*(target.get("alias") or []), *deployment_aliases]))

    if alias_expected is None:
        status = "invalid-expected-alias"
        note = "GitHub repo name is not a valid DNS label."
    elif not deployment_id or not deployment_url:
        status = "no-production-target"
        note = "Project has no current production deployment."
    elif alias_expected in aliases:
        status = "compliant"
        note = ""
    else:
        status = "missing-alias"
        note = ""

    return AuditRow(
        repo=repo_name,
        localDir=local_repo.name,
        projectName=str(project.get("name") or ""),
        projectId=str(project.get("id") or ""),
        teamId=team_id,
        expectedAlias=alias_expected,
        productionAliases=aliases,
        deploymentId=deployment_id,
        deploymentUrl=deployment_url,
        status=status,
        note=note,
    )


def create_alias(token: str, row: AuditRow) -> Dict[str, Any]:
    if not row.expectedAlias or not row.deploymentId:
        raise RuntimeError("Alias creation requires an expected alias and production deployment ID.")

    path = (
        f"/v2/now/deployments/{parse.quote(row.deploymentId)}/aliases"
        f"?teamId={parse.quote(row.teamId)}"
    )
    return api_request(token, method="POST", path=path, body={"alias": row.expectedAlias})


def apply_aliases(token: str, rows: Sequence[AuditRow]) -> None:
    for row in rows:
        if row.status != "missing-alias":
            continue
        if not row.expectedAlias:
            continue

        try:
            result = create_alias(token, row)
        except VercelAPIError as exc:
            if exc.code == "alias_in_use":
                row.status = "conflict"
                row.note = exc.args[0]
                continue
            row.status = "apply-failed"
            row.note = f"{exc.code or exc.status}: {exc.args[0]}"
            continue

        if row.expectedAlias not in row.productionAliases:
            row.productionAliases.append(row.expectedAlias)
        row.status = "applied"
        old_deployment = result.get("oldDeploymentId")
        if old_deployment:
            row.note = f"Alias reassigned from {old_deployment}."
        else:
            row.note = "Alias created."


def summarize(rows: Sequence[AuditRow]) -> Dict[str, int]:
    counts: Dict[str, int] = {"total": len(rows)}
    for row in rows:
        counts[row.status] = counts.get(row.status, 0) + 1
    return counts


def render_aliases(aliases: Sequence[str], limit: int = 3) -> str:
    if not aliases:
        return "-"
    shown = list(aliases[:limit])
    suffix = "" if len(aliases) <= limit else f" (+{len(aliases) - limit} more)"
    return ", ".join(shown) + suffix


def print_table(rows: Sequence[AuditRow]) -> None:
    headers = ("repo", "project", "expected", "status", "production aliases")
    table_rows = [
        (
            row.repo,
            row.projectName,
            row.expectedAlias or "-",
            row.status,
            render_aliases(row.productionAliases),
        )
        for row in rows
    ]
    widths = [len(header) for header in headers]
    for table_row in table_rows:
        for idx, value in enumerate(table_row):
            widths[idx] = min(max(widths[idx], len(value)), 64)

    def clip(value: str, width: int) -> str:
        return value if len(value) <= width else value[: width - 1] + "…"

    print(
        "  ".join(header.ljust(widths[idx]) for idx, header in enumerate(headers))
    )
    print(
        "  ".join("-" * widths[idx] for idx in range(len(headers)))
    )
    for table_row in table_rows:
        print(
            "  ".join(clip(value, widths[idx]).ljust(widths[idx]) for idx, value in enumerate(table_row))
        )

    print("")
    counts = summarize(rows)
    summary_parts = [f"{key}={value}" for key, value in sorted(counts.items())]
    print("Summary: " + ", ".join(summary_parts))

    noteworthy = [row for row in rows if row.note]
    if noteworthy:
        print("")
        print("Notes:")
        for row in noteworthy:
            print(f"- {row.repo}: {row.note}")


def parse_repo_filters(values: Optional[Sequence[str]]) -> Optional[set[str]]:
    if not values:
        return None
    return {value.strip().lower() for value in values if value.strip()}


def main() -> int:
    args = parse_args()
    workspace_root = Path(args.workspace_root).resolve()
    if not workspace_root.exists():
        print(f"Workspace root does not exist: {workspace_root}", file=sys.stderr)
        return 1

    token = load_token(args.token)
    local_index = index_local_repos(workspace_root)
    project_id_index = index_local_project_ids(workspace_root)
    team_ids = args.team_id or discover_team_ids(workspace_root)
    if not team_ids:
        print("No Vercel team IDs were discovered from local .vercel/project.json files.", file=sys.stderr)
        return 1

    repo_filters = parse_repo_filters(args.repo)

    rows: List[AuditRow] = []
    seen_project_ids: set[str] = set()
    for team_id in team_ids:
        alias_records = list_aliases(token, team_id)
        aliases_by_deployment: Dict[str, List[str]] = {}
        for alias_record in alias_records:
            deployment_id = str(alias_record.get("deploymentId") or "")
            alias_name = alias_record.get("alias")
            if not deployment_id or not alias_name:
                continue
            aliases_by_deployment.setdefault(deployment_id, []).append(str(alias_name))

        for project in list_projects(token, team_id):
            project_id = str(project.get("id") or "")
            if not project_id or project_id in seen_project_ids:
                continue
            seen_project_ids.add(project_id)

            local_repo = match_local_repo(project, local_index, project_id_index)
            if local_repo is None:
                continue

            repo_name = (
                (project.get("link") or {}).get("repo")
                or local_repo.originRepo
                or local_repo.name
            ).strip().lower()
            if repo_filters and repo_name not in repo_filters:
                continue

            production_deployment_id = str(((project.get("targets") or {}).get("production") or {}).get("id") or "")
            deployment_aliases = aliases_by_deployment.get(production_deployment_id, [])
            rows.append(make_row(project, team_id, local_repo, deployment_aliases))

    rows.sort(key=lambda row: row.repo.lower())

    if args.apply:
        apply_aliases(token, rows)

    if args.json:
        payload = {
            "workspaceRoot": str(workspace_root),
            "teamIds": team_ids,
            "summary": summarize(rows),
            "rows": [asdict(row) for row in rows],
        }
        print(json.dumps(payload, indent=2))
    else:
        print_table(rows)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
