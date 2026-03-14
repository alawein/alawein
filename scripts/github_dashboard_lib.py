#!/usr/bin/env python3
"""Library for generating a static GitHub portfolio dashboard."""

from __future__ import annotations

import json
import re
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple
from urllib import error, request

GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
ACTIVITY_MONTH_COUNT = 6

ROADMAP_TAGS = ("roadmap-active", "roadmap-planned", "roadmap-complete")
ROADMAP_LABELS = {
    "roadmap-active": "Active",
    "roadmap-planned": "Planned",
    "roadmap-complete": "Complete",
}
ATTENTION_THRESHOLDS = {
    "stale_activity_days": 90,
    "stale_release_days": 180,
    "issue_backlog": 25,
    "pull_request_queue": 10,
}

DASHBOARD_QUERY = """
query GitHubOwnerDashboard($owner: String!, $after: String) {
  rateLimit {
    cost
    remaining
    resetAt
  }
  repositoryOwner(login: $owner) {
    login
    ... on User {
      repositories(
        first: 100
        after: $after
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          nameWithOwner
          url
          description
          isArchived
          isTemplate
          stargazerCount
          pushedAt
          homepageUrl
          visibility
          primaryLanguage {
            name
            color
          }
          languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          issues(states: OPEN) {
            totalCount
          }
          pullRequests(states: OPEN) {
            totalCount
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
          }
          defaultBranchRef {
            name
          }
          licenseInfo {
            name
            spdxId
          }
          latestRelease {
            name
            tagName
            url
            description
            publishedAt
            isDraft
            isPrerelease
          }
          releases(first: 3, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              name
              tagName
              url
              description
              publishedAt
              isDraft
              isPrerelease
            }
          }
        }
      }
    }
    ... on Organization {
      repositories(
        first: 100
        after: $after
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          nameWithOwner
          url
          description
          isArchived
          isTemplate
          stargazerCount
          pushedAt
          homepageUrl
          visibility
          primaryLanguage {
            name
            color
          }
          languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          issues(states: OPEN) {
            totalCount
          }
          pullRequests(states: OPEN) {
            totalCount
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
          }
          defaultBranchRef {
            name
          }
          licenseInfo {
            name
            spdxId
          }
          latestRelease {
            name
            tagName
            url
            description
            publishedAt
            isDraft
            isPrerelease
          }
          releases(first: 3, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              name
              tagName
              url
              description
              publishedAt
              isDraft
              isPrerelease
            }
          }
        }
      }
    }
  }
}
"""


def utc_now() -> datetime:
    return datetime.now(UTC)


def iso_now() -> str:
    return utc_now().isoformat().replace("+00:00", "Z")


def date_now() -> str:
    return utc_now().strftime("%Y-%m-%d")


def make_scope_key(owners: Sequence[str]) -> str:
    cleaned = [re.sub(r"[^a-z0-9_-]", "-", owner.strip().lower()) for owner in owners if owner.strip()]
    return "__".join(cleaned)


def snapshot_id_now() -> str:
    return utc_now().strftime("%Y%m%dT%H%M%SZ")


def parse_roadmap_tag(topics: Sequence[str]) -> Tuple[Optional[str], Optional[str]]:
    for topic in topics:
        normalized = topic.strip().lower()
        suffix = normalized.replace("roadmap-", "").replace("roadmap_", "").replace("status-", "").replace("status_", "")

        if suffix in {"active", "in-progress", "in_progress", "current"}:
            return "roadmap-active", topic
        if suffix in {"planned", "next", "backlog", "queued"}:
            return "roadmap-planned", topic
        if suffix in {"complete", "completed", "done", "shipped"}:
            return "roadmap-complete", topic

    return None, None


def resolve_category(topics: Sequence[str]) -> str:
    for topic in topics:
        if parse_roadmap_tag([topic])[0] is None:
            return topic
    return topics[0] if topics else "uncategorized"


def normalize_visibility(value: str) -> str:
    return (value or "unknown").lower()


def normalize_release(release_node: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not release_node or release_node.get("isDraft"):
        return None
    return {
        "name": release_node.get("name"),
        "tagName": release_node.get("tagName"),
        "url": release_node.get("url"),
        "description": release_node.get("description"),
        "publishedAt": release_node.get("publishedAt"),
        "isPrerelease": bool(release_node.get("isPrerelease")),
    }


def normalize_repo(node: Dict[str, Any], scope_owner: str) -> Dict[str, Any]:
    topics = [entry["topic"]["name"] for entry in node.get("repositoryTopics", {}).get("nodes", []) if entry.get("topic")]
    roadmap_tag, roadmap_source = parse_roadmap_tag(topics)

    status = "active"
    if node.get("isArchived"):
        status = "archived"
    elif node.get("isTemplate"):
        status = "template"

    recent_releases = [
        rel
        for rel in (
            normalize_release(release)
            for release in node.get("releases", {}).get("nodes", [])
        )
        if rel
    ]

    latest_release = normalize_release(node.get("latestRelease"))
    if latest_release and all(latest_release["tagName"] != rel["tagName"] for rel in recent_releases):
        recent_releases.insert(0, latest_release)
    recent_releases = recent_releases[:3]

    owner_login = node.get("nameWithOwner", "").split("/")[0] if node.get("nameWithOwner") else scope_owner
    return {
        "id": node.get("id"),
        "name": node.get("name"),
        "nameWithOwner": node.get("nameWithOwner"),
        "scopeOwner": scope_owner,
        "ownerLogin": owner_login,
        "url": node.get("url"),
        "description": node.get("description"),
        "topics": topics,
        "category": resolve_category(topics),
        "status": status,
        "stars": int(node.get("stargazerCount") or 0),
        "openIssues": int(node.get("issues", {}).get("totalCount") or 0),
        "openPullRequests": int(node.get("pullRequests", {}).get("totalCount") or 0),
        "lastPush": node.get("pushedAt"),
        "roadmapTag": roadmap_tag,
        "roadmapTopicSource": roadmap_source,
        "primaryLanguage": (node.get("primaryLanguage") or {}).get("name"),
        "languages": [
            {
                "name": edge.get("node", {}).get("name"),
                "color": edge.get("node", {}).get("color"),
                "size": int(edge.get("size") or 0),
            }
            for edge in node.get("languages", {}).get("edges", [])
            if edge.get("node", {}).get("name")
        ],
        "defaultBranch": (node.get("defaultBranchRef") or {}).get("name"),
        "license": (
            {
                "name": node["licenseInfo"].get("name"),
                "spdxId": node["licenseInfo"].get("spdxId"),
            }
            if node.get("licenseInfo")
            else None
        ),
        "latestRelease": latest_release,
        "recentReleases": recent_releases,
        "visibility": normalize_visibility(node.get("visibility", "unknown")),
        "homepageUrl": node.get("homepageUrl"),
    }


def _aggregate_counts(values: Iterable[str]) -> List[Dict[str, Any]]:
    counts: Dict[str, int] = {}
    for value in values:
        if not value:
            continue
        counts[value] = counts.get(value, 0) + 1
    return [
        {"name": key, "count": count}
        for key, count in sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    ]


def build_language_breakdown(repos: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows = _aggregate_counts(repo.get("primaryLanguage") for repo in repos if repo.get("primaryLanguage"))
    return [{"language": row["name"], "count": row["count"]} for row in rows]


def build_topic_breakdown(repos: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    topics: List[str] = []
    for repo in repos:
        for topic in repo.get("topics", []):
            if parse_roadmap_tag([topic])[0]:
                continue
            topics.append(topic)
    rows = _aggregate_counts(topics)
    return [{"topic": row["name"], "count": row["count"]} for row in rows]


def build_license_breakdown(repos: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    names = [
        (repo.get("license") or {}).get("spdxId")
        or (repo.get("license") or {}).get("name")
        or "Unknown"
        for repo in repos
    ]
    rows = _aggregate_counts(names)
    return [{"license": row["name"], "count": row["count"]} for row in rows]


def build_recent_activity(repos: Sequence[Dict[str, Any]], month_count: int = ACTIVITY_MONTH_COUNT) -> List[Dict[str, Any]]:
    now = utc_now()
    buckets: List[Dict[str, Any]] = []
    for idx in range(month_count):
        date_ref = datetime(now.year, now.month, 1, tzinfo=UTC)
        month_shift = month_count - idx - 1
        year = date_ref.year
        month = date_ref.month - month_shift
        while month <= 0:
            month += 12
            year -= 1
        month_start = datetime(year, month, 1, tzinfo=UTC)
        buckets.append(
            {
                "key": f"{month_start.year}-{month_start.month}",
                "month": month_start.strftime("%b"),
                "count": 0,
            }
        )

    key_to_idx = {bucket["key"]: idx for idx, bucket in enumerate(buckets)}
    for repo in repos:
        last_push = repo.get("lastPush")
        if not last_push:
            continue
        push_dt = datetime.fromisoformat(last_push.replace("Z", "+00:00"))
        key = f"{push_dt.year}-{push_dt.month}"
        if key in key_to_idx:
            buckets[key_to_idx[key]]["count"] += 1

    return [{"month": bucket["month"], "count": bucket["count"]} for bucket in buckets]


def build_roadmap_groups(repos: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    groups: List[Dict[str, Any]] = []
    for roadmap_tag in ROADMAP_TAGS:
        rows = [
            {"id": repo["id"], "name": repo["name"], "nameWithOwner": repo["nameWithOwner"]}
            for repo in repos
            if repo.get("roadmapTag") == roadmap_tag
        ]
        groups.append({"tag": roadmap_tag, "label": ROADMAP_LABELS[roadmap_tag], "repos": rows})
    return groups


def attention_flags(repo: Dict[str, Any], now: Optional[datetime] = None) -> List[Dict[str, Any]]:
    now = now or utc_now()
    flags: List[Dict[str, Any]] = []

    last_push = repo.get("lastPush")
    if repo.get("status") == "active" and last_push:
        pushed_dt = datetime.fromisoformat(last_push.replace("Z", "+00:00"))
        age_days = int((now - pushed_dt).total_seconds() / 86400)
        if age_days >= ATTENTION_THRESHOLDS["stale_activity_days"]:
            flags.append({"label": "Inactive 90+d", "severity": "warning", "score": 3})

    latest_release = repo.get("latestRelease")
    if not latest_release:
        flags.append({"label": "No releases", "severity": "default", "score": 2})
    elif latest_release.get("publishedAt"):
        rel_dt = datetime.fromisoformat(latest_release["publishedAt"].replace("Z", "+00:00"))
        rel_age = int((now - rel_dt).total_seconds() / 86400)
        if rel_age >= ATTENTION_THRESHOLDS["stale_release_days"]:
            flags.append({"label": "Release stale", "severity": "default", "score": 2})

    if not repo.get("license"):
        flags.append({"label": "Missing license", "severity": "warning", "score": 3})
    if repo.get("roadmapTag") is None:
        flags.append({"label": "No roadmap tag", "severity": "muted", "score": 1})
    if not repo.get("topics"):
        flags.append({"label": "No topics", "severity": "muted", "score": 1})
    if int(repo.get("openIssues") or 0) >= ATTENTION_THRESHOLDS["issue_backlog"]:
        flags.append({"label": "Issue backlog", "severity": "warning", "score": 2})
    if int(repo.get("openPullRequests") or 0) >= ATTENTION_THRESHOLDS["pull_request_queue"]:
        flags.append({"label": "PR queue", "severity": "default", "score": 1})
    return flags


def attention_level(score: int) -> str:
    if score >= 6:
        return "high"
    if score >= 3:
        return "medium"
    if score > 0:
        return "low"
    return "healthy"


def build_attention(repos: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
    rows: List[Dict[str, Any]] = []
    summary = {"healthy": 0, "low": 0, "medium": 0, "high": 0}
    for repo in repos:
        flags = attention_flags(repo)
        score = sum(flag["score"] for flag in flags)
        level = attention_level(score)
        summary[level] += 1
        rows.append(
            {
                "id": repo["id"],
                "name": repo["name"],
                "nameWithOwner": repo["nameWithOwner"],
                "score": score,
                "level": level,
                "flags": flags,
            }
        )

    rows.sort(key=lambda row: (-row["score"], row["name"].lower()))
    return {"summary": summary, "repos": rows}


def build_kpis(repos: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
    thirty_days_ago = utc_now().timestamp() - (30 * 24 * 60 * 60)
    return {
        "totalRepos": len(repos),
        "openIssues": sum(int(repo.get("openIssues") or 0) for repo in repos),
        "openPullRequests": sum(int(repo.get("openPullRequests") or 0) for repo in repos),
        "totalStars": sum(int(repo.get("stars") or 0) for repo in repos),
        "reposWithLatestRelease": sum(1 for repo in repos if repo.get("latestRelease")),
        "reposWithLicense": sum(1 for repo in repos if repo.get("license")),
        "pushedLast30Days": sum(
            1
            for repo in repos
            if repo.get("lastPush")
            and datetime.fromisoformat(repo["lastPush"].replace("Z", "+00:00")).timestamp() >= thirty_days_ago
        ),
        "statusCounts": {
            "active": sum(1 for repo in repos if repo.get("status") == "active"),
            "archived": sum(1 for repo in repos if repo.get("status") == "archived"),
            "template": sum(1 for repo in repos if repo.get("status") == "template"),
        },
        "roadmapCounts": {
            "active": sum(1 for repo in repos if repo.get("roadmapTag") == "roadmap-active"),
            "planned": sum(1 for repo in repos if repo.get("roadmapTag") == "roadmap-planned"),
            "complete": sum(1 for repo in repos if repo.get("roadmapTag") == "roadmap-complete"),
            "untagged": sum(1 for repo in repos if repo.get("roadmapTag") is None),
        },
    }


def compute_deltas(current_kpis: Dict[str, Any], previous_kpis: Optional[Dict[str, Any]]) -> Dict[str, int]:
    previous_kpis = previous_kpis or {}
    keys = (
        "totalRepos",
        "openIssues",
        "openPullRequests",
        "totalStars",
        "reposWithLatestRelease",
        "reposWithLicense",
        "pushedLast30Days",
    )
    return {
        key: int(current_kpis.get(key) or 0) - int(previous_kpis.get(key) or 0)
        for key in keys
    }


def flatten_recent_releases(repos: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for repo in repos:
        for release in repo.get("recentReleases", []):
            rows.append(
                {
                    "repoId": repo["id"],
                    "repoName": repo["name"],
                    "nameWithOwner": repo["nameWithOwner"],
                    "repoUrl": repo["url"],
                    "scopeOwner": repo["scopeOwner"],
                    **release,
                }
            )
    rows.sort(
        key=lambda row: datetime.fromisoformat((row.get("publishedAt") or "1970-01-01T00:00:00Z").replace("Z", "+00:00")),
        reverse=True,
    )
    return rows[:20]


def build_breakdowns(repos: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
    return {
        "languages": build_language_breakdown(repos),
        "topics": build_topic_breakdown(repos),
        "licenses": build_license_breakdown(repos),
        "recentActivity": build_recent_activity(repos),
        "roadmapGroups": build_roadmap_groups(repos),
    }


def _payload_header(payload: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "generatedAt": payload["generatedAt"],
        "owners": payload["owners"],
        "cacheStatus": payload["cacheStatus"],
        "rateLimit": payload.get("rateLimit"),
    }


def build_payload(
    owners: Sequence[str],
    repos: Sequence[Dict[str, Any]],
    cache_status: str,
    rate_limit: Optional[Dict[str, Any]],
    previous_payload: Optional[Dict[str, Any]],
    current_snapshot_id: str,
    history_depth: int,
    generated_at: Optional[str] = None,
) -> Dict[str, Any]:
    repos_sorted = sorted(repos, key=lambda repo: (-repo["stars"], repo["name"].lower()))
    kpis = build_kpis(repos_sorted)
    previous_kpis = (previous_payload or {}).get("kpis")
    snapshot_previous_id = (previous_payload or {}).get("snapshot", {}).get("currentId")
    payload = {
        **_payload_header(
            {
                "generatedAt": iso_now(),
                "owners": list(owners),
                "cacheStatus": cache_status,
                "rateLimit": rate_limit,
            }
        ),
        "kpis": kpis,
        "repos": repos_sorted,
        "breakdowns": build_breakdowns(repos_sorted),
        "recentReleases": flatten_recent_releases(repos_sorted),
        "attention": build_attention(repos_sorted),
        "snapshot": {
            "currentId": current_snapshot_id,
            "previousId": snapshot_previous_id,
            "deltas": compute_deltas(kpis, previous_kpis),
            "historyDepth": history_depth,
        },
    }
    if generated_at:
        payload["generatedAt"] = generated_at
    return payload


def to_json_text(data: Dict[str, Any]) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def _safe_release_date(value: Optional[str]) -> str:
    if not value:
        return "n/a"
    return value.split("T")[0]


def render_markdown(payload: Dict[str, Any]) -> str:
    kpis = payload["kpis"]
    attention = payload["attention"]["summary"]
    releases = payload["recentReleases"][:10]
    changed_repos = [row for row in payload["attention"]["repos"] if row["score"] > 0][:10]
    lines = [
        "---",
        "title: GitHub Dashboard Snapshot",
        "description: Generated portfolio dashboard summary for GitHub repositories.",
        f"last_updated: {date_now()}",
        "category: dashboard",
        "audience: [maintainers, contributors]",
        "status: active",
        "author: dashboard-generator",
        "version: 1.0.0",
        "tags: [github, dashboard, portfolio, operations]",
        "---",
        "",
        "# GitHub Repository Dashboard",
        "",
        f"- Generated at: `{payload['generatedAt']}`",
        f"- Owners: `{', '.join(payload['owners'])}`",
        f"- Data status: `{payload['cacheStatus']}`",
        f"- Snapshot: `{payload['snapshot']['currentId']}`",
        f"- Previous snapshot: `{payload['snapshot']['previousId'] or 'none'}`",
        "",
        "## Portfolio KPIs",
        "",
        "| Metric | Value | Delta |",
        "| --- | ---: | ---: |",
        f"| Total repositories | {kpis['totalRepos']} | {payload['snapshot']['deltas']['totalRepos']} |",
        f"| Open issues | {kpis['openIssues']} | {payload['snapshot']['deltas']['openIssues']} |",
        f"| Open pull requests | {kpis['openPullRequests']} | {payload['snapshot']['deltas']['openPullRequests']} |",
        f"| Total stars | {kpis['totalStars']} | {payload['snapshot']['deltas']['totalStars']} |",
        f"| Repositories with releases | {kpis['reposWithLatestRelease']} | {payload['snapshot']['deltas']['reposWithLatestRelease']} |",
        f"| License coverage | {kpis['reposWithLicense']} | {payload['snapshot']['deltas']['reposWithLicense']} |",
        f"| Updated within 30 days | {kpis['pushedLast30Days']} | {payload['snapshot']['deltas']['pushedLast30Days']} |",
        "",
        "## Attention Summary",
        "",
        f"- Healthy: `{attention['healthy']}`",
        f"- Low attention: `{attention['low']}`",
        f"- Medium attention: `{attention['medium']}`",
        f"- High attention: `{attention['high']}`",
        "",
        "## Recent Releases",
        "",
    ]

    if releases:
        lines.extend(["| Repository | Release | Date |", "| --- | --- | --- |"])
        for row in releases:
            lines.append(
                f"| `{row['nameWithOwner']}` | [`{row['tagName']}`]({row['url']}) | {_safe_release_date(row.get('publishedAt'))} |"
            )
    else:
        lines.append("- No releases found.")

    lines.extend(["", "## Repositories Needing Attention", ""])
    if changed_repos:
        lines.extend(["| Repository | Level | Score | Flags |", "| --- | --- | ---: | --- |"])
        for row in changed_repos:
            flag_labels = ", ".join(flag["label"] for flag in row["flags"]) or "none"
            lines.append(f"| `{row['nameWithOwner']}` | {row['level']} | {row['score']} | {flag_labels} |")
    else:
        lines.append("- No repositories currently match attention rules.")

    return "\n".join(lines) + "\n"


def render_html() -> str:
    return """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>GitHub Repository Dashboard</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="page">
      <header class="hero">
        <h1>GitHub Repository Dashboard</h1>
        <p id="meta">Loading dashboard data...</p>
      </header>
      <section class="cards" id="kpi-cards"></section>
      <section class="panel">
        <h2>Recent Releases</h2>
        <div id="recent-releases" class="stack"></div>
      </section>
      <section class="panel">
        <h2>Needs Attention</h2>
        <div id="attention-repos" class="stack"></div>
      </section>
      <section class="panel">
        <h2>Repository Breakdown</h2>
        <div class="table-wrap">
          <table id="repo-table">
            <thead>
              <tr>
                <th>Repo</th>
                <th>Status</th>
                <th>Stars</th>
                <th>Issues</th>
                <th>PRs</th>
                <th>Last Push</th>
                <th>Roadmap</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>
    </main>
    <script src="./app.js" defer></script>
  </body>
</html>
"""


def render_css() -> str:
    return """:root {
  --bg: #f5f6f8;
  --surface: #ffffff;
  --text: #1f2937;
  --muted: #6b7280;
  --line: #d1d5db;
  --accent: #0f766e;
  --warn: #b45309;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", "Inter", sans-serif;
  color: var(--text);
  background: radial-gradient(circle at top left, #e7f5f3, var(--bg));
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 16px;
}

.hero {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 20px;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 1.75rem;
}

.hero p {
  margin: 0;
  color: var(--muted);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
}

.card .label {
  color: var(--muted);
  font-size: 0.8rem;
}

.card .value {
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 4px;
}

.card .delta {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.85rem;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
}

.panel h2 {
  margin: 0 0 12px;
}

.stack {
  display: grid;
  gap: 10px;
}

.row {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 4px;
}

.muted {
  color: var(--muted);
  font-size: 0.9rem;
}

.warn {
  color: var(--warn);
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  border-bottom: 1px solid var(--line);
  padding: 8px;
  font-size: 0.92rem;
}

th {
  color: var(--muted);
  font-weight: 600;
}

@media (max-width: 720px) {
  .page {
    padding: 14px;
  }
}
"""


def render_app_js() -> str:
    return """async function loadDashboard() {
  const meta = document.getElementById("meta");
  const cards = document.getElementById("kpi-cards");
  const releases = document.getElementById("recent-releases");
  const attention = document.getElementById("attention-repos");
  const repoRows = document.querySelector("#repo-table tbody");

  try {
    const response = await fetch("./latest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to load latest.json");
    }
    const data = await response.json();

    meta.textContent =
      `Owners: ${data.owners.join(", ")} | Generated: ${data.generatedAt} | Status: ${data.cacheStatus}`;

    const kpis = [
      ["Total Repos", data.kpis.totalRepos, data.snapshot.deltas.totalRepos],
      ["Open Issues", data.kpis.openIssues, data.snapshot.deltas.openIssues],
      ["Open PRs", data.kpis.openPullRequests, data.snapshot.deltas.openPullRequests],
      ["Stars", data.kpis.totalStars, data.snapshot.deltas.totalStars],
      ["Releases", data.kpis.reposWithLatestRelease, data.snapshot.deltas.reposWithLatestRelease],
      ["Licenses", data.kpis.reposWithLicense, data.snapshot.deltas.reposWithLicense],
      ["Updated 30d", data.kpis.pushedLast30Days, data.snapshot.deltas.pushedLast30Days]
    ];

    cards.innerHTML = "";
    for (const [label, value, delta] of kpis) {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `<div class="label">${label}</div><div class="value">${value}</div><div class="delta">Delta: ${delta}</div>`;
      cards.appendChild(el);
    }

    releases.innerHTML = "";
    for (const row of data.recentReleases.slice(0, 8)) {
      const el = document.createElement("div");
      el.className = "row";
      el.innerHTML = `<strong>${row.nameWithOwner} · ${row.tagName}</strong>
        <div class="muted">${row.publishedAt || "n/a"}</div>
        <div class="muted">${(row.description || "No release notes").slice(0, 220)}</div>`;
      releases.appendChild(el);
    }
    if (!data.recentReleases.length) {
      releases.innerHTML = `<div class="muted">No releases found.</div>`;
    }

    attention.innerHTML = "";
    for (const row of data.attention.repos.filter((repo) => repo.score > 0).slice(0, 8)) {
      const el = document.createElement("div");
      el.className = "row";
      const flags = row.flags.map((flag) => flag.label).join(", ");
      const warn = row.level === "high" ? "warn" : "";
      el.innerHTML = `<strong>${row.nameWithOwner}</strong>
        <div class="muted ${warn}">${row.level} (${row.score})</div>
        <div class="muted">${flags || "No flags"}</div>`;
      attention.appendChild(el);
    }
    if (!data.attention.repos.some((repo) => repo.score > 0)) {
      attention.innerHTML = `<div class="muted">No repositories currently match attention rules.</div>`;
    }

    repoRows.innerHTML = "";
    for (const repo of data.repos) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><a href="${repo.url}" target="_blank" rel="noreferrer">${repo.nameWithOwner}</a></td>
        <td>${repo.status}</td>
        <td>${repo.stars}</td>
        <td>${repo.openIssues}</td>
        <td>${repo.openPullRequests}</td>
        <td>${(repo.lastPush || "").split("T")[0] || "n/a"}</td>
        <td>${repo.roadmapTag || "none"}</td>`;
      repoRows.appendChild(tr);
    }
  } catch (err) {
    meta.textContent = `Dashboard load failed: ${err.message}`;
  }
}

loadDashboard();
"""


def json_load(path: Path) -> Optional[Dict[str, Any]]:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def request_graphql(
    token: str,
    query: str,
    variables: Dict[str, Any],
    retries: int = 4,
    base_delay: float = 1.0,
) -> Dict[str, Any]:
    body = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    for attempt in range(retries + 1):
        try:
            req = request.Request(GITHUB_GRAPHQL_API, data=body, headers=headers, method="POST")
            with request.urlopen(req, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if payload.get("errors"):
                messages = "; ".join(err.get("message", "unknown error") for err in payload["errors"])
                raise RuntimeError(f"GitHub GraphQL error: {messages}")
            if "data" not in payload:
                raise RuntimeError("GitHub GraphQL returned no data payload")
            return payload["data"]
        except (error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError):
            if attempt >= retries:
                raise
            time.sleep(base_delay * (2**attempt))

    raise RuntimeError("GitHub GraphQL request failed after retries")


def fetch_owner_repo_nodes(token: str, owner: str) -> Tuple[List[Dict[str, Any]], Dict[str, Any], int]:
    nodes: List[Dict[str, Any]] = []
    cursor: Optional[str] = None
    requests_made = 0
    rate_limit = {"cost": 0, "remaining": 0, "resetAt": None}

    while True:
        data = request_graphql(token, DASHBOARD_QUERY, {"owner": owner, "after": cursor})
        requests_made += 1
        if data.get("rateLimit"):
            rate_limit = data["rateLimit"]

        owner_block = data.get("repositoryOwner")
        if not owner_block:
            raise RuntimeError(f"Owner '{owner}' not found or access denied.")

        repos = owner_block.get("repositories")
        if not repos:
            raise RuntimeError(f"Owner '{owner}' did not expose repositories in GraphQL response.")

        nodes.extend(repos.get("nodes", []))
        page_info = repos.get("pageInfo", {})
        if not page_info.get("hasNextPage"):
            break
        cursor = page_info.get("endCursor")
        if not cursor:
            break

    return nodes, rate_limit, requests_made


def fetch_repos(
    owners: Sequence[str],
    token: Optional[str] = None,
    fixture: Optional[Dict[str, Any]] = None,
) -> Tuple[List[Dict[str, Any]], Optional[Dict[str, Any]], int]:
    repos: List[Dict[str, Any]] = []
    rate_limits: List[Dict[str, Any]] = []
    request_count = 0

    if fixture:
        owner_blocks = fixture.get("owners", {})
        for owner in owners:
            for node in owner_blocks.get(owner, []):
                repos.append(normalize_repo(node, owner))
        rate_limit = fixture.get("rateLimit")
        return repos, rate_limit, int(fixture.get("requestCount", 0))

    if not token:
        raise RuntimeError("Missing token. Set DASHBOARD_GITHUB_TOKEN (preferred), GITHUB_DASHBOARD_TOKEN, or GITHUB_TOKEN.")

    for owner in owners:
        nodes, rate_limit, owner_requests = fetch_owner_repo_nodes(token, owner)
        request_count += owner_requests
        rate_limits.append(rate_limit)
        repos.extend(normalize_repo(node, owner) for node in nodes)

    rate_limit_summary = None
    if rate_limits:
        rate_limit_summary = min(
            rate_limits,
            key=lambda item: int(item.get("remaining", 0)),
        )
    return repos, rate_limit_summary, request_count


def list_scope_snapshots(output_dir: Path, scope_key: str) -> List[Path]:
    snapshot_dir = output_dir / "snapshots"
    if not snapshot_dir.exists():
        return []
    pattern = f"{scope_key}__*.json"
    return sorted(snapshot_dir.glob(pattern), reverse=True)


def snapshot_path(output_dir: Path, scope_key: str, snap_id: str) -> Path:
    return output_dir / "snapshots" / f"{scope_key}__{snap_id}.json"


def prune_snapshot_paths(existing: Sequence[Path], retention: int) -> List[Path]:
    if retention <= 0:
        return list(existing)
    return list(existing[retention:])


def _file_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def apply_outputs(
    writes: Dict[Path, str],
    deletes: Sequence[Path],
    check: bool,
) -> bool:
    changed = False
    for path, content in writes.items():
        if not path.exists() or _file_text(path) != content:
            changed = True
            if not check:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")

    for path in deletes:
        if path.exists():
            changed = True
            if not check:
                path.unlink()

    return changed


def build_static_outputs(
    payload: Dict[str, Any],
    output_dir: Path,
    scope_key: str,
    current_snapshot_id: str,
    include_snapshot_file: bool,
) -> Dict[Path, str]:
    writes: Dict[Path, str] = {}
    writes[output_dir / "latest.json"] = to_json_text(payload)
    writes[output_dir / "index.md"] = render_markdown(payload)
    writes[output_dir / "index.html"] = render_html()
    writes[output_dir / "app.js"] = render_app_js()
    writes[output_dir / "styles.css"] = render_css()
    if include_snapshot_file:
        writes[snapshot_path(output_dir, scope_key, current_snapshot_id)] = to_json_text(payload)
    return writes
