---
type: canonical
source: none
sync: none
sla: none
title: Workspace Layout Audit
description: Repo-by-repo layout status against stack-aware standards with canonical-name-first reporting.
last_updated: 2026-03-30
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.1.0
tags: [workspace, layout, audit, standardization, governance]
---

# Workspace Layout Audit

This audit maps workspace repos to stack-aware layout standards while reporting
canonical names first and physical slugs second when needed.

**Archetype SSOT**: Use [repository-layout-standard.md](./repository-layout-standard.md) for required top-level folders per stack. **Desktop clone inventory**: [desktop-repo-inventory.json](./desktop-repo-inventory.json).

## Status Labels

- `aligned`: layout matches expected pattern for repo type
- `partial`: broadly aligned, with targeted cleanup pending
- `mixed`: multiple layout models need focused cleanup
- `exception`: intentionally specialized or archival

## Root-Level Naming

| Canonical Name | Physical Path | Status | Notes |
| --- | --- | --- | --- |
| `_ops/gmail-ops` | `_ops/gmail-ops/` | aligned | External workspace (under _ops) |
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
| `devkit` | `devkit` | shared packages + docs + scripts | aligned | Maintain canonical ownership in `devkit/tokens/` and package surfaces |
| `helios` | `helios` | archive/special-case docs surface | exception | Audit before structural normalization |

## Retired Roots

| Canonical Name | Retired Physical Root | Retirement Date | Notes |
| --- | --- | --- | --- |
| `devkit` | `aw-devkit/` | 2026-03-11 | D-1 physical retirement cutover completed |

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
| `shared-utils` | `shared-utils` | package repo | partial | Add stronger docs/test boundaries if package grows |

## Python and Research Repos

| Canonical Name | Physical Slug | Expected Pattern | Status | Next Action |
| --- | --- | --- | --- | --- |
| `edfp` | `edfp` | Python package layout | aligned | Maintain |
| `meatheadphysicist` | `meatheadphysicist` | Python research repo | aligned | Maintain domain-specific structure |
| `qaplibria` | `qaplibria` | Python research multi-surface | partial | Contain root-level sprawl |
| `qubeml` | `qubeml` | Python package + research surfaces | partial | Add clearer scripts/notebooks boundary if needed |
| `qmatsim` | `qmatsim` | rooted package with research surfaces | aligned | Maintain |
| `maglogic` | `maglogic` | polyglot scientific layout | aligned | Maintain |
| `scicomp` | `scicomp` | multi-language scientific suite | exception | Audit by runtime surface |
| `spincirc` | `spincirc` | mixed-language scientific repo | exception | Preserve specialized boundaries |

## Priority Cleanup Queue

1. `repz` — execute D-3 and standardize on `repzcoach.com`.
2. `gymboy` — execute D-2 redesign and naming/domain consistency.
3. `meshal-web` — execute D-5 refinement.
4. `meatheadphysicist` — maintain immutable-surface policy and repo health.

## Follow-On Rules

- Do not batch all repo normalizations into one diff.
- Preserve documented exceptions unless an explicit decision updates them.
- Update this audit whenever repo status changes across labels.
