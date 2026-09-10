---
type: canonical
source: none
sync: none
sla: on-change
title: Control plane
description: Thin evidence-first delegation contract for admission, run envelopes, receipts, and recovery
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.0.0
last_updated: 2026-09-10
tags: [governance, control-plane, evidence, admission]
---

# Control plane

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This repository is a thin, evidence-first delegation layer. It is not an
autonomous manager and not a memory system. Native systems stay authoritative.
The control-gap problem is disagreement among policy, registries, prompts,
permissions, deployed versions, and real executions, without a reliable way to
detect or recover.

## What this is not

- A second inventory. Agent and Slack facts stay in
  [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml)
  and [`unified-agent-system.md`](unified-agent-system.md).
- A second task backlog. Work state stays on GitHub Issues until a recorded
  Linear cutover ([`work-record-taxonomy.md`](work-record-taxonomy.md)).
- An orchestration platform. Add one only after measured coordination friction
  justifies it.
- A grant of access. Tool availability, MCP readiness, and a pasted prompt do
  not authorize a write.

## Native authority

| Concern | Authoritative system | Control-plane role |
| --- | --- | --- |
| Code, enforcement, CI, PRs, releases | GitHub | Admission, evidence, recovery status |
| Work state and decisions after cutover | Linear (GitHub Issues until then) | Link, do not copy |
| Strategy briefs and onboarding | Notion | Link, do not become the ADR writer |
| Binary artifacts | Drive | Pointer only |
| External commitments | Gmail and Calendar | Metadata queries; Meshal sends |
| Credentials | Secrets manager (1Password, GitHub secrets) | Names and presence, never values |

Field writers are defined in
[`work-record-taxonomy.md`](work-record-taxonomy.md#field-authority).
Do not invent a parallel registry.

## What the control plane owns

- Admission checks (can this run start).
- Scoped approvals (who authorized which write set, until when).
- Run envelopes (target IDs, base revisions, expiry, one-attempt rules).
- Policy and version references (what was loaded, not only what is committed).
- Budgets (public posts, mutations, retries).
- Receipts (what executed, what was read back).
- Readback verification (native IDs after the write).
- Recovery status (rollback or compensation, or not required).

Roles, delivery path, and reviewer rotation stay in
[`operating-model.md`](operating-model.md).

## Mutation lifecycle

Every mutation uses this sequence. A skipped step stays unverified.

1. **proposed:** named targets, base revisions, write set, expiry.
2. **authorized:** Meshal (or a recorded delegated manifest) scoped the write.
3. **executed:** one attempt under that authorization.
4. **verified:** readback against native IDs on the owning system.
5. **accepted:** Meshal records the outcome. Prepared, published, and accepted
   stay distinct ([change evidence](work-record-taxonomy.md#change-evidence)).

Required on the envelope: target IDs, base revisions, expiry, `one_attempt`,
and an explicit rollback or compensation path (or `not_required` for reads).

Read-only jobs are still envelopes. Label them `observed` and `write_set:
none`. Do not call an unverified read "read-only complete."

## Control levels

| Level | Meaning | Example |
| --- | --- | --- |
| observed | Visible. No bounded write. | Slack canvas read, catalog `--check` |
| managed | Bounded submission and reconciliation under an envelope | Draft PR, catalog land after search |
| enforced | Restricted credentials and an unavoidable native gate | Branch protection, required checks, secret store |

Do not call an independently credentialed agent `enforced`. A Cloud or Slack
bot with its own token is `managed` at most. `enforced` requires a native
restriction the agent cannot bypass (for example GitHub rulesets, or a secret
the agent never holds).

## Version what actually ran

Record all of the following on the envelope or receipt. A committed SHA alone
is not enough.

- Prompt identity and **loaded** revision (kit version or file hash as loaded).
- Policy identity and loaded revision.
- Adapter (Cursor Cloud, Claude Code, Slack bot, workflow).
- Environment (repo set, unnamed Personal env, Windows GAP).
- Model identity as observed, not as a capability claim.
- Inputs and outputs as native IDs.
- Loaded revision versus committed revision. If they differ, say so.

A generated summary, canvas fold, or content hash is weaker than a native ID
(PR number, commit SHA, canvas file ID, issue number). Hashes may accompany
evidence. They must not be the only evidence that a phase reached `verified`
or `accepted`.

## Executors and reviewers

One executor per overlapping write set. A second writer on the same files is
a control-gap, not parallelism.

Add a reviewer only for an independent check or a materially different failure
mode. The executor cannot certify its own work as independent review. Record
unavailable review as not performed
([operating-model.md](operating-model.md#people-and-agents)).

## Consolidation before expansion

Establish these before adding agents, canvases, or platforms:

1. One intake route (`#admin-ops` or this Slack DM for Slack-launched git work).
2. One default execution and review path (operating-model rotation).
3. One owner per field (taxonomy).
4. Ask-before-write defaults.
5. A small number of end-to-end governed runs with a tested recovery.

Do not add a second catalog, Canvas SSOT, `TASKS.md`, or MAIOS Slack app to
close a control gap.

## Machine check

Envelope files use [`schemas/run-envelope.schema.json`](../../schemas/run-envelope.schema.json).
Validate with:

```bash
python scripts/catalog/validate_run_envelope.py --check
python scripts/catalog/validate_run_envelope.py path/to/envelope.yaml
```

The checker validates each supplied envelope offline. It reports invalid
structure, missing completed-run evidence, malformed or timezone-less timestamps,
recorded execution after expiry, self-reported repeat execution under
`one_attempt`, illegal `enforced` declarations, and insufficient readback.
It fails closed when schema validation is unavailable. Schema errors are
returned before semantic checks.

Executed and later phases require execution time, recovery status, policy and
prompt identities with loaded revisions, observed model product, and native-ID
inputs and outputs. Verified and accepted readback rows must each have a native
ID and a result of `readable`, `matched`, `verified`, `succeeded`, `passed`, or
`ok` (case-insensitive). Other results cannot establish verified status.
Accepted records also require the existing `by`, `at`, and `revision` fields;
acceptance time cannot precede execution.

This is not a pre-write admission hook, a durable replay store, or an
identity authenticator. It does not compare an unexecuted grant to the current
clock, spend credentials, read native systems, authenticate Meshal, or establish
that a declared native gate is actually unavoidable. Historical receipts can
remain valid after their authorization expires if their recorded execution was
within its scope. Independently credentialed or unknown executors cannot be
labeled `enforced`, even if a payload claims an unbypassable gate.

Passing validation establishes only the checked properties of the supplied
envelope. Native approval, current revisions, runtime isolation, and live
admission must be verified separately. A passing check is not acceptance.

## Related canon

| Doc | Still owns |
| --- | --- |
| [`operating-model.md`](operating-model.md) | Roles, delivery path, Linear pilot |
| [`work-record-taxonomy.md`](work-record-taxonomy.md) | Field writers, change-evidence table |
| [`unified-agent-system.md`](unified-agent-system.md) | Inventory and Slack dispatch |
| [`credential-hygiene.md`](credential-hygiene.md) | Secret storage rules |
| [`access-coverage.md`](../operations/access-coverage.md) | Demonstrated vs advertised access |
| [`parallel-batch-execution.md`](parallel-batch-execution.md) | Multi-repo manifests |
| [`anti-rot.md`](anti-rot.md) | Unverified-done and debt homes |
