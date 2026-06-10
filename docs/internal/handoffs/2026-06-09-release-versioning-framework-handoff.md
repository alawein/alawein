---
type: canonical
source: none
sync: none
sla: none
title: Release and Versioning Framework Handoff
description: End-of-session handoff for the release/versioning framework (design, governance docs, and two product pilots) with open follow-ups
category: handoff
audience: [ai-agents, contributors]
status: active
last_updated: 2026-06-09
---

# Release and Versioning Framework: Handoff (2026-06-09)

Resume-from-zero record for the release/versioning framework effort: a three-pillar
versioning standard authored as alawein governance and proven on two product repos.

## Status at a glance (three open PRs)

| PR | What | State |
|----|------|-------|
| [alawein#133](https://github.com/alawein/alawein/pull/133) | The framework: convention section 5 edges + two companion governance docs | Open. Real checks green (Doctrine, Derived File Drift after the INDEX fix). One red: `Audit Documentation`, a central-CI flake (see follow-up 2). |
| [alawein/gymboy#28](https://github.com/alawein/gymboy/pull/28) | Pilot 1: reconcile `1.0.0-immersive` -> `1.1.0`, rosetta, roadmap, two checks, `v1.1.0` tag | Open. Pilot content clean. Two reds are pre-existing gymboy CI debt, not the pilot (see follow-up 3). |
| [alawein/scribd#13](https://github.com/alawein/scribd/pull/13) | Pilot 2 (generalization): reconcile `0.1.0` -> `1.1.0`, rosetta, roadmap, two checks, `v1.1.0` tag | Open. Pilot verified clean locally (checks pass, 10/10 tests in 0.5s, eslint clean). |

None are merged. Merges are the maintainer's call (no self-merge).

## What was built

Three-pillar framework extending [`commit-release-convention.md`](../../governance/commit-release-convention.md):

- **Pillar 1** (in the convention, section 5): pre-release ids; explicit 0.x semantics and the 1.0.0 trigger; monorepo `release_mode` in `catalog/repos.json`; contract-surface definition; independent contract versions; a new `5.6 Release operations` grouping.
- **Pillar 2**: [`version-history-audit.md`](../../governance/version-history-audit.md) — inventory, reconcile, baseline; re-index history by addition (a `VERSION-HISTORY.md` rosetta), never by rewriting.
- **Pillar 3**: [`release-roadmap-and-outcomes.md`](../../governance/release-roadmap-and-outcomes.md) — the outcome-to-version bridge, the required `Outcome:`/`Maintenance:` CHANGELOG field, presence-floor plus cross-doc enforcement.

Spec and plan: `docs/internal/specs/2026-06-09-release-versioning-framework-design.md` and `docs/internal/plans/2026-06-09-release-versioning-framework.md`.

## Decisions of record

- **Approach A (annotate, do not drive).** SemVer stays mechanical; outcomes are a parallel track that maps to versions. The only sanctioned outcome-to-version coupling is the 0.x to 1.0.0 graduation. (Rejected: redefining bump semantics around outcomes, which breaks SemVer's compatibility meaning.)
- **Grill-hardened before build.** Seven fixes, including the section 3.4/3.5 contract-version contradiction and the "presence check is only a label" enforcement gap (now a cross-doc check).
- **Kohyr was rejected as a pilot target.** See follow-up 6. Do not undo this.

## Open follow-ups (prioritized)

1. **Merge the three PRs** when ready (maintainer decision).
2. **alawein#133 `Audit Documentation` is a central-CI bug, not content.** `validate-doc-contract.sh` receives `DOC_CONTRACT_BASE_REF` as all-zeros in some runs, so it cannot compare `last_updated` against the base and falsely flags changed files. It passes when the base ref resolves. Fix belongs in the centrally-managed `docs-doctrine.yml` base-ref resolution (do not patch per repo). The PR content is valid and admin-mergeable.
3. **gymboy#28 reds are pre-existing gymboy CI debt, not the pilot.** `doctrine` fails on `docs/architecture/STRUCTURE_DECISION.md` (aged past the 90-day `last_updated` limit). `ci/build` hangs (the full Vitest suite hangs; reproduced locally). Both predate this work and are why gymboy sits on a `fix/ci-green` branch. The pilot's own files are fresh and pass. These are gymboy maintenance, separate from the framework.
4. **repz was deferred, not piloted.** It is a strong candidate (package.json `0.1.0` vs CHANGELOG `1.4.0` released, 0 tags) but its local `main` has **diverged 143/143** from `origin/main`. Reconcile that git state first, then run the recipe below.
5. **Generalize to the remaining product repos** using the recipe below. Cleanest next targets are the simple single-package products. Note `bolts` and `attributa` carry their own `docs/adr/` (read their contracts first); `design-system` already versions via changesets (independent mode) and does not need this.
6. **Kohyr is out of scope for this framework. Do not pilot it here.** Kohyr (`kohyr-app/kohyr`; local checkout `kohyr/kohyr-internal-wip`) is SANDBOX tier (ADR-038: zero required CI checks; do not add gates or governance scripts), uses a CalVer-umbrella plus semver-sub-tag model with its own `check_changelog.py` gate, and governs versioning through its own ADRs. Imposing this framework would violate Kohyr's contract. If Kohyr ever harmonizes, it happens through Kohyr's own ADR process in a session opened inside that repo, not from here. Kohyr does carry one real coherence anomaly for its own team to resolve: `src/kohyr/__init__.py` says `1.0.0` while `pyproject.toml` says `0.1.0a0` and the only tag is `v0.1.0-alpha.0`.

## The per-repo pilot recipe (reusable)

For a product repo that follows Keep a Changelog plus SemVer and has no competing versioning governance:

1. Read its `CLAUDE.md` first to confirm no governance conflict (the Kohyr lesson).
2. Audit (read-only): `package.json` version, the CHANGELOG's documented releases, and `git tag`. The common defect is package.json behind an untagged CHANGELOG release.
3. Find each documented release's commit (`git log -S "## [X.Y.Z]" -- CHANGELOG.md`).
4. Branch from `origin/main`. Set `package.json` to the latest documented release. Add a `Maintenance:` (or `Outcome:`) line to the CHANGELOG `Unreleased` section.
5. Add `docs/VERSION-HISTORY.md` (rosetta mapping each release to its commit) and `docs/release-roadmap.md`.
6. Copy the two Node checks from gymboy or scribd (`scripts/check-version-coherence.mjs`, `scripts/check-changelog-outcome.mjs`) plus their `tests/scripts/*.test.ts`. If the repo's eslint lacks `globals.node`, the scripts already `import process from "node:process"` to stay clean.
7. Tag `vX.Y.Z` additively at the release commit (local; push only with the branch).
8. Verify: run both checks (expect exit 0), `npx vitest run tests/scripts/`, and eslint on the new files. Commit in three logical commits, push, open the PR. Do not wire `.github/workflows/` without explicit approval (it is a forbidden-auto-edit path and a CI/CD change in each product repo's org policy).

## Notes

- All commits authored `contact@meshal.ai`, no AI attribution (per the convention and each repo's contract).
- gymboy has 8 pre-existing Dependabot vulnerabilities (1 critical) on its default branch, surfaced during push. Unrelated to this work; worth a separate pass.
