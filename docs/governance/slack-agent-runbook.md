---
type: canonical
source: none
sync: none
sla: on-change
title: Slack agent runbook
description: Channel, workflow-bot, and integration governance for the Alawein Slack workspace; source of truth for agent routing and the 2026-09-06 rename map.
last_updated: 2026-09-06
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.3.0
tags: [slack, agents, integrations, workflow-bots, governance]
---

# Slack agent runbook

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This document is the locked governance source for the Alawein Slack workspace.
It supersedes audit narratives in `#admin-ops` (2026-09-04 through 2026-09-05)
and the Sept 5 keep-all-names lock.

**Live Slack map (2026-09-06):**

- Canvas: [Alawein Slack Map (v1.3)](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0BV7PDBJT0)
- Channel list: [Slack Channel Registry](https://alaweinworkspace.slack.com/lists/T0APHHXJV4J/F0BV9M3BEAW)
- Integration list: [Slack Integration Registry](https://alaweinworkspace.slack.com/lists/T0APHHXJV4J/F0BUUASKHT9)

**Evidence baseline:**

- Cloud Agent membership read 2026-09-06 (Cursor in all 7 public channels)
- Claude live Slack reads (2026-09-05; 30-day window 2026-08-06 through
  2026-09-05)
- Cursor MCP connector reads (2026-09-05 and 2026-09-06)
- Prior lock: `docs/internal/audits/2026-09-05-slack-integrations-rescan.md`

## 1. Channel structure and naming

### 1.1 Current channels (live names)

Seven public channels. One archived (`#morphism`, `C0AQP5NMU11`). No private
channels.

| Current name | Slack ID | Purpose | Cursor read | Tier | Status |
| --- | --- | --- | --- | --- | --- |
| `#admin-ops` | `C0B9SRMDJFK` | Agent command center; ops, infra, billing | yes | Hub (human+agent) | Active |
| `#posts` | `C0APWF615H7` | Bot digest hub | yes | Hub (bot-only) | Active |
| `#content-pipeline` | `C0B9R0NS4QJ` | Content drafts; Weekly Content Planner | yes | Domain | Low use |
| `#kohyr-dev` | `C0B9JJZSVQT` | Engineering (renamed from morphism-dev) | yes | Domain | Dormant since 2026-06-11 |
| `#job-search` | `C0B9NTUUGR4` | Job and career tracking | yes | Domain | Setup-only |
| `#all-alawein-workspace` | `C0APE5RSWAZ` | Workspace announcements | yes | Broadcast | Setup-only |
| `#social` | `C0AP24SRVQF` | Non-work | yes | Default | Empty |

Do not create a second channel for a rename. Edit the existing channel name so
history stays put.

### 1.2 Naming convention (locked 2026-09-06)

Hubs and domains use one short word. Add a prefix only when a second project
needs its own room (`#dev-<slug>`). Do not open a new channel until a
workstream has three or more threads in a hub.

Do not add `#agents`. Ops is the command center. Do not split digest into
per-bot channels.

### 1.3 Rename map (locked, pending Slack UI)

| Current | Rename to | Topic to set | Purpose to set |
| --- | --- | --- | --- |
| `#admin-ops` | `#ops` | Infra, billing, domains, and agent command | Human plus agent hub. Route cross-tool work here. |
| `#posts` | `#digest` | Scheduled bot output only | Daily Briefing, Monday Kickoff, Friday Review. Do not draft here. |
| `#content-pipeline` | `#content` | Drafts and publishing | LinkedIn, X, blog, Weekly Content Planner. |
| `#kohyr-dev` | `#eng` | Engineering for Kohyr and siblings | PRs, architecture, GitHub notifications. |
| `#job-search` | `#career` | Applications and role research | Interviews, Turing, Mercor, founder track. |
| `#all-alawein-workspace` | `#announce` | Workspace broadcasts only | Decisions and releases. No thread work. |
| `#social` | `#social` | Non-work | Keep for later teammates. Mute if unused. |

How to rename: open the channel, click the name, edit name, paste topic and
purpose. Slack IDs do not change.

### 1.4 Channel decisions (locked)

| Channel | Decision | Rationale |
| --- | --- | --- |
| `#admin-ops` | Keep; rename to `#ops` | Only channel with live human and agent traffic |
| `#posts` | Keep; rename to `#digest` | Working output target for four of five workflow bots |
| `#content-pipeline` | Keep; rename to `#content` | Weekly Content Planner fires here |
| `#kohyr-dev` | Keep; rename to `#eng` | Intended-use channel; name is product-narrow |
| `#job-search` | Keep; rename to `#career` | Intended-use; unused; name is application-narrow |
| `#all-alawein-workspace` | Keep; rename to `#announce` | Slack default broadcast; current name is long |
| `#social` | Keep name | Slack default; low overhead |
| `#morphism` | Stay archived | Legacy. Do not recreate. |

Archive gate remains 2026-09-19 for persistently empty rooms after the rename.

### 1.5 Agent membership (target)

Cursor is already in every public channel (verified 2026-09-06).

| Channel | Cursor | Claude | Computer | Codex | GitHub | Notion AI |
| --- | --- | --- | --- | --- | --- | --- |
| `#ops` / `#admin-ops` | yes | yes | yes | yes | yes | yes |
| `#digest` / `#posts` | yes | yes | invite | no | no | no |
| `#content` / `#content-pipeline` | yes | invite | no | no | no | yes |
| `#eng` / `#kohyr-dev` | yes | yes | yes | invite | invite | no |
| `#career` / `#job-search` | yes | invite | no | no | no | yes |
| `#announce` / `#all-alawein-workspace` | yes | yes | yes | no | no | yes |
| `#social` | yes | no | no | no | no | yes |

Slack commands still needed:

```text
# in #content-pipeline
/invite @Claude

# in #job-search
/invite @Claude

# in #posts
/invite @Computer

# in #kohyr-dev
/invite @Codex
/invite @GitHub
/github subscribe alawein/alawein
```

Do not add agents to `#social` except Cursor (already there).

## 2. Workflow bot policy

### 2.1 Bot inventory (locked)

| Bot | Schedule | Output | Last fire (as of 2026-09-05) | Engagement 30d | Decision |
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

- `#posts` (rename `#digest`) is the single digest hub.
- Bot DMs are install sockets, not output channels.

## 3. Integration governance map

### 3.1 Verified integrations (locked)

| Integration | Account | Status | Evidence |
| --- | --- | --- | --- |
| Slack workspace | `contact@meshal.ai` (U0APM5W630C) | Ready | Live channel and DM reads |
| Gmail account | `contact@meshal.ai` | Ready | Cursor `list_labels` MCP 2026-09-06 |
| Gmail custom labels (6) | `✈️ Travel`, `📋 Docs`, `💳 Finance/Billing`, `Blocked`, `Notion`, `AGI (archive)` | Clean | `AGI (archive)` has 22 threads |
| Google Drive account | `contact@meshal.ai` | Ready | Cursor `list_recent_files` MCP |
| Google Calendar | `contact@meshal.ai` | Ready | Cursor `list_calendars` MCP |
| Railway | `contact@meshal.ai` | Ready | Cursor `whoami` MCP |
| Notion workspace | `contact@meshal.ai` / Meshal's Workspace (`8116d8de-2215-81ce-b71b-00031e833a2d`) | Ready | `notion-fetch({"id":"self"})` 2026-09-06 |
| Slack bots in `#admin-ops` | Claude, Cursor, Computer, Notion AI, GitHub, Codex | Present | Membership 2026-09-06; ChatGPT not in roster |
| GitHub (Cursor MCP) | None | Split | Desktop ready; Cloud discovery can fail |

### 3.2 Vercel `alawein` team deployments (locked)

**Total projects verified:** 32 recent deployments (2026-09-05).

The 2026-09-04 claim of "two old-job deployments" is **not supported**. Live
enumeration shows a large personal portfolio with eight rows where Vercel
metadata omits source repo or email and therefore cannot be classified without a
browser check.

| Category | Count | Notes |
| --- | --- | --- |
| Personal (`alawein/*`), keep | 18 | Portfolio projects under `alawein` org |
| Kohyr / historical morphism, keep | 4 | `kohyr`, `kohyr-wip`, `kohyr-internal`, `morphism` |
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

**Done (2026-09-05):** `AGI (archive)` label created; applied; archived from
inbox. Recheck 2026-09-06: label exists (`Label_367`); 22 threads.

### 3.5 Account discipline (locked policy)

- All active integrations authenticate against `contact@meshal.ai`.
- No integration may remain on a prior-employer account.
- New integrations require a row in the Integration Registry list and in §3.1
  before install.

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
4. **Gmail:** Done, `AGI (archive)` label (`Label_367`).
5. **Cursor MCPs:** See [`cursor-mcp-repair.md`](cursor-mcp-repair.md).
6. **Claude Tag:** Enable or accept legacy limits.
7. **Cursor Slack access:** Done for all seven public channels (2026-09-06).

### Phase 2.5, Rename (2026-09-06), in progress

1. Apply §1.3 rename map in Slack UI (human only).
2. Apply §1.5 invites and `/github subscribe`.
3. Pin the Slack Map canvas in `#admin-ops`.

### Phase 3, Trial (2026-09-05 through 2026-09-19)

1. Bot engagement trial per §2.2.
2. Channel usage trial: post at least once in `#eng`, `#content`, and `#career`
   after rename (current names: `#kohyr-dev`, `#content-pipeline`,
   `#job-search`).

### Phase 4, Review (2026-09-19)

1. Bot review gate; disable zero-engagement bots.
2. Channel review gate; archive persistently empty channels.

## 5. Locked vs draft status

| Section | Status |
| --- | --- |
| §1.1 Current channel IDs | LOCKED |
| §1.2 Naming convention | LOCKED (2026-09-06) |
| §1.3 Rename map | LOCKED pending Slack UI |
| §1.4 Channel keep/rename decisions | LOCKED |
| §1.5 Agent membership | LOCKED |
| §2 Workflow bot policy | LOCKED |
| §3.1 Verified integrations (including Notion) | LOCKED |
| §3.2 Vercel deployments | LOCKED (eight UNVERIFIED rows pending browser inspection) |
| §3.3 Google Drive external ownership | LOCKED |
| §3.4 Gmail AGI thread drift | LOCKED |
| §3.5 Account discipline | LOCKED |
| §4 Implementation plan | LOCKED |

## 6. Changelog

### v1.3.0 (2026-09-06)

- Cursor Cloud Agent now reads all seven public channels.
- Locked one-word rename map: `ops`, `digest`, `content`, `eng`, `career`,
  `announce`, `social`.
- Added agent membership matrix and Slack invite commands.
- ChatGPT Slack app no longer in `#admin-ops` roster; Codex remains.
- Published Slack canvas `F0BV7PDBJT0` and lists `F0BV9M3BEAW`, `F0BUUASKHT9`.
- Marked Sept 4 Setup Audit canvas superseded.

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
