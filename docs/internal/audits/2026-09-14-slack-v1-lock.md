---
type: audit
status: draft
last_updated: 2026-09-14
owner: meshal
---

# Slack v1 lock (2026-09-14)

Run `bc-498f4ccf`. Working pointer, not a second inventory. Git SSOT stays
`catalog/agent-integrations.yaml`. Kit `prompt-kits/AGENT.md` 1.8.4 is on
`main`. No scopes changed. No app installed. No `@Grok`.

## Locked topology

Nine public channels. Cursor lists all nine and reads seven.

| Channel | Slack ID | Cursor read | Agent bots present |
| --- | --- | --- | --- |
| `#admin-ops` | `C0B9SRMDJFK` | yes | Cursor, Claude, Computer, Notion AI, GitHub, ChatGPT (replaced), Codex, Kilo |
| `#posts` | `C0APWF615H7` | yes | Cursor, Claude, Notion AI plus Daily Briefing, Friday Review, Monday Kickoff |
| `#kohyr-dev` | `C0B9JJZSVQT` | yes | Cursor, Computer, Notion AI, Claude, Codex |
| `#content-pipeline` | `C0B9R0NS4QJ` | yes | Cursor, Notion AI, Claude plus Weekly Content Planner |
| `#job-search` | `C0B9NTUUGR4` | yes | Cursor, Notion AI, Claude |
| `#all-alawein-workspace` | `C0APE5RSWAZ` | yes | Cursor, Computer, Notion AI, Claude |
| `#social` | `C0AP24SRVQF` | yes | Cursor, Notion AI |
| `#me-agents-eng` | `C0BVDBHLXQB` | no | Notion AI only. Invite `@Cursor` pending |
| `#me-agents-ops` | `C0BVDBHPB99` | no | Notion AI only. Invite `@Claude` and `@Computer` pending |

Command center remains `#admin-ops`. Digest hub remains `#posts`. Do not
rename before 2026-09-19.

## Apps

- No Gmail Slack app. No `@Grok`, Hermes, or OpenClaw.
- Linear Slack `U0C0NB35XGQ` FLAG write via `/linear` (companion Linear OAuth).
- Notion AI FLAG companion write possible. Silent. No write proved this run.
- OAuth grant strings UNVERIFIED. Scopes canvas: `F0C15AVM0FR`.
- Workflow last fires unchanged: Daily Agenda DM 2026-09-13; Daily Briefing
  and Friday Review 2026-09-11; Monday Kickoff and Weekly Content Planner
  2026-09-07. Today 10:00 UTC is before the 09:00 PT Monday fires.

## Canvases (reuse, do not clone)

| Canvas | ID | Role |
| --- | --- | --- |
| Chat scan | `F0C16U6USJ0` | Locked v1 pointer |
| Lane inventory | `F0C0KEF150C` | Lane tables |
| Scopes | `F0C15AVM0FR` | OAuth as-is |
| Reusable prompts | `F0C1B0USHDH` | Prompt shells; git twin PR #269 |
| Handshake 7 to 9 | `F0C0Y0FGQ9M` | Cursor IDE + Grok YAML pair |

## Human clicks still required

1. Squash-merge [PR #292](https://github.com/alawein/alawein/pull/292).
2. Squash-merge [PR #269](https://github.com/alawein/alawein/pull/269).
3. `/invite @Cursor` in `#me-agents-eng`.
4. `/invite @Claude` then `/invite @Computer` in `#me-agents-ops`.
5. Codex Connect or leave `needs_auth`.
6. Optional: paste Manage apps if grant strings are needed.
7. 2026-09-19 workflow-bot review.

## Change evidence

| Field | Recorded value |
| --- | --- |
| Source | Slack DM: finalize canvas, channels, bots, complete system; base `02241388`; [PR #292](https://github.com/alawein/alawein/pull/292) |
| Author | Meshal Alawein `<contact@meshal.ai>` |
| Work kind | docs |
| Accountable maintainer | Meshal Alawein |
| Executor | Cursor Cloud `bc-498f4ccf` |
| Independent reviewer | pending (Claude Review / ChatGPT after PR open) |
| Checks | recorded on the PR |
| Final approval | pending Meshal |
| Acceptance | not accepted until squash-merge |
