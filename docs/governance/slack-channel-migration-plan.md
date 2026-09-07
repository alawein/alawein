---
type: canonical
source: none
sync: none
sla: on-change
title: Slack channel migration plan
description: Proposed v2 channel topology for team collaboration and personal agentic workflows; execution plan with rename map and posting guidelines.
last_updated: 2026-09-07
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.2.0
tags: [slack, channels, agents, migration]
---

# Slack channel migration plan (v2)

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

**Status:** ACTIVE. Date hold lifted 2026-09-07. The runbook is the lock.
This file is the remaining Slack UI sequence.

**Goal:** Separate Cursor code work from Claude analysis, kill unused bot
digests, and only rename when a name still confuses. Do not grow an empty
10-channel sidebar.

## 1. Executive summary

Create two agent lanes now. Disable the five zero-engagement workflow bots.
Skip `#me-inbox` (Notion Master Tasks) and `#team-eng-alerts` (no GitHub
subscribe yet). Rename the rest only when useful. No new broadcast channels.

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
| `#me-job-search` | Job search | Owner only | Applications, interviews, leads |

Do not create `#me-inbox`. Captures go to Notion Master Tasks.

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
| n/a | `C0BVDBHLXQB` | Created 2026-09-07 | `me-agents-eng` |
| n/a | `C0BVDBHPB99` | Created 2026-09-07 | `me-agents-ops` |
| n/a | n/a | Skip | `me-inbox`, `team-eng-alerts` |

## 5. Workflow bot disable

Do not reroute. Disable in Slack Workflow Builder (Computer or Meshal):

- Daily Agenda
- Daily Briefing (Notion already owns the morning brief)
- Friday Weekly Review
- Monday Weekly Kickoff
- Weekly Content Planner

Keep the workflow records for one week, then delete if nothing else called
them. Update `workflow_bots` rows to `disable` after the UI click.

## 6. Implementation phases

### Phase 0: Gate, lifted 2026-09-07

- [x] Calendar hold removed
- [x] Bot trial closed (0 engagement)
- [ ] Claude Tag pairing (human admin; not a date gate)
- [ ] `@Codex` connected or marked dropped

### Phase 1: Agent lanes, in progress

1. [x] Create `#me-agents-eng` (`C0BVDBHLXQB`) and `#me-agents-ops` (`C0BVDBHPB99`)
2. [ ] `/invite @Cursor` in `#me-agents-eng`
3. [ ] `/invite @Claude` and `@Computer` in `#me-agents-ops`
4. Route new agent tasks to those channels. One task = one thread.

### Phase 2: Slack UI cleanup (Computer)

1. Disable the five workflow bots
2. Mute `#social`; set `#posts` to mentions until archive
3. Archive `#posts` after one quiet day
4. Optional renames only if a name still confuses. Do not rename
   `#admin-ops` while it is the live hub.

### Phase 3: Optional later

1. Rename `kohyr-dev` → `team-eng` when that channel has real traffic
2. Create `#team-eng-alerts` only when `/github subscribe` is configured
3. Rename `job-search` → `me-job-search` if you start using it

### Phase 4: Inventory lock

1. After invites, set `cursor_can_read: true` on the new rows
2. `python3 scripts/catalog/validate-agent-integrations.py --write-snapshot --strict`

## 7. Open assumptions

1. **Solo vs team:** plan assumes solo founder with optional future collaborators.
   If team grows, keep `me-*` private and expand `team-*` membership.
2. **Slack rename limits:** renames preserve history; pinned messages and bot
   configs must be re-checked after each rename.
3. **Fireflies:** stays on broadcast channel (`team-general` after rename).
4. **Memory:** one recall lane later, not a second inventory. Git stays
   policy SSOT. Notion stays non-code tasks. Slack stays coordination.
5. **Laptop Slack gateways:** Hermes Agent and OpenClaw stay off Slack until
   a new human decision, and only if Cursor plus Claude Tag still leave a
   laptop-daemon gap. Do not install another chat bot without that ask.

## 8. Memory, custom bots, and AI-OS field notes (2026-09-07)

Research input, not an install list. Do not create a second
control plane. This workspace already has git SSOT, validators, and an
asymmetric agent fleet.

### 8.1 Shared memory

| Product | Fit | Verdict for Alawein |
| --- | --- | --- |
| Supermemory | Hosted MCP already in Cloud discovery; engine not fully OSS | Catalog + [`cursor-mcp-repair.md`](cursor-mcp-repair.md) leave it dropped. Cloud discovery still errors. Re-auth only if Meshal wants preference/session recall. If re-authenticated, it must not import, copy, commit, summarize, or operate on AGI Inc, `theagi.company` accounts, or AGI-named cloud workspaces. No secrets. No inventory. |
| Mem0 | Drop-in vector memory API; OpenMemory MCP | Skip. Second SSOT. |
| Letta (ex-MemGPT) | Self-managed memory OS; Slack/Telegram channels exist | Heavier than needed. Competes with git + Slack lanes. |
| Zep / Graphiti | Temporal knowledge graph | Skip unless a future product needs point-in-time facts. |
| Cognee | Graph/RAG memory | Skip. Same second-SSOT risk. |

If a recall lane is added later: one vendor, scoped local vs org, Meshal
allowlist. It must not import, copy, commit, summarize, or operate on AGI
Inc, `theagi.company` accounts, or AGI-named cloud workspaces. No secrets.
No write-back that overrides git.

### 8.2 Hermes and custom Slack bots

| Option | What it is | Verdict |
| --- | --- | --- |
| Hermes Agent (Nous) | Self-hosted Slack gateway (Socket Mode), self-writing skills, persistent memory | Hold. If ever: separate Slack app, laptop or VPS. Fail-closed ingress: `SLACK_ALLOWED_USERS` = Meshal only, `SLACK_ALLOWED_CHANNELS` = `C0BVDBHPB99` (`#me-agents-ops`), Messages Tab DMs off. Do not deploy until both gates are tested. No AGI material. |
| OpenClaw | Local gateway across Slack and other messengers | Same hold. Fail-closed channel allowlist and DM deny-by-default must be documented and tested before deploy. Better as a laptop daemon than a second Slack personality. |
| Custom Slack bot / agent | New app in this workspace | Do not deploy. Existing bot noise is already the problem. |
| `@Kilo` | Already installed; Cloud Agent sessions on three non-control-plane repos | Keep. Do not expand the GitHub App to `alawein/alawein` without a human ask. |

Standing rule remains: do not install Grok or another chat bot in Slack
without a new human decision.

### 8.3 AI-OS / self-improving field (critique)

Coding agents already in use: Cursor, Claude Code, Codex (needs ChatGPT
connect). Do not replace them with a marketed "AI OS."

| Cluster | Examples | Use here |
| --- | --- | --- |
| Coding agents | Cursor, Claude Code, Codex, OpenHands, Devin, SWE-agent | Keep current trio. OpenHands/Devin are extra coding runtimes, not a Slack OS. |
| Self-hosted gateways | Hermes Agent, OpenClaw, Agent Zero, CoWork-OS | Evaluate only if a laptop-always-on gap remains. New human decision required. |
| Managed work agents | Lindy, Manus (now Meta), ChatGPT Agent, Claude Cowork/Tag, Genspark, Dust | Claude Tag is the open human admin step. Do not add a parallel work-agent SaaS. |
| Memory layers | Supermemory, Mem0, Letta, Zep/Graphiti, Cognee | See §8.1. One lane or none. |
| Governance overlays | PlantoOS/Medhara, Apotheon AIOS | Marketing control planes. This repo already owns policy, inventory, and validators. Do not adopt a second control plane. |

Practical sequence: disable the five bots; invite Cursor and Claude into
the new lanes; fix Claude Tag and Codex connect; keep `@Kilo` scoped;
leave Hermes and OpenClaw uninstalled unless Cursor plus Claude still
cannot cover a laptop daemon.

## 9. Related canon

| Doc | Role |
| --- | --- |
| [`slack-agent-runbook.md`](slack-agent-runbook.md) | Current locked policy |
| [`claude-tag-migration.md`](claude-tag-migration.md) | Claude Tag setup |
| [`unified-agent-system.md`](unified-agent-system.md) | Dispatch routing |
| [`cursor-mcp-repair.md`](cursor-mcp-repair.md) | Supermemory left dropped |
