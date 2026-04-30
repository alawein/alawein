#!/bin/sh
# extender-first-run-hook.sh — SessionStart hook for new repositories.
# Rationale: Auto-prime Extender without writing files or requiring dependencies.

set -eu

input="$(cat || true)"
# Extract cwd from hook JSON without jq. Good enough for Claude Code's simple cwd field.
cwd="$(printf "%s" "$input" | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
[ -n "$cwd" ] || cwd="$(pwd)"
[ -d "$cwd" ] || exit 0
cd "$cwd"

is_project="false"
for marker in .git package.json pyproject.toml requirements.txt Cargo.toml go.mod Makefile .github .gitlab-ci.yml Dockerfile; do
  [ -e "$marker" ] && is_project="true"
done
[ "$is_project" = "true" ] || exit 0

if [ -f .claude/state.json ] && grep -q '"first_run"[[:space:]]*:[[:space:]]*false' .claude/state.json; then
  exit 0
fi

cat <<EOF
[EXTENDER_AUTO_TRIGGER]
reason: This looks like a project that has not completed Claude local setup.
current_directory: $cwd
instruction: Before substantive project work, run Extender scan/proposal. Do not write files until the user approves.
manual_scan: ~/.claude/bin/repo-scanner.sh --root . --json
manual_proposal: ~/.claude/bin/generate-local-claude.sh --root . --dry-run
manual_approval: ~/.claude/bin/generate-local-claude.sh --root . --approve
EOF
