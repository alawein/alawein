---
type: audit
status: draft
last_updated: 2026-09-06
owner: meshal
---

# Slack + integration rescan (2026-09-06 03:15 UTC)

Cloud Agent run `bc-8ca615eb-dda8-581b-9a4d-af93e03239f9`
(https://cursor.com/agents/bc-8ca615eb-dda8-581b-9a4d-af93e03239f9).
Launched from Slack DM thread by Meshal (`U0APM5W630C`).
Account canon: `contact@meshal.ai`. Slack team: `T0APHHXJV4J`.

Machine SSOT: `catalog/agent-integrations.yaml`. Channel policy:
`docs/governance/slack-agent-runbook.md`. Drift CI:
`python scripts/catalog/validate-agent-integrations.py --strict`.

Prior rescan: `docs/internal/audits/2026-09-05-slack-integrations-rescan.md`.

## Verdict

Topology unchanged (seven public channels). **Membership and MCP posture
improved after the 2026-09-05 invite sweep:** Cursor Cloud Agent reads 7/7
channels on this run (was 3/7 on the prior same-day scan at 14:32 UTC before
invites completed). GitHub and third-party Slack MCP namespaces flipped from
error to ready between runs `bc-01698bb5` and `bc-8ca615eb`. No channel
rename/merge/archive this cycle.

## Reconciliation (Claude Code sync, 2026-09-06)

| Claim | Resolution |
| --- | --- |
| Artifacts only in draft PR #209 | **Correct.** Nothing lands until merge. |
| 7/7 vs 3/7 channel reads | **Both true, different timestamps.** 3/7 at 14:32 UTC; invite sweep 13:54–15:16 UTC; 7/7 re-proved 03:15 UTC 2026-09-06. See `slack_channel_reads` in YAML. |
| GitHub/Slack MCP ready vs error | **Both true, different runs.** Error on `bc-01698bb5`; ready on `bc-8ca615eb`. YAML now carries `_prior` columns. |
| Validator un-runnable on main | **Correct until #209 merges.** | Remaining human actions: Claude Tag migration, Computer re-auth,
Codex connect, workflow-bot engagement trial through 2026-09-19.

## Delta since 2026-09-05

| Area | 2026-09-05 | 2026-09-06 |
| --- | --- | --- |
| Cursor channel read | 3/7 | **7/7** |
| Cloud Agent GitHub MCP | error | **ready** |
| Cloud Agent Slack MCP (third-party) | error | **ready** (redundant vs Cursor Slack Tools) |
| Supermemory MCP | error | loading |
| Channel count | 7 | 7 (unchanged) |
| `morphism` channel | absent | absent |

## Slack channel inventory (live)

`list_slack_channels` returned 7 public channels. `read_slack_messages`
succeeded on all 7 after the 2026-09-05 invite sweep.

| Channel | ID | Tier | Cloud Agent read | Notes |
| --- | --- | --- | --- | --- |
| `#admin-ops` | `C0B9SRMDJFK` | Hub | yes | Command center; active |
| `#posts` | `C0APWF615H7` | Hub-bot | yes (joined 14:59) | Workflow-bot digest hub |
| `#content-pipeline` | `C0B9R0NS4QJ` | Domain | yes (joined 15:12) | Content strategy |
| `#job-search` | `C0B9NTUUGR4` | Domain | yes (joined 15:14) | Career tracking |
| `#kohyr-dev` | `C0B9JJZSVQT` | Domain | yes | Dormant since 2026-06-11 |
| `#all-alawein-workspace` | `C0APE5RSWAZ` | Broadcast | yes | Fireflies installed |
| `#social` | `C0AP24SRVQF` | Default | yes (joined 15:16) | Empty |

## Cursor MCP namespace matrix (this Cloud Agent)

Scanned via dynamic tool discovery at 03:10–03:15 UTC.

### Ready (callable)

Cursor Slack Tools, Slack (third-party), Github, Gmail, Google-calendar,
Google-drive, Railway, Playwright, Cloudflare-docs, Godaddy, Treg,
cursor-cloud, cursor-subscriptions.

### Error

Figma, Todoist.

### Loading / needs auth

Supermemory (loading), 1password (loading); Calendly, Fireflies, Granola,
and other connectors unchanged from prior rescan (`needsAuth`).

**Routing rule:** Slack-launched agents use **Cursor Slack Tools** only.
Third-party Slack MCP is documented as redundant, not removed.

## Change detection (new)

| Mechanism | What it catches | Command |
| --- | --- | --- |
| Schema + staleness | Missing fields, `lastVerified` older than 45 days | `validate-agent-integrations.py --strict` |
| Runbook cross-check | Channel ID drift vs `slack-agent-runbook.md` | same |
| Snapshot baseline | Channel roster or ID changes | compares to `catalog/generated/agent-integrations.snapshot.json` |
| Monthly live rescan | Auth, MCP, membership regressions | Cloud Agent audit file + YAML update |

Refresh snapshot after an intentional topology change:

```bash
python scripts/catalog/validate-agent-integrations.py --write-snapshot
```

## Human actions still open

1. Enable Claude Tag or keep documenting legacy `@Claude` limits.
2. Re-auth Computer (`@Computer`) in Slack; re-run S3 smoke on `#posts`.
3. Connect `@Codex` to ChatGPT Codex account; confirm Reply OK.
4. Workflow-bot engagement trial through 2026-09-19 (engagement still 0).
5. Optional: remove or ignore redundant third-party Slack MCP in Cloud env.

## What this rescan did not change

Channel keep/archive decisions. Workflow-bot policy. Account canon. Vercel
UNVERIFIED table. Gmail AGI archive counts.
