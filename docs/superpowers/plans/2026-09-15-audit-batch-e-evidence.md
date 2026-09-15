# Batch E evidence — Tasks 8–10 (read-only)

**Date:** 2026-09-15 PT  
**Worktree (Batch E Tasks 8–10 read):** `core/alawein` @ `83f44d477824addb37004c587f7f8b8f57f91471`  
**Later HEAD note:** station tip also observed at `0d27df61` (F005 docs); Tasks 8–10 conclusions unchanged.  
**Scope:** Repo count reconciliation, dual MAIOS canon disposition (proposed), `task-sync.mjs` field-ownership read, F001 receipt. No catalog merge. No chat-canon commit. No secret values.  
**Companion:** Batch B baseline → `2026-09-15-audit-batch-b-evidence.md` (F002/F003).

---

## §F001 — Credential containment (rotation receipt)

**Status:** DONE (rotate > purge). No secret values recorded.

## F001 rotation receipt
Date: 2026-09-15 PT
Approver line: Approve: rotate supabase credentials F001
Alert 1: supabase_service_key — rotated: yes — alert state: resolved (resolution=revoked, 2026-09-15T18:28:14Z)
Alert 2: supabase_personal_access_token — rotated: yes — alert state: resolved (resolution=revoked, 2026-09-15T18:28:15Z)
Supabase project slug(s) affected: menax (`ejhwecwrxzryunornesa`), kohyr (`ujqzdqbngmxixebmeqve`)
Consumers updated (names only): legacy JWT API keys disabled on both projects; Legacy HS256 revoked on both; PATs deleted by name: subapase-token, supabase-exp-api, supabase-api, GitHub-Supabase, leftover CLI token; kept by name: vscode-mcp-maios-2026-09-07, kohyr-wip, supabase-github
History purge: NOT DONE (needs separate approval)
ADR-20260915-07: evidence upgraded to VERIFIED-live; superseding ADR text not stamped in this task

| Item | Verified |
|------|----------|
| menax restore + standby ECC | ACTIVE; standby ECC created; JWT-based legacy API keys disabled; Legacy HS256 under Revoked keys |
| kohyr restore + standby ECC | ACTIVE; standby ECC created; JWT-based legacy API keys disabled; Legacy HS256 under Revoked keys |
| GitHub alerts #1/#2 | `state=resolved`, `resolution=revoked` via `gh api` PATCH; **re-verified GET** this session (same metadata) |
| Remaining account PATs (names only) | vscode-mcp-maios-2026-09-07, kohyr-wip, supabase-github |

**Re-verify command (metadata only):**

```text
gh api repos/alawein/alawein/secret-scanning/alerts --jq '[.[] | {number, state, secret_type, created_at, resolved_at, resolution}]'
```

---

## Task 8 — Repo count reconciliation

### Sources

| Source | Command / path | As-of |
|--------|----------------|-------|
| **Live** | `gh repo list alawein --limit 200 --json name,visibility,isArchived,updatedAt` | 2026-09-15 |
| **Catalog** | `catalog/repos.json` (`repos[]` entries; `visibility`, `archived` / `lifecycle`) | `lastVerified` 2026-08-27 |
| **Delta (review-only)** | `C:\Users\mesha\Downloads\files1-unzipped\CATALOG-DELTA.yaml` header `repo_count:` | `lastVerified` 2026-09-15 |

### CATALOG-DELTA.yaml header (excerpt)

```yaml
schemaVersion: 3.0.0-reconciled
lastVerified: '2026-09-15'
decision_status: PROPOSED_NOT_APPLIED
repo_count:
  total: 72
  alawein: 62
  kohyr: 10
  public: 11
  private: 61
  archived: 18
```

Delta enumerates **two namespaces** (`alawein` + `kohyr`). Catalog and live `gh` query are **alawein org only**.

### Three-way counts

| Metric | Live (`alawein`) | `catalog/repos.json` | `CATALOG-DELTA.yaml` |
|--------|------------------|----------------------|----------------------|
| **Total repos** | 62 | 48 | 72 (62 alawein + 10 kohyr) |
| **Public** | 10 | 10 | 11 (org-wide) |
| **Private** | 52 | 38 (derived) | 61 (org-wide) |
| **Archived** | 13 | 1 (`archived` / `lifecycle` / `status`) | 18 (org-wide) |

### Name-set diff (live vs catalog, alawein only)

- **Live-only (14):** `.archive`, `AI-Conversations`, `apps`, `argus`, `guides_system`, `ledger-voice-demo`, `lightcone-trace-eval`, `ops-control-plane-grok`, `outpost-archive`, `qahwah-time`, `trace-eval`, `trace_eval`, `wiki-archive`, `workspace-brain`
- **Catalog-only:** none (catalog names ⊆ live names)
- **Public count:** live **10** vs catalog **10** (aligned on catalogued subset)

### Hypothesis (proposed, not stamped)

| Hypothesis | Support |
|------------|---------|
| **Measurement mismatch** | Delta **72** includes **kohyr** (+10); live/catalog queries are **alawein-only** (62). Delta **public 11** vs live **10** may include kohyr public repo(s). |
| **Consolidation / curation** | Catalog **48** is a **curated** inventory: **14** live repos (mostly archived or ops-archive names) absent from `repos.json`; catalog shows **1** archived row vs **13** live archived flags. |
| **Unknown** | Whether missing catalog rows are intentional omission vs stale compile — needs owner + `ADR-2026-PENDING-02` stamp before any `index.yaml` merge. |

**ADR-2026-PENDING-02:** still **proposed** — **no merge** of `CATALOG-DELTA.yaml` into `catalog/index.yaml` performed.

---

## Task 9 — Dual MAIOS canon (proposed dispositions)

### Live governance themes (`docs/governance/maios-decisions.md`)

Summary themes (append-only ledger, 2026-09-15):

- **Dual SoR:** Desktop `RESPONSE-STYLE.md` rev g + portable `docs/style/maios-reply-style-portable.md` @ `maios-reply-format@1.0.0`; policy `~/AGENTS.md`.
- **Control plane:** `docs/governance/control-plane.md` remains Git governance SSOT; FLEET-BOARD bridge-only; `alawein/maios` remote **MISSING**.
- **Consolidation bundle (2026-09-15):** AGI path, dotfolder archive, action-protocol fold, Agent OS copies under `docs/superpowers/`.
- **Authority / autonomy:** Field-level sole writers; hard gates unchanged; skills>bots locked.

Related live index: `docs/governance/maios-canonical-set.md`, `maios-charter.md`, `control-plane.md`, `operating-model.md`.

### PR metadata (`gh pr view --json title,mergedAt`)

| PR | Title | mergedAt (UTC) |
|----|-------|----------------|
| **296** | docs(governance): name reply contract maios-reply-format@1.0.0 | 2026-09-15T13:03:23Z |
| **301** | docs: add maios-reply-style portable 1.0.0 paste | 2026-09-15T12:14:01Z |
| **302** | Add MAIOS governance pack from untracked maios staging | 2026-09-15T14:42:43Z |
| **304** | Record consolidation human-call decisions | 2026-09-15T15:57:13Z |

### Chat-canon inventory (Downloads, not committed)

**`files-unzipped/`**

- `CURRENT-STATE.md`
- `GAP-AND-ROADMAP.md`
- `IMPLEMENTATION-GUIDE.md`
- `SCHEMAS.md`
- `TEMPLATES.md`
- `decision-register.md`
- `README.md`

**`files1-unzipped/`**

- `MAIOS-BIBLE.md`
- `CURRENT-STATE.md`
- `GAP-AND-ROADMAP.md`
- `RETIREMENT-DECISIONS.md`
- `CATALOG-DELTA.yaml`
- `EXTERNAL-BENCHMARK-APPENDIX.md`
- `MAIOS-OS-BLUEPRINT.md` (superseded draft; README says archive)
- `README.md`

### Proposed disposition table (owner stamp later)

| Chat artifact | Live counterpart | Proposed disposition | Conflict? |
|---------------|------------------|----------------------|-----------|
| `MAIOS-BIBLE.md` | `maios-charter.md`, `control-plane.md`, specs under `docs/superpowers/` | **COMPLEMENTARY** (target-state spec; live is operational/git SSOT) | Low — different layer |
| `CURRENT-STATE.md` (either pack) | `maios-decisions.md` OBSERVED entries, bridge handoffs | **MERGE_WITH_CHAT** (evidence-tier snapshot into live or bridge; not verbatim duplicate) | Medium — dates/claims must be reconciled |
| `GAP-AND-ROADMAP.md` | FLEET-BOARD rows, `docs/superpowers/plans/*` | **COMPLEMENTARY** | Low if G7/doctor stays deferred |
| `IMPLEMENTATION-GUIDE.md` (`files-unzipped` only) | `operating-model.md`, `control-plane.md`, bridge `ops-shared-inventory` | **MERGE_WITH_CHAT** (account paths/workflows) | Medium — overlaps station map |
| `decision-register.md` | `maios-decisions.md` | **KEEP_LIVE** (live ledger authoritative); chat register seeds **proposed** rows only | High if bulk-accepted without stamp |
| `SCHEMAS.md` / `TEMPLATES.md` | `docs/governance/*`, Outpost templates | **COMPLEMENTARY** until doctor consumes schemas | Low |
| `RETIREMENT-DECISIONS.md` | `catalog/repos.json`, absorb queues in decisions | **MERGE_WITH_CHAT** after **ADR-2026-PENDING-02** | Medium — tied to catalog merge gate |
| `CATALOG-DELTA.yaml` | `catalog/repos.json` | **MERGE_WITH_CHAT** (machine view) — **blocked** on ADR-02 | High — count/visibility drift |
| `EXTERNAL-BENCHMARK-APPENDIX.md` | `research-briefs/`, ad hoc citations | **COMPLEMENTARY** | Low |
| `MAIOS-OS-BLUEPRINT.md` | Archived per chat README | **CHAT_SUPERSEDES** itself → Bible + CURRENT-STATE | None (explicitly superseded) |

**Chat canon committed to repo:** **No** (this task).

---

## Task 10 — `scripts/ops/task-sync.mjs`

**HEAD path:** `scripts/ops/task-sync.mjs` @ `83f44d477824addb37004c587f7f8b8f57f91471`

### Declared field ownership (file header)

- **Notion owns:** `status`, `priority`, `due_date`
- **GitHub owns:** `repo`, `github_ref`, `github_issue_url`, `github_state`

### Status / Notion write paths observed

| Location | Behavior |
|----------|----------|
| `syncExistingTasks` | Reads GitHub issue `state` → PATCH Notion **`Status`** when mismatch (`GITHUB_STATE_TO_NOTION_STATUS`) |
| `syncNewAndChangedIssues` | Same **`Status`** overwrite on existing pages; creates new pages with **`Status`** from GitHub |
| `buildNewTaskProperties` | Sets **`Status`** from GitHub on create |
| `dry-run` / `live_write` guards | **None** — live Notion PATCH/POST on run |

### Targets

`TARGET_REPOS`: `meshal-web`, `neper`, `qaplibria`, `edfp` (owner `alawein`).  
`neper` / `qaplibria` called out in delta blocking item **B2** as possibly stale names.

### Verdict

**VERIFIED still overwrites Status** — comments assert Notion owns `status`, but all sync paths **write Notion `Status` from GitHub issue state** (no read-only respect for human-edited Notion status).

**ADR-2026-PENDING-06:** still **proposed** — no adapter behavior change in this batch.

---

## Batch E status

**Overall:** `DONE_WITH_CONCERNS` — Batch E Tasks 8–10 evidence complete; **F001** rotation receipt VERIFIED-live (alerts resolved); **ADR-02/06** decisions remain open by design; history purge still gated.

**One-line summary**

- **Counts:** live **62/10 pub** · catalog **48/10 pub** · delta **72/11 pub** (62+10 orgs)
- **task-sync:** **VERIFIED still overwrites Status**
- **Dual canon:** Live `maios-decisions.md` + governance pack (**#302/#304**) hold authority; Downloads Bible/state pack **complementary / merge-after-stamp**, not committed

### Remaining gaps (by design / out of Batch E)

| Gap | Lane |
|-----|------|
| `ADR-2026-PENDING-02` stamp + any `CATALOG-DELTA` → `index.yaml` merge | Owner |
| Dual-canon disposition stamps (KEEP_LIVE / MERGE_WITH_CHAT / …) | Owner |
| `ADR-2026-PENDING-06` / task-sync Status ownership fix | Owner / later code change |
| History purge of leaked blobs | Separate irreversible approval |
| Superseding ADR-20260915-08 accept into decision-register | Owner (Task 12) |
| F002 / F003 remediation | See Batch B evidence — baseline only |
