---
type: audit
status: draft
last_updated: 2026-09-12
owner: meshal
---

# Grok bots and peer IDE/LLM tools (2026-09-12)

Companion to
[`2026-09-12-ai-llm-infrastructure.md`](2026-09-12-ai-llm-infrastructure.md).
That file maps **this control plane**. This file answers whether that map
covers Grok Bot, Grok Slack, Grok CLI, and comparable tools in other IDEs
and LLMs.

Cloud Agent run `bc-e551b6c1-7140-5978-98bb-cc95f9f8c8c3`. Slack team
`T0APHHXJV4J`. Account canon `contact@meshal.ai`.

**Writer boundary:** report only. Do not install a Slack Grok app. Do not
write Name, Label, Description, routines, or memory on any Grok Bot
profile. Laptop SoR stays
`Desktop/ops-shared-inventory/` (absent on this VM).

## Verdict

**No.** The AI/LLM inventory does not cover this layer.

It recorded three Grok facts and stopped:

1. This Cloud run model is `cursor-grok-4.6-high-fast` (Cursor lane LLM).
2. There is no `@Grok` Slack user. Policy: do not install one
   (`prompt-kits/AGENT.md` HARD NEVER).
3. Windows Grok / MAIOS is laptop-only and UNVERIFIED from Cloud.

It did **not** enumerate the Windows Grok Bot fleet, official xAI products,
or peer IDE/LLM tools. That is this report.

Live Slack user search this turn: **Grok 0**, **Hermes 0**, **OpenClaw 0**.

## 1. What exists *here* (proved vs GAP)

### 1.1 Three different things named Grok

| Name | What it actually is | Where | Status this VM |
| --- | --- | --- | --- |
| Cursor Cloud model | `cursor-grok-4.6-high-fast` | this run | live |
| Run-envelope example | `model: grok-4.6` | `catalog/examples/run-envelope.example.yaml` | example only |
| Windows Grok Bot / MAIOS | Personal bot fleet (Intake, Policy, Cleanup, ...) | `Desktop/ops-shared-inventory/*.yaml` | **GAP** (no Windows mount) |
| `@Grok` Slack app | Official [Grok for Slack](https://slack.hooks.x.ai/) | Alawein Workspace | **not installed** (user search 0) |
| `alawein/ops-control-plane-grok` | Kilo GitHub App repo, freeze candidate | Kilo lane | unread from this token (404) |
| Grok CLI / Grok Build | Official xAI coding agent | laptop `~/.grok/` | UNVERIFIED |

Do not collapse these. Cursor-Grok-as-LLM is not a Slack bot. Kilo's
`ops-control-plane-grok` repo is not Windows MAIOS SoR.

### 1.2 Slack bots and users (this workspace)

Re-proved 2026-09-12 via Slack user search and catalog.

| Entity | Slack ID | Installed? | Notes |
| --- | --- | --- | --- |
| Cursor | `U0APW2Z3GG2` | yes | Only live reply lane |
| Claude | `U0AQQFJT8AC` | yes | Legacy Slack. Tag pending |
| Computer | `U0APW7F9S4A` | yes | Perplexity |
| Codex | `U0BV7V8M3NW` | yes | `needs_auth` |
| ChatGPT | `U0BUNH33CCA` | installed, replaced | Do not dispatch |
| Notion AI | `U0AQ8UNAKTK` | yes | Notion path is MCP |
| GitHub | `U0APESWEF2T` | yes | PR mirror |
| Kilo | `U0BV9U2GFED` | yes | 3-repo GitHub App |
| **Grok** | none | **no** | Do not install |
| **Hermes** | none | **no** | Hold until a new human decision |
| **OpenClaw** | none | **no** | Same hold |

Public Slack hits after 2026-08-01 that mention Grok are Meshal's MAIOS
coordination note in `#me-agents-ops` (Grok paste packets to Intake then
Policy then Cleanup) and inventory threads. Not a Grok Slack bot posting.

### 1.3 Windows Grok Bot / MAIOS fleet (catalog snapshot, not live)

Source of the snapshot: `catalog/generated/skills-drift.json`, produced
2026-09-08 from
`C:\Users\mesha\Desktop\ops-shared-inventory\{agents,workflows,routines}.yaml`.
Mapping: `docs/internal/kernel-skills-drift-mapping-2026-09-08.md`.
Zero identifier overlap with `catalog/agent-integrations.yaml`. Expected.

**Do not treat this JSON as live.** The YAML is on the laptop. This VM
cannot re-read it.

#### Agent surfaces (`agents.yaml` `ui_name`)

Cleanup, Clip Bot, Fleet Ops Auditor, Handoff Integrator, Intake, Policy,
Product Idea Stress Test, Site Audit, Video Edit Desk.

Scheme A names (Intake, Policy, Cleanup, Editorial) are the current UI
set. Atlas, Alfred, Housekeeper are historical aliases
(`.cursor/rules.md`).

#### Bot skills (flattened)

`agent-handoff-status-discipline`, `anti-slop-pass`,
`audit-repair-govern`, `build-the-voice-profile`,
`captions-and-transcript`, `clip-captions-and-post-copy`,
`clip-pack-from-one-recording`, `cut-a-clip`, `declutter-housekeeping`,
`draft-for-a-channel`, `edit-a-draft`, `find-the-clippable-moments`,
`footage-intake`, `forge-ephemeral-worker-plan`, `getting-started`,
`grok-cli-research-pass`, `openrouter-expert-panel`,
`opportunity-screen`, `ops-dual-writer-check`,
`permission-delta-approval`, `pist-evidence-investigator`,
`pist-experiment-designer`, `pist-method-codifier`, `pist-methodology`,
`pr-hygiene-digest`, `public-share-security-audit`, `rewrite-a-draft`,
`short-clips-from-a-long-video`, `site-audit`, `transcribe-a-recording`.

#### Workflows / routines

`agent-os-control-plane`, `alfred-monthly-portfolio`, `alfred-quarterly`,
`alfred-weekly-review`, `friday-pr-hygiene`, `integrator-hide`,
`integrator-sunset-hide-reminder`, `midweek-temp-and-scratch-sweep`,
`mon-sole-writer-proof`, `monday-sole-writer-proof`,
`morning-brief-auditor`, `observation-sep-8-19`, `private-pack-publish`,
`weekday-brief-observation`, `weekday-morning-brief`,
`weekly-desktop-downloads-declutter`.

Human brand is **MAIOS**. Wire IDs stay `mai.*`. Dashboard catalog row:
`lab/maios-dashboard` (`https://maios-dashboard.vercel.app`). Not checked
out here.

### 1.4 Related git / team entities

| Entity | Role | This token |
| --- | --- | --- |
| `alawein/alawein` | control plane | live |
| `alawein/ai-ops` | catalog platform lane | not checked out |
| `alawein/ops-control-plane-grok` | Kilo freeze candidate | 404 |
| `alawein/workspace-brain` | Kilo Linux mirror / backup | unread |
| `alawein/maios-dashboard` | MAIOS dashboard | not checked out |
| `alawein/android-coding-phone` | phone restore kit | not checked out |
| SpaceXAI / xAI | Grok vendor | public docs only |
| Kohyr / Cache Me Outside LLC | company | n/a |
| Meshal Alawein `U0APM5W630C` | sole maintainer | n/a |

## 2. Official Grok / xAI surfaces (external)

Cited from live fetches and search on 2026-09-12. Not installed here.

| Surface | URL | What it is | Alawein status |
| --- | --- | --- | --- |
| Grok Bot product | [x.ai/bot](https://x.ai/bot) | Desktop/iOS AI teammates with their own computer, routines, plugins. Early beta. Bundled with eligible Cursor / SuperGrok / Teams plans. | Laptop GAP |
| Grok for Slack | [slack.hooks.x.ai](https://slack.hooks.x.ai/) | Official Slack app. BYO xAI API key from console.x.ai. | **Do not install** |
| Grok Build / CLI | [docs.x.ai/build/overview](https://docs.x.ai/build/overview) | Coding agent TUI. `curl -fsSL https://x.ai/cli/install.sh \| bash`. Auth via browser or `XAI_API_KEY`. | UNVERIFIED on Windows |
| Headless / ACP | [docs.x.ai/build/cli/headless-scripting](https://docs.x.ai/build/cli/headless-scripting) | `grok -p` and `grok agent stdio` for scripts and IDE hosts | not wired in this repo |
| MCP in Grok | [docs.x.ai/build/features/mcp-servers](https://docs.x.ai/build/features/mcp-servers) | `grok mcp add`. Also reads `~/.claude.json`, `.cursor/mcp.json`, `.mcp.json` | not in git |
| Skills / plugins | [docs.x.ai/build/features/skills-plugins-marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces) | Claude Code compatible. Reads `CLAUDE.md` and `AGENTS.md` | n/a |
| API | [docs.x.ai/overview](https://docs.x.ai/overview) | Responses API at `https://api.x.ai/v1`. OpenAI-compatible client. Models include grok-4.5 / grok-4.6 / Grok Build | no `XAI_API_KEY` in this repo |
| REST catalog | [api.x.ai/docs](https://api.x.ai/docs/) | `/v1/chat/completions`, `/v1/responses`, `/v1/messages` | n/a |
| Plugin marketplace | [github.com/xai-org/plugin-marketplace](https://github.com/xai-org/plugin-marketplace) | Official Grok Build plugin index. Slack plugin added 2026-05-18 ([commit a68668f](https://github.com/xai-org/plugin-marketplace/commit/a68668fdf7d18172ae34b4c3a69631843739b636)) | not consumed |

Template-marketplace coverage (secondary write-up, not xAI first-party):
Grok Bot early beta 2026-08-11; template marketplace 2026-08-28
([Basenor summary](https://www.basenor.com/blogs/news/grok-bot-template-marketplace-everything-you-need-to-know)).
Treat dates as vendor-blog UNVERIFIED unless x.ai confirms.

## 3. Comparable tools in other IDEs and LLMs

### 3.1 Present in this workspace (declared or live)

| Tool | Surface here | Auth | Peer class |
| --- | --- | --- | --- |
| Cursor Cloud / IDE | Slack + this run | Cursor subscription | AI-first IDE |
| Claude Code | `claude-agent-platform/` -> `~/.claude/` | Anthropic login | Terminal agent |
| Claude Slack | `@Claude` | Slack connect | Chat bot |
| ChatGPT Slack | installed, replaced | n/a | Chat bot |
| Codex Slack | `@Codex` needs_auth | ChatGPT Codex connect | CLI/cloud agent |
| Computer / Perplexity | `@Computer` | Perplexity session | Browser agent |
| Notion AI | Slack + Notion MCP | `contact@meshal.ai` | Workspace AI |
| GitHub Copilot review | `.github/rulesets/main-protection.json` | GitHub | IDE/PR review |
| Kilo | Slack + 3-repo GitHub App | Kilo | Cloud agent (narrow) |
| OpenRouter CLI | `scripts/ops/openrouter_route.py` | `OPENROUTER_API_KEY` | Model router |
| Claude GHA | `anthropics/claude-code-action` | `CLAUDE_CODE_OAUTH_TOKEN` | CI reviewer |

Windows home mirrors named in `.cursor/rules.md` and **not** on this VM:
`~/.cursor/rules/agents-md-global.mdc`, `~/AGENTS.md`, `~/.codex/AGENTS.md`.
ADR `docs/adr/0006-worktree-fanout-substrate.md` also names Kilo Agent
Manager and `~/.codex/worktrees`.

### 3.2 Not present here (peer landscape)

Official or widely used coding agents that do **not** appear as an Alawein
Slack bot, catalog agent, or in-repo wrapper. Comparison write-ups:
[ZTABS 2026 IDE comparison](https://ztabs.co/blog/cursor-vs-github-copilot-vs-windsurf),
[jobsbyculture 2026 agent list](https://jobsbyculture.com/blog/ai-coding-agents-compared-2026),
[DevTools Review matrix](https://devtoolsreview.com/compare/).

| Tool | Typical surface | Why listed | Alawein |
| --- | --- | --- | --- |
| Windsurf / Devin Desktop | VS Code fork (Cognition) | Peer IDE agent | absent |
| Cline | VS Code, BYOK | Open-source agent | absent |
| Aider | git-native CLI | Terminal peer | absent |
| Devin | cloud ticket-to-PR | Autonomous cloud peer | absent |
| Gemini CLI | Google terminal agent | LLM vendor CLI | absent |
| Amazon Q Developer | AWS IDE plugin | Enterprise peer | absent |
| JetBrains AI | JetBrains IDEs | Desktop IDE peer | absent |
| Zed / Cody / Tabnine | editors / autocomplete | Completions peers | absent |
| Continue | VS Code/JetBrains OSS | Local peer | absent |
| Lovable | MCP `needs_auth` | App builder; connector only | not an IDE agent here |

Do not install these to "complete" the inventory. Policy already holds
Hermes, OpenClaw, and extra chat apps.

## 4. Teams and notable posts (external)

| Who | What | Link |
| --- | --- | --- |
| xAI | Grok Bot launch / product | [x.ai/bot](https://x.ai/bot) ("The SpaceXAI team runs on Grok Bot") |
| xAI | Official Slack install | [slack.hooks.x.ai](https://slack.hooks.x.ai/) |
| xAI | Grok Build + CLI | [docs.x.ai/build/overview](https://docs.x.ai/build/overview) |
| xAI org | Plugin marketplace | [xai-org/plugin-marketplace](https://github.com/xai-org/plugin-marketplace) |
| ykeremy (xAI) | Added Slack/Sentry/Chrome DevTools plugins, 2026-05-18 | [commit a68668f](https://github.com/xai-org/plugin-marketplace/commit/a68668fdf7d18172ae34b4c3a69631843739b636) |
| Slack | Slash-command AI assistant pattern | [docs.slack.dev slash commands](https://docs.slack.dev/interactivity/implementing-slash-commands) |

Meshal's own Grok-facing packets stay on Desktop / `#me-agents-ops`
(`GROK-PASTE-PACKETS-2026-09-09.md`). Slack is a pointer, not SoR.

## 5. Gaps

- `Desktop/ops-shared-inventory/` live YAML: **proved** 2026-09-12 via
  paired `alawein-cloud-v1` fences (Cursor + Intake). See
  [`2026-09-12-handshake-reconciliation.md`](2026-09-12-handshake-reconciliation.md).
- `START_HERE.yaml`: absent. `START_HERE.md`: present.
- `~/.grok/` CLI install: **absent** on Meshal PC (proved).
- New Bot `a6456c7d` live on box, absent from `agents.yaml`. Exact no
  2026-09-12: leave ephemeral. Do not add the row.
- Cursor desktop Grok Bot download: UNVERIFIED
- `ops-control-plane-grok` / `workspace-brain` contents: unread
- Official Slack Grok app: deliberately absent
- Treg had no news endpoint match for this query

## 6. How this relates to the first inventory

Keep one SSOT: `catalog/agent-integrations.yaml` for Slack/Cloud agents.
Keep one laptop SoR: `Desktop/ops-shared-inventory/` for Grok Bot / MAIOS.
`skills-drift.json` is the only approved bridge, report-only.

Do not add a `grok-slack` row unless Meshal installs the official app.
Do not create a second inventory YAML or Canvas SSOT.

## Sources

- [xAI docs overview](https://docs.x.ai/overview)
- [xAI REST API](https://api.x.ai/docs/)
- [Generate text / Responses API](https://docs.x.ai/developers/model-capabilities/text/generate-text)
- [Grok Build overview](https://docs.x.ai/build/overview)
- [Grok headless / ACP](https://docs.x.ai/build/cli/headless-scripting)
- [Grok settings](https://docs.x.ai/build/settings)
- [Grok MCP servers](https://docs.x.ai/build/features/mcp-servers)
- [Grok skills and plugins](https://docs.x.ai/build/features/skills-plugins-marketplaces)
- [Grok Bot product](https://x.ai/bot)
- [Grok for Slack](https://slack.hooks.x.ai/)
- [xAI plugin marketplace](https://github.com/xai-org/plugin-marketplace)
- [Marketplace Slack plugin commit](https://github.com/xai-org/plugin-marketplace/commit/a68668fdf7d18172ae34b4c3a69631843739b636)
- [Grok Bot template marketplace write-up](https://www.basenor.com/blogs/news/grok-bot-template-marketplace-everything-you-need-to-know)
- [Slack slash commands](https://docs.slack.dev/interactivity/implementing-slash-commands)
- [ZTABS IDE comparison 2026](https://ztabs.co/blog/cursor-vs-github-copilot-vs-windsurf)
- [AI coding agents 2026](https://jobsbyculture.com/blog/ai-coding-agents-compared-2026)
- [DevTools Review comparison](https://devtoolsreview.com/compare/)
- [DevTools Review pricing](https://devtoolsreview.com/pricing/ai-coding-tools-pricing-comparison/)
- [Developers Digest pricing 2026](https://www.developersdigest.tech/blog/ai-coding-tools-pricing-2026)
- In-repo: `catalog/generated/skills-drift.json`,
  `docs/internal/kernel-skills-drift-mapping-2026-09-08.md`,
  `prompt-kits/AGENT.md`, `catalog/agent-integrations.yaml`

## Change evidence

| Field | Recorded value |
| --- | --- |
| Work item | Slack DM: Grok bots and peer IDE/LLM coverage |
| Work kind | docs |
| Accountable maintainer | Meshal Alawein |
| Executor | Cursor Cloud `bc-e551b6c1` |
| Independent reviewer | not performed this turn |
| Checks | Slack user search Grok/Hermes/OpenClaw = 0; catalog + skills-drift read; public xAI docs fetched |
| Other audits | Companion to `2026-09-12-ai-llm-infrastructure.md` |
| Final approval | pending Meshal |
