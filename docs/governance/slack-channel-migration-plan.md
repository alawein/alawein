---
type: canonical
source: none
sync: none
sla: on-change
title: Slack channel migration plan
description: Proposed v2 channel topology for team collaboration and personal agentic workflows; execution plan with rename map and posting guidelines.
last_updated: 2026-09-06
category: governance
audience: [ai-agents, contributors]
status: draft
version: 1.0.0
tags: [slack, channels, agents, migration]
---

# Slack channel migration plan (v2)

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

**Status:** DRAFT. Does not supersede locked channel decisions in
[`slack-agent-runbook.md`](slack-agent-runbook.md) until Phase 1 completes and
the runbook is bumped.

**Goal:** Separate team coordination from personal agent lanes, reduce naming
ambiguity, and route bot noise away from human/agent threads.

## 1. Executive summary

Keep seven current channels through the workflow-bot trial (ends 2026-09-19).
Then execute a phased rename and merge into **10 channels** (6 team + 4 personal)
using `team-` and `me-` prefixes. No new broadcast channels. Agent work moves
to dedicated `#me-agents-*` lanes.

## 2. Naming convention (proposed)

| Prefix | Scope | Examples |
| --- | --- | --- |
| `team-` | Shared work visible to collaborators | `team-eng`, `team-ops` |
| `me-` | Solo founder / personal agent workflows | `me-agents-eng`, `me-job-search` |
| (none) | Avoid for new channels | Legacy `posts`, `social` |

## 3. Target topology

### 3.1 Team workspace

| Channel | Purpose | Members | Posting guidelines |
| --- | --- | --- | --- |
| `#team-general` | Announcements, workspace-wide decisions | Everyone | Low volume; use threads |
| `#team-eng` | Active dev discussion, design, reviews | Engineers + agents (read-only bots) | Link GitHub issues/PRs; no bot digests |
| `#team-eng-alerts` | CI, deploys, GitHub bot notifications | Engineers | Bots only; humans reply in threads on incidents |
| `#team-ops` | Admin, billing, infra, access | Owner + ops | Action items with owner + date |
| `#team-content` | Drafting, editing, publishing pipeline | Content stakeholders | One thread per piece |
| `#team-social` | Social distribution, scheduling | Owner | Links + captions only |

### 3.2 Personal agentic workflow

| Channel | Purpose | Members | Posting guidelines |
| --- | --- | --- | --- |
| `#me-agents-eng` | `@Cursor` code tasks | Owner + Cursor | One task = one thread; repo + goal in first message |
| `#me-agents-ops` | `@Claude` analysis, audits, planning | Owner + Claude Tag | One task = one thread; no canvas dumps |
| `#me-inbox` | Quick captures, links to triage | Owner only | No discussion; weekly sweep to Notion/GitHub |
| `#me-job-search` | Job search | Owner only | Applications, interviews, leads |

## 4. Channel-by-channel actions

| Current | Slack ID | Action | Target |
| --- | --- | --- | --- |
| `all-alawein-workspace` | `C0APE5RSWAZ` | Rename | `team-general` |
| `kohyr-dev` | `C0B9JJZSVQT` | Rename | `team-eng` |
| `admin-ops` | `C0B9SRMDJFK` | Rename | `team-ops` |
| `content-pipeline` | `C0B9R0NS4QJ` | Rename + absorb `posts` | `team-content` |
| `posts` | `C0APWF615H7` | Archive after bot reroute | n/a |
| `social` | `C0AP24SRVQF` | Rename | `team-social` |
| `job-search` | `C0B9NTUUGR4` | Rename | `me-job-search` |
| n/a | n/a | Create | `team-eng-alerts`, `me-agents-eng`, `me-agents-ops`, `me-inbox` |

## 5. Workflow bot rerouting

Before archiving `#posts`, repoint bot outputs:

| Bot | Current output | Target output |
| --- | --- | --- |
| Daily Briefing | `#posts` | `#team-content` (or DM if trial fails) |
| Friday Weekly Review | `#posts` | `#team-content` |
| Monday Weekly Kickoff | `#posts` | `#team-content` |
| Weekly Content Planner | `#content-pipeline` | `#team-content` |
| Daily Agenda | DM | unchanged |

Update `workflow_bots` rows in `catalog/agent-integrations.yaml` after reroute.

## 6. Implementation phases

### Phase 0: Gate (2026-09-19)

- [ ] Workflow-bot engagement trial complete
- [ ] Claude Tag migration complete ([`claude-tag-migration.md`](claude-tag-migration.md))
- [ ] `@Codex` connected or marked dropped in inventory

### Phase 1: Agent lanes (week 1)

1. Create `#me-agents-eng`, `#me-agents-ops`, `#me-inbox`
2. Pin posting guide in each (5 lines max)
3. `/invite @Cursor` to `#me-agents-eng` and `#team-eng` (after rename)
4. Route all agent tasks to thread-per-task pattern

### Phase 2: Team renames (week 2)

1. Rename `admin-ops` → `team-ops`
2. Rename `all-alawein-workspace` → `team-general`
3. Rename `kohyr-dev` → `team-eng`
4. Create `#team-eng-alerts`; point GitHub/CI bots there

### Phase 3: Content merge (week 3)

1. Reroute workflow bots off `#posts`
2. Rename `content-pipeline` → `team-content`
3. Archive `#posts`
4. Rename `social` → `team-social`; `job-search` → `me-job-search`

### Phase 4: Inventory lock (week 4)

1. Update `catalog/agent-integrations.yaml` `slack_channels` + snapshot
2. Bump `slack-agent-runbook.md` to v2 channel lock
3. `validate-agent-integrations.py --write-snapshot --strict`

## 7. Open assumptions

1. **Solo vs team:** plan assumes solo founder with optional future collaborators.
   If team grows, keep `me-*` private and expand `team-*` membership.
2. **Slack rename limits:** renames preserve history; pinned messages and bot
   configs must be re-checked after each rename.
3. **Fireflies:** stays on broadcast channel (`team-general` after rename).

## 8. Related canon

| Doc | Role |
| --- | --- |
| [`slack-agent-runbook.md`](slack-agent-runbook.md) | Current locked policy |
| [`claude-tag-migration.md`](claude-tag-migration.md) | Claude Tag setup |
| [`unified-agent-system.md`](unified-agent-system.md) | Dispatch routing |
