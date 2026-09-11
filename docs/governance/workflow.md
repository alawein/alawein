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
version: 1.2.0
last_updated: 2026-09-10
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

For `alawein/alawein`, the
[repository-specific solo policy](commit-release-convention.md#4-merge-policy)
requires protected squash-only merging and prohibits direct pushes, force merge,
and administrator bypass. The generic exceptions below apply only to other
repositories whose recorded profiles and native controls permit them.

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
  [`../../scripts/doctrine/validate-doc-contract.sh`](../../scripts/doctrine/validate-doc-contract.sh)
- fast CI:
  [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- slower documentation audit:
  [`.github/workflows/docs-validation.yml`](../../.github/workflows/docs-validation.yml)

The enforced baseline in this repo is documentation-focused:

- documentation contract validation
- markdown lint for managed docs
- link audit in the slower governance workflow

Fast CI runs for every pull request targeting `main` and every push to `main`,
including documentation-only changes. Required checks must report a result for
the reviewed revision; path filters must not leave them permanently pending.

There is no application build or deployment pipeline in this repo. CI installs
the dependencies needed for governance script tests and Markdown linting.

## Release Summary

- Follow [`commit-release-convention.md`](commit-release-convention.md) for
  the current version, changelog, tag, and release rules.
- Keep explicit repository release profiles and independent package versions
  scoped to their owning repositories.
- Preserve historical milestone, research, and recovery refs. Do not rename or
  recreate tags to make old history match a newer convention.
- Release readiness requires the current revision's checks and the declared
  artifact; a merged PR alone does not establish deployment or publication.

## Clean-Slate Rule

If unrelated edits remain after a focused change, separate them instead of
mixing them into the current branch. Prefer a dedicated branch or a path-scoped
stash.

## See Also

- [branch-and-deployment-convention.md](branch-and-deployment-convention.md), single reference for branch naming, workflow, and Vercel
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
