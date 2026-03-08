---
title: Repository Workflow
description: Branch model, commit patterns, and deployment flow for the alawein organization
last_updated: 2026-03-08
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [governance, workflow, branching, deployment, git]
---

# Morphism Systems (alawein) Repository Workflow (Solo, High-Velocity)

> **Brand note:** The `alawein` GitHub organization is operated by Morphism Systems LLC. Canonical ecosystem docs live in the Morphism Framework monorepo:
> - `morphism-framework/`
> - `morphism-framework/docs/MORPHISM_VISION.md`

## Branch Model

- `main`: protected, release-ready; only PR merges or documented emergency force merges.
- `fast/*`: spike/prototype branches; <24h lifespan; squash merge to `main` or delete.
- `feat/*` and `fix/*`: scoped work; small batches; squash or merge-commit allowed; rebase
  discouraged.
- `hotfix/*`: urgent production fixes; branch from `main`, fast-track tests, merge-commit allowed.
- `release/*`: optional pre-tag stabilization when needed.

### Naming Rules

- `fast/{ticket-or-topic}` (e.g., `fast/llm-prompt-spike`)
- `feat/{scope}` (e.g., `feat/auth-oauth`)
- `fix/{scope}` (e.g., `fix/cors-headers`)
- `hotfix/{issue}` (e.g., `hotfix/console-error`)
- Use kebab-case, max 4 path segments, <= 40 chars.

### Commit Patterns

- Use conventional commits: `type(scope): subject` (e.g., `feat(docs): add workflow guardrails`).
- Prefer small, frequent commits; keep unrelated changes out of the same commit.
- Squash on merge for `fast/*` and most `feat/*` to keep `main` clean.
- Merge commits allowed for `hotfix/*` or multi-commit work needing history.

### Merge Strategy

- Default: squash merge to `main`.
- Allow merge-commit when chronology matters (hotfix/release).
- Force merge policy: allowed only when CI is red for non-code reasons (infra flake) AND risk is
  documented in PR checklist.

### Branch Lifecycle (ASCII Diagram)

```
           start work
               |
           (branch)
               v
fast/*  ---> short spike ----> squash to main
               |
feat/* -> small batches ------> squash/merge to main
               |
hotfix/* ---------------------> merge-commit to main
               |
release/* (optional) ---------> tag -> main
```

## Deployment Flow (solo-friendly)

- Default: commit/PR -> CI -> merge to `main` -> optional tag -> deploy script (future).
- Tags: `v{major}.{minor}.{patch}` when a stable milestone is ready.

## PR Checklist (for self-review)

- Scope <= 300 lines diff.
- CI green or flake noted.
- Docs updated if behavior changes.
- Tests added/adjusted.

## Force-Merge Checklist

1. CI failure is a known flake or external outage.
2. Diff reviewed locally and the docs-only checks run locally:
   `./scripts/validate-doc-contract.sh --full` and markdown lint for managed
   docs.
3. PR description documents why force merge is necessary and risks.

## Minimal Release Policy

- Create lightweight changelog entry in PR description.
- Draft release notes using `docs/governance/changelog-entry.md` before updating `CHANGELOG.md`.
- Tag after merge when user-facing behavior changes.

## Tooling Alignment (from ecosystem guides)

- Respect workspace-level `AGENTS.md` when operating from the full workspace.
- Treat any workspace `AI_DEVELOPMENT_SETTINGS_GUIDE` as supplemental only if it
  actually exists at the workspace root.
- Preserve secrets: never commit .env or keys.
- This repo does not own an application runtime. Do not introduce Node build or
  artifact assumptions unless the repo actually gains a package surface.
- Use `docs/governance/workspace-standardization.md` as the active migration contract for workspace
  naming, package namespace changes, and stack-aware directory normalization.

## Branch Protection & CI (recommended)

- Protect `main`: require PRs, status checks, and up-to-date branches; allow squash + merge-commit
  (for hotfix/release), disable rebase.
- CODEOWNERS applies to all files; require review if desired.
- `.github/workflows/ci.yml` is the fast gate: local contract validation plus
  markdown lint for managed docs.
- `.github/workflows/docs-validation.yml` is the slower documentation audit:
  full contract validation, legacy-domain enforcement, and external link checks
  for governance docs.

## Security & MCP

- Do not commit `.env` or any `*_KEY`, `*_TOKEN`, `*_SECRET` values; rotate exposed keys noted in
  the MCP implementation analysis.
- Do not overwrite custom MCP server configs used by morphism-framework; consult AGENTS.md before
  adding servers.

## Stale Branch Cleanup Policy

- **Inactive threshold**: 30 days without commits (excludes tagged releases)
- **Process**: Monthly manual review or automated workflow (future)
- **Actions**:
  1. Identify branches with no commits in 30+ days via `git for-each-ref --sort=-committerdate`
  2. Verify branch has no open PRs
  3. Archive locally if needed: `git checkout <branch> && git branch -m archive/<branch>`
  4. Delete remote: `git push origin --delete <branch>`
- **Exceptions**: Tagged releases, `main`, documented long-running initiatives

## Bot-Generated Branch Exception

- **Scope**: Auto-generated branches from Dependabot, GitHub Actions, or other automation
- **Naming**: Allowed to deviate from human branch patterns (e.g., `dependabot/npm_and_yarn/...`)
- **Lifecycle**: Deleted automatically after PR merge via GitHub settings
- **Review**: Bot PRs still require CI green; manual approval if security-sensitive

## Migration Plan from Current State

1. Prune stale branches: delete branches with no commits in 30+ days unless tagged.
2. Rebase/squash open spikes into `fast/*` and merge or close.
3. Enable branch protection on `main` (require PR + at least basic CI checks).
4. Adopt naming rules for new branches; document in README.
5. Keep the docs-only CI contract truthful as workflows evolve.

## Governance Artifacts in This Repo

- [`docs/governance/documentation-contract.md`](documentation-contract.md) is
  the local source of truth for doc classes, exemptions, and freshness rules.
- [`../../scripts/validate-doc-contract.sh`](../../scripts/validate-doc-contract.sh)
  is the local validation entrypoint.

## Workspace Migration

- Safe support-directory renames can be applied at the workspace root when they do not conflict with
  tool-discovered semantics.
- `.github/` is exempt from underscore-prefix renaming until automation/path consumers are fully
  audited.
- Repository-root renames and shared package namespace changes must follow the staged plan in
  `docs/governance/workspace-standardization.md`.
- Optional: `docs/governance/workflow.md` (this file) as the living source.

## Future Enhancements

- Add release workflow to auto-tag and draft release notes.
- Add anchor-level markdown link validation if local link volume grows.
- Add dependency audit workflow only if this repo gains an actual package
  surface.
