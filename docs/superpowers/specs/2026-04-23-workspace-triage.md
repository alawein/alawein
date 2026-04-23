---
title: Workspace Triage — Reset Map
date: 2026-04-23
status: active
type: canonical
feeds: [spec-a, spec-b, spec-c, spec-d]
---

# Workspace Triage — Reset Map

**Generated:** 2026-04-23
**Repos scanned:** 32
**Purpose:** Classify every repo by status, health, and disposition before committing to deep audit work.

---

## Part 1 — Repo Registry

| Repo | Status | Health | Last Code Commit | Disposition | Audit Tier | Notes |
|------|--------|--------|-----------------|-------------|------------|-------|
| adil | Active | Red | 2026-04-16 | Needs-work | D | SSOT.md exists but date field missing; 12 commits since 2024 |
| alawein | Active | Green | 2026-04-19 | Keep | C | Control plane; 272 commits; 16 CI workflows; SSOT 2026-04-15 |
| alembiq | Active | Green | 2026-04-17 | Keep | D | 31 commits; SSOT 2026-03-27; duplicate slug in projects.json (featured + research) |
| atelier-rounaq | Active | Green | 2026-04-09 | Keep | A | 37 commits; 10 CI workflows; SSOT 2026-03-09 |
| attributa | Active | Green | 2026-04-16 | Keep | A | 44 commits; 13 CI workflows; SSOT 2026-03-09 |
| bolts | Active | Green | 2026-04-16 | Keep | A | 55 commits; 6 CI workflows; SSOT 2026-03-09 |
| chshlab | Active | Green | 2026-04-06 | Needs-work | D | 66 commits but only 1 CI workflow — lowest active-repo CI coverage |
| design-system | Active | Green | 2026-04-21 | Keep | B | 8 CI workflows; 57 commits; 22 npm packages; SSOT 2026-04-08; not in projects.json |
| edfp | Active | Green | 2026-04-17 | Keep | D | 35 commits; 6 CI workflows; duplicate slug in projects.json (featured + research) |
| fallax | Maintained | Green | 2026-04-19 | Freeze | D | 49 commits; 3 CI workflows; research/experiment repo with static landing page; not in projects.json |
| gymboy | Active | Green | 2026-04-16 | Keep | A | 153 commits; 6 CI workflows; SSOT 2026-03-09 |
| helios | Maintained | Green | 2026-03-25 | Freeze | Skip | 16 commits; 1 CI workflow; low churn; already in archived category per guidance |
| jobs-projects | Dead | Red | N/A (no git) | Delete | Skip | No .git, no SSOT.md, not in projects.json; bare directory at workspace root with no clear purpose |
| knowledge-base | Active | Green | 2026-04-15 | Keep | B | 29 commits; 9 CI workflows; 15 Python scripts; not in projects.json |
| llmworks | Active | Green | 2026-04-16 | Keep | A | 43 commits; 7 CI workflows; SSOT 2026-03-09 |
| loopholelab | Active | Red | 2026-04-08 | Needs-work | D | SSOT.md exists but date field missing; 21 commits since 2024; not in projects.json |
| maglogic | Maintained | Green | 2026-03-25 | Freeze | D | 22 commits; 3 CI workflows; no recent active development |
| meatheadphysicist | Active | Green | 2026-04-17 | Keep | D | 54 commits; 12 CI workflows; SSOT 2026-03-09 |
| meshal-web | Active | Green | 2026-04-22 | Keep | A | 263 commits; 7 CI workflows; SSOT 2026-04-13; most recent commit in workspace |
| optiqap | Active | Green | 2026-04-18 | Keep | D | 97 commits; 9 CI workflows; SSOT 2026-04-10; duplicate slug in projects.json (featured + research) |
| provegate | Active | Red | 2026-04-04 | Needs-work | D | SSOT.md exists but date field missing; only 6 commits since 2024; static landing page |
| qmatsim | Maintained | Green | 2026-04-04 | Freeze | D | 16 commits; 4 CI workflows; research simulation repo, low churn |
| qmlab | Active | Green | 2026-04-16 | Keep | D | 36 commits; 9 CI workflows; SSOT 2026-03-09 |
| quantumalgo | Dead | Red | N/A (no git) | Archive | Skip | Has SSOT.md (2026-04-08) but no .git repo; no CI; never properly initialized |
| qubeml | Maintained | Green | 2026-04-04 | Freeze | D | 16 commits; 3 CI workflows; research ML repo, low churn |
| repz | Active | Green | 2026-04-16 | Keep | A | 66 commits; 17 CI workflows — highest CI coverage in workspace; SSOT 2026-03-09 |
| roka-oakland-hustle | Active | Red | 2026-04-04 | Needs-work | D | Zero CI workflows despite having .git; 3 commits since 2024; not in projects.json |
| scicomp | Maintained | Green | 2026-04-03 | Freeze | D | 41 commits; 3 CI workflows; research/computational science, low active churn |
| scribd | Active | Green | 2026-04-16 | Keep | A | 38 commits; 13 CI workflows; SSOT 2026-03-09 |
| simcore | Active | Green | 2026-04-19 | Keep | D | 48 commits; 10 CI workflows; SSOT 2026-03-09 |
| spincirc | Maintained | Green | 2026-03-25 | Freeze | D | 13 commits; 3 CI workflows; research repo, low churn |
| workspace-tools | Active | Green | 2026-04-17 | Keep | B | 41 commits; 5 CI workflows; 10 test files; not in projects.json |

**Legend:**
- Status: Active / Maintained / Planned / Archived / Dead
- Health: Green / Yellow / Red
- Disposition: Keep / Needs-work / Freeze / Archive / Delete
- Audit Tier: A (active products) / B (infrastructure) / C (governance) / D (research) / Skip

---

## Part 2 — Workspace-Level Findings

| Severity | Finding | Location | Recommended Action |
|----------|---------|----------|-------------------|
| Critical | Broken `$schema` reference: workspace root `projects.json` declares `"$schema": "./projects.schema.json"` but that file does not exist at workspace root (only in `alawein/` sub-repo) | `C:/…/alawein/projects.json` | Copy or symlink `projects.schema.json` to workspace root, or remove `$schema` field from workspace root copy |
| High | 6 infra/governance repos not tracked in `projects.json`: alawein, design-system, fallax, knowledge-base, roka-oakland-hustle, workspace-tools — invisible to all tooling reading the registry | `projects.json` | Add these repos as first-class entries; the registry cannot be authoritative without them |
| High | 2 non-existent slugs in `projects.json`: `mercor-llm-failsafe` (unknown, not on filesystem), `morphism` (lives in a different workspace root) | `projects.json` | Remove `mercor-llm-failsafe`; add note for `morphism` being a cross-workspace external ref or remove it |
| High | 3 repos have SSOT.md with missing date fields: adil, loopholelab, provegate — SSOT is present but unparseable by tooling | `adil/SSOT.md`, `loopholelab/SSOT.md`, `provegate/SSOT.md` | Add `ssot_last_verified` date field to each file |
| Medium | 3 duplicate slugs in `projects.json`: edfp, alembiq, optiqap each appear in both `featured` and `research` sections | `projects.json` | Resolve section membership — these repos should appear in one section, not both |
| Medium | 6 package entries in `projects.json` have no `slug` field — likely `@alawein/*` packages using a different identifier scheme | `projects.json` (packages section) | Add explicit slug or a `name` field to each package entry for tooling compatibility |
| Medium | `roka-oakland-hustle` has `.git` but zero CI workflows — the only active-development repo with no CI at all | `roka-oakland-hustle/.github/` | Add docs-doctrine.yml and at minimum a baseline CI workflow |
| Medium | `jobs-projects` is a bare directory at workspace root — no `.git`, no `SSOT.md`, not in `projects.json` | Workspace root | Determine purpose; if ephemeral, delete; if needed, initialize as a repo or document in governance |
| Medium | `quantumalgo` has `SSOT.md` (dated 2026-04-08) but no `.git` — inconsistent state for a workspace directory | Workspace root | Either initialize as a git repo or delete the directory; SSOT without git is meaningless |
| Low | `firebase-debug.log` sitting at workspace root — leftover artifact from a Firebase operation | Workspace root | Delete; workspace root has no `.gitignore` so this persists indefinitely via Dropbox sync |
| Low | Root `package.json` has `playwright` as a devDependency with no root-level test script using it | Workspace root `package.json` | Clarify purpose; if unused, remove to avoid confusion |
| Low | Workspace root has no `.gitignore` — any artifact dropped here persists indefinitely (Dropbox-synced, no git enforcement) | Workspace root | Not a git repo so `.gitignore` won't help; document in governance that workspace root accumulates artifacts |
| Low | All 32 repo changelogs have entries but zero have ISO date-stamped headers — changelog format is unparseable by any date-based tooling | All repos | Standardize changelog header format across the workspace; this is a workspace-wide convention gap |

---

## Part 3 — Infrastructure Health Snapshot

### design-system

22 npm packages, all public (npm publishable), all actively maintained.

| Package | Version | Notes |
|---------|---------|-------|
| @alawein/tokens | v0.2.0 | Core token contract; upstream dependency for all theme packages |
| @alawein/theme-base | v0.3.0 | Base theme layer; bumped post Wave B/C |
| @alawein/tailwind-preset | v0.3.0 | Tailwind integration layer |
| @alawein/ui | v0.1.2 | Slightly ahead of theme packages; minor version drift |
| @alawein/morphism-themes | v0.1.0 | Not yet bumped post Wave C |
| @alawein/icons | v0.1.0 | Initial release; no post-launch bump |
| @alawein/shared-utils | v0.1.0 | Initial release |
| @alawein/theme-brutalism | v0.1.0 | All 15 theme-* packages at v0.1.0 — no version drift among themes |
| @alawein/theme-cyberpunk | v0.1.0 | |
| @alawein/theme-edfp | v0.1.0 | |
| @alawein/theme-glassmorphism | v0.1.0 | |
| @alawein/theme-luxury | v0.1.0 | |
| @alawein/theme-menax-silkriver | v0.1.0 | |
| @alawein/theme-meshal-ai | v0.1.0 | |
| @alawein/theme-meshal-variants | v0.1.0 | |
| @alawein/theme-neon-arcade | v0.1.0 | |
| @alawein/theme-noir-scifi-pulp | v0.1.0 | |
| @alawein/theme-quantum | v0.1.0 | |
| @alawein/theme-retro-pixel | v0.1.0 | |
| @alawein/theme-strategic | v0.1.0 | |
| @alawein/theme-vintage-editorial | v0.1.0 | |
| @alawein/theme-whimsical | v0.1.0 | |

SSOT last-verified: 2026-04-08. Last commit: 2026-04-21. CI workflows: 8. Status: Green, no blocking issues.

### workspace-tools

- `workspace-batch` CLI: v0.1.0 (not yet bumped past initial release)
- Test files: 10 (good coverage for Python tooling)
- CI workflows: 5

| npm Package | Version | Notes |
|-------------|---------|-------|
| @alawein/standards | v1.0.0 | Only package at v1.x — version inconsistency with siblings |
| @alawein/eslint-config | v0.1.0 | Config packages moved here from design-system |
| @alawein/prettier-config | v0.1.0 | |
| @alawein/tsconfig | v0.1.0 | |

SSOT last-verified: 2026-04-15. Last commit: 2026-04-17. Status: Green, no blocking issues. `@alawein/standards` at v1.0.0 while the other three config packages are at v0.1.0 is a minor version inconsistency worth noting.

### knowledge-base

- App: Next.js 16.2.3, Tailwind ^4, version v0.1.0
- CI workflows: 9 (highest coverage of the three infra repos)
- Python scripts: 15

| Script | Last Modified | Notes |
|--------|--------------|-------|
| export-profile.py | 2026-04-21 | Most recently modified |
| generate_master_reference.py | 2026-04-17 | |
| scan_downloads.py | 2026-04-17 | |
| records.py | 2026-04-10 | |
| verify_repo.py | 2026-04-10 | |
| validate_records.py | 2026-04-08 | |
| validate-profile-manifest.py | 2026-04-08 | |
| clean-temp.sh | 2026-04-08 | |
| common.py | 2026-04-03 | Oldest group — not modified since consolidation |
| config_audit.py | 2026-04-03 | |
| config_sync.py | 2026-04-03 | |
| icf_pipeline.py | 2026-04-03 | |
| ingest_file.py | 2026-04-03 | |
| pkos.py | 2026-04-03 | |
| sync_profile_copy_notion.py | 2026-04-03 | |

SSOT last-verified: 2026-04-15. Last commit: 2026-04-15. Status: Green, no blocking issues.

---

## Part 4 — Governance Effectiveness

| Check | Coverage | Finding | Verdict |
|-------|----------|---------|---------|
| docs-doctrine CI workflow | 29/29 CI repos (100%) | Every repo that has CI also has docs-doctrine.yml; alawein has the source + reusable file | Pass |
| CI coverage across all repos | 29/32 repos (91%) | roka-oakland-hustle has .git but zero CI; jobs-projects and quantumalgo have no .git at all | Gap — 3 repos uncovered |
| SSOT.md presence | 31/32 repos | jobs-projects is the only repo with no SSOT.md; quantumalgo has SSOT but no .git | Gap — 1 missing, 1 mismatched |
| SSOT date field parseable | 28/31 repos with SSOT | adil, loopholelab, provegate have SSOT.md files but missing date fields — unparseable by tooling | Gap — 3 repos with bad dates |
| Changelog date stamps | 0/32 repos | All 32 repos have changelog entries but none have ISO date-stamped headers — format is not machine-parseable | Gap — workspace-wide convention gap |
| projects.json completeness | 26/32 repos tracked | 6 repos on disk missing from registry; 2 ghost slugs (mercor-llm-failsafe, morphism) in registry | Gap — registry does not match filesystem |
| projects.json slug uniqueness | Partial | edfp, alembiq, optiqap duplicated across sections; 6 package entries missing slug field | Gap — deduplication needed |
| github-baseline.yaml coverage | Unknown | alawein, design-system, workspace-tools, knowledge-base confirmed present; file truncated during read — remaining repo coverage not fully verified | Gap (provisional) — only 4/32 repos confirmed in read window; full baseline audit required |
| RepoReady deliverables | 0/5 present | repository-standardization-program.md, templates/, migration-checklist.template.md, repo-audit-scorecard.template.md, compliance-dashboard-schema.yaml — all missing from docs/governance/ | Gap — standardization program not yet started |
| Governance docs library | 51 docs in docs/governance/ | Covers CI, branching, credentials, release, deployment, skills, branding, workspace layout — comprehensive policy coverage | Pass |
| Validation script coverage | 7+ scripts in alawein/scripts/ | validate-doctrine.py, validate-doc-contract.sh, validate-catalog.py, validate-projects-json (.mjs + .py), validate-no-ai-attribution.py, github-baseline-audit.py all present | Pass |
| $schema reference integrity | Broken | Workspace root projects.json references ./projects.schema.json which does not exist at workspace root | Gap — broken schema reference |

---

## Summary: Reset Candidates

### Repos recommended for Archive or Delete

- **jobs-projects** — Delete: bare directory with no `.git`, no SSOT.md, not in projects.json, unknown purpose; no evidence of value.
- **quantumalgo** — Archive: has SSOT.md but no `.git` and no CI; was never properly initialized as a git repo; retain SSOT for reference but flag as non-functional.

### Repos recommended for Freeze

- **fallax** — Complete research/experiment with static landing page; 49 commits of finished work; no active development needed; keep public.
- **helios** — Intentionally low-churn; only 16 commits, 1 CI workflow; already treated as archived category per guidance.
- **maglogic** — 22 commits, last commit 2026-03-25, no recent active development signal.
- **qmatsim** — Research simulation repo, 16 commits, low churn; complete as a reference artifact.
- **qubeml** — Research ML repo, 16 commits; last commit 2026-04-04; no active development trajectory.
- **scicomp** — Computational science research, 41 commits; last commit 2026-04-03; low active churn.
- **spincirc** — 13 commits; last commit 2026-03-25; research repo with no active development.

### Repos with Red health requiring attention

- **adil** — SSOT.md exists but date field is missing; tooling cannot parse health status; fix the date field.
- **loopholelab** — SSOT.md exists but date field is missing; same root cause as adil; fix the date field.
- **provegate** — SSOT.md exists but date field is missing; only 6 commits since 2024; fix date field and evaluate activity level.
- **roka-oakland-hustle** — Zero CI workflows despite being an active git repo with TypeScript package; needs docs-doctrine.yml and baseline CI at minimum.
- **jobs-projects** — No git, no SSOT, no CI; recommended for deletion (see above).
- **quantumalgo** — No git despite having SSOT.md; recommended for archive (see above).

### Audit tier assignments

- **Spec A (active products):** bolts, repz, gymboy, scribd, llmworks, meshal-web, attributa, atelier-rounaq
- **Spec B (infrastructure):** design-system, workspace-tools, knowledge-base
- **Spec C (governance):** alawein
- **Spec D (research/other):** adil, alembiq, chshlab, edfp, fallax, loopholelab, maglogic, meatheadphysicist, optiqap, provegate, qmatsim, qmlab, qubeml, roka-oakland-hustle, scicomp, simcore, spincirc
- **Skip (no audit):** helios, jobs-projects, quantumalgo — helios is intentionally low-churn with no pending audit work (Disposition: Freeze), jobs-projects is a non-git directory with unknown purpose, quantumalgo has no git repo
