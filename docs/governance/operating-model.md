---
title: Operating Model
description: Task-oriented map of the alawein governance suite, including the default path for autonomous batch execution
category: governance
audience: contributors
status: active
author: Morphism Systems Inc.
version: 1.1.0
last_updated: 2026-03-15
tags: [governance, operating-model, workflow, navigation]
---

# Operating Model

This document is the entry point for how `alawein` is operated day to day.
Use it when the immediate question is "what do I do next?" rather than "what is
the full policy text?"

## Scope and Audience

- Scope: repo-local workflow, review, merge, release, documentation, and
  manifest-driven batch operations for the `alawein` organization repository
- Audience: contributors, maintainers, and agents working inside this repo
- Posture: solo-first by default, collaborator-friendly when a second reviewer
  is present

## Operating Principles

- Keep `main` clean, reviewable, and PR-first.
- Prefer small, scoped branches over long-running mixed work.
- Treat documentation and governance changes as real product changes for this
  repo.
- Push feature branches freely; do not push directly to `main`.
- Use the local documentation contract and validator as the enforcement
  backbone.
- Use manifest-driven batch execution for multi-repo work.
- Keep healthy batch runs quiet until the final report.

## Workflow Map by Task

| If you need to... | Start here |
| --- | --- |
| understand the overall flow | [workflow.md](workflow.md) |
| choose the right branch and next step | [feature-lifecycle.md](feature-lifecycle.md) |
| run a large multi-repo change without serial approvals | [parallel-batch-execution.md](parallel-batch-execution.md) |
| create, sync, push, stash, or recover Git work | [git-operations.md](git-operations.md) |
| keep the repo clean while preserving unrelated work | [clean-slate-workflow.md](clean-slate-workflow.md) |
| review your own PR or review someone else's | [review-playbook.md](review-playbook.md) |
| decide how a branch should be merged | [merge-policy.md](merge-policy.md) |
| decide whether to cut a tag or update release notes | [release-playbook.md](release-playbook.md) |
| confirm what documentation rules are enforced | [documentation-contract.md](documentation-contract.md) |

## Governance Doc Map

| Document | Role |
| --- | --- |
| [documentation-contract.md](documentation-contract.md) | Authoritative local rules for document classes, freshness, naming, and CI truthfulness |
| [workflow.md](workflow.md) | Stable high-level summary of branch, merge, CI, and batch behavior |
| [parallel-batch-execution.md](parallel-batch-execution.md) | Canonical manifest-driven batch rules, stop policy, and communication model |
| [git-operations.md](git-operations.md) | Day-to-day Git mechanics: branch creation, sync, push, stash, cleanup, and recovery |
| [feature-lifecycle.md](feature-lifecycle.md) | End-to-end path from intake to merge for docs, governance, asset, and feature work |
| [review-playbook.md](review-playbook.md) | Solo-first self-review guidance and collaborator review expectations |
| [merge-policy.md](merge-policy.md) | Merge readiness, approved strategies, force-merge exceptions, and post-merge cleanup |
| [release-playbook.md](release-playbook.md) | Docs-first tagging, changelog, release, and backout workflow |
| [clean-slate-workflow.md](clean-slate-workflow.md) | Best practice for focused commits, path-scoped stashes, and batch isolation |
| [changelog-entry.md](changelog-entry.md) | How to draft a changelog entry from recent commits |

## Golden Path

1. Decide whether the work is single-repo or multi-repo.
2. For single-repo work, create the smallest branch that matches the change.
3. For multi-repo work, define the batch manifest and repo dependencies first.
4. Implement the change and keep unrelated work out of the diff.
5. Run the repo's validation commands or the batch engine as appropriate.
6. Self-review the branch or repo-scoped PR using
   [review-playbook.md](review-playbook.md).
7. Merge using [merge-policy.md](merge-policy.md).
8. If the change is milestone-worthy, follow [release-playbook.md](release-playbook.md).

## Exceptions and Escalation Paths

- If the work is a short-lived spike, use `fast/*` and either promote it into a
  scoped branch or delete it.
- If the work is urgent and needs release chronology preserved, use `hotfix/*`
  and follow [merge-policy.md](merge-policy.md).
- If unrelated notebook or asset edits are present, isolate them with
  [clean-slate-workflow.md](clean-slate-workflow.md) before continuing.
- If local docs and inherited ecosystem guidance differ, this repo follows
  [documentation-contract.md](documentation-contract.md).
- If batch execution hits a structured exception, record it and continue only as
  allowed by [parallel-batch-execution.md](parallel-batch-execution.md).

## Related Guides

- [documentation-contract.md](documentation-contract.md)
- [workflow.md](workflow.md)
- [parallel-batch-execution.md](parallel-batch-execution.md)
- [clean-slate-workflow.md](clean-slate-workflow.md)
