---
type: internal
source: kernel canonicalization Phase 8 execution session
sla: on-change
last_updated: 2026-09-08
audience: [ai-agents, contributors]
---

# Research lane

Evidence-gated research on external kernel/scaffolding/supply-chain-security
prior art, per `docs/internal/plans/2026-09-08-kernel-canonicalization.md`
Phase 8. Entries live in `catalog/research.yaml`. This lane exists to keep
kernel design decisions grounded in verifiable external practice, not
invented convention.

## Scoring rubric

Each `catalog/research.yaml` entry scores five dimensions, 1 (weak) to 5
(strong):

1. **Adoption signal** -- stars, forks, downstream users, or standards-body
   backing. Evidence of real-world use beyond the maintainer's own projects.
2. **Maintenance signal** -- commit cadence, release cadence, open issue/PR
   triage health, contributor count. A tool with adoption but no maintenance
   is a liability, not a reference.
3. **Security posture** -- for tools that touch the supply chain directly
   (signing, provenance, dependency updates): does the tool itself follow
   the practices it promotes (SLSA level, Scorecard score, signed releases)?
   For tools with no direct security surface (a templating engine), this
   dimension scores the *absence* of known supply-chain risk, not zero by
   default.
4. **Fit to this kernel** -- how directly the tool's approach maps onto
   `docs/governance/kernel-spec.md`'s canonical tree, managed-block markers,
   or the renderer/detector split (ADR 0003, ADR 0004). A tool that solves
   an unrelated problem well still scores low here.
5. **Migration cost** -- effort to adopt or adapt the pattern into this
   kernel, given the existing renderer (dependency-light, no network access,
   Windows-compatible) and `repo-drift`'s dependency-free detector
   constraint. High cost is not disqualifying; it is a fact the promotion
   path (below) must account for.

## Evidence requirements

- Every entry's `source_url` must be a URL actually fetched or returned by
  a live search during the session that added the entry -- never a
  remembered or assumed URL. See `date_observed`.
- `date_observed` is the date of that live fetch, not the tool's release
  date or "today" by convention. It must never be a forward date relative
  to when the entry was added.
- An entry that cannot be verified live during the seeding session stays
  out, full stop -- there is no "add now, verify later" path for this lane.
- `kernel_impact` states what this kernel already does, does differently,
  or could adopt because of this entry -- not a generic tool description.
  If an entry has no discernible kernel impact yet, say so explicitly
  rather than padding with a paraphrase of the tool's own README.

## Promotion path

Research entry -> ADR -> kernel spec change -> renderer/detector change ->
wave. No shortcut from a research entry directly to a renderer change:
every kernel-affecting idea that graduates out of `catalog/research.yaml`
must first be argued as an ADR (naming the rejected alternatives, per the
existing ADR convention in `docs/adr/`), then land in
`docs/governance/kernel-spec.md`'s canonical tree, before any renderer or
detector code changes to implement it, before it ships in a wave.

## Current entries

See `catalog/research.yaml`. As of 2026-09-08: 20 entries, all seeded from
live `websearch` calls performed during that session (see each entry's
`date_observed`). Starting set drawn from step 36 of the execution plan
(Backstage, Nx, Turborepo, copier, cookiecutter, OpenSSF Scorecard, SLSA,
Sigstore, Renovate, Bazel, Terraform module registry conventions), expanded
with directly adjacent tools that live search actually surfaced while
verifying those (Dependabot, pre-commit, Conventional Commits, Changesets,
GitHub repository templates, EditorConfig, in-toto, semantic-release).
