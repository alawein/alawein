# Monorepo Architecture

## Final Directory Structure

```
GitHub/
│
├── 📁 platforms/                    # FULL-STACK WEB APPLICATIONS
│   ├── portfolio/                   # Cyberpunk portfolio (Jules design)
│   ├── simcore/                     # Scientific computing platform
│   ├── repz/                        # Fitness coaching app
│   ├── liveiticonic/                # Lifestyle brand store
│   ├── attributa/                   # AI content attribution
│   ├── talai/                       # AI research assistant
│   ├── qmlab/                       # Quantum ML lab
│   ├── llmworks/                    # LLM tooling platform
│   ├── librex/                      # Optimization library + docs
│   ├── helios/                      # Energy/physics platform
│   └── mezan/                       # Financial/analytics platform
│
├── 📁 packages/                     # SHARED LIBRARIES & UTILITIES
│   ├── ui/                          # Shared UI components (shadcn)
│   ├── config/                      # Shared configs (eslint, ts, etc.)
│   ├── utils/                       # Shared utilities
│   └── types/                       # Shared TypeScript types
│
├── 📁 automation/                   # AI & AUTOMATION SYSTEM
│   ├── cli/                         # CLI tools (Python + TypeScript)
│   ├── prompts/                     # All AI prompts consolidated
│   │   ├── system/                  # System prompts
│   │   ├── project/                 # Project-specific prompts
│   │   └── tasks/                   # Task prompts
│   ├── agents/                      # Agent definitions
│   ├── workflows/                   # Workflow definitions
│   ├── orchestration/               # Orchestration patterns
│   └── tools/                       # AI tools & integrations
│
├── 📁 research/                     # ACADEMIC RESEARCH PROJECTS
│   ├── scicomp/                     # Scientific computing scripts
│   ├── qubeml/                      # Quantum ML research
│   ├── qmatsim/                     # Quantum materials simulation
│   ├── maglogic/                    # Magnetic logic research
│   └── spincirc/                    # Spintronics circuits
│
├── 📁 family/                       # FAMILY PROJECTS
│   └── apps/                        # Family website apps
│
├── 📁 docs/                         # DOCUMENTATION & STATIC PAGES
│   ├── guides/                      # User & developer guides
│   ├── api/                         # API documentation
│   ├── architecture/                # Architecture docs
│   ├── app/                         # Studios Hub (React app)
│   └── pages/                       # Static web pages
│       ├── templates/               # HTML page templates
│       │   ├── product-landing.html
│       │   ├── research-project.html
│       │   ├── persona-page.html
│       │   └── family-site.html
│       ├── brands/                  # Brand landing pages
│       │   ├── simcore/
│       │   ├── repz/
│       │   ├── liveiticonic/
│       │   └── ...
│       └── styles/                  # Shared CSS
│           └── design-system.css
│
├── 📁 archive/                      # ARCHIVED/COMPLETED DOCS
│   ├── phases/                      # Phase completion docs
│   ├── plans/                       # Old planning docs
│   └── reports/                     # Historical reports
│
├── 📁 .github/                      # GITHUB CONFIGURATION
│   ├── workflows/                   # CI/CD workflows
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE/
│
├── 📄 README.md                     # Main repository readme
├── 📄 CLAUDE.md                     # AI assistant instructions
├── 📄 ARCHITECTURE.md               # This file
├── 📄 package.json                  # Root package.json (workspaces)
├── 📄 turbo.json                    # Turborepo config
└── 📄 [config files]                # eslint, prettier, tsconfig, etc.
```

## Platform Registry

| ID | Name | Port | Type | Tech Stack |
|----|------|------|------|------------|
| portfolio | Portfolio | 5174 | Personal | React, Framer Motion, Jules Design |
| simcore | SimCore | 5175 | SaaS | React, Supabase, WebGL |
| repz | REPZ Coach | 5176 | SaaS | React, Supabase, Stripe |
| liveiticonic | Live It Iconic | 5177 | E-commerce | React, Supabase, Stripe |
| attributa | Attributa | 5178 | SaaS | React, Supabase, AI |
| talai | TalAI | 5179 | SaaS | React, Supabase, LangChain |
| qmlab | QMLab | 5180 | Research | React, Supabase, Python |
| llmworks | LLMWorks | 5181 | Tools | React, Supabase |
| librex | Librex | 5182 | Library | React, Python, CUDA |
| helios | Helios | 5183 | Research | React, Python |
| mezan | MEZAN | 5184 | Analytics | React, Supabase |

## Quick Commands

```bash
# Start any platform
cd platforms/<name> && npm install && npm run dev

# Start Studios Hub
cd docs/app && npm run dev

# Run automation CLI
cd automation && python cli.py <command>

# Build all platforms
npm run build --workspaces
```

## Migration Checklist

- [x] Archive old planning docs → `archive/`
- [x] Remove empty hidden directories (`.ai/`, `.cascade/`, etc.)
- [x] Portfolio moved to `platforms/portfolio/`
- [x] Studios Hub updated with dev server links
- [ ] Move remaining platforms from LLC folders to `platforms/`
- [ ] Consolidate AI tools into `automation/`
- [ ] Update all import paths
- [ ] Update CI/CD workflows

## Currently Running Dev Servers

| Platform | Port | Status |
|----------|------|--------|
| Portfolio | 5174 | ✅ Running |
| SimCore | 5175 | ✅ Running |
| REPZ | 5176 | ✅ Running |
| LiveItIconic | 5177 | ✅ Running |
| Studios Hub | 5173 | ✅ Running |
