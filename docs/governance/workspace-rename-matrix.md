---
title: Workspace Root Rename Matrix
description: Canonical-to-physical name matrix for top-level workspace directories and phased migration status.
last_updated: 2026-03-18
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.1.0
tags: [workspace, migration, naming, inventory]
---

# Workspace Root Rename Matrix

This matrix tracks canonical names, current physical slugs, and migration
status.

## Repository Roots

| Canonical Name | Physical Repo Slug | Domain | Status | Notes |
| --- | --- | --- | --- | --- |
| `alawein` | `alawein` | — | Stable | Governance and org profile repo |
| `attributa` | `attributa` | `attributa.dev` | Stable | — |
| `bolts` | `bolts` | — | Stable | — |
| `devkit` | `devkit` | — | Stable | Canonical shared-resource source |
| `edfp` | `edfp` | `edfp.online` | Stable | — |
| `gymboy` | `gymboy` | `gymboy.coach` | Stable | Hard cutover completed 2026-03-11 |
| `helios` | `helios` | — | Stable | — |
| `llmworks` | `llmworks` | `llmworks.dev` | Stable | — |
| `maglogic` | `maglogic` | — | Stable | — |
| `meatheadphysicist` | `meatheadphysicist` | — | Stable | Hard cutover completed 2026-03-11 |
| `meshal-web` | `meshal-web` | `meshal.ai` | Stable | — |
| `neper` | `neper` | — | Stable | — |
| `qaplibria` | `qaplibria` | — | Stable | — |
| `qmatsim` | `qmatsim` | — | Stable | — |
| `qmlab` | `qmlab` | — | Stable | — |
| `qubeml` | `qubeml` | — | Stable | — |
| `repz` | `repz` | `repzcoach.com` | Stable | Canonical domain `repzcoach.com` |
| `atelier-rounaq` | `atelier-rounaq` | — | Stable | Hard cutover completed 2026-03-11 |
| `scicomp` | `scicomp` | — | Stable | — |
| `scribd` | `scribd` | — | Stable | — |
| `shared-utils` | `shared-utils` | — | Stable | — |
| `simcore` | `simcore` | — | Stable | — |
| `spincirc` | `spincirc` | — | Stable | — |

## Retired Repository Roots

| Canonical Name | Retired Physical Repo Slug | Domain | Status | Notes |
| --- | --- | --- | --- | --- |
| `devkit` | `aw-devkit` | — | Retired | D-1 physical retirement cutover completed on 2026-03-11 |

## Support and External Roots

| Canonical Name | Physical Directory | Status | Notes |
| --- | --- | --- | --- |
| `_ops/gmail-ops` | `_ops` | Stable | External/remote tooling |
| `.github` | `.github` | Stable | Workspace-level automation surface |
| `.mypy_cache` | `.mypy_cache` | Local-only | Transient local cache; non-canonical |
| `.venv` | `.venv` | Local-only | Transient local environment; non-canonical |
| `.vscode` | `.vscode` | Local-only | Editor-local metadata; non-canonical |

## Alias Rule

For any in-progress row where canonical and physical names differ, managed docs
must render aliases in this format:

`canonical-name (repo: physical-slug)`

No alias notation is required for rows with canonical=physical slugs.
