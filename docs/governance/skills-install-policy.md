---
type: canonical
source: none
sync: none
sla: none
title: Skills install policy (IDEs, platforms, repos)
description: Single policy for where agent skills live, how to install without collisions, and how MCPs differ from skills.
last_updated: 2026-03-19
last_verified: 2026-03-19
category: governance
audience: [ai-agents, contributors]
status: active
---

# Skills install policy

This doc defines **how** skills are installed so Cursor, Claude Code, Codex, and other agents stay aligned without duplicate or conflicting copies.

**Related:** [skills-agents-unification.md](./skills-agents-unification.md) (taxonomy), [maintenance-skills-agents.md](./maintenance-skills-agents.md) (artifact map). MCP inventory: `workspace-tools/mcp/README.md` in a **full workspace clone** (not shipped in this repo).

---

## MCP vs skills (different layers)

| | **Skills** (`SKILL.md`) | **MCP servers** |
|--|------------------------|-----------------|
| **What** | Instructions: when to do something, how to think, workflow | Callable tools (APIs, search, DB, browser) |
| **Install** | `skills` CLI, plugins, or repo `./skills/` | Per-IDE config (e.g. Cursor MCP settings) |
| **Overlap feeling** | Same *name* in two tiers | Multiple MCPs doing “search” or “fetch URL” |

**Rule:** Do not conflate them. Reduce MCP confusion with one **default MCP set** per machine (documented under `workspace-tools/mcp/README.md` in the full workspace clone).

---

## Three tiers

| Tier | When | Mechanism |
|------|------|-----------|
| **1 — Machine global** | Same skills on every repo for this machine | `skills add <repo> -g -y` + **allowlisted** `-a` agents only |
| **2 — Project** | Team- or repo-specific behavior | `./skills/` committed; document in README / AGENTS |
| **3 — Plugins** | Skills bundled with commands, agents, hooks | Claude local plugins (`~/.claude/plugins/...`) |

### Collision rule

For each skill **`name:`** in YAML frontmatter, **exactly one owning tier** on a machine:

- Either the **plugin** owns it (Tier 3), **or** it is installed via **`skills add -g`** (Tier 1), **or** it lives only in **repo `./skills/`** (Tier 2).

**Do not** `skills add` a pack that re-ships the same `name` as morphism or repo-superpowers unless you remove the plugin copy first.

---

## Tier 1: Allowlisted agents (canonical)

Install the **npm CLI** once:

```bash
npm install -g skills
```

**Allowlisted agents** (adjust if your stack changes): `cursor`, `claude-code`, `codex`.

**Canonical global packages** (org default — edit here and in bootstrap scripts when you change):

```bash
# Shared agent-skills (Vercel); install only to agents we use
skills add vercel-labs/agent-skills -g -y \
  -a cursor -a claude-code -a codex
```

To install **specific skills** only (smaller surface):

```bash
skills add vercel-labs/agent-skills -g -y \
  -a cursor -a claude-code -a codex \
  -s frontend-design -s skill-creator
```

Add more packages the same way (one `skills add` line per repo). Prefer **explicit `-s`** when the pack is large.

**Paths (global):** Universal location `~/.agents/skills/` (used by Cursor, Claude Code, Codex on Windows; may vary per IDE on macOS/Linux). On Windows read `~` as `%USERPROFILE%`.

**Reproducibility:** Use upstream `skills check` / `skills update` and optional `skills-lock.json` / `experimental_sync` for parity across machines.

**Automation:** `workspace-tools/scripts/bootstrap-skills.ps1` and
`workspace-tools/scripts/bootstrap-skills.sh` (full workspace clone) mirror
the lines above.

**Agent compatibility note:** The `skills` CLI automatically maps compatible agents (e.g., Cline, Kilo Code) to the universal skills path even if not explicitly listed in `-a` flags. This is by design — the CLI detects agent compatibility rather than restricting it per install. Policy defines **intended** agents (`cursor`, `claude-code`, `codex`); the CLI may show broader availability due to its agent-detection logic. This behavior cannot be overridden via `skills remove` (global skills are not installed per-agent).

**Pre-bootstrap agent skill cleanup (2026-03-17):** Codex (`~/.codex/skills/`) and Kilo Code (`~/.kilocode/skills/`) historically accumulated pre-bootstrap skill sets (50 + 24 respectively). Consolidation audit identified 2 duplicates in Kilo with global Tier 1 (vercel-react-best-practices, web-design-guidelines) and removed them. Codex retained as-is; no collisions with plugin or global skills. Remaining per-agent skills are curated IDE-specific utilities with no overlap.

---

## Tier 2: Repo-local `./skills/`

Use when:

- The skill is **only** relevant to one codebase, or
- The team agrees to **version** skill text in git.

Document in the repo’s AGENTS.md or README: “Project skills under `./skills/`.”

---

## Tier 3: Plugin-owned skills (do not duplicate via Tier 1)

These skills already ship inside **local Claude plugins**. **Do not** install overlapping packs globally unless you intentionally migrate ownership.

### Morphism plugin (`~/.claude/plugins/cache/local/morphism/`)

| Skill name | Notes |
|------------|--------|
| morphism-context | Ecosystem only |
| tenet-awareness | Ecosystem only |
| validation-reminder | Ecosystem only |
| daily-focus | Backs command |
| weekly-review | Backs command |

### Repo-superpowers plugin (`~/.claude/plugins/cache/local/repo-superpowers/`)

| Skill name | Notes |
|------------|--------|
| codebase-audit | Universal |
| tech-debt-blitz | Universal |
| test-bootstrap | Universal |
| package-modernize | Universal |
| base-class-extract | Universal |
| error-hardening | Universal |
| ci-tooling-setup | Universal |
| readme-rewrite | Universal |
| dependency-audit | Universal |
| full-cleanup-pipeline | Universal |
| code-quality-standards | Universal |

### Cursor local plugin

**workspace-universal** (`~/.cursor/plugins/local/workspace-universal/`) provides slash commands; it is not a duplicate of Tier 1 unless you copy the same SKILL.md there.

---

## New machine checklist

1. `npm install -g skills`
2. Run `workspace-tools/scripts/bootstrap-skills.ps1` or
   `workspace-tools/scripts/bootstrap-skills.sh` from the full workspace clone
3. Install Claude plugins (morphism, repo-superpowers) per [maintenance-skills-agents.md](./maintenance-skills-agents.md)
4. Configure MCP using `workspace-tools/mcp/README.md` defaults (full workspace clone)

---

## Summary

| Goal | Action |
|------|--------|
| Same skills in Cursor + Claude Code + Codex | Tier 1 with fixed `-a cursor -a claude-code -a codex` |
| No duplicate SKILL bodies | One tier per `name:`; table above = plugin-owned |
| Repo-specific behavior | Tier 2 `./skills/` |
| Less “MCP collision” | One default MCP set; skills policy does not replace MCP config |
