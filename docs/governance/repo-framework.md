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
last_updated: 2026-08-28
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

    Control plane, shared infra, design system, workspace tooling?  -> core/
    Shipped or monetizing product, or family-maintained app?          -> apps/
    Research, simulation, experiment, or early-stage bet?             -> lab/
    Public portfolio or identity site?                                -> sites/
    Interview, contract, or employer-adjacent work?                   -> work/
    Inactive but worth preserving?                                    -> _archive/  (Category: archive)

Six active buckets replace the prior eight (`products`, `personal`, `family`, `research`, `tools`, `ventures`, `jobs-projects`). Canonical map: `catalog/buckets.yaml`.

## Per-repo README metadata header (mandatory)

Every repo across all active orgs places a plain-markdown metadata block at the top of `README.md`, immediately after the `# <repo-name>` title. This metadata block is plain markdown, not YAML frontmatter; workspace policy forbids YAML frontmatter on public READMEs.

    Status:      active | paused | experimental | deprecated | archived | frozen
    Category:    core | apps | lab | sites | work | archive
    Owner:       alawein | menax-inc | blackmalejournal | kohyr
    Visibility:  public | private
    Purpose:     <one or two sentences explaining why this repo exists>
    Next action: <continue | refactor | merge | archive | delete>

Enforced by `scripts/doctrine/validate-repo-framework.py`, run in the doctrine CI step.

## Per-repo anti-rot artifacts (mandatory for code archetypes)

Every code-archetype repo (`core`, `apps`, `lab`) carries:

- `docs/DEBT.md`: the technical-debt ledger (see `docs/governance/anti-rot.md`).
- `docs/adr/`: Architecture Decision Records, one decision per file.

Repos in the `archive`, `sites`, and `work` buckets are exempt;
exemption is by bucket, not by content. Enforced by
`scripts/doctrine/validate-repo-framework.py` in the doctrine CI step.

## Visibility defaults

Every repo is private unless it holds a current public scan. The gate lives in
`docs/internal/specs/2026-08-27-public-readiness-gate-design.md` and is
enforced by `scripts/github/validate-visibility.py` (catalog vs live GitHub)
and `scripts/catalog/validate-catalog.py` (offline rules).

| Bucket | Default | Public when |
|---|---|---|
| core | private | `promotion.tier` P0 or P1 with a scan under 90 days; no workspace paths or credentials in tree |
| apps | private | same, plus payment and auth paths real or explicitly disabled |
| lab | private | same; grace per the gate's grace rule (cited research, current pins during the redo wave) |
| sites | private until scanned; expected to end public | same |
| work | private | never, unless the client or employer approves in writing |
| archive | match original | do not flip visibility at archive time |

The hub profile repo (`alawein`) cannot be private; it holds a P2 record
under grace until its own blockers clear.

Profile pins draw only from tier P0. Flips and pin edits are manual, one
approved table at a time; no script changes visibility.

## Cross-org promotion rule

A repo stays inside `alawein/` unless ONE of the following becomes true:

- Jointly owned with another person (move to a joint org; pattern: `menax-inc`).
- Serious startup with legal entity or funding (move to a dedicated org; pattern: `kohyr`).
- Ownership transferred to a friend or client (move to their org; pattern: `blackmalejournal`).
- Sold or formally handed off (move to acquirer's org).

Sole-owned commercial products (the fitness cluster: bolts, gymboy, repz, scribd) stay inside `alawein/apps/` and do not need a separate org until one of the conditions above is triggered.

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
