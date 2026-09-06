---
type: canonical
source: none
sync: none
sla: on-change
title: Slack voice exemptions
description: Surfaces exempt from VOICE.md blocking rules in the Alawein Slack workspace.
last_updated: 2026-09-06
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.0.0
tags: [slack, voice, workflow-bots]
---

# Slack voice exemptions

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

Canonical voice contract: [`docs/style/VOICE.md`](../style/VOICE.md). This doc
lists Slack surfaces that intentionally use a different register.

## Exempt surfaces

| Surface | Register | Rationale |
| --- | --- | --- |
| Workflow bots (`#posts`, `#content-pipeline`, DM Daily Agenda) | Personal coaching, emoji, casual prompts | Engagement nudges, not public docs |
| Slack system messages (joins, app installs) | Platform default | Not authored by Meshal |

## Governed surfaces (VOICE applies)

| Surface | Rule |
| --- | --- |
| `#admin-ops` human and agent posts | Lead with claim; tables for evidence; no banned register |
| Future `#me-agents-eng`, `#me-agents-ops` | Same as `#admin-ops` |
| Pinned posting guides | Short, imperative, no hype |

## Notion

Notion pages that ship as long-lived docs should follow `VOICE.md`. Ephemeral
scratch pages and auto-generated briefings are advisory only.
