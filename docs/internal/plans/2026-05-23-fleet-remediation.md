---
type: canonical
source: writing-plans session 2026-05-23
sla: on-change
last_updated: 2026-06-06
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

---

# Phase 7: anti-rot primitives

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the three genuinely net-new anti-rot guardrails (a tracked debt ledger, an ADR system, and a global `/checkpoint` behavior) to the fleet by defining them once at the control-plane source, enforcing them with one doctrine rule, and rolling them out through existing machinery, reusing `reviewer`/`refactor`/`arch-review` for every overlap.

**Architecture:** Source (templates + governance doc + one validator rule in `alawein/alawein`) -> rollout (`bootstrap-repo.sh` for new repos, an idempotent pass for existing) -> enforce (the existing doctrine CI step). Behavior skills live in global `~/.claude/skills/`. Sequence: source -> pilot(2) -> fleet.

**Tech Stack:** Python 3.12 doctrine validators + pytest; Bash scaffold/rollout scripts; Markdown templates with doctrine frontmatter; Claude Code global skills.

**Source spec:** `docs/internal/specs/2026-06-06-anti-rot-primitives-design.md`.

**Hard constraints (inherited from this plan, one override):**
- Override: commit authority. Per the spec and `commit-release-convention.md`, agents commit per each repo's `commit_mode` (default `full`), authored as `contact@meshal.ai`, with no AI attribution. Confirm before force-push or history rewrite. This supersedes this plan's original "leave uncommitted" rule.
- `.github/` stays a GATED auto-edit path (so CODEOWNERS is out of scope for Phase 7).
- Any `.md` edited in `alawein/alawein` bumps `last_updated`. No em-dashes; American spelling.
- Never edit `.env`/secrets. Only touch the named branch.

**Branch:** do all Phase 7 control-plane work on `feat/anti-rot-primitives` off `main` in `alawein/alawein`.

Run the repo's gate after each control-plane task:
```bash
py -3.12 scripts/doctrine/validate.py --ci
py -3.12 scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
py -3.12 -m pytest scripts/doctrine/tests scripts/tests tests -q
```

---

## Task 7.1: Scaffold templates for the debt ledger and ADR

**Files:**
- Create: `templates/scaffolding/DEBT.md`
- Create: `templates/scaffolding/adr-template.md`

- [ ] **Step 1: Create the debt-ledger template**

Create `templates/scaffolding/DEBT.md` with this exact content:

```markdown
---
type: canonical
source: none
sla: on-change
last_updated: {{last_updated}}
audience: [ai-agents, contributors]
---

# Technical Debt Ledger

The accumulated cost of deliberate shortcuts. The goal is not zero debt, it is
zero untracked debt. Anything recorded here was a conscious choice with a known
fix. Add entries with `/debt-log`. Remove an entry when the debt is paid (note it
in the PR).

<!-- New entries are appended below, newest first. Format:

### <short title>
- **Date:** YYYY-MM-DD
- **Where:** <file/module/path>
- **What:** the shortcut and why the proper fix was not done
- **Risk if left:** what degrades over time
- **Suggested fix:** the path to doing it right
- **Owner:** <from CODEOWNERS or repo-framework ownership>

-->
```

- [ ] **Step 2: Create the ADR template**

Create `templates/scaffolding/adr-template.md` with this exact content:

```markdown
---
type: canonical
source: none
sla: on-change
last_updated: {{last_updated}}
audience: [ai-agents, contributors]
---

# ADR-0000: <Title of the decision>

> Template. Copy to `docs/adr/<NNNN>-<kebab-title>.md` (use `/new-adr`).
> One decision per record. Records are append-only history: supersede, do not rewrite.

- **Status:** Proposed | Accepted | Superseded by ADR-XXXX
- **Date:** YYYY-MM-DD
- **Deciders:** <names / from repo-framework ownership>

## Context

What is the situation? What forces, constraints, and requirements make a decision
necessary? Keep it factual.

## Decision

What we are doing, stated in active voice: "We will ...". Be specific about scope
and boundaries (module layout, dependency direction, technology choice).

## Consequences

- **Positive:** what gets easier or safer.
- **Negative / tradeoffs:** what gets harder, and any debt this introduces
  (cross-reference `docs/DEBT.md` if applicable).
- **Follow-ups:** anything that must happen as a result.
```

- [ ] **Step 3: Verify no em-dashes in either template**

Run: `grep -c $'—' templates/scaffolding/DEBT.md templates/scaffolding/adr-template.md`
Expected: `0` for both files.

- [ ] **Step 4: Commit**

```bash
git add templates/scaffolding/DEBT.md templates/scaffolding/adr-template.md
git commit -m "feat(scaffold): add anti-rot DEBT and ADR templates"
```

---

## Task 7.2: Doctrine rule requiring ADR + DEBT for code archetypes (TDD)

**Files:**
- Modify: `scripts/doctrine/validate-repo-framework.py` (add constant near line 266; add function after line 152; wire into `main` near line 366 and `validate_repo_single` near lines 260-261)
- Modify: `scripts/doctrine/tests/test_validate_repo_framework.py` (imports near line 21; new tests at end)
- Create: `scripts/doctrine/tests/fixtures/repo_code_with_antirot/README.md`
- Create: `scripts/doctrine/tests/fixtures/repo_code_with_antirot/docs/DEBT.md`
- Create: `scripts/doctrine/tests/fixtures/repo_code_with_antirot/docs/adr/0000-template.md`
- Create: `scripts/doctrine/tests/fixtures/repo_code_missing_antirot/README.md`

- [ ] **Step 1: Create the passing fixture (code repo WITH anti-rot artifacts)**

Create `scripts/doctrine/tests/fixtures/repo_code_with_antirot/README.md`:

```markdown
# repo-code-with-antirot

Status:      active
Category:    products
Owner:       alawein
Visibility:  private
Purpose:     Fixture: a code-archetype repo that carries the anti-rot artifacts.
Next action: continue
```

Create `scripts/doctrine/tests/fixtures/repo_code_with_antirot/docs/DEBT.md`:

```markdown
# Technical Debt Ledger

Fixture ledger. No tracked debt.
```

Create `scripts/doctrine/tests/fixtures/repo_code_with_antirot/docs/adr/0000-template.md`:

```markdown
# ADR-0000: template

Fixture ADR directory marker.
```

- [ ] **Step 2: Create the failing fixture (code repo MISSING anti-rot artifacts)**

Create `scripts/doctrine/tests/fixtures/repo_code_missing_antirot/README.md`:

```markdown
# repo-code-missing-antirot

Status:      active
Category:    products
Owner:       alawein
Visibility:  private
Purpose:     Fixture: a code-archetype repo with no anti-rot artifacts.
Next action: continue
```

- [ ] **Step 3: Write the failing tests**

Add to the import block in `scripts/doctrine/tests/test_validate_repo_framework.py` (after `walk_alawein,` on line 20):

```python
    check_antirot_artifacts,
    CODE_ARCHETYPES,
```

Append these tests to the end of the file:

```python
def test_antirot_passes_when_present():
    findings = check_antirot_artifacts(FIX / "repo_code_with_antirot", "products")
    assert findings == [], f"unexpected findings: {findings}"


def test_antirot_flags_missing_debt_and_adr():
    findings = check_antirot_artifacts(FIX / "repo_code_missing_antirot", "products")
    joined = "\n".join(findings)
    assert "docs/DEBT.md" in joined
    assert "docs/adr" in joined
    assert len(findings) == 2


def test_antirot_exempt_for_noncode_archetype():
    findings = check_antirot_artifacts(FIX / "repo_code_missing_antirot", "family")
    assert findings == []


def test_antirot_exempt_for_none_bucket():
    findings = check_antirot_artifacts(FIX / "repo_code_missing_antirot", None)
    assert findings == []


def test_code_archetypes_subset_of_categories():
    assert CODE_ARCHETYPES <= ALLOWED_CATEGORY
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `py -3.12 -m pytest scripts/doctrine/tests/test_validate_repo_framework.py -q`
Expected: FAIL with `ImportError: cannot import name 'check_antirot_artifacts'`.

- [ ] **Step 5: Add the constant**

In `scripts/doctrine/validate-repo-framework.py`, immediately after the `_BUCKET_DIRS` block and its assert (after line 275), add:

```python
CODE_ARCHETYPES = {"products", "ventures", "tools", "research"}

assert CODE_ARCHETYPES <= ALLOWED_CATEGORY, (
    f"CODE_ARCHETYPES {CODE_ARCHETYPES} must be a subset of "
    f"ALLOWED_CATEGORY {ALLOWED_CATEGORY}"
)
```

- [ ] **Step 6: Add the check function**

In the same file, after `validate_repo` ends (after line 151), add:

```python
def check_antirot_artifacts(
    repo_path: Path,
    bucket: str | None,
    display_name: str | None = None,
) -> list[str]:
    """Code-archetype repos must carry the anti-rot artifacts: a debt ledger
    (docs/DEBT.md) and an ADR directory (docs/adr/).

    Non-code archetypes (family, personal, jobs-projects, archive) are exempt,
    as is a cross-org repo with no declared bucket (bucket is None). This is a
    separate concern from README-header validation, so it is composed alongside
    validate_repo in the callers rather than folded into it.
    """
    if bucket is None or bucket not in CODE_ARCHETYPES:
        return []
    name = display_name or repo_path.name
    findings: list[str] = []
    if not (repo_path / "docs" / "DEBT.md").is_file():
        findings.append(f"{name}: missing anti-rot debt ledger docs/DEBT.md")
    if not (repo_path / "docs" / "adr").is_dir():
        findings.append(f"{name}: missing anti-rot ADR directory docs/adr/")
    return findings
```

- [ ] **Step 7: Wire the check into the workspace walk**

In `main`, replace the walk loop body (lines 365-370):

```python
    for repo, bucket in repos:
        findings = validate_repo(repo, bucket=bucket)
        if findings:
            all_findings.extend(findings)
        else:
            print(f"PASS  {bucket}/{repo.name}")
```

with:

```python
    for repo, bucket in repos:
        findings = validate_repo(repo, bucket=bucket)
        findings += check_antirot_artifacts(repo, bucket)
        if findings:
            all_findings.extend(findings)
        else:
            print(f"PASS  {bucket}/{repo.name}")
```

- [ ] **Step 8: Wire the check into single-repo mode**

In `validate_repo_single`, replace the final two return statements (lines 260-261):

```python
        return validate_repo(repo_path, bucket=None, display_name=repo_slug)
    return validate_repo(repo_path, bucket=bucket, display_name=repo_slug)
```

with:

```python
        return validate_repo(repo_path, bucket=None, display_name=repo_slug) + \
            check_antirot_artifacts(repo_path, None, display_name=repo_slug)
    return validate_repo(repo_path, bucket=bucket, display_name=repo_slug) + \
        check_antirot_artifacts(repo_path, bucket, display_name=repo_slug)
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `py -3.12 -m pytest scripts/doctrine/tests/test_validate_repo_framework.py -q`
Expected: PASS (all tests, including the five new ones).

- [ ] **Step 10: Run the full doctrine suite**

Run the four-command gate from the phase header.
Expected: all PASS. (The workspace walk will now report anti-rot findings for real code repos that lack the artifacts; that is expected and is resolved by Tasks 7.6-7.8. If `validate-repo-framework.py` is part of the blocking CI walk, confirm the dogfood task 7.6 lands before this rule is enforced fleet-wide; the rule shipping here only changes behavior, not CI wiring.)

- [ ] **Step 11: Commit**

```bash
git add scripts/doctrine/validate-repo-framework.py scripts/doctrine/tests/test_validate_repo_framework.py scripts/doctrine/tests/fixtures/repo_code_with_antirot scripts/doctrine/tests/fixtures/repo_code_missing_antirot
git commit -m "feat(doctrine): require ADR and DEBT artifacts for code archetypes"
```

---

## Task 7.3: Anti-rot governance doc + repo-framework + index pointer

**Files:**
- Create: `docs/governance/anti-rot.md`
- Modify: `docs/governance/repo-framework.md` (mandatory-files section; bump `last_updated`)
- Modify: `docs/governance/governance-index.md` (add one pointer line; bump `last_updated`)

- [ ] **Step 1: Create the governance doc**

Create `docs/governance/anti-rot.md`:

```markdown
---
type: canonical
source: none
sla: on-change
last_updated: 2026-06-06
title: Anti-Rot Primitives
description: Failure-mode guardrails for agentic work, their canonical homes, and the mapping onto existing platform tools.
category: governance
audience: [ai-agents, contributors]
status: active
tags: [governance, debt, adr, anti-rot]
---

# Anti-Rot Primitives

Each named failure mode of agentic coding maps to a guardrail with a canonical home.

| Failure mode | Guardrail | Canonical home |
|---|---|---|
| Big-bang rewrite / diff-size-for-its-own-sake | Incremental, test-gated change | `refactor` / `refactor-scout` (existing) |
| Context drift on long runs | Periodic re-grounding | `/checkpoint` (global skill) |
| Software rot / silent technical debt | Debt is tracked, never silent | `docs/DEBT.md` + `/debt-log` |
| Architectural erosion | Conformance vs intended design | `arch-review` (existing) + `docs/adr/` |
| Unverified change called "done" | Test gate is the objective | `reviewer` (existing) + repo CI gate |
| Decisions lost to memory | Reasoning is recorded | `docs/adr/` + `/new-adr` |

## Hard rules (folded into doctrine)

- **No big-bang rewrites.** Refactor incrementally; flag a wholesale module
  replacement to the maintainer with the risk spelled out.
- **No unverified change.** Never declare success without running the repo's gate.
- **No silent debt.** A deliberate shortcut is logged in `docs/DEBT.md` via
  `/debt-log`, never buried.

## Canonical homes

- Architecture decisions: `docs/adr/` (one decision per record, append-only,
  supersede rather than rewrite). Scaffold with `/new-adr`.
- Known shortcuts and debt: `docs/DEBT.md`. Append with `/debt-log`.

## Overlap with existing platform tools (do not re-add the kit versions)

The source anti-rot kit ships `code-reviewer`, `architecture-guardian`, and
`refactor-safe`. These are already covered and must not be re-added:

- `code-reviewer` -> use the `reviewer` agent (and `security-reviewer`, `pr-prep`).
- `architecture-guardian` -> use the `arch-review` skill.
- `refactor-safe` -> use the `refactor` skill and `refactor-scout` agent.

## Which repos must carry the artifacts

Code archetypes (`products`, `ventures`, `tools`, `research`) must carry
`docs/DEBT.md` and `docs/adr/`, enforced by
`scripts/doctrine/validate-repo-framework.py`. `_archive` and docs-only repos are
exempt.
```

- [ ] **Step 2: Extend repo-framework.md mandatory files**

In `docs/governance/repo-framework.md`, after the "Per-repo README metadata header (mandatory)" section (after line 59), add a new section:

```markdown
## Per-repo anti-rot artifacts (mandatory for code archetypes)

Every code-archetype repo (`products`, `ventures`, `tools`, `research`) carries:

- `docs/DEBT.md`: the technical-debt ledger (see `docs/governance/anti-rot.md`).
- `docs/adr/`: Architecture Decision Records, one decision per file.

`_archive` and docs-only repos are exempt. Enforced by
`scripts/doctrine/validate-repo-framework.py` in the doctrine CI step.
```

Bump `last_updated` in the repo-framework.md frontmatter to `2026-06-06`.

- [ ] **Step 3: Add the index pointer**

In `docs/governance/governance-index.md`, add one line linking to `anti-rot.md` in the appropriate list (match the file's existing list format). Bump its `last_updated` to `2026-06-06`.

- [ ] **Step 4: Verify no em-dashes**

Run: `grep -rc $'—' docs/governance/anti-rot.md docs/governance/repo-framework.md docs/governance/governance-index.md`
Expected: `0` for each.

- [ ] **Step 5: Run the full doctrine suite**

Run the four-command gate. Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/governance/anti-rot.md docs/governance/repo-framework.md docs/governance/governance-index.md
git commit -m "docs(governance): add anti-rot doctrine and mandate ADR/DEBT artifacts"
```

---

## Task 7.4: bootstrap-repo.sh emits ADR + DEBT for code repos

**Files:**
- Modify: `scripts/ops/bootstrap-repo.sh` (the `product` case, around lines 68-80)

- [ ] **Step 1: Emit the artifacts in the product scaffold**

In `scripts/ops/bootstrap-repo.sh`, inside the `product)` case, after the `docs/INDEX.md` heredoc closes (after line 78, before `echo "Created product repo structure."`), add:

```bash
    mkdir -p docs/adr
    today="$(date +%F)"
    sed "s/{{last_updated}}/${today}/" \
      "${ORG_REPO_PATH:-..}/templates/scaffolding/DEBT.md" > docs/DEBT.md 2>/dev/null || \
    cat > docs/DEBT.md << 'EOF'
---
type: canonical
source: none
sla: on-change
last_updated: 2026-01-01
audience: [ai-agents, contributors]
---

# Technical Debt Ledger

Zero untracked debt is the goal. Append entries with /debt-log.
EOF
    sed "s/{{last_updated}}/${today}/" \
      "${ORG_REPO_PATH:-..}/templates/scaffolding/adr-template.md" > docs/adr/0000-template.md 2>/dev/null || \
    cat > docs/adr/0000-template.md << 'EOF'
# ADR-0000: <Title>
- **Status:** Proposed
- **Date:** YYYY-MM-DD
## Context
## Decision
## Consequences
EOF
```

- [ ] **Step 2: Smoke-test the scaffold in a throwaway dir**

Run:
```bash
tmp="$(mktemp -d)"; ( cd "$tmp" && ORG_REPO_PATH="$OLDPWD" bash "$OLDPWD/scripts/ops/bootstrap-repo.sh" product smoke-test ); ls "$tmp/smoke-test/docs/DEBT.md" "$tmp/smoke-test/docs/adr/"; rm -rf "$tmp"
```
Expected: both `docs/DEBT.md` and `docs/adr/0000-template.md` exist.

- [ ] **Step 3: Commit**

```bash
git add scripts/ops/bootstrap-repo.sh
git commit -m "feat(scaffold): bootstrap emits ADR and DEBT for product repos"
```

---

## Task 7.5: Global behavior skills (/checkpoint, /debt-log, /new-adr)

**Files (outside the repo; maintainer reviews before use, do not commit anywhere):**
- Create: `~/.claude/skills/checkpoint/SKILL.md`
- Create: `~/.claude/skills/debt-log/SKILL.md`
- Create: `~/.claude/skills/new-adr/SKILL.md`
- Modify: `~/.claude/skills/registry.json`

- [ ] **Step 1: Create /checkpoint**

Copy the body from the source kit at `C:/Users/mesha/Downloads/anti-rot/anti-rot-kit/.claude/skills/checkpoint/SKILL.md` into `~/.claude/skills/checkpoint/SKILL.md`, replacing its frontmatter with the platform convention:

```markdown
---
name: checkpoint
version: 1.0.0
description: Re-ground a long-running task to counter context drift. Summarize done/remaining/decisions, then re-read the controlling CLAUDE.md and relevant ADRs. Use on long multi-step work.
---
```

Keep the kit's body (the five-point snapshot). Replace any em-dashes with commas or colons.

- [ ] **Step 2: Create /debt-log**

Copy the body from `C:/Users/mesha/Downloads/anti-rot/anti-rot-kit/.claude/skills/debt-log/SKILL.md` into `~/.claude/skills/debt-log/SKILL.md` with this frontmatter:

```markdown
---
name: debt-log
version: 1.0.0
description: Record a deliberate shortcut or known limitation in docs/DEBT.md so it is tracked, not silently accrued. Use whenever a workaround or "fix later" decision is made.
---
```

Append to the body a creation rule: "If `docs/DEBT.md` does not exist, create it from the ledger template (frontmatter with today's `last_updated`) before appending. Never overwrite an existing populated ledger." Replace any em-dashes.

- [ ] **Step 3: Create /new-adr**

Copy the body from `C:/Users/mesha/Downloads/anti-rot/anti-rot-kit/.claude/skills/new-adr/SKILL.md` into `~/.claude/skills/new-adr/SKILL.md` with this frontmatter:

```markdown
---
name: new-adr
version: 1.0.0
description: Scaffold a new Architecture Decision Record in docs/adr/. Use when an architectural or structural decision (or a deliberate deviation) is made.
---
```

In the body, change the template reference to read the next number from `docs/adr/` and base new records on `docs/adr/0000-template.md`. Replace any em-dashes.

- [ ] **Step 4: Register the three skills**

Run `cat ~/.claude/skills/registry.json` to read the existing schema, then add three entries matching it exactly (one per skill, `version: 1.0.0`, the descriptions above). Validate the JSON:

Run: `py -3.12 -c "import json,pathlib; json.loads(pathlib.Path.home().joinpath('.claude/skills/registry.json').read_text())" && echo OK`
Expected: `OK`.

- [ ] **Step 5: Verify the skills load**

In a Claude Code session, type `/` and confirm `/checkpoint`, `/debt-log`, `/new-adr` appear. (Manual check; no commit, these are global config.)

---

## Task 7.6: Dogfood in alawein/alawein

**Files:**
- Create: `docs/DEBT.md`
- Create: `docs/adr/0001-adopt-anti-rot-primitives.md`

Note: `alawein/alawein` is the control plane (Owner alawein), not a bucketed code repo, so the validator does not force these on it; we add them anyway to model the standard.

- [ ] **Step 1: Create the debt ledger**

Create `docs/DEBT.md` by filling the template (`last_updated: 2026-06-06`), with one real seed entry if any known control-plane shortcut exists, else the empty ledger body from Task 7.1.

- [ ] **Step 2: Create the first ADR**

Create `docs/adr/0001-adopt-anti-rot-primitives.md` from the ADR template:

```markdown
---
type: canonical
source: none
sla: on-change
last_updated: 2026-06-06
audience: [ai-agents, contributors]
---

# ADR-0001: Adopt anti-rot primitives across the fleet

- **Status:** Accepted
- **Date:** 2026-06-06
- **Deciders:** alawein (Meshal)

## Context

The fleet had no debt ledger and no ADR system; debt and decisions lived in
memory files and handoffs. The anti-rot kit named these failure modes; the net-new
guardrails (debt ledger, ADRs, /checkpoint) close real gaps the existing platform
did not cover.

## Decision

We will require `docs/DEBT.md` and `docs/adr/` in every code-archetype repo
(`products`, `ventures`, `tools`, `research`), enforced by
`validate-repo-framework.py`, define the doctrine in
`docs/governance/anti-rot.md`, and add `/checkpoint`, `/debt-log`, `/new-adr` as
global skills. We reuse `reviewer`/`refactor`/`arch-review` for overlapping
primitives and defer `/check-ssot`, `/doc-sync`, and CODEOWNERS.

## Consequences

- **Positive:** debt and decisions become tracked and auditable; new repos are
  born compliant via bootstrap.
- **Negative / tradeoffs:** existing code repos need a one-time rollout (Tasks
  7.7-7.8); a new doctrine finding type appears until they comply.
- **Follow-ups:** pilot (Task 7.7), fleet rollout (Task 7.8); revisit
  `/check-ssot` and `/doc-sync` in a v2.
```

- [ ] **Step 3: Run the full doctrine suite**

Run the four-command gate. Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add docs/DEBT.md docs/adr/0001-adopt-anti-rot-primitives.md
git commit -m "docs(adr): record anti-rot adoption (ADR-0001) and seed debt ledger"
```

---

## Task 7.7: Idempotent rollout helper + pilot (2 repos)

**Files:**
- Create: `scripts/ops/rollout-antirot.sh`

- [ ] **Step 1: Write the idempotent rollout helper**

Create `scripts/ops/rollout-antirot.sh`:

```bash
#!/usr/bin/env bash
# rollout-antirot.sh -- seed docs/DEBT.md and docs/adr/ into a repo if absent.
# Idempotent: never overwrites an existing DEBT.md or ADR file.
# Usage: rollout-antirot.sh <repo-path>
set -euo pipefail

REPO="${1:?Usage: rollout-antirot.sh <repo-path>}"
ORG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
today="$(date +%F)"

[ -d "$REPO" ] || { echo "error: not a directory: $REPO" >&2; exit 1; }
mkdir -p "$REPO/docs/adr"

if [ -f "$REPO/docs/DEBT.md" ]; then
  echo "skip  $REPO/docs/DEBT.md (exists)"
else
  sed "s/{{last_updated}}/${today}/" "$ORG_DIR/templates/scaffolding/DEBT.md" > "$REPO/docs/DEBT.md"
  echo "wrote $REPO/docs/DEBT.md"
fi

if [ -f "$REPO/docs/adr/0000-template.md" ]; then
  echo "skip  $REPO/docs/adr/0000-template.md (exists)"
else
  sed "s/{{last_updated}}/${today}/" "$ORG_DIR/templates/scaffolding/adr-template.md" > "$REPO/docs/adr/0000-template.md"
  echo "wrote $REPO/docs/adr/0000-template.md"
fi
```

Then: `chmod +x scripts/ops/rollout-antirot.sh`

- [ ] **Step 2: Verify idempotency on a throwaway dir**

Run:
```bash
tmp="$(mktemp -d)"; bash scripts/ops/rollout-antirot.sh "$tmp"; bash scripts/ops/rollout-antirot.sh "$tmp"; ls "$tmp/docs/DEBT.md" "$tmp/docs/adr/0000-template.md"; rm -rf "$tmp"
```
Expected: first run prints `wrote` twice; second run prints `skip` twice; both files exist.

- [ ] **Step 3: Commit the helper**

```bash
git add scripts/ops/rollout-antirot.sh
git commit -m "feat(ops): add idempotent anti-rot artifact rollout helper"
```

- [ ] **Step 4: Seed pilot repo A (tools/workspace-tools)**

From the workspace, run (paths relative to `alawein/`):
```bash
bash alawein/scripts/ops/rollout-antirot.sh tools/workspace-tools
```
Confirm `git -C tools/workspace-tools status -s` shows only the two new files. Run that repo's gate (`pytest` from `tools/workspace-tools`). Expected: green. Commit in that repo per its `commit_mode` (default full), authored `contact@meshal.ai`, message `docs: adopt anti-rot debt ledger and ADR directory`.

- [ ] **Step 5: Seed pilot repo B (one green research repo)**

Pick `research/fallax` (400 tests, green per Phase 2) or `research/qubeml`. Run:
```bash
bash alawein/scripts/ops/rollout-antirot.sh research/fallax
```
Run the repo's gate (`pytest`). Expected: green. Commit per its `commit_mode`.

- [ ] **Step 6: Round-trip the skills on a pilot**

In `research/fallax`, invoke `/debt-log` to append one real entry and `/new-adr` to create `docs/adr/0001-*.md`. Confirm both files are frontmatter-valid and the repo gate stays green. This proves the end-to-end loop before fleet rollout.

- [ ] **Step 7: Validate the pilots against the doctrine rule**

From `alawein/alawein`, run single-repo validation against each pilot:
```bash
py -3.12 scripts/doctrine/validate-repo-framework.py --repo ../../tools/workspace-tools --registry ../projects.json --repo-slug alawein/workspace-tools
```
Expected: `PASS` (adjust the slug to the registry's actual value). Repeat for the research pilot.

---

## Task 7.8: Fleet rollout

- [ ] **Step 1: Enumerate code-archetype repos**

List every repo under `alawein/{products,ventures,tools,research}` that has a `.git` dir. Exclude `_archive` and any docs-only repo (no source dir). Write the list; this is the rollout target set.

- [ ] **Step 2: Roll out per repo (batched, on branches)**

For each target repo, run `bash alawein/scripts/ops/rollout-antirot.sh <bucket>/<repo>`, run that repo's gate, and commit the two files per the repo's `commit_mode` on a `docs/anti-rot` branch. For repos whose gate is currently red (per Phase 2 BLOCKED list: scicomp, spincirc, provegate), seed the files but do NOT enable any new gate; note them for follow-up. Log every repo that was seeded vs skipped vs deferred (no silent truncation).

- [ ] **Step 3: Fleet validation walk**

From `alawein/alawein`, run the workspace walk:
```bash
py -3.12 scripts/doctrine/validate-repo-framework.py --root ../
```
Expected: no remaining `missing anti-rot` findings for code-archetype repos (deferred red repos excepted and explicitly listed).

- [ ] **Step 4: Reconcile kohyr ADRs**

Confirm kohyr's existing ADR location (memory references ADR-049/053). If they are not under `docs/adr/`, record the canonical path decision as a kohyr ADR; do not force-migrate existing records. Note the outcome in `docs/DEBT.md` if a migration is deferred.

- [ ] **Step 5: Mark Phase 7 complete**

Update `SSOT.md` (active decisions) with a one-line note that anti-rot primitives are live fleet-wide, and bump its `last_updated` and `last-verified`. Commit.

---

## Phase 7 self-review

- **Coverage:** spec components A (templates 7.1; governance doc + repo-framework 7.3), B (validator rule + tests 7.2), C (global skills 7.5) all mapped; rollout source/pilot/fleet = 7.4/7.6/7.7/7.8; integration = this section; non-goals respected (no /check-ssot, /doc-sync, CODEOWNERS, no kit code-reviewer/architecture-guardian/refactor-safe).
- **Dependencies:** 7.2 depends on 7.1 templates only for real rollout, not for the rule; 7.4/7.6/7.7 depend on 7.1; 7.7 pilot precedes 7.8 fleet; 7.8 validation depends on 7.2.
- **Constraint check:** commit authority override stated; `.github/` untouched (CODEOWNERS deferred); `.md` edits bump `last_updated`; no em-dashes (verification steps included).
- **No placeholders:** all file paths, code, and commands are concrete; the only deferred specifics are the registry slug values (read from `projects.json` at run time) and the kohyr ADR path (probed in 7.8 Step 4).
