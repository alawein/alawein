---
type: canonical
source: none
sync: none
sla: none
title: Workspace Root Rename Matrix
description: Canonical-to-physical name matrix for live top-level workspace directories and retired aliases.
last_updated: 2026-04-16
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.2.0
tags: [workspace, migration, naming, inventory]
---

# Workspace Root Rename Matrix

This matrix tracks canonical names, current physical slugs, and migration
status.

## Repository Roots

| Canonical Name | Physical Repo Slug | Domain | Status | Notes |
| --- | --- | --- | --- | --- |
| `alawein` | `alawein` | — | Stable | Governance and org profile repo |
| `adil` | `adil` | — | Stable | Legal-ops workspace |
| `alembiq` | `alembiq` | — | Stable | Research platform and experiment repo |
| `atelier-rounaq` | `atelier-rounaq` | — | Stable | Hard cutover completed 2026-03-11 |
| `attributa` | `attributa` | `attributa.dev` | Stable | — |
| `bolts` | `bolts` | — | Stable | — |
| `chshlab` | `chshlab` | — | Stable | — |
| `design-system` | `design-system` | — | Stable | Canonical shared design-system source |
| `design-system-visual-fix` | `design-system-visual-fix` | — | Stable | Sibling variant / rollout surface |
| `edfp` | `edfp` | `edfp.online` | Stable | — |
| `fallax` | `fallax` | — | Stable | Benchmark and reasoning-eval repo |
| `gymboy` | `gymboy` | `gymboy.coach` | Stable | Hard cutover completed 2026-03-11 |
| `helios` | `helios` | — | Stable | — |
| `knowledge-base` | `knowledge-base` | — | Stable | Canonical records and profile-export repo |
| `llmworks` | `llmworks` | `llmworks.dev` | Stable | — |
| `loopholelab` | `loopholelab` | — | Stable | — |
| `maglogic` | `maglogic` | — | Stable | — |
| `meatheadphysicist` | `meatheadphysicist` | — | Stable | Hard cutover completed 2026-03-11 |
| `meshal-web` | `meshal-web` | `meshal.ai` | Stable | — |
| `optiqap` | `optiqap` | — | Stable | Legacy overlap: `qaplibria` |
| `provegate` | `provegate` | — | Stable | Legacy overlap: `epistemic-stack` |
| `qmatsim` | `qmatsim` | — | Stable | — |
| `qmlab` | `qmlab` | — | Stable | — |
| `quantumalgo` | `quantumalgo` | — | Stable | QAOA-for-QAP research repo |
| `qubeml` | `qubeml` | — | Stable | — |
| `repz` | `repz` | `repzcoach.com` | Stable | Canonical domain `repzcoach.com` |
| `roka-oakland-hustle` | `roka-oakland-hustle` | — | Stable | Campaign site repo |
| `scicomp` | `scicomp` | — | Stable | — |
| `scribd` | `scribd` | — | Stable | — |
| `simcore` | `simcore` | — | Stable | — |
| `spincirc` | `spincirc` | — | Stable | — |
| `workspace-tools` | `workspace-tools` | — | Stable | Canonical batch/orchestration repo |

## Retired Repository Roots

| Canonical Name | Retired Physical Repo Slug | Domain | Status | Notes |
| --- | --- | --- | --- | --- |
| `design-system` | `aw-devkit` | — | Retired | D-1 physical retirement cutover completed on 2026-03-11 |
| `alembiq` | `neper` | — | Retired alias | Historical legacy name only |
| `optiqap` | `qaplibria` | — | Retired alias | Historical legacy name only |

## Support and External Roots

| Canonical Name | Physical Directory | Status | Notes |
| --- | --- | --- | --- |
| `.github` | `.github` | Stable | Workspace-level automation surface |
| `.mypy_cache` | `.mypy_cache` | Local-only | Transient local cache; non-canonical |
| `.venv` | `.venv` | Local-only | Transient local environment; non-canonical |
| `.vscode` | `.vscode` | Local-only | Editor-local metadata; non-canonical |

## Alias Rule

For any in-progress row where canonical and physical names differ, managed docs
must render aliases in this format:

`canonical-name (repo: physical-slug)`

No alias notation is required for rows with canonical=physical slugs.
