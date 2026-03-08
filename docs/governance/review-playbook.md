---
title: Review Playbook
description: Self-review and collaborator-review expectations for changes in the alawein repository
category: governance
audience: contributors
status: active
author: Morphism Systems LLC
version: 1.0.0
last_updated: 2026-03-08
tags: [review, self-review, pull-requests, risk, validation]
---

# Review Playbook

`alawein` is operated solo-first, which means the author is usually the primary
reviewer. That does not reduce the review bar. It changes who performs the first
pass and how evidence is recorded.

## Solo-First Self-Review

Before asking anyone else to look at the branch, the author should confirm:

- the branch still matches a single purpose
- unrelated files are not included
- the chosen guide and branch type still fit the work
- the local validation commands were run
- the diff reads cleanly without extra archaeology

Self-review is the default review mode for this repo.

## Collaborator Review

When a collaborator is present, they are reviewing a branch that should already
be self-reviewed and narrowed. Their job is to challenge the logic, clarity, and
risk handling, not to clean up obvious branch hygiene mistakes.

## Author Self-Review Checklist

- re-read the PR summary after the code or docs changes are complete
- review the diff in the order a reader would encounter it
- verify that freshness metadata changed on every touched managed doc
- confirm links resolve locally
- confirm the branch is ready for the merge strategy it expects

## PR Summary Expectations

Every PR summary should answer:

- what changed
- why it changed
- what validation was run
- what follow-up, if any, remains

If the PR changes governance or workflow, reference the specific guide that now
governs the behavior.

## Change Scoping Expectations

Good review scope:

- one domain of intent per PR
- one coherent branch story
- no opportunistic cleanup unless it is directly required

Poor review scope:

- mixed governance, notebook, and asset work in one PR
- branch rewrites that hide what actually changed
- large diffs with no reasoned summary

## Risk Classification Guidance

- Low: wording cleanup, routing links, isolated doc additions, no contract or
  workflow behavior change
- Medium: workflow changes, merge policy clarification, CI-facing governance
  changes, branch model guidance updates
- High: changes to canonical truth, validation expectations, release behavior,
  or anything that could mislead contributors about what is enforced

Higher risk requires more explicit validation evidence and more careful summary
text.

## Validation Evidence Expectations

At minimum, record:

- contract validation status
- markdown lint status when managed docs changed
- link-check status when governance docs changed

If something was not run, say so plainly and explain why.

## Reviewer Checklist for Collaborators

When a collaborator reviews:

- confirm the branch scope is coherent
- confirm the selected guide and policy are internally consistent
- look for contradictions with `documentation-contract.md`
- look for missing changelog or navigation updates
- check whether the PR summary matches the actual diff

## Comment Handling and Resolution

- resolve comments only after the underlying issue is actually addressed
- if a comment changes the intended policy, update the relevant guide, not just
  the PR text
- prefer short follow-up commits over hidden local rewrites during active review

## When to Request Additional Human Review

Request a second human review when:

- canonical truth is being changed
- merge or release policy is being tightened or loosened
- the branch touches multiple governance entry points at once
- the risk is high and the change will be used as a future template

## Closing Stale or Superseded PRs

Close a PR instead of dragging it forward when:

- the branch purpose has changed materially
- the work was replaced by a cleaner branch
- the original branch became mostly obsolete after a merge elsewhere

When closing, point to the replacement PR or commit if one exists.
