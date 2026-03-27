---
type: canonical
source: none
sync: none
sla: none
title: Skills Consolidation Quick Reference
description: One-page summary of skills architecture decisions from 2026-03-17 audit; intended for operators and contributors
last_updated: 2026-03-20
category: governance
audience: [ai-agents, contributors, operators]
status: active
---

# Skills Consolidation Quick Reference

**Date:** 2026-03-17
**Status:** Complete
**Owner:** Architecture + Governance

---

## What Happened

1. **Machine audit** of skills across Cursor, Claude Code, Codex, Kilo Code, Cline
2. **Found 3 issues** related to skill paths, agent allowlists, and pre-bootstrap inventory
3. **Resolved all 3:**
   - Issue A: Updated docs to reflect canonical `~/.agents/skills/` path (not per-agent)
   - Issue B: Documented that CLI auto-detects agent compatibility (Cline, Kilo Code) as intentional design
   - Issue C: Removed 2 duplicate skills from Kilo Code; assessed remaining 71 as intentionally curated per-agent

---

## Current State

### Global Skills (Tier 1)
**Location:** `~/.agents/skills/`
**Count:** 5 (Vercel pack, bootstrapped 2026-03-17)
**For agents:** cursor, claude-code, codex (policy); also auto-detected by CLI for cline, kilo code

```
- deploy-to-vercel
- vercel-composition-patterns
- vercel-react-best-practices
- vercel-react-native-skills
- web-design-guidelines
```

**Management:** `skills add vercel-labs/agent-skills -g -y -a cursor -a claude-code -a codex`

### Codex Skills (Tier 1, Legacy)
**Location:** `~/.codex/skills/`
**Count:** 50 (pre-bootstrap, 2026-01-20)
**Status:** Intentionally retained; no collisions with global or plugin skills
**Type:** Broad ecosystem utilities (alignment-planner, figma, sentry, notion-*, deployment tools, etc.)

### Kilo Code Skills (Tier 1, Legacy)
**Location:** `~/.kilocode/skills/`
**Count:** 21 (consolidated 2026-03-17; was 23)
**Removed:** `vercel-react-best-practices`, `web-design-guidelines` (now use global Tier 1)
**Status:** Intentionally retained; no remaining collisions
**Type:** Content/specialty tools (content-research-writer, lead-research-assistant, mcp-builder, skill-creator, etc.)

### Claude Code Plugins (Tier 3)
**Location:** `~/.claude/plugins/cache/local/` + official plugins
**Plugin Skills:** morphism (6), repo-superpowers (12), knowledge (13), workspace (4), superpowers (2), governance (2) = 39 unique
**Status:** No overlap with global or pre-bootstrap agent skills

---

## Architecture Decision

### Per-Agent Skills are Intentional

**Why keep Codex/Kilo per-agent sets instead of consolidating everything to global?**

1. **No collisions:** All 71 pre-bootstrap skills are unique; no duplicates with global or plugins
2. **IDE-specific curation:** Codex and Kilo Code have different user workflows; per-agent skill sets match org practice
3. **Consolidation cost:** Requires classifying 70+ skills as "universal" or "agent-specific"; unclear ROI without usage data
4. **Future validation:** `skills-lock.json` pilot (coming) will test whether per-agent divergence causes sync problems (see [Phase 2 assessment](../audits/issue-c-phase2-consolidation-assessment-2026-03-17.md))

**Decision:** Keep as-is until lockfile pilot reveals problems.

---

## Policy vs. Actual Behavior

| Aspect | Policy Definition | Actual CLI Behavior | Resolution |
|--------|------------------|-------------------|-----------|
| **Skill paths** | Per-agent folders (outdated) | Universal `~/.agents/skills/` | ✓ Updated docs (§2 of skills-install-policy) |
| **Agent allowlist** | cursor, claude-code, codex | CLI also auto-detects cline, kilo code | ✓ Documented as intentional (agent compatibility note) |
| **Tier 1 removal** | Can remove per-agent with `skills remove` | No; global skills are not per-agent; must rm directory | ✓ Documented limitation; removed Kilo dupes manually |

---

## What Not to Do

❌ **Don't** try to enforce per-agent skill removal via `skills remove` (it won't work; CLI doesn't install per-agent)

❌ **Don't** consolidate Codex/Kilo to global without lockfile pilot data (might be intentional curation)

❌ **Don't** assume policy allowlist is complete (CLI auto-detection is broader by design)

---

## What To Do If

**...you want to add a new global skill**
1. Use `skills add <repo> -g -y -a cursor -a claude-code -a codex`
2. Verify it doesn't collide with Codex/Kilo pre-bootstrap skills (check names in [Phase 2 assessment](../audits/issue-c-phase2-consolidation-assessment-2026-03-17.md))
3. Test on all agents before merging

**...Codex/Kilo skills cause conflicts**
1. Check `docs/audits/issue-c-phase2-consolidation-assessment-2026-03-17.md` for the list and rationale
2. If conflict is real, consider: (a) rename global skill, (b) remove from Codex/Kilo, (c) merge into plugin
3. Update this document and the audit record

**...you want to pilot `skills-lock.json` on second machine**
1. Generate lock on reference machine: `skills lock --output ~/.agents/skills-lock.json`
2. Copy to second machine
3. Run sync: `skills sync --lock ~/.agents/skills-lock.json --experimental_sync`
4. Document any divergence; report to architecture team

**...you're setting up a new machine**
1. Run `npm install -g skills`
2. Bootstrap: `skills add vercel-labs/agent-skills -g -y -a cursor -a claude-code -a codex`
3. **Optional (for parity):** Use `skills-lock.json` if available
4. Codex/Kilo legacy skills will NOT auto-install; manually copy if needed

---

## References

- **Full audit:** [`docs/audits/machine-audit-mesha-2026-03-17.md`](../audits/machine-audit-mesha-2026-03-17.md)
- **Issue C Phase 2 assessment:** [`docs/audits/issue-c-phase2-consolidation-assessment-2026-03-17.md`](../audits/issue-c-phase2-consolidation-assessment-2026-03-17.md)
- **Workstream completion:** [`docs/audits/skills-unification-workstream-completion-2026-03-17.md`](../audits/skills-unification-workstream-completion-2026-03-17.md)
- **Policy (updated):** [`docs/governance/skills-install-policy.md`](./skills-install-policy.md)
- **Maintenance (updated):** [`docs/governance/maintenance-skills-agents.md`](./maintenance-skills-agents.md)

---

## Summary

**All issues resolved. No blockers. Machine healthy.**

Codex (50) + Kilo (21) + Global (5) + Plugins (39) = 115 skills, zero collisions, policy-aligned.

Per-agent skill sets are intentional and valid pending lockfile pilot confirmation.
