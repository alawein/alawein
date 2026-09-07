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
