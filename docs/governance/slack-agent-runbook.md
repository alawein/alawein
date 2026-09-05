---
type: canonical
source: none
sync: none
sla: on-change
title: Slack agent runbook
description: Locked channel, workflow-bot, and integration governance for the Alawein Slack workspace; source of truth for agent routing and cleanup phases.
last_updated: 2026-09-05
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.1.0
tags: [slack, agents, integrations, workflow-bots, governance]
---

# Slack agent runbook

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This document is the locked governance source for the Alawein Slack workspace.
It supersedes audit narratives posted in `#admin-ops` (2026-09-04 through
2026-09-05).

**Evidence baseline:**

- Claude live Slack reads (2026-09-05; 30-day window 2026-08-06 through
  2026-09-05)
- Cursor MCP connector reads (2026-09-05)
- External verification session (2026-09-05; Vercel CLI, Google Drive,
  Gmail search, Notion fetch)

## 1. Channel structure and naming

### 1.1 Current channels (locked)

| Channel | Purpose | 30d msgs | Tier | Status |
| --- | --- | --- | --- | --- |
| `#admin-ops` | Agent command center; ops, infra, cross-tool coordination | ~21 | Hub (human+agent) | Active |
| `#posts` | Bot digest hub for Daily Briefing, Friday Review, Monday Kickoff | ~40 | Hub (bot-only) | Active |
| `#content-pipeline` | Content strategy; Weekly Content Planner target | 6 | Domain | Low use |
| `#kohyr-dev` | Kohyr engineering | 0 | Domain | Dormant since 2026-06-11 |
| `#job-search` | Job and career tracking | 1 | Domain | Setup-only |
| `#all-alawein-workspace` | Workspace announcements | 1 | Broadcast | Setup-only |
| `#social` | Non-work | 0 | Default | Empty |

### 1.2 Naming convention (locked)

Format: `#<tier-prefix>-<domain>`

- **Hub channels** (no prefix): `admin-ops`, `posts` — cross-cutting coordination.
- **Domain channels** (`#dev-*`, `#work-*`, `#content-*`): one project or workstream.
- **Personal/admin** (`#personal-*`): out of scope for professional automation.
- **Broadcast** (`#all-*`): Slack default; do not create additional broadcast channels.

### 1.3 Channel decisions (locked)

| Channel | Decision | Rationale |
| --- | --- | --- |
| `#admin-ops` | Keep as primary agent command center | Only channel with live human and agent traffic |
| `#posts` | Keep as bot digest hub | Working output target for four of five workflow bots |
| `#content-pipeline` | Keep | Weekly Content Planner fires here |
| `#kohyr-dev` | Keep; review in 30 days | Intended-use channel; dormant, not dead |
| `#job-search` | Keep; review in 30 days | Intended-use; unused |
| `#all-alawein-workspace` | Keep | Slack default broadcast |
| `#social` | Keep | Slack default; low overhead |

## 2. Workflow bot policy

### 2.1 Bot inventory (locked)

| Bot | Schedule | Output | Last fire | Engagement 30d | Decision |
| --- | --- | --- | --- | --- | --- |
| Daily Agenda | Daily 08:00 | DM | 2026-09-04 | 0 replies | Keep; 14-day trial |
| Daily Briefing | Daily 09:00 | `#posts` | 2026-09-04 | 0 replies | Keep (primary digest) |
| Friday Weekly Review | Fri 16:00 | `#posts` | 2026-09-04 | 0 replies | Keep |
| Monday Weekly Kickoff | Mon 09:00 | `#posts` | 2026-08-31 | 0 replies | Keep |
| Weekly Content Planner | Weekly 09:00 | `#content-pipeline` | 2026-08-31 | 0 replies | Keep |

All five bots are technically healthy. Zero engagement is a usage problem, not a
health problem.

### 2.2 Engagement policy (locked)

- **Trial window:** 2026-09-05 through 2026-09-19 (14 days).
- **Requirement:** reply to or react to at least one prompt per bot per week.
- **Review gate (2026-09-19):** bots with zero engagement are disabled, not
  deleted.
- **No new workflow bots** until the existing five pass the trial.

### 2.3 Output routing (locked)

- `#posts` is the single digest hub.
- Bot DMs are install sockets, not output channels.

## 3. Integration governance map

### 3.1 Verified integrations (locked)

| Integration | Account | Status | Evidence |
| --- | --- | --- | --- |
| Slack workspace | `contact@meshal.ai` (U0APM5W630C) | Ready | Claude live channel and DM reads |
| Gmail account | `contact@meshal.ai` | Ready | Cursor `list_labels` MCP |
| Gmail custom labels (5) | `✈️ Travel`, `📋 Docs`, `💳 Finance/Billing`, `Blocked`, `Notion` | Clean | Cursor `list_labels` MCP |
| Google Drive account | `contact@meshal.ai` | Ready | Cursor `list_recent_files` MCP |
| Google Calendar | `contact@meshal.ai` | Ready | Cursor `list_calendars` MCP |
| Railway | `contact@meshal.ai` | Ready | Cursor `whoami` MCP |
| Notion workspace | `contact@meshal.ai` / Meshal's Workspace (`8116d8de-2215-81ce-b71b-00031e833a2d`) | Ready; no prior-employer workspace | `notion-fetch({"id":"self"})` |
| Slack bots in `#admin-ops` | Claude, Cursor, Computer, Notion AI, GitHub for Slack, ChatGPT | Present | Claude channel membership |
| GitHub (Cursor MCP) | — | Error (`gh` CLI works) | Cursor MCP discovery failure |

### 3.2 Vercel `alawein` team deployments (locked)

**Total projects verified:** 32 recent deployments.

The 2026-09-04 claim of "two old-job deployments" is **not supported**. Live
enumeration shows a large personal portfolio with eight rows where Vercel
metadata omits source repo or email and therefore cannot be classified without a
browser check.

| Category | Count | Notes |
| --- | --- | --- |
| Personal (`alawein/*`) — keep | 18 | Portfolio projects under `alawein` org |
| Kohyr / Morphism — keep | 4 | `kohyr`, `kohyr-wip`, `kohyr-internal`, `morphism` |
| Non-`alawein` org (`menax-inc/menax`) — review | 1 | Ownership context unclear |
| UNVERIFIED (missing source metadata) — inspect via browser | 8 | `web`, `sam-eval-roadmap`, `dist`, `guides-eval-loop-app`, `graphics-engine`, `kiosk-ipad-app`, `knowledge-base-wiki`, `tech-blog-frontend` |

**Priority browser inspection:** `sam-eval-roadmap` and `guides-eval-loop-app`
are name-suggestive of prior AGI Inc work. Delete if employer-affiliated.

### 3.3 Google Drive external ownership (locked)

Nine `sharedWithMe` items enumerated. Only one AGI-affiliated file:

| File | Owner | Domain | Modified | Action |
| --- | --- | --- | --- | --- |
| Superfine Kitchen Order | `chaitanya@theagi.company` | `theagi.company` | 2026-09-04 | Review or remove access |
| Documents | `mario@kohyr.ai` | `kohyr.ai` | 2026-06-24 | Keep |
| NDA Form — Meshal Alawein | `adam@sycamore.so` | `sycamore.so` | 2026-05-07 | Keep |
| Meshal.pdf, JD Jan 2026.pdf | `ashley.n@mobiusdtaas.ai` | `mobiusdtaas.ai` | 2026-01-29 | Keep |
| Douglas Frey Departure letter | `lifelongmychart@gmail.com` | UNVERIFIED | 2026-05-22 | Personal — keep |
| Reports examples | `maxim.kunakov@turing.com` | UNVERIFIED | 2026-05-04 | Job-search context — keep |
| BMJ Palettes, Logos | `theblackmalejournal@gmail.com` | UNVERIFIED | 2026-03-16 | Own project — keep |

**Shared drives:** only `bell-inequality-analysis` is accessible. No
prior-employer shared drives.

### 3.4 Gmail AGI thread drift (locked)

Four active AGI-domain threads (last 90 days, inbox, no user labels):

| Subject | Domain |
| --- | --- |
| Re: Trial expenses + consulting fee | `theagi.company` |
| Re: Convention (GitHub) | `theagi.company` |
| Updated invitation: Meshal E-Verify @ Jul 17 | `theagi.company` |
| Re: Action Required: AGI Employee Handbook Acknowledgement | `theagi.company` |

Query: `in:inbox after:2026-06-07 has:nouserlabels from:theagi.company`

These are legitimate post-employment threads, not label drift. **Action:** create
`AGI (archive)` label, apply to all four, archive from inbox.

### 3.5 Account discipline (locked policy)

- All active integrations authenticate against `contact@meshal.ai`.
- No integration may remain on a prior-employer account.
- New integrations require a governance row in §3.1 before install.

## 4. Implementation plan

### Phase 1 — Lock (2026-09-05) — complete

1. This runbook committed to `alawein/docs/governance/`.
2. Pin reference link in `#admin-ops`.

### Phase 2 — Cleanup (week of 2026-09-07 through 2026-09-13)

3. **Vercel:** Browser-inspect eight UNVERIFIED projects; prioritize
   `sam-eval-roadmap` and `guides-eval-loop-app`.
4. **Vercel:** Resolve `tech-blog-frontend` stub (project exists; deployment
   lookup fails).
5. **Google Drive:** Decide on `Superfine Kitchen Order`; remove access if not
   needed.
6. **Gmail:** Create `AGI (archive)` label; apply to four identified threads;
   archive.
7. **Cursor MCPs:** Fix GitHub MCP; remove duplicate Slack MCP; repair
   Supermemory; decide on Todoist and Figma.
8. **Claude Tag:** Enable or accept legacy limits.
9. **Cursor Slack access:** Invite `@Cursor` to `#kohyr-dev` and
   `#all-alawein-workspace`.

### Phase 3 — Trial (2026-09-05 through 2026-09-19)

10. Bot engagement trial per §2.2.
11. Channel usage trial: post at least once in `#kohyr-dev`, `#content-pipeline`,
    and `#job-search`.

### Phase 4 — Review (2026-09-19)

12. Bot review gate; disable zero-engagement bots.
13. Channel review gate; archive persistently empty channels.

## 5. Locked vs draft status

| Section | Status |
| --- | --- |
| §1 Channel structure and decisions | LOCKED |
| §2 Workflow bot policy | LOCKED |
| §3.1 Verified integrations (including Notion) | LOCKED |
| §3.2 Vercel deployments | LOCKED (eight UNVERIFIED rows pending browser inspection) |
| §3.3 Google Drive external ownership | LOCKED |
| §3.4 Gmail AGI thread drift | LOCKED |
| §3.5 Account discipline | LOCKED |
| §4 Implementation plan | LOCKED |

## 6. Changelog

### v1.1.0 (2026-09-05)

- Notion moved DRAFT to LOCKED (`contact@meshal.ai` / Meshal's Workspace).
- Vercel moved DRAFT to LOCKED; corrected "two old-job deployments" claim.
- Google Drive moved DRAFT to LOCKED; one AGI-domain file identified.
- Gmail thread drift moved DRAFT to LOCKED; reframed as missing archive label.
- Committed to `alawein/docs/governance/slack-agent-runbook.md`.

### v1.0.0 (2026-09-05)

- Initial lock from Claude Slack-side tables and Cursor MCP connector matrix.
