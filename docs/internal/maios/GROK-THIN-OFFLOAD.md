---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-14
owner: meshal
---

# Grok-thin offload (canonical matrix)

Intake (`maios.command.intake`) is the sole ordinary inbox. Heavy work leaves
Grok. Scheme A keepers only: Intake, Policy, Cleanup, Editorial. BLOCK fifth
keeper.

## Classify

`classify_offload_target(taskKind)`:

| taskKind | target | notes |
|---|---|---|
| triage / Orient / Continue / Approve gate / one nudge | InlineGrok | soft short chat; no multi-executor |
| coding / repo edit / PR / tests / large doc packs | CursorCloud | CloudAgent; no Grok executor chain |
| multi-model grill / architecture opinion | OpenRouterPanel | skill `openrouter-expert-panel`; lite default |
| fleet Job A/B | InlineGrok skill short OR CursorCloud if >15 min | never 5 parallel Grok executors for one scan |

## Operator verbs

- `Offload: <task>`
- `Cursor: <owner/name> <ask>`
- `Panel: <question>` (lite 5)
- `Panel fleet: <question>` (7)
- `Force Grok: <task>` (freeze escape hatch)

## Freeze

See `GROK-USAGE-FREEZE.md` and `CURSOR-FIRST-OPS.md`. During FREEZE, Intake
triages and dispatches. Do not poll-as-daemon. Multi-step work defaults to
Cursor.

## Guardrails

Spend soft caps / alert / `MAIOS_PANEL_KILL=1`. Approve before
push/merge/delete. Classifier shadow week, target <10% misroute. Handoff
carries task ID, scoped inputs, acceptance, structured result.

## Desktop SoR (named, not copied)

- `ops-shared-inventory/docs/superpowers/plans/2026-09-14-grok-thin-cursor-openrouter-offload.md`
- `ops-shared-inventory/docs/superpowers/plans/2026-09-14-grok-thin-enforce-merge-spend.md`
- `ops-shared-inventory/docs/skills/grok-thin-offload/SKILL.md`

## Non-goals

Orchestrator bot, sync daemon, ambient panels without Offload/Panel, bot named
MAIOS.
