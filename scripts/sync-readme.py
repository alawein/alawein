#!/usr/bin/env python3
"""sync-readme.py — Regenerate README.md from projects.json and optional profile-from-guides.yaml.

Reads projects.json and rewrites sections between HTML comment markers in README.md:
  <!-- SYNC:PROJECTS:START --> ... <!-- SYNC:PROJECTS:END -->
  <!-- SYNC:RESEARCH:START --> ... <!-- SYNC:RESEARCH:END -->
  <!-- SYNC:PACKAGES:START --> ... <!-- SYNC:PACKAGES:END -->
  <!-- SYNC:PROFILE:START --> ... <!-- SYNC:PROFILE:END --> (when profile-from-guides.yaml exists)

Usage: python scripts/sync-readme.py [--check]
  --check: exit 1 if README would change (for CI)
"""
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

ROOT = Path(__file__).resolve().parent.parent
PROJECTS_JSON = ROOT / "projects.json"
README = ROOT / "README.md"
PROFILE_YAML = ROOT / "profile-from-guides.yaml"


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
    """Return link target for portfolio cards: prefer public product URL, never GitHub when url is set."""
    u = (entry.get("url") or "").strip()
    if u:
        return u
    if entry.get("repo"):
        return f"https://github.com/{entry['repo']}"
    return ""


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


def render_profile_block(profile: dict) -> str:
    """Render the About table from profile-from-guides.yaml (bio_short, bio_bullets)."""
    bio_short = (profile.get("bio_short") or "").strip()
    bio_bullets = (profile.get("bio_bullets") or "").strip()
    if not bio_bullets:
        bio_bullets = (
            "🎓 PhD EECS — UC Berkeley (Dec 2025)\n"
            "🏢 Morphism Systems — Founder (Aug 2025)\n"
            "⚗️  Turing — Applied Scientist (AI)\n"
            "🔬 16+ peer-reviewed publications\n"
            "🤖 SFT/DPO/LoRA · DFT/HPC · LLM Infra\n"
            "📍 " + (profile.get("location") or "San Francisco, CA")
        )
    return (
        "<table>\n"
        "<tr>\n"
        "<td width=\"55%\" valign=\"top\">\n\n"
        + bio_short
        + "\n\n</td>\n"
        "<td width=\"45%\" valign=\"top\">\n\n```\n"
        + bio_bullets
        + "\n```\n\n</td>\n"
        "</tr>\n</table>"
    )


def main() -> int:
    check_only = "--check" in sys.argv
    if not README.is_file():
        print(f"README not found: {README}")
        return 1
    data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    old_content = README.read_text(encoding="utf-8")
    content = old_content

    content = sync_section(content, "PROJECTS", render_projects(data["featured"]))
    content = sync_section(content, "RESEARCH", render_research(data["research"]))
    content = sync_section(content, "PACKAGES", render_packages(data["packages"]))

    # Optional: sync profile block from profile-from-guides.yaml
    if PROFILE_YAML.is_file() and yaml is not None:
        profile_data = yaml.safe_load(PROFILE_YAML.read_text(encoding="utf-8")) or {}
        content = sync_section(content, "PROFILE", render_profile_block(profile_data))
    elif check_only and PROFILE_YAML.is_file() and yaml is None:
        print("profile-from-guides.yaml present but PyYAML not installed; cannot check README profile sync.")
        return 1

    if content != old_content:
        if check_only:
            print("README.md is out of sync with projects.json (or profile-from-guides.yaml). Run: python scripts/sync-readme.py")
            return 1
        README.write_text(content, encoding="utf-8")
        print("README.md updated.")
    elif check_only:
        print("README.md is up to date.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
