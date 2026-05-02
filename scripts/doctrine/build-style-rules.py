#!/usr/bin/env python3
"""Build Vale style rules from the canonical terminology registry."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
REGISTRY = ROOT / "docs" / "style" / "terminology-registry.yaml"
STYLES_DIR = ROOT / "styles" / "Alawein"
TONE_YML = STYLES_DIR / "Tone.yml"
TERMINOLOGY_YML = STYLES_DIR / "Terminology.yml"


def load_registry() -> dict[str, Any]:
    return yaml.safe_load(REGISTRY.read_text(encoding="utf-8")) or {}


def dump_yaml(payload: dict[str, Any]) -> str:
    return yaml.safe_dump(payload, sort_keys=False, allow_unicode=True)


def terminology_rule(registry: dict[str, Any]) -> dict[str, Any]:
    rules = registry.get("linter_rules", {})
    deprecated = rules.get("terminology", {}).get("tokens", [])
    return {
        "extends": "existence",
        "message": rules.get("terminology", {}).get(
            "message", "Use the canonical term '%s' from the terminology registry."
        ),
        "ignorecase": True,
        "level": rules.get("terminology", {}).get("level", "error"),
        "tokens": deprecated,
    }


def tone_rule(registry: dict[str, Any]) -> dict[str, Any]:
    tone = registry.get("linter_rules", {}).get("tone", {})
    return {
        "extends": "existence",
        "message": tone.get("message", "Avoid promotional filler in governed docs: '%s'."),
        "ignorecase": True,
        "level": tone.get("level", "error"),
        "tokens": tone.get("tokens", []),
    }


def write_or_check(path: Path, content: str, check: bool) -> bool:
    current = path.read_text(encoding="utf-8") if path.exists() else ""
    if check:
        return current == content
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Vale rules from terminology registry")
    parser.add_argument("--check", action="store_true", help="Fail if generated Vale rules are stale")
    args = parser.parse_args()

    registry = load_registry()
    STYLES_DIR.mkdir(parents=True, exist_ok=True)
    expected = {
        TERMINOLOGY_YML: dump_yaml(terminology_rule(registry)),
        TONE_YML: dump_yaml(tone_rule(registry)),
    }

    stale = False
    for path, content in expected.items():
        ok = write_or_check(path, content, args.check)
        stale = stale or not ok

    if args.check and stale:
        print("Vale style rules are stale. Run `python scripts/build-style-rules.py`.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
