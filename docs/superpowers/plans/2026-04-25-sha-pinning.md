---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-25
audience: [ai-agents, contributors]
---

# SHA Pinning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all floating GitHub Actions refs (`@v4`, `@v3`, `@v6`, `@main`) with full 40-character SHA pins across four repos, and add missing permissions/concurrency/community health files to meshal-web.

**Architecture:** Each repo is an independent git repo; changes are isolated per-repo. The alawein control plane workflows (`ci-node.yml`, `ci-python.yml`, `codeql.yml`) are the authoritative SHA source for shared actions. Floating refs in secondary workflows (ci-app, ci-smoke, resume-latex, smoke-production, career-profile-checks) that call actions directly are also replaced.

**Tech Stack:** GitHub Actions YAML, bash (git commands per repo)

---

## SHA Reference Table

All pinned SHAs to use. Do not deviate from these values.

| Action | SHA | Tag |
|--------|-----|-----|
| `actions/checkout` | `de0fac2e4500dabe0009e67214ff5f5447ce83dd` | v6.0.2 |
| `actions/setup-node` | `53b83947a5a98c8d113130e565377fae1a50d02f` | v6.3.0 |
| `actions/setup-python` | `a309ff8b426b58ec0e2a45f0f869d46889d02405` | v6.2.0 |
| `github/codeql-action/init` | `c10b8064de6f491fea524254123dbe5e09572f13` | v4.35.1 |
| `github/codeql-action/analyze` | `c10b8064de6f491fea524254123dbe5e09572f13` | v4.35.1 |
| `astral-sh/setup-uv` | `f3763b49cb0e9cfe1c5ff20f4fd4d12a9e98672a` | v6.0.0 |
| `dorny/paths-filter` | `de90cc6fb38fc0963ad72b210f1f284cd68cea36` | v3.0.2 |
| `actions/upload-artifact` | `bbbca2ddaa5d8feaa63e36b76fdaad77386f024f` | v7.0.0 |
| `actions/download-artifact` | `3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c` | v8.0.1 |
| `actions/github-script` | `f28e40c7f34bde8b3046d885e986cb6290c5673b` | v7 |
| Reusable workflow ref | `ed5ed61aef28cbdd761eeb0654808833bc4564be` | (alawein control plane) |

---

## File Map

```
knowledge-base/.github/workflows/
  ci-app.yml              -- floating: checkout@v4, setup-node@v4
  ci-smoke.yml            -- floating: checkout@v4
  resume-latex.yml        -- floating: checkout@v4
  smoke-production.yml    -- floating: checkout@v4, setup-node@v4
  career-profile-checks.yml -- floating: checkout@v4  (setup-python already pinned)
  [ci.yml]                -- already pinned (no change)
  [codeql.yml]            -- already pinned (no change)
  [docs-doctrine.yml]     -- already pinned (no change)
  [notion-kb-sync.yml]    -- already pinned (no change)

alembiq/.github/workflows/
  ci.yml                  -- floating: checkout@v4 (x2), setup-node@v4, dorny/paths-filter@v3
  ops-sync-report.yml     -- non-standard v4 SHAs: checkout, setup-node, upload-artifact
  [codeql.yml]            -- already pinned (no change)
  [publish.yml]           -- already pinned (no change)
  [docs-doctrine.yml]     -- already pinned (no change)
  [notion-sync.yml]       -- no action refs (no change)

fallax/.github/workflows/
  ci.yml                  -- floating: checkout@v4 (x3), setup-uv@v6 (x3)
  ci-smoke.yml            -- floating: checkout@v4, setup-uv@v6
  [docs-doctrine.yml]     -- already pinned (no change)

meshal-web/.github/workflows/
  ci.yml                  -- floating: checkout@v4 (x2), setup-node@v4 (x2); missing permissions + concurrency
  security.yml            -- floating: checkout@v4, setup-node@v4, codeql-action/init@v3, codeql-action/analyze@v3; missing permissions
  doctrine.yml            -- floating: doctrine-reusable.yml@main
meshal-web/.github/
  ISSUE_TEMPLATE/         -- MISSING (create bug-report.yml, feature-request.yml, config.yml)
  PULL_REQUEST_TEMPLATE.md -- MISSING (create)
```

---

## Task 1: knowledge-base SHA pinning

**Git working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/knowledge-base/`
**Commit:** `ci: pin all GitHub Actions refs to full SHAs`

### Floating refs found

| File | Floating ref |
|------|-------------|
| `ci-app.yml` | `actions/checkout@v4`, `actions/setup-node@v4` |
| `ci-smoke.yml` | `actions/checkout@v4` |
| `resume-latex.yml` | `actions/checkout@v4` |
| `smoke-production.yml` | `actions/checkout@v4`, `actions/setup-node@v4` |
| `career-profile-checks.yml` | `actions/checkout@v4` |

### Steps

- [ ] Write `.github/workflows/ci-app.yml` with the following content:

```yaml
# Next.js: same checks as Vercel (build + NFT trace vs db/).
name: CI — Next.js app

on:
  push:
    branches: [main]
    paths:
      - 'app/**'
      - 'db/**'
      - 'package.json'
      - 'package-lock.json'
      - 'vercel.json'
      - '.github/workflows/ci-app.yml'
  pull_request:
    branches: [main]
    paths:
      - 'app/**'
      - 'db/**'
      - 'package.json'
      - 'package-lock.json'
      - 'vercel.json'
      - '.github/workflows/ci-app.yml'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  nextjs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Setup Node
        uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: '22'
          cache: npm

      - name: Install
        run: npm ci

      - name: Build and verify NFT
        run: npm run build:verify
```

- [ ] Write `.github/workflows/ci-smoke.yml` with the following content:

```yaml
name: ci-smoke

on:
  push:
    branches: [main]
    paths-ignore:
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'
      - 'AGENTS.md'
      - 'CLAUDE.md'
      - 'SSOT.md'
      - 'CHANGELOG.md'
      - 'LESSONS.md'
      - 'README.md'
      - 'app/README.md'
  pull_request:
    branches: [main]
    paths-ignore:
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'
      - 'AGENTS.md'
      - 'CLAUDE.md'
      - 'SSOT.md'
      - 'CHANGELOG.md'
      - 'LESSONS.md'
      - 'README.md'
      - 'app/README.md'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - name: OK
        run: echo ok
```

- [ ] Write `.github/workflows/resume-latex.yml` with the following content:

```yaml
# Compile CV/resume PDFs and run the bash test suite when LaTeX sources change.

name: Resume LaTeX

on:
  pull_request:
    paths:
      - 'career/resume/master/**'
  push:
    branches: [main]
    paths:
      - 'career/resume/master/**'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  resume-tex:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Install TeX Live and pdfinfo
        run: |
          sudo apt-get update
          sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
            texlive-latex-base \
            texlive-latex-recommended \
            texlive-latex-extra \
            texlive-fonts-recommended \
            texlive-fonts-extra \
            poppler-utils

      - name: Resume test suite (structure, content, sync, compile, build)
        working-directory: career/resume/master
        run: bash tests/run.sh
```

- [ ] Write `.github/workflows/smoke-production.yml` with the following content:

```yaml
# HTTP smoke against production (or override URL). Does not install app deps.
name: Smoke — deployed app

on:
  workflow_dispatch:
  schedule:
    # Weekly health check — disable in repo Settings → Actions if undesired
    - cron: '25 15 * * 1'

permissions:
  contents: read

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Setup Node
        uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: '22'

      - name: Run smoke checks
        env:
          SMOKE_BASE_URL: ${{ vars.SMOKE_BASE_URL }}
        run: node app/scripts/smoke-deploy.mjs
```

- [ ] Write `.github/workflows/career-profile-checks.yml` with the following content:

```yaml
# Focused checks when career/profile sources or export tooling change.
# Main CI (.github/workflows/ci.yml) still runs the full suite on every PR;
# this workflow provides an additional named check for career-related edits.

name: Career profile checks

on:
  pull_request:
    paths:
      - 'career/**'
      - 'db/profile/**'
      - 'scripts/export-profile.py'
      - 'scripts/validate-profile-manifest.py'
      - 'scripts/sync_profile_copy_notion.py'
      - 'scripts/tests/test_export_profile.py'
      - 'scripts/tests/test_validate_profile_manifest.py'
  push:
    branches: [main]
    paths:
      - 'career/**'
      - 'db/profile/**'
      - 'scripts/export-profile.py'
      - 'scripts/validate-profile-manifest.py'
      - 'scripts/sync_profile_copy_notion.py'
      - 'scripts/tests/test_export_profile.py'
      - 'scripts/tests/test_validate_profile_manifest.py'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  career:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Setup Python
        uses: actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405 # v6.2.0
        with:
          python-version: '3.12'
          cache: pip

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Profile export (smoke)
        run: python scripts/export-profile.py

      - name: Validate profile manifest
        run: python scripts/validate-profile-manifest.py
```

- [ ] Commit from inside the knowledge-base repo:

```bash
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/knowledge-base" add \
  .github/workflows/ci-app.yml \
  .github/workflows/ci-smoke.yml \
  .github/workflows/resume-latex.yml \
  .github/workflows/smoke-production.yml \
  .github/workflows/career-profile-checks.yml
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/knowledge-base" commit -m "ci: pin all GitHub Actions refs to full SHAs"
```

---

## Task 2: alembiq SHA pinning

**Git working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq/`
**Commit:** `ci: pin all GitHub Actions refs to full SHAs`

### Floating refs found

| File | Floating ref |
|------|-------------|
| `ci.yml` | `actions/checkout@v4` (x2), `actions/setup-node@v4`, `dorny/paths-filter@v3` |
| `ops-sync-report.yml` | non-canonical SHAs for checkout, setup-node, upload-artifact |

### Steps

- [ ] Write `.github/workflows/ci.yml` with the following content:

```yaml
name: CI

on:
  push:
    branches: [main, master]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'
  pull_request:
    branches: [main, master]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    uses: alawein/alawein/.github/workflows/ci-python.yml@ed5ed61aef28cbdd761eeb0654808833bc4564be
    with:
      working-directory: '.'
      python-version: '3.12'
      install-command: 'python -m pip install -e .[dev]'
      build-command: 'python -m ruff check . && python -m mypy src/alembiq/'
      test-command: 'python -m pytest tests/ -v'
      use-uv: false

  changes:
    runs-on: ubuntu-latest
    outputs:
      website-app: ${{ steps.filter.outputs.website-app }}
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: dorny/paths-filter@de90cc6fb38fc0963ad72b210f1f284cd68cea36 # v3.0.2
        id: filter
        with:
          filters: |
            website-app:
              - 'website-app/**'

  website-app:
    needs: changes
    if: needs.changes.outputs.website-app == 'true'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website-app
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website-app/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

- [ ] Write `.github/workflows/ops-sync-report.yml` with the following content:

```yaml
# Why: reproducible JSON report for ops / future Notion/GitHub Sync without local gh CLI.

name: Ops — GitHub sync report

on:
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: read
  issues: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: "20"

      - name: Generate sync report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/github-sync-report.mjs

      - uses: actions/upload-artifact@bbbca2ddaa5d8feaa63e36b76fdaad77386f024f # v7.0.0
        with:
          name: sync-report-json
          path: reports/sync-report.*.json
```

- [ ] Commit from inside the alembiq repo:

```bash
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq" add \
  .github/workflows/ci.yml \
  .github/workflows/ops-sync-report.yml
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq" commit -m "ci: pin all GitHub Actions refs to full SHAs"
```

---

## Task 3: fallax SHA pinning

**Git working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/fallax/`
**Commit:** `ci: pin all GitHub Actions refs to full SHAs`

### Floating refs found

| File | Floating ref |
|------|-------------|
| `ci.yml` | `actions/checkout@v4` (x3), `astral-sh/setup-uv@v6` (x3) |
| `ci-smoke.yml` | `actions/checkout@v4`, `astral-sh/setup-uv@v6` |

### Steps

- [ ] Write `.github/workflows/ci.yml` with the following content:

```yaml
name: CI

on:
  push:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'
  pull_request:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.12", "3.13"]
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - uses: astral-sh/setup-uv@f3763b49cb0e9cfe1c5ff20f4fd4d12a9e98672a # v6.0.0

      - name: Set up Python ${{ matrix.python-version }}
        run: uv python install ${{ matrix.python-version }}

      - name: Install dependencies
        run: uv sync --extra dev --extra dashboard

      - name: Run tests with coverage
        run: uv run pytest --cov=reasonbench --cov=dashboard --cov-report=term-missing --cov-fail-under=90

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - uses: astral-sh/setup-uv@f3763b49cb0e9cfe1c5ff20f4fd4d12a9e98672a # v6.0.0

      - name: Set up Python
        run: uv python install 3.12

      - name: Install dependencies
        run: uv sync --extra dev

      - name: Ruff check
        run: uv run ruff check .

      - name: Ruff format check
        run: uv run ruff format --check .

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - uses: astral-sh/setup-uv@f3763b49cb0e9cfe1c5ff20f4fd4d12a9e98672a # v6.0.0

      - name: Set up Python
        run: uv python install 3.12

      - name: Install dependencies
        run: uv sync --extra dev --extra dashboard

      - name: Mypy
        run: uv run mypy reasonbench/ dashboard/
```

- [ ] Write `.github/workflows/ci-smoke.yml` with the following content:

```yaml
name: ci-smoke

on:
  push:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'
  pull_request:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: astral-sh/setup-uv@f3763b49cb0e9cfe1c5ff20f4fd4d12a9e98672a # v6.0.0
        with:
          python-version: "3.12"
      - name: Install
        run: uv sync --extra dashboard
      - name: Smoke — baseline status
        run: uv run python -m reasonbench baseline status --version v1
```

- [ ] Commit from inside the fallax repo:

```bash
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/fallax" add \
  .github/workflows/ci.yml \
  .github/workflows/ci-smoke.yml
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/fallax" commit -m "ci: pin all GitHub Actions refs to full SHAs"
```

---

## Task 4: meshal-web SHA pinning + permissions + concurrency

**Git working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/`
**Commit:** `ci: pin GitHub Actions refs and add permissions and concurrency blocks`

### Floating refs found

| File | Floating ref |
|------|-------------|
| `ci.yml` | `actions/checkout@v4` (x2), `actions/setup-node@v4` (x2); missing `permissions` and `concurrency` at workflow level |
| `security.yml` | `actions/checkout@v4`, `actions/setup-node@v4`, `github/codeql-action/init@v3`, `github/codeql-action/analyze@v3`; missing `permissions` at workflow level |
| `doctrine.yml` | `doctrine-reusable.yml@main` |

### Steps

- [ ] Write `.github/workflows/ci.yml` with the following content:

```yaml
name: ci

on:
  push:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - 'LICENSE'
  pull_request:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: 20
          cache: npm
      - run: npm ci --legacy-peer-deps
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  a11y:
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: 20
          cache: npm
      - run: npm ci --legacy-peer-deps
      - run: npx playwright install --with-deps chromium
      - run: npm run a11y
```

- [ ] Write `.github/workflows/security.yml` with the following content:

```yaml
name: security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'

permissions:
  contents: read

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: 20
      - run: npm audit --audit-level=high

  codeql:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - uses: github/codeql-action/init@c10b8064de6f491fea524254123dbe5e09572f13 # v4.35.1
        with:
          languages: javascript-typescript
      - uses: github/codeql-action/analyze@c10b8064de6f491fea524254123dbe5e09572f13 # v4.35.1
```

- [ ] Write `.github/workflows/doctrine.yml` with the following content:

```yaml
name: doctrine

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    uses: alawein/alawein/.github/workflows/doctrine-reusable.yml@ed5ed61aef28cbdd761eeb0654808833bc4564be
```

- [ ] Commit from inside the meshal-web repo:

```bash
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web" add \
  .github/workflows/ci.yml \
  .github/workflows/security.yml \
  .github/workflows/doctrine.yml
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web" commit -m "ci: pin GitHub Actions refs and add permissions and concurrency blocks"
```

---

## Task 5: meshal-web issue templates and PR template

**Git working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/`
**Commit:** `ci: add issue templates and PR template`

### Missing files

- `.github/ISSUE_TEMPLATE/bug-report.yml` — does not exist
- `.github/ISSUE_TEMPLATE/feature-request.yml` — does not exist
- `.github/ISSUE_TEMPLATE/config.yml` — does not exist
- `.github/PULL_REQUEST_TEMPLATE.md` — does not exist

### Steps

- [ ] Create `.github/ISSUE_TEMPLATE/` directory if it does not exist (it will be created implicitly when writing the files below).

- [ ] Write `.github/ISSUE_TEMPLATE/bug-report.yml` with the following content:

```yaml
name: Bug Report
description: Report a reproducible bug in the site, components, or build pipeline.
title: "[Bug]: "
labels: ["bug", "triage"]
body:
  - type: textarea
    id: summary
    attributes:
      label: What happened?
      description: Include the actual behavior and the expected behavior.
      placeholder: A concise summary of the bug and the expected result.
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to reproduce
      description: Provide a minimal, deterministic reproduction.
      placeholder: |
        1. Navigate to ...
        2. Click ...
        3. Observe ...
    validations:
      required: true
  - type: input
    id: environment
    attributes:
      label: Environment
      description: Browser, OS, screen reader, or device — whichever is relevant.
      placeholder: Chrome 124 / macOS 14 / VoiceOver
    validations:
      required: false
  - type: textarea
    id: logs
    attributes:
      label: Relevant output
      description: Paste console errors, screenshots, or stack traces if they help.
      render: shell
  - type: checkboxes
    id: checks
    attributes:
      label: Safety checks
      options:
        - label: I removed secrets or personal data from the report.
          required: true
        - label: I confirmed this is not already covered by an existing issue.
          required: true
```

- [ ] Write `.github/ISSUE_TEMPLATE/feature-request.yml` with the following content:

```yaml
name: Feature Request
description: Propose a focused improvement to the site, a component, or the build pipeline.
title: "[Feature]: "
labels: ["enhancement", "triage"]
body:
  - type: textarea
    id: problem
    attributes:
      label: What problem are you trying to solve?
      description: Describe the current friction or missing capability.
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed change
      description: Describe the preferred solution in concrete terms.
    validations:
      required: true
  - type: dropdown
    id: scope
    attributes:
      label: Scope
      options:
        - visual / UI
        - accessibility
        - performance
        - content
        - build / CI
        - documentation only
    validations:
      required: true
  - type: textarea
    id: impact
    attributes:
      label: Impact and tradeoffs
      description: Call out expected benefits, risks, or migration cost.
  - type: checkboxes
    id: checks
    attributes:
      label: Readiness
      options:
        - label: I checked the existing issues before filing this request.
          required: true
```

- [ ] Write `.github/ISSUE_TEMPLATE/config.yml` with the following content:

```yaml
blank_issues_enabled: false
contact_links:
  - name: Governance docs
    url: https://github.com/alawein/alawein/tree/main/docs/governance
    about: Check the governance docs before opening a workflow or policy issue.
```

- [ ] Write `.github/PULL_REQUEST_TEMPLATE.md` with the following content:

```markdown
## Summary

- What is changing?
- Why is it needed?

## Checklist

- [ ] Branch follows naming rules (`feat/*`, `fix/*`, `docs/*`, `chore/*`, `test/*`)
- [ ] Scope is intentional and focused
- [ ] CI is green or flake is documented
- [ ] Tests added/updated (when applicable)
- [ ] Accessibility not regressed (keyboard nav, focus, contrast)
- [ ] No secrets, tokens, or .env files included

## Testing

- [ ] Not run (explain why)
- [ ] Local checks executed (`npm run test`, `npm run a11y`)

## Risk

- [ ] Low (default)
- [ ] Medium (note what could break)
- [ ] High (requires extra validation)

## Notes

- Anything reviewers should know (workarounds, follow-ups, known gaps)
```

- [ ] Commit from inside the meshal-web repo:

```bash
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web" add \
  .github/ISSUE_TEMPLATE/bug-report.yml \
  .github/ISSUE_TEMPLATE/feature-request.yml \
  .github/ISSUE_TEMPLATE/config.yml \
  .github/PULL_REQUEST_TEMPLATE.md
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web" commit -m "ci: add issue templates and PR template"
```

---

## Verification

After all tasks are complete, run these checks to confirm no floating refs remain:

```bash
# knowledge-base: should return nothing
grep -r "uses:.*@v[0-9]" C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/knowledge-base/.github/workflows/

# alembiq: should return nothing
grep -r "uses:.*@v[0-9]" C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq/.github/workflows/

# fallax: should return nothing
grep -r "uses:.*@v[0-9]" C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/fallax/.github/workflows/

# meshal-web: should return nothing
grep -r "uses:.*@v[0-9]\|uses:.*@main" C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/.github/workflows/

# Confirm reusable workflow SHA resolves in alawein repo
git -C C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein log --oneline ed5ed61aef28cbdd761eeb0654808833bc4564be -1
```
