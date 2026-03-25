---
title: GitHub canonical verification
description: gh repo view notes for canonical repo names, redirects, and PKOS alignment.
last_updated: 2026-03-26
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ./project-lifecycle-tiers.md
---

# GitHub canonical verification (2026-03-24)

Recorded with `gh repo view` from a machine with GitHub CLI auth. Use this when reconciling Notion “Projects (Canonical)” and PKOS `repo` fields.

See also: [project lifecycle tiers](project-lifecycle-tiers.md) for how `projects.json` `category` maps to posture.

## Morphism (two live repos)

| Remote | Status |
|--------|--------|
| `morphism-org/morphism` | Exists, not archived — **PKOS canonical** |
| `morphism-systems/morphism` | Exists, not archived — companion / product line; do not treat as typo |

## Gymboy (rename)

| Remote | Status |
|--------|--------|
| `alawein/gymboy` | Canonical |
| `alawein/gainboy` | Resolves to **`alawein/gymboy`** (GitHub redirect) |

## Atelier Rounaq

| Remote | Status |
|--------|--------|
| `alawein/atelier-rounaq` | Canonical |
| `alawein/rounaq-atelier` | Resolves to **`alawein/atelier-rounaq`** (redirect) |

## EDFP vs legacy Aiclarity

| Remote | Status |
|--------|--------|
| `alawein/edfp` | Exists, not archived — **canonical** for Event Discovery Framework (`edfp.online`) |
| `meshal-alawein/event-discovery-framework` | Still exists, not archived — **legacy**; prefer `alawein/edfp` unless you explicitly maintain the user-org fork |

## Workspace folder → GitHub remote (tooling)

Local directory names with `_` do not match GitHub slugs:

| Folder | `origin` |
|--------|----------|
| `_devkit/` | `https://github.com/alawein/aw-devkit.git` |
| `_ops/` | `https://github.com/alawein/workspace-tools.git` |
| `_pkos/` | `https://github.com/alawein/pkos.git` |
