---
type: canonical
source: none
sla: on-change
last_updated: 2026-06-06
audience: [ai-agents, contributors]
---

# ADR-0001: Adopt anti-rot primitives across the fleet

- **Status:** Accepted
- **Date:** 2026-06-06
- **Deciders:** alawein (Meshal)

## Context

The fleet had no debt ledger and no ADR system; debt and decisions lived in
memory files and handoffs. The anti-rot kit named these failure modes; the net-new
guardrails (debt ledger, ADRs, /checkpoint) close real gaps the existing platform
did not cover.

## Decision

We will require `docs/DEBT.md` and `docs/adr/` in every code-archetype repo
(`products`, `ventures`, `tools`, `research`), enforced by
`validate-repo-framework.py`, define the doctrine in
`docs/governance/anti-rot.md`, and add `/checkpoint`, `/debt-log`, `/new-adr` as
global skills. We reuse `reviewer`/`refactor`/`arch-review` for overlapping
primitives and defer `/check-ssot`, `/doc-sync`, and CODEOWNERS.

## Consequences

- **Positive:** debt and decisions become tracked and auditable; new repos are
  born compliant via bootstrap.
- **Negative / tradeoffs:** existing code repos need a one-time rollout; a new
  doctrine finding type appears until they comply.
- **Follow-ups:** pilot then fleet rollout; revisit `/check-ssot` and `/doc-sync`
  in a v2.
