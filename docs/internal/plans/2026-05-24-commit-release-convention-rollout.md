---
type: canonical
source: writing-plans session 2026-05-24
sla: on-change
last_updated: 2026-05-24
audience: [ai-agents, contributors]
---

# Commit, Branch, and Release Convention Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Roll out the approved commit/branch/release convention (spec: `docs/internal/specs/2026-05-24-commit-release-convention-design.md`) across the workspace: publish the canonical doc, update governance to lift the single-committer rule, add per-repo commit modes, stand up phased enforcement, and dogfood by committing this session's staged backlog the new way.

**Architecture:** A canonical convention doc in `alawein/alawein/docs/governance/` is the source of truth, linked from `CONTRIBUTING.md` and synced fleet-wide. Per-repo authority is a `commit_mode` field in `catalog/repos.json` (absent means `full`). Enforcement is phased: a standalone advisory commit-message linter ships first; PR wiring and the version-coherence flip are deferred. The rule change is scoped to workspace governance (project `CLAUDE.md`/`AGENTS.md`, workspace-root `CLAUDE.md`, memory); the global `~/.claude/CLAUDE.md` is left intact because project-local instructions already take precedence over it.

**Tech Stack:** Markdown governance docs; Python 3.12 (`py -3.12`) for the catalog field + commit linter + their pytest tests; git for the dogfood commits, authored as `contact@meshal.ai`.

**Hard constraints (every task):**
- Agent-authored commits use git identity `contact@meshal.ai`, no AI attribution, no em-dashes, conventional subject.
- Never commit secrets/`.env`/credentials. Force-push or history rewrite on a shared (pushed) branch needs explicit confirmation.
- `alawein/alawein` runs a Docs Doctrine pre-commit hook; let it run (do not bypass). Any governed `.md` edited there must bump `last_updated`; `docs/internal/` and `docs/archive/` are CI-exempt.
- Work on a branch off `main`: `feat/commit-release-convention`. Do not start on `main`.

---

## Task 0: Pre-flight

**Files:** none (read-only + branch setup).

- [ ] **Step 1: Confirm identity and branch.** Run:
```powershell
$g = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\alawein'
git -C $g config user.email          # expect contact@meshal.ai
git -C $g rev-parse --abbrev-ref HEAD # note current branch
```
Expected: `contact@meshal.ai`. If not, `git -C $g config user.email 'contact@meshal.ai'`.

- [ ] **Step 2: Decide the working branch.** The spec commit (`e19f4e68`) currently sits on `chore/governance-cleanup`. Keep this rollout on the same branch if you intend the convention to land with the governance work, or create `feat/commit-release-convention` off it. This plan assumes the convention work stays on the current governance branch (the spec is already there). Confirm with `git -C $g status -sb`.

- [ ] **Step 3: Read the files this plan edits** so the exact-text steps below match the live content: `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`, `catalog/repos.json` (a sample entry), `scripts/catalog/validate-catalog.py`, and the workspace-root `../../CLAUDE.md`. If any differ from what a step quotes, adapt the step to the live text (the file may have drifted).

---

## Task 1: Publish the canonical convention doc

**Files:**
- Create: `alawein/alawein/docs/governance/commit-release-convention.md`
- Modify: `alawein/alawein/CONTRIBUTING.md` (add a link)

- [ ] **Step 1: Write the canonical doc.** Promote the approved spec into a governed reference. Copy the substance of spec sections 1-5 (commit modes, message format, branches, releases, enforcement) into `docs/governance/commit-release-convention.md`, with these changes from the spec:
  - Add doctrine frontmatter: `type: canonical`, `last_updated: 2026-05-24`, `audience: [ai-agents, contributors]`.
  - Lead with a one-paragraph summary: agents may commit (per-repo mode, default `full`); no AI attribution, authored as `contact@meshal.ai`; uniform semver.
  - Drop the spec's "Why", "Governance reconciliation and rollout", and "Open items" sections (those are design-record material, not reference).
  - Add a concrete **examples** block (a real commit message, a real branch name, a real CHANGELOG `Unreleased`-to-version transition, a real `vX.Y.Z` tag command).
  - State the two invariants verbatim and that they hold in every mode.
- [ ] **Step 2: Lint the doc for voice.** Run the project voice check on it:
```powershell
$g = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\alawein'
py -3.12 "$g\scripts\doctrine\validate.py" --ci
```
Expected: `OK - no violations found.` (catches em-dashes/voice). Fix any finding.
- [ ] **Step 3: Link it from CONTRIBUTING.** In `CONTRIBUTING.md`, add under its conventions/commits area: `See [docs/governance/commit-release-convention.md](docs/governance/commit-release-convention.md) for the full commit, branch, and release convention.` Bump `CONTRIBUTING.md` `last_updated` if it has frontmatter.
- [ ] **Step 4: Run the doctrine gate.**
```powershell
Push-Location $g; try { bash ./scripts/doctrine/validate-doc-contract.sh --full } finally { Pop-Location }
```
Expected: PASS.
- [ ] **Step 5: Commit.**
```powershell
git -C $g add -- docs/governance/commit-release-convention.md CONTRIBUTING.md
git -C $g commit -m "docs(governance): publish commit, branch, and release convention"
```

---

## Task 2: Per-repo `commit_mode` in the catalog

**Files:**
- Modify: `alawein/alawein/catalog/repos.json` (schema usage; no entry needs the field yet since default is `full`)
- Modify: `alawein/alawein/scripts/catalog/validate-catalog.py` (accept the optional field)
- Create: `alawein/alawein/scripts/catalog/commit_mode.py` (reader helper)
- Test: `alawein/alawein/scripts/tests/test_commit_mode.py`

- [ ] **Step 1: Write the failing test.** Create `scripts/tests/test_commit_mode.py`:
```python
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "catalog" / "commit_mode.py"
_spec = importlib.util.spec_from_file_location("commit_mode", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["commit_mode"] = _mod
_spec.loader.exec_module(_mod)
cm = _mod

VALID = {"full", "guardrailed", "local"}


def test_absent_defaults_to_full() -> None:
    assert cm.commit_mode({"slug": "x"}) == "full"


def test_explicit_mode_is_returned() -> None:
    assert cm.commit_mode({"slug": "x", "commit_mode": "guardrailed"}) == "guardrailed"


def test_invalid_mode_raises() -> None:
    import pytest
    with pytest.raises(ValueError):
        cm.commit_mode({"slug": "x", "commit_mode": "yolo"})


def test_valid_modes_constant() -> None:
    assert cm.VALID_MODES == VALID
```
- [ ] **Step 2: Run it, expect failure.**
```powershell
Push-Location $g; try { py -3.12 -m pytest scripts/tests/test_commit_mode.py -q } finally { Pop-Location }
```
Expected: FAIL (no module `commit_mode`).
- [ ] **Step 3: Implement the helper.** Create `scripts/catalog/commit_mode.py`:
```python
"""Per-repo commit authority from catalog/repos.json. Absent means 'full'."""
from __future__ import annotations

VALID_MODES = {"full", "guardrailed", "local"}


def commit_mode(entry: dict) -> str:
    mode = entry.get("commit_mode", "full")
    if mode not in VALID_MODES:
        raise ValueError(
            f"invalid commit_mode {mode!r} for {entry.get('slug')!r}; "
            f"expected one of {sorted(VALID_MODES)}"
        )
    return mode
```
- [ ] **Step 4: Run it, expect pass.**
```powershell
Push-Location $g; try { py -3.12 -m pytest scripts/tests/test_commit_mode.py -q } finally { Pop-Location }
```
Expected: PASS (4 tests).
- [ ] **Step 5: Make the catalog validator accept the field.** In `scripts/catalog/validate-catalog.py`, find where per-entry keys/fields are validated. Add `commit_mode` to the allowed optional keys, and if present, assert it is in `{"full", "guardrailed", "local"}` (import and reuse `commit_mode.VALID_MODES` or inline the set). If the validator has no key allowlist, add a focused check that any present `commit_mode` value is valid. Run `py -3.12 scripts/catalog/validate-catalog.py`; expect PASS (no entries set the field yet, so this is a no-op until one does).
- [ ] **Step 6: Document the field** in the canonical doc (Task 1 output): note `commit_mode` is an optional `catalog/repos.json` field, one of `full|guardrailed|local`, absent means `full`. Bump that doc's `last_updated` if needed.
- [ ] **Step 7: Commit.**
```powershell
git -C $g add -- scripts/catalog/commit_mode.py scripts/tests/test_commit_mode.py scripts/catalog/validate-catalog.py docs/governance/commit-release-convention.md
git -C $g commit -m "feat(catalog): add optional per-repo commit_mode field (default full)"
```

---

## Task 3: Advisory commit-message linter

**Files:**
- Create: `alawein/alawein/scripts/doctrine/commit_lint.py`
- Test: `alawein/alawein/scripts/tests/test_commit_lint.py`

- [ ] **Step 1: Write the failing test.** Create `scripts/tests/test_commit_lint.py`:
```python
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts" / "doctrine" / "commit_lint.py"
_spec = importlib.util.spec_from_file_location("commit_lint", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["commit_lint"] = _mod
_spec.loader.exec_module(_mod)
cl = _mod


def test_valid_subject_passes() -> None:
    assert cl.lint_subject("feat(catalog): add commit_mode field") == []


def test_unknown_type_fails() -> None:
    assert cl.lint_subject("widget(catalog): do a thing")


def test_missing_colon_fails() -> None:
    assert cl.lint_subject("feat add a thing")


def test_em_dash_fails() -> None:
    assert cl.lint_subject("feat(x): tidy the thing " + chr(0x2014) + " and another")


def test_too_long_fails() -> None:
    assert cl.lint_subject("feat(x): " + "a" * 80)


def test_trailing_period_fails() -> None:
    assert cl.lint_subject("feat(x): add a thing.")


def test_ai_attribution_in_body_fails() -> None:
    msg = "feat(x): add a thing\n\nCo-Authored-By: Claude <noreply@anthropic.com>"
    assert cl.lint_message(msg)
```
- [ ] **Step 2: Run it, expect failure.**
```powershell
Push-Location $g; try { py -3.12 -m pytest scripts/tests/test_commit_lint.py -q } finally { Pop-Location }
```
Expected: FAIL (no module).
- [ ] **Step 3: Implement the linter.** Create `scripts/doctrine/commit_lint.py`:
```python
"""Advisory linter for the workspace commit convention.

Checks the subject against Conventional Commits plus the house rules (length,
imperative-ish lowercase, no trailing period, no em-dash) and the whole message
for AI attribution. Returns a list of findings; empty means clean.
"""
from __future__ import annotations

import re
import sys

TYPES = {
    "feat", "fix", "docs", "chore", "test",
    "refactor", "perf", "build", "ci", "style", "revert",
}
SUBJECT_RE = re.compile(r"^(?P<type>[a-z]+)(?:\((?P<scope>[^)]+)\))?(?P<bang>!)?: (?P<desc>.+)$")
AI_MARKERS = ("co-authored-by: claude", "generated with claude", "anthropic.com")


def lint_subject(subject: str) -> list[str]:
    findings: list[str] = []
    if chr(0x2014) in subject:
        findings.append("subject contains an em-dash")
    if len(subject) > 72:
        findings.append(f"subject exceeds 72 characters ({len(subject)})")
    match = SUBJECT_RE.match(subject)
    if not match:
        findings.append("subject must be 'type(scope): description'")
        return findings
    if match.group("type") not in TYPES:
        findings.append(f"unknown type {match.group('type')!r}; expected one of {sorted(TYPES)}")
    desc = match.group("desc")
    if desc.endswith("."):
        findings.append("subject must not end with a period")
    if desc[:1].isupper():
        findings.append("description should start lowercase")
    return findings


def lint_message(message: str) -> list[str]:
    lines = message.splitlines()
    findings = lint_subject(lines[0]) if lines else ["empty commit message"]
    lower = message.lower()
    for marker in AI_MARKERS:
        if marker in lower:
            findings.append(f"AI attribution found ({marker!r}); not allowed")
    if chr(0x2014) in message:
        findings.append("message body contains an em-dash")
    return findings


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: commit_lint.py <commit-message-file>")
        return 2
    text = open(argv[0], encoding="utf-8").read()
    findings = lint_message(text)
    for f in findings:
        print(f"commit-lint: {f}")
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```
- [ ] **Step 4: Run it, expect pass.**
```powershell
Push-Location $g; try { py -3.12 -m pytest scripts/tests/test_commit_lint.py -q } finally { Pop-Location }
```
Expected: PASS (7 tests).
- [ ] **Step 5: Commit.**
```powershell
git -C $g add -- scripts/doctrine/commit_lint.py scripts/tests/test_commit_lint.py
git -C $g commit -m "feat(doctrine): add advisory commit-message linter"
```

---

## Task 4: Update workspace governance to lift the single-committer rule

**Files (each is a governed `.md`; bump `last_updated` where it has frontmatter):**
- Modify: `alawein/alawein/AGENTS.md`
- Modify: `alawein/alawein/CLAUDE.md`
- Modify: `../CLAUDE.md` (workspace root `GitHub/CLAUDE.md`)
- Modify: cross-session memory `C:\Users\mesha\.claude\projects\C--Users-mesha-Desktop-Dropbox-GitHub\memory\project_fleet_remediation.md`

- [ ] **Step 1: AGENTS.md.** Add a short "Commit authority" subsection: agents may commit per the repo's `commit_mode` (default `full`); authored as `contact@meshal.ai`, no AI attribution; the two invariants (no secrets; confirm before destructive history on shared branches) always apply. Link to `docs/governance/commit-release-convention.md`. Keep the existing "no AI attribution" and "check remotes before pushing" constraints (they are consistent).
- [ ] **Step 2: CLAUDE.md (alawein/alawein).** Add a "Commits and releases" line pointing to the canonical doc, and state that the prior "maintainer authors all commits" program rule is superseded by the per-repo mode model.
- [ ] **Step 3: Workspace-root `GitHub/CLAUDE.md`.** Its "Do not add AI attribution to any commit message" line stays. Add: agents may author commits per each repo's `commit_mode` (default `full`); see `alawein/alawein/docs/governance/commit-release-convention.md`.
- [ ] **Step 4: Memory.** In `project_fleet_remediation.md`, replace the hard rule "the maintainer authors ALL commits" with: agents may commit per repo `commit_mode` (default `full`), authored as `contact@meshal.ai`, no attribution; invariants = no secrets, confirm before destructive history. Update the MEMORY.md hook line if it implies maintainer-only commits.
- [ ] **Step 5: Gate + commit (the two in-repo files).**
```powershell
Push-Location $g; try { py -3.12 scripts/doctrine/validate.py --ci; bash ./scripts/doctrine/validate-doc-contract.sh --full } finally { Pop-Location }
git -C $g add -- AGENTS.md CLAUDE.md
git -C $g commit -m "docs(governance): replace single-committer rule with per-repo commit modes"
```
The workspace-root `GitHub/CLAUDE.md` is not in this repo; commit it wherever it is version-controlled (it is a loose workspace file, so it is saved on disk only). The memory file is outside version control; saving it is enough.

---

## Task 5: Dogfood by committing the staged backlog (the new way)

This is the payoff: with commit authority in place, land the session's staged backlog as agent-authored commits in `full` mode.

- [ ] **Step 1: Re-snapshot** with Task 0 of `docs/internal/plans/2026-05-24-commit-backlog-execution.md` (state drifts; the maintainer may have committed some).
- [ ] **Step 2: Commit the keystone + Task 2.0 + the 14 rows** in `alawein/alawein` using the grouped commits in `2026-05-24-commit-execution-handoff.md` Appendix A (Wave 1) plus the Task 2.0 commit (`fix(github): resolve repos by bucketed catalog local_path with loud drift detection`). The spec/convention/catalog/lint commits from Tasks 1-4 of THIS plan are already part of that history.
- [ ] **Step 3: Commit the per-repo backlog** (tools, research, products, ventures, family, personal, other orgs) using the Appendix blocks, now agent-authored (you no longer hand each to the maintainer). Honor each repo's `commit_mode` (all default `full`). For `roka-oakland-hustle`, set its identity to `contact@meshal.ai` first (it carried a placeholder; the spec mandates the canonical identity, not `meshal@kohyr.com`).
- [ ] **Step 4: Verify** with the Task 7 wrap-up snapshot in the commit-backlog plan: clean trees except intentional WIP (edfp settings.json, knowledge-base, prompty, menax, optiqap).
- [ ] **Step 5: Push / open PRs** per each repo's mode and release model. `full`-mode repos may push directly; check `git remote -v` first. This is the point where outward-facing publication happens; the no-secrets and destructive-history invariants still hold.

---

## Task 6: Deferred enforcement (documented, not executed now)

Per the phased plan, these are intentionally left for a later pass (they touch `.github/`, which is gated by the rollout itself):

- [ ] Wire `commit_lint.py` and a CHANGELOG-updated check into the reusable PR CI (advisory first), via the github sync tooling.
- [ ] After repos converge on coherent versions, flip the existing `version-coherence` check from warn-only to blocking in `ci-python.yml`/`ci-node.yml`.
- [ ] Optionally add a local `commit-msg` git hook that runs `commit_lint.py`, mirroring the existing Docs Doctrine pre-commit hook.

---

## Self-review

- **Spec coverage:** modes + default full (Task 2 + Task 4); attribution none + identity `contact@meshal.ai` (constraints + Task 4 + Task 5 Step 3); uniform semver + anchor (Task 1 doc); enforcement phased (Task 3 now, Task 6 deferred); governance reconciliation + rollout + dogfood (Tasks 4 and 5). All spec sections map to a task.
- **Placeholder scan:** code tasks (2, 3) carry full code + tests; doc tasks (1, 4) give exact files and the specific content to add; the dogfood (5) references the existing execution-plan blocks rather than restating 36 repos. No "TBD".
- **Type/name consistency:** `commit_mode()` / `VALID_MODES` (Task 2), `lint_subject()` / `lint_message()` / `main()` (Task 3) are used consistently in their tests; the three mode names `full|guardrailed|local` match the spec and the catalog field throughout.
- **Constraint check:** every commit step uses a conventional subject, no attribution, identity `contact@meshal.ai`; the doctrine gate runs before doc commits; the rule change stays workspace-scoped (global config untouched).
