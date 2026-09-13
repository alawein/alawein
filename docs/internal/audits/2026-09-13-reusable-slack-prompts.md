---
type: audit
status: draft
last_updated: 2026-09-13
owner: meshal
---

# Reusable Slack prompts (2026-09-13)

Working pointer. Not SoR. Not a second inventory. Git wins.

**Slack canvas:**
[Reusable Slack prompts 2026-09-13](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C1B0USHDH).
**Kit:** `prompt-kits/AGENT.md` 1.8.3.
**Voice:** `docs/governance/slack-agent-voice.md` v1.2.2.
**Coverage pack (one-off Prompts 0 to 10):**
`docs/internal/audits/2026-09-12-coverage-prompt-pack.md`.

Paste one pack per thread. Tag one agent. Do not @-all. Paste the
Shared session block only when the kit version changes.

## How to use

1. Copy one block below.
2. Fill Goal, Context, Done when.
3. Tag one agent. New thread unless it is a follow-up.
4. First line of the Slack message is the ask.

## Daily shell (every ping)

Use `docs/governance/slack-agent-voice.md` section Draft-to-prompt pack
(v1.2.2 section 7) and `.claude/skills/slack-draft-to-prompt/SKILL.md`.
Do not keep a third copy of the template here.

## Shared session (once per kit bump)

Canonical block lives in `prompt-kits/AGENT.md` section Shared session
prompt (1.8.3). Do not keep a second copy here.

```text
Paste the Shared session prompt from prompt-kits/AGENT.md 1.8.3, then
your scoped ask. Do not paste the kit again on later pings.
```

## Slash and Slack commands

Use these as-is. One command per message.

```text
/invite @Cursor
```

Send in `#me-agents-eng` (`C0BVDBHLXQB`). Cursor is `U0APW2Z3GG2`.

```text
/invite @Claude
```

```text
/invite @Computer
```

Send those two in `#me-agents-ops` (`C0BVDBHPB99`). Claude is
`U0AQQFJT8AC`. Computer is `U0APW7F9S4A`.

```text
@Claude connect
```

Human Claude Tag step. Do not claim Tag is done until the legacy
banner is gone.

```text
@Codex Reply OK
```

Skip until Codex Connect. Do not tag `@ChatGPT` (`U0BUNH33CCA`).

Do not send: `/invite @Grok`, `/invite @ChatGPT`, `/invite @Hermes`.

## R1. Cursor Slack (git, validators, PR)

*Send:* `#admin-ops` or this Cursor DM. New thread.

```text
*Goal:* [one sentence of repo work]
*Context:* alawein/alawein. Kit AGENT.md 1.8.3. Search open PRs first
  (#268 and #269 are docs, not a catalog land; #267 merged).
*Constraints:* no AGI; no second inventory; no Slack Grok; no catalog
  or kit edit if a land PR is already open (report Mismatch); Cloud
  merge is 403
*Done when:* PR link plus one proved fact
*Tag:* Cursor U0APW2Z3GG2
```

## R2. Claude Slack (analysis only)

*Send:* `#admin-ops` or `#me-agents-ops`. HOLD: last real post was
2026-09-08. Do not retag for inventory.

```text
*Goal:* [one analysis question]
*Context:* [thread or canvas URL]. Kit AGENT.md 1.8.3.
*Constraints:* 4 lines; no table; no catalog edit; no new kit paste;
  Tag enable is human-only
*Done when:* Lane / Proved / Next
*Tag:* Claude U0AQQFJT8AC
```

## R3. Computer (browser or GUI)

*Send:* only after you paste a URL.

```text
*Goal:* [one GUI check]
*Context:* [the exact URL]
*Constraints:* one ack then wait if a URL is missing; no git edit;
  no catalog edit; no install click; no @ChatGPT
*Done when:* screenshot or one-line proof, then stop
*Tag:* Computer U0APW7F9S4A
```

## R4. Claude Code laptop (SoR and opinion)

*Send:* new local Claude Code session on Windows. Not this Cloud VM.

```text
*Goal:* [laptop prove, or opinion on a git file]
*Context:* Desktop/GitHub/alawein/core/alawein; Desktop/ops-shared-inventory;
  prompt-kits/AGENT.md 1.8.3
*Constraints:* report only unless Meshal asked for a local edit; no
  Grok Name/Label/Description/routines/memory writes; no Slack Grok;
  no AGI / Desktop/AGI; no second inventory YAML
*Done when:* table of path, exists Y/N, last-write, one-line note
*Tag:* Claude Code (laptop)
```

## R5. Intake (Grok Bot desktop)

*Send:* Intake, new Grok Bot chat.

Copy Prompt 10 from
`docs/internal/audits/2026-09-12-coverage-prompt-pack.md`.
Do not duplicate the prompt body here.

## R6. Notion AI Slack

*Send:* only for Operations Hub, Master Tasks, or Projects (Canonical).

```text
*Goal:* [one Notion row or page action]
*Context:* Meshal's Workspace 8116d8de-2215-81ce-b71b-00031e833a2d
*Constraints:* no second Projects database; do not write the Morning
  Brief (Notion Custom Agent only); Slack is a pointer
*Done when:* URL of the changed page or row
*Tag:* Notion AI U0AQ8UNAKTK
```

## R7. Handshake pair (already proved 2026-09-12)

Do not rerun unless a surface changed. Copy Prompts 7 to 9 from the
[handshake canvas](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C0Y0FGQ9M)
or `docs/internal/audits/2026-09-12-coverage-prompt-pack.md`.
Do not duplicate those bodies here.

## Canvas index (keep, do not clone)

| Canvas | Use |
| --- | --- |
| [Reusable Slack prompts](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C1B0USHDH) | This pack |
| [Handshake 7 to 9](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C0Y0FGQ9M) | Cursor IDE + Grok YAML pair |
| [Chat scan](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C16U6USJ0) | Inventory pointer. Not SSOT |
| [Lane inventory](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C0KEF150C) | 2026-09-08 lane tables |
| [Lane start playbook](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C103K0FHN) | Dated. PR #232 is done. Do not rerun |
| [Shared session 1.6.0](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0BVD6RBGNA) | SUPERSEDED. Do not paste |
| Cursor IDE prompt canvases `F0C057E1ATW`, `F0C06CLKYMS`, `F0C07ALADLL` | Dated 2026-09-07. Park |

## Do not reuse

- Standing inventory ping from 2026-09-07 (`#admin-ops`). Too long. Causes @-all.
- Weekly Content Planning Prompt in `#content-pipeline`. 0 replies.
- Daily Briefing invent-in-Slack. Now a Notion pointer only.
- Friday Review / Monday Kickoff fill-in templates. Trial through 2026-09-19.
- `@ChatGPT`. Replaced.
- Kilo on `alawein/alawein`.
- Computer without a URL.
- Another Cloud inventory of this repo.

## Change evidence

| Field | Recorded value |
| --- | --- |
| Work item | Slack: curate reusable prompts; apply Claude Code keep/cut/merge |
| Work kind | docs |
| Accountable maintainer | Meshal Alawein |
| Actual commit author | Meshal Alawein `<contact@meshal.ai>` |
| Executor | Cursor Cloud `bc-5ebd0559` |
| Independent reviewer | Claude Code laptop 2026-09-13; keep/cut/merge accepted |
| Checks | listed on the PR |
| Open control-plane PRs | #268, #269. #267 merged 2026-09-13 |
| Final approval | pending Meshal |
