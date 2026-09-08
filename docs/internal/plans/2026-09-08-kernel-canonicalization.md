---
type: internal
source: writing-plans session 2026-09-08
sla: on-change
last_updated: 2026-09-08
audience: [ai-agents, contributors]
---

# Plan: alawein kernelization and canonicalization

Scope: 46 git repos under `C:\Users\mesha\Desktop\GitHub\alawein` (apps 6, core 11, lab 21, sites 2, work 3, loose 1, _archive 2).

Implementation lands in `core/alawein` (kernel), `core/repo-drift` (engine), `core/workspace-tools` (runner).

Status: implementation-ready. All prior open items resolved 2026-09-08 (see "Resolved").

## Where to run this

Do not implement from `apps/bolts`. That workspace's tool access is scoped to
`apps/bolts`, and none of the three target repos are reachable from it.

Open the implementation session at the container root:

```
C:\Users\mesha\Desktop\GitHub\alawein
```

Rationale and constraints:

- The container root is not itself a git repo (no `.git`), so no root-level
  commit is possible. Every commit necessarily lands inside one of the 46
  nested repos.
- One session reaches `core/alawein`, `core/repo-drift`,
  `core/workspace-tools`, and all 46 checkouts. Phase 3 parity (step 12) and
  the Phase 1 report (step 8) read every checkout, so per-repo sessions cannot
  complete them.
- Commit discipline: use the tool's per-repo working directory (or `-C <repo
  path>`). Stage explicit paths only. One branch per repo, one writer per repo.
  No `git add -A`.
- Tool note: the local permission allowlist matches shell git commands by
  literal prefix (`git status *`, `git log *`, ...). `git -C <path> status` does
  not match those patterns. For read-only git, set the tool's working directory
  per repo instead of using `-C`.

### Occupancy, verified 2026-09-08 (re-verified 2026-09-08 at implementation start)

- `~/worktrees` holds 17 managed worktrees: `alawein`, `atelier-rounaq`,
  `attributa`, `bolts`, `design-system`, `gymboy`, `incore`, `maglogic`,
  `meatheadphysicist`, `optiqap`, `prompty`, `qubeml`, `repz`,
  `roka-oakland-hustle`, `simcore`, `veyra`, `workspace-tools`.
- `core/alawein` main checkout: branch `docs/refresh-r10-freshness-alawein`,
  in sync with origin, 2 untracked files
  (`docs/internal/handoffs/2026-09-08-maios-system-map-gpt-6-astra.md`,
  `docs/internal/plans/2026-09-08-maios-system-map-generator.md`). Do not
  delete or commit those two files as part of this work. `core/alawein` also
  carries 2 Codex worktrees. Treat as occupied for self-sync; Wave 1 defers it.
  Re-verified at implementation start: same branch, same 2 untracked files, no
  drift.
- `core/workspace-tools` main checkout: branch `chore/readme-category-field`,
  clean, behind origin by 10. Phase 5 proceeds here on a fresh branch cut from
  `origin/main`, not from the stale branch. Leave
  `~/worktrees/workspace-tools` alone. Re-verified at implementation start:
  same branch, still behind origin by 10.
- `core/android-coding-phone`: active evidence output. Treat as occupied.
- Before touching any repo, check `git worktree list` in it (or
  `workspace-batch worktree doctor` once step 23 exists) and skip occupied
  repos per step 28.

### Step 0 (do this first, before Phase 0)

Move this plan into the kernel, matching the existing plans-directory
convention (`docs/internal/plans/YYYY-MM-DD-<slug>.md`; that directory already
exists and is date-prefixed).

1. Copy this file to
   `core/alawein/docs/internal/plans/2026-09-08-kernel-canonicalization.md`.
2. Delete both scratch copies:
   - `apps/bolts/.kilo/plans/1788864600000-alawein-kernel-canonicalization.md`
     (stale; superseded by this file)
   - `C:\Users\mesha\.local\share\kilo\plans\1788866459398-alawein-kernel-canonicalization.md`
3. Commit in `core/alawein` only, on a new branch cut from `origin/main` named
   `feat/kernel-spec` (not on `main`, and not on the current
   `docs/refresh-r10-freshness-alawein` branch). Stage only the new plan file.
   Subject: `docs: add kernel canonicalization plan`.

From that point the kernel copy is the working record; update it as phases land.

## Decisions taken (confirmed with user 2026-09-08)

1. Kernel home: `core/alawein`. Single conformance engine: `repo-drift`. `workspace-batch` (= `core/workspace-tools`) keeps only the batch/fanout runner role; its drift path retires after parity is proven.
2. Distribution: one renderer in the hub plus fanout PRs, verified by a new `kernel_conformance` detector. Same renderer invoked locally by `workspace-batch` for bulk worktree runs.
3. Merge policy: a `kernel-sync` PR class may use GitHub auto-merge when the diff stays inside a CI-enforced path allowlist, contains no source/logic changes, and all required checks pass. Every other PR keeps the strict per-PR `exact yes merge #N` gate. Kill switch plus audit trail required.
4. Fanout substrate: two registered worktree roots only (`~/worktrees` for Kilo Agent Manager, `~/.codex/worktrees` for Codex). Worktrees anywhere else are violations. `workspace-batch worktree` owns create/list/gc with a registry, naming, concurrency caps, and TTL/merged GC.
5. Research: evidence-gated lane (`catalog/research.yaml`, `docs/research/`) seeded from verifiable exemplars. No forward-dated citations. Kernel changes require an ADR.

## Resolved (2026-09-08)

- `lab/qmatsim` CRLF renormalization: **approved** for Wave 3. Fresh branch cut
  from `origin/main`, single `git add --renormalize .` commit, PR for review.
  No force-push, no history rewrite. See step 28a.
- Phase 5 runner work: proceeds now on a fresh branch off `origin/main` in the
  `core/workspace-tools` main checkout. No need to wait for
  `~/worktrees/workspace-tools` to close.
- Phase 0 commit shape: one branch `feat/kernel-spec`, one PR per phase.

## Current-state facts the implementer must rely on

- Hub already provides: 21 reusable workflows, `catalog/` (`repos.json`, `index.yaml`, `taxonomy.json`, `buckets.yaml`, `lanes.yaml`, `skills.yaml`, `agent-integrations.yaml`, `governance-decisions.yaml`, plus `workflows.json`, `templates.json`, `automations.json`, `assets.json`, `components.json`, `local_path_exemptions.json`), `schemas/repo.schema.json` + 6 more, `templates/scaffolding/` (static fragments, no renderer), `github-baseline.yaml`, `projects.json` + schema, `docs/NEW_REPO.md`, ~60 governance docs.
- Reusable workflow pins are drifted across at least 6 SHAs: `ed5ed61`, `6cddc4b`, `9779fa3`, `1256254`, `430c345`, `67c8b3e`.
- Adoption gaps: `service-metadata.yaml` 33/46, `AGENTS.md` 42/46 (missing: `apps/auditraise`, `core/incore`, `core/repo-drift`, `chshlab-paper`), `.drift-rules.yaml` 3/46, committed `.kilo/` 0/46.
- `bolts` required check on `main` is `drift`, which runs `workspace-batch==0.1.2`. Do not remove it before parity.
- Hooks are unmanaged and were broken by absolute paths into a deleted Codex scratch directory. `apps/bolts` and `core/alawein` now degrade gracefully; `lab/qubeml` carries a different 2.8 KB hook; most repos have none.
- `lab/qmatsim` has 7 files whose HEAD blobs are CRLF while `.gitattributes` declares `eol=lf`, producing permanent whole-file churn.

## Structural schema (profile-gated)

Profiles derived from `service-metadata.yaml` `type` + `runtime`, recorded in `catalog/repos.json`:
`web-app-next`, `node-lib`, `python-lib`, `python-research`, `docs-hub`, `paper`, `archive` (frozen, renderer-exempt).

Canonical tree, each entry marked kernel-managed or repo-local:

```
README.md                      managed header, local body
AGENTS.md                      managed sections + local sections
SECURITY.md LICENSE            managed (public repos)
CHANGELOG.md                   managed skeleton (tier-1, tier-2)
service-metadata.yaml          managed, validated by schemas/repo.schema.json
.drift-rules.yaml              managed block + local overrides
.editorconfig .gitattributes .gitignore   managed
.kernel/hooks/{pre-commit,commit-msg,pre-push}   managed, core.hooksPath target
.kernel-manifest.json          managed, lists managed paths + sha256 + kernel version
.github/workflows/{ci,codeql,docs-doctrine,drift}.yml   managed, single pinned kernel SHA
.github/{CODEOWNERS,dependabot.yml,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE/}   managed
.kilo/{kilo.json,agent/,command/,skills/}   managed subset + local additions
docs/{README.md,architecture/,adr/,operations/,internal/}   managed skeleton
src/ or <package>/, tests/, e2e/, tools/, scripts/   profile-specific, local content
```

Managed files carry a `kernel:managed v<version>` marker. `.kernel-manifest.json` is the verification surface so `repo-drift` stays dependency-free and never re-renders.

## Execution steps

### Phase 0: prerequisites (hub only, no fanout)

1. In `core/alawein`, add `docs/adr/` entries for decisions 1-5 above. One ADR per decision, each naming the rejected alternatives.
2. Write `docs/governance/kernel-spec.md` as the single canonical structural spec. Mark the overlapping predecessors (`repo-framework.md`, `repository-layout-standard.md`, `repo-topology-canon.md`, `repo-standardization.md`, `workspace-standardization.md`) as superseded with pointers. Do not delete them.
3. Extend `schemas/repo.schema.json` with `profile`, `tier`, `kernel_version`, `archived`. Backfill `profile` for all 46 repos in `catalog/repos.json`.
4. Add `catalog/kernel.yaml`: current kernel version, the single reusable-workflow pin SHA, path allowlist for the `kernel-sync` class, and the auto-merge kill switch flag.

### Phase 1: renderer

5. Build `scripts/kernel/` in the hub: `render.py` (profile + catalog to file set), `manifest.py` (sha256 manifest), `diff.py` (dry-run report), CLI `python -m kernel render --repo <name> --out <path> [--check]`.
6. Port `templates/scaffolding/` fragments into profile-aware templates under `templates/kernel/<profile>/`. Keep local-body markers so rendering never clobbers human prose.
7. Unit tests in `tests/kernel/`: idempotent render, marker preservation, manifest stability, archive profile exemption.
8. Add `scripts/kernel/report.py` producing `catalog/generated/kernel-conformance.json` for all 46 repos from local checkouts.

### Phase 2: engine

9. In `core/repo-drift`, add detectors: `kernel_conformance` (manifest hash + kernel version), `workflow_pin` (all reusable `uses:` match `catalog/kernel.yaml` pin), `agent_contract` (`AGENTS.md` required sections present), `metadata_schema` (`service-metadata.yaml` validates), `worktree_registry` (local-only, warns on unregistered worktrees).
10. Keep every new detector opt-in via `.drift-rules.yaml` so adoption is per wave.
11. Cut a `repo-drift` release and record its immutable SHA in `catalog/kernel.yaml`.

### Phase 3: parity and gate swap

12. Run `workspace-batch drift check` and `repo-drift check` across all 46 checkouts. Write the finding-by-finding diff to `docs/internal/kernel-parity-<run-date>.md`.
13. Close every parity gap in `repo-drift`. Zero regressions is the exit condition.
14. Add the `drift` job's `repo-drift` replacement to the kernel `drift.yml` template, running both engines side by side, `repo-drift` warn-only.
15. After one clean wave, flip `repo-drift` to blocking and drop the `workspace-batch` drift step from the template. Update branch protection contexts only after the new check has reported green on `main` at least once per repo.

### Phase 4: hooks

16. Generate `.kernel/hooks/*` from kernel templates. Root cause fix: hooks must reference only repo-relative paths, never absolute scratch paths.
17. `pre-commit`: secret-scan guard that exits 0 with a warning when the scanner is absent (mirror the `core/alawein` graceful pattern). `commit-msg`: conventional-commit subject, no emoji, no em-dash, no AI-authorship trailer. `pre-push`: fast `repo-drift check` on changed paths.
18. Add `workspace-batch hooks install` to set `core.hooksPath=.kernel/hooks`. Versioned hooks then apply to every linked worktree automatically.
19. Remove the stale absolute-path `pre-commit` from any repo that still has one, as part of that repo's wave.

### Phase 5: fanout runner

Branch: fresh from `origin/main` in the `core/workspace-tools` main checkout.
Do not build on `chore/readme-category-field`. Do not touch
`~/worktrees/workspace-tools`.

20. Add `workspace-batch worktree {create,list,gc,doctor}`. Registry at `~/worktrees/.registry.json`, single writer with a file lock, one entry per worktree recording repo, branch, root, tool, lane, created-at, last-touched.
21. Enforce naming `<root>/<repo>/<slug>`, per-repo cap default 3, global cap default `min(8, cores/2)`, one writer per repo+branch.
22. `gc` removes worktrees whose branch is merged or gone, or idle beyond a 72 hour TTL. Never touch a worktree with an active session marker or uncommitted changes without `--force`.
23. `doctor` reports unregistered worktrees, stale Agent Manager metadata, and worktrees outside the two registered roots. Use `git worktree remove`, never manual directory deletion, so `kilo-agent-manager-metadata.json` stays consistent. The first run must reconcile the 17 existing `~/worktrees` entries into the registry rather than flagging them all for removal.
24. Serialize all catalog writes through one integrator job. Concurrent kernel-sync jobs must not both write `catalog/repos.json` or `catalog/index.yaml`.

### Phase 6: kernel-sync fanout

25. Add `.github/workflows/kernel-sync.yml` to the hub: matrix over repos from `catalog/repos.json`, renders per repo, opens or updates one PR per repo on branch `chore/kernel-sync-v<version>`, applies label `kernel-sync`.
26. Add `kernel-sync-guard.yml` to the kernel template: fails any `kernel-sync`-labelled PR whose diff touches a path outside the allowlist in `catalog/kernel.yaml`, or that changes `src/`, `tests/`, or dependency manifests.
27. Enable auto-merge only for PRs that carry the label, pass the guard, and pass all required checks. Honour the kill switch flag. Append every auto-merge to `catalog/generated/kernel-sync-audit.json`.
28. Wave order, skipping any repo the worktree registry reports as occupied:
    - Wave 0 pilots: `apps/bolts`, `core/repo-drift`, `lab/qubeml`. Dry-run diff reviewed by a human before the first PR.
    - Wave 1: remaining `core/` (defer `core/alawein` self-sync and `core/android-coding-phone` until their sessions end).
    - Wave 2: `apps/` and `sites/`.
    - Wave 3: `lab/` in lanes of 5.
    - Wave 4: `work/` and `chshlab-paper`. Mark `_archive/*` `archived: true`, renderer-exempt, checks warn-only.
28a. `lab/qmatsim` CRLF renormalization (approved 2026-09-08). During Wave 3, on
    a fresh branch cut from `origin/main` in `lab/qmatsim`: run
    `git add --renormalize .`, verify the diff touches only the 7 CRLF-blob
    files and is EOL-only, commit as one commit
    (`chore: renormalize line endings to match .gitattributes`), open a PR for
    review. Land this before the qmatsim kernel-sync PR so the two diffs do not
    interleave. No force-push, no history rewrite.
29. Backfill the four missing `AGENTS.md` and the 13 missing `service-metadata.yaml` files as part of each repo's wave, not as a separate sweep.
30. Collapse all reusable-workflow pins onto the single `catalog/kernel.yaml` SHA. One bump PR per wave, never per repo.

### Phase 7: skills, agents, MAIOS alignment

31. Treat `catalog/skills.yaml` and `catalog/agent-integrations.yaml` as the system of record. Render repo-local `.kilo/kilo.json`, `.kilo/agent/`, `.kilo/command/`, and skill pointers from them.
32. Global skills stay in `~/.kilocode/skills` and `~/.agents/skills`. Repo-local `.kilo/` may add repo-specific entries and must not fork global policy.
33. Emit a drift report comparing `catalog/skills.yaml` against `Desktop\ops-shared-inventory\agents.yaml`, `workflows.yaml`, and `routines.yaml`. Report only. Do not write to Grok Bot profiles; that writer boundary stands.
34. Add a `.kilo/` presence and shape check to `repo-drift` once wave 2 completes.

### Phase 8: research lane

35. Create `catalog/research.yaml` and `docs/research/README.md` with the scoring rubric: adoption signal, maintenance signal, security posture, fit to this kernel, migration cost.
36. Seed 20 to 50 entries from verifiable sources only. Starting set: Backstage software templates, Nx and Turborepo generators, copier, cookiecutter, OpenSSF Scorecard, SLSA, Sigstore, Renovate, Bazel, Terraform module registry conventions.
37. Each entry records source URL, date observed, and kernel impact. Anything unpublished stays out.
38. Promotion path: research entry to ADR to kernel spec change to renderer change to wave. No shortcut from entry to renderer.

## Validation

- Renderer: `python -m kernel render --check` is idempotent and byte-stable across two runs for all 46 repos.
- Engine: `repo-drift` unit tests plus the parity report with zero regressions against `workspace-batch drift`.
- Per wave: every repo in the wave reports `kernel_conformance` pass; `workflow_pin` reports a single SHA org-wide; no repo left with an absolute-path hook.
- Fanout: `workspace-batch worktree doctor` reports zero unregistered worktrees and zero worktrees outside the two registered roots.
- qmatsim: after 28a, a fresh checkout shows no whole-file EOL churn against `origin/main`.
- End state: `catalog/generated/kernel-conformance.json` shows 44/44 active repos conformant, with `_archive/*` explicitly exempt.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Renderer clobbers human prose | Managed-block markers, manifest verification, mandatory dry-run diff per wave |
| Auto-merge misfires on a real change | Path allowlist guard, no-source-change rule, required checks, kill switch, audit file |
| Gate swap breaks `main` | Run both engines side by side, `repo-drift` warn-only until one clean wave, update branch protection last |
| Collision with live agent sessions | Registry occupancy check before each wave; skip occupied repos; never hand-delete worktrees |
| First `doctor` run mass-flags the 17 existing worktrees | Reconcile existing entries into the registry before any `gc` |
| Catalog write contention | Single integrator job owns catalog writes |
| qmatsim renormalization mixes with kernel diff | Land 28a as its own PR before the qmatsim kernel-sync PR |
| Pin bump storms | One pin variable in `catalog/kernel.yaml`, one bump PR per wave |

## Non-goals

No force-push, no history rewrite, no monorepo consolidation, no deletion of `_archive/*`, no changes to Grok Bot profiles, no edits to another agent's live worktree, no commits to `main` in any repo.

## Remaining dependency

Retiring the `workspace-batch` drift path (step 15) requires the Phase 3 parity
evidence to land first. This is sequencing, not an open question.

## Status, 2026-09-08 (implementation session)

Phases 0-5 are implemented, tested, and committed locally (not pushed, no
PRs opened, nothing merged):

- Phase 0-1 (`core/alawein`, branch `feat/kernel-spec`): kernel-spec.md,
  ADRs 0003-0007, extended schema + backfilled `profile` on all 47 catalog
  entries, `catalog/kernel.yaml`, the renderer (`scripts/kernel/`) with 12
  passing unit tests.
- Phase 2 (`core/repo-drift`, branch `feat/kernel-detectors`): 5 new
  opt-in detectors, 31 passing tests, lint clean.
- Phase 3: parity report at `docs/internal/kernel-parity-2026-09-08.md` --
  42/43 reachable repos identical between `repo-drift` and `workspace-batch
  drift`; the 1 gap is `repo-drift` finding *more* (zero regressions).
- Phase 4 (`core/alawein`): `.kernel/hooks/{pre-commit,commit-msg,pre-push}`
  templates, root-cause-fixed (no absolute paths), tested against a real
  Git-for-Windows shell.
- Phase 5 (`core/workspace-tools`, branch `feat/kernel-worktree-runner`):
  `workspace-batch worktree {create,list,gc,doctor}` and
  `workspace-batch hooks install`, 14 new passing tests, full existing suite
  (260 tests) still green.

Phase 5's `doctor` run against this machine's real `~/worktrees` and
`~/.codex/worktrees` (read-only; no `--reconcile`) surfaced two corrections
to this plan's assumptions, now reflected in the code:

- Codex worktrees are flat (`<root>/<slug>`), not nested
  (`<root>/<repo>/<slug>`) like Kilo's -- confirmed via `git worktree list`
  against `core/alawein`, which showed two Codex worktrees directly under
  `~/.codex/worktrees/<slug>`, zero under `~/worktrees/alawein`.
- Several of the "17 managed worktrees" from the 2026-09-08 occupancy
  snapshot are not git worktrees at all: `~/worktrees/alawein/*` holds 5
  directories with `app/`/`node_modules/` content and no `.git`; `git
  worktree list` in `core/alawein`, `apps/bolts`, and
  `core/workspace-tools` shows zero linked worktrees for any of them. The
  worktree registry now distinguishes `unregistered` (real worktrees) from
  `non_worktree_directories` (everything else) instead of reconciling both
  the same way.

Phase 6 (`.github/workflows/kernel-sync.yml`,
`kernel-sync-guard.yml`) exist only as draft reference templates
(`templates/kernel/_common/kernel-sync.yml.tmpl`,
`kernel-sync-guard.yml.tmpl` in `core/alawein`), not wired into the
renderer and not deployed anywhere. This is a deliberate stop, not an
oversight: turning Phase 6 on means pushing branches and opening PRs across
up to 46 repos, which needs (a) the `workflow_pin_sha` decision this plan
already flags as unresolved, and (b) the human review of Wave 0's dry-run
diff that step 28 itself requires before the first PR. Neither happened in
this session.

Phase 7 (skills/agent alignment) and Phase 8 (research lane) are not
started. Phase 7's step 33 (drift report against
`Desktop\ops-shared-inventory\{agents,workflows,routines}.yaml`) needs a
real schema comparison between that taxonomy and `catalog/skills.yaml`'s
domain/role structure -- they are not directly comparable by name, and a
shallow diff would misreport. Phase 8 needs externally verifiable citations
per entry (step 37); doing that without live verification would violate
its own no-forward-dated-citations rule.

## Execution plan for Phase 6-8 (finalized 2026-09-08, for the next session)

This section is the actionable runbook the next implementation session
follows. It does not relax any standing gate: mandatory human checkpoints
below are not authorization for an agent to self-approve through them, no
matter how the session is framed ("end to end", "no omissions"). A session
that reaches one of these checkpoints stops and asks, using the `question`
tool, rather than guessing or proceeding.

### Mandatory checkpoints (cannot be automated away)

1. **`workflow_pin_sha` decision.** Before any Phase 6 workflow is rendered
   live: decide whether the fleet-wide reusable-workflow pin targets a
   tagged hub release or a specific `main` commit SHA, then set
   `catalog/kernel.yaml`'s `workflow_pin_sha`. Wrong answer breaks CI
   fleet-wide. Ask; do not guess.
2. **Wave 0 dry-run review.** Per step 28, a human reviews the dry-run diff
   for `apps/bolts`, `core/repo-drift`, `lab/qubeml` *before* the first
   real kernel-sync PR opens on any of them.
3. **Per-PR merge gate.** Every PR this plan produces, including every
   kernel-sync PR, needs the maintainer's explicit `exact yes merge #N`
   before merge -- *unless* `catalog/kernel.yaml.auto_merge_enabled` is
   explicitly flipped to `true` by the maintainer for the narrow
   `kernel-sync`-labelled, guard-passed, no-source-change class (ADR 0005).
   Default is `false`; leave it there unless told otherwise.
4. **Occupancy re-check before every wave.** Re-run `git worktree list` (or
   `workspace-batch worktree doctor`) per repo immediately before that
   repo's wave, not from a stale earlier snapshot -- state changes between
   sessions.

### Step-by-step order

1. Re-verify occupancy and branch state for all three implementation repos
   (`core/alawein`, `core/repo-drift`, `core/workspace-tools`) and confirm
   the three local branches from the prior session
   (`feat/kernel-spec`, `feat/kernel-detectors`,
   `feat/kernel-worktree-runner`) still exist with their commits intact.
2. Resolve checkpoint 1 (`workflow_pin_sha`). Record the decision as an ADR
   addendum or a new ADR if the rationale is non-trivial.
3. Wire `scripts/kernel/render.py`'s `_MANAGED_SPECS` to include the
   `.github/workflows/{ci,codeql,docs-doctrine,drift}.yml` set now that a
   pin exists. Promote `templates/kernel/_common/drift.yml.tmpl`,
   `kernel-sync.yml.tmpl`, and `kernel-sync-guard.yml.tmpl` out of draft:
   fill in the real fetch/apply mechanism for the pinned SHA, add unit
   tests for the newly-templated workflow files (idempotency, marker
   preservation, manifest stability -- same bar as the existing managed
   files).
4. Cut a `repo-drift` release (Phase 2 step 11) and record its immutable
   SHA in `catalog/kernel.yaml.repo_drift_release_sha`. This requires
   pushing `core/repo-drift`'s `feat/kernel-detectors` branch and opening
   that PR -- ordinary PR flow, ordinary merge gate, not a fanout PR.
5. Add the kernel-sync fanout workflow for real (`.github/workflows/
   kernel-sync.yml` in the hub, matrix over `catalog/repos.json`) and
   `kernel-sync-guard.yml` in the kernel template set. Push and PR these to
   `core/alawein` on `main`'s normal review path, not auto-merge.
6. Checkpoint 2: dry-run Wave 0 (`apps/bolts`, `core/repo-drift`,
   `lab/qubeml`), present the diff, wait for explicit approval before
   opening the first kernel-sync PR.
7. Execute waves 1-4 in the plan's step 28 order, skipping any repo
   occupancy flags as occupied (checkpoint 4). Land 28a
   (`lab/qmatsim` CRLF renormalization) before that repo's kernel-sync PR,
   per the existing approval already on record for that specific action.
   Every PR still needs checkpoint 3 unless auto-merge is explicitly
   enabled for the guard-passed subset.
8. After Wave 1 reports green on `main` for every repo in it, flip
   `repo-drift` to blocking and drop the `workspace-batch` drift step
   (Phase 3 step 15). This is a template change, PR'd and merged like any
   other -- not a silent flag flip.
9. Phase 7: build the actual comparison. `catalog/skills.yaml` is
   domain/role-keyed; `Desktop\ops-shared-inventory\{agents,workflows,
   routines}.yaml` is Grok Bot's own taxonomy. Do not diff by name across
   the two directly. Instead: extract a flat skill/capability identifier
   list from each side first (a short mapping table, reviewed once, not
   regenerated per run), then diff the flattened lists. Emit the report to
   `catalog/generated/skills-drift.json`. Report only -- no write to any
   Grok Bot profile path, per the standing writer boundary. Render
   `.kilo/kilo.json`, `.kilo/agent/`, `.kilo/command/` from
   `catalog/skills.yaml` + `catalog/agent-integrations.yaml` (step 31) only
   after the comparison exists, so the renderer isn't generating from a
   catalog nobody has checked against reality.
10. Phase 8: create `catalog/research.yaml` and
    `docs/research/README.md` with the scoring rubric. Seed entries using
    live `websearch`/`webfetch` at seeding time -- every entry's source URL
    and "date observed" must reflect a real fetch performed during that
    session, not a remembered or assumed URL. Entries that cannot be
    verified live stay out, per step 37's own rule. Target 20-50 entries
    from the starting set named in step 36, expand only from what live
    search actually turns up.

### What "no omissions" means here, in practice

Every numbered step in Phases 6-8 gets attempted. It does not mean the
mandatory checkpoints above are skipped, that PRs get merged without the
maintainer's explicit confirmation, or that auto-merge gets enabled by
default. Those are standing repository and workspace policy
(`docs/governance/merge-policy.md`, this workspace's `AGENTS.md`), not
plan-specific caution this document can waive.
