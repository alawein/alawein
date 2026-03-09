---
title: Operating Model
description: Task-oriented map of the alawein governance suite and the default solo-first path from idea to merge
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
last_updated: 2026-03-08
tags: [governance, operating-model, workflow, navigation]
---

# Operating Model

This document is the entry point for how `alawein` is operated day to day.
Use it when the immediate question is "what do I do next?" rather than "what is
the full policy text?"

## Scope and Audience

- Scope: repo-local workflow, review, merge, release, and documentation
  operations for the `alawein` organization repository
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
- Separate notebook and asset work when it does not belong to the current
  governance change.

## Workflow Map by Task

| If you need to... | Start here |
| --- | --- |
| understand the overall flow | [workflow.md](workflow.md) |
| choose the right branch and next step | [feature-lifecycle.md](feature-lifecycle.md) |
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
| [workflow.md](workflow.md) | Stable high-level summary of the branch model, merge model, and CI contract |
| [git-operations.md](git-operations.md) | Day-to-day Git mechanics: branch creation, sync, push, stash, cleanup, and recovery |
| [feature-lifecycle.md](feature-lifecycle.md) | End-to-end path from intake to merge for docs, governance, asset, and feature work |
| [review-playbook.md](review-playbook.md) | Solo-first self-review guidance and collaborator review expectations |
| [merge-policy.md](merge-policy.md) | Merge readiness, approved strategies, force-merge exceptions, and post-merge cleanup |
| [release-playbook.md](release-playbook.md) | Docs-first tagging, changelog, release, and backout workflow |
| [clean-slate-workflow.md](clean-slate-workflow.md) | Best practice for focused commits, path-scoped stashes, and branch separation |
| [changelog-entry.md](changelog-entry.md) | How to draft a changelog entry from recent commits |

## Golden Path

1. Start from `main` and create the smallest branch that matches the work.
2. Define the scope before editing files.
3. Implement the change and keep unrelated work out of the diff.
4. Run the repo's documentation checks.
5. Self-review the branch using [review-playbook.md](review-playbook.md).
6. Merge using [merge-policy.md](merge-policy.md).
7. If the change is milestone-worthy, follow [release-playbook.md](release-playbook.md).

## Exceptions and Escalation Paths

- If the work is a short-lived spike, use `fast/*` and either promote it into a
  scoped branch or delete it.
- If the work is urgent and needs release chronology preserved, use `hotfix/*`
  and follow [merge-policy.md](merge-policy.md).
- If unrelated notebook or asset edits are present, isolate them with
  [clean-slate-workflow.md](clean-slate-workflow.md) before continuing.
- If local docs and inherited ecosystem guidance differ, this repo follows
  [documentation-contract.md](documentation-contract.md).

## Related Guides

- [documentation-contract.md](documentation-contract.md)
- [workflow.md](workflow.md)
- [clean-slate-workflow.md](clean-slate-workflow.md)
