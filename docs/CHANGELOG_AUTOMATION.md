---
title: 'Changelog Automation'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Changelog Automation

Automated changelog generation using conventional commits.

## Overview

This guide covers setting up automated changelog generation from commit
messages.

## Conventional Commits

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description      | Changelog Section |
| ---------- | ---------------- | ----------------- |
| `feat`     | New feature      | Added             |
| `fix`      | Bug fix          | Fixed             |
| `docs`     | Documentation    | Changed           |
| `style`    | Formatting       | -                 |
| `refactor` | Code restructure | Changed           |
| `perf`     | Performance      | Changed           |
| `test`     | Tests            | -                 |
| `chore`    | Maintenance      | -                 |
| `ci`       | CI/CD            | -                 |
| `build`    | Build system     | -                 |
| `revert`   | Revert commit    | Removed           |

### Examples

```bash
feat(simcore): add particle collision detection
fix(repz): correct calorie calculation for bodyweight exercises
docs: update API reference with new endpoints
refactor(ui): simplify Button component props
perf(qmlab): optimize wavefunction rendering by 40%
```

### Breaking Changes

```bash
feat(api)!: change authentication to JWT

BREAKING CHANGE: API now requires JWT tokens instead of API keys.
Migration guide: docs/MIGRATION.md
```

## Setup

### Install Dependencies

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
npm install -D standard-version
```

### Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'simcore',
        'repz',
        'qmlab',
        'liveiticonic',
        'portfolio',
        'ui',
        'api',
        'docs',
        'ci',
        'deps',
      ],
    ],
  },
};
```

### Husky Hook

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## Standard Version

### Configuration

```json
// .versionrc.json
{
  "types": [
    { "type": "feat", "section": "Features" },
    { "type": "fix", "section": "Bug Fixes" },
    { "type": "perf", "section": "Performance" },
    { "type": "docs", "section": "Documentation" },
    { "type": "refactor", "section": "Code Refactoring" },
    { "type": "test", "hidden": true },
    { "type": "chore", "hidden": true },
    { "type": "ci", "hidden": true }
  ],
  "commitUrlFormat": "https://github.com/alawein/alawein/commit/{{hash}}",
  "compareUrlFormat": "https://github.com/alawein/alawein/compare/{{previousTag}}...{{currentTag}}"
}
```

### NPM Scripts

```json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch",
    "release:dry": "standard-version --dry-run"
  }
}
```

### Usage

```bash
# Automatic version bump based on commits
npm run release

# Specific version bump
npm run release:minor

# Preview without changes
npm run release:dry
```

## GitHub Actions

### Automated Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]
    paths-ignore:
      - 'docs/**'
      - '*.md'

jobs:
  release:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'chore(release)')"

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Generate Changelog
        run: npm run release

      - name: Push changes
        run: git push --follow-tags origin main
```

## Alternative: Changesets

For monorepos, consider using changesets:

```bash
npm install -D @changesets/cli
npx changeset init
```

### Creating a Changeset

```bash
npx changeset
```

### Versioning

```bash
npx changeset version
npx changeset publish
```

## Best Practices

1. **Write clear commit messages** - They become changelog entries
2. **Use scopes consistently** - Helps categorize changes
3. **Mark breaking changes** - Use `!` or `BREAKING CHANGE` footer
4. **Reference issues** - Include `(#123)` in commits
5. **Squash related commits** - Keep changelog clean

## Related Documents

- [CHANGELOG.md](../CHANGELOG.md) - Project changelog
- [CHANGELOG_GUIDE.md](./CHANGELOG_GUIDE.md) - Writing changelogs
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
