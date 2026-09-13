---
type: plan
status: done
source: writing-plans 2026-09-13 workspace cleanup
last_updated: 2026-09-13
owner: meshal
---

# Workspace cleanup — implementation plan

Design: `docs/superpowers/specs/2026-09-13-workspace-cleanup-design.md`

## Phase 0 — Scout (parallel, read-only)

- [ ] WT: list all worktrees; classify prune/keep/HOLD
- [ ] ORPHAN: scan buckets + `.worktrees` + leftover `-wt-*`
- [ ] DOCS: list `docs/superpowers` + sample `docs/internal`; citation check for delete candidates
- [ ] CAT: compare `catalog/repos.json` local_path to disk

## Phase 1 — Integrate

- [ ] Write scout pack table to `docs/superpowers/plans/2026-09-13-workspace-cleanup-scout-pack.md`

## Phase 2 — Apply

- [ ] Prune safe worktrees
- [ ] MOVE orphans + manifest under `_archive/cleanup-2026-09-13/`
- [ ] GIT-DELETE closed docs via PR (+ merge when green)
- [ ] Catalog MOVE/YAML for unambiguous rows; compile+validate

## Phase 3 — Closeout

- [ ] Mark design/plan done; short status in pack
