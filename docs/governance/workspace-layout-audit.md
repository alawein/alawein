---
title: Workspace Layout Audit
description: Repo-by-repo audit of layout alignment against the alawein workspace stack-aware standardization rules
last_updated: 2026-03-09
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [workspace, layout, audit, standardization, governance]
---

# Workspace Layout Audit

This audit turns the workspace layout standards into a concrete repo-by-repo
status view. It should be used alongside
[`workspace-standardization.md`](./workspace-standardization.md), not instead of
it.

## Status Labels

- `aligned`: current shape matches the expected pattern for the repo type
- `partial`: broadly on the right path, but missing one or more standard
  surfaces or carrying minor drift
- `mixed`: multiple layout models are present and need a focused cleanup pass
- `exception`: intentionally specialized or archival; do not force a generic
  layout without a separate audit

## Root-Level Naming

| Path | Status | Notes |
| --- | --- | --- |
| `.github/` | exception | Explicit automation-path exemption |
| `_gmail-ops/` | aligned | Local support workspace; underscore-prefixed |
| `_neper/` | aligned | Local support workspace; underscore-prefixed |
| `MeatheadPhysicist/` | partial | Layout is mostly healthy, but root rename to `meatheadphysicist/` is still deferred pending slug audit |
| `aw-devkit/` | exception | Archived migration-reference repo; retire by redirection, not by further feature work |

## Governance and Shared-Resource Repos

| Repo | Expected pattern | Status | Notes | Next action |
| --- | --- | --- | --- | --- |
| `alawein/` | root governance files, `.github/`, `docs/`, `scripts/` | aligned | Governance home already follows the docs-first pattern | Keep matrices and audits current |
| `docs/` | docs-only repo with guide, handoff, and backlog surfaces | aligned | `guides/`, `handoffs/`, and `backlog/` now replace the old flat file layout | Keep `handoffs/current.md` overwritten with real current state |
| `devkit/` | `apps/`, `packages/`, `docs/`, `scripts/`, `bin/` | aligned | Canonical shared-resource monorepo shape is now explicit | Continue moving canonical references away from `aw-devkit/` |
| `aw-devkit/` | archival reference only | exception | Flat CSS-kit structure remains for historical and migration context | Do not add new canonical shared-resource work here |
| `helios/` | special-case archive | exception | Docs-only or archive-style repo with no active app/runtime surface | Audit before any forced restructuring |

## JavaScript and TypeScript Repos

| Repo | Expected pattern | Status | Notes | Next action |
| --- | --- | --- | --- | --- |
| `attributa/` | Vite SPA: `src/`, `tests/`, `docs/`, `scripts/`, `public/` | aligned | Has the standard Vite app surfaces plus testing and ops directories | Maintain as-is |
| `gainboy/` | Vite SPA | partial | `src/` and `tests/` are healthy, but there is no dedicated `docs/` or `scripts/` surface yet | Add `docs/` when repo-specific guidance grows |
| `llmworks/` | Vite SPA | aligned | Clear `src/`, `tests/`, `docs/`, and `public/` structure | Maintain as-is |
| `meshal-web/` | Vite SPA | aligned | React Router routes are now explicitly standardized under `src/pages/`, with `src/app/` reserved for app-shell styles and repo-local `docs/` and `scripts/` surfaces in place | Keep route and docs validators aligned with the repo contract |
| `qmlab/` | Vite SPA | aligned | `src/`, `tests/`, `docs/`, `scripts/`, and `public/` are present | Maintain as-is |
| `rounaq-atelier/` | Vite SPA | aligned | Healthy Vite-style app layout with `src/`, `tests/`, `docs/`, and `scripts/` | Maintain as-is |
| `simcore/` | Vite SPA | aligned | `src/`, `tests/`, `docs/`, `scripts/`, and `public/` are present | Maintain as-is |
| `bolts/` | Next.js app | partial | Has `src/app/`, `src/components/`, `src/lib/`, and tests, but also a root `packages/` surface | Confirm whether `packages/` is intentional or should be collapsed into repo-local modules |
| `scribd/` | Next.js app | aligned | Uses `app/`, `components/`, `lib/`, `public/`, and tests in the expected Next shape | Maintain as-is |
| `repz/` | hybrid JS app | partial | The canonical Vite + React Router runtime is now documented, but frozen Next-era artifacts remain in the tree | Keep new work on the Vite surfaces and remove legacy Next files once the broader worktree is stable |
| `shared-utils/` | package repo | partial | Clean minimal package layout with `src/`, but no `tests/` or `docs/` surface at root | Add `tests/` and `docs/` if package surface keeps growing |

## Python and Research Repos

| Repo | Expected pattern | Status | Notes | Next action |
| --- | --- | --- | --- | --- |
| `event-discovery-framework/` | `src/<package>/`, `tests/`, `docs/`, `notebooks/`, `scripts/` | aligned | Already follows the preferred Python project structure closely | Maintain as-is |
| `MeatheadPhysicist/` | Python research repo | partial | Strong `src/`, `tests/`, `docs/`, `notebooks/`, and `scripts/` core, plus additional research surfaces | Defer root rename until slug audit is complete |
| `qaplibria/` | Python research repo | partial | Core Python layout is present, but `services/`, `templates/`, and website material make it multi-surface | Keep core layout; avoid adding more root-level sprawl |
| `qubeml/` | Python repo | partial | Has `src/`, `tests/`, and `docs/`, but lacks a clearer `notebooks/` or `scripts/` boundary | Add standard helper surfaces when new operational work appears |
| `qmatsim/` | Python research repo | aligned | Uses a documented rooted `qmatsim/` package layout with intentional `siesta/`, `lammps/`, `scripts/`, and `docs/` research surfaces | Keep the rooted-package decision documented and validated |
| `maglogic/` | Python research repo | mixed | Uses a `python/` root rather than `src/`, alongside domain-specific tool directories | Decide whether to keep an explicit exception or migrate toward `src/` |
| `scicomp/` | computational science repo | exception | Multiple language and domain roots (`Python/`, `MATLAB/`, `Mathematica/`) are intentional | Audit by runtime surface, not by generic template |
| `spincirc/` | scientific mixed-language repo | exception | `python/`, `matlab/`, and `verilogA/` reflect real multi-language boundaries | Preserve specialized layout until a surface-specific audit is done |

## Priority Cleanup Queue

1. `maglogic/` — `python/` versus `src/` needs a deliberate exception or
   migration decision.
2. `bolts/` — verify whether root `packages/` is a permanent structural choice.
3. `repz/` — canonical runtime is settled, but frozen Next-era files still need
   a cleanup window after the dirty worktree stabilizes.
4. `gainboy/` — add a lightweight `docs/` and `scripts/` surface if the repo’s
   guidance and tooling continue to expand.
5. `qubeml/` — add a clearer `scripts/` or `notebooks/` boundary if new
   operational and research work continues to accumulate.

## Rules for Follow-On Cleanup

- Do not batch all repo normalizations into one change set.
- Treat archival and research exceptions as first-class decisions, not failures.
- When a repo is already aligned, avoid churn for cosmetic uniformity alone.
- Update this audit whenever a repo moves between `partial`, `mixed`,
  `exception`, and `aligned`.
