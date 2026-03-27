---
type: canonical
source: none
sync: none
sla: none
---

# Docs Doctrine

> File Governance, Validation & Enforcement — Version 1.0, March 2026

---

## Part 1: Doctrine Rules

These ten rules form the normative governance layer for all documentation and
configuration files. They are designed for enforcement by automation, not human
memory.

### Rule 1: File Classification is Mandatory

Every managed file MUST declare exactly one of four classification forms:

- **Canonical** -- the single, authoritative source of truth for its content
  domain.
- **Derived** -- deterministically generated from one or more canonical sources.
- **Generated** -- tool output that is non-deterministic or depends on external
  state.
- **Frozen** -- an archived, immutable snapshot that must never be modified.

If a file's classification is ambiguous or undeclared, the file is invalid and
must be resolved before merge.

### Rule 2: Canonical Files Are Unique

A canonical file MUST have exactly one owner location in the repository
hierarchy. Duplication of canonical intent is forbidden. If two files claim
authority over the same content domain, both are invalid until one is designated
canonical and the other is reclassified as derived or deleted.

### Rule 3: Derived Files Must Declare Source

Every derived file MUST include a metadata header declaring: source file
path(s), sync mechanism (ci, script, manual), and freshness SLA. If any
declaration is missing, the file is treated as stale by default and flagged for
resolution.

### Rule 4: Freshness SLAs Are Enforced

Every derived file must define one of four SLA tiers:

| Tier | Behavior |
|------|----------|
| Realtime | CI-enforced; stale state blocks merge |
| On-change | Triggered rebuild when source changes |
| Manual | Explicit regeneration command required |
| None | Permitted only for frozen files |

Stale derived files are treated as broken, not "eventually consistent." A stale
file is equivalent to a failing test.

### Rule 5: Naming Conventions Are Strict

- Root-level canonical files use `UPPERCASE.md` (e.g., `CLAUDE.md`,
  `README.md`).
- Directories use `kebab-case`.
- Timestamps follow `YYYY-MM-DD` or `YYYYMMDD-HHMM` format.
- Version suffixes (`_v2`, `_final`, `_new`) are banned.
- Backup extensions (`.bak`, `.old`, `.tmp`) are banned -- use version control.

Violations trigger automatic rejection at the pre-commit gate.

### Rule 6: Directory Boundaries Are Enforced

Every file must belong to exactly one domain boundary: **Workspace**,
**Organization**, **Product**, or **Infrastructure**. Cross-domain file leakage
(e.g., a canonical org-level file living in a product repo) is not permitted and
must be corrected by moving the file to its proper domain.

### Rule 7: Canonical vs Derived Must Be Explicit

For every known dual-source pattern (CLAUDE.md in two locations, INDEX.md,
config files from templates), exactly one file is designated canonical and all
others are derived or deleted. No "co-equal" files are allowed. If two files
evolve independently, the system design must be corrected.

### Rule 8: Workspace Root is Controlled

The workspace root may only contain: active working state, temporary
orchestration files, and entry-point documentation. Canonical definitions,
long-term configs, duplicated templates, and archived files must not live at
workspace root -- they belong in structured repositories (org, product, or
infra).

### Rule 9: Deletion Must Be Final

When retiring a file: optionally mark as FROZEN for a short transition, remove
all inbound references, verify no dependency usage, then delete. Files must not
linger in an "unused but present" state. A file is a **zombie** if it is not
referenced, not canonical, and not actively generated. Zombies must be deleted
immediately.

### Rule 10: Validation Over Trust

Compliance is enforced by pattern-based validation (not hardcoded file lists),
structural rules (not human memory), and automation-first checks. If a property
can drift, it will drift. Every enforceable rule must have a corresponding
automated check.

---

## Part 2: File Classification Table

| File Type | Class | Canonical Source | Derived? | SLA | Generator | Notes |
|-----------|-------|------------------|----------|-----|-----------|-------|
| CLAUDE.md (root) | Canonical | Per-repo root | No | N/A | — | Project-specific, human-owned |
| .claude/CLAUDE.md | Derived | org/governance-templates | Yes | On-change | `sync-claude.sh` | Governance template; preserves per-repo description |
| INDEX.md | Derived | Directory structure | Yes | On-change | `generate-index.sh` | Auto-generated, never hand-edited |
| projects.json | Canonical | Org repo | No | N/A | — | Single source of truth |
| Project README | Canonical | Project repo root | No | N/A | — | Human-owned |
| Batch templates | Canonical | templates/ dir | No | N/A | — | Never duplicated into repos |
| Generated configs | Derived | Templates | Yes | On-change | `render-configs.sh` | Deterministic rendering |
| Logs | Generated | Runtime | No | None | — | Ephemeral, not reproducible |
| Reports | Generated | Pipelines | No | None | — | Point-in-time snapshots |
| Snapshots | Frozen | Prior canonical | No | None | — | Immutable after creation |

---

## Part 3: Directory Tree Templates

### 3.1 Workspace Root

Transient working state only. Nothing here is canonical.

```text
workspace/
  CLAUDE.md              # derived or entry-point
  CURRENT.md             # ephemeral active state
  scratch/               # temporary work (gitignored)
  runs/                  # execution outputs
  staging/               # pre-commit artifacts
```

### 3.2 Organization Repo

Owns all org-wide canonical files and governance.

```text
org/
  CLAUDE.md              # CANONICAL -- org-wide rules
  projects.json          # CANONICAL -- project registry
  templates/             # CANONICAL -- shared templates
  scripts/               # automation tooling
  governance/
    docs-doctrine.md     # this document
  indexes/               # DERIVED -- auto-generated
```

### 3.3 Product Repo

Each product owns its README and source. Everything else is derived from org.

```text
product-x/
  README.md              # CANONICAL -- project-specific
  CLAUDE.md              # DERIVED from org CLAUDE.md
  src/
  docs/
    INDEX.md             # DERIVED -- auto-generated
  config/                # DERIVED from templates/
```

### 3.4 Infrastructure Repo

Canonical modules and environment-specific derived configs.

```text
infra/
  README.md              # CANONICAL
  modules/               # CANONICAL -- shared infra modules
  environments/          # per-env config
  generated/             # DERIVED -- rendered from modules
  scripts/               # tooling
```

---

## Part 4: Canonical vs Derived Resolution

| Pattern | Canonical Decision | Derived Behavior | Escalation |
|---------|-------------------|------------------|------------|
| CLAUDE.md x2 | Org version is canonical | Local = filtered projection via sync-claude | Independent edits -> redesign |
| INDEX.md | None (always derived) | Auto-generated from directory structure | Manual edits -> overwritten |
| projects.json | Org repo only | Never duplicated to product repos | Local copy -> delete |
| Batch templates | templates/ dir only | Instantiated per-run, never copied | Forked template -> merge back |
| Config files | templates/ dir | Rendered per environment by generator | Drift -> re-render |

**Core principle:** If two files evolve independently, that is a system design
defect, not a documentation issue. Fix the system, not the symptoms.

---

## Part 5: YAML Frontmatter Header Format

Every managed file must include a YAML frontmatter header:

```yaml
---
type: canonical | derived | generated | frozen
source: <path or "none">
sync: ci | script | manual | none
sla: realtime | on-change | manual | none
---
```

For derived files, `source`, `sync`, and `sla` are all required. For canonical
and frozen files, set source/sync/sla to `none`.

---

## Part 6: Enforcement Matrix

| Rule | Check | Gate | Frequency | Failure Mode |
|------|-------|------|-----------|--------------|
| R1: Classification | Header parsing | Pre-commit + CI | Every commit | Block merge |
| R2: Unique canonical | Duplicate scan | CI | Every commit | Block merge |
| R3: Source declared | Header field check | Pre-commit | Every commit | Block commit |
| R4: Freshness SLA | Hash comparison | CI + cron | Hourly + commit | Alert + block |
| R5: Naming | Regex patterns | Pre-commit | Every commit | Block commit |
| R6: Directory bounds | Path validation | CI | Every commit | Block merge |
| R7: Dual-source | Canonical count | CI | Every commit | Block merge |
| R8: Workspace root | Path whitelist | Manual + CI | Weekly | Alert |
| R9: No zombies | Reference scan | Cron CI | Monthly | Alert |
| R10: Automation | All of the above | All | Continuous | Block + alert |

---

## Part 7: Migration Phases

### Phase 1: Stop the Bleeding

- Ban all backup files (`.bak`, `.old`, `.tmp`) and version suffixes
- Enforce naming conventions in CI
- Add YAML frontmatter headers to all existing managed files
- Deploy pre-commit hook (thin mode: naming + header checks only)

### Phase 2: Resolve Dual Sources

- Audit all CLAUDE.md files; designate org version as canonical
- Centralize all templates into `org/templates/`
- Identify and delete duplicate config files across repos
- Update all derived files to declare their canonical source in headers

### Phase 3: Introduce Generation

- Implement `generate-index.sh` for INDEX.md files
- Implement `sync-claude.sh` for local CLAUDE.md projection
- Implement `render-configs.sh` for template-based configs
- Define and record freshness SLAs for all derived files

### Phase 4: Clean Workspace

- Remove any canonical files from workspace root
- Move persistent files to correct domain repos
- Run zombie detection; delete all unreferenced non-canonical files
- Verify workspace root matches the template in Part 3

### Phase 5: Full Enforcement

- Deploy full validation script in CI pipeline
- Enable merge-blocking on validation failures
- Add drift detection (hash comparison for derived files)
- Schedule monthly zombie scan as a cron CI job

---

## Part 8: Enforcement Deployment

### Pre-commit Hook

Deploy via `scripts/deploy-hooks.sh --all`. The hook checks:
- Rule 5: naming conventions (banned extensions, banned suffixes)
- Rule 1: frontmatter presence on managed file types
- Full validation (when validator script is reachable)

Repos with existing non-doctrine pre-commit hooks are skipped (not
overwritten). Check deployment status: `scripts/deploy-hooks.sh --check`.

### Reusable CI Workflow

Product repos can adopt doctrine validation by adding a workflow that calls:

```yaml
jobs:
  doctrine:
    uses: alawein/alawein/.github/workflows/doctrine-reusable.yml@main
    with:
      strict: "true"  # or "false" for warn-only
```

### Periodic Freshness Audit

The org repo CI runs monthly (1st of month, 06:00 UTC) to check for stale
derived files. Drift is detected by regenerating derived files and checking
for git diff.

### Escalation Path

When a derived file goes stale beyond its SLA:

| SLA Tier | Detection | Action | Escalation |
|----------|-----------|--------|------------|
| Realtime | CI on every commit | Block merge | Fix immediately |
| On-change | CI drift-check | Warn in PR | Regenerate before next merge |
| Manual | Monthly cron | GitHub issue | Owner regenerates within 7 days |
| None (frozen) | N/A | N/A | File is immutable |

If a stale file persists beyond its escalation window, it is flagged as a
zombie candidate (Rule 9) in the next monthly scan.

---

## Core Principle

> Every file must justify its existence.
> Why does it exist? Where is its source? How does it stay correct?
> If it can't answer those, it shouldn't exist.
