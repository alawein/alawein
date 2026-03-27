#!/usr/bin/env bash
# deploy-hooks.sh -- deploys doctrine pre-commit hook to workspace repos
# Part of Docs Doctrine (Phase 5: Full Enforcement)
#
# Usage:
#   ./scripts/deploy-hooks.sh --all              # deploy to all repos
#   ./scripts/deploy-hooks.sh /path/to/repo      # deploy to one repo
#   ./scripts/deploy-hooks.sh --check            # check deployment status
#   ./scripts/deploy-hooks.sh --remove --all     # remove from all repos
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORG_REPO="$(dirname "$SCRIPT_DIR")"
HOOK_SOURCE="${SCRIPT_DIR}/pre-commit-doctrine.sh"

deploy_hook() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local hook_dir="${repo_dir}/.git/hooks"
  local hook_target="${hook_dir}/pre-commit"

  if [ ! -d "$hook_dir" ]; then
    echo "SKIP: ${repo_name} (no .git/hooks directory)"
    return
  fi

  # If pre-commit already exists and is not our hook, warn
  if [ -f "$hook_target" ]; then
    if ! grep -q "Docs Doctrine" "$hook_target" 2>/dev/null; then
      echo "WARN: ${repo_name} has existing pre-commit hook (not overwriting)"
      return
    fi
  fi

  # Copy the hook and make executable
  cp "$HOOK_SOURCE" "$hook_target"
  chmod +x "$hook_target"
  echo "OK: ${repo_name}"
}

check_hook() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local hook_target="${repo_dir}/.git/hooks/pre-commit"

  if [ ! -f "$hook_target" ]; then
    echo "MISSING: ${repo_name}"
    return 1
  fi

  if grep -q "Docs Doctrine" "$hook_target" 2>/dev/null; then
    echo "OK: ${repo_name}"
    return 0
  else
    echo "OTHER: ${repo_name} (non-doctrine pre-commit hook)"
    return 1
  fi
}

remove_hook() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local hook_target="${repo_dir}/.git/hooks/pre-commit"

  if [ -f "$hook_target" ] && grep -q "Docs Doctrine" "$hook_target" 2>/dev/null; then
    rm "$hook_target"
    echo "REMOVED: ${repo_name}"
  else
    echo "SKIP: ${repo_name} (no doctrine hook)"
  fi
}

MODE="${1:---help}"

iterate_repos() {
  local action="$1"
  WORKSPACE="${WORKSPACE:-$(dirname "$ORG_REPO")}"
  local count=0
  local ok=0
  for repo_dir in "${WORKSPACE}"/*/; do
    [ -d "${repo_dir}/.git" ] || continue
    count=$((count + 1))
    "$action" "$repo_dir" && ok=$((ok + 1))
  done
  echo "---"
  echo "Total: ${count}, OK: ${ok}, Issues: $((count - ok))"
}

case "$MODE" in
  --all)
    iterate_repos deploy_hook
    ;;
  --check)
    iterate_repos check_hook
    ;;
  --remove)
    shift
    if [ "${1:-}" = "--all" ]; then
      iterate_repos remove_hook
    else
      echo "Usage: deploy-hooks.sh --remove --all"
    fi
    ;;
  --help|-h)
    echo "Usage:"
    echo "  deploy-hooks.sh --all              Deploy to all workspace repos"
    echo "  deploy-hooks.sh /path/to/repo      Deploy to one repo"
    echo "  deploy-hooks.sh --check            Check deployment status"
    echo "  deploy-hooks.sh --remove --all     Remove from all repos"
    ;;
  *)
    deploy_hook "$MODE"
    ;;
esac
