---
title: Workspace Resource Map
description: Canonical home map for governance docs, shared packages, design tokens, guides, and local-only workspace resources across the alawein workspace
last_updated:  2026-03-08
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [workspace, resources, governance, devkit, docs, mapping]
---

# Workspace Resource Map

This map records the canonical home for shared resources across the `alawein`
workspace. Each resource class should have one documented source of truth.

| Resource class | Canonical repo | Canonical path | Owner | Primary consumers | Migration status |
| --- | --- | --- | --- | --- | --- |
| Governance contracts and migration policy | `alawein/` | `docs/governance/` | `alawein` maintainers | all repos | Active |
| Workspace rename inventory | `alawein/` | `docs/governance/workspace-rename-matrix.md` | `alawein` maintainers | all repos | Active |
| Workspace resource inventory | `alawein/` | `docs/governance/workspace-resource-map.md` | `alawein` maintainers | all repos | Active |
| Shared design tokens | `devkit/` | `packages/tokens/` | `devkit` maintainers | JS and TS consumer repos | Canonical |
| Shared UI components | `devkit/` | `packages/ui/` | `devkit` maintainers | React and Next consumers | Canonical |
| Shared icons and brand SVGs | `devkit/` | `packages/icons/` | `devkit` maintainers | JS and TS consumer repos | Canonical |
| Shared theme packages | `devkit/` | `packages/theme-*/` | `devkit` maintainers | themed consumer repos | Canonical |
| Shared config packages | `devkit/` | `packages/eslint-config/`, `packages/prettier-config/`, `packages/tsconfig/`, `packages/tailwind-preset/` | `devkit` maintainers | JS and TS consumer repos | Canonical |
| Shared demos and playground surface | `devkit/` | `apps/storybook/` | `devkit` maintainers | design-system consumers | Canonical |
| Shared repo-operational scripts for devkit-managed resources | `devkit/` | `scripts/` and `bin/` | `devkit` maintainers | `devkit/` and direct consumers | Canonical |
| Cross-repo durable guides | `docs/` | `guides/` | `docs` maintainers | all repos | Active |
| Session handoff state | `docs/` | `handoffs/` | `docs` maintainers | active operators | Active |
| Portfolio backlog and deferred tasks | `docs/` | `backlog/` | `docs` maintainers | all repos | Active |
| Legacy zero-build Alawein CSS kit | `aw-devkit/` | repository root | `aw-devkit` maintainers | archival only | Retiring into `devkit/` references |
| Local-only support workspaces | underscore-prefixed roots | workspace root | local operator | local only | Must stay underscore-prefixed |

## Rules

- If a resource class already has a canonical row here, do not create a second
  source of truth in another repo.
- Secret credentials are excluded from this map and must stay in secret
  management or ignored local env files.
- Update this file whenever a shared resource changes canonical home.
