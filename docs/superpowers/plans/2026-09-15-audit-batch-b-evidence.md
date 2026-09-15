---
type: evidence
status: active
source: alawein audit cleanup 2026-09-15
last_updated: 2026-09-15
owner: meshal
---
# Batch B evidence — F002 / F003 (read-only snapshot)

**Date:** 2026-09-15 PT  
**Worktree:** `core/alawein` @ `0d27df61198d80bb5ccd683ef613580649fe264d`  
**Scope:** Capture current Code scanning + Actions settings state for Tasks 2–3. No settings writes. No secret values. No alert payload blobs.

**Evidence tier:** VERIFIED (GitHub API / Settings metadata, this session) unless marked SELF-REPORTED.

---

## F002 — Scanner repair (baseline before fix)

### Plan requirements (Task 2)

1. Capture open alert count + path-prefix sample.
2. Fix CodeQL/Trivy config so analysis matches current control-plane tree.
3. Re-run workflow; clear Security → Code scanning error banner.
4. Scope-dismiss stale alerts whose paths are under removed history only.
5. Commit on branch `fix/code-scanning-f002` (no main push) when implementing.

**Acceptance (not met yet):** Banner cleared; open alerts reflect current tree, not historic dependency noise.

### Live API snapshot (2026-09-15)

| Check | Result |
|-------|--------|
| Open code-scanning alerts | **1839** (paginated: 18×100 + 39) |
| Audit / findings CSV (2026-09-15) | 1,839 open / 5,054 closed — aligned |
| CodeQL default setup | `state: not-configured` (languages listed: actions, javascript, javascript-typescript, python, typescript; query_suite default) |
| Recent analyses (API sample) | Stale: last rows dated **2025-12-11** (CodeQL + Trivy); no fresh analysis row observed in first 15 |

### Path prefix samples (open alerts, metadata only)

| Page sample | Dominant path prefix | Tool (sample) | Example paths (no payloads) |
|-------------|----------------------|---------------|-----------------------------|
| page 1 (n=20) | `packages/` | CodeQL | `packages/nexus-backend/src/ssr/index.ts`, `.../database/migrations.ts` |
| page 50 (n=20) | `platforms/` | CodeQL | `platforms/qmlab/src/components/*`, `platforms/qmlab/public/workers/*` |
| page 80 (n=20) | `organizations/` | CodeQL | `organizations/alawein-technologies-llc/incubator/foundry/...` |

**Inference:** Open set still dominated by **pre-consolidation monorepo history** prefixes (`packages/*`, `platforms/*`, `organizations/*`). These paths are not the current station control-plane tree on `main`. Trivy rows exist in historic analyses (2025-12-11) but sampled open pages above were CodeQL-only.

### Local vs remote workflow gap (F002 blocker for “fresh tree” scans)

| Artifact | Local worktree | Remote default branch |
|----------|----------------|------------------------|
| `.github/workflows/station-security.yml` | Present (CodeQL python + Trivy fs on `scripts`/`tools`/`catalog`/`config`/`schemas`/`.github/workflows`) | **Absent** — `gh run list --workflow station-security.yml` → HTTP 404 |
| `.github/workflows/codeql.yml` | Present (reusable `workflow_call`) | Active as **Reusable CodeQL** |
| Disabled historic workflows (remote) | — | `codeql-config.yml`, `ci-cd.yml`, `turbo-ci.yml`, others `disabled_manually` |

**Hypothesis (proposed):** Error banner + historic alert mass persist because fresh scoped SARIF from `station-security.yml` is **not yet on default branch**, while old analysis corpus remains.

### Remediation status

| Step | Status |
|------|--------|
| Capture banner + paths | **DONE** (this note) |
| Fix / land scoped workflow on branch | **NOT DONE** |
| Confirm banner cleared | **NOT DONE** |
| Scope-dismiss stale historic alerts | **NOT DONE** |

---

## F003 — Actions permission hardening (baseline before change)

### Plan requirements (Task 3)

1. Snapshot allow-all vs selected; SHA-pin; default token; “Actions can create and approve PRs”.
2. Apply least-privilege: read-only default token; restrict actions; disable PR create/approve unless named exception; enable SHA-pin if workflows already pin.
3. Verify required checks still green (`validate-contract`, `test-scripts`, `lint-managed-markdown`, `GitHub Baseline Audit`, `Gitleaks`).
4. Docs commit only if a policy file already claims the old defaults.

**Acceptance (not met yet):** Settings match least-privilege; CI green; exceptions named.

### Live Actions permissions (API, 2026-09-15)

| Setting | Observed value | Target (plan) |
|---------|----------------|---------------|
| Actions enabled | `true` | keep enabled |
| `allowed_actions` | **`all`** | selected / verified creators matching SHA-pinned uses |
| `sha_pinning_required` | **`false`** | `true` if all required workflows already pin |
| Selected-actions list | **N/A** (409 Conflict: all actions allowed) | populated when restricted |
| `default_workflow_permissions` | **`write`** | **`read`** (contents + packages) |
| `can_approve_pull_request_reviews` | **`true`** | `false` unless named bot exception |
| Repo visibility / Pages (context) | `public`, `has_pages: true` | F010 gated separately |

### Pinning discipline note (SELF-REPORTED from local workflows)

Local station workflows already SHA-pin many third-party actions (e.g. `actions/checkout@de0fac2e…`, `github/codeql-action/*@c10b8064…`, `aquasecurity/trivy-action@d2a0b607…`). **Repo-level** SHA-pin **requirement** remains off, so a future unpinned `uses:` would still be allowed.

### Remediation status

| Step | Status |
|------|--------|
| Snapshot before values | **DONE** (this note) |
| Apply least-privilege in Settings UI | **NOT DONE** (owner / admin) |
| Verify required checks still pass | **NOT DONE** |
| Optional docs/policy record | **NOT DONE** |

---

## Batch B status

**Overall:** `BASELINE_CAPTURED` — F002/F003 not remediated; evidence ready for owner-gated Settings + workflow branch work.

**Commands used (metadata only):**

```text
gh api repos/alawein/alawein/code-scanning/alerts?state=open&per_page=100 --paginate  # count pages
gh api repos/alawein/alawein/code-scanning/default-setup
gh api repos/alawein/alawein/code-scanning/analyses
gh api repos/alawein/alawein/actions/permissions
gh api repos/alawein/alawein/actions/permissions/workflow
gh api repos/alawein/alawein/actions/workflows
gh run list --workflow station-security.yml   # 404 on default branch
```
