---
title: Phase 0 — Workspace Triage Implementation Plan
date: 2026-04-23
status: active
type: canonical
last_updated: 2026-04-30
---

# Phase 0 — Workspace Triage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `2026-04-23-workspace-triage.md` — a reset map classifying all 32 repos by status, health, and disposition, plus workspace-level, infrastructure, and governance findings.

**Architecture:** Data collection via filesystem inspection and git log analysis → structured findings → written triage document. No code is deployed. All outputs are markdown. Phase 0 feeds Specs A–D in subsequent sessions.

**Tech Stack:** Python (data collection scripts), bash (git commands), markdown (output format). All commands run from inside individual repo directories or from the workspace root `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/`.

**Spec:** `alawein/docs/superpowers/specs/2026-04-23-workspace-audit-design.md`

**Output file:** `alawein/docs/superpowers/specs/2026-04-23-workspace-triage.md`

---

## File Map

- Create: `alawein/docs/superpowers/specs/2026-04-23-workspace-triage.md`
- Modify: `alawein/SSOT.md` (add pointer to specs directory)
- Modify: workspace root `CLAUDE.md` is not git-tracked — update via Dropbox path only (do not git commit it)

---

## Task 1: Collect Per-Repo Health Signals

**Files:**
- No persistent files — collect and hold in memory for Task 5

- [ ] **Step 1: Extract SSOT last-verified dates for all repos**

Run from workspace root:
```bash
python -c "
import os, re
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein'
repos = sorted([d for d in os.listdir(base) if os.path.isdir(os.path.join(base,d)) and not d.startswith('.') and d not in ['node_modules']])
for r in repos:
    ssot = os.path.join(base, r, 'SSOT.md')
    date = 'MISSING'
    if os.path.isfile(ssot):
        content = open(ssot, encoding='utf-8', errors='replace').read()
        m = re.search(r'last-verified:\s*(\S+)', content)
        if m: date = m.group(1)
        else:
            m2 = re.search(r'Last Updated.*?(\d{4}-\d{2}-\d{2})', content)
            if m2: date = m2.group(1) + ' (body)'
    print(f'{r}: {date}')
"
```

Expected: one line per repo with last-verified date or MISSING.

- [ ] **Step 2: Get last meaningful git commit date per repo**

Run from workspace root:
```bash
python -c "
import os, subprocess
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein'
repos = sorted([d for d in os.listdir(base) if os.path.isdir(os.path.join(base,d)) and os.path.isdir(os.path.join(base,d,'.git'))])
for r in repos:
    rp = os.path.join(base, r)
    result = subprocess.run(
        ['git', 'log', '--oneline', '--after=2024-01-01',
         '--', '*.py','*.ts','*.tsx','*.js','*.jsx','*.css','*.json'],
        cwd=rp, capture_output=True, text=True, encoding='utf-8', errors='replace'
    )
    lines = [l for l in result.stdout.strip().split('\n') if l]
    result2 = subprocess.run(
        ['git', 'log', '-1', '--format=%ci',
         '--', '*.py','*.ts','*.tsx','*.js','*.jsx','*.css','*.json'],
        cwd=rp, capture_output=True, text=True, encoding='utf-8', errors='replace'
    )
    last = result2.stdout.strip()[:10] or 'NO CODE COMMITS'
    print(f'{r}: last_code={last}, code_commits_since_2024={len(lines)}')
"
```

Expected: one line per repo with last code commit date and count since 2024.

- [ ] **Step 3: Check CI workflow coverage and CHANGELOG currency**

Run from workspace root:
```bash
python -c "
import os, re
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein'
repos = sorted([d for d in os.listdir(base) if os.path.isdir(os.path.join(base,d)) and not d.startswith('.')])
for r in repos:
    rp = os.path.join(base, r)
    wf_dir = os.path.join(rp, '.github', 'workflows')
    workflows = os.listdir(wf_dir) if os.path.isdir(wf_dir) else []
    cl = os.path.join(rp, 'CHANGELOG.md')
    cl_date = 'MISSING'
    if os.path.isfile(cl):
        content = open(cl, encoding='utf-8', errors='replace').read()
        m = re.search(r'#+\s+\[?(\d{4}-\d{2}-\d{2})', content)
        if m: cl_date = m.group(1)
        elif '## [' in content or '## ' in content:
            cl_date = 'has entries (no date found)'
    print(f'{r}: workflows={len(workflows)}, changelog_last={cl_date}')
"
```

Expected: one line per repo with workflow count and CHANGELOG last date.

- [ ] **Step 4: Classify each repo health (Green/Yellow/Red)**

Apply these rules mentally (or in a short script) to the data from Steps 1–3:

- **Green:** SSOT last-verified within 60 days AND code commits in last 90 days AND CI present
- **Yellow:** SSOT last-verified 61–180 days ago OR no code commits in 90 days but has CI
- **Red:** SSOT last-verified > 180 days ago OR no CI OR no git repo OR no code commits since 2024

Record the classification for each repo. This feeds the registry table in Task 5.

---

## Task 2: Assess Workspace-Level Issues

**Files:**
- No persistent files — hold findings for Task 5

- [ ] **Step 1: Inspect workspace root package.json**

Run:
```bash
cat "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/package.json"
```

Look for: what workspaces does it declare? Does it reference repos that have moved? Is it used for anything or is it vestigial? Note: the workspace root is NOT a git repo — changes here persist via Dropbox only.

- [ ] **Step 2: Check projects.json for inconsistencies**

Run:
```bash
python -c "
import json
with open('C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/projects.json') as f:
    data = json.load(f)

# Find duplicate slugs
slugs = {}
for section, items in data.items():
    if isinstance(items, list):
        for item in items:
            slug = item.get('slug', '?')
            if slug not in slugs: slugs[slug] = []
            slugs[slug].append(section)

print('=== DUPLICATE SLUGS ===')
for slug, sections in slugs.items():
    if len(sections) > 1:
        print(f'  {slug}: {sections}')

# Find repos in projects.json not on filesystem
print()
print('=== IN projects.json BUT NOT ON FILESYSTEM ===')
import os
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein'
fs_dirs = set(os.listdir(base))
for section, items in data.items():
    if isinstance(items, list):
        for item in items:
            slug = item.get('slug', '?')
            if slug not in fs_dirs and slug != '?':
                print(f'  {slug} (section={section})')

# Find repos on filesystem not in projects.json
print()
print('=== ON FILESYSTEM BUT NOT IN projects.json ===')
all_slugs = {item.get('slug') for s,items in data.items() if isinstance(items,list) for item in items}
for d in sorted(fs_dirs):
    rp = os.path.join(base, d)
    if os.path.isdir(rp) and os.path.isdir(os.path.join(rp,'.git')) and d not in all_slugs:
        print(f'  {d}')
"
```

Expected: lists of duplicate slugs, missing-from-filesystem, and missing-from-projects.json.

- [ ] **Step 3: Identify problematic workspace root files**

Run:
```bash
ls "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/" | grep -v -E "^(adil|alawein|alembiq|atelier-rounaq|attributa|bolts|chshlab|design-system|edfp|fallax|gymboy|helios|jobs-projects|knowledge-base|llmworks|loopholelab|maglogic|meatheadphysicist|meshal-web|optiqap|provegate|qmatsim|qmlab|quantumalgo|qubeml|repz|roka-oakland-hustle|scicomp|scribd|simcore|spincirc|workspace-tools|package\.json|package-lock\.json|projects\.json|README\.md|CLAUDE\.md|REPO_GOVERNANCE_INITIATIVE\.md|AGENTS\.md|INDEX\.md)$"
```

Expected: any files that don't belong at workspace root. Flag: `firebase-debug.log` (already visible from earlier scan — should not be here).

---

## Task 3: Infrastructure Health Snapshot

**Files:**
- No persistent files — hold findings for Task 5

- [ ] **Step 1: Check design-system build and package publish status**

Run:
```bash
python -c "
import json, os
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system'

# Check package versions in each package
pkgs_dir = os.path.join(base, 'packages')
for item in sorted(os.listdir(pkgs_dir)):
    pkg_path = os.path.join(pkgs_dir, item)
    # Handle @alawein subdirectory
    if item == '@alawein':
        for sub in sorted(os.listdir(pkg_path)):
            pj = os.path.join(pkg_path, sub, 'package.json')
            if os.path.isfile(pj):
                data = json.load(open(pj))
                print(f'  @alawein/{sub}: {data.get(\"version\",\"?\")} (private={data.get(\"private\",False)})')
    else:
        pj = os.path.join(pkg_path, 'package.json')
        if os.path.isfile(pj):
            data = json.load(open(pj))
            print(f'  {data.get(\"name\",item)}: {data.get(\"version\",\"?\")} (private={data.get(\"private\",False)})')
"
```

Expected: list of all design-system packages with their current versions and whether they're private.

- [ ] **Step 2: Check workspace-tools Python package and test status**

Run:
```bash
python -c "
import os, subprocess
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/workspace-tools'
# Check pyproject.toml version
import re
pj = open(os.path.join(base, 'pyproject.toml'), encoding='utf-8').read()
m = re.search(r'version\s*=\s*\"([^\"]+)\"', pj)
print('workspace-batch version:', m.group(1) if m else 'not found')
# Check test directory
test_dir = os.path.join(base, 'tests')
tests = []
for root, dirs, files in os.walk(test_dir):
    tests.extend([f for f in files if f.startswith('test_') and f.endswith('.py')])
print('Test files:', len(tests))
# Check npm packages
pkgs = os.path.join(base, 'packages')
if os.path.isdir(pkgs):
    for p in sorted(os.listdir(pkgs)):
        pj2 = os.path.join(pkgs, p, 'package.json')
        if os.path.isfile(pj2):
            data = __import__('json').load(open(pj2))
            print(f'  npm: {data.get(\"name\",p)} v{data.get(\"version\",\"?\")}')
"
```

Expected: workspace-batch version, test count, npm package names/versions.

- [ ] **Step 3: Check knowledge-base app deployment and script currency**

Run:
```bash
python -c "
import os, re, json
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/knowledge-base'

# Package version
pj = json.load(open(os.path.join(base, 'package.json')))
print('knowledge-base version:', pj.get('version', '?'))
print('Next.js version:', pj.get('dependencies',{}).get('next','?'))
print('Tailwind version:', pj.get('dependencies',{}).get('tailwindcss','?'))

# Script inventory
scripts_dir = os.path.join(base, 'scripts')
if os.path.isdir(scripts_dir):
    for f in sorted(os.listdir(scripts_dir)):
        fp = os.path.join(scripts_dir, f)
        mtime = os.path.getmtime(fp)
        import datetime
        dt = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
        print(f'  script: {f} (modified {dt})')
"
```

Expected: Next.js and Tailwind versions, list of scripts with last-modified dates.

---

## Task 4: Governance Effectiveness Check

**Files:**
- No persistent files — hold findings for Task 5

- [ ] **Step 1: Read docs-doctrine CI workflow across repos and assess rule coverage**

Run:
```bash
python -c "
import os, re
base = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein'
repos = sorted([d for d in os.listdir(base) if os.path.isdir(os.path.join(base,d,'.github','workflows'))])
print(f'Repos with CI: {len(repos)}')
doctrine_repos = []
for r in repos:
    wf_dir = os.path.join(base, r, '.github', 'workflows')
    for f in os.listdir(wf_dir):
        if 'doctrine' in f.lower() or 'doc' in f.lower():
            doctrine_repos.append((r, f))
print(f'Repos with doctrine workflow: {len(doctrine_repos)}')
for r, f in doctrine_repos[:5]:
    print(f'  {r}: {f}')
"
```

Expected: count of repos with CI vs. count with docs-doctrine workflow.

- [ ] **Step 2: Check github-baseline.yaml against actual repo state**

Run:
```bash
python -c "
import os
# Read github-baseline.yaml
try:
    import yaml
    baseline = yaml.safe_load(open('C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/github-baseline.yaml'))
    print('Baseline keys:', list(baseline.keys()) if isinstance(baseline, dict) else type(baseline))
except ImportError:
    # Read raw
    content = open('C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/github-baseline.yaml', encoding='utf-8').read()
    print(content[:800])
"
```

Expected: top-level structure of the baseline specification.

- [ ] **Step 3: Check RepoReady program deliverable status**

Run:
```bash
python -c "
import os
gov_dir = 'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/governance'
files = sorted(os.listdir(gov_dir))
print('Governance docs count:', len(files))
for f in files:
    fp = os.path.join(gov_dir, f)
    if os.path.isfile(fp):
        size = os.path.getsize(fp)
        print(f'  {f}: {size} bytes')
"
```

Then check whether the REPO_GOVERNANCE_INITIATIVE.md deliverables exist:
```bash
python -c "
import os
# Check deliverables listed in REPO_GOVERNANCE_INITIATIVE.md
deliverables = [
    'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/governance/repository-standardization-program.md',
    'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/governance/templates',
    'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/governance/migration-checklist.template.md',
    'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/governance/repo-audit-scorecard.template.md',
    'C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/governance/compliance-dashboard-schema.yaml',
]
for d in deliverables:
    exists = os.path.exists(d)
    print(f'  {\"EXISTS\" if exists else \"MISSING\"}: {os.path.basename(d)}')
"
```

Expected: which RepoReady deliverables exist vs. are missing.

---

## Task 5: Write the Triage Document

**Files:**
- Create: `alawein/docs/superpowers/specs/2026-04-23-workspace-triage.md`

- [ ] **Step 1: Create the triage document with header and structure**

Create `alawein/docs/superpowers/specs/2026-04-23-workspace-triage.md` with this skeleton, then fill in each section from the data collected in Tasks 1–4:

```markdown
---
title: Workspace Triage — Reset Map
date: 2026-04-23
status: active
type: triage
feeds: [spec-a, spec-b, spec-c, spec-d]
---

# Workspace Triage — Reset Map

**Generated:** 2026-04-23
**Repos scanned:** 32
**Purpose:** Classify every repo by status, health, and disposition before committing to deep audit work.

---

## Part 1 — Repo Registry

| Repo | Status | Health | Last Code Commit | Disposition | Audit Tier | Notes |
|------|--------|--------|-----------------|-------------|------------|-------|
[one row per repo]

**Legend:**
- Status: Active / Maintained / Planned / Archived / Dead
- Health: Green (SSOT <60d + code commits <90d + CI) / Yellow (61–180d or no recent code) / Red (>180d or no CI or no git)
- Disposition: Keep / Needs-work / Freeze / Archive / Delete
- Audit Tier: A (active products) / B (infrastructure) / C (governance) / D (research) / Skip

---

## Part 2 — Workspace-Level Findings

| Severity | Finding | Location | Recommended Action |
|----------|---------|----------|-------------------|
[findings from Task 2]

---

## Part 3 — Infrastructure Health Snapshot

### design-system
[package versions, build status, known drift]

### workspace-tools
[version, test count, npm packages]

### knowledge-base
[Next.js/Tailwind versions, script currency]

---

## Part 4 — Governance Effectiveness

| Check | Status | Finding |
|-------|--------|---------|
| docs-doctrine CI coverage | | |
| github-baseline gap | | |
| RepoReady deliverables | | |
| validate-doc-contract | | |

---

## Summary: Reset Candidates

Repos recommended for Archive or Delete:
[list]

Repos recommended for Freeze:
[list]

Repos requiring immediate attention (Red health):
[list]
```

- [ ] **Step 2: Fill in Part 1 — Repo registry table**

Using data from Task 1, populate one row per repo. All 32 repos must have an entry. No blanks in Disposition or Audit Tier columns. Apply this classification logic for Disposition:
- **Keep:** Active status + Green health
- **Needs-work:** Active status + Yellow/Red health, or portfolio value warrants improvement
- **Freeze:** Planned/Maintained + code is complete, no active work needed
- **Archive:** Dead or no meaningful code activity since 2024 + low portfolio value
- **Delete:** No git repo, never shipped, or duplicates another repo's purpose exactly

- [ ] **Step 3: Fill in Part 2 — Workspace-level findings**

From Task 2 data. Minimum entries to include:
- `firebase-debug.log` at workspace root (severity: Low — should be in .gitignore or deleted)
- Root `package.json` purpose and risk assessment
- All duplicate slugs found in `projects.json`
- All repos in `projects.json` not on filesystem (or vice versa)
- `jobs-projects/` directory: no git, no SSOT, anomalous (severity: Medium)
- `quantumalgo/`: no git, no CI (severity: Low)

- [ ] **Step 4: Fill in Part 3 — Infrastructure health snapshot**

From Task 3 data. For each of design-system, workspace-tools, knowledge-base: record actual versions, whether build is expected to be passing (based on CI workflow presence + recent commits), and any obvious drift signals.

- [ ] **Step 5: Fill in Part 4 — Governance effectiveness**

From Task 4 data. For each governance check:
- docs-doctrine: what percentage of repos have the workflow? Is it the same workflow file or divergent?
- github-baseline: does the yaml specify concrete expected values? Are there audit scripts that actually check them?
- RepoReady: list which deliverables exist vs. are MISSING with a verdict: "Delivered" / "Partially delivered" / "Aspirational only"
- validate-doc-contract: note whether the script is referenced in any CI workflow or is manual-only

- [ ] **Step 6: Write the Summary section**

List the repos in each category:
- Archive or Delete candidates (from registry table)
- Freeze candidates
- Red health repos needing immediate attention

---

## Task 6: Update SSOT.md with Spec Pointer

**Files:**
- Modify: `alawein/SSOT.md`

- [ ] **Step 1: Add superpowers specs section to SSOT.md**

Read `alawein/SSOT.md`. Find the "Current State" section. Add a new entry after the last bullet:

```markdown
- Workspace audit specs and execution plans:
  [`docs/superpowers/specs/`](docs/superpowers/specs/) — triage, per-domain audits, master execution plan
```

- [ ] **Step 2: Verify the edit looks correct**

Run:
```bash
grep -n "superpowers" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/SSOT.md"
```

Expected: one matching line in the Current State section.

---

## Task 7: Commit Phase 0 Artifacts

**Files:**
- Commit: `alawein/docs/superpowers/specs/2026-04-23-workspace-audit-design.md`
- Commit: `alawein/docs/superpowers/specs/2026-04-23-workspace-triage.md`
- Commit: `alawein/docs/superpowers/plans/2026-04-23-phase-0-workspace-triage.md`
- Commit: `alawein/SSOT.md`

- [ ] **Step 1: Stage only the new/modified files**

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein" && git add docs/superpowers/ SSOT.md
```

- [ ] **Step 2: Verify staged files are only what we intend**

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein" && git diff --staged --stat
```

Expected: only `docs/superpowers/specs/2026-04-23-workspace-audit-design.md`, `docs/superpowers/specs/2026-04-23-workspace-triage.md`, `docs/superpowers/plans/2026-04-23-phase-0-workspace-triage.md`, and `SSOT.md`. If any other files appear in the diff, unstage them with `git restore --staged <file>`.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein" && git commit -m "$(cat <<'EOF'
docs(superpowers): add workspace audit design spec and phase-0 triage plan

Introduces the 6-document audit system (design spec + 5 deliverable specs)
and the Phase 0 triage implementation plan. Triage document will be filled
in during the same session after data collection runs.
EOF
)"
```

Expected: commit succeeds on `main`. If pre-commit hook fires, read the error — do not use `--no-verify`.

---

## Self-Review

**Spec coverage check:**

- Phase 0 / Part 1 (repo registry): Tasks 1 + 5 Steps 2 ✅
- Phase 0 / Part 2 (workspace-level): Task 2 + 5 Step 3 ✅
- Phase 0 / Part 3 (infrastructure snapshot): Task 3 + 5 Step 4 ✅
- Phase 0 / Part 4 (governance effectiveness): Task 4 + 5 Step 5 ✅
- SSOT.md update: Task 6 ✅
- Commit: Task 7 ✅
- Workspace root CLAUDE.md: spec says "add pointer" but CLAUDE.md is not git-tracked — this is a known limitation noted in the design spec. Skip in this plan; do manually if desired.

**Placeholder scan:** No TBDs, no "implement later", no "add appropriate" phrases. All commands are complete Python/bash. All output expectations are stated.

**Type consistency:** No shared types across tasks — this is a documentation plan, not a software plan.
