---
type: canonical
source: none
sync: none
sla: none
title: Feature Lifecycle
description: End-to-end lifecycle for docs, governance, asset, and feature work in the alawein repository
category: governance
audience: contributors
status: active
author: Morphism Systems Inc.
version: 1.0.0
last_updated: 2026-03-28
tags: [workflow, features, lifecycle, branching, validation]
---

# Feature Lifecycle

This guide describes how work moves from request to merge in `alawein`. The
same lifecycle applies to documentation, governance, assets, and any future
code-bearing changes unless a more specific guide says otherwise.

## Intake Sources

Work usually starts from one of four sources:

- issue: a tracked problem, gap, or request
- ad hoc request: direct maintainer instruction or support ask
- documentation gap: a mismatch between repo truth and repo docs
- research or supporting assets: notebooks, diagrams, screenshots, or other
  supporting material

The intake source affects scoping, but it does not remove the need for a
reviewable branch and validation evidence.

## Scope Definition

Before creating or expanding a branch, answer:

- what problem is being solved
- what files should change
- what should explicitly stay out of scope
- whether the change affects governance, workflow, or release docs

If the answer is still unclear, start with a `fast/*` spike instead of opening a
full `feat/*` branch immediately.

## Branch Selection

| Branch type | Use when | Typical outcome |
| --- | --- | --- |
| `fast/*` | you need a short experiment, spike, or discovery pass | either delete it or promote the learnings into a scoped branch |
| `feat/*` | you are adding or expanding a workflow, guide, or capability | merge a reviewable additive change |
| `fix/*` | you are correcting an error, drift, or broken behavior | merge a scoped fix |
| `hotfix/*` | the change is urgent and should be fast-tracked | merge with documented urgency and risk |
| `release/*` | a tag or release needs short stabilization work | merge and tag from a controlled release pass |

## Implementation Loop

1. Create the smallest branch that matches the work.
2. Make the scoped changes only.
3. Keep unrelated notebook or asset changes out of the branch.
4. Run local validation for this repo.
5. Self-review before opening or updating the PR.
6. Merge using the approved strategy for the branch type.

Repeat the loop in small slices instead of accumulating a large mixed branch.

## Validation Expectations for This Docs-Only Repo

The repo's baseline validation is documentation-focused:

- `./scripts/validate-doc-contract.sh --full`
- markdown lint for managed docs
- markdown link audit for governance docs

This repo does not require:

- `npm ci`
- application build output
- package lockfiles
- artifact publishing

## Required Doc Updates

Update documentation in the same change when the work changes:

- workflow behavior
- governance rules
- merge or release practice
- contributor expectations
- repo truth stated in canonical docs

Minimum expectation:

- update the relevant guide under `docs/governance/`
- update summary routing docs when navigation changes
- update `CHANGELOG.md` for suite-level or user-visible governance changes

## PR Readiness Criteria

The branch is ready for PR review when:

- the scope is still coherent
- the branch naming fits the work
- validation evidence exists
- docs are updated where behavior changed
- the PR summary explains both the change and the reason for it

Use [review-playbook.md](review-playbook.md) for the full review checklist.

## Post-Merge Follow-Up

After merge:

- pull the updated `main`
- delete the merged branch locally and remotely
- tag or draft release notes if the change is milestone-worthy
- close or link the originating issue if one exists

## Special Cases

### Spike Promoted into Real Work

If a `fast/*` spike proves useful:

- preserve the conclusion
- open a scoped `feat/*` or `fix/*` branch
- move only the validated subset forward

### Docs-Only Changes

Docs-only work still follows the same branch and review flow. A docs-only change
on `feat/docs-governance` is still a feature-level governance change for this
repo and should carry validation evidence.

### Notebook and Asset Changes

Intentional notebook or asset work belongs on its own branch when it is not part
of the governance change under review. Use
[clean-slate-workflow.md](clean-slate-workflow.md) when those changes are
present in the same worktree.
