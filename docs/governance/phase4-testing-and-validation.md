---
type: canonical
source: none
sync: none
sla: none
title: Phase 4 — Testing and Validation
description: Agent-executable test and validation steps per repository.
last_updated: 2026-03-12
category: governance
status: active
---

# Phase 4: Testing and Validation

Execute after Phase 3 (refactoring) for each repository.

## Steps (per repo)

1. **Unit tests**
   - Run: `npm run test` or `npm run test:run` (Vitest/Jest).
   - Add or update tests for modified components, hooks, and API endpoints.

2. **Integration tests**
   - Where present: `npm run test:e2e` or `npm run test:integration` (Playwright, etc.).
   - Cover critical user flows and API contracts.

3. **Front-end specific**
   - Visual regression: Storybook + Chromatic/Percy or Playwright snapshots where configured.
   - Cross-browser/device: run against key pages if required.
   - Branding check: confirm logo, colors, and fonts render correctly.

4. **Type and lint**
   - `npm run type-check` or `npm run check:types` (TypeScript).
   - `npm run lint` or `npm run check:lint` (ESLint).

## Repo test commands (representative)

| Repo | Unit | E2E | Notes |
|------|------|-----|-------|
| repz | `npm run test:run` | `npm run test:e2e` | Vitest + Playwright |
| meshal-web | `npm run test` | `playwright:a11y`, `playwright:synthetic` | Vitest + Playwright |
| gainboy | `npm run test` | — | Vitest |
| attributa | `npm run test` | `npm run e2e` | Jest + Playwright |
| llmworks | `npm run test:run` | `npm run test:e2e` | Vitest + Playwright |
| simcore | `npm run test` | (audit scripts) | Vitest |
| qmlab | `npm run test` | Playwright configs | Playwright |
| devkit | (turbo build/lint) | Storybook build | No unit test script at root |
| alawein | — | — | `scripts/validate-doc-contract.sh`, `sync-readme.py --check` |

## Success criteria

- All existing tests pass.
- No regressions in branding (logo, colors, fonts) on key pages.
- Type-check and lint pass.

## Known issues (pre-existing)

- **meshal-web:** Unit tests in `tests/components/sections.test.tsx` and `layout.test.tsx` may fail due to missing `@clerk/react` or missing Router/Clerk provider in test setup; address in repo-specific test configuration.
