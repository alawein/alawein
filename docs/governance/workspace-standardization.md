---
title: Workspace Standardization Guide
description: Canonical migration contract for naming, layout, shared resources, and phased workspace directives.
last_updated: 2026-03-18
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.1.0
tags: [workspace, migration, naming, layout, governance]
---

# Workspace Standardization Guide

This document defines how workspace standardization is executed under the
canonical contract in
[`workspace-master-prompt.md`](./workspace-master-prompt.md).

## Goals

- Keep naming canonical and predictable.
- Preserve truthful documentation during any phased repo-slug migration.
- Keep shared resources centralized with explicit ownership.
- Execute directives in dependency order, not as one monolithic sweep.

## Canonical Naming Policy

### Canonical Names

- `gymboy`
- `meatheadphysicist`
- `devkit` (legacy overlap: `aw-devkit`)
- `_ops/gmail-ops` (external workspace)

### Transitional Alias Format

When canonical name and physical repo slug differ, docs must use:

`canonical-name (repo: physical-slug)`

Current cutover status (2026-03-11): for `gymboy`, `meatheadphysicist`,
`atelier-rounaq`, and `edfp`, canonical and physical slugs now match.

### External Prefix Rule

External or remote tool directories must be underscore-prefixed.

## Stack-Aware Layout Standards

### Vite and SPA Repositories

- Core directories:
  - `src/components/`
  - `src/lib/`
  - `src/types/`
  - `src/hooks/`
  - `src/pages/` or equivalent route entry
- Optional feature directories:
  - `src/services/`
  - `src/store/`
  - `src/integrations/`
  - `src/workers/`

### Next.js Repositories

- Preserve App Router conventions.
- Keep clear UI/data/utility boundaries.
- Preserve app-local `packages/` only when documented as intentional.

### Python Repositories

- Preferred structure:
  - `src/<package_name>/`
  - `tests/`
  - `docs/`
  - `notebooks/`
  - `scripts/`
- Research and polyglot repos may use justified exceptions with documented
  runtime boundaries.

## Shared Resource Rules

- Shared design tokens, components, themes, and tooling belong in `devkit/`.
- Token source of truth is `devkit/tokens/`.
- Cross-repo docs and migration matrices belong in `alawein/`.
- Cross-repo operational guides and handoff docs belong in `docs/`.
- `aw-devkit` is retired and can only be referenced as historical migration
  context.

## Directive Mapping (D-1 through D-5)

### D-1: Devkit Consolidation

- Consolidate `aw-devkit` into `devkit`.
- Redirect references to `devkit` with canonical token source in `devkit/tokens/`.
- Completed on 2026-03-11: physical `aw-devkit` workspace root retired.

### D-2: Gymboy Redesign

- Implement Game Boy-inspired visual redesign.
- Keep canonical naming as `gymboy`.
- Ensure deploy metadata targets `gymboy.coach`.

### D-3: Repz Heal

- Resolve build, test, lint, dependency, and architecture debt.
- Standardize on `repzcoach.com` as canonical domain.

### D-4: Ninja Visual Token System

- Enforce shared core ninja tokens from `devkit/tokens/`.
- Permit per-character specialization through constrained derivations.

### D-5: meshal.ai Refinement

- Execute content, design, performance, SEO, and accessibility upgrades.
- Keep portfolio representation synchronized with `alawein/README.md`.

## Execution Order

1. Update governance docs and canonical naming matrices.
2. Align portfolio data (`projects.json`) and generated README content.
3. Consolidate shared-resource ownership (`devkit`, token contracts).
4. Execute repo-specific directives (D-2, D-3, D-5) with continuous README sync.
5. Perform physical repo slug renames once technical readiness is confirmed.
6. Remove transitional alias notation after cutover.

## Verification Requirements

1. Canonical names are reflected in governance docs and portfolio data.
2. Transitional aliases appear only in approved `repo:` contexts.
3. README and `projects.json` remain synchronized.
4. Domain canonicalization is enforced (`repzcoach.com`).
5. Validation commands pass for docs and repo-level contracts.
