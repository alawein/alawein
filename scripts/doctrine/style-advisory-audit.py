#!/usr/bin/env python3
"""Advisory audit for comment tone and mathematical notation drift."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent
REGISTRY = ROOT / "docs" / "style" / "terminology-registry.yaml"
COMMENT_SUFFIXES = {".py", ".ts", ".tsx", ".js", ".jsx"}
MARKDOWN_SUFFIXES = {".md"}
SKIP_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".turbo",
    "__pycache__",
    ".venv",
    "venv",
    "coverage",
    "test-results",
    "playwright-report",
    "archive",
    "imports",
}


def load_registry() -> dict[str, Any]:
    return yaml.safe_load(REGISTRY.read_text(encoding="utf-8")) or {}


def iter_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if SKIP_DIRS.intersection(path.parts):
            continue
        rel = path.relative_to(root).as_posix()
        if rel.startswith("docs/archive/"):
            continue
        if path.suffix in COMMENT_SUFFIXES or path.suffix in MARKDOWN_SUFFIXES:
            files.append(path)
    return files


def extract_comment_lines(path: Path) -> list[tuple[int, str]]:
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    found: list[tuple[int, str]] = []
    for index, line in enumerate(lines, start=1):
        stripped = line.strip()
        if path.suffix == ".py":
            if stripped.startswith("#"):
                found.append((index, stripped.lstrip("# ").strip()))
        elif path.suffix in {".ts", ".tsx", ".js", ".jsx"}:
            if stripped.startswith("//"):
                found.append((index, stripped.lstrip("/ ").strip()))
    return found


def extract_markdown_lines(path: Path) -> list[tuple[int, str]]:
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    found: list[tuple[int, str]] = []
    in_fence = False
    for index, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence or not stripped or stripped.startswith("<!--") or stripped.endswith("-->"):
            continue
        found.append((index, stripped))
    return found


def main() -> int:
    parser = argparse.ArgumentParser(description="Run an advisory style audit")
    parser.add_argument("--repo-root", default=".", help="Repo root to audit")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    registry = load_registry()
    comment_tokens = [
        token.lower()
        for token in registry.get("linter_rules", {}).get("comments", {}).get("tokens", [])
    ]
    prefer_arrow = registry.get("math_notation_preferences", {}).get("prefer_arrow", "→")
    alerts: list[dict[str, Any]] = []

    for path in iter_files(repo_root):
        rel = path.relative_to(repo_root).as_posix()
        if path.suffix in COMMENT_SUFFIXES:
            for line_no, comment in extract_comment_lines(path):
                lower = comment.lower()
                for token in comment_tokens:
                    if token in lower:
                        alerts.append(
                            {
                                "kind": "comment-tone",
                                "path": rel,
                                "line": line_no,
                                "message": f"Low-signal comment term '{token}'",
                            }
                        )
        if path.suffix in MARKDOWN_SUFFIXES:
            for line_no, line in extract_markdown_lines(path):
                if "->" in line and not line.startswith("|") and "http" not in line:
                    alerts.append(
                        {
                            "kind": "math-notation",
                            "path": rel,
                            "line": line_no,
                            "message": f"Prefer '{prefer_arrow}' over ASCII flow arrows in prose where practical",
                        }
                    )

    if args.json:
        print(json.dumps({"repo_root": str(repo_root), "alerts": alerts}, indent=2))
    else:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
        print(f"Style advisory audit: {repo_root}")
        if not alerts:
            print("No advisory alerts.")
        else:
            for alert in alerts:
                print(f"{alert['kind']}: {alert['path']}:{alert['line']}: {alert['message']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
