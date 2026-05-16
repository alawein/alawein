---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last_updated: 2026-05-11
---

# Block 2 · Design-Defense Register

_Applies to `[software-doc]` and `[notebook]` surfaces._
_Not active for physics papers, READMEs, or prompt kits._

## §7 Contribution-staking

Two required moves when describing any design decision:

**1. Direct claim:** state what is contributed, not what is done.
Bad: "The placement of the canary check ensures early detection of instrumentation failures."
Good: "Before scoring real traces, I run three synthetic traces with known outcomes. The check itself is small. The placement is the contribution."

**2. Negative scope:** state what is not being claimed.
Bad: "The canaries validate the pipeline."
Good: "None of this tests the model's general capability. The canaries test the instrumentation: the scorer, the auth gate, and the validation gate, all against fixed inputs with fixed expected outputs."

## §8 Concept naming

Bold on first introduction only. Never again.
Pattern: **two-word-to-four-word noun phrase** that names the decision or failure mode.
Rule: if you cannot name it in 2–4 words, the concept is not yet scoped.

Examples: **two-layer bleed problem**, **synchronous canary pre-run**, **diversity filter**, **conjunctive gate**, **schema separation constraint**.

## §9 Novelty discipline

Every system description includes both beats:

**What is useful but not novel** — names the standard tools and prior work in use.
Example: "KDE threshold estimation, LOO cross-validation, and Holm-Sidak FWER correction are all standard. The contribution is the scoring architecture that requires these checks before a checkpoint can promote."

**What is missing** — states the honest scope gap.
Example: "I have not found a clean way to attribute failure when V2 and V3 both fire simultaneously. The trace is dropped either way, but the diagnosis is ambiguous."

Omitting these beats is a claim that everything described is novel and complete.

## §10 Threshold discipline

State every threshold in full, every time it appears. No forward or backward references.

Good: "The extractor re-runs k = 20 times at temperature T = 0.3."
Good: "The LOO threshold requires n ≥ 200 samples."
Good: "Bootstrap CI spread is approximately 1.3 log-likelihood units at n = 30 and approximately 0.46 at n = 500."

Banned: "the threshold above", "the standard value", "the configured parameter",
"as described earlier", "the usual k".

## §11 Honest limitation voice

First person. No passive hedging.

Good: "I have not found a clean way to handle the case where V2 and V3 fire simultaneously."
Good: "This is also the only point in the pipeline that has no automated test."
Good: "I disagree: the FDR correction is wrong here because the gates are not independent."

Bad: "It should be noted that the current approach may not fully address all edge cases."
Bad: "Future work could explore improvements to this component."

## §12 "What to notice" pattern

One sentence immediately before any cell with live output, a figure, or a table.
This is a cue, not a caption. States what matters in the output and why.

Format: "What to notice in the output below: [specific element] and [why it matters]."

Good: "What to notice in the output below: the three canary 4-vectors against their expected values, and the halt message on the third."
Good: "What to notice: the KDE threshold moves by less than 0.02 between n = 200 and n = 500 — the floor matters, but the ceiling is flat."

Appears in the markdown cell immediately preceding the output cell — not after.

## §13 Callout box format

Use HTML `<div>` tags inside markdown cells. Never markdown blockquotes —
they render inconsistently across JupyterLab, VS Code, and nbviewer.

Design note (amber):
```html
<div style="background:#fdf6e3;border-left:3px solid #b08800;padding:10px 14px;margin:12px 0">
<strong>Design note.</strong> [Why this choice was made and what constraint it enforces.]
</div>
```

Known limitation (red):
```html
<div style="background:#fff5f5;border-left:3px solid #b85450;padding:10px 14px;margin:12px 0">
<strong>Known limitation.</strong> [Specific gap, honest scope, and what would fix it.]
</div>
```

## §14 The X-is-the-Y sentence

For every gate, constraint, or architectural decision: one sentence, claim first, reason after.
Pattern: "[Decision] because [reason]."

Good: "The gate is conjunctive because each validator detects a failure mode the others cannot."
Good: "The separation is enforced at runtime, not just documented, because a schema validator runs on every $\hat{I}$ before it reaches the scorer."
Good: "I use Holm-Sidak rather than FDR because the gates are safety-critical."

Banned opener: "In order to [achieve X], we [do Y]."
Rewrite as: "[We do Y] because [reason for X]."
