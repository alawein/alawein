#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/validate-doc-contract.sh --full
  ./scripts/validate-doc-contract.sh --changed-only <base_ref>

Environment:
  DOC_CONTRACT_BASE_REF   Optional base ref used by --full when a push workflow
                          wants freshness updates checked against a known diff.
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

mode="$1"
base_ref_arg="${2:-}"

case "$mode" in
  --full)
    if [[ $# -ne 1 ]]; then
      usage
      exit 1
    fi
    ;;
  --changed-only)
    if [[ $# -ne 2 ]]; then
      usage
      exit 1
    fi
    ;;
  *)
    usage
    exit 1
    ;;
esac

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to validate the documentation contract." >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
cd "$repo_root"

export DOC_CONTRACT_MODE="$mode"
export DOC_CONTRACT_BASE_REF_INPUT="$base_ref_arg"

python3 - <<'PY'
from __future__ import annotations

import os
import re
import subprocess
import sys
from datetime import date
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple
from urllib.parse import unquote


ROOT = Path.cwd()
MODE = os.environ["DOC_CONTRACT_MODE"]
BASE_REF_INPUT = os.environ.get("DOC_CONTRACT_BASE_REF_INPUT", "").strip()
ENV_BASE_REF = os.environ.get("DOC_CONTRACT_BASE_REF", "").strip()
ZERO_SHA = "0" * 40

REQUIRED_FILES = [
    "AGENTS.md",
    "CLAUDE.md",
    "README.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "LICENSE",
    "SECURITY.md",
    "CHANGELOG.md",
    "SSOT.md",
    "LESSONS.md",
    "docs/README.md",
    "docs/governance/documentation-contract.md",
    "docs/governance/workspace-master-prompt.md",
    "docs/governance/workflow.md",
    "scripts/validate-doc-contract.sh",
]

CANONICAL_DOCS = {
    "AGENTS.md": "last-verified",
    "CLAUDE.md": "last-verified",
    "SSOT.md": "last-verified",
}

LESSON_DOCS = {
    "LESSONS.md": "last-updated",
}

MANAGED_ROOT_DOCS = {
    "CONTRIBUTING.md": "last_updated",
    "SECURITY.md": "last_updated",
    "CHANGELOG.md": "last_updated",
    "CODE_OF_CONDUCT.md": "last_updated",
}

EXEMPT_DOCS = {
    "README.md",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/feature_request.yml",
}


def run_git(args: Sequence[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=check,
    )


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def is_archive_doc(rel: str) -> bool:
    return rel.startswith("docs/archive/")


def managed_docs() -> Dict[str, str]:
    docs: Dict[str, str] = dict(MANAGED_ROOT_DOCS)
    for path in sorted((ROOT / "docs").rglob("*.md")):
        rel = relative(path)
        if is_archive_doc(rel):
            continue
        docs[rel] = "last_updated"
    docs.pop("docs/archive", None)
    return docs


MANAGED_DOCS = managed_docs()

GENERATED_FRESHNESS_MARKERS = {
    "docs/dashboard/index.md": re.compile(r"^[+-]- Generated at:\s*`", re.MULTILINE),
}


def base_ref_for_mode() -> Optional[str]:
    if MODE == "--changed-only":
        return BASE_REF_INPUT or None
    if ENV_BASE_REF and ENV_BASE_REF != ZERO_SHA:
        return ENV_BASE_REF
    return None


def repo_head_parent() -> Optional[str]:
    result = run_git(["rev-parse", "--verify", "HEAD^"], check=False)
    if result.returncode == 0:
        return result.stdout.strip()
    return None


def changed_files(base_ref: Optional[str]) -> Set[str]:
    files: Set[str] = set()
    diff_specs: List[List[str]] = []

    if base_ref:
        diff_specs.append(["diff", "--name-only", "--diff-filter=ACMR", f"{base_ref}...HEAD"])
    elif MODE == "--full":
        head_parent = repo_head_parent()
        if head_parent:
            diff_specs.append(["diff", "--name-only", "--diff-filter=ACMR", f"{head_parent}...HEAD"])

    diff_specs.append(["diff", "--name-only", "--diff-filter=ACMR"])
    diff_specs.append(["diff", "--cached", "--name-only", "--diff-filter=ACMR"])

    for spec in diff_specs:
        result = run_git(spec, check=False)
        if result.returncode != 0:
            continue
        for line in result.stdout.splitlines():
            if line.strip():
                files.add(line.strip())
    return files


def combined_diff(file_path: str, base_ref: Optional[str]) -> str:
    chunks: List[str] = []
    diff_specs: List[List[str]] = []

    if base_ref:
        diff_specs.append(["diff", "--unified=0", "--no-color", f"{base_ref}...HEAD", "--", file_path])
    elif MODE == "--full":
        head_parent = repo_head_parent()
        if head_parent:
            diff_specs.append(["diff", "--unified=0", "--no-color", f"{head_parent}...HEAD", "--", file_path])

    diff_specs.append(["diff", "--unified=0", "--no-color", "--", file_path])
    diff_specs.append(["diff", "--cached", "--unified=0", "--no-color", "--", file_path])

    for spec in diff_specs:
        result = run_git(spec, check=False)
        if result.returncode == 0 and result.stdout:
            chunks.append(result.stdout)
    return "\n".join(chunks)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_frontmatter(path: Path) -> Tuple[Optional[Dict[str, Tuple[str, int]]], List[str]]:
    rel = relative(path)
    errors: List[str] = []
    text = read_text(path)
    lines = text.splitlines()
    if not lines:
        errors.append(f"{rel}:1: file is empty")
        return None, errors

    first_line = lines[0].lstrip("\ufeff")
    if first_line != "---":
        errors.append(f"{rel}:1: missing YAML frontmatter start delimiter")
        return None, errors

    closing_index = None
    for idx in range(1, len(lines)):
        if lines[idx] == "---":
            closing_index = idx
            break
    if closing_index is None:
        errors.append(f"{rel}:1: missing YAML frontmatter end delimiter")
        return None, errors

    meta: Dict[str, Tuple[str, int]] = {}
    for idx in range(1, closing_index):
        line = lines[idx]
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if match:
            meta[match.group(1)] = (match.group(2).strip(), idx + 1)
    return meta, errors


def check_required_files(errors: List[str]) -> None:
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            errors.append(f"{rel}:1: missing required file")


def check_bom(errors: List[str]) -> None:
    for rel in CANONICAL_DOCS:
        path = ROOT / rel
        if path.exists() and path.read_bytes().startswith(b"\xef\xbb\xbf"):
            errors.append(f"{rel}:1: UTF-8 BOM is not allowed in canonical docs")


def check_frontmatter(errors: List[str]) -> None:
    freshness_map = {**CANONICAL_DOCS, **LESSON_DOCS, **MANAGED_DOCS}
    for rel, key in freshness_map.items():
        path = ROOT / rel
        if not path.exists():
            continue
        meta, meta_errors = parse_frontmatter(path)
        errors.extend(meta_errors)
        if meta is None:
            continue
        if key not in meta:
            errors.append(f"{rel}:1: required freshness key `{key}` is missing")


def check_canonical_age(errors: List[str]) -> None:
    today = date.today()
    for rel, key in CANONICAL_DOCS.items():
        path = ROOT / rel
        if not path.exists():
            continue
        meta, meta_errors = parse_frontmatter(path)
        if meta is None:
            continue
        raw_value, line_no = meta[key]
        try:
            verified_on = date.fromisoformat(raw_value)
        except ValueError:
            errors.append(f"{rel}:{line_no}: `{key}` must use YYYY-MM-DD")
            continue
        age_days = (today - verified_on).days
        if age_days > 30:
            errors.append(
                f"{rel}:{line_no}: `{key}` is {age_days} days old; canonical docs must be <= 30 days old"
            )


def check_naming(errors: List[str]) -> None:
    allowed_root = {
        "AGENTS.md",
        "CLAUDE.md",
        "README.md",
        "CONTRIBUTING.md",
        "CODE_OF_CONDUCT.md",
        "SECURITY.md",
        "CHANGELOG.md",
        "SSOT.md",
        "LESSONS.md",
    }
    for path in ROOT.glob("*.md"):
        rel = relative(path)
        if rel not in allowed_root:
            errors.append(f"{rel}:1: unexpected root markdown filename")

    kebab = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
    gov_dir = ROOT / "docs" / "governance"
    if gov_dir.exists():
        for path in gov_dir.glob("*.md"):
            rel = relative(path)
            if not kebab.match(path.name):
                errors.append(f"{rel}:1: governance docs must use kebab-case filenames")


def markdown_files_for_links() -> Iterable[Path]:
    for path in sorted(ROOT.rglob("*.md")):
        rel = relative(path)
        if is_archive_doc(rel):
            continue
        yield path


def check_local_links(errors: List[str]) -> None:
    link_re = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
    fence_re = re.compile(r"^```")

    for path in markdown_files_for_links():
        rel = relative(path)
        text = read_text(path)
        in_fence = False
        for line_no, raw_line in enumerate(text.splitlines(), start=1):
            if fence_re.match(raw_line.strip()):
                in_fence = not in_fence
                continue
            if in_fence:
                continue
            for match in link_re.finditer(raw_line):
                target = match.group(1).strip().strip("<>")
                if not target or target.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                cleaned = unquote(target.split("#", 1)[0].split("?", 1)[0])
                if not cleaned:
                    continue
                resolved = (path.parent / cleaned).resolve()
                if not resolved.exists():
                    errors.append(f"{rel}:{line_no}: broken local link target `{target}`")


def check_freshness_updates(errors: List[str], base_ref: Optional[str]) -> None:
    changed = changed_files(base_ref)
    freshness_map = {**CANONICAL_DOCS, **LESSON_DOCS, **MANAGED_DOCS}
    for rel, key in freshness_map.items():
        if rel not in changed:
            continue
        path = ROOT / rel
        if not path.exists():
            continue
        diff_text = combined_diff(rel, base_ref)
        if not diff_text:
            continue
        key_re = re.compile(rf"^[+-]{re.escape(key)}:\s*", re.MULTILINE)
        if not key_re.search(diff_text):
            marker_re = GENERATED_FRESHNESS_MARKERS.get(rel)
            if marker_re and marker_re.search(diff_text):
                continue
            errors.append(
                f"{rel}:1: file changed in current diff but `{key}` was not updated"
            )


def main() -> int:
    errors: List[str] = []
    base_ref = base_ref_for_mode()

    check_required_files(errors)
    check_bom(errors)
    check_frontmatter(errors)
    check_canonical_age(errors)
    check_naming(errors)
    check_local_links(errors)
    check_freshness_updates(errors, base_ref)

    if errors:
        for entry in sorted(dict.fromkeys(errors)):
            print(entry, file=sys.stderr)
        return 1

    print("Documentation contract validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
PY
