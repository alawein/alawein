---
type: canonical
source: none
sync: none
sla: on-change
title: Unified agent system
description: Master orchestration, inventory SSOT, dispatch routing, and chat output standards for the Alawein agentic workspace.
last_updated: 2026-09-13
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.5.2
tags: [agents, orchestration, integrations, slack, mcp, llm, inventory]
---

# Unified agent system

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This document is the inventory and Slack-dispatch SSOT. Admission, run
envelopes, receipts, and recovery live in
[`control-plane.md`](control-plane.md). This page extends
[`slack-agent-runbook.md`](slack-agent-runbook.md) (channel and bot policy) with
routing, inventory tracking, and output conventions.

**Machine-readable inventory:** [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml)

## 1. System map

```mermaid
flowchart TB
  subgraph Human["Meshal (contact@meshal.ai)"]
    H[#admin-ops command center]
  end

  subgraph SlackAgents["Slack agent layer"]
    C[@Cursor]
    CL[@Claude]
    CP[@Computer]
    CG[@Codex]
    N[@Notion AI]
    GH[@GitHub]
    KI[@Kilo]
  end

  subgraph WorkflowBots["Workflow bots (5)"]
    DM[Daily Agenda → DM]
    P[#posts digest hub]
    CPipe[#content-pipeline]
  end

  subgraph CursorMCP["Cursor MCP plane"]
    G[Gmail / Calendar / Drive]
    R[Railway / Vercel CLI]
    X[GitHub MCP ready on Cloud; third-party Slack MCP redundant — optional remove]
  end

  subgraph Canon["Governance SSOT (alawein)"]
    U[unified-agent-system.md]
    S[slack-agent-runbook.md]
    Y[agent-integrations.yaml]
  end

  H --> SlackAgents
  SlackAgents --> CursorMCP
  WorkflowBots --> P
  WorkflowBots --> CPipe
  C --> Canon
  CL --> Canon
  CP --> Canon
```

## 2. Design goals

| Goal | Mechanism |
| --- | --- |
| One inventory | `catalog/agent-integrations.yaml` + this doc |
| One command center | `#admin-ops` for human + agent traffic |
| Verified state only | Live tool reads; `UNVERIFIED` when blocked |
| Minimal chat noise | Dispatch rules; no duplicate audit narratives |
| Repo truth | Cursor commits governance to `alawein` |
| Parallel work | Tagged handoffs + Cursor subscriptions |

## 3. Agent and LLM inventory

| Agent | Surface | Default model | Primary jobs | Status |
| --- | --- | --- | --- | --- |
| **Cursor** | Slack, Cloud Agent, IDE | Composer 2.5 | Implement, commit, PR, MCP, governance docs | Ready |
| **Claude** | Slack bot | Legacy Slack | Slack reads, audits, synthesis | Ready (Tag pending) |
| **Claude Code** | IDE / terminal | Claude | Repo mutation, terminal, MCP | Ready |
| **Computer** | Slack, Perplexity web | Perplexity | Browser audit, design docs, verification | Ready (2026-09-07) |
| **Codex** | Slack | GPT Codex | Gap-fill after ChatGPT Codex connect | Needs auth |
| **ChatGPT** | Slack | GPT | Replaced by Codex; never posted | Replaced |
| **Notion AI** | Slack, Notion | Notion AI | Notion workspace reads | Ready |
| **GitHub for Slack** | Slack | None | PR thread mirroring | Ready |
| **Kilo** | Slack | UNVERIFIED | Cloud Agent sessions on three non-control-plane repos | Ready; no `alawein/alawein` |

### LLM backends in use (tracked)

| Backend | Where it runs | Account | Notes |
| --- | --- | --- | --- |
| Composer 2.5 | Cursor Cloud Agent | `contact@meshal.ai` | This session's default |
| Claude (legacy Slack) | `@Claude` in Slack | Per-user connect | Enable Claude Tag for modern routing |
| Perplexity | `@Computer` / web | User session | Produced `slack-workspace-design.md` v1.1 |
| GPT Codex | `@Codex` in Slack | ChatGPT Codex connect | Needs account link; S4 remapped |
| GPT | `@ChatGPT` in Slack | None | Replaced; user `U0BUNH33CCA` silent |
| Notion AI | `@Notion AI` | `contact@meshal.ai` | Workspace `8116d8de-…` |
| Workflow bot LLMs | Slack workflows | Unknown | Backends not inventoried yet |

## 4. Integration registry (unified)

Canonical account: **`contact@meshal.ai`**. Any other account is a re-auth candidate.

| Integration | Account | Cursor MCP | Slack / other | Status | Last verified |
| --- | --- | --- | --- | --- | --- |
| Gmail | `contact@meshal.ai` | Ready | None | Locked | 2026-09-05 |
| Google Calendar | `contact@meshal.ai` | Ready | None | Locked | 2026-09-05 |
| Google Drive | `contact@meshal.ai` | Ready | Computer session | Locked | 2026-09-05 |
| Notion | `contact@meshal.ai` | Needs auth | Notion AI | Locked | 2026-09-05 |
| Railway | `contact@meshal.ai` | Ready | None | Locked | 2026-09-05 |
| Vercel (`alawein`) | Team | CLI only | 32 projects; 8 UNVERIFIED | Locked | 2026-09-05 |
| GitHub | Scoped token | Desktop ready / Cloud ready | GitHub for Slack | Ready | 2026-09-06 |
| Supermemory | None | Dropped (desktop) / Cloud error | None | Dropped | 2026-09-05 |
| Slack MCP (dup) | None | Desktop removed / may appear in Cloud discovery | None | Documented redundant; optional Cloud remove | 2026-09-06 |
| Granola / Neon / Mobbin / PostHog / Zoom / etc. | None | Needs auth | None | Unconnected | 2026-09-05 |

**Cross-surface matching rule:** when Slack claims an integration exists, confirm
the same account and scope in Cursor MCP (or mark `UNVERIFIED`).

### 4.1 Slack MCP routing

Slack-launched Cloud Agents use **Cursor Slack Tools** only for thread reads,
posts, and channel discovery. A third-party `Slack` MCP namespace may still
appear in Cloud Agent tool discovery; it is redundant and can be ignored or left
disabled. Do not route Slack work through the duplicate namespace. Policy and
verification steps: [`cursor-mcp-repair.md`](cursor-mcp-repair.md) §4 and §4.1.

## 5. Dispatch and orchestration

### 5.1 Routing matrix

| Task type | Primary agent | Secondary | Never |
| --- | --- | --- | --- |
| Code + PR + governance commit | **Cursor** | Claude Code | Codex alone |
| Slack channel/bot live reads | **Claude** or Cursor | None | Assert without read |
| Browser / GUI verification | **Computer** | Codex (after connect) | Cursor without MCP |
| Notion / Drive file ownership | **Computer** then Codex | Cursor MCP | Inherited claims |
| Design doc lock (`.md`) | **Computer** | Cursor commit | Duplicate narratives |
| Connector gap-fill (diff only) | **Codex** (after connect) | Computer | Full re-audit |
| Kilo-lane git (`ops-control-plane-grok` freeze candidate, `ai-ops`, `workspace-brain` Linux mirror) | **Kilo** | None | `alawein/alawein`; treat grok/brain as non-SoR |

### 5.2 Multi-agent dispatch protocol

Use this in `#admin-ops` threads:

1. **Tag in priority order**, state who answers first.
2. **Each agent posts once**, voice-compliant. Canvas only if a table is
   required. No restating prior audits.
3. **Diff-only follow-ups**, later agents fill `UNVERIFIED` rows only.
4. **Cursor lands artifacts**, commits to `alawein/docs/governance/`.
5. **No fake handoffs**, agents cannot invoke each other; Meshal tags the next.

```mermaid
sequenceDiagram
  participant M as Meshal
  participant C as Cursor
  participant CL as Claude
  participant CP as Computer
  participant CG as Codex

  M->>C: Tag + scoped task
  C->>C: Live MCP / git work
  C-->>M: Status, Lane, Proved or Mismatch, PR link
  M->>CL: Verify Slack-side rows
  CL-->>M: 4-line voice ack
  M->>CP: Browser / connector gaps
  CP-->>M: Verified rows or UNVERIFIED
  M->>CG: Diff-only on UNVERIFIED
  CG-->>M: Corrections only
  M->>C: merge / continue Phase N
```

### 5.3 Parallel dispatches (Cursor)

| Capability | Tool | When to use |
| --- | --- | --- |
| Thread follow-up | `subscribe_slack_thread` | Wait for human reply or bot output |
| Channel watch | `subscribe_slack_channel` | Monitor `#kohyr-dev` after invite |
| New channel alert | `subscribe_slack_new_channels` | Fleet growth |
| PR events | `subscribe_github_pr` | Post-merge CI |
| CI terminal | `subscribe_github_ci` | Branch validation |
| Fleet batches | `parallel-batch-execution.md` | Multi-repo codegen (not chat) |

**Rule:** parallel chat agents are coordinated by Meshal tags, not agent-to-agent
messages. Parallel repo work uses `workspace-tools` batch manifests.

### 5.4 Parallel lane template (`#admin-ops`)

Run only **open** lanes. Do not re-open completed Computer or Cursor
channel work. Browser OAuth is Meshal. Do not invent Sider/Claw as a
required owner.

| Lane | Owner | Work | Pass |
| --- | --- | --- | --- |
| A | Meshal (browser OAuth) | Connect `@Codex` to ChatGPT Codex; DM `Reply OK` | Codex replies |
| B | Meshal (browser OAuth) | Drive kitchen leave/unshare; Claude Tag | Human decision |
| C | Done | Cursor reads 7/7 including `#posts` | Cloud Agent reads 7/7 |
| D | `@Cursor` | Live prove on the land branch only | `last_verified` on the land PR |
| E | Desktop IDE Cursor | Local MCP, git author, Claude home sync | Windows evidence or UNVERIFIED |
| F | `@Claude` / `@Notion AI` / `@Kilo` | Lane ack, voice-compliant, 4 lines | No table, no re-audit |

Computer is `ready` (7/7 including `#posts`). Cursor is 7/7. Codex still
needs ChatGPT connect. ChatGPT stays installed and `replaced` until Codex
`Reply OK`; then uninstall ChatGPT.

**Desktop vs Cloud MCP rule:** never collapse statuses. A desktop `ready` does
not imply Cloud Agent can call the tool (and the reverse). Inventory rows keep
both surfaces (`cursor_mcp` notes or split columns).

**OpenAI Slack rule:** dispatch `@Codex` only after connect + `Reply OK`. Keep
`@ChatGPT` (`U0BUNH33CCA`) installed but `replaced` until Codex proves reply;
then uninstall ChatGPT.

Sample dispatch (paste into `#admin-ops`):

```markdown
Open lanes only. Computer ready. Cursor 7/7.
A: Meshal connects Codex (browser OAuth). Do not invent Sider/Claw.
B: Meshal Claude Tag and Drive kitchen leave/unshare.
D: @Cursor prove on the land branch.
E: desktop Cursor records Windows evidence or UNVERIFIED.
F: @Claude @Notion AI @Kilo 4-line lane ack. No table. No re-audit.
Do not uninstall ChatGPT until Codex Reply OK.
```

## 6. Chat output standards

Apply in Slack and governance docs. Voice contract:
[`docs/style/VOICE.md`](../style/VOICE.md).

### 6.1 Structure template

**Slack threads** use [`slack-agent-voice.md`](slack-agent-voice.md): labeled
fields, no pipe tables, Canvas for tables. Do not paste the repo template
below into a Slack message.

**Repo / Canvas** template:

```markdown
## [Agent] - [one-line outcome]

### Status
| Item | State |
| --- | --- |
| ... | verified / partial / blocked / unverified |

### Findings (table)
| ... | ... |

### Checklist
- [ ] Done item
- [ ] Open item

### Next
One sentence: what Meshal or the next tagged agent should do.
```

### 6.2 Format rules

| Element | Rule |
| --- | --- |
| **Tables** | Repo and Canvas default for inventories. Slack threads: never. Canvas only if a table is required. |
| **Checklists** | Action items only; `- [ ]` / `- [x]` |
| **Diagrams** | Mermaid in governance docs; ASCII in Slack if Mermaid unavailable |
| **Highlights** | Slack: `*bold*` for decisions; avoid emoji spam |
| **Evidence** | One column or footnote: tool name + date |
| **Status words** | verified / partial / blocked / unverified. Slack threads: no emoji status rows |
| **Banned** | Executive summary padding, duplicate audits, "handing off" without data |

### 6.3 Slack vs repo

| Surface | Format |
| --- | --- |
| Slack thread | [`slack-agent-voice.md`](slack-agent-voice.md): labeled fields, no em dash, Canvas for tables |
| `alawein` governance | Full tables, mermaid, versioned changelog |
| Computer design | `slack-workspace-design.md` → Cursor commits runbook |

## 7. Tracking checklist (living)

Update `catalog/agent-integrations.yaml` when any row changes.

### 7.1 Inventory maintenance

- [ ] Monthly re-verify all `integrations` rows (live MCP or CLI)
- [ ] After any OAuth change, update account column same day
- [ ] Keep Slack `cursor_can_read` accurate per channel invite
- [ ] Log workflow bot engagement at Sept 19 review gate
- [ ] Inventory workflow-bot LLM backends (currently unknown)

### 7.2 Open unification gaps

- [x] Merge [PR #196](https://github.com/alawein/alawein/pull/196) (unified system + runbook)
- [x] Merge Phase 2 closeout ([PR #198](https://github.com/alawein/alawein/pull/198); #197 closed)
- [x] `/invite @Cursor` in `#kohyr-dev`, `#all-alawein-workspace`
- [x] `/invite @Cursor` in `#posts`, `#content-pipeline`, `#job-search`, `#social` (7/7 reads)
- [x] Fix Cloud Agent GitHub MCP (ready 2026-09-06 rescan)
- [x] Document redundant third-party Slack MCP; keep Cursor Slack Tools canonical
  — see [`cursor-mcp-repair.md`](cursor-mcp-repair.md) §4 and §4.1; registry §4.1
- [x] Authenticate Computer in Slack (ready 2026-09-07; 7/7 reads)
- [ ] Connect `@Codex` to ChatGPT Codex account; do not dispatch `@ChatGPT`
- [ ] Enable Claude Tag — runbook: `docs/governance/claude-tag-migration.md`
- [ ] Execute channel v2 migration — plan: `docs/governance/slack-channel-migration-plan.md` (gate 2026-09-19)
- [ ] Vercel browser inspect: `sam-eval-roadmap`, `guides-eval-loop-app`
- [x] Add `validate-agent-integrations.py`: YAML schema + drift check in CI

## 8. Related canon

| Doc | Role |
| --- | --- |
| [`slack-agent-runbook.md`](slack-agent-runbook.md) | Slack channels, bots, Phase 2–4 cleanup |
| [`parallel-batch-execution.md`](parallel-batch-execution.md) | Multi-repo batch jobs (not chat) |
| [`workspace-resource-map.md`](workspace-resource-map.md) | Fleet resource ownership |
| [`credential-hygiene.md`](credential-hygiene.md) | Secret handling |
| [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml) | Machine-readable inventory SSOT |
| [`claude-tag-migration.md`](claude-tag-migration.md) | Legacy → Claude Tag admin steps |
| [`slack-channel-migration-plan.md`](slack-channel-migration-plan.md) | Proposed v2 channel topology |
| [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md) | Shared session prompt (paste for every agent) |
| [`slack-agent-voice.md`](slack-agent-voice.md) | Thread voice, human drafts, draft-to-prompt pack |

## 9. Claude handoff (remaining work)

Tag `@Claude` with this scoped prompt for items Cursor cannot close alone:

> Read `docs/governance/unified-agent-system.md` and
> `catalog/agent-integrations.yaml`. Do not restate the Slack audit.
>
> **Deliver three sections only:**
>
> 1. **External inventory diff**, compare YAML integrations against every
>    connector you can read live (Slack apps list, Notion, any Google scope).
>    Table: `id | yaml_status | live_status | match? | evidence`
> 2. **LLM backend map**, for each Slack app and workflow bot, state the
>    vendor/model if discoverable; else `UNVERIFIED`.
> 3. **Optimized dispatch v2**, one mermaid diagram + 5-row routing table
>    revising §5.1 if your live reads suggest changes.
>
> Rules: voice-compliant, max 4 lines in Slack. Canvas only if a table
> is required. Evidence required. Mark blockers `UNVERIFIED`.

## 10. Changelog

### v1.5.2 (2026-09-13)

- Shared session prompt is `prompt-kits/AGENT.md` 1.8.0.
- Reply style adapters: RICH for Cursor / ChatGPT / Claude / Grok Bot
  chat, CLI for Codex CLI, SLACK for threads.

### v1.5.0 (2026-09-07)

- §5.1 adds Kilo (3 repos, never `alawein/alawein`).
- §5.2: post once, voice-compliant; Canvas only if a table is required.
- §5.4: Computer ready, Cursor 7/7, Codex still needs connect, ChatGPT
  installed and replaced until Codex Reply OK. Browser OAuth is Meshal.
- Shared session prompt is `prompt-kits/AGENT.md` 1.7.0.
- Related canon: `slack-agent-voice.md` now covers human drafts and the
  draft-to-prompt pack.

### v1.4.3 (2026-09-07)

- Shared session prompt lives in `prompt-kits/AGENT.md` 1.6.0. Slack
  threads follow `slack-agent-voice.md`; the §6.1 table template is
  repo and Canvas only.
- Computer marked ready. Kilo added (three-repo GitHub App).

### v1.4.2 (2026-09-06)

- Added [`slack-agent-voice.md`](slack-agent-voice.md): thread and Canvas format
  contract for agent status updates (no em dash, syntax highlighting, sparse emoji).

### v1.4.1 (2026-09-06)

- Closed Slack MCP redundancy checklist row; added §4.1 Slack MCP routing policy.
- GitHub MCP Cloud ready; third-party Slack MCP documented redundant (optional remove).

### v1.4.0 (2026-09-06)

- Added Claude Tag migration runbook and draft Slack channel v2 migration plan.
- Linked inventory and checklist rows to new governance docs.

### v1.3.0 (2026-09-06)

- Cursor invite sweep complete: Cloud Agent reads 7/7 public channels.
- Cloud Agent GitHub MCP ready; third-party Slack MCP documented as redundant.
- Added `validate-agent-integrations.py` with snapshot drift detection in CI.

### v1.2.0 (2026-09-05)

- Added §5.4 parallel lane template (A–F) for OAuth, invites, Cloud probe, IDE
  canon, and diff-only agents.
- Documented desktop vs Cloud MCP non-collapse rule and Codex vs ChatGPT
  uninstall gate.

### v1.1.0 (2026-09-05)

- OpenAI Slack surface remapped from `@ChatGPT` to `@Codex`.
- Closed merge and Cursor-invite checklist rows after #196 / #198 / live invites.
- Pointed remaining MCP work at Cloud vs desktop split.

### v1.0.0 (2026-09-05)

- Initial unified system: inventory YAML, dispatch protocol, output standards,
  tracking checklist, Claude handoff.
