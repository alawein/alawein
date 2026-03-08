---
title: Contributing Guide
description: Contribution guidelines and development workflow for the alawein organization
last_updated: 2026-03-08
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [governance, contributing, workflow, development]
---

# Contributing Guide (Solo High-Velocity)

This repo is currently a lightweight scaffold. Follow these guardrails to keep `main` clean and
moving fast.

## References

- Canonical SSOT (Morphism Bible): `morphism-framework/docs/morphism-bible`
- Local workspace standards (when working from the full Morphism workspace): `../AGENTS.md`
- Workflow source: [`docs/governance/workflow.md`](docs/governance/workflow.md)
- Local documentation contract: [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Clean-slate guide: [`docs/governance/clean-slate-workflow.md`](docs/governance/clean-slate-workflow.md)

## Branching

- `main`: protected; only PR merges or documented emergency force merges
- `fast/*`: spikes/prototypes (<24h); squash to `main` or delete
- `feat/*`, `fix/*`: scoped work; squash preferred, merge-commit allowed when chronology matters
- `hotfix/*`: urgent fixes; merge-commit allowed
- `release/*`: optional pre-tag stabilization
- Naming: kebab-case, <= 40 chars, max 4 segments (e.g., `feat/auth-oauth`)

## Commits

- Use conventional commits: `type(scope): subject` (e.g., `feat(api): add pagination`)
- Small, frequent commits; keep unrelated changes out of the same commit
- No secrets, tokens, or .env files ever

## Working Tree Hygiene

- Keep the active commit focused; do not mix unrelated notebooks, assets, or
  template churn into governance changes.
- Use path-scoped stashes for intentional but not-yet-ready work.
- Move intentional notebook and asset edits to a dedicated branch when they do
  not belong to the current change.
- Follow [`docs/governance/clean-slate-workflow.md`](docs/governance/clean-slate-workflow.md)
  when you need a clean slate without losing work.

## PRs (self-review checklist)

- Scope <= ~300 lines diff
- Branch naming follows the model above
- CI green or flake noted; if force merge is needed, document why and the risk
- Docs updated when behavior or workflows change
- Tests added/adjusted when code exists

## CI & Quality

- Fast gate: `.github/workflows/ci.yml` validates the local documentation
  contract and lints managed markdown.
- Audit workflow: `.github/workflows/docs-validation.yml` runs the full contract
  check, markdown lint, legacy-domain enforcement, and external link checks for
  governance docs.
- For this repo, "relevant checks" means documentation checks only. There is no
  application build, package install, or artifact pipeline to run locally.
- Run these before opening a PR:
  - `./scripts/validate-doc-contract.sh --full`
  - `npx --yes markdownlint-cli@0.39.0 --config .markdownlint.jsonc AGENTS.md CLAUDE.md CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md CHANGELOG.md SSOT.md LESSONS.md DOCUMENTATION_PHILOSOPHY.md docs/README.md docs/governance/*.md`

## Documentation

- Keep `README.md`, `docs/governance/workflow.md`, and
  `docs/governance/documentation-contract.md` in sync with workflow changes
- Mirror any future wiki content into `/docs` to avoid drift

## Releases

- Tag milestones as `v{major}.{minor}.{patch}` when code ships
- Maintain CHANGELOG.md using Keep a Changelog format

## Security & Safety

- Never commit credentials or private data; prefer environment variables and local .env (ignored)
- Avoid dangerous patterns (`eval`, unsafe HTML); sanitize user input when applicable
