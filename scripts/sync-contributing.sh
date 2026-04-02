#!/usr/bin/env bash
# sync-contributing.sh -- propagates CONTRIBUTING.md template to workspace repos
#
# Modeled on sync-claude.sh. Repos with `sync: manual` in their CONTRIBUTING.md
# frontmatter are skipped.
#
# Usage:
#   ./scripts/sync-contributing.sh /path/to/repo       # single repo
#   WORKSPACE=/path/to/ws ./scripts/sync-contributing.sh --all   # all repos
#   ./scripts/sync-contributing.sh --check /path/to/repo         # drift check
#   ./scripts/sync-contributing.sh --check --all                 # drift all
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORG_REPO="$(dirname "$SCRIPT_DIR")"
TEMPLATE="${ORG_REPO}/../_devkit/templates/CONTRIBUTING.md"

get_sync_val() {
  local file="$1"
  sed -n '/^sync:/s/sync:[[:space:]]*//p' "$file" 2>/dev/null | head -1 || echo ""
}

# Derive the GitHub repo slug from git remote (e.g. "handshake-hai" not "_eval")
get_github_slug() {
  local repo_dir="$1"
  local remote_url
  remote_url=$(git -C "$repo_dir" remote get-url origin 2>/dev/null || echo "")
  if [ -n "$remote_url" ]; then
    echo "$remote_url" | sed 's|.*github\.com[:/][^/]*/||; s|\.git$||'
  else
    basename "$repo_dir"
  fi
}

propagate_contributing() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local github_slug
  github_slug=$(get_github_slug "$repo_dir")
  local target="${repo_dir}/CONTRIBUTING.md"

  [ -d "$repo_dir" ] || { echo "SKIP: ${repo_name} (directory not found)"; return 0; }

  if [ -f "$target" ]; then
    local sync_val
    sync_val=$(get_sync_val "$target")
    if [ "$sync_val" = "manual" ]; then
      echo "SKIP: ${repo_name} (sync: manual)"
      return 0
    fi
  fi

  # {REPO_NAME} = GitHub slug (official name used in public contexts)
  # {REPO}      = GitHub slug (used in clone URL and issues link)
  sed \
    -e "s/{REPO_NAME}/${github_slug}/g" \
    -e "s/{REPO}/${github_slug}/g" \
    "$TEMPLATE" > "$target"

  echo "OK: ${repo_name} (slug: ${github_slug})"
}

check_drift() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local target="${repo_dir}/CONTRIBUTING.md"

  if [ ! -f "$target" ]; then
    echo "MISSING: ${repo_name}/CONTRIBUTING.md"
    return 1
  fi

  local sync_val
  sync_val=$(get_sync_val "$target")
  if [ "$sync_val" = "manual" ]; then
    echo "SKIP: ${repo_name} (sync: manual)"
    return 0
  fi

  local missing=0
  for section in "Getting Started" "Development Workflow" "Pull Request Checklist"; do
    if ! grep -q "## ${section}" "$target"; then
      echo "DRIFT: ${repo_name} — missing section '## ${section}'"
      missing=1
    fi
  done

  [ "$missing" -eq 0 ] && echo "OK: ${repo_name}"
  return "$missing"
}

MODE="${1:---help}"

case "$MODE" in
  --all)
    WORKSPACE="${WORKSPACE:-$(dirname "$ORG_REPO")}"
    for repo_dir in "${WORKSPACE}"/*/; do
      [ -d "${repo_dir}/.git" ] || continue
      repo_name=$(basename "$repo_dir")
      [ "$repo_name" = "alawein" ] && continue
      propagate_contributing "$repo_dir"
    done
    ;;
  --check)
    shift
    if [ "${1:-}" = "--all" ]; then
      WORKSPACE="${WORKSPACE:-$(dirname "$ORG_REPO")}"
      failures=0
      for repo_dir in "${WORKSPACE}"/*/; do
        [ -d "${repo_dir}/.git" ] || continue
        repo_name=$(basename "$repo_dir")
        [ "$repo_name" = "alawein" ] && continue
        check_drift "$repo_dir" || failures=$((failures + 1))
      done
      echo "---"
      echo "Failures: ${failures}"
      [ "$failures" -eq 0 ]
    else
      TARGET="${1:-.}"
      check_drift "$TARGET"
    fi
    ;;
  --help | -h)
    echo "Usage:"
    echo "  sync-contributing.sh /path/to/repo      Propagate template to one repo"
    echo "  sync-contributing.sh --all              Propagate to all workspace repos"
    echo "  sync-contributing.sh --check --all      Check drift across all repos"
    echo "  sync-contributing.sh --check /path      Check drift for one repo"
    ;;
  *)
    propagate_contributing "$MODE"
    ;;
esac
