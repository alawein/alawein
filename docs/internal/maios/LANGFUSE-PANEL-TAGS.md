---
type: note
status: active
source: grok-thin enforce final 2026-09-14
last_updated: 2026-09-14
owner: meshal
---

# Langfuse panel tag contract

Required tags when a panel or offload run is traced in Meshal-Langfuse.
This file is the contract. It does not enable a daemon. It does not print
secrets. Mode A RO is standing. Mode C instrument of live panels needs
Meshal `Approve:`.

## Required tags

| Tag | Values |
|---|---|
| `maios.skill` | `openrouter-expert-panel` |
| `orch.mode` | `lite` or `fleet` or `full` |
| `maios.offload` | `true` |

Optional smoke: `maios.instrument=smoke`.

## Hygiene

- Never dump five raw panel replies into Grok. Synthesis <=20 lines.
- Do not run a 5-model panel to prove this contract.
- Flash pings (`google/gemini-3.8-flash`) are not panels. Tag them only if
  an operator asks.

## Smoke traces (optional note)

Desktop receipt `control/handoff/AUTOLOG-LANGFUSE-PANEL-INSTRUMENT-2026-09-14.md`
recorded Mode C smoke ids (2026-09-14):

- `6f86e9173a7b46c390b6475cf2f4bcc4`
- `205790c10fe44c04a5bba4bf410bc9f2` (with generation)

Those ids are evidence of the tag contract, not a license to run another
panel.
