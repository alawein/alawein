---
type: derived
source: brainstorming session 2026-05-14
sync: none
sla: none
authority: spec
audience: [contributors, agents]
owner: meshal@kohyr.ai
status: draft
last_updated: 2026-05-16
---

# Vercel state in projects.json — design spec

> **NON-NORMATIVE.** This spec is a design artifact. The normative contract is `projects.schema.json`, the `scripts/vercel/sync-vercel.py` source, and `docs/governance/vercel-baseline.md`. If any of those diverge from this spec, the spec is stale.

> **REWORKED — catalog-sourced.** This spec was drafted when `projects.json` was hand-curated. It is now a generated artifact built from `catalog/repos.json` by `scripts/catalog/build-catalog.py`, and `build-catalog.py --check` is a CI gate. As shipped, the `vercel:` block lives in `catalog/repos.json`; the `catalog_lib.py` builders carry it into the generated `projects.json`; `sync-vercel.py` rewrites the block in `catalog/repos.json` and then regenerates the catalog. Where this spec says "edit `projects.json`", read "edit `catalog/repos.json`, then regenerate". The governance shape (declarative block, sync/audit loop, orphan detection) is unchanged.

## Context

`projects.json` (at the root of `alawein/alawein`) is the curated index of all alawein-org projects. As of 2026-05-14 it has four top-level sections:

- `featured` (~13 entries) — polished/commercial products: meshal.ai, Morphism, REPZ, Gymboy, etc. Fields: `name, slug, repo, description, tags, category, url, portfolio_domain`, optional `legacy_slugs`.
- `research` (~17 entries) — scientific/academic projects: Adil, qmlab, simcore, etc. Fields: `name, slug, repo, domain`, optional `url`, optional `category`, optional `legacy_slugs`.
- `infrastructure` (~10 entries on `origin/main`, ~13 with in-flight diff) — internal tooling / workspaces: Provegate, incore, prompty, Turing engagements, etc. Fields: `name, slug, repo, purpose, status, url`, optional `legacy_slugs`.
- `packages` (~6 entries) — published packages (npm + pypi). Fields: `name, registry, url, description`.

The file references a JSON schema (`$schema: ./projects.schema.json`) that does **not exist** in the repo. Every entry's structure is enforced today only by convention.

The repo already operates a governance pattern for GitHub: `github-baseline.yaml` declares per-repo intent, `scripts/github/github-baseline-audit.py` verifies the live state. That pattern works.

A parallel gap exists for Vercel state:

- `alawein/auditraise` was just imported into the `morphism-systems` team (display name "playground") but `projects.json` has no entry for it and no place to record which Vercel team a project belongs to.
- `qahwah-time` is in `projects.json` AND in Vercel, but the connection is implicit.
- `web` and `blackmalejournal` are in Vercel under `morphism-systems` but absent from `projects.json` entirely — drift in the other direction.
- Nothing audits this drift today; nothing reflects it in the curated index.

This spec closes that gap with the same shape as the GitHub governance: declarative file states intent, a sync/audit script closes the loop against the live Vercel API.

## Goals

In priority order:

1. **Governance:** every Vercel project under any team the alawein token can reach is either represented in `projects.json` with a verified `vercel:` block, or surfaced as an orphan finding in audit output.
2. **Operational visibility:** `projects.json` becomes a single-file answer to "which Vercel team is this in, what's its production URL, when was it last verified."
3. **Portfolio readiness (deferred):** schema reserves room for future portfolio-surface fields (`thumbnail`, `screenshot_url`) but doesn't require them in this round.

Non-goals: Netlify state, Cloudflare Pages state, custom DNS audit, paid-tier Vercel features (preview-deployment audit, analytics).

## Architecture

Three new artifacts plus targeted edits to existing files.

```
alawein/alawein/
├── projects.json                                   ← edited (auditraise entry, qahwah-time vercel block, lastUpdated bump)
├── projects.schema.json                            ← new (JSON Schema 2020-12, validates projects.json)
├── scripts/
│   └── vercel/
│       └── sync-vercel.py                          ← new (~250 LOC est.)
├── .github/
│   └── workflows/
│       └── sync-vercel.yml                         ← new (weekly cron, opens PR on drift)
└── docs/governance/
    └── vercel-baseline.md                          ← new (~1 page, ties script + workflow into governance doctrine)
```

Pattern alignment: the new files mirror the GitHub governance layout (`scripts/github/github-baseline-audit.py`, `docs/governance/github-baseline.md`). Anyone who understands the GitHub side will recognize the Vercel side.

## Per-entry `vercel` block

Optional. Present only on entries that deploy to Vercel. Attaches to entries in **any of** `featured`, `research`, `infrastructure`. (Not `packages` — those are published packages, not deployed apps.)

```jsonc
{
  "name": "Auditraise",
  "slug": "auditraise",
  "repo": "alawein/auditraise",
  // ... existing section-specific fields ...
  "vercel": {
    "team_slug": "morphism-systems",
    "project_slug": "auditraise",
    "production_url": null,
    "custom_domain": null,
    "state": "preview-only",
    "last_synced_at": "2026-05-14T00:00:00Z"
  }
}
```

### Field semantics

| Field | Maintenance | Type | Meaning |
|---|---|---|---|
| `team_slug` | Declarative (hand-edited) | non-empty string | Vercel team slug (e.g. `morphism-systems`). |
| `project_slug` | Declarative (hand-edited) | non-empty string | Vercel project slug as known to the Vercel API. |
| `production_url` | Synced | nullable string | Latest production deployment URL. `null` until first prod deploy. |
| `custom_domain` | Synced | nullable string | Bound custom domain (filters out `*.vercel.app`). `null` if Vercel-default-domain only. |
| `state` | Synced | enum | `production` \| `preview-only` \| `stale` \| `missing`. See vocabulary below. |
| `last_synced_at` | Synced | ISO 8601 string | When the sync script last verified this block. |

### `state` vocabulary

- `production` — Vercel reports a production deployment less than `VERCEL_STALE_DAYS` days old (default 30).
- `preview-only` — Vercel project exists, no production deployment yet (e.g. auditraise at time of writing).
- `stale` — Most recent production deployment is ≥ `VERCEL_STALE_DAYS` days old.
- `missing` — `projects.json` declares `team_slug` + `project_slug` but Vercel API returns 404 for that pair. The audit-drift case.

Entries with no `vercel:` block deploy elsewhere (Netlify / manual / none) and are not audited against Vercel.

## projects.schema.json (new)

JSON Schema 2020-12. Validates `projects.json` structurally and constrains the `vercel` block.

**Top-level required:** `lastUpdated` (ISO date), `featured` (array), `research` (array), `infrastructure` (array), `packages` (array).

**Section-specific entry shapes** (the four sections have meaningfully different fields and the schema reflects that):

| Section | Required fields | Optional fields |
|---|---|---|
| `featured` | `name`, `slug`, `repo` | `description`, `tags`, `category`, `url`, `portfolio_domain`, `legacy_slugs`, `vercel` |
| `research` | `name`, `slug`, `repo` | `domain`, `url`, `category`, `legacy_slugs`, `vercel` |
| `infrastructure` | `name`, `slug`, `repo` | `purpose`, `status`, `url`, `legacy_slugs`, `vercel` |
| `packages` | `name`, `registry`, `url` | `description` |

**Enums** (extracted from current data; future additions need a schema bump):

- `category` (on `featured` / `research`): `active`, `planned`, `maintained`, `archived`
- `status` (on `infrastructure`): `active`, `archived` (extend if/when needed)
- `registry` (on `packages`): `npm`, `pypi`
- `vercel.state`: `production`, `preview-only`, `stale`, `missing`

**Pattern constraints:**

- `slug`: lowercase kebab-case, `^[a-z][a-z0-9-]*$`
- `repo`: GitHub `owner/name` form, `^[a-zA-Z0-9_-]+/[a-zA-Z0-9._-]+$`
- `last_synced_at`: JSON Schema `format: date-time`
- `team_slug` / `project_slug`: non-empty string

The schema is referenced as `$schema: ./projects.schema.json` (already present in `projects.json:2`). Validation can run via `ajv-cli` or any standard JSON Schema validator; the sync script also validates internally before any mutation.

## sync-vercel.py (new)

Single Python 3.12 script. Dependencies: `requests` (HTTP) and `jsonschema` (validation). Both already permitted in this repo's tooling stack. Authenticates via `VERCEL_TOKEN` env var.

### Modes

```
python scripts/vercel/sync-vercel.py            # sync mode: read + rewrite projects.json
python scripts/vercel/sync-vercel.py --check    # audit mode: read-only, exit 1 on drift
python scripts/vercel/sync-vercel.py --dry-run  # show unified diff, do not write
```

### Sync algorithm

1. Load `projects.json`. Validate against `projects.schema.json`; abort with non-zero exit if invalid (drift in declarative fields is a hard fail before any API call).
2. Enumerate Vercel teams reachable from the token (`GET /v2/teams`). Build a `team_slug → team_id` map.
3. For each entry across `featured` + `research` + `infrastructure` with a `vercel:` block:
   - `GET /v9/projects/{project_slug}?teamId={team_id_for_team_slug}`.
   - If 404 → `state = "missing"`. Leave `production_url`, `custom_domain` untouched.
   - If 200 → `GET /v6/deployments?projectId={id}&target=production&limit=1`. If empty → `state = "preview-only"`, `production_url = null`. Otherwise compute age from `createdAt`; `state = "production"` if < `VERCEL_STALE_DAYS`, else `"stale"`. Set `production_url` from the deployment. Read project's `alias` array; first non-`*.vercel.app` entry becomes `custom_domain`, or `null`.
   - Always update `last_synced_at` to the run's UTC timestamp.
4. **Orphan check:** enumerate all projects under each known team (`GET /v9/projects?teamId=...`); for each Vercel project not matched by any entry's `vercel.project_slug`, emit a structured warn line to stderr in the form `ORPHAN team=<slug> project=<slug> url=<dashboard-url>`.
5. If `projects.json` content actually changed, write the file back with stable formatting: 2-space indent, key order preserved, deterministic field order within `vercel:` blocks (`team_slug, project_slug, production_url, custom_domain, state, last_synced_at`).
6. Exit 0 unless `--check` and drift detected, in which case exit 1.

### Audit mode (`--check`)

Never writes. Exits 1 if any of:

- Drift between the file's synced fields and freshly-fetched values
- Any orphan Vercel project (in Vercel, not in file)
- Any entry with `state: "missing"`
- Any entry with `last_synced_at` older than `VERCEL_SYNC_MAX_AGE_DAYS` (default 14)

### Auth handling

Script reads `VERCEL_TOKEN` from env. Local: developer exports it (or sources from `.env`, which is gitignored). CI: GitHub repo secret. Token never persisted to disk; never printed in any log line.

### Error handling

- Any 5xx from Vercel API → retry with exponential backoff up to 3 attempts.
- Any 4xx other than 404-on-project → abort with non-zero exit and a clear stderr message identifying the failing call.
- A network error → same retry/abort path.

## .github/workflows/sync-vercel.yml (new)

- **Trigger:** `schedule: cron '0 9 * * 1'` (Monday 09:00 UTC) + `workflow_dispatch` for manual runs.
- **Steps:** checkout → setup-python (3.12) → `pip install requests jsonschema` → `python scripts/vercel/sync-vercel.py`.
- **Drift handling:** if `git status --porcelain` after the script is non-empty, open a PR (not a direct commit) via `peter-evans/create-pull-request@v6`, titled `chore(governance): sync vercel state YYYY-MM-DD`. PR body lists which entries changed and any orphan warnings. PR-not-direct-commit is deliberate: drift may indicate either a manual edit or a renamed/moved project; a human should look.
- **Token:** `VERCEL_TOKEN` from `secrets.VERCEL_TOKEN` (added separately; bootstrapping the secret is out of scope of this spec).
- **Failure behavior:** on script exit ≠ 0, workflow fails (red X in Actions). No PR opened.

## projects.json edits

Three changes in this PR (note: at time of spec writing, `projects.json` has unrelated in-flight edits on the working tree — the implementation plan will sequence around them):

1. Bump `lastUpdated` to `2026-05-14` (resolves with whatever value the working-tree edits land on).
2. Add `Auditraise` to `featured`, with the `vercel:` block pre-populated. `production_url` and `custom_domain` start `null`; the next sync run (or first deploy) populates them.
3. Add a `vercel:` block to the existing `qahwah-time` entry under `featured`. Pre-populate from a one-off lookup against the Vercel API. (No other existing entries get `vercel:` blocks in this PR — the sync script's orphan-flagging will surface candidates over time.)

### Auditraise entry shape

```jsonc
{
  "name": "Auditraise",
  "slug": "auditraise",
  "repo": "alawein/auditraise",
  "description": "AI-assisted small-business marketing audits with Stripe checkout and operator report editor.",
  "tags": ["Next.js", "TypeScript", "Stripe", "Prisma", "NextAuth"],
  "category": "active",
  "url": null,
  "portfolio_domain": "Work",
  "vercel": {
    "team_slug": "morphism-systems",
    "project_slug": "auditraise",
    "production_url": null,
    "custom_domain": null,
    "state": "preview-only",
    "last_synced_at": "2026-05-14T<HH:MM:SS>Z"
  }
}
```

**Section choice (`featured` vs `infrastructure`):** auditraise is a commercial product launching to external customers with a portfolio surface — `featured` matches its peers (REPZ, Bolts, Scribd, Atelier Rounaq). Override if you prefer otherwise; the implementation plan can move it.

## docs/governance/vercel-baseline.md (new)

Short companion to `github-baseline.md`. Explains:

- What `vercel:` blocks declare
- How the sync script + workflow keep them current
- How `--check` mode is used in audit contexts
- How to add a new entry (declarative fields only — sync fills the rest)

~1 page. Plain prose. References this spec.

## Migration plan

After the four new files land:

1. Land the PR — schema, script, workflow, doc, plus the three `projects.json` edits.
2. Run `python scripts/vercel/sync-vercel.py --dry-run` locally. Verify the diff matches expectations (only the two entries with `vercel:` blocks get synced fields updated; orphan warnings list `web` and `blackmalejournal`).
3. Run without `--dry-run`. Commit the resulting `last_synced_at` updates.
4. Set `VERCEL_TOKEN` repo secret. First scheduled workflow run will be a no-op (file matches reality).
5. Follow-up PRs (out of scope): decide what to do with `web` and `blackmalejournal` orphans — add to `infrastructure`, mark as archived, or remove from Vercel.

## Out of scope (explicit YAGNI)

- Backfilling `vercel:` blocks on entries other than `auditraise` and `qahwah-time`. Most featured/research/infrastructure projects do not deploy to Vercel; orphan detection over time is the right discovery mechanism.
- Resolving the stale workspace-root copy of `projects.json` at `Dropbox/Github/alawein/projects.json` (separate file, not a symlink). The canonical-vs-duplicate question was answered ("repo is canonical"); reconciling the duplicate is a follow-up (delete? symlink? Dropbox script?).
- Multi-team-scope features beyond `morphism-systems`. The script generalizes to N teams, but only one team has any Vercel projects today.
- Portfolio-surface fields (`thumbnail`, `screenshot_url`).
- Netlify, Cloudflare Pages, or other deploy targets. If they become real, add parallel `netlify:` / `cloudflare:` blocks following the same pattern.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| `VERCEL_TOKEN` leaks into logs or commits | Script never prints the token. Workflow uses `secrets.VERCEL_TOKEN` (masked in Actions output). No `.env` ever committed. |
| Vercel API schema changes break the script | All API responses parsed via narrow accessors; unexpected shapes log and skip the offending entry rather than crashing the run. |
| Sync workflow opens a noisy weekly PR | PR opens only on actual drift. Steady state = no PR. If steady-state churn appears, threshold knobs (`VERCEL_STALE_DAYS`, `VERCEL_SYNC_MAX_AGE_DAYS`) can dampen. |
| Editor of `projects.json` introduces structural drift | Schema validation runs at the start of every sync; structural drift is a hard fail with a clear error before any API call. A `pre-commit` hook for `ajv-cli` could be a follow-up. |
| In-flight working-tree edits to `projects.json` conflict with this PR's edits | The implementation plan sequences the auditraise entry insertion AFTER the user's in-flight diff lands (or rebases on it). Validation runs at every commit step to catch structural drift early. |
| Orphans go unaddressed | Each `--check` run lists them; weekly workflow surfaces them via PR body. They don't block other governance. |

## Acceptance criteria

1. `projects.schema.json` exists, is valid JSON Schema 2020-12, and validates the current `projects.json` (post-edits) without errors.
2. `python scripts/vercel/sync-vercel.py --check` exits 0 immediately after the migration run.
3. `python scripts/vercel/sync-vercel.py --dry-run` after manually staling a `last_synced_at` to 2026-04-01 shows a non-empty diff and exits 0.
4. `python scripts/vercel/sync-vercel.py --check` after the same stale exits 1.
5. Sync workflow runs successfully on `workflow_dispatch` and opens no PR when the file is current.
6. Auditraise entry is in `featured` with `state: "preview-only"`.
7. Orphan list output mentions `web` and `blackmalejournal` (assuming they still exist under `morphism-systems` at the time of the run).
