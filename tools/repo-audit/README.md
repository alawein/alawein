# repo-audit

Read-only audit scanner for GitHub repositories. It collects reproducible
evidence (metadata, protections, CI state, ownership, documentation, dependency
management, integrations) and writes a CSV inventory, a JSON inventory, a
Mermaid integration map, a Markdown audit report, and a prioritized remediation
backlog.

The scanner performs `GET` requests only. It never changes repository settings,
rulesets, integrations, or secrets, and it never prints, logs, or writes a
credential value.

## Requirements

- Python 3.10 or newer. No third-party runtime dependency: the scanner uses the
  standard library only.
- `pytest` for the test suite (`pip install pytest`).

## Usage

Scan an explicit repository list:

```bash
python tools/repo-audit/scan.py \
  --repos alawein/alawein \
  --output-dir tools/repo-audit/examples
```

Scan every repository in an organization or user account:

```bash
python tools/repo-audit/scan.py --org alawein --output-dir out
```

Read the target list from a file (one `owner/repo` per line, `#` comments
allowed):

```bash
python tools/repo-audit/scan.py --repos-file targets.txt --output-dir out
```

Validate a previously generated output directory:

```bash
python tools/repo-audit/scan.py --check-outputs tools/repo-audit/examples
```

### Flags

| Flag | Purpose |
| --- | --- |
| `--org ACCOUNT` | Enumerate every repository in an organization, falling back to a user account. |
| `--repos LIST` | Comma-separated `owner/repo` targets. |
| `--repos-file FILE` | File with one `owner/repo` per line. |
| `--output-dir DIR` | Output directory (default `tools/repo-audit/examples`). |
| `--token-env NAME` | Environment variable holding the token (default `GITHUB_TOKEN`). |
| `--api-url URL` | API base URL, for GitHub Enterprise Server. |
| `--max-repos N` | Cap the number of repositories scanned. |
| `--fixture FILE` | Replay recorded API responses instead of calling GitHub. |
| `--check-outputs DIR` | Validate CSV and JSON parity plus Mermaid syntax, then exit. |

### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Scan or validation completed. |
| 1 | A mandatory collection step failed (cannot list the scope, cannot read a target repository, missing target list). |
| 2 | Usage error from argument parsing. |
| 3 | Output validation failed (CSV and JSON disagree, a file is missing, or the Mermaid file is malformed). |

## Outputs

All outputs land in `--output-dir`:

- `repo-inventory.csv`: one row per repository; list values joined with `;`.
- `repo-inventory.json`: the same records plus per-field evidence and the
  derived findings. The shape is described in
  [`schema.json`](schema.json). Webhook destinations retain only the scheme and
  host plus a literal `[redacted]` path; user information, route data, query
  parameters, and fragments are discarded.
- `integration-map.mmd`: Mermaid flowchart of repository to CI checks to
  deployment and infrastructure to external services to notifications. It
  carries names only, never secrets or payloads.
- `AUDIT-REPORT.md`: inventory table, coverage limits, and the evidence list
  (endpoint URL, HTTP status, timestamp) for every repository.
- `backlog.md`: findings ordered by risk band.

Generated Markdown carries the workspace doctrine frontmatter
(`type: generated`) so the files pass the repository documentation gates.

### States

| State | Meaning |
| --- | --- |
| `pass` | The control was observed as configured. |
| `fail` | The endpoint was readable and the control is absent or failing. |
| `pending` | GitHub is still computing the answer (HTTP 202) or a run is queued or in progress. |
| `unknown` | The response was readable but carried no determinable value. |
| `unavailable` | The endpoint could not be read with the supplied token, or the request never completed. |

An unreadable endpoint is never reported as `pass`. A paginated collection that
fails part way through, receives an off-host next-page link, or hits the
20-page cap is reported as
`unavailable` with an empty list rather than a truncated count, and every page
attempted is retained in the evidence list.

The scanner sends the token only to the host named by `--api-url`: pagination
links and HTTP redirects that point at another host are refused.

### Backlog priority bands

1. Security or credential exposure
2. Broken or missing required CI
3. Unsafe repository protections or merge controls
4. Reliability and deployment risks
5. Missing ownership or unclear integration responsibility
6. Dependency-management gaps
7. Documentation and observability gaps
8. Low-risk cleanup

## Tokens and permissions

The scanner reads its token from `$GITHUB_TOKEN` by default and sends it only in
the `Authorization` request header.

In GitHub Actions the live audit job grants the default `GITHUB_TOKEN`
`contents: read`, `actions: read`, `issues: read`, and `pull-requests: read`.
That is enough for metadata, commits, contributors, pull requests, issues,
workflows, workflow runs, effective branch rules, CODEOWNERS, README, `docs/`,
and the Dependabot configuration file. The pull-request test job receives only
`contents: read` and does not perform a live scan.

These endpoints need more than the default token and are reported as
`unavailable` until it is supplied:

| Field | Endpoint | Minimum additional permission |
| --- | --- | --- |
| classic branch-protection details in `branch_protection_state`, `required_status_checks`, `required_status_checks_state` | `/repos/{owner}/{repo}/branches/{branch}/protection` | Administration: read |
| `secret_scanning_state` | `security_and_analysis` on `/repos/{owner}/{repo}` | Administration: read |
| `dependency_alerts_state` | `/repos/{owner}/{repo}/vulnerability-alerts` | Administration: read |
| `webhooks_state` | `/repos/{owner}/{repo}/hooks` | Administration: read |
| cross-repository or organization scans | `/orgs/{org}/repos`, `/users/{user}/repos` | Contents: read on the target repositories; `read:org` for organization membership listings |

To collect those fields, add a token as the repository secret
`REPO_AUDIT_TOKEN` (Settings, Secrets and variables, Actions, New repository
secret) and pass it with `--token-env REPO_AUDIT_TOKEN`. Use a fine-grained
personal access token limited to the repositories in scope, with read-only
Metadata, Contents, Actions, Issues, Pull requests, and Administration
permissions. A classic token needs `repo` (read) and, only for
organization-level reads, `read:org`. Never
paste a token into a pull request, an issue, or a workflow file; reference it as
`${{ secrets.REPO_AUDIT_TOKEN }}` only.

GitHub does not expose a complete repository GitHub App inventory through the
authenticated-app installation endpoint used by the earlier implementation.
That endpoint identifies only the calling app and requires app authentication,
so the scanner does not call it or claim that it has enumerated installed apps.

## Continuous integration

[`.github/workflows/repo-audit.yml`](../../.github/workflows/repo-audit.yml)
runs the tests and deterministic fixture check on pushes and pull requests. On
push or manual dispatch, a separate job scans `alawein/alawein` with the default
`GITHUB_TOKEN`, validates the complete JSON structure plus CSV parity and
Mermaid syntax, and uploads the outputs as an artifact. The test job requests
`contents: read` only. The live job adds `actions: read`, `issues: read`, and
`pull-requests: read`; it uses no other secret. The workflow does not commit its
outputs; the committed examples under `examples/` are the checked-in reference
copy.

## Tests

```bash
python -m pytest tools/repo-audit/tests -v
```

The tests use scripted responses; they never reach the network. They cover
pagination, HTTP status to state mapping, failure handling, effective rules,
webhook redaction, output writers, complete JSON structure, CSV and JSON
parity, workflow permissions, and CLI exit codes.

## Example outputs

`examples/` holds a deterministic run against `alawein/alawein` produced from
the recorded responses in `tests/fixtures/alawein-alawein.json`, which mirror
what a workflow `GITHUB_TOKEN` can read. Regenerate them with:

```bash
SOURCE_DATE_EPOCH=1788771600 python tools/repo-audit/scan.py \
  --repos alawein/alawein \
  --fixture tools/repo-audit/tests/fixtures/alawein-alawein.json \
  --output-dir tools/repo-audit/examples
```

`SOURCE_DATE_EPOCH` pins the scanner clock, so a fixture replay reproduces the
committed examples byte for byte. CI regenerates them with the same value and
fails on any diff.

The live CI run publishes its own outputs as a workflow artifact, so the
committed examples stay stable while the artifact reflects current state.
