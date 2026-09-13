---
type: plan
status: applied
source: workspace cleanup scout pack 2026-09-13
last_updated: 2026-09-13
owner: meshal
---

# Workspace cleanup — scout pack + apply log

Design: `docs/superpowers/specs/2026-09-13-workspace-cleanup-design.md`

## Scout summary (integrator)

| Lane | Finding | Class | Apply |
|---|---|---|---|
| WT | `alawein-wt-agent-rev-f` (PR #264 MERGED) | PRUNE | removed |
| WT | Temp kilo-freeze + non-solo kit-reve registrations | PRUNE | pruned |
| WT | 3 Codex alawein WTs (dead gitdir → old `Desktop/GitHub/alawein`) | PARK-MOVE | archived |
| WT | 4 Codex foreign WTs (repz/simcore/maios-dashboard, dead parents) | PARK-MOVE | archived |
| ORPHAN | `core/alawein-wt-kit-reve` dead gitdir | PARK-MOVE | archived |
| ORPHAN | `.worktrees/prompty-chatoutput-optimizer` dead gitdir | PARK-MOVE | archived |
| DOCS | gated-leftovers + github-org-redteam closed packs | GIT-DELETE | this PR |
| DOCS | workspace-cleanup design/plan/scout | KEEP | keep |
| DOCS | `docs/internal` (~82) | KEEP | leave (no blind purge) |
| CAT | `android-coding-phone` → live `coding-phone` @ `core/coding-phone` | CATALOG-FIX | slug+url+rebuild |
| CAT | missing `dotclaude`, `kcompiler` | CATALOG-FIX | cloned into `core/` |
| CAT | `apps/spotify-control` uncatalogued | CATALOG-FIX | intake follow-up PR |
| ORPHAN | empty `.worktrees/` | PARK-MOVE | removed |
| ORPHAN | workspace-root `docs/superpowers/` (2 plans) | PARK-MOVE | archived |
| DOCS | gated-leftovers (scout KEEP vs aggressive DELETE) | GIT-DELETE | already deleted; no restore |

## Late scout reconcile

Scouts ([WT worktree scout](6db6f4c5-7c0f-4466-842f-be4135212887), [ORPHAN folder scout](3bb393d9-a2da-4523-ad3b-bb0e2c078d47), [DOCS stale scout](0ebf4872-6c00-441c-991b-2d0718be8ec5), [CAT catalog drift scout](248cd92e-aa34-439a-8508-40a36c25e513)) returned after apply. Material leftover: spotify-control intake + empty `.worktrees` + workspace-root docs. Control-gap 2026-09-10 PARK trio left in `docs/internal` (no blind purge).

## Post-apply verify

- [x] `git worktree list` on `core/alawein` → main only
- [x] `~/.codex/worktrees` empty
- [x] catalog `validate-catalog.py --strict` pass; missing local_path count 0
- [x] Doc GIT-DELETE PR opened (closed leftovers removed in this change)
- [x] Late scout follow-up: spotify-control + empty `.worktrees` + root docs
