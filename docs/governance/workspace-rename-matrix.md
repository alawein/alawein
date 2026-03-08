---
title: Workspace Root Rename Matrix
description: Current inventory of top-level workspace directories, their classification, and rename status for the alawein workspace migration
last_updated: 2026-03-06
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [workspace, migration, naming, inventory]
---

# Workspace Root Rename Matrix

This matrix tracks the current top-level workspace directories, their role, and their rename status.

| Current name | Classification | Target name | Status | Notes |
| --- | --- | --- | --- | --- |
| `.github/` | Support directory | `.github/` | Deferred | Exempt until automation and instruction-path consumers are audited. |
| `_0/` | Support directory | `_0/` | Implemented | Renamed from `0/` in the first cleanup pass. |
| `_mypy_cache/` | Support directory | `_mypy_cache/` | Implemented | Renamed from `.mypy_cache/` in the first cleanup pass. |
| `alawein/` | Repository | `alawein/` | No change | Already lowercase and stable. |
| `attributa/` | Repository | `attributa/` | No change | Already lowercase and stable. |
| `bolts/` | Repository | `bolts/` | No change | Already lowercase and stable. |
| `devkit/` | Repository | `devkit/` | No change | Canonical shared-package source. |
| `docs/` | Repository | `docs/` | No change | Already lowercase and stable. |
| `event-discovery-framework/` | Repository | `event-discovery-framework/` | No change | Already kebab-case. |
| `gainboy/` | Repository | `gainboy/` | No change | Already lowercase and stable. |
| `helios/` | Repository | `helios/` | No change | Already lowercase and stable. |
| `llmworks/` | Repository | `llmworks/` | No change | Already lowercase and stable. |
| `maglogic/` | Repository | `maglogic/` | No change | Already lowercase and stable. |
| `MeatheadPhysicist/` | Repository | `meatheadphysicist/` | Deferred | Remote still resolves as `MeatheadPhysicist`; finalize slug policy before renaming locally. |
| `meshal-web/` | Repository | `meshal-web/` | No change | Already kebab-case. |
| `QAPlibria/` | Repository | `qaplibria/` | Blocked | Remote slug is already `qaplibria`, but repeated local rename attempts are still blocked by an active workspace handle on Windows. |
| `qmatsim/` | Repository | `qmatsim/` | No change | Already lowercase and stable. |
| `qmlab/` | Repository | `qmlab/` | No change | Already lowercase and stable. |
| `qubeml/` | Repository | `qubeml/` | No change | Already lowercase and stable. |
| `repz/` | Repository | `repz/` | No change | Already lowercase and stable. |
| `rounaq-atelier/` | Repository | `rounaq-atelier/` | No change | Already kebab-case. |
| `scicomp/` | Repository | `scicomp/` | No change | Already lowercase and stable. |
| `scribd/` | Repository | `scribd/` | No change | Already lowercase and stable. |
| `shared-utils/` | Repository | `shared-utils/` | No change | Already kebab-case. |
| `simcore/` | Repository | `simcore/` | No change | Already lowercase and stable. |
| `spincirc/` | Repository | `spincirc/` | No change | Already lowercase and stable. |
