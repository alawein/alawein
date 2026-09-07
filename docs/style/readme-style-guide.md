---
type: derived
source: ./VOICE.md
sync: manual
sla: on-change
authority: derived
audience: [contributors, agents]
last_updated: 2026-09-05
last-verified: 2026-07-25
---

# README style guide

This file is a quick-reference projection of [`VOICE.md`](VOICE.md).
Use `VOICE.md` as the canonical README authority.

## Global invariants

- Use sentence case headings.
- Keep the opening paragraph under 3 sentences.
- Prefer ordered section flow over ad hoc sections.
- Use fenced code blocks with explicit info strings.
- Prefer inline links with descriptive labels.
- Keep badges optional and minimal. Do not place decorative badge walls at the top of the file.
- Do not duplicate content already governed in `docs/README.md`.

## Required public sections

1. The claim (optional for archival repositories)
2. Run it
3. What it is
4. What it is not
5. Docs map
6. License

## Formatting rules

- Use `README.md` and `docs/README.md` as the only top-level documentation
  entry points.
- Keep command examples copy-pastable.
- Prefer tables only for stable reference material.
- End each README with ownership or support information.
