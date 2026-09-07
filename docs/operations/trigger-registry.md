---
type: derived
source: ../governance/slack-agent-runbook.md
sync: manual
sla: on-change
title: Trigger Registry Review
description: Public-safe review protocol for scheduled and event-driven workflows
last_updated: 2026-09-07
category: operations
audience: [ai-agents, contributors]
status: active
---

# Trigger Registry Review

This page defines how to review automation without publishing a private trigger
registry. It does not execute, schedule, disable, or repair workflows.

## Existing authorities

- Public agent and integration declarations:
  [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml).
- Slack governance and review gates:
  [Slack agent runbook](../governance/slack-agent-runbook.md).
- Work state and field ownership:
  [operating model](../governance/operating-model.md#source-ownership).
- Private trigger details: the existing owning provider and approved private
  operations record.

An output message proves only that an output was observed. It does not prove the
current definition, schedule, enablement, ownership, permission scope, failure
history, or rollback readiness.

## Required private record

Each trigger record must include:

- provider object ID and evidence URL;
- stable input and defined output;
- named owner and authority boundary;
- credential reference only, never a secret value;
- expected cadence or event;
- last successful immutable evidence;
- failure signal and known failure mode;
- disable and rollback path;
- review date and lifecycle state;
- pagination or sampling boundary;
- separately recorded configuration and output evidence.

## Public projection

Publish a trigger row only when its fields and evidence are already public and
the disclosure policy allows it. Otherwise, publish the governing contract and
keep the record private. Generic provider pages and mutable output links are not
durable proof.

## Adoption gate

Do not add an agent or workflow until it has stable input, defined output, a
named owner, a measurable benefit, a known failure mode, and no simpler existing
solution. Do not disable a workflow from missing output alone.
