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
| CAT | other `local_path` rows | OK | — |

## Manifest

`solo/alawein/_archive/cleanup-2026-09-13/MANIFEST.md`

## Post-apply verify

- [x] `git worktree list` on `core/alawein` → main only
- [x] `~/.codex/worktrees` empty
- [x] catalog `validate-catalog.py --strict` pass; missing local_path count 0
- [x] Doc GIT-DELETE PR opened (closed leftovers removed in this change)
