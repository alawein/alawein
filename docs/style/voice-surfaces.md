---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last_updated: 2026-05-12
---

# Block 3 · Surface Adjustments

_Switch in the section that matches the surface tag. Block 1 always applies._

## §15 Software / AI systems docs

Applies when surface tag is `[software-doc]`.

**Block 2 (§7–14, Design-Defense Register) is fully active on this surface.**

### First-person design authority

Use first-person for every design decision. The design has an author.

Bad: "The scorer is isolated from raw observations."
Good: "I do not let the scorer touch raw observations directly."

Bad: "Care was taken to separate the inferred state from the observation layer."
Good: "I treat the separation as a hard schema constraint, not a documentation note."

### Section structure: motivation → mechanism → "What to notice"

Open every section with the problem or motivation. The mechanism follows.
"What to notice" (§12) appears immediately before any code output or figure.

Bad:
> The validation layer is a conjunctive gate V1 ∧ V2 ∧ V3.

Good:
> After extraction, the inferred state has to be validated before it reaches the
> scorer. The validation layer is a conjunctive gate V1 ∧ V2 ∧ V3. Each gate
> targets a different failure mode; the conjunction matters because each one, on
> its own, leaves a corresponding failure mode invisible.

### Do not summarize what just happened

After presenting a design, move to what it implies.

Bad: "So, we have now seen how the extraction layer separates observations from inferred state."
Good: "The schema constraint does not solve the threshold problem. That requires a second gate, and the choice of threshold is not obvious."

### Figure captions

Format: _Figure N. One factual sentence._ Italic. Period-terminated.
Caption states what the figure shows, not that it exists.

Bad: _Figure 2. This figure shows the two-phase pipeline with all stage labels rendered._
Good: _Figure 2. Full pipeline with stage labels and color coding; every other figure is a zoom into one region of this map._

## §16 Technical notebooks (Jupyter)

Applies when surface tag is `[notebook]`.

**Block 2 (§7–14, Design-Defense Register) is fully active on this surface. §15 rules also apply — in particular: first-person design authority, motivation-before-mechanism structure, and figure caption format.**

### Cell sequence

Prose motivation → code cell → "What to notice in the output below: [element] and [why]."
Never: code cell → bare output with no setup prose.

### Callout box format — HTML only

Markdown blockquotes render inconsistently across JupyterLab, VS Code, and nbviewer.
Use HTML `<div>` tags inside markdown cells. Use the exact callout format defined in §13
(Block 2) without modification — amber `#fdf6e3`/`#b08800` for design notes,
red `#fff5f5`/`#b85450` for known limitations.

### Inline LaTeX

All math in LaTeX: `$\hat{I}$`, `$n \times 4$`, `$V_1 \land V_2 \land V_3$`.
No Unicode math symbols in prose (`≥`, `∧`, `∈`) — they render inconsistently in HTML export. This restriction applies to notebook output and HTML export. In §15 software docs rendered as plain Markdown, Unicode symbols are acceptable.

### Execution counts

Execution counts must be sequential (1, 2, 3…) on a clean run.
Out-of-order counts signal the notebook was not run top-to-bottom. Fix before publishing.

## §17 Physics papers `[physics-paper]`

Block 2 partially active: §10 (threshold discipline) and §11 (honest limitation) apply.
§7–9 and §12–14 do not apply.

Feynman register: physical intuition before formalism; concrete before abstract.
Notation: bold for vectors (**k**, **r**), italic for scalars (_E_, _ε_), hat for
operators (Ĥ, V̂). Define symbols at first use. Keep subscript conventions consistent.

Derivation structure: one or two sentences of physical motivation before each major
equation. State what the quantity measures and why it appears here.

Bad: "The Berry phase is γ_n = ∮ ⟨u_{n,**k**}|i∇_**k**|u_{n,**k**}⟩ · d**k**."
Good: "Adiabatic transport of a Bloch state around a closed loop in reciprocal space
accumulates a geometric phase that depends on the path, not the speed. This Berry
phase is γ_n = ∮ ..."

## §18 README & governance docs `[readme]`

Block 2 does not apply.

No YAML frontmatter. Open with repo name and one factual sentence.
Second paragraph: what it does, for whom, how it differs from the obvious alternative.
No motivational footers. No emoji in headings. No badges for unverified state.

## §19 CLAUDE.md / AGENTS.md `[claude-md]`

Block 2 does not apply.

Write for a technical reader with zero prior context. Constraints before capabilities.
Section order: workspace identity → directory structure → governance rules →
code conventions → build and test commands.

## §21 Prompt kits `[prompt-kit]`

Block 2 does not apply.

Imperative mood. State in this order: model identity → surface → constraints.
Include a short forbidden-register list. For research contexts, include a
notation-discipline note.
