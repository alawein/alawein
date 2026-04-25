---
type: canonical
source: none
sync: none
sla: none
title: Repository Workflow
description: Branch model, commit patterns, deployment flow, and autonomous batch rules for the alawein organization
category: governance
audience: contributors
status: active
author: Kohyr Inc.
version: 1.1.0
last_updated: 2026-03-28
tags: [governance, workflow, branching, deployment, git]
---

# Repository Workflow

This is the stable high-level overview of how work moves through `alawein`.
Use the linked specialist guides when you need detailed branch, review, merge,
release, clean-slate, or batch-execution handling.

## Branch Model

- `main`: protected, PR-first, and release-ready
- `fast/*`: short-lived spikes or discovery branches
- `feat/*`: additive scoped work
- `fix/*`: scoped fixes
- `hotfix/*`: urgent changes that need fast handling
- `release/*`: optional stabilization before tagging
- `codex/<batch-id>/<initiative-slug>`: autonomous batch branch pattern, one
  branch per repo and one PR per repo

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

## Autonomous Batch Flow

For multi-repo work, use the manifest-driven batch model described in
[parallel-batch-execution.md](parallel-batch-execution.md).

- define scope once in `docs/batches/<batch-id>/manifest.yaml`
- execute through `workspace-batch`
- allow healthy runs to stay silent between kickoff and final report
- stop only for structured exceptions with recorded evidence
- keep PRs repo-scoped even when the work is coordinated across the workspace

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

- [branch-and-deployment-convention.md](branch-and-deployment-convention.md) — single reference for branch naming, workflow, and Vercel
- [parallel-batch-execution.md](parallel-batch-execution.md)
- [operating-model.md](operating-model.md)
- [git-operations.md](git-operations.md)
- [feature-lifecycle.md](feature-lifecycle.md)
- [review-playbook.md](review-playbook.md)
- [merge-policy.md](merge-policy.md)
- [release-playbook.md](release-playbook.md)
- [clean-slate-workflow.md](clean-slate-workflow.md)
- [documentation-contract.md](documentation-contract.md)
- [workspace-standardization.md](workspace-standardization.md)
