---
type: canonical
source: catalog/governance-decisions.yaml
sync: none
sla: none
title: Phase 3 Workstream E Governance Decisions
description: Reversible, evidence-backed records for Phase 3 workstream E decisions.
last_updated: 2026-09-07
category: governance
audience: contributors
status: active
version: 1.0.0
---

# Phase 3 Workstream E

The machine-readable decision record is
[`catalog/governance-decisions.yaml`](../../catalog/governance-decisions.yaml).
It is an extension of the `alawein/alawein` catalog SSOT, not a replacement
for `catalog/index.yaml` or its generated outputs.

Run `python scripts/catalog/validate-catalog.py --strict` after editing the
record. Validation rejects malformed containers, evidence, and review flags,
including invalid design-system consumer entries following a valid entry.

The record deliberately distinguishes established evidence from proposed
transitions and review-required claims. It makes no deployment, visibility,
archive, deletion, or settings changes. Research archive candidates retain
citations, notebooks, releases, and unique assets if a later review approves
an archive action.
