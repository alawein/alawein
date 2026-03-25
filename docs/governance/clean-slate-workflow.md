---
title: Clean-Slate Workflow
description: Best practices for keeping alawein clean while preserving intentional in-progress work through focused commits, path-scoped stashes, branch isolation, and batch worktree hygiene
last_updated: 2026-03-16
category: governance
audience: contributors
status: active
author: Morphism Systems Inc.
version: 1.1.0
tags: [git, stash, workflow, clean-slate, notebooks, assets]
---

# Clean-Slate Workflow

This guide describes the default operating model for keeping `alawein` clean
without losing intentional work.

## Goals

- Keep `main` reviewable and reproducible.
- Separate unrelated changes into focused commits.
- Preserve intentional work-in-progress without mixing it into governance
  changes.
- Treat notebook and binary-ish asset diffs as their own change surface.
- Keep autonomous batch work isolated from manual local edits.

## Default Rule

When you finish one focused change but still have unrelated local edits, do not
mix them into the same commit. Either:

- commit them separately if they belong together
- stash them if they are not ready
- discard them if they are accidental

## Batch Isolation Rule

`workspace-batch` creates isolated worktrees under
`_ops/state/<batch-id>/worktrees/`.

- do not use those worktrees as normal developer sandboxes
- do not mix manual edits into a live batch worktree
- isolate unrelated local changes before starting a batch run when the manifest
  requires a clean checkout

## Recommended Order of Operations

1. Finish the focused change and validate it.
2. Stage only the files that belong to that change.
3. Commit the focused change.
4. Check `git status --short`.
5. If unrelated edits remain, stash them with a descriptive message and
   path-limited file list.
6. Continue working from the clean tree or restore the stash onto a dedicated
   branch.

## Path-Scoped Stash Pattern

Use path-scoped stashes instead of stashing the whole repo when only a few files
are unrelated.

```bash
git stash push -m "alawein-clean-slate-leftovers" -- \
  .github/CODEOWNERS \
  .github/ISSUE_TEMPLATE/bug_report.md \
  .github/ISSUE_TEMPLATE/feature_request.md \
  .github/pull_request_template.md \
  HackerRank.ipynb \
  LICENSE \
  RevisionNotebook.ipynb \
  avatar.svg
```

Why:

- keeps the active change set focused
- avoids hiding unrelated in-progress work across the entire repo
- makes later recovery explicit

## Best Practice for Notebooks and Assets

Treat notebooks and visual assets as their own unit of work when possible.

- `*.ipynb` files often produce large serialized diffs even for small edits.
- SVG and generated asset files can accumulate formatting churn that obscures
  real changes.
- If notebook or asset edits are intentional but unrelated to the current task,
  move them to their own branch before committing.

Recommended recovery flow:

```bash
git switch -c wip/notebook-svg-updates
git stash apply stash@{0}
git restore \
  .github/CODEOWNERS \
  .github/ISSUE_TEMPLATE/bug_report.md \
  .github/ISSUE_TEMPLATE/feature_request.md \
  .github/pull_request_template.md \
  LICENSE
git add HackerRank.ipynb RevisionNotebook.ipynb avatar.svg
git commit -m "chore: update notebooks and avatar assets"
```

## When To Restore a Stash

Restore a stash when:

- the work is intentional
- it belongs on a dedicated branch or separate commit
- you are ready to review or continue it

Use:

- `git stash apply stash@{0}` to restore while keeping the stash
- `git stash pop stash@{0}` to restore and remove the stash in one step

## When To Drop a Stash

Drop a stash only when:

- you have restored and committed the work elsewhere, or
- you have confirmed the changes were accidental or obsolete

Use:

```bash
git stash drop stash@{0}
```

## Quick Triage Checklist

- Does this file belong to the commit I am making now?
- Is this change intentional?
- Is this change review-ready?
- Would this diff confuse the purpose of the current PR?
- Should notebook or asset files move to their own branch?

If any answer points away from the current commit, separate the change.

## Anti-Patterns

- Stashing the entire repo without knowing what is inside the stash
- Mixing governance docs with notebook or asset updates in one commit
- Restoring a stash back onto `main` when the work deserves its own branch
- Treating batch worktrees as general-purpose local branches
- Dropping a stash before deciding whether notebook or asset edits are
  intentional

## Minimal Command Set

```bash
git status --short
git add <focused files>
git commit -m "<focused message>"
git stash push -m "<descriptive stash name>" -- <paths...>
git stash list
git stash show --stat stash@{0}
git stash apply stash@{0}
git stash drop stash@{0}
```
