---
type: canonical
source: none
sync: none
sla: none
title: Changelog Entry Guide
description: Standard workflow for drafting and prepending Keep a Changelog release notes from recent commits
last_updated: 2026-03-28
category: governance
audience: contributors
status: active
author: Kohyr Inc.
version: 1.0.0
tags: [changelog, releases, documentation, workflow]
---

# Changelog Entry Guide

Use this workflow whenever you need to add a new release entry to `CHANGELOG.md`.

## Purpose

- Keep release notes consistent across repositories.
- Base entries on actual git history instead of memory.
- Keep descriptions user-facing and concise.

## Steps

1. Check recent commits:

   ```bash
   git log --oneline -20
   ```

2. Read the existing `CHANGELOG.md` to confirm:
   - the current style and tone
   - the latest released version
   - whether comparison links need to be updated
3. Group the changes into Keep a Changelog categories:
   - **Added**
   - **Changed**
   - **Fixed**
   - **Removed**
   - **Security**
4. Write the next version entry in past tense.
5. Omit any empty categories.
6. Prepend the new entry directly below `## [Unreleased]`.

## Format

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- Added a new feature or capability (#PR if available)

### Changed
- Changed an existing workflow or behavior

### Fixed
- Fixed a bug or regression

### Removed
- Removed deprecated behavior

### Security
- Fixed a security issue
```

## Writing Rules

- Use past tense: `Added`, `Changed`, `Fixed`, `Removed`.
- Prefer user-facing outcomes over implementation details.
- Link PRs or issues when available.
- Collapse low-signal commits into the visible outcome they produced.
- Call out internal-only documentation or scaffolding changes plainly when they are the main change.

## Versioning Heuristic

- Use a patch version for small fixes and documentation/process improvements.
- Use a minor version for additive capabilities.
- Use a major version for intentional breaking changes.
