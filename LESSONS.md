---
type: lessons
authority: observed
audience: [ai-agents, contributors, future-self]
last-updated: 2026-03-08
---

# LESSONS — alawein (Organization Repository)

> Observed patterns only. Minimal initial entry — update as lessons accumulate.

## Patterns That Work

- **SSOT link in header**: Pointing to the morphism-bible in the repo header keeps agents anchored to the canonical governance source rather than inferring rules locally.
- **Frontmatter for all governance docs**: Using YAML frontmatter with `type`, `authority`, and `audience` fields makes doc classification unambiguous across 20+ repos.
- **Documented GitHub-file exceptions**: Calling out `README.md` and `.github` templates as explicit contract exemptions prevents fake compliance work that would damage GitHub rendering or template behavior.
- **Path-scoped stash before branch recovery**: Stashing only the unrelated files and then restoring them onto a dedicated branch keeps `main` clean without losing intentional notebook or asset work.

## Anti-Patterns

- **Treating this repo as a code repo**: It is a documentation and governance repo; applying build/test tooling expectations here causes confusion.
- **Duplicating governance logic locally**: Rules that belong in the morphism-framework SSOT should not be restated here — link instead.
- **Assuming build artifacts exist**: CI contracts should never require `npm ci`, `npm run build`, or `dist/` unless the repo actually contains a package manifest and build surface.

## Pitfalls

- **Stale `last_updated` fields**: Frontmatter dates drift quickly when files are edited without updating metadata; enforce as part of any PR checklist.
- **Adding project-specific content**: This repo covers the whole org; project-scoped lessons belong in the individual project repos.
- **Dropping a stash too early**: A stash is only safe to delete after the work is restored elsewhere or confirmed to be obsolete.
