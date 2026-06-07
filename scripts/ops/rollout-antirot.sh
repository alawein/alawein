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

# write_artifact <dest> <tpl_file>
# Skip if dest exists. Otherwise verify the template, then atomically
# write (sed substitution into a temp file, then mv) so a partial write
# never leaves a corrupt artifact behind.
write_artifact() {
  local dest="$1" tpl="$2"
  if [ -f "$dest" ]; then
    echo "skip  $dest (exists)"
    return
  fi
  [ -f "$tpl" ] || { echo "error: template missing: $tpl" >&2; exit 1; }
  local tmp
  tmp="$(dirname "$dest")/.$(basename "$dest").tmp.$$"
  sed "s/{{last_updated}}/${today}/" "$tpl" > "$tmp" && mv "$tmp" "$dest" \
    || { rm -f "$tmp"; echo "error: failed to write $dest" >&2; exit 1; }
  echo "wrote $dest"
}

write_artifact "$REPO/docs/DEBT.md"               "$ORG_DIR/templates/scaffolding/DEBT.template.md"
write_artifact "$REPO/docs/adr/0000-template.md"  "$ORG_DIR/templates/scaffolding/adr-template.md"
