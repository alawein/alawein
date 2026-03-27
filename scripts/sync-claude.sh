#!/usr/bin/env bash
# sync-claude.sh -- generates .claude/CLAUDE.md governance templates for repos
# Part of Docs Doctrine (Phase 3: Introduce Generation)
#
# Generates the DERIVED .claude/CLAUDE.md file (governance template), NOT
# the root CLAUDE.md (which is CANONICAL per-repo).
#
# Usage:
#   ./scripts/sync-claude.sh /path/to/repo          # single repo
#   WORKSPACE=/path/to/ws ./scripts/sync-claude.sh --all  # all workspace repos
#   ./scripts/sync-claude.sh --check /path/to/repo   # check drift only
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORG_REPO="$(dirname "$SCRIPT_DIR")"

# Extract one-line project description from existing .claude/CLAUDE.md
# Falls back to first heading from root CLAUDE.md, then repo name
extract_description() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")

  # Try existing .claude/CLAUDE.md — look for "## Project Context" section
  if [ -f "${repo_dir}/.claude/CLAUDE.md" ]; then
    local desc
    desc=$(sed -n '/^## Project Context/,/^##/{/^## Project Context/d; /^##/d; /^$/d; p;}' "${repo_dir}/.claude/CLAUDE.md" | head -1)
    if [ -n "$desc" ]; then
      echo "$desc"
      return
    fi
  fi

  # Try root CLAUDE.md — look for Purpose line or first paragraph after heading
  if [ -f "${repo_dir}/CLAUDE.md" ]; then
    local purpose
    purpose=$(grep -i '^\*\*Purpose:\*\*' "${repo_dir}/CLAUDE.md" | head -1 | sed 's/\*\*Purpose:\*\*\s*//')
    if [ -n "$purpose" ]; then
      echo "$purpose"
      return
    fi
  fi

  echo "${repo_name} — Claude Code configuration"
}

generate_claude_config() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local description
  description=$(extract_description "$repo_dir")
  local target="${repo_dir}/.claude/CLAUDE.md"
  local today
  today=$(date +%Y-%m-%d)

  mkdir -p "${repo_dir}/.claude"

  cat > "$target" <<TEMPLATE
---
type: derived
source: org/governance-templates
sync: script
sla: on-change
authority: canonical
audience: [agents, contributors]
last-verified: ${today}
---

# ${repo_name} — Claude Code Configuration

## Project Context

${description}

## Quick Links

- Governance: [AGENTS.md](AGENTS.md)
- Shared governance guides: [../../../docs/shared/](../../../docs/shared/)

## Session Bootstrap

Before working:
1. Run \`git log --oneline -5\` to see recent work
2. Read root \`CLAUDE.md\` for project-specific context
3. Run the project's test suite to verify current state

## Work Style

- Execute, do not plan. When asked to do something, do it.
- One change at a time. Make the smallest complete change, verify, then move to next.
- If stuck for >2 tool calls, stop and ask.

## Test Gates

After modifying code, run relevant tests before proceeding.

## Environment

- Git configured for LF (not CRLF)
- Python: use \`python\` (not \`python3\`)
- No credentials in chat; use \`gh secret set\` or \`vercel env add\` instead
TEMPLATE

  echo "Generated: ${target}"
}

check_drift() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local target="${repo_dir}/.claude/CLAUDE.md"

  if [ ! -f "$target" ]; then
    echo "MISSING: ${repo_name}/.claude/CLAUDE.md"
    return 1
  fi

  # Check sync field — if sync: manual, skip drift check
  local sync_val
  sync_val=$(sed -n '/^sync:/s/sync:\s*//p' "$target")
  if [ "$sync_val" = "manual" ]; then
    echo "SKIP: ${repo_name} (sync: manual)"
    return 0
  fi

  # Check that required sections exist
  local missing=0
  for section in "Project Context" "Session Bootstrap" "Work Style" "Environment"; do
    if ! grep -q "## ${section}" "$target"; then
      echo "DRIFT: ${repo_name} missing section '${section}'"
      missing=1
    fi
  done

  if [ "$missing" -eq 0 ]; then
    echo "OK: ${repo_name}"
  fi
  return "$missing"
}

MODE="${1:---help}"

case "$MODE" in
  --all)
    WORKSPACE="${WORKSPACE:-$(dirname "$ORG_REPO")}"
    for repo_dir in "${WORKSPACE}"/*/; do
      [ -d "${repo_dir}/.git" ] || continue
      repo_name=$(basename "$repo_dir")
      # Skip org repo itself
      [ "$repo_name" = "alawein" ] && continue
      generate_claude_config "$repo_dir"
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
  --help|-h)
    echo "Usage:"
    echo "  sync-claude.sh /path/to/repo       Generate .claude/CLAUDE.md for one repo"
    echo "  sync-claude.sh --all               Generate for all workspace repos"
    echo "  sync-claude.sh --check --all       Check drift across all repos"
    echo "  sync-claude.sh --check /path       Check drift for one repo"
    ;;
  *)
    # Single repo path
    generate_claude_config "$MODE"
    ;;
esac
