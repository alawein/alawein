---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-15
owner: meshal
---

# Adapter map (repo, Desktop, Grok, Langfuse, fleet)

Pointer map only. Not a sync daemon. Not a memory bus. Dual SoR B:
doctrine lives in `maios/` on the laptop; this repo records git-owned
fields. Bridge notes live in `ops-shared-inventory`. Do not dual-write.

## Surfaces

| Surface | Owns | Adapter / route | Health check |
|---|---|---|---|
| This repo `docs/internal/maios/` | Freeze, matrix, routing, tags | Cursor writes; git wins | `pytest scripts/tests/test_grok_thin_freeze_paths.py` |
| Desktop `ops-shared-inventory` | Ops doctrine, classifier `.ps1`, Cleanup MOVE | Named, not copied | Laptop only (UNVERIFIED here) |
| Grok workflows (Scheme A) | Intake / Policy / Cleanup / Editorial | RICH / SLACK / CLI per SoR | Weekly + on-demand meters |
| Langfuse | Panel traces | Tags in `LANGFUSE-PANEL-TAGS.md` | `maios.skill`, `orch.mode`, `models`, `offload=true` |
| Fleet health | Board rows | Policy sole-writes `FLEET-BOARD.md` | Propose diffs only |

## Reply adapters

Pick one. Do not mix.

| Adapter | Where | SoR |
|---|---|---|
| RICH | Cursor IDE / Cloud chat | `prompt-kits/AGENT.md` 1.8.4 / Desktop `RESPONSE-STYLE.md` rev g |
| SLACK | Slack threads | `docs/governance/slack-agent-voice.md` |
| CLI | Terminal / CI / Codex CLI | ASCII; `[Ready]` / `[Waiting]` / `[Blocked]` |

## Workflows to Grok

Grok keepers consume verbs, not raw dumps:

- `Offload:` / `Cursor:` / `Panel:` / `Panel fleet:` / `Force Grok:`
- Intake classifies, then stops
- Cursor or OpenRouter returns a short synthesis (<=20 lines)

Ban poll-as-daemon. No swarm webhooks. No bot named MAIOS. BLOCK fifth
keeper. Skills beat new durable bots.

## Fleet health

Policy writes the board. Intake may propose a diff. Cursor may draft
the patch. Grok does not fold a full Job A scan into chat during
FREEZE. See `CURSOR-FIRST-OPS.md` and `GROK-USAGE-FREEZE.md`.
