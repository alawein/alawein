---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last-verified: 2026-04-14
---

# README style guide

## Global invariants

- Use sentence case headings.
- Keep the opening paragraph under 3 sentences.
- Prefer ordered section flow over ad hoc sections.
- Use fenced code blocks with explicit info strings.
- Prefer inline links with descriptive labels.
- Keep badges optional and minimal. Do not place decorative badge walls at the top of the file.
- Do not duplicate content already governed in `docs/README.md`.

## Required sections by archetype

### Product

1. Value proposition
2. Demo and status
3. Quick start
4. Architecture
5. Deployment
6. Docs map
7. Ownership

### Tooling and infrastructure

1. Purpose
2. Install
3. Commands
4. Architecture
5. Consumers
6. Release and versioning

### Research

1. Abstract
2. Status
3. Runtime requirements
4. Reproducibility
5. Datasets
6. Docs map

### Archive

1. Status
2. Historical purpose
3. Constraints
4. Retrieval notes

## Formatting rules

- Use `README.md` and `docs/README.md` as the only top-level documentation entry points.
- Keep command examples copy-pastable.
- Prefer tables only for stable reference material.
- End each README with ownership or support information.
