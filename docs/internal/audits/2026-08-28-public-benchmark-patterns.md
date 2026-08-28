---
type: audit
status: draft
last_updated: 2026-08-28
owner: meshal
---

# Public benchmark patterns (2026-08-28)

Evidence gathered from five internal READMEs (three live, two judged at
origin/main) and twelve external READMEs, distilled into the P0 checklist
that every sibling PR in this wave walks.

## Evidence base

### Internal

| Repo | Lines | Badges | H2 order | Status and limits | Tree |
|---|---|---|---|---|---|
| gymboy | 98 | 1 (CI, line 14) | Value proposition, Demo and status, Quick start, Architecture, Deployment, Docs map, Ownership, License | `Lifecycle: active` and `Homepage: none` in Demo and status (25-27); constraints at point of use: `Do not assume server-side Postgres or remote KV.` (64-65) |13 lines, 5 top-level box-drawing entries plus 3 invariant bullets (43-70) |
| meshal-web | 78 | 1 (License MIT, line 10, on a private repo) | Value proposition, Demo and status, Quick start, Architecture, Deployment, Docs map, Ownership | `Lifecycle: active` (21), `Production: meshal.ai` (22); non-goal `not a CMS or generic blog shell` (16-17) | 22 lines (40-61), box-drawing tree (15 lines) plus one stack line and two doc links |
| spincirc | 77 | 0 | Abstract, Status, Runtime requirements, Reproducibility, Datasets, Architecture, Docs map | Dedicated `## Status` H2: `Lifecycle: frozen` (19), `Verification date: 2026-06-29` (20), `Scope: MATLAB core solvers, Python analysis tools, Verilog-A compact models` (21) | 13 lines (60-72), 5 top-level entries, then a `Detail:` link |
| design-system (origin/main) | 89 | not recorded in evidence | Purpose, Install, Commands, Architecture, Docs map, Consumers, Release and versioning, License | fleet template shape; local clone (stale, judged separately) has no Architecture H2 and no Docs map | 24-line Architecture with tree plus package table (origin 42-65) |
| workspace-tools (origin/main) | 86 | not recorded in evidence | Purpose, Install, Commands, Architecture, Docs map, Consumers, Release and versioning | fleet template shape; local clone (stale, judged separately) has no Architecture H2, no Docs map by that name | tree at origin 49-65 |

Local clones of design-system and workspace-tools are stale pre-template
documents (design-system: 359 ahead / 369 behind; workspace-tools: 0 ahead /
9 behind) and are judged by their origin/main version, not the clone.

### External

| Repo | Lines | Header badges | Scope or boundary sentence | Install line |
|---|---|---|---|---|
| sindresorhus/p-map | 190 | 0 | line 7: differs from `Promise.all()` on concurrency control and stop-on-error | 12 |
| casey/just | 5942 | 5 (badge wall) | line 51: "a command runner, not a build system" | 97 (`cargo install just`); first example command at 39 |
| sharkdp/hyperfine | 347 | 2 | none | 172 (`apt install hyperfine`); Installation heading at 164 |
| python-attrs/attrs | 161 | 5 (badge wall) | line 23: goal is concise and correct software; no non-goals | none |
| pallets/click | 62 | 0 | lines 10-18: purpose in three sentences plus "Click in three points"; no non-goals | none |
| junegunn/fzf | 1153 | 6 (badge wall) | none | 116 (`brew install fzf`) |
| charmbracelet/glow | 242 | 4 | none | 32 (`brew install glow`) |
| sharkdp/bat | 941 | 3 | lines 924-933: explicit goals list, placed at the end | 374 (`brew install bat`) |
| tiangolo/typer | 380 | 3 | none | 51 (`uv add typer`) |
| astral-sh/ruff | 559 | 6 (badge wall) | line 32: "Drop-in parity with Flake8, isort, and Black"; no non-goals | 135 (`uv tool install ruff@latest`) |
| mitmproxy/pdoc | 88 | 6 (badge wall) | line 42: "aims to do one thing and do it well"; line 60: recommends Sphinx for complex needs | 21 (`pip install pdoc`) |
| psf/black | 231 | 9 (badge wall) | lines 18-19, 83-84: cedes control over formatting minutiae; configuration deliberately limited | 41 (`pip install black`) |

Badge walls (5 or more header badges): psf/black (9), junegunn/fzf (6),
astral-sh/ruff (6), mitmproxy/pdoc (6), casey/just (5), python-attrs/attrs
(5).

## Patterns

- First six lines are the framework header; the H1 is the name, never a
  slogan (meshal-web and gymboy lines 1-6, identical shape).
- One paragraph states what it is, for whom, and how it differs from the
  obvious alternative (VOICE.md README rule; p-map line 7).
- One negated boundary sentence at the point of use, never a Limitations
  section (meshal-web 16-17, gymboy 64-65, pdoc 60).
- Status is key-value: lifecycle, verification date, scope (spincirc 19-21).
- Install or reproduce command on the first screen (p-map line 12, pdoc line
  21).
- Architecture: 5 to 15 line tree of origin/main, then one link line (spincirc
  60-72, 13 lines).
- Docs map: bare link bullets to files that exist (spincirc 75-77, three
  links: docs/README, SSOT, LESSONS).
- At most 2 CI badges plus license; the strong internal examples use 0 or 1
  (spincirc 0, gymboy 1, meshal-web 1).
- Omitted: feature lists, screenshots, table of contents, testimonials,
  roadmap, praise, emoji, motivational closers (design-system and
  workspace-tools local clones carry none of these either; the external set
  shows what adding them back looks like, e.g. attrs' Tidelift pitch at
  156-161, ruff's 40-line testimonials block before install at 68).

## What the bar omits

None of the strong examples, internal or external, carry a feature list, a
screenshot, a table of contents, a testimonials section, a roadmap, praise
language, emoji, a motivational closer, or a badge wall. Where these appear
in the external set (attrs' Tidelift close, ruff's testimonials block ahead
of install, black's Used by and Testimonials sections, just's and fzf's
table of contents and merch blocks) they push the real content further down
the page and add nothing a reader needs to run or evaluate the project.

## P0 README checklist

```
P0-01  Header block is lines 3 to 8 and every value matches the catalog
       (Status = catalog status, Category = bucket, Visibility = live).
P0-02  First paragraph: what it is, for whom, how it differs. Under 3 sentences.
P0-03  One boundary sentence saying what it does not do or assume.
P0-04  Status section carries Lifecycle, Verification date (today), Scope.
P0-05  Reproduction: one command block that was run for this PR; exit code
       and the date recorded in the PR body. For a site: the live URL
       returned 200 on the PR date and the build command was run.
P0-06  Every path, script, and command named in the README exists on main
       and runs from the repo root as written.
P0-07  Live surface named in Status when one exists (homepage in catalog).
P0-08  Tree is 5 to 15 lines and matches origin/main top level.
P0-09  Docs map bullets resolve; minimum docs/README.md, SSOT.md, LESSONS.md.
P0-10  No planning voice (should, where possible, emphasize), no praise,
       no banned register, no em dash, no AI attribution.
P0-11  At most 2 CI badges plus license; none is acceptable.
P0-12  CITATION.cff present for research repos with a publication; fields
       match the existing fleet files (author, ORCID, license, repository).
```

## Picks

Internal:

- gymboy: the full fleet skeleton in 98 lines, one CI badge, a tree plus
  three invariant bullets stated at the exact file that enforces each one.
  Caveat: the intro paragraph (10-12) and Value proposition (18-21) say the
  same thing twice.
- meshal-web: tighter at 78 lines, with the non-goal stated in one sentence
  (16-17). Caveat: a License badge sits on a repo marked `Visibility:
  private` (line 10).

External:

- p-map: 190 lines, 0 badges, install at line 12 and the differentiator
  stated in line 7. Closest match to the internal bar on every axis.
- pdoc: 88 lines, install at line 21, the only external README with real
  scope prose in two places (line 42, line 60). Caveat: 6 header badges, a
  badge wall by this study's cutoff.
- click: 62 lines, 0 badges, purpose stated in three plain sentences plus
  a three-point list. Caveat: no install command anywhere in the file.
