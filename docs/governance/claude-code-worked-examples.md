---
title: Claude Code worked examples (copy-paste)
description: Concrete snippets for CLAUDE.md, rules/, commands/, skills/, agents/, and settings — extracted from the internal reference UI for use in product repos.
last_updated: 2026-03-25
last_verified: 2026-03-25
category: governance
audience: [ai-agents, contributors]
status: active
related:
  - ./claude-code-configuration-guide.md
  - ./claude-code-migration-prompts.md
---

# Claude Code worked examples

Use with [claude-code-configuration-guide.md](./claude-code-configuration-guide.md). Adapt stack-specific commands (`pnpm`, `npm`, `uv`, etc.) to your repo.

**Note:** The original interactive demo used React inline styles for presentation only; **semantics** live here in plain Markdown.

---

## Example `CLAUDE.md` skeleton

```markdown
# Project: Acme API
Node 22, TypeScript, Fastify, Drizzle ORM, PostgreSQL.

## Commands
- `pnpm dev`: Dev server (port 3000)
- `pnpm test`: Vitest suite — always run before committing
- `pnpm lint`: Biome — runs via hook, don't manually invoke

## Architecture
- /src/routes/ → Fastify route handlers (one file per resource)
- /src/services/ → Business logic, never import from routes
- /src/db/ → Drizzle schema + migrations
- Services never call other services directly. Use events.

## Rules
- No raw SQL. Always use Drizzle query builder.
- Error responses use ApiError class from src/lib/errors.ts
- All new endpoints need integration tests in /tests/
- Never modify files in /src/generated/ — these are codegen output
- Prefer "X over Y" phrasing over "Do not Y" (models follow it more reliably)
```

### CLAUDE.md do / don't (quick)

**Do:** keep under ~200 lines per file; start from `/init` then delete aggressively; add rules when the model repeats mistakes; use subdirectory `CLAUDE.md` in large monorepos; prefer positive framing.

**Don't:** duplicate linter-enforced rules; paste generic advice; write a novel; forget to update when conventions change; put personal prefs here (use `CLAUDE.local.md`).

---

## Example `.claude/rules/` layout

```text
.claude/rules/
├── code-style.md      → TypeScript conventions, import ordering
├── testing.md         → Test structure, mocking patterns, coverage
├── api-conventions.md → REST naming, error shapes, versioning
├── security.md        → Auth patterns, input validation, secrets
└── database.md        → Migration rules, query patterns, indexing
```

### Example `.claude/rules/testing.md` (excerpt)

```markdown
# Testing Conventions

## Structure
- Tests live next to source: src/services/user.ts → src/services/user.test.ts
- Integration tests in /tests/integration/ (need running DB)
- Use `createTestContext()` helper — never instantiate services directly

## Patterns
- Prefer factory functions over fixtures: `createUser({role: "admin"})`
- Mock external APIs at the HTTP layer (msw), not the service layer
- Every API endpoint needs at least: happy path, auth failure, validation error

## What NOT to test
- Don't test Drizzle schema definitions
- Don't test generated code in /src/generated/
- Don't write snapshot tests for API responses (they break on every change)
```

---

## `commands/` examples

**Product note:** New workflows that need frontmatter, bundled assets, or auto-invocation should live under **`skills/`**; simple one-shot prompts can stay in `commands/`.

### Parameterized command

```markdown
Fix GitHub issue #$ARGUMENTS following our coding standards.

1. Read the issue description and any linked discussion
2. Identify the affected files and create a plan
3. Implement the fix with appropriate tests
4. Run the full test suite before finishing
5. Create a commit with message: "fix: resolve #$ARGUMENTS"

Usage: /project:fix-issue 427
```

### Command with shell preprocessing (`!`)

The `` !`command` `` pattern runs the shell first; only the **output** is injected into the prompt.

```markdown
---
allowed-tools: Bash(git *), Bash(pnpm *)
description: Pre-deploy checklist and deployment
---
## Pre-deploy Checklist
- Current branch: !`git branch --show-current`
- Uncommitted changes: !`git status --short`
- Last test run: !`pnpm test --run 2>&1 | tail -5`

## Steps
1. Verify all tests pass (abort if they don't)
2. Verify we're on main or a release/* branch
3. Run `pnpm build` and verify no errors
4. Show me the deploy diff and wait for confirmation
```

---

## `skills/` layout + example `SKILL.md`

```text
.claude/skills/
├── security-review/
│   ├── SKILL.md
│   ├── checklist.md
│   └── scripts/
│       └── scan.sh
├── tdd-workflow/
│   └── SKILL.md
└── create-migration/
    ├── SKILL.md
    └── templates/
        └── migration.ts
```

```markdown
---
name: security-review
description: Audit code for common security vulnerabilities
context: fork
agent: Explore
allowed-tools:
  - Read
  - Grep
  - Glob
---
# Security Review

Review the specified code for security issues. Check for:

1. **Injection**: SQL injection, XSS, command injection
2. **Auth**: Missing auth checks, privilege escalation
3. **Secrets**: Hardcoded credentials, leaked API keys
4. **Input**: Unvalidated user input, missing sanitization

Read the checklist at ./checklist.md for the full audit list.

Output a structured report with severity ratings:
Critical | Warning | Info
```

**Frontmatter cheat sheet:** `context: fork` — isolated subagent; `agent:` — which subagent runs the skill; `allowed-tools:` — restrict tools (e.g. read-only review); `disable-model-invocation: true` — only when explicitly invoked.

---

## `agents/` example

Agents = **who** (persona, tool limits, isolation). Skills = **what** (workflow + assets).

```markdown
---
description: Senior code reviewer that checks for quality issues
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git diff *)
  - Bash(git log *)
---
You are a senior code reviewer. Your job is read-only analysis.

## Review criteria
1. Logic errors and edge cases
2. Missing error handling
3. Performance issues (N+1 queries, unnecessary allocations)
4. API contract violations (check against OpenAPI spec)
5. Test coverage gaps

## Output format
For each finding:
- **File:Line** — what you found
- **Severity** — Must fix | Should fix | Suggestion
- **Why** — explain the actual risk, not just the rule

Do NOT suggest style changes. Do NOT rewrite code.
Only report findings.
```

You can invoke explicitly ("use the code-reviewer agent") or reference from a skill via `agent: code-reviewer` in skill frontmatter.

---

## Example `.claude/settings.json`

Committed team defaults; secrets and personal overrides → `settings.local.json` (gitignored).

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm *)",
      "Bash(git *)",
      "Bash(node *)",
      "Read",
      "Write",
      "Grep",
      "Glob"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx biome check --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
      }
    ]
  }
}
```

**Hooks:** keep **under ~2s**. Typical patterns: PostToolUse (Edit|Write) → formatter; PostToolUse on `.ts` / `.tsx` → `tsc --noEmit` where appropriate; deny dangerous shell patterns per environment.

---

## Full directory tree (reference)

```text
your-project/
├── CLAUDE.md                    ← Team instructions (committed)
├── CLAUDE.local.md              ← Personal overrides (gitignored)
│
└── .claude/                     ← Commit this (review like CI)
    ├── settings.json
    ├── settings.local.json      ← gitignored
    ├── rules/
    ├── skills/
    ├── commands/
    ├── agents/
    └── .mcp.json

~/.claude/                       ← Global / personal (never committed)
├── CLAUDE.md
├── skills/
├── commands/
├── keybindings.json
└── projects/
    └── <project-hash>/
        └── memory/
            └── MEMORY.md        ← Auto-generated session memory
```

---

## New project checklist

1. Run `/init`, then **delete** anything inferable from the codebase.
2. Add `.claude/settings.json`: permissions + **fast** formatter hook.
3. Add `rules/` only when `CLAUDE.md` grows heavy on one topic (~50+ lines).
4. Add `skills/` for repeatable workflows; `agents/` for isolated reviewers.
5. **Commit** `.claude/`; **gitignore** `CLAUDE.local.md` and `.claude/settings.local.json`.

---

## Memory vs CLAUDE.md

| | CLAUDE.md | MEMORY.md (auto) |
|---|-----------|------------------|
| Authorship | You / team | Session-derived |
| Git | Committed | Not committed |
| Role | Official team truth | Personal notebook, preferences |

Some builds support typing **`#`** plus a note to save into memory quickly; use **`CLAUDE.md` / `rules/`** for durable **team** rules.

---

## Security

Treat `.claude/` like **`package.json` scripts** in an untrusted repo: review skills and hooks before running.
