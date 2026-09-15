# Audit hygiene list — Task 7 Batch D (F006 / F007 / F009)

**Date:** 2026-09-15 PT  
**Station:** `core/alawein` on local branch `fix/audit-cleanup-2026-09-15`  
**Remote:** `alawein/alawein`  
**Evidence tier:** VERIFIED via `git ls-remote --heads origin`, `gh api .../branches`, `gh pr view`, `gh issue list`  
**Destructive actions this session:** none (no branch deletes, no PR/issue closes, no force-push, no merge)

---

## Step 1 — Remote heads (keep / delete candidates)

**Open PRs:** none (`gh pr list --state open` → `[]`).  
**Rule applied:** keep any branch backing an open PR → N/A; only `main` is required keep.

| Branch | Tip SHA | Last commit (UTC) | Candidate | Notes |
|--------|---------|-------------------|-----------|-------|
| `main` | `f323fee` | 2026-09-15T17:28:33Z | **KEEP** | Default branch |
| `feat/grok-thin-enforce-spend` | `8236bde` | 2026-09-15T03:48:45Z | **PARK** | Fresh tip; no open PR — owner confirm keep vs delete |
| `copilot/research-repo-exploration` | `f499c30` | 2026-09-15T03:08:10Z | **PARK** | Fresh tip; research agent branch |
| `feat/enforcement-live-fetch` | `55cc5d3` | 2026-09-14T04:35:09Z | **PARK** | Recent WIP; no open PR |
| `cursor/cloud-agent-1789312652331-jht5d` | `1bfdac8` | 2026-09-13T15:17:32Z | **DELETE?** | Cloud agent leftover |
| `copilot/research-alawein-portfolio-audit` | `1ec44b1` | 2026-09-13T13:49:11Z | **DELETE?** | Research leftover; no open PR |
| `governance/maios-north-star-2026-09-13` | `d6eef97` | 2026-09-13T17:19:38Z | **DELETE?** | Head of **closed** PR #275 (not merged) |
| `claude/slack-session-w2cgj7` | `42192cc` | 2026-09-08T09:42:23Z | **DELETE?** | Session leftover |
| `cursor/integration-probe-1170` | `e582e72` | 2026-09-08T19:26:00Z | **DELETE?** | Probe leftover |
| `cursor/lift-slack-gate-edad` | `5c01710` | 2026-09-07T21:56:06Z | **DELETE?** | Stale Cursor branch |
| `cursor/cursor-inventory-prove-b9eb` | `1813992` | 2026-09-07T08:42:00Z | **DELETE?** | Stale |
| `cursor/inventory-rescan-20260907-c75e` | `8f2aaca` | 2026-09-07T07:36:24Z | **DELETE?** | Stale |
| `cursor/catalog-live-20260907-32fb` | `83db81f` | 2026-09-07T07:05:28Z | **DELETE?** | Stale |
| `docs/public-readme-contract` | `c822e3f` | 2026-09-07T05:37:05Z | **DELETE?** | Stale docs branch |
| `cursor/slack-lane-d-reprobe-e5c0` | `af4ea92` | 2026-09-05T15:53:42Z | **DELETE?** | Stale |
| `cursor/phase-2-closeout-fbca` | `3e418d3` | 2026-09-05T13:16:36Z | **DELETE?** | Stale |
| `cursor/slack-agent-runbook-fbca` | `33439e7` | 2026-09-05T12:05:05Z | **DELETE?** | Stale |
| `docs/ship-reviewed-profile` | `2f5fcdf` | 2026-09-05T11:29:41Z | **DELETE?** | Stale |
| `fix/catalog-pinned-repo-visibility` | `8fa932d` | 2026-08-27T08:36:04Z | **DELETE?** | Stale |
| `docs/execution-plans` | `555b524` | 2026-06-20T07:13:56Z | **DELETE?** | Very stale (Jun 2026) |
| `docs/ai-review-architecture` | `224808b` | 2026-06-20T06:38:56Z | **DELETE?** | Very stale |
| `docs/portfolio-conformance-map` | `9189627` | 2026-06-20T04:50:19Z | **DELETE?** | Very stale |
| `fix/catalog-accuracy-corrections` | `d6f4d5e` | 2026-05-18T02:34:51Z | **DELETE?** | Oldest tip |

**Local-only (not on origin):** `fix/audit-cleanup-2026-09-15` — **KEEP** (active audit cleanup worktree).

**Stale remote-tracking note:** local `origin/cursor/reusable-slack-prompts-e806` may still appear after `git branch -r`; it is **absent** from `git ls-remote --heads origin` (merged PR #269 head already gone on remote). Run `git fetch --prune` locally to clear the tracking ref.

### Proposed delete batch (owner gate)

Exact names for approval line:

```text
Approve: delete stale branches F006
claude/slack-session-w2cgj7
copilot/research-alawein-portfolio-audit
cursor/catalog-live-20260907-32fb
cursor/cloud-agent-1789312652331-jht5d
cursor/cursor-inventory-prove-b9eb
cursor/integration-probe-1170
cursor/inventory-rescan-20260907-c75e
cursor/lift-slack-gate-edad
cursor/phase-2-closeout-fbca
cursor/slack-agent-runbook-fbca
cursor/slack-lane-d-reprobe-e5c0
docs/ai-review-architecture
docs/execution-plans
docs/portfolio-conformance-map
docs/public-readme-contract
docs/ship-reviewed-profile
fix/catalog-accuracy-corrections
fix/catalog-pinned-repo-visibility
governance/maios-north-star-2026-09-13
```

**Parked pending separate keep/delete call:**  
`feat/grok-thin-enforce-spend`, `feat/enforcement-live-fetch`, `copilot/research-repo-exploration`

**Deleted this session (standing Accept-all → F006):** all names in the proposed delete batch above.  
**Still parked:** `feat/grok-thin-enforce-spend`, `feat/enforcement-live-fetch`, `copilot/research-repo-exploration`.

---

## Step 3 — PR #275 / #269 (F007)

| PR | Title | State | Mergeable / status | Head branch | URL | Disposition |
|----|-------|-------|--------------------|-------------|-----|-------------|
| **#275** | docs(governance): lock MAIOS ownership and evidence boundaries | **CLOSED** (not merged) 2026-09-15T17:09:08Z | was `CONFLICTING` / `DIRTY` | `governance/maios-north-star-2026-09-13` | https://github.com/alawein/alawein/pull/275 | **Resolved as closed.** Head branch still on origin → include in F006 delete batch unless owner wants revive/rebase. Agent did not force-push or reopen. |
| **#269** | docs: curate reusable Slack prompt pack | **MERGED** | checks SUCCESS at merge time | `cursor/reusable-slack-prompts-e806` (gone from origin) | https://github.com/alawein/alawein/pull/269 | **Resolved as merged.** No further PR action. |

**Open PRs:** none. Acceptance “open PRs clean or explicitly parked” → satisfied (none open).

---

## Step 4 — Issues triage (F009)

**Open issues observed (`gh issue list --state open`):** only `#26`, `#42`–`#46`, `#241`.

| Issue | Title | Labels | Proposed action | Rationale |
|-------|-------|--------|-----------------|-----------|
| **#241** | Kernel canonicalization: wave rollout and remaining operations | P3, type:maintenance | **LEAVE OPEN** | Plan explicit: leave #241 open |
| **#26** | Weekly Governance: Score 0/100, 0 violations | governance-compliance, automated, type:maintenance | **CLOSE** (obsolete) *or* DEBT one-liner | Dec 2025 automated report against retired org monorepo names; not actionable on current station |
| **#42** | Deploy all platforms to Vercel | enhancement, P3, status:planned, type:feature | **CLOSE → DEBT** (public-readiness / platform infra) | Pre-consolidation multi-platform checklist; products no longer live in this control-plane tree the same way |
| **#43** | Set up Sentry error tracking for all platforms | same | **CLOSE → DEBT** | Same class as #42 |
| **#44** | Set up Stripe payments for commercial platforms | same | **CLOSE → DEBT** | Same class |
| **#45** | Set up Supabase auth for commercial platforms | same | **CLOSE → DEBT** (also gated by F001 rotation) | Same class; auth work must not precede credential containment |
| **#46** | Add open source licensing to MIT platforms | same | **CLOSE → DEBT** | Same class |

**Not closed this session** — plan: owner chooses per issue. Prefer evidence over destructive closes.

### Draft DEBT block (proposed; not written to `docs/DEBT.md`)

```markdown
### Pre-consolidation platform readiness issues (#42–#46, #26)
- **Date:** 2026-09-15
- **Where:** GitHub issues alawein/alawein #26, #42–#46
- **What:** Stale Dec 2025 platform checklists and one automated governance score issue remain open after monorepo consolidation; work is not station-scoped as written.
- **Risk if left:** Issue list looks actionable but is not; distracts from kernel/ops backlog (#241).
- **Suggested fix:** Close issues with link to this hygiene note / public-readiness ADR path; track real deploy/auth/payments/error-tracking per product repo when G8/visibility allows.
- **Owner:** alawein
```

Suggested close comment template (when approved):

```text
Closing as stale for alawein/alawein control-plane hygiene (audit F009, 2026-09-15).
Pre-consolidation platform checklist / automated governance noise.
Tracked as proposed DEBT in docs/superpowers/plans/2026-09-15-audit-hygiene-list.md.
See also public-readiness / platform-infra backlog outside this station.
```

---

## Acceptance vs this session

| Criterion | Status |
|-----------|--------|
| Only open-PR branches + `main` remain (or documented exceptions) | **Incomplete** — 22 non-main remote heads remain; delete gated on owner approval |
| Open PRs clean or explicitly parked | **Done** — zero open PRs; #269 merged, #275 closed |
| Only actionable issues open | **Incomplete** — #26/#42–#46 still open pending owner close-or-debt choice; #241 correctly left open |

---

## Blockers / Next owner lines

1. `Approve: delete stale branches F006` + paste exact branch list (or trimmed subset).
2. Per-issue: `Approve: close issues F009 #26 #42 #43 #44 #45 #46` (and whether to land the DEBT block in `docs/DEBT.md`).
3. Confirm PARK branches: keep or add to delete list (`feat/grok-thin-enforce-spend`, `feat/enforcement-live-fetch`, `copilot/research-repo-exploration`).
