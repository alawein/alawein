#!/bin/sh
# test-registry-aware.sh: hermetic TDD spec for Phase 3.1 registry-aware Extender.
#
# Verifies that repo-scanner.sh + generate-local-claude.sh resolve the org repo,
# look the current repo slug up in the org registries, and OVERRIDE the generated
# .claude/CLAUDE.md Root (to a bucketed workspace-relative path) and the
# install/build/test/lint command fields (from github-baseline.yaml), instead of
# emitting a machine-absolute pwd and "unknown".
#
# Run: bash claude-agent-platform/bin/tests/test-registry-aware.sh
# Exit 0 on pass, non-zero on first failure.
#
# Hermetic: builds a throwaway fixture workspace in a temp dir and never reads the
# real registry. No network, no jq (JSON/YAML parsed by the scripts via py -3.12).

set -eu

# --- Locate the scripts under test (this test lives in <bin>/tests/) ---
TEST_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
BIN_DIR="$(CDPATH= cd -- "$TEST_DIR/.." && pwd)"
SCANNER="$BIN_DIR/repo-scanner.sh"
GENERATE="$BIN_DIR/generate-local-claude.sh"

fail() { printf 'FAIL: %s\n' "$1" >&2; exit 1; }
pass() { printf 'ok: %s\n' "$1"; }

[ -f "$SCANNER" ] || fail "scanner not found at $SCANNER"
[ -f "$GENERATE" ] || fail "generate not found at $GENERATE"

# --- Hermetic temp workspace ---
WORK="$(mktemp -d 2>/dev/null || mktemp -d -t regaware)"
# Clean up on any exit. Keep WORK reachable for the trap.
trap 'rm -rf "$WORK"' EXIT INT TERM

# Workspace layout mirrors the real fleet:
#   <WORK>/alawein/alawein/              org repo (holds the registries)
#   <WORK>/alawein/alawein/catalog/repos.json
#   <WORK>/alawein/alawein/projects.json
#   <WORK>/alawein/alawein/github-baseline.yaml
#   <WORK>/alawein/research/fixturerepo/ a downstream repo IN the registry
#   <WORK>/alawein/research/orphanrepo/  a downstream repo NOT in the registry
ORG="$WORK/alawein/alawein"
mkdir -p "$ORG/catalog"

# Stub catalog/repos.json: authoritative bucketed path + stack.
cat > "$ORG/catalog/repos.json" <<'JSON'
{
  "schemaVersion": 1,
  "repos": [
    {
      "slug": "fixturerepo",
      "repo": "alawein/fixturerepo",
      "local_path": "research/fixturerepo",
      "bucket": "research",
      "stack": ["python", "pytorch", "fixture-stack"]
    }
  ]
}
JSON

# Stub projects.json: only needed as an org-path anchor + bucket fallback.
cat > "$ORG/projects.json" <<'JSON'
{
  "$schema": "./projects.schema.json",
  "research": [
    { "slug": "fixturerepo", "bucket": "research" }
  ]
}
JSON

# Stub github-baseline.yaml: authoritative command source.
cat > "$ORG/github-baseline.yaml" <<'YAML'
version: 1
repos:
  - repo: fixturerepo
    stack: python
    ci_template: python
    install_command: "python -m pip install -e .[dev]"
    build_command: "python -m ruff check . && python -m mypy src/"
    test_command: "python -m pytest tests/ -v"
YAML

# Fixture downstream repo that IS in the registry. Give it a real-looking
# manifest so the scanner's own detection produces *different* values than the
# registry; this proves the override actually happens.
FIXTURE="$WORK/alawein/research/fixturerepo"
mkdir -p "$FIXTURE/src"
cat > "$FIXTURE/pyproject.toml" <<'TOML'
[project]
name = "fixturerepo"
dependencies = ["pytest"]
TOML
# .git marker so it reads as a project root (not required, but realistic).
mkdir -p "$FIXTURE/.git"

# Orphan downstream repo NOT in the registry.
ORPHAN="$WORK/alawein/research/orphanrepo"
mkdir -p "$ORPHAN/src"
cat > "$ORPHAN/pyproject.toml" <<'TOML'
[project]
name = "orphanrepo"
dependencies = ["pytest"]
TOML
mkdir -p "$ORPHAN/.git"

# --- Helper: run generate in dry-run for a given repo dir, capture the proposal ---
# We point ORG_REPO_PATH explicitly to keep the test independent of where the
# temp dir lands, AND we separately test the walk-up fallback below.
gen_proposal() {
  repo_dir="$1"
  out_file="$2"
  ( cd "$repo_dir" && ORG_REPO_PATH="$ORG" "$GENERATE" --root "$repo_dir" --dry-run >/dev/null 2>&1 )
  cp "$repo_dir/.claude/proposals/CLAUDE.md.proposed" "$out_file"
}

# =====================================================================
# Case 1: repo present in registry -> Root bucketed, commands populated
# =====================================================================
P1="$WORK/proposal-fixture.md"
gen_proposal "$FIXTURE" "$P1"

# (a) Root carries the bucket segment and is workspace-relative, not a pwd.
root_line="$(grep -E '^- Root:' "$P1" || true)"
[ -n "$root_line" ] || fail "Case1: no '- Root:' line in proposal"
case "$root_line" in
  *"research/fixturerepo"*) pass "Case1 Root carries bucket: $root_line" ;;
  *) fail "Case1: Root missing bucket segment 'research/fixturerepo': $root_line" ;;
esac
# Root must NOT be the raw absolute fixture path (the old pwd behavior).
case "$root_line" in
  *"$FIXTURE"*) fail "Case1: Root still contains machine-absolute pwd: $root_line" ;;
  *) : ;;
esac
# Root SHOULD be expressed under the workspace 'alawein/' prefix.
case "$root_line" in
  *"alawein/research/fixturerepo"*) pass "Case1 Root is workspace-relative (alawein/research/fixturerepo)" ;;
  *) fail "Case1: Root not workspace-relative: $root_line" ;;
esac

# (b) commands match the stub registry, not 'unknown'.
grep -Eq '^- Build command: `python -m ruff check \. && python -m mypy src/`' "$P1" \
  || fail "Case1: build command not overridden from registry: $(grep -E '^- Build command:' "$P1" || true)"
pass "Case1 build command overridden from registry"
grep -Eq '^- Test command: `python -m pytest tests/ -v`' "$P1" \
  || fail "Case1: test command not overridden from registry: $(grep -E '^- Test command:' "$P1" || true)"
pass "Case1 test command overridden from registry"
grep -Eq '^- Install command: `python -m pip install -e \.\[dev\]`' "$P1" \
  || fail "Case1: install command not present/overridden from registry: $(grep -E '^- Install command:' "$P1" || true)"
pass "Case1 install command overridden from registry"
# No 'unknown' should leak into the command block for a registered repo.
if grep -Eq '^- (Build|Test|Install) command: `unknown`' "$P1"; then
  fail "Case1: an overridden command still says 'unknown'"
fi
pass "Case1 no 'unknown' in overridden commands"
# Stack overridden from catalog.
grep -Eq '^- Stack: `python,pytorch,fixture-stack`' "$P1" \
  || fail "Case1: stack not overridden from catalog: $(grep -E '^- Stack:' "$P1" || true)"
pass "Case1 stack overridden from catalog"
# Found marker present (positive provenance).
grep -q '# registry: found' "$P1" \
  || fail "Case1: expected '# registry: found' marker"
pass "Case1 '# registry: found' marker present"

# =====================================================================
# Case 2: repo absent from registry -> marker + scanned values kept
# =====================================================================
P2="$WORK/proposal-orphan.md"
gen_proposal "$ORPHAN" "$P2"

grep -q '# registry: not found' "$P2" \
  || fail "Case2: expected '# registry: not found' marker for orphan repo"
pass "Case2 '# registry: not found' marker present"

# Scanned values are kept: pyproject+pytest -> scanner detects test='pytest'.
grep -Eq '^- Test command: `pytest`' "$P2" \
  || fail "Case2: scanned test command not preserved (expected 'pytest'): $(grep -E '^- Test command:' "$P2" || true)"
pass "Case2 scanned test command preserved"
# Root for an unregistered repo keeps the scanned absolute root (no bucket invented).
orphan_root="$(grep -E '^- Root:' "$P2" || true)"
case "$orphan_root" in
  *"$ORPHAN"*) pass "Case2 Root keeps scanned pwd for unregistered repo" ;;
  *) fail "Case2: unregistered Root not the scanned pwd: $orphan_root" ;;
esac
# Must NOT fabricate a *bare* bucketed override for an unknown slug. The scanned
# absolute path legitimately contains 'alawein/research/orphanrepo' as a tail
# segment, so we check the exact bare-relative override form instead of a
# substring (which would false-positive on the absolute path).
if [ "$orphan_root" = '- Root: `alawein/research/orphanrepo`' ]; then
  fail "Case2: invented bare bucketed Root for unregistered repo: $orphan_root"
fi
pass "Case2 no invented bucketed Root for unregistered repo"

# =====================================================================
# Case 3: org-path WALK-UP fallback (no ORG_REPO_PATH env) still resolves
# =====================================================================
P3="$WORK/proposal-walkup.md"
( cd "$FIXTURE" && "$GENERATE" --root "$FIXTURE" --dry-run >/dev/null 2>&1 )
cp "$FIXTURE/.claude/proposals/CLAUDE.md.proposed" "$P3"
grep -Eq '^- Root: `alawein/research/fixturerepo`' "$P3" \
  || fail "Case3: walk-up org resolution failed; Root: $(grep -E '^- Root:' "$P3" || true)"
pass "Case3 walk-up org resolution overrides Root without ORG_REPO_PATH"

# =====================================================================
# Case 4: missing org path must NOT crash (registry-not-found, scanned kept)
# =====================================================================
ISOLATED="$WORK/isolated/lonerepo"
mkdir -p "$ISOLATED/src"
cat > "$ISOLATED/pyproject.toml" <<'TOML'
[project]
name = "lonerepo"
dependencies = ["pytest"]
TOML
P4="$WORK/proposal-isolated.md"
# Point ORG_REPO_PATH at a non-existent dir AND run from a tree with no org repo
# above it -> resolution must fail gracefully.
if ( cd "$ISOLATED" && ORG_REPO_PATH="$WORK/does-not-exist" "$GENERATE" --root "$ISOLATED" --dry-run >/dev/null 2>&1 ); then
  cp "$ISOLATED/.claude/proposals/CLAUDE.md.proposed" "$P4"
  grep -q '# registry: not found' "$P4" \
    || fail "Case4: missing org path should yield 'not found' marker"
  pass "Case4 missing org path -> 'not found' marker, no crash"
else
  fail "Case4: generate crashed when org path could not be resolved"
fi

printf '\nALL REGISTRY-AWARE TESTS PASSED\n'
exit 0
