---
type: canonical
source: none
sync: none
sla: none
status: draft
last_updated: 2026-09-07
owner: meshal
---

# Slack workspace map (2026-09-06)

The prior report states that a Cloud Agent was launched from `#admin-ops` (`C0B9SRMDJFK`) by Meshal
(`U0APM5W630C`). Account canon: `contact@meshal.ai`. Slack team:
`T0APHHXJV4J`.

This is a dated proposal preserved from
[PR #208 at 47927774](https://github.com/alawein/alawein/commit/479277744e0e06bee305b15ced421735cc661cde),
not a current runtime verification or an approval record. The observations below
were reported by that revision and were not re-probed in this review.

Active policy remains in the [Slack agent runbook](../../governance/slack-agent-runbook.md).
The [channel migration plan](../../governance/slack-channel-migration-plan.md)
is also a draft. Neither proposal authorizes a rename, new channel, integration
invite, bot cut, deployment deletion, or access change. Preserve the current
channel names through the September 19 review gate and obtain a recorded decision
before applying a proposed policy change.

## Reported proposal

The prior report proposed keeping seven channels, renaming in place, and avoiding
archives before the 2026-09-19 gate. Its reported observations follow.

Cursor is now in all seven public channels. ChatGPT is gone from the
`#admin-ops` roster. Codex is the OpenAI Slack surface. Notion and Gmail
remain on `contact@meshal.ai`. Five workflow bots still fire with zero
engagement.

## Reported Slack artifacts

| Artifact | ID | URL |
| --- | --- | --- |
| Canvas: Alawein Slack Map (v1.3) | `F0BV7PDBJT0` | https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0BV7PDBJT0 |
| Canvas: Alawein Routines (v1) | `F0BV9MN4KR8` | https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0BV9MN4KR8 |
| List: Slack Channel Registry | `F0BV9M3BEAW` | https://alaweinworkspace.slack.com/lists/T0APHHXJV4J/F0BV9M3BEAW |
| List: Slack Integration Registry | `F0BUUASKHT9` | https://alaweinworkspace.slack.com/lists/T0APHHXJV4J/F0BUUASKHT9 |
| Notion Operations Hub page | `3d36d8de-2215-81ac-90f5-fb416e5c8e27` | https://app.notion.com/p/3d36d8de221581ac90f5fb416e5c8e27 |
| Notion draft (private leftover) | `3d36d8de-2215-816e-9d36-dd4428a22246` | https://app.notion.com/p/3d36d8de2215816e9d36dd4428a22246 |
| Setup Audit canvas | `F0BUXDR4J9L` | marked superseded, points at the new map |

## Proposed rename map (not approved)

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

## Reported invite suggestions (not approved)

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
| Vercel `sam-eval-roadmap` | Prior deletion suggestion (84d); current state and approval unverified |
| Vercel `guides-eval-loop-app` | Prior deletion suggestion (88d); current state and approval unverified |
| Drive connection | Third-party ownership and sharing details omitted from this public record; verify in Drive before acting |
