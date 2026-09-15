---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-15
owner: meshal
---

# Grok usage freeze

Operational rule for Scheme A Grok keepers. Not a fifth keeper. Not SoR for
FLEET-BOARD (Policy sole-writes that file). Grok chat underlying model is
not SoR-controlled.

## Trigger

When Grok Bot **weekly >= 80%** OR **on-demand >= 70%** of the product limit:
state is **FREEZE**.

Observed 2026-09-14 evening PT (Declared from operator paste, not re-read in
UI here): weekly 100%; on-demand about $38.91 of $50. That is FREEZE.

`grok_usage_freeze(100, 77.82)` is FREEZE. `grok_usage_freeze(79.9, 69.9)` is
OPEN.

## What FREEZE means

Stop:

- Grok `executor` fleets
- 5-model or 7-model panels **orchestrated by Grok**
- "continue scanning" Job A full passes
- poll-as-daemon loops waiting on Cursor CloudAgent

Keep:

- Intake Orient / Continue / Approve-gate triage (soft, short)
- Dispatch via operator verbs to Cursor or OpenRouter
- Job B short fleet triage (default under FREEZE)

## Job B outranks Job A

Under FREEZE, Job B > Job A. Prefer one short Job B triage. Do not start a
Job A full desktop inventory unless Meshal says `Force Grok:` or the unused
calendar-day Job A slot is short. Job A full scan: max 1x per calendar day.
If the scan would take more than 15 minutes of Grok tools, send `Cursor:`
instead. No Grok executor fleets. No 5-model panels orchestrated by Grok.

## Operator verbs

- `Offload: <task>`: classify and route (InlineGrok | CursorCloud | OpenRouterPanel).
- `Cursor: <owner/name> <ask>`: Cursor CloudAgent on that KEEP repo. No ambient push.
- `Panel: <question>`: OpenRouter lite (5). Run from script/Cursor, not Grok executors.
- `Panel fleet: <question>`: OpenRouter 7-model fleet. On demand only. Max 1/day.
- `Force Grok: <task>`: explicit escape hatch for one named task during FREEZE.

## Completion

Ban poll-as-daemon for CloudAgent. Use wake, webhook, or Meshal `Continue`
only. No sync daemon.

## Spend rails (OpenRouter)

Standing yes is unlimited until revoke. Still:

- Lite panel max 3 per calendar day
- Fleet 7 max 1 per calendar day
- Alert at 70% of those caps
- Kill-switch: `MAIOS_PANEL_KILL=1` (`scripts/smoke-openrouter-one.sh`
  must no-op). `scripts/ops/openrouter_route.py` does not honor this
  switch yet.

## Scheme A

Keepers: Intake, Policy, Cleanup, Editorial. BLOCK fifth keeper. No bot named
MAIOS. Skills beat new durable bots. Do not invent a spend-optimizer bot.
Default plane: `CURSOR-FIRST-OPS.md`. Adapter map: `ADAPTERS.md`.
