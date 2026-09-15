---
type: note
status: active
source: usage-freeze smoke 2026-09-14
last_updated: 2026-09-14
owner: meshal
---

# MAIOS usage-freeze test matrix (2026-09-14)

Derived evidence. Not SoR. Not a Morning Brief. Not a second inventory.

**Trigger:** Meshal Grok Bot weekly usage at 100 percent. On-demand spend
about $39 of $50. Freeze starts 2026-09-14. All smoke in this pack runs
on Cursor Cloud. Do not ask Grok to re-run these checks.

**Executor:** Cursor Cloud. **Author:** Meshal Alawein
`<contact@meshal.ai>`. **Independent reviewer:** not performed this
turn (default reviewer when Cursor executes is ChatGPT; Slack
`@ChatGPT` is replaced). **Final approval:** pending Meshal.
**Acceptance:** pending.

## Why Grok usage climbs

Grok Bot weekly tokens rise when Intake stays on the execution path
instead of triage.

1. **Multi-executor Job A scans.** A Grok turn that fans out repo
   scans, catalog diffs, or "check every adapter" jobs keeps the
   conversation on Grok while other tools work. Each follow-up paste
   back into Intake is another Grok completion.
2. **OpenRouter panels orchestrated by Grok.** A grill panel is cheap
   on OpenRouter and expensive on Grok if Intake then re-reads every
   raw model dump and writes a synthesis. The panel already produced
   answers. Grok should not re-summarize each dump.
3. **Cloud Agent wakes.** "Send this to Cursor" from a long Grok
   thread bills the orchestration turn on Grok and starts a Cloud
   run. Repeat wakes for the same Job A scan stack the weekly cap.
4. **Long chat turns.** RICH-sized pastes, full file dumps, and
   multi-step "just one more check" loops in Grok Bot chat burn the
   weekly bucket even when the actual coding happens elsewhere.

Cursor Cloud and OpenRouter are the absorb lanes. Grok weekly is the
scarce lane.

## Freeze rule

| Lane | Allowed work | Stop |
| --- | --- | --- |
| Intake / Grok chat | Triage only: classify, name the owner, hand off | Coding, tests, panels, Job A scans, long dumps |
| Cursor (IDE or Cloud) | Implementation, smoke, CI, draft PRs | Asking Grok to re-run the same test |
| OpenRouter | Multi-model grill. One cheap ping for liveness | Grok restating each model's raw output |

Hard stops for this freeze:

- Intake chat stays at or below triage.
- Coding and tests go to Cursor.
- Multi-model work goes to OpenRouter without Grok re-summarizing
  every model raw dump.
- Do not run a 5-model panel from Grok. One cheap model ping is the
  Cloud smoke. A full panel needs a separate spend yes.

## Matrix

Last-result column is this Cursor Cloud run unless marked otherwise.
Grok Bot surfaces are documented, not executed.

| Adapter | How to test | Pass criteria | Last result |
| --- | --- | --- | --- |
| RICH (Cursor IDE / Cloud chat) | This Cloud session: write the matrix, classifier note, and smoke script; keep one adapter; no Slack mix | Files land under `docs/internal/maios/` and `scripts/`; reply stays RICH; no Grok re-run asked | PASS 2026-09-15 Cloud: files authored here |
| CLI (terminal / CI) | `bash -n scripts/smoke-openrouter-one.sh` on this VM | Syntax check exit 0; script never prints `OPENROUTER_API_KEY` | PASS 2026-09-15 `bash -n` exit 0 |
| SLACK | Do not post. Read `docs/governance/slack-agent-voice.md` and confirm a thread reply would use SLACK only | No Slack send from this freeze pack; adapter choice is SLACK if a human later posts | SKIP 2026-09-15: no Slack send (freeze + no send grant) |
| InlineGrok (orient offload) | Laptop PowerShell classifier: intent `orient` (see `docs/internal/maios/scripts/smoke-offload-classifier.md`) | Route is Intake-only triage. No Cloud wake. No OpenRouter call | SKIP 2026-09-15: Grok not invoked (freeze) |
| CursorCloud (code offload) | Classifier intent `code`: implement, smoke, draft PR on this VM | Cursor executes; Grok is not asked to re-run; draft PR only | PASS 2026-09-15: this Cloud run owns the pack |
| OpenRouterPanel (grill offload) | `scripts/smoke-openrouter-one.sh`: one flash model, prompt `ping`, `max_tokens` 64. No 5-model panel | Exit 0 only on HTTP 200. Prints status and content length. Never echoes the key. Missing key is BLOCK, not a Grok fallback | BLOCK 2026-09-15: `OPENROUTER_API_KEY` missing in Cloud VM (expected) |

## Commands this VM may run

```bash
bash -n scripts/smoke-openrouter-one.sh
# only if OPENROUTER_API_KEY is already in the environment:
bash scripts/smoke-openrouter-one.sh
```

Do not:

- export or print the key
- call a 5-model panel
- hand the same smoke back to Grok
- merge the draft PR

## Change evidence

| Field | Recorded value |
| --- | --- |
| Work item | Usage-freeze adapter smoke matrix (Cursor Cloud) |
| Work kind | docs / test |
| Accountable maintainer | Meshal Alawein |
| Actual commit author | `contact@meshal.ai` |
| Executor | Cursor Cloud (this pack) |
| Independent reviewer | not performed this turn |
| Checks | `bash -n scripts/smoke-openrouter-one.sh`; OpenRouter ping only if key present |
| Final approval | pending Meshal |

## Enforce pointer (2026-09-14)

Canonical freeze: `GROK-USAGE-FREEZE.md` (weekly >= 80 or on-demand >= 70).
Canonical matrix: `GROK-THIN-OFFLOAD.md`. Verbs: `Offload:` `Cursor:` `Panel:`
`Panel fleet:` `Force Grok:`.
