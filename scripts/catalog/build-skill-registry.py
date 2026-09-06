#!/usr/bin/env python3
"""Regenerate claude-agent-platform/skills/registry.json with repo-relative paths."""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
SKILLS_DIR = ROOT / "claude-agent-platform" / "skills"
REGISTRY_PATH = SKILLS_DIR / "registry.json"


def parse_frontmatter(text: str) -> dict[str, object]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end].strip()
    payload = yaml.safe_load(block)
    return payload if isinstance(payload, dict) else {}


def parse_skill(skill_md: Path) -> dict[str, str]:
    text = skill_md.read_text(encoding="utf-8")
    frontmatter = parse_frontmatter(text)
    name = str(frontmatter.get("name") or skill_md.parent.name)
    version = str(frontmatter.get("version") or "0.0.0").strip().strip('"')
    description = str(frontmatter.get("description") or "").strip().strip('"')
    return {
        "name": name,
        "version": version,
        "path": skill_md.relative_to(ROOT).as_posix(),
        "description": description,
    }


def build_registry() -> dict:
    skills = [parse_skill(path) for path in sorted(SKILLS_DIR.glob("*/SKILL.md"))]
    return {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "path_convention": "repo-relative",
        "skills": skills,
    }


def comparable_registry(registry: dict) -> dict:
    return {
        "path_convention": registry.get("path_convention"),
        "skills": registry.get("skills"),
    }


def main(argv: list[str] | None = None) -> int:
    argv = argv or sys.argv[1:]
    registry = build_registry()
    if "--check" in argv:
        if not REGISTRY_PATH.exists():
            print(f"Missing registry: {REGISTRY_PATH}", file=sys.stderr)
            return 1
        existing = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
        if comparable_registry(existing) != comparable_registry(registry):
            print("registry.json is stale; run build-skill-registry.py", file=sys.stderr)
            return 1
        print("Skill registry is up to date.")
        return 0
    REGISTRY_PATH.write_text(json.dumps(registry, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(registry['skills'])} skills to {REGISTRY_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
