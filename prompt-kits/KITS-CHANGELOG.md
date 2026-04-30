---
type: canonical
source: alawein
sla: on-change
last_updated: 2026-04-30
audience: [agents, contributors]
---

# Prompt Kit Changelog

All behavioral changes to canonical prompt kits are logged here. Use semantic
versioning: patch for wording only, minor for new constraints or sections,
major for breaking behavioral changes.

---

## AGENT.md

### 1.3.0 — 2026-04-30

- Added version, parent-version, change-summary, downstream-consumers frontmatter fields
- Aligned with LLMOps versioning system; no behavioral changes

### 1.2.0 — 2026-03-15

- Added canary rollout order: `alawein → meshal-web → workspace-tools → alembiq → rest`
- Formalized operating mode section (clear / ambiguous / disagree)

### 1.1.0 — 2026-01-10

- Added mathematical writing section for research repos
- Tightened forbidden register — removed "exceptional" from advisory to blocked

### 1.0.0 — 2025-11-01

- Initial canonical workspace agent prompt

---

## PORTFOLIO.md

### 1.1.0 — 2026-04-30

- Added version, parent-version, downstream-consumers frontmatter fields
- Aligned with LLMOps versioning system; no behavioral changes

### 1.0.0 — 2026-02-01

- Initial canonical portfolio site prompt

---

## workspace-master-prompt.md

### 1.2.0 — 2026-03-20

- Added R-6 Batch Contract rule (manifest-driven multi-repo execution)
- Added phased migration semantics (canonical-name notation)

### 1.1.0 — 2026-02-15

- Added R-5 Sync or It Didn't Happen rule

### 1.0.0 — 2026-01-01

- Initial workspace operating contract
