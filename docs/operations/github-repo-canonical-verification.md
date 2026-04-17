---
type: canonical
source: none
sync: none
sla: none
title: GitHub canonical verification
description: gh repo view notes for canonical repo names, redirects, and current workspace-core repo alignment.
last_updated: 2026-04-15
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ./project-lifecycle-tiers.md
  - ../governance/repository-layout-standard.md
  - ../governance/desktop-repo-inventory.md
---

# GitHub canonical verification (2026-03-24)

Recorded with `gh repo view` from a machine with GitHub CLI auth. Use this
when reconciling canonical repo records, local clone names, and current GitHub
remotes.

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
| `alawein/gainboy` | Historical alias; resolves to **`alawein/gymboy`** (GitHub redirect) |

## Atelier Rounaq

| Remote | Status |
|--------|--------|
| `alawein/atelier-rounaq` | Canonical |
| `alawein/rounaq-atelier` | Historical alias; resolves to **`alawein/atelier-rounaq`** (redirect) |

## EDFP vs legacy Aiclarity

| Remote | Status |
|--------|--------|
| `alawein/edfp` | Exists, not archived — **canonical** for Event Discovery Framework (`edfp.online`) |
| `meshal-alawein/event-discovery-framework` | Still exists, not archived — historical legacy slug; prefer `alawein/edfp` unless you explicitly maintain the user-org fork |

## Workspace folder → GitHub remote (tooling)

Current local directory names should match the live GitHub slugs for the core
infrastructure repos:

| Folder | `origin` |
|--------|----------|
| `design-system/` | `https://github.com/alawein/design-system.git` |
| `workspace-tools/` | `https://github.com/alawein/workspace-tools.git` |
| `knowledge-base/` | `https://github.com/alawein/knowledge-base.git` |

Retired local alias naming from the pre-consolidation workspace is historical
migration context only. If you encounter those names in older notes, verify the
current clone with `git remote -v` before acting on them.
