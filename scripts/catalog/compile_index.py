#!/usr/bin/env python3
"""Compile catalog/index.yaml into catalog/repos.json (minimal SSOT → full manifest).

Human workflow:
  1. Edit catalog/index.yaml (four lanes; ~5 fields per repo).
  2. python scripts/catalog/build-catalog.py   # compiles index automatically

Standalone compile / export:
  python scripts/catalog/compile_index.py
  python scripts/catalog/compile_index.py --export
  python scripts/catalog/compile_index.py --check
"""
from __future__ import annotations

import argparse
import json
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
LANES_PATH = ROOT / "catalog" / "lanes.yaml"

TODAY = date.today().isoformat()
LANE_ORDER = ["platform", "ship", "lab", "work", "archive"]
BUCKET_ORDER = ["core", "apps", "lab", "sites", "work", "archive"]

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

SITES_SLUGS = {"meshal-web", "roka-oakland-hustle"}


def _require_yaml() -> None:
    if yaml is None:
        raise SystemExit("PyYAML required: pip install pyyaml")


def load_lane_config() -> dict[str, dict[str, Any]]:
    _require_yaml()
    data = yaml.safe_load(LANES_PATH.read_text(encoding="utf-8"))
    lanes = data.get("lanes") or {}
    return {str(k): v for k, v in lanes.items()}


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
        return str(existing).replace("\\", "/")
    if slug == "alawein" and bucket == "core":
        return "core/alawein"
    if bucket == "archive":
        return existing or f"_archive/2026-06-{slug}" if slug == "helios" else f"_archive/{slug}"
    return f"{bucket}/{slug}"


def stack_tags(stack: list[str]) -> list[str]:
    return [part.replace("-", " ").title() for part in stack[:4]]


def github_topics_from_stack(stack: list[str], slug: str) -> list[str]:
    topics = [s.lower() for s in stack if s.isascii()][:8]
    if slug not in topics:
        topics.insert(0, slug)
    return topics[:12]


def bucket_for_lane(lane: str, entry: dict[str, Any], lane_cfg: dict[str, dict[str, Any]]) -> str:
    cfg = lane_cfg.get(lane) or {}
    if "default_bucket" in cfg:
        if entry.get("site") or entry.get("bucket") == "sites" or entry.get("slug") in SITES_SLUGS:
            return str(cfg.get("site_bucket") or "sites")
        return str(cfg.get("default_bucket") or "apps")
    bucket = cfg.get("bucket")
    if not bucket:
        raise SystemExit(f"catalog/lanes.yaml: lane {lane!r} has no bucket mapping")
    return str(bucket)


def lane_for_bucket(bucket: str) -> str:
    if bucket == "core":
        return "platform"
    if bucket in {"apps", "sites"}:
        return "ship"
    if bucket in {"lab", "work", "archive"}:
        return bucket
    return bucket


def flatten_index(index: dict[str, Any]) -> list[tuple[str, str, dict[str, Any]]]:
    """Return (lane, bucket, entry) tuples."""
    allowed_buckets = load_buckets()
    lane_cfg = load_lane_config()
    out: list[tuple[str, str, dict[str, Any]]] = []

    lanes = index.get("lanes")
    if lanes:
        if not isinstance(lanes, dict):
            raise SystemExit("catalog/index.yaml: 'lanes' must be a mapping")
        for lane in LANE_ORDER:
            if lane not in lanes:
                continue
            entries = lanes[lane]
            if not isinstance(entries, list):
                raise SystemExit(f"catalog/index.yaml: lane {lane!r} must be a list")
            for entry in entries:
                if not isinstance(entry, dict):
                    raise SystemExit(f"catalog/index.yaml: entry in {lane!r} must be a mapping")
                slug = str(entry.get("slug") or "").strip()
                if not slug:
                    raise SystemExit(f"catalog/index.yaml: missing slug in lane {lane!r}")
                bucket = bucket_for_lane(lane, entry, lane_cfg)
                if bucket not in allowed_buckets:
                    raise SystemExit(f"catalog/index.yaml: lane {lane!r} maps to unknown bucket {bucket!r}")
                out.append((lane, bucket, entry))
        return out

    buckets = index.get("buckets") or {}
    if not isinstance(buckets, dict):
        raise SystemExit("catalog/index.yaml: expected 'lanes' or 'buckets' mapping")
    for bucket, entries in buckets.items():
        if bucket not in allowed_buckets:
            raise SystemExit(f"catalog/index.yaml: unknown bucket {bucket!r}")
        if not isinstance(entries, list):
            raise SystemExit(f"catalog/index.yaml: bucket {bucket!r} must be a list")
        lane = lane_for_bucket(bucket)
        for entry in entries:
            if not isinstance(entry, dict):
                raise SystemExit(f"catalog/index.yaml: entry in {bucket!r} must be a mapping")
            slug = str(entry.get("slug") or "").strip()
            if not slug:
                raise SystemExit(f"catalog/index.yaml: missing slug in bucket {bucket!r}")
            out.append((lane, bucket, entry))
    return out


def slim_entry(repo: dict[str, Any], *, bucket: str) -> dict[str, Any]:
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
    if bucket == "sites":
        slim["site"] = True
    return slim


def export_index(repos_data: dict[str, Any]) -> dict[str, Any]:
    lanes: dict[str, list[dict[str, Any]]] = {lane: [] for lane in LANE_ORDER}
    for repo in repos_data.get("repos") or []:
        bucket = str(repo.get("bucket") or "core")
        lane = lane_for_bucket(bucket)
        lanes.setdefault(lane, []).append(slim_entry(repo, bucket=bucket))

    sorted_lanes = {
        lane: sorted(lanes[lane], key=lambda x: x["slug"])
        for lane in LANE_ORDER
        if lanes.get(lane)
    }
    return {
        "schemaVersion": "1.0.0",
        "lastVerified": TODAY,
        "note": "Edit lanes below. build-catalog.py compiles to repos.json automatically.",
        "lanes": sorted_lanes,
    }


def compile_repo(
    lane: str,
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
            "lane": lane,
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

    for lane, bucket, entry in flatten_index(index):
        slug = entry["slug"]
        if slug in seen:
            raise SystemExit(f"duplicate slug in index.yaml: {slug}")
        seen.add(slug)
        compiled.append(compile_repo(lane, bucket, entry, prior_by_slug.get(slug)))

    missing = set(prior_by_slug) - seen
    if missing:
        names = ", ".join(sorted(missing)[:8])
        suffix = "..." if len(missing) > 8 else ""
        print(f"warning: {len(missing)} repos only in repos.json (not in index): {names}{suffix}")

    out = deepcopy(repos_data)
    out["lastVerified"] = index.get("lastVerified") or TODAY
    out["repos"] = sorted(compiled, key=lambda r: (r.get("lane", ""), r.get("bucket", ""), r.get("slug", "")))
    return out


def build_index_snapshot(compiled: dict[str, Any]) -> dict[str, Any]:
    rows = []
    for repo in compiled.get("repos") or []:
        rows.append(
            {
                "slug": repo.get("slug"),
                "lane": repo.get("lane"),
                "bucket": repo.get("bucket"),
                "name": repo.get("name"),
                "about": repo.get("canonical_description"),
                "status": repo.get("status"),
                "visibility": repo.get("visibility"),
                "url": repo.get("homepage"),
            }
        )
    return {
        "schemaVersion": "1.0.0",
        "generatedAt": TODAY,
        "count": len(rows),
        "repos": rows,
    }


def compile_index_file(*, check: bool = False, write: bool = True) -> int:
    """Compile INDEX_PATH → REPOS_PATH. Used by build-catalog and CLI."""
    _require_yaml()
    if not INDEX_PATH.is_file():
        return 0

    repos_data = json.loads(REPOS_PATH.read_text(encoding="utf-8"))
    index = yaml.safe_load(INDEX_PATH.read_text(encoding="utf-8"))
    compiled = compile_index(index, repos_data)
    rendered = json.dumps(compiled, indent=2, ensure_ascii=False) + "\n"
    current = REPOS_PATH.read_text(encoding="utf-8")

    if check:
        if rendered != current:
            print("catalog/repos.json is out of date with catalog/index.yaml; run compile_index.py")
            return 1
        return 0

    if write and rendered != current:
        REPOS_PATH.write_text(rendered, encoding="utf-8")
        count = len(compiled.get("repos") or [])
        print(f"compiled {INDEX_PATH.name} -> {REPOS_PATH.name} ({count} repos)")
    return 0


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
        count = sum(len(v) for v in index["lanes"].values())
        print(f"wrote {INDEX_PATH} ({count} repos, {len(index['lanes'])} lanes)")
        return 0

    return compile_index_file(check=args.check, write=not args.check)


if __name__ == "__main__":
    raise SystemExit(main())
