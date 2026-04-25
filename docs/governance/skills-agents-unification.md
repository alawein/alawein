---
type: canonical
source: none
sync: none
sla: none
title: Skills, Agents & Commands Unification
description: Revise and unify Cursor/Claude skills, agents, and commands into a clear set that works for any repo, project, or website—not just governance.
last_updated: 2026-03-20
category: governance
audience: [ai-agents, contributors]
status: active
---

# Skills, Agents & Commands Unification

This document inventories **what we built** (Cursor + Claude plugins, skills, agents, commands), proposes a **unified taxonomy** (universal vs ecosystem vs org), and gives **concrete revision steps** so one clear set works for any repo, project, or website.

Operational maintenance, scope changes, and tailoring procedures are tracked in
[maintenance-skills-agents.md](./maintenance-skills-agents.md).
**Install policy (global vs repo vs plugins, MCP vs skills):** [skills-install-policy.md](./skills-install-policy.md).

---

## 1. Inventory: What We Made

### 1.1 Locations

| Where | What |
|-------|------|
| **Claude local plugins** | `~/.claude/plugins/cache/local/` — kohyr, repo-superpowers |
| **Cursor plugins** | Public plugins under `~/.cursor/plugins/cache/cursor-public/` plus local parity plugin `~/.cursor/plugins/local/workspace-universal/` |
| **Alawein repo** | Governance docs, [slash-commands-catalog.md](./slash-commands-catalog.md); no `.cursor/` or `.claude/` in repo |

### 1.2 Morphism Plugin (Claude, local)

**Path:** `~/.claude/plugins/cache/local/morphism/1.2.0/`  
**Purpose:** Governance for the kohyr ecosystem (validation, tenet compliance, layer transitions, session discipline).

| Type | Name | Description |
|------|------|-------------|
| **Commands** | `context` | Show current repo rules and layer boundaries |
| | `validate` | Run validators (`--quick` for pre-commit) |
| | `tenet-check` | Scan changes for tenet violations |
| | `session-start` | Initialize focused session (one goal) |
| | `scope-guard` | Check if work still matches session goal |
| | `review` | Full architectural review (tenet-analyzer + validation) |
| | `promote` | Lab→Hub promotion with dependency checks |
| | `daily-focus` | Today’s plan from Master Tasks / Calendar (Agent G) |
| | `weekly-review` | Weekly review from Notion (Agent H) |
| **Skills** | `morphism-context` | Auto context in morphism-* repos |
| | `tenet-awareness` | T18/T19/T20 and import-boundary questions |
| | `validation-reminder` | Remind to run validate before commit/PR |
| | `daily-focus` | (skill backing command) |
| | `weekly-review` | (skill backing command) |
| **Agents** | `tenet-analyzer` | Comprehensive tenet scanning |
| | `promotion-checker` | Dependency analysis for promote |
| **Hooks** | session-init, boundary-guard, scope-trigger | SessionStart, PreToolUse, PostToolUse |
| **Universal YAML** | morphism-validate, morphism-context, etc. | Reusable configs |

**Scope:** Morphism repos only (morphism/, morphism-ship/, morphism-bible/, etc.). Not for arbitrary repos or static sites.

---

### 1.3 Repo-Superpowers Plugin (Claude, local)

**Path:** `~/.claude/plugins/cache/local/repo-superpowers/1.0.0/`  
**Purpose:** Reusable codebase management for **any** repository.

| Type | Name | Description |
|------|------|-------------|
| **Commands** | `session-start` | Universal session start across repos and plain directories |
| | `context` | Universal context (repo type, scripts, suggested checks) |
| | `check-patterns` | Run pattern-checker agent |
| | `check-complexity` | Run complexity-analyzer agent |
| | `audit-deps` | Dependency audit |
| | `workspace:*` aliases | Preferred namespace aliases (`workspace:session-start`, `workspace:context`, etc.) with backward-compatible `repo-superpowers:*` commands retained |
| **Skills** | `codebase-audit` | Full audit + setup (any repo) |
| | `tech-debt-blitz` | Systematic tech-debt cleanup |
| | `test-bootstrap` | Add test suite |
| | `package-modernize` | Modern packaging (e.g. pyproject.toml, src layout) |
| | `base-class-extract` | Extract shared abstractions |
| | `error-hardening` | Improve error handling |
| | `ci-tooling-setup` | CI, pre-commit, linting |
| | `readme-rewrite` | Rewrite README to current state |
| | `dependency-audit` | Audit and clean dependencies |
| | `full-cleanup-pipeline` | Multi-step cleanup |
| | `code-quality-standards` | Quality framework (complexity, patterns, drift) |
| **Agents** | `pattern-checker` | Pattern consistency, conventions |
| | `complexity-analyzer` | Complexity metrics and refactor targets |
| **Hooks** | PreToolUse (Write/Edit) | Code quality guardrails (secrets, complexity, etc.) |

**Scope:** Any repo (codebase). Language-agnostic where possible.

---

### 1.4 Alawein Repo (governance + catalog)

| Asset | Purpose |
|-------|---------|
| `AGENTS.md`, `CLAUDE.md`, `SSOT.md` | Repo boundaries and quality gates |
| `docs/governance/workspace-master-prompt.md` | Workspace contract |
| `docs/governance/documentation-contract.md` | Doc contract and validation |
| `docs/governance/slash-commands-catalog.md` | Catalog of Cursor/Claude slash commands and workflows |
| `scripts/validate-doc-contract.sh`, `scripts/sync-readme.py` | Shell validation (not slash commands) |

**Scope:** Alawein org and repos that follow this governance. Slash catalog is written to be **generic** (any repo/dir) but references alawein-specific shell checks where relevant.

---

## 2. Unified Taxonomy

Split into three layers so the same mental model works everywhere:

| Layer | Scope | Examples |
|-------|--------|----------|
| **Universal** | Any repo, project, or website (code or docs) | Session start, context, audit, plan, research, validate (generic), deploy |
| **Ecosystem** | Morphism ecosystem only | Tenets, promote, morphism-context, validation-reminder (kohyr) |
| **Org** | Alawein (or another org) only | sync-readme, validate-doc-contract, workspace-master-prompt |

**Principle:** Universal capabilities live in one place and are **invokable from any directory**. Ecosystem and org layers **add** when detected (e.g. morphism-* repo, or alawein repo).

---

### 2.1 Universal Layer (target state)

Should work for:

- Any **git repo** (app, lib, monorepo)
- Any **non-git directory** (drafts, static site, docs)
- **Websites** (Vercel, GitHub Pages, etc.)

Proposed **universal** capabilities (names can be standardized):

| Capability | Current home | Notes |
|------------|---------------|--------|
| **Session start / context** | — (missing as universal) | “What is this dir? One goal.” Works like kohyr session-start but repo-agnostic |
| **Audit / onboard** | repo-superpowers: codebase-audit | Keep; already “any repo” |
| **Plan / brainstorm** | superpowers, compound-engineering | Use existing Cursor plugins; document in one place |
| **Research** | parallel plugin | Document |
| **Docs lookup** | context7:docs | Document |
| **Quality checks (generic)** | repo-superpowers: check-patterns, check-complexity, audit-deps | Generic; no kohyr tenets |
| **Cleanup / tech debt** | repo-superpowers: full-cleanup-pipeline, tech-debt-blitz, etc. | Keep as universal |
| **Validate (generic)** | — | “Run project’s own checks” (e.g. npm test, make check); not kohyr:validate |
| **Deploy** | vercel-deploy, deploy-docs | Document |

### 2.2 Ecosystem Layer (kohyr)

Keep as-is; **activate only** when in a morphism-* repo (or when user explicitly invokes kohyr commands):

- All kohyr commands, skills, agents, hooks
- validation-reminder only in kohyr repos (or when kohyr plugin is in use)

### 2.3 Org Layer (alawein)

Keep in repo; **activate only** when in alawein repo (or when working under alawein governance):

- Shell: `python scripts/sync-readme.py --check`, `./scripts/validate-doc-contract.sh --full`
- Docs: workspace-master-prompt, documentation-contract, SSOT, AGENTS

---

## 3. Revision Plan (Concrete Steps)

### 3.1 Add a Universal “Session / Context” (any repo or dir)

**Goal:** One entry point that works in any directory: “What is this? What’s my one goal?”

**Options:**

- **A) New command in repo-superpowers**  
  Add `session-start.md` and `context.md` that:
  - Detect: git repo vs plain dir; if repo, read README, package.json/pyproject.toml/Cargo.toml for project name and scripts.
  - No kohyr tenets; no layer boundaries.
  - Suggest one goal and optional “run these checks before commit” from project’s own config (e.g. npm run validate, make check).

- **B) New minimal “universal” plugin**  
  e.g. `~/.claude/plugins/cache/local/universal/1.0.0/` with only:
  - `commands/session-start.md`
  - `commands/context.md`
  - Optional: one skill “universal-context” that triggers on “what is this project”, “session start”, “where am I”.

Recommendation: **A** (keep one “any repo” plugin and extend repo-superpowers) to avoid plugin proliferation. Name the commands so they don’t collide with kohyr (e.g. `repo:session-start` or `workspace:context` if you namespace).

### 3.2 Rename / Namespace repo-superpowers (optional but clear)

- **Current:** repo-superpowers (commands: check-patterns, check-complexity, audit-deps).
- **Option 1:** Keep name; add universal session/context commands as above.
- **Option 2:** Rename to something like **workspace** or **universal-repo** and use a prefix for commands (e.g. `workspace:audit`, `workspace:session-start`) so Cursor/Claude list shows a clear “works for any project” set.

### 3.3 Unify Documentation in One Place

- **Single “how to use” doc:** Extend [slash-commands-catalog.md](./slash-commands-catalog.md) to:
  - List **our** plugins (kohyr, repo-superpowers) alongside Cursor public plugins.
  - Add a **Universal workflow** section: “Any repo or dir” → session-start/context → audit (if repo) → plan → implement → validate (project’s own) → deploy.
  - Keep **Ecosystem** and **Org** sections so kohyr and alawein are clearly optional add-ons.

- **This doc** (skills-agents-unification.md): Keep as the revision plan and taxonomy reference; link to it from CLAUDE.md and slash-commands-catalog.

### 3.4 Cursor Parity (optional)

- We have **no** Cursor-specific local plugins. Options:
  - **Minimal:** Add a **project rule** (e.g. in alawein: `.cursor/rules/alawein-governance.mdc`) that says “In alawein repo run sync-readme and validate-doc-contract before commit; see docs/governance.”
  - **Broader:** Create a small Cursor plugin (e.g. `workspace-universal`) that provides the same **universal** commands (session-start, context, audit) so Cursor and Claude share one mental model. Larger lift.

Recommendation: Start with the **minimal** rule in alawein and the unified doc; add Cursor plugin later if you want full parity.

### 3.5 Morphism: No Structural Change

- Keep kohyr plugin as-is: governance-only, kohyr repos only.
- Ensure **validation-reminder** only suggests `/morphism:validate` when in a kohyr repo (or when user has kohyr plugin active). No change needed if it’s already scoped by skill description.

### 3.6 Deprecate / Merge Nothing For Now

- **repo-superpowers** and **kohyr** stay separate: one universal (any repo), one ecosystem (kohyr).
- Public Cursor plugins (superpowers, compound-engineering, parallel) stay as-is; we only **document** how they fit in the universal workflow.

---

## 4. Universal Workflow (Any Repo or Dir)

After revision, a single recommended flow:

| Step | Action | Where it lives |
|------|--------|-----------------|
| 1 | **Session start / context** — “What is this? One goal.” | repo-superpowers (new) or universal plugin |
| 2 | **(If repo) Audit** — health, stack, issues | repo-superpowers: codebase-audit |
| 3 | **Plan** (if feature/task) | superpowers: brainstorm → write-plan; or compound-engineering: workflows:plan |
| 4 | **Implement** | compound-engineering: workflows:work or execute-plan |
| 5 | **Review** | compound-engineering: workflows:review |
| 6 | **Validate** | Project’s own (npm test, make check, etc.); in kohyr add `/morphism:validate`; in alawein add shell checks |
| 7 | **Deploy** (if app/site) | vercel-deploy or deploy-docs |

Ecosystem add-ons:

- **Morphism repo:** After step 1 run `/morphism:session-start` and use tenet-check/validate/review/promote as needed.
- **Alawein repo:** Before commit run `sync-readme.py --check` and `validate-doc-contract.sh --full`.

---

## 5. Summary

| Item | Action |
|------|--------|
| **Inventory** | Done in §1: kohyr (ecosystem), repo-superpowers (universal), alawein (org + catalog). |
| **Taxonomy** | Universal (any repo/dir); ecosystem (kohyr); org (alawein). See §2. |
| **New** | Add universal session-start + context (in repo-superpowers or new universal plugin). §3.1. |
| **Rename** | Optional: repo-superpowers → workspace/universal-repo with prefixed commands. §3.2. |
| **Docs** | Extend slash-commands-catalog with “our” plugins and universal workflow; link from CLAUDE.md. §3.3. |
| **Cursor** | Optional: .cursor rule in alawein; later Cursor plugin for universal commands. §3.4. |
| **Morphism** | No structural change. §3.5. |
| **Workflow** | One flow for any repo/dir; kohyr and alawein as optional layers. §4. |
| **Maintenance** | Use [maintenance-skills-agents.md](./maintenance-skills-agents.md) for scope/tailoring updates and edit pathways. |

This gives one clear set that works for **any repo, project, or website**, with governance (kohyr) and org (alawein) as explicit, optional layers on top.
