---
type: canonical
source: none
sync: none
sla: none
title: Repo Framework
description: Universal policy for how repositories are organized, named, owned, versioned, and retired across all active orgs in the constellation (plus one legacy holder org)
category: governance
audience: [ai-agents, contributors]
status: active
last_updated: 2026-05-15
tags: [repos, governance, naming, ownership, archive, buckets, orgs]
---

# Repo Framework

Status: canonical
Owner: alawein
Applies to: alawein, menax-inc, blackmalejournal, kohyr

## Purpose

Single source of truth for how repositories are organized, named, owned, versioned, and retired across all active orgs in the constellation. Supersedes `REPO_GOVERNANCE_INITIATIVE.md`.

## Ownership map (fixed)

| Org | Owner | Status | Role |
|---|---|---|---|
| `alawein` | Meshal (sole) | active | Personal namespace; personal, sole-owned businesses, family, research, tools, ventures, jobs |
| `menax-inc` | Meshal + co-founder | active | Joint business |
| `blackmalejournal` | Friend (Meshal operates) | active | Friend-owned; Meshal maintains |
| `kohyr` | Meshal (sole) | active | Active startup; main current work |
| legacy holder org | Meshal | legacy (archived) | Sunset; superseded by `kohyr`. Identifier recorded in archive metadata; not in active use. |

Ownership determines the home org. Inside an org, content category determines the bucket.

## Bucket decision tree (inside `alawein/`)

    Paying or monetizing, shipped to customers?          -> products/
    Early-stage idea, MVP, hypothesis?                   -> ventures/
    Research (papers, simulations, experiments)?         -> research/
    Infrastructure or small utility?                     -> tools/
    Portfolio or personal creative?                      -> personal/
    Maintained for family, unpaid?                       -> family/
    Interview or job-search?                             -> jobs-projects/
    Inactive but worth preserving?                       -> _archive/  (write Category: archive)

## Per-repo README metadata header (mandatory)

Every repo across all active orgs places a plain-markdown metadata block at the top of `README.md`, immediately after the `# <repo-name>` title. This metadata block is plain markdown, not YAML frontmatter; workspace policy forbids YAML frontmatter on public READMEs.

    Status:      active | paused | experimental | deprecated | archived | frozen
    Category:    products | personal | family | research | tools | ventures | jobs-projects | archive
    Owner:       alawein | menax-inc | blackmalejournal | kohyr
    Visibility:  public | private
    Purpose:     <one or two sentences explaining why this repo exists>
    Next action: <continue | refactor | merge | archive | delete>

Enforced by `scripts/doctrine/validate-repo-framework.py`, run in the doctrine CI step.

## Visibility defaults

| Category | Default | Rationale |
|---|---|---|
| products | private | Stripe keys, customer data risk |
| ventures | private | Until ready to ship |
| family | private | Not yours to publicize |
| jobs-projects | private | NDA risk |
| personal | public if portfolio-worthy, else private | Identity surface |
| research | open if publishable, else private | Academic norms |
| tools | public if sanitized, else private | Watch for workspace paths and credentials |
| archive | match original (manual; not validator-enforced) | Do not flip visibility at archive time |

## Cross-org promotion rule

A repo stays inside `alawein/` unless ONE of the following becomes true:

- Jointly owned with another person (move to a joint org; pattern: `menax-inc`).
- Serious startup with legal entity or funding (move to a dedicated org; pattern: `kohyr`).
- Ownership transferred to a friend or client (move to their org; pattern: `blackmalejournal`).
- Sold or formally handed off (move to acquirer's org).

Sole-owned commercial products (the fitness cluster: bolts, gymboy, repz, scribd) stay inside `alawein/products/` and do not need a separate org until one of the conditions above is triggered.

## Archive criteria

A repo archives when ANY are true:

- No commits in 180 days AND no roadmap item.
- Replaced by a successor (record successor in `projects.json`).
- Hypothesis disproved (ventures, research).
- Explicitly marked done by the owner.

Archive procedure (idempotent):

1. GitHub: `gh repo archive <org>/<repo>` (read-only).
2. Local: move to `alawein/_archive/<YYYY-MM>-<repo>/`.
3. `projects.json`: set `status: archived`, `archivedDate`, optional `successor`.
4. README header: `Status: archived`, `Next action: delete`.

## Naming convention

- `lowercase-kebab-case` for repo names.
- Forbidden names: `test`, `demo`, `new-*`, `*-final`, generic categories (`app`, `tool`, `website`, `backend`, `frontend`).
- Local directory name matches GitHub remote name.
- Renames preserve `legacy_slugs[]` in `projects.json` and rely on GitHub 301 redirects.

## Change log

| Date | Change |
|---|---|
| 2026-05-14 | Initial version. Supersedes `REPO_GOVERNANCE_INITIATIVE.md`. Spec source: `docs/superpowers/specs/2026-05-14-alawein-reorg-design.md`. |
| 2026-05-15 | Quality-pass fixes: rename file to lowercase, clarify `_archive` vs `archive`, tighten archive Next action to `delete`. |
| 2026-05-15 | Clarifier: visibility `match original` for `archive` is manual (not validator-enforced). |
