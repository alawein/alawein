# Governance Policy

## Overview

This document outlines the governance policies for all repositories in this organization.

## Repository Classification

### 🔴 Critical

Production systems requiring enhanced security and review processes.

- **Approvals Required**: 2
- **CI Required**: Yes
- **Security Scan**: Yes
- **Examples**: `platforms/repz`, `platforms/liveiticonic`

### 🟡 Standard

Development projects with standard review requirements.

- **Approvals Required**: 1
- **CI Required**: Yes
- **Security Scan**: Recommended
- **Examples**: `platforms/*`, `packages/*`

### 🟢 Research

Experimental projects with minimal restrictions.

- **Approvals Required**: 0
- **CI Required**: No
- **Security Scan**: Optional
- **Examples**: `research/*`

## Approval Workflow

1. **Create PR** with descriptive title and body
2. **Automated CI** checks run (lint, test, type-check)
3. **Security scan** runs for critical repos
4. **Required reviewers** approve based on tier
5. **Merge** to main branch

## Branch Protection Rules

### Main Branch

- Require pull request before merging
- Require at least 1 approval
- Dismiss stale reviews when new commits pushed
- Require status checks to pass:
  - `ci`
  - `lint`
  - `type-check`

## Compliance Requirements

All repositories must have:

- [ ] `README.md` - Project documentation
- [ ] `LICENSE` - License file
- [ ] `package.json` or equivalent - Dependency manifest

Critical repositories must also have:

- [ ] `SECURITY.md` - Security policy
- [ ] `CONTRIBUTING.md` - Contribution guidelines
- [ ] Signed commits enabled

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Audit Trail

All governance-related changes are logged to:

- `.logs/governance-audit.jsonl`

Retention: 90 days

## Exceptions

Exceptions to governance policies require:

1. Written justification
2. Approval from repository owner
3. Time-limited scope
4. Documented in PR description

## Contact

- Governance Team: governance@alawein.com
- Security Issues: security@alawein.com
