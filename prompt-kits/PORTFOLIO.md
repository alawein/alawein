---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [agents, contributors]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# Prompt kit for meshal-web

Use this system prompt when working on `meshal-web` or `meshal.ai`. This is a
frontend, copy, and information-architecture surface. Treat it as a portfolio
for senior technical readers, not a marketing site.

## Identity facts

Use these strings exactly where the surface calls for them.

```text
Name:     Meshal Alawein
Role:     Computational Scientist · AI Systems Engineer · Founder, Morphism Systems
Degrees:  PhD EECS, UC Berkeley
Company:  Morphism Systems (Cache Me Outside LLC)
GitHub:   github.com/alawein
Contact:  contact@meshal.ai · +1-(415)-660-6676
Stack:    Python · TypeScript · C++ · CUDA · VASP · SIESTA · LAMMPS
Stats:    16+ publications · 2,300+ HPC jobs · 24,000+ CPU-hours · 50+ repos
```

## Site structure

| Route | Title | Purpose |
|-------|-------|---------|
| `/` | Home | Full scrollable CV and portfolio hybrid |
| `/projects` | Projects | Deep link for project grid |
| `/services` | AI Systems Services | Service offering detail |
| `/engagements` | Engagement Models | Pricing and scope |
| `/cv` | CV | Timeline, publications, education |

The homepage consolidates the full story. Sub-pages expand sections for direct
linking. Avoid content duplication between pages.

## Section naming

| Surface | Title | Note |
|---------|-------|------|
| Hero | no section title | Name plus positioning tags |
| About | Background | Narrative CV, not bio copy |
| Technical stack | Capabilities | Table format; avoid pill grids |
| Projects | Selected work | Signals curation and depth |
| Contact | Contact | Short and direct |

## Copy rules

Voice: direct, technically precise, and non-promotional.

Prefer:

- Concrete claims with numbers
- Named systems over broad categories
- Honest scoping
- First-person only where the personal surface genuinely calls for it

Do not use motivational language or generic filler. Do not invent sections
that exist only to occupy space.

## Design tokens

```text
Primary accent:  #c9a55a
Background:      #0a0a0f
Text:            #e8e4dc
Muted:           #8a8698
Status ok:       #00c870
Typography:      Newsreader · JetBrains Mono · Cormorant Garamond
```

Category accents: teal, mauve, amber, sage. Use them for borders and dots, not
heavy fills.

## Canonical project table

| Name | Category | One-liner |
|------|----------|-----------|
| Morphism | Governance | Formal orchestration for governed, composable agent systems |
| Alembiq | AI Infrastructure | LLM training, alignment, and evaluation — SFT, DPO, LoRA, synthetic data |
| Event Discovery Framework | Computer Vision | Physics-inspired video event detection via energy functionals |
| OptiQAP | Optimization | Equilibrium-guided QAP solver: spectral methods, QUBO, simulated annealing |
| REPZ | Coaching Platform | Elite coaching platform for fitness professionals |
| LLMWorks | LLM Tooling | LLM evaluation and security testing — arena, benchmarks, provenance |
| SimCore | Scientific Platform | Interactive scientific computing — 18 modules for quantum simulation |

## What to help with

1. Tighten copy and section intros
2. Refine section naming around the CV-hybrid structure
3. Build React/TypeScript/Tailwind UI that matches the current tokens
4. Add new CV, services, or publications surfaces without filler
5. Write prompts for other tools in the same factual voice

## What not to do

- Do not introduce motivational language
- Do not write generic copy that could fit any engineer
- Do not change design tokens without explicit instruction
- Do not add duplicate content across the homepage and sub-pages
