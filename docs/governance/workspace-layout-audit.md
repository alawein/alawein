---
type: canonical
source: none
sync: none
sla: none
title: Workspace Layout Audit
description: Repo-by-repo layout status against the current control-plane, design-system, research, and product standards.
last_updated: 2026-05-05
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.2.0
tags: [workspace, layout, audit, standardization, governance]
---

# Workspace Layout Audit

This audit maps workspace repos to the current stack-aware layout standards
while reporting canonical names first and physical slugs second when needed.

**Archetype SSOT**: Use [repository-layout-standard.md](./repository-layout-standard.md) for required top-level folders per stack. **Desktop clone inventory**: [desktop-repo-inventory.json](../archive/desktop-repo-inventory.json) (archived).

## Status Labels

- `aligned`: layout matches expected pattern for repo type
- `partial`: broadly aligned, with targeted cleanup pending
- `mixed`: multiple layout models need focused cleanup
- `exception`: intentionally specialized or archival

## Root-Level Naming

| Canonical Name | Physical Path | Status | Notes |
| --- | --- | --- | --- |
| `design-system` | `design-system/` | aligned | Canonical shared design-system repo |
| `workspace-tools` | `workspace-tools/` | aligned | Canonical batch/orchestration repo |
| `knowledge-base` | `knowledge-base/` | aligned | Canonical records and profile-export repo |
| `gymboy` | `gymboy/` | aligned | Hard cutover completed 2026-03-11 |
| `meatheadphysicist` | `meatheadphysicist/` | aligned | Hard cutover completed 2026-03-11 |

## Local-Only Support Paths

| Path | Status | Policy |
| --- | --- | --- |
| `.mypy_cache/` | local-only | Excluded from canonical workspace inventory |
| `.venv/` | local-only | Excluded from canonical workspace inventory |
| `.vscode/` | local-only | Excluded from canonical workspace inventory |

## Governance and Shared-Resource Repos

| Canonical Name | Physical Slug | Expected Pattern | Status | Next Action |
| --- | --- | --- | --- | --- |
| `alawein` | `alawein` | docs + governance + scripts | aligned | Keep matrices and prompts current |
| `design-system` | `design-system` | packages + tokens + Storybook + docs | aligned | Maintain canonical ownership in `tokens/`, `packages/`, and `apps/storybook/` |
| `design-system-visual-fix` | `design-system-visual-fix` | design-system sibling snapshot / rollout surface | exception | Keep clearly labeled as sibling variant, not the canonical source |
| `workspace-tools` | `workspace-tools` | batch runtime + config + scripts | aligned | Maintain `config/repo-capabilities.yaml` and `state/<batch-id>/` boundaries |
| `knowledge-base` | `knowledge-base` | records + profile exports + audit/config surfaces | aligned | Keep structured records canonical and archive historical material intentionally |
| `helios` | `helios` | archive/special-case docs surface | exception | Audit before structural normalization |

## Retired Roots

| Canonical Name | Retired Physical Root | Retirement Date | Notes |
| --- | --- | --- | --- |
| `design-system` | `aw-devkit/` | 2026-03-11 | D-1 physical retirement cutover completed |

## JavaScript and TypeScript Repos

| Canonical Name | Physical Slug | Expected Pattern | Status | Next Action |
| --- | --- | --- | --- | --- |
| `attributa` | `attributa` | Vite SPA | aligned | Maintain |
| `gymboy` | `gymboy` | Vite SPA | aligned | Execute D-2 redesign; keep canonical naming in docs |
| `llmworks` | `llmworks` | Vite SPA | aligned | Maintain |
| `meshal-web` | `meshal-web` | Vite SPA | aligned | Execute D-5 refinement |
| `qmlab` | `qmlab` | Vite SPA | aligned | Maintain |
| `atelier-rounaq` | `atelier-rounaq` | Vite SPA | aligned | Maintain |
| `simcore` | `simcore` | Vite SPA | aligned | Maintain |
| `bolts` | `bolts` | Next.js app | aligned | Maintain |
| `scribd` | `scribd` | Next.js app | aligned | Maintain |
| `repz` | `repz` | Vite + React Router app | partial | Execute D-3 cleanup and retire stale legacy runtime files |
| `provegate` | `provegate` | FastMCP / TypeScript service repo | aligned | Maintain protocol boundaries and typed contracts |
| `roka-oakland-hustle` | `roka-oakland-hustle` | campaign site | aligned | Keep marketing, QA, and release lanes separate |

## Python and Research Repos

| Canonical Name | Physical Slug | Expected Pattern | Status | Next Action |
| --- | --- | --- | --- | --- |
| `edfp` | `edfp` | Python package layout | aligned | Maintain |
| `alembiq` | `alembiq` | Python research + web surface | aligned | Keep experiment/runtime boundaries explicit |
| `fallax` | `fallax` | benchmark + schema + docs surfaces | aligned | Preserve stable benchmark semantics |
| `meatheadphysicist` | `meatheadphysicist` | Python research repo | aligned | Maintain domain-specific structure |
| `optiqap` | `optiqap` | Python research multi-surface | partial | Keep research, docs, and pages surfaces separated cleanly |
| `qubeml` | `qubeml` | Python package + research surfaces | partial | Add clearer scripts/notebooks boundary if needed |
| `qmatsim` | `qmatsim` | rooted package with research surfaces | aligned | Maintain |
| `maglogic` | `maglogic` | polyglot scientific layout | aligned | Maintain |
| `scicomp` | `scicomp` | multi-language scientific suite | exception | Audit by runtime surface |
| `spincirc` | `spincirc` | mixed-language scientific repo | exception | Preserve specialized boundaries |
| `quantumalgo` | `quantumalgo` | research repo with experiment and docs surfaces | partial | Keep QAOA-for-QAP artifacts separated from narrative docs |

## Priority Cleanup Queue

1. `repz` — execute D-3 and standardize on `repzcoach.com`.
2. `gymboy` — execute D-2 redesign and naming/domain consistency.
3. `meshal-web` — execute D-5 refinement.
4. `optiqap` — keep research, Pages, and notebook surfaces aligned.
5. `meatheadphysicist` — maintain immutable-surface policy and repo health.

## Follow-On Rules

- Do not batch all repo normalizations into one diff.
- Preserve documented exceptions unless an explicit decision updates them.
- Update this audit whenever repo status changes across labels.
