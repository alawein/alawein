---
type: internal
source: slack cursor thread 2026-09-10
sla: none
last_updated: 2026-09-10
audience: [ai-agents, contributors]
---

# Practices handbook (living)

Working reference for Alawein, Kohyr, and MAIOS harness work. Git wins.
This file is doctrine-exempt (`docs/internal/`). It is not a second catalog,
not Slack SSOT, and not a substitute for `LESSONS.md`, `VOICE.md`, or
`prompt-kits/AGENT.md`.

**How to update:** add only what you can prove. Date the row. Name the IDE
or model when it matters. Mark Desktop or private chats UNVERIFIED. Do not
paste secrets.

**Canon to read first:**

- Voice: [`docs/style/VOICE.md`](../style/VOICE.md)
- Shared session prompt: [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md) 1.7.0
- Slack thread voice: [`docs/governance/slack-agent-voice.md`](../governance/slack-agent-voice.md)
- Observed bullets: [`LESSONS.md`](../../LESSONS.md)
- Roles and evidence: [`docs/governance/operating-model.md`](../governance/operating-model.md),
  [`docs/governance/work-record-taxonomy.md`](../governance/work-record-taxonomy.md)

Last folded: 2026-09-10. Surfaces: Cursor Cloud Grok 4.6 (`bc-5432d661`),
`#admin-ops`, Slack canvases. Desktop Cursor chats remain UNVERIFIED.

## Coding

### Best

- Smallest change that solves the task. One owner per file. One PR purpose.
- Treat generated output as code. Edit the generator or the source index,
  not the synced file (`README.md`, `catalog/repos.json`, `projects.json`).
- Python: PEP 8, type hints, explicit names. TypeScript: strict, no casual
  `any`. Comments record invariants and failure modes, not narration.
- Commits in present tense, no AI attribution. Author as
  `contact@meshal.ai`.
- Close-out is `commit` then `push` then PR then Meshal merge. "Looks good"
  on disk is not shipped. See the 2026-03 IDE completion archive.
- Compare `git diff --stat main <branch>` before squash-merge. A stale
  branch can look like a huge deletion of current `main`.
- Pin GitHub Actions to full SHAs. Shell scripts are LF only.
- Cursor Cloud for `alawein/alawein` only unless Meshal asks for a
  multi-repo environment. Desktop: open `Desktop/GitHub/alawein`, then one
  sibling at a time. Never add `Desktop/AGI`.
- Claude Code is laptop and terminal mutation. It does not own Slack posts.

### Worst

- Opening the full fleet in one Cloud environment, or flattening buckets
  into a single Cursor project.
- Hand-editing `SYNC` README regions or generated catalog files.
- Force-push, history rewrite, or commits to `main` without Meshal.
- Leaving `docs/operations/session-log.md` or other generated ledgers dirty
  and committing them to silence noise.
- Claiming Desktop MCP or Windows paths from a Cloud VM.
- Installing a new Slack chat bot (Grok, Hermes, OpenClaw) to "help code."

### IDE and model notes

| Surface | Use for | Do not |
| --- | --- | --- |
| Cursor Cloud (this harness; Grok 4.6 observed) | Control-plane PRs, Slack-launched repo work | Windows FS, sibling checkouts, canvas `@Cursor` tags |
| Cursor Desktop (UNVERIFIED from Cloud) | Local multi-root, product repos | `Desktop/AGI` |
| Claude Code | Laptop git and terminal | Slack canvas fills, agent-to-agent tags |
| Codex Slack | Diff after Connect | Work while `needs_auth` |
| Kilo | `ops-control-plane-grok`, `ai-ops`, `workspace-brain` only | `alawein/alawein` |

## Documentation

### Best

- One home per fact. Git is SSOT. Slack is coordination. Notion is
  non-code tasks. Canvases are working pointers.
- `LESSONS.md` stays short observed bullets. This handbook holds the
  longer matrix. Promote a row to `LESSONS.md` when it recurs.
- Governed Markdown: update `last-verified` or `last_updated` on the same
  edit. No YAML frontmatter on `README.md` or `docs/README.md`.
- No em dash on governed surfaces. Bold field labels only in Slack
  threads. Tables go on a Canvas or in git, not in thread bodies.
- Archive-before-delete. Do not rename or archive Slack channels before
  2026-09-19.
- Mark SUPERSEDED on a stale canvas. Do not spawn a second living SSOT
  page to replace it.

### Worst

- Pasting the full shared kit into every Slack ping (kit version already
  live).
- Treating Slack, Notion, MAIOS canvas, or `ops-shared-inventory` as git.
- Creating `APPROVAL_POLICY.md`, extra dashboards, or a second inventory
  page.
- `@`-all inventory dumps on consecutive days in `#admin-ops`.
- Routing work into `#me-agents-eng` or `#me-agents-ops` before the
  2026-09-19 gate (those channels already exist; do not expand them).

## Prompting

### Best

- First line is the ask or status. One agent, one thread, one done-when.
- Meshal tags the next agent. Agents do not `@` each other to start work.
- Packed prompt: Goal, Context, Constraints, Done when, Tag. See
  `docs/governance/slack-agent-voice.md` and
  `.claude/skills/slack-draft-to-prompt`.
- Slack ack: 4 lines (`Lane`, `Proved`, `Need`, `Next`). Cursor may use 6
  when a PR is the outcome.
- Prove-only rows. Status `active` / `inactive` / `unknown`. Labels
  PROVED, OBSERVED, INFERRED, UNVERIFIED, BLOCKED.
- Skip `@ChatGPT` (`U0BUNH33CCA`, replaced). Skip workflow bots. Grok is
  not a Slack bot.

### Worst

- Tagging `@Cursor` on a Canvas. That spawned nine idle Cloud Agents and
  nine identical "9 vs 7" acks (2026-09-08).
- Tagging `@ChatGPT` after it was marked replaced.
- Asking every lane for consensus. Cursor synthesizes. Meshal decides.
- Computer standing down when tagged, then posting a long consensus
  document. Claude Slack answering as Claude Code.
- Kilo hunting `docs/ai-os/INDEX.md` on a Slack inventory ping (wrong
  hunt; those paths are not the control-plane canvas).
- Codex "Reply OK" loops while Connect is still required. Do not re-tag.
- Cursor posting to `#admin-ops` as Meshal via Slack MCP because Cursor
  Slack Tools cannot write that channel. Prefer Meshal send, or stay in
  the bound DM.

## Technical skills (harness and Kohyr)

### Best

- MAIOS and Kohyr consume this control plane. They do not get a parallel
  instruction kit. Improve `AGENT.md`, voice, or the catalog row in place.
- Record assigned scope, author, executor, reviewer, and Meshal decision
  on the task, PR, or batch. Tool availability is not permission.
- Independent review is a different tool than the executor. Self-review
  is separate. Missing review stays pending.
- MCP: re-auth only when a task needs that namespace. Cloud `needsAuth`
  is not a Desktop proof.
- Workflow bots (Daily Agenda, Daily Briefing, Friday Review, Monday
  Kickoff, Weekly Content Planner) trial through 2026-09-19. Zero
  engagement is a disable candidate, not a delete-history task.
- Kernel and fleet waves: dry-run diff review before any `kernel-sync`
  PR. `auto_merge_enabled` stays false. Merge is Meshal `yes merge #N`.

### Worst

- Building a second OS in `workspace-brain` or Desktop
  `ops-shared-inventory` and calling it canon.
- Expanding the Kilo GitHub App to `alawein/alawein` without a human ask.
- Adding Mem0, Letta, Zep, or a new Slack chat bot without a new
  decision.
- Importing, summarizing, or operating on AGI Inc / `theagi.company`
  material.
- Treating Notion MCP as Notion AI Slack, or Treg live-ready as a catalog
  land without an open-catalog-PR search.

## Model and IDE matrix (observed 2026-09-08 to 2026-09-10)

| Product | Slack | Model / plan observed | Status |
| --- | --- | --- | --- |
| Cursor Cloud | `@Cursor` `U0APW2Z3GG2` | Grok 4.6 high-fast | Active. Personal env, `alawein/alawein` only |
| Cursor Desktop | none | UNVERIFIED | Do not invent MCP rows |
| Claude Slack | `@Claude` `U0AQQFJT8AC` | Legacy Slack bot; Tag off | Active for reads. Tag is a human admin step |
| Claude Code | no Slack user | Cloud session: `github` MCP only | Active on laptop/terminal |
| Computer | `@Computer` `U0APW7F9S4A` | Perplexity Computer | Browser/GUI. Do not stand down when tagged |
| Kilo | `@Kilo` `U0BV9U2GFED` | Kilo Cloud | Three repos only |
| Codex | `@Codex` `U0BV7V8M3NW` | ChatGPT Codex | `needs_auth` until Connect. Do not re-tag |
| Notion AI Slack | `@Notion AI` `U0AQ8UNAKTK` | Notion AI | 0 public posts observed. Not Notion MCP |
| GitHub Slack | `@GitHub` `U0APESWEF2T` | n/a | PR-mirror only |
| ChatGPT Slack | `@ChatGPT` `U0BUNH33CCA` | n/a | Replaced. Do not tag |
| Grok | none | Windows Cursor Grok | Not a Slack app. Do not install `@Grok` |

## Slack hygiene (do now, no archive before 2026-09-19)

1. Stop `@`-all and full-kit pings. Stop canvas `@Cursor` tags.
2. Archive the nine idle Cloud Agents named `Canvas user mention`.
3. Keep [lane inventory canvas](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C0KEF150C)
   as the only live inventory pointer. Leave SUPERSEDED canvases.
4. Mute workflow bots or accept disable at the gate. Do not delete
   history.
5. New control-plane jobs get a new Slack-launched agent. Do not stack
   unrelated programs on the leftover `cursor/integration-probe-1170`
   thread.
6. Working cleanup pointer:
   [Cursor Cloud cleanup 2026-09-10](https://alaweinworkspace.slack.com/docs/T0APHHXJV4J/F0C1PDU320G).

## Change this file when

- A practice is proved on a second surface (promote a one-line LESSONS
  entry).
- A model, IDE, or Slack app status changes (date the matrix row).
- Meshal accepts a new default (Codex Connect, Claude Tag, bot disable).
