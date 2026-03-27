#!/usr/bin/env bash
# generate-index.sh -- regenerates INDEX.md files from directory listings
# Part of Docs Doctrine (Phase 3: Introduce Generation)
set -euo pipefail

TARGET="${1:-.}"

find "$TARGET" -name "docs" -type d | while read -r dir; do
  {
    echo "---"
    echo "type: derived"
    echo "source: directory-structure"
    echo "sync: script"
    echo "sla: on-change"
    echo "---"
    echo "# Index"
    echo ""
  } > "${dir}/INDEX.md"

  ls -1 "${dir}"/*.md 2>/dev/null | grep -v INDEX.md | \
    while read -r f; do echo "- [$(basename "$f")]($f)"; done >> "${dir}/INDEX.md"

  echo "Generated: ${dir}/INDEX.md"
done
