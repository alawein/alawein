---
type: plan
status: active
source: writing-plans 2026-09-13 github org redteam exec checklist
last_updated: 2026-09-13
owner: meshal
---

# GitHub org red-team — execution checklist

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
| Highest-cost kohyr drift | Org description “AI control plane…” + profile “over any agent runtime” + kohyr.ai holding copy |
| PyPI traps | `trace-eval` → kin0kaze23; `outpost` → niveapps (not alawein `outpost-kit`) |
| DECISIONS conflict | `workspace-brain` claimed archived; API `archived:false` |

**Architecture (locked strategy):** labels only; no renames/deletes; archive-in-place Month-6; Session 0 = kohyr claims + pins + map.

---

## Wave A — close now (superseded / abandoned / empty)

Comment on each close cites this checklist. Applied 2026-09-13 under Meshal explicit yes.

- [x] `kohyr/.github#1` — CLOSED (empty commit; rewrite already on `main`)
- [x] `alawein/workspace-brain#1` — CLOSED
- [x] `alawein/bolts#37` — CLOSED (Copilot draft)
- [x] `alawein/qubeml#51` — CLOSED (Copilot draft)
- [x] `alawein/scicomp#106` — CLOSED (Copilot draft)
- [x] `alawein/optiqap#34` — CLOSED (Copilot draft)
- [!] `alawein/ledger-voice-demo#2` — **BLOCK**: repo archived → read-only; cannot close without temporary unarchive exact-yes
- [!] `alawein/helios#4` — **BLOCK**: same (archived read-only)
- [!] `kohyr/kohyr-legacy#492,#497,#498,#499` — **BLOCK**: archived read-only
- [!] `kohyr/kohyr-internal-legacy#17,#18` — **BLOCK**: archived read-only

**Unarchive-close-rearchive batch (needs named exact-yes):** temporarily unarchive each listed repo, close open PRs, re-archive. Max 5 repos per yes.

## Wave B — leave open (needs rebase / product decision)

| PR | Why leave |
|---|---|
| `alawein/knowledge-base#49` | CI green; merge needs `promote it` |
| `alawein/alawein#269` | Draft; Work taxonomy FAIL |
| `alawein/bolts#33,#34` | Security; mergeable — needs `promote it` each |
| `alawein/bolts#35` | CONFLICTING — rebase first |
| `alawein/meshal-web#72,#73,#74` | **Not superseded** — main still on older pins |
| `alawein/chshlab` Dependabot (esp. vitest 5) | Major bumps; CI red |
| Frozen-lab Dependabot (maglogic/spincirc/…) | Leave; prefer labels over dep churn |
| `kohyr/kohyr#119`, founder-dashboard #2/#3 | Product deps — leave |
| `design-system#66–#77` | Consolidate later; do not mass-close |

## Wave C — metadata (needs named string / batch yes)

Paste exact yes per line before Cursor applies:

1. `kohyr` org description → proposed: `Local job-completion loop for coding agents (pre-alpha).`
2. Edit `kohyr/.github` profile: remove “over any agent runtime”
3. Repin alawein to: `chshlab`, `outpost`, `fallax`, `alawein`, `maglogic`, + one of `repo-drift`/`scicomp`
4. Add 10-line account map to `alawein/alawein` README (via PR)
5. Topics+descriptions batch A (≤5): alawein, chshlab, outpost, fallax, repo-drift
6. Topics+descriptions batch B (≤5): maglogic, scicomp, qmatsim, spincirc, qubeml
7. Topics+descriptions batch C (≤5): outpost-archive, trace-eval, trace_eval, lightcone-trace-eval, ops-control-plane-grok
8. Resolve `workspace-brain` archive flag vs DECISIONS before labeling
9. kohyr.ai holding-page cutover (site; separate)

## Wave D — SoR conflicts (docs only until yes)

- [ ] Align `MAIOS.md` meshal-web tip with live `main` (branch `chore/vitest-4.1.11` is behind)
- [ ] Align DECISIONS R2 vs live `workspace-brain` archive bit

---

## Single next after Wave A

Say `promote it` for `knowledge-base#49` **or** paste exact yes for Wave C item 1 (org description).
