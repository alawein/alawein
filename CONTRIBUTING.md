# Contributing to Alawein Monorepo

Thank you for your interest in contributing! This document provides guidelines
and instructions for contributing to the Alawein multi-LLC enterprise monorepo.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to the Contributor Covenant
[Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code. Please report unacceptable behavior to meshal@berkeley.edu.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/alawein.git
   cd alawein
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/alawein/alawein.git
   ```

## Development Setup

### Prerequisites

- Node.js 20+ (check `.nvmrc` for exact version)
- npm 10.9.2+
- Git
- Python 3.11+ (for some tools)

### Installation

```bash
# Install dependencies
npm install

# Install pre-commit hooks
npm run prepare

# Verify setup
npm run test:run
```

### Quick Commands

```bash
npm run dev           # Start development servers
npm run build         # Build all packages
npm run lint          # Run ESLint
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage
npm run type-check    # TypeScript validation
```

## Making Changes

### Branch Naming

Use descriptive branch names following this pattern:

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions/changes
- `chore/description` - Maintenance tasks

### Workflow

1. **Sync with upstream**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** following our style guidelines

4. **Test your changes**:

   ```bash
   npm run lint
   npm run test:run
   npm run type-check
   ```

5. **Commit your changes** following our commit guidelines

6. **Push to your fork**:

   ```bash
   git push origin feat/your-feature-name
   ```

7. **Open a Pull Request**

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear,
standardized commit messages.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                               |
| ---------- | ----------------------------------------- |
| `feat`     | New feature                               |
| `fix`      | Bug fix                                   |
| `docs`     | Documentation only                        |
| `style`    | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring                          |
| `perf`     | Performance improvement                   |
| `test`     | Adding or updating tests                  |
| `build`    | Build system or dependencies              |
| `ci`       | CI/CD configuration                       |
| `chore`    | Maintenance tasks                         |
| `revert`   | Reverting a previous commit               |

### Scopes

Use platform or package names as scopes:

- `repz`, `simcore`, `liveiticonic`, `qmlab`, `llmworks`, `attributa`,
  `portfolio`
- `ui`, `utils`, `eslint-config`
- `docs`, `ci`, `deps`

### Examples

```bash
feat(simcore): add quantum field visualization component
fix(repz): resolve workout tracking calculation error
docs: update API reference with new endpoints
refactor(ui): simplify Button component variants
test(qmlab): add unit tests for wave function calculations
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] All tests pass (`npm run test:run`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Documentation updated for any changed functionality
- [ ] Commit messages follow conventional commits

### PR Template

When opening a PR, include:

1. **Description** of changes
2. **Related issues** (if any)
3. **Type of change** (feature, fix, docs, etc.)
4. **Testing performed**
5. **Screenshots** (for UI changes)

### Review Process

1. All PRs require at least one approval from @alawein
2. CI checks must pass
3. No merge conflicts with main
4. Documentation must be updated

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components with hooks
- Use React Query for server state
- Follow existing patterns in the codebase

### File Naming

| Type       | Convention                  | Example            |
| ---------- | --------------------------- | ------------------ |
| Components | PascalCase                  | `Button.tsx`       |
| Hooks      | camelCase with `use` prefix | `useAuth.ts`       |
| Utilities  | camelCase                   | `formatDate.ts`    |
| Constants  | SCREAMING_SNAKE_CASE        | `API_ENDPOINTS.ts` |
| Types      | PascalCase                  | `UserTypes.ts`     |

### Documentation

- Use SCREAMING_SNAKE_CASE for doc files: `STYLE_GUIDE.md`
- Include frontmatter with metadata
- Keep code examples up-to-date
- Add alt text to images

## Testing

### Running Tests

```bash
# All tests
npm run test:run

# Watch mode
npm test

# Coverage
npm run test:coverage

# Specific file
npm test -- tests/ai/cache.test.ts

# E2E tests
npx playwright test
```

### Writing Tests

- Place tests in `tests/` directory or alongside source files
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Aim for >80% coverage on new code

## Documentation

### Adding Documentation

1. Place docs in appropriate `docs/` subdirectory
2. Include YAML frontmatter:
   ```yaml
   ---
   title: Document Title
   last_verified: 2025-12-09
   owner: '@alawein'
   status: active
   ---
   ```
3. Update `docs/README.md` index if adding new files
4. Run validation: `node scripts/docs/validate-docs.js`

### Documentation Style

See [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) for detailed guidelines.

## Questions?

- Open a [GitHub Discussion](https://github.com/alawein/alawein/discussions)
- Email: meshal@berkeley.edu
- Check existing [Issues](https://github.com/alawein/alawein/issues)

## License

By contributing, you agree that your contributions will be licensed under the
same license as the project.

---

Thank you for contributing to Alawein! Your efforts help make this project
better for everyone.
