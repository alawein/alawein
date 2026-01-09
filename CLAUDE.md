# CLAUDE.md - `alawein` Organization Repository

> **Repository profile + governance templates** | **SSOT**: https://github.com/alawein/morphism-framework/tree/main/docs/morphism-bible

---

## Overview

This repository serves as the organization profile and baseline governance templates for the `alawein` GitHub organization, operated by Morphism Systems LLC. It contains community health files, lightweight governance docs, and pointers to the canonical Morphism Framework SSOT.

**Repository Type**: Organization Profile
**Primary Language**: N/A (documentation and policies)
**Build System**: N/A (static organizational content)

---

## Documentation Governance

This repository follows the **Morphism Documentation Governance Framework** as defined in the SSOT:

- **SSOT hub (Morphism Bible)**: https://github.com/alawein/morphism-framework/tree/main/docs/morphism-bible
- **Documentation governance policy**: https://github.com/alawein/morphism-framework/blob/main/docs/morphism-bible/DOCUMENTATION_GOVERNANCE.md
- **Local workspace agent instructions** (only when working from the full workspace): `../AGENTS.md`

### Required Files

- `AGENTS.md` - Pointer to workspace-level universal instructions (local workspace)
- `CLAUDE.md` - Repository-specific documentation
- `README.md` - Organization overview and navigation
- `CONTRIBUTING.md` - Contribution guardrails
- `CODE_OF_CONDUCT.md` - Community standards
- `LICENSE` - License information
- `SECURITY.md` - Security policy
- `CHANGELOG.md` - Version history

---

## Repository Structure

```text
alawein/
  docs/
    governance/
      workflow.md
  .github/
    ISSUE_TEMPLATE/
    workflows/
    CODEOWNERS
    pull_request_template.md
    README.md
  AGENTS.md
  CLAUDE.md
  README.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  LICENSE
  SECURITY.md
  CHANGELOG.md
  [configuration files] (.editorconfig, .gitignore, etc.)
```

---

## Development Workflow

### Getting Started

1. **Read local workspace instructions** (when working in the full workspace): `../AGENTS.md`
2. **Review documentation governance (SSOT)**: https://github.com/alawein/morphism-framework/blob/main/docs/morphism-bible/DOCUMENTATION_GOVERNANCE.md
3. **Review Organization Policies**: Read CODE_OF_CONDUCT.md and CONTRIBUTING.md
4. **Follow Standards**: Adhere to coding standards and documentation policies

### Working Agreements

- **Organizational Standards**: Maintain consistency across all Morphism Systems repositories under `alawein`
- **Community Focus**: Ensure inclusive and welcoming community guidelines
- **Policy Compliance**: All organizational policies must be current and accurate
- **Documentation Quality**: High standards for organizational communications

---

## Documentation Standards

### Frontmatter Required

All markdown files must include YAML frontmatter:

```yaml
---
title: Organization Overview
description: Comprehensive overview of the `alawein` organization and its projects
last_updated: 2025-12-28
category: organization
audience: all
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [organization, governance, community]
---
```

### File Naming Conventions

- **Documentation**: `SCREAMING_SNAKE_CASE.md` (e.g., `README.md`)
- **Directories**: `kebab-case` (e.g., `governance-policies/`)
- **Policy Files**: `SCREAMING_SNAKE_CASE.md` (e.g., `CODE_OF_CONDUCT.md`)

### Link Validation

- Use relative links for internal documentation
- Use absolute URLs for external resources
- All internal links must be valid and working

---

## Quality Gates

### Pre-commit Validation

Before committing, ensure:
- ✅ YAML frontmatter is valid
- ✅ File naming follows conventions
- ✅ Internal links are working
- ✅ Required sections are present
- ✅ Policy documents are current

### CI/CD Validation

Pull requests are validated for:
- Documentation structure compliance
- Link integrity
- Content freshness
- Accessibility standards
- Policy document accuracy

---

## Organizational Policies

### Code of Conduct

**File**: `CODE_OF_CONDUCT.md`
- Defines community standards and behavior expectations
- Outlines reporting procedures for violations
- Establishes consequences for policy breaches

### Contribution Guidelines

**File**: `CONTRIBUTING.md`
- Provides guidance for contributors
- Outlines development workflows
- Defines code review processes

### Security Policy

**File**: `SECURITY.md`
- Details security reporting procedures
- Defines supported versions
- Outlines vulnerability disclosure process

### License Information

**File**: `LICENSE`
- Specifies terms of use for this repository's content (other repositories may vary)
- Defines permissions and restrictions
- Governs intellectual property rights

---

## Contact & Support

- **Documentation Issues**: Follow governance framework reporting
- **Build Failures**: dev@morphism.systems
- **General Support**: dev@morphism.systems

---

## References

- **Morphism Bible (SSOT)**: https://github.com/alawein/morphism-framework/tree/main/docs/morphism-bible
- **Documentation governance**: https://github.com/alawein/morphism-framework/blob/main/docs/morphism-bible/DOCUMENTATION_GOVERNANCE.md
- **Local workspace instructions** (only when working from the full workspace): `../AGENTS.md`

---

*Last Updated: 2025-12-28 | Version: 1.0.0 | Status: Active*

