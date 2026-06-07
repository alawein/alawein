#!/usr/bin/env bash
# rollout-antirot.sh -- seed docs/DEBT.md and docs/adr/ into a repo if absent.
# Idempotent: never overwrites an existing DEBT.md or ADR file.
# Usage: rollout-antirot.sh <repo-path>
set -euo pipefail

REPO="${1:?Usage: rollout-antirot.sh <repo-path>}"
ORG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
today="$(date +%F)"

[ -d "$REPO" ] || { echo "error: not a directory: $REPO" >&2; exit 1; }
mkdir -p "$REPO/docs/adr"

if [ -f "$REPO/docs/DEBT.md" ]; then
  echo "skip  $REPO/docs/DEBT.md (exists)"
else
  sed "s/{{last_updated}}/${today}/" "$ORG_DIR/templates/scaffolding/DEBT.template.md" > "$REPO/docs/DEBT.md"
  echo "wrote $REPO/docs/DEBT.md"
fi

if [ -f "$REPO/docs/adr/0000-template.md" ]; then
  echo "skip  $REPO/docs/adr/0000-template.md (exists)"
else
  sed "s/{{last_updated}}/${today}/" "$ORG_DIR/templates/scaffolding/adr-template.md" > "$REPO/docs/adr/0000-template.md"
  echo "wrote $REPO/docs/adr/0000-template.md"
fi
