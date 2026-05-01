#!/usr/bin/env python3
"""
generate-arch-diagram.py — Regenerate the repo-topology section of docs/architecture.md
from catalog/repos.json.

The script patches only the AUTO-GENERATED block between sentinel comments,
preserving hand-maintained prose sections above and below it.

Usage:
  python scripts/generate-arch-diagram.py            # update docs/architecture.md in place
  python scripts/generate-arch-diagram.py --dry-run  # print to stdout
"""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPOS_JSON = ROOT / "catalog" / "repos.json"
ARCH_MD = ROOT / "docs" / "architecture.md"

SENTINEL_START = "<!-- AUTO-GENERATED REPO TOPOLOGY START -->"
SENTINEL_END = "<!-- AUTO-GENERATED REPO TOPOLOGY END -->"

# Cap per subgraph to keep diagrams readable
MAX_PER_GROUP = 8


def load_repos() -> list[dict]:
    data = json.loads(REPOS_JSON.read_text(encoding="utf-8"))
    return data.get("repos", [])


def group_by_type(repos: list[dict]) -> dict[str, list[dict]]:
    groups: dict[str, list[dict]] = {}
    for r in repos:
        rtype = r.get("type", "other")
        groups.setdefault(rtype, []).append(r)
    return groups


def repo_label(r: dict) -> str:
    slug = r.get("slug") or r.get("name", "?")
    desc = (r.get("canonical_description") or "")[:35]
    return f'"{slug}\\n{desc}"' if desc else f'"{slug}"'


def generate_topology_mermaid(repos: list[dict]) -> str:
    groups = group_by_type(repos)
    lines = ["```mermaid", "graph TB"]
    for rtype, group in sorted(groups.items()):
        safe_id = rtype.replace("-", "_").replace(" ", "_")
        label = rtype.replace("-", " ").title()
        lines.append(f"  subgraph {safe_id}[\"{label} Repos\"]")
        for r in group[:MAX_PER_GROUP]:
            slug = (r.get("slug") or r.get("name", "?")).replace("-", "_")
            lines.append(f"    {slug}[{repo_label(r)}]")
        if len(group) > MAX_PER_GROUP:
            lines.append(f'    more_{safe_id}["… {len(group) - MAX_PER_GROUP} more"]')
        lines.append("  end")
    lines.append("```")
    return "\n".join(lines)


def patch_arch_md(current: str, new_block: str, today: str) -> str:
    """Replace the AUTO-GENERATED block inside the existing architecture.md."""
    start_idx = current.find(SENTINEL_START)
    end_idx = current.find(SENTINEL_END)

    replacement = (
        f"{SENTINEL_START}\n"
        f"<!-- last updated: {today} — do not edit; run scripts/generate-arch-diagram.py -->\n\n"
        f"### Repo Topology (auto-generated from catalog/repos.json)\n\n"
        f"{new_block}\n\n"
        f"{SENTINEL_END}"
    )

    if start_idx != -1 and end_idx != -1:
        return current[:start_idx] + replacement + current[end_idx + len(SENTINEL_END):]

    # Sentinels not present — append after the first h2 section
    insert_after = current.find("\n## ")
    if insert_after == -1:
        return current + "\n\n" + replacement + "\n"
    next_h2 = current.find("\n## ", insert_after + 1)
    if next_h2 == -1:
        return current + "\n\n" + replacement + "\n"
    return current[:next_h2] + "\n\n" + replacement + current[next_h2:]


def main() -> None:
    dry_run = "--dry-run" in sys.argv

    repos = load_repos()
    if not repos:
        print(f"No repos found in {REPOS_JSON}", file=sys.stderr)
        sys.exit(1)

    today = date.today().isoformat()
    topology = generate_topology_mermaid(repos)
    current = ARCH_MD.read_text(encoding="utf-8") if ARCH_MD.exists() else ""
    patched = patch_arch_md(current, topology, today)

    if dry_run:
        print(patched)
    else:
        ARCH_MD.write_text(patched, encoding="utf-8")
        print(f"Updated: {ARCH_MD} ({len(repos)} repos in topology)")


if __name__ == "__main__":
    main()
