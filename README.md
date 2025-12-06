# GitHub Monorepo

Centralized repository for all organizations, platforms, and shared packages.

## 🏗️ Structure

```
GitHub/
├── .metaHub/              # Centralized CI/CD, tooling, automation
├── organizations/         # Company/LLC scoped projects
│   ├── repz-llc/         # REPZ applications and services
│   ├── alawein-technologies-llc/  # Scientific platforms
│   └── live-it-iconic-llc/        # Live event platforms
├── platforms/             # Cross-organization applications
│   ├── portfolio/        # Portfolio website
│   ├── qmlab/            # Quantum laboratory
│   └── shared/           # Shared platform code
├── packages/              # Reusable libraries and configs
│   ├── ui/               # Shared UI components
│   ├── utils/            # Common utilities
│   ├── types/            # TypeScript definitions
│   ├── eslint-config/    # ESLint configurations
│   └── typescript-config/ # TypeScript configurations
├── docs/                  # Documentation hub
│   ├── architecture/     # System architecture
│   ├── guides/          # Development guides
│   ├── api/             # API documentation
│   └── governance/      # Policies and standards
├── tools/                 # Development tools and scripts
└── archive/              # Archived projects
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Install dependencies for all workspaces
npm install

# Install dependencies for specific workspace
npm install --workspace=@monorepo/ui
```

### Development
```bash
# Start all development servers
npm run dev

# Start specific workspace
npm run dev --workspace=portfolio

# Build all projects
npm run build

# Run tests across all projects
npm run test

# Lint all code
npm run lint

# Format all code
npm run format
```

## 📦 Workspaces

### Organizations
- **repz-llc**: Fitness coaching platform with cyberpunk theme
- **alawein-technologies-llc**: Scientific computing and simulation platforms
- **live-it-iconic-llc**: Live event and streaming platforms

### Platforms
- **portfolio**: Professional portfolio website
- **qmlab**: Quantum computing laboratory
- **shared**: Common platform utilities

### Packages
- **@monorepo/ui**: Shared React components
- **@monorepo/utils**: Common utility functions
- **@monorepo/types**: TypeScript type definitions
- **@monorepo/eslint-config**: ESLint configurations
- **@monorepo/typescript-config**: TypeScript configurations

## 🛠️ Tooling

### MetaHub
- **CI/CD**: GitHub Actions, Docker configurations
- **Automation**: Python and TypeScript automation systems
- **Templates**: Project and component templates
- **Governance**: Code standards and policies

### Build System
- **Turborepo**: Monorepo build system
- **TypeScript**: Type checking across all packages
- **ESLint**: Linting with shared configurations
- **Prettier**: Code formatting

## 📚 Documentation

- **Architecture**: System design and technical decisions
- **Guides**: Development workflows and best practices
- **API**: API documentation and examples
- **Governance**: Policies, standards, and compliance

## 🔧 Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/name`
2. **Make Changes**: Work in appropriate workspace
3. **Run Validation**: `npm run validate`
4. **Commit Changes**: Follow conventional commits
5. **Push & PR**: Automated checks run on PR

## 📊 Metrics

- **Organizations**: 3 active LLCs
- **Platforms**: 5+ applications
- **Packages**: 10+ shared libraries
- **Automation**: Centralized in MetaHub

## 🤝 Contributing

See [docs/governance/CONTRIBUTING.md](docs/governance/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - See individual package licenses for details.

---

**MetaHub** - Centralized Infrastructure for Modern Development
