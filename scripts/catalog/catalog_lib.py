#!/usr/bin/env python3
"""Shared helpers for the Alawein catalog toolchain."""

from __future__ import annotations

import json
from collections import Counter
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
WORKSPACE_ROOT = ROOT.parent
CATALOG_DIR = ROOT / "catalog"
GENERATED_DIR = CATALOG_DIR / "generated"
SCHEMAS_DIR = ROOT / "schemas"
PROJECTS_JSON = ROOT / "projects.json"
PROFILE_FROM_GUIDES = ROOT / "profile-from-guides.yaml"
WORKSPACE_YAML = WORKSPACE_ROOT / "knowledge-base" / "WORKSPACE.yaml"
INVENTORY_JSON = ROOT / "docs" / "archive" / "desktop-repo-inventory.json"
STABLE_WORKSPACE_ROOTS = [
    ".",
    "../morphism-systems",
    "../blackmalejournal",
]

REQUIRED_REPO_FIELDS = [
    "name",
    "slug",
    "repo",
    "local_path",
    "type",
    "surface",
    "stack",
    "domain",
    "lifecycle",
    "visibility",
    "owner",
    "maintainer",
    "docs_owner",
    "theme_family",
    "brand_family",
    "status",
    "canonical_description",
    "github_topics",
    "github_custom_properties",
    "depends_on",
    "provides",
    "version_source",
    "last_verified",
]
CORE_AUTOMATION_REPOS = {
    "alawein",
    "design-system",
    "knowledge-base",
    "workspace-tools",
}
REQUIRED_GITHUB_ACTIONS_SETTINGS_FIELDS = [
    "default_workflow_permissions",
    "can_approve_pull_request_reviews",
]
REQUIRED_RELEASE_AUTOMATION_FIELDS = [
    "mode",
    "supports_release_prs",
    "publishes_packages",
    "requires_npm_token",
]

README_SECTIONS = {
    "product": [
        "Value proposition",
        "Demo and status",
        "Quick start",
        "Architecture",
        "Deployment",
        "Docs map",
        "Ownership",
    ],
    "tooling": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Consumers",
        "Release and versioning",
    ],
    "infra": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Consumers",
        "Release and versioning",
    ],
    "governance": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Consumers",
        "Release and versioning",
    ],
    "research": [
        "Abstract",
        "Status",
        "Runtime requirements",
        "Reproducibility",
        "Datasets",
        "Docs map",
    ],
    "archive": [
        "Status",
        "Historical purpose",
        "Constraints",
        "Retrieval notes",
    ],
}


@dataclass(frozen=True)
class ValidationIssue:
    level: str
    message: str


def today_iso() -> str:
    return date.today().isoformat()


def catalog_timestamp(catalogs: dict[str, Any]) -> str:
    candidates = [
        str(manifest.get("lastVerified"))
        for manifest in catalogs.values()
        if isinstance(manifest, dict) and manifest.get("lastVerified")
    ]
    return max(candidates) if candidates else today_iso()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def load_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def load_frontmatter_yaml(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if lines and lines[0].lstrip("\ufeff") == "---":
        for index in range(1, len(lines)):
            if lines[index] == "---":
                payload = "\n".join(lines[index + 1 :]).strip()
                return _first_yaml_doc(payload)
    return _first_yaml_doc(text)


def _first_yaml_doc(payload: str) -> dict[str, Any]:
    # Use safe_load_all so a stray `---` inside the body does not trigger
    # yaml.ComposerError; we only care about the first document.
    if not payload:
        return {}
    docs = list(yaml.safe_load_all(payload))
    first = docs[0] if docs else {}
    return first or {}


def dump_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8", newline="\n")


def load_catalogs() -> dict[str, Any]:
    return {
        "repos": load_json(CATALOG_DIR / "repos.json"),
        "taxonomy": load_json(CATALOG_DIR / "taxonomy.json"),
        "templates": load_json(CATALOG_DIR / "templates.json"),
        "assets": load_json(CATALOG_DIR / "assets.json"),
        "workflows": load_json(CATALOG_DIR / "workflows.json"),
        "automations": load_json(CATALOG_DIR / "automations.json"),
        "components": load_json(CATALOG_DIR / "components.json"),
    }


def repo_entries(catalogs: dict[str, Any]) -> list[dict[str, Any]]:
    return list(catalogs["repos"].get("repos", []))


def projected_workspace_manifest(repos: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "repos": {
            repo["slug"]: {
                "path": repo["local_path"],
                "description": repo["canonical_description"],
                "role": repo["type"],
                "status": repo["status"],
            }
            for repo in repos
        }
    }


def workspace_manifest(repos: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    if not WORKSPACE_YAML.exists():
        return projected_workspace_manifest(repos or [])
    return load_yaml(WORKSPACE_YAML) or {}


def current_projects_manifest() -> dict[str, Any]:
    if not PROJECTS_JSON.exists():
        return {}
    return load_json(PROJECTS_JSON)


def profile_config() -> dict[str, Any]:
    if not PROFILE_FROM_GUIDES.exists():
        return {}
    return load_frontmatter_yaml(PROFILE_FROM_GUIDES)


def current_inventory_manifest() -> dict[str, Any]:
    if not INVENTORY_JSON.exists():
        return {}
    return load_json(INVENTORY_JSON)


def archetype_for_repo(repo: dict[str, Any]) -> str:
    custom = repo.get("github_custom_properties") or {}
    return str(custom.get("repo_archetype") or "unknown")


def compliance_for_repo(repo: dict[str, Any]) -> str:
    custom = repo.get("github_custom_properties") or {}
    return str(custom.get("compliance") or "")


def filter_repos(entries: list[dict[str, Any]], group: str) -> list[dict[str, Any]]:
    return [entry for entry in entries if group in (entry.get("catalog_groups") or [])]


def repo_index_by_slug(entries: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {str(entry["slug"]): entry for entry in entries}


def project_entry_from_repo(repo: dict[str, Any]) -> dict[str, Any]:
    entry = {
        "name": repo["name"],
        "slug": repo["slug"],
        "repo": repo["repo"],
        "description": repo["canonical_description"],
        "tags": repo.get("tags") or repo.get("stack") or [],
        "category": repo["lifecycle"],
    }
    if repo.get("legacy_slugs"):
        entry["legacy_slugs"] = repo["legacy_slugs"]
    if repo.get("homepage"):
        entry["url"] = repo["homepage"]
    if repo.get("portfolio_domain"):
        entry["portfolio_domain"] = repo["portfolio_domain"]
    return entry


def research_entry_from_repo(repo: dict[str, Any]) -> dict[str, Any]:
    entry = {
        "name": repo["name"],
        "slug": repo["slug"],
        "repo": repo["repo"],
        "domain": repo.get("research_domain") or repo["canonical_description"],
    }
    if repo.get("legacy_slugs"):
        entry["legacy_slugs"] = repo["legacy_slugs"]
    if repo.get("homepage"):
        entry["url"] = repo["homepage"]
    if repo["lifecycle"] == "archived":
        entry["category"] = "archived"
    return entry


def infrastructure_entry_from_repo(repo: dict[str, Any]) -> dict[str, Any]:
    entry = {
        "name": repo["name"],
        "slug": repo["slug"],
        "repo": repo["repo"],
        "purpose": repo["canonical_description"],
    }
    if repo.get("legacy_slugs"):
        entry["legacy_slugs"] = repo["legacy_slugs"]
    if repo.get("homepage"):
        entry["url"] = repo["homepage"]
    if repo.get("status"):
        entry["status"] = repo["status"]
    return entry


def package_entries_from_components(catalogs: dict[str, Any]) -> list[dict[str, Any]]:
    packages: list[dict[str, Any]] = []
    for component in catalogs["components"].get("components", []):
        registry = component.get("registry")
        if registry not in {"npm", "pypi"}:
            continue
        url = component.get("url")
        if not url:
            continue
        packages.append(
            {
                "name": component["name"],
                "registry": registry,
                "url": url,
                "description": component["description"],
            }
        )
    return packages


def derive_projects_manifest(catalogs: dict[str, Any]) -> dict[str, Any]:
    repos = repo_entries(catalogs)
    generated_at = catalog_timestamp(catalogs)
    return {
        "$schema": "./projects.schema.json",
        "lastUpdated": generated_at,
        "featured": [project_entry_from_repo(repo) for repo in filter_repos(repos, "featured")],
        "notion_sync": [
            project_entry_from_repo(repo) for repo in filter_repos(repos, "notion_sync")
        ],
        "research": [research_entry_from_repo(repo) for repo in filter_repos(repos, "research")],
        "infrastructure": [
            infrastructure_entry_from_repo(repo)
            for repo in filter_repos(repos, "infrastructure")
        ],
        "packages": package_entries_from_components(catalogs),
    }


def repo_summary(repo: dict[str, Any]) -> dict[str, Any]:
    return {
        "name": repo["name"],
        "slug": repo["slug"],
        "repo": repo["repo"],
        "type": repo["type"],
        "surface": repo["surface"],
        "domain": repo["domain"],
        "lifecycle": repo["lifecycle"],
        "visibility": repo["visibility"],
        "theme_family": repo["theme_family"],
        "brand_family": repo["brand_family"],
        "stack": repo.get("stack") or [],
        "audience": repo.get("audience") or [],
        "homepage": repo.get("homepage") or "",
        "description": repo["canonical_description"],
        "topics": repo.get("github_topics") or [],
        "maintainer": repo["maintainer"],
        "docs_owner": repo["docs_owner"],
        "local_path": repo["local_path"],
        "catalog_groups": repo.get("catalog_groups") or [],
        "depends_on": repo.get("depends_on") or [],
        "provides": repo.get("provides") or [],
        "version_source": repo["version_source"],
        "repo_archetype": archetype_for_repo(repo),
        "compliance": compliance_for_repo(repo),
        "github_actions_settings": repo.get("github_actions_settings") or {},
        "release_automation": repo.get("release_automation") or {},
    }


def build_featured_collections(repos: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    featured = [repo for repo in repos if "featured" in (repo.get("catalog_groups") or [])]
    return {
        "hiring": [repo_summary(repo) for repo in repos if "hiring" in (repo.get("audience") or [])][:8]
        or [repo_summary(repo) for repo in featured[:8]],
        "clients": [repo_summary(repo) for repo in repos if "client" in (repo.get("audience") or [])][:8],
        "research": [repo_summary(repo) for repo in repos if repo["type"] == "research"][:8],
        "internal_ops": [
            repo_summary(repo)
            for repo in repos
            if repo["type"] in {"tooling", "infra", "governance"}
        ][:8],
    }


def build_filter_options(repos: list[dict[str, Any]]) -> dict[str, list[str]]:
    def distinct(values: list[str]) -> list[str]:
        return sorted({value for value in values if value})

    return {
        "type": distinct([repo["type"] for repo in repos]),
        "surface": distinct([repo["surface"] for repo in repos]),
        "domain": distinct([repo["domain"] for repo in repos]),
        "lifecycle": distinct([repo["lifecycle"] for repo in repos]),
        "visibility": distinct([repo["visibility"] for repo in repos]),
        "theme_family": distinct([repo["theme_family"] for repo in repos]),
        "brand_family": distinct([repo["brand_family"] for repo in repos]),
        "stack": distinct([value for repo in repos for value in repo.get("stack") or []]),
        "audience": distinct([value for repo in repos for value in repo.get("audience") or []]),
    }


def build_asset_assignments(repos: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    assignments: dict[str, dict[str, Any]] = {}
    for repo in repos:
        if repo["surface"] not in {"web", "docs-hub", "service"}:
            continue
        assignments[repo["slug"]] = {
            "logo_source": f"design-system/packages/icons/dist/brand/{repo['slug']}/logo-light.svg",
            "banner_source": f"design-system/packages/icons/dist/brand/{repo['slug']}/repo-banner.svg",
            "screenshot_folder": f"{repo['local_path']}/docs/screenshots",
            "theme_family": repo["theme_family"],
            "social_preview_image": f"design-system/packages/icons/dist/brand/{repo['slug']}/social-card.svg",
            "favicon_status": "generated",
        }
    return assignments


def build_github_metadata_feed(
    repos: list[dict[str, Any]],
    generated_at: str,
) -> dict[str, Any]:
    return {
        "generatedAt": generated_at,
        "repos": [
            {
                "slug": repo["slug"],
                "repo": repo["repo"],
                "description": repo["canonical_description"],
                "homepage": repo.get("homepage") or "",
                "topics": repo.get("github_topics") or [],
                "custom_properties": repo.get("github_custom_properties") or {},
                "actions_settings": repo.get("github_actions_settings") or {},
                "release_automation": repo.get("release_automation") or {},
            }
            for repo in repos
        ],
    }


def build_inventory_manifest(
    repos: list[dict[str, Any]],
    generated_at: str,
) -> dict[str, Any]:
    golden_references: dict[str, dict[str, str]] = {}
    for repo in repos:
        archetype = archetype_for_repo(repo)
        if archetype == "unknown" or archetype in golden_references:
            continue
        golden_references[archetype] = {
            "repo": repo["repo"],
            "local_folder": repo["local_path"],
            "notes": f"Derived from catalog entry {repo['slug']}",
        }
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "generated": generated_at,
        "workspace_roots": STABLE_WORKSPACE_ROOTS,
        "golden_references": golden_references,
        "excluded_paths": [
            "node_modules",
            ".cache",
            ".pytest_cache",
            ".venv",
            ".mypy_cache",
        ],
        "repos": [
            {
                "folder": repo["local_path"],
                "remote_slug": repo["repo"],
                "archetype": archetype_for_repo(repo),
                "tier": repo["type"],
                "stack": ", ".join(repo.get("stack") or []),
            }
            for repo in repos
        ],
    }


def inventory_reconciliation(repos: list[dict[str, Any]]) -> dict[str, Any]:
    workspace = workspace_manifest(repos)
    workspace_repos = workspace.get("repos") or {}
    workspace_keys = set(workspace_repos.keys())
    catalog_keys = {repo["slug"] for repo in repos}

    inventory = current_inventory_manifest()
    inventory_rows = inventory.get("repos") or []
    inventory_tokens = {
        str(row.get("remote_slug") or row.get("folder"))
        for row in inventory_rows
        if row.get("remote_slug") or row.get("folder")
    }

    legacy_aliases = {
        alias
        for repo in repos
        for alias in (repo.get("legacy_slugs") or [])
    }

    path_mismatches = []
    for repo in repos:
        workspace_entry = workspace_repos.get(repo["slug"])
        if not workspace_entry:
            continue
        workspace_path = str(workspace_entry.get("path") or "")
        if workspace_path and workspace_path != repo["local_path"]:
            path_mismatches.append(
                {
                    "slug": repo["slug"],
                    "catalog_path": repo["local_path"],
                    "workspace_path": workspace_path,
                }
            )

    return {
        "catalog_only": sorted(catalog_keys - workspace_keys),
        "workspace_only": sorted(workspace_keys - catalog_keys),
        "stale_inventory_entries": sorted(
            token
            for token in inventory_tokens
            if token not in catalog_keys and token not in legacy_aliases and token not in {repo["repo"] for repo in repos}
        ),
        "path_mismatches": path_mismatches,
    }


def derive_discovery_feed(catalogs: dict[str, Any]) -> dict[str, Any]:
    repos = repo_entries(catalogs)
    reconciliation = inventory_reconciliation(repos)
    generated_at = catalog_timestamp(catalogs)
    return {
        "generatedAt": generated_at,
        "summary": {
            "repoCount": len(repos),
            "typeCounts": dict(Counter(repo["type"] for repo in repos)),
            "lifecycleCounts": dict(Counter(repo["lifecycle"] for repo in repos)),
        },
        "filters": build_filter_options(repos),
        "featuredCollections": build_featured_collections(repos),
        "repos": [repo_summary(repo) for repo in repos],
        "collections": {
            "templates": catalogs["templates"].get("templates", []),
            "assets": catalogs["assets"].get("assets", []),
            "workflows": catalogs["workflows"].get("workflows", []),
            "automations": catalogs["automations"].get("automations", []),
            "components": catalogs["components"].get("components", []),
        },
        "taxonomy": catalogs["taxonomy"],
        "assetAssignments": build_asset_assignments(repos),
        "githubMetadata": build_github_metadata_feed(repos, generated_at)["repos"],
        "inventoryReconciliation": reconciliation,
        "projectSwitcher": {
            "featured": [repo_summary(repo) for repo in filter_repos(repos, "featured")],
            "entrypoints": {
                "profile": "Use GitHub profile README and pinned repos as curated static entry points.",
                "org": "Use the organization profile README as a directory, not as the primary selector.",
                "catalog": "/catalog",
            },
        },
    }


def headings_in_markdown(path: Path) -> list[str]:
    headings: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("#"):
            headings.append(line.lstrip("#").strip())
    return headings


def validate_catalogs(catalogs: dict[str, Any]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    repos = repo_entries(catalogs)
    taxonomy = catalogs["taxonomy"].get("axes", {})
    profile = profile_config()

    slug_counts = Counter(repo.get("slug") for repo in repos)
    duplicate_slugs = sorted(slug for slug, count in slug_counts.items() if slug and count > 1)
    for slug in duplicate_slugs:
        issues.append(ValidationIssue("error", f"Duplicate repo slug '{slug}' in catalog/repos.json"))

    repo_counts = Counter(repo.get("repo") for repo in repos)
    duplicate_repos = sorted(value for value, count in repo_counts.items() if value and count > 1)
    for value in duplicate_repos:
        issues.append(ValidationIssue("error", f"Duplicate repo remote '{value}' in catalog/repos.json"))

    repo_index = repo_index_by_slug(repos)
    profile_pins = profile.get("profile_pins") or []
    if profile_pins and not isinstance(profile_pins, list):
        issues.append(ValidationIssue("error", "profile-from-guides.yaml profile_pins must be a list"))
        profile_pins = []
    seen_profile_pins: set[str] = set()
    for raw_slug in profile_pins:
        slug = str(raw_slug).strip()
        if not slug:
            issues.append(
                ValidationIssue("error", "profile-from-guides.yaml profile_pins must contain non-empty slugs")
            )
            continue
        if slug in seen_profile_pins:
            issues.append(
                ValidationIssue("error", f"profile-from-guides.yaml profile_pins contains duplicate slug '{slug}'")
            )
            continue
        seen_profile_pins.add(slug)

        repo = repo_index.get(slug)
        if repo is None:
            issues.append(
                ValidationIssue("error", f"profile-from-guides.yaml profile_pins references unknown repo slug '{slug}'")
            )
            continue
        if not str(repo.get("canonical_description") or "").strip():
            issues.append(
                ValidationIssue("error", f"Pinned repo '{slug}' is missing canonical_description in catalog/repos.json")
            )
        if not str(repo.get("homepage") or "").strip():
            issues.append(
                ValidationIssue("error", f"Pinned repo '{slug}' is missing homepage in catalog/repos.json")
            )

    for repo in repos:
        missing = [field for field in REQUIRED_REPO_FIELDS if field not in repo]
        if missing:
            issues.append(
                ValidationIssue(
                    "error",
                    f"Repo '{repo.get('slug', '<unknown>')}' missing required fields: {', '.join(missing)}",
                )
            )
        if len(repo.get("github_topics") or []) > 20:
            issues.append(
                ValidationIssue(
                    "error",
                    f"Repo '{repo['slug']}' exceeds GitHub topic limit with {len(repo['github_topics'])} topics",
                )
            )
        repo_type = repo.get("type")
        if repo_type not in set(taxonomy.get("type", [])):
            issues.append(
                ValidationIssue("error", f"Repo '{repo['slug']}' uses unknown type '{repo_type}'")
            )
        if repo.get("surface") not in set(taxonomy.get("surface", [])):
            issues.append(
                ValidationIssue(
                    "error", f"Repo '{repo['slug']}' uses unknown surface '{repo.get('surface')}'"
                )
            )
        if repo.get("domain") not in set(taxonomy.get("domain", [])):
            issues.append(
                ValidationIssue(
                    "error", f"Repo '{repo['slug']}' uses unknown domain '{repo.get('domain')}'"
                )
            )
        if repo.get("slug") in CORE_AUTOMATION_REPOS:
            actions_settings = repo.get("github_actions_settings") or {}
            missing_actions_settings = [
                field
                for field in REQUIRED_GITHUB_ACTIONS_SETTINGS_FIELDS
                if field not in actions_settings
            ]
            if missing_actions_settings:
                issues.append(
                    ValidationIssue(
                        "error",
                        f"Core repo '{repo['slug']}' missing GitHub Actions settings fields: {', '.join(missing_actions_settings)}",
                    )
                )
            release_automation = repo.get("release_automation") or {}
            missing_release_automation = [
                field
                for field in REQUIRED_RELEASE_AUTOMATION_FIELDS
                if field not in release_automation
            ]
            if missing_release_automation:
                issues.append(
                    ValidationIssue(
                        "error",
                        f"Core repo '{repo['slug']}' missing release automation fields: {', '.join(missing_release_automation)}",
                    )
                )

    repo_slugs = {repo["slug"] for repo in repos}
    for manifest_name, key in (
        ("templates", "templates"),
        ("assets", "assets"),
        ("workflows", "workflows"),
        ("automations", "automations"),
        ("components", "components"),
    ):
        for item in catalogs[manifest_name].get(key, []):
            owner = item.get("owner")
            if owner and owner not in repo_slugs and owner not in {"alawein-core", "morphism-systems"}:
                issues.append(
                    ValidationIssue(
                        "warning",
                        f"{manifest_name} item '{item.get('slug')}' references non-catalog owner '{owner}'",
                    )
                )

    templates_dir = ROOT / "templates" / "scaffolding"
    template_to_sections = {
        "README.product.md": README_SECTIONS["product"],
        "README.tooling.md": README_SECTIONS["tooling"],
        "README.research.md": README_SECTIONS["research"],
    }
    for filename, required in template_to_sections.items():
        path = templates_dir / filename
        headings = headings_in_markdown(path)
        missing = [heading for heading in required if heading not in headings]
        if missing:
            issues.append(
                ValidationIssue(
                    "error",
                    f"Template '{filename}' is missing required sections: {', '.join(missing)}",
                )
            )

    reconciliation = inventory_reconciliation(repos)
    for slug in reconciliation["catalog_only"]:
        issues.append(
            ValidationIssue(
                "warning",
                f"Catalog repo '{slug}' is not present in knowledge-base/WORKSPACE.yaml",
            )
        )
    for slug in reconciliation["workspace_only"]:
        issues.append(
            ValidationIssue(
                "warning",
                f"WORKSPACE.yaml repo '{slug}' is not present in catalog/repos.json",
            )
        )
    for token in reconciliation["stale_inventory_entries"]:
        issues.append(
            ValidationIssue(
                "warning",
                f"desktop-repo-inventory.json contains stale entry '{token}'",
            )
        )

    return issues
