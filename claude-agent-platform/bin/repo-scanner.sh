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

# --- Phase 3.1: registry-aware overrides ------------------------------------
# The Extender runs from INSIDE a downstream repo (e.g.
# .../GitHub/alawein/research/qmlab). The org repo (alawein/alawein) holds the
# authoritative registries:
#   catalog/repos.json   -> bucketed local_path + stack (canonical Root)
#   github-baseline.yaml -> install/build/test commands (canonical commands)
# We resolve the org repo, look PROJECT_NAME (the repo slug) up, and stage any
# overrides. They are APPLIED after local detection so the registry wins. If the
# org repo or slug cannot be found we keep scanned values and flag the rot via
# REGISTRY_FOUND=false so the generated config carries a "# registry: not found"
# marker instead of silently emitting unknown/pwd.
#
# ROOT_DISPLAY is what humans/configs should see; ROOT_ABS stays the real fs path
# used for the rest of the scan. Defaults below; possibly overridden later.
ROOT_DISPLAY="$ROOT_ABS"
INSTALL_COMMAND="unknown"
REGISTRY_FOUND="false"

# Resolve the org repo path. Honor $ORG_REPO_PATH if it points at a real org
# repo; otherwise walk up parents probing for a directory that holds the
# registries. Robust to the real layout where catalog/ is nested one level below
# the workspace alawein/ dir (i.e. the registries live in <ws>/alawein/alawein).
ORG_REPO=""
is_org_repo() {
  # A directory qualifies as the org repo when it holds BOTH registry anchors.
  [ -f "$1/catalog/repos.json" ] && [ -f "$1/projects.json" ]
}
if [ "${ORG_REPO_PATH:-}" != "" ] && is_org_repo "${ORG_REPO_PATH:-}"; then
  ORG_REPO="$ORG_REPO_PATH"
else
  _p="$ROOT_ABS"
  while [ -n "$_p" ] && [ "$_p" != "/" ] && [ "$_p" != "." ]; do
    # Probe candidates at this ancestor: the nested org repo, the workspace
    # alawein/ dir, then the ancestor itself.
    for _cand in "$_p/alawein/alawein" "$_p/alawein" "$_p"; do
      if is_org_repo "$_cand"; then ORG_REPO="$_cand"; break; fi
    done
    [ -n "$ORG_REPO" ] && break
    _parent="$(dirname "$_p")"
    [ "$_parent" = "$_p" ] && break
    _p="$_parent"
  done
fi

# If an org repo was found, parse the registries with py -3.12 (no jq). The
# helper prints shell-safe KEY=VALUE lines; missing keys are simply omitted.
if [ -n "$ORG_REPO" ] && [ -f "$ORG_REPO/catalog/repos.json" ]; then
  PYBIN="${PYTHON_BIN:-}"
  if [ -z "$PYBIN" ]; then
    if command -v py >/dev/null 2>&1; then PYBIN="py -3.12";
    elif command -v python3 >/dev/null 2>&1; then PYBIN="python3";
    elif command -v python >/dev/null 2>&1; then PYBIN="python";
    fi
  fi
  if [ -n "$PYBIN" ]; then
    _reg_out="$(
      ORG_REPO="$ORG_REPO" SLUG="$PROJECT_NAME" $PYBIN - <<'PYEOF' 2>/dev/null || true
import json, os, re, sys

org = os.environ["ORG_REPO"]
slug = os.environ["SLUG"]

def emit(k, v):
    # Single-quote for safe POSIX sourcing; escape embedded single quotes.
    s = "" if v is None else str(v)
    s = s.replace("'", "'\\''")
    sys.stdout.write("%s='%s'\n" % (k, s))

# --- catalog/repos.json: authoritative bucketed path + stack ---
found = False
entry = None
cat_path = os.path.join(org, "catalog", "repos.json")
try:
    with open(cat_path, "r", encoding="utf-8") as fh:
        cat = json.load(fh)
    repos = cat.get("repos", cat) if isinstance(cat, dict) else cat
    if isinstance(repos, dict):
        repos = list(repos.values())
    for r in (repos or []):
        if isinstance(r, dict) and r.get("slug") == slug:
            entry = r
            break
except Exception:
    entry = None

if entry is not None:
    found = True
    local_path = entry.get("local_path")
    bucket = entry.get("bucket")
    if local_path:
        # Express workspace-relative under the org namespace: alawein/<local_path>.
        emit("REG_ROOT_DISPLAY", "alawein/%s" % str(local_path).strip("/"))
    elif bucket:
        emit("REG_ROOT_DISPLAY", "alawein/%s/%s" % (str(bucket).strip("/"), slug))
    stack = entry.get("stack")
    if isinstance(stack, (list, tuple)) and stack:
        emit("REG_STACK", ",".join(str(x) for x in stack))
    elif isinstance(stack, str) and stack:
        emit("REG_STACK", stack)

# --- projects.json: bucket fallback only (no local_path there) ---
if entry is None or (not entry.get("local_path") and not entry.get("bucket")):
    proj_path = os.path.join(org, "projects.json")
    try:
        with open(proj_path, "r", encoding="utf-8") as fh:
            proj = json.load(fh)
        cand = []
        if isinstance(proj, dict):
            for v in proj.values():
                if isinstance(v, list):
                    cand.extend(v)
        elif isinstance(proj, list):
            cand = proj
        for r in cand:
            if isinstance(r, dict) and r.get("slug") == slug and r.get("bucket"):
                found = True
                emit("REG_ROOT_DISPLAY", "alawein/%s/%s" % (str(r["bucket"]).strip("/"), slug))
                break
    except Exception:
        pass

# --- github-baseline.yaml: authoritative commands ---
def load_yaml(path):
    # Prefer PyYAML; fall back to a minimal parser sufficient for this flat
    # "repos:" list of "key: value" scalars; else give up (catalog-only).
    try:
        import yaml  # type: ignore
        with open(path, "r", encoding="utf-8") as fh:
            return yaml.safe_load(fh)
    except ImportError:
        pass
    except Exception:
        return None
    try:
        return _minimal_baseline_parse(path)
    except Exception:
        return None

def _strip_q(s):
    s = s.strip()
    if len(s) >= 2 and s[0] in "'\"" and s[-1] == s[0]:
        return s[1:-1]
    return s

def _minimal_baseline_parse(path):
    # Only understands the subset we need: a top-level "repos:" sequence whose
    # items are "- repo: x" blocks with sibling "key: value" lines.
    repos = []
    cur = None
    in_repos = False
    with open(path, "r", encoding="utf-8") as fh:
        for raw in fh:
            line = raw.rstrip("\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            if re.match(r"^repos\s*:\s*$", line):
                in_repos = True
                continue
            if not in_repos:
                continue
            m = re.match(r"^(\s*)-\s*(\w[\w-]*)\s*:\s*(.*)$", line)
            if m:
                cur = {}
                repos.append(cur)
                cur[m.group(2)] = _strip_q(m.group(3))
                continue
            m = re.match(r"^\s+(\w[\w-]*)\s*:\s*(.*)$", line)
            if m and cur is not None:
                cur[m.group(1)] = _strip_q(m.group(2))
    return {"repos": repos}

base_path = os.path.join(org, "github-baseline.yaml")
if os.path.isfile(base_path):
    data = load_yaml(base_path)
    brepos = []
    if isinstance(data, dict):
        brepos = data.get("repos", [])
    elif isinstance(data, list):
        brepos = data
    bentry = None
    for r in (brepos or []):
        if not isinstance(r, dict):
            continue
        rname = r.get("repo")
        # Match bare slug or owner/slug form.
        if rname == slug or (isinstance(rname, str) and rname.split("/")[-1] == slug):
            bentry = r
            break
    if bentry is not None:
        found = True
        # Only emit non-empty commands; empty string in baseline means "none".
        for src, dst in (("install_command", "REG_INSTALL"),
                         ("build_command", "REG_BUILD"),
                         ("test_command", "REG_TEST"),
                         ("lint_command", "REG_LINT")):
            val = bentry.get(src)
            if isinstance(val, str) and val.strip():
                emit(dst, val)
        bstack = bentry.get("stack")
        if isinstance(bstack, str) and bstack.strip():
            emit("REG_STACK_BASE", bstack)

emit("REG_FOUND", "true" if found else "false")
PYEOF
    )"
    # Source the staged overrides into the current shell.
    if [ -n "$_reg_out" ]; then
      # shellcheck disable=SC2046,SC1090
      eval "$_reg_out"
    fi
  fi
fi
# --- end registry resolution (overrides applied after detection, below) -----

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

# --- Phase 3.1: apply staged registry overrides (registry wins over scan) ---
# Done here, AFTER local detection + defaults, so authoritative org values
# replace whatever the heuristic scan produced. When the slug was not found,
# REGISTRY_FOUND stays "false" and nothing below changes the scanned values.
REGISTRY_FOUND="${REG_FOUND:-false}"
if [ "$REGISTRY_FOUND" = "true" ]; then
  [ -n "${REG_ROOT_DISPLAY:-}" ] && ROOT_DISPLAY="$REG_ROOT_DISPLAY" || true
  # Stack: prefer catalog stack, then baseline stack.
  if [ -n "${REG_STACK:-}" ]; then STACK="$REG_STACK";
  elif [ -n "${REG_STACK_BASE:-}" ]; then STACK="$REG_STACK_BASE"; fi
  [ -n "${REG_INSTALL:-}" ] && INSTALL_COMMAND="$REG_INSTALL" || true
  [ -n "${REG_BUILD:-}" ] && BUILD_COMMAND="$REG_BUILD" || true
  [ -n "${REG_TEST:-}" ] && TEST_COMMAND="$REG_TEST" || true
  [ -n "${REG_LINT:-}" ] && LINT_COMMAND="$REG_LINT" || true
fi

if [ "$MODE" = "env" ]; then
  printf 'PROJECT_NAME=%s\n' "$(shell_quote "$PROJECT_NAME")"
  printf 'ROOT_ABS=%s\n' "$(shell_quote "$ROOT_ABS")"
  printf 'ROOT_DISPLAY=%s\n' "$(shell_quote "$ROOT_DISPLAY")"
  printf 'PROJECT_TYPE=%s\n' "$(shell_quote "$PROJECT_TYPE")"
  printf 'STACK=%s\n' "$(shell_quote "$STACK")"
  printf 'FRAMEWORKS=%s\n' "$(shell_quote "$FRAMEWORKS")"
  printf 'MANIFESTS=%s\n' "$(shell_quote "$MANIFESTS")"
  printf 'CI=%s\n' "$(shell_quote "$CI")"
  printf 'TOOLS=%s\n' "$(shell_quote "$TOOLS")"
  printf 'PACKAGE_MANAGER=%s\n' "$(shell_quote "$PACKAGE_MANAGER")"
  printf 'INSTALL_COMMAND=%s\n' "$(shell_quote "$INSTALL_COMMAND")"
  printf 'TEST_COMMAND=%s\n' "$(shell_quote "$TEST_COMMAND")"
  printf 'BUILD_COMMAND=%s\n' "$(shell_quote "$BUILD_COMMAND")"
  printf 'LINT_COMMAND=%s\n' "$(shell_quote "$LINT_COMMAND")"
  printf 'SOURCE_DIRS=%s\n' "$(shell_quote "$SOURCE_DIRS")"
  printf 'TEST_DIRS=%s\n' "$(shell_quote "$TEST_DIRS")"
  printf 'REGISTRY_FOUND=%s\n' "$(shell_quote "$REGISTRY_FOUND")"
  exit 0
fi

if [ "$MODE" = "summary" ]; then
  cat <<EOF
Project: $PROJECT_NAME
Root: $ROOT_DISPLAY
Root (filesystem): $ROOT_ABS
Registry: $([ "$REGISTRY_FOUND" = "true" ] && echo found || echo "not found")
Type: $PROJECT_TYPE
Stack: $STACK
Frameworks: $FRAMEWORKS
Manifests: $MANIFESTS
CI: $CI
Tools: $TOOLS
Package manager: $PACKAGE_MANAGER
Install: $INSTALL_COMMAND
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
  "root_display": "$(printf "%s" "$ROOT_DISPLAY" | json_escape)",
  "registry_found": $([ "$REGISTRY_FOUND" = "true" ] && printf 'true' || printf 'false'),
  "project_type": "$(printf "%s" "$PROJECT_TYPE" | json_escape)",
  "stack": "$(printf "%s" "$STACK" | json_escape)",
  "frameworks": "$(printf "%s" "$FRAMEWORKS" | json_escape)",
  "manifests": "$(printf "%s" "$MANIFESTS" | json_escape)",
  "ci": "$(printf "%s" "$CI" | json_escape)",
  "tools": "$(printf "%s" "$TOOLS" | json_escape)",
  "package_manager": "$(printf "%s" "$PACKAGE_MANAGER" | json_escape)",
  "commands": {
    "install": "$(printf "%s" "$INSTALL_COMMAND" | json_escape)",
    "test": "$(printf "%s" "$TEST_COMMAND" | json_escape)",
    "build": "$(printf "%s" "$BUILD_COMMAND" | json_escape)",
    "lint": "$(printf "%s" "$LINT_COMMAND" | json_escape)"
  },
  "source_dirs": "$(printf "%s" "$SOURCE_DIRS" | json_escape)",
  "test_dirs": "$(printf "%s" "$TEST_DIRS" | json_escape)"
}
EOF
