# AI Review Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the Claude per-PR review gate from the `bolts` pilot to all Tier-A repos, then add the scheduled backstop, billed against the Claude Code subscription.

**Architecture:** A canonical `claude-review.yml` (SHA-pinned actions) is validated on `bolts`, then rolled to Tier-A via `sync-github.sh`, with the OAuth secret set once at the org level. A backstop workflow plus a fine-grained PAT live in the hub, dispatch-first then cron. The test cycle is the workflow actually running on a PR and posting a review comment.

**Tech Stack:** GitHub Actions, `anthropics/claude-code-action`, `gh` CLI, `scripts/github/sync-github.sh`.

## Global Constraints

- **Subscription billing -> OAuth token.** Use the `claude_code_oauth_token` input fed by the `CLAUDE_CODE_OAUTH_TOKEN` secret (from `claude setup-token`). Not an API key.
- **Actions MUST be SHA-pinned.** The portfolio has a SHA-pin gate. Pin `actions/checkout` to the hub's known-good `de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2`; resolve and pin `anthropics/claude-code-action@v1` to a SHA (Task 1).
- **Comment-only.** The reviewer never approves or merges.
- **Name is `claude-review.yml`.** The hub already has `ai-review.yml` (a prompt-kit/catalog annotator, unrelated); do not reuse that name.
- **`sync-github.sh` has destructive defaults.** Always run `--check` first; it can strip per-repo CI extensions (memory `reference-sync-github-destructive-defaults`).
- **Tier-A repos:** bolts, gymboy, repz, scribd, veyra, attributa, llmworks, design-system, knowledge-base, workspace-tools, prompty, incore, alawein (hub).
- **Token-expiry is the primary risk.** Unattended runs can break silently when the OAuth token lapses; a liveness check and renewal reminder are required (Task 6).

---

### Task 0: Create the OAuth secret (owner-only, blocking)

**Why:** every downstream task fails without it. Only the account owner can run `claude setup-token`.

- [ ] **Step 1: Generate the token**

Run (in this session): `! claude setup-token`
Expected: a browser OAuth flow, then a printed `sk-ant-oat01-...` token.

- [ ] **Step 2: Store it as an org secret**

```bash
gh secret set CLAUDE_CODE_OAUTH_TOKEN --org alawein --visibility all --body "<token>"
```

Expected: `✓ Set Actions secret CLAUDE_CODE_OAUTH_TOKEN for alawein`. Org scope means every Tier-A repo inherits it; no per-repo paste.

---

### Task 1: SHA-pin the pilot workflow actions

**Files:** Modify (bolts repo, branch `ci/claude-review-pilot`): `.github/workflows/claude-review.yml`

**Why:** the pilot (PR #17) uses `actions/checkout@v4` and `anthropics/claude-code-action@v1`, which the SHA-pin gate rejects.

- [ ] **Step 1: Resolve the action SHAs**

```bash
gh api repos/anthropics/claude-code-action/git/refs/tags/v1 -q '.object.sha'
```

Expected: a 40-char commit SHA. (For `actions/checkout`, reuse the hub's pinned `de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2`.)

- [ ] **Step 2: Pin both `uses:` lines**

Change `uses: actions/checkout@v4` -> `uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2` and `uses: anthropics/claude-code-action@v1` -> `uses: anthropics/claude-code-action@<sha-from-step-1> # v1`.

- [ ] **Step 3: Confirm the SHA-pin gate is satisfied**

Run the repo's pin check if present, e.g.: `gh pr checks 17 --repo alawein/bolts`
Expected: the action-pinning check passes (or is no longer the failing one).

---

### Task 2: Validate the gate on bolts

**Interfaces:** Consumes the org secret (Task 0) and the pinned workflow (Task 1).

- [ ] **Step 1: Merge the pilot**

```bash
gh pr merge 17 --repo alawein/bolts --squash --delete-branch
```

- [ ] **Step 2: Trigger a real review**

Open a throwaway code PR on bolts (a one-line change to a source file, not docs — `paths-ignore` skips docs).

- [ ] **Step 3: Verify the review comment**

Run: `gh pr view <n> --repo alawein/bolts --comments`
Expected: a single sticky "Claude Review" comment with findings; no 401/auth error in the Actions log. If auth fails, the token or its org visibility is wrong — fix before rolling out.

- [ ] **Step 4: Judge quality**

Read the comment. If it is noisy or low-signal, tune the `prompt:` block in `claude-review.yml` before syncing (cheaper to fix on one repo than thirteen).

---

### Task 3: Canonicalize the workflow for sync

**Files:** Add the validated `claude-review.yml` to the sync source so `sync-github.sh` treats it as managed, not drift.

- [ ] **Step 1: Find where sync reads its managed files**

Run: `grep -nE "workflows|\.github|managed|template" ~/alawein-hub/scripts/github/sync-github.sh | head`
Expected: the path(s) sync-github.sh copies workflow files from.

- [ ] **Step 2: Place the canonical workflow there**

Copy the validated `claude-review.yml` into that managed location and register it (per the script's manifest mechanism) so it is synced and not reported as a per-repo extension to strip.

- [ ] **Step 3: Dry-run the sync (no writes)**

Run: `bash ~/alawein-hub/scripts/github/sync-github.sh --check`
Expected: the diff shows `claude-review.yml` being added to Tier-A repos and nothing unexpected stripped. If it shows removals of other repos' CI, stop and mark those repos `sync:manual`.

---

### Task 4: Roll out to Tier-A

- [ ] **Step 1: Apply the sync**

Run: `bash ~/alawein-hub/scripts/github/sync-github.sh` (after a clean `--check`)
Expected: `claude-review.yml` lands on each Tier-A repo via a branch/PR per the script's model.

- [ ] **Step 2: Spot-check three repos**

For gymboy, design-system, and prompty: `gh pr list --repo alawein/<repo>` shows the sync PR; the workflow file matches the canonical one; existing CI is intact.

- [ ] **Step 3: Merge the sync PRs**

Merge each once its own CI is green. Open a throwaway PR on one rolled-out repo (e.g. gymboy) to confirm the gate fires there too.

---

### Task 5: Deploy the backstop (after the gate is proven)

**Files:**
- Create (hub repo): `.github/workflows/claude-review-backstop.yml`
- Secret (hub repo): `PORTFOLIO_PR_TOKEN` (fine-grained PAT)

**Why:** catches PRs the gate missed (fast-merged, or repos not yet rolled out). Reaching other repos needs a token broader than the hub's default `GITHUB_TOKEN`.

- [ ] **Step 1: Create the cross-repo PAT**

Create a fine-grained PAT scoped to the active repos with `Pull requests: read/write` and `Contents: read`. Store it: `gh secret set PORTFOLIO_PR_TOKEN --repo alawein/alawein --body "<pat>"`.

- [ ] **Step 2: Add the backstop workflow (SHA-pinned, dispatch-only first)**

Create `.github/workflows/claude-review-backstop.yml` with `on: workflow_dispatch` only (no cron yet), the SHA-pinned `claude-code-action`, `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}`, `github_token: ${{ secrets.PORTFOLIO_PR_TOKEN }}`, and the sweep prompt from the spec (enumerate open PRs across the active list, review any without a Claude comment, comment-only).

- [ ] **Step 3: Manual smoke run**

Run: `gh workflow run claude-review-backstop.yml --repo alawein/alawein`
Expected: the run enumerates open PRs and posts review comments only where missing; no duplicate comments on already-reviewed PRs.

- [ ] **Step 4: Add the cron once the manual run looks right**

Add `schedule: - cron: "0 7 * * 1-5"` (07:00 UTC weekdays, off-peak to limit quota collision with interactive work). Commit on a branch + PR.

---

### Task 6: Liveness and renewal (close the token-expiry gap)

- [ ] **Step 1: Add a weekly liveness smoke**

Add a minimal scheduled `workflow_dispatch`-able job that runs the action with a trivial prompt and fails loudly on a 401, on a weekly cron. A failure is the early-warning that the OAuth token lapsed.

- [ ] **Step 2: Set a renewal reminder**

Until the token lifetime is confirmed, set a recurring calendar reminder to re-run `claude setup-token` and `gh secret set CLAUDE_CODE_OAUTH_TOKEN --org alawein ...`. If renewal proves frequent/annoying, switch the **gate** to an `ANTHROPIC_API_KEY` for reliability (accepting API billing for the gate) and keep the backstop on the subscription token.

## Self-Review notes

- Spec coverage: gate (T1-T4), backstop (T5), auth + token-expiry mitigation (T0, T6), SHA-pin constraint (T1, T5), sync caveat (T3). Greptile install and CodeRabbit are out of scope per the spec.
- Ordering: T0 blocks everything; "gate then backstop" is enforced by T5 depending on T2/T4 passing. T6 can run in parallel once T2 proves auth works.
- Owner-only steps (T0, the PAT in T5, the calendar reminder in T6) are flagged; an agent executor must pause for these.
