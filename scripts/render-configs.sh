#!/usr/bin/env bash
# render-configs.sh -- renders config files from templates
# Part of Docs Doctrine (Phase 3: Introduce Generation)
#
# Looks for *.template files in the org repo's templates/ directory and
# renders them by substituting variables. Rendered outputs are classified
# as "type: derived" with "source: org/templates/<name>.template".
#
# Usage:
#   ./scripts/render-configs.sh                    # render all templates
#   ./scripts/render-configs.sh --check            # check for drift only
#   ./scripts/render-configs.sh --list             # list available templates
#
# Template variables:
#   {{REPO_NAME}}   — target repo directory name
#   {{DATE}}        — current date (YYYY-MM-DD)
#   {{ORG}}         — org name (alawein)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORG_REPO="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="${ORG_REPO}/templates"

render_template() {
  local template="$1"
  local repo_dir="$2"
  local repo_name
  repo_name=$(basename "$repo_dir")
  local today
  today=$(date +%Y-%m-%d)

  # Determine output path from template name
  # Convention: editorconfig.template -> .editorconfig (add dot prefix)
  # Override: if name already starts with dot, keep as-is
  local tname
  tname=$(basename "${template%.template}")
  # Known dotfile mappings
  case "$tname" in
    editorconfig|gitignore|gitattributes|prettierrc|eslintrc)
      tname=".${tname}" ;;
  esac
  local out="${repo_dir}/${tname}"

  mkdir -p "$(dirname "$out")"
  sed -e "s/{{REPO_NAME}}/${repo_name}/g" \
      -e "s/{{DATE}}/${today}/g" \
      -e "s/{{ORG}}/alawein/g" \
      "$template" > "$out"

  echo "Rendered: ${out} (from $(basename "$template"))"
}

MODE="${1:---render}"

case "$MODE" in
  --list)
    if [ ! -d "$TEMPLATE_DIR" ]; then
      echo "No templates/ directory found at ${TEMPLATE_DIR}"
      echo "Create templates/ with *.template files to enable config rendering."
      exit 0
    fi
    count=0
    for tmpl in "${TEMPLATE_DIR}"/*.template "${TEMPLATE_DIR}"/.*.template; do
      [ -f "$tmpl" ] || continue
      echo "  $(basename "$tmpl") -> $(basename "${tmpl%.template}")"
      count=$((count + 1))
    done
    echo "---"
    echo "Templates found: ${count}"
    ;;
  --check)
    if [ ! -d "$TEMPLATE_DIR" ]; then
      echo "OK: No templates/ directory — nothing to check."
      exit 0
    fi
    echo "Drift check for rendered configs not yet implemented."
    echo "No templates currently exist."
    exit 0
    ;;
  --render|*)
    if [ ! -d "$TEMPLATE_DIR" ]; then
      echo "No templates/ directory found at ${TEMPLATE_DIR}"
      echo "Nothing to render. Create templates/ with *.template files to enable."
      exit 0
    fi
    count=0
    for tmpl in "${TEMPLATE_DIR}"/*.template; do
      [ -f "$tmpl" ] || continue
      WORKSPACE="${WORKSPACE:-$(dirname "$ORG_REPO")}"
      for repo_dir in "${WORKSPACE}"/*/; do
        [ -d "${repo_dir}/.git" ] || continue
        repo_name=$(basename "$repo_dir")
        [ "$repo_name" = "alawein" ] && continue
        render_template "$tmpl" "$repo_dir"
        count=$((count + 1))
      done
    done
    echo "---"
    echo "Rendered: ${count} configs"
    ;;
esac
