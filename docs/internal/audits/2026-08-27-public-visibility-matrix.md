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

Cell values are `pass`, `fail: <reason>`, `n/a` where the check does not apply,
or `not scanned` where the tool was unavailable. All GitHub calls were read-only.

## How B5 to B7 were judged

- B5: every capability claim in the README was checked against the tree on
  `main` and, where the README names a deploy, against the live URL. A named
  path that does not exist, or a named route that 404s, is a fail.
- B6: two sources. GitHub secret-scanning open alerts, and a pattern scan of
  tracked paths on `main` for `.env`, `*.pem`, `*.key`, `id_rsa`, `secrets.json`,
  and similar. A committed `.env.example` is a template and does not fail.
  Only `alawein` has a gitleaks history scan, from its own CI.
- B7: judged on the repo's build and test workflow (`CI`, `ci`, or `test`) on
  `main` HEAD. Reporting workflows (`drift`, `CodeQL`, `OpenSSF Scorecard`,
  `Dependabot Updates`, `Docs Doctrine`) are recorded as warnings, not B7
  fails, because their failures are token and configuration problems rather
  than code. A repo with no build workflow passes B7 only if its README Status
  section states the honest lifecycle and claims no green CI.

## Public on GitHub (12)

| slug | catalog | GitHub | pinned | type | bucket | B1 | B2 | B3 | B4 | B5 | B6 | B7 | B8 | B9 | tier | action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| alawein | public | public | no | governance | core | pass | pass | n/a | n/a | pass | fail: 224 gitleaks findings in history, 2 open alerts | fail: Audit Documentation, Gitleaks, Workspace Audit red on HEAD | n/a | n/a | P1 | seed P1; hub, never pinned, never flipped; fix CI and history |
| chshlab | public | public | yes | research | lab | pass | pass | pass | pass | pass | pass | pass | pass | fail: pinned without a P0 record | P1 | seed P1, P0 candidate; no grace (no CITATION.cff, no research row) |
| fallax | public | public | yes | tooling | lab | pass | pass | pass | pass | pass | not scanned: secret scanning off | pass | pass | fail: pinned without a P0 record | P1 | seed P1, grace to 2026-09-30, P0 candidate; enable secret scanning |
| llmworks | public | public | yes | product | lab | pass | pass | pass | pass | pass | not scanned: secret scanning off | pass | pass | fail: pinned without a P0 record | P1 | seed P1; enable secret scanning; fix the stale `e2e/` tree entry |
| loopholelab | public | public | yes | research | lab | pass | pass | pass | pass | fail: `/app`, `/app/dashboard`, `/docs` 404 on loopholelab.online | pass | pass | pass | fail: pinned without a P0 record | P2 | private-first batch, B5 |
| maglogic | public | public | no | research | lab | pass | pass | pass | pass | pass | pass | pass: no build workflow, Status says frozen | pass | n/a | P1 | seed P1, grace to 2026-09-30, P0 candidate |
| outpost | public | public | catalog only | tooling | core | pass | pass | pass | pass | pass | pass | pass | pass | fail: catalog pin without a P0 record, not in the live pin list | P1 | seed P1; settle the catalog pin against the live list |
| provegate | public | public | no | research | lab | pass | pass | pass | pass | pass | pass | fail: CI `test` red on HEAD at the Lint step | pass | n/a | P2 | private-first batch, B7 |
| qmatsim | public | public | yes | research | lab | pass | pass | pass | pass | pass | pass | pass | pass | fail: pinned without a P0 record | P1 | seed P1, grace to 2026-09-30, P0 candidate |
| qubeml | public | public | no | research | lab | pass | pass | pass | pass | pass | pass | pass: no build workflow, Status says frozen | pass | n/a | P1 | seed P1, grace to 2026-09-30 |
| scicomp | public | public | no | research | lab | pass | pass | pass | pass | pass | pass | pass: no build workflow, Status says frozen | pass | n/a | P1 | seed P1, grace to 2026-09-30, P0 candidate |
| spincirc | public | public | no | research | lab | pass | pass | pass | pass | pass | pass | pass: no build workflow, Status says frozen | pass | n/a | P1 | seed P1, grace to 2026-09-30, P0 candidate |

Seven of the twelve pass every one of B1 to B8: `chshlab`, `maglogic`,
`outpost`, `qmatsim`, `qubeml`, `scicomp`, `spincirc`.

## Private on GitHub (28)

| slug | catalog | GitHub | type | bucket | status | tier | reason |
|---|---|---|---|---|---|---|---|
| adil | private | private | research | lab | active | P2 | active private lab |
| alembiq | private | private | research | lab | active | P2 | active private lab |
| atelier-rounaq | private | private | product | apps | active | P2 | open credibility flags (April audit) |
| attributa | private | private | research | lab | active | P2 | active private lab; fails B3 topology, five missing README sections |
| auditraise | private | private | product | apps | active | P2 | apps bucket, private by policy |
| bolts | private | private | product | apps | active | P2 | open credibility flags (April audit) |
| design-system | private | private | infra | core | active | P2 | internal core tooling |
| edfp | private | private | research | lab | frozen | P3 | dormant research |
| gymboy | private | private | product | apps | active | P2 | open credibility flags (April audit) |
| handshake | private | private | product | work | active | P2 | work bucket, never public |
| helios | private | private (archived) | archive | archive | archived | exempt | archived |
| incore | private | private | tooling | core | active | P2 | internal core tooling |
| knowledge-base | private | private | infra | core | active | P2 | internal core tooling |
| meatheadphysicist | private | private | research | lab | active | P2 | active private lab |
| mercor | private | private | product | work | active | P2 | work bucket, never public |
| meshal-web | private | private | product | sites | maintained | P2 | sites bucket, next wave candidate |
| optiqap | private | private | research | lab | maintained | P2 | maintained private lab |
| prompty | private | private | tooling | core | active | P2 | internal core tooling |
| qmlab | private | private | research | lab | frozen | P3 | dormant research |
| quantumalgo | private | private | research | lab | active | P2 | active private lab |
| repz | private | private | product | apps | active | P2 | open credibility flags (April audit) |
| roka-oakland-hustle | private | private | product | sites | active | P2 | sites bucket, next wave candidate |
| scribd | private | private | product | apps | active | P2 | open credibility flags (April audit) |
| simcore | private | private | research | lab | active | P2 | active private lab |
| turing | private | private | product | work | active | P2 | work bucket, never public |
| veyra | private | private | research | lab | active | P2 | active private lab; fails B3 topology, five missing README sections |
| workspace-control | private | private | tooling | core | active | P2 | internal core tooling |
| workspace-tools | private | private | tooling | core | active | P2 | internal core tooling |

## Private-first batch (needs approval before any flip)

| slug | why | catalog change | GitHub change | pin change |
|---|---|---|---|---|
| loopholelab | B5: the README lists `/app`, `/app/dashboard`, and `/docs` as shipped routes; all three 404 on loopholelab.online, and the landing page's own buttons point at them | visibility: private, no promotion | PATCH private=true | remove from the live pin list and from `profile_pins` |
| provegate | B7: the `CI` workflow's `test` job is red on `main` HEAD at the Lint step | visibility: private, no promotion | PATCH private=true | none, not pinned |

The design expected this batch to hold `outpost` only. `outpost` was seeded on
2026-08-27 and now passes every blocker, so it leaves the batch; `loopholelab`
and `provegate` take its place. Either row can be cleared by fixing the named
check instead of flipping, which is the cheaper path for both.

## Findings

- Validators: `validate-readme-topology.py --github-api` exits 1 on `attributa`
  and `veyra` only, both private, five missing README sections each.
  `validate-readme-voice.py --github-api` exits 0 across all 40 entries.
  `validate-visibility.py --github-api --json` returns 18 errors: 12 V4 (public
  without a promotion record) and 6 V5 (pinned without P0). No V1, V2, V3, V6,
  V7, or V8. Catalog visibility matches GitHub on all 40 slugs.
- Live pins (5): `fallax`, `loopholelab`, `chshlab`, `qmatsim`, `llmworks`.
  Catalog `profile_pins` (6) adds `outpost` at the front. The catalog and the
  live list disagree by that one slug.
- `alawein` B6 fail, detail: the Gitleaks job on `main` HEAD reports 224
  findings across git history (145 generic-api-key, 42 jwt, 33 curl-auth-header,
  4 private-key). Separately, two GitHub secret-scanning alerts are open, a
  Supabase service key from 2025-12-06 and a Supabase personal access token
  from 2026-04-16, both at historical `repz-llc/`, `organizations/`, and
  `platforms/` paths from the old monorepo layout. None of those paths exist in
  the current tree. The 224 findings were not triaged one by one; the count and
  the rule mix are the record.
- `alawein` B7 fail, detail: on `main` HEAD, `Audit Documentation`, `Gitleaks`,
  and the `sync` job are red, and 22 of 30 `Workspace Audit` matrix legs fail at
  `Checkout repo` because the job's token cannot read private repos. `Docs
  Doctrine` and `CI - Documentation Contract` were last red on 2026-08-17.
- `alawein` stays public and P1 despite failing B6 and B7. It is the GitHub
  profile repo; taking it private removes the profile README from every visitor.
  The gate's flip rule does not apply to it. The two failures are fix items for
  this cycle, and they are the sharpest open risk in this scan.
- `loopholelab` B5 fail, detail: `api/main.py` defines `/app`,
  `/app/dashboard`, `/share/{report_id}`, and `/health`, and FastAPI would serve
  `/docs`. The live host serves only the static landing page, so every one of
  those returns 404 while the landing page advertises them as "Run The
  Validator", "View The Dashboard", and "Browse API Docs". The FastAPI app is
  not deployed.
- `provegate` B7 fail, detail: run 31874723201 (2026-08-15) failed the `test`
  job at the Lint step, and `main` HEAD `fc12dfb76f` still carries
  `test=failure`. The repo's own CI is the check, not a reporting workflow.
- The `drift` workflow is red on 9 of 12 public repos: `chshlab`, `fallax`,
  `loopholelab`, `maglogic`, `provegate`, `qmatsim`, `qubeml`, `scicomp`,
  `spincirc`. Every one fails at the same step, `Install workspace-batch`, which
  pip-installs a package from the private `alawein/workspace-tools` repo using
  `WORKSPACE_TOOLS_TOKEN`. This is one fleet-wide credential problem, not nine
  code problems, so it is recorded as a warning rather than nine B7 fails.
- `llmworks` reporting workflows: `CodeQL` fails at `Check code scanning
  availability` and `OpenSSF Scorecard` fails at `Commit scorecard results`.
  Both are repository configuration, not code. The `CI` workflow is green.
- `llmworks` B5: the April 2026 credibility flag is closed on the README
  surface. The README states the repo does not call provider SDKs or compute
  benchmark scores, and that holds: `package.json` declares no Anthropic or
  OpenAI dependency, and neither Supabase edge function
  (`supabase/functions/benchmarks/index.ts`, `.../evaluations/index.ts`)
  contains a provider call, a mock, or a `Math.random` score. One defect
  remains: the README architecture tree lists `e2e/` at the repo root, and the
  Playwright suite actually lives at `tests/e2e/`.
- Secret scanning is off on `fallax` and `llmworks`; the alerts endpoint returns
  404 on both. Their B6 cells read `not scanned`. Their tracked-path scan is
  clean, so the gap is the alert feed, not a known exposure. Turning the feature
  on is a one-click change and would move both to a full B1 to B8 pass.
- Deploy checks, all 200: llmworks.dev, loopholelab.online (landing only),
  provegate.online, fallax.online, meshal.ai, kohyr.ai, kohyr.com.
- Four public repos have no build or test workflow at all: `maglogic`,
  `qubeml`, `scicomp`, `spincirc`. Each README Status section states
  `Lifecycle: frozen` with a verification date and scope, and none displays a CI
  badge, so none claims a green build it does not have.
- Grace eligibility is narrower than the design's preliminary tier table
  implies. `CITATION.cff` exists on `main` in `maglogic`, `scicomp`, and
  `spincirc` only. Adding the `research_rows` entries in
  `profile-from-guides.yaml` gives six grace-eligible slugs: `fallax`,
  `maglogic`, `qmatsim`, `qubeml`, `scicomp`, `spincirc`. `chshlab` is a P0
  candidate but has neither, so it gets no grace window.
- Four public READMEs carry a framework header that reads `Visibility: private`
  while the repo is public: `chshlab`, `fallax`, `llmworks`, `spincirc`. This is
  a header field out of date with reality, not a capability claim, so it does
  not fail B5. Fix it in the README redo wave.
- `outpost` no longer matches the design's description of it. It was seeded on
  2026-08-27 (size 219, `README.md`, `LICENSE`, `ci` green on HEAD), its README
  claims resolve against the tree, and its stated count of 28 prompts matches 28
  files under `prompts/core/`. It passes every blocker.
