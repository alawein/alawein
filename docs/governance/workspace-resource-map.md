---
title: Workspace Resource Map
description: Canonical ownership map for governance docs, shared packages, design tokens, and migration surfaces.
last_updated: 2026-03-14
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.1.0
tags: [workspace, resources, governance, devkit, docs, mapping]
---

# Workspace Resource Map

This map documents one canonical home per shared resource class across the
workspace.

| Resource Class | Canonical Repo | Canonical Path | Owner | Consumers | Status |
| --- | --- | --- | --- | --- | --- |
| Workspace operating contract | `alawein` | `docs/governance/workspace-master-prompt.md` | `alawein` maintainers | all repos | Active |
| Documentation contract | `alawein` | `docs/governance/documentation-contract.md` | `alawein` maintainers | all repos | Active |
| Portfolio source data | `alawein` | `projects.json` | `alawein` maintainers | README + Notion sync | Active |
| Workspace rename inventory | `alawein` | `docs/governance/workspace-rename-matrix.md` | `alawein` maintainers | all repos | Active |
| Workspace layout audit | `alawein` | `docs/governance/workspace-layout-audit.md` | `alawein` maintainers | all repos | Active |
| Shared design tokens | `devkit` | `tokens/` | `devkit` maintainers | all UI repos | Canonical |
| Shared UI components | `devkit` | `packages/ui/` | `devkit` maintainers | React/Next repos | Canonical |
| Shared icons and brand assets | `devkit` | `packages/icons/` | `devkit` maintainers | frontend repos | Canonical |
| Shared style/config packages | `devkit` | `packages/eslint-config/`, `packages/prettier-config/`, `packages/tsconfig/`, `packages/tailwind-preset/` | `devkit` maintainers | JS/TS repos | Canonical |
| Storybook and shared demos | `devkit` | `apps/storybook/` | `devkit` maintainers | design-system consumers | Canonical |
| Retired legacy shared-resource repo | `aw-devkit` | retired from workspace root | migration owners | historical reference only | Retired on 2026-03-11 |
| External automation workspace | `_gmail-ops` | workspace root | local operator | local tooling | Canonical external |
| Design/branding implementation (Phase 1–5) | `alawein` | `docs/governance/phase1-design-branding-analysis-*.md`, `phase3-refactor-and-centralization.md`, `phase4-testing-and-validation.md`, `phase5-version-control-and-deployment.md`, `bulk-execution-progress.md`, `remaining-steps-per-repo.md`, `design-branding-summary.md`; `docs/HANDOFF-DESIGN-BRANDING.md` | `alawein` maintainers | agents, contributors | Active |

## Rules

- Do not create multiple sources of truth for the same resource class.
- Any canonical-home change must update this map and `alawein/README-backup-20250807.md`.
- Legacy resources are read-only unless a migration directive explicitly scopes
  edits.
- Secrets are out of scope for this map and remain in secret-management flows.
