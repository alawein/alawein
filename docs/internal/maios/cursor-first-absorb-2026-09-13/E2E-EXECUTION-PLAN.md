---
type: plan
status: draft
source: cursor-first absorb 2026-09-13
last_updated: 2026-09-13
owner: meshal
---

# E2E-EXECUTION-PLAN

Ordered checkboxes. Stop on failed verify. Exact-yes gates stay listed.

**For agentic workers:** Use executing-plans. Do not skip a verify step.

## Gates (always)

Stop and ask Meshal before: send, spend, publish, delete, merge, secret
rotate, Slack posts, new OAuth, Notion Morning Brief body writes.

This absorb mission already authorized: commit, push, draft PR for these
files only.

## Phase 0. Admission (this Cloud run)

- [x] Read `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `prompt-kits/AGENT.md`
- [x] Fetch `origin/main` (`c9eb9aa2`, #264)
- [x] Confirm no open catalog-land PR on `alawein/alawein`
- [x] Confirm Desktop pack absent
- [x] Confirm `alawein/knowledge-base` 404
- [x] Confirm Cloudflare Service Key EOL 2026-09-30 from official docs
- [x] Branch `cursor/cursor-first-absorb-295b`

**Verify:** `git rev-parse HEAD` equals `c9eb9aa2` before first absorb
commit. Failed: stop.

## Phase 1. Write absorb pack (this PR)

- [x] `IMPLEMENTATION-PLAN.md`
- [x] `ABSORB-SYNTHESIS.md`
- [x] `OPS-INVENTORY-REORG-PLAN.md`
- [x] `E2E-EXECUTION-PLAN.md`
- [x] `RED-TEAM.md`

**Verify:**

```bash
test -f docs/internal/maios/cursor-first-absorb-2026-09-13/ABSORB-SYNTHESIS.md
test -f docs/internal/maios/cursor-first-absorb-2026-09-13/OPS-INVENTORY-REORG-PLAN.md
test -f docs/internal/maios/cursor-first-absorb-2026-09-13/E2E-EXECUTION-PLAN.md
test -f docs/internal/maios/cursor-first-absorb-2026-09-13/RED-TEAM.md
python scripts/catalog/sync-readme.py --check
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/validate.py --ci
```

Failed: stop. Do not push.

## Phase 2. Draft PR (this run)

- [x] Commit absorb files as `contact@meshal.ai`
- [x] Push `cursor/cursor-first-absorb-295b`
- [x] Open draft PR (#265)
- [x] Record change evidence in the PR body
- [x] Do not merge

**Verify:** PR exists, `draft=true`, base `main`. Failed: stop.

## Phase 3. CV (BLOCKED this VM)

- [ ] [need this: knowledge-base read token or clone]
- [ ] Open `cv_body.tex` and record the KAUST date range as it is
- [ ] Open `career-main-overlays.json` and record the AGI overlay date
- [ ] Write failing tests for the named bugs
- [ ] Patch only those fields
- [ ] Re-run tests (red then green)
- [ ] Draft PR on knowledge-base
- [ ] Link from ABSORB-SYNTHESIS

**Verify:** tests fail on the old dates and pass on the new dates. Failed:
stop. Do not invent dates.

**Stop reason now:** `gh repo view alawein/knowledge-base` cannot resolve
the repository.

## Phase 4. Cloudflare (Meshal console)

- [ ] Meshal opens Cloudflare dashboard
- [ ] Search for Service Keys / `X-Auth-User-Service-Key`
- [ ] If present, create scoped API Tokens
- [ ] Swap callers (`cloudflared` November 2022 or later)
- [ ] Exact yes before any rotate
- [ ] Deadline: 2026-09-30

**Verify:** Meshal records which accounts were checked. This Cloud run
does not perform the check.

## Phase 5. Style (no draft thrash)

- [ ] ACK live Desktop rev f (done in ABSORB-SYNTHESIS)
- [ ] Meshal pastes Intake memory line on Grok Bot (Grok-local)
- [ ] Decision: pointer-sync land for 1.8.2 / rev e leftovers, or leave
- [ ] Do not rewrite RESPONSE-STYLE drafts

**Verify:** `prompt-kits/AGENT.md` still reads version 1.8.3 and rev f.
Failed: stop and report drift.

## Phase 6. Cleanup MOVE (laptop, after accept)

- [ ] Meshal exact yes for named MOVE set
- [ ] Cleanup writes manifest
- [ ] MOVE dated absorb sources to `_absorbed\2026-09-13-cursor-first\`
- [ ] Confirm live `RESPONSE-STYLE.md` stayed at SoR root
- [ ] sha256 before/after

**Verify:** manifest complete; no delete; no git add of Desktop files.
Failed: stop.

## Phase 7. Other surfaces

- [ ] Sider and other surfaces wait until Meshal tags them
- [ ] No Slack post of this pack unless Meshal exact yes
- [ ] No Notion Brief body write

## Stop table

| Failed verify | Action |
| --- | --- |
| Doctrine / README check | Fix or stop. Do not push |
| knowledge-base 404 | HOLD CV. Do not invent dates |
| Cloudflare account unread | HOLD. Meshal console |
| Desktop pack unread | Keep UNVERIFIED. Do not invent folders beyond declared names |
| Merge requested | BLOCK until Meshal exact yes |
