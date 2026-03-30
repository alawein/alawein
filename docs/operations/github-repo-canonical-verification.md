---
type: canonical
source: none
sync: none
sla: none
title: GitHub canonical verification
description: gh repo view notes for canonical repo names, redirects, and PKOS alignment.
last_updated: 2026-03-30
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ./project-lifecycle-tiers.md
  - ../governance/repository-layout-standard.md
  - ../governance/desktop-repo-inventory.md
---

# GitHub canonical verification (2026-03-24)

Recorded with `gh repo view` from a machine with GitHub CLI auth. Use this when reconciling Notion “Projects (Canonical)” and PKOS `repo` fields.

See also: [project lifecycle tiers](project-lifecycle-tiers.md) for how `projects.json` `category` maps to posture.

## Local folder names vs GitHub slugs

Underscore-prefixed workspace folders are **local conventions**; they often map to different GitHub repository names. Always verify with `git remote -v`.

Stack-specific **directory layout** (Vite vs Next vs Python) is defined in [repository layout standard](../governance/repository-layout-standard.md). A machine-readable inventory of desktop clones lives in [desktop-repo-inventory.json](../governance/desktop-repo-inventory.json).

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

Note: `_devkit/` may use remote `alawein/aw-devkit` or `alawein/devkit` depending on clone age — confirm with `git remote -v`.
