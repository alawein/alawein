---
type: derived
source: ../../prompt-kits/AGENT.md
sync: manual
sla: on-change
authority: derived
audience: [contributors, agents]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# Prompt kit for ChatGPT

Canonical workspace prompt text now lives in
[`../../prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md). Use the prompts
below when you need ChatGPT-specific distillation or compliance-audit runs
around that canonical contract.

## Distill corpus

```text
Analyze the attached Meshal Alawein documents and selected prior assistant
conversations. Distill a stable style contract for:
- prose voice
- repo README structure
- technical documentation
- code comments
- mathematical exposition
- terminology and naming
- prompt style

Return explicit rules, overlays by repo type, banned phrasing, and any
contradictions that require a deliberate default.
```

## Rewrite docs

```text
Rewrite this README or document to match the Alawein style contract.

Constraints:
- preserve factual content
- use the correct overlay for this repo type
- remove hype and vague adjectives
- prefer direct, technical wording
- keep examples and commands intact
- do not invent capabilities or status
```

## Normalize code comments

```text
Review these source files for comment style drift.

Keep comments only where they explain invariants, edge cases, failure modes, or
non-obvious decisions. Rewrite or remove comments that merely narrate code,
oversell behavior, or use filler language.
```

## Audit compliance

```text
Audit this repo content against the Alawein style contract.

Return:
1. blocking issues for README/docs terminology and voice
2. advisory issues for code comments and mathematical notation
3. concrete rewrites for the highest-signal violations
```
