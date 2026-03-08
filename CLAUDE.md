---
type: guide
authority: canonical
audience: [ai-agents, contributors]
last-verified: 2026-03-08
---

# CLAUDE.md — alawein

> **Repository profile + governance templates** | **SSOT**:
> `morphism-framework/docs/morphism-bible`

---

## Overview

This repository serves as the organization profile and baseline governance
templates for the `alawein` GitHub organization, operated by Morphism Systems
LLC. It contains community health files, lightweight governance docs, and
pointers to the canonical Morphism Framework SSOT.

**Repository Type**: Organization Profile
**Primary Language**: N/A (documentation and policies)
**Build System**: N/A (static organizational content)

---

## Documentation Governance

Local documentation rules are defined in
[`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md).
That contract is the authoritative source for document classes, freshness
fields, naming rules, exemptions, and CI truthfulness in this repo.

- **SSOT hub (Morphism Bible)**:
  `morphism-framework/docs/morphism-bible`
- **Documentation governance policy**:
  `morphism-framework/docs/morphism-bible/DOCUMENTATION_GOVERNANCE.md`
- **Local workspace agent instructions** (only when working from the full
  workspace): `../AGENTS.md`

### Required Files

- `AGENTS.md` - Pointer to workspace-level universal instructions (local workspace)
- `CLAUDE.md` - Repository-specific documentation
- `README.md` - Organization overview and navigation
- `SSOT.md` - Current local repository truth
- `LESSONS.md` - Observed repo-specific lessons
- `CONTRIBUTING.md` - Contribution guardrails
- `CODE_OF_CONDUCT.md` - Community standards
- `LICENSE` - License information
- `SECURITY.md` - Security policy
- `CHANGELOG.md` - Version history
- `docs/governance/documentation-contract.md` - Local documentation contract
- `scripts/validate-doc-contract.sh` - Local validation entrypoint

---

## Repository Structure

```text
alawein/
  docs/
    README.md
    governance/
      documentation-contract.md
      workflow.md
  .github/
    ISSUE_TEMPLATE/
    workflows/
    CODEOWNERS
    pull_request_template.md
  scripts/
    validate-doc-contract.sh
  AGENTS.md
  CLAUDE.md
  README.md
  SSOT.md
  LESSONS.md
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
2. **Review documentation governance (SSOT)**:
   `morphism-framework/docs/morphism-bible/DOCUMENTATION_GOVERNANCE.md`
3. **Read the local contract**: [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
4. **Review Organization Policies**: Read `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md`
5. **Run the local validator**: `./scripts/validate-doc-contract.sh --full`

### Working Agreements

- **Organizational Standards**: Maintain consistency across all Morphism Systems repositories under `alawein`
- **Community Focus**: Ensure inclusive and welcoming community guidelines
- **Policy Compliance**: All organizational policies must be current and accurate
- **Documentation Quality**: High standards for organizational communications

---

## Documentation Standards

- Canonical docs (`AGENTS.md`, `CLAUDE.md`, `SSOT.md`) require frontmatter with
  `last-verified` and must remain within a 30-day verification window.
- `LESSONS.md` requires frontmatter with `last-updated`.
- Managed governance docs require frontmatter with `last_updated`.
- `README.md` and GitHub-managed templates are explicit exemptions so GitHub
  rendering and template behavior stay intact.
- Internal markdown links must resolve locally.
- Root community filenames remain conventional; docs under `docs/governance/`
  use kebab-case.

---

## Quality Gates

### Pre-commit Validation

Before committing, ensure:
- ✅ `./scripts/validate-doc-contract.sh --full` passes
- ✅ Managed markdown files satisfy the local contract
- ✅ Internal links are working
- ✅ Policy documents are current

### CI/CD Validation

Pull requests are validated for:
- Documentation contract compliance
- Markdown linting for managed docs

Scheduled and docs-focused audits additionally validate:
- Legacy domain enforcement
- External link health for governance docs

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
- **General Support**: dev@morphism.systems

---

## References

- **Morphism Bible (SSOT)**: `morphism-framework/docs/morphism-bible`
- **Documentation governance**:
  `morphism-framework/docs/morphism-bible/DOCUMENTATION_GOVERNANCE.md`
- **Local documentation contract**: [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- **Local workspace instructions** (only when working from the full workspace): `../AGENTS.md`

---

## Governance
See [AGENTS.md](AGENTS.md) for rules. See [SSOT.md](SSOT.md) for current state.
