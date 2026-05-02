#!/usr/bin/env python3
"""Generate the public profile README from canonical profile and project data."""

from __future__ import annotations

import sys
from pathlib import Path

from catalog_lib import profile_config

ROOT = Path(__file__).resolve().parent.parent.parent
README = ROOT / "README.md"

ACRONYMS = {"ai", "hpc", "llm", "api", "sdk", "ml", "ci", "cd", "sql", "os"}


def prettify_slug(slug: str) -> str:
    parts = [p for p in slug.split("-") if p]
    out: list[str] = []
    for i, p in enumerate(parts):
        if p.lower() in ACRONYMS:
            out.append(p.upper())
        elif i == 0:
            out.append(p.capitalize())
        else:
            out.append(p.lower())
    return " ".join(out)


def render_link_row(profile: dict) -> str:
    urls = profile.get("urls") or {}
    ordered_keys = ("website", "morphism", "scholar", "email")
    link_labels: dict[str, str] = {"scholar": "Scholar"}
    items: list[str] = []
    for key in ordered_keys:
        url = urls.get(key)
        if not url:
            continue
        if key in link_labels:
            display = link_labels[key]
        else:
            display = url.replace("mailto:", "").removeprefix("https://").removeprefix("http://")
            display = display.removeprefix("www.")
        items.append(f"[{display}]({url})")
    return " · ".join(items)


def render_domains(profile: dict) -> str:
    domains = profile.get("domains") or []
    return " · ".join(prettify_slug(d) for d in domains if d)


def render_research_table(profile: dict) -> list[str]:
    rows = profile.get("research_rows") or []
    if not rows:
        return []
    lines = [
        "## Research & Scientific Computing",
        "",
        "| Repo | What it is |",
        "|------|-----------|",
    ]
    for row in rows:
        slug = row["slug"]
        url = row["url"]
        desc = row["description"]
        lines.append(f"| [{slug}]({url}) | {desc} |")
    return lines


def render_products_table(profile: dict) -> list[str]:
    rows = profile.get("product_rows") or []
    if not rows:
        return []
    lines = [
        "## AI Systems & Products",
        "",
        "| Project | What it is |",
        "|---------|-----------|",
    ]
    for row in rows:
        name = row["name"]
        desc = row["description"]
        lines.append(f"| {name} | {desc} |")
    lines += [
        "",
        "*Most AI product repos are private. See [kohyr.com](https://kohyr.com) for product details.*",
    ]
    return lines


def render_stack(profile: dict) -> list[str]:
    stack = str(profile.get("stack") or "").strip()
    if not stack:
        return []
    return [f"**Stack:** {stack}"]


def render_readme(profile: dict) -> str:
    name = profile.get("full_name") or profile.get("name") or "alawein"
    bio = str(profile.get("bio_short") or "").strip()
    quote = str(profile.get("tagline_quote") or "").strip().strip('"')

    lines: list[str] = [f"# {name}", ""]

    if bio:
        lines += [bio, ""]

    if quote:
        lines += [f"> {quote}", ""]

    link_row = render_link_row(profile)
    if link_row:
        lines += [link_row, ""]

    lines += ["---", ""]

    research_lines = render_research_table(profile)
    if research_lines:
        lines += research_lines + [""]

    products_lines = render_products_table(profile)
    if products_lines:
        lines += products_lines + [""]

    domain_row = render_domains(profile)
    if domain_row:
        lines += ["## Working On", "", domain_row, ""]

    lines += ["---", ""]

    stack_lines = render_stack(profile)
    if stack_lines:
        lines += stack_lines + [""]

    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    check_only = "--check" in sys.argv
    profile = profile_config()
    rendered = render_readme(profile)
    current = README.read_text(encoding="utf-8") if README.exists() else ""

    if rendered != current:
        if check_only:
            print("README.md is out of sync. Run: python scripts/sync-readme.py")
            return 1
        README.write_text(rendered, encoding="utf-8", newline="\n")
        print("README.md updated.")
        return 0

    if check_only:
        print("README.md is up to date.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
