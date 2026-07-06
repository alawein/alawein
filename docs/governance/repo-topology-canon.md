---
type: canonical
status: active
last_updated: 2026-07-06
owner: meshal
audience: [contributors, agents]
authority: canonical
---

# Repository topology canon

Single readable reference for where repos live on disk, what role they play in the fleet, which code layout fits each shape, and how READMEs should read. Clean Architecture is a mental model, not a folder structure (Paul Iusztin). Boundaries follow what code does: workflows, tools, state, I/O adapters. Layers are optional modules inside a package, not mandatory top-level siblings.

Companion audit: [`docs/internal/audits/2026-06-29-fleet-topology-readme-audit.md`](../internal/audits/2026-06-29-fleet-topology-readme-audit.md).

## A. Fleet axes

### `bucket` (ownership / disk)

Where the repo lives. `local_path` first segment MUST equal `bucket` for non-archived repos.

| Value | Meaning |
|-------|---------|
| `products` | Shipped or shipping user products |
| `ventures` | Product bets and venture surfaces |
| `research` | Scientific and R&D code |
| `tools` | Platform, infra, internal tooling |
| `personal` | Portfolio and personal projects |
| `family` | Family-operated sites |
| `jobs-projects` | Employer engagement workspaces |

### `type` (functional role)

What the repo does in the architecture diagram. Independent of `bucket`.

| Value | Meaning |
|-------|---------|
| `governance` | Fleet control plane (hub) |
| `infra` | Shared platform other repos depend on |
| `product` | User-facing application or site |
| `research` | Reproducible research artifact |
| `tooling` | CLI, library, or eval harness consumed by agents or CI |
| `archive` | Frozen or employer archive; read-mostly |

**Legal:** `bucket=ventures` + `type=product` (attributa). **Illegal:** `bucket=tools` + disk `ventures/attributa`.

### Archive convention

`status=archived` and `type=archive`. Disk under `_archive/<YYYY-MM-slug>/`. `bucket` keeps pre-archive ownership for history. `local_path` MUST point at the real archive folder.

---

## B. Archetype catalog

Eleven archetypes subsume all `repo_archetype` values in `catalog/repos.json`. Pick one primary archetype per repo. Optional notes capture hybrid reality.

### 1. `governance-hub`

**When:** Fleet SSOT, catalog, validators, prompt kits. One repo: `alawein`.

**Tree:**
```text
catalog/           # repos.json, generated projects.json
docs/governance/   # doctrine
scripts/doctrine/  # validators
templates/         # scaffolding
prompt-kits/
```

**README contract:** Custom (org profile at root is fine). Internal operator doc may follow tooling template. Waiver from product/research/tooling section validator.

**Anti-patterns:** Treating hub README as a normal product README. Duplicating catalog tables in prose.

**Migration ladder:** Document-only. No `src/` moves.

---

### 2. `vite-react-spa`

**When:** Vite + React (+ Tailwind) single-page app. Catalog: `vite-react-spa`.

**Tree:**
```text
src/
  components/
  pages/ | routes/
  hooks/
  lib/
public/
tests/
docs/
```

**README contract:** [`templates/scaffolding/README.product.md`](../../templates/scaffolding/README.product.md).

**Anti-patterns:** Empty `features/` folders. README trees that cite paths not on disk. Badge walls above the fold.

**Migration ladder:** Document actual tree in README Architecture section first. Refactor `src/` only when touch count justifies.

**Repos (12):** meshal-web, repz, gymboy, attributa, llmworks, atelier-rounaq, qmlab, simcore, loopholelab (hybrid: also static `web/`).

---

### 3. `next-app-router`

**When:** Next.js App Router product or docs surface. Catalog: `next-app-router`.

**Tree:**
```text
app/ | src/app/
components/
lib/
public/
tests/ | e2e/
docs/
```

**README contract:** Product template + Deployment section (Vercel or host).

**Anti-patterns:** Duplicating `DEPLOYMENT.md` verbatim in README. Mixing Pages and App router without documenting which wins.

**Migration ladder:** Link to `docs/architecture.md` before any `src/` reshuffle.

**Repos (4):** scribd, bolts, knowledge-base (infra docs-hub variant).

---

### 4. `node-monorepo`

**When:** Turborepo/npm workspaces with multiple packages and optional apps.

**Tree:**
```text
apps/              # deployable surfaces (web, storybook)
packages/          # shared libraries, CLI
turbo.json
docs/
```

**README contract:** Product template if user-facing (veyra); tooling template if platform (design-system, prompty, handshake).

**Anti-patterns:** One-file packages created "for symmetry." README package table missing workspace members (handshake `alloy` gap).

**Repos (5):** design-system, prompty, veyra, handshake-hai.

---

### 5. `python-research-package`

**When:** Installable Python library or notebook-driven research. Catalog: `python-library`.

**Tree:**
```text
src/<pkg>/         # or <pkg>/ at root when historical
  core/            # algorithms, models (role-based, not "domain" ceremony)
  io/ | adapters/  # file formats, external APIs (when earned)
tests/
notebooks/         # optional
docs/
data/              # small fixtures only; large data external
```

**README contract:** [`templates/scaffolding/README.research.md`](../../templates/scaffolding/README.research.md).

**Anti-patterns:** `domain/` with one file. Copying full Clean Architecture layer stack. Multiple competing import roots (`Python/` vs `src/` without STRUCTURE_DECISION).

**Migration ladder:** Add `docs/architecture/topology.md` with actual tree. Consolidate import root only when imports are painful.

**Repos (11):** alembiq, optiqap, qmatsim, qubeml, scicomp, spincirc, maglogic, quantumalgo, mercor (mis-tagged; see catalog-collection).

---

### 6. `python-agent-service`

**When:** Python service with agents, MCP, workflows, or eval pipelines. Catalog: `python-service` where agent boundaries dominate.

**Tree:**
```text
src/<pkg>/
  workflows/       # orchestration, graphs, pipelines
  tools/           # callable capabilities (thin)
  domain/          # types, invariants (only if earned)
  adapters/        # LLM, DB, HTTP, filesystem I/O
  config/
tests/
docs/
```

Layers are optional modules inside `src/<pkg>/`, not mandatory top-level siblings.

**README contract:** Tooling template for `type=tooling` (fallax). Research template for `type=research` with Runtime + Reproducibility emphasized.

**Anti-patterns:** MCP servers as unexplained top-level dirs (provegate: document as intentional). `infrastructure/` folder with only `__init__.py`.

**Repos (5):** adil, provegate, fallax, edfp (hybrid web), workspace-tools (platform CLI variant).

---

### 7. `python-platform-cli`

**When:** Workspace automation, batch scripts, control-plane CLIs without agent orchestration. Catalog: `python-service` on infra repos.

**Tree:**
```text
<package>/         # importable package
  cli/
  config/
tests/
pyproject.toml
docs/
```

**README contract:** Tooling template.

**Repos (1):** workspace-tools.

---

### 8. `static-site`

**When:** HTML/CSS/JS or built static site without SPA framework. Catalog: `static-site`.

**Tree:**
```text
index.html
js/ css/ assets/
scripts/           # build, figure regen
docs/
```

**README contract:** Research template (education/repro focus).

**Repos (1):** chshlab.

---

### 9. `game-project`

**When:** Godot or engine-centric game repo. Catalog: `game-project`.

**Tree:**
```text
project.godot
scenes/ scripts/ assets/
prototype/ qa/ tools/
docs/
```

**README contract:** Product template; Deployment optional (`surface: service`).

**Repos (1):** roka-oakland-hustle.

---

### 10. `research-archive`

**When:** Frozen research, document-heavy archives, minimal active code. Catalog: `research-archive`.

**Tree:**
```text
docs/
.archive/          # optional cold storage
governance files (SSOT, LESSONS)
```

**README contract:** Minimal archive README (Status, boundary rules, docs map). Not full research template.

**Repos (2):** helios, meatheadphysicist (active code but archive-shaped catalog; note hybrid).

---

### 11. `catalog-collection`

**When:** Employer or engagement monorepo: YAML catalog + `projects/` subtrees. Not in `repo_archetype` today; add to catalog metadata.

**Tree:**
```text
engagement.yaml
projects/
  <project>/
    project.yaml
    docs/
CLAUDE.md AGENTS.md
```

**README contract:** Tooling template sections: Purpose, Structure, Add work, Separation policy. Framework header or YAML frontmatter (pick one in Wave 0).

**Repos (3):** mercor, turing, handshake-hai.

---

## Archetype map (all 37 repos)

| Slug | Primary archetype | Catalog `repo_archetype` | Notes |
|------|-------------------|--------------------------|-------|
| alawein | governance-hub | docs-hub | Profile README exempt |
| meshal-web | vite-react-spa | vite-react-spa | |
| repz | vite-react-spa | vite-react-spa | |
| gymboy | vite-react-spa | vite-react-spa | |
| scribd | next-app-router | next-app-router | |
| bolts | next-app-router | next-app-router | |
| atelier-rounaq | vite-react-spa | vite-react-spa | |
| attributa | vite-react-spa | vite-react-spa | Move catalog to ventures |
| llmworks | vite-react-spa | vite-react-spa | Move catalog to ventures |
| veyra | node-monorepo | node-monorepo | |
| roka-oakland-hustle | game-project | game-project | |
| edfp | python-agent-service | python-service | + frontend/backend hybrid |
| alembiq | python-research-package | python-library | |
| optiqap | python-research-package | python-library | Large archive/ imports |
| qmlab | vite-react-spa | vite-react-spa | |
| simcore | vite-react-spa | vite-react-spa | |
| meatheadphysicist | research-archive | research-archive | Active FastAPI; document hybrid |
| adil | python-agent-service | python-service | Legal-ops CLI |
| qmatsim | python-research-package | python-library | |
| qubeml | python-research-package | python-library | |
| scicomp | python-research-package | python-library | Multi-language roots |
| spincirc | python-research-package | python-library | |
| maglogic | python-research-package | python-library | |
| chshlab | static-site | static-site | |
| helios | research-archive | research-archive | Path `_archive/2026-06-helios` |
| loopholelab | python-agent-service | vite-react-spa | Re-tag archetype; static web + API |
| provegate | python-agent-service | python-service | MCP at root |
| quantumalgo | python-research-package | python-library | |
| fallax | python-agent-service | python-service | type=tooling |
| design-system | node-monorepo | node-monorepo | type=infra |
| workspace-tools | python-platform-cli | python-service | type=infra |
| knowledge-base | next-app-router | next-app-router | type=infra, docs-hub surface |
| incore | python-research-package | python-library | type=tooling; rename drift inventory/incore |
| prompty | node-monorepo | node-monorepo | type=tooling |
| mercor | catalog-collection | python-library | Slug `mercor`; active tooling at `jobs-projects/mercor` |
| handshake-hai | catalog-collection | node-monorepo | |
| turing | catalog-collection | docs-hub | |

---

## C. README unification spec

### Header block (do not break)

Every repo except hub profile and archive waivers MUST keep the Repo Framework header validated by `validate-repo-framework.py`:

```markdown
Status: <enum>
Category: <bucket>
Owner: <enum>
Visibility: public|private
Purpose: <one line>
Next action: continue|refactor|merge|archive|delete
```

`Category` MUST match catalog `bucket` after Wave 0 truth-up.

### Section order by `type`

| type | Order (H2 names) | Template |
|------|------------------|----------|
| product | Value proposition → Demo and status → Quick start → Architecture → Deploy (if web) → Docs map → Ownership | `README.product.md` |
| research | Abstract → Status → Runtime requirements → Reproducibility → Datasets → Docs map | `README.research.md` |
| tooling | Purpose → Install → Commands → Architecture → Docs map → Consumers → Release and versioning | `README.tooling.md` |
| infra | Same as tooling | `README.tooling.md` |
| governance | Purpose → Catalog SSOT → Validators → Docs map | New `README.governance.md` (Wave 0) |
| archive | Status → Archive reason → Contents → Access rules → Docs map | New `README.archive.md` (Wave 0) |

### Architecture section rules

- 5 to 15 lines in README.
- ASCII tree of **actual** layout on `origin/main`, not aspirational.
- Link to `docs/architecture.md` or `docs/architecture/topology.md`.
- No duplicate of full architecture doc in README.

### Docs map rules

- Bullet links only to files that exist on `origin/main`.
- README = front door. `docs/README.md` = index. No duplicated intro paragraphs.
- Standard minimum: `docs/README.md`, `SSOT.md`, `LESSONS.md` where those files exist.

### Voice and presentation

<!-- voice-check:ignore-start -->
Per [`docs/style/VOICE.md`](../style/VOICE.md): no em dashes, no banned register (`comprehensive`, `robust`, `leverage`, `streamline`, `seamless`, etc.). No badge walls (cap: 2 CI badges + license). No AI slop closings.
<!-- voice-check:ignore-end -->

### Tiered compliance (migration)

| Tier | Rule |
|------|------|
| Tier 1 | Framework header + alias map (e.g. `Public value` counts as Value proposition / Abstract) |
| Tier 2 | Exact template H2 names |

Wave 1 targets Tier 1. Wave 2+ tightens to Tier 2.

**Alias map (Tier 1):**

| Template | Accepted aliases |
|----------|------------------|
| Value proposition | Public value, What it does, What ships |
| Quick start | Setup, Development, Install |
| Docs map | Documentation, Governance |
| Abstract | Public value, About, The Problem |
| Purpose | What it owns, Public value |

### Before / after exemplars (prose only)

**Small repo: `maglogic` (research, python-research-package)**

*Before:* `## Public value`, `## About`, `## Features`, long install prose, documentation links buried mid-file.

*After:* Framework header unchanged. `## Abstract` (two sentences on magnetic logic simulation). `## Status` (frozen, last verified). `## Runtime requirements` (Python version, OOMMF/Mumax3 optional). `## Reproducibility` (pytest command, figure regen script). `## Datasets` (pointer to `data/` policy). `## Docs map` (three bullets). `## Architecture` with 8-line ASCII tree of `python/maglogic/`, `oommf/`, `docs/architecture/`.

**Large repo: `optiqap` (research, python-research-package)**

*Before:* `## Publication boundaries`, `## Core surfaces`, multiple quick-start blocks, README longer than architecture doc summary.

*After:* Abstract leads with QAP solver claim. Status block separates maintained code from archived `imports/`. Runtime lists Python, optional HPC deps. Reproducibility points to verification script and paper build. Architecture section links `docs/ARCHITECTURE.md` and shows only top-level roles: `src/qaplibria/`, `services/`, `api/`, `research/` (no aspirational renames). Docs map stays short; detail remains in `docs/README.md`.

---

## D. Validator follow-ups

| Validator | Status | Notes |
|-----------|--------|-------|
| `validate-topology.py` | Shipped | Hub `docs-doctrine.yml`; bucket/path/slug/archive checks |
| `validate-readme-topology.py` | Shipped | Tier 1 aliases, `docs/architecture/topology.md` tree check; `--github-api`, `--workspace-root`, `--repo-path` modes |
| Extend `validate-repo-framework.py` | Open | Cross-check `Category` vs catalog `bucket` |
| Per-repo doctrine CI | Shipped | `doctrine-reusable.yml` runs README topology on each adopting repo |
| Voice linter | Open | README scope on changed files |

Fleet scan runs on hub schedule/PR via GitHub API (`main`). Local fleet scan: `python scripts/doctrine/validate-readme-topology.py --workspace-root <fleet-root>`.

---

## Execution waves (summary)

| Wave | Scope | Deliverable |
|------|-------|-------------|
| 0 | Hub only | This canon + audit + repos.json truth-up + topology validator |
| 1 | Per repo (parallel) | `docs/readme-topology-unify` branch, template + voice + real ASCII tree |
| 2 | Per repo | `docs/architecture/topology.md` where linked but missing/stale |
| 3 | Opt-in | Code layout moves per repo approval |

---

## PDF research note

`repos-topology.pdf` (Deep Research) is image-only in this environment. Principles applied here match its stated intent: role-based boundaries, iteration-friendly structure, agent systems bounded at workflows/tools/state/adapters, and rejection of ceremonial Java-style layer folders. Reconcile any future text extraction with this canon before changing archetype names.
