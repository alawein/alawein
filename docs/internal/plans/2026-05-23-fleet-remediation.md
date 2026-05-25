---
type: canonical
source: writing-plans session 2026-05-23
sla: on-change
last_updated: 2026-05-23
audience: [ai-agents, contributors]
---

# Fleet Remediation Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the fleet's recurring defects at their governance source, then roll the fixes out to ~40 downstream repos, so every repo has a real CI gate, an accurate generated `.claude/CLAUDE.md`, a green doctrine check, honest docs, and a clear release/commit convention.

**Architecture:** Three layers. (1) Source fixes in `alawein/alawein` (templates, validators, scaffold, catalog) that prevent recurrence. (2) Registry-driven rollout via the existing `github-baseline.yaml` + `sync-github.sh` and the Extender. (3) A per-repo downstream sweep for residue that is not reproducible from current machinery. Each phase is independently landable and leaves verifiable state.

**Tech Stack:** Bash + Python 3.12 governance scripts; GitHub Actions reusable workflows; YAML registries (`github-baseline.yaml`, `catalog/repos.json`, `projects.json`); the `claude-agent-platform` Extender (mirrored to `~/.claude/bin/`).

**Hard constraints (apply to every task):**
- The maintainer authors all commits. Agents create branches and leave changes UNCOMMITTED; never `git commit`, `git push`, or `git add -A`.
- Never edit `.env`/secrets. Never force-push. Only touch the named branch.
- Any `.md` edited in `alawein/alawein` must bump `last_updated` (and `last-verified` for `SSOT.md`) or `validate-doc-contract.sh` fails. `docs/internal/`, `docs/archive/` are CI-exempt.
- No em-dashes in prose; American spelling.
- `.github/` is a forbidden auto-edit path under org policy: workflow edits are GATED (propose, maintainer applies).

---

## Decisions baked in (CONFIRM before Phase 1 execution)

These are the 5 open decisions with recommended defaults. Each is small but high-blast-radius.

- **D1 Em-dash policy -> mandate none.** `docs/style/VOICE.md` currently allows a 0-1/section budget, which is why the fleet inherits em-dashes against the maintainer's rule. Change VOICE.md + terminology to forbid them and add a voice-check rule.
- **D2 Version anchor -> git tag + CHANGELOG are the source of truth; `pyproject`/`__init__`/CLI derive.** Drop per-doc `version:` frontmatter where it only drifts. Add a version-coherence check.
- **D3 Stub-doc prevention (keystone) -> template gate + placeholder sentinel.** Gate `## Deployment` in `templates/scaffolding/README.product.md` to web/service surfaces; add a voice-check rule that fails residual placeholder strings so unfilled stubs go RED instead of passing.
- **D4 Extender -> registry-aware.** Make the Extender read `projects.json` `bucket` (+ `catalog/repos.json` `local_path`) for `Root`/commands instead of `pwd`.
- **D5 Catalog -> finish accuracy.** Archive morphism, dedup provegate, add genuine missing entries, regenerate `projects.json`.

---

## File structure (what gets touched)

**Source repo `alawein/alawein` (Phases 1, 2-registry):**
- `docs/style/VOICE.md`, `docs/style/terminology-registry.yaml` (D1)
- `scripts/doctrine/validate.py` or new `scripts/doctrine/checks/` rule (D1, D3, D2 checks)
- `templates/scaffolding/README.product.md` (D3)
- `github-baseline.yaml` (Phase 2 rows)
- `catalog/repos.json` + regenerate `projects.json` via `scripts/catalog/build-catalog.py` (D5)
- `SSOT.md`, `CONTRIBUTING.md`, `docs/architecture.md`, `.cursor/rules.md`, `prompt-kits/AGENT.md`, `docs/onboarding.md`, `docs/governance/docs-doctrine.md` (Phase 1 doc sweep)
- `templates/README.md` (cosmetic typo)

**Extender (Phase 3):**
- `claude-agent-platform/bin/repo-scanner.sh`, `claude-agent-platform/bin/generate-local-claude.sh`
- mirror to `~/.claude/bin/repo-scanner.sh`, `~/.claude/bin/generate-local-claude.sh`

**Downstream repos (Phases 2-rollout, 4, 5):** per-repo `.github/workflows/ci.yml` (generated), `.claude/CLAUDE.md` (generated), `drift.yml`, `docs/*`, `CONTRIBUTING.md`, `pyproject.toml`, `.gitignore`.

---

## Phase 1: Source fixes and prevention (alawein/alawein)

All Phase 1 work lands in `alawein/alawein`. Branch off `main` (or stack on `chore/governance-cleanup`, which already holds the systemic-7 scaffold path fix + service-metadata link fix). Run the repo's gate after each task:

```bash
py -3.12 scripts/doctrine/validate.py --ci
py -3.12 scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
py -3.12 -m pytest scripts/doctrine/tests scripts/tests tests -q
```
Expected baseline before edits: 202 passed, 1 skipped; doctrine validate PASS on tracked files.

### Task 1.1: Em-dash policy to none (D1)

**Files:**
- Modify: `docs/style/VOICE.md` (the em-dash budget section, lines near 56,65-67)
- Modify: `docs/style/terminology-registry.yaml` (add em-dash to forbidden punctuation if a punctuation section exists)
- Modify: `scripts/doctrine/style-advisory-audit.py` or `validate.py` (add/flip an em-dash rule from advisory to blocking on governed surfaces)

- [ ] **Step 1:** Read `docs/style/VOICE.md` around the punctuation/em-dash budget. Replace the "0-1 per section" allowance with an explicit prohibition: em-dashes are not used; use commas, parentheses, or sentence breaks. Remove any em-dashes the file itself contains.
- [ ] **Step 2:** Grep the repo for literal em-dashes to confirm scope: `grep -rl $'—' --include='*.md' .` Expected: VOICE.md and a handful of governance docs.
- [ ] **Step 3:** Add a voice-check rule. In the style validator, flag `—` on Blocking surfaces (README, CLAUDE, AGENTS, prompt-kits) as an error. Write the test first in `scripts/doctrine/tests/` asserting a fixture string with an em-dash fails on a Blocking surface and passes on an Advisory one.
- [ ] **Step 4:** Run the new test (expect fail), implement the rule, run again (expect pass).
- [ ] **Step 5:** Bump `last_updated` on every `.md` touched. Run the full gate. Expected: PASS.
- [ ] **Step 6:** Leave uncommitted. Suggested message: `style: forbid em-dashes on governed surfaces`

### Task 1.2: Stub-doc prevention keystone (D3)

**Files:**
- Modify: `templates/scaffolding/README.product.md` (lines ~16-26: `{{install_command}}` token, `## Architecture`, `## Deployment` placeholder sections)
- Add: a placeholder-sentinel rule to the style/doctrine validator + test

- [ ] **Step 1:** In `README.product.md`, wrap the `## Deployment` section in a surface conditional so the scaffold only emits it for `surface == web|service` archetypes (mirror how `README.research.md` omits Deployment and substitutes Reproducibility). Keep `## Architecture` but replace placeholder prose with a `<!-- REQUIRED: fill before first PR -->` sentinel.
- [ ] **Step 2:** Write a failing test in `scripts/doctrine/tests/` asserting that a README containing a residual placeholder string (`{{install_command}}`, `Summarize the main runtime`, `Document how production`) fails validation.
- [ ] **Step 3:** Implement a `placeholder-residue` rule in the doctrine validator that errors on those strings (and the generic `{{...}}` / `{INSTALL_COMMAND}` / `> TODO` linked-as-authoritative patterns). Run test (expect pass).
- [ ] **Step 4:** Run the full gate; bump `last_updated` on any `.md`. Leave uncommitted. Suggested message: `feat(doctrine): fail residual scaffold placeholders; scope product Deployment section`

### Task 1.3: Version-anchor rule + coherence check (D2)

**Files:**
- Modify: `docs/governance/docs-doctrine.md` (state the version SSOT rule: git tag + CHANGELOG canonical; `pyproject`/`__init__` derive)
- Add: a `version-coherence` check (compare the version in `pyproject.toml`/`package.json`, `__init__`, CHANGELOG top entry, and the latest tag; warn on mismatch) + test

- [ ] **Step 1:** Document the rule in `docs-doctrine.md`. Bump `last_updated`.
- [ ] **Step 2:** Write a failing test: a fixture repo with `pyproject 0.1.0` + CHANGELOG `1.0.0` + tag `v1.1.0` reports a coherence error.
- [ ] **Step 3:** Implement `scripts/doctrine/version-coherence.py` (or add to `validate-repo-framework.py`); run test (expect pass).
- [ ] **Step 4:** Full gate; leave uncommitted. Suggested message: `feat(doctrine): add version-coherence check and version SSOT rule`

### Task 1.4: Source doc sweep (flat-layout + broken script paths + dead-brand)

**Files (each is a governed `.md`/yaml; bump `last_updated`/`last-verified` as applicable):**
- `SSOT.md` (stale flat script paths ~44-61; `design-system/tokens/` :74; bump `last_updated` + `last-verified`)
- `CONTRIBUTING.md` (:93 flat script path; :25-26 dead "Morphism Bible")
- `docs/architecture.md` (:168,215,217 flat script paths; :19,23 vs :205 repo-count self-contradiction; morphism in topology)
- `.cursor/rules.md` (:32-33 flat script paths)
- `prompt-kits/AGENT.md` (:51-54 flat sibling paths -> bucketed: `personal/meshal-web`, `tools/workspace-tools`, `research/alembiq`)
- `prompt-kits/PORTFOLIO.md` (:92 dead-brand), `profile-from-guides.yaml` (:29,51 dead-brand)
- `docs/onboarding.md` (:48,67 flat paths)
- `docs/governance/docs-doctrine.md` (:120,195 reclassify projects.json as Derived, source `catalog/repos.json`)
- `templates/README.md` (:17 `.editorconfig.template` -> `editorconfig.template`)

- [ ] **Step 1:** Fix the broken script paths (`scripts/<x>.py` -> `scripts/{doctrine,catalog,github,ops}/<x>.py`) everywhere listed. Verify each corrected path exists on disk.
- [ ] **Step 2:** Fix flat-layout repo paths to bucketed paths.
- [ ] **Step 3:** Remove dead-brand ("Morphism"/"morphism-systems") prose from governed surfaces (it violates the repo's own terminology lint).
- [ ] **Step 4:** Reconcile `docs/architecture.md` repo count to one number; reclassify projects.json in `docs-doctrine.md`.
- [ ] **Step 5:** Bump `last_updated` on each `.md` (and `last-verified` on SSOT.md). Run the full gate (expect PASS) and `py -3.12 scripts/doctrine/style-advisory-audit.py --repo-root .` (expect no dead-brand hits).
- [ ] **Step 6:** Leave uncommitted. Suggested message: `docs: fix stale script/layout paths and remove dead-brand references`

### Task 1.5: Finish catalog accuracy (D5)

**Files:** `catalog/repos.json` (authored source) -> regenerate `projects.json` (derived). Never hand-edit `projects.json` first.

- [ ] **Step 1:** In `catalog/repos.json:79-99`, archive morphism: set `status: archived`, remove or correct the phantom `../morphism-systems/morphism` `local_path`. Decide with the maintainer whether to drop the entry entirely (it is not on disk).
- [ ] **Step 2:** Add genuinely missing entries confirmed on disk (`tools/claude-templates` at least); confirm whether `tools/inventory`, `tools/packages` are repos or tooling dirs before adding.
- [ ] **Step 3:** Regenerate: `py -3.12 scripts/catalog/build-catalog.py` then `py -3.12 scripts/catalog/build-catalog.py --check` (expect clean). This rewrites `projects.json` (removing morphism's 3 occurrences + dead `@morphism-systems/*` packages and the duplicate provegate).
- [ ] **Step 4:** `py -3.12 scripts/catalog/validate-catalog.py` and `validate-projects-json.py` (expect PASS).
- [ ] **Step 5:** Leave uncommitted. This is the natural completion of the `fix/catalog-accuracy-corrections` branch. Suggested message: `fix(catalog): archive morphism, add missing entries, regenerate projects.json`

---

## Phase 2: CI adoption (systemic #5) — highest immediate value

Turns the invisible test suites in the research repos into real gates by registering them in `github-baseline.yaml` so `sync-github.sh` generates a `ci.yml` that calls the reusable `ci-python.yml`/`ci-node.yml`.

### Task 2.1: Land the per-repo SAFE-NOW that the new gate depends on

Enabling CI on a repo whose suite is currently red just surfaces red. Land these staged SAFE-NOW branches FIRST (maintainer commits), else the new gate is born failing:

| Repo | Blocker before CI can be green | Branch already staged |
|---|---|---|
| scicomp | `pytest` broken at collection (banner side-effect) | `chore/cleanup` (conftest quiet) |
| spincirc | `pip install -e .` fails (phantom `sphinxcontrib-matlab` dep) | `chore/cleanup` (ruff) + needs dep-name fix |
| maglogic | ruff config needed for a clean lint gate | `chore/cleanup` (ruff config) |
| qmatsim | ruff lint not clean until fix lands | `chore/cleanup` (ruff) |

- [ ] **Step 1:** For spincirc, also fix `requirements.txt` `sphinxcontrib-matlab` -> `sphinxcontrib-matlabdomain` and the dead `spincirc-process` entrypoint (from its handout) so `pip install -e .` succeeds.
- [ ] **Step 2:** Confirm chshlab (154 tests), fallax (400), qubeml (98) are green-now (no pre-req).
- [ ] **Step 3:** helios has no code -> register as `ci_template: manual`/`stack: docs` (no test gate). loopholelab and provegate were not audited -> probe each (`git -C <path> status`; detect stack + test command) before writing their row.

### Task 2.2: Add github-baseline.yaml rows for the 14 missing repos (verified against the registry 2026-05-23)

**Files:** Modify `alawein/alawein/github-baseline.yaml` (append to `repos:`). Schema confirmed:
```yaml
  - repo: <name>
    stack: <python|node|docs>
    ci_template: <python|node|manual>
    working_directory: "."
    install_command: "..."
    build_command: "..."
    test_command: "..."
    codeql_languages: [...]
    sync: auto
```

The registry has 20 repos; the audit verified these 14 are MISSING (the governance audit's estimate of 10 was low; `adil` is already registered). Set `sync: auto` only for repos that are GREEN now or green after their already-staged SAFE-NOW lands; set `sync: manual` for the BLOCKED ones so a `sync-github --all` does not generate a red `ci.yml`. Confirm each command against the repo before writing (the audit values below are the starting point).

- [ ] **Step 1:** Add rows:
  - `chshlab`: node; `npm ci`; build `bash build.sh`; test `npm test`; codeql `[javascript-typescript]`; sync auto (green)
  - `fallax`: python; `pip install -e ".[dev,dashboard]"`; build `ruff check . && ruff format --check .`; test `pytest`; codeql `[python]`; sync auto (green)
  - `qubeml`: python; `pip install -e .`; build `black --check .`; test `pytest`; codeql `[python]`; sync auto (green)
  - `quantumalgo`: python; `pip install -e ".[dev]"`; build `ruff check src tests scripts && mypy src/quantumalgo`; test `pytest`; codeql `[python]`; sync auto (green; its `drift.yml` bug is separate and .github-gated)
  - `veyra`: node (turbo monorepo); `npm ci`; build `npm run build`; test `npm run test`; codeql `[javascript-typescript]`; sync auto (green; note the ESLint gate covers only 1 of 3 packages)
  - `loopholelab`: python (FastAPI + web); `pip install -e .`; build `` (ruff is not a declared gate here); test `pytest`; codeql `[python]`; sync auto (green)
  - `incore`: python; `pip install -e ".[dev]"`; build `ruff check .`; test `pytest`; codeql `[python]`; sync auto (green after the staged `chore/cleanup` ruff fix)
  - `maglogic`: python; `pip install -e ".[dev]"`; build `ruff check .`; test `pytest`; codeql `[python]`; sync auto ONLY after the staged `chore/cleanup` (adds the ruff config) lands
  - `qmatsim`: python; `pip install -e ".[dev]"`; build `ruff check .`; test `pytest`; codeql `[python]`; sync auto ONLY after the staged `chore/cleanup` (ruff) lands
  - `scicomp`: python; `pip install -e .`; build ``; test `pytest`; codeql `[python]`; **sync manual** - BLOCKED: pytest aborts at collection until the `chore/cleanup` conftest banner-quiet fix lands; linter is unsettled (ruff is phantom, flake8 has 9k findings)
  - `spincirc`: python; `pip install -e .`; build `ruff check python/`; test `pytest python/`; codeql `[python]`; **sync manual** - BLOCKED: `pip install` fails until the phantom-dep fix (`sphinxcontrib-matlab` -> `sphinxcontrib-matlabdomain`) lands
  - `provegate`: python (MCP); `pip install -e ".[dev]"`; build `ruff check .`; test `pytest`; codeql `[python]`; **sync manual** - it already has its own `ci.yml` whose mypy step is red; reconcile (per-file mypy, GATED) before generating a competing reusable `ci.yml`
  - `helios`: docs archive; ci_template `manual`; empty commands; sync manual (no code surface)
  - `prompty`: stack UNVERIFIED - probe the repo (manifests + scripts) and fill before writing; do not guess
- [ ] **Step 2:** Validate: `./scripts/github/sync-github.sh --check --all` and `py -3.12 scripts/github/github-baseline-audit.py`. Expected: the 14 repos recognized, no schema errors.
- [ ] **Step 3:** Leave uncommitted. Suggested message: `feat(ci): register research repos for reusable CI adoption`

### Task 2.3: Roll out generated ci.yml (GATED — writes downstream `.github/`)

- [ ] **Step 1:** Dry run: `./scripts/github/sync-github.sh --check --all` and review the proposed `ci.yml` for each repo.
- [ ] **Step 2:** With maintainer approval (writes to downstream `.github/`), run `./scripts/github/sync-github.sh --all` for the registered repos. This generates each downstream `ci.yml` pinned to `workflow_ref`.
- [ ] **Step 3:** For each repo, the maintainer commits the new `ci.yml` on a `feat/ci-adoption` branch and confirms one Actions run is green. Verify install+build+test match the audit baseline.

---

## Phase 3: Extender registry-awareness (systemic #1) — GATED

Makes the generated `.claude/CLAUDE.md` carry the correct bucketed `Root` and real commands instead of `pwd`/`unknown`.

### Task 3.1: Make the Extender registry-aware

**Files:** `claude-agent-platform/bin/repo-scanner.sh` (`ROOT_ABS` at ~37,48), `claude-agent-platform/bin/generate-local-claude.sh` (`Root:` write at ~132; command detection)

- [ ] **Step 1:** Write a test fixture: scanning `research/qmlab` should yield `Root: .../alawein/research/qmlab` (bucketed), not the bare path, and commands from the registry when the root has no manifest.
- [ ] **Step 2:** In the scanner, after computing the path, look up the repo slug in `alawein/alawein/projects.json` (`bucket`) and/or `catalog/repos.json` (`local_path`, `install/build/test` if present, falling back to `github-baseline.yaml`). Override `Root`, `stack`, and the command fields from the registry.
- [ ] **Step 3:** Run the fixture (expect bucketed Root + real commands). Add a guard: if the slug is absent from the registry, keep the scan result but emit a clear `# registry: not found` marker rather than silently writing `unknown`.

### Task 3.2: Mirror to the deployed global Extender

- [ ] **Step 1:** Confirm the global copy is still byte-identical: `diff ~/.claude/bin/generate-local-claude.sh claude-agent-platform/bin/generate-local-claude.sh`.
- [ ] **Step 2:** Apply the same change to `~/.claude/bin/repo-scanner.sh` and `~/.claude/bin/generate-local-claude.sh`. (These are outside the repo; the maintainer reviews before use. Do not commit them anywhere.)

### Task 3.3: Regenerate `.claude/CLAUDE.md` fleet-wide (GATED)

- [ ] **Step 1:** Dry-run regenerate for one repo per bucket; confirm `Root` carries the bucket and commands are real.
- [ ] **Step 2:** With approval, regenerate across the fleet. NOTE: most downstream `.claude/CLAUDE.md` are gitignored (agent-UX only), so this is low-risk; where tracked (e.g. chshlab), route through a reviewed doc change. The maintainer commits any tracked regenerations.

---

## Phase 4: Doctrine path repins (systemic #7 rollout) — GATED

The source scaffold fix (done) stops NEW repos inheriting the dead path. Existing repos on a stale wrapper / old pinned `doctrine-reusable.yml` SHA still fail.

- [ ] **Step 1:** Identify affected repos: those whose docs-doctrine job is red with `No such file or directory` (confirmed: helios, optiqap) and any repo with a `scripts/validate.sh` calling `scripts/validate-doctrine.py`. Grep across the fleet for the stale path.
- [ ] **Step 2:** For each, either repin the workflow `uses:` to the current `doctrine-reusable.yml` SHA, or regenerate the wrapper from the fixed `bootstrap-repo.sh`. (Touches `.github/` -> GATED; maintainer applies.)
- [ ] **Step 3:** Confirm one green docs-doctrine run per repo.

---

## Phase 5: Downstream sweep (systemics #2/3/4/6/8/10)

Residue not reproducible from current machinery. The per-repo audit handouts (in each repo's `.claude/plans/2026-05-23-<repo>-audit-handout.md`) already enumerate the exact items. One pass per repo, on a branch, left uncommitted.

- [ ] **5.1 Stub docs (#2):** replace `docs/{architecture,deployment,troubleshooting}.md` `> TODO` stubs with real content or unlink them from authoritative indexes. Affected: alembiq, chshlab, edfp, fallax, maglogic, meatheadphysicist, qmatsim, qmlab, qubeml, scicomp, simcore, spincirc, others.
- [ ] **5.2 CONTRIBUTING tokens (#3):** fill or remove `{INSTALL_COMMAND}`/`{TEST_COMMAND}` placeholders (already done on staged branches for alembiq, chshlab). Sweep the rest.
- [ ] **5.3 Maturity classifiers (#4):** correct `Development Status :: 5 - Production/Stable` to match real maturity (scicomp, spincirc, others).
- [ ] **5.4 drift.yml secrets bug (#6):** apply the job-level `env:` + step-level `if: env.X != ''` pattern. Affected: quantumalgo and any repo with the same `drift.yml`.
- [ ] **5.5 Hallucinated docs (#8):** rewrite fictional/ wrong-product docs (alembiq README demo, simcore `docs/overview.md`, edfp Claude-dump docs, meatheadphysicist embedded wrong-project changelog).
- [ ] **5.6 Heavy artifacts (#10):** gitignore + remove from tree (qmatsim 170 MB `siesta/bin`, optiqap 343-file `docs/archive` residue, alembiq Playwright outputs). History rewrite is GATED and per-repo opt-in.

---

## Phase 6: Release + commit convention rollout

With the source repo modeling it (CHANGELOG + sparse milestone tags; conventional commits; `feat/fix/docs/chore/test` branches), document and roll the convention to the fleet.

- [ ] **Step 1:** Confirm the convention is stated canonically in `alawein/alawein` (CONTRIBUTING + docs) and synced via `sync-contributing.sh` (after the overwrite-safety fix in Task 5/NEEDS-DECISION).
- [ ] **Step 2:** For research repos, the release model is a dated CHANGELOG entry + milestone commit + PR (no tags), per the rb standard. For products/ventures, semver tags are allowed.
- [ ] **Step 3:** Add the version-coherence check (Task 1.3) to the reusable CI so drift is caught going forward.

---

## Self-review

- **Coverage:** all 10 systemics map to a task (1->Phase 3; 2->1.2+5.1; 3->5.2+sync-contributing fix; 4->5.3; 5->Phase 2; 6->5.4; 7->done+Phase 4; 8->5.5; 9->1.3; 10->5.6).
- **Dependencies:** Phase 2 gates on Task 2.1 pre-reqs; Phase 4 gates on the source scaffold fix (done); Phase 3 gates on D4 confirmation.
- **No placeholders:** commands and file paths are concrete; the only deferred specifics are loopholelab/provegate rows (explicitly probed in 2.1 Step 3) because they were not in the audited waves.
- **Constraint check:** every task leaves changes uncommitted for the maintainer; `.github/` edits are GATED; `.md` edits bump `last_updated`.

---

## Open decisions (confirm before execution)

D1 em-dash=none, D2 version anchor=tag+CHANGELOG, D3 template gate+sentinel, D4 Extender registry-aware, D5 catalog finish. Plus: drop morphism entry entirely vs archive-in-place; whether `tools/inventory` and `tools/packages` are catalog-eligible repos.
