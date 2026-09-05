---
type: canonical
status: accepted
last_updated: 2026-09-05
owner: meshal
---

# ADR 0002: Use reader-facing public READMEs

## Decision

Public repositories use a reader-facing README that presents the claim, run
path, scope, docs, and license. Private repositories retain the operational
record card. The profile README remains generator-owned and uses its approved
two-table variant.

The reusable doctrine workflow checks out its own scripts at
`${{ job.workflow_sha }}` from `${{ job.workflow_repository }}` and fails if
that called-workflow context is missing or malformed.

## Rationale

Inventory fields do not help a public reader decide whether and how to use a
project. The new contract puts evidence and a runnable path first without
forcing a private migration. GitHub documents `job.workflow_repository` and
`job.workflow_sha` as the repository and commit of the called reusable
workflow. Pinning that effective revision prevents the caller checkout from
silently selecting different doctrine scripts.

Source: [GitHub Actions contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#job-context).

## Consequences

Contracts, validators, fixtures, templates, and generated profile output must
change together. Public docs maps no longer require `SSOT.md` or `LESSONS.md`.

Fallax is the first pilot. Until the staged rollout completes, the hub's
GitHub fleet audits use `--allow-legacy-public`: existing READMEs retain their
type-based section and topology checks. READMEs containing `Run it`, `What it
is`, or `What it is not` use the new contract. Basic voice checks always run.
The transition option is unavailable in local or single-repo validation;
the reusable workflow and pilot always enforce the new contract.
