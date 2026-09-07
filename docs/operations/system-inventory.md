---
type: derived
source: ../governance/operating-model.md
sync: manual
sla: on-change
title: System Inventory Review
description: Public-safe review protocol for provider and runtime inventory
last_updated: 2026-09-07
category: operations
audience: [ai-agents, contributors]
status: active
---

# System Inventory Review

This page defines how to record a dated provider review without creating another
source of truth. It contains no private fleet inventory. Current authority stays
with the records named in the
[operating model](../governance/operating-model.md#source-ownership) and
[work record taxonomy](../governance/work-record-taxonomy.md#field-authority).

## Public boundary

Before adding an observation here:

1. Confirm that the source and result are already public.
2. Link an immutable public revision when one exists.
3. Exclude account, workspace, project, branch, channel, document, user, and
   credential identifiers unless an owning policy explicitly allowlists them.
4. Keep private observations in their approved source system.
5. Treat a connected provider as `UNVERIFIED` until a scoped read succeeds.

The public repository must not become a projection of private provider state.
Notion, Linear, Slack, deployment, database, telemetry, identity, file-store,
calendar, and task-system details remain inside their existing access boundary.

## Authority references

| Concern | Existing authority |
| --- | --- |
| Shared policy and public catalog | [Operating model](../governance/operating-model.md#source-ownership) |
| Repository metadata | [`catalog/index.yaml`](../../catalog/index.yaml) and generated catalog outputs |
| Repository roles under review | [`catalog/governance-decisions.yaml`](../../catalog/governance-decisions.yaml) |
| Shared resource ownership | [Workspace resource map](../governance/workspace-resource-map.md) |
| Agent and integration declarations | [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml) |
| Delivery and field ownership | [Work record taxonomy](../governance/work-record-taxonomy.md#field-authority) |

This audit does not expand or replace those authorities.

## Evidence manifest

Every publishable observation must include the following fields:

| Field | Requirement |
| --- | --- |
| `as_of` | UTC timestamp for the observation |
| `provider` | Public provider or repository surface |
| `object` | Public object name without private identifiers |
| `operation` | Read operation or reproducible command |
| `coverage` | Pagination boundary or explicit sampling rule |
| `result` | `PASS`, `FAIL`, `UNVERIFIED`, `UNAVAILABLE`, or `NOT APPLICABLE` |
| `evidence` | Immutable public URL or repository path and revision |
| `omissions` | Sensitive or unavailable fields deliberately excluded |

Generic provider landing pages do not verify a claim. If durable public evidence
is unavailable, record the result in the private owning system instead.

## Public evidence at this revision

| As of | Provider | Object | Operation | Coverage | Result | Evidence | Omissions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-07T07:25:59Z | GitHub | Agent integration catalog | Read the file at the audited repository revision | Complete file | PASS | [`catalog/agent-integrations.yaml`](https://github.com/alawein/alawein/blob/c6d0a2095646ff32d3ed49717291d3f453a8d207/catalog/agent-integrations.yaml) | Provider secrets and private runtime state |
| 2026-09-07T07:25:59Z | GitHub | Slack agent runbook | Read the file at the audited repository revision | Complete file | PASS | [`slack-agent-runbook.md`](https://github.com/alawein/alawein/blob/c6d0a2095646ff32d3ed49717291d3f453a8d207/docs/governance/slack-agent-runbook.md) | Private workspace state and message history |

## Reverification

Recheck after an authority, integration, provider, or disclosure-policy change.
Preserve the base revision and pagination boundary. A failed read is unknown,
not an empty result, and an observed output does not prove configuration health.
