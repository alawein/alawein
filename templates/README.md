---
type: derived
source: ../README.md
sync: manual
sla: manual
---

# Templates

Historical config templates. The former renderer is preserved at
`scripts/ops/_retired/render-configs.sh` for reference; it is not a supported
rendering command. See `SSOT.md` for the current config sources.

## Available Templates

| Template | Output | Purpose |
|----------|--------|---------|
| `editorconfig.template` | `.editorconfig` | Editor formatting (indent, line endings, charset) |

## Variables

The retired renderer used these substitution variables:

| Variable | Value |
|----------|-------|
| `{{REPO_NAME}}` | Target repo directory name |
| `{{DATE}}` | Current date (YYYY-MM-DD) |
| `{{ORG}}` | Organization name (`alawein`) |
