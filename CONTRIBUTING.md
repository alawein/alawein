---
title: Contributing Guide
description: Contribution guidelines and development workflow for the alawein organization
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
last_updated: 2026-03-08
tags: [governance, contributing, workflow, development]
---

# Contributing Guide

This repo is a docs-only organization and governance repository. Use this guide
for contributor guardrails, then follow the task-specific governance docs for
the actual operating details.

## References

- Canonical SSOT (Morphism Bible): `morphism-framework/docs/morphism-bible`
- Local workspace standards (when working from the full Morphism workspace): `../AGENTS.md`
- Workflow source: [`docs/governance/workflow.md`](docs/governance/workflow.md)
- Operating model: [`docs/governance/operating-model.md`](docs/governance/operating-model.md)
- Local documentation contract: [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Clean-slate guide: [`docs/governance/clean-slate-workflow.md`](docs/governance/clean-slate-workflow.md)

## Branching

- `main`: protected; use PRs instead of direct pushes
- `fast/*`: spikes or prototypes
- `feat/*`, `fix/*`: scoped reviewable work
- `hotfix/*`: urgent fixes
- `release/*`: optional release stabilization
- Naming: kebab-case, <= 40 chars, max 4 segments

Detailed branch, sync, push, stash, and recovery guidance lives in
[`docs/governance/git-operations.md`](docs/governance/git-operations.md).

## Commits

- Use conventional commits: `type(scope): subject` (e.g., `feat(api): add pagination`)
- Small, frequent commits; keep unrelated changes out of the same commit
- No secrets, tokens, or .env files ever

## Task-Specific Guides

- choose the right branch and lifecycle:
  [`docs/governance/feature-lifecycle.md`](docs/governance/feature-lifecycle.md)
- review your branch:
  [`docs/governance/review-playbook.md`](docs/governance/review-playbook.md)
- decide how to merge:
  [`docs/governance/merge-policy.md`](docs/governance/merge-policy.md)
- draft releases and changelog updates:
  [`docs/governance/release-playbook.md`](docs/governance/release-playbook.md)

## Working Tree Hygiene

- Keep the active branch focused.
- Do not mix unrelated notebooks, assets, or template churn into governance
  changes.
- Use path-scoped stashes for intentional but not-yet-ready work.
- Follow [`docs/governance/git-operations.md`](docs/governance/git-operations.md)
  and [`docs/governance/clean-slate-workflow.md`](docs/governance/clean-slate-workflow.md)
  when you need a clean slate without losing work.

## PR Expectations

- keep the scope reviewable
- note the validation you ran
- update docs when behavior or workflow changes
- document risk when the branch is not low-risk

Use [`docs/governance/review-playbook.md`](docs/governance/review-playbook.md)
for the full author and reviewer checklist.

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

- Keep `README.md`, `docs/README.md`, and the relevant guide under
  `docs/governance/` in sync with workflow changes
- Mirror any future wiki content into `/docs` to avoid drift

## Releases

- Use `v{major}.{minor}.{patch}` when the repo hits a meaningful milestone
- Maintain `CHANGELOG.md` using Keep a Changelog format
- Follow [`docs/governance/release-playbook.md`](docs/governance/release-playbook.md)
  for tag and changelog decisions

## Security & Safety

- Never commit credentials or private data; prefer environment variables and local .env (ignored)
- Avoid dangerous patterns (`eval`, unsafe HTML); sanitize user input when applicable
