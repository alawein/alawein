---
type: canonical
source: none
sync: none
sla: none
title: Workspace Resource Map
description: Canonical ownership map for governance docs, repo metadata, shared packages, design tokens, and batch/runtime surfaces.
last_updated: 2026-04-16
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.2.0
tags: [workspace, resources, governance, design-system, docs, mapping]
---

# Workspace Resource Map

This map documents one canonical home per shared resource class across the
workspace.

| Resource Class | Canonical Repo | Canonical Path | Owner | Consumers | Status |
| --- | --- | --- | --- | --- | --- |
| Workspace operating contract | `alawein` | `docs/governance/workspace-master-prompt.md` | `alawein` maintainers | all repos | Active |
| Documentation contract | `alawein` | `docs/governance/documentation-contract.md` | `alawein` maintainers | all repos | Active |
| Canonical repo metadata | `alawein` | `catalog/repos.json` | `alawein` maintainers | generators, validators, README sync | Canonical |
| Derived project registry | `alawein` | `projects.json` | `alawein` maintainers | README, feeds, downstream sync | Derived |
| Workspace rename inventory | `alawein` | `docs/governance/workspace-rename-matrix.md` | `alawein` maintainers | all repos | Active |
| Workspace layout audit | `alawein` | `docs/governance/workspace-layout-audit.md` | `alawein` maintainers | all repos | Active |
| Shared design tokens | `design-system` | `tokens/` | `design-system` maintainers | all UI repos | Canonical |
| Shared UI components | `design-system` | `packages/ui/` | `design-system` maintainers | React/Next repos | Canonical |
| Shared icons and brand assets | `design-system` | `packages/icons/` | `design-system` maintainers | frontend repos | Canonical |
| Shared style/config packages | `design-system` | `packages/eslint-config/`, `packages/prettier-config/`, `packages/tsconfig/`, `packages/tailwind-preset/` | `design-system` maintainers | JS/TS repos | Canonical |
| Storybook and shared demos | `design-system` | `apps/storybook/` | `design-system` maintainers | design-system consumers | Canonical |
| Batch manifests | `workspace-tools` | `docs/batches/` | `workspace-tools` maintainers | multi-repo execution flows | Canonical |
| Batch repo registry | `workspace-tools` | `config/repo-capabilities.yaml` | `workspace-tools` maintainers | `workspace-batch`, governance deploys | Canonical |
| Batch runtime state | `workspace-tools` | `state/<batch-id>/` | `workspace-tools` maintainers | multi-repo execution flows | Canonical |
| Profile copy and structured records | `knowledge-base` | `career/`, `db/`, `db/schema/export/` | `knowledge-base` maintainers | profile sync, exports, audits | Canonical |
| Retired legacy shared-resource repo | `aw-devkit` | retired from workspace root | migration owners | historical reference only | Retired on 2026-03-11 |
| Design/branding implementation (Phase 1–5) | `alawein` | `docs/governance/phase1-design-branding-analysis-*.md`, `phase3-refactor-and-centralization.md`, `phase4-testing-and-validation.md`, `phase5-version-control-and-deployment.md`, `bulk-execution-progress.md`, `remaining-steps-per-repo.md`, `design-branding-summary.md`; `docs/HANDOFF-DESIGN-BRANDING.md` | `alawein` maintainers | agents, contributors | Active |

## Rules

- Do not create multiple sources of truth for the same resource class.
- Any canonical-home change must update this map and `alawein/README.md`.
- Legacy resources are read-only unless a migration directive explicitly scopes
  edits.
- Secrets are out of scope for this map and remain in secret-management flows.
