---
type: frozen
source: none
sync: none
sla: none
title: Parent alawein repo removal (clone-root conversion)
description: Record of converting github.com/alawein from a git repo to a plain clone root per standard one-repo-per-project layout.
category: archive
audience: [contributors, operators]
status: archived
last_updated: 2026-03-18
---

# Parent alawein repo removal — 2026-03-18

**Purpose:** Convert the parent folder `github.com/alawein` from a git repository into a **plain directory** (clone root) so that only leaf repos (e.g. `alawein/alawein`, `alawein/meshal-web`) are git repos. This matches the standard one-repo-per-project approach.

## State captured before removal

- **Path:** `C:\Users\mesha\Desktop\GitHub\github.com\alawein` (parent had its own `.git`).
- **Branch:** `master`.
- **Last commit (parent repo):** `ff4d662` — chore: update batch docs and audit matrices for forge consolidation.
- **Remote:** None configured (or not printed); parent repo had submodule errors (`fatal: no submodule mapping found in .gitmodules for path '_business-tools'`).

## Action taken

- Removed the parent `.git` directory at `github.com/alawein` so that `alawein` is now a plain folder containing project subdirectories, each with its own repo (e.g. `alawein/alawein` → `https://github.com/alawein/alawein.git`).

## Result

- `github.com/alawein/` is a **clone root**: no uncommitted state at the parent level.
- All version control is in the leaf repos (e.g. `alawein/alawein`). Commit and push only in those repos.

## Recovery (if ever needed)

To re-create a repo at the parent, re-run `git init` in `github.com/alawein` and optionally re-add remotes/submodules. The commit hash above may help locate history if the parent was ever pushed elsewhere.
