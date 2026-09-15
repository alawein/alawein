---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-15
owner: meshal
---

# Model routing by purpose

Grok chat underlying model is not SoR-controlled. The Grok product UI
chooses that model. This repo cannot change Grok's underlying chat model.
Route behavior only: triage in Grok, execution in Cursor or OpenRouter.

Refresh OpenRouter ids via `GET https://openrouter.ai/api/v1/models` if a
call 404s. Do not invent ids.

## Cost ladder

Cheapest adequate model wins.

| Rung | Use | Plane / ids |
|---|---|---|
| Mechanical | Code, PR, tests, docs-in-git, pings | Cursor default, or `google/gemini-3.8-flash` |
| Grill | Architecture / keeper design when asked | OpenRouter lite 5 |
| Fleet | Rare board / seven-way opinion | OpenRouter fleet 7; max 1/day |
| Grok cheap | Behavioral short triage only | No executors, no panels, no long folds |

Default plane is Cursor. See `CURSOR-FIRST-OPS.md`.

## Purpose table

| Purpose | Prefer | Avoid | Why |
|---|---|---|---|
| Grok Intake triage / Orient / Approve gates | Grok chat, short | Grok executors, panels | Protect weekly meter |
| Repo coding / tests / PR | Cursor Cloud default model | Grok executors writing files | Cursor-first |
| Smoke ping / connectivity | `google/gemini-3.8-flash` (or current flash) 1 call | 5-model panel | Cheap proof |
| Architecture / keeper design grill | OpenRouter lite 5 only when asked; fleet 7 rare | Grok synthesizing huge dumps | Cost + quality |
| Fleet board opinion | OpenRouter fleet preset (7 verified) only on demand | Daily automatic fleet panels | Expensive |
| Classifier shadow / telemetry | Local PS1 + flash | Opus | <10% misroute target without spend |
| Editorial QC | Editorial keeper short or Cursor | Multi-model | QC is narrow |

## Verified OpenRouter IDs (Sep 2026 fleet list)

1. `openai/gpt-6-astra-pro`
2. `anthropic/claude-opus-5`
3. `qwen/qwen3.8-max-0902`
4. `z-ai/glm-5.3`
5. `deepseek/deepseek-v4-pro-0813`
6. `moonshotai/kimi-k3`
7. `google/gemini-3.8-flash`

**Lite 5:** `moonshotai/kimi-k3`, `anthropic/claude-opus-5`,
`openai/gpt-6-astra-pro`, `z-ai/glm-5.3`, `qwen/qwen3.8-max-0902`

**Ping/smoke:** `google/gemini-3.8-flash` only

**Fleet 7:** all seven ids above

**Reasoning models (panel callers):** `max_tokens >= 24000`; retry once on
empty content. Manual / `openrouter-expert-panel` only.
`scripts/ops/openrouter_route.py` keeps its config default (8192) and does
not retry. Smoke ping stays at `max_tokens` 64.

## Caps

Lite max 3/day. Fleet 7 max 1/day. Alert at 70%. Smoke script no-ops when
`MAIOS_PANEL_KILL=1`; `openrouter_route.py` does not honor it yet. If
`google/gemini-3.8-flash` 404s, see spend investigation 404 note.
