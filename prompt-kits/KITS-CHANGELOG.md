---
type: canonical
source: alawein
sla: on-change
last_updated: 2026-09-13
audience: [agents, contributors]
---

# Prompt Kit Changelog

All behavioral changes to canonical prompt kits are logged here. Use semantic
versioning: patch for wording only, minor for new constraints or sections,
major for breaking behavioral changes.

---

## AGENT.md

### 1.8.1 - 2026-09-13

- Cite laptop SoR as Desktop `RESPONSE-STYLE.md` **rev e** (was rev d).
- Patch only: reply adapter labels and Git canon version bump to 1.8.1.
- No behavior change to RICH / CLI / SLACK adapters beyond the SoR rev pointer.

### 1.8.0 - 2026-09-13

- Reply style adapters: RICH (Cursor / ChatGPT / Claude / Grok Bot chat),
  CLI (Codex CLI / terminal), SLACK (existing thread voice)
- ChatGPT Custom Instructions short paste (1500-character cap)
- Exact-yes mutate gate and Scheme A role boundary in the shared paste
- Keeps 1.7.1 teammate Slack voice: plain English, no status-dump walls,
  no em dash. Paste once per surface. Do not @-all.

### 1.7.1 - 2026-09-12

- Slack voice: write like a teammate. Short complete sentences. No
  status-dump walls. Labeled fields only when they help scan.
- Repeat the em dash ban in the shared paste (U+2014). Use a hyphen,
  colon, or line break. Paste this block once when the kit version
  changes. Do not @-all.

### 1.7.0 - 2026-09-07

- One catalog land: search open PRs before editing `AGENT.md` or
  `catalog/agent-integrations.yaml`; report Mismatch and stop if a land
  PR is already open. Do not hardcode a PR number in the paste block.
- Do not nominate a land PR unless you opened the files on that branch
- Lane reply limits: Claude 4 lines; Computer ack then wait; Kilo 3
  repos; Codex/ChatGPT/Notion/GitHub one line or silent
- Meshal tags the next agent; agents do not @ each other to start work
- One Windows path line in the shared prompt: `Desktop/GitHub/alawein`
  workspace, `core/alawein` control plane

### 1.6.0 - 2026-09-07

- Added Shared session prompt: one paste block for Slack bots, Cloud
  sessions, Claude Code, Codex, Computer, Kilo, and Notion AI
- Agents read the same six files, stay in named lanes, and patch
  existing canon instead of creating a second instruction surface

### 1.5.2 - 2026-09-07

- Added employer isolation: do not import, copy, commit, summarize, or operate
  on AGI Inc, `theagi.company`, or AGI-named cloud workspaces. Local quarantine
  is `Desktop/AGI` outside `Desktop/GitHub/alawein`.

### 1.5.1 - 2026-09-07

- Preserve execution and review evidence from 1.5.0 with the session guidance from 1.4.3
- Retain canonical rule pointers and remove nonexistent registry test pointers
- Keep the combined revision at canary under the existing rollout protocol

### 1.5.0 - 2026-09-07

- Record actual execution and review roles in task, PR, or batch evidence
- Keep attribution out of commit messages, code comments, and product prose
- Keep this revision at canary under the existing rollout protocol

### 1.4.3 - 2026-09-07

- Preserve session orientation, governance reads, and one-goal completion criteria
- Keep complex-task scoping and repository verification in the canonical prompt
- Remove registry pointers to test suites that do not exist
- Keep this revision at canary until the existing rollout gates pass

### 1.4.2 - 2026-09-06

- Point to `docs/governance/workspace-master-prompt.md` for R-1 through R-6
- Keep portfolio inventory in `catalog/index.yaml`, not in prompt prose
- Keep this revision at canary until the existing rollout gates pass

### 1.4.1 - 2026-09-04

- Correct bucketed workspace paths and resolve sibling repositories through catalog local_path
- Record the revision introduced by commit `491eb119`

### 1.4.0 - 2026-04-30

- Added sentence rhythm rule: medium sentences (12–20 words) carry claims; short sentences (5–8 words) close sequences
- Added fragment prohibition: short sentences are complete sentences, never fragments
- Added colon preference: colons connect cause to effect; em dashes are not used (use commas, parentheses, or sentence breaks)
- Added em dash prohibition: em dashes are not used on governed surfaces; any em dash is a blocking voice-check finding

### 1.3.0 - 2026-04-30

- Added version, parent-version, change-summary, downstream-consumers frontmatter fields
- Aligned with LLMOps versioning system; no behavioral changes

### 1.2.0 - 2026-03-15

- Added canary rollout order: `alawein → meshal-web → workspace-tools → alembiq → rest`
- Formalized operating mode section (clear / ambiguous / disagree)

### 1.1.0 - 2026-01-10

- Added mathematical writing section for research repos
- Tightened forbidden register: removed "exceptional" from advisory to blocked

### 1.0.0 - 2025-11-01

- Initial canonical workspace agent prompt

---

## PORTFOLIO.md

### 1.1.0 - 2026-04-30

- Added version, parent-version, downstream-consumers frontmatter fields
- Aligned with LLMOps versioning system; no behavioral changes

### 1.0.0 - 2026-02-01

- Initial canonical portfolio site prompt

---

## workspace-master-prompt.md

### 1.3.1 - 2026-09-07

- Retain the exact-file-and-line requirement for refusal evidence
- Keep the existing canary and staged rollout gates

### 1.3.0 - 2026-09-06

- Keep R-1 through R-6 as the operating contract
- Move portfolio inventory to `catalog/index.yaml`
- Point session workflow and style rules at `prompt-kits/AGENT.md`
- Preserve project requirements in the existing directive mapping
- Name the separate catalog and public profile generation paths
- Keep this revision at canary until the existing rollout gates pass

### 1.2.0 - 2026-03-20

- Added R-6 Batch Contract rule (manifest-driven multi-repo execution)
- Added phased migration semantics (canonical-name notation)

### 1.1.0 - 2026-02-15

- Added R-5 Sync or It Didn't Happen rule

### 1.0.0 - 2026-01-01

- Initial workspace operating contract
