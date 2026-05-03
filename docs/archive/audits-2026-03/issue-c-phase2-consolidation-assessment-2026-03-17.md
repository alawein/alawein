---
type: frozen
source: none
sync: none
sla: none
title: Issue C Phase 2 — Codex/Kilo Consolidation Assessment
description: Optional further consolidation of per-agent skills to global Tier 1; deferred pending active need
last_updated: 2026-03-18
audit_date: 2026-03-17
phase: 2 (optional)
status: assessment-complete
---

# Issue C Phase 2 — Codex/Kilo Consolidation Assessment

**Context:** Phase 1 completed 2026-03-17 with removal of 2 duplicates from Kilo Code. Phase 2 assesses whether remaining per-agent skills should be further consolidated to global Tier 1, or retained as intentional IDE-specific utilities.

---

## Phase 1 Completion Summary

| Directory | Pre | Post | Action |
|-----------|-----|------|--------|
| Codex | 50 | 50 | Retained as-is; no collisions |
| Kilo Code | 23 | 21 | Removed `vercel-react-best-practices`, `web-design-guidelines` |

**Rationale:** Both duplicates were exact name matches with global Vercel pack (Tier 1), making removal low-risk and aligning with canonical universal `~/.agents/skills/` architecture.

---

## Phase 2: Further Consolidation Candidates

### Codex Skills Remaining (50)

**Deployment Tools** (IDE-specific, not universal):
- cloudflare-deploy (stack-specific)
- netlify-deploy (stack-specific)
- render-deploy (stack-specific)

**API/Integration Tools** (IDE-specific):
- figma-implement-design (design workflow, Codex-centric)
- sentry, linear, notion-*, openai-docs, sora, speech, transcribe, playwright
- gh-address-comments, gh-fix-ci, release-notifier, sentry

**Utilities & Productivity** (curated for Codex):
- alignment-planner, archive-manager, changelog-keeper, doc-auditor, information-consolidation, repo-inspector, security-*, slide, spreadsheet, write-guide-enforcer

**IDE/Framework-Specific**:
- aspnet-core, winui-app (Windows/.NET stack)
- jupyter-notebook, pdf, imagegen, sora (data/ML workflows)

**Assessment:** All 50 Codex skills are **intentionally curated for Codex workflows**. No overlap with global or plugin tiers; no duplicates with other agents detected. Consolidation to global Tier 1 would dilute Codex-specific focus and require reclassifying which are "universal" vs "IDE-specific"—**recommend retaining per-agent.**

### Kilo Code Skills Remaining (21 after Phase 1)

**Deployment Tool** (unique, pre-bootstrap):
- vercel-deploy (different from global `deploy-to-vercel`; pre-bootstrap, pre-dating official Vercel pack)

**Specialized Builders**:
- mcp-builder (MCP/plugin development; IDE-specific)
- skill-creator (local version; pre-bootstrap; official `skill-creator@claude-plugins-official` exists but this is local variant)

**Content/Research Tools**:
- content-research-writer, lead-research-assistant, competitive-ads-extractor, domain-name-brainstormer

**Productivity**:
- artifacts-builder, canvas-design, changelog-generator, file-organizer, image-enhancer, internal-comms, slack-gif-creator, theme-factory, video-downloader, webapp-testing

**Assessment:** Kilo's remaining 21 skills are **all unique, no collisions**. `vercel-deploy` differs from global `deploy-to-vercel` (pre-bootstrap vs official); `mcp-builder` and `skill-creator` are specialized. **Recommend retaining per-agent unless `vercel-deploy` is proven superior and should replace global version.**

---

## Consolidation Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| **Retain per-agent** (current Phase 1 strategy) | Preserves IDE-specific curation; zero churn; matches org use case divergence (Codex = broad tools, Kilo = content/specialty) | Maintains 74+ pre-bootstrap skills; future sync/lock challenges if machines diverge |
| **Aggressive consolidation** (Trim Phase 2) | Aligns all agents on universal `~/.agents/skills/`; simplifies sync and parity; reduces surface | Requires classifying each of 74 skills as "universal" or "agent-only"; likely removes valuable IDE-specific tools; abandons Codex/Kilo intentional curation |
| **Selective consolidation** (Hybrid) | Migrate only truly universal tools (e.g., if `vercel-deploy` is better, promote to global); document the rest as intentional per-agent | Requires active analysis per skill; more maintenance overhead; unclear ROI vs Phase 1 |

---

## Recommendation

**Phase 2 Deferred (hold for future active need).**

Rationale:
1. **Phase 1 eliminated actual duplicates** — the 2 collision cases are resolved
2. **No collisions remain** — Codex/Kilo skills do not conflict with Tier 1 (global) or Tier 3 (plugins)
3. **Per-agent curation is intentional** — Codex and Kilo have distinct use cases; retaining per-agent skill sets reflects org workflow differentiation
4. **Consolidation ROI unclear** — moving 50-70 more skills requires classification effort with uncertain benefit; better to trigger on actual conflict or adoption need
5. **Lockfile pilot (Issue G) will test sync** — `skills-lock.json` pilot on second machine will reveal whether per-agent drift becomes a problem in practice

---

## Path Forward

**If divergence or sync issues arise:**
- Use `skills-lock.json` and `experimental_sync` to validate machines
- Re-evaluate consolidation with real data on which per-agent skills are actually used vs redundant
- Consolidate selectively (only proven duplicates or high-value universal tools)

**If no issues arise:**
- Accept per-agent skill sets as feature, not bug
- Document in maintenance playbook that Codex/Kilo maintain intentional specialized sets
- Archive this assessment as "investigated, deferred"

---

## Checklist: Phase 2 Analysis Complete

- [x] Inventory all Codex skills (50) — uniqueness and collision risk assessed
- [x] Inventory all Kilo Code skills (21 post-Phase-1) — same
- [x] Cross-reference Tier 1 (global) and Tier 3 (plugins) — no collisions found
- [x] Classify by consolidation ROI — all 71 classified
- [x] Trade-off analysis — Retain vs Consolidate vs Hybrid
- [x] Recommendation documented — Phase 2 deferred; lockfile pilot will inform future decisions

---

## Summary

**Issue C: Phase 1 ✓ Complete (resolved); Phase 2 ✓ Assessed (deferred).**

Codex (50) and Kilo Code (21) maintain intentional, collision-free, IDE-specific skill sets. No further action required until active conflict or sync issues emerge; lockfile pilot will test whether per-agent divergence is a problem.
