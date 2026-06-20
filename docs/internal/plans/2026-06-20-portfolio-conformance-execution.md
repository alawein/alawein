# Portfolio Conformance Execution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the accepted rows of the conformance map — re-bucket Attributa and LLMWorks, retype Provegate and Adil, relocate Helios to `_archive/`, and declutter three uncatalogued `tools/` directories — keeping the catalog, README headers, and validators in lockstep.

**Architecture:** Each change is a local filesystem action plus a `catalog/repos.json` edit (committed to the hub repo) and, for bucket moves, the moved repo's README header (committed to that repo). The catalog is regenerated with `build-catalog.py` and gated by `validate-catalog.py --strict` and `validate-repo-framework.py`. The validators are the test cycle: a change is "done" when they pass.

**Tech Stack:** Python (catalog/doctrine scripts), git, gh CLI.

## Global Constraints

- **Doctrine is fixed.** Conformance only; no bucket splits/merges/renames.
- **Assumed decisions (flip before executing if wrong).** Attributa -> `ventures/` (keep `type: product`); LLMWorks -> `ventures/` (keep `type: product`); Provegate retype `research` -> `tooling` (stays `ventures/`); Adil retype `research` -> `tooling` (stays `ventures/`). Source: `docs/internal/specs/2026-06-19-portfolio-conformance-map-design.md`.
- **Never hand-edit generated `projects.json`.** Always run `python scripts/catalog/build-catalog.py` then `python scripts/catalog/validate-catalog.py --strict`.
- **README header is plain markdown** (no YAML frontmatter): `Status / Category / Owner / Visibility / Purpose / Next action`.
- **Branch + PR per repo.** No direct commits to `main`; stage explicit paths only (no `git add -A`).
- **Archive procedure** (Helios): `gh repo archive`, move to `_archive/<YYYY-MM>-<repo>/`, `status: archived` + `archivedDate`, README `Status: archived`, `Category: archive`, `Next action: delete`.

---

### Task 0: Restore a working hub checkout (prerequisite)

**Why:** the local `alawein/alawein` working copy has a broken `.git` (no `HEAD`/`config`); catalog regeneration, validation, and commits cannot run there. See memory `reference-alawein-hub-no-local-git`.

**Files:** none created; this restores tooling.

- [ ] **Step 1: Clone a clean hub checkout**

```bash
git clone https://github.com/alawein/alawein.git ~/alawein-hub
cd ~/alawein-hub
```

- [ ] **Step 2: Establish a green baseline**

Run: `python scripts/catalog/validate-catalog.py --strict`
Expected: exit 0, no schema errors. If it fails, stop — the baseline is not clean and later diffs will be ambiguous.

- [ ] **Step 3: Confirm the doctrine validator runs**

Run: `python scripts/doctrine/validate-repo-framework.py --root "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein"`
Expected: exit 0 against the current workspace (pre-change baseline).

---

### Task 1: Re-bucket Attributa (`tools/` -> `ventures/`)

**Files:**
- Modify (hub): `catalog/repos.json` — the `attributa` entry
- Modify (attributa repo): `README.md` header
- Move (workspace): `tools/attributa/` -> `ventures/attributa/`

**Interfaces:**
- Consumes: green baseline from Task 0.
- Produces: catalog `attributa` at `bucket: ventures`, `local_path: ventures/attributa`; physical dir at `ventures/attributa`; README `Category: ventures`.

- [ ] **Step 1: Edit the catalog entry**

In `catalog/repos.json`, the `attributa` entry: change `"bucket": "tools"` -> `"bucket": "ventures"` and `"local_path": "tools/attributa"` -> `"local_path": "ventures/attributa"`. Leave `type: product`.

- [ ] **Step 2: Regenerate and validate (expect pass)**

Run: `python scripts/catalog/build-catalog.py && python scripts/catalog/validate-catalog.py --strict`
Expected: exit 0; `projects.json` regenerated with attributa under ventures.

- [ ] **Step 3: Update the attributa README header**

In the `attributa` repo `README.md`, change the header line `Category:    tools` -> `Category:    ventures`. Commit on a branch in that repo:

```bash
cd <workspace>/tools/attributa
git checkout -b chore/recategorize-ventures
git add README.md
git commit -m "Recategorize Attributa to ventures bucket"
git push -u origin chore/recategorize-ventures
gh pr create --fill
```

- [ ] **Step 4: Move the directory in the workspace**

```bash
cd <workspace>
mv tools/attributa ventures/attributa
```

- [ ] **Step 5: Run the doctrine validator (expect pass)**

Run: `python ~/alawein-hub/scripts/doctrine/validate-repo-framework.py --root "<workspace>"`
Expected: exit 0 — catalog bucket, physical path, and README `Category` now agree for attributa.

- [ ] **Step 6: Commit the catalog change to the hub (branch + PR)**

```bash
cd ~/alawein-hub
git checkout -b chore/rebucket-attributa
git add catalog/repos.json catalog/generated projects.json
git commit -m "Re-bucket Attributa from tools to ventures"
git push -u origin chore/rebucket-attributa
gh pr create --fill
```

---

### Task 2: Re-bucket LLMWorks (`tools/` -> `ventures/`)

Identical shape to Task 1 for the `llmworks` entry. Repeat every step with these substitutions: catalog `llmworks` `bucket` `tools` -> `ventures`, `local_path` `tools/llmworks` -> `ventures/llmworks`; README `Category: tools` -> `ventures`; `mv tools/llmworks ventures/llmworks`; hub branch `chore/rebucket-llmworks`; repo branch `chore/recategorize-ventures`.

- [ ] **Step 1: Edit catalog `llmworks` (`bucket` + `local_path` to ventures)**
- [ ] **Step 2: `python scripts/catalog/build-catalog.py && python scripts/catalog/validate-catalog.py --strict`** — expect exit 0
- [ ] **Step 3: LLMWorks README `Category: ventures`; branch + PR in the llmworks repo**
- [ ] **Step 4: `mv tools/llmworks ventures/llmworks`**
- [ ] **Step 5: `validate-repo-framework.py --root <workspace>`** — expect exit 0
- [ ] **Step 6: Hub branch `chore/rebucket-llmworks`, commit `catalog/repos.json` + generated, PR**

---

### Task 3: Retype Provegate (`research` -> `tooling`)

**Files:** Modify (hub) `catalog/repos.json` — `provegate` entry only. No move, no README change (`Category` tracks bucket, which is unchanged at `ventures`).

- [ ] **Step 1: Edit the catalog entry**

In `catalog/repos.json`, `provegate`: change `"type": "research"` -> `"type": "tooling"`.

- [ ] **Step 2: Regenerate and validate (expect pass)**

Run: `python scripts/catalog/build-catalog.py && python scripts/catalog/validate-catalog.py --strict`
Expected: exit 0 (`tooling` is in the taxonomy `type` axis).

- [ ] **Step 3: Commit to the hub (branch + PR)**

```bash
git checkout -b chore/retype-provegate
git add catalog/repos.json catalog/generated projects.json
git commit -m "Retype Provegate from research to tooling"
git push -u origin chore/retype-provegate && gh pr create --fill
```

---

### Task 4: Retype Adil (`research` -> `tooling`)

Identical to Task 3 for the `adil` entry. Hub branch `chore/retype-adil`.

- [ ] **Step 1: Edit catalog `adil` `type` `research` -> `tooling`**
- [ ] **Step 2: `python scripts/catalog/build-catalog.py && python scripts/catalog/validate-catalog.py --strict`** — expect exit 0
- [ ] **Step 3: Hub branch `chore/retype-adil`, commit, PR with `git commit -m "Retype Adil from research to tooling"`**

---

### Task 5: Relocate Helios to `_archive/`

**Files:**
- GitHub: archive the `alawein/helios` repo
- Move (workspace): `research/helios/` -> `_archive/2026-06-helios/`
- Modify (helios repo): `README.md` header
- Modify (hub): `catalog/repos.json` — `helios` entry

**Interfaces:** Consumes baseline. Produces helios out of `research/`, header consistent with `archived`.

- [ ] **Step 1: Archive on GitHub (idempotent)**

```bash
gh repo view alawein/helios --json isArchived -q .isArchived   # check first
gh repo archive alawein/helios --yes                            # if not already archived
```

- [ ] **Step 2: Fix the helios README header**

In the helios repo `README.md`: `Category:    research` -> `Category:    archive`, and `Next action: continue` -> `Next action: delete` (`Status: archived` is already correct). Commit on a branch + PR in the helios repo (note: pushing to an archived repo requires unarchiving or doing this edit before Step 1; if already archived, edit via the GitHub web UI or temporarily unarchive).

- [ ] **Step 3: Move the directory**

```bash
cd <workspace>
mv research/helios _archive/2026-06-helios
```

- [ ] **Step 4: Update the catalog entry**

In `catalog/repos.json`, `helios`: set `"local_path": "_archive/2026-06-helios"`, `"bucket": "archive"`, add `"archivedDate": "2026-06-20"` (keep `status: archived`).

- [ ] **Step 5: Regenerate, validate, and run the doctrine validator (expect pass)**

Run: `python scripts/catalog/build-catalog.py && python scripts/catalog/validate-catalog.py --strict && python scripts/doctrine/validate-repo-framework.py --root "<workspace>"`
Expected: exit 0; helios no longer evaluated as a live `research/` repo.

- [ ] **Step 6: Commit the catalog change to the hub (branch + PR)**

```bash
git checkout -b chore/archive-helios
git add catalog/repos.json catalog/generated projects.json
git commit -m "Relocate Helios to _archive and align archived metadata"
git push -u origin chore/archive-helios && gh pr create --fill
```

---

### Task 6: Declutter uncatalogued `tools/` directories

**Why:** `tools/claude-templates`, `tools/inventory`, `tools/packages` have no git remote and no catalog entry; they break the "every bucket dir is a tracked repo" invariant. No catalog change (they are not catalogued); this is local hygiene plus, where content is worth keeping, a fold-in PR.

- [ ] **Step 1: Triage each directory**

```bash
cd <workspace>/tools
ls claude-templates inventory packages
```

Decide per the spec: `claude-templates` (prompt/template assets) -> fold into the `prompty` or `knowledge-base` repo; `inventory` (the `/inventory` skill output + CLI) -> move under `$INVENTORY_OUTPUT_ROOT`; `packages` (local `@alawein` npm mirror) -> move out of the bucket tree.

- [ ] **Step 2: Fold `claude-templates` assets into a repo (if kept)**

If the two `.jsx` files are worth keeping, add them to the `prompty` repo under an `examples/` path on a branch + PR; otherwise move the directory to `_archive/2026-06-claude-templates/`.

- [ ] **Step 3: Relocate `inventory` and `packages` out of `tools/`**

```bash
mv tools/inventory "$INVENTORY_OUTPUT_ROOT/inventory" 2>/dev/null || mv tools/inventory ../_archive/2026-06-inventory
mv tools/packages ../_archive/2026-06-packages
```

- [ ] **Step 4: Confirm `tools/` now contains only catalogued repos**

Run: `python ~/alawein-hub/scripts/doctrine/validate-repo-framework.py --root "<workspace>"`
Expected: exit 0; no stray non-repo directories flagged under `tools/`.

---

### Task 7: Final verification

- [ ] **Step 1: Full catalog + doctrine sweep (expect all green)**

Run: `cd ~/alawein-hub && python scripts/catalog/build-catalog.py --check && python scripts/catalog/validate-catalog.py --strict && python scripts/doctrine/validate-repo-framework.py --root "<workspace>"`
Expected: all exit 0. `build-catalog.py --check` confirms generated files are in sync (no uncommitted regeneration drift).

- [ ] **Step 2: Confirm the squash deltas**

For each hub PR, `git diff origin/main...<branch>` should show only the intended catalog + generated changes. A stray file means the regeneration pulled in more than expected.

- [ ] **Step 3: Merge order**

Merge the per-repo README PRs (attributa, llmworks, helios) and the hub catalog PRs together-ish, then re-run Step 1 against `origin/main` to confirm the merged state is green.

## Self-Review notes

- Every spec action row maps to a task: Attributa (T1), LLMWorks (T2), Provegate (T3), Adil (T4), Helios (T5), declutter x3 (T6). Keep-as-is rows (meatheadphysicist, Fallax, Loophole Lab) and the Scribd naming flag are intentionally not executed (advisory).
- The two open decisions are pinned as Global Constraints assumptions; flipping Attributa/LLMWorks to `products/` changes only the `bucket`/`Category` values, not the task shape. Flipping Provegate/Adil to a `tools/` move converts T3/T4 from retype-only into the T1 move shape.
