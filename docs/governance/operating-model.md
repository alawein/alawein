---
type: canonical
source: none
sync: none
sla: none
title: Operating Model
description: Source ownership, delivery states, evidence, and a project-scoped team workflow pilot
category: governance
audience: contributors
status: active
author: Kohyr Inc.
version: 1.2.0
last_updated: 2026-09-06
tags: [governance, operating-model, workflow, navigation]
---

# Operating Model

Keep one authoritative home for each kind of work. This repository owns shared
policy and public portfolio metadata. Product repositories own code, technical
decisions, checks, and releases. Team projects may adopt Linear for delivery
through the pilot below; existing task ownership remains until their recorded
cutover. Notion holds shared briefs and onboarding. Slack carries coordination.

## Scope and authority

This guide covers project workflow and navigation. It does not grant permission
to send messages, change another system, alter repository protections, or
publish a release. Apply current session authority and the owning repository's
instructions. Existing stricter gates remain in force.

Read `commit-release-convention.md` for this repository's commit and release
rules. Other repositories may have explicit profiles. Do not copy a personal
agent identity or a solo-maintainer exception onto a team contributor.

## Source ownership

| Object | Owner | Other surfaces |
| --- | --- | --- |
| Shared policy and public catalog | This repository's canonical docs and catalog | Linked or generated views |
| Code, PR review, checks, technical ADRs and releases | Owning repository | Evidence links in the task |
| Team priority, assignee, acceptance and work state | Linear after project cutover | PR events and source links |
| Public reports and external contributions | Original GitHub issue or PR | Linked internal delivery work when accepted |
| Client-owned tasks | Client's agreed tracker | Permitted links only |
| Product briefs, onboarding and human capability records | Existing Notion project page | Links to technical decisions |
| Private cross-system routing | Approved existing private project record | Public exports use an allowlist |
| Discussion | Slack thread | Decisions captured in the owning system |

Repository lifecycle and task state are different fields. Record the authority
for each field before enabling a synchronizer. Do not create another registry
or a second editable task backlog. A failed read is unknown, not an empty result.

## Delivery path

1. Find the existing issue or create one in the project's current task system.
2. Record its owner, scope, acceptance, risk, dependencies, and source links.
3. Write a brief or technical decision only when the change needs one.
4. Read current repo instructions and record the base revision and dirty paths.
5. Implement one concern in a scoped branch or worktree. Assign one writer to
   each overlapping file set.
6. Run the documented checks and self-review the current diff. Record what ran,
   its revision, and its result. A written test is not an executed test.
7. Obtain the review required by the repo's team, solo, or external-contributor
   profile. AI review is advisory unless a separately approved rule says otherwise.
8. Merge under current protections, deliver the artifact, and verify acceptance.
9. Close the work item with evidence and link any remaining debt.

For services, merge alone is not deployment. For packages, keep release artifact
and version evidence. For research, keep dataset and code revisions, a baseline,
the evaluation protocol, uncertainty, and reproduction commands.

## Linear pilot

Adopt per project after scope, membership, and IDs are verified. Map existing
states before adding new ones. The initial pilot uses Backlog, Todo, In Progress,
In Review, Done, Canceled, and Duplicate. Todo means ready to start: the issue has
an owner, scope, acceptance criteria, and resolved prerequisites. Keep work In
Review while delivery evidence is pending. Done requires acceptance evidence.
Use a separate Ready for Release state only when that distinction helps the
project. Blocked work has a blocking relation, reason, owner, and next check.

Configure PR linking first. A merge advances to delivery-pending unless merge
itself satisfies acceptance. Multi-PR work records every required PR or uses
child issues. Test state transitions before enabling broader issue sync.

Use native priority, assignee, project and state fields. Map a small work-kind
and risk vocabulary; preserve repo-specific automation and evidence labels until
their consumers are known. Store source and target IDs so imports are idempotent.
Retain original records and links during cutover. Do not propagate deletion.

Pilot one team and one low-risk repository. Verify capture, failed checks,
requested changes, delivery, duplicate intake, and rollback. Expand only after
the pilot has ten accepted deliveries, no duplicate replay, and a backup
maintainer who can operate the path.

## People and agents

Each project names an owner and backup. Shared-team changes have a qualified
reviewer; outside contributions have an internal sponsor. Do not infer ownership
or skill from repository visibility, namespace, or commit counts.

Route agents by capability, access and verified runtime. Track source presence,
installation, instruction loading and behavioral verification separately. Pin
external skill sources and record their license and effects. An imported skill
does not extend its own authority.

Use the existing batch manifest for multi-repo work. Preserve repository-specific
exceptions and current communication rules. Handoffs give changes, evidence,
blockers, and one next action, with the revision and assigned paths.

## Maintenance

Choose one writer per synchronized field and one publisher per Slack event.
Custom integrations record IDs, revisions, event IDs, timestamps, and failures;
bounded retries and replay must not create duplicates or regress newer state.

Check schema and links on changes. Re-verify capability after integration
changes. Review unowned work, duplicate tracking and failed links weekly during
the pilot. Recheck skill sources and exceptions monthly. Keep an owner and a
backup for every automation, plus a tested rollback.

## Runbooks

| Task | Reference |
| --- | --- |
| High-level workflow | [workflow.md](workflow.md) |
| Commit, branch, merge and release convention | [commit-release-convention.md](commit-release-convention.md) |
| Git mechanics and recovery | [git-operations.md](git-operations.md) |
| Focused branches and worktree hygiene | [clean-slate-workflow.md](clean-slate-workflow.md) |
| Author and reviewer checks | [review-playbook.md](review-playbook.md) |
| Multi-repo execution | [parallel-batch-execution.md](parallel-batch-execution.md) |
| Documentation contract | [documentation-contract.md](documentation-contract.md) |
| Integration inventory and runtime surfaces | [unified-agent-system.md](unified-agent-system.md) |
| Slack channel and bot policy | [slack-agent-runbook.md](slack-agent-runbook.md) |
