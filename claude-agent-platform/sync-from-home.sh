#!/usr/bin/env bash
# sync-from-home.sh — Pull current ~/.claude/ state into the source repo.
# Run this after making changes directly inside Claude Code to capture them.
set -euo pipefail

PLATFORM="$(cd "$(dirname "$0")" && pwd)"
SRC="$HOME/.claude"

echo "Pulling $SRC → $PLATFORM ..."

cp "$SRC/bin/"*.sh                "$PLATFORM/bin/"
cp "$SRC/CLAUDE.md"               "$PLATFORM/global/CLAUDE.md"
cp "$SRC/agents/"*                "$PLATFORM/agents/"
cp -r "$SRC/skills/"*             "$PLATFORM/skills/"
cp "$SRC/workflows/"*             "$PLATFORM/workflows/"
cp "$SRC/schemas/"*               "$PLATFORM/schemas/"

echo "Done. Review with: git -C '$PLATFORM/..' diff --stat"
