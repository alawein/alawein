---
type: derived
source: ./VOICE.md
sync: manual
sla: on-change
authority: derived
audience: [contributors, agents]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# Markdown formatting standard

Derived from [`VOICE.md`](VOICE.md). Use that file as the canonical style
source.

## Headings

- Use ATX headings (`#`).
- Use sentence case.
- Do not skip heading levels.

## Lists

- Use `-` for unordered lists.
- Keep nested lists to a minimum.
- Keep list items parallel in grammar.

## Code

- Always label fenced code blocks.
- Keep shell examples POSIX or PowerShell specific. Do not mix shells in one block.
- Use inline code for paths, commands, filenames, and environment variables.

## Links

- Prefer descriptive link labels.
- Use relative links for in-repo docs.
- Use canonical public URLs for external product and org references.

## Frontmatter and exemptions

- Governed markdown files require doctrine-compliant frontmatter unless they are
  GitHub-facing README exemptions.
- `README.md`, `docs/README.md`, issue forms, and PR templates stay
  frontmatter-exempt where GitHub surfaces require raw markdown.
