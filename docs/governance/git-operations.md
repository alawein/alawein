---
title: Git Operations Guide
description: Day-to-day Git guidance for branching, syncing, pushing, stashing, cleanup, and recovery in alawein
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
last_updated: 2026-03-23
tags: [git, branching, push, stash, recovery, workflow]
---

# Git Operations Guide

Use this guide for the mechanics of working in Git. Higher-level lifecycle,
review, and merge decisions live in sibling governance docs.

## Branching from `main`

Start new work from a current `main`.

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/docs-governance-suite
```

Rules:

- Branch from `main`, not from another in-progress feature branch, unless the
  dependency is intentional and documented.
- Keep one branch focused on one reviewable unit of work.
- Use [feature-lifecycle.md](feature-lifecycle.md) if you are still deciding
  what branch type fits the change.

## Branch Naming

The repo keeps the current branch taxonomy:

- `fast/*`: short-lived spikes or prototypes
- `feat/*`: additive scoped work
- `fix/*`: scoped fixes
- `hotfix/*`: urgent fixes that need fast handling
- `release/*`: optional release stabilization work

Naming rules:

- use kebab-case
- keep names readable and intent-revealing
- stay within four path segments
- prefer a short domain plus outcome, such as `feat/docs-governance-suite`

## Syncing Local Work with `main`

Before opening or updating a PR, sync with `main`.

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch feat/docs-governance-suite
git merge --ff-only main
```

If `--ff-only` cannot be used:

- resolve whether the branch should be rebased locally before review, or
- merge `main` into the branch only when that is the least risky way to handle a
  real conflict

Do not rewrite shared history on `main`.

## Push Rules

- Push feature branches freely once the branch has meaningful work.
- Do not push directly to `main`.
- Use branch pushes or draft PRs for in-progress work.
- Push early when the branch would benefit from a remote backup or review URL.

Typical push flow:

```bash
git push -u origin feat/docs-governance-suite
```

## Force-Push Rules

- Never force-push `main`.
- Use only `--force-with-lease`, never plain `--force`.
- Force-push only personal, unmerged branches when cleanup is necessary.
- Avoid force-pushes once collaborators are actively reviewing unless the branch
  owner coordinates the rewrite.

Example:

```bash
git push --force-with-lease origin feat/docs-governance-suite
```

## Branch Cleanup After Merge

After a branch is merged:

```bash
git switch main
git pull --ff-only origin main
git branch -d feat/docs-governance-suite
git push origin --delete feat/docs-governance-suite
```

Also:

- clean up stale local branches that no longer map to active work
- keep `fast/*` branches especially short-lived
- leave archived or tagged release references intact

## Stash Basics

A stash is a local shelf for uncommitted changes. It removes changes from the
working tree while keeping them saved locally for later restoration.

Use a stash when:

- the current worktree contains intentional changes that do not belong to the
  commit you are making now
- you need a clean tree to finish or verify a focused change
- notebook or asset work should move to its own branch later

Prefer path-scoped stashes over whole-repo stashes when only a few files are
unrelated.

```bash
git stash push -m "alawein-clean-slate-leftovers" -- HackerRank.ipynb avatar.svg
```

## `apply` vs `pop` vs `drop`

- `git stash apply stash@{0}` restores a stash and keeps it on the stack
- `git stash pop stash@{0}` restores a stash and removes it if the apply
  succeeds
- `git stash drop stash@{0}` permanently deletes a stash without restoring it

Use `apply` when the stash is still acting as a safety net. Use `pop` only when
you are confident you want the stash removed as part of restoration.

## Recovery Guidance

Prefer `git revert` over destructive rewrites on shared history.

Use `revert` when:

- a bad commit already exists on `main`
- a merged PR needs to be backed out
- collaborators may already have based work on the published history

Use history rewrite only on personal, unmerged branches and only when it makes
the branch easier to review.

## IDE and agent close-out

Assisted editing is not complete until changes are **recorded and visible on the
remote** (and merged per [merge-policy.md](merge-policy.md)). Uncommitted files
are invisible to GitHub and CI. Checklist and narrative:
[ide-llm-agent-completion-lessons-2026-03.md](../audits/ide-llm-agent-completion-lessons-2026-03.md).

## Related Guides

- [clean-slate-workflow.md](clean-slate-workflow.md)
- [merge-policy.md](merge-policy.md)
- [feature-lifecycle.md](feature-lifecycle.md)
- [ide-llm-agent-completion-lessons-2026-03.md](../audits/ide-llm-agent-completion-lessons-2026-03.md)
