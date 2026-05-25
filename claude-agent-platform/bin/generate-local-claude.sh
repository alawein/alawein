#!/bin/sh
# generate-local-claude.sh — Extender proposal and write engine.
# Rationale: Local project config generation should be deterministic and reversible.

set -eu

# Capture this script's own directory BEFORE any cd into --root, so the sibling
# repo-scanner.sh can still be located afterward (POSIX sh: use $0, not
# BASH_SOURCE). Deriving this after `cd "$ROOT"` breaks when $0 is relative.
# shellcheck disable=SC1007
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

ROOT="$(pwd)"
ACTION="dry-run"
FORCE="false"
BRIEF="false"

usage() {
  cat <<'EOF'
Usage: generate-local-claude.sh [--root DIR] [--dry-run|--approve|--rollback] [--force] [--brief]

Creates or previews .claude/CLAUDE.md based on repository scan.

Modes:
  --dry-run / --propose  Show the proposal and diff without writing (default).
  --approve / --write    Back up the existing file then write the proposal.
  --rollback             Restore the most recent backup of .claude/CLAUDE.md.

Flags:
  --force                Re-propose even if the project was already initialized.
  --brief                Print only the proposal path (machine-readable).
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --root) ROOT="$2"; shift 2 ;;
    --dry-run|--propose) ACTION="dry-run"; shift ;;
    --approve|--write) ACTION="approve"; shift ;;
    --rollback) ACTION="rollback"; shift ;;
    --force) FORCE="true"; shift ;;
    --brief) BRIEF="true"; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [ ! -d "$ROOT" ]; then
  echo "Root is not a directory: $ROOT" >&2
  exit 2
fi

cd "$ROOT"
ROOT_ABS="$(pwd)"
CLAUDE_DIR=".claude"
PROPOSAL_DIR="$CLAUDE_DIR/proposals"
BACKUP_DIR="$CLAUDE_DIR/backups"
STATE_FILE="$CLAUDE_DIR/state.json"
TARGET_FILE="$CLAUDE_DIR/CLAUDE.md"
TS="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$PROPOSAL_DIR" "$BACKUP_DIR"

if [ "$ACTION" = "rollback" ]; then
  # shellcheck disable=SC2012
  latest="$(ls -t "$BACKUP_DIR"/CLAUDE.md.*.bak 2>/dev/null | head -n 1 || true)"
  if [ -z "$latest" ]; then
    echo "No CLAUDE.md backup found in $BACKUP_DIR" >&2
    exit 1
  fi
  cp "$latest" "$TARGET_FILE"
  cat > "$STATE_FILE" <<EOF
{
  "first_run": false,
  "last_operation": "rollback",
  "restored_from": "$latest",
  "updated_at": "$TS"
}
EOF
  echo "Restored $TARGET_FILE from $latest"
  exit 0
fi

# Locate the scanner: prefer the SIBLING copy shipped next to this script, then
# fall back to the installed copy under CLAUDE_HOME.
#
# Rationale (Phase 3.1): generate-local-claude.sh and repo-scanner.sh are a
# matched pair. The generator consumes vars (ROOT_DISPLAY, INSTALL_COMMAND,
# REGISTRY_FOUND) that only the upgraded scanner emits. Preferring the deployed
# CLAUDE_HOME copy meant a stale global scanner silently shadowed in-repo
# changes, so registry-aware output never appeared when running from the source
# tree. Resolving the sibling first keeps the pair coherent. An explicit
# $REPO_SCANNER override still wins for tests and special deployments.
if [ -n "${REPO_SCANNER:-}" ] && [ -x "${REPO_SCANNER:-}" ]; then
  SCANNER="$REPO_SCANNER"
elif [ -x "$SCRIPT_DIR/repo-scanner.sh" ]; then
  SCANNER="$SCRIPT_DIR/repo-scanner.sh"
else
  SCANNER="${CLAUDE_HOME:-$HOME/.claude}/bin/repo-scanner.sh"
fi
if [ ! -x "$SCANNER" ]; then
  echo "Cannot find repo-scanner.sh (looked at REPO_SCANNER, script dir, and CLAUDE_HOME/bin)" >&2
  exit 2
fi

SCAN_ENV="$(mktemp)"
trap 'rm -f "$SCAN_ENV"' EXIT
"$SCANNER" --root "$ROOT_ABS" --env > "$SCAN_ENV"
# shellcheck disable=SC1090
. "$SCAN_ENV"

# Phase 3.1: the scanner may resolve the org registries and override Root +
# commands. Fall back gracefully for older scanners that do not emit these.
ROOT_DISPLAY="${ROOT_DISPLAY:-$ROOT_ABS}"
INSTALL_COMMAND="${INSTALL_COMMAND:-unknown}"
REGISTRY_FOUND="${REGISTRY_FOUND:-false}"
if [ "$REGISTRY_FOUND" = "true" ]; then
  REGISTRY_MARKER="# registry: found ($PROJECT_NAME resolved from org catalog/baseline)"
else
  REGISTRY_MARKER="# registry: not found ($PROJECT_NAME absent from org registry; values are scanned, not authoritative)"
fi

# Informational notice when re-running after init unless --force is used.
# (Only relevant when previewing; the message used to be misleading because it
# claimed re-init was being skipped while still proceeding to print a proposal.)
if [ "$ACTION" = "dry-run" ] \
   && [ -f "$STATE_FILE" ] \
   && grep -q '"first_run"[[:space:]]*:[[:space:]]*false' "$STATE_FILE" \
   && [ "$FORCE" != "true" ]; then
  echo "Note: local Claude config already initialized. Showing fresh proposal anyway; pass --force to override the init flag."
fi

# Conflict detection: only meaningful when both global and local skill dirs exist.
CONFLICTS="none"
if [ -d "$CLAUDE_DIR/skills" ] && [ -d "${CLAUDE_HOME:-$HOME/.claude}/skills" ]; then
  conflicts=""
  for s in "$CLAUDE_DIR"/skills/*; do
    [ -d "$s" ] || continue
    n="$(basename "$s")"
    [ -d "${CLAUDE_HOME:-$HOME/.claude}/skills/$n" ] && conflicts="$conflicts $n"
  done
  [ -n "$conflicts" ] && CONFLICTS="$(printf "%s" "$conflicts" | sed 's/^ //')"
fi

PROPOSAL="$PROPOSAL_DIR/CLAUDE.md.proposed"
cat > "$PROPOSAL" <<EOF
---
type: local-claude-config
generated: true
source: claude-agent-platform-extender
---
<!-- generated by Extender on $TS -->

# Project Claude Configuration: $PROJECT_NAME

$REGISTRY_MARKER

## Detected Project Profile

- Root: \`$ROOT_DISPLAY\`
- Project type: \`$PROJECT_TYPE\`
- Stack: \`$STACK\`
- Frameworks: \`$FRAMEWORKS\`
- Manifests: \`$MANIFESTS\`
- CI: \`$CI\`
- Tools: \`$TOOLS\`
- Source dirs: \`$SOURCE_DIRS\`
- Test dirs: \`$TEST_DIRS\`

## Project Commands

$REGISTRY_MARKER

- Install command: \`$INSTALL_COMMAND\`
- Test command: \`$TEST_COMMAND\`
- Build command: \`$BUILD_COMMAND\`
- Lint command: \`$LINT_COMMAND\`
- Package manager: \`$PACKAGE_MANAGER\`

## Local Precedence

- Prefer this file over user-level defaults for project commands. <!-- Rationale: Detected repo commands are more specific than global defaults. -->
- Preserve global safety gates from \`~/.claude/CLAUDE.md\`. <!-- Rationale: Local overrides should not disable safety. -->
- Avoid same-name local skills unless intentionally shadowing global behavior. <!-- Rationale: Skill conflict resolution can be surprising. -->

## Local Agent Specializations

### Orchestrator

- For multi-step work, run lint/test/build commands above when relevant.
- If command is \`unknown\`, ask once for the missing command and store it in \`.claude/MEMORY.md\`.

### Codex

- Match patterns from: \`$SOURCE_DIRS\`.
- Use the detected stack: \`$STACK\` and frameworks: \`$FRAMEWORKS\`.
- Generate tests near existing test dirs when present: \`$TEST_DIRS\`.

### Cursor

- Use surgical diffs.
- After edits, run: \`$TEST_COMMAND\` when not \`unknown\`.
- Do not reformat unrelated files.

### Research

- Prefer local patterns in \`$SOURCE_DIRS\` before external docs.
- Use manifests \`$MANIFESTS\` to infer versions before recommending APIs.

### Reviewer

- Treat changes to manifests, CI, auth, migrations, and lockfiles as high-risk.
- BLOCKER findings prevent \`/commit\` and \`/pr\` workflows.

### Extender

- Re-scan with: \`~/.claude/bin/generate-local-claude.sh --root . --dry-run --force\`.
- Approve regenerated config only after reviewing the diff.

## Local Workflows

### PR Ready

1. Run lint: \`$LINT_COMMAND\` if known.
2. Run tests: \`$TEST_COMMAND\` if known.
3. Run build: \`$BUILD_COMMAND\` if known.
4. Run Reviewer on the diff.
5. Run security-scan on high-risk files.
6. Draft changelog, commit, and PR only after approval.

### New Feature

1. Research local patterns.
2. Scaffold minimal structure.
3. Implement behavior.
4. Generate tests.
5. Update docs.
6. Review and run PR Ready.

### Bug Fix

1. Reproduce failure.
2. Identify root cause.
3. Patch minimally.
4. Add regression test.
5. Run relevant tests.
6. Review and commit.

## Local Skills

- Store repo-scoped skills in \`.claude/skills/<skill-name>/SKILL.md\`.
- Version local skills in \`.claude/skills/registry.json\`.
- Conflict detection result: \`$CONFLICTS\`.

## Local Memory

- Store architecture decisions as \`[DECISION]\`.
- Store discovered code patterns as \`[PATTERN]\`.
- Store command corrections as \`[CONFIG]\`.
- Store pitfalls as \`[GOTCHA]\`.
- Keep session summaries to five lines max.
EOF

if [ "$BRIEF" = "true" ]; then
  echo "$PROPOSAL"
  exit 0
fi

cat <<EOF
[EXTENDER PROPOSAL]
project_type: $PROJECT_TYPE
root: $ROOT_DISPLAY
registry: $([ "$REGISTRY_FOUND" = "true" ] && echo found || echo "not found")
stack: [$STACK]
commands_detected:
  install: $INSTALL_COMMAND
  test: $TEST_COMMAND
  build: $BUILD_COMMAND
  lint: $LINT_COMMAND
proposed_commands: [pr-ready, new-feature, bug-fix, extend]
proposed_skills: [project-local skills directory if approved]
conflicts_with_global: [$CONFLICTS]
proposal_path: $PROPOSAL
EOF

if [ -f "$TARGET_FILE" ]; then
  echo "--- diff against existing $TARGET_FILE ---"
  diff -u "$TARGET_FILE" "$PROPOSAL" || true
else
  echo "--- new file preview: $TARGET_FILE ---"
  cat "$PROPOSAL"
fi

if [ "$ACTION" = "approve" ]; then
  if [ -f "$TARGET_FILE" ]; then
    cp "$TARGET_FILE" "$BACKUP_DIR/CLAUDE.md.$TS.bak"
  fi
  cp "$PROPOSAL" "$TARGET_FILE"
  if [ ! -f "$CLAUDE_DIR/MEMORY.md" ]; then
    cat > "$CLAUDE_DIR/MEMORY.md" <<'EOF'
# Project Memory

[CONFIG] Local Claude config initialized by Extender.
EOF
  fi
  cat > "$STATE_FILE" <<EOF
{
  "first_run": false,
  "last_operation": "generate-local-claude",
  "proposal": "$PROPOSAL",
  "target": "$TARGET_FILE",
  "updated_at": "$TS"
}
EOF
  echo "Wrote $TARGET_FILE"
  echo "Backup directory: $BACKUP_DIR"
else
  echo "Approve with: ~/.claude/bin/generate-local-claude.sh --root '$ROOT_ABS' --approve"
  echo "Rollback with: ~/.claude/bin/generate-local-claude.sh --root '$ROOT_ABS' --rollback"
fi
