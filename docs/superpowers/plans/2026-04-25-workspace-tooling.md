---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-25
audience: [ai-agents, contributors]
---

# Workspace Tooling Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix four broken or missing enforcement mechanisms in the alawein control plane so that Claude Code hooks fire, governance drift detection is reliable, private key patterns are blocked from commits, and docs-validation CI propagates to all `sync:auto` sibling repos.

**Architecture:** All five changes land exclusively in the `alawein/` control plane repo; sibling repo changes propagate automatically via `sync-github.sh`. The hooks are rewired using valid Claude Code event keys (`PreToolUse`, `Stop`). Drift detection replaces a stale file-diff approach with a SHA-256 checksum baseline committed to `.claude/hooks/governance-checksums.json`. The docs-validation workflow is split into a control-plane-only variant and a new managed variant (`docs-validation-managed.yml`) that is propagated to sibling repos via `sync-github.sh`.

**Tech Stack:** Bash, Python 3.12, YAML, GitHub Actions, Claude Code hooks (`PreToolUse`/`Stop`), sha256sum (GNU coreutils), markdownlint-cli (npm).

---

## File Map

| File | Action | Role |
|------|--------|------|
| `alawein/.claude/settings.json` | Modify | Rewrite hooks block with valid Claude Code event keys |
| `alawein/.claude/hooks/drift-detection.sh` | Modify | Replace `_pkos/` path diff with SHA-256 checksum comparison |
| `alawein/.claude/hooks/governance-checksums.json` | Create | Committed SHA-256 baseline for canonical governance files |
| `alawein/.claude/hooks/update-checksums.sh` | Create | Helper script to regenerate the baseline after intentional changes |
| `alawein/scripts/sync-github.sh` | Modify | (1) Add `commit-message` prefix + `labels` to `render_dependabot`; (2) add `*.pem`/`*.key`/`*.p12` to `.gitignore`; (3) propagate `docs-validation-managed.yml` |
| `alawein/github-baseline.yaml` | Modify | Add `required_files` block documenting `dependabot` and `docs-validation-managed` |
| `alawein/.github/workflows/docs-validation-managed.yml` | Create | Trimmed workflow for sibling repos (forbidden register + markdownlint on README/CLAUDE/AGENTS only) |

---

## Task 1 — Fix Claude Code hooks: rewrite settings.json

**Files:**
- Modify: `alawein/.claude/settings.json`

**Context:** The current `settings.json` has no `hooks` key at all — the hooks note explains they are not wired. Claude Code hooks use the keys `PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`, and `SessionStart`. The three scripts map as follows: `scope-binding-check.sh` → `PreToolUse` (blocks unsafe path patterns before edits land); `observability-log.sh` → `Stop` (session-end trace); `drift-detection.sh` → `Stop` (session-end drift check, after rewrite in Task 2).

- [ ] Read the current file at `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/.claude/settings.json` to confirm exact content before overwriting.

- [ ] Write the new `settings.json` with the complete content below:

```json
{
  "_governanceHooksVersion": "1.1.0",
  "_templateSource": "github.com/alawein/knowledge-base/templates/governance-hooks",
  "project_name": "alawein",
  "project_type": "project",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/scope-binding-check.sh --warn-only"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/observability-log.sh"
          }
        ]
      },
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/drift-detection.sh"
          }
        ]
      }
    ]
  }
}
```

- [ ] Verify the file is valid JSON:
  ```bash
  python -c "import json; json.load(open('.claude/settings.json'))" && echo "VALID"
  ```
  Expected output: `VALID`

- [ ] Commit:
  ```bash
  git add .claude/settings.json
  git commit -m "fix(hooks): wire scope-binding-check, observability-log, drift-detection to valid Claude Code events"
  ```

---

## Task 2 — Rewrite drift-detection.sh with SHA-256 checksum comparison

**Files:**
- Modify: `alawein/.claude/hooks/drift-detection.sh`
- Create: `alawein/.claude/hooks/governance-checksums.json`
- Create: `alawein/.claude/hooks/update-checksums.sh`

**Context:** The current script compares files against `../../../knowledge-base` (a path that no longer exists) and silently prints "No governance drift detected." when the directory is missing — a false-green. The replacement compares SHA-256 checksums of four canonical files against a committed baseline JSON. A `Stop` hook that exits 1 surfaces an error message to the user. The four monitored files are `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, and `docs/style/VOICE.md`.

**Current checksums (computed 2026-04-25):**
| File | SHA-256 |
|------|---------|
| `AGENTS.md` | `a296fb97b48a32059290f247590ed8c19df2812bcd23391d8fc865b29f8b46f6` |
| `CLAUDE.md` | `6777efe99873ca341f3c926f3ba36f947d18355912cf095df79b13cdb8ef7cfc` |
| `SSOT.md` | `8b58c61ace9ecdd956a0b501f6feff58aee942b751e8eb5a909098d9cdb73472` |
| `docs/style/VOICE.md` | `39694b414fffbd77012c1fde4b27be9cb7a226d2f50971016006ba4f5e75f733` |

- [ ] Write `alawein/.claude/hooks/governance-checksums.json` with the complete content below. This is the committed baseline. The SHA-256 values must match the current on-disk state exactly — do not edit them:

```json
{
  "_note": "SHA-256 checksums of canonical governance files. Generated by update-checksums.sh. Update after any intentional change to these files by running: bash .claude/hooks/update-checksums.sh",
  "_generated": "2026-04-25",
  "files": {
    "AGENTS.md": "a296fb97b48a32059290f247590ed8c19df2812bcd23391d8fc865b29f8b46f6",
    "CLAUDE.md": "6777efe99873ca341f3c926f3ba36f947d18355912cf095df79b13cdb8ef7cfc",
    "SSOT.md": "8b58c61ace9ecdd956a0b501f6feff58aee942b751e8eb5a909098d9cdb73472",
    "docs/style/VOICE.md": "39694b414fffbd77012c1fde4b27be9cb7a226d2f50971016006ba4f5e75f733"
  }
}
```

- [ ] Verify that the checksums in the JSON match the actual files:
  ```bash
  sha256sum AGENTS.md CLAUDE.md SSOT.md docs/style/VOICE.md
  ```
  Expected output (the hex values must match the JSON above exactly, asterisk-prefixed on Windows Git Bash):
  ```
  a296fb97b48a32059290f247590ed8c19df2812bcd23391d8fc865b29f8b46f6 *AGENTS.md
  6777efe99873ca341f3c926f3ba36f947d18355912cf095df79b13cdb8ef7cfc *CLAUDE.md
  8b58c61ace9ecdd956a0b501f6feff58aee942b751e8eb5a909098d9cdb73472 *SSOT.md
  39694b414fffbd77012c1fde4b27be9cb7a226d2f50971016006ba4f5e75f733 *docs/style/VOICE.md
  ```
  If any value differs, regenerate `governance-checksums.json` by running `bash .claude/hooks/update-checksums.sh` (created in the next step) before committing.

- [ ] Write the new `alawein/.claude/hooks/drift-detection.sh` with the complete content below:

```bash
#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# drift-detection.sh — Governance Hook (I-2: Drift Is Debt)
# Version: 2.0.0
# =============================================================================
#
# Checks SHA-256 checksums of canonical governance files against the committed
# baseline in .claude/hooks/governance-checksums.json.
#
# Monitored files: AGENTS.md, CLAUDE.md, SSOT.md, docs/style/VOICE.md
#
# Exit codes:
#   0 — all checksums match (governance files unchanged)
#   1 — one or more checksums differ (governance drift detected)
#
# When drift is detected, run update-checksums.sh after reviewing the changes:
#   bash .claude/hooks/update-checksums.sh
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BASELINE="$SCRIPT_DIR/governance-checksums.json"

if [ ! -f "$BASELINE" ]; then
  echo "ERROR: governance-checksums.json not found at $BASELINE" >&2
  echo "Run: bash .claude/hooks/update-checksums.sh" >&2
  exit 1
fi

# Read expected checksums using Python (available everywhere; avoids jq dependency)
python - "$BASELINE" "$REPO_ROOT" <<'PY'
import json
import hashlib
import sys
from pathlib import Path

baseline_path = Path(sys.argv[1])
repo_root = Path(sys.argv[2])

baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
files = baseline.get("files", {})

drift_found = False

for rel_path, expected_sha in files.items():
    target = repo_root / rel_path
    if not target.exists():
        print(f"MISSING: {rel_path} (expected in governance-checksums.json)")
        drift_found = True
        continue

    actual_sha = hashlib.sha256(target.read_bytes()).hexdigest()
    if actual_sha != expected_sha:
        print(f"DRIFT: {rel_path}")
        print(f"  expected: {expected_sha}")
        print(f"  actual:   {actual_sha}")
        print(f"  If this change is intentional, run: bash .claude/hooks/update-checksums.sh")
        drift_found = True

if drift_found:
    sys.exit(1)
else:
    print("Governance files unchanged.")
PY
```

- [ ] Write `alawein/.claude/hooks/update-checksums.sh` with the complete content below:

```bash
#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# update-checksums.sh — Regenerate governance-checksums.json baseline
# =============================================================================
#
# Run this after any intentional change to a canonical governance file:
#   AGENTS.md, CLAUDE.md, SSOT.md, docs/style/VOICE.md
#
# Usage:
#   bash .claude/hooks/update-checksums.sh
#
# After running, commit both the changed governance file and the updated
# governance-checksums.json together so the baseline stays in sync.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BASELINE="$SCRIPT_DIR/governance-checksums.json"
TODAY="$(date '+%Y-%m-%d')"

cd "$REPO_ROOT"

python - "$BASELINE" "$TODAY" <<'PY'
import json
import hashlib
import sys
from pathlib import Path

baseline_path = Path(sys.argv[1])
today = sys.argv[2]

MONITORED = [
    "AGENTS.md",
    "CLAUDE.md",
    "SSOT.md",
    "docs/style/VOICE.md",
]

checksums = {}
for rel_path in MONITORED:
    target = Path(rel_path)
    if not target.exists():
        print(f"WARNING: {rel_path} not found — skipping", file=sys.stderr)
        continue
    checksums[rel_path] = hashlib.sha256(target.read_bytes()).hexdigest()

baseline = {
    "_note": "SHA-256 checksums of canonical governance files. Generated by update-checksums.sh. Update after any intentional change to these files by running: bash .claude/hooks/update-checksums.sh",
    "_generated": today,
    "files": checksums,
}

baseline_path.write_text(
    json.dumps(baseline, indent=2) + "\n",
    encoding="utf-8",
)

print(f"Updated {baseline_path}")
for rel_path, sha in checksums.items():
    print(f"  {sha}  {rel_path}")
PY
```

- [ ] Make `update-checksums.sh` executable:
  ```bash
  chmod +x .claude/hooks/update-checksums.sh
  ```

- [ ] Smoke-test the new `drift-detection.sh` against the current repo state (should exit 0):
  ```bash
  bash .claude/hooks/drift-detection.sh
  ```
  Expected output:
  ```
  Governance files unchanged.
  ```

- [ ] Commit all three files:
  ```bash
  git add .claude/hooks/drift-detection.sh .claude/hooks/governance-checksums.json .claude/hooks/update-checksums.sh
  git commit -m "fix(hooks): rewrite drift-detection.sh with SHA-256 checksum baseline; add update-checksums.sh"
  ```

---

## Task 3 — Update render_dependabot in sync-github.sh

**Files:**
- Modify: `alawein/scripts/sync-github.sh`

**Context:** The `render_dependabot` function already exists in `sync-github.sh` and already propagates `dependabot.yml` to all `sync:auto` repos (line 383). However, the `github-actions` ecosystem block in the rendered output is missing the `commit-message` prefix and `labels` fields specified in the spec. The fix adds these fields to the `github-actions` entry in `render_dependabot`. The `alawein/.github/dependabot.yml` template file already exists separately and does not need to be created — it is the control-plane's own Dependabot config, not a propagated template. The propagated YAML is generated by `render_dependabot`.

- [ ] Read `alawein/scripts/sync-github.sh` lines 95–138 to confirm the exact current state of `render_dependabot` before editing.

- [ ] Edit the `render_dependabot` function: replace the final `updates.append(...)` block (the `github-actions` entry) to add `commit-message` prefix and `labels`. Find and replace this exact block:

  **Old content (the final `updates.append` inside `render_dependabot`):**
  ```python
      updates.append(
          {
              "package-ecosystem": "github-actions",
              "directory": "/",
              "schedule": {"interval": "weekly", "day": "monday"},
              "open-pull-requests-limit": 10,
          }
      )
  ```

  **New content:**
  ```python
      updates.append(
          {
              "package-ecosystem": "github-actions",
              "directory": "/",
              "schedule": {"interval": "weekly", "day": "monday"},
              "commit-message": {"prefix": "ci"},
              "labels": ["dependencies"],
              "open-pull-requests-limit": 5,
          }
      )
  ```

- [ ] Verify the edit is syntactically valid Python (the script embeds Python in a heredoc):
  ```bash
  python -c "
  import re
  src = open('scripts/sync-github.sh').read()
  # Extract the Python heredoc and check it compiles
  m = re.search(r'python - .+?<<.PY\n(.+?)^PY', src, re.DOTALL | re.MULTILINE)
  compile(m.group(1), 'sync-github.sh', 'exec')
  print('VALID')
  "
  ```
  Expected output: `VALID`

- [ ] Commit:
  ```bash
  git add scripts/sync-github.sh
  git commit -m "fix(sync): add commit-message prefix and labels to github-actions dependabot block"
  ```

---

## Task 4 — Add *.pem, *.key, *.p12 to .gitignore template in sync-github.sh

**Files:**
- Modify: `alawein/scripts/sync-github.sh`

**Context:** The `sync-github.sh` Python heredoc contains a `.gitignore` template rendered into every `sync:auto` repo. The current template does not include `*.pem`, `*.key`, or `*.p12`. These three patterns need to be appended to the existing credential-related ignore block (typically near `*.env`, `.env*`, or `secrets` lines). This is a pure addition; no existing lines are removed.

- [ ] Read `alawein/scripts/sync-github.sh` to identify the exact location of the `.gitignore` template content within the Python heredoc. Search for the section that renders `.gitignore` or look for patterns like `node_modules`, `.env`, or `__pycache__` which are typical `.gitignore` entries.

  ```bash
  grep -n "\.env\|\.pem\|\.key\|gitignore\|node_modules" scripts/sync-github.sh | head -30
  ```

- [ ] After locating the `.gitignore` template block, add the three private key patterns. The patterns must appear in the credential/secrets section. The exact insertion point depends on the current file state — add the three lines after the last existing credential-related pattern (e.g., after `.env*` or `*.secret`). The three lines to add are:
  ```
  *.pem
  *.key
  *.p12
  ```

- [ ] Verify the file is still valid by checking the Python heredoc compiles:
  ```bash
  python -c "
  import re
  src = open('scripts/sync-github.sh').read()
  m = re.search(r'python - .+?<<.PY\n(.+?)^PY', src, re.DOTALL | re.MULTILINE)
  compile(m.group(1), 'sync-github.sh', 'exec')
  print('VALID')
  "
  ```
  Expected output: `VALID`

- [ ] Verify the patterns appear in the output:
  ```bash
  grep -n "\.pem\|\.key\|\.p12" scripts/sync-github.sh
  ```
  Expected output: three lines showing `*.pem`, `*.key`, `*.p12` in the script.

- [ ] Commit:
  ```bash
  git add scripts/sync-github.sh
  git commit -m "fix(sync): add *.pem, *.key, *.p12 to propagated .gitignore template"
  ```

---

## Task 5 — Create docs-validation-managed.yml and add to sync propagation

**Files:**
- Create: `alawein/.github/workflows/docs-validation-managed.yml`
- Modify: `alawein/scripts/sync-github.sh`
- Modify: `alawein/github-baseline.yaml`

**Context:** The existing `docs-validation.yml` is control-plane-only — it calls `build-catalog.py`, `validate-catalog.py`, Vale, and other scripts that do not exist in sibling repos. The managed variant contains only the two checks that every governed repo can run: `validate.py --ci` (forbidden register) and `markdownlint-cli` on `README.md`, `CLAUDE.md`, `AGENTS.md`. It triggers on `push` to `main` and `pull_request` on `*.md` paths. The SHA-pinned action refs use the same `workflow_ref` value from `github-baseline.yaml` (`ed5ed61aef28cbdd761eeb0654808833bc4564be`). For `actions/checkout` and `actions/setup-node`, use the same pinned SHAs already in use in the control plane's `docs-validation.yml` (checkout: `de0fac2e4500dabe0009e67214ff5f5447ce83dd`, setup-node: `53b83947a5a98c8d113130e565377fae1a50d02f`).

- [ ] Write `alawein/.github/workflows/docs-validation-managed.yml` with the complete content below:

```yaml
name: Documentation Validation

on:
  push:
    branches: [main, master]
    paths:
      - '*.md'
      - '.github/workflows/docs-validation-managed.yml'
  pull_request:
    branches: [main, master]
    paths:
      - '*.md'
      - '.github/workflows/docs-validation-managed.yml'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate-docs:
    name: Validate Documentation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Setup Python
        uses: actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405 # v6.2.0
        with:
          python-version: '3.12'

      - name: Install validation dependencies
        run: python -m pip install pyyaml

      - name: Fetch validate.py from alawein control plane
        run: |
          curl -fsSL \
            "https://raw.githubusercontent.com/alawein/alawein/ed5ed61aef28cbdd761eeb0654808833bc4564be/scripts/validate.py" \
            -o validate.py

      - name: Run forbidden register check
        run: python validate.py --ci

      - name: Setup Node.js
        uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: '20'

      - name: Lint managed markdown files
        run: |
          FILES=""
          for f in README.md CLAUDE.md AGENTS.md; do
            [ -f "$f" ] && FILES="$FILES $f"
          done
          if [ -n "$FILES" ]; then
            npx --yes markdownlint-cli@0.39.0 $FILES
          else
            echo "No managed markdown files found — skipping markdownlint."
          fi
```

- [ ] Verify the workflow YAML is valid:
  ```bash
  python -c "import yaml; yaml.safe_load(open('.github/workflows/docs-validation-managed.yml')); print('VALID')"
  ```
  Expected output: `VALID`

- [ ] Edit `alawein/scripts/sync-github.sh` to propagate `docs-validation-managed.yml`. In the Python heredoc, add `docs-validation-managed.yml` to the workflow propagation. Locate the section in `sync_repo` where `ci.yml` and `codeql.yml` are written (around lines 385–395). After the `codeql_path` block, add the following logic:

  Find the line:
  ```python
      for legacy in LEGACY_DELETE:
  ```

  Insert before it:
  ```python
      docs_managed_src = ORG_REPO / ".github" / "workflows" / "docs-validation-managed.yml"
      if docs_managed_src.exists():
          issues.extend(
              ensure_text(
                  repo_dir / ".github" / "workflows" / "docs-validation-managed.yml",
                  docs_managed_src.read_text(encoding="utf-8"),
                  check=check,
              )
          )

  ```

- [ ] Verify the Python heredoc still compiles:
  ```bash
  python -c "
  import re
  src = open('scripts/sync-github.sh').read()
  m = re.search(r'python - .+?<<.PY\n(.+?)^PY', src, re.DOTALL | re.MULTILINE)
  compile(m.group(1), 'sync-github.sh', 'exec')
  print('VALID')
  "
  ```
  Expected output: `VALID`

- [ ] Edit `alawein/github-baseline.yaml` to document the new required baseline files. Add a `required_files` block at the top level (after `workflow_ref`, before `repos`):

  Find:
  ```yaml
  repos:
    - repo: alawein
  ```

  Insert before it:
  ```yaml
  required_files:
    - .github/dependabot.yml
    - .github/workflows/docs-validation-managed.yml

  ```

- [ ] Verify `github-baseline.yaml` is valid YAML:
  ```bash
  python -c "import yaml; yaml.safe_load(open('github-baseline.yaml')); print('VALID')"
  ```
  Expected output: `VALID`

- [ ] Commit all three files:
  ```bash
  git add .github/workflows/docs-validation-managed.yml scripts/sync-github.sh github-baseline.yaml
  git commit -m "feat(sync): add docs-validation-managed.yml workflow and propagate to sync:auto repos"
  ```

---

## Task 6 — Run the full validation suite

**Files:** (none written — validation only)

**Context:** Run the existing validation suite from inside `alawein/` (the git repo at `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/`). All commands must pass before declaring the implementation complete.

- [ ] Run style rules check:
  ```bash
  python scripts/build-style-rules.py --check
  ```
  Expected: exits 0, no errors.

- [ ] Run forbidden register check:
  ```bash
  python scripts/validate.py --ci
  ```
  Expected: exits 0, no forbidden-register violations in governed surfaces.

- [ ] Run doc contract validation:
  ```bash
  bash ./scripts/validate-doc-contract.sh --full
  ```
  Expected: exits 0, all governed doc surfaces pass contract checks.

- [ ] Run sync check against all `sync:auto` repos (read-only, no writes):
  ```bash
  ./scripts/sync-github.sh --check --all
  ```
  Expected: for each `sync:auto` repo, output is either `CHECK: <repo>` (no drift) or a list of `DRIFT:`/`MISSING:` lines. DRIFT lines for `docs-validation-managed.yml` and updated `dependabot.yml` are expected on first run — they document what the next actual sync will write. The check must not error out on the sync logic itself (only on detected drift).

- [ ] Run GitHub baseline audit:
  ```bash
  python scripts/github-baseline-audit.py
  ```
  Expected: exits 0. If this script validates the `required_files` key added to `github-baseline.yaml`, confirm it handles the new key without parsing errors.

- [ ] Run drift detection hook to confirm it exits 0 with current governance files:
  ```bash
  bash .claude/hooks/drift-detection.sh
  ```
  Expected output:
  ```
  Governance files unchanged.
  ```

- [ ] If any validation step fails, diagnose the failure and fix before proceeding. Do not mark this task complete with any validator returning a non-zero exit code. Common failure modes:
  - `build-style-rules.py` fails: a new file introduced forbidden terminology — fix the file content.
  - `validate-doc-contract.sh` fails: missing frontmatter on a new file — add the required fields.
  - `sync-github.sh` Python syntax error: the heredoc edit introduced a bug — re-read the file and fix.
  - `github-baseline-audit.py` fails on `required_files` key: the auditor does not recognize the new key — check if the auditor needs updating or if the key should be named differently.

- [ ] Final confirmation — all five validators must have exited 0 before this task is marked complete. No commit is needed for this task (it is validation only).
