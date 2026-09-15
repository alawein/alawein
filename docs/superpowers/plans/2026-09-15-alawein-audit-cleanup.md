# alawein/alawein Audit Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Contain the verified public Supabase credential leak (F001), then harden scanner/Actions settings and correct station drift, without silently resolving open MAIOS decisions.

**Architecture:** Owner-gated Batch A rotates provider credentials first (no history rewrite). Later batches are reversible Settings/code hygiene plus three read-only reconciliations (repo count, dual MAIOS canons, `task-sync.mjs`) that must finish before any catalog merge or chat-canon commit. Doctor/G7 work is out of scope for this plan.

**Tech Stack:** GitHub Settings + secret-scanning alerts API (metadata only), Supabase dashboard (owner), Python catalog compilers already in-repo (`scripts/catalog/build-catalog.py`, `scripts/catalog/compile_index.py`), existing doctrine validators, pytest under `scripts/tests/`.

**Source reconciliation:** `Downloads/RECONCILIATION-AND-PLAN.md`, `Downloads/findings-annotated.csv`, `Downloads/audit-report.md` @ HEAD `a9fb588cda983b08a33570cdf80c2f225abd2bae`.

## Global Constraints

- Station only: `alawein/alawein` (local tree under `core/alawein` when using the solo monorepo checkout). Do not touch `kohyr/kohyr` product code or create a second control plane.
- **Batch A is hard-gated.** Exact owner line required before any rotation work: `Approve: rotate supabase credentials F001`. Silence is not approval.
- Never print secret values, never open alert payload blobs, never paste keys into chat, plans, commits, or fixtures. Metadata only (`number`, `state`, `secret_type`, `created_at`, path if present).
- History rewrite / `git filter-repo` / force-push to purge historic blobs is **out of Batch A** and needs a separate irreversible approval later.
- Do not merge `CATALOG-DELTA.yaml` into `catalog/index.yaml` (`ADR-2026-PENDING-02` stays open) until Task 5 (repo-count check) completes and the owner stamps a decision.
- Do not commit this chat's Bible/canon pack into `docs/governance/` until Task 6 (dual-canon read) completes and the owner stamps a disposition.
- Do not flip repo visibility, archive/delete remotes, provision Supabase/DB, or execute absorb batches.
- Do not mark `ADR-2026-PENDING-06` accepted/rejected until Task 7 reads current `task-sync.mjs` write behavior.
- Append-only to `docs/governance/decision-register.md` when that file exists in-station; until then, propose ADR text in the PR description / a new dated note only after owner asks to land canon.
- Prefer regenerate-from-source over hand-editing generated views (`architecture.md`, `repos.json`, README SYNC blocks).
- American spelling. Evidence tiers: VERIFIED / SELF-REPORTED / UNKNOWN.

## File Structure

| Path | Responsibility |
|---|---|
| (no new secret files) | Rotation happens in Supabase + GitHub UI; agents never store rotated values |
| `.github/CODEOWNERS` | Path corrections only (F004) |
| `docs/architecture.md` | Regenerated diagram/counts (F005) |
| `SSOT.md`, `DEBT.md`, `catalog/kernel.yaml` | Citation / debt / tag claim refresh (F005) |
| GitHub Settings → Actions / Code scanning | F002–F003 (no local file unless config YAML exists) |
| `docs/superpowers/plans/2026-09-15-alawein-audit-cleanup.md` | This plan |
| `docs/superpowers/plans/2026-09-15-audit-batch-e-evidence.md` | Read-only evidence notes for Tasks 5–7 (create during Batch E) |
| Existing `scripts/catalog/*` | Compile/validate only if a later approved task regenerates catalog views; **no index.yaml merge in this plan** |

---

### Task 1: Batch A — Credential containment (F001) [OWNER-GATED]

**Files:**
- No repo file creates for rotation itself
- Optional later (separate approval): history purge PR/runbook — not this task
- Evidence note only after rotation: append to `docs/superpowers/plans/2026-09-15-audit-batch-e-evidence.md` §F001 (no secret values)

**Interfaces:**
- Consumes: GitHub secret-scanning alert metadata already verified 2026-09-15: alert `#1` `supabase_service_key` (open since ~2025-12-06), alert `#2` `supabase_personal_access_token` (open since ~2026-04-16)
- Produces: owner confirmation both credentials rotated; alerts closed or marked resolved per GitHub UI; blast-radius note naming which Supabase project(s) were affected (names only)

**Gate (do not skip):**

- [ ] **Step 1: Confirm exact approval line is present in chat**

Required text (verbatim intent):

```text
Approve: rotate supabase credentials F001
```

If absent: stop. Post escalate card only. Do not open Supabase. Do not rotate.

- [ ] **Step 2: Identify affected Supabase project(s) without reading secret values**

Owner actions (human):
1. Open GitHub → `alawein/alawein` → Security → Secret scanning alerts → alert 1 and 2.
2. Note **project/org name hints from path/context only** (historic paths under `organizations/repz-llc/...` per audit). Do not copy key material.
3. In Supabase dashboard, locate the project(s) those historic scripts targeted. If uncertain which project, list candidates and stop for a second narrow approval naming the project id/slug.

- [ ] **Step 3: Rotate service_role key first**

Owner actions:
1. Supabase → Project Settings → API → reset/rotate `service_role`.
2. Update every live consumer that still needs it (CI secrets, local `op` refs, Railway/Vercel if any) **out of band**. Prefer 1Password refs; never commit the new value.
3. Confirm old key no longer authenticates (dashboard shows rotation time).

- [ ] **Step 4: Rotate the Supabase PAT**

Owner actions:
1. Revoke the exposed personal access token in Supabase account tokens UI.
2. Issue a replacement only if something still requires a PAT; otherwise leave revoked with no replacement.
3. Update consumers the same way as Step 3.

- [ ] **Step 5: Close or resolve GitHub alerts (metadata only)**

```bash
# Metadata check only — never use --jq to print secret or plaintext fields
gh api repos/alawein/alawein/secret-scanning/alerts --jq '[.[] | {number, state, secret_type, created_at}]'
```

Expected after owner closes in UI: both alerts `state` is not `open` (e.g. `resolved`), or documented why GitHub still shows open until history purge (acceptable interim if rotation is done and noted).

- [ ] **Step 6: Record evidence (no secrets)**

Create/append `docs/superpowers/plans/2026-09-15-audit-batch-e-evidence.md`:

```markdown
## F001 rotation receipt
Date:
Approver line: Approve: rotate supabase credentials F001
Alert 1: supabase_service_key — rotated: yes/no — alert state:
Alert 2: supabase_personal_access_token — rotated: yes/no — alert state:
Supabase project slug(s) affected:
Consumers updated (names only):
History purge: NOT DONE (needs separate approval)
ADR-20260915-07: evidence upgraded to VERIFIED-live; superseding ADR text not stamped in this task
```

- [ ] **Step 7: Stop**

Do not start Batch B–F in the same session unless the owner explicitly says to continue after reviewing this plan.

**Acceptance:** Both credentials rotated or explicitly confirmed already dead + revoked; no secret values in git/chat; history still unre-written; F001 recommendation "rotate > purge" honored.

---

### Task 2: Batch B — Scanner repair (F002)

**Files:**
- Modify (as discovered): `.github/workflows/*` CodeQL/Trivy workflow(s) that produce the error banner
- Test: re-run the failing analysis workflow; no new pytest required unless a script change lands

**Interfaces:**
- Consumes: Task 1 complete (or owner explicit waiver to proceed while F001 is in progress — default is wait)
- Produces: Code scanning error banner cleared; documented dismiss reason for history-only Trivy noise

- [ ] **Step 1: Capture current banner + top alert paths (read-only)**

```bash
gh api repos/alawein/alawein/code-scanning/alerts --paginate --jq '[.[] | select(.state=="open")] | length'
```

Record count and a sample of `most_recent_instance.location.path` prefixes (expect historic `platforms/*`, `organizations/*`).

- [ ] **Step 2: Fix the CodeQL/Trivy configuration error**

Locate the workflow reporting errors (likely under `.github/workflows/`). Minimal change: make analysis paths match the current docs/control-plane tree; disable or scope Trivy away from deleted monorepo lockfile paths if that is what generates the banner.

- [ ] **Step 3: Run workflow on a branch and confirm banner clears**

```bash
gh workflow list
# trigger the fixed workflow on the branch; confirm Actions run success
```

Expected: workflow success; Security → Code scanning no longer shows the CodeQL+Trivy error banner.

- [ ] **Step 4: Scope-dismiss stale alerts with a recorded reason**

Dismiss only alerts whose paths are under removed history prefixes. Reason text (example):

```text
Stale: finding targets paths removed from main (pre-consolidation monorepo history). Current tree clean of those lockfiles. See audit F002 2026-09-15.
```

Do not blanket-dismiss alerts on paths that still exist on `main`.

- [ ] **Step 5: Commit on a branch (no main push)**

```bash
git checkout -b fix/code-scanning-f002
git add .github/workflows/
git commit -m "fix(security): repair CodeQL/Trivy config for current tree"
```

**Acceptance:** Banner cleared; open alerts reflect current tree signal quality, not 1,839 historic dependency hits.

---

### Task 3: Batch B — Actions permission hardening (F003)

**Files:**
- GitHub Settings → Actions (UI). Optionally document the new policy in `docs/governance/` or `SSOT.md` only if an existing doc already claims the old defaults.

**Interfaces:**
- Consumes: list of required workflows that must stay green (`validate-contract`, `test-scripts`, `lint-managed-markdown`, `GitHub Baseline Audit`, `Gitleaks`)
- Produces: read-only default `GITHUB_TOKEN`; restricted actions allowlist or documented exception; SHA-pin enforcement decision recorded

- [ ] **Step 1: Snapshot current Actions settings (read-only notes)**

Record before values: allow-all vs selected; SHA-pin off/on; default token permissions; “Actions can create and approve pull requests”.

- [ ] **Step 2: Apply least-privilege defaults**

Owner/settings changes:
1. Default workflow token → **Read repository contents and packages permissions** (read-only).
2. Restrict actions to verified creators / selected patterns that match current SHA-pinned uses.
3. Turn off “Allow GitHub Actions to create and approve pull requests” unless a named bot workflow still requires it; if required, document the exception with workflow name.
4. Enable SHA-pinning requirement if every required workflow already pins (audit claims they do).

- [ ] **Step 3: Verify required checks still pass on a no-op PR or existing open PR**

```bash
gh pr checks <pr-number>
```

Expected: the five ruleset-required checks still report success.

- [ ] **Step 4: Commit only if a docs/policy file changed**

```bash
git commit -m "docs: record Actions least-privilege defaults (F003)"
```

**Acceptance:** Settings match least-privilege; CI green; exception list (if any) named.

---

### Task 4: Batch C — CODEOWNERS path fix (F004)

**Files:**
- Modify: `.github/CODEOWNERS`
- Test: `scripts/tests/` ownership/path tests if present (`test_managed_path_ownership.py` or equivalent); else `Test-Path` checks

**Interfaces:**
- Consumes: stale paths `scripts/validate-doctrine.py`, `scripts/github-baseline-audit.py`
- Produces: corrected paths `scripts/doctrine/validate.py` **or** the live equivalents confirmed on disk — verify before editing

- [ ] **Step 1: Write the failing path-existence check**

```bash
# From station root (core/alawein)
python - <<'PY'
from pathlib import Path
stale = [
    Path("scripts/validate-doctrine.py"),
    Path("scripts/github-baseline-audit.py"),
]
for p in stale:
    print(p, "EXISTS" if p.exists() else "MISSING")
live = [
    Path("scripts/doctrine/validate.py"),
    Path("scripts/doctrine/validate-doc-contract.sh"),
    Path("scripts/github/github-baseline-audit.py"),
]
for p in live:
    print("candidate", p, p.exists())
PY
```

Expected: stale paths MISSING; choose real live paths from candidates that exist.

- [ ] **Step 2: Patch CODEOWNERS**

Replace the two stale entries with the verified live paths. Do not enable `require_code_owner_review` unless the owner separately asks (solo policy currently false).

- [ ] **Step 3: Re-run path check / ownership test**

```bash
pytest scripts/tests/test_managed_path_ownership.py -v
```

If that test file is absent, re-run the Step 1 script against the new CODEOWNERS paths (parse file and `Path.exists()`).

Expected: PASS / all paths exist.

- [ ] **Step 4: Commit**

```bash
git add .github/CODEOWNERS
git commit -m "fix: correct stale CODEOWNERS paths (F004)"
```

**Acceptance:** Every CODEOWNERS path resolves on `main` tree.

---

### Task 5: Batch C — Regenerate drifted derived docs (F005)

**Files:**
- Regenerate: `docs/architecture.md` via existing generator (`scripts/ops/generate-arch-diagram.py` or documented equivalent)
- Modify: `SSOT.md` (version citation only), `DEBT.md` (remove resolved `.gitattributes` entry), `catalog/kernel.yaml` (tag claim)
- Test: `pytest scripts/tests/test_generate_arch_diagram.py -v` and doctrine validators already used in CI

**Interfaces:**
- Consumes: live `catalog/repos.json` repo count; `prompt-kits/AGENT.md` frontmatter version; `git tag` list
- Produces: architecture counts matching catalog; SSOT cites AGENT.md 1.9.0 (or whatever frontmatter reads); DEBT without resolved gitattributes item; kernel.yaml acknowledges `kernel-v0.1.0`

- [ ] **Step 1: Capture observed vs desired**

```bash
python - <<'PY'
import json
from pathlib import Path
repos = json.loads(Path("catalog/repos.json").read_text(encoding="utf-8"))
# adapt to actual shape: count repo entries
print("repos.json entries:", len(repos) if isinstance(repos, list) else "see keys", type(repos))
PY
git tag -l "kernel-*"
rg -n "1\\.8\\.4|1\\.9\\.0" prompt-kits/AGENT.md SSOT.md
rg -n "gitattributes" DEBT.md
rg -n "kernel" catalog/kernel.yaml
```

- [ ] **Step 2: Regenerate architecture diagram**

```bash
python scripts/ops/generate-arch-diagram.py
# or the repo's documented generate path if different — prefer Makefile/CI script name if present
pytest scripts/tests/test_generate_arch_diagram.py -v
```

Expected: PASS; `docs/architecture.md` counts match catalog.

- [ ] **Step 3: Refresh SSOT / DEBT / kernel.yaml citations**

Minimal edits only:
- SSOT: bump cited AGENT.md version to match frontmatter.
- DEBT: remove the resolved `.gitattributes` debt row.
- `catalog/kernel.yaml`: stop claiming no kernel tag if `kernel-v0.1.0` exists; leave `workflow_pin_sha` null until Phase 6 pin lands (do not invent a SHA).

- [ ] **Step 4: Commit**

```bash
git add docs/architecture.md SSOT.md DEBT.md catalog/kernel.yaml
git commit -m "docs: clear architecture/SSOT/DEBT/kernel drift (F005)"
```

**Acceptance:** Generators/validators report zero drift for these claims.

---

### Task 6: Batch C — Publish `kernel-v0.1.0` GitHub Release (F008)

**Files:**
- GitHub Release object only (no tree change required)
- Optional notes file if the repo already stores release notes under `docs/`

**Interfaces:**
- Consumes: existing tag `kernel-v0.1.0` (2026-09-10)
- Produces: GitHub Release attached to that tag

- [ ] **Step 1: Verify tag exists and has no release**

```bash
git fetch --tags
git rev-parse kernel-v0.1.0
gh release list
gh release view kernel-v0.1.0 2>&1 || true
```

Expected: tag resolves; `gh release view` fails/not found.

- [ ] **Step 2: Publish release (owner or agent with `gh` auth)**

```bash
gh release create kernel-v0.1.0 --title "kernel-v0.1.0" --notes "Kernel pin tag for fleet workflows. Pins workflow_pin_sha in a follow-up once Phase 6 lands."
```

- [ ] **Step 3: Verify**

```bash
gh release view kernel-v0.1.0 --json tagName,isDraft,publishedAt
```

Expected: `tagName=kernel-v0.1.0`, not draft.

**Acceptance:** Tag has a Release; `workflow_pin_sha` still intentionally unset until its own PR.

---

### Task 7: Batch D — Branch / PR / issue hygiene (F006, F007, F009)

**Files:**
- None required in tree; GitHub refs/issues/PRs only
- Create: list artifact `docs/superpowers/plans/2026-09-15-audit-hygiene-list.md`

**Interfaces:**
- Consumes: `git ls-remote --heads origin`
- Produces: deleted merged/stale branches; PRs #275/#269 resolved or explicitly deferred; stale issues closed or converted to debt

- [x] **Step 1: List branches with last-commit dates (read-only)**

```bash
git ls-remote --heads origin > /tmp/alawein-heads.txt
# For each head, show last commit date via API
gh api repos/alawein/alawein/branches --paginate --jq '.[] | [.name, .commit.sha[0:7]] | @tsv'
```

Write keep/delete candidates into `docs/superpowers/plans/2026-09-15-audit-hygiene-list.md`. **Keep any branch backing an open PR.**
Evidence: `docs/superpowers/plans/2026-09-15-audit-hygiene-list.md` (2026-09-15). Open PRs: none.

- [ ] **Step 2: Owner approval gate for deletes**

Require: `Approve: delete stale branches F006` listing the exact branch names. Then:

```bash
git push origin --delete <branch>
```

Blocked pending owner Approve line. Proposed exact names listed in hygiene list.

- [x] **Step 3: PR #275 / #269**

```bash
gh pr view 275 --json mergeable,mergeStateStatus,title
gh pr view 269 --json mergeable,mergeStateStatus,statusCheckRollup,title
```

Observed 2026-09-15: #275 **CLOSED** (unmerged, DIRTY); #269 **MERGED**. No force-push. Head of #275 still on origin (delete candidate).

- [ ] **Step 4: Triage issues #26, #42–46; leave #241 open**

```bash
gh issue list --state open
```

Observed open set: #26, #42–#46, #241. #241 left open. Close-or-DEBT for #26/#42–#46 proposed in hygiene list; not closed this session (owner chooses).

**Acceptance:** Only open-PR branches + `main` remain (or documented exceptions); open PRs clean or explicitly parked; only actionable issues open.

---

### Task 8: Batch E — Repo-count discrepancy check (§1.2) [READ-ONLY]

**Files:**
- Create: `docs/superpowers/plans/2026-09-15-audit-batch-e-evidence.md` §repo-count
- Inputs (local, do not merge): `C:/Users/mesha/Downloads/files1-unzipped/CATALOG-DELTA.yaml` (review-only)

**Interfaces:**
- Consumes: live `gh repo list alawein --limit 200 --json name,visibility,isArchived`; live `catalog/repos.json`; review-only delta
- Produces: three-way table (catalog vs live vs delta) and a **proposed** ADR draft text — status remains `proposed`

- [ ] **Step 1: Export live alawein namespace names + visibility**

```bash
gh repo list alawein --limit 200 --json name,visibility,isArchived,updatedAt > /tmp/alawein-live-repos.json
python - <<'PY'
import json
from pathlib import Path
live = json.loads(Path("/tmp/alawein-live-repos.json").read_text())
print("live_count", len(live))
print("public", sum(1 for r in live if r["visibility"]=="PUBLIC"))
print("private", sum(1 for r in live if r["visibility"]=="PRIVATE"))
print("archived", sum(1 for r in live if r["isArchived"]))
PY
```

- [ ] **Step 2: Export catalog slugs**

```bash
python - <<'PY'
import json
from pathlib import Path
raw = json.loads(Path("catalog/repos.json").read_text(encoding="utf-8"))
# normalize to list of {name,visibility} depending on schema
print(type(raw), list(raw)[:3] if isinstance(raw, dict) else "list")
PY
```

Adapt parsing to the real `repos.json` shape (entries may nest under lanes). Count rows and public flags.

- [ ] **Step 3: Diff against CATALOG-DELTA.yaml row names (read-only)**

Use PyYAML or a minimal parse to list `name`/`slug` fields from the Downloads delta. Produce sets: live-only, catalog-only, delta-only, intersection mismatches on visibility.

- [ ] **Step 4: Write evidence + stop without merging**

Append to evidence file:

```markdown
## Repo count reconciliation
Live alawein count / public / private / archived:
catalog/repos.json count / public:
CATALOG-DELTA.yaml count / public:
Hypothesis supported: consolidation | measurement mismatch | unknown
ADR-2026-PENDING-02: still proposed — no merge performed
```

**Acceptance:** Numbers reconciled enough to stamp a decision later; **no** `index.yaml` merge; **no** decision-register silent edit.

---

### Task 9: Batch E — Dual MAIOS canon read (§1.3) [READ-ONLY]

**Files:**
- Read: `docs/governance/maios-decisions.md` (live)
- Read (Downloads, not committed): Bible / CURRENT-STATE / GAP / IMPLEMENTATION-GUIDE / decision-register from `files-unzipped` + `files1-unzipped`
- Create: evidence §dual-canon in the Batch E evidence file

**Interfaces:**
- Consumes: PRs #302, #296, #301, #304 metadata via `gh pr view`
- Produces: KEEP_LIVE / MERGE_WITH_CHAT / CHAT_SUPERSEDES / COMPLEMENTARY map for each chat artifact — owner stamps disposition later

- [ ] **Step 1: Inventory live MAIOS paths**

```bash
rg -n "MAIOS|maios" docs/governance -g '*.md' -l
gh pr view 302 --json title,mergedAt,files
gh pr view 304 --json title,mergedAt,body
```

- [ ] **Step 2: Diff themes, not full verbatim paste**

For each chat artifact (`MAIOS-BIBLE.md`, `CURRENT-STATE.md`, `GAP-AND-ROADMAP.md`, `decision-register.md`, …) note: overlaps live `maios-decisions.md` / other live files? Conflicts? Missing?

- [ ] **Step 3: Write disposition table (proposed only)**

```markdown
| Chat artifact | Live counterpart | Proposed disposition | Conflict?
```

Do not copy the full Bible into the repo in this task.

**Acceptance:** Owner has a clear stamp sheet; chat canon still uncommitted.

---

### Task 10: Batch E — `task-sync.mjs` field-ownership verify (§1.4) [READ-ONLY]

**Files:**
- Read: `scripts/ops/task-sync.mjs`
- Test fixtures if present under `scripts/tests/` related to task-sync
- Evidence §task-sync

**Interfaces:**
- Consumes: current file on HEAD
- Produces: VERIFIED fixed | VERIFIED still overwrites Status | UNKNOWN — leaves `ADR-2026-PENDING-06` unchanged

- [ ] **Step 1: Locate Status / Notion write paths**

```bash
rg -n "Status|notion|live_write|dryRun|dry-run" scripts/ops/task-sync.mjs
```

- [ ] **Step 2: Read the write function(s) and classify**

Document: which fields are written; whether Notion Status is overwritten from GitHub; whether dry-run is default; whether neper/qaplibria targets remain.

- [ ] **Step 3: Evidence only — no live adapter enable**

```markdown
## task-sync.mjs
HEAD sha:
Status field ownership observed:
Targets listed:
ADR-2026-PENDING-06: still proposed
```

**Acceptance:** Direct-read conclusion recorded; no live-write behavior change.

---

### Task 11: Batch F — Pages flag (F010) [GATED ON VISIBILITY]

**Files:**
- GitHub Settings → Pages
- Blocked until owner settles whether `alawein/alawein` remains public under `ADR-20260915-01` execution timing / any narrow exception discussion

**Interfaces:**
- Consumes: visibility decision
- Produces: Pages disabled **or** profile page actually deployed

- [ ] **Step 1: Confirm visibility decision exists**

If blanket-private not executed and no stamped exception: **stop** and escalate.

- [ ] **Step 2: Either disable Pages or ship the profile source**

```bash
# after approval
gh api repos/alawein/alawein --jq '{has_pages, homepage}'
```

**Acceptance:** Pages state matches an intentional, stamped decision.

---

### Task 12: Decision-register / lesson append (post-A, owner-stamped)

**Files:**
- Append only when the in-station register path exists and owner asks: prefer live register if present; otherwise wait for Task 9 disposition
- New lesson (allowed when owner expands): `docs/governance/lessons/2026-09-15-org-scan.md` is a *different* slice; for this audit use `docs/governance/lessons/2026-09-15-secret-scanning-f001.md` only after approval to add lessons

**Interfaces:**
- Consumes: Task 1 rotation receipt
- Produces: ADR that **supersedes** `ADR-20260915-07` with VERIFIED-live + rotation receipt date — status `proposed` until owner stamps `accepted`

- [ ] **Step 1: Draft ADR text (do not mark accepted)**

Use `TEMPLATES.md` §3 shape:

```markdown
# ADR-20260915-08 B3 secret exposure verified and rotation ordered
Date: 2026-09-15
Status: proposed
Supersedes: ADR-20260915-07
Approver: —
Evidence tier: 1 — GitHub secret-scanning alert metadata (F001)
Decision: treat B3 as VERIFIED-live; Batch A rotation is mandatory before G8 visibility flip
Why: alerts #1 service_role and #2 PAT open in public history
What is explicitly not decided: history purge method/timing; whether any private fleet repo shared the project
Enforcement: doctor/secrets scan; G8 remains blocked until rotation receipt exists
```

- [ ] **Step 2: Owner stamps `accepted` or edits**

No silent accept.

**Acceptance:** Register reflects F001 without collapsing open ADRs 02/05/06.

---

## Self-review (plan author)

1. **Spec coverage:** F001–F010 and reconciliation §1.1–1.5 each map to a task (1.1 = no task needed; 1.2→T8; 1.3→T9; 1.4→T10; 1.5 informational for G8/ADR-01). Batch letters A–F preserved.
2. **Placeholder scan:** No TBD/TODO steps; commands are concrete; secret values never requested.
3. **Type/name consistency:** Alert numbers `#1`/`#2`, finding ids F001–F010, approval verb `Approve: rotate supabase credentials F001` used consistently. History purge kept out of Batch A.
4. **Gaps intentionally deferred:** Doctor v1 (G7), absorb batches, visibility flip, CATALOG-DELTA merge, chat-canon commit, live `task-sync` fix.

---

## Execution order (summary)

```text
Task 1 (Batch A, gated) → stop for review
→ Tasks 2–4 (Batch B) when approved
→ Tasks 4–6 (Batch C) when approved
→ Task 7 (Batch D) when approved
→ Tasks 8–10 (Batch E, read-only) anytime after Task 1, preferred before any canon/catalog write
→ Task 11 (Batch F) only after visibility stamp
→ Task 12 when owner wants register updated
```
