---
type: internal
source: slack cursor thread 2026-09-07
sla: none
last_updated: 2026-09-07
audience: [ai-agents, contributors]
---

# Slack signal workflow (2026-09-07)

Internal diagnosis and plan. Canon lives in
`docs/governance/slack-agent-voice.md` v1.1.1 and
`docs/governance/slack-agent-runbook.md` §6. This file is not a second
inventory.

## 1. Diagnosis

Main friction is not missing apps. It is too many agents answering one
paste, Slack used as a database, and unused bots still firing.

Sources of clutter, ranked:

1. **All-hands kit pastes.** One `#admin-ops` message tags Cursor, Claude,
   Computer, Kilo, Notion AI, Codex, ChatGPT, and GitHub. Claude dumps a
   channel inventory. A second Cursor opens a second catalog PR. Consensus
   then points at the wrong land.
2. **Slack as SSOT.** Agents restate `catalog/agent-integrations.yaml` in
   threads. Git already owns those facts.
3. **Five workflow bots, zero engagement.** Daily Agenda, Daily Briefing,
   Friday Review, Monday Kickoff, Weekly Content Planner. Trial ends
   2026-09-19. They are healthy and unread.
4. **Dormant channels still in the sidebar.** `#kohyr-dev` dormant since
   2026-06-11. `#job-search` setup-only. `#social` empty. `#posts` is a
   bot hub sitting next to the command center.
5. **Auth walls that reply anyway.** `@Codex` posts the ChatGPT connect
   line every tag. `@ChatGPT` is replaced and still get invited.
6. **Voice misses.** Emoji status rows, pipe-table intent, Sept 19 topic
   ideas from Claude, long audits after "post once."
7. **Rough human drafts.** Meshal pastes long informal briefs. Agents
   treat every sentence as a new program.

What is already working:

- Seven channels, IDs locked, v2 plan drafted for 2026-09-19.
- `slack-agent-voice.md` labeled-fields contract.
- Cursor Slack Tools for Slack-launched Cursor. Third-party Slack MCP is
  redundant.
- Computer ready, 7/7 reads including `#posts`.
- Kilo scoped to three repos. Do not expand.

## 2. Recommendations

### Quick wins (this week, no new apps)

1. Stop @-all kit pastes. Tag one agent. Paste the full kit only on a
   version bump.
2. Use Slack Later for follow-ups. Use Activity filters: Mentions,
   Threads, Apps. Mute `#social`. Set `#posts` to mentions only.
3. Pack drafts with the voice.md template or
   `.claude/skills/slack-draft-to-prompt` before send.
4. Do not tag `@ChatGPT` or Codex until connect succeeds.
5. Close or park duplicate catalog PRs. One land at a time.
6. Pin voice.md + runbook §6 in `#admin-ops` (human click).

### After 2026-09-19

1. Disable zero-engagement workflow bots. Do not delete history.
2. Create `#me-agents-eng`, `#me-agents-ops`, `#me-inbox` per
   `slack-channel-migration-plan.md`. Then renames.
3. Route GitHub/CI to `#team-eng-alerts` once it exists.
4. Optional Slack AI thread recap on a paid plan. Recaps stay in Slack.
   They do not become git.

### Do not do

- HOLD: archive or rename Slack channels before 2026-09-19.
- Archive or rename before the gate.
- Bulk-delete threads.
- Install Hermes, OpenClaw, Grok Slack, or another chat bot.
- Add Mem0 / Letta / Zep / a Slack summarizer bot.
- Build a writing linter Slack app. The skill plus voice.md is enough.
- A second living inventory page.

## 3. Tools to evaluate (not install)

Keep (already in use):

- Cursor Slack Tools (Slack-launched Cursor only)
- Slack Canvas for tables
- Slack Later, Activity, `/remind`, notification schedules
- GitHub Slack for PR mirroring only
- Notion AI for Operations Hub / Master Tasks / Projects Canonical

Evaluate later, after a human decision:

- Slack AI recaps (plan-dependent). Privacy: thread content stays in Slack.
- Workflow Builder "Generate AI Response" on Business+ : pack a draft in
  a DM to self. Not a new chat bot. Hold until the five-bot trial ends.
- Claude Tag (admin). Improves Claude Slack. Does not add a bot.

Skip:

- Extra Slack MCP (redundant)
- Supermemory (dropped; Cloud discovery errors)
- Memory vendors as Slack archive
- Chat linter SaaS that uploads workspace history

APIs to avoid for cleanup:

- `chat.delete` / `conversations.bulkDelete` : destroys evidence
- `conversations.archive` : locked until 2026-09-19
- Admin analytics exports : fine for a later audit, not a daily bot

## 4. Implementation plan

Shipped in this change:

- Voice v1.1.1: human writing, 4-line inventory reply, draft-to-prompt pack
- Runbook v1.4.0 §6: signal protocol
- Skill `.claude/skills/slack-draft-to-prompt` (repo) and
  `claude-agent-platform/skills/slack-draft-to-prompt` (laptop sync)
- This plan

Human clicks:

1. Pin the two canon docs in `#admin-ops`.
2. Activity: save a Mentions view. Mute `#social`. `#posts` = mentions.
3. Squash-merge the catalog land PR separately (`#220` if still open).
4. After 2026-09-19: bot disable + channel v2 Phase 1.

Privacy / permissions:

- No new OAuth scopes.
- No workspace export.
- Agents already in `#admin-ops` keep current scopes.
- Draft-to-prompt runs in Cursor or Claude on text the user pasted. It
  does not scrape Slack history.
- AGI isolation unchanged. Do not pack prior-employer threads.

## 5. Writing style (examples)

Bad:

```
hey all can you look at this and also the other thing and agree
what we should do then maybe open a pr or two thanks
```

Good:

```
*Goal:* Land kit 1.7.0 on the open catalog PR only.
*Context:* https://github.com/alawein/alawein/pull/220
*Constraints:* do not open a third catalog PR
*Done when:* checksums match; PR ready to squash-merge
*Tag:* <@U0APW2Z3GG2>
```

Bad (agent):

emoji rows, seven-channel dump, "consensus is PR #223"

Good (agent):

```
*Lane:* Claude
*Proved:* Slack 7/7 reads
*Mismatch:* no git on this surface
*Need:* nothing
```

## 6. Writing-to-prompt prototype

Surface 1 (now): Cursor / Claude skill. User pastes draft. Skill returns
the five-field pack. User copies into Slack.

Surface 2 (Meshal, optional, after bot trial): Slack Workflow Builder
shortcut "Pack prompt" that DMs the packed block to Meshal only. Inputs:
draft, agent picker, repo or URL. No channel post.

Surface 3 (do not build): a Slack app that rewrites other people's
messages in public channels.

Flow:

```text
draft (DM or Cursor)
  -> skill rewrite (English + fields)
  -> Meshal edits one line if needed
  -> send to one thread, one agent
```

## 7. Multi-agent note

Asked Claude in `#admin-ops` thread `1788769288.678259` for three
native-only moves (no new bots, no archive). Synthesize that reply into
§2 if it adds a move this plan missed. Do not run another all-hands ping.

Independent read from this session (no extra agents required):

- Computer already waits for a URL. Keep that.
- Kilo already stays on three repos. Keep that.
- Codex connect wall is expected. Stop tagging it.
- Claude will over-audit unless the 4-line template is in voice.md.

## 8. Expert pattern (mapped to this workspace)

High-signal engineering Slacks do four things this repo already named:

1. Command channel vs alert channel vs social (v2 plan).
2. Thread-per-task (dispatch protocol).
3. Bots out of human threads ( `#posts` now, `#team-eng-alerts` later).
4. Docs in git, tasks in Notion, chat for coordination.

They do not run eight coding agents on every message.
