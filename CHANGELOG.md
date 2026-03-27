---
type: canonical
source: none
sync: none
sla: none
title: Changelog
description: Version history and notable changes to the alawein organization repository
category: documentation
audience: all
status: active
author: Morphism Systems Inc.
version: 1.0.0
last_updated: 2026-03-25
tags: [changelog, version-history, releases]
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `projects.json` **infrastructure** entries: canonical `url` for GitHub (`aw-devkit`, `workspace-tools`, `pkos`, `handshake-hai`, `handshake-project-proctor`) and **`reasonbench`** row; schema allows optional `url`, `status`, `note` on infrastructure objects.
- [`scripts/audit-last-commit-messages.ps1`](scripts/audit-last-commit-messages.ps1): list top-level repos whose **latest** commit is still the bulk `chore: sync workspace changes` message (hygiene / follow-up triage).
- Ops glossary [`docs/operations/github-notion-sync-glossary.md`](docs/operations/github-notion-sync-glossary.md): `Sync [project]` vs `GitHub Sync`, canonical `projects.json` → Notion flow, per-repo scan vs Notion push, **rule #4** out-of-scope guardrail for architecture drift, naming note for Morphism Systems Inc.
- Claude Code **worked examples** (CLAUDE.md, rules, commands, skills, agents, settings): [`docs/governance/claude-code-worked-examples.md`](docs/governance/claude-code-worked-examples.md). Cursor rule [`.cursor/rules/claude-code-governance.mdc`](.cursor/rules/claude-code-governance.mdc) applies when editing `.claude/` or `CLAUDE.md` (`.gitignore` now allows `.cursor/rules/`).
- Claude Code reference: [`docs/governance/claude-code-configuration-guide.md`](docs/governance/claude-code-configuration-guide.md) and copy-paste prompts/checklists [`docs/governance/claude-code-migration-prompts.md`](docs/governance/claude-code-migration-prompts.md) (extracted from internal reference material).
- Audit doc [`docs/audits/ide-llm-agent-completion-lessons-2026-03.md`](docs/audits/ide-llm-agent-completion-lessons-2026-03.md): IDE/LLM **completion gap** (commit/push/merge), stranded working tree, branch vs `main` reality, README/projects URL lessons, checklist; [`LESSONS.md`](LESSONS.md) bullets cross-linked.
- Portfolio **`portfolio_domain`** on `projects.json` featured entries (Notion Domain select). **`notion_sync`** array for Notion-only rows (qmlab, simcore, meatheadphysicist) without expanding README. Ops guide [`docs/operations/notion-projects-database.md`](docs/operations/notion-projects-database.md).
- [`scripts/run-notion-local.ps1`](scripts/run-notion-local.ps1): local Notion validate + sync + canonical verify using the same env mapping as [`notion-sync.yml`](.github/workflows/notion-sync.yml).

### Changed

- Tracked workspace index mirror [`docs/workspace-INDEX.md`](docs/workspace-INDEX.md) (keep in sync with workspace-root `INDEX.md` when cloning the full tree): infrastructure **GitHub** links for `_devkit`, `_ops`, `_pkos`; product list includes `reasonbench/`, `_handshake-hai/`, `handshake-project-proctor/`; non-repo table cleanup.
- Author / entity metadata updated to **Morphism Systems Inc.** in repository frontmatter (`author:`) across managed governance and policy Markdown (replacing prior LLC references).
- Documentation contract: `AGENTS.md` / `CLAUDE.md` YAML frontmatter starts at line 1; [`.cursor/rules.md`](.cursor/rules.md) links repaired; root `REPO-SWEEP-PROMPT.md` moved to [`docs/governance/repo-sweep-prompt.md`](docs/governance/repo-sweep-prompt.md) with frontmatter; `docs/migration_changelog.md` and `docs/operations/*.md` now include required frontmatter.
- `scripts/sync-to-notion.mjs`: merges **featured + notion_sync**, writes **Domain** when `portfolio_domain` is set; optional **`NOTION_DOMAIN_PROPERTY`** env (see `.env.example`).
- README **Projects**: intro copy is minimal/neutral (outside sync markers); table still regenerates from `projects.json` **featured** via `sync-readme.py`. Card links use each entry’s public `url` when set.

## [2.1.0] — 2026-03-21

Governance expansion, audits, skills layer, CI hardening, slug/workspace migrations, and operator lessons since v2.0.4. **Executive paste:** [`docs/audits/release-summary-2026-03-21.md`](docs/audits/release-summary-2026-03-21.md).

### Added

- Skills unification workstream audits and operator notes under `docs/audits/` (2026-03-17) plus `docs/governance/skills-install-policy.md` and `skills-consolidation-reference-2026-03-17.md`.
- Profile sync phases A–D: consistency (`_pkos` wording in alawein + `_pkos` templates), PyYAML and sync-check docs, LinkedIn snippet (`out/linkedin-snippet.md` from `_pkos` export), Notion/CV templates (`templates/notion.yaml`, `templates/cv-master.yaml`) and docs in `_pkos` `templates/README.md` and HANDOFF-CODEX.
- Added doc audit report `docs/audits/doc-audit-2026-03-17.md` (TODO/TBD scan, missing
  READMEs under docs subdirs, link sanity; no unresolved doc TODOs, no broken
  internal links).
- Added Cursor agent handoff for profile sync and PKOS alignment:
  `docs/governance/cursor-agent-handoff-profile-sync.md` as single reference;
  AGENTS.md, CLAUDE.md, and profile-sync-from-guides.md updated to point agents
  at it.
- Added single branch-and-deployment convention:
  `docs/governance/branch-and-deployment-convention.md` (branch taxonomy
  feat/fix/hotfix/release/fast/chore/codex, workflow, Vercel deployment, stale
  branch cleanup); referenced from AGENTS.md, CLAUDE.md, SSOT.md,
  workspace-master-prompt.md, workflow.md, phase5, docs/README.md,
  CONTRIBUTING.md.
- Added full-environment audit report
  `docs/audits/full-environment-audit-2026-03-16.md` (scoped scan of GitHub
  dirs, local env, IDE/LLM config; findings by severity and domain;
  remediation backlog).
- Added `docs/audits/remediation-checklist-2026-03-16.md` (step-by-step
  actions for MCP token, AWS/GitHub/npm/Stripe rotation, Cursor auto-approve).
- Added `docs/governance/credential-hygiene.md` with rules for secrets, MCP
  env-var usage, CI secrets, and an MCP config example.
- Added audit and credential-hygiene links to `AGENTS.md`, `CLAUDE.md`, and
  `SECURITY.md`.
- Added `docs/governance/workspace-master-prompt.md` as the canonical
  workspace operating contract.
- Added canonical name/domain audit logic in
  `.github/workflows/docs-validation.yml` with explicit transitional alias
  allowlists.
- Added a repository-local documentation contract and validator script for
  freshness, frontmatter, BOM, and local-link enforcement.
- Added a clean-slate workflow guide for stash hygiene, branch recovery, and
  notebook or asset separation.
- Added a full governance doc suite covering the operating model, Git
  operations, feature lifecycle, review, merge, and release flow.
- Added a workspace resource map defining the canonical home for governance,
  shared packages, design tokens, and cross-repo guides.
- Added a repo-by-repo workspace layout audit so stack-aware standardization
  rules now have concrete adoption status and priority cleanup targets.

### Changed

- LESSONS.md: recorded branch/CI recovery patterns (stale squash-merge hazard, dual CI gates, in-repo links only, `_token` markdown).
- CI: markdownlint fixes (`_pkos` as code spans, summary table columns, ordered-list phases in profile handoff, emphasis style).
- CI/doc contract: fixed broken cross-repo markdown links in skills docs (workspace paths as code only in this repo), added frontmatter to profile-sync-from-guides, repaired full-environment-audit links, README-backup `last_updated`, CHANGELOG freshness for pushes.
- Governance: skills/agents maintenance and slash-command catalog aligned with consolidation work; workspace standardization, resource map, layout audit, rename matrix, and master prompt refreshed.
- Removed obsolete local git branches and linked worktrees (`fix/alawein-stash-reconciliation`, `codex/recovery-*`) that predated current `main`; recovery copies under `_recovery/` were pruned via `git worktree remove`.
- Parent `github.com/alawein` converted from git repo to clone root: removed parent `.git` so only leaf repos (e.g. `alawein/alawein`) are versioned; documented in `docs/archive/parent-alawein-repo-removal-2026-03-18.md`.
- Updated README for clearer structure and governance wording (Projects,
  Packages, Governance, Stack, Stats; refined footer and badges).
- Multi-repo hygiene: committed and pushed alawein, edfp, meshal-web,
  attributa, `_devkit`, qmatsim; aligned `_devkit` main with origin via
  force-push after unrelated-history merge abort; Vercel production deploys
  for edfp, meshal-web, attributa, _devkit (repz deploy remains failing with
  Vercel “Unexpected error”).
- Updated `AGENTS.md`, `SSOT.md`, `CLAUDE.md`, and `docs/README-backup-20250807.md` to anchor
  governance on the workspace master prompt and phased naming migration.
- Updated workspace migration docs (`workspace-standardization`,
  `workspace-rename-matrix`, `workspace-layout-audit`,
  `workspace-resource-map`) to canonical-name-first reporting.
- Updated `projects.json`, `scripts/sync-readme.py`, and
  `scripts/sync-to-notion.mjs` for canonical slugs plus transitional
  `legacy_slugs`.
- Executed hard cutover for repository slugs:
  `gainboy→gymboy`, `MeatheadPhysicist→meatheadphysicist`,
  `rounaq-atelier→atelier-rounaq`, and `event-discovery-framework→edfp`,
  including org workflows, governance docs, and data-contract checks.
- Updated docs validation and workspace-audit workflows for post-cutover
  canonical slugs with explicit one-cycle `legacy_slugs` retention checks.
- Updated D-1 governance status to reflect canonical token ownership at
  `devkit/tokens/` and archival-only staging for `aw-devkit` before physical
  retirement cutover.
- Completed D-1 physical retirement cutover on 2026-03-11 by removing the
  `aw-devkit` workspace root and updating migration/governance matrices to
  retired status.
- Replaced README governance abstraction content with workspace governance rules
  and validation commands.
- Updated the shared package migration guidance to reflect the active consumer pattern: in-workspace repositories now resolve `@alawein/*` packages through local `devkit` `file:` references, with refreshed installs across the first consumer batch.
- Replaced the placeholder Node build assumptions with docs-only CI and a
  slower documentation audit workflow.
- Updated canonical governance docs to document explicit GitHub-file exemptions
  and local validation commands.
- Refactored overview docs into a hub-and-spoke navigation model so task
  routing lives in `docs/README-backup-20250807.md`, `workflow.md`, and the new specialized
  governance guides.
- Refreshed the workspace rename matrix to reflect the observed root inventory,
  documented `aw-devkit/` retirement into `devkit/`, and clarified the split
  between `alawein/`, `devkit/`, and `docs/`.
- Updated `SECURITY.md` to link to credential hygiene and full-environment
  audit for exposed-credential response.
- Updated `docs/README.md` with an Audits section (full-environment audit,
  remediation checklist, codebase audit, credential hygiene).
- Updated `CLAUDE.md` repository structure to include `docs/audits/` and
  `docs/governance/credential-hygiene.md`.

## [2.0.4] — 2026-03-07

### Changed
- Started the `@alawein/*` producer-side namespace migration in `devkit/` and updated shared workspace registries to use the lowercase `qaplibria` repo slug.
- Reconfirmed that the live `QAPlibria` root rename is still blocked by a Windows filesystem handle, so the physical rename remains deferred.

## [2.0.3] — 2026-03-06

### Added
- Added a shared package namespace matrix to track `@malawein` consumers and migration dependencies across the workspace.

### Changed
- Updated the workspace migration contract with confirmed repository slug audit results and the current blocker on the live `qaplibria` root rename.

## [2.0.2] — 2026-03-06

### Added
- Added a canonical workspace standardization guide covering root naming, stack-based layouts, shared package migration, and implementation phases.

### Changed
- Started workspace cleanup by renaming safe non-repository support directories with a leading underscore and documenting the deferred cases.

## [2.0.1] — 2026-03-06

### Added
- Added a dedicated changelog entry guide for drafting Keep a Changelog releases from recent commits.

### Changed
- Promoted changelog authoring to a first-class governance workflow alongside the existing contribution and release guidance.

## [2.0.0] — 2026-03-06

### Added
- Workspace standardization (P1-P20) across all 21 repos (#58)
- HackerRank.ipynb problem-solving notebook
- RevisionNotebook.ipynb for revision and prep
- Canonical governance files with YAML frontmatter (SSOT.md, cross-links)
- npm packages, governance model, and research repos

### Changed
- Rewrote GitHub profile README: AI Research Engineer focus with real projects and tech stack
- Updated profile README and cleaned submodule refs
