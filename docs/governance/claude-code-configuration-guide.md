---
type: canonical
source: none
sync: none
sla: none
title: Claude Code configuration reference (.claude/, CLAUDE.md)
description: Canonical layout and practices for Claude Code — project vs global scope, CLAUDE.md, rules, skills, agents, settings, and memory. Extracted from internal reference material for reuse across repos.
last_updated: 2026-03-25
last_verified: 2026-03-25
category: governance
audience: [ai-agents, contributors]
status: active
related:
  - ./claude-code-migration-prompts.md
  - ./claude-code-worked-examples.md
  - ../../CLAUDE.md
  - ./skills-agents-unification.md
---

# Claude Code configuration reference

Use this in **product repositories** that ship a `.claude/` directory. This **org hub** (`alawein/alawein`) primarily uses root `CLAUDE.md`, `AGENTS.md`, and `docs/governance/*`; treat this file as the **portable pattern** when you add Claude Code to a codebase.

**Copy-paste snippets (CLAUDE.md, rules, commands, skills, agents, settings):** [claude-code-worked-examples.md](./claude-code-worked-examples.md).

**Copy-paste prompts and checklists:** [claude-code-migration-prompts.md](./claude-code-migration-prompts.md).

**Cursor:** This repo’s `.cursor/` tree is not committed. In product repos that use Cursor, mirror **durable** constraints in `.cursor/rules.md` (or rule files) and keep long-form rationale here or in `CLAUDE.md`.

---

## Two scopes, one system

| Scope | Location | Role |
|-------|-----------|------|
| **Project** | `your-project/.claude/` (and root `CLAUDE.md`) | Committed, team-shared hooks, skills, rules. |
| **Global / personal** | `~/.claude/` (Windows: `%USERPROFILE%\.claude\`) | Never committed; cross-project defaults, global skills/commands, per-project auto-memory. |

**Loading order:** Global `~/.claude/CLAUDE.md` loads first, then project `CLAUDE.md`, then deeper `CLAUDE.md` files as the working directory moves. **More specific instructions win.** Project `settings` override global where applicable.

**Project `.claude/` typically includes:** `settings.json`, `rules/`, `skills/`, `commands/`, `agents/`, optional `.mcp.json`. Use **`settings.local.json`** and root **`CLAUDE.local.md`** for personal overrides (gitignore them).

---

## CLAUDE.md (root)

- Loads at session start and **survives `/compact`** (unlike chat alone).
- **Golden rule:** Only what the model **cannot infer from reading the repo** — build/test/lint commands, architecture boundaries, deploy quirks, naming that is not obvious from code.
- If the **linter/formatter** already enforces something, prefer a **hook** instead of repeating it in prose.
- Target **under ~200 lines** per file; move depth to `.claude/rules/`.
- Prefer phrasing **"Prefer X over Y"** instead of "Do not Y".
- **CLAUDE.local.md** at repo root for personal-only overrides (gitignored).

---

## rules/

Modular `.md` files under `.claude/rules/`. Use when:

- One topic in `CLAUDE.md` grows large (**on the order of 50+ lines**), or
- Conventions are **domain-specific** (testing, API, security) and should not load on every task.

**CLAUDE.md** = identity, commands, top-level architecture. **rules/** = appendices loaded when relevant.

Example layout:

```text
.claude/rules/
├── code-style.md
├── testing.md
├── api-conventions.md
├── security.md
└── database.md
```

---

## commands/ and skills/

- **commands/**: Markdown files become slash commands; `$ARGUMENTS` parameterizes; `` !`cmd` `` preprocesses shell output into the prompt.
- **skills/** (preferred for **new** workflows): A **directory per skill** with `SKILL.md` plus optional `scripts/`, `templates/`, reference `.md` files. Supports **auto-invocation**, frontmatter, and bundled assets.

**Skill frontmatter (typical):**

- `name`, `description`
- `context: fork` — isolated subagent context
- `agent:` — which subagent runs the skill
- `allowed-tools:` — restrict tools (e.g. read-only review)
- `disable-model-invocation: true` — only when explicitly invoked

**When to choose which**

| Need | Prefer |
|------|--------|
| Bundled scripts/templates | Skill |
| Auto-invocation | Skill |
| Strong tool restrictions | Skill |
| Simple one-shot prompt | Command is acceptable |

Product note: **commands/** and **skills/** may converge over time; prefer **skills/** for anything that grows.

---

## agents/

**Agents** = **who** (persona, tool allowlist, isolation). **Skills** = **what** (workflow, checklist, assets). A skill can name an `agent:` in frontmatter. Invoke agents explicitly or via skills; parallel work can use multiple subagents when the product supports it.

---

## settings.json

Pair:

- **`.claude/settings.json`** — committed team defaults: `permissions.allow` / `permissions.deny`, `hooks`, shared config.
- **`.claude/settings.local.json`** — personal; gitignore.

**Hooks:** Keep them **fast (under ~2s)**; they run frequently. Common patterns:

- **PostToolUse** matching `Edit|Write` → formatter (Biome, Prettier, etc.).
- **PostToolUse** on `.ts` / `.tsx` → typecheck where appropriate.
- **Deny** dangerous shell patterns where your environment requires it.

Do not put secrets in committed `settings.json`; use `settings.local.json`.

---

## Memory (auto-generated)

Claude Code can maintain **auto-memory** under `~/.claude/projects/<project>/memory/MEMORY.md` (implementation details may vary by version). Treat it as a **personal notebook**: preferences and session learnings. **`CLAUDE.md`** remains the **committed** source of team truth.

Some builds support a **`#`** shortcut to append notes to memory; prefer `CLAUDE.md` / rules for durable team rules. See [claude-code-worked-examples.md](./claude-code-worked-examples.md#memory-vs-claudemd) for a concise comparison table.

---

## Full layout (reference)

```text
your-project/
├── CLAUDE.md
├── CLAUDE.local.md          # gitignored
└── .claude/
    ├── settings.json
    ├── settings.local.json   # gitignored
    ├── rules/
    ├── skills/
    ├── commands/
    ├── agents/
    └── .mcp.json

~/.claude/
├── CLAUDE.md
├── skills/
├── commands/
├── keybindings.json
└── projects/
    └── <id>/
        └── memory/
            └── MEMORY.md
```

---

## Security

Treat **`.claude/` like CI config**: review changes in PRs. **Untrusted repositories** may ship malicious hooks or skills; inspect before running.

---

## New project sequence

1. Run **`/init`** (or equivalent), then **delete** generic content aggressively.
2. Add **`.claude/settings.json`**: permissions + **fast** formatter hook.
3. Grow **`rules/`** only when `CLAUDE.md` gets heavy.
4. Add **`skills/`** for repeatable workflows; **`agents/`** for isolated reviewers.
5. **Commit** `.claude/`; **gitignore** `CLAUDE.local.md` and `.claude/settings.local.json`.

---

## Source

Semantics from the internal Claude Code reference UI were merged into this guide and into [claude-code-worked-examples.md](./claude-code-worked-examples.md). **Do not rely on stray `.jsx` scratch files** — edit the Markdown here so the org hub stays the single source.
