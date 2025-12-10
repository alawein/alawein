---
title: 'Changelog Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Changelog Guide

How to properly write changelog entries with examples.

## Overview

A changelog is a file containing a curated, chronologically ordered list of
notable changes for each version of a project. This guide explains how to write
effective changelog entries.

## Format

We follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [Unreleased]

### Added

- New features

### Changed

- Changes in existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Removed features

### Fixed

- Bug fixes

### Security

- Security fixes

## [1.0.0] - 2025-01-01

### Added

- Initial release
```

## Categories

### Added

New features or capabilities:

```markdown
### Added

- User authentication with email/password
- OAuth support for Google and GitHub
- Dark mode theme option
- Export simulation results to CSV
```

### Changed

Changes to existing functionality:

```markdown
### Changed

- Improved simulation performance by 40%
- Updated Button component API (see migration guide)
- Redesigned dashboard layout for better usability
- Increased password minimum length from 6 to 8 characters
```

### Deprecated

Features that will be removed in future versions:

```markdown
### Deprecated

- `useOldAuth` hook - use `useAuth` instead
- Legacy API endpoints at `/v1/` - migrate to `/v2/`
- `variant="default"` - use `variant="primary"` instead
```

### Removed

Features that have been removed:

```markdown
### Removed

- Support for Node.js 16 (minimum is now 18)
- Deprecated `fetchData` utility function
- Legacy dashboard component
```

### Fixed

Bug fixes:

```markdown
### Fixed

- Fixed crash when submitting empty form
- Resolved memory leak in simulation viewer
- Corrected calculation error in workout statistics
- Fixed accessibility issues with modal focus trap
```

### Security

Security-related changes:

```markdown
### Security

- Updated dependencies to patch CVE-2024-XXXX
- Fixed XSS vulnerability in comment rendering
- Added rate limiting to authentication endpoints
- Implemented CSRF protection on all forms
```

## Writing Good Entries

### Do

- **Be specific**: "Fixed login button not responding on mobile" not "Fixed bug"
- **Use active voice**: "Added dark mode" not "Dark mode was added"
- **Include context**: "Improved query performance (50% faster)"
- **Link to issues**: "Fixed crash on startup (#123)"
- **Group related changes**: Keep similar items together

### Don't

- **Be vague**: "Various improvements"
- **Include internal changes**: Refactoring without user impact
- **Use technical jargon**: Unless necessary
- **Duplicate entries**: One entry per change
- **Include incomplete work**: Only released changes

## Examples

### Good Entry

```markdown
### Added

- Workout templates: Create and save custom workout routines for quick access
- Exercise search: Find exercises by name, muscle group, or equipment (#234)
- Progress charts: Visualize strength gains over time with interactive charts

### Fixed

- Fixed incorrect calorie calculation for exercises with bodyweight (#456)
- Resolved issue where workout history showed duplicate entries
- Fixed dark mode colors not applying to modal dialogs
```

### Bad Entry

```markdown
### Added

- New feature
- Stuff

### Fixed

- Bug fixes
- Various issues resolved
```

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### When to Bump

| Change Type         | Version Bump                 |
| ------------------- | ---------------------------- |
| Breaking API change | MAJOR                        |
| New feature         | MINOR                        |
| Bug fix             | PATCH                        |
| Security fix        | PATCH (or MAJOR if breaking) |
| Deprecation         | MINOR                        |
| Removal             | MAJOR                        |

## Automation

### Conventional Commits

Use conventional commits to auto-generate changelog:

```bash
feat: add workout templates
fix: correct calorie calculation (#456)
docs: update API documentation
refactor: simplify auth logic
test: add unit tests for workout service
chore: update dependencies
```

### Tools

- **standard-version**: Auto-generate changelog from commits
- **semantic-release**: Fully automated versioning and publishing
- **changesets**: Manage changelogs in monorepos

## Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [X.Y.Z] - YYYY-MM-DD

### Added

- Feature description (#issue)

### Changed

- Change description

### Fixed

- Bug fix description (#issue)
```

## Related Documents

- [CHANGELOG.md](../CHANGELOG.md) - Project changelog
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG_AUTOMATION.md](./CHANGELOG_AUTOMATION.md) - Automation setup
