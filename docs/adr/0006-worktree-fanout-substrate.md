---
type: canonical
status: accepted
last_updated: 2026-09-08
owner: meshal
---

# ADR 0006: Two registered worktree roots, `workspace-batch worktree` owns lifecycle

## Decision

Exactly two worktree roots are registered fanout substrate: `~/worktrees`
(Kilo Agent Manager) and `~/.codex/worktrees` (Codex). A worktree anywhere
else is a violation. `workspace-batch worktree` (Phase 5) owns
create/list/gc/doctor against a single registry file
(`~/worktrees/.registry.json`), with a single writer holding a file lock, and
enforces naming (`<root>/<repo>/<slug>`), per-repo and global concurrency
caps, and TTL/merged garbage collection.

## Rejected alternatives

- Unregistered, ad hoc worktree creation left to each tool's default
  behavior. Rejected: this is the status quo and is exactly what produced the
  17-worktree `~/worktrees` occupancy this plan has to work around, plus the
  root cause of the absolute-path hook breakage (Phase 4 current-state facts).
- One registry per tool (a Kilo registry and a separate Codex registry).
  Rejected: `doctor` needs a single view to detect worktrees outside both
  roots and to reconcile Agent Manager metadata; two registries reintroduce
  the split-brain problem this ADR exists to close.
- No TTL/GC, manual cleanup only. Rejected: does not scale past the current
  17 worktrees and risks accumulating stale checkouts indefinitely.

## Consequences

`doctor`'s first run must reconcile the 17 existing `~/worktrees` entries
into the registry rather than flagging them all for removal (step 23). `gc`
must never touch a worktree with an active session marker or uncommitted
changes without `--force` (step 22). Worktree removal always goes through
`git worktree remove`, never manual directory deletion, so
`kilo-agent-manager-metadata.json` stays consistent.
