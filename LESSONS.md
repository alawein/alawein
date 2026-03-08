---
type: lessons
authority: observed
last-updated:  2026-03-08
audience: [ai-agents, contributors, future-self]
---

# LESSONS — alawein (Organization Repository)

> Observed patterns only. Minimal initial entry — update as lessons accumulate.

## Patterns That Work

- **SSOT link in header**: Pointing to the morphism-bible in the repo header keeps agents anchored to the canonical governance source rather than inferring rules locally.
- **Frontmatter for all governance docs**: Using YAML frontmatter with `type`, `authority`, and `audience` fields makes doc classification unambiguous across 20+ repos.
- **Documented GitHub-file exceptions**: Calling out `README.md` and `.github` templates as explicit contract exemptions prevents fake compliance work that would damage GitHub rendering or template behavior.
- **Path-scoped stash before branch recovery**: Stashing only the unrelated files and then restoring them onto a dedicated branch keeps `main` clean without losing intentional notebook or asset work.
- **Workflow docs split by decision point**: Contributors find the right answer faster when operating-model, Git mechanics, review, merge, and release guidance are separate documents instead of one overloaded handbook.
- **Git hygiene separated from merge and review policy**: Stash cleanup, push rules, and branch recovery are operational mechanics, while review quality and merge approval are policy decisions and should not be collapsed into one guide.
- **Explicit stash and branch-recovery patterns**: The same recovery questions recur often enough that the docs should explain `apply`, `pop`, `drop`, and path-scoped stash usage in plain language.
- **One canonical home per shared resource class**: Workspace migrations stay tractable when governance, shared packages, and cross-repo guides each have a single documented owner instead of overlapping repos.

## Anti-Patterns

- **Treating this repo as a code repo**: It is a documentation and governance repo; applying build/test tooling expectations here causes confusion.
- **Duplicating governance logic locally**: Rules that belong in the morphism-framework SSOT should not be restated here — link instead.
- **Assuming build artifacts exist**: CI contracts should never require `npm ci`, `npm run build`, or `dist/` unless the repo actually contains a package manifest and build surface.

## Pitfalls

- **Stale `last_updated` fields**: Frontmatter dates drift quickly when files are edited without updating metadata; enforce as part of any PR checklist.
- **Adding project-specific content**: This repo covers the whole org; project-scoped lessons belong in the individual project repos.
- **Dropping a stash too early**: A stash is only safe to delete after the work is restored elsewhere or confirmed to be obsolete.
