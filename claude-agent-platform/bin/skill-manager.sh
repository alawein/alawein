#!/bin/sh
# skill-manager.sh — versioned registry manager for Claude Code skills.
# Rationale: Skill install/update/uninstall should be reproducible from shell.

set -eu

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
SKILLS_DIR="$CLAUDE_HOME/skills"
BACKUP_DIR="$CLAUDE_HOME/backups/skills"
REGISTRY="$SKILLS_DIR/registry.json"

mkdir -p "$SKILLS_DIR" "$BACKUP_DIR"

usage() {
  cat <<'EOF'
Usage:
  skill-manager.sh list
  skill-manager.sh registry
  skill-manager.sh install PATH_TO_SKILL_DIR
  skill-manager.sh update PATH_TO_SKILL_DIR
  skill-manager.sh uninstall SKILL_NAME
  skill-manager.sh doctor
EOF
}

field() {
  key="$1"; file="$2"
  sed -n "s/^$key:[[:space:]]*//p" "$file" | head -n 1 | sed 's/^"//; s/"$//'
}

json_escape() {
  sed 's/\\/\\\\/g; s/"/\\"/g' | tr '\n' ' '
}

write_registry() {
  tmp="$(mktemp)"
  {
    echo '{'
    echo '  "generated_at": "'"$(date +%Y-%m-%dT%H:%M:%S)"'",'
    echo '  "skills": ['
    first="true"
    for d in "$SKILLS_DIR"/*; do
      [ -d "$d" ] || continue
      [ -f "$d/SKILL.md" ] || continue
      name="$(field name "$d/SKILL.md")"
      version="$(field version "$d/SKILL.md")"
      desc="$(field description "$d/SKILL.md")"
      [ -n "$name" ] || name="$(basename "$d")"
      [ -n "$version" ] || version="0.0.0"
      if [ "$first" = "true" ]; then first="false"; else echo ','; fi
      printf '    {"name":"%s","version":"%s","path":"%s","description":"%s"}' \
        "$(printf "%s" "$name" | json_escape)" \
        "$(printf "%s" "$version" | json_escape)" \
        "$(printf "%s" "$d/SKILL.md" | json_escape)" \
        "$(printf "%s" "$desc" | json_escape)"
    done
    echo
    echo '  ]'
    echo '}'
  } > "$tmp"
  mv "$tmp" "$REGISTRY"
}

cmd="${1:-}"
case "$cmd" in
  list)
    for d in "$SKILLS_DIR"/*; do
      [ -f "$d/SKILL.md" ] || continue
      name="$(field name "$d/SKILL.md")"; [ -n "$name" ] || name="$(basename "$d")"
      version="$(field version "$d/SKILL.md")"; [ -n "$version" ] || version="0.0.0"
      printf '%s\t%s\t%s\n' "$name" "$version" "$d/SKILL.md"
    done
    ;;
  registry)
    write_registry
    cat "$REGISTRY"
    ;;
  install|update)
    src="${2:-}"
    [ -n "$src" ] || { usage >&2; exit 2; }
    [ -f "$src/SKILL.md" ] || { echo "Missing SKILL.md in $src" >&2; exit 2; }
    name="$(field name "$src/SKILL.md")"; [ -n "$name" ] || name="$(basename "$src")"
    dest="$SKILLS_DIR/$name"
    if [ -d "$dest" ]; then
      ts="$(date +%Y%m%d-%H%M%S)"
      mv "$dest" "$BACKUP_DIR/$name.$ts"
    fi
    mkdir -p "$dest"
    cp -R "$src"/. "$dest"/
    write_registry
    echo "$cmd complete: $name -> $dest"
    ;;
  uninstall)
    name="${2:-}"
    [ -n "$name" ] || { usage >&2; exit 2; }
    dest="$SKILLS_DIR/$name"
    [ -d "$dest" ] || { echo "Skill not installed: $name" >&2; exit 1; }
    ts="$(date +%Y%m%d-%H%M%S)"
    mv "$dest" "$BACKUP_DIR/$name.$ts"
    write_registry
    echo "Uninstalled $name; backup: $BACKUP_DIR/$name.$ts"
    ;;
  doctor)
    echo "CLAUDE_HOME=$CLAUDE_HOME"
    echo "SKILLS_DIR=$SKILLS_DIR"
    count="$(find "$SKILLS_DIR" -name SKILL.md -type f 2>/dev/null | wc -l | tr -d ' ')"
    echo "skills=$count"
    write_registry
    echo "registry=$REGISTRY"
    ;;
  --help|-h|help|'') usage ;;
  *) echo "Unknown command: $cmd" >&2; usage >&2; exit 2 ;;
esac
