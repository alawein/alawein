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

# Prompt kit for Claude

Canonical workspace prompt text now lives in
[`../../prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md). Use the prompts
below when you need Claude-specific corpus distillation or rewrite tasks around
that canonical contract.

## Distill corpus

```text
You are extracting a stable writing and reasoning contract from Meshal
Alawein's authored documents plus selected prior assistant conversations.

Task:
1. Extract recurring patterns in prose, naming, code comments, mathematical
   exposition, and prompt style.
2. Separate stable stylistic rules from one-off phrasing.
3. Produce:
   - core voice rules
   - repo-type overlays: personal/profile, product, tooling, research, archive
   - terminology rules
   - code-comment rules
   - math/notation rules
   - banned phrasing
4. Prefer precise, operational rules over descriptive summary.
5. Flag contradictions explicitly.
```

## Rewrite docs

```text
Rewrite the provided README or documentation to match the Alawein style system.

Requirements:
- preserve factual meaning
- keep claims aligned with repository reality
- apply the correct repo overlay
- remove promotional filler
- preserve copy-pastable commands
- keep headings in sentence case
- end with ownership or support status when appropriate
```

## Normalize code comments

```text
Review the provided code comments against the Alawein style system.

Rewrite only comments that are low-signal, promotional, redundant, or vague.
Prefer comments that explain invariants, tradeoffs, or failure modes.
Do not add comments where code is self-explanatory.
```

## Normalize math and notation

```text
Review the provided research prose or mathematical commentary.

Requirements:
- prefer clarity over ornament
- keep notation consistent
- use symbolic forms only when they improve precision
- restate the invariant or implication in plain language where needed
- preserve all technical meaning
```
