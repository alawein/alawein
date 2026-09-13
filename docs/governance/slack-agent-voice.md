---
type: canonical
source: none
sync: none
sla: on-change
title: Slack agent voice
description: Thread and Canvas formatting contract for agent and human Slack messages, including draft-to-prompt packing.
last_updated: 2026-09-12
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.1.2
tags: [slack, voice, agents, formatting, async]
---

# Slack agent voice

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

Agents posting to Slack threads must follow this contract. It is separate from
[`VOICE.md`](../style/VOICE.md) (governed docs) and
[`slack-voice-exemptions.md`](slack-voice-exemptions.md) (workflow bots).

**Machine inventory:** [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml)

## Verdict

Default to a **labeled-fields thread**: ask or status on line 1, short labeled
lines below. Use **Canvas** only for tables, checklists, or content that must
persist across updates.

## Thread vs Canvas

| If | Then |
| --- | --- |
| No table, fits in six lines or fewer | Thread only |
| Table with four or more rows, checklist, or rolling reference doc | Thread ping (four lines max) plus Canvas link |
| Active incident | Thread first; Canvas only for post-incident detail |

Slack **messages** use mrkdwn only. Pipe tables in threads render as raw text.
Tables belong in **Canvas** or Block Kit, not in thread bodies.

## Formatting rules

### Typography

- **Write like a teammate.** Short complete sentences. No status-dump walls.
  Labeled fields only when they help scan. Prefer one plain sentence when a
  label is not needed.
- **No em dash.** Use a hyphen, colon, or line break instead.
- **Bold** field labels only (`*Next:*`, `*Need:*`). Do not bold whole sentences
  or the first line.
- *Italic* sparingly for secondary emphasis.
- **Line breaks** between logical blocks. Do not pack multiple ideas on one line.

### Syntax highlighting

Use backticks for technical identifiers in threads:

- Repo paths: `catalog/agent-integrations.yaml`
- Commands: `python3 scripts/catalog/validate-agent-integrations.py --strict`
- PR refs: `PR #209`
- Env vars, flags, branch names, MCP namespaces

In **Canvas**, use fenced code blocks for multi-line commands or config snippets.

### Links and mentions

- Links use Slack mrkdwn link syntax (URL plus display label in angle brackets).
- Mention `<@U0APM5W630C>` only when a decision or reply is required, or on the
  first ping of an incident.
- Meshal tags the next agent. Agents do not @ each other to start work.
- Flag unknowns as `[unknown]` or `[confirming]`. Do not guess or omit silently.
- Omit fields that do not apply. Do not write "none".

### Emoji

- **Threads:** optional, sparse. At most one per message, only when it adds
  scan value (for example `:warning:` on an incident). No emoji status rows
  (no red/yellow/green circles as substitutes for words).
- **Canvas:** status emoji in section headers is allowed (`:large_green_circle:`).

### Length limits

| Template | Max lines |
| --- | --- |
| Default status | 6 |
| Approval needed | 6 plus deadline line |
| FYI | 3 |
| Handoff | 5 |
| Incident (first ping) | 4 |
| Inventory / shared-session (non-Cursor) | 4 |
| Inventory / shared-session (Cursor, PR outcome) | 6 |
| Draft-to-prompt pack | 8 (Canvas if longer) |

## Human writing (Meshal drafts)

Same contract as agents when the message starts work. Rough notes stay in
a DM to self or `#me-inbox` (after 2026-09-19). Before tagging an agent,
run the draft-to-prompt pack below or the
`slack-draft-to-prompt` skill.

- One ask on line 1.
- One agent, one thread, one done-when.
- Do not paste the full shared kit on every ping. Paste it only when the
  kit version changes.
- Do not @-all. Tag only who must act.
- Do not ask every agent for consensus. Git wins.

## Decision matrix

| Situation | Surface | Template |
| --- | --- | --- |
| Routine PR or status | Thread | Default |
| Decision gates progress | Thread | Approval needed |
| Visibility, no action | Thread | FYI |
| Pass task to another agent | Thread | Handoff (Meshal tags) |
| Inventory or shared-session ping | Thread | Inventory reply |
| Four or more rows of tabular data | Canvas plus thread ping | Canvas-first |
| Active incident | Thread (updates in thread) | Incident |
| Post-incident detail | Canvas | Canvas-first |

## Templates (thread, mrkdwn)

Copy-paste ready. No pipe tables. No markdown headers in thread bodies.

### 1. Default status ping

**When:** routine progress, no urgent decision.

```
*[Project/PR]* - [status: shipped / in review / blocked]
[one line: what happened]
*Next:* [next step]
```

**Example:**

```
*PR #209* - pending review
CI green; auto-merge armed on your approval.
*Next:* merge once you approve.
```

### 2. Approval needed

**When:** Meshal must decide before work continues.

```
*[Decision]* - needs your call
[one line: what the decision is]
*Options:* [A] vs [B]
*Need:* decision by [date] <@U0APM5W630C>
```

**Example:**

```
*PR #209* - needs your call
Governance and inventory work is done; branch protection requires a human approval.
*Options:* approve now vs defer
*Need:* decision today <@U0APM5W630C>
```

### 3. FYI only

**When:** visibility, zero action required.

```
FYI - [one line]
[optional second line]
```

**Example:**

```
FYI - Notion Master Tasks: 46 rows, 0 null `Status`.
Tracking against Sept 19 workflow-bot review.
```

### 4. Handoff

**When:** Cursor passes work to another agent; Meshal is informed.

```
*[Task]* - handing off to <@[AGENT_ID]>
[one line: done vs left]
*Context:* <[url]|link text>
```

**Example:**

```
*Post-merge validation* - handing off to Claude Code
Run `validate-agent-integrations.py --strict` on `main` after merge.
*Context:* <https://github.com/alawein/alawein/pull/209|PR #209>
```

### 5. Incident

**When:** unexpected break needs immediate visibility.

```
*Incident* - [one line: what broke]
*Impact:* [what is affected]
*Status:* [investigating / mitigating / resolved]
*Next update:* [time] <@U0APM5W630C>
```

### 6. Inventory / shared-session reply

**When:** tagged on an inventory or shared-session ping.

Non-Cursor agents: max 4 lines. Cursor: max 6 lines when the outcome is a
PR link.

```
[status: proved / mismatch / unverified]
*Lane:* [your lane]
*Proved:* [one fact]
```

Use `*Mismatch:*` instead of `*Proved:*` when git and the claim disagree.
Use `*Need:*` instead of a fourth status line when Meshal must decide.

**Example (non-Cursor):**

```
Proved - Slack reads on #admin-ops
*Lane:* Claude
*Proved:* 4-line ack; no catalog edit
*Next:* waiting for Meshal tag
```

**Example (Cursor with PR):**

```
*PR #220* - kit 1.7.0 on the land branch
*Lane:* Cursor
*Proved:* AGENT.md 1.7.0; validators listed in the PR
*Next:* squash-merge #220; park #223
```

### 7. Draft-to-prompt pack

**When:** Meshal has rough text and needs a Cursor or Slack agent prompt.

```
*Goal:* [one sentence]
*Context:* [repo / channel / PR / URL]
*Constraints:* [hard nevers that apply]
*Done when:* [observable result]
*Tag:* [one agent]
```

Preserve intent. Fix English. Do not add scope. If a field is unknown,
write `[unknown]` and ask one question.

**Example (before):**

```
can you look at slack its a mess too many bots talking and i want
something that cleans my drafts into prompts
```

**Example (after):**

```
*Goal:* Add a draft-to-prompt pack so rough Slack text becomes one agent ping.
*Context:* `alawein/alawein` `docs/governance/slack-agent-voice.md`
*Constraints:* no new bots; no channel archive before 2026-09-19
*Done when:* template plus skill merged; Meshal can paste one packed ping
*Tag:* <@U0APW2Z3GG2>
```

Skill: [`.claude/skills/slack-draft-to-prompt/SKILL.md`](../../.claude/skills/slack-draft-to-prompt/SKILL.md)

## Canvas layout

Use Canvas for rolling status docs and native tables.

**Section order:**

1. Top callout: current blockers and next gate date
2. Agent inventory table
3. PR status table
4. OAuth checklist
5. Notion hygiene checklist
6. Governance SSOT pointers
7. Incident log (active or last resolved only)

**Callouts:** one or two per Canvas (`::: {.callout}`). Reserve for top status
summary or active incident banner.

**User cards:** Canvas user-mention syntax for named ownership only. At most two
per Canvas.

## Anti-patterns (banned in threads)

- Pipe tables (`| col | col |`)
- Prose paragraphs longer than two lines
- Emoji status rows as the only signal
- Em dash characters
- Stacked bold or italic walls
- Burying the ask below line 1
- Canvas for a single fact
- Filler ("circling back", "per my last message")
- Pseudo-headers (`##` in mrkdwn threads)

## Agent prompt snippet (Cursor)

Canonical paste block: [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md)
section "Shared session prompt". Adopt this shorter block in Cloud Agent
Slack turns when the full kit is already loaded:

```text
Slack thread voice: write like a teammate. First line = ask or status.
Bold field labels only when they help scan. Prefer one plain sentence
when a label is not needed. Backtick technical names (`PR #209`, paths,
commands). No em dash. No pipe tables in threads; link Canvas for tables.
Line breaks between blocks. Emoji sparse (max one if it helps scan).
Mention Meshal when a decision is needed, when a reply is required, or
on the first ping of an incident. Max 6 lines routine, 3 FYI, 4 incident.
Omit empty fields.
```

## Related canon

| Doc | Role |
| --- | --- |
| [`unified-agent-system.md`](unified-agent-system.md) | Dispatch and orchestration |
| [`slack-agent-runbook.md`](slack-agent-runbook.md) | Channels and bots |
| [`slack-voice-exemptions.md`](slack-voice-exemptions.md) | Workflow-bot register |
| [`VOICE.md`](../style/VOICE.md) | Governed markdown surfaces |
| [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md) | Shared session prompt |
| [`.claude/skills/slack-draft-to-prompt`](../../.claude/skills/slack-draft-to-prompt/SKILL.md) | Draft-to-prompt packer |

## Changelog

### v1.1.2 (2026-09-12)

- Teammate register: plain English, no status-dump walls, no em dash.
- Kit pointer moves to AGENT.md 1.7.1. Paste the shared block once when
  the kit version changes. Do not @-all.

### v1.1.1 (2026-09-07)

- Rebased onto kit 1.7.0 land (#220); merged signal protocol draft-to-prompt
  pack with inventory limits unchanged.

### v1.1.0 (2026-09-07)

- Inventory / shared-session reply: status, Lane, Proved or Mismatch,
  Next or Need. Max 4 lines for non-Cursor agents. Cursor may use 6
  lines when a PR link is the outcome.
- Meshal tags the next agent. Agents do not @ each other to start work.
- Human writing rules: one ask, one agent, one thread.
- Draft-to-prompt pack and skill pointer.

### v1.0.1 (2026-09-07)

- Point agents at `prompt-kits/AGENT.md` Shared session prompt as the
  full paste block.

### v1.0.0 (2026-09-06)

- Initial contract from Claude voice-system review and Meshal formatting prefs:
  no em dash, syntax highlighting, sparse emoji, labeled-fields default.
