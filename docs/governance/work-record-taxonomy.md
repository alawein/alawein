---
type: canonical
source: none
sync: none
sla: on-change
title: Work Record Taxonomy
description: Shared classification, field authority, migration and change evidence for Meshal's repositories and delivery records
category: governance
audience: [contributors, ai-agents]
status: active
last_updated: 2026-09-10
tags: [governance, catalog, taxonomy, workflow]
---

# Work Record Taxonomy

Use the vocabulary in [`catalog/taxonomy.json`](../../catalog/taxonomy.json).
Repository type and work kind are separate fields. A research repository can
contain a bug, feature, maintenance task or documentation change.

## Work kind

Choose one primary kind from acceptance criteria and the actual change. Keep
secondary components in existing area labels. Do not guess when signals conflict.

| Kind | GitHub label | Linear Type group | Meaning |
| --- | --- | --- | --- |
| bug | `type:bug` | Bug | Incorrect behavior or a reproduced defect |
| feature | `type:feature` | Feature | New user or platform capability |
| docs | `type:docs` | Documentation | Documentation, policy, reference or examples |
| maintenance | `type:maintenance` | Improvement | Dependencies, configuration, refactoring or operations |
| research | `type:research` | Research | A question tested through recorded investigation |
| security | `type:security` | Security | Security work within its disclosure boundary |
| question | `type:question` | Question | An answer request without committed implementation |

Preserve Linear's existing Bug, Feature and Improvement identities and names.
Their group permits one primary kind. Use the same logical keys in exports;
different product display names do not create separate vocabularies.

For Meshal's requested Linear normalization, apply accountable ownership and
Type to existing issues, including canceled onboarding records. Keep their
state, original author and history intact; classification does not reopen work.

## Field authority

| Field | Canonical writer | Representation elsewhere |
| --- | --- | --- |
| Repository identity and namespace | GitHub repository ID and current full name | Stable ID plus URL; account owner is distinct from maintainer |
| Curated repository profile | `catalog/index.yaml`, compiled to `catalog/repos.json` | Existing generated catalog and approved metadata sync |
| Repository axes | `catalog/taxonomy.json` | Existing type, surface, domain, lifecycle, audience, brand and compliance values |
| Operational repository coverage | Existing workspace-control registry | Discovery observations with source and timestamp, not a new editable registry |
| Work kind | Current task authority using the mapping above | Additive GitHub label and Linear Type group |
| State, priority, assignee, dependencies and acceptance | Linear after project cutover; otherwise the existing task source | Evidence links; no second editable backlog |
| Risk | Work item or PR evidence record | unassessed, low, medium or high; never infer low from missing data |
| Code, author, revision, checks and reviews | GitHub | Exact revision and result links in the task |
| Briefs, field mapping and decisions | Existing Notion project brief | Links to canonical policy and task |
| Conversation and delivery events | Authorized Slack thread and one publisher per event | Decision recorded in its owning system |
| Versions and release tags | Owning repository's release profile | Immutable ref and release URL; no retroactive retagging |

GitHub topics describe public discovery: at most 20, preferably 12 or fewer.
Keep work-state, priority, tool identity and private routing out of topics.
Use repository custom properties only where the organization supports them and
the field writer is recorded. Otherwise retain the field in its current catalog.
Do not invent a domain, license, compliance class or public description for an
unclassified repository.

GitHub issues and PRs retain their native author and timestamps. Discussions use
their native category for format and a work-kind label where supported; decisions
that require execution link to the owning task. Notion tags and Slack bookmarks
link to these objects instead of becoming independent task or status writers.

## Change evidence

Each change has a task, PR or batch record with these fields:

| Field | Completion rule |
| --- | --- |
| Source | Stable source ID, URL, batch ID if applicable and base revision |
| Author | Actual Git or record author identity; never reconstruct from the executor |
| Executor | Meshal, Claude Code, Cursor or ChatGPT; actual run/session and assigned scope |
| Independent reviewer | Different tool or person, reviewed revision, finding and evidence URL; otherwise not performed |
| Checks | Name or command, revision, timestamp, result and evidence; required checks separated from other audits |
| Final approval | Meshal's decision, scope, revision or metadata-batch manifest, timestamp and evidence |
| Acceptance | Delivered outcome and criteria verified; prepared, published and accepted are distinct |

Keep execution attribution in the evidence record. Preserve the canonical Git
identity and commit-message convention. A bot's COMMENTED or APPROVED review is
automated review, not a second human approval. Missing checks, inaccessible
settings and pending reviews are unverified, never passing by default.

Mutation sequencing (`proposed` through `accepted`), control levels, and run
envelopes are defined in [control-plane.md](control-plane.md). This page owns
field writers and the change-evidence table. A content hash or generated
summary is not acceptance.

Authorization to implement is recorded separately from final acceptance of the
result. A delegated metadata batch may cite Meshal's authorization and its exact
manifest; it must still retain before/after observations and exceptions. Do not
create historical executor, reviewer or approval claims from commit counts.

## GitHub retroactive migration

1. Discover source IDs, current labels, consumers, timestamps and permissions.
2. Save a manifest and before-values. Reuse the existing migration work item.
3. Create or reuse definitions without renaming or deleting automation labels.
4. Canary an additive label on one verified open record and read it back.
5. Apply only unambiguous mappings. Re-read before each write; skip closed records,
   concurrent changes, conflicting types and missing definitions.
6. Re-run the planner. Applied records must propose no duplicate action.
7. Keep a ledger of executor, operation, before/after, timestamp and outcome.
   Roll back only additions from this batch, after checking for later changes.

Aliases such as `bug`, `docs`, `documentation`, `enhancement` and `type:feat`
remain readable. Preserve `dependencies`, language labels, `auto-generated`,
`prompt-kit`, `catalog`, priority labels and other control labels while their
consumers migrate. Native priority and state remain authoritative after cutover.
Do not delete `type:gap` or other repo-specific workflow labels merely because
their spelling resembles the shared work-kind namespace.

Preserve closed and archived records and normalize their aliases in catalog
views. They do not need reopening or retagging. Historical work with missing
attribution stays unverified. Treat archived repositories, inaccessible
discussions and unavailable label definitions as separate coverage states.

## Maintenance

The hub's `Work Taxonomy Audit` workflow reads all open issues and PRs in its own
repository on PR, issue and main-branch events, or manual dispatch. It uses
`scripts/github/audit-work-labels.py` and the existing migration planner. It has
read permissions and makes no label, settings, comment or approval writes.

The JSON artifact records the collection interval, per-record timestamps and
planned actions. Its `result_class` is `conformant`, `policy_drift`,
`coverage_unverified` or `execution_error`. Exit 0 means the observed active
records have one canonical kind. Exit 1 reports missing or conflicting
classification. Exit 2 means source coverage is unverified after an API,
pagination or provider-response failure. Exit 3 means a local dependency,
taxonomy, planner, report or step-summary persistence failure prevented a valid
result. This audit does not verify review evidence, native settings, label
colors, discussions or other systems. It is an additional audit, not a required
merge check unless the effective ruleset is deliberately changed. Event
coverage starts after the workflow is merged; one successful PR run does not
establish fleet adoption.

For an authorized repository, run a read-only audit from this checkout:

```bash
python scripts/github/audit-work-labels.py --repo OWNER/REPO --output /tmp/work-taxonomy-report.json
```

For an existing observation export, use
`python scripts/catalog/plan-work-labels.py observations.json --check`.
Keep private observations and artifacts within their source's access boundary.
The workflow does not collect other repositories. The bug, feature, docs and
security forms add their canonical kind while preserving legacy labels. Prompt
changes require an explicit kind selection and triage label application.
Verify that form label definitions exist before accepting the rollout; a form's
configuration alone does not prove GitHub applied the label.

Run a read-only drift plan weekly during rollout and after taxonomy or integration
changes. Meshal resolves ambiguous classifications and records exceptions. Add a
new kind only for repeated work that the existing vocabulary cannot describe.
Version the vocabulary and migrate consumers before retiring an alias. Pin skill
sources and verify actual execution and review capability before assigning a tool.

See [operating-model.md](operating-model.md) for role rotation and delivery gates,
and [parallel-batch-execution.md](parallel-batch-execution.md) for batch ownership.
Product behavior references: [GitHub labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
and [Linear labels](https://linear.app/docs/labels).
