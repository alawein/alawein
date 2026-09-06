---
type: audit
status: draft
last_updated: 2026-09-06
owner: meshal
---

# Slack workspace map (2026-09-06)

Cloud Agent launched from `#admin-ops` (`C0B9SRMDJFK`) by Meshal
(`U0APM5W630C`). Account canon: `contact@meshal.ai`. Slack team:
`T0APHHXJV4J`.

This file is the live diff against
`docs/internal/audits/2026-09-05-slack-integrations-rescan.md`. Channel policy
is `docs/governance/slack-agent-runbook.md` v1.3.0.

## Verdict

Keep the seven-channel shape. Rename in place. Do not create duplicates. Do
not archive before the 2026-09-19 gate.

Cursor is now in all seven public channels. ChatGPT is gone from the
`#admin-ops` roster. Codex is the OpenAI Slack surface. Notion and Gmail
remain on `contact@meshal.ai`. Five workflow bots still fire with zero
engagement.

## Slack artifacts created

| Artifact | ID | URL |
| --- | --- | --- |
| Canvas: Alawein Slack Map (v1.3) | `F0BV7PDBJT0` | https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0BV7PDBJT0 |
| Canvas: Alawein Routines (v1) | `F0BV9MN4KR8` | https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0BV9MN4KR8 |
| List: Slack Channel Registry | `F0BV9M3BEAW` | https://alaweinworkspace.slack.com/lists/T0APHHXJV4J/F0BV9M3BEAW |
| List: Slack Integration Registry | `F0BUUASKHT9` | https://alaweinworkspace.slack.com/lists/T0APHHXJV4J/F0BUUASKHT9 |
| Notion Operations Hub page | `3d36d8de-2215-81ac-90f5-fb416e5c8e27` | https://app.notion.com/p/3d36d8de221581ac90f5fb416e5c8e27 |
| Notion draft (private leftover) | `3d36d8de-2215-816e-9d36-dd4428a22246` | https://app.notion.com/p/3d36d8de2215816e9d36dd4428a22246 |
| Setup Audit canvas | `F0BUXDR4J9L` | marked superseded, points at the new map |

## Rename map

| Current | Rename to | Action |
| --- | --- | --- |
| `#admin-ops` | `#ops` | Rename in Slack UI |
| `#posts` | `#digest` | Rename in Slack UI |
| `#content-pipeline` | `#content` | Rename in Slack UI |
| `#kohyr-dev` | `#eng` | Rename in Slack UI |
| `#job-search` | `#career` | Rename in Slack UI |
| `#all-alawein-workspace` | `#announce` | Rename in Slack UI |
| `#social` | `#social` | Keep |

## Membership (2026-09-06)

| Channel | Humans/agents present |
| --- | --- |
| `#admin-ops` | contact, Cursor, Computer, Notion AI, Claude, GitHub, Codex |
| `#posts` | contact, Cursor, Notion AI, Claude, 3 workflow bots |
| `#content-pipeline` | contact, Cursor, Notion AI, Weekly Content Planner |
| `#kohyr-dev` | contact, Cursor, Computer, Notion AI, Claude |
| `#job-search` | contact, Cursor, Notion AI |
| `#all-alawein-workspace` | contact, Cursor, Computer, Notion AI, Claude |
| `#social` | contact, Cursor, Notion AI |

## Invites still needed

- `/invite @Claude` in `#content-pipeline` and `#job-search`
- `/invite @Computer` in `#posts`
- `/invite @Codex` and `/invite @GitHub` in `#kohyr-dev`
- `/github subscribe alawein/alawein` in `#kohyr-dev`

## Connection recheck

| Item | Status 2026-09-06 |
| --- | --- |
| Notion | Meshal's Workspace / `contact@meshal.ai` |
| Gmail labels | 6 user labels including `AGI (archive)` (22 threads) |
| ChatGPT Slack user | not found |
| Grok Slack user | not found |
| Granola MCP | needsAuth |
| Supermemory MCP | error |
| Vercel `sam-eval-roadmap` | Computer: delete (no repo, 84d) |
| Vercel `guides-eval-loop-app` | Computer: delete (no repo, 88d) |
| Drive Superfine Kitchen Order | owner `chaitanya@theagi.company`; anyone writer |
