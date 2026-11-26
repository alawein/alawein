# Review instructions

Review-only rules for this repository. Kilo Code reads this file from the base
branch. Other reviewers that load repository guidance should follow the same
routing. Reviewers read this file from the base branch, so merge a change here
before relying on it.

## Shared policy

The owner of these rules is `alawein/.github` `docs/system/reviewers.md`,
revision `2026-11-25`. If this file and that policy disagree, the policy wins.

- RV-001 routing: Kilo Code is the primary free automatic reviewer across
  in-scope repositories. CodeRabbit is selective automatic on an
  owner-named allow-list only (default off). Bugbot, Codex, Claude review,
  and Copilot run on demand on the owner's named request for one named
  risk. A request an agent posts for itself is not an owner request.
- RV-002 findings: findings are advice. Each needs evidence. Drop a finding
  whose root cause and path another reviewer or CI already reported on this
  revision.
- RV-003 access and spend: never quote secrets, credentials or private data in
  a finding. Path filters do not limit what a reviewer can read.
- RV-004 protected delivery: comment only. Never approve, request changes,
  push, merge, resolve another reviewer's thread or edit the PR. Required
  checks, signing and the owner's merge permission stay as they are. A
  skipped, paused, rate-limited or failed review is a visible blocker, never a
  pass.

## Labels

Start every finding with one label.

| Label | Use when |
| --- | --- |
| `bug:` | Wrong behavior, a broken contract, a security regression, data loss, a failed rollback or an unsupported public claim |
| `question:` | Intent is unclear and the answer changes correctness |
| `nit:` | Real but minor; at most 5 per review |

Then give the fact, `file:line`, the input or state that triggers it, and a
fix.

## Evidence bar

- Post a `bug:` only at 80% confidence or more, with a named trigger.
- Cite `file:line` for every behavior claim. A name alone is not evidence.
- Mark remote or account claims UNVERIFIED without current evidence.
- "No issues found at `<sha>`" is a complete review.

## Do not report

- Anything this repository's CI already owns (lint, link checks, actionlint,
  policy/title gates, language test jobs, and equivalent required checks).
- Style that no checked-in rule requires.
- Build output and vendored code: `dist/`, `build/`, `node_modules/`,
  `vendor/`.

Lockfiles stay in scope for integrity only: report an unexpected source,
version or hash change, never formatting.

## Always check

- Secrets: nothing credential-like in code, logs, fixtures or PR text.
- Workflows (when changed): full-SHA action pins, least-privilege
  `permissions`, `persist-credentials: false` where applicable, and no secrets
  in fork-reachable jobs.
- Owner gates: rulesets, signing, squash-only merges, no bypass actors and CI
  permissions change only with named owner approval.
- Protected delivery: do not weaken required checks to clear a reviewer skip.
