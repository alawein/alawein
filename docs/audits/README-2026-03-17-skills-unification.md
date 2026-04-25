---
type: frozen
source: none
sync: none
sla: none
title: Skills Unification Audit (2026-03-17) — Navigation Guide
description: Index and navigation for all skills unification workstream documents
last_updated: 2026-04-25
category: audits
---

# Skills Unification Audit (2026-03-17) — Navigation Guide

**Start here** to understand what was audited, what was found, and what was fixed.

---

## Quick Links by Use Case

### For Operator/Maintainer (You Are Here)
**Want to understand what was done and what to do next?**
→ Start with [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md)
- Shows all 3 issues resolved
- Lists remaining deferred work
- Path forward for lockfile pilot and Cursor MCP audit

**Want a one-page quick reference?**
→ [`../archive/skills-consolidation-reference-2026-03-17.md`](../archive/skills-consolidation-reference-2026-03-17.md)
- Current state table
- Architecture decision rationale
- What not to do
- Troubleshooting guide

### For Policy/Governance Review
**Need to understand the policy updates?**
→ Updated files:
- [`../governance/skills-install-policy.md`](../governance/skills-install-policy.md) — Agent compatibility note + pre-bootstrap cleanup note
- [`../governance/maintenance-skills-agents.md`](../governance/maintenance-skills-agents.md) — Artifact map update (canonical paths)

### For Technical Deep Dive
**Want all the audit details?**
→ [`machine-audit-mesha-2026-03-17.md`](./machine-audit-mesha-2026-03-17.md)
- 15 sections covering all agents and configurations
- Inventory of all 115 skills across Tier 1/2/3
- Collision analysis (0 found)
- Checklist status for each component

**Need the Issue C analysis?**
→ [`issue-c-phase2-consolidation-assessment-2026-03-17.md`](./issue-c-phase2-consolidation-assessment-2026-03-17.md)
- Phase 1 completion (2 Kilo duplicates removed)
- Phase 2 assessment (71 remaining skills analyzed)
- Trade-off analysis: Retain vs Consolidate vs Hybrid
- Why Phase 2 is deferred

### For Contributor/New Team Member
**Need to understand the current skill architecture?**
→ Read in this order:
1. [`../governance/skills-install-policy.md`](../governance/skills-install-policy.md) (policy fundamentals)
2. [`../archive/skills-consolidation-reference-2026-03-17.md`](../archive/skills-consolidation-reference-2026-03-17.md) (current state + decisions)
3. [`machine-audit-mesha-2026-03-17.md`](./machine-audit-mesha-2026-03-17.md) (full inventory and findings)

---

## Document Overview

| File | Purpose | Audience | Length |
|------|---------|----------|--------|
| [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md) | Final summary; issues resolved; path forward | Operator, PM, Architect | 2-3 min read |
| [`machine-audit-mesha-2026-03-17.md`](./machine-audit-mesha-2026-03-17.md) | Comprehensive audit of all agents, skills, MCPs on reference machine | Technical reviewer, Auditor | 10-15 min read |
| [`issue-c-phase2-consolidation-assessment-2026-03-17.md`](./issue-c-phase2-consolidation-assessment-2026-03-17.md) | Phase 2 analysis: should we consolidate more skills? | Architect, Tech Lead | 5-7 min read |
| [`../archive/skills-consolidation-reference-2026-03-17.md`](../archive/skills-consolidation-reference-2026-03-17.md) | Quick reference: current state, decisions, troubleshooting | Anyone maintaining skills | 3-5 min read |
| [`../governance/skills-install-policy.md`](../governance/skills-install-policy.md) (updated) | Policy definition (updated with agent compatibility + consolidation notes) | Policy reviewer, Contributor | 5 min read |
| [`../governance/maintenance-skills-agents.md`](../governance/maintenance-skills-agents.md) (updated) | Artifact map and maintenance procedures (updated with canonical paths) | Maintainer, Contributor | 5 min read |

---

## Key Findings Summary

### Issues Resolved
| Issue | Before | After | Evidence |
|-------|--------|-------|----------|
| **A** | Docs said `~/.cursor/skills/`; reality is universal `~/.agents/skills/` | ✓ Docs updated to reflect canonical path | Lines 36 (maintenance.md) and 76 (policy.md) |
| **B** | Policy allowlist (cursor, claude-code, codex) differs from CLI recipients (also cline, kilo code) | ✓ Documented as intentional CLI auto-detection; added agent compatibility note | skills-install-policy.md lines 82-83 |
| **C** | Codex (50) + Kilo (24) = 74 pre-bootstrap skills; collision risk? | ✓ Phase 1: Removed 2 Kilo dupes; Phase 2: Assessed as no further consolidation needed | Kilo 23→21; Phase 2 assessment doc |

### Current Skills Inventory
- **Global (Tier 1):** 5 (Vercel pack, canonical location)
- **Codex (Tier 1 legacy):** 50 (retained; no collisions)
- **Kilo (Tier 1 legacy):** 21 (consolidated from 23)
- **Plugins (Tier 3):** 39 (kohyr, repo-superpowers, knowledge, etc.)
- **Total:** 115 skills, **0 collisions**

### Policy Alignment Status
- ✓ Doc/reality gaps: **CLOSED**
- ✓ Agent compatibility: **DOCUMENTED**
- ✓ Tier 1/2/3 separation: **MAINTAINED**

---

## Navigation by Question

**Q: What's the current state of skills on this machine?**
→ See [`machine-audit-mesha-2026-03-17.md`](./machine-audit-mesha-2026-03-17.md) §1, §13

**Q: What was fixed?**
→ See [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md) "Issues Confirmed & Resolved" section

**Q: Can I consolidate more skills to global Tier 1?**
→ See [`issue-c-phase2-consolidation-assessment-2026-03-17.md`](./issue-c-phase2-consolidation-assessment-2026-03-17.md) "Recommendation" section

**Q: What do I do if X happens?**
→ See [`../archive/skills-consolidation-reference-2026-03-17.md`](../archive/skills-consolidation-reference-2026-03-17.md) "What To Do If..."

**Q: How do I bootstrap a new machine?**
→ See [`../governance/skills-install-policy.md`](../governance/skills-install-policy.md) "New machine checklist"

**Q: Where's the lockfile pilot?**
→ Deferred; see [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md) "Remaining Work (Deferred)"

---

## Checklist for Reading

Choose your path based on role:

### Operator/PM/Manager
- [ ] Read [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md)
- [ ] Skim [`../archive/skills-consolidation-reference-2026-03-17.md`](../archive/skills-consolidation-reference-2026-03-17.md) "What To Do If..."
- [ ] Done ✓

### Technical Reviewer/Auditor
- [ ] Read [`machine-audit-mesha-2026-03-17.md`](./machine-audit-mesha-2026-03-17.md)
- [ ] Read [`issue-c-phase2-consolidation-assessment-2026-03-17.md`](./issue-c-phase2-consolidation-assessment-2026-03-17.md)
- [ ] Review updated policy files (skills-install-policy.md, maintenance-skills-agents.md)
- [ ] Verify validation passing (scripts/validate-doc-contract.sh)
- [ ] Done ✓

### Contributor/New Team Member
- [ ] Read [`../governance/skills-install-policy.md`](../governance/skills-install-policy.md)
- [ ] Read [`../archive/skills-consolidation-reference-2026-03-17.md`](../archive/skills-consolidation-reference-2026-03-17.md)
- [ ] Skim [`machine-audit-mesha-2026-03-17.md`](./machine-audit-mesha-2026-03-17.md) §1 and §13 (summary tables)
- [ ] Done ✓

---

## Next Steps

### Immediate (No blocker)
- ✓ Review this navigation guide
- ✓ Read appropriate documents for your role

### When Second Machine Available
- Schedule lockfile pilot (Issue G)
- See [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md) "Remaining Work"

### When Cursor Available
- Schedule Cursor MCP audit
- See [`skills-unification-workstream-completion-2026-03-17.md`](./skills-unification-workstream-completion-2026-03-17.md) "Remaining Work"

---

## Archive

All other workstream artifacts from this audit are in this directory:
- [`skills-unification-workstream-report-2026-03-17.md`](./skills-unification-workstream-report-2026-03-17.md) (original workstream spec)
- [`doc-audit-2026-03-17.md`](./doc-audit-2026-03-17.md) (documentation audit, separate initiative)

---

**Last Updated:** 2026-03-17
**Status:** ✓ COMPLETE
**Questions?** See the relevant document above based on your role.
