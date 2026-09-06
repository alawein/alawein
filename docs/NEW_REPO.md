---
type: canonical
source: none
sync: none
sla: none
title: New Repo Bootstrap Guide
description: End-to-end process for adding a new doctrine-compliant repo to the alawein workspace
last_updated: 2026-09-06
category: governance
audience: [contributors, ai-agents]
status: active
author: Kohyr Inc.
version: 1.0.0
tags: [governance, bootstrap, onboarding, doctrine]
---

# Bootstrapping a new repo into the alawein workspace

End-to-end process for adding a new doctrine-compliant repository. From zero
to green CI. Every step lists the validator that enforces it so a contributor
can run the same checks the control-plane CI runs.

## 0. Prerequisites

- Write access to `github.com/alawein` (or the target org)
- `gh` CLI authenticated for the target repository
- Local clone of `alawein/alawein` at
  `~/Desktop/GitHub/alawein/core/alawein/`, outside cloud-synced folders
- Python 3.12+, Node 20+, `uv` for Python dependency management

## 1. Scaffold the directory

Set the existing workspace path, then scaffold a product in its `apps` bucket:

```bash
WORKSPACE_ROOT="$HOME/Desktop/GitHub/alawein"
CONTROL_PLANE="$WORKSPACE_ROOT/core/alawein"
export ORG_REPO_PATH="$CONTROL_PLANE"
cd "$WORKSPACE_ROOT/apps"
bash "$CONTROL_PLANE/scripts/ops/bootstrap-repo.sh" product <repo-slug>
cd <repo-slug>
```

`bootstrap-repo.sh` emits `README.md`, a placeholder `CLAUDE.md`,
`docs/INDEX.md`, `.gitignore`, and `scripts/validate.sh`.

Repo type selector:

- `product` -- application repos with source code and deployments
- `infra` -- Terraform or infrastructure repos
- `org` -- a new governance-plane repo (rare; coordinate with workspace owner
  before using)

## 2. Add the required canonical surfaces

`bootstrap-repo.sh` emits the minimum. The documentation contract
(`scripts/doctrine/validate-doc-contract.sh --full`) requires these additional files at the
repository root:

- `AGENTS.md` -- agent-facing contract (frontmatter: `type: canonical`,
  `last-verified`)
- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` (frontmatter:
  `type: canonical`, `last_updated`)
- `CHANGELOG.md` -- keepachangelog format (`type: canonical`, `last_updated`)
- `SSOT.md` -- current state and active decisions (`type: canonical`,
  `last-verified`)
- `LESSONS.md` (`type: canonical`, `last-updated`)
- `LICENSE` -- the license approved by the repo owner
- `docs/README.md`
- `docs/governance/documentation-contract.md`
- `docs/governance/workspace-master-prompt.md`
- `docs/governance/workflow.md`

Choose the README path from the catalog's visibility. For an approved public
product repository, copy the public scaffold below. For a private repository,
keep or construct the [Repo Framework record card](governance/repo-framework.md#private-repository-record-card)
and the [private type sections](governance/repo-topology-canon.md#private-legacy-section-order-by-type).
Fill commands and links from the repository. Do not replace a private README
with a public scaffold.

```bash
# Approved public product repositories only:
cp "$CONTROL_PLANE/templates/scaffolding/README.product.md" README.md
cp "$CONTROL_PLANE/templates/scaffolding/docs-README.md" docs/README.md
```

Install the repository-owned checks from the control plane. These two scripts
resolve the repository from their own location, so preserve the directory depth:

```bash
mkdir -p scripts/doctrine
cp "$CONTROL_PLANE/scripts/doctrine/validate-doc-contract.sh" scripts/doctrine/
cp "$CONTROL_PLANE/scripts/doctrine/validate-no-ai-attribution.py" scripts/doctrine/
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

Edit `catalog/index.yaml` in the control-plane repo. Add the repository under
its existing portfolio lane (`platform`, `ship`, `lab`, `work`, or `archive`).
The compiler supplies the full manifest fields. For example, append this
entry under `lanes.ship` for a private product:

```yaml
- slug: my-repo
  about: One factual sentence describing the product.
  url: https://github.com/alawein/my-repo
  visibility: private
  stack: [nextjs, typescript]
```

Lane configuration determines the disk bucket; this example resolves to
`apps/my-repo`. Set only verified overrides. Public visibility requires the
[existing readiness gate](governance/repo-framework.md#visibility-defaults).
Do not hand-edit `catalog/repos.json`, `projects.json`, or `catalog/generated/`.

From the control-plane root, regenerate and validate:

```bash
python scripts/catalog/build-catalog.py
python scripts/catalog/validate-catalog.py --strict
python scripts/catalog/sync-readme.py
```

Commit `catalog/index.yaml` and all changed generated outputs together in the
control-plane PR, including `catalog/repos.json`, `projects.json`,
`catalog/generated/`, and `README.md`. Inspect the generator diff before staging
explicit paths.

## 4. Wire GitHub repo settings

From the control-plane root, preview the metadata plan for the catalog slug:

```bash
python scripts/github/sync-github-metadata.py --repo <repo-slug>
```

This prints a plan; it does not apply changes. Follow the
[metadata runbook](governance/github-metadata-sync-runbook.md) for approved
application and the [GitHub baseline](governance/github-baseline.md) for settings
and review requirements. `github-baseline-audit.py` is an audit, not an apply tool.

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
    uses: alawein/alawein/.github/workflows/doctrine-reusable.yml@<reviewed-control-plane-sha>
    with:
      strict: "true"
```

Merge the control-plane registration PR first, then replace the placeholder
with a reviewed full commit SHA that includes that registration. The reusable
workflow reads its catalog from the pinned revision; match any governed
workflow-ref requirement for the target repo.
Language-specific CI should follow the shapes in the control plane's
`.github/workflows/ci-node.yml` and `ci-python.yml` (Node and Python
respectively). Pin all action versions to a commit SHA, not a tag.

## 6. Wire Vercel (only for web surfaces)

Use the repository's approved deployment runbook and verified project/team
identity. Keep credentials in the active secret manager. Record any approved
deployment and domain changes in their existing canonical inventory. A local
scaffold or catalog entry does not establish a deployment.

## 7. Verify doctrine validation passes

From the new repo root:

```bash
bash scripts/doctrine/validate-doc-contract.sh --full
python "$CONTROL_PLANE/scripts/doctrine/validate-doctrine.py" . --ci
python scripts/doctrine/validate-no-ai-attribution.py
```

For public or private README validation, target the new checkout explicitly:

```bash
python "$CONTROL_PLANE/scripts/doctrine/validate-readme-topology.py" --repo-path . --repo-slug <repo-slug>
python "$CONTROL_PLANE/scripts/doctrine/validate-readme-voice.py" --repo-path . --repo-slug <repo-slug>
```

All checks must exit 0. Common failures and remedies:

- `missing required file: SSOT.md` -- add the file from step 2.
- `<doc> is N days old; canonical docs must be <= 30 days old` -- verify the
  content, then update the reported freshness key (`last-verified`,
  `last-updated`, or `last_updated`).
- `broken local link target` -- the referenced file does not exist relative
  to the markdown file; fix the target path or remove the markdown link.
- `Duplicate canonical: CLAUDE.md` -- the repo-local `.claude/CLAUDE.md`
  must declare `type: derived`, not `canonical`.
- `forbidden attribution` -- remove AI attribution trailers or robot emoji
  from managed docs.

## 8. Verify agent entrypoints

Keep root `AGENTS.md` and repo-specific `CLAUDE.md` aligned with the repository's
actual boundaries and commands. Replace the bootstrap's placeholder source and
sync metadata with the real ownership, following the existing
[Claude configuration guide](governance/claude-code-configuration-guide.md).
Verify instruction discovery in the active coding tool. `sync-claude.sh` was
retired; do not create generated `.claude/` mirrors with that script.

## 9. Open the first PR

The new repository's first PR should contain:

- All files from steps 1-2 (scaffold + canonical surfaces)
- The repository-owned checks from step 2
- The doctrine workflow from step 5
- The verified agent entrypoints from step 8

Keep the catalog registration and generated outputs in a separate control-plane
PR. Link the two PRs. Require the checks and human review configured for each
repository before merging.

## 10. Post-merge

- Let the existing `projects.json` to `scripts/notion/sync-to-notion.mjs` pipeline
  populate Notion. Use the [Projects runbook](operations/notion-projects-database.md);
  do not add a parallel registration path.
- For an approved profile-pin change, update `profile-from-guides.yaml` and
  the actual pins in GitHub. Regenerate with `scripts/catalog/sync-readme.py`,
  then run `python scripts/github/verify-profile-pins.py --check`.
- Announce in the `workspace-tools` changelog if the repo introduces a new
  automation surface that other repos should adopt.

## Validator reference

| Validator | Location | Purpose |
| --- | --- | --- |
| `validate-doc-contract.sh` | Repo-owned `scripts/doctrine/` | Required files, frontmatter keys, canonical age, naming, local links |
| `validate-doctrine.py` | Control-plane `scripts/doctrine/` | Doctrine rules for the explicit target directory |
| `validate-catalog.py` | Control-plane `scripts/catalog/` | Compiled catalog integrity and taxonomy compliance |
| `validate-projects-json.py` | Control-plane `scripts/catalog/` | `projects.json` schema conformance and archived-CI drift |
| `validate-no-ai-attribution.py` | Repo-owned `scripts/doctrine/` | Scans that repo's managed docs for forbidden AI attribution |
| `sync-readme.py --check` | Control-plane `scripts/catalog/` | Confirms the generated profile README matches `profile-from-guides.yaml` |
