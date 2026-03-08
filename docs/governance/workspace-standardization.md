---
title: Workspace Standardization Guide
description: Canonical migration contract for root naming, stack-aware directory layouts, shared package namespaces, and consistency refactors across the alawein workspace
last_updated:  2026-03-08
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [workspace, migration, naming, layout, refactoring, governance]
---

# Workspace Standardization Guide

This document is the active contract for workspace-wide cleanup and standardization across the
`alawein` workspace.

## Goals

- Keep root naming predictable.
- Standardize repository layout by stack and function instead of forcing one generic tree.
- Centralize shared package, branding, and documentation rules.
- Separate low-risk filesystem cleanup from higher-risk package and repository migrations.

## Naming Policy

### Support directories

- Non-repository support directories use a leading underscore when they are safe to rename.
- Implemented in this pass:
  - `0/` -> `_0/`
  - `.mypy_cache/` -> `_mypy_cache/`
  - local-only support workspaces such as `_gmail-ops/` and `_neper/` stay underscore-prefixed
- Deferred:
  - `.github/` remains unchanged because its current path may be consumed by automation,
    instructions, and workflow tooling.

### Repository roots

- Repository root directories should converge on lowercase canonical repository slugs.
- Use kebab-case when the repository slug itself uses hyphens.
- Root renames must happen only after cross-repo references, deployment paths, changelog links, and
  package consumers have been audited.
- Current rename targets:
  - `MeatheadPhysicist/` -> `meatheadphysicist/` (deferred pending final remote slug decision)
  - `aw-devkit/` -> retired into `devkit/` after migration audit

## Stack-Aware Layout Standards

### Vite and SPA repositories

- Core directories:
  - `src/components/`
  - `src/lib/`
  - `src/types/`
  - `src/hooks/`
  - `src/pages/` or route-equivalent entry points
- Optional directories should be feature-driven, not arbitrary:
  - `src/services/`
  - `src/store/`
  - `src/integrations/`
  - `src/workers/`

### Next.js repositories

- Preserve `app/` routing conventions.
- Prefer clear boundaries between UI, data access, and shared utilities.
- Monorepos should keep `apps/` and `packages/` boundaries explicit rather than flattening them.

### Python repositories

- Preferred structure:
  - `src/<package_name>/`
  - `tests/`
  - `docs/`
  - `notebooks/`
  - `scripts/`
- Research repositories may retain specialized domain folders, but new additions should align with
  the structure above where practical.

## Shared Package and Theme Rules

- Shared design, linting, formatting, TypeScript packages, tokens, icons,
  themes, and reusable frontend assets are owned by `devkit/`.
- Namespace migrations must start in `devkit/` before consumer repositories are changed.
- Shared brand primitives, theme tokens, and reusable asset rules should be centralized before
  product-specific theme overrides are touched.
- Producer-side migration to `@alawein/*` is complete in `devkit/` for the active package surface.
- In-workspace consumer adoption must use local `file:` references into `devkit/packages/*` while
  `devkit/` remains unpublished.
- `aw-devkit/` is legacy overlapping design-surface work. It should be treated
  as read-only during migration and retired after its references are redirected
  to `devkit/`.
- Consumer package rewiring and install refreshes are now complete for the first migration batch:
  `attributa`, `bolts`, `gainboy`, `llmworks`, `meshal-web`, `qmlab`, `repz`, `scribd`, and
  `simcore`.

See `docs/governance/package-namespace-matrix.md` for the current consumer and dependency map.

## Canonical Repo Split

- `alawein/` owns governance contracts, rename policy, matrices, and workspace
  migration decisions.
- `devkit/` owns shared packages, design tokens, icons, themes, reusable
  frontend assets, and package-level templates.
- `docs/` owns cross-repo general guides, handoff state, and portfolio backlog
  references.

See `docs/governance/workspace-resource-map.md` for the canonical home of each
shared resource class.
See `docs/governance/workspace-layout-audit.md` for the current repo-by-repo
layout alignment status.

## Documentation and Writing Standards

- Required governance surface for active repositories:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `SSOT.md`
  - `README.md`
  - `CHANGELOG.md`
  - `CONTRIBUTING.md`
  - `SECURITY.md`
  - `LICENSE`
- Writing style should follow the documentation guidance already established in this workspace.
- Hollow templates must be replaced with stack-specific, repo-specific content during migration.

## License and Branding Policy

- Licenses should be aligned only where legal requirements truly match.
- Shared logos, themes, tokens, and reusable brand assets should be centralized when multiple repos
  consume them.
- Product-specific identities stay local when they are intentionally distinct.

## Execution Order

1. Safe support-directory renames.
2. Cross-repo audit of hardcoded names, URLs, deployment paths, and package consumers.
3. Canonical-home documentation refresh in `alawein/`, `devkit/`, and `docs/`.
4. `devkit/` package namespace migration and shared-resource consolidation.
5. Consumer repository package adoption using local `devkit` package paths.
6. Repository-root renames or retirements.
7. Stack-aware internal layout normalization.
8. Documentation, branding, and license cleanup.
9. Refactors and verification.

## Verification Requirements

1. Maintain an old-to-new root rename matrix before renaming repository directories.
2. Validate package consumers after each namespace change.
3. Re-run repository-standard checks after structural changes.
4. Update cross-repo documentation and changelog comparison links after any root rename.

See `docs/governance/workspace-rename-matrix.md` for the current root inventory and rename status.
