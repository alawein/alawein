#!/usr/bin/env python3
"""Cross-repo Docs Doctrine compliance dashboard.

Runs doctrine header checks across all workspace repos and produces a
compliance summary as Markdown or JSON.

Usage:
    python scripts/doctrine-dashboard.py                    # markdown to stdout
    python scripts/doctrine-dashboard.py --json             # JSON to stdout
    python scripts/doctrine-dashboard.py --output report.md # write to file
    python scripts/doctrine-dashboard.py --workspace /path  # custom workspace
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# Configuration (mirrors validate-doctrine.py)
MANAGED_EXTENSIONS = {".md", ".yaml", ".yml", ".toml", ".cfg"}
HEADER_EXTENSIONS = {".md"}  # Only check .md for frontmatter headers
VALID_TYPES = {"canonical", "derived", "generated", "frozen"}
VALID_SYNCS = {"ci", "script", "manual", "none"}
VALID_SLAS = {"realtime", "on-change", "manual", "none"}
BANNED_EXTENSIONS = {".bak", ".old", ".tmp", ".orig"}
BANNED_SUFFIXES = ("_v2", "_v3", "_final", "_new", "_old", "_copy", "_backup")


def parse_header(filepath: str) -> dict | None:
    """Extract YAML frontmatter from a file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read(2048)  # Only need first ~2KB for header
    except (UnicodeDecodeError, PermissionError, OSError):
        return None

    if not content.startswith("---"):
        return None

    end = content.find("---", 3)
    if end == -1:
        return None

    header = {}
    for line in content[3:end].strip().split("\n"):
        if ":" in line:
            key, val = line.split(":", 1)
            header[key.strip()] = val.strip()
    return header


def validate_repo(repo_path: Path) -> dict:
    """Run doctrine checks on a single repo and return structured results."""
    errors = []
    warnings = []
    passed = 0

    # Directories to skip (build artifacts, caches, environments)
    skip_dirs = {
        "node_modules", "__pycache__", ".git", "dist", ".venv",
        "venv", ".next", ".turbo",
    }

    for dirpath, dirnames, filenames in os.walk(repo_path):
        dirnames[:] = [
            d for d in dirnames
            if not d.startswith(".") and d not in skip_dirs
        ]

        for f in filenames:
            fp = os.path.join(dirpath, f)
            p = Path(fp)

            # Rule 5: naming checks (only managed file types)
            if p.suffix in MANAGED_EXTENSIONS:
                in_archive = any(
                    part in ("archive", "dist") for part in p.parts
                )
                if p.suffix in BANNED_EXTENSIONS:
                    if not in_archive:
                        errors.append((fp, "R5", f"Banned extension: {p.suffix}"))
                    continue
                for suffix in BANNED_SUFFIXES:
                    if p.stem.endswith(suffix):
                        if not in_archive:
                            errors.append((fp, "R5", f"Banned suffix: {suffix}"))
                        break

            # Rule 1: header checks (only .md files)
            if p.suffix in HEADER_EXTENSIONS:
                header = parse_header(fp)
                if header is None:
                    errors.append((fp, "R1", "Missing doctrine header"))
                    continue

                file_type = header.get("type", "").lower()
                if file_type not in VALID_TYPES:
                    errors.append((fp, "R1", f"Invalid type: '{file_type}'"))
                    continue

                # Rule 3: derived files must declare source
                if file_type == "derived":
                    if not header.get("source"):
                        errors.append((fp, "R3", "Missing 'source' declaration"))
                    sync = header.get("sync", "").lower()
                    if sync not in VALID_SYNCS:
                        errors.append((fp, "R3", f"Invalid sync: '{sync}'"))
                    sla = header.get("sla", "").lower()
                    if sla not in VALID_SLAS:
                        errors.append((fp, "R4", f"Invalid SLA: '{sla}'"))

                passed += 1

    rel_errors = [
        {"path": str(Path(p).relative_to(repo_path)), "rule": r, "msg": m}
        for p, r, m in errors
    ]
    rel_warnings = [
        {"path": str(Path(p).relative_to(repo_path)), "rule": r, "msg": m}
        for p, r, m in warnings
    ]

    return {
        "errors": len(errors),
        "warnings": len(warnings),
        "passed": passed,
        "status": "PASS" if len(errors) == 0 else "FAIL",
        "error_details": rel_errors,
        "warning_details": rel_warnings,
    }


def scan_workspace(workspace: Path) -> dict:
    """Scan all repos in the workspace."""
    repos = {}
    for item in sorted(workspace.iterdir()):
        if item.is_dir() and (item / ".git").is_dir():
            repos[item.name] = validate_repo(item)

    total = len(repos)
    passing = sum(1 for r in repos.values() if r["status"] == "PASS")
    total_errors = sum(r["errors"] for r in repos.values())
    total_warnings = sum(r["warnings"] for r in repos.values())

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "workspace": str(workspace),
        "summary": {
            "total_repos": total,
            "passing": passing,
            "failing": total - passing,
            "total_errors": total_errors,
            "total_warnings": total_warnings,
        },
        "repos": repos,
    }


def render_markdown(data: dict) -> str:
    """Render the scan results as a Markdown report."""
    s = data["summary"]
    lines = [
        "---",
        "type: generated",
        "source: scripts/doctrine-dashboard.py",
        "sync: script",
        "sla: none",
        "---",
        "",
        "# Docs Doctrine Compliance Dashboard",
        "",
        f"> Generated: {data['timestamp']}",
        "",
        "## Summary",
        "",
        "| Metric | Value |",
        "|--------|-------|",
        f"| Total repos | {s['total_repos']} |",
        f"| Passing | {s['passing']} |",
        f"| Failing | {s['failing']} |",
        f"| Total errors | {s['total_errors']} |",
        f"| Total warnings | {s['total_warnings']} |",
        "",
        "## Per-Repo Status",
        "",
        "| Repo | Status | Passed | Errors | Warnings |",
        "|------|--------|--------|--------|----------|",
    ]

    for name, repo in sorted(data["repos"].items()):
        status_icon = "PASS" if repo["status"] == "PASS" else "**FAIL**"
        lines.append(
            f"| {name} | {status_icon} | {repo['passed']} | "
            f"{repo['errors']} | {repo['warnings']} |"
        )

    # Show error details for failing repos
    failing = {n: r for n, r in data["repos"].items() if r["error_details"]}
    if failing:
        lines.extend(["", "## Errors", ""])
        for name in sorted(failing):
            repo = failing[name]
            lines.append(f"### {name}")
            lines.append("")
            for err in repo["error_details"]:
                lines.append(f"- `[{err['rule']}]` {err['path']}: {err['msg']}")
            lines.append("")

    lines.append("")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Docs Doctrine Compliance Dashboard")
    parser.add_argument(
        "--workspace",
        default=str(Path(__file__).resolve().parent.parent.parent),
        help="Workspace root (default: two levels up from script)",
    )
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--output", "-o", help="Write to file instead of stdout")
    args = parser.parse_args()

    workspace = Path(args.workspace).resolve()
    data = scan_workspace(workspace)

    if args.json:
        output = json.dumps(data, indent=2)
    else:
        output = render_markdown(data)

    if args.output:
        Path(args.output).write_text(output, encoding="utf-8")
        print(f"Report written to {args.output}")
    else:
        print(output)


if __name__ == "__main__":
    main()
