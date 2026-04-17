---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# Voice and style contract

This is the authoritative style reference for governed Alawein surfaces:
READMEs, docs, prompt kits, `CLAUDE.md` / `AGENTS.md`, code comments, and
mathematical exposition. It is distilled from observed writing patterns, not
aspirational brand language.

## The through-line

> Substance over performance. Principle over politeness. Truth over likability.

Writing succeeds when it states what is actually believed, leads with the
claim, shows the constraint honestly, and stops when the argument is done. It
fails when it performs enthusiasm, hedges boundaries, lists credentials instead
of showing work, or explains why respect is deserved rather than earning it.

The strongest register is defending a principle. The weakest is seeking
approval.

## Core prose rules

### Structure

- Lead with the claim. Context follows. Credentials do not open the paragraph.
- Short declarative sentences are the default unit. Longer sentences are fine
  when the mechanism genuinely needs them.
- Use active voice. Use third-person only in formal papers and theses.
- Do not add preambles explaining what is about to be said. Do not add recap
  paragraphs explaining what was just said.
- Use paragraphs when explaining mechanisms, relationships, or reasoning.
  Reserve bullets for genuine enumeration.

### Forbidden register

These phrases are banned on governed surfaces:

`passionate about`, `leveraging`, `innovative`, `cutting-edge`, `excited to`,
`it's worth noting`, `interestingly`, `delve into`, `deep dive`, `utilize`,
`in today's world`, `moving forward`, `synergy`, `holistic`, `game-changing`,
`groundbreaking`, `seamlessly`, `robust solution`, `empower`,
`transformative`, `I am pleased to`, `I hope this helps`, `feel free to`,
`as mentioned above`.

### Preferred register

- Concrete claims with numbers, units, and conditions
- Named systems: `VASP PBE+SOC`, not "the DFT code"
- Specific failure modes: "model fails on chirality constraints in Weyl
  semimetals", not "model has limitations with complex physics"
- Direct boundaries: "I don't", not "I would prefer not to"
- Honest scoping: "not looking for volume — looking for depth"

## Feynman register

The core tension in this voice is Feynman-style engagement against
computational-physics precision. Both apply. Neither cancels the other.

### Feynman influence

- Physical intuition before formalism
- Concrete examples before abstract categories
- Rhetorical questions only when they sharpen focus
- Short sentences that land like facts

### Computational-physics precision

- Match numerical precision to the quantity
- Keep units explicit
- Show uncertainty without theatrical overreach
- State computational constraints directly

Bad:

```text
We utilized VASP to delve into the electronic structure landscape.
```

Good:

```text
We calculated the band structure of strained MoS2 using VASP (PBE+SOC).
```

## Mathematical exposition

### Notation discipline

- Bold for vectors (**k**, **r**), italic for scalars (*E*, *ε*), hat for
  operators (Ĥ, V̂)
- Define symbols at first use
- State scalar magnitude explicitly when needed: `|**k**| = k`
- Keep subscript conventions consistent across a document
- Use LaTeX for equations. Use Unicode math only in prose where LaTeX is not
  practical

### Structure

Put physics before formalism. Give one or two sentences of physical motivation
before each major equation. State what the quantity measures and why it appears
here.

Bad:

```text
The Berry phase is γ_n = ∮ ⟨u_{n,**k**}|i∇_**k**|u_{n,**k**}⟩ · d**k**.
```

Good:

```text
Adiabatic transport of a Bloch state around a closed loop in reciprocal space
accumulates a geometric phase that depends on the path, not the speed. This
Berry phase is
γ_n = ∮ ⟨u_{n,**k**}|i∇_**k**|u_{n,**k**}⟩ · d**k**,
and it is gauge-invariant modulo 2π.
```

### Avoid

- Starting derivations without stating what they derive toward
- Claiming results "can be shown" without at least a reference
- Reusing symbols for different quantities in adjacent equations
- Omitting integration domains, Brillouin-zone boundaries, or boundary
  conditions

## Code comments

Comments should explain invariants, assumptions, failure modes, or algorithmic
justification. They should not narrate syntax or restate visible code.

Good:

```python
# k-points must be in reduced coordinates; convert cartesian -> reduced first
```

Bad:

```python
# loop over k-points
for kpt in kpoints:
    ...
```

Link to papers or references for non-trivial algorithms. Commit messages stay
present tense, technical, and free of AI attribution.

## Naming conventions

### Repos and packages

- Repos: lowercase-hyphenated (`workspace-tools`, `llm-engineering`)
- npm packages: scoped lowercase (`@morphism/core`)
- Python classes: `PascalCase`
- Python functions and variables: `snake_case`
- TypeScript and JavaScript identifiers: `camelCase`

### Canonical project names

| Name | Category | One-liner |
|------|----------|-----------|
| Morphism | Governance | Formal orchestration for governed, composable agent systems |
| Alembiq | AI Infrastructure | LLM training, alignment, and evaluation — SFT, DPO, LoRA, synthetic data |
| Event Discovery Framework | Computer Vision | Physics-inspired video event detection via energy functionals |
| OptiQAP | Optimization | Equilibrium-guided QAP solver: spectral methods, QUBO, simulated annealing |
| REPZ | Coaching Platform | Elite coaching platform for fitness professionals |
| LLMWorks | LLM Tooling | LLM evaluation and security testing — arena, benchmarks, provenance |
| SimCore | Scientific Platform | Interactive scientific computing — 18 modules for quantum simulation |

### Canonical identity strings

Use these strings exactly on governed surfaces unless a repo-specific surface
requires a narrower subset.

```text
Name:     Meshal Alawein
Degrees:  PhD EECS, UC Berkeley · MS (spintronics / nanomagnetic logic)
Company:  Morphism Systems (Cache Me Outside LLC)
GitHub:   github.com/alawein
Contact:  contact@meshal.ai
Stack:    Python · TypeScript · C++ · CUDA · VASP · SIESTA · LAMMPS
Stats:    16+ publications · 2,300+ HPC jobs · 50+ repos
```

## Surface-specific rules

### README.md

- No YAML frontmatter
- Open with repo name and one factual sentence
- The second paragraph states what it does, for whom, and how it differs from
  the obvious alternative
- No motivational footers
- No emoji in headings
- Use badges only for current, verifiable state

### docs/README.md

This is a render-first surface. The same rules as `README.md` apply.

### CLAUDE.md and AGENTS.md

These are agent-facing. Write for a technical reader with zero prior context.
State constraints before capabilities.

Recommended section order:

1. Workspace identity
2. Directory structure
3. Governance rules
4. Code conventions
5. Build and test commands

### Prompt kits

- Use imperative mood
- State model identity, surface, and constraints in that order
- Include a short forbidden-register list for copy surfaces
- For research contexts, include a notation-discipline note

## Enforcement tiers

| Surface | Tier |
|---------|------|
| README.md, docs/README.md | Blocking |
| .claude/CLAUDE.md, CLAUDE.md, AGENTS.md | Blocking |
| Prompt kits | Blocking |
| Code comments | Advisory |
| Mathematical notation | Advisory |
| Commit messages | Advisory |

Do not tighten advisory surfaces to blocking without a documented reason.
