---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-15
owner: meshal
---

# Grok-thin offload (canonical matrix)

Intake (`maios.command.intake`) is the sole ordinary inbox. Heavy work leaves
Grok. Scheme A keepers only: Intake, Policy, Cleanup, Editorial. BLOCK fifth
keeper. Grok chat underlying model is not SoR-controlled.

## Classify

`classify_offload_target(taskKind)`:

| taskKind | target | notes |
|---|---|---|
| triage / Orient / Continue / Approve gate / one nudge | InlineGrok | soft short chat; no multi-executor |
| coding / repo edit / PR / tests / large doc packs | CursorCloud | CloudAgent; no Grok executor chain |
| multi-model grill / architecture opinion | OpenRouterPanel | skill `openrouter-expert-panel`; lite default |
| fleet Job B (short) | InlineGrok | default under FREEZE; Job B > Job A |
| fleet Job A short | InlineGrok | only if the unused 1x/day slot is short |
| fleet Job A/B >15 min | CursorCloud | never 5 parallel Grok executors for one scan |

## Operator verbs

- `Offload: <task>`
- `Cursor: <owner/name> <ask>`
- `Panel: <question>` (lite 5)
- `Panel fleet: <question>` (7)
- `Force Grok: <task>` (freeze escape hatch)

## Freeze

See `GROK-USAGE-FREEZE.md`. During FREEZE, Intake triages and dispatches.
Job B > Job A. Do not poll-as-daemon. Panel runs tag
`LANGFUSE-PANEL-TAGS.md`.

## Guardrails

Spend soft caps / alert / `MAIOS_PANEL_KILL=1`. Approve before
push/merge/delete. Classifier shadow week, target <10% misroute. Handoff
carries task ID, scoped inputs, acceptance, structured result.

## Desktop SoR (named, not copied)

- `ops-shared-inventory/docs/superpowers/plans/2026-09-14-grok-thin-cursor-openrouter-offload.md`
- `ops-shared-inventory/docs/superpowers/plans/2026-09-14-grok-thin-enforce-merge-spend.md`
- `ops-shared-inventory/docs/skills/grok-thin-offload/SKILL.md`

## Non-goals

Orchestrator bot, spend-optimizer bot, sync daemon, ambient panels without
Offload/Panel, bot named MAIOS, fifth keeper.
