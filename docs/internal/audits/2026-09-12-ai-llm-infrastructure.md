---
type: audit
status: draft
last_updated: 2026-09-12
owner: meshal
---

# AI and LLM infrastructure inventory (2026-09-12)

Control-plane scan of `alawein/alawein` at `/workspace` (`core/alawein`).
Cloud Agent run `bc-e551b6c1-7140-5978-98bb-cc95f9f8c8c3`. Account canon:
`contact@meshal.ai`. Slack team `T0APHHXJV4J`. This Cloud run model is
`cursor-grok-4.6-high-fast` (Cursor lane LLM, not a Slack Grok bot).

This file is an onboarding and audit reference. It does not replace
`catalog/agent-integrations.yaml` (machine SSOT) or
`docs/governance/unified-agent-system.md` (dispatch SSOT). Slack canvases
`F0C0KEF150C`, `F0C16U6USJ0`, and `F0C1PDU320G` stay working pointers.

**Scope of this checkout:** this repo only. Catalog `local_path` lists 47
sibling repos under `apps/`, `core/`, `lab/`, `sites/`, `work/`, `_archive/`.
None of those paths exist on this VM. Product LLM code in `alembiq`,
`llmworks`, `prompty`, `fallax`, and `attributa` is catalogued, not executed
here.

**Related lands (do not collide):**

- Kit 1.7.1 teammate voice: PR #259 (`cursor/kit-humanize-voice-c8c3`)
- Live Slack/MCP rescan: PR #257 (`cursor/inventory-rescan-c8c3`)
- Grok Bot, official xAI surfaces, and peer IDE/LLM tools:
  [`2026-09-12-grok-and-peer-tools.md`](2026-09-12-grok-and-peer-tools.md)
- Prompts to cover remaining gaps:
  [`2026-09-12-coverage-prompt-pack.md`](2026-09-12-coverage-prompt-pack.md)
- Paired handshake read:
  [`2026-09-12-handshake-reconciliation.md`](2026-09-12-handshake-reconciliation.md)

## Verdict

This repo is the governance control plane. It owns prompt kits, agent
inventory, Claude Code platform source, and CI that calls Claude. It does
not own product inference.

There are **zero first-party LLM SDKs** (`openai`, `anthropic`, `litellm`,
`langchain`) in this tree. The only in-repo HTTP chat caller is
`scripts/ops/openrouter_route.py`. Every other model call happens in Cursor
Cloud, Slack bots, Claude Code on the laptop, or
`anthropics/claude-code-action` in GitHub Actions.

## 1. Integrations and connections

### 1.1 Agent lanes and default models

Machine roster: `catalog/agent-integrations.yaml` (`schemaVersion` 1.0.0,
`lastVerified` on `main` is `2026-09-07T06:56:00Z`; PR #257 moves that to
`2026-09-12T03:30:00Z`). Dispatch table:
`docs/governance/unified-agent-system.md` section 3.

```28:36:catalog/agent-integrations.yaml
agents:
  - id: cursor-cloud
    display_name: Cursor
    surfaces: [slack, cloud-agent, ide]
    slack_handle: '@Cursor'
    primary_repo: alawein/alawein
    llm_default: composer-2.5
    dispatch_roles: [implement, commit, pr, mcp-orchestration, governance-docs]
```

| id | Surface | `llm_default` | Auth / how it runs | Status on `main` |
| --- | --- | --- | --- | --- |
| `cursor-cloud` | Slack `U0APW2Z3GG2`, Cloud Agent, IDE | `composer-2.5` | Cursor subscription. Slack via Cursor Slack Tools only. | ready |
| `claude-slack` | Slack `U0AQQFJT8AC` | `claude-legacy-slack` | Per-user Slack connect. Claude Tag not enabled. | ready |
| `claude-code` | laptop IDE / terminal | `claude` | Anthropic Claude Code login. Config from `claude-agent-platform/`. | ready |
| `computer-perplexity` | Slack `U0APW7F9S4A`, Perplexity web | `perplexity` | Perplexity session. Browser/GUI. No catalog edits. | ready |
| `chatgpt-slack` | Slack `U0BUNH33CCA` | `gpt` | Replaced. Do not dispatch. | replaced |
| `codex-slack` | Slack `U0BV7V8M3NW` | `gpt-codex` | Slack OAuth Connect still required (Meshal browser). | needs_auth |
| `notion-ai-slack` | Slack `U0AQ8UNAKTK`, Notion | `notion-ai` | `contact@meshal.ai` / Meshal's Workspace `8116d8de-2215-81ce-b71b-00031e833a2d` | ready |
| `github-slack` | Slack `U0APESWEF2T` | none | PR thread mirror only. | ready |
| `kilo-slack` | Slack `U0BV9U2GFED` | unverified | GitHub App on `ops-control-plane-grok`, `ai-ops`, `workspace-brain` only. Not `alawein/alawein`. | ready (Slack), no control-plane git |

There is no `@Grok` Slack user. Do not install one. Windows Grok is laptop-only
and UNVERIFIED from this VM.

### 1.2 Catalogued third-party integrations

From `catalog/agent-integrations.yaml` `integrations:` (declaration plus last
live probe). Auth is Cursor MCP OAuth or host config, not secrets in git.

| id | Provider | Account | Catalog MCP / status | Auth |
| --- | --- | --- | --- | --- |
| `gmail` | Google | `contact@meshal.ai` | cloud ready / locked | Cursor MCP OAuth |
| `google-calendar` | Google | `contact@meshal.ai` | cloud ready / locked | Cursor MCP OAuth |
| `google-drive` | Google | `contact@meshal.ai` | cloud ready / locked | Cursor MCP OAuth. Do not fetch AGI Drive. |
| `notion` | Notion | `contact@meshal.ai` | cloud ready, desktop absent / locked | Cursor MCP. Workspace UUID above. |
| `railway` | Railway | `contact@meshal.ai` | cloud ready / locked | MCP `whoami`. Do not list AGI workspaces. |
| `vercel` | Vercel | team `alawein` | `needs_auth` / locked | Historically CLI. MCP not connected. |
| `github-mcp` | GitHub | `alawein` | desktop and Cloud ready / locked | OAuth or PAT. Repair: `docs/governance/cursor-mcp-repair.md` |
| `supermemory` | Supermemory | none | dropped / Cloud error | Do not re-auth. |
| `slack-mcp-duplicate` | Slack | n/a | redundant | Ignore. Canonical is Cursor Slack Tools. |
| `granola` | Granola | none | needs_auth / unconnected | MCP auth |
| `playwright` | Playwright | n/a | ready / available | MCP |
| `treg` | Treg | token | error / partial on 2026-09-07 (token dead) | Fresh token is human-only |
| `fireflies` | Fireflies | Slack app `B0BA8NTJAR4` | needs_auth / slack_installed | Slack install in `#all-alawein-workspace` |
| `godaddy` | Godaddy | n/a | ready / available | MCP discovery |

No committed `mcp.json` in this repo. Host path is `~/.cursor/mcp.json`
(desktop). Cloud MCP is the run-time discovery matrix.

### 1.3 Cloud MCP observed this run (2026-09-12, later in `bc-e551b6c1`)

Live `GetDynamicTools` catalog on this Cloud Agent. Time-stamped. Do not
collapse with the 2026-09-07 YAML matrix or the 03:30 UTC #257 scan.

**Ready:** Cursor Slack Tools, Slack (redundant), Github, Gmail,
Google-calendar, Google-drive, notion, Railway, Cloudflare-docs, Godaddy,
cursor-cloud, cursor-subscriptions, Huggingface-skills, Onedrive, Outlook,
Treg (discovery ready; do not treat as a proved paid call).

**Error:** Todoist, Supermemory.

**Loading:** 1password, Playwright.

**needs_auth:** Calendly, Cloudflare-bindings, Cloudflare-builds,
Cloudflare-observability, Context, Docusign, Figma, Fireflies, Granola,
Lovable, Mobbin, Neon, Posthog, Wonder, Zoom.

Desktop IDE MCP column: UNVERIFIED this VM.

### 1.4 Auth, secrets, and env (no values in git)

```1:17:.env.example
DASHBOARD_GITHUB_TOKEN=ghp_your_token_here
...
# Configure NOTION_TOKEN and NOTION_DB_ID as 1Password secret references.
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

| Secret / env | Where used | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | `scripts/ops/openrouter_route.py` via `config/model-routing.yaml` `env_files` | Local OpenRouter chat. Not used in GHA. |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude-review.yml`, `claude-token-liveness.yml`, `claude-review-backstop.yml` | Claude Code Action. Org secret. |
| `PORTFOLIO_PR_TOKEN` | `claude-review-backstop.yml` | Cross-repo `gh` for backstop. |
| `NOTION_TOKEN`, `NOTION_DB_ID` | 1Password + `op run` | Notion Projects sync. Not LLM. |
| `DASHBOARD_GITHUB_TOKEN` | dashboard scripts | GitHub metadata. Not LLM. |
| `VERCEL_TOKEN` | `sync-vercel.yml` | Deploy sync. Not LLM. |
| `AUTO_PR_TOKEN`, `KERNEL_SYNC_TOKEN`, `ALAWEIN_METADATA_SYNC_TOKEN` | various GHA | Bot PRs / metadata. Not LLM. |

`ANTHROPIC_API_KEY` and `OPENAI_API_KEY` are **not** wired in current
workflows. Mentioned only in internal rollout plans as an optional fallback.

GitHub Copilot code review is declared in
`.github/rulesets/main-protection.json` (`review_on_push: false`).

Hygiene: `docs/governance/credential-hygiene.md`.

### 1.5 Slack workflow bots (LLM backend unknown)

From `catalog/agent-integrations.yaml` `workflow_bots:`. Exempt from the
shared session prompt. Trial review date 2026-09-19.

| id | Schedule | Output | Notes |
| --- | --- | --- | --- |
| `daily-agenda` | daily 08:00 | DM | working, 0 engagement |
| `daily-briefing` | daily 09:00 | `#posts` | Last fire seen 2026-09-11 09:00 PT (Notion pointer) |
| `friday-weekly-review` | fri 16:00 | `#posts` | Last fire seen 2026-09-11 16:00 PT |
| `monday-weekly-kickoff` | mon 09:00 | `#posts` | Template last seen 2026-09-07 |
| `weekly-content-planner` | weekly 09:00 | `#content-pipeline` | working |

`unified-agent-system.md` marks workflow-bot backends as **Unknown**.

### 1.6 Slack channels (Cursor read)

Workspace `T0APHHXJV4J`. Cursor Slack Tools lists 9 channels; catalog 7/7
public reads. Agent-tier channels are listed, read blocked (bot not a member):

- `#me-agents-eng` `C0BVDBHLXQB`
- `#me-agents-ops` `C0BVDBHPB99`

Do not route control-plane work there before 2026-09-19.

## 2. LLM calls, wrappers, and evals

### 2.1 Only in-repo runtime caller: OpenRouter

Config: `config/model-routing.yaml` (verified 2026-08-27).

```1:35:config/model-routing.yaml
provider: openrouter
base_url: https://openrouter.ai/api/v1
env_files:
  - ~/.openrouter.env
  - ../.env.local
  - .env.local
defaults:
  temperature: 0.2
  max_tokens: 8192
routes:
  fast:
    model: qwen/qwen3.8-flash
  code:
    model: moonshotai/kimi-k3
  code_batch:
    model: moonshotai/kimi-k2.7-code
  reason:
    model: z-ai/glm-5.3
  reason_fast:
    model: z-ai/glm-5.3-flash
  docs:
    model: google/gemini-3.7-flash
  heavy:
    model: qwen/qwen3.8-max
```

Named workflows in the same file: `voice-resweep`, `catalog-audit`,
`bucket-migrate`, `pr-ready`. Fallbacks: `qwen/qwen3.7-flash`,
`moonshotai/kimi-k2.5`, `z-ai/glm-5.2`, `google/gemini-3.5-flash`.

Wrapper: `scripts/ops/openrouter_route.py`. OpenAI-compatible POST. No SDK.

```79:105:scripts/ops/openrouter_route.py
def chat_complete(
    *,
    api_key: str,
    base_url: str,
    model: str,
    prompt: str,
    temperature: float,
    max_tokens: int,
) -> str:
    url = base_url.rstrip("/") + "/chat/completions"
    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        ...
    }
    req = urllib.request.Request(
        url,
        ...
        headers={
            "Authorization": f"Bearer {api_key}",
            ...
            "HTTP-Referer": "https://github.com/alawein/alawein",
            "X-Title": "alawein-control-plane",
        },
```

CLI: `--route`, `--workflow`, `--model`, `--prompt`, `--stdin`,
`--list-routes`, `--execute-all`. No unit tests cover this module. Not
invoked from GitHub Actions.

### 2.2 GitHub Actions that invoke Claude (indirect)

Pinned action:
`anthropics/claude-code-action@f87768c6d25f92ae6efa7175e223ef77d4cbf97f`
(v1.0.166). Auth: `secrets.CLAUDE_CODE_OAUTH_TOKEN`.

| Workflow | Trigger | What it asks Claude |
| --- | --- | --- |
| `.github/workflows/claude-review.yml` | PR to `main`/`master` (skips `**/*.md` and `docs/**`) | Review bugs/security/reuse. One sticky comment. Do not approve or merge. |
| `.github/workflows/claude-review-backstop.yml` | cron + dispatch | Sweep flagged repos missing a review |
| `.github/workflows/claude-token-liveness.yml` | weekly / dispatch | Trivial "Reply ok" probe |

Review prompt excerpt:

```47:56:.github/workflows/claude-review.yml
          prompt: |
            Review this pull request for correctness bugs, security issues, and
            obvious reuse/simplification gaps. Be concise; report only
            high-confidence findings. Do NOT approve or merge. You MUST post
            exactly one comment before finishing, even when there are no
            findings ...
```

Post-run helper (no model call):
`scripts/github/claude-execution-diagnostics.py` fails CI if the action
swallowed `is_error`.

Fleet copy: `github-baseline.yaml` `claude_review: true` plus
`scripts/github/sync-github.sh`. Flagged repos on this baseline: `alawein`,
`design-system`, `workspace-tools`, `knowledge-base`, `attributa`, `bolts`,
`gymboy`, `llmworks`, `repz`, `scribd`, `incore`, `veyra`, `prompty`.

**Not an LLM:** `.github/workflows/ai-review.yml` runs
`scripts/doctrine/validate-prompt-kit.py` and posts a checklist. Label-gated
structure check only.

### 2.3 Prompt templates (paste surfaces, no API)

| Path | Version | Role |
| --- | --- | --- |
| `prompt-kits/AGENT.md` | 1.7.1 (canary; on `main` until #259 merges this is 1.7.0) | Workspace system prompt + Shared session block |
| `prompt-kits/PORTFOLIO.md` | 1.1.0 (ga) | `meshal-web` site persona |
| `prompt-kits/registry.yaml` | registry v1 | Kit inventory and rollout |
| `prompt-kits/KITS-CHANGELOG.md` | n/a | Kit history |
| `docs/governance/workspace-master-prompt.md` | 1.3.1 | Six rules R-1 through R-6 |
| `docs/governance/repo-sweep-prompt.md` | n/a | Per-repo sweep prompt |
| `docs/governance/claude-code-migration-prompts.md` | n/a | Claude Code superprompts |
| `docs/style/voice-unified.md` | generated | Voice text usable as a system prompt |
| `.github/ISSUE_TEMPLATE/prompt-change.yml` | n/a | Prompt-kit issue form |

Shared session header (kit 1.7.1 on the kit branch / this Cloud tree):

```152:174:prompt-kits/AGENT.md
SHARED SESSION PROMPT - Alawein / Kohyr - 2026-09-12 - kit AGENT.md 1.7.1
...
READ THE SAME FILES (in this order, then stop)
1. prompt-kits/AGENT.md (this prompt)
2. catalog/agent-integrations.yaml (your row + slack_channels)
3. docs/governance/slack-agent-runbook.md
4. docs/governance/slack-agent-voice.md
5. docs/governance/unified-agent-system.md (dispatch only)
6. Target repo AGENTS.md and SSOT.md
```

Paste that block **once** when the kit version changes. Do not @-all.

`registry.yaml` `test-suite: null` for every kit. There is no eval harness
for prompts in this repo. CI is structural (`validate-prompt-kit.py`).

### 2.4 Evals, metrics, sibling products

No eval runner, arena, or token-usage dashboard lives under `scripts/` or
`tests/`. Closest metrics: OpenRouter `max_tokens` / `temperature`, and
Claude Action error categories (auth, billing, rate_limit).

Sibling **catalog** rows (code not on this VM):

| Slug | About (from `catalog/index.yaml`) | Eval / training note |
| --- | --- | --- |
| `alembiq` | LLM training, alignment, evaluation, synthetic data | Canary after alawein for kit rollout |
| `llmworks` | LLM evaluation, benchmarking, security testing | `catalog/skills.yaml` llmops domain |
| `prompty` | Prompt design and evaluation workspaces | `claude_review: true` |
| `fallax` | LLM adversarial reasoning evaluation | Public P0 |
| `attributa` | AI detection, citation checks, CWE scans | Internal design mentions transformers |

Internal specs that describe those products (not implementations here):
`docs/internal/specs/2026-04-25-active-product-integrity-design.md`,
`docs/internal/specs/2026-04-23-active-products-audit.md`.

Run-envelope example records an observed model id (`grok-4.6`) for receipts:
`catalog/examples/run-envelope.example.yaml`. Checker:
`scripts/catalog/validate_run_envelope.py`.

## 3. Main documentation

Start at `docs/README.md`. Architecture context:

```15:19:docs/architecture.md
`alawein/alawein` is the governance control plane for the `@alawein` GitHub org.
It owns CI policy templates, canonical prompt kits, voice contracts, docs doctrine,
and the catalog registry that governs 44 repos. No product code lives here.
```

| Doc | Why it matters for AI/LLM |
| --- | --- |
| `README.md` | Generated public profile. Portfolio blurbs for alembiq/llmworks/fallax. |
| `SSOT.md` | Current kit version, inventory pointer, Claude platform path. |
| `AGENTS.md` / `CLAUDE.md` | Repo contracts for agents. |
| `docs/governance/unified-agent-system.md` v1.5.1 | Inventory + dispatch. |
| `docs/governance/slack-agent-runbook.md` v1.5.2 | How to call Slack agents. |
| `docs/governance/slack-agent-voice.md` v1.1.2 | Thread voice. |
| `docs/governance/control-plane.md` v1.0.0 | Admission/envelopes. Not an orchestrator. |
| `docs/governance/operating-model.md` v1.3.0 | Executor / reviewer rotation. |
| `docs/governance/claude-code-configuration-guide.md` | Claude Code setup. |
| `docs/governance/claude-code-worked-examples.md` | Worked `.claude/` examples. |
| `docs/governance/cursor-mcp-repair.md` | Desktop vs Cloud MCP. |
| `docs/governance/claude-tag-migration.md` | Legacy Slack Claude to Tag. |
| `docs/governance/prompt-rollout.md` | Kit canary order. |
| `docs/governance/slash-commands-catalog.md` | Claude Code slash list. |
| `docs/governance/maintenance-skills-agents.md` | Skill layers. |
| `docs/operations/system-inventory.md` | How to record a public-safe review. Not a second roster. |
| `docs/operations/access-coverage.md` | Connector vs demonstrated access. |
| `docs/internal/audits/2026-09-05-slack-integrations-rescan.md` | Prior Slack/MCP scan. |
| `docs/internal/audits/2026-09-06-slack-integrations-rescan.md` | Prior Slack/MCP scan. |
| `docs/internal/audits/2026-09-12-integrations-rescan.md` | On PR #257. Live 03:30 UTC rescan. |
| `docs/internal/practices-handbook.md` | Observed coding/docs/prompt practices. |

## 4. Rules, personas, agents, and workflows

### 4.1 Global rules

| Surface | What it binds |
| --- | --- |
| `AGENTS.md` | Control-plane boundaries, ask-first, validators. |
| `CLAUDE.md` | Same plus `claude-agent-platform/` sync. |
| `SSOT.md` | Current decisions. |
| `docs/governance/workspace-master-prompt.md` | R-1 single SSOT, R-2 scope, R-3 observable, R-4 reject with evidence, R-5 sync, R-6 batch contract. |
| `.cursor/rules/alawein-governance.mdc` | Always-on Cursor rule. |
| `.cursor/rules/slack-agent-voice.mdc` | Slack voice pointer. |
| `.cursor/rules/claude-code-governance.mdc` | Claude Code layout. |
| `.claude/settings.json` | Hooks: `scope-binding-check.py` (warn-only), `observability-log.sh`, `drift-detection.sh`. |

Operating-model rotation (`docs/governance/operating-model.md`):

| Change | Executor | Independent reviewer | Final approver |
| --- | --- | --- | --- |
| A | Claude Code | Cursor | Meshal |
| B | Cursor | ChatGPT | Meshal |
| C | ChatGPT | Claude Code | Meshal |

Meshal is the sole maintainer. Agents do not squash-merge. Cloud merge is
403. Meshal clicks squash-merge.

### 4.2 Personas

- **Workspace persona:** `prompt-kits/AGENT.md` 1.7.1. Staff engineer, not a
  general assistant. Hard constraints include no AI attribution, no AGI
  import, no secrets.
- **Portfolio persona:** `prompt-kits/PORTFOLIO.md` 1.1.0 for `meshal-web`.
- **Slack voice persona:** `docs/governance/slack-agent-voice.md`. Teammate
  English. No em dash. No status-dump walls. Canvas for tables.
- **Claude Code global persona:** `claude-agent-platform/global/CLAUDE.md`
  v1.0.0. Orchestrator-first for compound work.

### 4.3 Claude Code agent implementations

Synced to `~/.claude/` by `claude-agent-platform/sync-to-home.sh`.

| File | `name` | Role |
| --- | --- | --- |
| `claude-agent-platform/agents/orchestrator.md` | orchestrator | Route/decompose. `permissionMode: plan`. Does not write code. |
| `claude-agent-platform/agents/codex.md` | codex | Generate / scaffold |
| `claude-agent-platform/agents/cursor.md` | cursor | Surgical edits |
| `claude-agent-platform/agents/research.md` | research | Lookup |
| `claude-agent-platform/agents/reviewer.md` | reviewer | Review / audit |
| `claude-agent-platform/agents/extender.md` | extender | Local `.claude/` proposals |
| `claude-agent-platform/agents/security-reviewer.md` | (file) | Security checklist |
| `claude-agent-platform/agents/pr-prep.md` | (file) | PR draft steps |
| `claude-agent-platform/agents/refactor-scout.md` | (file) | Refactor assessment |

```1:13:claude-agent-platform/agents/orchestrator.md
---
name: orchestrator
description: Routes ambiguous or compound development requests, decomposes work, assigns agents, and enforces approval gates.
tools: Agent, Read, Glob, Grep, Bash
model: inherit
permissionMode: plan
---
# Orchestrator Agent
You are the Orchestrator. You do not write code. You plan, route, coordinate...
```

Repo-local skills (this repo, not the home platform):
`.claude/skills/voice-check/SKILL.md`,
`.claude/skills/slack-draft-to-prompt/SKILL.md`.

Home platform skills (`claude-agent-platform/skills/`): api-docs, arch-review,
audit, branch, changelog, commit, coverage-plan, debug-instrument, dep-graph,
deploy-to-vercel, deps, docs, docs-gen, edit, extend, fix, generate,
implement, lint-check, lookup, migrate, patterns, pr, profile, readme,
refactor, release-notes, rename, review, rollback, scaffold, secrets-scan,
security-scan, slack-draft-to-prompt, test-fix, test-gen, test-run,
threat-model, validate, vercel-cli-with-tokens, workflow, plus bundled Vercel
rule packs. Index: `claude-agent-platform/skills/registry.json`. Drift check:
`python scripts/catalog/build-skill-registry.py --check`.

### 4.4 Multi-step workflows and orchestration

**Claude Code YAML** (`claude-agent-platform/workflows/`):

| File | Chain |
| --- | --- |
| `pr-ready.workflow.yaml` v1.0.0 | lint -> test -> review -> security -> changelog -> commit -> PR draft |
| `new-feature.workflow.yaml` v1.0.0 | research -> scaffold -> implement -> test-gen -> docs -> review -> nested pr-ready |
| `bug-fix.workflow.yaml` v1.0.0 | reproduce -> root-cause -> fix -> regression-test -> verify -> review -> changelog -> commit |

```13:36:claude-agent-platform/workflows/pr-ready.workflow.yaml
steps:
  - id: lint
    skill: lint-check
    agent: Reviewer
  ...
  - id: security
    skill: security-scan
    agent: Reviewer
    depends_on: [review]
    on_failure: halt-on-critical
```

Invoker: `claude-agent-platform/skills/workflow/SKILL.md`.

**OpenRouter named workflows:** `config/model-routing.yaml` `workflows:`
(plan or `--execute-all`).

**Human-tagged Slack dispatch:** `unified-agent-system.md` section 5. Agents
do not invoke each other. Meshal tags the next agent.

**Fleet batches:** `docs/governance/parallel-batch-execution.md`. Executor is
`workspace-tools` / `workspace-batch` (sibling repo, not checked out). Stages:
`discover -> preflight -> mutate -> validate -> package -> publish -> summarize`.

**Control plane:** `docs/governance/control-plane.md` is admission and
receipts, not an orchestration platform.

**Cursor Cloud:** this run. No in-repo orchestrator code beyond governance.

## 5. Gaps (do not invent)

- Sibling product LLM code is not on this VM.
- Desktop Cursor MCP and desktop Claude Code live state: UNVERIFIED.
- Workflow-bot LLM backends: unknown.
- Codex Slack Connect: still `needs_auth`.
- Supermemory: error. Policy: do not re-auth.
- Treg paid calls: not re-proved this afternoon.
- `#me-agents-eng` / `#me-agents-ops` reads: blocked.
- Kilo GitHub App repos: 404 / 422 from this token.
- AGI / `Desktop/AGI`: quarantine. Do not scan.
- Windows Downloads and desktop Composer titles: GAP.

## 6. How to re-verify

```bash
python3 scripts/catalog/validate-agent-integrations.py --strict
python3 scripts/doctrine/validate-prompt-kit.py --check
python3 scripts/catalog/build-skill-registry.py --check
python3 scripts/ops/openrouter_route.py --list-routes
```

Live Cloud MCP: `GetDynamicTools` with no filter. Slack lanes: Cursor Slack
Tools `list_slack_channels` plus one scoped read. Do not create a second
inventory YAML or Canvas SSOT.

## Change evidence

| Field | Recorded value |
| --- | --- |
| Work item | Slack DM: complete AI/LLM infrastructure inventory |
| Work kind | docs |
| Accountable maintainer | Meshal Alawein |
| Actual commit author | Meshal Alawein `contact@meshal.ai` |
| Executor | Cursor Cloud `bc-e551b6c1` |
| Independent reviewer | not performed this turn |
| Checks | file-level scan of catalog, workflows, kits, OpenRouter, Claude platform; no secret values |
| Other audits | PR #257 is the live MCP/YAML land; this file is the onboarding map |
| Final approval | pending Meshal |
