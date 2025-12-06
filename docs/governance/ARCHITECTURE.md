# Monorepo Architecture

> **Last Updated:** 2024-12-06 (Post-Migration)

## Final Directory Structure

```
GitHub/
│
├── 📁 organizations/                            # LLC-ORGANIZED PROJECTS
│   │
│   ├── 📁 alawein-technologies-llc/             # ALAWEIN TECHNOLOGIES LLC
│   │   │
│   │   ├── 📁 saas/                             # SaaS Platforms (React/Vite + Supabase)
│   │   │   ├── attributa/                       # AI content attribution
│   │   │   ├── llmworks/                        # LLM evaluation platform
│   │   │   ├── portfolio/                       # Portfolio monorepo
│   │   │   └── qmlab/                           # Quantum ML lab
│   │   │
│   │   ├── 📁 mobile-apps/                      # Hybrid Apps (Capacitor iOS/Android + Web)
│   │   │   └── simcore/                         # Scientific computing platform
│   │   │
│   │   ├── 📁 packages/                         # Python Libraries (PyPI)
│   │   │   ├── design-system/                   # Shared UI components
│   │   │   ├── helios/                          # Research discovery engine
│   │   │   ├── librex/                          # QAP optimization solver
│   │   │   └── mezan/                           # ML/AI DevOps platform
│   │   │
│   │   ├── 📁 research/                         # Research Platforms
│   │   │   └── talai/                           # 40+ module research system
│   │   │
│   │   ├── 📁 incubator/                        # Product Incubators
│   │   │   └── foundry/                         # Startup concepts & templates
│   │   │
│   │   ├── 📁 services/                         # Backend Services
│   │   │   └── marketing-automation/            # Marketing automation service
│   │   │
│   │   └── 📁 data/                             # Datasets
│   │       └── datasets/                        # Benchmarks, training data
│   │
│   ├── 📁 live-it-iconic-llc/                   # LIVE IT ICONIC LLC
│   │   └── 📁 ecommerce/                        # E-commerce Platforms
│   │       └── liveiticonic/                    # Main e-commerce store
│   │
│   └── 📁 repz-llc/                             # REPZ LLC
│       └── 📁 apps/                             # Fitness Apps
│           └── repz/                            # Fitness tracking platform
│
├── 📁 docs/                                     # DOCUMENTATION
│   ├── guides/                                  # User & developer guides
│   ├── api/                                     # API documentation
│   ├── architecture/                            # Architecture docs
│   ├── governance/                              # Governance & standards
│   └── developer/                               # Developer workflows
│
├── 📁 .github/                                  # GITHUB CONFIGURATION
│   ├── workflows/                               # CI/CD workflows
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE/
│
├── 📄 README.md                                 # Main repository readme
├── 📄 CLAUDE.md                                 # AI assistant instructions
└── 📄 package.json                              # Root package.json
```

## Project Registry

| Project      | Location                  | Category   | Tech Stack                 |
| ------------ | ------------------------- | ---------- | -------------------------- |
| attributa    | `saas/attributa/`         | SaaS       | React, Supabase, AI        |
| llmworks     | `saas/llmworks/`          | SaaS       | React, Supabase            |
| portfolio    | `saas/portfolio/`         | SaaS       | React, Framer Motion       |
| qmlab        | `saas/qmlab/`             | SaaS       | React, Supabase, Python    |
| simcore      | `mobile-apps/simcore/`    | Mobile     | React, Capacitor, WebGL    |
| librex       | `packages/librex/`        | Package    | Python, CUDA               |
| helios       | `packages/helios/`        | Package    | Python                     |
| mezan        | `packages/mezan/`         | Package    | Python                     |
| talai        | `research/talai/`         | Research   | Python, FastAPI            |
| foundry      | `incubator/foundry/`      | Incubator  | Mixed                      |
| liveiticonic | `ecommerce/liveiticonic/` | E-commerce | React, Supabase, Stripe    |
| repz         | `apps/repz/`              | App        | React, Capacitor, Supabase |

## Quick Commands

```bash
# Start a SaaS platform
cd organizations/alawein-technologies-llc/saas/<name> && npm run dev

# Start mobile app
cd organizations/alawein-technologies-llc/mobile-apps/<name> && npm run dev

# Install Python package (editable)
cd organizations/alawein-technologies-llc/packages/<name> && pip install -e .

# Run research platform
cd organizations/alawein-technologies-llc/research/talai && python -m talai
```

## Migration Status (2024-12-06)

- [x] Canonical structure established under `organizations/`
- [x] All projects moved to category-based directories
- [x] Root-level LLC duplicates removed
- [x] `apps/` and `platforms/` directories removed
- [x] All TypeScript projects pass type checks
- [x] Documentation paths updated
- [x] Lovable.dev workflow documented
