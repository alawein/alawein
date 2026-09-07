---
type: canonical
source: none
sync: none
sla: none
title: Operating Model
description: Source ownership, delivery states, evidence, and Meshal's solo-maintainer workflow with independent tool review
category: governance
audience: contributors
status: active
author: Kohyr Inc.
version: 1.3.0
last_updated: 2026-09-06
tags: [governance, operating-model, workflow, navigation]
---

# Operating Model

Keep one authoritative home for each kind of work. This repository owns shared
policy and public portfolio metadata. Product repositories own code, technical
decisions, checks, and releases. Meshal-maintained projects may adopt Linear for delivery
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
7. Obtain independent tool review when feasible, then Meshal's final decision.
   Preserve any stricter external-contributor or client review requirements.
   Automated review is evidence, not a human GitHub approval.
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

Configure PR linking first. After merge, keep the issue In Review while delivery
evidence is pending. Move it to Done only when all acceptance criteria are met
and the evidence is linked. Multi-PR work records every required PR or uses child
issues. Test state transitions before enabling broader issue sync.

Use native priority, assignee, project and state fields. Apply the shared
[work-record-taxonomy.md](work-record-taxonomy.md) vocabulary; preserve
repo-specific automation and evidence labels until their consumers are known.
Store source and target IDs so imports are idempotent.
Retain original records and links during cutover. Do not propagate deletion.

Pilot the Meshal team and one low-risk repository. Verify capture, failed checks,
requested changes, delivery, duplicate intake, and rollback. Expand delivery
automation after ten accepted deliveries, no duplicate replay, and a recovery
exercise Meshal can perform with another authorized tool. Read-only inventory
and approved additive taxonomy batches can cover other repositories before this
gate; those batches do not migrate their task authority or integrations.

## People and agents

Meshal Alawein is the sole developer, accountable maintainer and final approver
for this rollout. There is no assumed second human maintainer. Preserve actual
repository namespace ownership and external/client approval requirements.

Assign an executor and an independent reviewer per change. Rotate the tools to
avoid a permanent author/reviewer pairing, using this default cycle:

| Change | Executor | Independent reviewer | Final approver |
| --- | --- | --- | --- |
| A | Claude Code | Cursor | Meshal |
| B | Cursor | ChatGPT | Meshal |
| C | ChatGPT | Claude Code | Meshal |

Any of the three tools, or Meshal, may plan, execute or review within assigned
permissions and verified capability. The executor cannot certify its own work as
independent review. A different tool reviews the exact revision with the task,
diff, applicable policy and check evidence. Revisions after review require a
recorded review of the new changes; earlier review is not silently carried forward.

If the preferred reviewer is unavailable, use another authorized tool and record
the substitution. If none is available, record independent review as not performed
and retain Meshal's explicit risk decision. High-risk governance, security and
release changes wait for independent review or a scoped exception from Meshal.
No policy text grants a tool access, permits messages, or bypasses native controls.

For each change record author, executor, reviewer, checks and Meshal's final
approval using the [change evidence contract](work-record-taxonomy.md#change-evidence).
An implementation instruction is not final approval of an unseen revision.

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
the pilot. Recheck skill sources and exceptions monthly. Meshal owns each
automation; record a tested rollback, credential recovery path and an alternative
authorized tool. Do not invent backup personnel or copy credentials between tools.

## Runbooks

| Task | Reference |
| --- | --- |
| High-level workflow | [workflow.md](workflow.md) |
| Shared taxonomy and change evidence | [work-record-taxonomy.md](work-record-taxonomy.md) |
| Commit, branch, merge and release convention | [commit-release-convention.md](commit-release-convention.md) |
| Git mechanics and recovery | [git-operations.md](git-operations.md) |
| Focused branches and worktree hygiene | [clean-slate-workflow.md](clean-slate-workflow.md) |
| Author and reviewer checks | [review-playbook.md](review-playbook.md) |
| Multi-repo execution | [parallel-batch-execution.md](parallel-batch-execution.md) |
| Documentation contract | [documentation-contract.md](documentation-contract.md) |
| Integration inventory and runtime surfaces | [unified-agent-system.md](unified-agent-system.md) |
| Slack channel and bot policy | [slack-agent-runbook.md](slack-agent-runbook.md) |
