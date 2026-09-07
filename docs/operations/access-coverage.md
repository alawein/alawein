---
type: derived
source: ../governance/work-record-taxonomy.md
sync: manual
sla: on-change
title: Access Coverage Review
description: Public-safe method for recording demonstrated integration coverage
last_updated: 2026-09-07
category: operations
audience: [ai-agents, contributors]
status: active
---

# Access Coverage Review

This review distinguishes connector capability, demonstrated access, and user
authorization. It is not an access registry and does not grant permission.

## Coverage states

| State | Meaning |
| --- | --- |
| Exposed | A tool advertises the operation; authorization is not proven |
| Demonstrated | A scoped operation succeeded for the recorded identity and time |
| Partial | Sampling, pagination, payload, or privacy limits remain |
| Unavailable | The operation is not exposed or a safe test is impossible |
| Blocked | Authentication, authorization, or provider failure prevented a read |
| Excluded | The audit deliberately avoided sensitive content |

Use separate fields for read exposure, demonstrated read, write exposure, and
write authorization. Never infer write authorization from a connector schema or
an owner role. An empty successful response differs from a failed read.

## Public reporting boundary

Public records may describe the method and public repository evidence. Keep the
following details in their approved private system:

- private repository inventory and content visibility;
- workspace, account, project, branch, channel, document, and user identifiers;
- private message, session, issue, deployment, database, and file metadata;
- credentials, environment values, logs, payloads, and personal records;
- inferred permissions that were not directly demonstrated.

For the canonical field and routing rules, use the
[operating model](../governance/operating-model.md#source-ownership) and
[work record taxonomy](../governance/work-record-taxonomy.md#field-authority).

## Review record

A private coverage record should capture provider, actor, object, operation,
timestamp, result, pagination boundary, omitted data, evidence location, and
approval scope. Public publication requires a separate disclosure review and an
immutable public evidence reference.

## Safety rules

- Prefer metadata over content when metadata answers the question.
- Do not retrieve secrets or environment values for inventory work.
- Do not enumerate personal records to test system health.
- Do not download artifacts merely to prove that a download operation exists.
- Preserve cursors when a scan stops before exhaustion.
- Treat ranked search as a sample, never as proof of absence.
