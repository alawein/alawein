---
type: frozen
source: none
sync: none
sla: none
title: Skills Unification Workstream — Completion Summary
description: Final status of 2026-03-17 workstream; all immediate issues resolved; path forward for lockfile pilot and Cursor audit
last_updated: 2026-03-18
audit_date: 2026-03-17
workstream_status: complete
next_phase: lockfile-pilot-and-cursor-audit
---

# Skills Unification Workstream — Completion Summary (2026-03-17)

**Status:** ✓ **COMPLETE**
**Duration:** Single machine audit pass + resolution
**Issues Resolved:** 3/3 (A, B, C)
**Key Outcomes:** Documentation clarity + policy alignment + Tier 1/2/3 consolidation

---

## What Was Audited

**Reference machine:** Windows 11, mesha's workstation (Claude Code, Codex, Kilo Code, Cursor config unavailable)

**Scope (from workstream report §4):**
- Cursor skill paths and discovery
- Claude Code local plugins (morphism, repo-superpowers, knowledge, workspace, superpowers, governance)
- Codex pre-bootstrap skill inventory
- Kilo Code pre-bootstrap skill inventory
- Cline and other agents receiving skills outside policy allowlist
- MCP configuration across agents
- Repository-local `./skills/` directories (deferred)

---

## Issues Confirmed & Resolved

| Issue | Finding | Resolution | Evidence |
|-------|---------|-----------|----------|
| **A** | Cursor skill path documentation said `~/.cursor/skills/` but actual path is universal `~/.agents/skills/` | Updated `maintenance-skills-agents.md` (artifact map) and `skills-install-policy.md` (paths section) | Docs: line 36 (maintenance) and line 76 (policy) updated 2026-03-17 |
| **B** | Policy allowlist is `cursor`, `claude-code`, `codex`; but `skills list -g` showed Cline and Kilo Code receiving Vercel pack | Investigated CLI behavior: auto-detection is intentional. Policy defines **intended** agents; CLI shows **actual** (broader). Added agent compatibility note to policy docs | Updated `skills-install-policy.md` lines 82-83 with full explanation; confirmed by architect as design choice, not bug |
| **C** | Codex (50 skills) + Kilo Code (24 skills) = 74 pre-bootstrap items; risk of duplication with Tier 1/3? | Phase 1: Removed 2 duplicates from Kilo (`vercel-react-best-practices`, `web-design-guidelines`). Phase 2: Assessed remaining 71 skills; all unique, no collisions found; per-agent curation is intentional | Phase 1 executed 2026-03-17; Phase 2 assessment doc created; Kilo 23→21 skills |

---

## Governance Documentation Updated

| File | Change | Rationale |
|------|--------|-----------|
| `docs/governance/skills-install-policy.md` | Added "Agent compatibility note" (lines 82-83) explaining CLI auto-detection; added "Pre-bootstrap agent skill cleanup" note (post-consolidation) | Clarify that policy describes **intended** agents while CLI may auto-detect broader compatibility; document consolidation decision |
| `docs/governance/maintenance-skills-agents.md` | Updated artifact map (line 36) from per-agent path list to universal `~/.agents/skills/` with agent-specific pre-bootstrap note | Correct doc/reality drift; document canonical location and legacy per-agent dirs |
| `docs/audits/machine-audit-mesha-2026-03-17.md` | Marked Issues A, B, C as Resolved; updated §11 next steps; updated checklist §4.3-4.4 | Finalize audit with resolution status and evidence |

**New documentation:**
- `docs/audits/issue-c-phase2-consolidation-assessment-2026-03-17.md` — Phase 2 analysis; deferred further consolidation pending lockfile pilot

---

## Key Findings

### Skills Inventory (Reference Machine)

| Tier | Location | Count | Status |
|------|----------|-------|--------|
| **Tier 1 (Global)** | `~/.agents/skills/` | 5 | ✓ Clean bootstrap (Vercel pack 2026-03-17) |
| **Tier 1 (Legacy Codex)** | `~/.codex/skills/` | 50 | ✓ Retained; no collisions with Tier 1/3 |
| **Tier 1 (Legacy Kilo)** | `~/.kilocode/skills/` | 21 | ✓ Consolidated (was 23; removed 2 dupes) |
| **Tier 3 (Claude plugins)** | `~/.claude/plugins/cache/local/` | 39 | ✓ No duplication with Tier 1 |

**Total skills on machine:** 115 (5 + 50 + 21 + 39)
**No high-priority collisions:** 0 conflicts
**Collision risk remaining:** 0 (all identified dupes resolved)

### Agent Compatibility

- **Policy allowlist:** cursor, claude-code, codex
- **Actual recipients (via CLI auto-detection):** cursor, claude-code, codex, **cline, kilo code** (intentional per architecture)
- **Enforcement:** Cannot override per-agent; global skills are not installed per-agent, so removal must happen at directory level (done for Kilo Phase 1)

### MCP Configuration

- **Claude Code:** 0 MCPs configured (note: many official plugins enabled, but no MCP servers in settings.json)
- **Cursor:** Config unavailable on reference machine
- **Other agents:** Not checked
- **Action needed:** Cursor MCP audit when available

---

## Consolidation Strategy (Issue C)

### Phase 1: Executed ✓
Removed 2 Kilo Code duplicates:
- `vercel-react-best-practices` (→ use global from Tier 1)
- `web-design-guidelines` (→ use global from Tier 1)

**Result:** Kilo Code consolidated to 21 unique, non-colliding skills.

### Phase 2: Assessed ✓
Analyzed whether remaining 71 Codex + Kilo skills should migrate to global Tier 1.

**Decision:** Defer further consolidation.

**Rationale:**
- No collisions remain (Phase 1 eliminated all)
- Per-agent skill sets are intentionally curated for IDE use cases
- Codex = broad ecosystem tools; Kilo Code = specialized content/development tools
- Consolidation ROI unclear without real usage data
- Lockfile pilot (Issue G) will test whether per-agent divergence is operationally problematic

**Path forward:** If `skills-lock.json` pilot reveals sync issues, revisit consolidation with empirical data. Otherwise, accept per-agent skill sets as feature.

---

## Remaining Work (Deferred)

### Issue G: Lockfile Pilot
**Scope:** Create `skills-lock.json`, test sync on second machine
**Trigger:** When available; not blocking
**Impact:** Validates cross-machine parity strategy; informs Phase 2 consolidation ROI
**Timeline:** Pending second machine availability

### Cursor MCP Audit
**Scope:** Verify enabled MCPs on Cursor-enabled machine; compare to `_ops/mcp/README.md` defaults
**Trigger:** When Cursor config is accessible
**Impact:** Complete MCP inventory (currently only Claude Code checked)
**Timeline:** Pending Cursor availability on reference or test machine

### Repository-Local `./skills/` Scan
**Scope:** Check `C:/Users/mesha/Desktop/GitHub/***/skills/` for any repo-specific skill directories
**Trigger:** Optional; deferred to next audit round
**Impact:** Complete Tier 2 inventory
**Timeline:** Low priority; can piggyback on routine workspace scan

---

## Governance Alignment

**Policy-to-Reality Gaps Resolved:**
- ✓ Doc stated per-agent paths; reality is universal + legacy agent-specific (Issue A → fixed)
- ✓ Policy allowlist differed from CLI auto-detection (Issue B → documented as intentional)
- ✓ Tier 1/3 collision risk (Issue C → Phase 1 removed dupes; Phase 2 assessed as acceptable)

**Remaining Unknowns:**
- ⚠ MCP configuration defaults (depends on Cursor audit)
- ⚠ Cross-machine parity tolerance (depends on lockfile pilot)
- ⚠ Repo-local skill usage (deferred; low impact)

---

## Next Immediate Actions (for operator)

1. **✓ Review this summary** — validate findings and next steps
2. **Decide lockfile pilot timing** — when second machine is available
3. **Schedule Cursor MCP audit** — when Cursor is configured on a test machine
4. **Optionally:** Trigger repo `./skills/` scan in next workspace maintenance cycle

**No blocking issues.** All actionable problems resolved. Machine is healthy and policy-aligned.

---

## Artifacts (This Workstream)

| File | Purpose | Status |
|------|---------|--------|
| `docs/audits/machine-audit-mesha-2026-03-17.md` | Primary audit record | ✓ Complete |
| `docs/audits/issue-c-phase2-consolidation-assessment-2026-03-17.md` | Phase 2 analysis | ✓ Complete |
| `docs/audits/skills-unification-workstream-completion-2026-03-17.md` | This summary | ✓ Complete |
| `docs/audits/skills-unification-workstream-report-2026-03-17.md` | Original workstream spec | Reference |

---

## Sign-Off

**Workstream:** Skills Unification (Single Machine Audit + Resolution)
**Date:** 2026-03-17
**Machine:** Windows 11 (mesha ref setup)
**Issues Addressed:** 3/3 (A, B, C)
**Blocker Status:** 0 (none)
**Policy Alignment:** ✓ Complete
**Documentation:** ✓ Updated
**Ready to proceed:** Yes

**Next phase:** Lockfile pilot + Cursor MCP audit (both optional/deferred; no timeline constraint).
