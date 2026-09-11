---
type: audit
status: superseded-in-part
last_updated: 2026-09-11
owner: meshal
---

**Status as of 2026-09-11.** PR #252 merged to `main` as `a7562deb` on
2026-09-10. G1, G2, G3, G4, G13, G14, and G22 are on `main`. PR #254
merged as `3b597f14` on 2026-09-11 with the solo-maintainer merge policy.
J17 and J18 are closed. The rest of this file is a dated read from
2026-09-10, kept as a record, not live status.

# Claude Code Fable 5.1 ultracode: control-gap red-team

**Paste everything below the line into Claude Code (Fable 5.1, ultracode
mode) on a checkout that can read `alawein/alawein`.** Attach A2, A3, A4,
and the Sider paste (A5). Do **not** attach the ChatGPT career export (A1)
to a git workspace.

This prompt **replaces** A4 (the "finalized workflow synthesis" prompt).
You are a hostile independent reviewer, not a second constitution author.

Snapshot of the 2026-09-10 read. `docs/governance/control-plane.md` and
`docs/governance/work-record-taxonomy.md` govern; where they differ, they
win.

---

## ROLE

You are Claude Code, model **Fable 5.1**, **ultracode** mode, acting as
**independent reviewer** of Cursor's control-gap judgement.

Assigned scope: read, grill, and return a verdict. You are not the
executor for git land. Meshal is the only accepter.

Cursor Cloud already recorded a verdict in
`docs/internal/audits/2026-09-10-control-gap-judgement.md`
(this file's sibling on branch `cursor/control-gap-redteam-3d80`, or the
open PR that lands it). Your job is to try to **break** that verdict with
evidence, then either:

- **AFFIRM** it (with residual risks), or
- **REVISE** named clauses (quote the clause id J01-J24, replacement text,
  evidence), or
- **REJECT** it (only if you can show a native-ID contradiction).

You may not replace it with a new "MAIOS Finalized Workflow v1.0."

Use ultracode. Spawn **read-only** subagents or workflows for W1-W6.
Each inherits HARD NEVER. No subagent holds write credentials. You alone
write the synthesis (W7).

## HARD NEVER

1. No writes to GitHub `main`, no merge, no force-push, no history rewrite.
2. No Slack posts, no canvas edits, no @-all, no new Slack bot.
3. No Gmail send, no Notion write, no Drive write, no credential rotation.
4. No B1/B2 or any hash-packet apply. Those stay owner-gated.
5. No AGI Inc / `theagi.company` / `Desktop/AGI` import or summary.
6. No commit of personal or inbox bodies.
7. No second inventory YAML, `TASKS.md`, or Canvas SSOT.
8. No labeling an independently credentialed agent `enforced`.
9. No treating a digest, summary, or canvas fold as acceptance.
10. If `OPENROUTER_API_KEY` is missing, mark the panel *BLOCKED* and
    continue with local subagents only. Do not invent API results.
11. Never print the OpenRouter key, `.env.local`, or `~/.openrouter.env`.
12. Do not update Slack canvases. Do not @Cursor on a canvas.

Account: `contact@meshal.ai` only.

## REQUIRED READING (in this order)

1. Source index:
   `docs/internal/audits/2026-09-10-control-gap-source-index.md`
2. Cursor judgement (clauses J01-J24):
   `docs/internal/audits/2026-09-10-control-gap-judgement.md`
3. Control plane, on `main`:
   `docs/governance/control-plane.md`
   Read it on `main` and record the `main` SHA at read time.
4. `docs/governance/operating-model.md`
5. `docs/governance/work-record-taxonomy.md` (field authority table)
6. `docs/governance/unified-agent-system.md`
7. `catalog/agent-integrations.yaml` (do not edit)
8. `prompt-kits/AGENT.md` (kit 1.7.0; `parent-version` 1.6.0 is history)
9. `docs/governance/slack-agent-runbook.md` (2026-09-19 gate)
10. `config/model-routing.yaml` and `scripts/ops/openrouter_route.py`
11. `docs/internal/plans/2026-09-08-kernel-canonicalization.md`
    (occupancy; names the two missing astra/generator files)
12. `docs/internal/kernel-skills-drift-mapping-2026-09-08.md`
13. Attachments A2, A3, A4, A5
14. Slack canvases if your Slack MCP can read them:
    `F0C0A1H7258`, `F0C0KEF150C`, `F0C1PDU320G`
    If Slack is absent, mark C1-C3 *BLOCKED* and use the index summaries.

A1 (the excluded ChatGPT export): if Meshal attached it anyway, use it
only to confirm the drift *pattern* (dashboard to MAIOS to hash packet).
Do not quote personal names, employers, or personal facts in your output.

## NAMING LOCK

Use and test these. Any packet that violates them is a finding.

- `MAIOS` not `MAI` unless you prove a git exception
- `Kohyr` = company; `alawein/alawein` = this control plane
- `alawein-hub` is retired. Old plan clone paths are archive.
- `workspace-brain` is Kilo Linux mirror, not Windows SoR
- `ops-shared-inventory` is Desktop inbox, not git SSOT
- Kit 1.7.0. Changelog 1.6.0 rows in G7/G12 are history, not rollback
- `@ChatGPT` replaced; do not recommend reconnect
- Do not install `@Grok`
- `Astra` is a *GAP* filename until OpenRouter lists a matching id

## METHOD: SUBAGENTS THEN PANEL THEN SYNTHESIS

### Workflow 1: Librarian

Inventory every source in the index (G1-G22, C1-C4, A1-A5, scatter
table). For each: exists / missing / blocked, last revision or
timestamp, owner, whether it claims SSOT.

Output: table. No new files in git unless Meshal already opened this
branch and asked you to append a receipt under `docs/internal/audits/`.
Default: keep the report in the session.

### Workflow 2: Naming and scatter

Hunt `MAI`, `alawein-hub`, `HANDOFF-CURSOR`, `gpt-6-astra`,
`ops-shared-inventory`, `APPROVAL_POLICY`, kit `1.6.0`, `TASKS.md`,
`knowledge/objects`, `maios-dashboard`.

Classify each hit: canon, retired, historical changelog, *GAP*, or
packet drift. Do not treat G7/G12 changelog 1.6.0 as a live-kit
violation.

Confirm the two files named in G18 are still *GAP* on this checkout.

### Workflow 3: Canvas vs git

If Slack readable, pull C1-C3. Diff:

- C1: ACCEPT 1,2,4,5,6 vs stale #232/#239 open rows
- C2: empty Codex / Notion AI Slack / GitHub Slack / Kilo / Grok lanes
- C3: session-log dirt, leftover probe branch, "only #249", main 19
  behind vs the actual `main` SHA and the open PRs at read time

If Slack *BLOCKED*, say so and use the index. Do not retag empty lanes.
Do not edit the canvases.

### Workflow 4: Envelope and evidence

Read the schema, validator, and tests on `main` (G2, G3, G22) and record
the `main` SHA at read time. Attack:

- Can A3's `policy_hash` / `prompt_hash` become the only verify signal?
  (Must lose against J08.)
- Does expiry abort-before-write beat #252's executed_at vs expires_at?
  If yes, that is a **REVISE J13** candidate, one field, not a new file.
- Does Sider's "inventory wins" survive G6 field authority? (Must lose
  against J04.)
- Does "Cloud Agents un-set" survive this Slack-launched PR history?
  (Must lose against J06 unless you find a native policy that forbids
  Slack Cloud Agents.)
- Can an independently credentialed agent be `enforced` under G1?
  (Must lose against J09.)
- Is G1 law on `main`? Read `docs/governance/control-plane.md` on `main`
  and record the `main` SHA at read time. Confirm; do not assume (J17).

### Workflow 5: OpenRouter grill panel (top 10)

**First** resolve live ids. No secrets in output.

```bash
# the router loads ~/.openrouter.env and .env.local before the environment;
# use it for the preflight and never print the key
python scripts/ops/openrouter_route.py --list-routes
```

Then list models if you have a safe wrapper. Prefer ids that exist on
`https://openrouter.ai/api/v1/models` **today**. Candidate panel, in
order; **replace any 404**. Do not invent slugs.

1. `google/gemini-3.7-flash` (routing `docs`)
2. `moonshotai/kimi-k3` (routing `code`)
3. `z-ai/glm-5.3` (routing `reason`)
4. `qwen/qwen3.8-max` (routing `heavy`)

Six more, resolved from `GET /api/v1/models` at run time, one per vendor;
never commit guessed slugs.

If a slug named `astra`, `gpt-6`, or `gpt-6-astra` exists on the live
list, add it as an extra and record the exact id. Do not invent it. The
missing handoff filename is not a model.

**Budget:** one prompt per model. `max_tokens` from routing defaults
(8192). Temperature 0.2. One attempt per model. If HTTP 4xx, mark
*BLOCKED* and continue. Do not retry with a broader key. If spend or
rate-limit hits, stop the panel and finish locally.

Call with the real CLI (`--stdin` is a flag; the heredoc is stdin):

```bash
python scripts/ops/openrouter_route.py --model MODEL_ID --stdin <<'EOF'
You are a hostile reviewer. Do not be polite. The only allowed verdicts
are AFFIRM, REVISE, or REJECT against the Cursor judgement clauses
J01-J24.

Constraints: git alawein/alawein is policy SSOT. Slack canvases are
pointers. ops-shared-inventory is not git. workspace-brain is not
alawein canon. Hashes are not acceptance. Independently credentialed
agents are not enforced. No new orchestrator. Kit is AGENT.md 1.7.0.
Astra is a filename GAP until the live OpenRouter list says otherwise.

Your assigned attack angle is: ANGLE_HERE

Return exactly:
- verdict: AFFIRM | REVISE | REJECT
- three strongest attacks (clause id + one sentence)
- one native-ID fact that would change your mind
- naming violations you spotted
- whether J17 (loaded vs committed) still holds
EOF
```

Pipe a **redacted** 2-4k char extract of the judgement: the Verdict
section plus the clause list J01-J24 titles and one-line summaries, plus
the authority map. Do not pipe A1. Do not pipe personal or employer
strings.

Assign each model a distinct attack angle:

1. Field-authority contradiction (G6 vs Sider / Notion / canvas)
2. Loaded vs committed on `main` (J17)
3. Sider SoR swap (J04)
4. Cloud Agent already live vs "do not turn on" (J06)
5. A3 as hidden second canon (J13)
6. Hash-packet failure mode (A1 end state, J08)
7. Canvas stale facts treated as law (J03, J16)
8. Gemini Tier 4 wiki risk (J12)
9. Naming (MAI, hub, kit version, Astra-as-model)
10. "Just add an orchestrator" temptation (J10)

`--workflow` without `--execute-all` only prints a plan. Do not use
`--workflow` for this panel. Use `--model` per id.

### Workflow 6: Adversary (you, Fable ultracode)

After the panel, argue **against** your own inclination. Try to justify:

- Sider's inventory-wins rule
- A3 as SSOT
- standing down Slack Cloud Agents
- treating C1 ACCEPT rows as living law
- using a hash as verify
- labeling a Cloud Agent `enforced`

If you cannot do it with native IDs, drop those attacks. A panel majority
does not beat a git contradiction.

### Workflow 7: Synthesis (you only)

One judgement. No majority vote. Evidence order: native read > owner
report > inference. Label every claim `PROVED`, `OBSERVED`, `INFERRED`,
`UNVERIFIED`, `BLOCKED`, or `GAP`.

Grill **every** clause J01-J24. Silence on a clause is a defect in your
report.

## DELIVERABLE (one markdown report in chat)

Title: `CONTROL-GAP RED-TEAM - YYYY-MM-DD - Fable 5.1`

1. **Access envelope:** what you could and could not read (Slack, `main`
   SHA at read time, Windows, OpenRouter key present yes/no).
2. **Librarian table:** G/C/A/scatter existence.
3. **Panel scoreboard:** model id used (the live id, not the candidate
   slug), HTTP result, verdict, one-line attack. *BLOCKED* rows stay
   visible. Record whether an `astra` / `gpt-6` id existed.
4. **Clause sheet:** J01-J24 each AFFIRM / REVISE / REJECT, one sentence.
5. **Affirm / Revise / Reject** of the Cursor judgement as a whole.
   For any REVISE, quote the clause, replacement text, and native ID.
6. **Naming findings.** Separate historical changelog 1.6.0 from live
   drift.
7. **Canvas vs git findings.**
8. **Strongest remaining risk** (one paragraph).
9. **What Meshal should do next** (at most five bullets). Any merge
   stays Meshal exact yes. You do not merge.
10. **Non-authorization list** (copy HARD NEVER).
11. Close with:
    `DRAFT REVIEW. Not accepted. Nothing in this report has been executed.`

## STOP CONDITIONS

- Secret or token would appear in the report: redact and continue.
- OpenRouter spend or rate-limit: stop the panel, finish locally.
- You are about to write a new workflow SSOT: stop. Review G1 instead.
- You disagree with kit 1.7.0 or the 2026-09-19 gate: record *Need:*
  Meshal, do not "fix" it.
- You are about to commit A1 or quote personal facts: stop.

## DONE WHEN

Meshal has one red-team report he can compare to
`2026-09-10-control-gap-judgement.md` and decide affirm vs revise.
You have not merged, posted to Slack, or applied a packet.
