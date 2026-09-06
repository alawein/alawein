---
type: derived
source: ../README.md
sync: manual
sla: manual
---

# Templates

Config file templates. The renderer that consumed them,
`scripts/ops/render-configs.sh`, is retired (moved to
`scripts/ops/_retired/render-configs.sh`; see `SSOT.md`). It is retained,
not deleted, because this file and `docs/governance/docs-doctrine.md` still
document it as the config-template generator; re-enable it from its retired
path if config rendering is needed again, or replace this section once a
live generator exists.

## Available Templates

| Template | Output | Purpose |
|----------|--------|---------|
| `editorconfig.template` | `.editorconfig` | Editor formatting (indent, line endings, charset) |

## Variables

Templates support these substitution variables:

| Variable | Value |
|----------|-------|
| `{{REPO_NAME}}` | Target repo directory name |
| `{{DATE}}` | Current date (YYYY-MM-DD) |
| `{{ORG}}` | Organization name (`alawein`) |

## Usage (retired script; run from its retired path if needed)

```bash
# Render all templates to all workspace repos
./scripts/ops/_retired/render-configs.sh

# List available templates
./scripts/ops/_retired/render-configs.sh --list

# Check for config drift
./scripts/ops/_retired/render-configs.sh --check
```

## Adding a Template

1. Create `<filename>.template` in this directory
2. Use `{{VARIABLE}}` syntax for substitutions
3. Run `./scripts/ops/_retired/render-configs.sh --list` to verify
4. Run `./scripts/ops/_retired/render-configs.sh` to render across repos
