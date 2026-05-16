---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last_updated: 2026-05-15
---

# Block 4 · Polish Workflow

## §22 AI application instructions

| Tag | Blocks active |
|-----|---------------|
| `[software-doc]` | Block 1 + Block 2 + §15 |
| `[notebook]` | Block 1 + Block 2 + §15 + §16 |
| `[physics-paper]` | Block 1 + §17 (Block 2 §10, §11 only) |
| `[readme]` | Block 1 + §18 |
| `[claude-md]` | Block 1 + §19 |
| `[business-web]` | Block 1 + §20a |
| `[business-outreach]` | Block 1 + §20b |
| `[prompt-kit]` | Block 1 + §21 |

Per-project voice contracts (e.g., Mercor/Yosemite) live in each project's own `guides/` directory and are not part of this guide.

When polishing existing text: apply the relevant blocks as a checklist. Find and
fix each violation before returning output. Do not silently pass violations.

When generating new text: apply as constraints. Do not generate text that would
fail §24.

## §23 Pre-write checklist

- [ ] Surface identified and tag selected.
- [ ] Opening claim drafted before any supporting context.
- [ ] `[software-doc]`/`[notebook]`: contribution claim (§7) drafted before mechanism prose.
- [ ] `[physics-paper]`: physical motivation drafted before each major equation.
- [ ] Numbers: all values sourced independently, not inherited from LLM output.
- [ ] Forbidden register (§5) scan on draft opener.

## §24 Post-write audit

Run in order. One hit = fix before proceeding.

1. **Forbidden register scan.** Every phrase from §5 (in Block 1). One hit = rewrite the sentence.
2. **Em-dash count.** More than 2 per section: rewrite. Three or more in one paragraph: definitive.
3. **Sentence opener check.** More than half should open with a technical subject — a named quantity, entity, or operator — not a discourse marker or "The."
4. **Hedge stacking.** Two or more hedging modifiers in sequence: remove all but one.
5. **Uniform bullet check.** 4+ bullets of equal length: rewrite as prose with colons.
6. **Threshold check.** Every threshold named explicitly with its value. No "the configured value."
7. **Voice check.** Would a reader who has read your papers or notebooks recognize this as yours? If it reads cleaner or more uniform than your usual prose, investigate.

## §25 Repo-wide scan command

<!-- voice-check:ignore-start -->
```bash
rg -n "Furthermore|Additionally|It is important to note|plays a crucial|is crucial\.[^s]|delve into|robust framework|seamlessly|transformative|groundbreaking|game-changing|leverage|passionate about|excited to|it's worth noting|interestingly|deep dive|utilize|moving forward|synergy|holistic|empower|feel free to|as mentioned above" --glob "*.md" --glob "*.ipynb" --glob "*.txt"
```

PowerShell fallback:
```powershell
Select-String -Path *.md,*.ipynb,*.txt -Recurse -Pattern 'Furthermore|Additionally|It is important to note|plays a crucial|delve into|robust framework|seamlessly|transformative|groundbreaking|leverage|passionate about|excited to|deep dive|utilize|moving forward|synergy|holistic|empower|feel free to|as mentioned above'
```
<!-- voice-check:ignore-end -->

One hit in any governed surface: rewrite that sentence.
