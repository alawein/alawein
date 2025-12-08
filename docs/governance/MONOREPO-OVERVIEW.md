# Monorepo Overview & Cleanup Plan

## Current State Analysis

### Directory Structure

```
GitHub/                           # Root monorepo
├── 📁 LLCs (Business Platforms)
│   ├── organizations/alawein-technologies-llc/ # 11 projects, 3160 items
│   │   ├── attributa/            # AI content attribution
│   │   ├── foundry/              # ???
│   │   ├── helios/               # ???
│   │   ├── librex/               # Optimization library
│   │   ├── llmworks/             # LLM tooling
│   │   ├── marketing-automation/ # Marketing tools
│   │   ├── mezan/                # ???
│   │   ├── qmlab/                # Quantum ML lab
│   │   ├── simcore/              # Scientific computing
│   │   └── talai/                # AI assistant
│   │
│   ├── organizations/live-it-iconic-llc/       # 1 project, 622 items
│   │   └── liveiticonic/         # Lifestyle brand
│   │
│   └── organizations/repz-llc/                 # 1 project, 885 items
│       └── repz/                 # Fitness coaching
│
├── 📁 Research (Academic)
│   └── research/                 # 841 items
│       ├── benchmarks/
│       ├── maglogic/             # Magnetic logic
│       ├── qmatsim/              # Quantum materials sim
│       ├── qubeml/               # Quantum ML
│       ├── scicomp/              # Scientific computing (587 items!)
│       └── spincirc/             # Spintronics circuits
│
├── 📁 Platforms (Full-stack Apps)
│   └── organizations/alawein-technologies-llc/platforms/
│       └── portfolio/            # Cyberpunk portfolio (moved from Desktop)
│
├── 📁 Family
│   └── family-organizations/alawein-technologies-llc/platforms/         # Family websites
│       └── organizations/alawein-technologies-llc/apps/                 # 10 family apps
│
├── 📁 Documentation & Templates
│   └── docs/                     # 324 items
│       ├── ai-knowledge/         # AI prompts, rules, workflows (126 items)
│       ├── app/                  # Studios hub (React)
│       ├── pages/                # Static HTML pages
│       │   ├── templates/        # Generic templates
│       │   └── brands/           # Brand landing pages
│       └── [many .md files]      # Scattered documentation
│
├── 📁 AI & Automation (SCATTERED!)
│   ├── automation/               # Python automation CLI (137 items)
│   ├── tools/                    # Mixed tooling (243 items)
│   │   ├── ai/                   # AI tools (41 items)
│   │   ├── orchex/               # Orchestration (76 items)
│   │   ├── meta-prompt/          # Prompt tools
│   │   ├── prompt-composer/
│   │   ├── prompt-testing/
│   │   ├── adaptive-prompts/
│   │   ├── cross-ide-sync/
│   │   └── templates/            # More templates (21 items)
│   └── docs/ai-knowledge/        # DUPLICATE? AI knowledge
│
├── 📁 Hidden/Config Directories
│   ├── .ai/                      # Empty
│   ├── .ai-system/               # Empty
│   ├── .cascade/                 # Empty
│   ├── .metaHub/                 # Empty
│   ├── .orchex/                  # Empty
│   └── .github/                  # GitHub workflows (48 items)
│
└── 📁 Root Files (CLUTTERED!)
    ├── 50-PHASE-IMPROVEMENT-PLAN.md
    ├── AUGMENT-STRATEGIC-ANALYSIS-REQUEST.md
    ├── BUDGET_RESOURCE_PLAN.md
    ├── CLAUDE.md
    ├── EXECUTIVE_PRESENTATION.md
    ├── FAMILY_WEBSITES_STRATEGIC_PLAN.md
    ├── IMPLEMENTATION-COMPLETE.md
    ├── PHASE-2-DOCUMENTATION-ARCHITECTURE.md
    ├── PHASE-3-CODE-QUALITY-FRAMEWORK.md
    ├── PHASE-4-TESTING-INFRASTRUCTURE.md
    ├── PHASE-5-CI-CD-PIPELINE-ENHANCEMENT.md
    ├── PLATFORMS-REGISTRY-README.md
    ├── PROJECT-DISCOVERY-PROMPT.md
    ├── PROJECT-PLATFORMS-CONFIG.ts
    ├── PROJECT_DASHBOARD.md
    ├── REPOSITORY-MANIFEST.md
    ├── REPOSITORY-STRUCTURE-CORRECTED.md
    ├── REPOSITORY-STRUCTURE-FLAT-LLC.md
    ├── RESTRUCTURE-GITHUB.md
    ├── TECHNICAL_SPECIFICATIONS.md
    └── [many more...]
```

---

## Issues Identified

### 1. **AI Systems Scattered**

- `automation/` - Python CLI for AI automation
- `tools/ai/` - TypeScript AI tools
- `tools/orchex/` - Orchestration system
- `tools/prompts/meta/` - Prompt tools
- `tools/prompts/composer/` - More prompt tools
- `tools/prompts/adaptive/` - Even more prompt tools
- `docs/ai-knowledge/` - AI prompts and rules
- `docs/ai-knowledge/prompts/` - 75 prompts!
- Empty dirs: `.ai/`, `.ai-system/`, `.cascade/`, `.orchex/`

### 2. **Templates Scattered**

- `docs/pages/templates/` - HTML templates (4)
- `tools/templates/` - 21 items
- `docs/ai-knowledge/templates/` - AI templates
- `docs/templates/` - 1 item

### 3. **Root Directory Cluttered**

- 30+ markdown files at root level
- Many are planning/phase documents that should be archived
- Config files mixed with documentation

### 4. **Duplicate/Overlapping Concerns**

- `scicomp/` in research vs `simcore/` in alawein-technologies
- Multiple prompt systems
- Multiple template systems

### 5. **Empty Hidden Directories**

- `.ai/`, `.ai-system/`, `.cascade/`, `.metaHub/`, `.orchex/`
- Should be removed or populated

### 6. **Missing Full-Stack Implementations**

- Most LLC projects lack web frontends
- Only `organizations/alawein-technologies-llc/platforms/portfolio` has a full React app
- Brand pages in `docs/pages/brands/` are static HTML only

---

## Proposed Clean Structure

```
GitHub/
├── .github/                      # GitHub config & workflows
├── automation/                   # CONSOLIDATED AI automation
│   ├── cli/                      # CLI tools (Python + TS)
│   ├── prompts/                  # ALL prompts consolidated
│   ├── agents/                   # Agent definitions
│   ├── workflows/                # Workflow definitions
│   └── orchestration/            # Orchestration patterns
│
├── organizations/alawein-technologies-llc/platforms/                    # FULL-STACK IMPLEMENTATIONS
│   ├── portfolio/                # ✅ Done - Cyberpunk portfolio
│   ├── simcore/                  # Scientific computing app
│   ├── repz/                     # Fitness coaching app
│   ├── liveiticonic/             # Lifestyle brand app
│   ├── talai/                    # AI assistant app
│   └── [other apps]/
│
├── packages/                     # SHARED LIBRARIES
│   ├── librex/                   # Optimization library
│   ├── llmworks/                 # LLM utilities
│   ├── ui/                       # Shared UI components
│   └── config/                   # Shared configs
│
├── research/                     # ACADEMIC RESEARCH
│   ├── scicomp/                  # Scientific computing
│   ├── qubeml/                   # Quantum ML
│   └── [other research]/
│
├── docs/                         # DOCUMENTATION
│   ├── guides/                   # User guides
│   ├── api/                      # API docs
│   ├── architecture/             # Architecture docs
│   └── pages/                    # Static web pages
│       ├── templates/            # HTML templates
│       └── brands/               # Brand landing pages
│
├── family/                       # FAMILY PROJECTS
│   └── [family apps]/
│
├── archive/                      # OLD/COMPLETED PLANS
│   └── [phase docs, old plans]
│
├── README.md                     # Main readme
├── CLAUDE.md                     # AI instructions
└── [minimal config files]
```

---

## Action Items

### Phase 1: Consolidate AI Systems

- [ ] Merge `tools/ai/`, `tools/orchex/`, `tools/prompts/meta/`, etc. into `automation/`
- [ ] Consolidate all prompts into `automation/prompts/`
- [ ] Remove empty hidden directories
- [ ] Create single AI CLI entry point

### Phase 2: Clean Root Directory

- [ ] Move phase/planning docs to `archive/`
- [ ] Move technical specs to `docs/architecture/`
- [ ] Keep only essential files at root

### Phase 3: Organize Platforms

- [ ] Move full-stack apps to `organizations/alawein-technologies-llc/platforms/`
- [ ] Keep libraries in `packages/`
- [ ] Keep research separate

### Phase 4: Consolidate Templates

- [ ] Merge all template systems
- [ ] Create clear template categories:
  - HTML page templates
  - AI prompt templates
  - Project scaffolding templates

### Phase 5: Full-Stack Development

- [ ] Create web apps for key platforms:
  - SimCore (interactive simulations)
  - REPZ (fitness tracking)
  - TalAI (AI assistant UI)
  - LiveItIconic (lifestyle brand)

---

## Platform Development Status - CORRECTED!

**ALL PLATFORMS ARE FULLY BUILT!** They're just buried in LLC folders:

| Platform         | Location                                                      | Frontend                   | Backend     | Status    |
| ---------------- | ------------------------------------------------------------- | -------------------------- | ----------- | --------- |
| **Portfolio**    | `organizations/alawein-technologies-llc/platforms/portfolio/` | ✅ React (src: 100+ files) | -           | **Ready** |
| **SimCore**      | `organizations/alawein-technologies-llc/simcore/`             | ✅ React (src: 258 items)  | ✅ Supabase | **Ready** |
| **REPZ**         | `organizations/repz-llc/repz/`                                | ✅ React (src: 484 items!) | ✅ Supabase | **Ready** |
| **LiveItIconic** | `organizations/live-it-iconic-llc/liveiticonic/`              | ✅ React (src: 425 items)  | ✅ Supabase | **Ready** |
| **Attributa**    | `organizations/alawein-technologies-llc/attributa/`           | ✅ React (src: 165 items)  | ✅ Supabase | **Ready** |
| **TalAI**        | `organizations/alawein-technologies-llc/talai/`               | ✅ React (src: 708 items!) | ✅ Supabase | **Ready** |
| **QMLab**        | `organizations/alawein-technologies-llc/qmlab/`               | ✅ React                   | ✅ Supabase | **Ready** |
| **LLMWorks**     | `organizations/alawein-technologies-llc/llmworks/`            | ✅ React                   | ✅ Supabase | **Ready** |
| **Librex**       | `organizations/alawein-technologies-llc/librex/`              | ✅ React                   | ✅ Python   | **Ready** |
| **Helios**       | `organizations/alawein-technologies-llc/helios/`              | ✅ React                   | ✅ Python   | **Ready** |
| **MEZAN**        | `organizations/alawein-technologies-llc/mezan/`               | ✅ React                   | ✅ Supabase | **Ready** |

### To Run Any Platform:

```bash
cd organizations/alawein-technologies-llc/simcore && npm install && npm run dev
cd organizations/repz-llc/repz && npm install && npm run dev
cd organizations/live-it-iconic-llc/liveiticonic && npm install && npm run dev
# etc.
```

---

## Next Steps

1. **Immediate**: Clean up root directory
2. **Short-term**: Consolidate AI systems
3. **Medium-term**: Build full-stack apps for top platforms
4. **Long-term**: Unified deployment pipeline
