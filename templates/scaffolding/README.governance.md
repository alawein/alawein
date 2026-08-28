# {{name}}

Status:      {{status}}
Category:    core
Owner:       alawein
Visibility:  {{visibility}}
Purpose:     {{purpose}}
Next action: continue

## Purpose

State what this control plane owns and which repos consume it.

## Catalog SSOT

- Edit surface: `catalog/index.yaml`
- Compiled manifest: `catalog/repos.json`
- Build: `python scripts/catalog/build-catalog.py`

## Validators

```bash
{{validate_command}}
```

## Docs map

- `docs/README.md`
- `SSOT.md`
- `LESSONS.md`
