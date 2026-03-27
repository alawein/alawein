---
type: canonical
source: none
sync: none
sla: none
title: Merge Policy
description: Approved merge strategies, readiness criteria, exceptions, and cleanup rules for alawein
category: governance
audience: contributors
status: active
author: Morphism Systems Inc.
version: 1.0.0
last_updated: 2026-03-28
tags: [merge, pull-requests, branch-protection, workflow, policy]
---

# Merge Policy

This guide defines how branches are allowed to land on `main`.

## Approved Merge Strategies

- Squash merge is the default for `fast/*`, `feat/*`, and `fix/*`.
- Merge commits are allowed for `hotfix/*` and `release/*` when chronology
  matters.
- Rebase merge is not part of the documented default for this repo.

Why squash is default:

- keeps `main` readable
- keeps small review units visible
- avoids importing noisy branch history into the permanent record

## Prohibited or Discouraged Behaviors

- do not push directly to `main`
- do not use plain `--force`
- do not merge a branch whose summary no longer matches the diff
- do not merge unrelated notebook, asset, and governance work together unless
  the linkage is real and documented
- do not rely on a PR comment to carry policy truth that should live in a guide

## Merge Readiness Criteria

A branch is merge-ready when:

- the branch type matches the work
- the diff is reviewable
- required docs are updated
- validation evidence exists
- the chosen merge strategy fits the branch class and risk level

## Force-Merge Exception Policy

Force merge is an exception, not a normal workflow.

It is only acceptable when:

- the branch is urgent enough that delay is worse than the known risk, and
- the blocking CI failure is external, flaky, or unrelated to the branch logic,
  and
- the risk is documented in the PR summary

Even then:

- review the final diff locally
- run the relevant local checks
- document what follow-up is required after merge

## Conflict Resolution Approach

Resolve conflicts on the branch before merge.

Preferred order:

1. pull the latest `main`
2. update the branch locally
3. resolve the conflict with the current policy text as the source of truth
4. rerun validation

If the conflict reveals a policy contradiction, update the governing doc instead
of patching around it in the PR description.

## Bot-Generated Branch Treatment

Automation branches may keep their provider-generated names. They do not need to
follow the human branch taxonomy, but they do need:

- green or understood checks
- a human decision when the change touches governance truth
- cleanup after merge or closure

## Post-Merge Cleanup

After merging:

- delete the merged branch remotely
- delete the local branch once `main` is up to date
- update `CHANGELOG.md` or release notes if the merged change is milestone-level
- prune stale local branches as part of routine hygiene

## Recommended Branch Protection for `main`

Documented target settings:

- require pull requests
- require the fast CI checks
- allow squash merge
- allow merge commits for approved exception classes
- disable direct pushes except for explicit admin emergency handling

## Related Guides

- [review-playbook.md](review-playbook.md)
- [git-operations.md](git-operations.md)
- [release-playbook.md](release-playbook.md)
