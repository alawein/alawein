---
type: lessons
authority: observed
last-updated: 2026-03-11
audience: [ai-agents, contributors, future-self]
---

# LESSONS — alawein (Organization Repository)

> Observed patterns only. Minimal initial entry — update as lessons accumulate.

## Patterns That Work

- **One canonical prompt prevents policy drift**: Anchoring org governance to `docs/governance/workspace-master-prompt.md` keeps workspace naming and migration rules stable.
- **Frontmatter for all governance docs**: Using YAML frontmatter with `type`, `authority`, and `audience` fields makes doc classification unambiguous across 20+ repos.
- **Documented GitHub-file exceptions**: Calling out `README-backup-20250807.md` and `.github` templates as explicit contract exemptions prevents fake compliance work that would damage GitHub rendering or template behavior.
- **Alias notation should be transitional and short-lived**: use `canonical-name (repo: physical-slug)` only while canonical and physical differ, then remove it immediately after cutover.
- **Generated sections must be treated as code**: Keeping `projects.json` and README sync markers in lockstep avoids silent data drift in org profile content.
- **Path-scoped stash before branch recovery**: Stashing only the unrelated files and then restoring them onto a dedicated branch keeps `main` clean without losing intentional notebook or asset work.
- **Workflow docs split by decision point**: Contributors find the right answer faster when operating-model, Git mechanics, review, merge, and release guidance are separate documents instead of one overloaded handbook.
- **Git hygiene separated from merge and review policy**: Stash cleanup, push rules, and branch recovery are operational mechanics, while review quality and merge approval are policy decisions and should not be collapsed into one guide.
- **Explicit stash and branch-recovery patterns**: The same recovery questions recur often enough that the docs should explain `apply`, `pop`, `drop`, and path-scoped stash usage in plain language.
- **One canonical home per shared resource class**: Workspace migrations stay tractable when governance, shared packages, and cross-repo guides each have a single documented owner instead of overlapping repos.
- **Archive-before-delete is safer in dirty multi-repo workspaces**: Converting a legacy repo to explicit archival mode first preserves traceability while avoiding accidental data loss before physical retirement cutover.
- **Retirement cutovers need explicit completion metadata**: Recording exact completion dates in SSOT and migration matrices prevents indefinite “pending” states after a structural migration is actually done.
- **Standards need an audit companion**: A stack-aware layout rule is much easier to apply when there is a repo-by-repo audit showing which repos are aligned, mixed, or intentionally exceptional.

## Anti-Patterns

- **Treating this repo as a code repo**: It is a documentation and governance repo; applying build/test tooling expectations here causes confusion.
- **Unscoped legacy-name usage**: Legacy names outside explicit alias contexts create ambiguity and break canonical-name audits.
- **Assuming build artifacts exist**: CI contracts should never require `npm ci`, `npm run build`, or `dist/` unless the repo actually contains a package manifest and build surface.

## Pitfalls

- **Stale `last_updated` fields**: Frontmatter dates drift quickly when files are edited without updating metadata; enforce as part of any PR checklist.
- **Adding project-specific content**: This repo covers the whole org; project-scoped lessons belong in the individual project repos.
- **Dropping a stash too early**: A stash is only safe to delete after the work is restored elsewhere or confirmed to be obsolete.
- **Editing synced README blocks manually**: Changes inside `SYNC:*` regions will be overwritten by `scripts/sync-readme.py` if `projects.json` is not updated.
