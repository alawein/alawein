#!/usr/bin/env bash
# sync-claude.sh -- projects org CLAUDE.md to local repos as derived files
# Part of Docs Doctrine (Phase 3: Introduce Generation)
set -euo pipefail

ORG_CLAUDE="${ORG_REPO_PATH:-../org}/CLAUDE.md"

if [ ! -f "$ORG_CLAUDE" ]; then
  echo "Error: Org CLAUDE.md not found at $ORG_CLAUDE"
  echo "Set ORG_REPO_PATH to the org repo location."
  exit 1
fi

# Copy body with a derived header replacing the original
{
  echo "---"
  echo "type: derived"
  echo "source: org/CLAUDE.md"
  echo "sync: script"
  echo "sla: on-change"
  echo "---"
  # Strip original frontmatter, pass through body
  sed '1,/^---$/d; 1,/^---$/d' "$ORG_CLAUDE"
} > CLAUDE.md

echo "Synced CLAUDE.md from org."
