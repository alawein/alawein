---
title: Slash Commands Catalog & Workflows
description: Catalog of / slash commands from Cursor (and Claude Code) plugins, with run order and reusable workflows for any repo or directory.
last_updated: 2026-03-20
category: governance
audience: [ai-agents, contributors]
status: active
---

# Slash Commands Catalog & Workflows

This document lists slash commands available from **Cursor plugins** (and, where noted, **Claude Code** plugins). It gives a **reliable order** for running them and **workflows** as series of slashes that work for any repo or directory (with minor differences for git repos vs non-repos).

**Unified taxonomy:** For a single clear set that works for any repo, project, or website (not just governance), see [skills-agents-unification.md](./skills-agents-unification.md). Layers: **Universal** (any dir) | **Ecosystem** (morphism) | **Org** (alawein).
For the shortest daily command set, use [operator-command-cheatsheet.md](./operator-command-cheatsheet.md).

**Machine setup (skills across IDEs):** Install the global `skills` CLI, allowlisted agents, and avoid colliding with plugin-owned skills — see [skills-install-policy.md](./skills-install-policy.md). Bootstrap: `_workspace/ops/bootstrap-skills.ps1` / `bootstrap-skills.sh`.

---

## 1. Catalog by Plugin

### 1.0 Our Plugins (Claude Code, local)

**Repo-Superpowers** — universal, any repo or directory (`~/.claude/plugins/cache/local/repo-superpowers/`):

| Command | Description |
|--------|-------------|
| `/repo-superpowers:session-start` | Universal session start: detect project type, state one goal, suggest pre-commit checks. |
| `/repo-superpowers:context` | Show current directory context (project type, scripts, suggested checks). |
| `/repo-superpowers:check-patterns` | Run pattern-checker agent (conventions, drift). |
| `/repo-superpowers:check-complexity` | Run complexity-analyzer agent. |
| `/repo-superpowers:audit-deps` | Audit dependencies (unused, outdated, security). |

*Skills (invoked by description):* codebase-audit, tech-debt-blitz, test-bootstrap, package-modernize, base-class-extract, error-hardening, ci-tooling-setup, readme-rewrite, dependency-audit, full-cleanup-pipeline, code-quality-standards.

**Workspace namespace aliases (preferred, compatibility migration):**

| Command | Description |
|--------|-------------|
| `/workspace:session-start` | Preferred alias for universal session-start. |
| `/workspace:context` | Preferred alias for universal context. |
| `/workspace:check-patterns` | Preferred alias for pattern consistency checks. |
| `/workspace:check-complexity` | Preferred alias for complexity checks. |
| `/workspace:audit-deps` | Preferred alias for dependency audit. |

Legacy `/repo-superpowers:*` commands remain supported.

**Morphism** — ecosystem-only, morphism repos (`~/.claude/plugins/cache/local/morphism/`): see §1.8 below.

**Workspace-Universal (Cursor local parity plugin)** — `~/.cursor/plugins/local/workspace-universal/`:

| Command | Description |
|--------|-------------|
| `/workspace-universal:session-start` | Cursor-local universal session start for any repo or directory. |
| `/workspace-universal:context` | Cursor-local universal context card for any repo or directory. |

---

### 1.1 Superpowers (superpowers)

| Command | Description |
|--------|-------------|
| `/superpowers:brainstorm` | Use before any creative work; explores requirements and design before implementation. |
| `/superpowers:write-plan` | Create a detailed implementation plan with bite-sized tasks. |
| `/superpowers:execute-plan` | Execute a plan in batches with review checkpoints. |

**Run order (creative/feature work):** `brainstorm` → `write-plan` → (optional) `execute-plan`.

---

### 1.2 Compound Engineering (compound-engineering)

**Workflows (high-level):**

| Command | Description |
|--------|-------------|
| `/compound-engineering:workflows:brainstorm` | Explore requirements and approaches before planning. |
| `/compound-engineering:workflows:plan` | Turn a feature description into a well-structured project plan. |
| `/compound-engineering:workflows:work` | Execute work plans efficiently and finish features. |
| `/compound-engineering:workflows:review` | Exhaustive code review (multi-agent, worktrees). |
| `/compound-engineering:workflows:compound` | Document a recently solved problem for the team. |

**Support / one-off:**

| Command | Description |
|--------|-------------|
| `/compound-engineering:deepen-plan` | Enhance a plan with parallel research (best practices, depth). Arg: `[path to plan file]`. |
| `/compound-engineering:lfg` | Full autonomous engineering workflow (plan → deepen → work → review → todos → test → video). Arg: `[feature description]`. |
| `/compound-engineering:slfg` | Same as lfg but using swarm mode for parallel execution. |
| `/compound-engineering:resolve_todo_parallel` | Resolve all pending CLI todos in parallel. |
| `/compound-engineering:resolve_parallel` | Resolve all TODO comments in parallel. |
| `/compound-engineering:test-browser` | Run browser tests on pages affected by current PR/branch. |
| `/compound-engineering:test-xcode` | Build and test iOS apps on simulator (XcodeBuildMCP). |
| `/compound-engineering:feature-video` | Record a feature walkthrough and add it to the PR description. |
| `/compound-engineering:reproduce-bug` | Reproduce and investigate a bug (logs, console, browser). Arg: `[GitHub issue #]`. |
| `/compound-engineering:report-bug` | Report a bug in the compound-engineering plugin. |
| `/compound-engineering:triage` | Triage and categorize findings for the CLI todo system. |
| `/compound-engineering:heal-skill` | Fix incorrect or outdated SKILL.md files. |
| `/compound-engineering:generate_command` | Create a new custom slash command. |
| `/compound-engineering:create-agent-skill` | Create or edit Claude Code skills. |
| `/compound-engineering:changelog` | Create changelogs for recent merges to main. |
| `/compound-engineering:agent-native-audit` | Run agent-native architecture review with scored principles. |
| `/compound-engineering:deploy-docs` | Validate and prepare docs for GitHub Pages deployment. |

---

### 1.3 Parallel (parallel)

| Command | Description | Args |
|--------|-------------|------|
| `/parallel:parallel-setup` | Install Parallel CLI and authenticate. | — |
| `/parallel:parallel-search` | Web search (default for most research). | `<query>` |
| `/parallel:parallel-extract` | Extract content from URLs (web, PDFs). | `<url> [url2] …` |
| `/parallel:parallel-research` | Exhaustive multi-source research (use when explicitly requested). | `<topic>` |
| `/parallel:parallel-enrich` | Bulk data enrichment with web-sourced fields. | `<file or entities> with <fields>` |
| `/parallel:parallel-status` | Check status of a running research task. | `<run_id>` |
| `/parallel:parallel-result` | Get result of a completed research task. | `<run_id>` |

**Run order:** Use `parallel-setup` once; then `parallel-search` or `parallel-research` as needed; use `parallel-status` / `parallel-result` when you have a `run_id`.

---

### 1.4 Context7 (context7-plugin)

| Command | Description | Args |
|--------|-------------|------|
| `/context7:docs` | Look up documentation for any library. | `<library> [query]` |

Use when you need up-to-date API/docs or examples (e.g. React, Next.js, Prisma).

---

### 1.5 Sentry (sentry)

| Command | Description | Args |
|--------|-------------|------|
| `/sentry:seer` | Ask natural-language questions about your Sentry environment. | `<query>` |

Use for errors, issues, trends, assignments (requires Sentry MCP).

---

### 1.6 Vercel (vercel)

| Command | Description |
|--------|-------------|
| `/vercel:vercel-deploy` | Deploy the current project to Vercel (CLI install, auth, deploy). |

Use from project root of a Vercel-ready app.

---

### 1.7 Morphism (Claude Code, local — ecosystem only)

Available in **Claude Code** when the Morphism plugin is installed (e.g. `~/.claude/plugins/cache/local/morphism/`). In **Cursor**, these may appear if the same plugin is installed for Cursor.

| Command | Description |
|--------|-------------|
| `/morphism:validate` | Run morphism validators; explain failures with tenet references. Optional: `--quick` for fast checks before commit. |
| `/morphism:review` | Full architectural review (tenet-analyzer + validation). |
| `/morphism:promote` | Guided promotion from lab/ to hub/ with dependency validation. |
| `/morphism:context` | Show current morphism repo context (allowed/forbidden). |
| `/morphism:session-start` | Initialize a focused session (read SSOT, declare one goal). |
| `/morphism:tenet-check` | Scan recent changes for tenet violations. |
| `/morphism:scope-guard` | Check if current work still matches session goal. |
| `/morphism:daily-focus` | Today’s focus plan from Master Tasks, Email, Calendar (Agent G). |
| `/morphism:weekly-review` | Weekly review from Notion databases (Agent H). |

**Run order (morphism repos):** `session-start` → work → `tenet-check` / `scope-guard` as needed → `validate` (e.g. `--quick` before commit) → `review` if doing architectural review.

---

## 2. Repo vs Non-Repo Behavior

- **Git repo:** Commands that run `git status`, `git diff`, or “current branch/PR” (e.g. `test-browser`, `feature-video`, `changelog`) only make sense in a repo. Same for alawein governance checks below.
- **Non-repo directory:** Research, docs lookup, setup, and generic planning commands work anywhere. Skip git- or PR-specific steps when not in a repo.

**Alawein-specific (this org repo):**

- In `alawein/alawein`, after edits run (shell, not slash):
  - `python scripts/sync-readme.py --check`
  - `./scripts/validate-doc-contract.sh --full`
- These are **not** slash commands; they are the quality gates referenced in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md).

---

## 3. Reliable Order for Common Scenarios

### 3.0 Universal session (any repo or dir)

1. `/workspace:session-start` — detect project, state one goal, get suggested pre-commit checks.
2. Optional: `/workspace:context` — show project type and scripts.

Use this first when opening a new folder or repo; then follow scenario-specific steps below.

### 3.1 New feature (any repo)

1. `/workspace:session-start` (optional but recommended)
2. `/superpowers:brainstorm` or `/compound-engineering:workflows:brainstorm`
3. `/compound-engineering:workflows:plan` with feature description (or `/superpowers:write-plan`)
4. (Optional) `/compound-engineering:deepen-plan` with path to the plan file
5. `/compound-engineering:workflows:work`
6. `/compound-engineering:workflows:review`
7. (If using CLI todos) `/compound-engineering:resolve_todo_parallel`
8. `/compound-engineering:test-browser` (if web and in a repo with PR)
9. (Optional) `/compound-engineering:feature-video` for PR

### 3.2 Bug investigation (repo with GitHub issues)

1. `/compound-engineering:reproduce-bug` with issue number
2. Fix and re-run tests; optionally `/compound-engineering:workflows:review` before merge

### 3.3 Research / docs (any dir)

1. `/parallel:parallel-search` &lt;query&gt; or `/parallel:parallel-research` &lt;topic&gt;
2. Or `/context7:docs` &lt;library&gt; [query] for API/docs
3. For URL content: `/parallel:parallel-extract` &lt;url&gt;

### 3.4 Before commit (repo)

- **Morphism repos:** `/morphism:validate --quick` (or full `/morphism:validate`).
- **Alawein repo:** Run `python scripts/sync-readme.py --check` and `./scripts/validate-doc-contract.sh --full` (see [AGENTS.md](../../AGENTS.md)).

### 3.5 Deploy

- **Vercel:** `/vercel:vercel-deploy` from project root.
- **Docs (e.g. GitHub Pages):** `/compound-engineering:deploy-docs` after validation.

---

## 4. Ready-Made Workflows (Series of Slashes)

Use these in order in a single session when applicable.

### 4.0 Universal workflow (any repo or dir)

1. `/workspace:session-start`
2. (If repo) `/workspace:context` or invoke codebase-audit skill for full audit
3. Plan → work → review → project's own validate → deploy as needed

See [skills-agents-unification.md](./skills-agents-unification.md) §4 for the
full table and [maintenance-skills-agents.md](./maintenance-skills-agents.md)
for scope/tailoring changes.

### 4.1 Full feature flow (LFG-style)

Run in order; stay in one thread so context is preserved:

1. `/compound-engineering:workflows:plan` *&lt;feature description&gt;*
2. `/compound-engineering:deepen-plan` *&lt;path to plan from step 1&gt;*
3. `/compound-engineering:workflows:work`
4. `/compound-engineering:workflows:review`
5. `/compound-engineering:resolve_todo_parallel`
6. `/compound-engineering:test-browser`
7. `/compound-engineering:feature-video`

Or use the single meta-command: `/compound-engineering:lfg` *&lt;feature description&gt;* (it runs a similar sequence; may require ralph-wiggum plugin for step 1).

### 4.2 Plan-only (no implementation)

1. `/superpowers:brainstorm` or `/compound-engineering:workflows:brainstorm`
2. `/compound-engineering:workflows:plan` *&lt;feature or goal&gt;*
3. `/compound-engineering:deepen-plan` *&lt;plan file path&gt;*

### 4.3 Execute existing plan

1. `/superpowers:execute-plan` or `/compound-engineering:workflows:work` (with plan context in chat or file path as instructed).

### 4.4 Research then plan

1. `/parallel:parallel-search` *&lt;topic&gt;* or `/parallel:parallel-research` *&lt;topic&gt;*
2. `/compound-engineering:workflows:plan` *&lt;feature using research findings&gt;*

### 4.5 Morphism session (morphism repos only)

1. `/morphism:session-start`
2. Do work; optionally `/morphism:scope-guard` or `/morphism:tenet-check`
3. `/morphism:validate --quick` before commit; `/morphism:review` if doing arch review

### 4.6 Alawein governance (alawein repo only)

Not slash commands; run in shell:

1. `python scripts/sync-readme.py --check`
2. `./scripts/validate-doc-contract.sh --full`

---

## 5. Quick Reference Table

| Goal | First command | Then |
|------|----------------|------|
| New feature | `workflows:brainstorm` or `brainstorm` | `workflows:plan` → `deepen-plan` → `workflows:work` → `workflows:review` |
| Execute plan | `execute-plan` or `workflows:work` | — |
| Research | `parallel-search` or `parallel-research` | `parallel-result` if async run |
| Docs lookup | `context7:docs <lib> [query]` | — |
| Bug | `reproduce-bug <issue#>` | fix → review |
| Before commit (morphism) | `morphism:validate --quick` | — |
| Before commit (alawein) | `sync-readme.py --check` + `validate-doc-contract.sh --full` | — |
| Deploy app | `vercel:vercel-deploy` | — |
| Deploy docs | `deploy-docs` | — |

---

*See [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md) for repo boundaries and quality gates. Slash command names may include a plugin prefix (e.g. `compound-engineering:workflows:plan`) depending on Cursor version and how commands are registered.*
