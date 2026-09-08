---
type: internal
source: kernel canonicalization Phase 7 execution session
sla: on-change
last_updated: 2026-09-08
audience: [ai-agents, contributors]
---

# Kernel skills/agent drift: reviewed identifier mapping

Phase 6-8 execution plan step 9. `catalog/skills.yaml` and
`catalog/agent-integrations.yaml` are domain/role-keyed for *this repo
fleet's* engineering capability areas and external LLM/Slack integrations.
`Desktop/ops-shared-inventory/{agents,workflows,routines}.yaml` describe a
separate system: Meshal's personal MAIOS agent fleet (Intake, Policy,
Cleanup, and deprecated shells) and its schedules. A shallow name diff
across the two would misreport near-total drift on concepts that were never
designed to overlap. This table is the one-time reviewed mapping the diff
in `scripts/kernel/skills_drift.py` actually uses; it is not regenerated per
run.

| Catalog kind | Source | Grok Bot kind | Source | Rationale |
|---|---|---|---|---|
| `agent_surface` | `agent-integrations.yaml` `agents[].id` | `agent_surface` | `agents.yaml` `agents[].ui_name` | Closest analogue: both list named agent identities dispatched for work (Cursor/Claude/Codex vs. Intake/Policy/Cleanup), even though the two fleets do not overlap in membership. |
| `workflow_bot` | `agent-integrations.yaml` `workflow_bots[].id` | `workflow_bot` | `workflows.yaml` `workflows[].id` union `routines.yaml` `routines[].id` | Closest analogue: both list scheduled automated jobs. Grok Bot splits "workflow" (a described process) from "routine" (its cron entry); the catalog side has one flat list, so both Grok Bot lists are merged into one kind for the diff. |
| `repo_domain` | `skills.yaml` `domains[].id` | *(none)* | -- | No analogue on the Grok Bot side. This kind describes repo-fleet engineering domains (frontend, ml-research, ...), a concept Grok Bot's taxonomy does not have. Reported as "alawein_only_kinds", never forced into a diff. |
| `external_integration` | `agent-integrations.yaml` `integrations[].id` | *(none)* | -- | No analogue. Third-party service connectors (Gmail, Notion, Vercel, ...), a concept absent from Grok Bot's taxonomy. |
| *(none)* | -- | `bot_skill` | `agents.yaml` `agents[].skills` / `skill_ids` (flattened) | No analogue on the catalog side: `catalog/skills.yaml` never enumerates individual skill scripts, only domains. Reported as "grok_only_kinds". |

## Result (2026-09-08 run)

Zero overlap in either shared kind (`agent_surface`, `workflow_bot`). This
is the expected, honest result given the mapping above -- the two systems
were never meant to share identifiers. The report exists so a future
change that *should* create overlap (e.g. an agent dispatched from both
systems) has a place to be checked, not to manufacture drift where none is
meaningful.

See `catalog/generated/skills-drift.json` for the machine-readable, live
version of this comparison (`python -m kernel.skills_drift` from
`core/alawein/scripts`, report-only, writes only to that one path).

## Writer boundary

This comparison reads `Desktop/ops-shared-inventory/*.yaml` (a Windows-local
SSOT file, not a live Grok Bot profile) and writes only to
`catalog/generated/skills-drift.json` in this repo. It does not write to,
import from, or invoke anything that mutates a Grok Bot profile path (Name,
Label, Description, routines, memory) -- that writer boundary
(`docs/internal/plans/2026-09-08-kernel-canonicalization.md`, step 33)
stands.
