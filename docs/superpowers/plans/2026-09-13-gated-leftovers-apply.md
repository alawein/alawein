---
type: plan
status: ready
source: writing-plans 2026-09-13 gated leftovers apply
last_updated: 2026-09-13
owner: meshal
---

# Gated leftovers apply Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Open or report the Sider evidence PR, prove hygiene, freeze leftovers to the seven exact-yes gates; no new absorb scaffolding.

**Architecture:** Git absorb pack + Sider branch are SoR for remaining work. Cursor does ungated git/hygiene. Exact-yes gates stop. Grok Bot `86e1bc91` curates local plan/Intake only.

**Tech Stack:** git, `gh`, Python doctrine/catalog scripts, bash validators on Windows Git Bash or WSL when required.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-13-gated-leftovers-apply-design.md` (approved).
- Base: `alawein/alawein` `main` `61690116` (#266).
- Evidence branch: `cursor/sider-evidence-land-295b` @ `851d3a4a`.
- Pack: `docs/internal/maios/cursor-first-absorb-2026-09-13/`.
- No AGI import. No Brief body. No unnamed rotate. No Grok HTTP API. No sync daemon. No third scoreboard. Skills beat new bots. Meshal tags next agent.
- Approving this plan is not exact yes for gates 1–7 actions that mutate Desktop, secrets, owners, or TEMP deletes.

## File map

| Path | Role |
| --- | --- |
| `docs/superpowers/specs/2026-09-13-gated-leftovers-apply-design.md` | Approved design |
| `docs/superpowers/plans/2026-09-13-gated-leftovers-apply.md` | This plan |
| `docs/internal/maios/cursor-first-absorb-2026-09-13/*` | SoR pack (read; evidence branch may update quotes only) |
| Desktop scoreboard | Input only; not committed |

---

### Task 1: Land design + plan on a docs branch

**Files:**
- Create: `docs/superpowers/specs/2026-09-13-gated-leftovers-apply-design.md`
- Create: `docs/superpowers/plans/2026-09-13-gated-leftovers-apply.md`

**Interfaces:**
- Consumes: approved brainstorming SoR = A
- Produces: committed design + plan paths for later tasks

- [ ] **Step 1: Confirm working tree tip**

Run:

```bash
git fetch origin main
git rev-parse origin/main
```

Expected: starts with `61690116`.

- [ ] **Step 2: Branch for design/plan only**

```bash
git checkout -B cursor/gated-leftovers-apply-plan origin/main
```

- [ ] **Step 3: Confirm design and plan files exist at the paths above**

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-09-13-gated-leftovers-apply-design.md docs/superpowers/plans/2026-09-13-gated-leftovers-apply.md
git commit -m "$(cat <<'EOF'
docs: add gated leftovers apply design and plan

Record SoR A (git absorb + Sider) and the seven exact-yes gates after absorb delivery closed.
EOF
)"
```

- [ ] **Step 5: Push**

```bash
git push -u origin HEAD
```

---

### Task 2: Open or report evidence PR

**Files:** none (branch already on origin)

**Interfaces:**
- Consumes: `origin/cursor/sider-evidence-land-295b`
- Produces: PR URL or recorded HTTP 500

- [ ] **Step 1: Confirm branch tip**

```bash
git fetch origin cursor/sider-evidence-land-295b
git rev-parse origin/cursor/sider-evidence-land-295b
```

Expected: starts with `851d3a4a`.

- [ ] **Step 2: Confirm no existing PR**

```bash
gh pr list -R alawein/alawein --head cursor/sider-evidence-land-295b --json number,url,state
```

Expected: `[]` or one open PR (if open, skip create).

- [ ] **Step 3: Create PR**

```bash
gh pr create -R alawein/alawein --base main --head cursor/sider-evidence-land-295b --title "docs: land Sider evidence quotes for absorb pack" --body "$(cat <<'EOF'
## Summary
- Record Sider KAUST quote and Cloudflare account check on the absorb pack.
- Absorb evidence only. No CV patch. No secret rotate. No AGI import.

## Test plan
- [ ] Diff limited to absorb pack evidence updates
- [ ] No catalog/generated edits
- [ ] Cloudflare: Service Key not found → rotate none (Gate 5)
EOF
)"
```

- [ ] **Step 4: On success, record URL. On HTTP 500, record status and stop PR retries.**

Do not thrash. Branch stays on origin either way.

---

### Task 3: Hygiene commands 6–11

**Files:** none (check-only)

**Interfaces:**
- Consumes: clean checkout of `main` or evidence branch tip for read-only checks
- Produces: pass/fail log; stop on fail

- [ ] **Step 1: Checkout main for baseline hygiene**

```bash
git checkout main
git pull --ff-only origin main
```

- [ ] **Step 2: Run validators**

```bash
python scripts/catalog/sync-readme.py --check
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/validate.py --ci
python scripts/doctrine/build-style-rules.py --check
python scripts/doctrine/style-advisory-audit.py --repo-root .
python scripts/catalog/validate-agent-integrations.py --strict
```

On Windows, use Git Bash for the `.sh` script if `bash` is available.

- [ ] **Step 3: Record each exit code. Stop the mission on hard fail (do not invent fixes outside scope).**

Advisory-only failures from `style-advisory-audit.py` are notes, not blockers, unless the script exits non-zero by contract.

---

### Task 4: Freeze leftover list + Grok Intake paste

**Files:** none in git for the freeze (chat/Notion ops only if Meshal tags Notion)

**Interfaces:**
- Consumes: design seven-gate list
- Produces: Intake line for Grok Bot; leftover list text

- [ ] **Step 1: Emit leftover list exactly**

```text
(1) rev f keep vs merge
(2) operating-map header
(3) MOVE
(4) KAUST/AGI/knowledge-base grant+test
(5) Cloudflare: nothing to rotate unless a Service Key appears
(6) alawein vs workspace-control owners
(7) TEMP sidebar delete
```

- [ ] **Step 2: Emit Grok Intake line for Meshal to paste to Bot `86e1bc91`**

```text
SoR remaining-work = git pack docs/internal/maios/cursor-first-absorb-2026-09-13/ + branch cursor/sider-evidence-land-295b. main tip 61690116. Desktop CHECKLIST-SCOREBOARD is input only. Curate local plan to match git repo rows. Do not write catalog/ or kits. No HTTP agents API. Leftovers = seven exact-yes gates only.
```

- [ ] **Step 3: Do not execute Gates 1–7 actions in this task.**

Stop. Meshal tags each gate agent with exact yes.

---

### Task 5: Open design/plan PR (optional same session)

**Files:** Task 1 branch

- [ ] **Step 1: Open PR for `cursor/gated-leftovers-apply-plan` if pushed**

```bash
gh pr create -R alawein/alawein --base main --head cursor/gated-leftovers-apply-plan --title "docs: gated leftovers apply design and plan" --body "$(cat <<'EOF'
## Summary
- Design + plan for post-absorb gated apply under SoR A.
- Does not merge evidence branch; does not execute exact-yes gates.

## Test plan
- [ ] Paths under docs/superpowers only
- [ ] No catalog edits
EOF
)"
```

- [ ] **Step 2: Do not merge without Meshal exact `promote it`.**

---

## Gate stop sheet (not Tasks 1–5)

| Gate | Exact yes needed | Executor when yes |
| --- | --- | --- |
| 1 rev f | keep or merge | Meshal / voice-check |
| 2 operating-map | doc write yes | Laptop |
| 3 MOVE | named MOVE yes | Cleanup + manifest |
| 4 KB grant+test | grant + patch yes | Sider HAND / Cursor after read |
| 5 Cloudflare | rotate only if key found | Meshal console |
| 6 owners | decide matrix | Meshal |
| 7 TEMP delete | delete yes | Desktop UI / Claude Code |

---

## Self-review

1. Spec coverage: evidence PR, hygiene, seven gates, Grok curator, constraints → Tasks 1–4 + gate sheet.
2. No placeholders.
3. No absorb scaffolding tasks.
