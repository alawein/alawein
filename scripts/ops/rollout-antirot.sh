#!/usr/bin/env bash
# rollout-antirot.sh -- seed docs/DEBT.md and docs/adr/ into a repo if absent.
# Idempotent: never overwrites an existing DEBT.md or ADR file.
# Usage: rollout-antirot.sh <repo-path>
set -euo pipefail

REPO="${1:?Usage: rollout-antirot.sh <repo-path>}"
ORG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
today="$(date +%F)"

[ -d "$REPO" ] || { echo "error: not a directory: $REPO" >&2; exit 1; }
[ -d "$ORG_DIR" ] || { echo "error: could not resolve org dir from ${BASH_SOURCE[0]}" >&2; exit 1; }
mkdir -p "$REPO/docs/adr" || { echo "error: cannot create docs/adr in $REPO" >&2; exit 1; }

if [ -f "$REPO/docs/DEBT.md" ]; then
  echo "skip  $REPO/docs/DEBT.md (exists)"
else
  _tpl="$ORG_DIR/templates/scaffolding/DEBT.template.md"
  [ -f "$_tpl" ] || { echo "error: template missing: $_tpl" >&2; exit 1; }
  _tmp="$REPO/docs/.DEBT.md.tmp.$$"
  sed "s/{{last_updated}}/${today}/" "$_tpl" > "$_tmp" && mv "$_tmp" "$REPO/docs/DEBT.md" || { rm -f "$_tmp"; echo "error: failed to write $REPO/docs/DEBT.md" >&2; exit 1; }
  echo "wrote $REPO/docs/DEBT.md"
fi

if [ -f "$REPO/docs/adr/0000-template.md" ]; then
  echo "skip  $REPO/docs/adr/0000-template.md (exists)"
else
  _tpl="$ORG_DIR/templates/scaffolding/adr-template.md"
  [ -f "$_tpl" ] || { echo "error: template missing: $_tpl" >&2; exit 1; }
  _tmp="$REPO/docs/adr/.0000-template.md.tmp.$$"
  sed "s/{{last_updated}}/${today}/" "$_tpl" > "$_tmp" && mv "$_tmp" "$REPO/docs/adr/0000-template.md" || { rm -f "$_tmp"; echo "error: failed to write $REPO/docs/adr/0000-template.md" >&2; exit 1; }
  echo "wrote $REPO/docs/adr/0000-template.md"
fi
