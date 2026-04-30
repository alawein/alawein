#!/usr/bin/env bash
# sync-to-home.sh — Push platform source → ~/.claude/
# Run this after editing files here to apply changes to the live platform.
set -euo pipefail

PLATFORM="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/.claude"
BACKUP="$DEST/backups/platform-sync-$(date +%Y%m%d-%H%M%S)"

echo "Backing up to $BACKUP ..."
mkdir -p "$BACKUP"
[ -d "$DEST/bin" ]       && cp -r "$DEST/bin"       "$BACKUP/"
[ -f "$DEST/CLAUDE.md" ] && cp    "$DEST/CLAUDE.md" "$BACKUP/"
[ -d "$DEST/agents" ]    && cp -r "$DEST/agents"    "$BACKUP/"
[ -d "$DEST/workflows" ] && cp -r "$DEST/workflows" "$BACKUP/"

echo "Syncing bin/ ..."
mkdir -p "$DEST/bin"
cp "$PLATFORM/bin/"*.sh "$DEST/bin/"
chmod +x "$DEST/bin/"*.sh

echo "Syncing global/CLAUDE.md ..."
cp "$PLATFORM/global/CLAUDE.md" "$DEST/CLAUDE.md"

echo "Syncing agents/ ..."
mkdir -p "$DEST/agents"
cp "$PLATFORM/agents/"* "$DEST/agents/"

echo "Syncing skills/ ..."
mkdir -p "$DEST/skills"
cp -r "$PLATFORM/skills/"* "$DEST/skills/"

echo "Syncing workflows/ ..."
mkdir -p "$DEST/workflows"
cp "$PLATFORM/workflows/"* "$DEST/workflows/"

echo "Syncing schemas/ ..."
mkdir -p "$DEST/schemas"
cp "$PLATFORM/schemas/"* "$DEST/schemas/"

echo "Done. Backup saved at: $BACKUP"
