---
type: note
status: active
source: grok-thin enforce final 2026-09-14
last_updated: 2026-09-14
owner: meshal
---

# Adapters and sync (Grok-thin)

No daemon. No fifth keeper. Repo docs under `docs/internal/maios/` are the
coding-plane SoR for offload, freeze, and routing.

## Inventory

| Adapter | Path / surface | Sync direction |
|---|---|---|
| Repo docs | `docs/internal/maios/*` | SoR for coding-plane freeze/offload/routing |
| Desktop bridge | `ops-shared-inventory/docs/skills/grok-thin-offload`, `INTAKE-OPERATOR-COMMANDS.md`, `control/handoff/*` | Pointers + receipts. Not a second doctrine SoR |
| Grok workflows | `/home/box/agent-data/workflows/grok-thin-offload` + `openrouter-expert-panel` | Thin adapters of Desktop/repo bodies. Langfuse tags section on panel skill |
| Langfuse | Meshal-Langfuse | Tags only here. RO already OK. Mode C instrument needs Meshal Approve |
| Fleet health | `FLEET-HEALTH-*.md`, Policy `FLEET-BOARD` | Ops liveness, not spend |

Langfuse tag contract: `LANGFUSE-PANEL-TAGS.md`.

## Cursor sync checklist (repo side)

1. Files present: `GROK-USAGE-FREEZE.md`, `GROK-THIN-OFFLOAD.md`,
   `CURSOR-FIRST-OPS.md`, `MODEL-ROUTING-BY-PURPOSE.md`, `ADAPTERS.md`,
   `LANGFUSE-PANEL-TAGS.md`, `GROK-SPEND-INVESTIGATION-2026-09-14.md`.
2. `python -m pytest scripts/tests/test_grok_thin_freeze_paths.py -v --tb=short`
   with `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`.
3. `bash -n scripts/smoke-openrouter-one.sh`.
4. Do not run a 5-model panel from this checklist.
5. PR comment or AUTOLOG lists merge SHAs.

## Intake mirror checklist (Desktop)

1. `docs/skills/grok-thin-offload/SKILL.md` has Freeze + Cursor-first + verbs.
2. `docs/superpowers/INTAKE-OPERATOR-COMMANDS.md` documents `Offload:`,
   `Cursor:`, `Panel:`, `Panel fleet:`, `Force Grok:`.
3. `scripts/Test-GrokThinOffload.ps1` ALL_PASS.
4. Receipt under `control/handoff/` (not Downloads-only).
5. Propose FLEET-BOARD row only. Do not sole-write `FLEET-BOARD.md`.

## In-repo piece (no daemon)

Presence is enforced by `scripts/tests/test_grok_thin_freeze_paths.py`.
That is the sync check in CI (`test-scripts`). Desktop paths are named, not
copied into this git tree.
