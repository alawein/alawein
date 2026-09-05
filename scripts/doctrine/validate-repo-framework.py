#!/usr/bin/env python3
"""Validate public README identity and private Repo Framework record cards.

This validator hardcodes the doctrine's five enums (Status, Category, Owner,
Visibility, Next action) as constants below. The doctrine source of truth
lives in docs/governance/repo-framework.md; when that file's enums change,
the constants here MUST be updated in the same commit. There is no automated
link between the two. The exhaustiveness tests assert the constants are
consistent with themselves, not consistent with the doctrine.

Usage:
    Workspace mode:  python validate-repo-framework.py [--root <path>]
    Single-repo:     python validate-repo-framework.py --repo <path>
                         --repo-slug <owner/name>
                         [--catalog catalog/repos.json]
                         [--registry projects.json]

    Prefer --catalog (SSOT). --registry remains for backward compatibility.
    When both are given, Category is checked against catalog bucket, and the
    two sources must agree on bucket.

Exit codes:
    0 -- all checked repos pass
    1 -- one or more repos fail validation
    2 -- usage error, no repos found under --root, or the catalog/registry
         is missing, unreadable, or malformed
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from readme_contract import sections

PRIVATE_RECORD_FIELDS = ["Status", "Category", "Owner", "Visibility", "Purpose", "Next action"]
REQUIRED_FIELDS = ["title", "value proposition", "claim", "run path"]
PUBLIC_CLAIM_HEADINGS = {"the claim", "what fallax measures", "status"}

ALLOWED_STATUS = {"active", "paused", "experimental", "deprecated", "archived", "frozen"}
ALLOWED_CATEGORY = {
    "core", "apps", "lab", "sites", "work", "archive",
}
ALLOWED_OWNER = {
    # Active orgs only. The validator walks active bucket dirs; archive
    # content is intentionally outside its scope, so historical owners
    # (e.g., sunsetted holder orgs) are not enforced here.
    "alawein", "menax-inc", "blackmalejournal", "kohyr",
}
ALLOWED_VISIBILITY = {"public", "private"}
ALLOWED_NEXT_ACTION = {"continue", "refactor", "merge", "archive", "delete"}
ALAWEIN_OWNER = "alawein"

assert ALAWEIN_OWNER in ALLOWED_OWNER, (
    f"ALAWEIN_OWNER {ALAWEIN_OWNER!r} must be a member of ALLOWED_OWNER"
)

# Buckets that carry active code and must maintain anti-rot hygiene artifacts
# (docs/DEBT.md, docs/adr/). Non-code buckets (sites, work, archive) are
# deliberately excluded.
CODE_ARCHETYPES = {"core", "apps", "lab"}

assert CODE_ARCHETYPES <= ALLOWED_CATEGORY, (
    f"CODE_ARCHETYPES {CODE_ARCHETYPES} must be a subset of "
    f"ALLOWED_CATEGORY {ALLOWED_CATEGORY}"
)

_FIELD_RE = re.compile(
    r"^(Status|Category|Owner|Visibility|Purpose|Next action)\s*:\s*(.+?)\s*$",
    re.MULTILINE,
)


class ValidationError(Exception):
    """Raised when the README header is missing or malformed."""


class RegistryError(Exception):
    """Raised when projects.json / catalog cannot be read, parsed, or indexed."""


def parse_header(text: str) -> dict[str, str]:
    """Extract the metadata header block from a README.

    Scans the first 60 lines and identifies the contiguous block of header
    field lines (allowing blank lines inside the block). Stops at the first
    non-blank, non-matching line after a field has been seen. This prevents
    README body prose containing field-like patterns (e.g., `## Status`
    followed by `Status: paused`) from silently overriding the real header.

    Returns a dict keyed by field name. Raises ValidationError if any required
    field is missing.
    """
    lines = text.splitlines()[:60]
    block: list[str] = []
    started = False
    for line in lines:
        if _FIELD_RE.match(line):
            started = True
            block.append(line)
        elif started:
            if line.strip() == "":
                # tolerate blank lines inside the header block
                continue
            # block ended
            break
    head = "\n".join(block)
    found: dict[str, str] = {}
    for m in _FIELD_RE.finditer(head):
        name, value = m.group(1), m.group(2)
        if name in found:
            raise ValidationError(
                f"README header has duplicate field '{name}': "
                f"first={found[name]!r}, second={value!r}"
            )
        found[name] = value
    missing = [f for f in PRIVATE_RECORD_FIELDS if f not in found]
    if missing:
        raise ValidationError(
            f"README header missing required fields: {', '.join(missing)}"
        )
    return found


def validate_repo(
    repo_path: Path,
    bucket: str | None = None,
    display_name: str | None = None,
    visibility: str | None = None,
    lifecycle: str | None = None,
) -> list[str]:
    """Validate one repo. Returns a list of human-readable findings.

    `bucket` is the expected Category; when provided, the function asserts
    header.Category == bucket. `display_name` overrides the repo directory
    name in finding messages; --repo mode passes the GitHub slug here so
    messages name the real repo rather than the generic 'repo/' checkout.
    """
    name = display_name or repo_path.name
    readme = repo_path / "README.md"
    findings: list[str] = []
    if not readme.exists():
        return [f"{name}: README.md missing"]
    try:
        text = readme.read_text(encoding="utf-8")
    except UnicodeDecodeError as e:
        return [f"{name}: README.md not UTF-8 ({e.reason} at byte {e.start})"]
    except OSError as e:
        return [f"{name}: README.md unreadable: {e}"]
    if visibility == "public":
        if _FIELD_RE.search("\n".join(text.splitlines()[:60])):
            return [f"{name}: public README contains a banned record-card field"]
        if name == "alawein/alawein":
            return []
        first_screen = text.splitlines()[:40]
        if not first_screen or not re.match(r"^#\s+\S", first_screen[0]):
            findings.append(f"{name}: public README first screen is missing its title")
        first_h2 = next((i for i, line in enumerate(first_screen) if line.startswith("## ")), len(first_screen))
        if not any(line.startswith("> ") for line in first_screen[:first_h2]):
            findings.append(f"{name}: public README first screen is missing its value proposition")
        parsed = sections(text)
        headings = {
            section.heading.casefold(): section
            for section in parsed
            if section.line <= 40
        }
        archival = lifecycle in {"archived", "frozen", "deprecated"}
        if not archival and not set(headings).intersection(PUBLIC_CLAIM_HEADINGS):
            findings.append(f"{name}: public README first screen is missing its claim")
        if "run it" not in headings:
            findings.append(f"{name}: public README first screen is missing 'Run it'")
        return findings
    if visibility is None and re.search(
        r"^\s*Visibility\s*:\s*public\s*$", text, re.MULTILINE | re.IGNORECASE
    ):
        return [f"{name}: public record card requires authoritative visibility selection"]
    try:
        header = parse_header(text)
    except ValidationError as e:
        return [f"{name}: {e}"]

    if header["Status"] not in ALLOWED_STATUS:
        findings.append(f"{name}: Status '{header['Status']}' not in allowed set")
    if header["Category"] not in ALLOWED_CATEGORY:
        findings.append(f"{name}: Category '{header['Category']}' not in allowed set")
    if header["Owner"] not in ALLOWED_OWNER:
        findings.append(f"{name}: Owner '{header['Owner']}' not in allowed set")
    if header["Visibility"] not in ALLOWED_VISIBILITY:
        findings.append(f"{name}: Visibility '{header['Visibility']}' not in allowed set")
    if header["Next action"] not in ALLOWED_NEXT_ACTION:
        findings.append(f"{name}: Next action '{header['Next action']}' not in allowed set")
    if bucket is not None and header["Category"] != bucket:
        findings.append(
            f"{name}: Category '{header['Category']}' does not match bucket '{bucket}'"
        )
    return findings


def check_antirot_artifacts(
    repo_path: Path,
    bucket: str | None,
    display_name: str | None = None,
) -> list[str]:
    """Code-archetype repos must carry the anti-rot artifacts: a debt ledger
    (docs/DEBT.md) and a non-empty docs/adr/ directory.

    Non-code archetypes (family, personal, jobs-projects, archive) are exempt,
    as is a cross-org repo with no declared bucket (bucket is None). This is a
    separate concern from README-header validation, so it is composed alongside
    validate_repo in the callers rather than folded into it.
    """
    if bucket is None or bucket not in CODE_ARCHETYPES:
        return []
    name = display_name or repo_path.name
    findings: list[str] = []

    debt_path = repo_path / "docs" / "DEBT.md"
    try:
        debt_present = debt_path.is_file()
    except OSError as e:
        findings.append(f"{name}: docs/DEBT.md unreadable: {e}")
        debt_present = True
    if not debt_present:
        findings.append(f"{name}: missing anti-rot debt ledger docs/DEBT.md")

    adr_dir = repo_path / "docs" / "adr"
    try:
        adr_present = adr_dir.is_dir() and any(adr_dir.iterdir())
    except OSError as e:
        findings.append(f"{name}: docs/adr/ unreadable: {e}")
        adr_present = True
    if not adr_present:
        findings.append(f"{name}: docs/adr/ is absent or empty (must contain at least one ADR file)")

    return findings


def load_registry(path: Path) -> dict[str, dict]:
    """Load projects.json and return a map of repo slug to entry.

    Iterates every top-level list value; within each list, indexes every
    dict entry that carries a 'repo' key (a GitHub 'owner/name' slug).
    Entries with no 'repo' key (for example the 'packages' list) are
    skipped silently.

    A repo slug may appear in more than one list (for example, in both the
    'featured' showcase and its category list); this is a legitimate
    cross-list listing and is tolerated as long as the two entries agree on
    their 'bucket' value. If both entries declare a 'bucket' and the values
    differ, that is a data inconsistency and a RegistryError is raised naming
    the slug and both conflicting bucket values.

    Raises RegistryError if:
      - the file is missing or unreadable (OSError);
      - the file is not valid JSON;
      - the top-level JSON value is not an object (e.g. it is a list);
      - an entry's 'repo' field is present but is an empty string;
      - an entry's 'repo' field is present but is not a string (e.g. a
        number or list);
      - two entries share the same 'repo' slug but declare conflicting
        'bucket' values.
    """
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as e:
        raise RegistryError(f"cannot read registry {path}: {e}") from e
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise RegistryError(f"registry {path} is not valid JSON: {e}") from e
    if not isinstance(data, dict):
        raise RegistryError(f"registry {path} top level is not a JSON object")
    out: dict[str, dict] = {}
    for value in data.values():
        if not isinstance(value, list):
            continue
        for entry in value:
            if not isinstance(entry, dict):
                continue
            slug = entry.get("repo")
            if slug is None:
                continue
            if not isinstance(slug, str):
                raise RegistryError(
                    f"registry {path} has an entry with a non-string 'repo' field: {entry!r}"
                )
            if not slug:
                raise RegistryError(
                    f"registry {path} has an entry with an empty 'repo' field: {entry!r}"
                )
            if slug in out:
                stored_bucket = out[slug].get("bucket")
                new_bucket = entry.get("bucket")
                if stored_bucket is not None and new_bucket is not None and stored_bucket != new_bucket:
                    raise RegistryError(
                        f"registry {path} has duplicate repo slug '{slug}' "
                        f"with conflicting bucket values: "
                        f"'{stored_bucket}' vs '{new_bucket}'"
                    )
                # Legitimate cross-list duplicate. Prefer the entry that declares a bucket;
                # for all other fields the first-seen entry wins and is not authoritative.
                if new_bucket is not None and stored_bucket is None:
                    out[slug] = entry
                continue
            out[slug] = entry
    return out


def load_catalog(path: Path) -> dict[str, dict]:
    """Load catalog/repos.json and return a map of GitHub repo slug to entry.

    Indexes each entry in the top-level ``repos`` list by its ``repo`` field
    (``owner/name``). This is the SSOT for Category ↔ bucket checks.

    Raises RegistryError if the file is missing, unreadable, not an object,
    missing a ``repos`` list, or has invalid ``repo`` fields.
    """
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as e:
        raise RegistryError(f"cannot read catalog {path}: {e}") from e
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise RegistryError(f"catalog {path} is not valid JSON: {e}") from e
    if not isinstance(data, dict):
        raise RegistryError(f"catalog {path} top level is not a JSON object")
    repos = data.get("repos")
    if not isinstance(repos, list):
        raise RegistryError(f"catalog {path} has no 'repos' list")
    out: dict[str, dict] = {}
    for entry in repos:
        if not isinstance(entry, dict):
            continue
        slug = entry.get("repo")
        if slug is None:
            continue
        if not isinstance(slug, str) or not slug:
            raise RegistryError(
                f"catalog {path} has an entry with an invalid 'repo' field: {entry!r}"
            )
        if slug in out:
            raise RegistryError(
                f"catalog {path} has duplicate repo slug '{slug}'"
            )
        out[slug] = entry
    return out


def validate_repo_single(
    repo_path: Path,
    repo_slug: str,
    registry: dict[str, dict],
    *,
    source_label: str = "projects.json",
) -> list[str]:
    """Validate one repo's README header against a bucket registry.

    `repo_slug` is the GitHub 'owner/name' slug, matched against the
    registry's 'repo' field. The expected Category comes from the matched
    entry's 'bucket' (catalog SSOT when loaded from catalog/repos.json).

    Rules:
      - slug absent from the registry: fail.
      - matched entry has a 'bucket': delegate to validate_repo with that
        bucket; Category must equal the bucket value.
      - matched entry has no 'bucket' and owner is alawein: fail.
      - matched entry has no 'bucket' and owner is cross-org: delegate to
        validate_repo with bucket=None (full header-shape and enum validation
        runs; only the Category cross-check is skipped).
    """
    entry = registry.get(repo_slug)
    if entry is None:
        return [
            f"{repo_slug}: not registered in {source_label} "
            f"(no entry with repo == '{repo_slug}')"
        ]
    bucket = entry.get("bucket")
    owner = repo_slug.split("/", 1)[0]
    if bucket is None:
        if owner == ALAWEIN_OWNER:
            return [
                f"{repo_slug}: {source_label} entry has no 'bucket' field; "
                f"every alawein-org repo must declare a bucket"
            ]
        return validate_repo(
            repo_path,
            bucket=None,
            display_name=repo_slug,
            visibility=entry.get("visibility"),
            lifecycle=entry.get("status"),
        ) + \
            check_antirot_artifacts(repo_path, None, display_name=repo_slug)
    return validate_repo(
        repo_path,
        bucket=bucket,
        display_name=repo_slug,
        visibility=entry.get("visibility"),
        lifecycle=entry.get("status"),
    ) + \
        check_antirot_artifacts(repo_path, bucket, display_name=repo_slug)


def resolve_bucket_registry(
    *,
    catalog: dict[str, dict] | None,
    registry: dict[str, dict] | None,
    repo_slug: str,
) -> tuple[dict[str, dict], str, list[str]]:
    """Pick the bucket source for ``repo_slug`` and report source disagreements.

    Prefers catalog (SSOT). When both sources declare a bucket, they must agree.
    """
    findings: list[str] = []
    if catalog is not None and registry is not None:
        cat_entry = catalog.get(repo_slug)
        reg_entry = registry.get(repo_slug)
        if cat_entry is not None and reg_entry is not None:
            cat_bucket = cat_entry.get("bucket")
            reg_bucket = reg_entry.get("bucket")
            if (
                cat_bucket is not None
                and reg_bucket is not None
                and cat_bucket != reg_bucket
            ):
                findings.append(
                    f"{repo_slug}: catalog bucket '{cat_bucket}' disagrees with "
                    f"projects.json bucket '{reg_bucket}'"
                )
        if cat_entry is not None:
            return catalog, "catalog/repos.json", findings
        if reg_entry is not None:
            return registry, "projects.json", findings
        return catalog, "catalog/repos.json", findings
    if catalog is not None:
        return catalog, "catalog/repos.json", findings
    if registry is not None:
        return registry, "projects.json", findings
    raise RegistryError("no catalog or registry provided")


_BUCKET_DIRS = (
    "core", "apps", "lab", "sites", "work",
)

# Doctrine consistency: _BUCKET_DIRS must equal ALLOWED_CATEGORY minus
# 'archive'. The 'archive' bucket lives at _archive/ outside this walk, so
# it is intentionally excluded here. Anyone adding a new active category
# must update both sets.
assert set(_BUCKET_DIRS) == ALLOWED_CATEGORY - {"archive"}, (
    f"doctrine drift: _BUCKET_DIRS={_BUCKET_DIRS} does not match "
    f"ALLOWED_CATEGORY - {{'archive'}} = {ALLOWED_CATEGORY - {'archive'}}"
)


def walk_alawein(root: Path) -> list[tuple[Path, str]]:
    """Return [(repo_path, bucket_name), ...] for every repo under alawein/<bucket>/.

    Note on dual bucket sources: workspace-walk mode (this function) derives a
    repo's expected bucket from its physical parent directory name on disk.
    --repo mode derives the expected bucket from catalog/repos.json (SSOT) or
    projects.json when --catalog is omitted.
    """
    out: list[tuple[Path, str]] = []
    for bucket in _BUCKET_DIRS:
        bucket_dir = root / bucket
        if not bucket_dir.is_dir():
            continue
        for child in sorted(bucket_dir.iterdir()):
            if child.is_dir() and (child / ".git").exists():
                out.append((child, bucket))
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate Repo Framework headers.")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--root",
        type=Path,
        help="alawein/ workspace root; validate every repo under each "
        "bucket directory. Defaults to the current directory when neither "
        "--root nor --repo is given.",
    )
    mode.add_argument(
        "--repo",
        type=Path,
        help="Path to a single repo checkout; validate its README header "
        "against the catalog/registry. Requires --repo-slug and at least "
        "one of --catalog or --registry.",
    )
    parser.add_argument(
        "--catalog",
        type=Path,
        help="Path to catalog/repos.json (SSOT for Category ↔ bucket). "
        "Preferred with --repo.",
    )
    parser.add_argument(
        "--registry",
        type=Path,
        help="Path to projects.json. Optional with --catalog; required when "
        "--catalog is omitted in --repo mode.",
    )
    parser.add_argument(
        "--repo-slug",
        help="GitHub owner/name slug of the --repo target. Required with --repo.",
    )
    args = parser.parse_args(argv)

    if args.repo is not None:
        if args.repo_slug is None:
            print("error: --repo requires --repo-slug", file=sys.stderr)
            return 2
        if args.catalog is None and args.registry is None:
            print(
                "error: --repo requires --catalog and/or --registry",
                file=sys.stderr,
            )
            return 2
        parts = args.repo_slug.split("/")
        if len(parts) != 2 or not all(parts):
            print("error: --repo-slug must be in 'owner/name' format", file=sys.stderr)
            return 2
        if not args.repo.is_dir():
            print(f"error: --repo not a directory: {args.repo}", file=sys.stderr)
            return 2
        try:
            catalog = load_catalog(args.catalog) if args.catalog is not None else None
            registry = load_registry(args.registry) if args.registry is not None else None
            bucket_registry, source_label, pre_findings = resolve_bucket_registry(
                catalog=catalog,
                registry=registry,
                repo_slug=args.repo_slug,
            )
        except RegistryError as e:
            print(f"error: {e}", file=sys.stderr)
            return 2
        findings = list(pre_findings)
        findings.extend(
            validate_repo_single(
                args.repo,
                args.repo_slug,
                bucket_registry,
                source_label=source_label,
            )
        )
        if findings:
            print("FAIL:")
            for f in findings:
                print(f"  {f}")
            return 1
        print(f"PASS  {args.repo_slug}")
        return 0

    # Workspace-walk mode (default). A catalog supplies authoritative public
    # visibility; without one, legacy private validation remains available.
    if args.registry is not None or args.repo_slug is not None:
        print(
            "error: --registry and --repo-slug are only valid with --repo",
            file=sys.stderr,
        )
        return 2
    root = args.root if args.root is not None else Path.cwd()
    if not root.is_dir():
        print(f"error: root not a directory: {root}", file=sys.stderr)
        return 2

    try:
        workspace_catalog = load_catalog(args.catalog) if args.catalog is not None else {}
    except RegistryError as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    all_findings: list[str] = []
    repos = walk_alawein(root)
    if not repos:
        print(f"error: no repos found under {root}", file=sys.stderr)
        print(f"       expected at least one of: {', '.join(_BUCKET_DIRS)}", file=sys.stderr)
        return 2
    for repo, bucket in repos:
        matches = [
            (slug, entry)
            for slug, entry in workspace_catalog.items()
            if slug.rsplit("/", 1)[-1] == repo.name
        ]
        if len(matches) > 1:
            all_findings.append(
                f"{repo.name}: catalog visibility is ambiguous across "
                + ", ".join(slug for slug, _entry in matches)
            )
            continue
        slug, entry = matches[0] if matches else (repo.name, {})
        findings = validate_repo(
            repo,
            bucket=bucket,
            display_name=slug,
            visibility=entry.get("visibility"),
            lifecycle=entry.get("status"),
        )
        findings += check_antirot_artifacts(repo, bucket)
        if findings:
            all_findings.extend(findings)
        else:
            print(f"PASS  {bucket}/{repo.name}")

    if all_findings:
        print("\nFAIL:")
        for f in all_findings:
            print(f"  {f}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
