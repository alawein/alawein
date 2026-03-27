---
type: canonical
source: none
sync: none
sla: none
title: Phase 3 — Code Refactoring and Centralization Checklist
description: Agent-executable steps to enforce standardization across repos.
last_updated: 2026-03-12
category: governance
status: active
---

# Phase 3: Refactoring and Centralization

Execute per repository after Phase 2 design/branding application.

## Steps (per repo)

1. **Consolidate duplicate UI patterns**
   - Prefer `@alawein/ui` or shared components from devkit where applicable.
   - Merge duplicate or inconsistent UI patterns into reusable components.

2. **Lint and format**
   - Ensure dependencies installed: `npm ci` or `npm install`.
   - Run format: `npm run format` or `npm run fix:format` (Prettier).
   - Run lint: `npm run lint` or `npm run check:lint` (ESLint).
   - Fix any reported issues; use `@alawein/eslint-config` and `@alawein/prettier-config` where the repo references them.

3. **Layout and architecture**
   - Align with [workspace-standardization.md](workspace-standardization.md): Vite SPA layout (`src/components/`, `src/lib/`, `src/pages/`), Next.js App Router where applicable.
   - Respect repo `AGENTS.md` and `SSOT.md` for boundaries.

## Repos with shared config

- **repz, meshal-web, gainboy, attributa, llmworks, simcore, qmlab, rounaq-atelier, bolts, devkit:** Use or extend `@alawein/prettier-config` (and where present `@alawein/eslint-config`). Run `npx prettier --write .` or repo script if `prettier` not in PATH after install.

## Verification

- No new duplicate token definitions; consume devkit or repo theme only.
- All modified code passes lint and format.
- Folder structure matches stack-aware layout in workspace-layout-audit.
