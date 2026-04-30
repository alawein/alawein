#!/bin/sh
# repo-scanner.sh — POSIX repository analysis for Claude Code Extender.
# Rationale: Keep scan dependency-free so it runs on fresh developer machines.

set -eu

ROOT="$(pwd)"
MODE="json"

usage() {
  cat <<'EOF'
Usage: repo-scanner.sh [--root DIR] [--json|--env|--summary]

Scans project markers: package.json, Cargo.toml, pyproject.toml,
requirements.txt, go.mod, Makefile, CI configs, Docker files, and structure.
Reports detected stacks, frameworks, and inferred test/build/lint commands.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --root) ROOT="$2"; shift 2 ;;
    --json) MODE="json"; shift ;;
    --env) MODE="env"; shift ;;
    --summary) MODE="summary"; shift ;;
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
PROJECT_NAME="$(basename "$ROOT_ABS")"

json_escape() {
  # Rationale: Minimal JSON string escaping without jq/python.
  # Order matters: backslash first, then quote, then control chars.
  sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g' | tr '\n' ' '
}

shell_quote() {
  # Rationale: Allows --env output to be safely sourced by POSIX shell.
  printf "%s" "$1" | sed "s/'/'\\\\''/g; s/^/'/; s/$/'/"
}

contains() {
  file="$1"; pattern="$2"
  [ -f "$file" ] && grep -Eiq "$pattern" "$file"
}

append_csv() {
  current="$1"; item="$2"
  if [ -z "$current" ]; then printf "%s" "$item"; else printf "%s,%s" "$current" "$item"; fi
}

STACK=""
FRAMEWORKS=""
MANIFESTS=""
CI=""
PACKAGE_MANAGER="unknown"
TEST_COMMAND="unknown"
BUILD_COMMAND="unknown"
LINT_COMMAND="unknown"
SOURCE_DIRS=""
TEST_DIRS=""
TOOLS=""
PROJECT_TYPE="unknown"

# Rationale: For polyglot projects, record the FIRST detected primary type
# (Bug 2 fix). The previous logic let later branches overwrite PROJECT_TYPE,
# so a Node + Rust project would report "rust" even though Node was discovered
# first and is more likely the primary surface. The full STACK csv still
# enumerates everything detected.
set_primary_type() {
  if [ "$PROJECT_TYPE" = "unknown" ]; then
    PROJECT_TYPE="$1"
  fi
}

# --- Node / TypeScript ---
if [ -f package.json ]; then
  STACK="$(append_csv "$STACK" "node")"
  MANIFESTS="$(append_csv "$MANIFESTS" "package.json")"
  set_primary_type "node"
  if [ -f pnpm-lock.yaml ]; then
    PACKAGE_MANAGER="pnpm"
  elif [ -f yarn.lock ]; then
    PACKAGE_MANAGER="yarn"
  elif [ -f bun.lockb ]; then
    PACKAGE_MANAGER="bun"
  elif [ -f package-lock.json ]; then
    PACKAGE_MANAGER="npm"
  else
    PACKAGE_MANAGER="npm"
  fi

  contains package.json '"typescript"|"ts-node"|"tsx"' && STACK="$(append_csv "$STACK" "typescript")" || true
  contains package.json '"next"' && FRAMEWORKS="$(append_csv "$FRAMEWORKS" "nextjs")" || true
  contains package.json '"react"' && FRAMEWORKS="$(append_csv "$FRAMEWORKS" "react")" || true
  contains package.json '"express"' && FRAMEWORKS="$(append_csv "$FRAMEWORKS" "express")" || true
  contains package.json '"@nestjs/' && FRAMEWORKS="$(append_csv "$FRAMEWORKS" "nestjs")" || true
  contains package.json '"fastify"' && FRAMEWORKS="$(append_csv "$FRAMEWORKS" "fastify")" || true
  contains package.json '"vite"' && TOOLS="$(append_csv "$TOOLS" "vite")" || true
  contains package.json '"vitest"' && TOOLS="$(append_csv "$TOOLS" "vitest")" || true
  contains package.json '"jest"' && TOOLS="$(append_csv "$TOOLS" "jest")" || true
  contains package.json '"playwright"|"@playwright/test"' && TOOLS="$(append_csv "$TOOLS" "playwright")" || true

  script_cmd() {
    key="$1"
    sed -n '/"scripts"[[:space:]]*:/,/^[[:space:]]*}[,[:space:]]*$/p' package.json \
      | sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" \
      | head -n 1
  }
  t="$(script_cmd test || true)";  [ -n "$t" ] && TEST_COMMAND="$PACKAGE_MANAGER run test" || true
  b="$(script_cmd build || true)"; [ -n "$b" ] && BUILD_COMMAND="$PACKAGE_MANAGER run build" || true
  l="$(script_cmd lint || true)";  [ -n "$l" ] && LINT_COMMAND="$PACKAGE_MANAGER run lint" || true
fi

# --- Python ---
if [ -f pyproject.toml ] || [ -f requirements.txt ]; then
  STACK="$(append_csv "$STACK" "python")"
  set_primary_type "python"
  [ -f pyproject.toml ] && MANIFESTS="$(append_csv "$MANIFESTS" "pyproject.toml")" || true
  [ -f requirements.txt ] && MANIFESTS="$(append_csv "$MANIFESTS" "requirements.txt")" || true
  if contains pyproject.toml 'django' || contains requirements.txt 'django'; then
    FRAMEWORKS="$(append_csv "$FRAMEWORKS" "django")"
  fi
  if contains pyproject.toml 'fastapi' || contains requirements.txt 'fastapi'; then
    FRAMEWORKS="$(append_csv "$FRAMEWORKS" "fastapi")"
  fi
  if contains pyproject.toml 'flask' || contains requirements.txt 'flask'; then
    FRAMEWORKS="$(append_csv "$FRAMEWORKS" "flask")"
  fi
  if contains pyproject.toml 'pytest' || contains requirements.txt 'pytest'; then
    TOOLS="$(append_csv "$TOOLS" "pytest")"
    [ "$TEST_COMMAND" = "unknown" ] && TEST_COMMAND="pytest" || true
  fi
  if contains pyproject.toml 'ruff' || contains requirements.txt 'ruff'; then
    TOOLS="$(append_csv "$TOOLS" "ruff")"
    [ "$LINT_COMMAND" = "unknown" ] && LINT_COMMAND="ruff check ." || true
  fi
fi

# --- Rust ---
if [ -f Cargo.toml ]; then
  STACK="$(append_csv "$STACK" "rust")"
  MANIFESTS="$(append_csv "$MANIFESTS" "Cargo.toml")"
  set_primary_type "rust"
  [ "$TEST_COMMAND" = "unknown" ] && TEST_COMMAND="cargo test" || true
  [ "$BUILD_COMMAND" = "unknown" ] && BUILD_COMMAND="cargo build" || true
  [ "$LINT_COMMAND" = "unknown" ] && LINT_COMMAND="cargo clippy --all-targets --all-features" || true
fi

# --- Go ---
if [ -f go.mod ]; then
  STACK="$(append_csv "$STACK" "go")"
  MANIFESTS="$(append_csv "$MANIFESTS" "go.mod")"
  set_primary_type "go"
  [ "$TEST_COMMAND" = "unknown" ] && TEST_COMMAND="go test ./..." || true
  [ "$BUILD_COMMAND" = "unknown" ] && BUILD_COMMAND="go build ./..." || true
fi

# --- Makefile (case-aware: Bug 3 fix) ---
MAKEFILE_PATH=""
if [ -f Makefile ]; then
  MAKEFILE_PATH="Makefile"
elif [ -f makefile ]; then
  MAKEFILE_PATH="makefile"
elif [ -f GNUmakefile ]; then
  MAKEFILE_PATH="GNUmakefile"
fi
if [ -n "$MAKEFILE_PATH" ]; then
  MANIFESTS="$(append_csv "$MANIFESTS" "$MAKEFILE_PATH")"
  if [ "$TEST_COMMAND" = "unknown" ] && grep -Eq '^test:' "$MAKEFILE_PATH" 2>/dev/null; then
    TEST_COMMAND="make test"
  fi
  if [ "$BUILD_COMMAND" = "unknown" ] && grep -Eq '^build:' "$MAKEFILE_PATH" 2>/dev/null; then
    BUILD_COMMAND="make build"
  fi
  if [ "$LINT_COMMAND" = "unknown" ] && grep -Eq '^lint:' "$MAKEFILE_PATH" 2>/dev/null; then
    LINT_COMMAND="make lint"
  fi
fi

# --- CI / containerization ---
[ -d .github/workflows ] && CI="$(append_csv "$CI" "github-actions")" || true
[ -f .gitlab-ci.yml ] && CI="$(append_csv "$CI" "gitlab-ci")" || true
[ -f .circleci/config.yml ] && CI="$(append_csv "$CI" "circleci")" || true
[ -f Dockerfile ] && TOOLS="$(append_csv "$TOOLS" "docker")" || true
if [ -f docker-compose.yml ] || [ -f compose.yaml ] || [ -f compose.yml ]; then
  TOOLS="$(append_csv "$TOOLS" "compose")"
fi

# --- Source / test directories ---
for d in src lib app packages services cmd internal pkg tests test spec e2e __tests__; do
  if [ -d "$d" ]; then
    case "$d" in
      tests|test|spec|e2e|__tests__) TEST_DIRS="$(append_csv "$TEST_DIRS" "$d")" ;;
      *) SOURCE_DIRS="$(append_csv "$SOURCE_DIRS" "$d")" ;;
    esac
  fi
done

[ -z "$STACK" ] && STACK="unknown"
[ -z "$FRAMEWORKS" ] && FRAMEWORKS="none"
[ -z "$MANIFESTS" ] && MANIFESTS="none"
[ -z "$CI" ] && CI="none"
[ -z "$TOOLS" ] && TOOLS="none"
[ -z "$SOURCE_DIRS" ] && SOURCE_DIRS="unknown"
[ -z "$TEST_DIRS" ] && TEST_DIRS="unknown"

if [ "$MODE" = "env" ]; then
  printf 'PROJECT_NAME=%s\n' "$(shell_quote "$PROJECT_NAME")"
  printf 'ROOT_ABS=%s\n' "$(shell_quote "$ROOT_ABS")"
  printf 'PROJECT_TYPE=%s\n' "$(shell_quote "$PROJECT_TYPE")"
  printf 'STACK=%s\n' "$(shell_quote "$STACK")"
  printf 'FRAMEWORKS=%s\n' "$(shell_quote "$FRAMEWORKS")"
  printf 'MANIFESTS=%s\n' "$(shell_quote "$MANIFESTS")"
  printf 'CI=%s\n' "$(shell_quote "$CI")"
  printf 'TOOLS=%s\n' "$(shell_quote "$TOOLS")"
  printf 'PACKAGE_MANAGER=%s\n' "$(shell_quote "$PACKAGE_MANAGER")"
  printf 'TEST_COMMAND=%s\n' "$(shell_quote "$TEST_COMMAND")"
  printf 'BUILD_COMMAND=%s\n' "$(shell_quote "$BUILD_COMMAND")"
  printf 'LINT_COMMAND=%s\n' "$(shell_quote "$LINT_COMMAND")"
  printf 'SOURCE_DIRS=%s\n' "$(shell_quote "$SOURCE_DIRS")"
  printf 'TEST_DIRS=%s\n' "$(shell_quote "$TEST_DIRS")"
  exit 0
fi

if [ "$MODE" = "summary" ]; then
  cat <<EOF
Project: $PROJECT_NAME
Root: $ROOT_ABS
Type: $PROJECT_TYPE
Stack: $STACK
Frameworks: $FRAMEWORKS
Manifests: $MANIFESTS
CI: $CI
Tools: $TOOLS
Package manager: $PACKAGE_MANAGER
Test: $TEST_COMMAND
Build: $BUILD_COMMAND
Lint: $LINT_COMMAND
Source dirs: $SOURCE_DIRS
Test dirs: $TEST_DIRS
EOF
  exit 0
fi

cat <<EOF
{
  "project_name": "$(printf "%s" "$PROJECT_NAME" | json_escape)",
  "root": "$(printf "%s" "$ROOT_ABS" | json_escape)",
  "project_type": "$(printf "%s" "$PROJECT_TYPE" | json_escape)",
  "stack": "$(printf "%s" "$STACK" | json_escape)",
  "frameworks": "$(printf "%s" "$FRAMEWORKS" | json_escape)",
  "manifests": "$(printf "%s" "$MANIFESTS" | json_escape)",
  "ci": "$(printf "%s" "$CI" | json_escape)",
  "tools": "$(printf "%s" "$TOOLS" | json_escape)",
  "package_manager": "$(printf "%s" "$PACKAGE_MANAGER" | json_escape)",
  "commands": {
    "test": "$(printf "%s" "$TEST_COMMAND" | json_escape)",
    "build": "$(printf "%s" "$BUILD_COMMAND" | json_escape)",
    "lint": "$(printf "%s" "$LINT_COMMAND" | json_escape)"
  },
  "source_dirs": "$(printf "%s" "$SOURCE_DIRS" | json_escape)",
  "test_dirs": "$(printf "%s" "$TEST_DIRS" | json_escape)"
}
EOF
