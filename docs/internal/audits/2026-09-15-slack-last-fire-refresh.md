---
type: audit
status: draft
last_updated: 2026-09-15
owner: meshal
---

# Slack last-fire refresh (2026-09-15)

Run `bc-28323697`. Increment on the 2026-09-14 v1 lock. Does not replace
`catalog/agent-integrations.yaml`. No Slack rename, install, disable, or
invite. Desktop Slack MCP stays UNVERIFIED.

## Proved

- Cursor Slack Tools lists 9 public channels. Reads 7. `#me-agents-eng`
  and `#me-agents-ops` listed, read BLOCKED.
- `#me-inbox` absent. Channel names unchanged. Gate to 2026-09-19 intact.
- Slack user search: Grok 0, Hermes 0, MAIOS 0, OpenClaw 0.
- Workflow last fires (Pacific):
  - Daily Agenda DM `U0B9RSFC8K0`: 2026-09-14 08:00 PT
  - Daily Briefing pointer `U0B97MGH74J`: 2026-09-14 09:00 PT
  - Monday Kickoff `U0B9HDMBT4H`: 2026-09-14 09:00 PT
  - Weekly Content Planner `U0B9RPWA18W`: 2026-09-14 09:00 PT
  - Friday Review `U0B99JAG2HF`: 2026-09-11 16:00 PT
- Engagement: 0 replies on the latest fire of each bot, including the
  Daily Agenda DM.
- PR #209 merged 2026-09-06. Doctrine Validation, Audit Documentation,
  lint-managed-markdown, Derived File Drift Check, and claude-review
  all succeeded on that head.
- 7/7 vs 3/7 is dated, not a live contradiction. 3/7 was
  2026-09-05 14:32 UTC (`bc-01698bb5`) before the invite sweep. 7/7
  public reads hold on this run.

## Slack MCP (do not collapse)

| Surface | Status this run |
| --- | --- |
| Cloud Cursor Slack Tools | ready. list 9, read 7 |
| Cloud third-party Slack | ready, redundant. Used for members and search |
| Desktop Slack MCP | UNVERIFIED. Last DECLARED 7/7 on 2026-09-05 |

## Slackbot AI (added 2026-09-15)

Meshal exact yes: `Approve: add slackbot-ai row to catalog`. Row lives
in `catalog/agent-integrations.yaml`. Slackbot DECLARED: 1:1 only,
memory empty, five skills, Linear/Vercel/Figma MCP inactive, Notion
Morning Brief, search IDs for three channels. Cloud listed 9 public
channels. Do not collapse Slackbot MCP with Cursor MCP.

## Authorized 09-19 set (2026-09-15)

Meshal forwarded Slackbot's lock. Lifecycle: authorized, not executed.
Owner: Meshal. Slack UI clicks on 2026-09-19. Cursor and Slackbot do
not execute Slack mutations.

- Disable Daily Agenda, Daily Briefing, Friday Review, Monday Kickoff,
  Weekly Content Planner. Do not delete.
- Invite Cursor to `#me-agents-eng` `C0BVDBHLXQB`.
- Invite Claude, then Computer, to `#me-agents-ops` `C0BVDBHPB99`.
- Create `#me-inbox`.
- Parked: no rename. `#posts` `C0APWF615H7` and `#content-pipeline`
  `C0B9R0NS4QJ` stay. `#kohyr-dev` `C0B9JJZSVQT` and `#job-search`
  `C0B9NTUUGR4` unchanged pending Meshal.
- Kit SoR: `prompt-kits/AGENT.md` 1.8.4. Slackbot canvas 1.9.0 is
  STALE. No inventory canvas. No `#admin-ops` post. No Claude ping.

## Still GAP

- Desktop Slack MCP cannot be probed from Cloud.
- Cursor / Claude / Computer invites to `#me-agents-*` need a Slack UI
  click. No invite API on this connector.
- Fireflies `B0BA8NTJAR4` remains installed historically. Not a channel
  member. MCP still `needs_auth`.
- Codex Slack still `needs_auth`.
- 2026-09-19 review: Meshal authorized the four-click set on
  2026-09-15. Disable the five workflow bots. Invite Cursor to
  `#me-agents-eng`. Invite Claude, then Computer, to `#me-agents-ops`.
  Create `#me-inbox`. Do not disable early. No rename. `#posts` and
  `#content-pipeline` stay. `#kohyr-dev` and `#job-search` wait.

## Change evidence

| Field | Recorded value |
| --- | --- |
| Source | Slack DM Approve all recommendations; land [PR #292](https://github.com/alawein/alawein/pull/292) |
| Author | Meshal Alawein `<contact@meshal.ai>` |
| Work kind | docs |
| Accountable maintainer | Meshal Alawein |
| Executor | Cursor Cloud `bc-28323697` |
| Independent reviewer | pending after push (ChatGPT default for Cursor execute) |
| Checks | catalog `--strict`, README `--check`, doc-contract `--full` |
| Final approval | pending Meshal squash-merge |
| Acceptance | prepared on #292; not accepted until squash-merge |
