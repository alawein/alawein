---
title: Skills, Agents, and Commands Maintenance
description: Operating guide for maintaining universal, ecosystem, and org layers across local Claude/Cursor plugins and alawein governance docs.
last_updated: 2026-03-16
category: governance
audience: [ai-agents, contributors]
status: active
---

# Skills, Agents, and Commands Maintenance

This is the operational playbook for maintaining the unified model:

- **Universal layer**: works in any repo or directory
- **Ecosystem layer**: morphism-specific behavior
- **Org layer**: alawein-specific governance behavior

Use this document when:

- adding/removing morphism repos
- changing validation boundaries or tenet behavior
- adding a new org profile with custom checks
- adding or adjusting universal commands/skills

---

## 1. Artifact Map

| Layer | Plugin/Repo | Path | Contents |
|---|---|---|---|
| Universal (Claude) | repo-superpowers | `~/.claude/plugins/cache/local/repo-superpowers/1.0.0/` | commands, skills, agents, quality hook |
| Universal (Cursor) | workspace-universal | `~/.cursor/plugins/local/workspace-universal/` | session/context slash commands |
| Ecosystem | morphism | `~/.claude/plugins/cache/local/morphism/1.2.0/` | morphism commands, skills, agents, hooks, universal YAML specs |
| Org | alawein repo | `docs/governance/`, `AGENTS.md`, `CLAUDE.md`, `scripts/` | governance contracts, command catalog, quality-gate scripts |
| Cursor org hints | alawein repo | `.cursor/rules/` | repo-level Cursor reminders/guardrails |

Related docs:

- [docs/governance/skills-agents-unification.md](./skills-agents-unification.md)
- [docs/governance/slash-commands-catalog.md](./slash-commands-catalog.md)
- [AGENTS.md](../../AGENTS.md)
- [CLAUDE.md](../../CLAUDE.md)

---

## 2. Single Source of Truth for Morphism Scope

**Policy SSoT:** `~/.claude/plugins/cache/local/morphism/1.2.0/lib/repo-detect.md`  
**Structured registry scaffold:** `~/.claude/plugins/cache/local/morphism/1.2.0/lib/repos.yaml`

Use `repo-detect.md` for normative behavior and `repos.yaml` for structured
enumeration that tools/scripts can consume.

When scope changes, update `repo-detect.md` first, then keep `repos.yaml` in
sync.

---

## 3. Morphism Scope Change Checklist

When adding/removing morphism repos or changing scope behavior:

1. **SSoT update (required)**  
   Update `lib/repo-detect.md` (repo patterns, detection priority, context behavior).
2. **Registry update (required)**  
   Update `lib/repos.yaml` (slug, path pattern, repo type, SSOT mapping).
3. **Reference update**  
   Update `skills/morphism-context/references/repos-reference.md`.
4. **Universal YAML update**  
   Update YAMLs that enumerate repos:
   - `universal/morphism-context.yaml`
   - `universal/morphism-validate.yaml`
   - `universal/morphism-session.yaml`
5. **Command update**  
   Update commands that branch by repo type:
   - `commands/validate.md`
   - `commands/context.md`
   - `commands/session-start.md`
   - `commands/tenet-check.md`
   - `commands/promote.md`
6. **Hook update**  
   Update shell hooks for path-based behavior:
   - `hooks/session-init.sh`
   - `hooks/scope-trigger.sh`
   - `hooks/boundary-guard.sh`
7. **Tenet and validation reference update (if rules changed)**  
   - `skills/tenet-awareness/references/tenets-reference.md`
   - `skills/validation-reminder/references/validation-checks.md`
   - `agents/tenet-analyzer.md`
8. **Plugin docs/changelog update**  
   - `README.md`
   - `CHANGELOG.md`

---

## 4. Tailoring Universal Layer (Any Repo/Dir)

Primary edit points in Claude universal plugin (`repo-superpowers`):

- `commands/session-start.md`
- `commands/context.md`
- `commands/check-patterns.md`
- `commands/check-complexity.md`
- `commands/audit-deps.md`
- `commands/workspace-*.md` (preferred namespace aliases)
- `skills/*/SKILL.md`
- `hooks/hooks.json`
- `.claude-plugin/plugin.json`

Primary edit points in Cursor universal plugin (`workspace-universal`):

- `commands/session-start.md`
- `commands/context.md`
- `.cursor-plugin/plugin.json`

Common changes:

- Add new universal command: create `commands/<name>.md` and add to plugin manifest.
- Add new universal skill (Claude): create `skills/<name>/SKILL.md`.
- Change quality thresholds (Claude): update `hooks/hooks.json`.
- Add org reminder: add conditional block in session/context commands.

Also keep [docs/governance/slash-commands-catalog.md](./slash-commands-catalog.md)
in sync with command additions/removals.

---

## 5. Tailoring Org Layer (Alawein or Another Org)

### Alawein

Current pre-commit governance checks:

- `python scripts/sync-readme.py --check`
- `./scripts/validate-doc-contract.sh --full`

Sources of truth:

- [AGENTS.md](../../AGENTS.md) Quick Reference
- [CLAUDE.md](../../CLAUDE.md)
- [docs/governance/documentation-contract.md](./documentation-contract.md)

### Add Another Org Profile

Two supported patterns:

1. **Org-local governance in that repo**  
   Add AGENTS/CLAUDE + scripts in that repo and optional `.cursor/rules/<org>-governance.mdc`.
2. **Universal reminder block**  
   Add org detection in universal `session-start` and `context` commands and show one-line pre-commit hints.

When adding org behavior, update:

- [docs/governance/slash-commands-catalog.md](./slash-commands-catalog.md)
- [docs/governance/skills-agents-unification.md](./skills-agents-unification.md)
- this maintenance doc

---

## 6. Consolidation Path (Now Scaffolded)

`lib/repos.yaml` now exists as a structured registry scaffold.

Recommended progression:

1. Keep `repo-detect.md` authoritative for behavior/policy text.
2. Keep `repos.yaml` authoritative for machine-readable repo list.
3. Gradually migrate scripts/hooks/commands to consume generated values from
   `repos.yaml` via a helper script when practical.

Trade-off:

- **Pros:** fewer duplicate edit points
- **Cons:** introduces generation/parsing complexity in shell-based hooks

---

## 7. Release and Verification Sequence

After any maintenance change:

1. Verify links and consistency in alawein docs.
2. Ensure catalog command names match plugin command frontmatter.
3. For alawein repo changes, run:
   - `python scripts/sync-readme.py --check`
   - `./scripts/validate-doc-contract.sh --full`
4. For plugin changes, run smoke tests (Section 8).

---

## 8. Smoke Tests (Claude + Cursor)

### 8.1 Command discovery matrix

| Surface | Plugin | Expected commands |
|---|---|---|
| Claude | repo-superpowers | `workspace:*` aliases and legacy commands (`session-start`, `context`, `check-patterns`, `check-complexity`, `audit-deps`) |
| Claude | morphism | context, validate, tenet-check, session-start, promote, scope-guard, review |
| Cursor | workspace-universal | session-start, context |
| Cursor | public plugin set | superpowers, compound-engineering, parallel, context7, sentry, vercel |

### 8.2 Functional checks

Run these checks after plugin/doc updates:

1. **Plain directory check**  
   Run universal session/context in a non-repo directory and verify no git-only assumptions.
2. **Generic repo check**  
   Run universal session/context in a non-morphism git repo and verify pre-commit suggestions are project-derived.
3. **Morphism repo check**  
   Run morphism context/validate and verify repo detection aligns with `repo-detect.md` and `repos.yaml`.
4. **Alawein repo check**  
   Verify alawein reminders include:
   - `python scripts/sync-readme.py --check`
   - `./scripts/validate-doc-contract.sh --full`
5. **Catalog integrity check**  
   Ensure `slash-commands-catalog.md` entries reflect actual available command names.

---

## 9. Manual UI Verification (Cursor + Claude)

Use this when you want to verify command visibility in the actual product UI,
not only via manifest/frontmatter checks.

### 9.1 Cursor UI verification

1. Open Cursor in any workspace and focus the chat input.
2. Type `/` and check command suggestions.
3. Confirm Cursor-local universal commands appear:
   - `/workspace-universal:session-start`
   - `/workspace-universal:context`
4. Confirm public plugin commands still appear (examples):
   - `/superpowers:brainstorm`
   - `/compound-engineering:workflows:plan`
   - `/parallel:parallel-search`
5. Run `/workspace-universal:context` in:
   - a non-repo directory
   - a generic git repo
   Verify output is context-aware and does not assume morphism-specific rules.

### 9.2 Claude plugin UI verification

1. Open Claude Code in a workspace where local plugins are active.
2. Type `/` and inspect available commands.
3. Confirm preferred aliases appear:
   - `/workspace:session-start`
   - `/workspace:context`
   - `/workspace:check-patterns`
   - `/workspace:check-complexity`
   - `/workspace:audit-deps`
4. Confirm backward-compatible commands still resolve:
   - `/repo-superpowers:session-start`
   - `/repo-superpowers:context`
5. In a morphism repo, verify morphism commands appear:
   - `/morphism:context`
   - `/morphism:validate --quick`

### 9.3 Failure triage

If commands are missing in UI:

1. Verify plugin manifest paths:
   - Cursor: `.cursor-plugin/plugin.json`
   - Claude: `.claude-plugin/plugin.json`
2. Verify command files exist and frontmatter includes valid `name` and
   `description`.
3. Verify plugin root location:
   - Cursor local: `~/.cursor/plugins/local/<plugin-name>/`
   - Claude local: `~/.claude/plugins/cache/local/<plugin-name>/<version>/`
4. Restart the host app/session and re-check command palette/autocomplete.
5. Re-run Section 8 smoke tests and doc contract checks.
