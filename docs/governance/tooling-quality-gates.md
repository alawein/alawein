---
type: canonical
source: none
sync: on-change
sla: none
title: Tooling and quality gates
description: Minimum npm/Python scripts and CI expectations; maps to @alawein/* packages.
last_updated: 2026-05-05
category: governance
audience: [ai-agents, contributors]
status: active
related:
  - ./repository-layout-standard.md
  - ./package-namespace-matrix.md
---

# Tooling and quality gates

## Node / TypeScript applications

### Shared packages (@alawein/*)

Published from **`alawein/devkit`** (`@alawein/*` on npm):

| Package | Use |
|---------|-----|
| `@alawein/eslint-config` | Extend `react-vite` or `react-next` from flat config |
| `@alawein/prettier-config` | `"prettier": "@alawein/prettier-config"` in `package.json` + `.prettierrc` string |
| `@alawein/tsconfig` | **Optional per repo** — merge carefully with app-specific `paths` / `include`; do not blindly replace Next/Vite tsconfigs |

Also declare **`globals`** when the ESLint config uses `import globals from 'globals'` for script overrides.

### Recommended `package.json` scripts

| Script | Purpose |
|--------|---------|
| `lint` | `eslint .` (or `eslint . --max-warnings 0` once clean) |
| `type-check` | `tsc --noEmit` or per-project `tsc --noEmit -p tsconfig.app.json` when using solution-style roots |
| `format` | `prettier --write` on agreed glob (match `format:check`) |
| `format:check` | `prettier --check` on same glob |
| `build` | Framework build (`vite build`, `next build`, etc.) |

### CI minimum (active / maintained apps)

On pull requests and default branch:

1. Install dependencies (`npm ci` or equivalent).
2. Run **`format:check`**, **`lint`** (or `eslint . --quiet` while clearing legacy errors), **`type-check`**, **`build`**.

Use **`continue-on-error: true`** only when explicitly documented as technical debt with a tracking issue.

### ESLint “quiet mode” policy

Until legacy a11y and style violations are fixed, repos may downgrade selected rules to **`warn`** so that **`eslint . --quiet`** passes. Prefer fixing or narrowing overrides over expanding warn lists.

## Python projects

| Gate | Command |
|------|---------|
| Lint | `ruff check` |
| Format | `ruff format --check` (or `black --check` if already standardized) |
| Test | `pytest` |

Add CI mirroring the same steps when the repo is **active** or **maintained**.

## Prettier mass-format policy

When adopting the shared Prettier config, run **`prettier --write`** in a **dedicated PR** (no functional changes) so reviewers can trust the diff as formatting-only.

## Local drift scan (workspace-tools)

From **`workspace-tools`**, after `npm ci` in repos you care about, aggregate
**format / lint / type-check** (and optionally **`build`** with
`--with-build`) against clones listed in
[`desktop-repo-inventory.json`](../archive/desktop-repo-inventory.json) (archived):

```bash
python scripts/repo_health_check.py --local
python scripts/repo_health_check.py --local --json   # stdout + state/repo-local-quality.json
```

## Related

- [Repository layout standard](./repository-layout-standard.md)
- [Project lifecycle tiers](../operations/project-lifecycle-tiers.md) — tier vs CI strictness
- [Package namespace matrix](./package-namespace-matrix.md)
