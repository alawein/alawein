---
type: plan
status: done
source: writing-plans 2026-09-13 github org redteam exec checklist
last_updated: 2026-09-13
owner: meshal
---

# GitHub org red-team - execution checklist

**Parent audit:** `docs/superpowers/plans/2026-09-13-github-org-redteam-convergence.md`  
**Authority:** Meshal explicit yes 2026-09-13 (this session) + Cursor Velocity for superseded PR closes.  
**Merge gate:** still requires exact `promote it` per PR.

---

## Recap (verified)

| Fact | Value |
|---|---|
| `alawein` repos | 61 (10 public / 51 private / 12 archived) |
| `kohyr` repos | 10 (1 public: `.github`) |
| Open PRs (search) | ≥102 alawein (~65 Dependabot), 10 kohyr |
| #267 / #268 | Already MERGED |
| Highest-cost kohyr drift | Org description was "AI control plane…"; profile had "over any agent runtime"; kohyr.ai holding copy |
| PyPI traps | `trace-eval` → kin0kaze23; `outpost` → niveapps (not alawein `outpost-kit`) |
| DECISIONS conflict | `workspace-brain` claimed archived; resolved by archiving 2026-09-13 |

**Architecture (locked strategy):** labels only; no renames/deletes; archive-in-place Month-6; Session 0 = kohyr claims + pins + map.

---

## Wave A - close now (superseded / abandoned / empty)

Comment on each close cites this checklist. Applied 2026-09-13 under Meshal explicit yes.

- [x] `kohyr/.github#1` - CLOSED (empty commit; rewrite already on `main`)
- [x] `alawein/workspace-brain#1` - CLOSED
- [x] `alawein/bolts#37` - CLOSED (Copilot draft)
- [x] `alawein/qubeml#51` - CLOSED (Copilot draft)
- [x] `alawein/scicomp#106` - CLOSED (Copilot draft)
- [x] `alawein/optiqap#34` - CLOSED (Copilot draft)
- [x] `alawein/ledger-voice-demo#2` - CLOSED (unarchive-close-rearchive)
- [x] `alawein/helios#4` - CLOSED (unarchive-close-rearchive)
- [x] `kohyr/kohyr-legacy#492,#497,#498,#499` - CLOSED (unarchive-close-rearchive)
- [x] `kohyr/kohyr-internal-legacy#17,#18` - CLOSED (unarchive-close-rearchive)

## Wave B - leave open / merged under promote it

| PR | Status |
|---|---|
| `alawein/knowledge-base#49` | MERGED 2026-09-13 |
| `alawein/bolts#33,#34` | MERGED 2026-09-13 |
| `alawein/alawein#269` | Draft; Work taxonomy FAIL - leave |
| `alawein/bolts#35` | CONFLICTING - rebase first |
| `alawein/meshal-web#72,#73,#74` | **Not superseded** - main still on older pins |
| `alawein/chshlab` Dependabot (esp. vitest 5) | Major bumps; CI red |
| Frozen-lab Dependabot (maglogic/spincirc/…) | Leave; prefer labels over dep churn |
| `kohyr/kohyr#119`, founder-dashboard #2/#3 | Product deps - leave |
| `design-system#66–#77` | Consolidate later; do not mass-close |

## Wave C - metadata (applied 2026-09-13 under promote it + exact yeses)

1. [x] `kohyr` org description → `Local job-completion loop for coding agents (pre-alpha).`
2. [x] `kohyr/.github` profile: removed "over any agent runtime" (PR #2 MERGED)
3. [x] Declared pins in `profile-from-guides.yaml`: maglogic, scicomp, fallax, chshlab, alawein, outpost. Live pins verified 2026-09-13: maglogic, scicomp, fallax, chshlab, alawein, outpost.
4. [x] 10-line account map in generated README via `account_map` + `sync-readme.py`
5. [x] Topics+descriptions batch A
6. [x] Topics+descriptions batch B
7. [x] Topics+descriptions batch C (unarchive-edit-rearchive)
8. [x] `workspace-brain` archived + `maios-superseded` to match DECISIONS R2
9. [x] kohyr.ai holding-page cutover - claim-ladder-clean deployed via kohyr/holding#1 + kohyr-wip prod (2026-09-13)

## Wave D - SoR conflicts (closed 2026-09-13)

- [x] Align Desktop SoR canon site HEAD (`ops-shared-inventory/DECISIONS.md`; tip lives there, not `MAIOS.md`) to live `alawein/meshal-web` `main` @ `212cdc3` (`212cdc3608e07b8d2c3121c3644b440ad3845b6f`).
- [x] Align DECISIONS R2 vs live `workspace-brain` archive bit (archived 2026-09-13)
- [x] Delete leftover remote `chore/vitest-4.1.11` (ahead 0 / behind 1); local `sites/meshal-web` on `main` @ `212cdc3`. alawein#273 MERGED.

**Out of scope (intentional leave):** frozen-lab Dependabot; `design-system#66–77`; `meshal-web#72–74`.

---

## Single next

None. Waves A–D for this checklist are closed.
