#!/usr/bin/env bash
# pre-commit-doctrine.sh -- Docs Doctrine pre-commit gate
# Part of Docs Doctrine (Phase 5: Full Enforcement)
#
# Install: deploy via scripts/deploy-hooks.sh or manually:
#   cp scripts/pre-commit-doctrine.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
set -euo pipefail

echo "-- Docs Doctrine: pre-commit validation --"

# Get staged files
STAGED=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED" ]; then
  echo "No staged files. Skipping."
  exit 0
fi

FAIL=0

# -- Rule 5: Quick naming checks on staged files --
for file in $STAGED; do
  base=$(basename "$file")
  # Ban backup extensions
  if [[ "$base" =~ \.(bak|old|tmp|orig)$ ]]; then
    echo "FAIL [R5] Banned extension: $file"
    FAIL=1
  fi
  # Ban version suffixes
  if [[ "$base" =~ (_v[0-9]+|_final|_new|_old|_copy|_backup)\. ]]; then
    echo "FAIL [R5] Banned suffix: $file"
    FAIL=1
  fi
done

# -- Rules 1-4: Header validation (managed .md files only) --
# JSON files are skipped (cannot have YAML frontmatter)
# CI workflows, lockfiles, and config files in .github/ are excluded
for file in $STAGED; do
  # Skip files in non-doc directories
  case "$file" in
    .github/*|node_modules/*|.venv/*|.claude/settings*) continue ;;
  esac

  ext="${file##*.}"
  case "$ext" in
    md)
      if [ -f "$file" ] && ! head -1 "$file" | grep -q "^---"; then
        echo "FAIL [R1] Missing doctrine header: $file"
        FAIL=1
      fi
      ;;
  esac
done

# -- Full validation (if validator is available) --
# Look for validator in common locations
VALIDATOR=""
for candidate in \
  "scripts/validate-doctrine.py" \
  "../alawein/scripts/validate-doctrine.py" \
  "$(git rev-parse --show-toplevel 2>/dev/null)/scripts/validate-doctrine.py"; do
  if [ -f "$candidate" ]; then
    VALIDATOR="$candidate"
    break
  fi
done

if [ -n "$VALIDATOR" ]; then
  python "$VALIDATOR" . || FAIL=1
fi

if [ $FAIL -ne 0 ]; then
  echo ""
  echo "Commit blocked by Docs Doctrine. Fix errors above."
  exit 1
fi

echo "Docs Doctrine: all checks passed."
