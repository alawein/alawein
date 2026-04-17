---
type: canonical
source: none
sync: none
sla: none
title: New Repo Bootstrap Guide
description: End-to-end process for adding a new doctrine-compliant repo to the alawein workspace
last_updated: 2026-04-16
category: governance
audience: [contributors, ai-agents]
status: active
author: Morphism Systems Inc.
version: 1.0.0
tags: [governance, bootstrap, onboarding, doctrine]
---

# Bootstrapping a new repo into the alawein workspace

End-to-end process for adding a new doctrine-compliant repository. From zero
to green CI. Every step lists the validator that enforces it so a contributor
can run the same checks the control-plane CI runs.

## 0. Prerequisites

- Write access to `github.com/alawein` (or the target org)
- `gh` CLI authenticated as an org admin
- Local clone of `alawein/alawein` at
  `~/Desktop/Dropbox/GitHub/alawein/alawein/`
- Python 3.12+, Node 20+, `uv` for Python dependency management

## 1. Scaffold the directory

From the workspace root (`~/Desktop/Dropbox/GitHub/alawein/`):

```bash
bash alawein/scripts/bootstrap-repo.sh product <repo-slug>
cd <repo-slug>
```

`bootstrap-repo.sh` emits `README.md`, a derived `CLAUDE.md` pointing at
the org canonical, `docs/INDEX.md`, `.gitignore`, and `scripts/validate.sh`.

Repo type selector:

- `product` -- application repos with source code and deployments
- `infra` -- Terraform or infrastructure repos
- `org` -- a new governance-plane repo (rare; coordinate with workspace owner
  before using)

## 2. Add the required canonical surfaces

`bootstrap-repo.sh` emits the minimum. The documentation contract (`scripts/
validate-doc-contract.sh --full`) requires these additional files at the
repository root:

- `AGENTS.md` -- agent-facing contract (frontmatter: `type: canonical`,
  `last-verified`)
- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` (frontmatter:
  `type: canonical`, `last_updated`)
- `CHANGELOG.md` -- keepachangelog format (`type: canonical`, `last_updated`)
- `SSOT.md` -- current state and active decisions (`type: canonical`,
  `last-verified`)
- `LESSONS.md` (`type: canonical`, `last-updated`)
- `LICENSE` -- MIT unless the repo owner specifies otherwise
- `docs/README.md`
- `docs/governance/documentation-contract.md`
- `docs/governance/workspace-master-prompt.md`
- `docs/governance/workflow.md`

Copy from `templates/scaffolding/` where a template exists:

```bash
cp ../alawein/templates/scaffolding/README.product.md README.md
cp ../alawein/templates/scaffolding/docs-README.md docs/README.md
```

Every canonical markdown file needs doctrine frontmatter. Template:

```yaml
---
type: canonical
source: none
sync: none
sla: none
last_updated: YYYY-MM-DD
---
```

`README.md` and `docs/README.md` are GitHub-facing exempt surfaces. They
must not carry visible frontmatter -- the `docs-doctrine.md` rule and
`validate-doctrine.py` exempt list enforce this.

## 3. Register in the catalog

The catalog (`alawein/catalog/repos.json`) is the single source of truth
for repo metadata. `projects.json` is derived from the catalog by
`scripts/build-catalog.py`; do not hand-edit `projects.json`.

Add an entry including every field in `catalog_lib.REQUIRED_REPO_FIELDS`.
Minimum viable entry:

```json
{
  "name": "My Repo",
  "slug": "my-repo",
  "repo": "alawein/my-repo",
  "local_path": "my-repo",
  "type": "product",
  "surface": "web",
  "stack": ["Next.js", "TypeScript"],
  "domain": "personal",
  "lifecycle": "active",
  "visibility": "public",
  "owner": "alawein",
  "maintainer": "contact@meshal.ai",
  "docs_owner": "contact@meshal.ai",
  "theme_family": "neutral",
  "brand_family": "alawein",
  "status": "active",
  "canonical_description": "One-line description for README pins.",
  "github_topics": ["nextjs", "typescript"],
  "github_custom_properties": { "repo_archetype": "product" },
  "depends_on": [],
  "provides": [],
  "version_source": "package.json",
  "last_verified": "YYYY-MM-DD",
  "catalog_groups": ["featured"]
}
```

Run the derivers:

```bash
python alawein/scripts/build-catalog.py
python alawein/scripts/sync-readme.py
```

Commit `catalog/repos.json`, `projects.json`, and `README.md` together. The
`readme-sync.yml` workflow will fail on drift if they land in separate
commits.

## 4. Wire GitHub repo settings

From within `alawein/`:

```bash
python scripts/github-baseline-audit.py --repo alawein/<slug> --apply
python scripts/sync-github-metadata.py --repo alawein/<slug>
```

This applies the governed label set, branch protection, default workflow
permissions, and custom properties declared in `github-baseline.yaml` and
`catalog/repos.json`.

## 5. Configure CI

Use the reusable doctrine workflow. In the new repo, add
`.github/workflows/doctrine.yml`:

```yaml
name: Doctrine
on:
  pull_request:
  push:
    branches: [main]
jobs:
  doctrine:
    uses: alawein/alawein/.github/workflows/doctrine-reusable.yml@main
    with:
      strict: "true"
```

Language-specific CI should follow the shapes in
`alawein/.github/workflows/ci-node.yml` and `ci-python.yml` (Node and Python
respectively). Pin all action versions to a commit SHA, not a tag.

## 6. Wire Vercel (only for web surfaces)

```bash
vercel link --yes --scope alawein --project <slug>
vercel env pull .env.local
```

Then record the deployment in `knowledge-base/db/assets/domain-registry.md`
-- that file is the domain SSOT. Record the entry *before* creating custom
domains or DNS records, not after. If the registry and live DNS disagree,
the registry wins.

## 7. Verify doctrine validation passes

From the new repo root:

```bash
bash ../alawein/scripts/validate-doc-contract.sh --full
python ../alawein/scripts/validate-doctrine.py . --ci
python ../alawein/scripts/validate-no-ai-attribution.py
```

All three must exit 0. Common failures and remedies:

- `missing required file: SSOT.md` -- add the file from step 2.
- `<doc> is N days old; canonical docs must be <= 30 days old` -- bump the
  `last-verified:` key in frontmatter.
- `broken local link target` -- the referenced file does not exist relative
  to the markdown file; fix the target path or remove the markdown link.
- `Duplicate canonical: CLAUDE.md` -- the repo-local `.claude/CLAUDE.md`
  must declare `type: derived`, not `canonical`.
- `forbidden attribution` -- remove AI attribution trailers or robot emoji
  from managed docs.

## 8. Sync the org-level CLAUDE.md

```bash
bash ../alawein/scripts/sync-claude.sh
```

This projects the org `CLAUDE.md` into the repo's `.claude/CLAUDE.md` with
per-repo filters. Commit the result in the same PR as the catalog entry
so the projection stays aligned with the registered repo metadata.

## 9. Open the first PR

The first PR should contain:

- All files from steps 1-2 (scaffold + canonical surfaces)
- The catalog entry from step 3, plus the regenerated `projects.json` and
  `README.md`
- The doctrine workflow from step 5
- The projected `.claude/CLAUDE.md` from step 8

Expected green checks: `doctrine`, `docs-validation` (upstream in `alawein`),
`ci-node` or `ci-python`, `codeql`.

## 10. Post-merge

- Add to the Notion project database. See `.claude/commands/notion-sync.md`.
- Pin on the GitHub profile if relevant: edit `profile-from-guides.yaml`
  `profile_pins` in `alawein/`; `sync-readme.py` will regenerate the
  profile README with the new pin.
- Announce in the `workspace-tools` changelog if the repo introduces a new
  automation surface that other repos should adopt.

## Validator reference

| Validator | Location | Purpose |
| --- | --- | --- |
| `validate-doc-contract.sh` | `alawein/scripts/` | Required files, frontmatter keys, canonical age, naming, local links |
| `validate-doctrine.py` | `alawein/scripts/` | Doctrine rules R1-R5, R9 (classification, duplicates, naming, zombies) |
| `validate-catalog.py` | `alawein/scripts/` | `catalog/repos.json` integrity and taxonomy compliance |
| `validate-projects-json.py` | `alawein/scripts/` | `projects.json` schema conformance and archived-CI drift |
| `validate-no-ai-attribution.py` | `alawein/scripts/` | Scans managed docs for forbidden AI attribution |
| `sync-readme.py --check` | `alawein/scripts/` | Confirms the generated profile README matches catalog + profile config |
