# Alawein Technologies LLC

Scientific computing, AI/ML research, and technical SaaS platforms.

## Overview

| Field | Value |
|-------|-------|
| **Entity** | Alawein Technologies LLC |
| **Focus** | Scientific Computing, AI/ML, Quantum Mechanics |
| **Tech Stack** | React 18, TypeScript, Vite, Python, Supabase |
| **Owner** | [@alawein](https://github.com/alawein) |

## Directory Structure

```
alawein-technologies-llc/
├── saas/                    # Web applications
│   ├── llmworks/            # LLM benchmarking platform
│   ├── qmlab/               # Quantum computing laboratory
│   ├── attributa/           # AI content attribution detection
│   └── portfolio/           # Personal portfolio site
├── mobile-apps/             # Hybrid mobile applications
│   └── simcore/             # Physics simulation app
├── packages/                # LLC-specific shared libraries
│   ├── librex/              # QAP optimization solver
│   ├── helios/              # ML/AI DevOps framework
│   ├── mezan/               # ML research utilities
│   └── design-system/       # Design tokens and system
├── research/                # Research platforms
│   └── talai/               # TAL AI research system
├── services/                # Backend services
│   └── marketing-automation/
├── incubator/               # Pre-release products
│   └── foundry/             # Startup concepts
├── data/                    # Datasets
├── docs/                    # Organization documentation
└── tools/                   # Development tooling
```

## Applications

### SaaS Products

| App | Description | Status |
|-----|-------------|--------|
| **LLMWorks** | LLM benchmarking and evaluation platform | Active |
| **QMLab** | Quantum computing simulation laboratory | Active |
| **Attributa** | AI-generated content attribution detection | Active |
| **Portfolio** | Personal portfolio website | Active |

### Mobile Apps

| App | Description | Platform |
|-----|-------------|----------|
| **SimCore** | Physics simulation application | iOS/Android (Capacitor) |

### Python Packages

| Package | Description | Distribution |
|---------|-------------|--------------|
| **librex** | Quadratic Assignment Problem (QAP) optimization | pip |
| **helios** | ML/AI DevOps automation framework | pip |
| **mezan** | Machine learning research utilities | pip |

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+ (for packages)
- npm or pnpm

### Development

```bash
# Navigate to specific app
cd saas/llmworks

# Install dependencies
npm install

# Start development server
npm run dev
```

### Python Packages

```bash
# Navigate to package
cd packages/librex

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install in development mode
pip install -e .
```

## Deployment

Applications are deployed to Vercel with the following configuration:

| App | Vercel Project | Domain Pattern |
|-----|----------------|----------------|
| LLMWorks | `llmworks` | llmworks.alaweintech.com |
| QMLab | `qmlab` | qmlab.alaweintech.com |
| Attributa | `attributa` | attributa.alaweintech.com |
| Portfolio | `portfolio` | alaweintech.com |

## Documentation

- [IP Manifest](./IP-MANIFEST.md) - Intellectual property ownership
- [Organization Docs](./docs/) - Detailed documentation

## Related

- [Monorepo Root](../../README.md)
- [Shared Packages](../../packages/)
- [CI/CD Workflows](../../.github/workflows/)

---

*Part of the [alawein/alawein](https://github.com/alawein/alawein) monorepo*
