---
type: generated
source: scripts/generate-arch-diagram.py
sla: on-change
last-verified: 2026-04-30
last_updated: 2026-04-30
---

# Alawein Workspace Architecture

<!-- Prose sections are hand-maintained. Diagrams are auto-generated from
     catalog/repos.json + .github/workflows/ via scripts/generate-arch-diagram.py.
     To regenerate: python scripts/generate-arch-diagram.py -->

## System Context

`alawein/alawein` is the governance control plane for the `@alawein` GitHub org.
It owns CI policy templates, canonical prompt kits, voice contracts, docs doctrine,
and the catalog registry that governs 33+ sibling repos. No product code lives here.

```mermaid
graph TB
  subgraph alawein-org["@alawein GitHub Org (33+ repos)"]
    control["alawein/alawein\nControl Plane\n(CI templates · prompts · catalog)"]
    design["design-system\nTokens + UI packages\n(@alawein/tokens · @alawein/ui)"]
    workspace["workspace-tools\nCLI + Config packages\n(workspace-batch · eslint-config)"]
    kb["knowledge-base\nDashboard + DB\n(Next.js · Supabase)"]
    products["Product Repos (30+)\natelier-rounaq · meshal-web\nrepz · bolts · gymboy · …"]
    research["Research Repos\nquantumalgo · qmlab\nqubeml · simcore · …"]
  end

  claude["Claude Code\nAI Agent"]
  github["GitHub Actions\nCI/CD (17 workflows)"]
  notion["Notion\nTask + KB Sync"]
  vercel["Vercel\nDeployments"]

  control -->|"CI templates\ngithub-baseline.yaml"| products
  control -->|"CI templates\ngithub-baseline.yaml"| research
  control -->|"Style rules\nVale + doctrine"| products
  control -->|"Prompt kits\nAGENT.md"| claude
  control -->|"Workflows"| github
  github -->|"daily-digest\nnotion-sync"| notion
  products -->|"Deploy"| vercel
  kb -->|"Deploy"| vercel
  design -->|"npm packages"| products
  workspace -->|"CLI + config packages"| products
```


<!-- AUTO-GENERATED REPO TOPOLOGY START -->
<!-- last updated: 2026-05-04 — do not edit; run scripts/generate-arch-diagram.py -->

### Repo Topology (auto-generated from catalog/repos.json)

```mermaid
graph TB
  subgraph archive["Archive Repos"]
    helios["helios\nProprietary research archive for co"]
    mercor_llm_failsafe["mercor-llm-failsafe\nArchived employer project for LLM f"]
  end
  subgraph governance["Governance Repos"]
    alawein["alawein\nGovernance control plane, catalog S"]
  end
  subgraph infra["Infra Repos"]
    design_system["design-system\nShared design tokens, themes, UI co"]
    workspace_tools["workspace-tools\nWorkspace execution layer for scaff"]
    knowledge_base["knowledge-base\nSearchable discovery surface for re"]
  end
  subgraph product["Product Repos"]
    meshal_web["meshal-web\nPersonal site and portfolio with pr"]
    morphism["morphism\nCategory-theoretic AI governance wi"]
    repz["repz\nAI-powered coaching platform for fi"]
    gymboy["gymboy\nFitness coaching platform with a re"]
    scribd["scribd\nFitness publishing and content surf"]
    bolts["bolts\nFitness transformation plans with N"]
    atelier_rounaq["atelier-rounaq\nStudio and portfolio site for a lux"]
    attributa["attributa\nPrivacy-first attribution intellige"]
    more_product["… 2 more"]
  end
  subgraph research["Research Repos"]
    edfp["edfp\nPhysics-inspired video event detect"]
    alembiq["alembiq\nLLM training, alignment, evaluation"]
    optiqap["optiqap\nQuadratic Assignment Problem solver"]
    qmlab["qmlab\nQuantum ML web lab with React, Type"]
    simcore["simcore\nScientific simulation core for inte"]
    meatheadphysicist["meatheadphysicist\nComputational physics research plat"]
    adil["adil\nLegal-ops CLI for assembling, valid"]
    qmatsim["qmatsim\nQuantum material simulation researc"]
    more_research["… 7 more"]
  end
  subgraph tooling["Tooling Repos"]
    handshake_hai["handshake-hai\nLLM evaluation monorepo with shared"]
    fallax["fallax\nLLM adversarial reasoning evaluatio"]
  end
```

<!-- AUTO-GENERATED REPO TOPOLOGY END -->
## CI/CD Pipeline

Every push to `main` and every PR triggers this pipeline. Status checks gate merges.

```mermaid
flowchart LR
  trigger["Git Push / PR"]

  subgraph fast["Fast Gate (required for merge)"]
    ci["ci.yml\ndoc-contract · baseline-audit\nmarkdown lint"]
    secret["secrets-scan.yml\nGitleaks SARIF"]
  end

  subgraph audit["Audit Gate (PR + weekly)"]
    docs["docs-validation.yml\nVale · voice · doctrine\ncanonical-name audit · link check"]
    codeql["codeql.yml\n(opt-in per repo)"]
  end

  subgraph post-merge["Post-Merge Automation"]
    readme["readme-sync.yml\nauto-PR on drift"]
    catalog["github-metadata-sync.yml\ncohort rollout"]
    archgen["docs-auto-gen.yml\ndiagram refresh"]
  end

  trigger --> fast & audit
  fast & audit -->|"merge"| post-merge
```

## Prompt Kit Dependency Map

```mermaid
graph LR
  voice["VOICE.md\nforbidden register"]
  terms["terminology-registry.yaml\nVale linting rules"]
  agent["AGENT.md v1.3.0\nworkspace system prompt"]
  portfolio["PORTFOLIO.md v1.1.0\nmeshal-web prompt"]
  master["workspace-master-prompt.md v1.2.0\noperating contract"]
  repos["33 product repos\nvia AGENTS.md"]
  meshal["meshal-web\nportfolio site"]
  claude2["Claude Code sessions"]

  voice --> agent & portfolio
  terms --> agent
  master --> agent
  agent --> repos --> claude2
  portfolio --> meshal --> claude2
```

## Catalog & Registry Architecture

```mermaid
graph TD
  subgraph authored["Authored (canonical sources)"]
    repos_json["catalog/repos.json\n50+ repo metadata"]
    skills_yaml["catalog/skills.yaml\ncapability domains"]
    pk_registry["prompt-kits/registry.yaml\nprompt inventory"]
    baseline["github-baseline.yaml\nCI template manifest"]
  end

  subgraph generated["Generated (do not hand-edit)"]
    disc["catalog/generated/discovery-feed.json"]
    gh_meta["catalog/generated/github-metadata.json"]
    switcher["catalog/generated/repo-switcher.json"]
    arch_md["docs/architecture.md\n(this file — prose hand-maintained)"]
  end

  subgraph scripts["Generation Scripts"]
    build_cat["scripts/build-catalog.py"]
    gen_arch["scripts/generate-arch-diagram.py"]
    sync_readme["scripts/readme-sync.py"]
  end

  repos_json --> build_cat --> disc & gh_meta & switcher
  repos_json --> gen_arch --> arch_md
  repos_json --> sync_readme
```

## Governance Layer

```mermaid
graph TB
  subgraph enforcement["Enforcement Tiers (docs/governance/documentation-contract.md)"]
    blocking["Blocking\nAGENTS.md · CLAUDE.md · SSOT.md\nprompt-kits/ · .github/CODEOWNERS"]
    advisory["Advisory\nCode comments · commit messages\nmath notation"]
  end

  subgraph freshness["Freshness SLAs"]
    canonical["Canonical docs: ≤ 30 days\n(last-verified field)"]
    managed["Managed docs: ≤ 90 days\n(last_updated field)"]
    exempt["Exempt: README.md · docs/README.md\n.github/* · generated outputs"]
  end

  precommit["pre-commit-doctrine.sh\nnaming + header gate"]
  ci_gate["ci.yml\ndoc-contract + baseline-audit"]
  docs_gate["docs-validation.yml\nVale + voice + doctrine + links"]

  blocking --> precommit --> ci_gate --> docs_gate
```

## Key File Index

| Path | Purpose |
|------|---------|
| `github-baseline.yaml` | CI template manifest — which repos use which template |
| `catalog/repos.json` | Canonical repo registry (50+ repos, full metadata) |
| `catalog/skills.yaml` | Capability domain registry |
| `prompt-kits/AGENT.md` | Workspace system prompt (v1.3.0) |
| `prompt-kits/PORTFOLIO.md` | meshal-web system prompt (v1.1.0) |
| `prompt-kits/registry.yaml` | Prompt inventory with rollout status |
| `docs/governance/workspace-master-prompt.md` | 6-rule operating contract |
| `docs/governance/documentation-contract.md` | Doc class SLAs and naming rules |
| `docs/governance/prompt-rollout.md` | Prompt versioning and rollout protocol |
| `docs/style/VOICE.md` | Canonical voice contract (forbidden/preferred register) |
| `docs/style/terminology-registry.yaml` | Vale linting source |
| `scripts/validate-doctrine.py` | Full-repo doc doctrine validator |
| `scripts/validate-prompt-kit.py` | Prompt kit structure + frontmatter validator |
| `scripts/github-baseline-audit.py` | Action pinning + CI coverage auditor |
| `scripts/generate-arch-diagram.py` | This diagram's source generator |
| `.github/rulesets/main-protection.json` | Branch ruleset definition (apply via GitHub UI) |
