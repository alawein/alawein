---
type: canonical
source: none
sync: none
sla: none
authority: observed
last-updated: 2026-03-26
audience: [ai-agents, contributors, future-self]
---

# LESSONS — alawein (Organization Repository)

> Observed patterns only. Minimal initial entry — update as lessons accumulate.

## Patterns That Work

- **One canonical prompt prevents policy drift**: Anchoring org governance to `docs/governance/workspace-master-prompt.md` keeps workspace naming and migration rules stable.
- **Frontmatter for all governance docs**: Using YAML frontmatter with `type`, `authority`, and `audience` fields makes doc classification unambiguous across 20+ repos.
- **Documented GitHub-file exceptions**: Calling out `README.md` and `.github` templates as explicit contract exemptions prevents fake compliance work that would damage GitHub rendering or template behavior.
- **Alias notation should be transitional and short-lived**: use `canonical-name (repo: physical-slug)` only while canonical and physical differ, then remove it immediately after cutover.
- **Generated sections must be treated as code**: Keeping `projects.json` and README sync markers in lockstep avoids silent data drift in org profile content.
- **Path-scoped stash before branch recovery**: Stashing only the unrelated files and then restoring them onto a dedicated branch keeps `main` clean without losing intentional notebook or asset work.
- **Workflow docs split by decision point**: Contributors find the right answer faster when operating-model, Git mechanics, review, merge, and release guidance are separate documents instead of one overloaded handbook.
- **Git hygiene separated from merge and review policy**: Stash cleanup, push rules, and branch recovery are operational mechanics, while review quality and merge approval are policy decisions and should not be collapsed into one guide.
- **Explicit stash and branch-recovery patterns**: The same recovery questions recur often enough that the docs should explain `apply`, `pop`, `drop`, and path-scoped stash usage in plain language.
- **One canonical home per shared resource class**: Workspace migrations stay tractable when governance, shared packages, and cross-repo guides each have a single documented owner instead of overlapping repos.
- **Archive-before-delete is safer in dirty multi-repo workspaces**: Converting a legacy repo to explicit archival mode first preserves traceability while avoiding accidental data loss before physical retirement cutover.
- **Retirement cutovers need explicit completion metadata**: Recording exact completion dates in SSOT and migration matrices prevents indefinite “pending” states after a structural migration is actually done.
- **Standards need an audit companion**: A stack-aware layout rule is much easier to apply when there is a repo-by-repo audit showing which repos are aligned, mixed, or intentionally exceptional.
- **Compare branch vs main before squash-merge**: Long-lived local branches that predate large mainline commits can show a diff that mostly deletes current work; squash-merging them is effectively a rollback. Check `git diff --stat main <branch>` first; cherry-pick or abandon.
- **Doc contract and markdownlint are two gates**: `validate-doc-contract.sh` can pass while `markdownlint-cli` still fails on emphasis, list numbering, or tables—run both (or rely on CI) before calling the branch done.
- **Repo-local links in markdown**: CI validates targets inside the checked-out repo only; sibling dirs such as `_workspace/` and `_ops/` are outside this clone—describe them in prose or backticks, not as clickable repo-relative markdown links.
- **Close-out is commit + push + merge**: IDE/LLM sessions that stop at “looks good” strand work on disk; the task is not done until `git status` is clean and intended commits are on the remote (and merged per policy). Narrative: [`docs/audits/ide-llm-agent-completion-lessons-2026-03.md`](docs/audits/ide-llm-agent-completion-lessons-2026-03.md).
- **Resume/product URLs in showcase**: Org README project cards should link to **live sites or case-study URLs** in `projects.json` (`url`); `sync-readme.py` must prefer that field over inferred GitHub links so the grid matches resume and meshal surfaces.

## Anti-Patterns

- **Treating this repo as a code repo**: It is a documentation and governance repo; applying build/test tooling expectations here causes confusion.
- **Unscoped legacy-name usage**: Legacy names outside explicit alias contexts create ambiguity and break canonical-name audits.
- **Assuming build artifacts exist**: CI contracts should never require `npm ci`, `npm run build`, or `dist/` unless the repo actually contains a package manifest and build surface.
- **Using `_token` as markdown emphasis**: Tokens like `_pkos` parse as italics and break MD037/MD049; use backticks.
- **Assuming old local branches mean unmerged work**: Empty `main..branch` means nothing to merge from that tip; a large diff where `main` has additions and the branch “removes” current files usually means the branch is **stale**—do not squash-merge without comparing to `main` first.

## Pitfalls

- **Stale `last_updated` fields**: Frontmatter dates drift quickly when files are edited without updating metadata; enforce as part of any PR checklist.
- **Adding project-specific content**: This repo covers the whole org; project-scoped lessons belong in the individual project repos.
- **Dropping a stash too early**: A stash is only safe to delete after the work is restored elsewhere or confirmed to be obsolete.
- **Editing synced README blocks manually**: Changes inside `SYNC:*` regions will be overwritten by `scripts/sync-readme.py` if `projects.json` is not updated.
- **Uncommitted “small” edits** (e.g. workflow pin bumps): Still invisible to GitHub and CI until committed; always end with `git status`.

---

## Structural Debt Catalog (Normalization Audit 2026-03-26)

Comprehensive catalog of structural issues found during the workspace-wide normalization audit. These are systemic patterns, not one-off bugs — they recur across repos and accumulate silently.

### The Core Problem

Per-file governance without a governing theory for the files themselves. The workspace has 28+ repos, each with 8+ governance files, validated by scripts that encode explicit file paths. But there is no formal doctrine for:
- What's canonical vs what's derived
- Which docs sync from where
- What's allowed to be stale vs what must be fresh
- Naming conventions for governance files and directories
- Where generated artifacts go vs authored content

This is the markdown equivalent of a database without normal forms.

### Structural Debt Patterns Found

**1. Phantom directory references**
- `INDEX.md` listed `ops/`, `_scripts/`, `imports/` as workspace-root directories — none existed.
- Root cause: directories were planned or deleted but docs weren't updated.
- Impact: agents and humans navigating via INDEX.md hit dead ends.
- Fix applied: removed phantom refs from INDEX.md and CLAUDE.md.
- Prevention: validation script should assert that referenced directories exist (not just files).

**2. Backup files as zombie dependencies**
- `CONTRIBUTING-backup-20250807.md` was wired into: CI lint workflows (ci.yml, docs-validation.yml), validation scripts (validate-doc-contract.sh), CLAUDE.md Required Files list, documentation-contract.md managed docs table, workspace-audit.yml required files check, CONTRIBUTING.md example commands — 12+ references total.
- The file's own content said “use CONTRIBUTING.md instead.”
- Root cause: adding a “temporary” file to validation/CI creates binding commitments.
- Fix applied: deleted file + updated all 8 referencing files.
- Prevention: never add backup/temporary files to Required Files lists or CI paths. If a file needs to exist for CI, it's not temporary.

**3. Dual-source drift**
- `docs/workspace-INDEX.md` mirrored root `INDEX.md` — both went stale in the exact same way (same phantom dirs, same renamed repos).
- Root cause: two copies of the same information with manual sync (“keep in sync with ../INDEX.md”).
- Fix applied: deleted the mirror, kept only root INDEX.md.
- Prevention: one canonical source per piece of information. If a copy is needed, generate it via script (like `sync-readme.py` does for README).

**4. Config format duplication**
- `.prettierrc` (JSON) and `prettier.config.js` (JS module) coexisted with identical settings.
- Also found in `meshal-web/` (same pattern).
- Root cause: different tools or sessions prefer different config formats; nobody deletes the old one.
- Fix applied: deleted `.prettierrc`, kept `.js` form.
- Prevention: pick one format per tool workspace-wide and enforce it.

**5. Theater workflows**
- `reusable-policy.yml` referenced `.metaHub/policies` directory that never existed in the repo. The workflow would always fail or do nothing.
- All 4 reusable workflows (`reusable-node-ci.yml`, `reusable-python-ci.yml`, `reusable-security.yml`, `reusable-visual-audit.yml`) had zero callers anywhere on GitHub.
- Root cause: aspirational infrastructure created ahead of consumers, then never connected.
- Fix applied: deleted `reusable-policy.yml`. Other 4 flagged for rebuild with standard naming.
- Prevention: reusable workflows need at least one caller before merging. Audit periodically with `gh search code`.

**6. Orphaned root files**
- Workspace root `CHANGELOG.md`: about the design system, but `_devkit/` has its own changelog. Not tracked by any git repo (workspace root is not a repo).
- `firebase-debug.log`: one-line debug artifact from a one-time Firebase CLI invocation (2026-03-23).
- `.venv/`: full Python venv (~50MB) at workspace root with no `.gitignore` or documentation.
- Root cause: workspace root has no version control hygiene — files accumulate indefinitely.
- Fix applied: all deleted.
- Prevention: workspace root needs a documented policy of what's allowed there. Consider a `.gitignore`-like manifest even though it's not a repo.

**7. Mislocated governance docs**
- `DOCUMENTATION_PHILOSOPHY.md` at repo root instead of `docs/governance/` where all other governance docs live.
- `docs/technical-debt-report-20260311.md` at `docs/` root instead of `docs/audits/` alongside 12 other audit reports.
- Root cause: new files get created “here” during a session and never moved to their canonical home.
- Fix applied: both moved to correct directories + all 8 path references updated.
- Prevention: new governance docs go directly to their canonical directory. Don't stage at root “temporarily.”

**8. Generated artifacts tracked in git**
- `docs/dashboard/snapshots/`: 8 JSON files accumulating, each ~50KB. Generated by `github-dashboard-sync.yml` workflow.
- `meshal-web/output/`: Playwright log files tracked in git.
- Root cause: no `.gitignore` rules for generated output directories.
- Status: flagged — needs gitignore rules added.

**9. Stale SSOT registry**
- `projects.json` still references `alawein/handshake-hai` as the repo URL for what is now `_eval/`.
- INDEX.md had 3 stale repo names: `_handshake-hai/` (now `_eval/`), `handshake-project-proctor/` (folded into `_eval/packages/proctor`), `_mercor-llm-failsafe/` (actual name: `mercor-llm-failsafe/`).
- Root cause: renames happen faster than registry updates.
- Fix applied: INDEX.md corrected. `projects.json` still needs update (different repo's data).
- Prevention: rename workflows should include registry update as a required step, not a follow-up.

### Cross-Repo Structural Debt (Workspace-Wide Scan)

Scanned `_devkit`, `_eval`, `meshal-web`, `bolts`, `attributa`, `mercor-llm-failsafe`:

| Pattern | Repos Affected | Severity |
|---------|---------------|----------|
| **Dual CLAUDE.md** (root + `.claude/CLAUDE.md`) | _devkit, meshal-web, bolts, attributa, mercor-llm-failsafe | Medium — by design (root = authoritative, `.claude/` = governance template), but creates confusion about which to edit |
| **Empty directories tracked in git** | _eval (4), meshal-web (5), mercor-llm-failsafe (2) | Low — usually from scaffolding that was never populated |
| **Tracked log files** | meshal-web (`output/playwright-*.log`) | Medium — grows repo size, pollutes diffs |
| **Config duplication** | meshal-web (prettier) | Low — same as alawein pattern |
| **No backup file proliferation** | All 6 clean | Good — the `CONTRIBUTING-backup` pattern was isolated to `alawein/` |

### Agentic Workflow Patterns

Lessons from autonomous agent sessions operating on this workspace:

**1. Move = grep + edit cascade**
Agent sessions that move files without grepping references first break CI. Standard operating procedure: `grep -r “FILENAME”` across the entire repo before any `git mv`. In this audit, moving `DOCUMENTATION_PHILOSOPHY.md` required updating 8 files; deleting `CONTRIBUTING-backup` required updating 8 more.

**2. Required Files lists are contracts, not inventories**
Adding a file to Required Files in CLAUDE.md, documentation-contract.md, or `validate-doc-contract.sh` creates a hard dependency. Removing the file later requires updating every consumer. Treat additions as binding commitments with known blast radius.

**3. Validation scripts encode invisible constraints**
`validate-doc-contract.sh` has hardcoded file lists (`MANAGED_ROOT_DOCS`, `allowed_root`). These constraints only surface when you try to move or delete what they reference. Before any structural change, read the validation script.

**4. CI workflows are the source of truth**
Workflow YAML files contain the actual truth about which files are linted, checked, and validated. CLAUDE.md and CONTRIBUTING.md may describe different lists. When they conflict, the workflow wins — update the docs to match, not the other way.

**5. Agents create files at workspace root**
The workspace root is not a repo, so files created there (session plans, venvs, debug logs) persist indefinitely with no version control to notice them. Agents should avoid creating files at workspace root unless explicitly instructed. Workspace-root `docs/superpowers/plans/` was an example — session artifacts placed outside any repo.

**6. CRLF warnings are cosmetic on Windows**
`.editorconfig` says LF but Git on Windows with `core.autocrlf` converts. Agents should not chase these warnings — they're informational unless the repo has a strict `.gitattributes` rule. Don't let them derail a session.

**7. Reusable workflow naming convention**
GitHub convention is domain-prefix (`ci-node.yml`) not purpose-prefix (`reusable-node-ci.yml`). When rebuilding, use: `ci-node.yml`, `ci-python.yml`, `ci-security.yml`, `ci-visual.yml`.

**8. Cross-repo operations from workspace root**
Running `git status` from workspace root returns nothing (no repo). Each `git` command must be run from inside the specific repo directory. Agents get confused by this when the CWD is workspace root.

### Remaining TODOs (Normalization Phase)

Bookmarked 2026-03-26. These items require user decisions before proceeding:

- [ ] **Docs doctrine**: Establish formal conventions for naming, canonical vs derived docs, kernelization, and syncing across 28+ repos
- [ ] **Rebuild reusable workflows**: Rebuild with standard `ci-*` naming and at least one caller each
- [x] ~~**Delete `.branch-protection-with-ci.json`**~~: Done 2026-03-26
- [x] ~~**Gitignore dashboard snapshots**~~: Done 2026-03-26 — added to `.gitignore`, untracked 8 JSON files
- [x] ~~**Update `projects.json`**~~: No change needed — GitHub remote is still `handshake-hai`, `projects.json` is correct
- [x] ~~**Fix meshal-web tracked logs**~~: Done 2026-03-26 — added `output/` to `.gitignore`
- [x] ~~**Fix empty directories**~~: Done 2026-03-26 — cleaned 11 empty dirs across `_eval`, `meshal-web`, `mercor-llm-failsafe`
- [x] ~~**Delete orphaned reusable workflows**~~: Done 2026-03-26 — deleted all 4
- [ ] **Workspace root policy**: Document what's allowed at workspace root (currently: `INDEX.md`, `CLAUDE.md`, `README.md`, `package.json` — nothing else)
- [ ] **Dual CLAUDE.md clarification**: Document the dual-file pattern (root = authoritative, `.claude/CLAUDE.md` = governance template) in the docs doctrine so agents know which to edit
