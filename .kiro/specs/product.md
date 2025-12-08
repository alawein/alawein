# Alawein Monorepo - Product Specification

## Overview
This is the Alawein Technologies LLC enterprise monorepo containing shared packages, templates, tools, and SaaS applications.

## Architecture

### Package Structure
- **packages/**: Shared npm packages
  - `ui`: Core UI components (Button, Card)
  - `ui-components`: Extended UI component library with atomic design
  - `utils`: Shared utilities (cn, validation, feature-flags)
  - `config`: Shared configuration
  - `types`: TypeScript type definitions
  - `api-schema`: OpenAPI specifications and API client
  - `feature-flags`: Feature flag management system
  - `security-headers`: HTTP security headers
  - `design-tokens`: Design system tokens

### Templates
- **templates/**: Starter templates for various project types
  - `saas-react`: Modern SaaS application template
  - Landing pages (minimal, corporate, creative, startup)
  - Portfolios (classic, cyberpunk, quantum)
  - Documentation sites (academic, developer, blog)

### Tools
- **tools/**: Internal development tools
  - `orchestration/`: Multi-agent workflow orchestration
  - `ai/`: AI integration utilities
  - `health/`: Repository health checks

### Organizations
- **organizations/**: Organization-specific applications
  - `alawein-technologies-llc/saas/llmworks`: LLM Workspace application

## Technology Stack
- **Build**: Turborepo, npm workspaces
- **Frontend**: React 18, TypeScript 5, Vite
- **Styling**: Tailwind CSS, CSS custom properties
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions

## Multi-Agent Orchestration
Use the MCP servers configured in `.kiro/settings/mcp.json` for:
- File system operations
- Git operations
- GitHub API access
- Web search for documentation

## Development Commands
```bash
npm run dev              # Start development server
npm run build            # Build all packages
npm run type-check       # TypeScript check
npm run lint             # ESLint check
npm run test             # Run tests
```
