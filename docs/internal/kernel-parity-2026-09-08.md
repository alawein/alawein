---
type: internal
status: active
last_updated: 2026-09-08
owner: meshal
---

# Kernel parity report — 2026-09-08

Phase 3, step 12 of
[`docs/internal/plans/2026-09-08-kernel-canonicalization.md`](plans/2026-09-08-kernel-canonicalization.md).
Compares `workspace-batch drift check` against `repo-drift check` across
every reachable, non-archived repo in `catalog/repos.json`, using the six
detectors both tools currently implement
(`branch_name`, `claimed_dep`, `feature_claim`, `missing_file`,
`stale_config`, `visibility`). The five kernel-canonicalization detectors
added in Phase 2 (`kernel_conformance`, `workflow_pin`, `agent_contract`,
`metadata_schema`, `worktree_registry`) are net-new to `repo-drift` and have
no `workspace-batch` equivalent, so they are out of scope for a parity
comparison by definition.

## Scope

- `catalog/repos.json` holds 47 entries. 1 is `archived: true` (`helios`,
  renderer-exempt, excluded). 3 have no on-disk checkout at their
  `local_path` (`chshlab-paper`, `dotclaude`, `kcompiler` — see
  `docs/governance/kernel-spec.md` open items) and were skipped.
- **43 repos scanned**, both tools, default config (no `.drift-rules.yaml`
  override; each tool's built-in defaults applied).
- Both tools invoked as `<tool> check --target <path> --reporter json` (or
  `drift check` for `workspace-batch`), read-only, no repository mutated.
- `core/android-coding-phone` is flagged "occupied" in the plan's Occupancy
  section for write operations; scanning it read-only is safe and was
  included.

## Result

**42 of 43 repos: identical finding sets, identical exit codes.**

One gap, in `gymboy`:

| Field | repo-drift | workspace-batch |
|---|---|---|
| `claimed_dep` finding on `CLAUDE.md:22` | present (severity `error`) | absent |
| exit code | 1 | 0 |

### Root cause

`gymboy/CLAUDE.md:22` reads:

> Runtime AI helpers live under `api/` as Vercel Node handlers that proxy to OpenAI.

Both detectors implement the same word-boundary regex strategy around a
tracked package name, but the negative lookahead after the match differs:

- `repo-drift` (`src/repo_drift/detectors/claimed_dep.py`):
  `(?![A-Za-z0-9_/\-]|\.[A-Za-z0-9_-])` — a trailing `.` only blocks a match
  when followed by another identifier character (so `openai.chat` or
  `openai.com` don't match, but a sentence-ending "...OpenAI." does).
- `workspace-batch` (`workspace_batch/drift/detectors/claimed_dep.py`):
  `(?![A-Za-z0-9._\-])` — `.` alone blocks a match regardless of what
  follows, so a sentence-ending "...OpenAI." is silently skipped.

`repo-drift`'s version is the more precise one: it still finds a genuine,
previously-undetected claim (`gymboy` documents an OpenAI proxy with no
`openai` entry in `package.json`, plausible if the Vercel handler calls the
REST API via `fetch` without the SDK — worth a human decision, not
necessarily a bug). `workspace-batch`'s version under-matches trailing
punctuation and would miss this class of claim entirely.

### Exit condition (step 13)

Step 13's bar is **zero regressions**: `repo-drift` must not miss anything
`workspace-batch` catches. Across all 43 repos, `only_in_workspace_batch` is
empty everywhere — there is no case where `workspace-batch` found a finding
`repo-drift` did not. The one gap is `repo-drift` finding *more* than
`workspace-batch`, which is additional coverage, not a regression. **Exit
condition met.** No fix to `repo-drift` was required or made; weakening its
regex to match `workspace-batch`'s narrower one would trade a real
capability for artificial parity, which is not the goal.

`gymboy` itself is left untouched — the `claimed_dep` finding on
`CLAUDE.md:22` is a signal for `gymboy`'s own wave (Phase 6) to resolve via
`.drift-rules.yaml` config (a disclaimer near the claim, or removing the
mention) once that repo adopts kernel-managed drift checks, not something
this parity pass fixes unilaterally.

## Step 14: side-by-side warn-only job

A reference `drift.yml` job pairing (`workspace-batch` blocking,
`repo-drift` warn-only) is drafted at
`templates/kernel/_common/drift.yml.tmpl` for when workflow rendering turns
on. It is not wired into the live renderer yet: `catalog/kernel.yaml`'s
`workflow_pin_sha` is still unset (see kernel-spec.md open items), and
rendering a `.github/workflows/drift.yml` with no canonical pin would ship
an unpinned reusable-workflow reference fleet-wide. The template exists so
step 14 is not blocked once that pin decision lands; it is not yet part of
`_MANAGED_SPECS` in `scripts/kernel/render.py`.

## Step 15: gate swap

Not started. Flipping `repo-drift` to blocking and dropping the
`workspace-batch` drift step requires the new check to have reported green
on `main` at least once per repo, which requires live CI runs after Phase 6
fanout lands. Sequencing dependency, not an open question (per the plan's
"Remaining dependency" section).
