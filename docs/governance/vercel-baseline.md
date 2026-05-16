---
type: canonical
source: none
sync: none
sla: none
authority: doctrine
audience: [contributors, agents]
owner: meshal@kohyr.ai
status: active
last_updated: 2026-05-16
---

# Vercel baseline

Companion to [`github-baseline.md`](./github-baseline.md). Where `github-baseline.yaml` + `github-baseline-audit.py` declare and verify per-repo GitHub state, `catalog/repos.json` + `scripts/vercel/sync-vercel.py` declare and verify per-project Vercel state.

## Where the `vercel:` block lives

`catalog/repos.json` is the catalog source of truth. `projects.json` and the `catalog/generated/*` feeds are derived from it by `scripts/catalog/build-catalog.py`; they are never hand-edited. A repo opts in to Vercel governance by adding a `vercel:` block to its `catalog/repos.json` entry:

```jsonc
"vercel": {
  "team_slug": "morphism-systems",
  "project_slug": "auditraise",
  "production_url": null,
  "custom_domain": null,
  "state": "preview-only",
  "last_synced_at": "2026-05-14T00:00:00Z"
}
```

The first two fields are **declarative** — hand-edited, source of truth. The remaining four are **synced** — rewritten by `sync-vercel.py` from the Vercel API. The `catalog_lib.py` builders copy the block into the generated `projects.json` entry, so the curated index still answers "which Vercel team, what production URL, when last verified" in one file.

## State vocabulary

| State | Meaning |
|---|---|
| `production` | Latest production deployment under `VERCEL_STALE_DAYS` (default 30 days) old. |
| `preview-only` | Project exists at Vercel; no production deployment yet. |
| `stale` | Latest production deployment at least `VERCEL_STALE_DAYS` old. |
| `missing` | Block declares a project that the Vercel API returns 404 for. |

## Sync and audit

```bash
# Sync — fetch current state, rewrite synced fields, regenerate the catalog:
python scripts/vercel/sync-vercel.py

# Audit — never writes; recomputes against the live API; exit 1 on drift:
python scripts/vercel/sync-vercel.py --check

# Diff — show what sync would change to catalog/repos.json without writing:
python scripts/vercel/sync-vercel.py --dry-run
```

Default mode writes `catalog/repos.json` and then runs `build-catalog.py` to regenerate `projects.json` and the feeds, so the catalog stays internally consistent and `build-catalog.py --check` passes.

`--check` recomputes every block against the live API and compares the result to the stored value; drift, an orphan, or any API failure exits 1. A transient API error never reads as a clean run.

The weekly GitHub Action (`.github/workflows/sync-vercel.yml`) runs the sync mode every Monday 09:00 UTC and opens a PR if the catalog changed. The PR is a review checkpoint, not an auto-merge — every drift event gets a human look.

## Adding a new project

Add the `vercel:` block to the repo's entry in `catalog/repos.json`. Set `team_slug` and `project_slug` by hand. Leave `production_url` and `custom_domain` as `null`, set `state` to `"preview-only"`, and set `last_synced_at` to the current UTC timestamp. Run `python scripts/vercel/sync-vercel.py` once to populate the synced fields and regenerate the catalog.

## Orphans

A Vercel project not represented in `catalog/repos.json` is an orphan. Every sync run lists them on stderr as `ORPHAN team=<slug> project=<slug> url=<dashboard-url>`. Resolve by either:

1. Adding a `vercel:` block that claims it (declarative governance).
2. Deleting the Vercel project (real cleanup).

`--check` mode treats any orphan as drift and exits 1.

## Spec

Design notes: [`../internal/specs/2026-05-14-vercel-state-in-projects-json-design.md`](../internal/specs/2026-05-14-vercel-state-in-projects-json-design.md).
