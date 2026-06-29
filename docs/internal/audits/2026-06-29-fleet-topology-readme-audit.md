---
type: internal
status: draft
last_updated: 2026-06-29
owner: meshal
audience: [contributors, agents]
---

# Fleet topology and README audit (2026-06-29)

Phase 1 audit of all 37 catalogued repos against `origin/main`. Six parallel bucket agents plus one cross-fleet README template pass. Primary design input PDF (`repos-topology.pdf`) is image-only; findings reconcile with `catalog/repos.json`, the 2026-06-23 topology consolidation spec, and on-disk layout.

## Executive summary

| Dimension | Finding |
|-----------|---------|
| Catalog vs disk | Five drift cases fixed on branch `feat/topology-validator` (attributa, llmworks, helios, handshake-hai path; mercor re-slugged) |
| Framework headers | 34/37 repos have the six-field Repo Framework block on `origin/main` at audit time |
| Template sections | 0/37 strict match to scaffolding H2 names; ~60% use a de-facto rollout dialect (`Public value`, `Quick start`, `Governance`) |
| Architecture docs | 30+ repos have `docs/architecture.md` or equivalent; gaps: knowledge-base, incore, prompty, spincirc, qubeml, handshake-hai (stub) |
| Dirty working trees | 10 repos skipped for Wave 1 edits (audit used `origin/main` only) |
| `validate-topology.py` | Shipped on `feat/topology-validator`; data checks pass for 37 repos |

## Fleet axes (confirmed)

- **`bucket`**: ownership / life-area. Drives disk folder (`products/`, `ventures/`, etc.).
- **`type`**: functional role (`product`, `research`, `tooling`, `infra`, `governance`, `archive`). Drives architecture grouping.
- Disagreement between `bucket` and `type` is legal (24/37 repos). Disagreement between `bucket`, `local_path`, and disk is a bug.

## Topology drift register

Resolved on Wave 0 (`feat/topology-validator` / PR #143):

| Slug | Was | Now |
|------|-----|-----|
| attributa | `tools/attributa` | `ventures/attributa` |
| llmworks | `tools/llmworks` | `ventures/llmworks` |
| helios | `research/helios` | `_archive/2026-06-helios` |
| handshake-hai | `jobs-projects/handshake` | `jobs-projects/handshake-hai` |
| mercor | slug `mercor-llm-failsafe`, type archive | slug `mercor`, active tooling at `jobs-projects/mercor` |

Remaining follow-ups: GitHub remote names (`alawein/handshake` vs catalog slug), README Category fields on ventures repos, hub auto-generated topology block refresh.

## README template conformance

**Strict (exact H2 names):** 0/37 aligned.

**Framework header:** 34/37. Missing: loopholelab, handshake-hai (no framework block), alawein (org profile README, exempt).

**De-facto rollout dialect** (semantic overlap, different headings):

```
## Public value | What it does
## Quick start | Development
## Layout | Structure | Runtime boundaries
## Governance | Documentation
```

**Cross-fleet stats:** 13 repos with badge walls (3+ shields); 1 voice issue (`alembiq` em dash in diagram); 0 root/docs README duplication.

### Best exemplars (semantic, not strict)

| Repo | Why |
|------|-----|
| workspace-tools | Maps fully to tooling template intent |
| scribd, bolts | Product value, quick start, layout, governance |
| scicomp, maglogic | Research surfaces, reproducibility hints, docs links |
| knowledge-base | Infra operator README with layout and boundaries |

### Worst drift

| Repo | Issue |
|------|-------|
| handshake-hai | No framework header; README omits `alloy` package |
| incore | Stub README; missing docs/README, SSOT, LESSONS |
| veyra | No docs entry point; no architecture doc |
| mercor | Catalog archive vs active employer catalog |
| alawein | Profile README (correctly custom; needs governance template waiver) |

## Per-bucket findings

### Ventures (6)

| Slug | Archetype | README | Topology | Notes |
|------|-----------|--------|----------|-------|
| adil | python-service | Partial research shape | Clean | Sparse docs/INDEX.md |
| attributa | vite-react-spa | Weak product | **Drift** tools vs ventures | README tree stale (`src/app/` missing) |
| llmworks | vite-react-spa | Weak product | **Drift** | README cites missing `src/stores/` etc. |
| loopholelab | vite-react-spa | Hybrid install doc | Clean path | No framework header; archetype understates Python+FastAPI+static web |
| provegate | python-service | Tooling-shaped | Clean | MCP servers at repo root, no `src/` |
| veyra | node-monorepo | Minimal stub | Clean | Missing docs/README, architecture |

### Products, personal, family (7)

| Slug | Archetype | README | Topology | Dirty |
|------|-----------|--------|----------|-------|
| repz | vite-react-spa | ~3/7 product sections | Clean | No |
| gymboy | vite-react-spa | ~3/7 | Clean | **Yes** |
| scribd | next-app-router | ~4/7 | Clean | No |
| bolts | next-app-router | ~4/7 | Clean | No |
| meshal-web | vite-react-spa | ~3/7 | Clean | No |
| roka-oakland-hustle | game-project | Game-specific | Clean | No |
| atelier-rounaq | vite-react-spa | ~3/7 | Clean | No |

All seven: framework header present; `Category` matches `bucket`. None use canonical section names.

### Research (15)

| Slug | Archetype | README | Topology | Dirty |
|------|-----------|--------|----------|-------|
| edfp | python-service | Portfolio dialect | lifecycle metadata drift | **Yes** |
| alembiq | python-library | Upstream-style | Clean | No |
| optiqap | python-library | Portfolio dialect | status label drift | **Yes** |
| qmlab | vite-react-spa | Portfolio dialect | frozen vs active property | No |
| simcore | vite-react-spa | Portfolio dialect | Clean | No |
| meatheadphysicist | research-archive | Portfolio dialect | archetype vs active service | No |
| qmatsim | python-library | Portfolio dialect | frozen metadata | No |
| qubeml | python-library | No docs section | No architecture.md | No |
| scicomp | python-library | Strong docs links | frozen metadata | No |
| spincirc | python-library | No docs section | No architecture.md | No |
| maglogic | python-library | Strong | frozen metadata | No |
| chshlab | static-site | Operator doc | visibility drift | **Yes** |
| helios | research-archive | Archive boundary | **path drift** | N/A (archive) |
| quantumalgo | python-library | Good doc list | project-layout not architecture.md | No |
| fallax | python-service | Marketing/benchmark | type tooling vs Category research | No |

### Tools (5)

| Slug | Type | Archetype | README | Dirty |
|------|------|-----------|--------|-------|
| design-system | infra | node-monorepo | Custom operator doc | **Yes** |
| workspace-tools | infra | python-service | Strong semantic fit | **Yes** |
| knowledge-base | infra | next-app-router | Custom; no architecture.md | **Yes** |
| incore | tooling | python-library | Critical stub | No |
| prompty | tooling | node-monorepo | Partial (Install, Architecture) | **Yes** |

Hub `docs/architecture.md` still describes knowledge-base with Supabase; repo uses filesystem `db/`.

### Jobs-projects and hub (4)

| Slug | Type | README | Topology | Dirty |
|------|------|--------|----------|-------|
| mercor-llm-failsafe | archive | Catalog-collection | Slug/repo/archive mismatch | **Yes** |
| handshake-hai | tooling | Monorepo catalog | Path/slug/remote drift | No WT |
| turing | tooling | Catalog-collection | README lists scicode/ not on main | **Yes** |
| alawein | governance | Org profile | 5 catalog drifts open | Clean on GitHub |

## Code layout patterns (actual, not aspirational)

| Pattern | Repos | Smell |
|---------|-------|-------|
| `src/<pkg>/` flat features | attributa, llmworks, repz, simcore | Fine for SPAs |
| `app/` or `src/app/` Next | scribd, bolts, knowledge-base | Framework-native |
| Root MCP server dirs | provegate | Works for agent tooling; not `python-service` shaped |
| `packages/` + `apps/` Turbo | design-system, prompty, veyra, handshake | Standard monorepo |
| Multi-language roots | scicomp, maglogic, spincirc | Earned boundaries by language |
| `projects/` catalog layout | mercor, turing, handshake | Employer engagement pattern |
| Godot root | roka-oakland-hustle | game-project |
| Static HTML root | chshlab | static-site |

No fleet-wide ceremonial `domain/application/infrastructure` top-level folders observed. Agent boundaries appear at `workflows/`, `tools/`, `adapters/` only where code volume justifies them (adil, alembiq partial).

## Docs map quality

| Tier | Criteria | Repos |
|------|----------|-------|
| A | `docs/README.md` + architecture + INDEX | attributa, llmworks, bolts, atelier-rounaq |
| B | `docs/README.md`, thin or missing INDEX | adil, provegate, most research cluster |
| C | No `docs/README.md` | veyra, incore, prompty, mercor, turing |
| D | Stub architecture | handshake-hai |

## Dirty repos (Wave 1 skip list)

| Path | Nature |
|------|--------|
| products/gymboy | Test/config WIP |
| research/edfp | `.claude/settings.json` |
| research/optiqap | Papers/arxiv artifacts |
| research/chshlab | Untracked review doc |
| tools/design-system | Large sync divergence |
| tools/workspace-tools | `mcps/docs/CLAUDE.md` |
| tools/knowledge-base | Career/resume churn |
| tools/prompty | Docs/packages WIP |
| jobs-projects/mercor | Large feat branch WIP |
| jobs-projects/turing | benchmarks/scicode untracked |

## Hub governance gaps

1. `validate-topology.py` not shipped (spec at `docs/internal/specs/2026-06-23-topology-consolidation-design.md`).
2. `docs/architecture.md` prose drift: "37+", "17 workflows", "33 product repos".
3. No two-axis legend in architecture doc yet.
4. README section validator does not exist (framework header only).

## Recommended Wave 0 (hub PR, no per-repo edits)

1. Publish `docs/governance/repo-topology-canon.md`.
2. Truth-up `catalog/repos.json` for 5 drift cases (user confirm attributa/llmworks bucket move).
3. Add topology legend to `docs/architecture.md`.
4. Implement `validate-topology.py` + fixture tests.
5. Land this audit doc.

## Agent references

Parallel audits: ventures (38611395), products/personal/family (69e4fa73), research (ffe9720d), tools (a7c256e1), jobs-projects/hub (e9c90a9e), cross-cut README (9be7ca9b).
