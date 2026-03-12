#!/usr/bin/env python3
"""sync-readme.py — Regenerate README-backup-20250807.md sections from projects.json.

Reads projects.json and rewrites sections between HTML comment markers:
  <!-- SYNC:PROJECTS:START --> ... <!-- SYNC:PROJECTS:END -->
  <!-- SYNC:RESEARCH:START --> ... <!-- SYNC:RESEARCH:END -->
  <!-- SYNC:PACKAGES:START --> ... <!-- SYNC:PACKAGES:END -->

Usage: python scripts/sync-readme.py [--check]
  --check: exit 1 if README would change (for CI)
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECTS_JSON = ROOT / "projects.json"
README = ROOT / "README-backup-20250807.md"


def repo_slug(repo: str) -> str:
    """Return physical repo slug from owner/name."""
    return repo.rsplit("/", maxsplit=1)[-1]


def canonical_label(entry: dict) -> str:
    """Return display label with canonical-name-first alias semantics."""
    canonical = entry.get("slug") or entry.get("name", "")
    physical = repo_slug(entry["repo"]) if entry.get("repo") else ""

    if canonical and physical and canonical != physical:
        return f"{canonical} (repo: {physical})"

    return entry.get("name") or canonical


def entry_url(entry: dict) -> str:
    """Return link target for entry.

    If canonical and physical repo names differ, link to physical GitHub repo
    until slug cutover is complete.
    """
    if not entry.get("repo"):
        return entry.get("url", "")

    canonical = entry.get("slug", "")
    physical = repo_slug(entry["repo"])
    if canonical and canonical != physical:
        return f"https://github.com/{entry['repo']}"

    return entry.get("url", f"https://github.com/{entry['repo']}")


def render_projects(featured: list[dict]) -> str:
    """Render the Active Projects table."""
    rows = []
    for i in range(0, len(featured), 3):
        chunk = featured[i : i + 3]
        cells = []
        for p in chunk:
            tags = " ".join(f"`{t}`" for t in p["tags"])
            label = canonical_label(p)
            url = entry_url(p)
            cells.append(
                f'<td align="center" width="33%">\n\n'
                f"**[{label}]({url})**\n\n"
                f'{p["description"]}\n\n'
                f"{tags}\n\n"
                f"</td>"
            )
        # pad to 3 columns
        while len(cells) < 3:
            cells.append('<td align="center" width="33%"></td>')
        rows.append("<tr>\n" + "\n".join(cells) + "\n</tr>")
    return "<table>\n" + "\n".join(rows) + "\n</table>"


def render_research(research: list[dict]) -> str:
    """Render the Research & Scientific Computing table."""
    lines = [
        "| Project | Domain |",
        "|---------|--------|",
    ]
    for r in research:
        label = canonical_label(r)
        lines.append(
            f'| [{label}](https://github.com/{r["repo"]}) | {r["domain"]} |'
        )
    return "\n".join(lines)


def render_packages(packages: list[dict]) -> str:
    """Render the Published Packages table."""
    lines = [
        "<table>",
        "<tr>",
        "<th>Package</th>",
        "<th>Description</th>",
        "<th>Version</th>",
        "</tr>",
    ]
    for p in packages:
        badge_color = "8B5CF6"
        if p["registry"] == "npm":
            badge = f'<img src="https://img.shields.io/npm/v/{p["name"]}?style=flat-square&color={badge_color}" alt="npm"/>'
        else:
            badge = f'<img src="https://img.shields.io/pypi/v/{p["name"]}?style=flat-square&color={badge_color}" alt="pypi"/>'
        lines.extend(
            [
                "<tr>",
                f'<td><a href="{p["url"]}"><code>{p["name"]}</code></a></td>',
                f'<td>{p["description"]}</td>',
                f"<td>{badge}</td>",
                "</tr>",
            ]
        )
    lines.append("</table>")
    return "\n".join(lines)


def sync_section(content: str, marker: str, new_content: str) -> str:
    """Replace content between <!-- SYNC:{marker}:START --> and <!-- SYNC:{marker}:END -->."""
    start_tag = f"<!-- SYNC:{marker}:START -->"
    end_tag = f"<!-- SYNC:{marker}:END -->"
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)
    if start_idx == -1 or end_idx == -1:
        return content
    return (
        content[: start_idx + len(start_tag)]
        + "\n"
        + new_content
        + "\n"
        + content[end_idx:]
    )


def main() -> int:
    check_only = "--check" in sys.argv
    data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    old_content = README.read_text(encoding="utf-8")
    content = old_content

    content = sync_section(content, "PROJECTS", render_projects(data["featured"]))
    content = sync_section(content, "RESEARCH", render_research(data["research"]))
    content = sync_section(content, "PACKAGES", render_packages(data["packages"]))

    if content == old_content:
        print("README-backup-20250807.md is up to date.")
        return 0

    if check_only:
        print("README-backup-20250807.md is out of sync with projects.json. Run: python scripts/sync-readme.py")
        return 1

    README.write_text(content, encoding="utf-8")
    print("README-backup-20250807.md updated from projects.json.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
