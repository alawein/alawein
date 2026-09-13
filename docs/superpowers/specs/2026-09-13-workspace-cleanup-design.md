---
type: design
status: done
source: brainstorming 2026-09-13 workspace cleanup
last_updated: 2026-09-13
owner: meshal
---

# Workspace cleanup (solo/alawein) — design

Approved 2026-09-13. Scope **B**, disposition **B**, catalog mode **C** then apply approved rows. Meshal: approve design and continue end-to-end autonomously.

## Goal

Clean `Desktop/GitHub/solo/alawein` disk and control-plane docs without silent relocates or permanent deletes. Finalize catalog/`local_path` against real bucket folders after a scout drift table.

## Non-goals

- Desktop `ops-shared-inventory` packs (out of scope)
- Kohyr tree, AGI paths, permanent delete
- Mass-close Dependabot / `design-system#66–77` / `meshal-web#72–74`
- Renaming live product repos

## Architecture

1. **Scout wave** (cheap models, read-only): four parallel lanes.
2. **Integrator**: one pack with KEEP / PARK-MOVE / GIT-DELETE / CATALOG-FIX rows + evidence.
3. **Apply wave** (autonomous under this approval for clear-cut rows): prune safe worktrees; MOVE untracked junk → `_archive/` + dated manifest; open/merge `alawein` PR(s) to git-delete closed specs/plans with no live citations; apply unambiguous catalog MOVE + YAML + recompile.
4. **HOLD** any dirty worktree, unpushed-only tip, or ambiguous dual-path checkout.

## Scout lanes

| Lane | Job | Inputs | Output |
|---|---|---|---|
| WT | Worktrees | `git worktree list` on `core/alawein`; `.codex/worktrees`; `solo/alawein/.worktrees` | prune / keep / HOLD |
| ORPHAN | Folder orphans | bucket dirs, `-wt-*` leftovers, empty/no-`.git` | PARK-MOVE / KEEP |
| DOCS | Stale docs | `docs/superpowers`, `docs/internal`, `docs/archive`; citation grep | GIT-DELETE / KEEP / PARK |
| CAT | Catalog drift | `catalog/index.yaml` + `repos.json` `local_path` vs disk | CATALOG-FIX / MOVE-CANDIDATE / OK |

## Disposition rules

| Class | Action |
|---|---|
| Closed/superseded tracked docs, zero citations | GIT-DELETE via PR |
| Untracked disk junk / empty worktree dirs | PARK-MOVE → `solo/alawein/_archive/cleanup-YYYY-MM-DD/` + manifest |
| Registered worktree, clean, tip merged or `prunable` | `git worktree remove` (+ delete remote branch only if already merged and named) |
| Dirty / ahead-unpushed | HOLD |
| Catalog path wrong, single clear target bucket | MOVE checkout + update `local_path` + `compile_index.py` |
| Catalog ambiguity (two checkouts) | HOLD in pack |

## Apply order

1. WT prune (safe only)
2. ORPHAN MOVE + manifest
3. DOCS PR (git-delete) → merge under Velocity + prior promote pattern when CI contract-green
4. CAT MOVE + YAML + compile/validate
5. Closeout note in checklist or scout pack status: done

## Verification

- `git worktree list` has no approved-prune leftovers
- Manifest lists every MOVE
- `python scripts/catalog/compile_index.py --check`
- `python scripts/catalog/validate-catalog.py --strict` (if present)
- Doc-delete PR CI green (Work taxonomy may admin-merge if known drift)

## Success

Buckets match approved catalog; prunable worktrees gone; closed red-team leftover plans removed or explicitly KEEP; one closeout; no permanent delete; no Desktop SoR edits required.
