---
type: internal
source: slack cursor thread 2026-09-10
sla: none
last_updated: 2026-09-11
audience: [ai-agents, contributors]
---

# Practices handbook (living)

Working reference for Alawein, Kohyr, and MAIOS harness work. Git wins.
This file is doctrine-exempt (`docs/internal/`). It is not a second catalog,
not Slack SSOT, and not a substitute for `LESSONS.md`, `VOICE.md`, or
`prompt-kits/AGENT.md`. `LESSONS.md` stays short observed bullets; this
file holds the longer dated rows. Promote a row to `LESSONS.md` when it
recurs on a second surface.

**How to update:** add only what you can prove. Date the row. Name the IDE
or model when it matters. Mark Desktop or private chats UNVERIFIED. Do not
paste secrets. Do not restate a rule that has a canonical home; point to it.

**Canon to read first:**

- Voice: [`docs/style/VOICE.md`](../style/VOICE.md)
- Shared session prompt: [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md)
  (the kit's own version field is the version of record)
- Slack thread voice: [`docs/governance/slack-agent-voice.md`](../governance/slack-agent-voice.md)
- Observed bullets: [`LESSONS.md`](../../LESSONS.md)
- Roles and evidence: [`docs/governance/operating-model.md`](../governance/operating-model.md),
  [`docs/governance/work-record-taxonomy.md`](../governance/work-record-taxonomy.md)

Last folded: 2026-09-10. Surfaces: Cursor Cloud Grok 4.6 (`bc-5432d661`),
`#admin-ops`, Slack canvases. Desktop Cursor chats remain UNVERIFIED.

## Rules that live elsewhere

Each rule has one canonical home. This file points at the home and does
not restate the rule.

- [`CLAUDE.md`](../../CLAUDE.md): change size, generated files, commit
  identity and tense, Actions pins, line endings, `last_updated`,
  excluded estates, role separation, tool availability.
- [`AGENTS.md`](../../AGENTS.md): generated files, commit voice, excluded
  estates, history rewriting.
- [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md): excluded estates,
  bot and memory-product bans, system of record per surface, the
  2026-09-19 gate, inventory rules, replaced Slack apps, Kilo scope.
- [`docs/governance/slack-agent-voice.md`](../governance/slack-agent-voice.md):
  Slack thread formatting, field labels, first-line rule, tagging, packed
  prompt shape, ack shape.
- [`docs/style/VOICE.md`](../style/VOICE.md): prose voice and punctuation.
- [`docs/governance/unified-agent-system.md`](../governance/unified-agent-system.md):
  per-agent scope and the default independent reviewer.
- [`docs/governance/operating-model.md`](../governance/operating-model.md),
  [`docs/governance/work-record-taxonomy.md`](../governance/work-record-taxonomy.md):
  roles, evidence, and review status.

## Inventory

[`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml)
and
[`docs/governance/unified-agent-system.md`](../governance/unified-agent-system.md)
are the only agent inventory. This file carries no model, IDE, or Slack
user matrix. Task lists live on GitHub Issues, not here. Slack working
pointer, not an inventory:
[lane inventory canvas](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C0KEF150C).

## Observed rows

### Coding (observed 2026-09-08 to 2026-09-10 unless dated)

- Close-out is `commit` then `push` then PR then Meshal merge. "Looks good"
  on disk is not shipped (2026-03 IDE completion archive).
- Cursor Cloud environment covers `alawein/alawein` only unless Meshal asks
  for a multi-repo environment. Do not open the full fleet in one Cloud
  environment or flatten buckets into one Cursor project. Desktop: open
  `Desktop/GitHub/alawein`, then one sibling at a time.
- A Cloud VM cannot prove Desktop MCP rows or Windows paths. Cloud
  `needsAuth` is not a Desktop proof. Re-auth MCP only when a task needs
  that namespace.

| Surface | Use for | Do not |
| --- | --- | --- |
| Cursor Cloud (this harness; Grok 4.6 observed) | Control-plane PRs, Slack-launched repo work | Windows FS, sibling checkouts, canvas `@Cursor` tags |
| Cursor Desktop (UNVERIFIED from Cloud) | Local multi-root, product repos | `Desktop/AGI` |
| Codex Slack | Diff after Connect | Work while `needs_auth` |

### Slack lanes (observed 2026-09-08 to 2026-09-10)

- Do not route work into `#me-agents-eng` or `#me-agents-ops` before the
  2026-09-19 gate. The channels exist; do not expand them.
- Asking every lane for consensus stalls the thread. Cursor synthesizes,
  Meshal decides.
- Computer stood down when tagged, then posted a long consensus document.
  Claude Slack answered as Claude Code. Neither is the lane's job.
- Kilo hunted `docs/ai-os/INDEX.md` on a Slack inventory ping. Those paths
  are not the control-plane canvas.
- Codex loops on "Reply OK" while Connect is still required. Do not re-tag.
- Cursor Slack Tools cannot write `#admin-ops`, so Cursor posted there as
  Meshal via Slack MCP. Prefer Meshal send, or stay in the bound DM.
- Notion AI Slack is not Notion MCP. 0 public posts observed.
- New control-plane jobs get a new Slack-launched agent. Do not stack
  unrelated programs on the leftover `cursor/integration-probe-1170`
  thread.

## Change this file when

- A practice is proved on a second surface (promote a one-line LESSONS
  entry).
- A model, IDE, or Slack app status changes (update the catalog row, then
  date the observed row here if it matters).
- Meshal accepts a new default (Codex Connect, Claude Tag, bot disable).
