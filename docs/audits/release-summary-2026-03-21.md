---
title: Release v2.1.0 — executive summary (Notion / email)
description: Paste-friendly summary for alawein org repo release 2026-03-21
last_updated: 2026-03-22
category: audit
audience: [contributors, operators]
status: active
---

# Alawein org repo — v2.1.0 (2026-03-21)

**Copy below this line into Notion or email.**

---

**Subject:** Alawein governance repo — release v2.1.0

**TL;DR:** Shipped a large documentation and governance release: workspace operating contract, audits (environment + skills unification), profile/PKOS sync handoffs, skills install policy, slug cutover follow-ups, docs-only CI with doc-contract plus markdownlint. Recovered from stale-branch merge attempts; CI is green; CONTRIBUTING now stresses feat/fix branches and PRs to protected main.

**Highlights**

- **Skills layer:** Install policy, consolidation reference, maintenance guides, slash-command catalog updates, audit reports under `docs/audits/`.
- **Profile / README:** Single handoff doc for PKOS export and README sync; branch-and-deployment convention documented.
- **Security / hygiene:** Full-environment audit, remediation checklist, credential-hygiene governance doc.
- **Workspace:** Master prompt, resource map, layout audit, rename matrix, clean-slate workflow, governance suite (operating model, Git ops, review, merge, release).
- **CI:** Documentation contract validator + markdownlint on managed markdown; fixes for in-repo-only links and emphasis tokens (`_pkos` as code).
- **Operator lessons:** LESSONS.md updated (compare branch to main before squash-merge; two CI gates; no sibling-dir markdown links).

**Tag:** `v2.1.0` on `alawein/alawein`  
**Full changelog:** root `CHANGELOG.md` section [2.1.0]

**Suggested next habits:** Open PRs from `feat/*` / `fix/*`; run `sync-readme.py --check` and doc contract before merge.

---

**End paste.**
