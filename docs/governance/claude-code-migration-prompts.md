---
title: Claude Code migration prompts and checklists
description: Copy-paste superprompt and phased prompts to audit, upgrade, and harmonize Claude Code config; plus a practical migration checklist.
last_updated: 2026-03-25
last_verified: 2026-03-25
category: governance
audience: [ai-agents, contributors]
status: active
related:
  - ./claude-code-configuration-guide.md
  - ./claude-code-worked-examples.md
---

# Claude Code migration prompts and checklists

Use with [claude-code-configuration-guide.md](./claude-code-configuration-guide.md). All prompts below are **manual copy-paste** into Claude Code unless your toolchain wraps them.

**Safety:** These prompts assume you **approve file writes**; adjust if your session auto-applies edits.

---

## Guiding principles (short)

- **CLAUDE.md** is refined by **deletion**, not accumulation (after `/init` or bootstrap output).
- Only include what the model **cannot infer from code**; use **hooks** for format/lint.
- Prefer **skills/** over **commands/** for new workflows that need assets, tool limits, or auto-invocation.
- **Skills** are **directories** (`SKILL.md` + optional `scripts/`, `templates/`).
- **Agents** = who; **skills** = what.
- **Hooks** must stay **fast** (under ~2s).
- Treat **`.claude/`** like **CI config** (review, commit).
- **Global `~/.claude/`** = personal; never commit.
- **`CLAUDE.local.md`** and **`settings.local.json`** = personal overrides (gitignore).
- Target **under ~200 lines** per `CLAUDE.md`; extract to **`rules/`**.
- Phrase **"Prefer X over Y"** rather than "Do not Y".

---

## Superprompt: infrastructure architect (Windows-aware)

Paste when you want a **three-phase** audit → plan → execute flow. Requires explicit approval before writes (as written).

```text
# Claude Code Setup & Upgrade — Superprompt

> Reference: docs/governance/claude-code-configuration-guide.md and docs/governance/claude-code-worked-examples.md in the alawein org hub (or this repo's copy).

## Context

I'm running Claude Code from PowerShell on Windows. Before doing anything, orient yourself:

1. Print my current working directory
2. Confirm this is a git repository (or tell me if it isn't)
3. If I'm in a system directory (like System32, Program Files, Windows, etc.), STOP and tell me to cd into my actual project directory first — never write config to system paths

## Your Mission

Act as my Claude Code infrastructure architect. You have three jobs, executed in order. Complete each phase fully before moving to the next. Never write or modify files without my explicit approval.

---

## PHASE 1: Discovery & Audit

### 1A. Project-Level Scan
Find and inventory every governance/instruction file in this project:
- CLAUDE.md (root + any subdirectories)
- CLAUDE.local.md
- .claude/ directory and ALL contents (settings.json, settings.local.json, commands/, skills/, agents/, rules/, hooks, .mcp.json)
- Legacy files: .cursorrules, .github/copilot-instructions.md, AGENTS.md, .clinerules, CONVENTIONS.md

For each file found, report:
| File | Lines | Summary | Last Modified | Issues |

Flag: stale info, contradictions, duplicated rules, things a linter already handles, wrong file paths, references to removed dependencies.

### 1B. Global Scan
Check my global config at ~/.claude/ (on Windows: %USERPROFILE%\.claude\):
- CLAUDE.md — exists? contents?
- settings.json — current permissions/hooks?
- skills/ — any global skills?
- commands/ — any global commands?
- keybindings.json — custom keybindings?
- projects/ — list projects with auto-memory, note stale ones

### 1C. Gap Analysis
Using the configuration guide as your reference for ideal structure, identify:

**Critical / broken** — contradictory rules, stale commands, security issues, wrong paths
**Upgrade candidates:**
  - .claude/commands/*.md files that should migrate to skills/ (need bundled scripts, auto-invocation, or tool restrictions)
  - CLAUDE.md sections over 50 lines on one topic → extract to .claude/rules/
  - Style rules in CLAUDE.md that should be hooks instead (formatting, linting, import sorting)
  - Missing permissions or deny rules in settings.json
**Missing but valuable** — hooks, agents, skills, rules that would help for this stack
**Dead weight** — rules the model already follows, duplicated instructions, stale references

Present Phase 1 findings as a structured report. Then STOP and wait for my input.

---

## PHASE 2: Plan

Based on my feedback on Phase 1, create a concrete execution plan covering:

### Project-Level Changes
1. **CLAUDE.md** — proposed content (aim for <200 lines, only what Claude can't infer from code)
   - Use "Prefer X over Y" phrasing, not "Do not Y"
   - Include: build/test/lint commands, architecture overview, hard rules
   - Exclude: anything the linter handles, generic advice, personal preferences
2. **settings.json** — proposed permissions (allow/deny) and hooks
   - PostToolUse hook for formatter (detect which one this project uses)
   - PostToolUse hook for type checking if TypeScript
   - Deny list for dangerous operations
3. **.claude/rules/** — proposed modular rule files (only if CLAUDE.md topics need depth)
4. **.claude/skills/** — proposed skills for repeatable workflows (with frontmatter)
   - Add context: fork for skills that shouldn't pollute main context
   - Add allowed-tools for read-only skills
5. **.claude/agents/** — proposed subagents if this project benefits from isolated reviewers
6. **Commands → Skills migration** — for any existing commands that should upgrade
7. **.gitignore additions** — CLAUDE.local.md, .claude/settings.local.json

### Global Changes (if needed)
1. **~/.claude/CLAUDE.md** — cross-project preferences (30-50 lines)
2. **Global skills** — 2-3 universally useful skills (commit, reflection, etc.)
3. **Stale memory cleanup** — prune dead projects from ~/.claude/projects/

### Execution Order
Number every change. Group them as:
- Phase 2A: Fix broken/harmful issues
- Phase 2B: Migrate commands → skills
- Phase 2C: Extract rules, add hooks
- Phase 2D: Create new agents/skills
- Phase 2E: Prune CLAUDE.md
- Phase 2F: Global config updates
- Phase 2G: Git hygiene (.gitignore, commit .claude/)

For each change, show me the EXACT content that will be written. Show diffs for modifications.

Present the full plan. Then STOP and wait for my approval. I may modify items before you proceed.

---

## PHASE 3: Execute

After I approve (with any modifications):

1. Execute changes in the approved order
2. After each file write/modification, confirm what was done
3. After all project-level changes: re-read the complete config and flag any remaining contradictions
4. Show a before/after comparison:
   | File | Before (lines) | After (lines) | Action |
5. After all global changes: confirm what was written to ~/.claude/
6. Final verification: run a quick sanity check
   - Can Claude find the build command?
   - Do all referenced file paths exist?
   - Are there any contradictions between CLAUDE.md and rules/?
   - Is settings.json valid JSON?
```

---

## Prompt: Audit and upgrade (single project)

```text
# Request: Audit & Upgrade My Claude Code Configuration

## Phase 1: Full Inventory

Scan this project and report back with a structured inventory. Don't change anything yet.

### Config files
Find and list every governance/instruction file:
- CLAUDE.md (root and any subdirectories)
- CLAUDE.local.md
- .claude/ directory contents (settings.json, settings.local.json, commands/, skills/, agents/, rules/, .mcp.json)
- Any legacy files: .cursorrules, .github/copilot-instructions.md, AGENTS.md, .clinerules, CONVENTIONS.md

For each file found, give me:
- Path
- Line count
- One-sentence summary of what it covers
- Last modified date (from git log if available)
- Issues: stale info, contradictions, duplicated rules, things your linter already handles

### Memory files
Check ~/.claude/projects/ for any auto-memory related to this project. Summarize what's there.

### Migration candidates
- List any .claude/commands/*.md files that should become skills/ (they need bundled scripts, auto-invocation, or tool restrictions)
- List any CLAUDE.md rules that should be extracted to .claude/rules/ (50+ lines on a single topic)
- List any CLAUDE.md style rules that should become hooks instead (formatting, linting, import sorting)

## Phase 2: Recommendations

Based on the inventory, propose a specific upgrade plan. Organize it as:

### Fix now (broken or harmful)
- Contradictory rules, stale build commands, wrong file paths, security issues

### Upgrade (improve quality)
- Commands → Skills migration
- CLAUDE.md bloat → extract to rules/
- Style enforcement → hooks in settings.json
- Missing permissions in settings.json

### Add (missing but valuable)
- Hooks not yet configured (formatter, type checker)
- Agents that would help (reviewer, security auditor)
- Skills for workflows you do repeatedly
- Rules files for domains with lots of conventions

### Remove (dead weight)
- Rules Claude already follows without being told
- Duplicated instructions across files
- Stale references to removed code/dependencies

Present this plan and wait for my approval before making any changes.

## Phase 3: Execute

Once I approve (I may modify the plan), execute the changes in this order:
1. Fix broken/harmful issues first
2. Migrate commands → skills (preserve the old files until confirmed working)
3. Extract rules from CLAUDE.md
4. Add hooks to settings.json
5. Create any new agents/skills
6. Prune CLAUDE.md — delete lines that are now handled by rules/, hooks, or that Claude infers from code
7. Run a final check: read the complete config and flag any remaining contradictions

After all changes, show me a before/after line count comparison for every file touched.
```

---

## Prompt: Global ~/.claude/ setup

```text
# Request: Set Up My Global Claude Code Configuration

I want to configure my global ~/.claude/ directory with sensible defaults that apply across all my projects. Survey what's already there before changing anything.

## Step 1: Inventory current global config

Check and report on:
- ~/.claude/CLAUDE.md — does it exist? What's in it?
- ~/.claude/settings.json — current permissions and hooks
- ~/.claude/skills/ — any global skills installed?
- ~/.claude/commands/ — any global commands?
- ~/.claude/keybindings.json — custom keybindings?
- ~/.claude/projects/ — list projects with auto-memory, show sizes

Report what you find and note anything that looks stale or misconfigured.

## Step 2: Propose a global setup

Based on what's there (and what's missing), propose:

### ~/.claude/CLAUDE.md (personal cross-project preferences)
Draft a concise file (~30–50 lines) covering:
- My coding style preferences (ask me if you don't know them)
- Default commit message format
- How I like plans presented (file? inline? structured?)
- Any "always do this" rules I've mentioned in past sessions (check memory)

### ~/.claude/settings.json (global permissions)
Propose sensible defaults:
- Safe allow-list for common tools
- Deny-list for dangerous operations (rm -rf, curl to unknown hosts)
- Any global hooks that make sense (like a formatter if I use one consistently)

### Global skills worth having
Suggest 2-3 global skills that are useful in any project:
- A reflection/session-review skill
- A commit skill with conventional commits
- Anything else that fits my workflow

### Keybindings
If I don't have custom keybindings, suggest useful ones.

Present the full plan and wait for my approval before writing any files.

## Step 3: Execute

Create/update files only after approval. For each file:
- Show me the content before writing
- If updating an existing file, show the diff
- Back up any file being replaced (copy to ~/.claude/backup/)
```

---

## Prompt: Multi-repo consistency

```text
# Request: Audit Claude Code Config Across Multiple Projects

I want to make my Claude Code setup consistent across my projects. Help me find inconsistencies and create shared conventions.

## Step 1: Discover projects

Look for git repositories in the current directory (one level deep). For each repo found, scan for:
- CLAUDE.md (root)
- .claude/ directory and its contents
- Any other governance files (.cursorrules, AGENTS.md, etc.)

Create a comparison table:
| Project | CLAUDE.md | settings.json | commands/ | skills/ | agents/ | rules/ | hooks |

Show line counts and yes/no for each.

## Step 2: Find inconsistencies

Across all projects, identify:
- Contradictions: Same topic, different rules between projects
- Gaps: Things configured in some projects but missing from others
- Redundancy: Instructions that should be in global ~/.claude/CLAUDE.md instead of per-project
- Stale: References to tools, deps, or patterns that no longer exist in that project

## Step 3: Recommend

Propose a plan to harmonize:
1. What should move to global config (shared across all)
2. What should stay project-specific (unique to each)
3. What should be added to projects that are missing it
4. What should be removed everywhere

Wait for my approval before making any changes.

## Step 4: Execute

After approval, update each project one at a time:
- Show the project name before each batch of changes
- Show diffs for every file modification
- After each project, pause and let me confirm before moving to the next
```

---

## Migration checklist (condensed)

### CLAUDE.md health

- [ ] Run `/init` (or equivalent) and compare with current file; close gaps intentionally.
- [ ] Remove rules already enforced by linter/formatter.
- [ ] Remove rules the model already follows without being told.
- [ ] Verify build/test/lint commands still accurate.
- [ ] Verify referenced paths exist.
- [ ] Rephrase "Do not X" as "Prefer Y over X".
- [ ] Extract 50+ line topics into `.claude/rules/`.
- [ ] Target under ~200 lines.

### Commands to skills

- [ ] List all `.claude/commands/*.md`.
- [ ] For each: needs bundled scripts, auto-invocation, or tool restrictions? If yes, add `skills/<name>/SKILL.md` with frontmatter.
- [ ] Prefer `context: fork` for heavy/isolated skills.
- [ ] Prefer `allowed-tools` for read-only analyzers.
- [ ] Keep old command files until skills are verified.

### settings.json

- [ ] PostToolUse formatter hook (project-appropriate).
- [ ] Optional PostToolUse typecheck for TS repos.
- [ ] Sensible deny rules for dangerous operations.
- [ ] Allow rules for required tools (package manager, git, etc.).
- [ ] Personal config in `settings.local.json`; gitignore it.
- [ ] Hooks complete in under ~2 seconds.

### Global `~/.claude/`

- [ ] Short global `CLAUDE.md` (cross-project habits).
- [ ] Deduplicate repeated per-project prose into global where appropriate.
- [ ] A few global skills (commit, reflection, research).
- [ ] Prune stale auto-memory under `projects/` when needed.
- [ ] Optional `keybindings.json`.

### Git and team

- [ ] Commit `.claude/` for team repos.
- [ ] Gitignore `CLAUDE.local.md` and `.claude/settings.local.json`.
- [ ] Review `.claude/` in PRs like CI config.
- [ ] Inspect `.claude/` before trusting unfamiliar repos.

---

## Source

Original prompts came from internal reference UI; **canonical** copy-paste text lives here. Long-form snippets (CLAUDE.md skeleton, rules, commands, skills, agents, settings) are in [claude-code-worked-examples.md](./claude-code-worked-examples.md). The old `.jsx` scratch files were removed to avoid drift.
