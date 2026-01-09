e# CLAUDE.md - Alawein Organization Repository

> **Repository-Specific Documentation** | **SSOT Reference**: [`morphism-framework/docs/morphism-bible/`](morphism-framework/docs/morphism-bible/)

---

## Overview

This repository serves as the organization profile for Alawein, containing essential organizational files, governance documents, and community standards. It establishes the foundational policies and guidelines that govern all Alawein projects and repositories.

**Repository Type**: Organization Profile
**Primary Language**: N/A (documentation and policies)
**Build System**: N/A (static organizational content)

---

## Documentation Governance

This repository follows the **Morphism Documentation Governance Framework** as defined in the SSOT:

- **Governance Policy**: [`morphism-framework/docs/morphism-bible/governance/policies/GOVERNANCE_FRAMEWORK.md`](morphism-framework/docs/morphism-bible/governance/policies/GOVERNANCE_FRAMEWORK.md)
- **Universal Agent Instructions**: [`AGENTS.md`](../AGENTS.md) (workspace symlink)
- **Documentation Standards**: [`morphism-framework/docs/morphism-bible/governance/policies/`](morphism-framework/docs/morphism-bible/governance/policies/)

### Required Files

- ✅ `AGENTS.md` - Symlink to workspace-level universal instructions
- ✅ `CLAUDE.md` - This repository-specific documentation
- ✅ `README.md` - Repository overview and getting started
- ✅ `CONTRIBUTING.md` - Contribution guidelines
- ✅ `CODE_OF_CONDUCT.md` - Community standards
- ✅ `LICENSE` - License information
- ✅ `SECURITY.md` - Security policy
- ✅ `CHANGELOG.md` - Version history

---

## Repository Structure

```
alawein/
├── docs/                    # Organizational documentation
│   ├── governance/         # Governance policies
│   └── community/          # Community resources
├── .github/                 # GitHub configuration
├── AGENTS.md                # Symlink to workspace instructions
├── CLAUDE.md                # This file
├── README.md                # Organization overview
├── CONTRIBUTING.md          # Contribution guidelines
├── CODE_OF_CONDUCT.md       # Community standards
├── LICENSE                  # License information
├── SECURITY.md              # Security policy
├── CHANGELOG.md             # Version history
└── [Configuration files]    # .editorconfig, .gitignore, etc.
```

---

## Development Workflow

### Getting Started

1. **Read Universal Instructions**: Start with [`AGENTS.md`](../AGENTS.md)
2. **Review Governance**: Understand [`GOVERNANCE_FRAMEWORK.md`](morphism-framework/docs/morphism-bible/governance/policies/GOVERNANCE_FRAMEWORK.md)
3. **Review Organization Policies**: Read CODE_OF_CONDUCT.md and CONTRIBUTING.md
4. **Follow Standards**: Adhere to coding standards and documentation policies

### Working Agreements

- **Organizational Standards**: Maintain consistency across all Alawein projects
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
description: Comprehensive overview of the Alawein organization and its projects
last_updated: 2025-12-28
category: organization
audience: all
status: active
author: Alawein Team
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
- Specifies terms of use for Alawein projects
- Defines permissions and restrictions
- Governs intellectual property rights

---

## Contact & Support

- **Documentation Issues**: Follow governance framework reporting
- **Build Failures**: dev@morphism.systems
- **General Support**: dev@morphism.systems

---

## References

- **SSOT Hub**: [`morphism-framework/docs/morphism-bible/`](morphism-framework/docs/morphism-bible/)
- **Governance Framework**: [`morphism-framework/docs/morphism-bible/governance/policies/GOVERNANCE_FRAMEWORK.md`](morphism-framework/docs/morphism-bible/governance/policies/GOVERNANCE_FRAMEWORK.md)
- **Universal Instructions**: [`AGENTS.md`](../AGENTS.md)

---

*Last Updated: 2025-12-28 | Version: 1.0.0 | Status: Active*

