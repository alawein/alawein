#!/usr/bin/env bash
# bootstrap-repo.sh -- scaffold a doctrine-compliant repo
set -euo pipefail

REPO_TYPE="${1:?Usage: bootstrap-repo.sh <org|product|infra> [name]}"
REPO_NAME="${2:-my-repo}"

echo "Bootstrapping $REPO_TYPE repo: $REPO_NAME"
mkdir -p "$REPO_NAME" && cd "$REPO_NAME"
git init

# -- Common files --
cat > README.md << HEADER
---
type: canonical
source: none
sync: none
sla: none
---
# $REPO_NAME

> TODO: Add project description.
HEADER

# -- Repo-type specific scaffolding --
case "$REPO_TYPE" in
  org)
    cat > CLAUDE.md << 'EOF'
---
type: canonical
source: none
sync: none
sla: none
---
# Organization Rules
EOF

    cat > projects.json << 'EOF'
---
type: canonical
source: none
sync: none
sla: none
---
[]
EOF

    mkdir -p templates scripts governance indexes
    cat > governance/docs-doctrine.md << 'EOF'
---
type: canonical
source: none
sync: none
sla: none
---
# Docs Doctrine
> See the full doctrine document for rules.
EOF

    echo "Created org repo structure."
    ;;

  product)
    cat > CLAUDE.md << 'EOF'
---
type: derived
source: org/CLAUDE.md
sync: script
sla: on-change
---
# Local Rules (derived from org)
EOF

    mkdir -p src docs config
    cat > docs/INDEX.md << 'EOF'
---
type: derived
source: directory-structure
sync: script
sla: on-change
---
# Index
> Auto-generated. Do not edit.
EOF

    echo "Created product repo structure."
    ;;

  infra)
    mkdir -p modules environments generated scripts
    touch generated/.gitkeep

    echo "Created infra repo structure."
    ;;

  *)
    echo "Unknown type: $REPO_TYPE (expected: org, product, infra)"
    exit 1
    ;;
esac

# -- Common: .gitignore --
cat > .gitignore << 'EOF'
scratch/
runs/
staging/
*.bak
*.old
*.tmp
*.orig
*_v[0-9]*
*_final*
*_copy*
EOF

# -- Common: validation script link --
mkdir -p scripts
cat > scripts/validate.sh << 'SCRIPT'
#!/usr/bin/env bash
# Wrapper: runs doctrine validator from org repo
# Adjust ORG_PATH to your org repo location
ORG_PATH="${ORG_REPO_PATH:-../org}"
python "${ORG_PATH}/scripts/validate-doctrine.py" --ci .
SCRIPT
chmod +x scripts/validate.sh

echo ""
echo "Repo bootstrapped. Next steps:"
echo "  1. Review and customize README.md"
echo "  2. Copy pre-commit hooks from org repo"
echo "  3. Run: scripts/validate.sh"
