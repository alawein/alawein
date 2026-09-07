---
type: canonical
source: none
sync: none
sla: none
title: Admin-ops integration checklist
description: Pointers to the integration inventory, Slack policy, and Projects sync runbook.
last_updated: 2026-09-06
category: operations
audience: [ai-agents, contributors]
status: active
---

# Admin-ops integration checklist

Use the existing sources for each concern:

- Integration inventory: [catalog/agent-integrations.yaml](../../catalog/agent-integrations.yaml).
- Slack behavior, ownership, and approval gates: [Slack agent runbook](../governance/slack-agent-runbook.md).
- Projects synchronization: [Notion Projects runbook](notion-projects-database.md).
- Project sync versus activity reporting: [sync glossary](github-notion-sync-glossary.md).

Record connection evidence for the specific runtime, workspace, tested read,
timestamp, and result. An installed app or successful schema validation does
not prove runtime access. Start with a safe read, without test messages or
new records.

Keep channel migrations behind the existing September 19 review gate. Use the
[Claude Tag migration runbook](../governance/claude-tag-migration.md) for its
prerequisites. Access changes, credential work, and destructive cleanup need
their own explicit scope and approval. This checklist does not authorize them.
