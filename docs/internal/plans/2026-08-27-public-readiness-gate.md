---
title: Public readiness gate: implementation plan
date: 2026-08-27
status: draft
type: implementation-plan
source_spec: docs/internal/specs/2026-08-27-public-readiness-gate-design.md
last_updated: 2026-08-27
---

# Public Readiness Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every fleet repo private unless it carries a current, passing public scan in the catalog, enforced by a read-only validator against live GitHub.

**Architecture:** A `promotion` record per slug in `catalog/index.yaml` flows through `compile_index.py` into `catalog/repos.json`. Offline rules (shape, freshness, pinned-implies-P0) live in `catalog_lib.validate_catalogs` so `build-catalog.py --check` fails locally first. A new `scripts/github/validate-visibility.py` compares catalog to live GitHub (visibility, emptiness, README, LICENSE, live pins) and runs in the Docs Doctrine workflow. Templates and canon docs are brought in line; the public scan for the 11 public repos is recorded in a matrix and seeded as `promotion` records.

**Tech Stack:** Python 3.11+ stdlib (`urllib`, `json`, `argparse`, `datetime`), PyYAML only in CLI loaders, `unittest` under pytest, GitHub REST and GraphQL via `GITHUB_TOKEN`, `gh` CLI for the one manual flip.

**Spec:** `docs/internal/specs/2026-08-27-public-readiness-gate-design.md`

## Global Constraints

- Voice: no em dash (U+2014) anywhere in docs, code comments, commits, or PR bodies; none of the banned register in `docs/style/VOICE.md`; plain ASCII in new files.
- Commits: imperative subject under 70 chars, author `contact@meshal.ai`, no `Co-Authored-By`, no AI attribution. Stage explicit paths only.
- Any `.md` touched gets `last_updated: 2026-08-27`; `SSOT.md` also gets `last-verified: 2026-08-27`.
- Never hand-edit `catalog/repos.json`, `projects.json`, `catalog/generated/*`, or `README.md`; edit `catalog/index.yaml` and run `python scripts/catalog/build-catalog.py` then `python scripts/catalog/sync-readme.py`.
- Nothing in this plan mutates GitHub except Task 9, which runs only in the main session after the user approves the batch table in that turn. Subagents never run `gh api -X PATCH`.
- `scripts/tests/` runs on CI with `pytest` only (no PyYAML). Pure functions under test take dicts; YAML loading stays in CLI entry points.
- Python files are LF. `.gitattributes` already enforces `* text=auto`.
- `promotion` shape (from the spec): `tier` in `P0 | P1 | P2 | P3`; `scanned` ISO date; optional `grace_until` ISO date; optional `notes` string. Public requires tier in `{P0, P1}` and `scanned` within 90 days, or `grace_until` in the future. Pinned requires public and P0, or `grace_until` in the future.

Two refinements to the spec, decided while planning:

- The `promotion` schema addition goes in `schemas/repo.schema.json` (the `repos.json` schema), not `projects.schema.json`. `promotion` is not propagated into `projects.json`; nothing consumes it there.
- `grace_until` also suppresses the pinned-below-P0 rule (V5) during the fix wave, not only the research checks. The five current pins are P1 today and become P0 only after the README redo (sub-project 3). A recorded deadline is more honest than five provisional P0s.
- Grace is silent in the offline catalog rule and a warning in the gate CLI. CI runs `validate-catalog.py --strict` (`docs-validation.yml:81`, `github-metadata-sync.yml:75,154`), which fails on warnings; a grace warning there would turn CI red for the whole fix wave. The deadline is still enforced: an expired grace is an error in both tools.

---

### Task 0: Branch from main after PR #184 merges

**Files:** none

**Interfaces:**
- Produces: branch `feat/public-readiness-gate` on top of `main` containing `catalog/index.yaml`.

- [ ] **Step 1: Confirm PR #184 is merged and #183 is closed**

Run: `gh pr view 184 --json state,mergedAt --jq '{state,mergedAt}'` and `gh pr view 183 --json state --jq .state`
Expected: `184` shows `MERGED`; `183` shows `CLOSED`. If either is not, stop and report; the user merges #184 and closes #183 (its commit is inside #184).

- [ ] **Step 2: Create the branch**

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout -b feat/public-readiness-gate
git config user.email
```
Expected: last line prints `contact@meshal.ai`. `ls catalog/index.yaml` exists.

- [ ] **Step 3: Baseline the validators**

Run: `python scripts/catalog/build-catalog.py --check && python -m pytest scripts/tests scripts/doctrine/tests -q`
Expected: build check prints `Derived catalog outputs are up to date.`; pytest all pass. Record the test count in the PR body later.

---

### Task 1: Carry `promotion` from index.yaml to repos.json

**Files:**
- Modify: `scripts/catalog/compile_index.py` (`slim_entry` at ~228-253, `compile_repo` at ~276-352)
- Modify: `schemas/repo.schema.json` (`$defs.repo.properties`, after `visibility` at ~78-81)
- Create: `scripts/tests/test_compile_index_promotion.py`

**Interfaces:**
- Consumes: `compile_repo(lane, bucket, entry, prior)` and `slim_entry(repo, *, bucket)` in `compile_index.py`.
- Produces: `repos.json` entries carry `promotion: {tier, scanned, grace_until?, notes?}` when the index entry has one, and drop it when the index entry does not (index is the edit surface; prior `repos.json` never resurrects it).

- [ ] **Step 1: Write the failing tests**

Create `scripts/tests/test_compile_index_promotion.py`:

```python
"""promotion passes from catalog/index.yaml entries to repos.json and back."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

CATALOG_DIR = Path(__file__).resolve().parents[1] / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from compile_index import compile_repo, slim_entry  # noqa: E402

PROMOTION = {"tier": "P1", "scanned": "2026-08-27", "notes": "scan v1"}


def _entry(**kw):
    base = {"slug": "demo", "about": "Demo repo.", "visibility": "public"}
    base.update(kw)
    return base


class CompileRepoPromotionTests(unittest.TestCase):
    def test_promotion_is_carried_from_entry(self) -> None:
        repo = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        self.assertEqual(repo["promotion"], PROMOTION)

    def test_promotion_absent_when_entry_has_none(self) -> None:
        repo = compile_repo("lab", "lab", _entry(), None)
        self.assertNotIn("promotion", repo)

    def test_prior_promotion_is_dropped_when_entry_has_none(self) -> None:
        prior = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        repo = compile_repo("lab", "lab", _entry(), prior)
        self.assertNotIn("promotion", repo)

    def test_entry_promotion_overrides_prior(self) -> None:
        prior = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        newer = {"tier": "P0", "scanned": "2026-09-01"}
        repo = compile_repo("lab", "lab", _entry(promotion=newer), prior)
        self.assertEqual(repo["promotion"], newer)


class SlimEntryPromotionTests(unittest.TestCase):
    def test_slim_entry_keeps_promotion(self) -> None:
        repo = compile_repo("lab", "lab", _entry(promotion=PROMOTION), None)
        slim = slim_entry(repo, bucket="lab")
        self.assertEqual(slim["promotion"], PROMOTION)

    def test_slim_entry_omits_missing_promotion(self) -> None:
        repo = compile_repo("lab", "lab", _entry(), None)
        slim = slim_entry(repo, bucket="lab")
        self.assertNotIn("promotion", slim)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
```

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest scripts/tests/test_compile_index_promotion.py -q`
Expected: 4 failures (`KeyError: 'promotion'` or `AssertionError: 'promotion' unexpectedly found`), 2 passes (the absent cases pass by accident; that is fine).

- [ ] **Step 3: Implement in `compile_index.py`**

In `compile_repo`, after the `repo.update({...})` block and before `if entry.get("featured"):`, add:

```python
    promotion = entry.get("promotion")
    if isinstance(promotion, dict) and promotion:
        repo["promotion"] = deepcopy(promotion)
    else:
        repo.pop("promotion", None)
```

In `slim_entry`, after the `legacy` block and before `if bucket == "sites":`, add:

```python
    promotion = repo.get("promotion")
    if isinstance(promotion, dict) and promotion:
        slim["promotion"] = deepcopy(promotion)
```

- [ ] **Step 4: Add the schema property**

In `schemas/repo.schema.json`, inside `$defs.repo.properties`, after the `"visibility"` property, add:

```json
        "promotion": {
          "type": "object",
          "description": "Public readiness scan record. Absent means no scan; the repo must be private.",
          "required": ["tier", "scanned"],
          "additionalProperties": false,
          "properties": {
            "tier": { "type": "string", "enum": ["P0", "P1", "P2", "P3"] },
            "scanned": { "type": "string", "format": "date" },
            "grace_until": { "type": "string", "format": "date" },
            "notes": { "type": "string" }
          }
        },
```

- [ ] **Step 5: Run tests and the compile check**

Run: `python -m pytest scripts/tests/test_compile_index_promotion.py -q && python scripts/catalog/build-catalog.py --check`
Expected: 6 passed; `Derived catalog outputs are up to date.` (no index entry has `promotion` yet, so nothing changes).

- [ ] **Step 6: Commit**

```bash
git add scripts/catalog/compile_index.py schemas/repo.schema.json scripts/tests/test_compile_index_promotion.py
git commit -m "Carry promotion records from catalog index to repos.json"
```

---

### Task 2: Offline promotion rules in `validate_catalogs`

**Files:**
- Modify: `scripts/catalog/catalog_lib.py` (add constants near `REQUIRED_REPO_FIELDS` ~27-51; add `validate_promotion`; call it from `validate_catalogs` ~594)
- Create: `scripts/tests/test_validate_promotion.py`

**Interfaces:**
- Consumes: `ValidationIssue(level, message)` dataclass, `today_iso()` in `catalog_lib.py`.
- Produces: `validate_promotion(repos: list[dict], profile_pins: list[str], *, today: date) -> list[ValidationIssue]`; `PROMOTION_TIERS = ("P0", "P1", "P2", "P3")`; `PROMOTION_MAX_AGE_DAYS = 90`; `promotion_is_current(promotion: dict | None, *, today: date) -> bool`; `grace_active(promotion: dict | None, *, today: date) -> bool`. Task 3 imports these three.

- [ ] **Step 1: Write the failing tests**

Create `scripts/tests/test_validate_promotion.py`:

```python
"""Offline promotion rules: shape, freshness, public-without-scan, pinned-below-P0."""

from __future__ import annotations

import sys
import unittest
from datetime import date
from pathlib import Path

CATALOG_DIR = Path(__file__).resolve().parents[1] / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from catalog_lib import grace_active, promotion_is_current, validate_promotion  # noqa: E402

TODAY = date(2026, 8, 27)


def _repo(slug="demo", visibility="private", promotion=None, status="active"):
    repo = {"slug": slug, "visibility": visibility, "status": status}
    if promotion is not None:
        repo["promotion"] = promotion
    return repo


def _messages(issues):
    return [i.message for i in issues]


class PromotionHelpersTests(unittest.TestCase):
    def test_current_when_scanned_within_90_days(self) -> None:
        self.assertTrue(promotion_is_current({"tier": "P1", "scanned": "2026-06-01"}, today=TODAY))

    def test_stale_after_90_days(self) -> None:
        self.assertFalse(promotion_is_current({"tier": "P1", "scanned": "2026-05-01"}, today=TODAY))

    def test_not_current_when_absent(self) -> None:
        self.assertFalse(promotion_is_current(None, today=TODAY))

    def test_grace_active_before_deadline(self) -> None:
        self.assertTrue(grace_active({"tier": "P1", "scanned": "2026-08-27", "grace_until": "2026-09-30"}, today=TODAY))

    def test_grace_inactive_on_or_after_deadline(self) -> None:
        self.assertFalse(grace_active({"tier": "P1", "scanned": "2026-08-27", "grace_until": "2026-08-27"}, today=TODAY))


class ValidatePromotionTests(unittest.TestCase):
    def test_private_without_promotion_is_clean(self) -> None:
        self.assertEqual(validate_promotion([_repo()], [], today=TODAY), [])

    def test_public_without_promotion_is_error(self) -> None:
        issues = validate_promotion([_repo(visibility="public")], [], today=TODAY)
        self.assertEqual(len(issues), 1)
        self.assertEqual(issues[0].level, "error")
        self.assertIn("'demo' is public without a promotion record", issues[0].message)

    def test_public_with_current_p1_is_clean(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-08-27"})
        self.assertEqual(validate_promotion([repo], [], today=TODAY), [])

    def test_public_with_p2_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P2", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("tier 'P2' does not allow public" in m for m in msgs), msgs)

    def test_public_with_stale_scan_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-05-01"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("scan from 2026-05-01 is older than 90 days" in m for m in msgs), msgs)

    def test_public_with_stale_scan_under_grace_is_clean(self) -> None:
        # CI runs validate-catalog.py --strict, which fails on warnings, so an
        # active grace is silent here; validate-visibility.py reports it.
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-05-01", "grace_until": "2026-09-30"})
        self.assertEqual(validate_promotion([repo], [], today=TODAY), [])

    def test_public_with_expired_grace_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-05-01", "grace_until": "2026-08-01"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("older than 90 days" in m for m in msgs), msgs)

    def test_bad_tier_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P9", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("invalid promotion tier 'P9'" in m for m in msgs), msgs)

    def test_bad_date_is_error(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "yesterday"})
        msgs = _messages(validate_promotion([repo], [], today=TODAY))
        self.assertTrue(any("invalid promotion date 'yesterday'" in m for m in msgs), msgs)

    def test_pinned_requires_public_and_p0(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], ["demo"], today=TODAY))
        self.assertTrue(any("pinned repo 'demo' is not tier P0" in m for m in msgs), msgs)

    def test_pinned_private_is_error(self) -> None:
        repo = _repo(visibility="private", promotion={"tier": "P0", "scanned": "2026-08-27"})
        msgs = _messages(validate_promotion([repo], ["demo"], today=TODAY))
        self.assertTrue(any("pinned repo 'demo' is not public" in m for m in msgs), msgs)

    def test_pinned_p1_under_grace_is_clean(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P1", "scanned": "2026-08-27", "grace_until": "2026-09-30"})
        self.assertEqual(validate_promotion([repo], ["demo"], today=TODAY), [])

    def test_pinned_p0_public_is_clean(self) -> None:
        repo = _repo(visibility="public", promotion={"tier": "P0", "scanned": "2026-08-27"})
        self.assertEqual(validate_promotion([repo], ["demo"], today=TODAY), [])

    def test_archived_repo_is_exempt(self) -> None:
        repo = _repo(visibility="public", status="archived")
        self.assertEqual(validate_promotion([repo], [], today=TODAY), [])


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
```

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest scripts/tests/test_validate_promotion.py -q`
Expected: `ImportError: cannot import name 'grace_active'`.

- [ ] **Step 3: Implement in `catalog_lib.py`**

After `REQUIRED_RELEASE_AUTOMATION_FIELDS` add:

```python
PROMOTION_TIERS = ("P0", "P1", "P2", "P3")
PUBLIC_TIERS = {"P0", "P1"}
PROMOTION_MAX_AGE_DAYS = 90
```

After `today_iso()` add:

```python
def _parse_iso_date(value: Any) -> date | None:
    try:
        return date.fromisoformat(str(value))
    except (TypeError, ValueError):
        return None


def promotion_is_current(promotion: dict[str, Any] | None, *, today: date) -> bool:
    """True when the record has a public tier and a scan within PROMOTION_MAX_AGE_DAYS."""
    if not isinstance(promotion, dict):
        return False
    if promotion.get("tier") not in PUBLIC_TIERS:
        return False
    scanned = _parse_iso_date(promotion.get("scanned"))
    if scanned is None:
        return False
    return (today - scanned).days <= PROMOTION_MAX_AGE_DAYS


def grace_active(promotion: dict[str, Any] | None, *, today: date) -> bool:
    """True while grace_until is strictly in the future."""
    if not isinstance(promotion, dict):
        return False
    deadline = _parse_iso_date(promotion.get("grace_until"))
    return deadline is not None and today < deadline


def validate_promotion(
    repos: list[dict[str, Any]],
    profile_pins: list[str],
    *,
    today: date,
) -> list[ValidationIssue]:
    """Offline half of the public readiness gate (no network).

    Rules: a public repo needs a current P0/P1 scan; a pinned repo must be public
    and P0. While grace_until is in the future both rules are silent here (CI
    runs validate-catalog.py --strict, which fails on warnings); the gate CLI
    validate-visibility.py reports active grace as a warning instead. An
    expired grace is enforced like any other failure. Archived repos are exempt.
    """
    issues: list[ValidationIssue] = []
    pins = {str(p).strip() for p in profile_pins}
    for repo in repos:
        slug = repo.get("slug") or "<unknown>"
        if repo.get("status") == "archived":
            continue
        promotion = repo.get("promotion")
        visibility = repo.get("visibility")
        grace = grace_active(promotion, today=today)

        if promotion is not None:
            if not isinstance(promotion, dict):
                issues.append(ValidationIssue("error", f"Repo '{slug}' promotion must be a mapping"))
                continue
            tier = promotion.get("tier")
            if tier not in PROMOTION_TIERS:
                issues.append(ValidationIssue("error", f"Repo '{slug}' has invalid promotion tier '{tier}'"))
            for key in ("scanned", "grace_until"):
                if key in promotion and _parse_iso_date(promotion.get(key)) is None:
                    issues.append(
                        ValidationIssue("error", f"Repo '{slug}' has invalid promotion date '{promotion.get(key)}' in {key}")
                    )

        if visibility == "public" and not grace:
            if promotion is None:
                issues.append(ValidationIssue("error", f"Repo '{slug}' is public without a promotion record"))
            elif isinstance(promotion, dict) and promotion.get("tier") in PROMOTION_TIERS:
                tier = promotion["tier"]
                scanned = _parse_iso_date(promotion.get("scanned"))
                if tier not in PUBLIC_TIERS:
                    issues.append(ValidationIssue("error", f"Repo '{slug}' tier '{tier}' does not allow public"))
                elif scanned is not None and not promotion_is_current(promotion, today=today):
                    issues.append(
                        ValidationIssue(
                            "error",
                            f"Repo '{slug}' scan from {promotion.get('scanned')} is older than {PROMOTION_MAX_AGE_DAYS} days",
                        )
                    )

        if slug in pins:
            tier = promotion.get("tier") if isinstance(promotion, dict) else None
            if visibility != "public":
                issues.append(ValidationIssue("error", f"Pinned repo '{slug}' is not public"))
            elif tier != "P0" and not grace:
                issues.append(ValidationIssue("error", f"Pinned repo '{slug}' is not tier P0"))
    return issues
```

In `validate_catalogs`, right after the `for raw_slug in profile_pins:` loop ends (before `for repo in repos:` that checks `REQUIRED_REPO_FIELDS`), add:

```python
    issues.extend(validate_promotion(repos, [str(p) for p in profile_pins], today=date.today()))
```

`date` is already imported at the top of `catalog_lib.py`.

- [ ] **Step 4: Run the new tests**

Run: `python -m pytest scripts/tests/test_validate_promotion.py -q`
Expected: 18 passed.

- [ ] **Step 5: Run the real catalog and read the expected failures**

Run: `python scripts/catalog/validate-catalog.py`
Expected: exactly these errors, nothing else new: 12 lines `Repo '<slug>' is public without a promotion record` for `alawein, outpost, chshlab, fallax, llmworks, loopholelab, maglogic, provegate, qmatsim, qubeml, scicomp, spincirc`, and 6 lines `Pinned repo '<slug>' is not tier P0` for `outpost, fallax, loopholelab, chshlab, qmatsim, llmworks`. These clear in Task 8. Do not seed records yet; the scan comes first.

- [ ] **Step 6: Commit**

```bash
git add scripts/catalog/catalog_lib.py scripts/tests/test_validate_promotion.py
git commit -m "Add offline promotion rules to catalog validation"
```

Note: from this commit until Task 8, `build-catalog.py --check` exits 1 on this branch. That is intended and local only; CI runs on the PR after Task 8.

---

### Task 3: `validate-visibility.py` core rules (pure, no network)

**Files:**
- Create: `scripts/github/validate-visibility.py`
- Create: `scripts/tests/test_validate_visibility.py`

**Interfaces:**
- Consumes: `promotion_is_current`, `grace_active`, `PUBLIC_TIERS` from `catalog_lib` (Task 2).
- Produces: `evaluate(repos: list[dict], profile_pins: list[str], live: dict[str, dict], live_pins: list[str] | None, *, today: date) -> list[Finding]` where `Finding = (slug: str, code: str, level: str, message: str)` as a `NamedTuple`, and `live[slug]` is `{"exists": bool, "visibility": "public"|"private", "size": int, "archived": bool, "has_readme": bool, "has_license": bool}`. Task 4 wraps this in the CLI.

Codes: `V1` catalog vs live visibility; `V2` public and empty; `V3` public and no README; `V4` public without valid promotion; `V5` pinned but not public P0; `V6` public research/tooling without LICENSE; `V7` live pin private, archived, or empty; `V8` archived on GitHub but catalog not archived (warning). `V4` and `V5` become `warning` under grace.

- [ ] **Step 1: Write the failing tests**

Create `scripts/tests/test_validate_visibility.py`:

```python
"""Pure rule tests for scripts/github/validate-visibility.py (no network)."""

from __future__ import annotations

import importlib.util
import sys
import unittest
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "github" / "validate-visibility.py"
CATALOG_DIR = ROOT / "scripts" / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

_spec = importlib.util.spec_from_file_location("validate_visibility", SCRIPT)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["validate_visibility"] = _mod
_spec.loader.exec_module(_mod)
evaluate = _mod.evaluate

TODAY = date(2026, 8, 27)
CURRENT_P1 = {"tier": "P1", "scanned": "2026-08-27"}
CURRENT_P0 = {"tier": "P0", "scanned": "2026-08-27"}


def _repo(slug="demo", visibility="public", rtype="research", status="active", promotion=None):
    repo = {"slug": slug, "repo": f"alawein/{slug}", "visibility": visibility, "type": rtype, "status": status}
    if promotion is not None:
        repo["promotion"] = promotion
    return repo


def _live(visibility="public", size=100, archived=False, has_readme=True, has_license=True, exists=True):
    return {
        "exists": exists,
        "visibility": visibility,
        "size": size,
        "archived": archived,
        "has_readme": has_readme,
        "has_license": has_license,
    }


def _codes(findings):
    return sorted(f.code for f in findings)


class EvaluateTests(unittest.TestCase):
    def test_clean_public_p1(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_clean_private(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(visibility="private")}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_v1_visibility_mismatch(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(visibility="public")}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V1"])
        self.assertIn("catalog private, GitHub public", findings[0].message)

    def test_v2_public_and_empty(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live(size=0, has_readme=False)}, None, today=TODAY)
        self.assertIn("V2", _codes(findings))

    def test_v3_public_without_readme(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live(has_readme=False)}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V3"])

    def test_v4_public_without_promotion(self) -> None:
        findings = evaluate([_repo()], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V4"])
        self.assertEqual(findings[0].level, "error")

    def test_v4_stale_scan(self) -> None:
        findings = evaluate([_repo(promotion={"tier": "P1", "scanned": "2026-04-01"})], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V4"])

    def test_v4_grace_downgrades_to_warning(self) -> None:
        promo = {"tier": "P1", "scanned": "2026-04-01", "grace_until": "2026-09-30"}
        findings = evaluate([_repo(promotion=promo)], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual([(f.code, f.level) for f in findings], [("V4", "warning")])

    def test_v4_grace_expired_is_error(self) -> None:
        promo = {"tier": "P1", "scanned": "2026-04-01", "grace_until": "2026-08-01"}
        findings = evaluate([_repo(promotion=promo)], [], {"demo": _live()}, None, today=TODAY)
        self.assertEqual([(f.code, f.level) for f in findings], [("V4", "error")])

    def test_v5_pinned_not_p0(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], ["demo"], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V5"])

    def test_v5_pinned_p0_clean(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P0)], ["demo"], {"demo": _live()}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_v5_pinned_private(self) -> None:
        findings = evaluate([_repo(visibility="private", promotion=CURRENT_P0)], ["demo"], {"demo": _live(visibility="private")}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V5"])

    def test_v6_public_research_without_license(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live(has_license=False)}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V6"])

    def test_v6_not_applied_to_product(self) -> None:
        findings = evaluate([_repo(rtype="product", promotion=CURRENT_P1)], [], {"demo": _live(has_license=False)}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_v7_live_pin_private(self) -> None:
        repos = [_repo(slug="hidden", visibility="private")]
        live = {"hidden": _live(visibility="private")}
        findings = evaluate(repos, [], live, ["hidden"], today=TODAY)
        self.assertEqual(_codes(findings), ["V7"])

    def test_v7_live_pin_unknown_slug(self) -> None:
        findings = evaluate([_repo(promotion=CURRENT_P1)], [], {"demo": _live()}, ["ghost"], today=TODAY)
        self.assertEqual(_codes(findings), ["V7"])
        self.assertIn("not in catalog", findings[0].message)

    def test_v8_archived_mismatch_is_warning(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(visibility="private", archived=True)}, None, today=TODAY)
        self.assertEqual([(f.code, f.level) for f in findings], [("V8", "warning")])

    def test_archived_catalog_repo_is_exempt(self) -> None:
        repo = _repo(visibility="public", status="archived")
        findings = evaluate([repo], [], {"demo": _live(archived=True)}, None, today=TODAY)
        self.assertEqual(findings, [])

    def test_missing_on_github_is_error(self) -> None:
        findings = evaluate([_repo(visibility="private")], [], {"demo": _live(exists=False)}, None, today=TODAY)
        self.assertEqual(_codes(findings), ["V1"])
        self.assertIn("not found on GitHub", findings[0].message)

    def test_hub_slug_skips_readme_license_checks_but_not_visibility(self) -> None:
        repo = _repo(slug="alawein", rtype="governance", promotion=CURRENT_P1)
        findings = evaluate([repo], [], {"alawein": _live(has_license=False)}, None, today=TODAY)
        self.assertEqual(findings, [])


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
```

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest scripts/tests/test_validate_visibility.py -q`
Expected: `FileNotFoundError` or `AttributeError: module has no attribute 'evaluate'`.

- [ ] **Step 3: Write the module (rules only; the CLI comes in Task 4)**

Create `scripts/github/validate-visibility.py`:

```python
#!/usr/bin/env python3
"""Public readiness gate: compare catalog visibility and pins with live GitHub.

Read-only. Never flips visibility or edits pins.

Modes:
  python scripts/github/validate-visibility.py --github-api      # default; needs GITHUB_TOKEN
  python scripts/github/validate-visibility.py --offline         # V4 and V5 only, no network
  python scripts/github/validate-visibility.py --slug qmatsim    # one repo
  python scripts/github/validate-visibility.py --json

Exit codes: 0 clean, 1 findings at error level, 2 usage or API error.

Checks:
  V1 catalog visibility differs from live GitHub (or repo missing)
  V2 catalog public and repo is empty (size 0)
  V3 catalog public and no README on the default branch
  V4 catalog public without a current P0/P1 promotion record
  V5 pinned in profile-from-guides.yaml but not (public and P0)
  V6 catalog public, type research or tooling, no LICENSE
  V7 live pinned repo is private, archived, empty, or not in catalog
  V8 archived on GitHub but catalog status is not archived (warning)
V4 and V5 downgrade to warning while promotion.grace_until is in the future.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from typing import Any, NamedTuple

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))
from catalog_lib import PUBLIC_TIERS, grace_active, profile_config, promotion_is_current  # noqa: E402

REPOS_JSON = ROOT / "catalog" / "repos.json"
HUB_SLUGS = {"alawein"}
LICENSE_TYPES = {"research", "tooling", "infra"}
OWNER = "alawein"


class Finding(NamedTuple):
    slug: str
    code: str
    level: str
    message: str


class VisibilityError(Exception):
    pass


def _tier(repo: dict[str, Any]) -> str | None:
    promotion = repo.get("promotion")
    return promotion.get("tier") if isinstance(promotion, dict) else None


def _graced(repo: dict[str, Any], today: date) -> bool:
    return grace_active(repo.get("promotion"), today=today)


def _grace_suffix(repo: dict[str, Any]) -> str:
    promotion = repo.get("promotion") or {}
    return f" (grace until {promotion.get('grace_until')})" if promotion.get("grace_until") else ""


def evaluate(
    repos: list[dict[str, Any]],
    profile_pins: list[str],
    live: dict[str, dict[str, Any]] | None,
    live_pins: list[str] | None,
    *,
    today: date,
) -> list[Finding]:
    """Apply V1..V8. `live` None means offline mode (V4 and V5 only)."""
    findings: list[Finding] = []
    by_slug = {r.get("slug"): r for r in repos}
    pins = [str(p).strip() for p in profile_pins]

    for repo in repos:
        slug = str(repo.get("slug") or "<unknown>")
        if repo.get("status") == "archived":
            continue
        catalog_public = repo.get("visibility") == "public"
        graced = _graced(repo, today)
        suffix = _grace_suffix(repo)

        # V4: public needs a current public-tier scan.
        if catalog_public and not promotion_is_current(repo.get("promotion"), today=today):
            level = "warning" if graced else "error"
            findings.append(Finding(slug, "V4", level, f"{slug}: public without a current P0/P1 promotion record{suffix}"))

        # V5: pinned needs public and P0.
        if slug in pins:
            if not catalog_public:
                findings.append(Finding(slug, "V5", "error", f"{slug}: pinned but catalog visibility is not public"))
            elif _tier(repo) != "P0":
                level = "warning" if graced else "error"
                findings.append(Finding(slug, "V5", level, f"{slug}: pinned but tier is {_tier(repo) or 'none'}, not P0{suffix}"))

        if live is None:
            continue
        meta = live.get(slug)
        if not meta or not meta.get("exists", True):
            findings.append(Finding(slug, "V1", "error", f"{slug}: not found on GitHub"))
            continue

        # V1: visibility must agree.
        live_vis = meta.get("visibility")
        catalog_vis = repo.get("visibility")
        if live_vis != catalog_vis:
            findings.append(Finding(slug, "V1", "error", f"{slug}: catalog {catalog_vis}, GitHub {live_vis}"))

        # V8: archived on GitHub but catalog not archived.
        if meta.get("archived"):
            findings.append(Finding(slug, "V8", "warning", f"{slug}: archived on GitHub but catalog status is {repo.get('status')}"))

        if not catalog_public:
            continue
        # V2 / V3 / V6 apply only to public repos; the hub profile repo skips V3 and V6.
        if not meta.get("size"):
            findings.append(Finding(slug, "V2", "error", f"{slug}: public but the repository is empty"))
        if slug not in HUB_SLUGS:
            if not meta.get("has_readme"):
                findings.append(Finding(slug, "V3", "error", f"{slug}: public but no README.md on the default branch"))
            if repo.get("type") in LICENSE_TYPES and not meta.get("has_license"):
                findings.append(Finding(slug, "V6", "error", f"{slug}: public {repo.get('type')} repo without LICENSE"))

    # V7: every live pin must be a public, non-archived, non-empty catalog repo.
    for slug in live_pins or []:
        repo = by_slug.get(slug)
        meta = (live or {}).get(slug) or {}
        if repo is None:
            findings.append(Finding(slug, "V7", "error", f"{slug}: live profile pin is not in catalog"))
            continue
        problems = []
        if meta.get("visibility", repo.get("visibility")) != "public":
            problems.append("private")
        if meta.get("archived") or repo.get("status") == "archived":
            problems.append("archived")
        if live is not None and not meta.get("size", 1):
            problems.append("empty")
        if problems:
            findings.append(Finding(slug, "V7", "error", f"{slug}: live profile pin is {', '.join(problems)}"))

    return findings
```

- [ ] **Step 4: Run the tests**

Run: `python -m pytest scripts/tests/test_validate_visibility.py -q`
Expected: 20 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/github/validate-visibility.py scripts/tests/test_validate_visibility.py
git commit -m "Add public readiness visibility rules with pure evaluate()"
```

---

### Task 4: `validate-visibility.py` CLI, GitHub fetch, and CI step

**Files:**
- Modify: `scripts/github/validate-visibility.py` (append fetch helpers and `main`)
- Modify: `scripts/tests/test_validate_visibility.py` (add CLI and fetch-mapping tests)
- Modify: `.github/workflows/docs-doctrine.yml` (paths at 5-27, steps after line 62)
- Modify: `CLAUDE.md` (Build and validate block, after the `verify-profile-pins.py` line at 134)

**Interfaces:**
- Consumes: `evaluate` (Task 3), `profile_config()` from `catalog_lib`.
- Produces: CLI with `--github-api` (default), `--offline`, `--slug`, `--json`, `--repos-json`, `--today`; `fetch_live(repo_full, token) -> dict`; `fetch_live_pins(login, token) -> list[str]`; `live_from_payloads(meta, readme_status, license_status) -> dict` (pure, tested).

- [ ] **Step 1: Add failing tests to `scripts/tests/test_validate_visibility.py`**

Append before `if __name__ == "__main__":`:

```python
import subprocess  # noqa: E402


class LiveMappingTests(unittest.TestCase):
    def test_live_from_payloads_maps_fields(self) -> None:
        meta = {"visibility": "public", "size": 42, "archived": False, "default_branch": "main"}
        live = _mod.live_from_payloads(meta, readme_status=200, license_status=404)
        self.assertEqual(
            live,
            {"exists": True, "visibility": "public", "size": 42, "archived": False, "has_readme": True, "has_license": False},
        )

    def test_live_from_payloads_missing_repo(self) -> None:
        self.assertEqual(_mod.live_from_payloads(None, readme_status=404, license_status=404), {"exists": False})

    def test_parse_pinned_graphql(self) -> None:
        payload = {"data": {"user": {"pinnedItems": {"nodes": [{"name": "fallax"}, {"name": "qmatsim"}, {}]}}}}
        self.assertEqual(_mod.parse_pinned(payload), ["fallax", "qmatsim"])


class CliTests(unittest.TestCase):
    def test_help_lists_flags(self) -> None:
        result = subprocess.run([sys.executable, str(SCRIPT), "--help"], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        for flag in ("--github-api", "--offline", "--slug", "--json", "--today"):
            self.assertIn(flag, result.stdout)

    def test_github_api_without_token_exits_2(self) -> None:
        env = {k: v for k, v in dict(**__import__("os").environ).items() if k != "GITHUB_TOKEN"}
        result = subprocess.run([sys.executable, str(SCRIPT), "--github-api"], capture_output=True, text=True, env=env)
        self.assertEqual(result.returncode, 2)
        self.assertIn("GITHUB_TOKEN", result.stderr)

    def test_offline_json_on_real_catalog_parses(self) -> None:
        result = subprocess.run([sys.executable, str(SCRIPT), "--offline", "--json"], capture_output=True, text=True)
        self.assertIn(result.returncode, (0, 1))
        payload = json.loads(result.stdout)
        self.assertIn("findings", payload)
        self.assertIn("mode", payload)
        self.assertEqual(payload["mode"], "offline")
```

Add `import json` to the test file imports.

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest scripts/tests/test_validate_visibility.py -q -k "Live or Cli"`
Expected: `AttributeError: module 'validate_visibility' has no attribute 'live_from_payloads'` and the CLI tests fail (no `main`).

- [ ] **Step 3: Append fetch helpers and `main` to `scripts/github/validate-visibility.py`**

```python
def _github_request(path: str, token: str, *, method: str = "GET", body: bytes | None = None) -> tuple[int, bytes]:
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        data=body,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()


def live_from_payloads(meta: dict[str, Any] | None, *, readme_status: int, license_status: int) -> dict[str, Any]:
    """Map raw GitHub payloads to the shape evaluate() reads."""
    if meta is None:
        return {"exists": False}
    return {
        "exists": True,
        "visibility": meta.get("visibility"),
        "size": int(meta.get("size") or 0),
        "archived": bool(meta.get("archived")),
        "has_readme": readme_status == 200,
        "has_license": license_status == 200,
    }


def fetch_live(repo_full: str, token: str) -> dict[str, Any]:
    owner, name = repo_full.split("/", 1)
    status, body = _github_request(f"/repos/{owner}/{name}", token)
    if status == 404:
        return live_from_payloads(None, readme_status=404, license_status=404)
    if status != 200:
        raise VisibilityError(f"GitHub API {status} for {repo_full}: {body[:200]!r}")
    meta = json.loads(body.decode("utf-8"))
    if not meta.get("size"):
        return live_from_payloads(meta, readme_status=404, license_status=404)
    ref = meta.get("default_branch") or "main"
    readme_status, _ = _github_request(f"/repos/{owner}/{name}/readme?ref={ref}", token)
    license_status, _ = _github_request(f"/repos/{owner}/{name}/contents/LICENSE?ref={ref}", token)
    return live_from_payloads(meta, readme_status=readme_status, license_status=license_status)


def parse_pinned(payload: dict[str, Any]) -> list[str]:
    nodes = (((payload.get("data") or {}).get("user") or {}).get("pinnedItems") or {}).get("nodes") or []
    return [n["name"] for n in nodes if isinstance(n, dict) and n.get("name")]


def fetch_live_pins(login: str, token: str) -> list[str]:
    query = (
        '{ user(login: "%s") { pinnedItems(first: 6, types: REPOSITORY) '
        "{ nodes { ... on Repository { name } } } } }" % login
    )
    status, body = _github_request("/graphql", token, method="POST", body=json.dumps({"query": query}).encode("utf-8"))
    if status != 200:
        raise VisibilityError(f"GitHub GraphQL {status}: {body[:200]!r}")
    return parse_pinned(json.loads(body.decode("utf-8")))


def load_repos(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    repos = data.get("repos")
    if not isinstance(repos, list):
        raise VisibilityError(f"{path}: no 'repos' list")
    return repos


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Public readiness gate: catalog visibility vs live GitHub.")
    parser.add_argument("--repos-json", type=Path, default=REPOS_JSON)
    parser.add_argument("--github-api", action="store_true", help="Compare with live GitHub (default; needs GITHUB_TOKEN).")
    parser.add_argument("--offline", action="store_true", help="Catalog-only checks V4 and V5; no network.")
    parser.add_argument("--slug", type=str, default=None, help="Check one catalog slug.")
    parser.add_argument("--json", action="store_true", help="Emit findings as JSON.")
    parser.add_argument("--today", type=str, default=None, help="ISO date override for freshness math (tests).")
    args = parser.parse_args(argv)

    try:
        repos = load_repos(args.repos_json)
    except (VisibilityError, OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    if args.slug:
        repos = [r for r in repos if r.get("slug") == args.slug]
        if not repos:
            print(f"error: no catalog entry for {args.slug!r}", file=sys.stderr)
            return 2

    try:
        today = date.fromisoformat(args.today) if args.today else date.today()
    except ValueError:
        print(f"error: --today must be an ISO date, got {args.today!r}", file=sys.stderr)
        return 2

    pins = [str(p) for p in (profile_config().get("profile_pins") or [])]
    mode = "offline" if args.offline else "github-api"
    live: dict[str, dict[str, Any]] | None = None
    live_pins: list[str] | None = None
    if mode == "github-api":
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            print("error: GITHUB_TOKEN required for --github-api (use --offline for catalog-only checks)", file=sys.stderr)
            return 2
        try:
            live = {str(r.get("slug")): fetch_live(str(r.get("repo")), token) for r in repos if r.get("repo")}
            live_pins = fetch_live_pins(OWNER, token) if not args.slug else None
        except VisibilityError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return 2

    findings = evaluate(repos, pins, live, live_pins, today=today)
    errors = [f for f in findings if f.level == "error"]

    if args.json:
        print(json.dumps({"mode": mode, "findings": [f._asdict() for f in findings]}, indent=2))
    else:
        if findings:
            print(f"visibility-gate: {len(errors)} error(s), {len(findings) - len(errors)} warning(s) [mode={mode}]")
            for f in findings:
                print(f"  - [{f.level}] {f.code} {f.message}")
        else:
            print(f"visibility-gate: OK ({len(repos)} catalog entries, mode={mode})")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run all validator tests**

Run: `python -m pytest scripts/tests/test_validate_visibility.py -q`
Expected: 26 passed.

- [ ] **Step 5: Run against live GitHub once (read-only) and keep the output for the matrix**

PowerShell:
```powershell
$env:GITHUB_TOKEN = (gh auth token)
python scripts/github/validate-visibility.py --github-api --json | Out-File -Encoding utf8 docs/internal/audits/.visibility-scan.json
python scripts/github/validate-visibility.py --github-api
```
Expected today: exit 1 with V4 errors for the 12 public catalog slugs, V5 for the 6 catalog pins, V2 and V3 for `outpost`, and V7 for none (live pins are all public). Move the JSON to the scratchpad afterwards; do not commit it: `Remove-Item docs/internal/audits/.visibility-scan.json` after copying it to the session scratchpad.

- [ ] **Step 6: Wire CI and the CLAUDE.md list**

In `.github/workflows/docs-doctrine.yml`, add to both `push.paths` and `pull_request.paths` lists (after the `validate-readme-voice.py` line in each):

```yaml
      - "scripts/github/validate-visibility.py"
      - "scripts/tests/test_validate_visibility.py"
      - "catalog/index.yaml"
      - "profile-from-guides.yaml"
```

Add after the `Validate fleet README voice (GitHub default branch)` step:

```yaml
      - name: Validate public readiness gate (catalog vs GitHub)
        env:
          GITHUB_TOKEN: ${{ secrets.ALAWEIN_METADATA_SYNC_TOKEN }}
        run: python scripts/github/validate-visibility.py --github-api
```

`ALAWEIN_METADATA_SYNC_TOKEN` is the secret `github-metadata-sync.yml` already uses (line 128); it reads private repos, which `secrets.GITHUB_TOKEN` cannot (a 404 there would make V1 report every private repo as missing). Scheduled runs and pushes have the secret; pull requests from forks do not, and this repo takes none.

In `CLAUDE.md`, after `python scripts/github/verify-profile-pins.py --skip-live --check` add:

```
python scripts/github/validate-visibility.py --offline
```

Bump `CLAUDE.md` frontmatter `last_updated` to `2026-08-27`.

- [ ] **Step 7: Commit**

```bash
git add scripts/github/validate-visibility.py scripts/tests/test_validate_visibility.py .github/workflows/docs-doctrine.yml CLAUDE.md
git commit -m "Wire the public readiness gate CLI into Docs Doctrine"
```

---

### Task 5: README templates: header block, tooling Docs map, governance and archive templates

**Files:**
- Modify: `templates/scaffolding/README.product.md`, `README.research.md`, `README.tooling.md`
- Create: `templates/scaffolding/README.governance.md`, `templates/scaffolding/README.archive.md`
- Modify: `scripts/catalog/catalog_lib.py` (`README_SECTIONS` ~70-110: add `archive`; `template_to_sections` ~737-741)
- Create: `scripts/tests/test_readme_templates.py`

**Interfaces:**
- Produces: five templates, each starting with `# {{name}}` then the six-line framework header, then the H2 order from the canon. `README_SECTIONS["archive"]` = `["Status", "Archive reason", "Contents", "Access rules", "Docs map"]`.

- [ ] **Step 1: Write the failing test**

Create `scripts/tests/test_readme_templates.py`:

```python
"""Every README template carries the framework header and its canon H2 order."""

from __future__ import annotations

import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEMPLATES = ROOT / "templates" / "scaffolding"
CATALOG_DIR = ROOT / "scripts" / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from catalog_lib import README_SECTIONS  # noqa: E402

HEADER_LINES = ["Status:", "Category:", "Owner:", "Visibility:", "Purpose:", "Next action:"]
TEMPLATE_TYPES = {
    "README.product.md": "product",
    "README.research.md": "research",
    "README.tooling.md": "tooling",
    "README.governance.md": "governance",
    "README.archive.md": "archive",
}


def _h2s(text: str) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(r"^##\s+(.+?)\s*$", text, re.MULTILINE)]


class ReadmeTemplateTests(unittest.TestCase):
    def test_all_templates_exist(self) -> None:
        for name in TEMPLATE_TYPES:
            self.assertTrue((TEMPLATES / name).is_file(), name)

    def test_header_block_follows_title(self) -> None:
        for name in TEMPLATE_TYPES:
            lines = (TEMPLATES / name).read_text(encoding="utf-8").splitlines()
            self.assertEqual(lines[0], "# {{name}}", name)
            block = lines[2:8]
            for expected, actual in zip(HEADER_LINES, block):
                self.assertTrue(actual.startswith(expected), f"{name}: expected {expected!r}, got {actual!r}")

    def test_h2_order_matches_canon(self) -> None:
        for name, rtype in TEMPLATE_TYPES.items():
            h2s = _h2s((TEMPLATES / name).read_text(encoding="utf-8"))
            self.assertEqual(h2s, README_SECTIONS[rtype], name)

    def test_no_em_dash(self) -> None:
        for name in TEMPLATE_TYPES:
            text = (TEMPLATES / name).read_text(encoding="utf-8")
            self.assertNotIn("\u2014", text, name)

    def test_catalog_sections_match_topology_validator(self) -> None:
        import importlib.util

        script = ROOT / "scripts" / "doctrine" / "validate-readme-topology.py"
        spec = importlib.util.spec_from_file_location("vrt", script)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for rtype in ("product", "research", "tooling", "infra", "archive"):
            self.assertEqual(README_SECTIONS[rtype], mod.SECTIONS_BY_TYPE[rtype], rtype)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
```

- [ ] **Step 2: Run to verify it fails**

Run: `python -m pytest scripts/tests/test_readme_templates.py -q`
Expected: failures: governance and archive templates missing; header block missing on the three existing templates; `KeyError: 'archive'` in `README_SECTIONS`.

- [ ] **Step 3: Align `README_SECTIONS` with the canon and register the two templates**

`README_SECTIONS` in `catalog_lib.py` (lines 70-113) has three drifts from `docs/governance/repo-topology-canon.md` section C and from `SECTIONS_BY_TYPE` in `validate-readme-topology.py`: `tooling` and `infra` lack `Docs map`; `governance` is a copy of tooling; `archive` uses the old style-guide order. Its only consumer is the template check in `validate_catalogs`. Replace the whole constant with:

```python
README_SECTIONS = {
    "product": [
        "Value proposition",
        "Demo and status",
        "Quick start",
        "Architecture",
        "Deployment",
        "Docs map",
        "Ownership",
    ],
    "tooling": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Docs map",
        "Consumers",
        "Release and versioning",
    ],
    "infra": [
        "Purpose",
        "Install",
        "Commands",
        "Architecture",
        "Docs map",
        "Consumers",
        "Release and versioning",
    ],
    "governance": [
        "Purpose",
        "Catalog SSOT",
        "Validators",
        "Docs map",
    ],
    "research": [
        "Abstract",
        "Status",
        "Runtime requirements",
        "Reproducibility",
        "Datasets",
        "Docs map",
    ],
    "archive": [
        "Status",
        "Archive reason",
        "Contents",
        "Access rules",
        "Docs map",
    ],
}
```

In `validate_catalogs`, extend `template_to_sections`:

```python
    template_to_sections = {
        "README.product.md": README_SECTIONS["product"],
        "README.tooling.md": README_SECTIONS["tooling"],
        "README.research.md": README_SECTIONS["research"],
        "README.governance.md": README_SECTIONS["governance"],
        "README.archive.md": README_SECTIONS["archive"],
    }
```

- [ ] **Step 4: Write the header block into the three existing templates**

Replace the first line of each with these first eight lines (title, blank, six header lines, blank), keeping the rest of the file:

```markdown
# {{name}}

Status:      {{status}}
Category:    {{bucket}}
Owner:       alawein
Visibility:  {{visibility}}
Purpose:     {{purpose}}
Next action: continue

```

In `README.tooling.md`, insert between `## Architecture` block and `## Consumers`:

```markdown
## Docs map

- `docs/README.md`
- `SSOT.md`
- `LESSONS.md`

```

- [ ] **Step 5: Create the two new templates**

`templates/scaffolding/README.governance.md`:

```markdown
# {{name}}

Status:      {{status}}
Category:    core
Owner:       alawein
Visibility:  {{visibility}}
Purpose:     {{purpose}}
Next action: continue

## Purpose

State what this control plane owns and which repos consume it.

## Catalog SSOT

- Edit surface: `catalog/index.yaml`
- Compiled manifest: `catalog/repos.json`
- Build: `python scripts/catalog/build-catalog.py`

## Validators

```bash
{{validate_command}}
```

## Docs map

- `docs/README.md`
- `SSOT.md`
- `LESSONS.md`
```

`templates/scaffolding/README.archive.md`:

```markdown
# {{name}}

Status:      archived
Category:    archive
Owner:       alawein
Visibility:  {{visibility}}
Purpose:     {{purpose}}
Next action: archive

## Status

- Archived: `{{archived_on}}`
- Last verified: `{{last_verified}}`

## Archive reason

One or two sentences on why the work stopped and what superseded it.

## Contents

Short list of what is preserved here and what was dropped.

## Access rules

- Read-only. No new branches or PRs.
- Restore by forking into a live bucket, never by reviving this repo.

## Docs map

- `docs/README.md`
```

- [ ] **Step 6: Run the template test, catalog validation, and the doctrine tests**

Run: `python -m pytest scripts/tests/test_readme_templates.py -q && python scripts/catalog/validate-catalog.py | grep -i template; python -m pytest scripts/doctrine/tests -q`
Expected: 5 passed; no `Template ... missing required sections` line; doctrine tests all pass (`SECTIONS_BY_TYPE` in `validate-readme-topology.py` already carries the canon order, which the drift test now pins `README_SECTIONS` to).

- [ ] **Step 7: Commit**

```bash
git add templates/scaffolding scripts/catalog/catalog_lib.py scripts/tests/test_readme_templates.py
git commit -m "Add framework header to README templates and create governance and archive templates"
```

---

### Task 6: Public scan v1 and the visibility matrix

**Files:**
- Create: `docs/internal/audits/2026-08-27-public-visibility-matrix.md`

**Interfaces:**
- Consumes: `validate-visibility.py --github-api --json` output (Task 4 step 5), `validate-readme-topology.py --github-api`, `validate-readme-voice.py --github-api`.
- Produces: one row per catalog slug with B1 to B9 and a proposed tier; the 11 seeded records in Task 8 cite this file.

- [ ] **Step 1: Collect the machine evidence (read-only)**

PowerShell, from the repo root:
```powershell
$env:GITHUB_TOKEN = (gh auth token)
$S = "$env:LOCALAPPDATA\Temp\claude\scan"; New-Item -ItemType Directory -Force $S | Out-Null
python scripts/github/validate-visibility.py --github-api --json > "$S/gate.json"
python scripts/doctrine/validate-readme-topology.py --github-api > "$S/topology.txt"; "exit $LASTEXITCODE" >> "$S/topology.txt"
python scripts/doctrine/validate-readme-voice.py --github-api > "$S/voice.txt"; "exit $LASTEXITCODE" >> "$S/voice.txt"
gh repo list alawein --limit 300 --json name,visibility,isArchived,isEmpty,pushedAt,description > "$S/repos.json"
```
Expected: four files; topology exit 1 with only `attributa` and `veyra` lines; voice exit 0.

- [ ] **Step 2: Manual blockers B5 to B7 for the 11 public non-hub repos**

For each of `chshlab, fallax, llmworks, loopholelab, maglogic, provegate, qmatsim, qubeml, scicomp, spincirc` and the hub `alawein`, run and record:

```powershell
$r = "qmatsim"   # repeat per slug
gh run list -R alawein/$r --branch main --limit 3 --json name,conclusion,createdAt      # B7 CI
gh api "repos/alawein/$r/git/trees/main?recursive=1" --jq '.tree[].path' | Select-String -Pattern '^\.env$|\.env\.|\.pem$|id_rsa|secrets?\.(json|ya?ml)$'   # B6 tracked secret files
gh api "repos/alawein/$r/secret-scanning/alerts?state=open" --jq 'length'             # B6 GitHub alerts (404 means the feature is off; record "not scanned")
gh api "repos/alawein/$r/readme" --jq .content | python -c "import sys,base64;print(base64.b64decode(sys.stdin.read()).decode())" | Select-String -Pattern 'live|deploy|demo|Stripe|OpenAI|Anthropic|benchmark|score' # B5 claims to spot-check
```

B5 rule: every capability claim in the README must point at code that exists on `main`. Use `docs/internal/specs/2026-04-23-active-products-audit.md` for the known patterns. Record `pass`, `fail: <claim>`, or `n/a`.

- [ ] **Step 3: Write the matrix**

Create `docs/internal/audits/2026-08-27-public-visibility-matrix.md` with this frontmatter and structure, filling every row from steps 1 and 2 (no placeholder cells; use `n/a` where a check does not apply, `not scanned` where a tool was unavailable):

```markdown
---
type: audit
status: draft
last_updated: 2026-08-27
owner: meshal
---

# Public visibility matrix (2026-08-27)

Scan v1 of every catalog slug against the gate in
`docs/internal/specs/2026-08-27-public-readiness-gate-design.md`. Evidence:
`validate-visibility.py --github-api`, `validate-readme-topology.py --github-api`,
`validate-readme-voice.py --github-api`, and the per-repo commands in the plan
(`docs/internal/plans/2026-08-27-public-readiness-gate.md`, Task 6).

Columns: B1 visibility agrees, B2 non-empty with README, B3 topology, B4 voice,
B5 credibility, B6 secrets, B7 CI, B8 license, B9 pin rule. Tier is the proposed
`promotion.tier`. Action is what this cycle does.

## Public on GitHub (12)

| slug | catalog | GitHub | pinned | type | bucket | B1 | B2 | B3 | B4 | B5 | B6 | B7 | B8 | B9 | tier | action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| alawein | public | public | no | governance | core | ... | ... | n/a | n/a | ... | ... | ... | n/a | n/a | P1 | seed P1 |
| chshlab | public | public | yes | research | lab | ... | | | | | | | | | P1 | seed P1, grace to 2026-09-30, P0 candidate |
| ... one row per public slug ... |

## Private on GitHub (28)

| slug | catalog | GitHub | type | bucket | status | tier | reason |
|---|---|---|---|---|---|---|---|
| bolts | private | private | product | apps | active | P2 | open credibility flags (April audit) |
| ... one row per private slug ... |
| helios | private | private (archived) | archive | archive | archived | exempt | archived |

## Private-first batch (needs approval before any flip)

| slug | why | catalog change | GitHub change | pin change |
|---|---|---|---|---|
| outpost | public, empty (size 0), no README, first in profile_pins | visibility: private, no promotion | PATCH visibility=private | remove |

## Findings

- Validators: topology fails only attributa and veyra (both private); voice clean on all 40.
- Live pins (5): fallax, loopholelab, chshlab, qmatsim, llmworks. Catalog expected 6 with outpost.
- ...every non-obvious B5 to B7 result, one line each...
```

Rules for the tier column: `alawein` and every public repo that passes B1 to B8 gets `P1`; the six pin candidates get the note `P0 candidate`; a public repo failing B5, B6, or B7 gets `P1` only if the failure is fixed in this task's evidence window, otherwise it is listed in the private-first batch with the failing check named. Do not invent a pass.

- [ ] **Step 4: Voice check the file**

Run:
```bash
python - <<'EOF'
import io, re
t = io.open("docs/internal/audits/2026-08-27-public-visibility-matrix.md", encoding="utf-8").read()
words = [l.strip("`, ") for l in io.open("docs/style/VOICE.md", encoding="utf-8").read().splitlines()[85:91] for l in l.split("`,")]
hits = [w for w in words if w and re.search(r"\b" + re.escape(w.lower()) + r"\b", t.lower())]
print("em dashes:", t.count("\u2014")); print("banned hits:", hits)
EOF
```
Expected: `em dashes: 0`, `banned hits: []`. If the VOICE.md line window has moved, read the list under "Words to avoid" by eye and adjust the slice.

- [ ] **Step 5: Commit**

```bash
git add docs/internal/audits/2026-08-27-public-visibility-matrix.md
git commit -m "Record public visibility matrix and scan v1 for all catalog slugs"
```

---

### Task 7: Governance docs: visibility table, canon buckets, SSOT, DEBT, CHANGELOG

**Files:**
- Modify: `docs/governance/repo-framework.md` (Visibility defaults table, lines 72-83; line 94 `alawein/products/`)
- Modify: `docs/governance/repo-topology-canon.md` (section A bucket table lines 18-31; section D validator table; frontmatter `last_updated`)
- Modify: `SSOT.md` (Current State bullets after the pin-drift bullet ~line 55; `last-verified` and `last_updated`)
- Modify: `docs/DEBT.md` (append entries; `last_updated`)
- Modify: `CHANGELOG.md` (`[Unreleased]`; also merge the duplicate `### Added` headings)

- [ ] **Step 1: Rewrite the visibility table in `repo-framework.md`**

Replace the `## Visibility defaults` section (table and heading) with:

```markdown
## Visibility defaults

Every repo is private unless it holds a current public scan. The gate lives in
`docs/internal/specs/2026-08-27-public-readiness-gate-design.md` and is
enforced by `scripts/github/validate-visibility.py` (catalog vs live GitHub)
and `scripts/catalog/validate-catalog.py` (offline rules).

| Bucket | Default | Public when |
|---|---|---|
| core | private | `promotion.tier` P0 or P1 with a scan under 90 days; no workspace paths or credentials in tree |
| apps | private | same, plus payment and auth paths real or explicitly disabled |
| lab | private | same; cited research (CITATION.cff or a profile research row) gets one fix wave of grace |
| sites | private until scanned; expected to end public | same |
| work | private | never, unless the client or employer approves in writing |
| archive | match original | do not flip visibility at archive time |

Profile pins draw only from tier P0. Flips and pin edits are manual, one
approved table at a time; no script changes visibility.
```

Change line 94 `alawein/products/` to `alawein/apps/`. Set `last_updated: 2026-08-27`.

- [ ] **Step 2: Update canon section A**

Replace the `bucket` table rows (lines 24-30) with the six buckets:

```markdown
| Value | Meaning |
|-------|---------|
| `core` | Control plane, shared infra, design system, workspace tooling |
| `apps` | Shipped or monetizing products and family-maintained apps |
| `lab` | Research, simulation, experiments, early-stage bets |
| `sites` | Public portfolio and identity sites |
| `work` | Interview, contract, and employer-adjacent work |
| `archive` | Inactive but preserved; disk under `_archive/` |
```

Update the "Legal / Illegal" line to `**Legal:** bucket=lab + type=product (attributa). **Illegal:** bucket=core + disk lab/attributa.` Under `### Header block (do not break)` add one sentence after the code block: `Visibility MUST agree with catalog visibility and live GitHub; the public readiness gate (validate-visibility.py) enforces it.` In the section D table add a row:

```markdown
| `validate-visibility.py` | Shipped | Hub `docs-doctrine.yml`; catalog visibility vs live GitHub, empty or README-less public repos, pins require P0, LICENSE for public research and tooling |
```

Set `last_updated: 2026-08-27`.

- [ ] **Step 3: SSOT**

After the pin-drift bullet in `## Current State`, add:

```markdown
- Public readiness gate is active: every repo is private unless
  `catalog/index.yaml` carries a current `promotion` record (tier P0 or P1,
  scan under 90 days); pins require P0. Enforced by
  `scripts/github/validate-visibility.py` and the offline rules in
  `scripts/catalog/validate-catalog.py`. Design:
  `docs/internal/specs/2026-08-27-public-readiness-gate-design.md`
```

Set `last-verified: 2026-08-27` and `last_updated: 2026-08-27`; bump the `**Last Updated:**` header line to the same date.

- [ ] **Step 4: DEBT entries**

Append to `docs/DEBT.md` (and set `last_updated: 2026-08-27`):

```markdown
### verify-profile-pins README link check fails for non-research pins
- **Date:** 2026-08-27
- **Where:** `scripts/github/verify-profile-pins.py:30-39`, `scripts/catalog/sync-readme.py`
- **What:** The README pin check requires a `[slug](` link for every pin, but the generated README links only the research rows, so `fallax`-style pins from other rows fail `--skip-live --check`. Pre-existing before the gate work.
- **Risk if left:** The CLAUDE.md validation list has one permanently red command; people learn to ignore it.
- **Suggested fix:** Have `sync-readme.py` emit a pinned-repos line, or drop the README half of the check now that `validate-visibility.py` V5 and V7 cover pins.
- **Owner:** alawein

### CLAUDE.md cites a /voice-resweep skill that does not exist on disk
- **Date:** 2026-08-27
- **Where:** `CLAUDE.md` (Build and validate section), `~/.claude/skills/registry.json` entry `voice-resweep`
- **What:** The registry points at `~/.claude/skills/voice-resweep/SKILL.md`, which is absent; only `config/model-routing.yaml` defines a `voice-resweep` workflow.
- **Risk if left:** A new session follows a dead pointer instead of running the listed commands.
- **Suggested fix:** Create the skill wrapping the Build and validate block, or reword CLAUDE.md to point at the block directly.
- **Owner:** alawein

### compliance field drifts from visibility
- **Date:** 2026-08-27
- **Where:** `catalog/repos.json` `github_custom_properties.compliance`; `scripts/catalog/compile_index.py` hardcodes `public-data` for new entries
- **What:** `provegate` is public with `internal-only`; seven private repos carry `public-data`.
- **Risk if left:** GitHub custom properties misstate data handling.
- **Suggested fix:** Derive `compliance` from visibility when unset, and audit the seven by hand.
- **Owner:** alawein
```

- [ ] **Step 4b: Align the style guide archive order**

In `docs/style/readme-style-guide.md`, the Archive section order (lines 27-62) reads `Status, Historical purpose, Constraints, Retrieval notes`. Replace it with the canon order `Status, Archive reason, Contents, Access rules, Docs map` and set `last_updated: 2026-08-27`. Add `docs/style/readme-style-guide.md` to the Step 7 commit.

- [ ] **Step 5: CHANGELOG**

Under `## [Unreleased]`, merge the two `### Added` blocks into one and add:

```markdown
- Public readiness gate: `promotion` records in [`catalog/index.yaml`](catalog/index.yaml), offline rules in `validate-catalog.py`, and [`scripts/github/validate-visibility.py`](scripts/github/validate-visibility.py) comparing catalog visibility and pins with live GitHub. Design: `docs/internal/specs/2026-08-27-public-readiness-gate-design.md`.
- [`templates/scaffolding/README.governance.md`](templates/scaffolding/README.governance.md) and [`README.archive.md`](templates/scaffolding/README.archive.md); framework header added to the product, research, and tooling templates.
- [`docs/internal/audits/2026-08-27-public-visibility-matrix.md`](docs/internal/audits/2026-08-27-public-visibility-matrix.md): scan v1 of all 40 catalog slugs.
```

Under `### Changed` add:

```markdown
- [`docs/governance/repo-framework.md`](docs/governance/repo-framework.md): visibility defaults rewritten for the six buckets, private by default; [`docs/governance/repo-topology-canon.md`](docs/governance/repo-topology-canon.md) bucket table aligned.
```

Set `last_updated: 2026-08-27`.

- [ ] **Step 6: Run the doc gates**

Run:
```bash
python scripts/doctrine/build-style-rules.py --check
python scripts/doctrine/validate.py --ci
python scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/style-advisory-audit.py --repo-root .
```
Expected: all exit 0. If `validate-doc-contract.sh` reports a stale `last_updated`, bump that file and rerun.

- [ ] **Step 7: Commit**

```bash
git add docs/governance/repo-framework.md docs/governance/repo-topology-canon.md docs/style/readme-style-guide.md SSOT.md docs/DEBT.md CHANGELOG.md
git commit -m "Rewrite visibility defaults as private by default and record the gate in SSOT"
```

---

### Task 8: Seed `promotion` records and demote `outpost` in the catalog

**Files:**
- Modify: `catalog/index.yaml` (11 public entries; `outpost` entry at lines 32-35)
- Modify: `profile-from-guides.yaml` (`profile_pins` lines 53-59; `updated` field)
- Regenerate: `catalog/repos.json`, `projects.json`, `catalog/generated/*`, `README.md` (via scripts only)

**Interfaces:**
- Consumes: tiers from the matrix (Task 6).
- Produces: a catalog that passes `validate-catalog.py` with only grace warnings, and `build-catalog.py --check` exit 0.

- [ ] **Step 1: Add `promotion` to the 11 public entries in `catalog/index.yaml`**

For `alawein, chshlab, fallax, llmworks, loopholelab, maglogic, provegate, qmatsim, qubeml, scicomp, spincirc`, add under the entry (after `url:`), using the matrix tier; the five live pins get `grace_until`:

```yaml
    promotion:
      tier: P1
      scanned: '2026-08-27'
      notes: scan v1, see docs/internal/audits/2026-08-27-public-visibility-matrix.md
```

For `fallax, loopholelab, chshlab, qmatsim, llmworks` add `grace_until: '2026-09-30'` and the note `pinned; P0 after README redo wave 1`. For the cited research (`qmatsim, spincirc, maglogic, scicomp, qubeml`) add the note `cited research; CITATION.cff` where the file exists (`maglogic, scicomp, spincirc`).

If the matrix marked any public repo as failing B5 to B7, do not seed it; it goes into the private-first batch in Task 9 instead.

- [ ] **Step 2: Demote `outpost` in the catalog**

In `catalog/index.yaml`, `outpost` entry: remove the `visibility: public` line (absent means private) and leave it without `promotion`. In `profile-from-guides.yaml`, remove `  - outpost` from `profile_pins` and set `updated: 2026-08-27`.

- [ ] **Step 3: Rebuild and validate**

```bash
python scripts/catalog/build-catalog.py
python scripts/catalog/sync-readme.py
python scripts/catalog/validate-catalog.py
python scripts/catalog/build-catalog.py --check
python scripts/catalog/sync-readme.py --check
python scripts/github/validate-visibility.py --offline
python -m pytest scripts/tests -q
```
Expected: `validate-catalog.py` prints no promotion errors or warnings (the five pins are under grace, which the offline rule keeps silent so `--strict` in CI stays green); run `python scripts/catalog/validate-catalog.py --strict` too and expect exit 0; both `--check` commands exit 0; `--offline` prints 5 `V5` warnings, 0 errors, exit 0; pytest all pass. `verify-profile-pins.py --skip-live --check` still fails on README links (pre-existing, DEBT entry from Task 7).

- [ ] **Step 4: Confirm the generated diff is only what the scripts produced**

Run: `git status --short` and `git diff --stat`
Expected changes: `catalog/index.yaml`, `profile-from-guides.yaml`, `catalog/repos.json`, `projects.json`, `catalog/generated/*.json`, possibly `README.md` and `docs/archive/desktop-repo-inventory.json`. Nothing else.

- [ ] **Step 5: Commit**

```bash
git add catalog/index.yaml profile-from-guides.yaml catalog/repos.json projects.json catalog/generated README.md docs/archive/desktop-repo-inventory.json
git commit -m "Seed promotion records for public repos and demote outpost to private"
```
(Drop any path from `git add` that `git status` did not list.)

---

### Task 9: Private-first batch approval and the `outpost` flip (main session only)

**Files:** none in the repo. This task mutates GitHub and runs only in the main session after the user approves the table shown in this turn. A subagent executing this plan stops at this task and reports.

- [ ] **Step 1: Show the batch table and ask**

Present the `## Private-first batch` table from the matrix (expected: `outpost` only) and the exact command. Use AskUserQuestion with options `Approve the flip`, `Skip the flip this cycle`. Do not proceed on silence or on an earlier approval.

- [ ] **Step 2: On approval, flip and verify**

```powershell
gh api -X PATCH repos/alawein/outpost -f private=true --jq '{name,visibility}'
$env:GITHUB_TOKEN = (gh auth token)
python scripts/github/validate-visibility.py --github-api
python scripts/github/validate-visibility.py --github-api --slug outpost
```
Expected: first command prints `visibility: private`; the full run prints 5 warnings (pins under grace) and 0 errors, exit 0; the slug run prints `visibility-gate: OK (1 catalog entries, mode=github-api)`.

Note: the REST field is `private=true`; `visibility=private` also works on this API version but `private` is the documented stable field.

- [ ] **Step 3: If skipped**

Revert the `outpost` catalog demotion from Task 8 step 2 (restore `visibility: public` and the pin), rebuild, and record in the matrix that the flip was deferred with the date. The gate then reports V2, V3, and V5 for `outpost` as errors until the flip happens; the PR must not merge red, so a skip here means the PR waits.

---

### Task 10: Full gate, PR, and reconcile

**Files:** none new.

- [ ] **Step 1: Run the whole CLAUDE.md list plus tests**

```bash
python scripts/doctrine/build-style-rules.py --check
python scripts/doctrine/validate.py --ci
python scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/style-advisory-audit.py --repo-root .
python scripts/catalog/sync-readme.py --check
python scripts/catalog/build-catalog.py --check
python scripts/github/validate-visibility.py --offline
python scripts/github/verify-profile-pins.py --skip-live --check   # known red, DEBT
./scripts/github/sync-github.sh --check --all
python scripts/github/github-baseline-audit.py
python -m pytest scripts/tests scripts/doctrine/tests -q
```
Expected: every command exit 0 except `verify-profile-pins.py` (pre-existing README-link failure, listed in DEBT). Paste the exit codes into the PR body.

- [ ] **Step 2: Squash preview**

Run: `git diff --stat origin/main...HEAD`
Expected: only the files named in Tasks 1 to 8.

- [ ] **Step 3: Push and open the PR**

```bash
git push -u origin feat/public-readiness-gate
```

PR title: `Add public readiness gate: private by default, promotion by scan`

PR body (fill the numbers from Step 1):

```markdown
## Summary
Every catalog repo is private unless it carries a current promotion record; a read-only validator compares catalog visibility and pins with live GitHub. Seeds scan v1 for the 11 public repos and demotes the empty `outpost` repo to private.

## What changed
- `promotion` records flow from `catalog/index.yaml` to `repos.json` (`compile_index.py`, `schemas/repo.schema.json`).
- Offline rules in `validate-catalog.py`: public needs P0/P1 scanned under 90 days; pinned needs P0; `grace_until` downgrades to warning.
- `scripts/github/validate-visibility.py` (V1 to V8) with 26 tests; wired into Docs Doctrine.
- README templates carry the framework header; `README.governance.md` and `README.archive.md` added.
- `repo-framework.md` visibility defaults rewritten for the six buckets; canon bucket table aligned; SSOT, DEBT, CHANGELOG updated.
- `docs/internal/audits/2026-08-27-public-visibility-matrix.md`: scan v1 for all 40 slugs.
- `outpost`: private in catalog and on GitHub, removed from `profile_pins`.

## Why / context
No gate existed; nothing compared catalog visibility to GitHub or required pins to be public. Design: `docs/internal/specs/2026-08-27-public-readiness-gate-design.md`.

## Testing
- `python -m pytest scripts/tests scripts/doctrine/tests -q`: N passed.
- `validate-visibility.py --github-api`: 0 errors, 5 warnings (pins under grace until 2026-09-30).
- Full CLAUDE.md validation list: all exit 0 except `verify-profile-pins.py --skip-live --check` (pre-existing README-link failure, tracked in DEBT).

## Risks and limitations
- The gate CI step reads private repos through `ALAWEIN_METADATA_SYNC_TOKEN`; if that secret is rotated the step fails with exit 2, not a false pass.
- Five pins are P1 under grace; the README redo wave (sub-project 3) promotes them to P0 or they drop from the pin list on 2026-09-30.
```

Create with `gh pr create --title "..." --body-file <file>` only after the user gives the send word for this PR in this turn.

- [ ] **Step 4: Reconcile**

Run `/reconcile` against this plan: every task done with evidence, deferred with a reason, or dropped. Update this plan's `status:` to `completed` (or `partial` with the deferred list) and `last_updated`.

---

## Self-review

Spec coverage:
- Blockers B1 to B9: B1 V1, B2 V2+V3, B3 and B4 existing validators (matrix), B5 to B7 manual (Task 6), B8 V6, B9 V5+V7. Covered.
- Warnings (badge wall, topology.md, stale last_verified, description drift): recorded in the matrix Findings, not enforced. Matches the spec (warnings are informational).
- Tiers, grace rule, promotion order: data model Task 1, rules Task 2 and 3, order documented in `repo-framework.md` Task 7.
- Validator flags `--github-api`, `--offline`, `--slug`, `--json`: Task 4. Exit codes 0/1/2: Task 4.
- CI step and CLAUDE.md line: Task 4. The `/voice-resweep` skill does not exist; DEBT entry instead.
- Templates and canon fixes, SSOT, DEBT: Tasks 5 and 7. Task 5 also pins `catalog_lib.README_SECTIONS` to the topology validator's `SECTIONS_BY_TYPE` so the two lists cannot drift again. Task 7 aligns the style guide's archive order, a drift found while planning.
- CI token: `ALAWEIN_METADATA_SYNC_TOKEN` (verified in `github-metadata-sync.yml:128`), so no offline fallback is needed.
- Matrix: Task 6 (pulled forward from sub-project 2 because the seeded records cite it). Benchmark doc and batch manifest remain sub-project 2.
- Private-first batch and flip with approval: Task 9. Sibling README redos and pin proposal: sub-projects 3 and 4, out of this plan.

Placeholder scan: template files use `{{...}}` placeholders by design (scaffolding). The matrix skeleton in Task 6 shows `...` only inside the markdown example to mark rows the executor fills from evidence; the step text forbids empty cells.

Type consistency: `evaluate(repos, profile_pins, live, live_pins, *, today)` and `Finding(slug, code, level, message)` are used identically in Tasks 3 and 4; `promotion_is_current`, `grace_active`, `PUBLIC_TIERS` are defined in Task 2 and imported in Task 3; `README_SECTIONS["archive"]` defined in Task 5 and used by its test.
