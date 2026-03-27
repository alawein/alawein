#!/usr/bin/env bash
# pre-commit-doctrine.sh -- Docs Doctrine pre-commit gate
# Install: symlink or copy to .git/hooks/pre-commit
# Or use with pre-commit framework (see .pre-commit-config.yaml)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VALIDATOR="${SCRIPT_DIR}/validate-doctrine.py"

echo "-- Docs Doctrine: pre-commit validation --"

# Get staged files
STAGED=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED" ]; then
  echo "No staged files. Skipping."
  exit 0
fi

# -- Rule 5: Quick naming checks on staged files --
FAIL=0
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

# -- Rules 1-4: Header validation (managed files only) --
for file in $STAGED; do
  ext="${file##*.}"
  if [[ "$ext" =~ ^(md|json|yaml|yml|toml|cfg)$ ]]; then
    if ! head -1 "$file" | grep -q "^---"; then
      echo "FAIL [R1] Missing doctrine header: $file"
      FAIL=1
    fi
  fi
done

# -- Full validation (if validator exists) --
if [ -f "$VALIDATOR" ]; then
  python "$VALIDATOR" --ci . || FAIL=1
fi

if [ $FAIL -ne 0 ]; then
  echo ""
  echo "Commit blocked by Docs Doctrine. Fix errors above."
  exit 1
fi

echo "Docs Doctrine: all checks passed."
