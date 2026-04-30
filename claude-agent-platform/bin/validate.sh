#!/bin/sh
# validate.sh — sanity-check the installed Claude agent platform.
# Rationale: After install or upgrade, one command should verify the layout
# and surface obvious problems before the user runs into them in a session.

set -eu

# Parse flags
JSON_OUT=false
for arg in "$@"; do
  case "$arg" in
    --json) JSON_OUT=true ;;
  esac
done

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
# Convert to mixed path (C:/...) for python3 open() on Windows Git Bash.
_PY_HOME="$(cygpath -m "$CLAUDE_HOME" 2>/dev/null || echo "$CLAUDE_HOME")"

fail=0
warn=0
findings=""

ok()    { $JSON_OUT || printf "  [OK]   %s\n" "$1"; }
note()  { $JSON_OUT || printf "  [NOTE] %s\n" "$1"; warn=$((warn+1)); findings="${findings}{\"level\":\"warn\",\"msg\":\"$1\"},"; }
bad()   { $JSON_OUT || printf "  [FAIL] %s\n" "$1"; fail=$((fail+1)); findings="${findings}{\"level\":\"fail\",\"msg\":\"$1\"},"; }

$JSON_OUT || { echo "Claude agent platform health check"; echo "  CLAUDE_HOME=$CLAUDE_HOME"; echo; }

$JSON_OUT || echo "== Required directories =="
for d in agents skills workflows schemas bin docs backups state; do
  if [ -d "$CLAUDE_HOME/$d" ]; then
    ok "$d/"
  else
    bad "$d/ missing"
  fi
done

$JSON_OUT || echo
$JSON_OUT || echo "== Core scripts =="
for s in repo-scanner.sh generate-local-claude.sh skill-manager.sh rollback.sh extender-first-run-hook.sh; do
  if [ -x "$CLAUDE_HOME/bin/$s" ]; then
    ok "$s executable"
  else
    bad "$s missing or not executable"
  fi
done

$JSON_OUT || echo
$JSON_OUT || echo "== Global CLAUDE.md =="
if [ -f "$CLAUDE_HOME/CLAUDE.md" ]; then
  size="$(wc -c < "$CLAUDE_HOME/CLAUDE.md" | tr -d ' ')"
  if [ "$size" -gt 100 ]; then
    ok "CLAUDE.md present ($size bytes)"
  else
    note "CLAUDE.md present but very small ($size bytes)"
  fi
else
  bad "CLAUDE.md missing"
fi

$JSON_OUT || echo
$JSON_OUT || echo "== Skills =="
skill_count=0
for d in "$CLAUDE_HOME"/skills/*/; do
  [ -d "$d" ] || continue
  if [ -f "$d/SKILL.md" ]; then
    skill_count=$((skill_count+1))
  else
    bad "$(basename "$d") has no SKILL.md"
  fi
done
ok "Installed skills: $skill_count"

if [ -f "$CLAUDE_HOME/skills/registry.json" ]; then
  ok "registry.json present"
  if command -v python3 >/dev/null 2>&1; then
    if python3 -c "import json; json.load(open('$_PY_HOME/skills/registry.json'))" 2>/dev/null; then
      ok "registry.json is valid JSON"
    else
      bad "registry.json is invalid JSON"
    fi
  fi
else
  note "registry.json missing (run: $CLAUDE_HOME/bin/skill-manager.sh registry)"
fi

$JSON_OUT || echo
$JSON_OUT || echo "== Workflows =="
for w in pr-ready new-feature bug-fix; do
  if [ -f "$CLAUDE_HOME/workflows/$w.workflow.yaml" ]; then
    ok "$w.workflow.yaml"
  else
    bad "$w.workflow.yaml missing"
  fi
done

$JSON_OUT || echo
$JSON_OUT || echo "== Settings hook =="
if [ -f "$CLAUDE_HOME/settings.json" ]; then
  if grep -q 'extender-first-run-hook.sh' "$CLAUDE_HOME/settings.json"; then
    ok "SessionStart hook installed"
  else
    note "settings.json present but does not reference the Extender hook"
  fi
  if command -v python3 >/dev/null 2>&1; then
    if python3 -c "import json; json.load(open('$_PY_HOME/settings.json'))" 2>/dev/null; then
      ok "settings.json is valid JSON"
    else
      bad "settings.json is invalid JSON (rollback: $CLAUDE_HOME/bin/rollback.sh --target settings)"
    fi
  fi
else
  note "settings.json not yet created"
fi

$JSON_OUT || echo
$JSON_OUT || echo "== Agents =="
for a in orchestrator codex cursor research reviewer extender; do
  if [ -f "$CLAUDE_HOME/agents/$a.md" ]; then
    ok "$a.md"
  else
    bad "$a.md missing"
  fi
done

if $JSON_OUT; then
  # Strip trailing comma from findings list if any
  findings="${findings%,}"
  pass=true; [ "$fail" -gt 0 ] && pass=false
  printf '{"failures":%d,"warnings":%d,"pass":%s,"findings":[%s]}\n' \
    "$fail" "$warn" "$pass" "$findings"
else
  echo
  echo "== Summary =="
  echo "  failures=$fail  warnings=$warn"
fi
if [ "$fail" -gt 0 ]; then
  exit 1
fi
exit 0
