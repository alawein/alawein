---
type: audit
status: draft
last_updated: 2026-09-05
owner: meshal
---

# Slack + integration rescan (2026-09-05 14:32 UTC)

Cloud Agent run `bc-01698bb5-e10b-5968-8fb0-ced67462e4b7`
(https://cursor.com/agents/bc-01698bb5-e10b-5968-8fb0-ced67462e4b7).
Launched from `#admin-ops` (`C0B9SRMDJFK`) by Meshal (`U0APM5W630C`).
Account canon: `contact@meshal.ai`. Slack team: `T0APHHXJV4J`.

This file is the durable IDE-session audit. Machine SSOT is
`catalog/agent-integrations.yaml`. Channel policy stays in
`docs/governance/slack-agent-runbook.md`.

Prior same-day work: #196, #198, #199. This rescan is a live diff against
those, not a second full audit.

## Verdict

The seven-channel layout is still the right shape. Do not rename, merge, or
archive anything this cycle. What changed since #199 is the OpenAI Slack
surface: `@Codex` (`U0BV7V8M3NW`) replaced `@ChatGPT`. Cursor Cloud Agent
now reads four channels (`#posts` invite 14:59 UTC). Three invites and
three OAuth steps remain.

## Slack channel inventory (live)

`list_slack_channels` returned 7 public channels. `read_slack_messages`
proved membership on 4 (Lane D re-probe 14:59 UTC, run
`bc-eaa2dc84-9e66-54b6-95d8-00d308d2e5c0`). Listing a channel is not read
access.

| Channel | ID | Tier | Cloud Agent read | Purpose (live topic / description) | 30d use |
| --- | --- | --- | --- | --- | --- |
| `#admin-ops` | `C0B9SRMDJFK` | Hub | yes | Infra, subscriptions, DNS, billing, ops | Active (command center) |
| `#kohyr-dev` | `C0B9JJZSVQT` | Domain | yes (invite ~13:56) | Kohyr engineering; renamed from `morphism-dev` 2026-06-11 | Dormant since 2026-06-11 except bot joins |
| `#all-alawein-workspace` | `C0APE5RSWAZ` | Broadcast | yes (invite ~13:54) | Workspace announcements | Setup-only; Fireflies added 2026-06-13 |
| `#posts` | `C0APWF615H7` | Hub-bot | yes (invite 14:59) | Workflow-bot digest hub | Active (bots); 0 replies |
| `#content-pipeline` | `C0B9R0NS4QJ` | Domain | listed, not member | Weekly Content Planner target | Low use; Cloud Agent cannot verify |
| `#job-search` | `C0B9NTUUGR4` | Domain | listed, not member | Job and career tracking | Setup-only; Cloud Agent cannot verify |
| `#social` | `C0AP24SRVQF` | Default | listed, not member | Non-work | Empty; Cloud Agent cannot verify |

IDE Slack MCP (Meshal account, earlier today): reads 7/7.

### Channel organization decision (this cycle)

Keep all seven. Locked in `slack-agent-runbook.md` §1.3. Remaining
organization is membership, not topology:

1. `/invite @Cursor` in `#content-pipeline`, `#job-search`, `#social`
   if Cloud Agent should match IDE read coverage. `#posts` done 14:59 UTC.
2. Leave `#kohyr-dev` named as-is. Description already says Kohyr; welcome
   text still mentions Morphism (cosmetic, not a rename).
3. Fireflies (`B0BA8NTJAR4`) is installed on `#all-alawein-workspace`. Cursor
   Fireflies MCP is `needsAuth`. Decide later whether meeting notes belong
   in broadcast or `#admin-ops`.

## Slack agent / bot roster (live)

| Handle | Slack ID | Role | Status now | Evidence |
| --- | --- | --- | --- | --- |
| `@Cursor` | `U0APW2Z3GG2` | Implement, commit, inventory | Ready | Lane D run `bc-eaa2dc84-…`; reads 4 channels |
| `@Claude` | `U0AQQFJT8AC` | Slack reads, synthesis | Ready (legacy) | S2 reply 14:02:51; asked to enable Claude Tag |
| `@Computer` | `U0APW7F9S4A` | Browser verify | Needs Slack re-auth | Joined `#kohyr-dev` + `#all-alawein-workspace` ~13:55; silent on S3 |
| `@Notion AI` | `U0AQ8UNAKTK` | Notion reads | Present; S5 unanswered | No identity reply in hardening thread |
| `@GitHub` | `U0APESWEF2T` | PR thread mirror | Ready | Joined `#admin-ops` 11:28 |
| `@Codex` | `U0BV7V8M3NW` | OpenAI Slack surface (new) | Needs ChatGPT Codex connect | Joined `#admin-ops` 14:27:21; connect prompt 14:28:50 |
| `@ChatGPT` | `U0BUNH33CCA` | Old OpenAI Slack app | Replaced / silent | Joined 11:28; never posted |

Workflow bots (Cloud Agent now reads `#posts`): Daily Agenda (DM), Daily
Briefing `B0B9BA0V03E` last fire 2026-09-04 16:00 UTC, Friday Review
`B0B91C6L7RR` last fire 2026-09-04 23:00 UTC, Monday Kickoff `B0BA9SU11MW`
last fire 2026-08-31 16:00 UTC, Weekly Content Planner (`#content-pipeline`,
still unread). Trial through 2026-09-19. Engagement still 0. Computer is
not in `#posts`.

## Cursor MCP namespace matrix (this Cloud Agent)

Scanned via dynamic tool discovery at 14:32–14:40 UTC.

### Ready (callable)

| Namespace | Probe | Result |
| --- | --- | --- |
| Cursor Slack Tools | `list_slack_channels`, `read_slack_messages` | 7 listed; 4 readable after `#posts` 14:59 |
| Gmail | `list_labels`, `search_threads` | 6 user labels; `AGI (archive)` = 22 threads; `from:theagi.company in:inbox` = 0 |
| Google-calendar | `list_calendars` | `meshal.ai`, Work, Personal, US Holidays; TZ America/Los_Angeles |
| Google-drive | `list_recent_files` | Recent files owned by `contact@meshal.ai` (Morphism audits, Systems, Knowledge OS) |
| Railway | `whoami` | Meshal Alawein / `contact@meshal.ai` / id `14cf9806-…` |
| Playwright | discovery | Ready (loaded during this run) |
| Cloudflare-docs | discovery | Ready (docs search only) |
| Godaddy | discovery | Ready (not probed) |
| Treg | `my_tools` | Namespace ready; `could not read the teams for this token` |
| cursor-cloud | `run-info`, `environment-info` | This run; personal env; egress unrestricted |
| cursor-subscriptions | `list_subscriptions` | Empty |

Gmail inbox load: 268 threads, 83 unread. Not a health failure. User labels
unchanged: Travel, Docs, Finance/Billing, Blocked, Notion, AGI (archive).

### Error (discovery failed)

| Namespace | Notes |
| --- | --- |
| Slack | Third-party duplicate. Desktop T7 said removed; **Cloud Agent still errors**. Keep Cursor Slack Tools. |
| Github | Desktop T5 said ready; **Cloud Agent still errors**. `gh` CLI remains the workaround here. |
| Supermemory | Desktop Phase F Drop; Cloud Agent still errors. Do not treat as SSOT. |
| Figma | Discovery failed this run. |
| 1password | Loaded, then discovery failed. |
| Todoist | Discovery failed this run. |

### Needs auth (installed, unused)

Calendly, Cloudflare-bindings, Cloudflare-builds, Cloudflare-observability,
Context, Docusign, Fireflies, Granola, Huggingface-skills, Lovable, Mobbin,
Neon, Onedrive, Posthog, Wonder, Zoom.

Notion has no Cursor MCP namespace in this catalog (Slack `@Notion AI` only).

Vercel: no MCP namespace here; historical CLI lock stands (32 projects, 8
UNVERIFIED).

## Desktop vs Cloud Agent (do not collapse)

| Surface | Desktop IDE (#199) | This Cloud Agent |
| --- | --- | --- |
| Gmail / Calendar / Drive | Absent from catalog | Ready; re-probed |
| Railway | CLI Unauthorized | `whoami` ready |
| GitHub MCP | Ready | Error |
| Slack third-party | Removed | Error (still present) |
| Supermemory | Dropped / not installed | Error |
| Slack channel read | 7/7 (Meshal Slack MCP) | 4/7 (bot membership; `#posts` 14:59) |

Inventory rows must keep both columns. A desktop pass does not mean Cloud
Agent can call the tool.

## Hardening smoke delta (after #199)

| ID | #199 row | This rescan |
| --- | --- | --- |
| S1 | pass (partial), reads 3 | **Lane D** — now 4/7 after `#posts` invite 14:59 |
| S2 | timeout | **Late pass** — Claude replied 14:02:51 with app table + Claude Tag note |
| S3 | blocked | Unchanged; Computer still silent on `#posts` |
| S4 | ChatGPT fail / suspended | **Remapped** — Codex is the OpenAI Slack app; connect prompt, no Reply OK |
| S5 | timeout | Unchanged; Notion AI silent |
| T1–T2 | Cloud-only | Re-proved on Cloud Agent |
| T4 | desktop fail | Cloud Agent Railway ready |
| T5–T7 | desktop pass / drop | Cloud Agent still sees GitHub + Slack-dup + Supermemory errors |

## Settings and subscriptions

- This Cloud Agent has **zero** event subscriptions.
- Environment: personal, db-backed (no `environment.json`), warm-fork build
  `bld-20260905-e5ca049f-ef17-464e-b9db-5cbf08643ccc`.
- Repo: `github.com/alawein/alawein`.
- No run events recorded (`get-events` = 0).

## Human actions still open

1. Slack → Apps → Computer / Perplexity: re-auth. Then S3: can you read `#posts`?
2. Connect Codex (`U0BV7V8M3NW`) to the ChatGPT Codex account. Then tag it
   `Reply OK`. Uninstall or ignore the silent ChatGPT app (`U0BUNH33CCA`).
3. Re-tag `@Notion AI` for workspace identity (`contact@meshal.ai` / Meshal's
   Workspace) if you still want S5 closed.
4. Optional remaining: `/invite @Cursor` in `#content-pipeline`,
   `#job-search`, `#social`. `#posts` done 14:59 UTC.
5. Optional: enable Claude Tag (legacy bot works; Tag is a product upgrade).
6. Desktop: Railway CLI auth if you want T4 green on the workstation.
7. Phase 2 leftovers (unchanged): Vercel browser inspect of 8 UNVERIFIED
   projects; Drive access on Superfine Kitchen Order; workflow-bot trial to
   2026-09-19.

## Lane D re-probe (2026-09-05 14:59 UTC)

Cloud Agent run `bc-eaa2dc84-9e66-54b6-95d8-00d308d2e5c0`. Parallel finalize
lane D after Meshal started channel invites.

| Channel | can_read | Evidence |
| --- | --- | --- |
| `#admin-ops` | yes | parent `1788618711.648629` |
| `#kohyr-dev` | yes | Computer join `1788616579.964689` |
| `#all-alawein-workspace` | yes | Computer join `1788616513.454089` |
| `#posts` | yes | Cursor join `1788620374.004189` (14:59:34) |
| `#content-pipeline` | no | not a member |
| `#job-search` | no | not a member |
| `#social` | no | not a member |

`@ChatGPT` (`U0BUNH33CCA`) stays installed. No Codex `Reply OK` in the
`#admin-ops` thread. Lanes A–B remain browser OAuth (Playwright Slack login
blocked on an auth code); hand to Meshal desktop or Sider/Claw.

## What this rescan did not change

Channel keep/archive decisions. Workflow-bot keep/disable policy. Account
canon (`contact@meshal.ai`). Gmail AGI archive (still 22 / 0 inbox). Notion
workspace identity from prior lock. Vercel project table.
