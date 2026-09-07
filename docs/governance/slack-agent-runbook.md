---
type: canonical
source: none
sync: none
sla: on-change
title: Slack agent runbook
description: Locked channel, workflow-bot, and integration governance for the Alawein Slack workspace; source of truth for agent routing and cleanup phases.
last_updated: 2026-09-07
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.5.0
tags: [slack, agents, integrations, workflow-bots, governance]
---

# Slack agent runbook

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This document is the locked governance source for the Alawein Slack workspace.
It supersedes audit narratives posted in `#admin-ops` (2026-09-04 through
2026-09-05).

**Shared session prompt (paste this):**
[`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md) 1.7.0 section "Shared
session prompt". Every Slack agent bot and coding agent uses that block. Do
not fork it. Workflow bots are exempt from this prompt. Paste the full
block only when the kit version changes. Later pings are scoped tasks.

**Evidence baseline:**

- Claude live Slack reads (2026-09-05; 30-day window 2026-08-06 through
  2026-09-05)
- Cursor MCP connector reads (2026-09-05)
- External verification session (2026-09-05; Vercel CLI, Google Drive,
  Gmail search, Notion fetch)
- Cloud Agent rescan 2026-09-06 03:15 UTC (run `bc-8ca615eb-…`):
  `docs/internal/audits/2026-09-06-slack-integrations-rescan.md`
- Cloud Agent rescan 2026-09-05 14:32 UTC (run `bc-01698bb5-…`):
  `docs/internal/audits/2026-09-05-slack-integrations-rescan.md`

## 1. Channel structure and naming

### 1.1 Current channels (locked)

| Channel | Slack ID | Purpose | Cloud Agent read | Tier | Status |
| --- | --- | --- | --- | --- | --- |
| `#admin-ops` | `C0B9SRMDJFK` | Agent command center; ops, infra, cross-tool coordination | yes | Hub (human+agent) | Active |
| `#posts` | `C0APWF615H7` | Bot digest hub for Daily Briefing, Friday Review, Monday Kickoff | yes | Hub (bot-only) | Active |
| `#content-pipeline` | `C0B9R0NS4QJ` | Content strategy; Weekly Content Planner target | yes | Domain | Low use |
| `#kohyr-dev` | `C0B9JJZSVQT` | Kohyr engineering (renamed from morphism-dev) | yes | Domain | Dormant since 2026-06-11 |
| `#job-search` | `C0B9NTUUGR4` | Job and career tracking | yes | Domain | Setup-only |
| `#all-alawein-workspace` | `C0APE5RSWAZ` | Workspace announcements; Fireflies installed | yes | Broadcast | Setup-only |
| `#social` | `C0AP24SRVQF` | Non-work | yes | Default | Empty |

**Planned v2 topology (draft):** see
[`slack-channel-migration-plan.md`](slack-channel-migration-plan.md). Do not
rename channels until Phase 0 gate (2026-09-19) passes.

**Voice exemptions:** workflow bots and system messages are exempt from
[`VOICE.md`](../style/VOICE.md); see
[`slack-voice-exemptions.md`](slack-voice-exemptions.md).

**Claude Tag migration:** see [`claude-tag-migration.md`](claude-tag-migration.md).

### 1.2 Naming convention (locked)

Format: `#<tier-prefix>-<domain>`

- **Hub channels** (no prefix): `admin-ops`, `posts` (cross-cutting coordination).
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

### 1.4 How Meshal calls agents

Command center: `#admin-ops` (`C0B9SRMDJFK`). One task = one thread. Tag
only who must act.

| Who | Slack ID | Call |
| --- | --- | --- |
| `@Cursor` | `U0APW2Z3GG2` | One scoped git task. Search open PRs first. |
| `@Claude` | `U0AQQFJT8AC` | 4 lines. No inventory dump. No emoji status rows. Tag is Meshal-only. |
| `@Computer` | `U0APW7F9S4A` | URL plus completion condition. Cloud-only. |
| `@Notion AI` | `U0AQ8UNAKTK` | Operations Hub / Master Tasks (required Status) / Projects Canonical. |
| `@Kilo` | `U0BV9U2GFED` | `ops-control-plane-grok`, `ai-ops`, `workspace-brain` only. |
| `@Codex` | `U0BV7V8M3NW` | Only after ChatGPT Codex connect. Else skip. |

Never tag on inventory: Daily Agenda, Daily Briefing, Friday Review,
Monday Kickoff, Weekly Content Planner, `@ChatGPT` (`U0BUNH33CCA`,
replaced).

**Correction ping** (two Cursors split the land). Follow-up only. Do not
re-audit. Do not paste a new kit.

```
*Land:* PR #N. Park duplicate PRs.
*Once then stop:* per-lane one-liners.
*Voice:* first line = status. No tables. No second inventory.
```

**4-line post-land ping** (after `#220` squash-merge):

```
@Cursor @Claude @Computer @Kilo @Notion AI @Codex @GitHub
Follow-up only. Kit is AGENT.md 1.7.0 on main.
*Land:* PR #220. Park #223 if it still duplicates.
*Once then stop:* stay in your lane; 4 lines; no re-audit; no new kit paste.
```

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
| Gmail custom labels | `Action/*`, `Project/Alawein`, `System/Linear`, `System/GitHub`, `Subscriptions`, `DevOps`, `AGI (archive)` | Ready | Cursor `list_labels` 2026-09-07; old six-label set gone |
| Google Drive account | `contact@meshal.ai` | Ready | Cursor `list_recent_files` MCP |
| Google Calendar | `contact@meshal.ai` | Ready | Cursor `list_calendars` MCP |
| Railway | `contact@meshal.ai` | Ready | Cursor `whoami` MCP |
| Notion workspace | `contact@meshal.ai` / Meshal's Workspace (`8116d8de-2215-81ce-b71b-00031e833a2d`) | Ready; no prior-employer workspace | `notion-fetch({"id":"self"})` |
| Slack bots in `#admin-ops` | Claude, Cursor, Computer, Notion AI, GitHub, Codex, Kilo (ChatGPT silent) | Present | Inventory thread 2026-09-07; Kilo `U0BV9U2GFED` |
| GitHub (Cursor MCP) | `alawein` | Ready | Cloud Agent `get_me` 2026-09-07 (bc-2953ccca) |

### 3.2 Vercel `alawein` team deployments (locked)

**Total projects verified:** 32 recent deployments.

The 2026-09-04 claim of "two old-job deployments" is **not supported**. Live
enumeration shows a large personal portfolio with eight rows where Vercel
metadata omits source repo or email and therefore cannot be classified without a
browser check.

| Category | Count | Notes |
| --- | --- | --- |
| Personal (`alawein/*`), keep | 18 | Portfolio projects under `alawein` org |
| Kohyr / Morphism, keep | 4 | `kohyr`, `kohyr-wip`, `kohyr-internal`, `morphism` |
| Non-`alawein` org (`menax-inc/menax`), review | 1 | Ownership context unclear |
| UNVERIFIED (missing source metadata), inspect via browser | 8 | `web`, `sam-eval-roadmap`, `dist`, `guides-eval-loop-app`, `graphics-engine`, `kiosk-ipad-app`, `knowledge-base-wiki`, `tech-blog-frontend` |

**Priority browser inspection:** `sam-eval-roadmap` and `guides-eval-loop-app`
are name-suggestive of prior AGI Inc work. Delete if employer-affiliated.

### 3.3 Google Drive external ownership (locked)

Nine `sharedWithMe` items enumerated. Only one AGI-affiliated file:

| File | Owner | Domain | Modified | Action |
| --- | --- | --- | --- | --- |
| Superfine Kitchen Order | `chaitanya@theagi.company` | `theagi.company` | 2026-09-04 | Review or remove access |
| Documents | `mario@kohyr.ai` | `kohyr.ai` | 2026-06-24 | Keep |
| NDA Form (Meshal Alawein) | `adam@sycamore.so` | `sycamore.so` | 2026-05-07 | Keep |
| Meshal.pdf, JD Jan 2026.pdf | `ashley.n@mobiusdtaas.ai` | `mobiusdtaas.ai` | 2026-01-29 | Keep |
| Douglas Frey Departure letter | `lifelongmychart@gmail.com` | UNVERIFIED | 2026-05-22 | Personal, keep |
| Reports examples | `maxim.kunakov@turing.com` | UNVERIFIED | 2026-05-04 | Job-search context, keep |
| BMJ Palettes, Logos | `theblackmalejournal@gmail.com` | UNVERIFIED | 2026-03-16 | Own project, keep |

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

These are legitimate post-employment threads, not label drift. **Done (2026-09-05):**
`AGI (archive)` label created; applied to all four threads; archived from inbox.

### 3.5 Account discipline (locked policy)

- All active integrations authenticate against `contact@meshal.ai`.
- No integration may remain on a prior-employer account.
- New integrations require a governance row in §3.1 before install.
- AGI Inc, `theagi.company`, and AGI-named cloud workspaces are out of
  scope for Alawein and Kohyr work. Do not import, copy, commit, summarize,
  or operate on that material from this workspace. Local copies stay on
  Meshal's machine under `Desktop/AGI`, outside `Desktop/GitHub/alawein`.
  Historical mentions in this runbook stay as evidence. Do not extend them.

## 4. Implementation plan

### Phase 1, Lock (2026-09-05), complete

1. This runbook committed to `alawein/docs/governance/`.
2. Pin reference link in `#admin-ops`.

### Phase 2, Cleanup (week of 2026-09-07 through 2026-09-13)

1. **Vercel:** Browser-inspect eight UNVERIFIED projects; prioritize
   `sam-eval-roadmap` and `guides-eval-loop-app`.
2. **Vercel:** Resolve `tech-blog-frontend` stub (project exists; deployment
   lookup fails).
3. **Google Drive:** Decide on `Superfine Kitchen Order`; remove access if not
   needed.
4. **Gmail:** Done, `AGI (archive)` label (`Label_367`); **22** AGI threads
   labeled and archived; 0 `theagi.company` threads in INBOX (verified
   2026-09-05).
5. **Cursor MCPs:** See [`cursor-mcp-repair.md`](cursor-mcp-repair.md); fix
   GitHub MCP, remove duplicate Slack MCP, repair Supermemory; decide on
   Todoist and Figma.
6. **Claude Tag:** Enable or accept legacy limits.
7. **Cursor Slack access:** Done. Cloud Agent reads all 7 public channels
   (lane C invites 2026-09-05 14:59 through 15:16 UTC; verified 2026-09-06
   rescan).

### Phase 3, Trial (2026-09-05 through 2026-09-19)

1. Bot engagement trial per §2.2.
2. Channel usage trial: post at least once in `#kohyr-dev`, `#content-pipeline`,
   and `#job-search`.

### Phase 4, Review (2026-09-19)

1. Bot review gate; disable zero-engagement bots.
2. Channel review gate; archive persistently empty channels.

## 5. Locked vs draft status

| Section | Status |
| --- | --- |
| §1 Channel structure and decisions | LOCKED |
| §1.4 How Meshal calls agents | LOCKED |
| §2 Workflow bot policy | LOCKED |
| §3.1 Verified integrations (including Notion) | LOCKED |
| §3.2 Vercel deployments | LOCKED (eight UNVERIFIED rows pending browser inspection) |
| §3.3 Google Drive external ownership | LOCKED |
| §3.4 Gmail AGI thread drift | LOCKED |
| §3.5 Account discipline | LOCKED |
| §4 Implementation plan | LOCKED |

## 6. Changelog

### v1.5.0 (2026-09-07)

- Shared session prompt points at `prompt-kits/AGENT.md` 1.7.0.
- Added §1.4 How Meshal calls agents: who to tag, correction ping, and
  4-line post-land ping.

### v1.4.0 (2026-09-07)

- Locked AGI / prior-employer isolation. Local quarantine is `Desktop/AGI`.
- Gmail labels and GitHub Cursor MCP refreshed from the 2026-09-07 probe.
- `@Computer` ready (7/7 including `#posts`). `@Kilo` recorded, three-repo
  GitHub App only.
- Shared session prompt in `prompt-kits/AGENT.md` 1.6.0. Agent bots only.
  Workflow bots stay exempt.

### v1.3.0 (2026-09-06)

- Cursor Cloud Agent read membership: 7/7 public channels (invite sweep
  completed 2026-09-05).
- Cloud Agent GitHub and third-party Slack MCP namespaces now ready; Cursor
  Slack Tools remains canonical for Slack-launched agents.
- Added drift detection: `validate-agent-integrations.py` + snapshot baseline.
- Evidence pointer to `2026-09-06-slack-integrations-rescan.md`.

### v1.2.0 (2026-09-05)

- Recorded Slack channel IDs and Cloud Agent read membership (3 of 7).
- OpenAI Slack surface remapped: `@Codex` (`U0BV7V8M3NW`) replaced silent
  `@ChatGPT` (`U0BUNH33CCA`).
- Cursor invites to `#kohyr-dev` and `#all-alawein-workspace` marked done.
- Evidence pointer to internal rescan audit.

### v1.1.0 (2026-09-05)

- Notion moved DRAFT to LOCKED (`contact@meshal.ai` / Meshal's Workspace).
- Vercel moved DRAFT to LOCKED; corrected "two old-job deployments" claim.
- Google Drive moved DRAFT to LOCKED; one AGI-domain file identified.
- Gmail thread drift moved DRAFT to LOCKED; `AGI (archive)` label applied.
- Committed to `alawein/docs/governance/slack-agent-runbook.md`.
- Superseded as routing SSOT by [`unified-agent-system.md`](unified-agent-system.md) for orchestration; this runbook remains Slack-specific policy.

### v1.0.0 (2026-09-05)

- Initial lock from Claude Slack-side tables and Cursor MCP connector matrix.
