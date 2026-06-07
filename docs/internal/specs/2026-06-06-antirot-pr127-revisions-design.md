---
type: canonical
source: brainstorming session 2026-06-06 (PR 127 review refinement)
sla: on-change
last_updated: 2026-06-06
audience: [ai-agents, contributors]
---

# PR 127 anti-rot revisions: design spec

Refinement plan for PR alawein/alawein#127 (anti-rot primitives) driven by a
five-agent review (code, tests, silent-failures, comments, types). Full scope:
all blocking + should-fix + the consensus nit + two cheap code nits + a simplifier
pass + a re-review. Implemented round by round on `feat/anti-rot-primitives`; each
round commits and is verified before the next.

## Verification gate (run after each round)

```bash
py -3.12 -m pytest scripts/doctrine/tests/test_validate_repo_framework.py -q
py -3.12 scripts/doctrine/validate-doctrine.py .   # expect only untracked HANDOFF.md
bash -n scripts/ops/rollout-antirot.sh scripts/ops/bootstrap-repo.sh
```

## Round 1: correctness (3 blocking)

1. `scripts/ops/rollout-antirot.sh`: replace each `sed > file` with temp-file +
   atomic `mv` (so a `sed` failure never leaves a zero-byte file the idempotent
   skip then treats as done); validate `ORG_DIR` resolved to a real dir and the
   template exists, with explicit `error:` messages; give `mkdir -p` a context-ful
   failure message.
2. `scripts/ops/bootstrap-repo.sh` (product case): remove the `2>/dev/null` that
   silently masks template failures; pre-check the template path and emit a
   `warning:` before falling back; give the inline ADR fallback real doctrine
   frontmatter so a fallback-scaffolded repo is still R1-compliant.
3. `docs/governance/anti-rot.md` and `docs/governance/repo-framework.md`: replace
   the fictional "docs-only repos are exempt" wording with the accurate mechanism:
   exemption is by bucket; `archive`, `personal`, `family`, `jobs-projects` are
   exempt, code archetypes (`products`, `ventures`, `tools`, `research`) are
   required. Bump `last_updated`.

## Round 2: test hardening (2 crit-9 wiring gaps + partials)

4. Add `test_main_walk_mode_flags_missing_antirot`: build a `tmp_path/products/<r>/.git`
   with a valid README and NO artifacts, run `main(["--root", tmp])`, expect exit 1
   and two anti-rot findings; a paired with-artifacts case expects exit 0. This
   fails if the `main()` composition (line ~401) is removed.
5. Add `test_validate_repo_single_flags_missing_antirot`: add a `repo_code_missing_antirot`
   entry to `fixtures/registry_sample.json` with `bucket: products`, call
   `validate_repo_single` against the missing-artifacts fixture, assert both
   artifact findings carry the slug. Fails if the single-repo composition (line ~288)
   is removed.
6. Add partial-missing unit tests (only-DEBT-present and only-adr-present, each
   expects exactly one finding naming the absent artifact).
7. Strengthen the no-bucket test to use a missing-artifacts repo so it locks the
   "antirot skipped on the no-bucket early return" invariant; add the explanatory
   comment on the load-bearing `len == 1` assertion.

## Round 3: clarity and polish (consensus nit + cheap nits + simplifier)

8. Move `CODE_ARCHETYPES` and its `<= ALLOWED_CATEGORY` assert from after the
   function (line ~304) up to the top constant block beside `ALLOWED_CATEGORY`;
   add a derivation comment naming the excluded buckets.
9. Refine the no-bucket inline comment so it does not imply the skip is local-only
   (check_antirot_artifacts is itself a no-op for `bucket=None`).
10. Optional cheap robustness: treat `docs/adr` that exists but is empty as missing
    (require at least one entry), and distinguish "unreadable" from "missing" so a
    permission error is not reported as a missing artifact.
11. Run `code-simplifier` over the touched code; apply only changes that preserve
    behavior and pass the gate.

## Round 4: re-review

Re-run the relevant review agents (code, tests, silent-failures, comments) over the
updated diff; confirm every prior finding is resolved; report residuals.

## Non-goals

No behavior change to the exemption semantics (still bucket-based). No new
primitives. No changes to the 24 rollout PRs (docs-only, unaffected). Nits already
rated acceptable by reviewers that are not listed above stay as-is.
