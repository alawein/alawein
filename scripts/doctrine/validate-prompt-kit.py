#!/usr/bin/env python3
"""Validate prompt kit structure, required frontmatter fields, and required sections."""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

PROMPT_KITS_DIR = Path(__file__).resolve().parent.parent / "prompt-kits"

EXEMPT_FILES = {"CHANGELOG.md"}

REQUIRED_FRONTMATTER = [
    "type",
    "version",
    "last-verified",
    "downstream-consumers",
]

# Required sections per kit-type (case-insensitive substring match)
REQUIRED_SECTIONS_BY_TYPE: dict[str, list[str]] = {
    "system-prompt": ["## identity", "## hard constraints", "## operating mode"],
    "site-prompt":   ["## identity", "## copy rules", "## what to help with"],
    "default":       ["## identity"],
}

FORBIDDEN_PATTERNS = ["TBD", "TODO", "FIXME", "placeholder"]


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Return (frontmatter_dict, body) for a markdown file with YAML front matter."""
    if not content.startswith("---"):
        return {}, content
    lines = content.split("\n")
    close = None
    for i, line in enumerate(lines[1:], start=1):
        if line.rstrip() == "---":
            close = i
            break
    if close is None:
        return {}, content
    fm_text = "\n".join(lines[1:close])
    body = "\n".join(lines[close + 1 :])
    try:
        fm = yaml.safe_load(fm_text) or {}
    except yaml.YAMLError as exc:
        return {"_parse_error": str(exc)}, body
    return fm, body


def validate_kit(path: Path) -> list[str]:
    errors: list[str] = []
    content = path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(content)

    if "_parse_error" in fm:
        errors.append(f"YAML parse error in frontmatter: {fm['_parse_error']}")
        return errors

    if not fm:
        errors.append("Missing YAML frontmatter block (file must start with ---)")

    for field in REQUIRED_FRONTMATTER:
        if field not in fm:
            errors.append(f"Missing required frontmatter field: '{field}'")

    # Normalize section headers — case-insensitive check, per kit-type
    kit_type = fm.get("kit-type", "default")
    required_sections = REQUIRED_SECTIONS_BY_TYPE.get(kit_type, REQUIRED_SECTIONS_BY_TYPE["default"])
    body_lower = body.lower()
    for section in required_sections:
        if section not in body_lower:
            errors.append(f"Missing required section '{section}' (kit-type: {kit_type})")

    for pattern in FORBIDDEN_PATTERNS:
        if pattern in content:
            errors.append(f"Forbidden placeholder pattern found: '{pattern}'")

    return errors


def main() -> int:
    kits = [p for p in PROMPT_KITS_DIR.glob("*.md") if p.name not in EXEMPT_FILES]
    if not kits:
        print(f"No prompt kits found in {PROMPT_KITS_DIR}")
        return 1

    all_errors: dict[str, list[str]] = {}
    for kit in sorted(kits):
        errs = validate_kit(kit)
        if errs:
            all_errors[kit.name] = errs

    if all_errors:
        for kit_name, errs in all_errors.items():
            for err in errs:
                print(f"FAIL [{kit_name}] {err}")
        return 1

    print(f"All {len(kits)} prompt kit(s) valid: {', '.join(k.name for k in kits)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
