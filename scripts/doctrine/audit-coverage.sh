#!/usr/bin/env bash
# audit-coverage.sh — Workspace-wide test coverage audit
# Scans all repos in the alawein workspace and reports coverage status.
# Usage: ./scripts/audit-coverage.sh [--run]
#   Without --run: reports config status only (fast)
#   With --run: actually executes coverage for each repo (slow)
set -euo pipefail

WORKSPACE="${WORKSPACE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
RUN_TESTS=false
[[ "${1:-}" == "--run" ]] && RUN_TESTS=true

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

printf "%-30s %-12s %-14s %-10s %-10s\n" "REPO" "FRAMEWORK" "COVERAGE_CFG" "THRESHOLD" "STATUS"
printf "%-30s %-12s %-14s %-10s %-10s\n" "----" "---------" "------------" "---------" "------"

TOTAL=0
HAS_TESTS=0
HAS_COVERAGE=0
MISSING_COVERAGE=0

for repo_dir in "$WORKSPACE"/*/; do
  repo=$(basename "$repo_dir")
  [[ "$repo" == "alawein" ]] && continue  # skip meta repo
  [[ ! -d "$repo_dir" ]] && continue
  TOTAL=$((TOTAL + 1))

  framework="none"
  coverage_cfg="none"
  threshold="-"
  status="no-tests"

  # Detect JS/TS test framework
  if [[ -f "$repo_dir/package.json" ]]; then
    if [[ -f "$repo_dir/vitest.config.ts" ]] || [[ -f "$repo_dir/vitest.config.mts" ]] || grep -q '"vitest"' "$repo_dir/package.json" 2>/dev/null; then
      framework="vitest"
    elif [[ -f "$repo_dir/jest.config.js" ]] || [[ -f "$repo_dir/jest.config.ts" ]] || grep -q '"jest"' "$repo_dir/package.json" 2>/dev/null; then
      framework="jest"
    fi

    # Check for coverage config in vitest
    for vcfg in "$repo_dir/vitest.config.ts" "$repo_dir/vitest.config.mts" "$repo_dir/vite.config.ts"; do
      if [[ -f "$vcfg" ]] && grep -q 'coverage' "$vcfg" 2>/dev/null; then
        coverage_cfg="vitest-v8"
        if grep -q 'thresholds' "$vcfg" 2>/dev/null; then
          threshold="configured"
        fi
        break
      fi
    done

    # Check for jest coverage script
    if grep -q '"test:coverage"' "$repo_dir/package.json" 2>/dev/null; then
      [[ "$coverage_cfg" == "none" ]] && coverage_cfg="jest-cli"
    fi

    # Check for test directories
    if [[ -d "$repo_dir/tests" ]] || [[ -d "$repo_dir/__tests__" ]] || [[ -d "$repo_dir/test" ]] || [[ -d "$repo_dir/e2e" ]]; then
      HAS_TESTS=$((HAS_TESTS + 1))
      status="has-tests"
    fi
  fi

  # Detect Python test framework
  if [[ -f "$repo_dir/pyproject.toml" ]]; then
    if grep -q '\[tool\.pytest' "$repo_dir/pyproject.toml" 2>/dev/null; then
      framework="pytest"
      if [[ -d "$repo_dir/tests" ]] || [[ -d "$repo_dir/python/tests" ]]; then
        HAS_TESTS=$((HAS_TESTS + 1))
        status="has-tests"
      fi
    fi
    if grep -q '\[tool\.coverage' "$repo_dir/pyproject.toml" 2>/dev/null; then
      coverage_cfg="pytest-cov"
      if grep -q 'fail_under' "$repo_dir/pyproject.toml" 2>/dev/null; then
        threshold="configured"
      fi
    fi
  fi

  # Playwright detection
  if [[ -f "$repo_dir/playwright.config.ts" ]]; then
    [[ "$framework" != "none" ]] && framework="$framework+pw" || framework="playwright"
  fi

  # Coverage status
  if [[ "$coverage_cfg" != "none" ]]; then
    HAS_COVERAGE=$((HAS_COVERAGE + 1))
    status="covered"
  elif [[ "$status" == "has-tests" ]]; then
    MISSING_COVERAGE=$((MISSING_COVERAGE + 1))
    status="needs-cov"
  fi

  # Color output
  case "$status" in
    covered)    color=$GREEN ;;
    needs-cov)  color=$YELLOW ;;
    has-tests)  color=$YELLOW ;;
    *)          color=$RED ;;
  esac

  printf "${color}%-30s %-12s %-14s %-10s %-10s${NC}\n" "$repo" "$framework" "$coverage_cfg" "$threshold" "$status"

  # Optionally run coverage
  if $RUN_TESTS && [[ "$status" == "covered" || "$status" == "needs-cov" ]]; then
    echo "  → Running coverage for $repo..."
    pushd "$repo_dir" > /dev/null
    if [[ "$framework" == pytest* ]]; then
      py -3.12 -m pytest --cov --cov-report=term-missing --tb=short -q 2>&1 | tail -5 || true
    elif [[ "$framework" == vitest* ]]; then
      npx vitest run --coverage 2>&1 | tail -10 || true
    elif [[ "$framework" == jest* ]]; then
      npx jest --coverage 2>&1 | tail -10 || true
    fi
    popd > /dev/null
  fi
done

echo ""
echo "=== SUMMARY ==="
echo "Total repos:          $TOTAL"
echo "With tests:           $HAS_TESTS"
echo "With coverage config: $HAS_COVERAGE"
echo "Need coverage added:  $MISSING_COVERAGE"
echo "No tests:             $((TOTAL - HAS_TESTS))"
