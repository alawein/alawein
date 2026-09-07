---
type: audit
status: draft
last_updated: 2026-09-07
owner: meshal
---

# Cursor shared-session prove (2026-09-07 08:25 UTC)

Cloud Agent run `bc-b4b569f6-a6c0-5114-8ebc-ddfa7736b9eb`
(https://cursor.com/agents/bc-b4b569f6-a6c0-5114-8ebc-ddfa7736b9eb).
Launched from `#admin-ops` (`C0B9SRMDJFK`, ts `1788769288.678259`) by Meshal
(`U0APM5W630C`). Account canon: `contact@meshal.ai`. Slack team:
`T0APHHXJV4J`.

Machine SSOT: `catalog/agent-integrations.yaml`. This is a scoped Cursor row
prove, not a full MCP or integration rescan. Full rescan remains
`docs/internal/audits/2026-09-06-slack-integrations-rescan.md`.

## Goal

Prove the `cursor-cloud` inventory row live. Completion: `last_verified` is
`2026-09-07` with this run's 7/7 channel evidence.

## Proved

- `Cursor Slack Tools` posted and read in this thread.
- `list_slack_channels` returned 7 channels. IDs match git.
- `read_slack_messages` succeeded on all 7: `#admin-ops` `C0B9SRMDJFK`,
  `#posts` `C0APWF615H7`, `#kohyr-dev` `C0B9JJZSVQT`, `#content-pipeline`
  `C0B9R0NS4QJ`, `#job-search` `C0B9NTUUGR4`, `#all-alawein-workspace`
  `C0APE5RSWAZ`, `#social` `C0AP24SRVQF`.
- `cursor-cloud` status stays `ready`. Slack user `U0APW2Z3GG2`.

## Slack vs git (not written into inventory)

Git wins. These Slack-prompt claims stay mismatch or UNVERIFIED:

- Slack claims `prompt-kits/AGENT.md` kit 1.6.0. Git frontmatter is 1.5.1.
- Slack claims Computer ready with 7/7 reads including `#posts`. Git row
  `computer-perplexity` is `needs_auth`, `last_verified: 2026-09-05`, notes
  say not in `#posts`. This run did not prove Computer.
- Slack names Kilo (`U0BV9U2GFED`) as a lane. Git `agents:` has no `kilo`
  row. Not added. Slack reads for Kilo were not proved here.

No AGENT.md rewrite. No Computer status change. No Kilo row. Snapshot not
rewritten (channel, agent, and integration IDs unchanged).

## Thread comparison (asked 2026-09-07 08:32 UTC)

Source thread: `#admin-ops` ts `1788769288.678259`. Git column is
`catalog/agent-integrations.yaml` on this branch. Slack column is what each
agent posted in-thread. Git wins.

### Who answered

| Agent | Slack ID | Posted in thread | Git status | Git last_verified |
| --- | --- | --- | --- | --- |
| Cursor | `U0APW2Z3GG2` | yes; 7/7 reads; [PR #223](https://github.com/alawein/alawein/pull/223) | `ready` | 2026-09-07 |
| Claude | `U0AQQFJT8AC` | yes; Tag upsell, then 7/7 + Notion identity | `ready` (legacy; Tag not enabled) | 2026-09-06 |
| Computer | `U0APW7F9S4A` | yes; claims Slack 7/7 including `#posts` | `needs_auth` | 2026-09-05 |
| Kilo | `U0BV9U2GFED` | yes; no `alawein/alawein` access | no agent row | n/a |
| Notion AI | `U0AQ8UNAKTK` | silent | `ready` | 2026-09-05 |
| GitHub Slack | `U0APESWEF2T` | silent (PR-mirror lane) | `ready` | 2026-09-05 |
| ChatGPT | `U0BUNH33CCA` | silent (joined `#admin-ops` 08:22) | `replaced` | 2026-09-05 |
| Codex | `U0BV7V8M3NW` | silent | `needs_auth` | 2026-09-05 |
| Claude Code | n/a | not tagged | `ready` | 2026-09-05 |

### Settings each poster claimed

| Topic | Slack prompt | Cursor | Claude | Computer | Kilo | Git |
| --- | --- | --- | --- | --- | --- | --- |
| Kit version | `AGENT.md` 1.6.0 | git is 1.5.1; no rewrite | 1.6.0 is pasted kit; do not auto-bump | 1.6.0 in-thread vs 1.5.1 git | bump repo to 1.6.0 | `prompt-kits/AGENT.md` 1.5.1 |
| Slack channels | 7 locked | list 7, read 7 | member 7, read `#posts` + `#admin-ops` | claims 7/7 including `#posts` | `#admin-ops` only | 7 IDs; all `cursor_can_read: true` |
| Computer status | ready as of 2026-09-07 | leave `needs_auth` | change git to `ready` | `ready` live | fix git to match auth | `needs_auth`; Perplexity OAuth; not in `#posts` |
| Kilo row | lane on 3 repos | no row; do not add here | add scoped row | no row; Meshal decides scope | add row for 3 repos | absent |
| Cursor row | implement / PR | `ready`; `last_verified` 2026-09-07 | Cursor owns catalog diff | `ready` | Cursor lands sync | `ready` on this branch |
| Claude Tag | human admin step | not claimed done | Tag not enabled; do not claim done | Meshal owns Tag | not claimed | notes: Tag not enabled |
| Codex / ChatGPT | wait for Codex connect; ChatGPT replaced | no prove | silent | Meshal owns Codex connect | not claimed | Codex `needs_auth`; ChatGPT `replaced` |
| Sept 19 gate | no rename / no new bots | freeze | freeze; staged topic notes only | freeze | n/a | runbook locked |

### Shared vs disputed

Agreed by every poster: git is SSOT for topology; 7 public channel IDs match;
no rename or new bot before 2026-09-19; no second inventory or Canvas SSOT;
Cursor lands `alawein/alawein` diffs; Kilo stays off `alawein/alawein`.

Disputed: whether Slack kit 1.6.0 should become `AGENT.md`; whether Computer
Slack reads flip git to `ready`; whether to add a Kilo inventory row in this
PR. Cursor did not land those three. Kilo, Computer, and Claude asked for a
sync pass. Claude correctly called the kit bump a human reconcile, not an
auto-bump.

### Issues

1. Kit version: Slack paste says 1.6.0. Git file is 1.5.1 and is a different
   document (workspace prompt kit, not the Slack operating prompt). Open
   human call: keep 1.5.1 or land a real 1.6.0 rewrite.
2. Computer: Slack reads are not Perplexity OAuth. Git `needs_auth` is about
   Lane B / Perplexity, and notes say not in `#posts`. Computer self-claim
   does not prove that git reason is gone.
3. Kilo: live Slack user with no `agents:` row. Adding it changes agent IDs
   and needs `--write-snapshot`. Not done in [PR #223](https://github.com/alawein/alawein/pull/223).
4. Silent tagged agents: Notion AI, GitHub, ChatGPT, Codex posted no prove.
   Codex remains `needs_auth`. ChatGPT remains `replaced`.
5. Claude Tag: first Claude reply is the Tag upsell. Tag is still a human
   admin step.
6. Voice drift in-thread: emoji status rows, long Claude posts, duplicate
   Claude audit, Computer and Kilo mentioned Meshal on non-incident status.
7. Over-claim: Claude and Computer treated Computer 7/7 as independent proof
   that git should change. Cursor did not verify Computer membership.
