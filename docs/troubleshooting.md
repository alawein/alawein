---
type: canonical
owner: platform-engineering
last-reviewed: 2026-03-31
last_updated: 2026-04-09
---

# Troubleshooting — alawein

## Common Issues

### Validation script fails
- Ensure all repos have required governance files
- Run `python scripts/validate-doctrine.py` for details

### projects.json out of sync
- Compare physical dirs with registry entries
- Run `bash scripts/sync-readme.py` to regenerate

