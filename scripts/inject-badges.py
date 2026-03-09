#!/usr/bin/env python3
"""inject-badges.py — Add standard org badges to repo READMEs.

Ensures every repo README has consistent CI, license, and coverage badges.
Inserts a badge row after the first heading if not already present.

Usage: python scripts/inject-badges.py <repo_dir> [--dry-run]
"""
import re
import sys
from pathlib import Path


def get_repo_name(repo_dir: Path) -> str:
    """Extract repo name from .git/config or directory name."""
    git_config = repo_dir / ".git" / "config"
    if git_config.exists():
        text = git_config.read_text(encoding="utf-8", errors="replace")
        m = re.search(r'url\s*=\s*.*[:/]alawein/(.+?)(?:\.git)?$', text, re.MULTILINE)
        if m:
            return m.group(1)
    return repo_dir.name


def generate_badges(repo_name: str) -> str:
    """Generate standard badge row for a repo."""
    base = f"https://img.shields.io"
    ci = f"[![CI]({base}/github/actions/workflow/status/alawein/{repo_name}/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/alawein/{repo_name}/actions)"
    license_badge = f"[![License]({base}/github/license/alawein/{repo_name}?style=flat-square)](LICENSE)"
    return f"{ci}\n{license_badge}"


def has_badges(content: str) -> bool:
    """Check if README already has org-standard badges."""
    return "img.shields.io/github/actions/workflow/status/alawein" in content


def inject(content: str, badges: str) -> str:
    """Insert badges after the first H1 heading."""
    # Find first # heading
    m = re.search(r'^(#\s+.+)$', content, re.MULTILINE)
    if m:
        insert_pos = m.end()
        return content[:insert_pos] + "\n\n" + badges + "\n" + content[insert_pos:]
    # No heading found, prepend
    return badges + "\n\n" + content


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python scripts/inject-badges.py <repo_dir> [--dry-run]")
        return 1

    repo_dir = Path(sys.argv[1]).resolve()
    dry_run = "--dry-run" in sys.argv
    readme = repo_dir / "README.md"

    if not readme.exists():
        print(f"No README.md in {repo_dir}")
        return 1

    content = readme.read_text(encoding="utf-8")
    if has_badges(content):
        print(f"{repo_dir.name}: badges already present, skipping.")
        return 0

    repo_name = get_repo_name(repo_dir)
    badges = generate_badges(repo_name)
    new_content = inject(content, badges)

    if dry_run:
        print(f"{repo_dir.name}: would inject badges (dry-run)")
        return 0

    readme.write_text(new_content, encoding="utf-8")
    print(f"{repo_dir.name}: badges injected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
