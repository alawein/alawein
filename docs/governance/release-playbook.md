---
title: Release Playbook
description: Docs-first guidance for changelog updates, tags, release readiness, and rollback in alawein
category: governance
audience: contributors
status: active
author: Morphism Systems Inc.
version: 1.0.0
last_updated: 2026-03-08
tags: [release, changelog, tags, rollback, governance]
---

# Release Playbook

`alawein` is a docs-only organization repository, so releases are about
meaningful governance and profile milestones rather than binary artifacts.

## When to Cut a Release or Tag

Consider a release or tag when the repo lands:

- a meaningful governance suite or operating-model change
- a visible organization profile milestone
- a workspace migration checkpoint that should be referenced later
- a policy baseline that other repos are expected to follow

Do not tag every minor editorial edit.

## Deciding Whether a Change Deserves a Tag

Use these questions:

- will another repo or future maintainer need to refer back to this state
  explicitly
- did the change alter contributor workflow or governance expectations
- is this a milestone worth citing in support, migration, or audit work

If the answer is mostly no, keep the change in `Unreleased` only.

## Changelog Drafting Flow

Use [changelog-entry.md](changelog-entry.md) before updating `CHANGELOG.md`.

Practical order:

1. inspect recent commits
2. group them into Keep a Changelog categories
3. draft the user-visible outcomes
4. update `CHANGELOG.md`
5. decide whether the result should stay in `Unreleased` or become a tagged
   version

## Version Bump Heuristic

For this repo:

- patch: isolated documentation, workflow, or process improvements
- minor: additive governance suites, new operating guides, notable repo-surface
  expansion
- major: intentional breaking changes to documented contributor expectations or
  canonical repo truth

## Tagging Convention

Use semantic version tags:

```text
v{major}.{minor}.{patch}
```

Examples:

- `v2.0.5`
- `v2.1.0`

## Release Checklist

- `CHANGELOG.md` reflects the actual outcome
- the release-worthy docs are merged on `main`
- validation passed on the final state
- the version bump matches the scope of change
- the tag message or release notes are readable without opening the full diff

## Post-Release Verification

After tagging:

- verify the tag points to the intended commit
- verify `main` contains the release notes you expect
- confirm any linked governance docs exist at the tagged state

## Rollback and Backout

For docs and governance regressions:

- prefer a targeted follow-up commit or `git revert`
- avoid rewriting published history
- if a release tag captured incorrect governance truth, fix the repo first and
  decide whether a corrective patch tag is warranted

## Related Guides

- [changelog-entry.md](changelog-entry.md)
- [merge-policy.md](merge-policy.md)
- [feature-lifecycle.md](feature-lifecycle.md)
