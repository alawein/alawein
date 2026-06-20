---
type: internal
source: none
sync: none
sla: none
title: AI Code-Review Architecture and Claude Dispatch
description: How AI code review is layered across the alawein portfolio (tiering by activity + risk, tool-per-tier), and the design of a Claude-based review dispatch — an event-driven per-PR gate plus a scheduled backstop sweep — running on subscription auth.
category: spec
audience: [ai-agents, contributors]
status: draft
last_updated: 2026-06-19
tags: [code-review, ci, claude, greptile, coderabbit, governance, automation]
---

# AI Code-Review Architecture and Claude Dispatch

Status: draft
Owner: alawein
Date: 2026-06-19
Related: `docs/governance/repo-framework.md`, `2026-06-19-portfolio-conformance-map-design.md`

## Summary

A solo developer with 37 repos has no teammate second-reviewer, so AI review fills
that seat. The goal is to catch bugs and security issues before merge on the repos that
matter, without paying per-seat for redundant coverage, leaking private source to a third
party, or drowning low-traffic repos in bot noise.

The governing decision is **not "which bot, on all repos."** It is: tier the portfolio by
activity and risk, then map a review tool onto each tier. Most of the 37 repos are frozen,
archived, or idle and get near-zero pull requests; review tooling there is wasted. The live
set is small (~12 repos).

This spec records that tiering, the tool-per-tier mapping, and the design of a Claude-based
review dispatch built in two layers: an event-driven per-PR gate and a scheduled backstop
sweep. Owner decisions set for this build: deploy **both** layers (gate first, backstop
second), and bill review against the **Claude Code subscription** (OAuth token), not a
metered API key.

## Tiering the portfolio

Tier by PR activity and risk, not by tool.

| Tier | Repos | PR flow | Coverage intent |
|---|---|---|---|
| A — live + high-stakes | products (bolts, gymboy, repz, scribd), active ventures (veyra, attributa, llmworks), active tools (design-system, knowledge-base, workspace-tools, prompty, incore), the hub (alawein) | real | Strongest. Customer data / Stripe / shared infra. |
| B — live public research | adil, alembiq, chshlab, meatheadphysicist, optiqap, provegate | some | Free Greptile is pure upside here. |
| C — frozen / archived | most of `research/`, mercor, helios | ~none | No review tooling; they do not change. |

The Tier-A/B membership above is the working list. It should be derived from the catalog
(`lifecycle in {active, maintained}`) rather than hand-maintained, so it tracks reality.

## Tool-per-tier mapping

| Tool | Tier | Role | Billing / exposure |
|---|---|---|---|
| Greptile (free Developer tier) | B (public) | Per-PR review on public repos | Free; low exposure (public source). |
| CodeRabbit (already in the merge gate) | A (private) | Existing per-PR gate | Already paid and wired; do not stack a second paid bot on top. |
| Claude dispatch (this spec) | A | Per-PR gate + scheduled backstop | Subscription (OAuth token); no third-party egress beyond Anthropic. |
| Doctrine CI validators | all | Structure / voice / anti-rot | Free; already enforced. |

Greptile earns a place only as the free public-repo layer. It is a GitHub App that reviews
PRs reactively and is installed per-account through a browser flow (not scriptable here);
enable it on Tier-B public repos, leave "auto-enable future repos" off so it never silently
pulls in private repos.

## Claude dispatch design

Two layers. "Run `/code-review` across my repos" decomposes into a reactive gate and a
periodic sweep; the mature setup is both, the gate as the guarantee and the sweep as the
catch-all.

### Layer 1 — event-driven gate (per PR)

A reusable workflow using `anthropics/claude-code-action@v1`, triggered on `pull_request`,
authenticated with the subscription OAuth token. Rolled out to Tier-A repos.

```yaml
name: Claude Review
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main, master]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - 'LICENSE'

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          use_sticky_comment: true
          prompt: |
            Review this pull request for correctness bugs, security issues, and
            obvious reuse/simplification gaps. Be concise; report only high-confidence
            findings. Do NOT approve or merge. Post findings as one sticky comment.
```

Notes:
- `use_sticky_comment: true` keeps all feedback in one editable comment instead of scattering replies.
- `paths-ignore` skips docs-only PRs so review spend lands on code.
- The action's `github_token` is injected automatically; no extra secret for GitHub auth.

### Layer 2 — scheduled backstop (sweep)

One scheduled workflow, homed in the hub (`alawein/alawein`), that enumerates open PRs
across the Tier-A/B repo list and reviews any a gate missed (fast-merged before the gate
ran, or repos not yet rolled out). Staged for after the gate pilot is validated.

```yaml
name: Claude Review Backstop
on:
  schedule:
    - cron: "0 7 * * 1-5"   # 07:00 UTC weekdays
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  sweep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          github_token: ${{ secrets.PORTFOLIO_PR_TOKEN }}
          prompt: |
            For each repo in the active list, run `gh pr list --repo alawein/<repo>
            --state open`. For every open PR with no Claude review comment yet, fetch
            `gh pr diff` and post a concise findings comment (bugs, security, simplify).
            Do NOT approve or merge. Skip PRs already reviewed.
```

The backstop reaches other repos, so its `github_token` must be a PAT/app token with
`pull-requests: write` across the org (the default `GITHUB_TOKEN` is scoped to the hub
only). Call it `PORTFOLIO_PR_TOKEN`.

## Authentication and the token-expiry risk

Subscription billing requires the OAuth token path: run `claude setup-token` locally
(browser OAuth), store the `sk-ant-oat01-...` value as the `CLAUDE_CODE_OAUTH_TOKEN` repo
or org secret. The workflow input is `claude_code_oauth_token`.

**The load-bearing caveat:** the official `claude-code-action` docs do **not** state the
OAuth token's lifetime, and they recommend Workload Identity Federation (WIF) or an API key
for unattended CI. So:

- The subscription OAuth token works, but its expiry is undocumented. An unattended gate or
  a daily backstop can break **silently** when the token lapses.
- WIF and API key are the reliable unattended paths, but both bill against an Anthropic
  Console organization, **not** the personal subscription. They are not subscription billing.

Given the subscription choice, the mitigations are: (1) set a calendar reminder to
regenerate the token on a fixed cadence; (2) add a cheap liveness check (a weekly
`workflow_dispatch` smoke run whose failure notifies you); (3) if renewal becomes annoying,
move the **gate** to an API key for reliability and keep only the lower-stakes pieces on the
subscription token. This is the real cost of subscription billing for unattended review and
should be a conscious, revisitable trade.

## Rollout plan

1. **Pilot (this build).** Add `claude-review.yml` to `bolts` via a PR. Create the
   `CLAUDE_CODE_OAUTH_TOKEN` secret on `bolts` (or at the org) before merging, or the first
   run fails on a missing token. Merge, open a throwaway code PR, confirm the review comment
   and its quality.
2. **Sync to Tier-A.** Roll the validated workflow to the other Tier-A repos. Use
   `scripts/github/sync-github.sh`, but heed the known caveat (it can strip per-repo CI
   extensions): run `--check` first, and treat `claude-review.yml` as a synced file so it is
   not flagged as drift. Set the OAuth secret at the **org** level so each repo inherits it
   rather than pasting it 12 times.
3. **Enable Greptile on Tier-B** (separate, owner-run browser flow). Public repos only.
4. **Deploy the backstop.** After the gate is proven, add the scheduled workflow + the
   `PORTFOLIO_PR_TOKEN` to the hub. Start with `workflow_dispatch` only; add the cron once a
   manual run looks right.

## Risks and limitations

- **Token expiry (primary).** See above. The single most likely cause of silent failure.
- **Quota collision.** Heavy automated review shares the subscription rate limit with
  interactive Claude Code sessions; a big overnight sweep can throttle daytime work. Keep the
  backstop small and off-peak.
- **Bot redundancy.** On Tier-A private repos, CodeRabbit and the Claude gate both comment.
  That is intentional belt-and-suspenders, but watch for noise; if it is excessive, demote
  one to the backstop only.
- **sync-github.sh drift.** The rollout tool has destructive defaults; never sync without
  `--check` first.

## Out of scope

- Greptile installation (owner-run browser flow; covered conceptually, not built).
- Replacing or reconfiguring CodeRabbit.
- Auto-fix / auto-merge. This design only comments; it never approves or merges.
- Tier-C repos. They receive no review tooling.

## Open decisions for the owner

1. **Secret scope:** org-level `CLAUDE_CODE_OAUTH_TOKEN` (inherited by all Tier-A repos, one
   place to rotate) vs per-repo. Recommend org-level.
2. **Backstop reach:** keep the backstop hub-only enumerating the active list (needs
   `PORTFOLIO_PR_TOKEN`), or skip the backstop and rely on the gate plus per-repo Greptile/
   CodeRabbit. Recommend building the gate first and deciding the backstop after.
