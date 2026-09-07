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

## Cross-surface inventory (2026-09-07 08:40 UTC)

Asked in-thread: land an exhaustive matrix, drift root cause, voice
divergence, and lane trade-offs in this file. Git still wins. No second
inventory page. No YAML roster change (no kit bump, no Computer flip, no
Kilo row). Snapshot not rewritten.

This Cloud Agent run: `bc-b4b569f6-a6c0-5114-8ebc-ddfa7736b9eb`. Launch
model `cursor-grok-4.6-high-fast` (YAML `llm_default` for Cursor is still
`composer-2.5`). Owner `contact@meshal.ai`. Repo `alawein/alawein`. Slack
team `T0APHHXJV4J`.

### 1. Agent matrix

Shared instruction surfaces (all code lanes that can read `alawein/alawein`):

- Governed prose: `docs/style/VOICE.md`
- Slack threads: `docs/governance/slack-agent-voice.md`
- Workspace kit: `prompt-kits/AGENT.md` 1.5.1 (`prompt-kits/registry.yaml`)
- Repo contract: `AGENTS.md`, `CLAUDE.md`, `SSOT.md`
- Cursor rules: `.cursor/rules/alawein-governance.mdc`,
  `.cursor/rules/slack-agent-voice.mdc`,
  `.cursor/rules/claude-code-governance.mdc`
- Claude Code home: `claude-agent-platform/` (`sync-to-home.sh` /
  `sync-from-home.sh`)
- Dispatch: `docs/governance/unified-agent-system.md` §5
- Inventory SSOT: `catalog/agent-integrations.yaml`

Credential boundary (all lanes): account canon is `contact@meshal.ai` only.
Never commit secrets. Cloud Agent merge is 403. Desktop MCP and Cloud MCP
statuses must not be collapsed. AGI-named cloud workspaces, `theagi.company`
mail, and Railway AGI projects are out of scope and were not probed.

| Agent | Slack ID | Git row | Default model (git) | Model this thread | Style / rules | Credential boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Cursor | `U0APW2Z3GG2` | `cursor-cloud` `ready` | Composer 2.5 | `cursor-grok-4.6-high-fast` | AGENT 1.5.1, VOICE, slack-agent-voice, `.cursor/rules/` | `contact@meshal.ai`; Cloud Agent on `alawein/alawein` |
| Claude (legacy) | `U0AQQFJT8AC` | `claude-slack` `ready` | `claude-legacy-slack` | Legacy Slack bot | slack-agent-voice; Tag runbook | Per-user Slack connect; Tag not enabled |
| Claude Code | none in Slack | `claude-code` `ready` | `claude` | not in this thread | `claude-agent-platform/`, AGENT 1.5.1, VOICE | Laptop `contact@meshal.ai`; home sync |
| Computer | `U0APW7F9S4A` | `computer-perplexity` `needs_auth` | Perplexity | Perplexity (self-claim) | slack-agent-voice; browser lane | Perplexity user session, not a Cursor MCP |
| Kilo | `U0BV9U2GFED` | **missing** | [unknown] | Kilo Cloud Agent (self-claim) | cannot read alawein files | Kilo GitHub App; not on `alawein/alawein` |
| Notion AI | `U0AQ8UNAKTK` | `notion-ai-slack` `ready` | Notion AI | silent this thread | Notion-only lane | `contact@meshal.ai` / workspace `8116d8de-2215-81ce-b71b-00031e833a2d` |
| Codex | `U0BV7V8M3NW` | `codex-slack` `needs_auth` | `gpt-codex` | silent | slack-agent-voice after connect | ChatGPT Codex connect still required |

Related, not in the asked six: ChatGPT `U0BUNH33CCA` git `replaced`; GitHub
Slack `U0APESWEF2T` git `ready`, PR-mirror only.

#### Access per surface

| Agent | GitHub | Notion | Slack | Local / Cloud |
| --- | --- | --- | --- | --- |
| Cursor | `alawein/alawein` mutate via PR; `Github` MCP ready this run | `notion` MCP ready this run; lane is not Notion writes | Cursor Slack Tools; 7/7 list+read proved | This Cloud VM. Desktop MCP can differ (`cursor-mcp-repair.md`) |
| Claude (legacy) | UNVERIFIED from Claude surface (Claude said no GitHub connector) | Workspace identity proved (`self`, `contact@meshal.ai`) | Member 7/7; content read `#posts` + `#admin-ops` | No laptop repo lane |
| Claude Code | Laptop repo mutation (git row). UNVERIFIED this session | UNVERIFIED this session | not a Slack bot | `~/.claude/` via `claude-agent-platform/` |
| Computer | no repo mutation | browser/Drive verification when tasked | Self-claim 7/7 including `#posts`. Git notes say not in `#posts` | Cloud-only. Perplexity OAuth is the git `needs_auth` reason |
| Kilo | `ops-control-plane-grok`, `ai-ops`, `workspace-brain` only (self-claim). Those slugs are **not** in `catalog/index.yaml`. No `alawein/alawein` | UNVERIFIED | `#admin-ops` only (self-claim) | Kilo Cloud Agent sessions. Do not expand the Kilo GitHub App here |
| Notion AI | no | Operations Hub, Master Tasks (Status required), Projects (Canonical) only | silent this thread | Notion workspace only |
| Codex | diff-only after connect | UNVERIFIED | silent; installed `#admin-ops` only | Blocked on ChatGPT Codex connect |

#### Cursor Cloud MCP this run vs YAML 2026-09-06

Live `GetDynamicTools` catalog on this run. Did not call Gmail, Drive, or
Railway tools (AGI hard-never).

Ready: Cursor Slack Tools, Slack (third-party, redundant), Github, Gmail,
Google-calendar, Google-drive, Railway, Cloudflare-docs, Godaddy, Treg,
cursor-cloud, cursor-subscriptions, **notion** (YAML still says
`cursor_mcp: absent`).

Loading: 1password, Playwright (YAML listed Playwright ready on 2026-09-06).

Error: Figma, Todoist, Supermemory (YAML listed Supermemory as loading).

needsAuth: Calendly, Cloudflare-bindings, Cloudflare-builds,
Cloudflare-observability, Context, Docusign, Fireflies, Granola,
Huggingface-skills, Lovable, Mobbin, Neon, Onedrive, Posthog, Wonder, Zoom.

Desktop (from YAML / repair runbook, not re-probed here): Gmail, Calendar,
Drive, Railway absent or CLI unauthorized; Slack duplicate removed; GitHub
ready; Notion absent; Supermemory dropped.

### 2. Drift and consensus root cause

Three mismatches share one pattern: Slack coordination advanced a label
without a git row change. Git remains SSOT.

#### Kit `AGENT.md` 1.5.1 vs Slack 1.6.0

`prompt-kits/AGENT.md` is a registered workspace system prompt (identity,
voice, code conventions). Frontmatter, `prompt-kits/registry.yaml`, and
`prompt-kits/KITS-CHANGELOG.md` all say 1.5.1 (2026-09-07). There is no
1.6.0 kit in git.

The Slack ping is a different document: shared-session operating rules
(HARD NEVER, lanes, dispatch, improve-in-place). Those rules already live
in `slack-agent-runbook.md`, `slack-agent-voice.md`,
`unified-agent-system.md` §5, and `catalog/agent-integrations.yaml`.

Root cause: the ping reused the kit filename and incremented a version in
Slack. That is a coordination label, not a landed kit bump. Kilo treated
Slack as ahead of git. Cursor treated them as two files. Claude called it
a human reconcile, not an auto-bump. Correct close: keep 1.5.1, or ask
for a real 1.6.0 rewrite of `prompt-kits/AGENT.md` plus registry and
changelog.

#### Computer `ready` vs `needs_auth`

Git `computer-perplexity` is `needs_auth` because Lane B (2026-09-05)
failed Perplexity OAuth. Notes also say Computer DMs are welcome blurbs
and Computer is not in `#posts`. Unified-agent-system still says
"Needs auth (Slack)" for Computer.

The Slack prompt and Computer's own posts use `ready` to mean Slack
channel reads (claimed 7/7 including `#posts`). That is a different
predicate from Perplexity auth.

Root cause: one status enum is being used for two surfaces. Slack
membership can be true while the browser connector is still
`needs_auth`. Flipping git to `ready` on a Slack self-claim would hide
the Lane B gap. Close: keep `needs_auth` until Perplexity OAuth is
proved, or split Slack-read vs connector status if a schema change is
asked.

#### Missing Kilo row `U0BV9U2GFED`

Kilo posted in this thread and stated a three-repo Cloud Agent lane. The
2026-09-07 Slack prompt names that lane. `catalog/agent-integrations.yaml`
has no `kilo` id. `catalog/index.yaml` does not list those three repos.
HARD NEVER forbids expanding the Kilo GitHub App onto `alawein/alawein`
without a human ask. Adding an agent id requires
`validate-agent-integrations.py --write-snapshot --strict`.

Root cause: Slack dispatch added an operating lane before a catalog row
existed. Cursor did not invent the row in this PR. Close: scoped land of
a `kilo` row (3 repos, `#admin-ops` only, no `alawein/alawein`) plus
snapshot, after an explicit ask.

### 3. Chat / voice divergence

Contract: `docs/governance/slack-agent-voice.md` v1.0.0. First line is
ask or status. Bold field labels only. No em dash. No pipe tables in
threads (tables go on Canvas). No emoji status rows. Max 6 lines routine,
3 FYI, 4 incident. Mention Meshal only for a decision, a required reply,
or the first incident ping. Workflow bots are exempt; they did not post
here.

| Poster | First-line status | Length | Tables / emoji rows | Meshal mention | Verdict |
| --- | --- | --- | --- | --- | --- |
| Cursor | yes | mostly 4 to 6 blocks | no thread tables; comparison stored in this file | omitted on prove and conclusion | closest to contract |
| Claude | Tag upsell, then a long audit | far over 6 lines; duplicate post | green/yellow/red circle rows (banned in threads) | decision ask on topic tweaks and kit version | fails length, emoji-row, and duplicate-post rules |
| Computer | yes | within 6 on conclusion | no | tagged Meshal for merge and OAuth gates | labeled fields ok; merge tag is a decision |
| Kilo | yes | over 6 on consensus | no | implied "if you want" | over-length; asked for a kit bump git forbids |
| Notion AI, GitHub, ChatGPT, Codex | no post | n/a | n/a | n/a | silent; no voice score |

Other contract misses: Claude's first reply is a product CTA
("enable Claude Tag"), not a labeled-fields status. Computer and Claude
collapsed Slack-read proof into a git `ready` recommendation. Kilo
treated Slack 1.6.0 as the kit SSOT.

### 4. Pros and cons by lane

| Lane | Pros | Cons |
| --- | --- | --- |
| Cursor Cloud Agent | Live MCP + git + PR on `alawein/alawein`. Cursor Slack Tools bound to the thread. Can land `last_verified`. | Merge is 403. This run's model (`cursor-grok-4.6-high-fast`) is not the YAML default. Desktop vs Cloud MCP diverge. Notion MCP ready here but Notion writes are out of lane. |
| Cursor desktop IDE | Local MCP repair, merge clicks, laptop files. | Cloud-ready connectors (Gmail, Drive, Railway) can be absent. Not this session. |
| Claude legacy Slack | Fast channel reads and Notion identity without repo risk. | Tag not enabled. No GitHub. Voice-contract failures. Cannot update git. Duplicate posts. |
| Claude Code | Laptop mutation and `claude-agent-platform` skills. | Not present in this thread. Status `last_verified` 2026-09-05 is stale relative to this ping. |
| Computer | Browser/GUI is the only allowed visual prove path. | Git `needs_auth` (Perplexity). Slack-ready claim does not clear OAuth. No repo mutation. |
| Kilo | Isolated Cloud Agent lane keeps Kilo App off the control plane. | No catalog row. Cannot read SSOT files. Consensus asked for a kit bump Cursor must not do. Three named repos are outside this catalog. |
| Notion AI | Correct narrow write surface (Hub, Master Tasks, Canonical Projects). | Silent this thread. Easy to invent a second Projects DB if the lane is ignored. |
| Codex / ChatGPT | Clear replace rule: wait for Codex connect; do not dispatch ChatGPT. | Both silent. Codex `needs_auth` blocks the diff-only lane. ChatGPT still installed. |

Tooling connections:

- Keep Cursor Slack Tools as the Slack-launched canonical path. Third-party
  `Slack` MCP is ready and redundant.
- Keep Notion AI as the Notion write surface even though Cursor `notion`
  MCP is ready on this Cloud run.
- Keep Computer for browser proof. Do not treat Slack reads as connector
  health.
- Keep Codex parked until connect + Reply OK.
- Do not add Mem0, Letta, Zep, Hermes, OpenClaw, or extra Slack bots
  before 2026-09-19.
