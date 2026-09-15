---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-15
owner: meshal
---

# Langfuse tags for OpenRouter panel runs

Required tags on every `openrouter-expert-panel` run. Tag the run. Do not
invent a spend-optimizer bot.

| Tag | Required value |
|---|---|
| `maios.skill` | `openrouter-expert-panel` |
| `orch.mode` | `lite` or `fleet` |
| `models` | comma-separated OpenRouter ids actually called |
| `offload` | `true` |

Lite uses the five verified grill ids. Fleet uses all seven. See
`MODEL-ROUTING-BY-PURPOSE.md`. Ping/smoke is `google/gemini-3.8-flash`
only and is not a panel; do not tag a ping as `orch.mode=lite`.

Skills beat new durable bots. Scheme A keepers only. No bot named MAIOS.
