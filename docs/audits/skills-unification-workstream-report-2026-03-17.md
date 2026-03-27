---
type: frozen
source: none
sync: none
sla: none
title: Skills unification workstream — report
description: What we did, open issues, likely causes, and audits for other IDEs/LLMs/MCPs.
last_updated: 2026-03-19
category: audit
audience: [contributors, operators, ai-agents]
status: active
---

# Skills unification workstream — complete report

This document summarizes work completed in March 2026 around **repo cataloging**, **global `skills` CLI installation**, **unified install policy**, and **verification**. It also records **issues**, **probable causes**, and **audits** recommended for each IDE/LLM surface.

**Primary references:**

| Doc | Purpose |
|-----|---------|
| [skills-install-policy.md](../governance/skills-install-policy.md) | Tiers, collision rules, allowlisted agents, MCP vs skills |
| [skills-agents-unification.md](../governance/skills-agents-unification.md) | Universal / ecosystem / org taxonomy |
| [maintenance-skills-agents.md](../governance/maintenance-skills-agents.md) | Artifact map, morphism scope |
| [slash-commands-catalog.md](../governance/slash-commands-catalog.md) | Slash workflows + machine setup pointer |
| `_workspace/docs/repo-catalog.md` (full clone only) | Tooling vs product repos, skills CLI notes |
| `_ops/mcp/README.md` (full clone only) | MCP default vs optional guidance |

---

## 1. What we did

### 1.1 Repository catalog

- Added **`_workspace/docs/repo-catalog.md`** listing:
  - **Tooling repos:** `_devkit`, `_ops` (with `_ops` subpaths: mcp, gmail-ops, dotnet-kilo, profile-platform)
  - **Non-repo:** `_workspace/`
  - **Product repos** (snapshot from `_workspace/ops/list-repos.ps1`)
- Linked from **INDEX.md**; **ERP** is intentionally undefined in-repo (placeholder for future tagging).
- Documented **`npm install -g skills`** and high-level global vs project skill paths.

### 1.2 Global `skills` CLI

- Ran **`npm install -g skills`** (CLI for the open agent-skills ecosystem).
- Confirmed CLI on PATH; version **1.4.5** at time of test.

### 1.3 Unified install policy and docs

- Added **`alawein/docs/governance/skills-install-policy.md`**:
  - **Three tiers:** (1) machine global via `skills add … -g`, (2) repo `./skills/`, (3) Claude plugin–bundled skills.
  - **Collision rule:** one owning tier per skill `name:` (no duplicate bodies across plugin vs global vs repo).
  - **Allowlisted agents** in policy and bootstrap: `cursor`, `claude-code`, `codex`.
  - Tables of **morphism** and **repo-superpowers** plugin-owned skills — do not re-install those via Tier 1.
  - **MCP vs skills:** separate layers; points to `_ops/mcp/README.md`.
- Updated **maintenance-skills-agents.md** (artifact map row for global `skills` installs).
- Updated **slash-commands-catalog.md** (machine setup → policy + bootstrap).
- Linked policy from **skills-agents-unification.md**, **CLAUDE.md**, **INDEX.md**, **repo-catalog.md**.
- **migration_changelog.md** entries for catalog + follow-up links.

### 1.4 Bootstrap automation

- **`_workspace/ops/bootstrap-skills.ps1`** and **`bootstrap-skills.sh`**: run `skills add vercel-labs/agent-skills -g -y` with allowlisted `-a`; override via `SKILLS_AGENTS` env.
- **`_workspace/ops/README.md`**: quick reference for bootstrap.

### 1.5 MCP documentation

- Expanded **`_ops/mcp/README.md`**: MCP vs skills table, default vs optional MCP tiers, link to install policy.

### 1.6 Execution (on operator machine)

- **Bootstrap executed:** `vercel-labs/agent-skills` installed globally for cursor, claude-code, codex.
- **Five skills** installed: `vercel-composition-patterns`, `deploy-to-vercel`, `vercel-react-best-practices`, `vercel-react-native-skills`, `web-design-guidelines`.

### 1.7 Testing

- **`skills list -g`:** succeeded; listed global skills including the five Vercel skills under **`~\.agents\skills\`** (canonical paths).
- **`~\.cursor\skills`:** not present on tested machine — Cursor wired via **universal `.agents\skills`** layout for this CLI mapping.
- Pre-existing large sets under **`~\.codex\skills`** and **`~\.kilocode\skills`** remain (not introduced by this workstream).

---

## 2. Issues we are facing

| # | Issue | Severity |
|---|--------|----------|
| A | **Skill homes differ by agent** — e.g. Cursor may use `.agents/skills` vs docs that mention `.cursor/skills` | Medium — doc/expectation drift |
| B | **`skills list -g` shows more agents than allowlist** (e.g. Cline, Kilo Code on Vercel skills) | Medium — policy says 3 agents; installer may map “universal” to multiple products |
| C | **Large historical surface** on Codex + Kilo — many skills; overlaps with Cursor plugins conceptually | Medium — cognitive load, duplicate capabilities |
| D | **Plugin vs global duplication risk** — same `name:` in morphism/repo-superpowers and a global pack | High if someone runs broad `skills add` without `-s` |
| E | **MCP overlap** — multiple search/docs/browser MCPs feel like “collision” with skills | Low–medium — different layer, same user confusion |
| F | **ERP / product taxonomy** — “non-ERP catalog” requested but ERP never defined | Low — catalog is complete by repo type, not business domain |
| G | **Cross-machine parity** — no mandatory `skills-lock.json` / sync yet | Medium — second machine may diverge |

---

## 3. Possible causes

| Issue | Likely cause |
|-------|----------------|
| A | **Upstream `skills` CLI** maps Cursor/Codex/Cline to a shared **universal** directory (`.agents/skills`) on Windows; older docs assume per-product folders only. |
| B | **Agent detection or universal install path** links one canonical tree to several compatible agents (Cline shares layout with Cursor in CLI output). |
| C | **Codex home** (`~/.codex/skills`) populated over time by Codex/Codex skills installer or prior `skills add` without tight `-a` allowlist. |
| D | **No enforced preflight** — policy is doc-only until CI or onboarding script checks for duplicate `name:` across plugin dirs and global dirs. |
| E | **Tooling sprawl** — many MCPs solve similar jobs; skills docs don’t replace MCP curation. |
| F | **Scope ambiguity** — “ERP” is org-specific; repo layout uses tooling (`_*`) vs product, not ERP. |
| G | **Bootstrap not run** on every machine; or different `SKILLS_AGENTS` / manual adds. |

---

## 4. Audits we need other IDEs / LLMs / tools to perform

Use this as a **checklist per machine** (or per teammate). Record findings in a short note or ticket.

### 4.1 Cursor

- [ ] Confirm **where** Cursor loads skills from (Settings / docs for current Cursor version): `.cursor/skills` vs `.agents/skills`.
- [ ] List **effective** skills (UI or filesystem) and compare to **skills-install-policy** allowlist.
- [ ] **Duplicate names:** any SKILL.md `name:` that also appears in **Cursor plugins** or repo `./skills/`?
- [ ] After bootstrap: open a project and confirm **web-design-guidelines** (or another installed skill) is discoverable per Cursor’s skill UX.

### 4.2 Claude Code (CLI)

- [ ] List `~/.claude/skills` (or symlink targets from `.agents`) — confirm **5 Vercel skills** resolve.
- [ ] Confirm **morphism** / **repo-superpowers** plugin skills **not** duplicated under the same `name:` as a global pack.
- [ ] Run **`/repo-superpowers:context`** or session flow — ensure plugin commands still behave (Tier 3 intact).

### 4.3 Codex (OpenAI Codex CLI / agent)

- [ ] Inventory **`~/.codex/skills`** — count skills; flag **overlap** with Vercel pack or with Cursor-facing instructions (same task, two files).
- [ ] Decide: **trim** unused skills vs **document** “Codex is wide; Cursor is narrow.”
- [ ] If parity desired: run same **`skills add vercel-labs/agent-skills -g -a codex -y`** and verify no duplicate install errors.

### 4.4 Cline / Kilo Code / other agents shown in `skills list`

- [ ] If **not** in org allowlist: decide **remove** (`skills remove … -a <agent>`) or **document** as intentional.
- [ ] **Kilo Code:** large `~/.kilocode/skills` set — audit for overlap with Codex copies of same skill name.

### 4.5 MCP (Cursor, Claude Desktop, etc.)

- [ ] Against **`_ops/mcp/README.md`**: list enabled MCPs; ensure **at most one** primary fetch/search and **one** docs MCP unless justified.
- [ ] Note env-specific servers (Notion, Linear) — enable only where needed.

### 4.6 Repos (alawein org)

- [ ] Repos with **`./skills/`**: ensure **AGENTS.md** or README mentions them; no conflicting global `name:` without intent.
- [ ] Re-run **`_workspace/ops/list-repos.ps1`** periodically; refresh **repo-catalog.md** product table.

---

## 5. Recommended next steps (prioritized)

1. **Single audit pass** — One owner runs §4.1–4.4 on the reference machine and pastes results into `docs/audits/` or a Notion page.
2. **Tighten bootstrap** — If Cline/Kilo should not receive Vercel pack, re-run install with **only** `-a cursor -a claude-code -a codex` and **remove** from other agents if CLI supports targeted remove.
3. **Lockfile** — Pilot **`skills-lock.json` + experimental_sync** (per npm `skills` readme) for a second machine.
4. **ERP column** — When defined, add to **repo-catalog.md** or a separate matrix.
5. **Optional script** — Pre-commit or onboarding: **grep** SKILL `name:` across `~/.claude/plugins/.../skills` and `~/.agents/skills` to flag duplicates.

---

## 6. Summary

| Outcome | Status |
|---------|--------|
| Repo + tooling catalog | Done |
| Global `skills` CLI | Installed; bootstrap executed |
| Written policy + MCP guidance | Done |
| Collisions / multi-agent sprawl | **Open** — audits in §4 |
| Cross-machine parity | **Open** — lockfile / repeat bootstrap |

This report is the **handoff** for anyone continuing IDE/LLM hygiene or onboarding new machines.
