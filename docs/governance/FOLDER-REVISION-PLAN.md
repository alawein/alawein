---
title: 'Comprehensive Folder Revision Plan (A-Z)'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Comprehensive Folder Revision Plan (A-Z)

> Generated: 2024-12-06 Status: **✅ COMPLETED**

---

## Executive Summary

This document provides a complete A-Z revision of 18 folders in the monorepo.
The analysis identifies:

- **5 folders to DELETE** (caches, empty, redundant)
- **2 folders to MERGE** (duplicate archives)
- **8 folders to REORGANIZE** (improve structure)
- **3 folders to KEEP AS-IS** (already optimal)

---

## Folder Analysis (Alphabetical)

### 1. `.allstar/` ✅ KEEP AS-IS

**Purpose**: GitHub Allstar security app configuration **Files**: 4
(allstar.yaml, branch_protection.yaml, SETUP.md, ALLSTAR_SETUP.md) **Verdict**:
Well-organized, standard Allstar structure **Action**: None required

---

### 2. `.amazonq/` ⚠️ MERGE INTO .config/ai/

**Purpose**: Amazon Q AI assistant rules **Files**: 1 empty folder (rules/)
**Issue**: Empty folder, should be consolidated with other AI configs
**Action**: Move to `.config/ai/amazonq/` (already exists there - DELETE this
one)

---

### 3. `.archive/` 🔄 MERGE WITH archive/

**Purpose**: Historical/archived content **Files**: 54+ files across 16
subdirectories **Contents**:

- `automation-ts/` - Archived TypeScript automation
- `benchmarks-consolidation/` - Migrated benchmark code
- `business-planning/` - Business analysis documents
- `chat-exports/` - AI conversation exports
- `config-placeholder/`, `demo/`, `docs-historical/`
- `k8s/`, `maglogic-consolidation/`, `optimization/`
- `organizations/`, `planning-docs/`, `reports/`
- `scicomp-consolidation/`, `spincirc-consolidation/`, `src-placeholder/`

**Action**: Merge into single `archive/` folder with clear categorization

---

### 4. `.backups/` ✅ KEEP AS-IS

**Purpose**: Configuration backups with timestamps **Files**: 2 timestamped
backup folders **Verdict**: Useful for recovery, properly timestamped
**Action**: Add to .gitignore if not already

---

### 5. `.config/` 🔄 REORGANIZE

**Purpose**: Centralized configuration for all tools **Current Structure**:

```
.config/
├── accessibility/     # WCAG config
├── ai/               # 70+ files - AI tool configs
│   ├── agents/       # Agent configurations
│   ├── aider/        # Aider config
│   ├── amazonq/      # Amazon Q (duplicate of root .amazonq)
│   ├── augment/      # Augment settings
│   ├── blackbox/     # Blackbox config
│   ├── cache/        # AI cache
│   ├── claude/       # Claude settings
│   ├── cline/        # Cline prompts/settings
│   ├── codex/        # Codex config
│   ├── continue/     # Continue config
│   ├── copilot/      # Copilot instructions
│   ├── cursor/       # Cursor settings
│   ├── gemini/       # Gemini settings
│   ├── kilocode/     # Kilocode config
│   ├── knowledge/    # Knowledge base
│   ├── learning/     # Learning/effectiveness tracking
│   ├── logs/         # Token metrics
│   ├── mcp/          # MCP server configs
│   ├── orchestration/# Orchestration configs
│   ├── prompts/      # Prompt templates
│   ├── roo/          # Roo config
│   ├── supermaven/   # Supermaven config
│   ├── tabnine/      # Tabnine config
│   ├── trae/         # Trae config
│   ├── windsurf/     # Windsurf config
│   └── zed/          # Zed config
├── backup/           # Config backups
├── claude/           # Duplicate - should merge with ai/claude
├── infrastructure/   # CI/CD, Docker, formatters
└── telemetry/        # Telemetry configs
```

**Issues**:

1. `.config/claude/` duplicates `.config/ai/claude/`
2. Root `.amazonq/` duplicates `.config/ai/amazonq/`
3. `ai/` folder is well-organized but could use README

**Action**:

- Remove duplicate `.config/claude/` (merge into `.config/ai/claude/`)
- Add `.config/ai/README.md` index file
- Move `.config/ai/logs/` to `.config/telemetry/ai-logs/`

---

### 6. `.github/` ✅ KEEP AS-IS

**Purpose**: GitHub-specific configuration **Files**: 51 files (workflows,
templates, governance) **Structure**:

```
.github/
├── ISSUE_TEMPLATE/   # 5 issue templates
├── governance/       # 5 governance docs
├── workflows/        # 29 workflow files
├── CODEOWNERS, dependabot.yml, etc.
```

**Verdict**: Standard GitHub structure, well-organized **Action**: None required

---

### 7. `.husky/` ✅ KEEP AS-IS

**Purpose**: Git hooks **Files**: pre-commit hook + \_/ folder **Verdict**:
Standard Husky structure **Action**: None required

---

### 8. `.personal/` 🔄 CONSIDER MOVING

**Purpose**: Personal/family website projects **Files**: 4 README.md files
(drmalawein, portfolio, rounaq) **Issue**: Personal projects mixed with monorepo
infrastructure **Options**:

1. Keep as hidden folder (current)
2. Move to `family-platforms/` (already exists at root)
3. Keep separate but add to .gitignore

**Recommendation**: Merge with existing `family-platforms/` folder **Action**:
Move contents to `family-platforms/` and delete `.personal/`

---

### 9. `.pytest_cache/` 🗑️ DELETE (add to .gitignore)

**Purpose**: Python test cache **Files**: Auto-generated cache files
**Verdict**: Should never be committed **Action**: Delete and ensure in
.gitignore

---

### 10. `.ruff_cache/` 🗑️ DELETE (add to .gitignore)

**Purpose**: Ruff linter cache **Files**: Auto-generated cache files
**Verdict**: Should never be committed **Action**: Delete and ensure in
.gitignore

---

### 11. `.vscode/` ✅ KEEP AS-IS

**Purpose**: VS Code workspace settings **Files**: 4 files (extensions.json,
settings.json, tasks.json, workspace) **Verdict**: Standard VS Code structure
**Action**: None required

---

### 12. `archive/` 🔄 MERGE & REORGANIZE

**Purpose**: Archived planning documents **Current Files**: 23 files in 3
folders (phases, plans, reports) **Action**: Merge with `.archive/` into unified
structure:

```
archive/
├── automation/       # From .archive/automation-ts
├── business/         # From .archive/business-planning
├── chat-exports/     # From .archive/chat-exports
├── consolidation/    # From .archive/*-consolidation
├── infrastructure/   # From .archive/k8s, demo, etc.
├── phases/           # Keep from archive/phases
├── plans/            # Keep from archive/plans
└── reports/          # Merge archive/reports + .archive/reports
```

---

### 13. `automation/` 🔄 REORGANIZE

**Purpose**: AI automation system (Python + TypeScript) **Current Files**: 61+
files **Issues**:

1. Mixed Python (.py) and TypeScript (.ts) at root
2. `__pycache__/` should be gitignored
3. Multiple report files at root (debt_scan.md, remediation_plan.md, etc.)
4. Duplicate test folders (`__tests__/` and tests in subfolders)

**Proposed Structure**:

```
automation/
├── README.md
├── QUICKSTART.md
├── pyproject.toml
├── python/                    # Python automation
│   ├── __init__.py
│   ├── cli.py
│   ├── executor.py
│   ├── validation.py
│   ├── agents/
│   ├── deployment/
│   ├── orchestration/
│   ├── prompts/
│   ├── services/
│   ├── tools/
│   ├── types/
│   └── workflows/
├── typescript/                # TypeScript automation
│   ├── cli/
│   ├── core/
│   └── types/
├── reports/                   # Generated reports
│   ├── debt_scan.md
│   ├── remediation_plan.md
│   └── ...
└── tests/                     # Unified tests
    ├── python/
    └── typescript/
```

**Action**: Reorganize into language-specific subdirectories

---

### 14. `docs/` 🔄 REORGANIZE

**Purpose**: Documentation hub **Current Files**: 67+ files **Issues**:

1. Too many root-level .md files (30+)
2. Duplicate/overlapping content (CONSOLIDATION-_.md, PHASE-_.md)
3. `app/` folder contains a mini web app (should be in tools/)
4. `consolidate.bat` and `update-all-paths.py` are scripts (should be in tools/)

**Proposed Structure**:

```
docs/
├── README.md                  # Entry point
├── index.md                   # MkDocs index
├── mkdocs.yml                 # MkDocs config
├── getting-started/           # Onboarding
│   ├── START_HERE.md
│   ├── USE-NOW-GUIDE.md
│   └── QUICKSTART.md
├── architecture/              # Keep existing
├── ai/                        # AI-related docs
│   ├── AI-AUTO-APPROVE-GUIDE.md
│   ├── AI-TOOL-PROFILES.md
│   ├── AI-TOOLS-ORCHESTRATION.md
│   ├── ATLAS-ARCHITECTURE.md
│   └── MASTER_AI_SPECIFICATION.md
├── governance/                # Governance docs
│   ├── GOVERNANCE_SYSTEM_GUIDE.md
│   ├── ROOT_STRUCTURE_CONTRACT.md
│   └── CI_ENFORCEMENT_RULES.md
├── operations/                # Ops docs
│   ├── OPERATIONS_RUNBOOK.md
│   ├── DEVOPS-*.md
│   └── PARALLEL-TASKS-GUIDE.md
├── reference/                 # Keep existing
├── guides/                    # Keep existing
├── ai-knowledge/              # Keep existing (archive of phases)
└── historical/                # Move consolidation docs here
    ├── CONSOLIDATION-*.md
    └── POST-CONSOLIDATION-*.md
```

**Action**: Reorganize into topic-based subdirectories

---

### 15. `node_modules/` 🗑️ NEVER COMMIT

**Purpose**: NPM dependencies **Files**: 300+ packages **Verdict**: Should NEVER
be in git **Action**: Verify in .gitignore, delete if committed

---

### 16. `templates/` ⚠️ EXPAND OR MERGE

**Purpose**: Project templates **Current Files**: 1 file (components.json)
**Issue**: Nearly empty, underutilized **Options**:

1. Expand with actual templates
2. Merge into `tools/templates/` (already exists)
3. Merge into `.config/` as config templates

**Recommendation**: Merge with `tools/templates/` **Action**: Move
components.json to `tools/templates/` and delete root `templates/`

---

### 17. `tests/` 🔄 REORGANIZE

**Purpose**: Test suite **Current Files**: 40 files **Current Structure**:

```
tests/
├── ai/           # AI tool tests (7 .test.ts)
├── atlas/        # Atlas service tests
├── e2e/          # End-to-end tests
├── integration/  # Integration tests
├── unit/         # Unit tests
├── *.test.ts     # Root-level TS tests (5)
├── test_*.py     # Root-level Python tests (5)
└── conftest.py   # Pytest config
```

**Issues**:

1. Mixed Python and TypeScript at root level
2. `__pycache__/` should be gitignored

**Proposed Structure**:

```
tests/
├── README.md
├── conftest.py
├── python/
│   ├── test_catalog.py
│   ├── test_checkpoint.py
│   ├── test_enforce_metahub.py
│   ├── test_enforce_new.py
│   └── test_meta.py
├── typescript/
│   ├── ai/
│   ├── atlas/
│   ├── devops/
│   └── meta-cli.test.ts
├── e2e/
├── integration/
└── unit/
```

**Action**: Separate Python and TypeScript tests

---

### 18. `tools/` 🔄 REORGANIZE

**Purpose**: Development tools and utilities **Current Files**: 72+ files in 25
subdirectories **Current Structure**:

```
tools/
├── accessibility/    # Accessibility audit
├── adaptive-prompts/ # Prompt learning system
├── ai/              # AI tools (largest - 50+ files)
├── analytics/       # Analytics dashboard
├── backup/          # Backup utilities
├── bin/             # Binary scripts
├── cli/             # CLI tools
├── config/          # Config tools
├── cross-ide-sync/  # IDE sync
├── devops/          # DevOps tools
├── docker/          # Docker utilities
├── health/          # Health checks
├── lib/             # Shared libraries
├── marketplace/     # Marketplace tools
├── meta-prompt/     # Meta prompting
├── orchestrator/    # Orchestration
├── orchex/          # Orchestration executor
├── pattern-extractor/
├── prompt-composer/
├── prompt-testing/
├── recommendation-engine/
├── scripts/         # Shell scripts
├── security/        # Security tools
├── telemetry/       # Telemetry
└── templates/       # Templates
```

**Issues**:

1. Some folders may be empty or have minimal content
2. Overlap between `orchestrator/` and `orchex/`
3. Multiple prompt-related folders could consolidate

**Proposed Structure**:

```
tools/
├── README.md
├── ai/                    # Keep - well organized
├── analytics/             # Keep
├── cli/                   # Keep
├── devops/                # Keep
├── infrastructure/        # Merge: backup, docker, health
│   ├── backup/
│   ├── docker/
│   └── health/
├── prompts/               # Merge: adaptive-prompts, meta-prompt,
│   │                      #        prompt-composer, prompt-testing
│   ├── adaptive/
│   ├── composer/
│   ├── meta/
│   └── testing/
├── orchestration/         # Merge: orchestrator, orchex
├── scripts/               # Keep
├── security/              # Keep
├── templates/             # Keep + merge root templates/
└── utilities/             # Merge: lib, bin, cross-ide-sync
```

**Action**: Consolidate related tools into logical groups

---

## Execution Order

### Phase 1: Cleanup (Safe, Reversible)

1. ✅ Delete `.pytest_cache/`
2. ✅ Delete `.ruff_cache/`
3. ✅ Verify `node_modules/` in .gitignore
4. ✅ Delete `.amazonq/` (duplicate)
5. ✅ Update .gitignore

### Phase 2: Merge Archives

1. Merge `.archive/` → `archive/`
2. Reorganize `archive/` structure
3. Delete `.archive/`

### Phase 3: Consolidate Configs

1. Merge `.config/claude/` → `.config/ai/claude/`
2. Move `.config/ai/logs/` → `.config/telemetry/`
3. Add `.config/ai/README.md`

### Phase 4: Reorganize Personal

1. Merge `.personal/` → `family-platforms/`
2. Delete `.personal/`

### Phase 5: Merge Templates

1. Move `templates/components.json` → `tools/templates/`
2. Delete root `templates/`

### Phase 6: Reorganize Code Folders

1. Reorganize `automation/` (Python/TypeScript separation)
2. Reorganize `tests/` (Python/TypeScript separation)
3. Consolidate `tools/` subfolders

### Phase 7: Reorganize Docs

1. Create subdirectory structure
2. Move files to appropriate locations
3. Update cross-references

---

## .gitignore Additions

```gitignore
# Cache directories
.pytest_cache/
.ruff_cache/
__pycache__/
*.pyc

# Dependencies
node_modules/

# Backups (optional - may want to keep)
# .backups/

# IDE caches
.vite/
.vite-temp/
```

---

## Summary

| Folder           | Action                    | Priority |
| ---------------- | ------------------------- | -------- |
| `.allstar/`      | Keep                      | -        |
| `.amazonq/`      | Delete (duplicate)        | High     |
| `.archive/`      | Merge → archive/          | High     |
| `.backups/`      | Keep                      | -        |
| `.config/`       | Reorganize                | Medium   |
| `.github/`       | Keep                      | -        |
| `.husky/`        | Keep                      | -        |
| `.personal/`     | Merge → family-platforms/ | Medium   |
| `.pytest_cache/` | Delete                    | High     |
| `.ruff_cache/`   | Delete                    | High     |
| `.vscode/`       | Keep                      | -        |
| `archive/`       | Reorganize                | Medium   |
| `automation/`    | Reorganize                | Low      |
| `docs/`          | Reorganize                | Low      |
| `node_modules/`  | Gitignore                 | High     |
| `templates/`     | Merge → tools/templates/  | Medium   |
| `tests/`         | Reorganize                | Low      |
| `tools/`         | Consolidate               | Low      |

---

## Next Steps

Run the following command to begin Phase 1:

```powershell
# Review and approve, then execute
```

Would you like me to proceed with execution?
