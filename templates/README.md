---
type: canonical
source: none
sync: none
sla: none
---

# Templates

Config file templates rendered by `scripts/render-configs.sh` across
workspace repos.

## Available Templates

| Template | Output | Purpose |
|----------|--------|---------|
| `.editorconfig.template` | `.editorconfig` | Editor formatting (indent, line endings, charset) |

## Variables

Templates support these substitution variables:

| Variable | Value |
|----------|-------|
| `{{REPO_NAME}}` | Target repo directory name |
| `{{DATE}}` | Current date (YYYY-MM-DD) |
| `{{ORG}}` | Organization name (`alawein`) |

## Usage

```bash
# Render all templates to all workspace repos
./scripts/render-configs.sh

# List available templates
./scripts/render-configs.sh --list

# Check for config drift
./scripts/render-configs.sh --check
```

## Adding a Template

1. Create `<filename>.template` in this directory
2. Use `{{VARIABLE}}` syntax for substitutions
3. Run `render-configs.sh --list` to verify
4. Run `render-configs.sh` to render across repos
