---
type: audit
status: draft
last_updated: 2026-09-12
owner: meshal
---

# Coverage prompt pack (2026-09-12)

What I would send if I were Meshal, after this DM already mapped the
control plane ([PR #260](https://github.com/alawein/alawein/pull/260))
and Grok/peer tools.

One agent per prompt. One done-when. Do not @-all. Do not paste the
full shared kit on these pings unless you just merged kit 1.7.1, in
which case paste `prompt-kits/AGENT.md` Shared session **once** on the
next new thread only.

You do the human clicks first. Agents do not squash-merge. Cloud merge
is 403.

## Do this yourself (not a prompt)

1. Squash-merge [PR #259](https://github.com/alawein/alawein/pull/259).
2. Then #257, then #260, if you want git current.
3. Do not install Slack Grok, Hermes, or OpenClaw.
4. Codex Connect is a browser click you own.
5. Stop this DM. New work gets a new thread.

## Do not send

- Another "scan all integrations / canvases / Grok bots" to Cursor on
  `alawein/alawein`. Done.
- `@ChatGPT`. Replaced.
- Workflow bots. Exempt.
- Kilo on `alawein/alawein`. No GitHub App scope.
- Computer without a URL.
- Any prompt that asks for a second inventory YAML or Canvas SSOT.

## Prompt 0. Kit paste (once, after #259 lands)

*Send:* new thread, first ping of that thread only.

```text
Paste the Shared session prompt from prompt-kits/AGENT.md 1.7.1, then
your scoped ask. Do not paste the kit again on later pings.
```

## Prompt 1. Windows laptop prove

*Send:* Claude Code on the Windows machine (not this Cloud VM). New local
session. Report only.

```text
*Goal:* Prove the laptop Grok/MAIOS and IDE surfaces that Cloud cannot see.
*Context:* Desktop/ops-shared-inventory/{agents,workflows,routines,START_HERE}.yaml;
  ~/.grok/; ~/.cursor/mcp.json; ~/.claude/; ~/.codex/AGENTS.md;
  docs/internal/audits/2026-09-12-grok-and-peer-tools.md
*Constraints:* report only; do not write Grok Bot Name/Label/Description/
  routines/memory; no Slack Grok install; no AGI / Desktop/AGI; no second
  inventory YAML; account contact@meshal.ai only
*Done when:* a table of path, exists Y/N, last-write, one-line content
  hash or UNVERIFIED; mark each row Proved or GAP
*Tag:* Claude Code (laptop)
```

## Prompt 2. Browser prove (Slack apps + Codex Connect)

*Send:* Computer, after you open the two URLs.

```text
*Goal:* Confirm Slack has no Grok app and report Codex Connect state.
*Context:* Slack app directory for T0APHHXJV4J; Codex Connect UI;
  https://slack.hooks.x.ai/
*Constraints:* one ack then wait if a URL is missing; no install click;
  no catalog edit; no @ChatGPT
*Done when:* two screenshots or live reads: Grok app absent or present;
  Codex connected or still needs_auth
*Tag:* <@U0APW7F9S4A>
```

## Prompt 3. Codex gap-fill (only after Connect)

*Send:* `#admin-ops` or a new DM. Skip if Prompt 2 still says needs_auth.

```text
*Goal:* Fill UNVERIFIED connector rows only. Diff against git, not a re-audit.
*Context:* catalog/agent-integrations.yaml; PR #257 if still open
*Constraints:* no catalog land if a land PR is open (report Mismatch);
  no new bots; one connect-state line if still blocked
*Done when:* each UNVERIFIED row is Proved, still needs_auth, or GAP
*Tag:* <@U0BV7V8M3NW>
```

## Prompt 4. Kilo three-repo read (optional)

*Send:* only if you want those freeze repos listed. Not control-plane work.

```text
*Goal:* Read-only list of what the Kilo GitHub App can see.
*Context:* alawein/ops-control-plane-grok (freeze), alawein/ai-ops,
  alawein/workspace-brain (Linux mirror). Not Windows MAIOS SoR.
*Constraints:* no alawein/alawein; no scope expand; no second SoT;
  no canvas edit
*Done when:* three repo rows: default branch tip, last commit date,
  whether agents.yaml or equivalent exists; 4 lines
*Tag:* <@U0BV9U2GFED>
```

## Prompt 5. Sibling product LLM (only if you care)

*Send:* new Cloud Agent after you switch repo. Not this control-plane
checkout.

```text
*Goal:* Inventory product LLM calls, evals, and wrappers in one sibling.
*Context:* pick one: alembiq or llmworks. Catalog about-lines already
  exist. This VM has no sibling checkouts.
*Constraints:* one repo; no AGI; no new inventory YAML in alawein;
  no OpenRouter key commit
*Done when:* file-path list of runtime LLM calls, eval harnesses, and
  env/auth names (no secret values)
*Tag:* Cursor Cloud on that repo
```

## Prompt 6. Claude Slack Tag state (4 lines)

*Send:* `#admin-ops` if you still need Tag status. Do not retag for
inventory.

```text
*Goal:* One live read: is Claude Tag on, or still legacy Slack.
*Context:* docs/governance/claude-tag-migration.md; @Claude U0AQQFJT8AC
*Constraints:* 4 lines; no emoji status rows; no channel dump; no
  catalog edit; Tag enable is human-only
*Done when:* one line Tag on or legacy; one line last post date
*Tag:* <@U0AQQFJT8AC>
```

## Shared handshake schema (`alawein-cloud-v1`)

Cursor IDE and Grok Bots must reply with **one YAML fence only**. Same
keys. No preamble. No secrets. Unknown fields are `UNVERIFIED`, never
guessed. Meshal pastes both fences back into the Slack Cloud thread.

```yaml
handshake: alawein-cloud-v1
surface: cursor-ide   # or grok-bot
when: 2026-09-12T00:00:00Z
account: contact@meshal.ai
host: UNVERIFIED
status: proved        # proved | partial | blocked

identity:
  product: Cursor IDE
  name: UNVERIFIED
  model: UNVERIFIED
  session_id: UNVERIFIED
  repo: alawein/alawein
  branch: UNVERIFIED
  workspace_root: UNVERIFIED

readable:
  - id: rules
    path_or_surface: .cursor/rules
    exists: Y
    last_write: UNVERIFIED
    note: one line
  - id: skills
    path_or_surface: UNVERIFIED
    exists: N
    last_write: UNVERIFIED
    note: one line
  - id: mcp
    path_or_surface: ~/.cursor/mcp.json
    exists: UNVERIFIED
    last_write: UNVERIFIED
    note: one line
  - id: chats
    path_or_surface: UNVERIFIED
    exists: UNVERIFIED
    last_write: UNVERIFIED
    note: one line
  - id: memory
    path_or_surface: UNVERIFIED
    exists: UNVERIFIED
    last_write: UNVERIFIED
    note: one line
  - id: inventory_yaml
    path_or_surface: Desktop/ops-shared-inventory
    exists: UNVERIFIED
    last_write: UNVERIFIED
    note: one line

agents:
  - name: UNVERIFIED
    role: UNVERIFIED
    skills:
      - id: UNVERIFIED
        source: UNVERIFIED
        last_write: UNVERIFIED
        one_line: one line
    chats:
      - id: UNVERIFIED
        title: UNVERIFIED
        last: UNVERIFIED
        summary: one line, no secrets
    routines:
      - id: UNVERIFIED
        cadence: UNVERIFIED
        one_line: one line

blockers:
  - one line

need_from_cloud:
  one short paragraph this Slack Cloud Cursor should do next
```

Limits: at most 12 `readable` rows, 8 `agents`, 20 `skills` and 10
`chats` per agent, 12 `routines` total. Prefer newest. Do not dump file
bodies.

## Prompt 7. Cursor IDE handshake

*Send:* new Desktop Cursor IDE chat on the Windows machine. Not this
Cloud VM. Not Slack `@Cursor`.

```text
*Goal:* Fill one alawein-cloud-v1 YAML report of what this Cursor IDE
session can see, so Slack Cloud Cursor can read it next to a Grok Bot
report that uses the same keys.

*Context:* You are Desktop Cursor IDE on Meshal's Windows machine.
Account contact@meshal.ai. Control plane repo github.com/alawein/alawein
(disk: Desktop/GitHub/alawein/core/alawein). Slack Cloud Cursor cannot
see this IDE's chats, MCP, or local skills. Shared reply schema:
docs/internal/audits/2026-09-12-coverage-prompt-pack.md section
"Shared handshake schema". Companion map:
docs/internal/audits/2026-09-12-grok-and-peer-tools.md

*Do:*
1. Set surface: cursor-ide. Set when to now in UTC. Set host to this
   machine name or UNVERIFIED.
2. identity: product Cursor IDE; name = this chat title; model = the
   model actually selected; session_id if the UI shows one; repo and
   branch from git; workspace_root from the open folder.
3. readable: prove these if present, else exists N or UNVERIFIED:
   .cursor/rules, .cursor/skills or ~/.cursor/skills-cursor,
   ~/.cursor/mcp.json, AGENTS.md, CLAUDE.md, prompt-kits/AGENT.md,
   this chat / composer history if the UI exposes it,
   Desktop/ops-shared-inventory (note only; do not rewrite it).
4. agents: one row for this IDE session. skills = project + user rules
   and skills you actually loaded (id, source path, last_write, one_line).
   chats = up to 10 recent Cursor chats you can name without opening
   private AGI material (id or tab name, title, last, one-line summary).
   routines = Cursor automations or scheduled tasks if any, else omit
   the key.
5. blockers: anything you could not read.
6. need_from_cloud: one paragraph Slack Cloud Cursor should do after
   it has this YAML and the Grok Bot YAML.

*Constraints:*
- Reply with one yaml fence only. handshake: alawein-cloud-v1.
  Same keys as the schema. No preamble, no extra sections.
- Report only. Do not edit git, do not open a PR, do not start a Cloud
  Agent, do not install Slack Grok / Hermes / OpenClaw.
- Do not write Grok Bot Name, Label, Description, routines, or memory.
- No second inventory YAML or Canvas SSOT. No APPROVAL_POLICY.md.
- No AGI Inc, theagi.company, or Desktop/AGI. Skip those paths.
- No secret values, tokens, or full file dumps. UNVERIFIED if unknown.
- One agent (this IDE). Do not @ anyone.

*Done when:* one valid alawein-cloud-v1 YAML fence Meshal can paste
into the Slack Cloud thread.

*Tag:* Cursor IDE (desktop)
```

## Prompt 8. Grok Bots handshake

*Send:* Grok Bot desktop or iOS. One bot can speak for the fleet.
Report only. Do not paste this into Slack Grok (not installed).

```text
*Goal:* Fill one alawein-cloud-v1 YAML report of the Grok Bot fleet
this machine can see, so Slack Cloud Cursor can read it next to a
Cursor IDE report that uses the same keys.

*Context:* You are Grok Bot on Meshal's machine (desktop or iOS), not
Cursor Cloud and not a Slack app. Account contact@meshal.ai. Laptop
SoR: Desktop/ops-shared-inventory/{agents,workflows,routines,START_HERE}.yaml.
Cloud snapshot only: catalog/generated/skills-drift.json (stale;
2026-09-08). Writer boundary: report only. Do not write Name, Label,
Description, routines, or memory on any bot profile. Shared reply
schema: docs/internal/audits/2026-09-12-coverage-prompt-pack.md
section "Shared handshake schema". Map:
docs/internal/audits/2026-09-12-grok-and-peer-tools.md

*Do:*
1. Set surface: grok-bot. Set when to now in UTC. Set host to this
   device name or UNVERIFIED.
2. identity: product Grok Bot; name = the bot answering (ui_name);
   model if shown; session_id = this chat id; repo n/a unless a bot
   has a Cloud Agent attached, then name that bc- id; workspace_root
   = Desktop/ops-shared-inventory or UNVERIFIED.
3. readable: prove Desktop/ops-shared-inventory YAML, ~/.grok/ if
   present, each bot's skills/memory/routines surfaces you can see
   without writing them, and any Cursor Cloud Agent this fleet is
   watching (bc- ids only).
4. agents: one row per live bot (max 8). Prefer current Scheme A
   names: Intake, Policy, Cleanup, Editorial, plus any other ui_name
   that is actually running. For each: role one line; skills up to 20
   (id, source, last_write, one_line); chats up to 10 recent (id,
   title, last, one-line summary, no secrets); routines up to 12
   across the fleet (id, cadence, one_line).
5. blockers: anything you could not read, including Cloud-only gaps.
6. need_from_cloud: one paragraph Slack Cloud Cursor should do after
   it has this YAML and the Cursor IDE YAML.

*Constraints:*
- Reply with one yaml fence only. handshake: alawein-cloud-v1.
  Same keys as the schema. No preamble, no extra sections.
- Report only. Do not change Name, Label, Description, routines,
  memory, or plugins. Do not create a bot. Do not install Slack Grok,
  Hermes, or OpenClaw.
- Do not start extra Cursor Cloud Agents unless Meshal already asked
  in this chat. Listing existing bc- ids is fine.
- No second inventory YAML or Canvas SSOT. Do not treat Slack as SoR.
- No AGI Inc, theagi.company, or Desktop/AGI.
- No secret values, tokens, or full memory dumps. UNVERIFIED if unknown.
- Do not @ other agents.

*Done when:* one valid alawein-cloud-v1 YAML fence Meshal can paste
into the Slack Cloud thread.

*Tag:* Grok Bot (desktop or iOS)
```

## How Cloud aligns with Grok Bot rules

Do not merge the two SoRs. Laptop SoR stays
`Desktop/ops-shared-inventory/`. Cloud SSOT stays
`catalog/agent-integrations.yaml` plus `prompt-kits/AGENT.md`. Phase 7
of `docs/internal/plans/2026-09-08-kernel-canonicalization.md` already
says report-only drift. No Grok profile writes.

1. Dump rules (Prompt 9), not another inventory.
2. Diff that YAML against `prompt-kits/AGENT.md`, Slack voice, and
   `control-plane.md`.
3. Bind matches as session constraints on this Cloud lane.
4. Promote a Cloud-side note only if Meshal exact-yes. Never write
   Name, Label, Description, routines, or memory.

Already binding on this Cloud lane from the 2026-09-12 handshake and
Meshal's exact no:

- Intake is the sole ordinary inbox (`mai.command.intake`).
- Scheme A: Intake, Policy, Cleanup, Editorial.
- New Bot stays ephemeral. Do not add it to `agents.yaml`.
- Writer boundary stands.
- Desktop `op` CLI is the secrets path. No secret values in git or Slack.
- OpenRouter is spend-gated until Meshal sets a USD cap and exact-yes.
- HOLD routines stay never-run until first success.
- One writer per field (`ops-dual-writer-check`).
- Human brand MAIOS. Wire IDs `mai.*`.
- Skills beat a new durable bot.

## Prompt 9. Grok Bot rules dump

*Send:* Intake on Grok Bot desktop. Report only.

```text
*Goal:* Fill one alawein-cloud-v1 YAML of the rules this fleet actually
follows, so Slack Cloud Cursor can bind the same contract. Not another
inventory.

*Context:* You are Intake. Account contact@meshal.ai. Laptop SoR:
Desktop/ops-shared-inventory (AGENTS.md, RESPONSE-STYLE, agents.yaml).
Cloud already has the 2026-09-12 handshake. New Bot stays ephemeral
(exact no). Writer boundary: do not write Name, Label, Description,
routines, or memory.

*Do:*
1. handshake: alawein-cloud-v1. surface: grok-bot. Add kind: rules.
2. status: proved | partial | blocked.
3. Under rules, list at most 20 standing rules. Each row:
   id, source (AGENTS.md / RESPONSE-STYLE / agents.yaml / memory title
   only), text (one line), cloud_should (adopt | ignore | ask).
4. Include HARD NEVERs, inbox owner, who may spend, who may write
   profiles, dual-writer, Slack Grok, AGI quarantine, exact-yes gates.
5. Quote RESPONSE-STYLE rev id and three voice rules max. No full file
   dump.
6. blockers: rules you could not read.
7. need_from_cloud: one paragraph of what Slack Cloud Cursor should
   adopt vs leave on the laptop.

*Constraints:*
- One yaml fence only. No preamble.
- Report only. No profile writes. No new bot. No Slack Grok.
- No second inventory YAML or Canvas SSOT.
- No AGI / Desktop/AGI. No secrets.
- UNVERIFIED if unknown.

*Done when:* one rules YAML Meshal can paste into the Slack Cloud thread.

*Tag:* Grok Bot Intake
```

## Order I would use

1. Prompt 9 (Intake rules dump). Paste the YAML here.
2. Human: merge #259 when at git.
3. Prompt 7 and 8 are done. Do not rerun.
4. Prompt 1 only if SoR paths go UNVERIFIED again.
5. Park Prompts 2 to 6 unless that gap returns.

*Rec:* run Prompt 9 on Intake, paste the rules YAML here.

## Change evidence

| Field | Recorded value |
| --- | --- |
| Work item | Slack DM: handshake prompts for Cursor IDE and Grok Bots |
| Work kind | docs |
| Accountable maintainer | Meshal Alawein |
| Executor | Cursor Cloud `bc-e551b6c1` |
| Independent reviewer | not performed this turn |
| Final approval | pending Meshal |
