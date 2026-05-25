#!/usr/bin/env python3
"""Version-coherence check (doctrine D2).

A repository has one version anchor: the latest git tag and the top CHANGELOG
entry are canonical and must agree. Every other version string -- the
`pyproject.toml`/`package.json` `version`, a package `__init__.py`
`__version__`, and CLI `--version` output -- derives from that anchor. This
checker reads every source that is present, normalizes it, and reports a
mismatch when they disagree.

The check is warn-only by default (exit 0) so it does not block a gate while
the fleet converges. Pass --strict to exit 1 on any mismatch, which is how the
reusable CI wires it once repos are coherent.

Usage:
    python version-coherence.py [--root <path>] [--strict]

Exit codes:
    0 -- versions coherent, or mismatch found in warn-only mode
    1 -- mismatch found and --strict was passed
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

try:  # Python 3.11+ ships tomllib; fall back gracefully if unavailable.
    import tomllib  # type: ignore[import-not-found]
except ModuleNotFoundError:  # pragma: no cover -- 3.12 always has tomllib
    tomllib = None  # type: ignore[assignment]

# A released CHANGELOG heading: `## [1.2.3] - 2026-01-01`. The version is
# captured; an `[Unreleased]` heading is intentionally skipped by the readers.
_CHANGELOG_HEADING_RE = re.compile(r"^##\s*\[(?P<ver>[^\]]+)\]")
_VERSION_RE = re.compile(r"\b\d+\.\d+\.\d+(?:[.-][0-9A-Za-z.]+)?\b")
_INIT_VERSION_RE = re.compile(
    r"""^__version__\s*=\s*['"](?P<ver>[^'"]+)['"]""", re.MULTILINE
)


def normalize(version: str | None) -> str | None:
    """Strip a leading `v` and surrounding whitespace from a version string."""
    if version is None:
        return None
    version = version.strip()
    if not version:
        return None
    if version[0] in {"v", "V"} and len(version) > 1 and version[1].isdigit():
        version = version[1:]
    return version


def read_pyproject_version(root: Path) -> str | None:
    path = root / "pyproject.toml"
    if not path.exists() or tomllib is None:
        return None
    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except (tomllib.TOMLDecodeError, OSError):
        return None
    project = data.get("project")
    if isinstance(project, dict) and project.get("version"):
        return normalize(str(project["version"]))
    # Poetry layout.
    tool = data.get("tool")
    if isinstance(tool, dict):
        poetry = tool.get("poetry")
        if isinstance(poetry, dict) and poetry.get("version"):
            return normalize(str(poetry["version"]))
    return None


def read_package_json_version(root: Path) -> str | None:
    path = root / "package.json"
    if not path.exists():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None
    if isinstance(data, dict) and data.get("version"):
        return normalize(str(data["version"]))
    return None


def read_init_version(root: Path) -> str | None:
    """Return the first `__version__` found in a shallow package scan.

    Looks at `<root>/__init__.py`, `<root>/src/*/__init__.py`, and
    `<root>/*/__init__.py` (one level deep) so the common src-layout and
    flat-package layouts are both covered without walking the whole tree.
    """
    candidates: list[Path] = []
    direct = root / "__init__.py"
    if direct.exists():
        candidates.append(direct)
    for parent in (root, root / "src"):
        if parent.is_dir():
            for child in sorted(parent.iterdir()):
                if child.is_dir():
                    init = child / "__init__.py"
                    if init.exists():
                        candidates.append(init)
    for path in candidates:
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        match = _INIT_VERSION_RE.search(text)
        if match:
            return normalize(match.group("ver"))
    return None


def read_changelog_version(root: Path) -> str | None:
    """Return the top *released* version from CHANGELOG.md.

    Skips an `[Unreleased]` heading so the canonical comparison uses the most
    recent shipped version.
    """
    path = root / "CHANGELOG.md"
    if not path.exists():
        return None
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None
    for line in text.splitlines():
        match = _CHANGELOG_HEADING_RE.match(line.strip())
        if not match:
            continue
        ver = match.group("ver").strip()
        if ver.lower() == "unreleased":
            continue
        normalized = normalize(ver)
        # Only treat it as a version if it parses like one.
        if normalized and _VERSION_RE.search(normalized):
            return normalized
    return None


def read_latest_git_tag(root: Path) -> str | None:
    """Return the most recent semver-looking git tag, normalized.

    Prefers `git describe --tags --abbrev=0`; if that fails (no annotated tag
    reachable), falls back to the highest tag from `git tag`.
    """
    try:
        result = subprocess.run(
            ["git", "describe", "--tags", "--abbrev=0"],
            cwd=root,
            capture_output=True,
            text=True,
            check=False,
        )
    except (OSError, ValueError):
        return None
    if result.returncode == 0 and result.stdout.strip():
        return normalize(result.stdout.strip())

    listing = subprocess.run(
        ["git", "tag", "--list"],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )
    if listing.returncode != 0:
        return None
    tags = [t.strip() for t in listing.stdout.splitlines() if t.strip()]
    semver_tags = [t for t in tags if _VERSION_RE.search(t)]
    if not semver_tags:
        return None

    def _key(tag: str) -> tuple[int, ...]:
        nums = re.findall(r"\d+", tag)
        return tuple(int(n) for n in nums[:3]) if nums else (0,)

    return normalize(sorted(semver_tags, key=_key)[-1])


def collect_versions(root: Path) -> dict[str, str]:
    """Return {source_label: normalized_version} for every present source."""
    sources = {
        "pyproject.toml": read_pyproject_version(root),
        "package.json": read_package_json_version(root),
        "__init__.py": read_init_version(root),
        "CHANGELOG.md": read_changelog_version(root),
        "git-tag": read_latest_git_tag(root),
    }
    return {label: ver for label, ver in sources.items() if ver}


def find_mismatches(versions: dict[str, str]) -> list[str]:
    """Return human-readable mismatch lines, empty when all sources agree.

    Fewer than two sources can never disagree, so an empty list is returned.
    """
    distinct = set(versions.values())
    if len(distinct) <= 1:
        return []
    detail = ", ".join(f"{label}={ver}" for label, ver in sorted(versions.items()))
    return [f"version mismatch across sources: {detail}"]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Check repository version coherence.")
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Repository root to check. Defaults to the current directory.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 on any mismatch (default is warn-only, exit 0).",
    )
    args = parser.parse_args(argv)

    root = args.root
    if not root.is_dir():
        print(f"error: root not a directory: {root}", file=sys.stderr)
        return 2

    versions = collect_versions(root)
    if not versions:
        print("version-coherence: no version sources found; nothing to check.")
        return 0

    mismatches = find_mismatches(versions)
    if not mismatches:
        agreed = next(iter(versions.values()))
        print(f"version-coherence: OK ({agreed}) across {', '.join(sorted(versions))}.")
        return 0

    label = "ERROR" if args.strict else "WARN"
    for line in mismatches:
        print(f"[{label}] {line}", file=sys.stderr)
    return 1 if args.strict else 0


if __name__ == "__main__":
    sys.exit(main())
