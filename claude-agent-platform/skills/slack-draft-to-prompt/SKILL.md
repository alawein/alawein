---
name: slack-draft-to-prompt
version: 1.0.0
description: Turn rough Slack or chat text into a voice-compliant agent prompt. Use when Meshal pastes informal notes, asks to clean English, or wants a Cursor/Claude/Computer ping packed before send.
---

# Slack draft-to-prompt

Same contract as `.claude/skills/slack-draft-to-prompt`. After
`sync-to-home.sh` this copy is the laptop skill.

Canonical templates:
`docs/governance/slack-agent-voice.md` section "Draft-to-prompt pack".

## When to use

- User pastes messy Slack copy and wants it send-ready
- User says "make this a prompt" / "pack this for Cursor"
- User is about to tag an agent and the ask is unstructured

## Steps

1. Read the draft. If Goal or Done-when is missing, ask one question, then pack.
2. Fix English. Keep the user's meaning. Do not upgrade a question into a
   program of work.
3. Fill this block. Omit empty fields.

```text
*Goal:* [one sentence]
*Context:* [repo / channel / PR / URL]
*Constraints:* [hard nevers that apply]
*Done when:* [observable result]
*Tag:* [one agent Slack id or product name]
```

4. Add a one-line *Send:* instruction: which channel and whether this is a
   new thread or a reply.
5. If the user asked only for a rewrite (not a prompt), return the 6-line
   Slack voice message instead: status on line 1, labeled fields, no table.

## Agent pick

| If the work is | Tag |
| --- | --- |
| Git, validators, PR | Cursor `U0APW2Z3GG2` |
| Slack reads, analysis | Claude `U0AQQFJT8AC` |
| Browser or GUI | Computer `U0APW7F9S4A` plus a URL |
| Notion tasks | Notion AI `U0AQ8UNAKTK` |
| `ops-control-plane-grok`, `ai-ops`, `workspace-brain` | Kilo `U0BV9U2GFED` |
| Codex after ChatGPT connect | Codex `U0BV7V8M3NW` |

Never tag workflow bots or `@ChatGPT` (`U0BUNH33CCA`).

## Hard nevers (copy into Constraints when relevant)

- No AGI Inc / `theagi.company` / AGI-named cloud workspaces
- No Slack archive or rename before 2026-09-19
- No new Slack chat bots
- No second inventory, Canvas SSOT, or `APPROVAL_POLICY.md`
- Account is `contact@meshal.ai` only

## Output

Return only the packed block (and *Send:*). Do not lecture. Do not open a
new catalog PR. Do not post to Slack unless the user asked you to send it.
