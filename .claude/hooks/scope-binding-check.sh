#!/usr/bin/env bash
# scope-binding-check.sh — I-4 Scope Binding (Cursor PreToolUse)
# Version: 1.1.2
# Always print valid JSON so Cursor never sees an empty hook response.

permission_decision="allow"
permission_reason="Scope check skipped or within threshold."
warn_only="${1:-}"

SCOPE_THRESHOLD="${SCOPE_THRESHOLD:-10}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || SCRIPT_DIR="."
if [ -f "${SCRIPT_DIR}/config.env" ]; then
  # shellcheck disable=SC1091
  . "${SCRIPT_DIR}/config.env" 2>/dev/null || true
  SCOPE_THRESHOLD="${SCOPE_THRESHOLD:-10}"
fi

file_count=0
if command -v git >/dev/null 2>&1; then
  raw_count="$(git diff --cached --name-only 2>/dev/null | wc -l 2>/dev/null | tr -d '[:space:]')"
  case "$raw_count" in
    ''|*[!0-9]*) file_count=0 ;;
    *) file_count="$raw_count" ;;
  esac
fi

permission_reason="Scope within threshold (${file_count} files, limit ${SCOPE_THRESHOLD})."

if [ "$file_count" -gt "$SCOPE_THRESHOLD" ] 2>/dev/null; then
  msg="About to commit changes to ${file_count} files (threshold: ${SCOPE_THRESHOLD}). Verify this is one logical unit, not scope creep (I-4)."
  if [ "$warn_only" = "--warn-only" ]; then
    permission_reason="WARNING: ${msg}"
    echo "WARNING: ${msg}" >&2
  else
    permission_decision="deny"
    permission_reason="ERROR: ${msg}"
    echo "ERROR: ${msg}" >&2
  fi
fi

permission_reason="${permission_reason//\\/\\\\}"
permission_reason="${permission_reason//\"/\\\"}"
permission_reason="${permission_reason//$'\n'/\\n}"
permission_reason="${permission_reason//$'\r'/}"

printf '%s\n' "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"${permission_decision}\",\"permissionDecisionReason\":\"${permission_reason}\"}}"

if [ "$permission_decision" = "deny" ]; then
  exit 1
fi
exit 0
