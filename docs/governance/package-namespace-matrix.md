---
type: canonical
source: none
sync: none
sla: none
title: Package Namespace Matrix
description: Inventory of shared package producers, consumers, and namespace inconsistencies across the alawein workspace
last_updated: 2026-04-16
category: governance
audience: contributors
status: active
author: Morphism Systems Inc.
version: 1.0.0
tags: [packages, namespace, devkit, migration, inventory]
---

# Package Namespace Matrix

This matrix tracks the current shared package surface and the repositories that
consume it.

## Canonical package source

- Shared UI, token, icon, and theme packages are published from
  `design-system/packages/`.
- Shared linting and formatting config packages are published from
  `workspace-tools/packages/`.
- Target shared namespace: `@alawein/*`.
- In-workspace consumers resolve shared packages through local `file:`
  references instead of registry versions.
- The retired pre-standardization package layout is migration history, not
  canonical guidance.

## Shared package producers

| Package | Source |
| --- | --- |
| `@alawein/tokens` | `design-system/packages/@alawein/tokens/` |
| `@alawein/morphism-themes` | `design-system/packages/@alawein/morphism-themes/` |
| `@alawein/ui` | `design-system/packages/ui/` |
| `@alawein/icons` | `design-system/packages/icons/` |
| `@alawein/shared-utils` | `design-system/packages/shared-utils/` |
| `@alawein/tailwind-preset` | `design-system/packages/tailwind-preset/` |
| `@alawein/theme-base` | `design-system/packages/theme-base/` |
| `@alawein/theme-cyberpunk` | `design-system/packages/theme-cyberpunk/` |
| `@alawein/theme-edfp` | `design-system/packages/theme-edfp/` |
| `@alawein/theme-glassmorphism` | `design-system/packages/theme-glassmorphism/` |
| `@alawein/theme-luxury` | `design-system/packages/theme-luxury/` |
| `@alawein/theme-meshal-variants` | `design-system/packages/theme-meshal-variants/` |
| `@alawein/theme-quantum` | `design-system/packages/theme-quantum/` |
| `@alawein/theme-strategic` | `design-system/packages/theme-strategic/` |
| `@alawein/eslint-config` | `workspace-tools/packages/eslint-config/` |
| `@alawein/prettier-config` | `workspace-tools/packages/prettier-config/` |
| `@alawein/tsconfig` | `workspace-tools/packages/tsconfig/` |
| `@alawein/standards` | `workspace-tools/packages/alawein-standards/` |

## Canonical shared-resource homes

| Resource | Canonical home |
| --- | --- |
| shared design tokens | `design-system/tokens/` (source) and `design-system/packages/@alawein/tokens/` (package surface) |
| shared UI components | `design-system/packages/ui/` |
| shared theme assets | `design-system/packages/theme-*/` and `design-system/packages/@alawein/morphism-themes/` |
| shared icons and brand SVGs | `design-system/packages/icons/` |
| storybook demos and package playgrounds | `design-system/apps/storybook/` |
| shared lint, prettier, tsconfig, and standards packages | `workspace-tools/packages/` |

## Consumer repositories

| Repo | Shared packages used | Notes |
| --- | --- | --- |
| `attributa` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Local workspace references; install refreshed |
| `bolts` | `@alawein/eslint-config`, `@alawein/prettier-config` | Local config-package references; install refreshed |
| `gymboy` | `@alawein/eslint-config`, `@alawein/prettier-config` | Local config-package references; install refreshed after workspace metadata repair |
| `llmworks` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Local workspace references; install refreshed |
| `meshal-web` | `@alawein/eslint-config`, `@alawein/prettier-config` | Local config-package references; install refreshed |
| `qmlab` | `@alawein/ui` | Local UI package reference; install refreshed |
| `repz` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Local workspace references; install refreshed |
| `scribd` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Local workspace references; install refreshed |
| `simcore` | `@alawein/ui`, `@alawein/eslint-config`, `@alawein/prettier-config` | Local workspace references; mixed app namespace remains |
| `design-system/apps/storybook` | Tokens, themes, preset, icons, and UI packages | Full integration surface |

## Notable inconsistencies

- Historical docs, changelogs, and generated artifacts may still mention the
  retired pre-standardization package scope or the old workspace layout. Treat
  those references as migration residue, not canonical guidance.
- Templates and external consumers may use semver ranges while in-workspace
  consumers use `file:` references into `design-system/` and
  `workspace-tools/`.
- Historical references may still mention retired workspace names; treat them
  as migration context only.
- `simcore` uses the app namespace `@alaweinos/simcore-app` while consuming shared UI/config packages.
- `shared-utils` now publishes under `@alawein/shared-utils`, but downstream
  consumers still need a separate adoption pass if they import it directly.
- Some consumers still rely on top-level `prettier` fields without importing additional shared runtime packages beyond config references.

## Migration rule

1. Update producer package names and exports in `design-system/` or
   `workspace-tools/packages/` first.
2. Update storybook or scaffolding surfaces next so new work inherits the
   current package contract.
3. Update in-workspace consumer repositories to local `file:` references into
   `design-system/` and `workspace-tools/` rather than unpublished registry
   versions.
4. Re-run install, lint, type-check, test, and build flows in each consumer after migration.
