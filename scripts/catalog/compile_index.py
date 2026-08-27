#!/usr/bin/env python3
"""Compile catalog/index.yaml into catalog/repos.json (minimal SSOT → full manifest).

Human workflow:
  1. Edit catalog/index.yaml (grouped by bucket; ~5 fields per repo).
  2. python scripts/catalog/compile-index.py
  3. python scripts/catalog/build-catalog.py

Export existing repos.json into index.yaml:
  python scripts/catalog/compile-index.py --export
"""
from __future__ import annotations

import argparse
import json
import re
from copy import deepcopy
from datetime import date
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]

ROOT = Path(__file__).resolve().parents[2]
INDEX_PATH = ROOT / "catalog" / "index.yaml"
REPOS_PATH = ROOT / "catalog" / "repos.json"
BUCKETS_PATH = ROOT / "catalog" / "buckets.yaml"

TODAY = date.today().isoformat()

BUCKET_DEFAULTS: dict[str, dict[str, Any]] = {
    "core": {
        "type": "tooling",
        "surface": "monorepo",
        "domain": "governance",
        "lifecycle": "active",
        "theme_family": "midnight",
        "brand_family": "midnight",
        "version_source": "package.json",
    },
    "apps": {
        "type": "product",
        "surface": "web",
        "domain": "fitness",
        "lifecycle": "active",
        "theme_family": "forge",
        "brand_family": "forge",
        "version_source": "package.json",
    },
    "lab": {
        "type": "research",
        "surface": "monorepo",
        "domain": "scientific-computing",
        "lifecycle": "active",
        "theme_family": "wisdom",
        "brand_family": "wisdom",
        "version_source": "package.json",
    },
    "sites": {
        "type": "product",
        "surface": "web",
        "domain": "portfolio",
        "lifecycle": "maintained",
        "theme_family": "midnight",
        "brand_family": "midnight",
        "version_source": "package.json",
    },
    "work": {
        "type": "product",
        "surface": "monorepo",
        "domain": "portfolio",
        "lifecycle": "active",
        "theme_family": "midnight",
        "brand_family": "midnight",
        "version_source": "package.json",
    },
    "archive": {
        "type": "archive",
        "surface": "dataset",
        "domain": "scientific-computing",
        "lifecycle": "archived",
        "theme_family": "legacy",
        "brand_family": "legacy",
        "version_source": "package.json",
    },
}

SLUG_OVERRIDES: dict[str, dict[str, Any]] = {
    "alawein": {
        "type": "governance",
        "surface": "docs-hub",
        "domain": "governance",
        "stack": ["python", "markdown", "github-actions"],
    },
    "design-system": {
        "type": "infra",
        "surface": "monorepo",
        "domain": "design-system",
        "stack": ["typescript", "react", "turborepo", "storybook"],
    },
    "knowledge-base": {"type": "infra", "surface": "docs-hub", "domain": "governance"},
    "workspace-tools": {"type": "tooling", "surface": "cli", "domain": "governance"},
}


def _require_yaml() -> None:
    if yaml is None:
        raise SystemExit("PyYAML required: pip install pyyaml")


def load_buckets() -> set[str]:
    _require_yaml()
    data = yaml.safe_load(BUCKETS_PATH.read_text(encoding="utf-8"))
    return set((data.get("buckets") or {}).keys())


def slug_to_name(slug: str) -> str:
    if slug == "meshal-web":
        return "meshal.ai"
    return slug.replace("-", " ").title()


def normalize_local_path(bucket: str, slug: str, existing: str | None) -> str:
    if existing:
        return existing.replace("\\", "/")
    if slug == "alawein" and bucket == "core":
        return "core/alawein"
    if bucket == "archive":
        return existing or f"_archive/{slug}"
    return f"{bucket}/{slug}"


def stack_tags(stack: list[str]) -> list[str]:
    return [part.replace("-", " ").title() for part in stack[:4]]


def github_topics_from_stack(stack: list[str], slug: str) -> list[str]:
    topics = [s.lower() for s in stack if s.isascii()][:8]
    if slug not in topics:
        topics.insert(0, slug)
    return topics[:12]


def flatten_index(index: dict[str, Any]) -> list[tuple[str, dict[str, Any]]]:
    allowed = load_buckets()
    out: list[tuple[str, dict[str, Any]]] = []
    buckets = index.get("buckets") or {}
    if not isinstance(buckets, dict):
        raise SystemExit("catalog/index.yaml: 'buckets' must be a mapping")
    for bucket, entries in buckets.items():
        if bucket not in allowed:
            raise SystemExit(f"catalog/index.yaml: unknown bucket {bucket!r}")
        if not isinstance(entries, list):
            raise SystemExit(f"catalog/index.yaml: bucket {bucket!r} must be a list")
        for entry in entries:
            if not isinstance(entry, dict):
                raise SystemExit(f"catalog/index.yaml: entry in {bucket!r} must be a mapping")
            slug = str(entry.get("slug") or "").strip()
            if not slug:
                raise SystemExit(f"catalog/index.yaml: missing slug in bucket {bucket!r}")
            out.append((bucket, entry))
    return out


def export_index(repos_data: dict[str, Any]) -> dict[str, Any]:
    buckets: dict[str, list[dict[str, Any]]] = {}
    for repo in repos_data.get("repos") or []:
        bucket = repo.get("bucket") or "core"
        slug = repo["slug"]
        slim: dict[str, Any] = {
            "slug": slug,
            "about": repo.get("canonical_description") or repo.get("name") or slug,
        }
        name = repo.get("name")
        if name and name != slug_to_name(slug):
            slim["name"] = name
        status = repo.get("status")
        if status and status != "active":
            slim["status"] = status
        visibility = repo.get("visibility")
        if visibility and visibility != "private":
            slim["visibility"] = visibility
        homepage = str(repo.get("homepage") or "").strip()
        if homepage:
            slim["url"] = homepage
        if repo.get("catalog_groups") and "featured" in repo["catalog_groups"]:
            slim["featured"] = True
        legacy = repo.get("legacy_slugs") or []
        if legacy:
            slim["legacy_slugs"] = legacy
        buckets.setdefault(bucket, []).append(slim)

    order = ["core", "apps", "lab", "sites", "work", "archive"]
    sorted_buckets = {b: sorted(buckets[b], key=lambda x: x["slug"]) for b in order if b in buckets}
    for b in sorted(buckets.keys()):
        if b not in sorted_buckets:
            sorted_buckets[b] = sorted(buckets[b], key=lambda x: x["slug"])

    return {
        "schemaVersion": "1.0.0",
        "lastVerified": TODAY,
        "note": "Edit buckets below. Run compile-index.py then build-catalog.py.",
        "buckets": sorted_buckets,
    }


def compile_repo(
    bucket: str,
    entry: dict[str, Any],
    prior: dict[str, Any] | None,
) -> dict[str, Any]:
    slug = entry["slug"]
    defaults = deepcopy(BUCKET_DEFAULTS.get(bucket, BUCKET_DEFAULTS["core"]))
    defaults.update(SLUG_OVERRIDES.get(slug, {}))

    repo: dict[str, Any] = deepcopy(prior) if prior else {}

    name = str(entry.get("name") or repo.get("name") or slug_to_name(slug))
    about = str(entry.get("about") or entry.get("description") or repo.get("canonical_description") or name)
    status = str(entry.get("status") or repo.get("status") or defaults.get("lifecycle") or "active")
    visibility = str(entry.get("visibility") or repo.get("visibility") or "private")
    homepage = str(entry.get("url") or entry.get("homepage") or repo.get("homepage") or "").strip()

    stack = entry.get("stack") or repo.get("stack") or defaults.get("stack") or ["typescript"]
    if isinstance(stack, str):
        stack = [stack]

    repo.update(defaults)
    repo.update(
        {
            "name": name,
            "slug": slug,
            "legacy_slugs": entry.get("legacy_slugs") or repo.get("legacy_slugs") or [],
            "repo": f"alawein/{slug}",
            "local_path": normalize_local_path(bucket, slug, repo.get("local_path")),
            "bucket": bucket,
            "visibility": visibility,
            "owner": "alawein",
            "maintainer": "alawein-core",
            "docs_owner": "alawein-core",
            "status": status,
            "homepage": homepage or repo.get("homepage") or f"https://github.com/alawein/{slug}",
            "canonical_description": about,
            "tags": repo.get("tags") or stack_tags(stack),
            "github_topics": repo.get("github_topics") or github_topics_from_stack(stack, slug),
            "github_custom_properties": repo.get("github_custom_properties")
            or {
                "lifecycle": status if status in {"active", "maintained", "archived"} else "active",
                "compliance": "public-data",
                "repo_archetype": "vite-react-spa" if defaults.get("surface") == "web" else "monorepo",
                "docs_maturity": "managed",
                "brand_family": defaults.get("brand_family", "midnight"),
            },
            "depends_on": repo.get("depends_on") or (["alawein"] if slug != "alawein" else []),
            "provides": repo.get("provides") or [],
            "stack": stack,
            "last_verified": entry.get("last_verified") or repo.get("last_verified") or TODAY,
            "audience": repo.get("audience") or ["internal"],
        }
    )

    if entry.get("featured"):
        groups = set(repo.get("catalog_groups") or [])
        groups.add("featured")
        repo["catalog_groups"] = sorted(groups)
    elif "catalog_groups" not in repo:
        repo["catalog_groups"] = []

    if bucket == "archive" or status == "archived":
        repo["type"] = "archive"
        repo["lifecycle"] = "archived"
        repo["status"] = "archived"

    if entry.get("domain"):
        repo["domain"] = entry["domain"]
    if entry.get("type"):
        repo["type"] = entry["type"]

    return repo


def compile_index(index: dict[str, Any], repos_data: dict[str, Any]) -> dict[str, Any]:
    prior_by_slug = {r["slug"]: r for r in repos_data.get("repos") or []}
    compiled: list[dict[str, Any]] = []
    seen: set[str] = set()

    for bucket, entry in flatten_index(index):
        slug = entry["slug"]
        if slug in seen:
            raise SystemExit(f"duplicate slug in index.yaml: {slug}")
        seen.add(slug)
        compiled.append(compile_repo(bucket, entry, prior_by_slug.get(slug)))

    missing = set(prior_by_slug) - seen
    if missing:
        print(f"warning: {len(missing)} repos only in repos.json (not in index): {', '.join(sorted(missing)[:8])}...")

    out = deepcopy(repos_data)
    out["lastVerified"] = index.get("lastVerified") or TODAY
    out["repos"] = sorted(compiled, key=lambda r: (r.get("bucket", ""), r.get("slug", "")))
    return out


def dump_yaml(path: Path, data: dict[str, Any]) -> None:
    _require_yaml()
    path.write_text(
        yaml.safe_dump(data, sort_keys=False, allow_unicode=True, default_flow_style=False),
        encoding="utf-8",
    )


def main(argv: list[str] | None = None) -> int:
    _require_yaml()
    parser = argparse.ArgumentParser(description="Compile catalog/index.yaml ↔ repos.json")
    parser.add_argument("--export", action="store_true", help="Write catalog/index.yaml from repos.json")
    parser.add_argument("--check", action="store_true", help="Exit 1 if repos.json would change")
    args = parser.parse_args(argv)

    repos_data = json.loads(REPOS_PATH.read_text(encoding="utf-8"))

    if args.export:
        index = export_index(repos_data)
        dump_yaml(INDEX_PATH, index)
        print(f"wrote {INDEX_PATH} ({sum(len(v) for v in index['buckets'].values())} repos)")
        return 0

    if not INDEX_PATH.is_file():
        raise SystemExit(f"missing {INDEX_PATH}; run with --export first")

    index = yaml.safe_load(INDEX_PATH.read_text(encoding="utf-8"))
    compiled = compile_index(index, repos_data)
    rendered = json.dumps(compiled, indent=2, ensure_ascii=False) + "\n"
    current = REPOS_PATH.read_text(encoding="utf-8")

    if args.check:
        if rendered != current:
            print("catalog/repos.json is out of date; run compile-index.py")
            return 1
        print("catalog/repos.json matches index.yaml")
        return 0

    REPOS_PATH.write_text(rendered, encoding="utf-8")
    count = len(compiled.get("repos") or [])
    print(f"wrote {REPOS_PATH} ({count} repos from {INDEX_PATH.name})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
