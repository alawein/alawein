---
type: note
status: active
source: grok-thin enforce final 2026-09-14
last_updated: 2026-09-14
owner: meshal
---

# Cursor-first ops

Default execution plane for MAIOS multi-step work is **Cursor** (IDE Agent
or CloudAgent). Scheme A Grok keepers stay thin. Intake is triage only.

## Default

1. Any task needing more than two tool rounds: **Cursor Agent / CloudAgent**.
2. Intake replies with triage and dispatches Cursor. It does not run parallel
   Grok executor fleets under FREEZE.
3. Return a structured result to Intake: task ID, acceptance, paths, blockers
   (handoff contract).
4. After Cursor lands repo docs, Intake mirrors pointers into Desktop
   `ops-shared-inventory` (see `ADAPTERS.md`). If Desktop is unreachable,
   leave an explicit "Desktop mirror On Intake" checklist. Do not invent a
   sync daemon.
5. Ban poll-as-daemon for CloudAgent. Use wake, webhook, or Meshal `Continue`.

## Mechanical checklist (cheap path)

Cursor owns:

- rename/move docs, update indexes, fix CI
- run `bash -n`, update smoke scripts, fill AUTOLOG templates
- merges already approved (`promote it` / scoped merge grant)

Prefer flash/small models when the Cursor UI allows a model pick. Otherwise
use the account default and note it in the receipt. Never use fleet/Opus for
renames, INDEX regen, smoke syntax, or receipt stamps.

## Grok stays short

Orient / Continue / Approve gate / one nudge / short status: Grok Intake
chat only. Soft short. No executors. No raw 5-model dumps.

Escape hatch: `Force Grok: <task>`.

## Verbs

- `Offload: <task>`
- `Cursor: <owner/name> <ask>`
- `Panel: <q>` / `Panel fleet: <q>`
- `Force Grok: <task>`

See `GROK-THIN-OFFLOAD.md` and `GROK-USAGE-FREEZE.md`.
