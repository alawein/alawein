---
title: 'Quick Start Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Quick Start Guide

Get up and running with the Alawein monorepo in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** - Check with `node --version`
- **npm 10.9.2+** - Check with `npm --version`
- **Git** - Check with `git --version`

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alawein/alawein.git
cd alawein
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies for the monorepo and its workspaces.

### 3. Verify Installation

```bash
npm run test:run
```

All 221 tests should pass.

## Development

### Start All Platforms

```bash
npm run dev
```

### Start Specific Platform

```bash
# Using Turbo filter
npm run dev --filter=repz
npm run dev --filter=simcore
npm run dev --filter=liveiticonic
```

## Available Platforms

| Platform     | Local URL                       | Description                  |
| ------------ | ------------------------------- | ---------------------------- |
| Portfolio    | `http://localhost:5173`         | Personal portfolio site      |
| SimCore      | `http://localhost:5173/simcore` | Physics simulations          |
| REPZ         | `http://localhost:5174`         | Fitness analytics platform   |
| QMLab        | `http://localhost:5175`         | Quantum mechanics laboratory |
| LiveItIconic | `http://localhost:5176`         | E-commerce platform          |
| LLMWorks     | `http://localhost:5177`         | AI/ML tools                  |
| Attributa    | `http://localhost:5178`         | Attribution platform         |

## Key Commands

### Development

```bash
npm run dev           # Start development servers
npm run build         # Build all packages
npm run clean         # Clean build artifacts
```

### Testing

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
```

### Code Quality

```bash
npm run lint          # Run ESLint
npm run type-check    # TypeScript validation
npm run format        # Format with Prettier
```

### Documentation

```bash
npm run docs:dev      # Start docs dev server
npm run docs:build    # Build documentation
```

## Project Structure

```
alawein/
├── platforms/           # Platform applications
│   ├── repz/           # REPZ fitness platform
│   ├── simcore/        # SimCore physics platform
│   ├── liveiticonic/   # E-commerce platform
│   ├── qmlab/          # Quantum mechanics lab
│   ├── llmworks/       # AI/ML tools
│   ├── attributa/      # Attribution platform
│   └── portfolio/      # Personal portfolio
├── packages/           # Shared packages
│   ├── ui/            # UI components
│   ├── utils/         # Utility functions
│   └── eslint-config/ # ESLint configuration
├── docs/              # Documentation
├── tests/             # Test files
├── scripts/           # Build and utility scripts
└── .github/           # GitHub configuration
```

## Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure Required Variables

Edit `.env` and set:

```bash
# Supabase (required for API features)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional: Analytics, etc.
VITE_ANALYTICS_ID=your_analytics_id
```

See [API_KEYS_SETUP.md](../API_KEYS_SETUP.md) for detailed API configuration.

## IDE Setup

### VS Code (Recommended)

Install recommended extensions:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

The workspace settings in `.vscode/` will configure:

- ESLint auto-fix on save
- Prettier as default formatter
- TypeScript strict mode

### Other IDEs

Ensure your IDE supports:

- TypeScript 5.x
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Common Issues

### Node Version Mismatch

```bash
# Use nvm to switch to correct version
nvm use
```

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173
```

### Dependencies Out of Sync

```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript Errors After Pull

```bash
# Rebuild TypeScript
npm run type-check
npm run build
```

## Next Steps

1. **Read the Architecture** -
   [docs/architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
2. **Understand the APIs** - [docs/api/API_REFERENCE.md](./api/API_REFERENCE.md)
3. **Learn Testing Patterns** -
   [docs/testing/TESTING-GUIDE.md](./testing/TESTING-GUIDE.md)
4. **Review Contribution Guide** - [CONTRIBUTING.md](../CONTRIBUTING.md)

## Getting Help

- **Documentation**: Browse the `docs/` directory
- **Issues**: Check [GitHub Issues](https://github.com/alawein/alawein/issues)
- **Discussions**: Join
  [GitHub Discussions](https://github.com/alawein/alawein/discussions)
- **Email**: meshal@berkeley.edu

## Related Documents

- [ONBOARDING.md](./ONBOARDING.md) - Detailed onboarding for new team members
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [FAQ.md](./FAQ.md) - Frequently asked questions
