#!/bin/sh
# rollback.sh — restore Claude platform backups.
# Rationale: Every generated config change should have a direct recovery command.

set -eu

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
ROOT="$(pwd)"
TARGET="last-operation"
SCOPE="auto"

usage() {
  cat <<'EOF'
Usage: rollback.sh [--root DIR] [--scope project|global|auto]
                   [--target claude-config|last-operation|settings|skills:NAME|PATH]

Targets:
  claude-config   Restore the most recent .claude/CLAUDE.md backup (project) or
                  ~/.claude/CLAUDE.md backup (global), depending on --scope.
  last-operation  Alias for claude-config.
  settings        Restore ~/.claude/settings.json from the most recent backup
                  (global scope only).
  skills:NAME     Restore a previously-replaced or uninstalled skill from
                  ~/.claude/backups/skills.NAME.* (global scope only).
  PATH            Generic restore: looks for PATH.bak alongside PATH.

Scope:
  auto     Detect by inspecting the target (default).
  project  Operate on .claude/ in --root.
  global   Operate on ~/.claude/ (CLAUDE_HOME).
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --root) ROOT="$2"; shift 2 ;;
    --target) TARGET="$2"; shift 2 ;;
    --scope) SCOPE="$2"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

cd "$ROOT"

# Rationale: pick the newest backup file matching the supplied glob, without
# assuming GNU find. POSIX-friendly: use ls -t with care because we control the
# filename pattern (timestamp-suffixed .bak) so newline-in-filename risks do
# not apply here.
newest_backup() {
  pattern="$1"
  # shellcheck disable=SC2012,SC2086
  # SC2012: simple ls is fine here because we control the timestamped suffix.
  # SC2086: pattern is intentionally unquoted so the shell expands the glob.
  ls -t $pattern 2>/dev/null | head -n 1 || true
}

restore_project_claude_config() {
  latest="$(newest_backup ".claude/backups/CLAUDE.md.*.bak")"
  if [ -z "$latest" ]; then
    echo "No project .claude/CLAUDE.md backup found in .claude/backups/" >&2
    return 1
  fi
  cp "$latest" .claude/CLAUDE.md
  echo "Restored .claude/CLAUDE.md from $latest"
}

restore_global_claude_config() {
  latest="$(newest_backup "$CLAUDE_HOME/backups/CLAUDE.md.*.bak")"
  if [ -z "$latest" ]; then
    echo "No global ~/.claude/CLAUDE.md backup found in $CLAUDE_HOME/backups/" >&2
    return 1
  fi
  cp "$latest" "$CLAUDE_HOME/CLAUDE.md"
  echo "Restored $CLAUDE_HOME/CLAUDE.md from $latest"
}

restore_global_settings() {
  latest="$(newest_backup "$CLAUDE_HOME/backups/settings.json.*.bak")"
  if [ -z "$latest" ]; then
    echo "No ~/.claude/settings.json backup found in $CLAUDE_HOME/backups/" >&2
    return 1
  fi
  cp "$latest" "$CLAUDE_HOME/settings.json"
  echo "Restored $CLAUDE_HOME/settings.json from $latest"
}

restore_skill() {
  name="$1"
  latest="$(newest_backup "$CLAUDE_HOME/backups/skills.$name.*")"
  if [ -z "$latest" ]; then
    echo "No backup found for skill: $name" >&2
    return 1
  fi
  dest="$CLAUDE_HOME/skills/$name"
  if [ -d "$dest" ]; then
    ts="$(date +%Y%m%d-%H%M%S)"
    mv "$dest" "$CLAUDE_HOME/backups/skills.$name.$ts.pre-rollback"
  fi
  mkdir -p "$dest"
  cp -R "$latest"/. "$dest"/
  echo "Restored skill '$name' from $latest"
}

case "$TARGET" in
  claude-config|last-operation)
    case "$SCOPE" in
      project) restore_project_claude_config ;;
      global)  restore_global_claude_config ;;
      auto)
        # Try project first, then global. (Bug 4 fix: previously only project.)
        if [ -d .claude/backups ]; then
          restore_project_claude_config && exit 0
        fi
        restore_global_claude_config
        ;;
      *) echo "Unknown scope: $SCOPE" >&2; exit 2 ;;
    esac
    ;;
  settings)
    restore_global_settings
    ;;
  skills:*)
    name="${TARGET#skills:}"
    [ -n "$name" ] || { echo "Missing skill name after 'skills:'" >&2; exit 2; }
    restore_skill "$name"
    ;;
  *)
    if [ -f "$TARGET.bak" ]; then
      cp "$TARGET.bak" "$TARGET"
      echo "Restored $TARGET from $TARGET.bak"
    else
      echo "No backup found for $TARGET (looked for $TARGET.bak)" >&2
      exit 1
    fi
    ;;
esac
