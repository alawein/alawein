---
type: canonical
source: none
sync: none
sla: none
title: Workspace Standardization Guide
description: Canonical migration contract for naming, control-plane ownership, shared resources, and phased workspace directives.
last_updated: 2026-04-16
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.2.0
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
- `design-system` (legacy overlap: `aw-devkit`)
- `workspace-tools`
- `knowledge-base`

### Transitional Alias Format

When canonical name and physical repo slug differ, docs must use:

`canonical-name (repo: physical-slug)`

Current cutover status (2026-03-11): for `gymboy`, `meatheadphysicist`,
`atelier-rounaq`, and `edfp`, canonical and physical slugs now match.

### External Prefix Rule

External or remote tool directories must be explicitly documented as external.
Do not assume underscore-prefixed directories represent current live workspace
infrastructure.

## Stack-Aware Layout Standards

**SSOT for archetypes and anti-patterns**: [repository-layout-standard.md](./repository-layout-standard.md).  
**Tooling and CI**: [tooling-quality-gates.md](./tooling-quality-gates.md).

The sections below remain as migration-era detail; prefer the SSOT doc for new repos.

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

- Shared design tokens, components, themes, and tooling belong in
  `design-system/`.
- Token source of truth is `design-system/tokens/`.
- Workspace manifests, repo registry, and runtime batch state belong in
  `workspace-tools/`.
- Structured records, profile exports, and audit/config templates belong in
  `knowledge-base/`.
- Cross-repo docs and migration matrices belong in `alawein/`.
- Cross-repo operational guides and handoff docs belong in `docs/`.
- `aw-devkit` is retired and can only be referenced as historical migration
  context.

## Directive Mapping (D-1 through D-5)

### D-1: Design-System Consolidation

- Consolidate `aw-devkit` into `design-system`.
- Redirect references to `design-system` with canonical token source in
  `design-system/tokens/`.
- Completed on 2026-03-11: physical `aw-devkit` workspace root retired.

### D-2: Gymboy Redesign

- Implement Game Boy-inspired visual redesign.
- Keep canonical naming as `gymboy`.
- Ensure deploy metadata targets `gymboy.coach`.

### D-3: Repz Heal

- Resolve build, test, lint, dependency, and architecture debt.
- Standardize on `repzcoach.com` as canonical domain.

### D-4: Ninja Visual Token System

- Enforce shared core ninja tokens from `design-system/tokens/`.
- Permit per-character specialization through constrained derivations.

### D-5: meshal.ai Refinement

- Execute content, design, performance, SEO, and accessibility upgrades.
- Keep portfolio representation synchronized with `alawein/README.md`.

## Execution Order

1. Update governance docs and canonical naming matrices.
2. Align portfolio data (`projects.json`) and generated README content.
3. Consolidate shared-resource ownership (`design-system`, `workspace-tools`,
   `knowledge-base`).
4. Execute repo-specific directives (D-2, D-3, D-5) with continuous README sync.
5. Perform physical repo slug renames once technical readiness is confirmed.
6. Remove transitional alias notation after cutover.

## Verification Requirements

1. Canonical names are reflected in governance docs and portfolio data.
2. Transitional aliases appear only in approved `repo:` contexts.
3. README and `projects.json` remain synchronized.
4. Domain canonicalization is enforced (`repzcoach.com`).
5. Validation commands pass for docs and repo-level contracts.
