---
title: Package Namespace Matrix
description: Inventory of shared package producers, consumers, and namespace inconsistencies across the alawein workspace
last_updated:  2026-03-08
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [packages, namespace, devkit, migration, inventory]
---

# Package Namespace Matrix

This matrix tracks the current shared package surface and the repositories that consume it.

## Canonical package source

- Shared packages are published from `devkit/`.
- Target shared namespace: `@alawein/*`.
- `devkit/` remains a private workspace package source, so in-workspace consumers resolve shared packages through local `file:` references instead of npm registry versions.
- `aw-devkit/` is not a canonical shared-package source. Any remaining
  references to its token, component, or tooling surface should be redirected
  to `devkit/` or retired as archival-only material.

## Shared package producers

| Package | Source |
| --- | --- |
| `@alawein/ui` | `devkit/packages/ui/` |
| `@alawein/tokens` | `devkit/packages/tokens/` |
| `@alawein/icons` | `devkit/packages/icons/` |
| `@alawein/tailwind-preset` | `devkit/packages/tailwind-preset/` |
| `@alawein/theme-base` | `devkit/packages/theme-base/` |
| `@alawein/theme-cyberpunk` | `devkit/packages/theme-cyberpunk/` |
| `@alawein/theme-glassmorphism` | `devkit/packages/theme-glassmorphism/` |
| `@alawein/theme-luxury` | `devkit/packages/theme-luxury/` |
| `@alawein/theme-quantum` | `devkit/packages/theme-quantum/` |
| `@alawein/theme-strategic` | `devkit/packages/theme-strategic/` |
| `@alawein/prettier-config` | `devkit/packages/prettier-config/` |
| `@alawein/eslint-config` | `devkit/packages/eslint-config/` |
| `@alawein/tsconfig` | `devkit/packages/tsconfig/` |
| `@alawein/shared-utils` | `shared-utils/` |

## Canonical shared-resource homes

| Resource | Canonical home |
| --- | --- |
| shared design tokens | `devkit/packages/tokens/` |
| shared UI components | `devkit/packages/ui/` |
| shared theme assets | `devkit/packages/theme-*/` |
| shared icons and brand SVGs | `devkit/packages/icons/` |
| devkit demos and playgrounds | `devkit/apps/storybook/` |
| devkit-managed scripts and entrypoints | `devkit/scripts/` and `devkit/bin/` |

## Consumer repositories

| Repo | Shared packages used | Notes |
| --- | --- | --- |
| `attributa` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` package paths; install refreshed |
| `bolts` | `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` config package paths; install refreshed |
| `gainboy` | `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` config package paths; install refreshed after fixing invalid `workspaces` metadata |
| `llmworks` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` package paths; install refreshed |
| `meshal-web` | `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` config package paths; install refreshed |
| `qmlab` | `@alawein/ui` | Rewired to local `devkit` UI path; install refreshed |
| `repz` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` package paths; install refreshed |
| `scribd` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` package paths; install refreshed |
| `simcore` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Rewired to local `devkit` package paths; install refreshed; mixed app namespace remains |
| `devkit/templates/vite-spa` | `@alawein/*` packages | Producer-side template migration complete |
| `devkit/templates/next-app` | `@alawein/*` packages | Producer-side template migration complete |
| `devkit/apps/storybook` | All theme, token, preset, icon, and UI packages | Full integration surface |

## Notable inconsistencies

- Producer packages in `devkit/` and the active consumer manifests above now target `@alawein/*`, but historical docs, changelogs, and generated artifacts still contain legacy `@malawein/*` references.
- Templates use caret ranges while local workspace consumers use `file:` references into `devkit/`.
- `aw-devkit/` still contains a legacy zero-build CSS kit that overlaps with
  `devkit/` as the canonical shared-resource home.
- `simcore` uses the app namespace `@alaweinos/simcore-app` while consuming shared UI/config packages.
- `shared-utils` has been renamed to `@alawein/shared-utils`, but downstream consumers still need a separate adoption pass if they import it directly.
- Some consumers still rely on top-level `prettier` fields without importing additional shared runtime packages beyond config references.

## Migration rule

1. Update producer package names and exports in `devkit/` first.
2. Update template packages next so new scaffolds follow the new namespace.
3. Update in-workspace consumer repositories to local `file:` references into `devkit/` rather than unpublished registry versions.
4. Re-run install, lint, type-check, test, and build flows in each consumer after migration.
