---
type: canonical
source: alawein
sla: on-change
authority: canonical
audience: [agents, contributors]
kit-type: system-map-prompt
version: 1.0.0
last-verified: 2026-09-08
last_updated: 2026-09-08
change-summary: "Add reusable system-map curation prompt driven by a single SSOT"
downstream-consumers: [alawein]
---

# Prompt kit for system-map curation

This kit keeps the workspace system map current and generates every system
diagram from one source of truth. Use it in any agent session (Claude Code,
Cursor, Codex) that curates the map or renders its diagrams.

## Role and lane

You are working in the `alawein/alawein` control-plane repo. Read `CLAUDE.md`,
`AGENTS.md`, and `SSOT.md` first. git wins for inventory and policy. Do not open
new audit threads or competing SSOT pages. Keep AI attribution out of commits
and docs. Follow the voice contract (`docs/style/VOICE.md`); run the voice-check
skill before committing prose. Slack channels stay locked until 2026-09-19. You
do not merge to main; human approval is required.

## Single source of truth

The machine SSOT for agents, integrations, and channels is
`catalog/agent-integrations.yaml` (schema
`schemas/agent-integrations.schema.json`, validator
`scripts/catalog/validate-agent-integrations.py --strict`). Governance lives in
`docs/governance/unified-agent-system.md` for orchestration and
`docs/governance/slack-agent-runbook.md` for the locked channel policy. Do not
fork these.

## Goal

Make every system diagram generated from one SSOT, and extend that SSOT to cover
four layers the current model under-represents, so the diagrams stay in sync and
never drift:

1. MAIOS layer. Define this first. Point the session at the canonical MAIOS doc,
   or state what MAIOS is. Do not invent it. If it is undefined, stop and ask one
   scoped question before modeling it. This is the top tier above agents.
2. Agentic workflows. Model the dispatch and routing paths between agents,
   including human-in-the-loop gates, sourced from `unified-agent-system.md`.
3. Connections and integrations. These already sit in the YAML integrations
   block and the Cloud MCP matrix. Keep Desktop and Cloud surfaces
   non-collapsed.
4. Skills. The `.claude/skills` and prompt-kits inventory is currently
   uncatalogued.

## Tasks

Each is a single-purpose change, the smallest change that works.

A. Schema extension. Add `skills`, `agentic_workflows`, and (once defined)
`maios` blocks to the schema and populate them in `agent-integrations.yaml`.
Reuse existing status enums; add a new one only when a real state has no home.
Keep required-field discipline. Refresh the snapshot baseline with
`--write-snapshot`.

B. Diagram generator. Add `scripts/catalog/render-system-map.py` that reads
`agent-integrations.yaml` and emits a governed diagram plus an optional
standalone HTML artifact for sharing. Mirror `build-catalog.py` conventions:
`--check` mode, a generated-file header, deterministic output. Wire `--check`
into validation so a stale diagram fails, the same as `sync-readme.py`.

C. Layered view. The diagram shows account canon (`contact@meshal.ai`), then
surfaces (Slack, Desktop IDE, Cursor Cloud Agent, Notion, GitHub), then MAIOS,
then agents, then agentic-workflow edges, then integrations (MCP, Desktop and
Cloud) plus channels and skills. Use the status legend: ready, partial,
needs_auth, replaced or dropped.

D. Open gaps. Render the open gaps as annotations sourced from the YAML, not
hardcoded.

## Constraints

Never hand-edit generated outputs. Edit the YAML and regenerate. Do not run live
connection probes or fabricate verified statuses; a live re-probe is a Cursor
Cloud Agent rescan, human-run. Validate before proposing:
`scripts/catalog/validate-agent-integrations.py --strict`,
`scripts/doctrine/validate.py --ci`, and the voice-check skill on new docs.

## Coordination

When several agents work this in parallel, split by file, not by turn. One agent
owns the generator and schema; another owns `agentic_workflows` modeling or diff
review. Each posts once; later agents fill unverified rows only; follow-ups are
diff-only. Agents do not invoke each other; Meshal tags the next agent.

## Deliverable

One change per task, A then B then C and D. Report what changed with file and
line anchors and the validation output. Keep reports short.

## How to run

Paste this file's contents into a new session on the `alawein` repo, or start
the session with `follow prompt-kits/SYSTEM-MAP.md`.
