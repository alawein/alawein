---
title: Repository Workflow
description: Branch model, commit patterns, and deployment flow for the alawein organization
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
last_updated: 2026-03-08
tags: [governance, workflow, branching, deployment, git]
---

# Repository Workflow

This is the stable high-level overview of how work moves through `alawein`.
Use the linked specialist guides when you need detailed branch, review, merge,
release, or clean-slate handling.

## Branch Model

- `main`: protected, PR-first, and release-ready
- `fast/*`: short-lived spikes or discovery branches
- `feat/*`: additive scoped work
- `fix/*`: scoped fixes
- `hotfix/*`: urgent changes that need fast handling
- `release/*`: optional stabilization before tagging

### Naming

- use kebab-case
- branch from `main`
- keep the branch name short and intent-revealing
- stay within the documented taxonomy above

## Merge Model

- default strategy: squash merge
- merge commits: allowed for `hotfix/*` and `release/*` when chronology matters
- direct pushes to `main`: not part of the normal workflow
- force merge: exception-only, with documented risk and local validation evidence

## Validation and CI

- local enforcement entrypoint:
  [`../../scripts/validate-doc-contract.sh`](../../scripts/validate-doc-contract.sh)
- fast CI:
  [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- slower documentation audit:
  [`.github/workflows/docs-validation.yml`](../../.github/workflows/docs-validation.yml)

The enforced baseline in this repo is documentation-focused:

- documentation contract validation
- markdown lint for managed docs
- link audit in the slower governance workflow

There is no application build, package-install, or artifact pipeline in this
repo.

## Release Summary

- tags are optional and milestone-driven
- changelog and release guidance live in
  [`release-playbook.md`](release-playbook.md)
- draft changelog entries using [`changelog-entry.md`](changelog-entry.md)

## Clean-Slate Rule

If unrelated edits remain after a focused change, separate them instead of
mixing them into the current branch. Prefer a dedicated branch or a path-scoped
stash.

## See Also

- [operating-model.md](operating-model.md)
- [git-operations.md](git-operations.md)
- [feature-lifecycle.md](feature-lifecycle.md)
- [review-playbook.md](review-playbook.md)
- [merge-policy.md](merge-policy.md)
- [release-playbook.md](release-playbook.md)
- [clean-slate-workflow.md](clean-slate-workflow.md)
- [documentation-contract.md](documentation-contract.md)
- [workspace-standardization.md](workspace-standardization.md)
