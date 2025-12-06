# Alawein Technologies Monorepo

**Multi-LLC enterprise monorepo** for Alawein Technologies LLC, Live It Iconic LLC, and REPZ LLC.

[![CI](https://github.com/alawein/alawein/workflows/CI/badge.svg)](https://github.com/alawein/alawein/actions)
[![Security](https://github.com/alawein/alawein/workflows/CodeQL/badge.svg)](https://github.com/alawein/alawein/security)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🏗️ Structure

```text
organizations/
├── alawein-technologies-llc/     # Scientific & Technical Platforms
│   ├── saas/                     # Subscription web apps (React/Vite/Supabase)
│   │   ├── attributa/            # Attribution analytics platform
│   │   ├── llmworks/             # LLM evaluation & benchmarking
│   │   ├── portfolio/            # Professional portfolio
│   │   └── qmlab/                # Quantum computing laboratory
│   ├── mobile-apps/              # Hybrid mobile apps (Capacitor)
│   │   └── simcore/              # Physics simulation mobile app
│   ├── packages/                 # pip-installable Python libraries
│   │   ├── librex/               # QAP optimization solver
│   │   ├── helios/               # ML/AI DevOps framework
│   │   └── mezan/                # ML research utilities
│   ├── research/                 # Multi-module research systems
│   │   └── talai/                # TAL AI research platform
│   ├── incubator/                # Pre-release products
│   │   └── foundry/              # Startup concepts
│   └── services/                 # Backend services
│       └── marketing-automation/
├── live-it-iconic-llc/           # E-commerce Business
│   └── ecommerce/
│       └── liveiticonic/         # Clothing & fashion e-commerce
└── repz-llc/                     # Fitness & Wellness
    └── apps/
        └── repz/                 # AI fitness coaching platform
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ / Python 3.11+
- npm 9+ / pip

### Development

```bash
# Clone the repository
git clone https://github.com/alawein/alawein.git
cd alawein

# Start a specific platform
cd organizations/alawein-technologies-llc/saas/llmworks
npm install && npm run dev

# Work with Python packages
cd organizations/alawein-technologies-llc/packages/librex
pip install -e ".[dev]"
pytest
```

## 📦 Projects

### 🔬 Alawein Technologies LLC

| Category | Project | Description | Stack |
|----------|---------|-------------|-------|
| **SaaS** | [LLMWorks](organizations/alawein-technologies-llc/saas/llmworks) | LLM evaluation & benchmarking | React, Vite, Supabase |
| **SaaS** | [QMLab](organizations/alawein-technologies-llc/saas/qmlab) | Quantum computing laboratory | React, Vite |
| **SaaS** | [Attributa](organizations/alawein-technologies-llc/saas/attributa) | Attribution analytics | React, Vite |
| **Mobile** | [SimCore](organizations/alawein-technologies-llc/mobile-apps/simcore) | Physics simulations | Capacitor, React |
| **Package** | [Librex](organizations/alawein-technologies-llc/packages/librex) | QAP optimization solver | Python |
| **Package** | [MEZAN](organizations/alawein-technologies-llc/packages/mezan) | ML/AI DevOps | Python |
| **Research** | [TalAI](organizations/alawein-technologies-llc/research/talai) | AI research platform | Python |

### 🛍️ Live It Iconic LLC

| Project | Description | Stack |
|---------|-------------|-------|
| [LiveItIconic](organizations/live-it-iconic-llc/ecommerce/liveiticonic) | Fashion e-commerce platform | React, Vite, Stripe |

### 💪 REPZ LLC

| Project | Description | Stack |
|---------|-------------|-------|
| [REPZ](organizations/repz-llc/apps/repz) | AI fitness coaching platform | Capacitor, React, Supabase |

## 🛠️ Infrastructure

- **CI/CD**: 29 GitHub Actions workflows
- **Security**: CodeQL, Trivy, Dependabot, SLSA provenance
- **Governance**: CODEOWNERS, pre-commit hooks, policy enforcement
- **Documentation**: MkDocs, architecture guides

## 📚 Documentation

| Resource | Description |
|----------|-------------|
| [Architecture](docs/governance/ARCHITECTURE.md) | System design & decisions |
| [Lovable Workflow](docs/developer/LOVABLE-DEV-WORKFLOW.md) | Lovable.dev integration guide |
| [Contributing](docs/governance/CONTRIBUTING.md) | Contribution guidelines |
| [Security](SECURITY.md) | Security policy |

## 👤 Author

**Meshaal Alawein** - [@alawein](https://github.com/alawein)

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
