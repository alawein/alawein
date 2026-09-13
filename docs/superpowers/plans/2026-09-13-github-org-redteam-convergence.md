# GitHub Org Red-Team Audit and Minimal-Architecture Convergence

> **For agentic workers:** This is the Phase 0–4 **read-only audit deliverable**. Do not merge, rebase, close, edit topics/descriptions, or change visibility until Meshal names an exact-yes line from §6. Taxonomy is already decided in `Downloads/MAIOS-Local-Operator-and-Coding-System-2026-09-13/03-CODING-SYSTEM-GITHUB-STRATEGY.md` — apply labels only after approval; do not redesign.

**Goal:** Independently verify the prior Copilot portfolio audit for `alawein` and `kohyr`, triage open PRs/branches, propose Session 0–1 taxonomy metadata (nothing applied), and produce a single approval checklist.

**Architecture:** Two GitHub identities stay separate: `alawein` = personal/research/OSS + light control-plane pointer; `kohyr` = commercial product (private canonical monorepo + narrow public shell). Labels (`maios-*` topics + description template) are the only near-term structure. Archive-in-place stays Month-6 gated.

**Tech Stack:** Windows `gh` + GitHub REST/GraphQL (auth as `alawein`); live HTTP for public sites/registries; private `kohyr/kohyr` docs via authenticated API.

**Spec:** User prompt in this session (Phases 0–4); adopted strategy `03-CODING-SYSTEM-GITHUB-STRATEGY.md`; MAIOS doctrine `Desktop/ops-shared-inventory/MAIOS.md` + `DECISIONS.md`; prior Copilot export treated as **hypothesis only**.

**Execution companion:** docs/superpowers/plans/2026-09-13-github-org-redteam-EXEC-CHECKLIST.md (Wave A closes started 2026-09-13 under Meshal explicit yes).


## Global Constraints

- Read-only this pass. No renames, deletes, visibility/transfers/license/merges/releases/workflow edits/issue-PR creation without named exact-yes.
- Archive-in-place only, max 5 repos per approval batch, named exact-yes per repo or batch.
- No secret values in output. No history rewrite / force-push / `reset --hard`.
- Every claim labeled Verified / Inferred / Unknown / Blocked by access; Verified cites evidence.
- Distinguish current state vs recommended action.
- One working tree per repo under `Desktop\GitHub\{solo,others,collaborations}` — no new clones.
- Do not relitigate locked `DECISIONS.md`; report conflicts instead of overriding.

**Evidence clock:** 2026-09-13 (commands run this session). Search API returned **102** open `alawein` PRs (may be capped; treat as ≥102).

---

## 1. Executive summary

**What changed vs the prior Copilot audit**

| Area | Prior (untrusted) | This pass (Verified unless noted) |
|---|---|---|
| `alawein` inventory | First pass “~10”; later self-correction “≥60” | **61** repos (`gh repo list`): 10 public, 51 private, 12 archived |
| `kohyr` inventory | Mixed “2 public” vs “10 accessible” | **10** repos; **1** public (`.github` only); `kohyr/kohyr` private |
| Known PRs #267/#268 | Listed as open | Both **MERGED** (`alawein/alawein`); #269 open draft |
| Issue counts (maglogic etc.) | First pass invented high counts | Research repos show **0** open issues via `is:issue` search |
| CI absence (qmatsim/spincirc/qubeml) | First pass “no CI” | Workflows present on all three |
| `trace-eval` / `trace_eval` | Naming collision; package TBD | Both archived; both `pyproject` name `trace-eval`; PyPI `trace-eval@0.2.0` points to **`kin0kaze23/trace-eval`**, not alawein |
| Live chshlab | Documented URL only | `https://chshlab.online` HEAD **200** this session |
| `workspace-brain` archive | `DECISIONS.md` R2 says archived | API: `archived:false`, still pushed 2026-09-13 — **conflict with locked decision** (report only) |

**Target architecture (one paragraph)**

Keep the smallest set a solo maintainer can run: (1) **alawein public flagships** (interactive research site + agent toolkit + eval surface), (2) **alawein frozen research record** (pub-backed labs, labeled not archived yet), (3) **alawein meta** (profile/control-plane pointer), (4) **alawein private product candidates** (zero public surface — leave alone except optional private labels), (5) **kohyr** as one private product monorepo plus a narrow public org shell. Do not split `alawein/alawein` into two repos: a two-section README/profile boundary is enough unless evidence later shows governance noise blocking portfolio clarity.

---

## 2. Branch and PR triage (Phase 0)

### 2.1 Known PRs from the brief

| Repo | Branch/PR | State | Recommendation | Evidence |
|---|---|---|---|---|
| `alawein/alawein` | PR **#267** `cursor/gated-leftovers-apply-plan` | **MERGED** | No action | `gh pr view 267` → `state=MERGED` |
| `alawein/alawein` | PR **#268** `cursor/sider-evidence-land-295b` | **MERGED** | No action | `gh pr view 268` → `state=MERGED` (Work taxonomy FAIL on checks before merge; already merged) |
| `alawein/knowledge-base` | PR **#49** `fix/cv-locked-employment-fields-v2` | OPEN; MERGEABLE; mergeState **BLOCKED**; CI green; Kilo ACTION_REQUIRED | **Leave open** until Meshal exact-yes `merge knowledge-base#49` (employment CV fields; gated content) | `gh pr view 49 -R alawein/knowledge-base`; checks verify/career/drift/resume-tex SUCCESS |

### 2.2 High-signal open PRs (non-Dependabot)

| Repo | Branch/PR | State | Recommendation | Evidence |
|---|---|---|---|---|
| `alawein/alawein` | PR **#269** draft `cursor/reusable-slack-prompts-e806` | MERGEABLE/BEHIND; Work taxonomy FAIL | **Leave open** (draft). Rebase after taxonomy gate if still wanted; do not merge draft | `gh pr view 269`; compare ahead 2 / behind 2 |
| `kohyr/.github` | PR **#1** `docs/profile-readme` | OPEN; MERGEABLE/CLEAN; **empty commit** (0 files); profile blob SHA identical to `main` | **Close as abandoned/already-on-main** — rewrite already on `main` (`d639502` “Update README.md”); tip `a78f9c6` has empty `files[]` | `gh api compare/main...docs/profile-readme`; content SHA `5ec2c19…` same on both refs |
| `alawein/workspace-brain` | PR **#1** kilo-code-bot | MERGEABLE/CLEAN; no checks | **Close as abandoned** unless Meshal wants historical OS consensus docs on a repo DECISIONS treats as HISTORICAL ARCHIVED (see §3 conflict) | Open PR search + `gh pr view 1 -R alawein/workspace-brain` |
| `alawein/simcore` | PR **#25** vitest CVE fix | MERGEABLE/BLOCKED; fail quick-audit/visual-test/drift | **Rebase and re-propose** after green CI, or leave open with security intent | Detail dump this session |
| `alawein/auditraise` | PR **#8** gitattributes | MERGEABLE/UNSTABLE | **Leave open** (small hardening) or merge after CI clarity | Detail dump |
| `alawein/llmworks` | PR **#50** R10 freshness | MERGEABLE/BLOCKED; checks mostly green | **Leave open** / merge when doctrine gate allows | Detail dump |
| `alawein/qubeml` | PR **#52** R10 freshness | MERGEABLE/UNSTABLE; doctrine FAIL | **Leave open** or close if freshness already on main | Detail dump |
| `alawein/qubeml` | PR **#45** README redo | MERGEABLE/UNSTABLE; drift FAIL | **Leave open** | Detail dump |
| `alawein/qubeml` | PR **#51** Copilot draft | draft | **Close as abandoned** (draft Copilot cleanup on frozen repo) | Detail dump |
| `alawein/scicomp` | PR **#106** Copilot draft | draft | **Close as abandoned** | Detail dump |
| `alawein/bolts` | #33 #34 security | MERGEABLE/BLOCKED; CI green | **Leave open** — candidate merge after review; exact-yes per PR | Detail dump |
| `alawein/bolts` | #35 website deps | CONFLICTING | **Rebase and re-propose** or close if superseded by later deps work | Detail dump |
| `alawein/bolts` | #37 Copilot draft | draft | **Close as abandoned** | Detail dump |
| `alawein/design-system` | #66–#77 security bumps | Many CONFLICTING or UNSTABLE; visual-test FAIL | **Do not batch-merge.** Recommend: one consolidated security PR after rebase; close superseded siblings with named yeses | Detail dump |
| `alawein/optiqap` | #12 feature | CONFLICTING; doctrine FAIL; tip May 2026 | **Close as abandoned** or rebase only if product still active | Detail dump |
| `alawein/optiqap` | #30–#32 security | mixed CONFLICTING/BLOCKED; ci FAIL | **Rebase and re-propose** as one PR or close | Detail dump |
| `alawein/optiqap` | #34 Copilot draft | draft | **Close as abandoned** | Detail dump |
| `alawein/loopholelab` | #42 README routes | CONFLICTING | **Rebase and re-propose** or close | Detail dump |
| `alawein/alembiq` | #43 restore WIP | CONFLICTING; tip Jun 2026 | **Close as abandoned** unless intentional WIP restore | Detail dump |
| `alawein/helios` | #4 archive metadata | MERGEABLE/BLOCKED; doctrine FAIL; ~85d stale | **Close as abandoned** (archived repo) | Detail dump |
| `alawein/ledger-voice-demo` | #2 draft | ~57d draft | **Close as abandoned** | Detail dump |
| `alawein/outpost-archive` | #38 #43 | BLOCKED; archived successor context | **Close as abandoned** or leave only if Meshal still wants archive polish | Detail dump |

### 2.3 Dependabot open PRs (grouped)

**Verified:** `alawein` Dependabot open ≈ **65** of **102** returned open PRs. Top repos: maglogic 14, spincirc 12, chshlab 6, qubeml 6, loopholelab 5, qmatsim 5, scicomp 5, alembiq 4, meshal-web 3, …

| Repo | Branch/PR class | State | Recommendation | Evidence |
|---|---|---|---|---|
| `alawein/maglogic` (+ other frozen labs) | Dependabot dep/action bumps | OPEN; many MERGEABLE/BLOCKED | **Leave open**; do not mass-merge into frozen repos without named yes. Prefer Month-6 freeze banner over dep churn | Search grouping this session |
| `alawein/chshlab` | vitest 5.0.0 #82/#83 | CI FAIL (build+vitest, doctrine) | **Leave open** — major bump; needs intentional upgrade | PR detail |
| `alawein/chshlab` | codeql/setup-python/doctrine #84–#87 | mixed FAIL | **Leave open** | PR detail |
| `alawein/meshal-web` | #72–#74 doctrine/ci-node/codeql pins | OPEN; branches far behind main | **Close as superseded** after confirming main already on newer pins, or rebase one | Branch compare behind 56 |
| `kohyr/kohyr` | #119 vitest 4.1.11 | OPEN | **Leave open** (product repo; small) | kohyr search |
| `kohyr/kohyr-founder-dashboard` | #2 #3 | OPEN | **Leave open** | kohyr search |
| `kohyr/kohyr-legacy` + `kohyr-internal-legacy` | #492–#499, #17–#18 | OPEN on **archived** repos | **Close as abandoned** (archived; Dependabot noise) | Repo `archived:true` + open PRs |

### 2.4 Non-default branches without open PRs (sampled)

| Repo | Branch/PR | State | Recommendation | Evidence |
|---|---|---|---|---|
| `alawein/alawein` | `copilot/research-alawein-portfolio-audit` | ahead 4 / behind 1; tip today | **Leave** as audit scratch **or** open PR only if Meshal wants it landed; else later delete-with-yes | `compare` this session |
| `alawein/alawein` | many `cursor/*`, `docs/*`, `fix/catalog*` | diverged; behind main tens–hundreds | **Leave** (do not mass-delete). Flag as leftover WIP; delete only with named exact-yes after “already merged?” check per branch | Branch list |
| `alawein/knowledge-base` | `fix/cv-locked-employment-fields` (v1) | ahead 1; superseded by v2 PR | **Close/delete branch after #49 lands** (exact-yes) | Compare vs `…-v2` |
| `alawein/knowledge-base` | `ship/command-center-consolidation-signed` | ahead 0 / behind 8 | **Leftover merged tip** — safe delete candidate after confirm | Compare status behind |
| `alawein/meshal-web` | `chore/vitest-4.1.11` @ `0dd2a1f` | ahead 0 / behind 1 | **HOLD conflict:** `MAIOS.md` still cites this as canon tip; main moved. Do not delete until SoR tip updated | MAIOS.md vs compare |
| `alawein/meshal-web` | many `feat/*` redesign branches | behind only (0 ahead) | **Leftover** — already landed or abandoned tips; delete candidates with named yes after merge check | Compare ahead=0 |
| `alawein/coding-phone` | (default only in sample) | — | No extra branches in first 100 | Branch list empty beyond default |
| `alawein/outpost` | (default only in sample) | — | Clean tip | Branch list |
| `kohyr/kohyr` | `copilot/research-audit-kohyr-org` | identical to main | **Leftover identical** — delete candidate | Compare identical |
| `kohyr/kohyr` | `changeset-release/main` | behind 1 | Release automation leftover | Compare |
| `kohyr/kohyr` | `feat/cli-init-and-run`, `feat/engine-bounded-repairs`, `feat/ignored-path-watch` | diverged | **Leave** until Meshal confirms merged via other PRs | Compare |

**Note:** Full fleet branch enumeration across all 71 repos was not completed this pass (sample focused on control-plane, site, flagships, kohyr). Unknown for unsampled repos.

---

## 3. Verification matrix (Phase 1)

| Prior claim | Independent finding | Status | Evidence |
|---|---|---|---|
| “~10 alawein repos” (first pass) | 61 repos | **Rejected** | `gh repo list alawein --limit 200` count 61 |
| Later “≥60 alawein” | 61 | **Confirmed** (count precision) | Same |
| “kohyr has 2 public / 10 accessible” | 10 total; **1** public (`.github`); `kohyr` private | **Corrected** | `gh repo list kohyr`; public names = `.github` only |
| chshlab/fallax/outpost “active” | README Status: active for all three | **Confirmed** | README heads via API |
| Research repos “maintenance” | README Status: **frozen** for maglogic, scicomp, qmatsim, spincirc, qubeml | **Confirmed** (matches later Copilot self-correction) | README heads |
| maglogic “10+ open issues” | open issues = **0** | **Rejected** | `search/issues?q=repo:alawein/maglogic+is:issue+is:open` → 0 |
| spincirc “12 issues” | open issues = **0** | **Rejected** | Same pattern |
| scicomp “6 open issues” | open issues = **0** | **Rejected** | Same |
| alawein/alawein “9 issues” | open issues = **7** | **Corrected** | Search total_count 7 |
| qmatsim/spincirc “no CI” | Workflows present | **Rejected** | `contents/.github/workflows` lists |
| qubeml “no package/no CI” | Has workflows (codeql, docs-doctrine, drift, …); package claims need deeper read | **Rejected** for “no CI”; package **Confirmed** via prior matrix + pyproject presence in second Copilot pass; this pass verified workflows | Workflows API |
| outpost “only simple validation / no pytest” | CI workflow exists; README documents install/verify | **Rejected** as absolute | `outpost/.github/workflows/ci.yml` present; README active |
| fallax “no coverage enforcement” | CI present; README documents cov-fail-under (CI command not re-read line-by-line) | **Corrected** / partially unverified on CI body | README + workflow list |
| chshlab live | HEAD 200 | **Confirmed** | `Invoke-WebRequest https://chshlab.online -Method Head` |
| fallax should ship v1 immediately | Still Status active / pre-release posture in README; not re-litigated to force release | **Rejected** as action | README; no release gate this pass |
| Kohyr CI weak/unknown | Private monorepo has CI/E2E/release docs and workflows (authenticated) | **Confirmed** strong internal CI (qualitative) | `kohyr/kohyr` tree: `.github`, `docs/operations/RELEASING.md`, README status private canonical |
| Kohyr public site ready | Private README + CLAIM-LADDER: kohyr.ai is older holding pitch; live site still gate-and-signature copy | **Confirmed** not ready | README; CLAIM-LADDER; live `kohyr.ai` text sample |
| maglogic Dependabot debt | 14 open Dependabot PRs | **Confirmed** | Search group count 14 |
| PyPI/npm identity for outpost | PyPI `outpost@0.5.2` → niveapps.com (**not** alawein); repo package name `outpost-kit`; `outpost-kit` not on PyPI | **Corrected** (new) | PyPI JSON + `pyproject.toml` name |
| `workspace-brain` archived (DECISIONS R2) | `archived:false`; pushed today | **Conflict with locked decision** | `gh api repos/alawein/workspace-brain`; DECISIONS.md 2026-09-09 R2 |
| `ops-control-plane-grok` archived | `archived:true` | **Confirmed** | API |
| repo-drift “recent release / focused” | README says Preview-only, **claims no automated CI** | **Corrected** vs prior “strong” framing | README Status section |
| Current pins are best flagships | Pins: qmatsim, spincirc, maglogic, scicomp, fallax, chshlab (4 frozen) | **Corrected** as strategy | GraphQL `pinnedItems` |

---

## 4. Proposed metadata batch (Phase 2 items 2–5) — nothing applied

### 4.1 Flagship pin candidates (own ranking)

Propose replacing the four frozen pins with active/public surfaces. **Recommended pin set (5):**

| Rank | Repo | Why (Verified) | Suggested pin? |
|---|---|---|---|
| 1 | `chshlab` | Status active; live site HTTP 200; public | Yes (keep) |
| 2 | `outpost` | Status active; CI workflow; agent toolkit; **not currently pinned** | Yes (add) |
| 3 | `fallax` | Status active; CI; eval surface | Yes (keep) |
| 4 | `alawein` | Profile + governance hub (meta) | Yes (add) — or keep unpinned if profile already surfaces it |
| 5 | `repo-drift` **or** keep one frozen research pin (`maglogic`) for Scholar continuity | repo-drift: public tool but README admits no CI; maglogic: frozen pub-backed | Prefer **maglogic** only if Scholar narrative needs one research pin; else `repo-drift` after CI honesty |

**Drop from pins (proposal):** `qmatsim`, `spincirc`, `scicomp` (frozen; remain public with `maios-frozen`).

### 4.2 Proposed 10-line “map of this account” (for `alawein/alawein` README)

Proposal only:

1. This account is personal research + OSS tools; company product lives under `kohyr` (private).
2. Start here: `chshlab` (live lab), `outpost` (agent prompt kit), `fallax` (reasoning eval).
3. Frozen research record: `maglogic`, `scicomp`, `qmatsim`, `spincirc`, `qubeml` — valid artifacts, not seeking issues.
4. Meta: this repo (`alawein/alawein`) is portfolio + light governance pointer; Desktop MAIOS is operator SoR.
5. Private product candidates exist; they are intentionally not public.
6. Topics use `maios-active` / `maios-frozen` / `maios-superseded` / `maios-demo` / `maios-meta`.
7. Do not confuse PyPI names with GitHub names (`trace-eval`, `outpost`).
8. Kohyr public shell: `kohyr/.github` + `kohyr.ai` holding page — not the product monorepo.
9. Issues on frozen repos may stay unanswered; prefer active flagships.
10. Exact-yes required before archive, visibility, or pin changes.

### 4.3 Taxonomy label proposals

| Repo | Proposed topic | Evidence | Description template draft |
|---|---|---|---|
| `alawein/alawein` | `maios-meta` | Profile/governance hub | `[meta] Portfolio README and shared governance surfaces for the alawein account.` |
| `chshlab` | `maios-active` | README active; live 200 | `[active] Interactive CHSH / Bell inequality education site (chshlab.online).` |
| `outpost` | `maios-active` | README active; CI | `[active] Prompt-pack installer and drift verifier for coding agents.` |
| `fallax` | `maios-active` | README active; CI | `[active] LLM adversarial reasoning evaluation / benchmarking.` |
| `maglogic` | `maios-frozen` | README frozen | `[frozen] Micromagnetic logic simulation research (IEEE Mag. Lett. lineage).` |
| `scicomp` | `maios-frozen` | README frozen | `[frozen] Scientific computing utilities; Python core is the supported surface.` |
| `qmatsim` | `maios-frozen` | README frozen | `[frozen] Quantum materials DFT/MD orchestration CLI.` |
| `spincirc` | `maios-frozen` | README frozen | `[frozen] Spintronic circuit / device modeling research workspace.` |
| `qubeml` | `maios-frozen` | README frozen | `[frozen] Notebook-first quantum ML / materials teaching repo.` |
| `repo-drift` | `maios-demo` | Preview-only; claims no CI | `[demo] Docs/config drift detector (preview; no automated CI yet).` |
| `outpost-archive` | `maios-superseded` | Name + archived; successor `outpost` | `[superseded] Historical Outpost archive. Successor: alawein/outpost.` |
| `trace-eval` | `maios-superseded` (cross-link) | Archived; richer history than `trace_eval`; **not** PyPI publisher | `[superseded] DIMS4 agent-trace evaluator (archived). Sibling: alawein/trace_eval. PyPI name collision: see kin0kaze23/trace-eval.` |
| `trace_eval` | `maios-superseded` (cross-link) | Archived; same package name claim | `[superseded] Alternate tree of trace-eval work (archived). Sibling: alawein/trace-eval.` |
| `lightcone-trace-eval` | `maios-demo` / superseded cluster | Archived; smaller; no PyPI | `[demo] Related trace-eval experiment (archived). See alawein/trace-eval.` |
| `ops-control-plane-grok` | `maios-superseded` | Archived; DECISIONS tombstone | `[superseded] Historical Grok ops pack. Operator SoR: Desktop ops-shared-inventory.` |
| `workspace-brain` | `maios-superseded` **HOLD** | DECISIONS says archived; API not archived | Propose label only after archive-state conflict resolved |
| `kohyr/.github` | (kohyr org; optional `maios-meta` if topics used) | Public shell | Keep company voice separate; do not force maios-* if Kohyr branding prefers none |
| Private product candidates (`adil`, `bolts`, `auditraise`, `atelier-rounaq`, `coding-phone`, `meshal-web`, …) | optional private `maios-active` / leave unlabeled | Private; zero external funnel | **Leave alone** beyond optional private labels |

README 3-line banners: propose only for **frozen/superseded** public repos after description/topics land (Session 1+).

### 4.4 `trace-eval` vs `trace_eval` (canonical proposal)

| Question | Finding | Label |
|---|---|---|
| Published package? | PyPI `trace-eval@0.2.0` homepage/source = `https://github.com/kin0kaze23/trace-eval` | **Verified** — **neither** alawein repo is the live PyPI publisher |
| Commit / content signal | `trace-eval`: created 2026-05-28, richer tree (src/tests/docs/pdf), tip 2026-05-29; `trace_eval`: created 2026-06-05, also full tree, tip 2026-06-07; both archived | **Verified** |
| Usage signal | No alawein → PyPI link; both archived; no stars checked as decisive | **Inferred** low external usage under alawein |
| Canonical among alawein pair | Prefer **`alawein/trace-eval`** as the named sibling (hyphen matches intended package id; older + documented DIMS4 description); keep `trace_eval` as duplicate tree with cross-link | **Inferred** (not archive yet) |
| Action now | Labels + cross-link descriptions only; **do not archive** (already archived); do not delete | Matches adopted strategy Session 1 |

### 4.5 Other collisions / predecessor pairs (prior audit missed or under-specified)

| Pair | Finding | Proposal |
|---|---|---|
| `outpost` / `outpost-archive` | Archive successor naming | `maios-superseded` on archive; active on outpost |
| `lightcone-trace-eval` | Third archived sibling | Cross-link into trace-eval cluster |
| PyPI `outpost` vs `outpost-kit` | Unrelated PyPI project | Mention in outpost description to prevent install confusion |
| Org `kohyr` description “AI control plane for agent fleets” | Conflicts with private claim ladder / product README | See §5 |
| `workspace-brain` archive flag vs DECISIONS | State conflict | Resolve archive bit before taxonomy “historical” claims |

---

## 5. kohyr claim-correction diff (Phase 2 item 1) — nothing applied

**Sources (Verified):** `kohyr/kohyr` README + `docs/product/CLAIM-LADDER.md` + `AGENTS.md`; live `profile/README.md` on `kohyr/.github`; org description via `gh api orgs/kohyr`; live `https://kohyr.ai` text sample; PR #1 empty vs main.

| Public claim (current) | Supported by private docs? | Proposed correction |
|---|---|---|
| Org description: “AI control plane for agent fleets” | **N** — product is local companion loop; “control plane” as tagline not earned; MAIOS owns “control plane” language for Desktop SoR | Change org description to something inside ladder, e.g. “Local job-completion loop for coding agents (pre-alpha).” Exact wording needs Meshal yes. |
| Profile lead already: “Run autonomous agents. Prove what they did.” | **Y** as marketing headline matching kohyr.ai; private README uses different product sentence | Keep headline **or** align to private README one-liner; do not claim ship. |
| Profile: “deterministic gate… signs every decision… **over any agent runtime**” | **N** for “over any agent runtime” — claim-lint / ladder treat runtime-neutral / “over any agent” as unearned | Drop “over any agent runtime.” Say “adapter-based local loop” or omit runtime claim. |
| Profile: “Status: early… Not yet released.” | **Y** | Keep. |
| Profile badges → kohyr.ai / contact | **Y** for links; **N** that kohyr.ai matches product | Keep links; fix site copy separately. |
| Live kohyr.ai: gate + signed record / “over any agent” / waitlist | **N** as product copy — private README explicitly: holding page is older pitch | Site cutover gated; until then add “holding page” clarity or narrow copy per CLAIM-LADDER. |
| Docs badge / docs.kohyr.ai | PR #1 body says dead link removed; current profile sample has no Docs badge | **Y** as current state | Keep absent until docs exist. |
| PR #1 “Rewrite profile README…” | Content already on `main`; PR tip empty commit | **Close PR** (separate exact-yes); do **not** treat merge as the fix for remaining drift |

**Not edited this pass.** Highest-cost residual after empty PR close: **org description** + **“over any agent runtime”** on profile + **kohyr.ai** holding copy.

---

## 6. Approval checklist (exact-yes lines)

### Phase 0 mutations (one line each)

1. exact-yes: **close** `kohyr/.github#1` (empty; already on main)
2. exact-yes: **merge** `alawein/knowledge-base#49` (CV locked employment fields) — after Kilo/review policy satisfied
3. exact-yes: **leave open** acknowledged for `alawein/alawein#269` draft (no merge) — optional; silence = leave
4. exact-yes: **close** `alawein/workspace-brain#1`
5. exact-yes: **close** `alawein/bolts#37` (Copilot draft)
6. exact-yes: **close** `alawein/qubeml#51` (Copilot draft)
7. exact-yes: **close** `alawein/scicomp#106` (Copilot draft)
8. exact-yes: **close** `alawein/optiqap#34` (Copilot draft)
9. exact-yes: **close** `alawein/ledger-voice-demo#2` (stale draft)
10. exact-yes: **close** `alawein/helios#4` (stale on archived)
11. exact-yes: **close** `alawein/alembiq#43` (conflicting WIP restore) — only if abandoned confirmed
12. exact-yes: **close** Dependabot PRs on archived `kohyr/kohyr-legacy` (#492,#497,#498,#499) and `kohyr/kohyr-internal-legacy` (#17,#18) as one **named batch ≤5?** → split: batch A legacy 4 PRs; batch B internal-legacy 2 PRs
13. exact-yes: **close** `alawein/meshal-web#72,#73,#74` if superseded by main pins (verify first)
14. exact-yes: **rebase+merge** `alawein/bolts#33` (named alone)
15. exact-yes: **rebase+merge** `alawein/bolts#34` (named alone)
16. exact-yes: **rebase or close** `alawein/bolts#35` (named alone)
17. exact-yes: **design-system security consolidation** plan (close #66–#77 after one green PR) — requires separate named yes per close or one batch ≤5 closes at a time
18. exact-yes: **delete leftover branches** on `alawein/meshal-web` with ahead=0 (named list required; max 5 per yes)
19. exact-yes: **delete** `kohyr/kohyr` branch `copilot/research-audit-kohyr-org` (identical)
20. exact-yes: **resolve** `MAIOS.md` tip vs `meshal-web` main before deleting `chore/vitest-4.1.11`

### Phase 2 metadata (nothing written until yes)

21. exact-yes: **apply** `kohyr` org description correction (paste final string in yes)
22. exact-yes: **edit** `kohyr/.github` `profile/README.md` to remove “over any agent runtime” (diff in yes)
23. exact-yes: **repin** alawein profile to proposed set (list exact six names in yes)
24. exact-yes: **add** 10-line map section to `alawein/alawein` README (PR path)
25. exact-yes: **topics+descriptions batch A** (flagships + meta): `alawein`, `chshlab`, `outpost`, `fallax`, `repo-drift` (≤5)
26. exact-yes: **topics+descriptions batch B** (frozen research): `maglogic`, `scicomp`, `qmatsim`, `spincirc`, `qubeml`
27. exact-yes: **topics+descriptions batch C** (superseded cluster): `outpost-archive`, `trace-eval`, `trace_eval`, `lightcone-trace-eval`, `ops-control-plane-grok`
28. exact-yes: **resolve workspace-brain archive flag** vs DECISIONS before labeling it superseded
29. exact-yes: **kohyr.ai copy cutover** (separate from GitHub; site change)

**No combined “approve all” line.**

---

## 7. Single next action

**Say exact-yes for checklist item 1** (`close kohyr/.github#1`) **or item 21** (org description string), then stop for the next named line.

---

## Appendix A — Evidence commands (sample)

```text
gh auth status
gh api user --jq .login                    # alawein
gh repo list alawein --limit 200 --json name,isPrivate,isArchived
gh repo list kohyr --limit 100 --json name,isPrivate,isArchived
gh search prs --owner alawein --state open --limit 1000
gh pr view 267|268 -R alawein/alawein      # MERGED
gh pr view 49 -R alawein/knowledge-base
gh api repos/alawein/{qmatsim,spincirc,qubeml}/contents/.github/workflows
gh api "search/issues?q=repo:alawein/maglogic+is:issue+is:open" --jq .total_count
Invoke-RestMethod https://pypi.org/pypi/trace-eval/json
Invoke-WebRequest https://chshlab.online -Method Head
gh api repos/kohyr/kohyr/readme
gh api orgs/kohyr --jq .description
```

## Appendix B — Locked-decision conflicts (do not silent-fix)

1. **DECISIONS R2** claims `workspace-brain` archived; live API `archived:false` and recent push.
2. **MAIOS.md** cites `meshal-web` tip `chore/vitest-4.1.11` @ `0dd2a1f`; compare shows that branch behind `main` by 1.

## Appendix C — Self-review

- Spec coverage: Phase 0–4 present; Dependabot and unsampled branches summarized with Unknown where incomplete.
- Placeholder scan: no TBD action steps; Unknown labeled where fleet-wide branch scan incomplete.
- Type consistency: topic names use hyphens (`maios-active`, …) per adopted strategy.
)
