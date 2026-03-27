#!/usr/bin/env bash
# render-configs.sh -- renders config files from templates
# Part of Docs Doctrine (Phase 3: Introduce Generation)
set -euo pipefail

TEMPLATE_DIR="${ORG_REPO_PATH:-../org}/templates"
ENV="${1:?Usage: render-configs.sh <environment>}"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Error: Template dir not found at $TEMPLATE_DIR"
  echo "Set ORG_REPO_PATH to the org repo location."
  exit 1
fi

for tmpl in "${TEMPLATE_DIR}"/*.template; do
  [ -f "$tmpl" ] || continue
  out="config/$(basename "${tmpl%.template}")"
  mkdir -p "$(dirname "$out")"
  sed "s/{{ENV}}/$ENV/g" "$tmpl" > "$out"
  echo "Rendered: $out"
done
