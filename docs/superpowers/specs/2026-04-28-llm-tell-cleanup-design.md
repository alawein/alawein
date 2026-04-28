---
title: LLM-Tell Phrase Cleanup — Design Spec
date: 2026-04-28
status: active
type: canonical
feeds: []
last_updated: 2026-04-28
---

# LLM-Tell Phrase Cleanup — Design Spec

**Date**: 2026-04-28  
**Scope**: alawein workspace — 8 repos  
**Type**: Automated prose hygiene pass

---

## Context

The alawein workspace accumulates LLM-tell phrases in user-authored markdown prose as a side-effect of AI-assisted writing. These phrases signal machine-generated text and undermine the voice standards defined in `docs/style/VOICE.md`. This spec defines a one-time cleanup pass that removes them across 8 repos using parallel agents, leaving every repo with a clean worktree and well-scoped commits.

---

## Scope

### Repos (processed in parallel)

- `knowledge-base/`
- `meshal-web/`
- `bolts/`
- `fallax/`
- `provegate/`
- `alembiq/`
- `design-system/`
- `optiqap/`

### Files in scope

All `*.md` at repo root + all `*.md` under `docs/` recursively (including `bolts/docs/` and `optiqap/docs/`, both fully user-authored).

### Unconditionally skipped

- `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` (instruction docs)
- Anything under `packages/*/` (boilerplate/generated)
- Anything under `node_modules/`, `dist/`, `build/`, `.changeset/`
- `CHANGELOG.md`, `RELEASES.md`
- Files with fewer than 3 sentences of prose

### Fix scope

Blacklist phrase removal only — not voice profile enforcement.

---

## Blacklist Phrases

One hit = fix the sentence. Minimal surgical edit only — no rephrasing of surrounding content.

| Phrase | Fix |
|--------|-----|
| "Furthermore," / "Moreover," / "In addition," | Drop the connector. State the next claim directly. |
| "It is worth noting that" / "It is interesting to note" | Cut the frame. State the note. |
| "delve into" / "navigate the complexities" | Name the specific thing. |
| "key insights" / "key takeaways" | Name the insight. |
| "unprecedented" / "groundbreaking" | Specify what is new and why. |
| "significantly" / "substantially" | Quantify, or drop. |
| "various" | Name the items. |
| "In conclusion," / "To conclude," | Cut. The final sentence IS the conclusion. |
| "This section examines..." | State what the section establishes. |

## Structural Tells — Flag Only, Do NOT Fix

- Em dash clusters: more than 2 em dashes in a single paragraph
- Hedge stacking: "may potentially be considered to be somewhat"
- Three consecutive paragraph openers beginning with "The X is..."
- Uniform bullet lists of 6+ items at equal depth replacing explanatory prose

---

## Per-Repo Agent Workflow

1. `git fetch origin && git pull --rebase origin main` — abort and report on failure
2. `git status` — identify all dirty files
3. **Commit WIP** (skip if clean): `git add <each dirty file by name>`, commit as `chore: save WIP before LLM-tell cleanup` — no co-author line
4. **Scan**: all in-scope `*.md` files; collect hits with file path, line number, quoted text, proposed replacement
5. **Fix**: apply replacements via Edit tool — no rephrasing of surrounding sentences, no new content
6. **Commit cleanup** (if any files changed): `git add <changed files by name>`, commit as `docs: remove LLM-tell phrases from prose` with co-author line
7. `git push origin main`
8. `git status` — verify clean worktree
9. **Branch report**: flag local branches not present on remote (gone) or 30+ commits behind main — report only, no deletions
10. Return: `repo | files_scanned | blacklist_fixes | structural_flags | push_status | dirty`

### Hard Constraints

- Never `git add -A` or `git add .`
- Never force-push
- Never touch `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`
- Never modify files under `node_modules/`, `dist/`, `build/`, `.changeset/`
- Never rephrase content beyond removing the flagged phrase
- If `git pull --rebase` fails: stop for that repo and report, do not force

---

## Final Report Format

```
Repo             | Files scanned | Fixes | Struct flags | Push | Dirty?
knowledge-base   |               |       |              |      |
meshal-web       |               |       |              |      |
bolts            |               |       |              |      |
fallax           |               |       |              |      |
provegate        |               |       |              |      |
alembiq          |               |       |              |      |
design-system    |               |       |              |      |
optiqap          |               |       |              |      |
```

Failed repos listed separately with reason. Branch cleanup flags follow the table.
