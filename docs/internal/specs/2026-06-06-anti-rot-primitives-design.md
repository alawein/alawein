---
type: canonical
source: brainstorming session 2026-06-06
sla: on-change
last_updated: 2026-06-06
audience: [ai-agents, contributors]
---

# Anti-Rot Primitives for the Alawein Fleet: design spec

Design record for adding the genuinely net-new anti-rot guardrails to the fleet: a
tracked debt ledger, an Architecture Decision Record (ADR) system, and a global
`/checkpoint` behavior. It encodes them at the control-plane source and rolls them
out through existing machinery, reusing `reviewer`, `refactor`, and `arch-review`
for every primitive that already has a home. Source artifact: the anti-rot-kit
evaluated on 2026-06-06.

## Objective

A change is done only when the standard is defined once, enforced by doctrine, and
present in every code-bearing repo, with zero duplicated truth. The deliverable is
not "files copied into 42 repos"; it is a source-defined, validator-enforced,
registry-rolled standard that mirrors how the fleet already governs itself.

## Scope decisions (locked 2026-06-06)

- **Target:** the whole alawein fleet (code-archetype repos), rolled out
  source -> pilot(2) -> fleet.
- **Posture:** net-new only. Adopt only primitives the platform and governance
  corpus do not already cover.
- **Doc tier:** ADR and DEBT are governed and public (doctrine-compliant
  frontmatter, CI-validated), matching the fleet's existing doc-contract model.
- **Commit authority:** agents commit per each repo's `commit_mode` (default
  `full`), authored as `contact@meshal.ai`, no AI attribution; confirm before
  force-push or history rewrite. This follows `commit-release-convention.md` and
  supersedes the older "leave uncommitted" rule in the 2026-05-23 plan.

## Net-new filter (what we adopt vs skip, and why)

| Anti-rot primitive | Verdict | Reason |
|---|---|---|
| `/refactor-safe` | Skip | Covered by `refactor` + `refactor-scout` |
| `code-reviewer` agent | Skip | Covered by `reviewer` / `security-reviewer` / `pr-prep` |
| `architecture-guardian` agent | Skip | Covered by `arch-review` |
| constitution `CLAUDE.md` | Skip (fold in) | Control-plane + generated `.claude/CLAUDE.md` is richer; only the failure-mode "Never do" framing is folded into doctrine |
| `docs/DEBT.md` + `/debt-log` | Adopt (net-new) | No debt ledger exists; debt is scattered across memory, handoffs, audit handouts, TODO stubs |
| `docs/adr/` + `/new-adr` | Adopt (net-new) | ADRs are referenced only in kohyr; absent from the alawein corpus and the fleet |
| `/checkpoint` | Adopt (net-new) | No re-grounding behavior exists; this is a global agent behavior, not a repo artifact |
| `/check-ssot`, `/doc-sync` | Defer (v2) | Doctrine validators + `cross-repo-drift-auditor` cover most of their ground; generic versions risk two overlapping checkers |
| `CODEOWNERS` | Defer (v2) | A `.github/` artifact (a GATED path) that overlaps `github-baseline`; not worth gated-path friction in v1 |

## Architecture

Three layers, mirroring the existing fleet model. No new rollout engine is built.

```
SOURCE (alawein/alawein)            ROLLOUT                          ENFORCE
─────────────────────────          ────────────────────             ──────────────────
templates/scaffolding/      ──►     bootstrap-repo.sh (new repos)    validate-repo-framework.py
  adr-template.md                   idempotent pass (existing)        (new check: ADR + DEBT
  DEBT.md                           pilot(2) ──► fleet                 required for code archetypes)
docs/governance/anti-rot.md  ──►                                     doctrine CI step (existing)
repo-framework.md (+ rule)
```

## Components

### A. Control-plane source (in `alawein/alawein`)

1. `templates/scaffolding/DEBT.md`: debt-ledger seed. Kit format (title, date,
   where, what, risk-if-left, suggested fix, owner) plus a doctrine-compliant
   frontmatter header (`last_updated` etc.).
2. `templates/scaffolding/adr-template.md`: the kit's ADR-0000 template
   (Status / Context / Decision / Consequences), frontmatter-compliant, one
   decision per record, append-only (supersede, never rewrite).
3. `docs/governance/anti-rot.md`: single new governance doc. States the
   failure-mode -> guardrail -> primitive mapping, names canonical homes
   (`docs/adr/`, `docs/DEBT.md`), folds the kit's "Never do" hard rules (no
   big-bang rewrite; no unverified change; no silent debt) into doctrine, and
   records the overlap mapping (`code-reviewer -> reviewer`,
   `architecture-guardian -> arch-review`, `refactor-safe -> refactor`) so the
   kit's overlapping primitives are never re-added. `governance-index.md` gets one
   pointer line to it (SSOT: the doctrine lives only in `anti-rot.md`).
4. `repo-framework.md`: extend the mandatory-files section: code archetypes
   (`products`, `ventures`, `tools`, active `research`) require `docs/DEBT.md` and
   a `docs/adr/` directory; `_archive` and docs-only repos are exempt (same
   archetype-scoping pattern the README Deployment section already uses).

### B. Enforcement (one rule, extending an existing validator)

- Add a check to `scripts/doctrine/validate-repo-framework.py`: a code-archetype
  repo must have `docs/DEBT.md` (frontmatter-valid) and a `docs/adr/` directory
  containing at least the template. Archive/docs repos pass without them.
- Test-first: fixtures for missing (fails), present (passes), exempt-archetype
  (passes). No new CI wiring; the check runs inside the existing doctrine step.

### C. Global behavior skills (`~/.claude/skills/`, inherited by every repo)

- `/checkpoint`: net-new, as shipped by the kit (re-ground long runs).
- `/debt-log`: appends to `docs/DEBT.md`; creates it from the template if absent
  (lazy fallback for cold repos); honors governed frontmatter; never clobbers an
  existing populated ledger.
- `/new-adr`: scaffolds `docs/adr/NNNN-<kebab-title>.md` from the template with
  the next zero-padded number, frontmatter filled.

These live globally (not per-repo) because they are agent behaviors, not repo
files; global placement is how every repo inherits them.

## Control / data flow (how a repo acquires the primitives)

- **New repo:** `bootstrap-repo.sh` emits `docs/DEBT.md` and `docs/adr/` from the
  templates. The repo is born compliant.
- **Existing repo:** one idempotent rollout pass copies the two seeds only if
  absent (skip-if-present; never overwrite a populated `DEBT.md`), per repo, on a
  branch, committed per `commit_mode`.
- **Ongoing:** agents call `/debt-log` and `/new-adr` during normal work; doctrine
  CI fails any code repo that drops the required artifacts.

## Rollout sequencing

1. **Source.** Land components A and B in `alawein/alawein`. Dogfood: this repo
   gets its own `docs/DEBT.md` and `docs/adr/0001-adopt-anti-rot-primitives.md`
   first.
2. **Pilot (2 repos).** `tools/workspace-tools` (active, has a pytest gate) plus
   one already-green research repo (`fallax` or `qubeml`). Confirm doctrine stays
   green and a `/debt-log` + `/new-adr` round-trip produces valid files.
3. **Fleet.** Idempotent pass across the remaining code-archetype repos;
   `_archive` and docs-only repos skipped.

## Integration with the existing program

Added as **Phase 7: anti-rot primitives** inside
`docs/internal/plans/2026-05-23-fleet-remediation.md` (not a parallel plan).
Inherited hard constraints from that plan: `.github/` stays GATED (so CODEOWNERS
is deferred); every `.md` edited in `alawein/alawein` bumps `last_updated`;
American spelling; no em-dashes.

## Testing and "done" gate

- New `validate-repo-framework.py` test passes (missing / present / exempt
  fixtures).
- Full doctrine suite green on `alawein/alawein` after source changes:
  `validate.py --ci`, `validate-doctrine.py .`, `validate-doc-contract.sh --full`,
  `pytest scripts/doctrine/tests scripts/tests tests -q`.
- Each pilot repo: doctrine green, plus a real `/debt-log` and `/new-adr`
  round-trip yields frontmatter-valid files.

## Non-goals (explicit YAGNI)

- No `/check-ssot`, `/doc-sync`, CODEOWNERS, or the kit's
  `code-reviewer` / `architecture-guardian` / `refactor-safe` in v1.
- No mass git history rewrite. No `.github/` auto-edits.
- No forced migration of kohyr's existing ADR practice; align the path standard
  only.

## Risks and mitigations

- **Doctrine frontmatter drift on ADR/DEBT files** -> ship compliant templates and
  cover them with the validator test.
- **Non-idempotent existing-repo pass** -> skip-if-present; never clobber a
  populated `DEBT.md`.
- **kohyr ADR path divergence** -> reconcile to the standard `docs/adr/` path
  during implementation; do not force-migrate existing records.

## Open items for implementation (reversible)

- Confirm kohyr's current ADR location and reconcile to `docs/adr/`.
- Final pilot pair selection between `fallax` and `qubeml`.
- Exact mechanism of the existing-repo idempotent pass (extend an existing ops
  script vs a small dedicated one): decided in writing-plans.
