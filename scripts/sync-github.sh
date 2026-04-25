#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/sync-github.sh --all
  ./scripts/sync-github.sh --check --all
  ./scripts/sync-github.sh <repo-name-or-path>
  ./scripts/sync-github.sh --check <repo-name-or-path>

The repo manifest lives in github-baseline.yaml. Repos marked sync: manual are
reported but skipped by --all.
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORG_REPO="$(cd "$SCRIPT_DIR/.." && pwd)"

MODE="${1:---help}"

case "$MODE" in
  --all)
    CHECK="false"
    TARGET="--all"
    ;;
  --check)
    CHECK="true"
    TARGET="${2:---help}"
    ;;
  --help|-h)
    usage
    exit 0
    ;;
  *)
    CHECK="false"
    TARGET="$MODE"
    ;;
esac

if [[ "$TARGET" == "--help" ]]; then
  usage
  exit 1
fi

python - "$ORG_REPO" "$CHECK" "$TARGET" <<'PY'
from __future__ import annotations

import sys
import re
from pathlib import Path

import yaml

ORG_REPO = Path(sys.argv[1]).resolve()
CHECK = sys.argv[2] == "true"
TARGET = sys.argv[3]
WORKSPACE = ORG_REPO.parent
MANIFEST_PATH = ORG_REPO / "github-baseline.yaml"

data = yaml.safe_load(MANIFEST_PATH.read_text(encoding="utf-8")) or {}
entries = data.get("repos", [])
WORKFLOW_REF = str(data.get("workflow_ref") or "").strip()

if not re.fullmatch(r"[0-9a-f]{40}", WORKFLOW_REF):
    raise SystemExit("github-baseline.yaml missing a valid 40-character workflow_ref")

TEMPLATE_MAP = {
    ".github/CODEOWNERS": ORG_REPO / ".github" / "CODEOWNERS",
    ".github/PULL_REQUEST_TEMPLATE.md": ORG_REPO / ".github" / "PULL_REQUEST_TEMPLATE.md",
    ".github/ISSUE_TEMPLATE/bug_report.yml": ORG_REPO / ".github" / "ISSUE_TEMPLATE" / "bug_report.yml",
    ".github/ISSUE_TEMPLATE/feature_request.yml": ORG_REPO / ".github" / "ISSUE_TEMPLATE" / "feature_request.yml",
    ".github/ISSUE_TEMPLATE/config.yml": ORG_REPO / ".github" / "ISSUE_TEMPLATE" / "config.yml",
}

LEGACY_DELETE = [
    ".github/pull_request_template.md",
    ".github/ISSUE_TEMPLATE/bug_report.md",
    ".github/ISSUE_TEMPLATE/feature_request.md",
    ".github/workflows/codeql-analysis.yml",
]


def yaml_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def package_manager(entry: dict) -> str:
    install = (entry.get("install_command") or "").strip()
    if install.startswith("pnpm "):
        return "pnpm"
    return "npm"


def render_dependabot(entry: dict, repo_dir: Path) -> str:
    updates: list[dict] = []
    stack = entry.get("stack")

    if stack in {"node", "mixed"} and (repo_dir / "package.json").exists():
        updates.append(
            {
                "package-ecosystem": "npm",
                "directory": "/",
                "schedule": {"interval": "weekly", "day": "monday"},
                "groups": {
                    "production-dependencies": {"dependency-type": "production"},
                    "development-dependencies": {
                        "dependency-type": "development",
                        "update-types": ["minor", "patch"],
                    },
                },
                "open-pull-requests-limit": 10,
            }
        )

    if stack in {"python", "mixed"} and (
        (repo_dir / "pyproject.toml").exists() or (repo_dir / "requirements.txt").exists()
    ):
        updates.append(
            {
                "package-ecosystem": "pip",
                "directory": "/",
                "schedule": {"interval": "weekly", "day": "monday"},
                "groups": {"python-dependencies": {"patterns": ["*"]}},
                "open-pull-requests-limit": 10,
            }
        )

    updates.append(
        {
            "package-ecosystem": "github-actions",
            "directory": "/",
            "schedule": {"interval": "weekly", "day": "monday"},
            "commit-message": {"prefix": "ci"},
            "labels": ["dependencies"],
            "open-pull-requests-limit": 5,
        }
    )

    return yaml.safe_dump({"version": 2, "updates": updates}, sort_keys=False, default_flow_style=False)


GITIGNORE_TEMPLATE = """\
# Build outputs
dist/
build/
out/
.next/
__pycache__/
*.pyc
*.pyo

# Dependencies
node_modules/
.venv/
venv/

# Environment and secrets
.env
.env.*
!.env.example
*.secret
*.pem
*.key
*.p12

# Editor and OS
.DS_Store
Thumbs.db
.idea/
.vscode/
*.swp
*.swo

# Scratch / local
scratch/
*.bak
*.tmp
*.orig
"""


def render_ci_node(entry: dict) -> str:
    return "\n".join(
        [
            "name: CI",
            "",
            "on:",
            "  push:",
            "    branches: [main, master]",
            "    paths-ignore:",
            "      - '**/*.md'",
            "      - 'docs/**'",
            "      - '.github/ISSUE_TEMPLATE/**'",
            "      - 'LICENSE'",
            "  pull_request:",
            "    branches: [main, master]",
            "    paths-ignore:",
            "      - '**/*.md'",
            "      - 'docs/**'",
            "      - '.github/ISSUE_TEMPLATE/**'",
            "      - 'LICENSE'",
            "",
            "permissions:",
            "  contents: read",
            "",
            "concurrency:",
            "  group: ${{ github.workflow }}-${{ github.ref }}",
            "  cancel-in-progress: true",
            "",
            "jobs:",
            "  ci:",
            f"    uses: alawein/alawein/.github/workflows/ci-node.yml@{WORKFLOW_REF}",
            "    with:",
            f"      working-directory: {yaml_quote(entry.get('working_directory', '.'))}",
            f"      install-command: {yaml_quote(entry.get('install_command', ''))}",
            f"      build-command: {yaml_quote(entry.get('build_command', ''))}",
            f"      test-command: {yaml_quote(entry.get('test_command', ''))}",
            f"      package-manager: {yaml_quote(package_manager(entry))}",
            "",
        ]
    )


def render_ci_python(job: dict) -> str:
    use_uv = str(bool(job.get("use_uv", False))).lower()
    return "\n".join(
        [
            "name: CI",
            "",
            "on:",
            "  push:",
            "    branches: [main, master]",
            "    paths-ignore:",
            "      - '**/*.md'",
            "      - 'docs/**'",
            "      - '.github/ISSUE_TEMPLATE/**'",
            "      - 'LICENSE'",
            "  pull_request:",
            "    branches: [main, master]",
            "    paths-ignore:",
            "      - '**/*.md'",
            "      - 'docs/**'",
            "      - '.github/ISSUE_TEMPLATE/**'",
            "      - 'LICENSE'",
            "",
            "permissions:",
            "  contents: read",
            "",
            "concurrency:",
            "  group: ${{ github.workflow }}-${{ github.ref }}",
            "  cancel-in-progress: true",
            "",
            "jobs:",
            "  ci:",
            f"    uses: alawein/alawein/.github/workflows/ci-python.yml@{WORKFLOW_REF}",
            "    with:",
            f"      working-directory: {yaml_quote(job.get('working_directory', '.'))}",
            f"      python-version: {yaml_quote(job.get('python_version', '3.12'))}",
            f"      install-command: {yaml_quote(job.get('install_command', ''))}",
            f"      build-command: {yaml_quote(job.get('build_command', ''))}",
            f"      test-command: {yaml_quote(job.get('test_command', ''))}",
            f"      use-uv: {use_uv}",
            "",
        ]
    )


def render_ci_mixed(entry: dict) -> str:
    node = entry.get("node", {})
    python_job = entry.get("python", {})
    return "\n".join(
        [
            "name: CI",
            "",
            "on:",
            "  push:",
            "    branches: [main, master]",
            "    paths-ignore:",
            "      - '**/*.md'",
            "      - 'docs/**'",
            "      - '.github/ISSUE_TEMPLATE/**'",
            "      - 'LICENSE'",
            "  pull_request:",
            "    branches: [main, master]",
            "    paths-ignore:",
            "      - '**/*.md'",
            "      - 'docs/**'",
            "      - '.github/ISSUE_TEMPLATE/**'",
            "      - 'LICENSE'",
            "",
            "permissions:",
            "  contents: read",
            "",
            "concurrency:",
            "  group: ${{ github.workflow }}-${{ github.ref }}",
            "  cancel-in-progress: true",
            "",
            "jobs:",
            "  node:",
            f"    uses: alawein/alawein/.github/workflows/ci-node.yml@{WORKFLOW_REF}",
            "    with:",
            f"      working-directory: {yaml_quote(node.get('working_directory', '.'))}",
            f"      install-command: {yaml_quote(node.get('install_command', ''))}",
            f"      build-command: {yaml_quote(node.get('build_command', ''))}",
            f"      test-command: {yaml_quote(node.get('test_command', ''))}",
            f"      package-manager: {yaml_quote(package_manager(node))}",
            "  python:",
            f"    uses: alawein/alawein/.github/workflows/ci-python.yml@{WORKFLOW_REF}",
            "    with:",
            f"      working-directory: {yaml_quote(python_job.get('working_directory', '.'))}",
            f"      python-version: {yaml_quote(python_job.get('python_version', '3.12'))}",
            f"      install-command: {yaml_quote(python_job.get('install_command', ''))}",
            f"      build-command: {yaml_quote(python_job.get('build_command', ''))}",
            f"      test-command: {yaml_quote(python_job.get('test_command', ''))}",
            f"      use-uv: {str(bool(python_job.get('use_uv', False))).lower()}",
            "",
        ]
    )


def render_codeql(entry: dict) -> str:
    languages = ",".join(entry.get("codeql_languages", []))
    return "\n".join(
        [
            "name: CodeQL",
            "",
            "on:",
            "  push:",
            "    branches: [main]",
            "  pull_request:",
            "    branches: [main]",
            "  schedule:",
            "    - cron: '30 1 * * 0'",
            "",
            "permissions:",
            "  security-events: write",
            "  actions: read",
            "  contents: read",
            "",
            "jobs:",
            "  analyze:",
            f"    uses: alawein/alawein/.github/workflows/codeql.yml@{WORKFLOW_REF}",
            "    with:",
            f"      languages: {yaml_quote(languages)}",
            "",
        ]
    )


def render_ci(entry: dict) -> str:
    template = entry.get("ci_template")
    if template == "node":
        return render_ci_node(entry)
    if template == "python":
        return render_ci_python(entry)
    if template == "mixed":
        return render_ci_mixed(entry)
    return ""


def case_insensitive_match(path: Path) -> Path | None:
    if not path.parent.exists():
        return None
    for candidate in path.parent.iterdir():
        if candidate.name.lower() == path.name.lower():
            return candidate
    return None


def normalize_exact_case(path: Path, *, check: bool) -> list[str]:
    matched = case_insensitive_match(path)
    if matched is None or matched.name == path.name:
        return []

    if check:
        return [f"CASE: {matched} -> {path}"]

    matched.rename(path)
    return []


def ensure_text(path: Path, content: str, *, check: bool) -> list[str]:
    issues: list[str] = []
    issues.extend(normalize_exact_case(path, check=check))
    if path.exists():
        current = path.read_text(encoding="utf-8")
        if current == content:
            return issues
        issues.append(f"DRIFT: {path}")
    else:
        issues.append(f"MISSING: {path}")

    if not check:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8", newline="\n")
        issues.clear()
    return issues


def remove_legacy(path: Path, *, check: bool) -> list[str]:
    if not path.parent.exists():
        return []
    exact_match = next((child for child in path.parent.iterdir() if child.name == path.name), None)
    if exact_match is None:
        return []
    if check:
        return [f"LEGACY: {exact_match}"]
    if exact_match.is_file():
        exact_match.unlink()
    return []


def sync_repo(entry: dict, *, check: bool) -> list[str]:
    repo_dir = WORKSPACE / entry["repo"]
    issues: list[str] = []

    if not repo_dir.exists():
        return [f"MISSING-REPO: {repo_dir}"]

    for relative_path, source in TEMPLATE_MAP.items():
        destination = repo_dir / relative_path
        issues.extend(ensure_text(destination, source.read_text(encoding="utf-8"), check=check))

    issues.extend(ensure_text(repo_dir / ".gitignore", GITIGNORE_TEMPLATE, check=check))

    issues.extend(ensure_text(repo_dir / ".github" / "dependabot.yml", render_dependabot(entry, repo_dir), check=check))

    ci_content = render_ci(entry)
    if ci_content:
        issues.extend(ensure_text(repo_dir / ".github" / "workflows" / "ci.yml", ci_content, check=check))

    codeql_languages = entry.get("codeql_languages", [])
    codeql_path = repo_dir / ".github" / "workflows" / "codeql.yml"
    if codeql_languages:
        issues.extend(ensure_text(codeql_path, render_codeql(entry), check=check))
    elif codeql_path.exists():
        issues.extend(remove_legacy(codeql_path, check=check))

    for legacy in LEGACY_DELETE:
        issues.extend(remove_legacy(repo_dir / legacy, check=check))

    return issues


def selected_entries() -> list[dict]:
    if TARGET == "--all":
        return [entry for entry in entries if entry.get("sync") == "auto"]

    target_path = Path(TARGET)
    repo_name = target_path.resolve().name if target_path.exists() else TARGET
    matched = [entry for entry in entries if entry.get("repo") == repo_name]
    if not matched:
        raise SystemExit(f"Unknown repo target: {TARGET}")
    return matched


all_issues: list[str] = []
selected = selected_entries()

for entry in selected:
    issues = sync_repo(entry, check=CHECK)
    if issues:
        print(f"== {entry['repo']} ==")
        for issue in issues:
            print(issue)
        all_issues.extend(issues)
    else:
        state = "CHECK" if CHECK else "SYNC"
        print(f"{state}: {entry['repo']}")

if CHECK and all_issues:
    raise SystemExit(1)
PY
