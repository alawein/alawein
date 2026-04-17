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

# Hybrid corpus workflow

Use this workflow to refine the style system with Meshal-authored material
without committing raw personal corpus files to the repo.

## Inputs

- Curated authored documents
- Selected Claude conversation exports
- Selected ChatGPT conversation exports

## Storage policy

- Raw inputs stay out of version control.
- Distilled outputs may be committed:
  style summaries, invariant lists, terminology decisions, and prompt kits.
- Local working directories for raw material should live under ignored paths
  such as `corpus/raw/`, `corpus/exports/`, and `corpus/tmp/`.

## Distillation flow

1. Gather representative source material.
2. Extract recurring tone, naming, proof style, and notation patterns.
3. Normalize contradictions into explicit rules.
4. Update `VOICE.md`, `terminology-registry.yaml`, and `prompt-kits/`.
5. Rebuild Vale rules and rerun style audits.

## Distilled output categories

- Voice contract updates
- Terminology additions or deprecations
- Code-comment examples
- Math-notation preferences
- Prompt-kit revisions for workspace and portfolio surfaces
