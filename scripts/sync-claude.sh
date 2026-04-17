#!/usr/bin/env bash
# sync-claude.sh -- generates local .claude mirrors for governed repos
# Part of Docs Doctrine (Phase 3: Introduce Generation)
#
# Generates the DERIVED .claude/CLAUDE.md and .claude/AGENTS.md files.
# Root CLAUDE.md and root AGENTS.md stay canonical per repo.
#
# Usage:
#   ./scripts/sync-claude.sh /path/to/repo            # single repo
#   WORKSPACE=/path/to/ws ./scripts/sync-claude.sh --all
#   ./scripts/sync-claude.sh --check /path/to/repo    # check drift only

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORG_REPO="$(dirname "$SCRIPT_DIR")"
SKIP_REPOS=("alawein" "legacy-portfolio-temp")

should_skip_repo() {
  local repo_name="$1"
  local skip
  for skip in "${SKIP_REPOS[@]}"; do
    if [ "$repo_name" = "$skip" ]; then
      return 0
    fi
  done
  return 1
}

is_manual_sync_file() {
  local target="$1"
  [ -f "$target" ] || return 1
  local sync_val
  sync_val=$(sed -n '/^sync:/s/sync:[[:space:]]*//p' "$target" | head -1)
  [ "$sync_val" = "manual" ]
}

collapse_whitespace() {
  tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//'
}

extract_existing_context() {
  local repo_dir="$1"
  local target="${repo_dir}/.claude/CLAUDE.md"
  [ -f "$target" ] || return 1

  sed -n '/^## Project Context/,/^## /{/^## Project Context/d; /^## /d; /^$/d; p;}' "$target" | collapse_whitespace
}

extract_workspace_identity() {
  local file="$1"
  awk '
    BEGIN {
      in_frontmatter = 0
      frontmatter_done = 0
      in_section = 0
      paragraph = ""
      printed = 0
    }
    /^---$/ {
      if (!frontmatter_done) {
        in_frontmatter = !in_frontmatter
        if (!in_frontmatter) {
          frontmatter_done = 1
        }
        next
      }
    }
    in_frontmatter { next }
    {
      sub(/\r$/, "", $0)
    }
    /^## Workspace identity$/ {
      in_section = 1
      next
    }
    in_section {
      if ($0 ~ /^## /) {
        exit
      }
      if ($0 ~ /^$/) {
        if (paragraph != "") {
          print paragraph
          printed = 1
          exit
        }
        next
      }
      if ($0 ~ /^[-*]/ || $0 ~ /^```/) {
        next
      }
      if ($0 ~ /^\[!\[/ || $0 ~ /^!\[/) {
        next
      }
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
      if ($0 == "") {
        next
      }
      if (paragraph == "") {
        paragraph = $0
      } else {
        paragraph = paragraph " " $0
      }
    }
    END {
      if (!printed && paragraph != "") {
        print paragraph
      }
    }
  ' "$file"
}

extract_first_paragraph() {
  local file="$1"
  awk '
    BEGIN {
      in_frontmatter = 0
      frontmatter_done = 0
      heading_seen = 0
      paragraph = ""
      printed = 0
    }
    /^---$/ {
      if (!frontmatter_done) {
        in_frontmatter = !in_frontmatter
        if (!in_frontmatter) {
          frontmatter_done = 1
        }
        next
      }
    }
    in_frontmatter { next }
    {
      sub(/\r$/, "", $0)
    }
    /^# / {
      heading_seen = 1
      next
    }
    heading_seen {
      if ($0 ~ /^## /) {
        exit
      }
      if ($0 ~ /^$/) {
        if (paragraph != "") {
          print paragraph
          printed = 1
          exit
        }
        next
      }
      if ($0 ~ /^[-*]/ || $0 ~ /^```/) {
        next
      }
      if ($0 ~ /^\[!\[/ || $0 ~ /^!\[/) {
        next
      }
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
      if ($0 == "") {
        next
      }
      if (paragraph == "") {
        paragraph = $0
      } else {
        paragraph = paragraph " " $0
      }
    }
    END {
      if (!printed && paragraph != "") {
        print paragraph
      }
    }
  ' "$file"
}

extract_description() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local desc

  if [ -f "${repo_dir}/CLAUDE.md" ]; then
    desc=$(grep -i '^\*\*Purpose:\*\*' "${repo_dir}/CLAUDE.md" | head -1 | sed 's/\*\*Purpose:\*\*\s*//')
    if [ -n "$desc" ]; then
      echo "$desc"
      return
    fi

    desc=$(extract_workspace_identity "${repo_dir}/CLAUDE.md" | collapse_whitespace)
    if [ -n "$desc" ]; then
      echo "$desc"
      return
    fi

    desc=$(extract_first_paragraph "${repo_dir}/CLAUDE.md" | collapse_whitespace)
    if [ -n "$desc" ]; then
      echo "$desc"
      return
    fi
  fi

  desc=$(extract_existing_context "$repo_dir" || true)
  if [ -n "$desc" ] && ! printf '%s' "$desc" | grep -Eqi 'claude code configuration|claude code configuration$|claude code configuration[[:space:]]'; then
    echo "$desc"
    return
  fi

  if [ -f "${repo_dir}/README.md" ]; then
    desc=$(extract_first_paragraph "${repo_dir}/README.md" | collapse_whitespace)
    if [ -n "$desc" ]; then
      echo "$desc"
      return
    fi
  fi

  echo "${repo_name} is a governed repo in the Alawein workspace. Use the root project files for the current contract."
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

  if is_manual_sync_file "$target"; then
    echo "SKIP: ${target} (sync: manual)"
    return
  fi

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

# ${repo_name} — local Claude bootstrap

## Project Context

${description}

## Authority

- Root [CLAUDE.md](CLAUDE.md) is authoritative for repo context and repo-specific constraints.
- Root [AGENTS.md](AGENTS.md) is authoritative for repo rules and operating boundaries.
- Shared voice contract: <https://github.com/alawein/alawein/blob/main/docs/style/VOICE.md>
- Workspace prompt kit: <https://github.com/alawein/alawein/blob/main/prompt-kits/AGENT.md>

## Before You Touch Code

1. Run \`git log --oneline -5\` to see recent work.
2. Read root \`CLAUDE.md\` for project-specific context.
3. Read root \`AGENTS.md\` if the task changes structure, process, tooling, or docs policy.
4. Read the shared voice contract and use the repo overlay that matches this surface.
5. Run the smallest relevant verification command before widening the change.

## Working Rules

- Execute on the smallest complete surface.
- Verify immediately after each meaningful change.
- If missing context blocks the work after two tool moves, stop and ask.
- Keep GitHub-facing \`README.md\` and \`docs/README.md\` frontmatter-free.
- Match the shared Alawein voice contract for docs, prompts, naming, comments, and math writing.
- Do not add secrets or hand-edit generated output to silence a failing check.

## Test Gates

After modifying code, run the relevant verification path before ending the session.

## Environment

- Git configured for LF (not CRLF).
- Python: use \`python\` (not \`python3\`).
- No credentials in chat; use \`gh secret set\` or \`vercel env add\` instead.
TEMPLATE

  echo "Generated: ${target}"
}

generate_agents_mirror() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local target="${repo_dir}/.claude/AGENTS.md"
  local today
  today=$(date +%Y-%m-%d)

  if is_manual_sync_file "$target"; then
    echo "SKIP: ${target} (sync: manual)"
    return
  fi

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

# ${repo_name} — local governance mirror

Use the root governance files as the source of truth for this repo.

## Authority

- Root [AGENTS.md](AGENTS.md) is authoritative for repo rules and operating boundaries.
- Root [CLAUDE.md](CLAUDE.md) is authoritative for repo context and implementation constraints.
- Shared voice contract: <https://github.com/alawein/alawein/blob/main/docs/style/VOICE.md>

## Operating Rules

- Change the smallest complete surface and verify immediately.
- Keep GitHub-facing \`README.md\` and \`docs/README.md\` frontmatter-free.
- Keep \`SSOT.md\`, \`LESSONS.md\`, and \`CHANGELOG.md\` aligned when structure or behavior changes.
- Treat generated or runtime state as generated. Fix the source or validator boundary instead of hand-editing artifacts.
- Never commit secrets, tokens, or credentials.

## Handoff

- Record meaningful structural or behavioral changes in the repo-local docs that already own that contract.
- Leave follow-up work in visible repo surfaces, not hidden chat state.
TEMPLATE

  echo "Generated: ${target}"
}

check_file_sections() {
  local target="$1"
  shift
  local repo_name="$1"
  shift
  local missing=0
  local section

  if [ ! -f "$target" ]; then
    echo "MISSING: ${repo_name}/${target##*/}"
    return 1
  fi

  if is_manual_sync_file "$target"; then
    echo "SKIP: ${repo_name}/${target##*/} (sync: manual)"
    return 0
  fi

  for section in "$@"; do
    if ! grep -q "^## ${section}$" "$target"; then
      echo "DRIFT: ${repo_name}/${target##*/} missing section '${section}'"
      missing=1
    fi
  done

  return "$missing"
}

check_drift() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local missing=0

  check_file_sections "${repo_dir}/.claude/CLAUDE.md" "$repo_name" \
    "Project Context" "Authority" "Before You Touch Code" "Working Rules" "Environment" || missing=1
  check_file_sections "${repo_dir}/.claude/AGENTS.md" "$repo_name" \
    "Authority" "Operating Rules" "Handoff" || missing=1

  if [ "$missing" -eq 0 ]; then
    echo "OK: ${repo_name}"
  fi
  return "${missing}"
}

MODE="${1:---help}"

case "$MODE" in
  --all)
    WORKSPACE="${WORKSPACE:-$(dirname "$ORG_REPO")}"
    for repo_dir in "${WORKSPACE}"/*/; do
      [ -d "${repo_dir}/.git" ] || continue
      repo_name=$(basename "$repo_dir")
      should_skip_repo "$repo_name" && continue
      generate_claude_config "$repo_dir"
      generate_agents_mirror "$repo_dir"
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
        should_skip_repo "$repo_name" && continue
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
    echo "  sync-claude.sh /path/to/repo       Generate .claude mirrors for one repo"
    echo "  sync-claude.sh --all               Generate mirrors for all workspace repos"
    echo "  sync-claude.sh --check --all       Check drift across all repos"
    echo "  sync-claude.sh --check /path       Check drift for one repo"
    ;;
  *)
    generate_claude_config "$MODE"
    generate_agents_mirror "$MODE"
    ;;
esac
