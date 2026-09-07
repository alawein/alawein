#!/usr/bin/env python3
"""
generate-arch-diagram.py: Regenerate the repo-topology section of docs/architecture.md
from catalog/repos.json.

The script patches the AUTO-GENERATED block and its document freshness date,
preserving hand-maintained prose sections above and below it.

Usage:
  python scripts/ops/generate-arch-diagram.py            # update docs/architecture.md in place
  python scripts/ops/generate-arch-diagram.py --dry-run  # print to stdout
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
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
        f"<!-- last updated: {today}; do not edit; run scripts/ops/generate-arch-diagram.py -->\n\n"
        f"### Repo Topology (auto-generated from catalog/repos.json)\n\n"
        f"{new_block}\n\n"
        f"{SENTINEL_END}"
    )

    if start_idx != -1 and end_idx != -1:
        existing = current[start_idx:end_idx + len(SENTINEL_END)]
        timestamp = re.compile(r"(?m)(^<!-- last updated: )\d{4}-\d{2}-\d{2}(;)")
        if timestamp.sub(r"\1DATE\2", existing, count=1) == timestamp.sub(
            r"\1DATE\2", replacement, count=1
        ):
            return current
        patched = current[:start_idx] + replacement + current[end_idx + len(SENTINEL_END):]
    else:
        # Sentinels not present; append after the first h2 section.
        insert_after = current.find("\n## ")
        next_h2 = current.find("\n## ", insert_after + 1) if insert_after != -1 else -1
        if next_h2 == -1:
            patched = current + "\n\n" + replacement + "\n"
        else:
            patched = current[:next_h2] + "\n\n" + replacement + current[next_h2:]

    frontmatter = re.match(r"\A---\n(.*?)\n---(?=\n|$)", patched, re.DOTALL)
    if frontmatter:
        header, count = re.subn(
            r"(?m)^last_updated:[^\n]*$", f"last_updated: {today}", frontmatter[1], count=1
        )
        if not count:
            header += f"\nlast_updated: {today}"
        patched = f"---\n{header}\n---" + patched[frontmatter.end():]
    return patched


def main() -> None:
    dry_run = "--dry-run" in sys.argv

    repos = load_repos()
    if not repos:
        print(f"No repos found in {REPOS_JSON}", file=sys.stderr)
        sys.exit(1)

    today = datetime.now(timezone.utc).date().isoformat()
    topology = generate_topology_mermaid(repos)
    current = ARCH_MD.read_text(encoding="utf-8") if ARCH_MD.exists() else ""
    patched = patch_arch_md(current, topology, today)

    if dry_run:
        print(patched)
    elif patched != current:
        ARCH_MD.write_text(patched, encoding="utf-8", newline="\n")
        print(f"Updated: {ARCH_MD} ({len(repos)} repos in topology)")
    else:
        print(f"Unchanged: {ARCH_MD}")


if __name__ == "__main__":
    main()
