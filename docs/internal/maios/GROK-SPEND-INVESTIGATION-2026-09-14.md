---
type: note
status: active
source: grok-thin enforce 2026-09-14
last_updated: 2026-09-14
owner: meshal
---

# Grok spend investigation (2026-09-14)

Evidence-first. Do not conflate meters. Grok weekly is the crisis meter.
OpenRouter is standing-unlimited until revoke and still needs soft caps.

## C1. Separate meters

| Meter | What burns it | Observed 2026-09-14 |
|---|---|---|
| Grok Bot weekly + on-demand | Grok chat turns, tools, Grok executors/subagents, synthesizing OpenRouter panels inside Grok, long fleet scans folded in Grok | Weekly 100% (Declared). On-demand about $38.91/$50 (Declared). |
| Cursor Cloud / Cursor usage | CloudAgent runs, IDE agent | PR #295, #297 runs (Verified as GitHub PRs). |
| OpenRouter | Panel/model HTTP calls | Lite 5/5 grill + 1 flash ping on box (Declared). Unlimited standing yes. Soft caps still required. |

## C2. Root causes (tonight's pattern)

1. **Orchestration tax:** Even when work is "on Cursor/OpenRouter", Grok still
   spends tokens to dispatch, poll/check, and fold results.
2. **Multi-executor fan-out:** Fleet Job A + Desktop apply + panel + patch =
   parallel Grok workers on one scan.
3. **Panel amplification:** Lite 5 models is OpenRouter dollars. Grok then
   re-reads and synthesizes all five, which is Grok dollars.
4. **Verbose receipts in-chat:** Long status folds + repeated Continues stay on
   the Grok weekly meter.
5. **Routines:** weekday fleet scan/triage/auditor/realign still schedule Grok
   wakes (quiet-week paused observation only; do not re-enable here).

## C3. Ranked recommendations

1. Default **Cursor-first** for any task >2 tool rounds. Grok only triage.
2. OpenRouter panels: run via **script/Cursor**, return **synthesis-only**
   (<=20 lines) to Grok. Never dump raw 5x replies into Grok context.
3. Fleet scans: one short Job B triage by default under freeze. Job A full
   scan max 1x/day unless `Force Grok:`.
4. Prefer **flash/small** models for pings/classifier shadow. Reserve
   Opus/GPT-pro for architecture only.
5. Soft caps: OpenRouter lite max 3/day; fleet 7 max 1/day; alert at 70%;
   kill-switch env `MAIOS_PANEL_KILL=1`.
6. Optional product decision for Meshal: raise Grok on-demand limit in the
   Grok UI, or wait weekly reset (about 4 days from the 2026-09-14 screenshot).
   This repo cannot change Grok's meter.

## Top 3 spend cuts (operator fold)

1. No Grok executor fleets during FREEZE.
2. No Grok-synthesized raw panel dumps; synthesis-only from Cursor/script.
3. Cursor-first after two tool rounds; wake/Continue, never poll-as-daemon.

## Model 404 note

If smoke ping returns HTTP 404 for `google/gemini-3.8-flash`, update
`scripts/smoke-openrouter-one.sh` default to a verified flash id from
`GET https://openrouter.ai/api/v1/models` and record the old/new id here.
Do not invent ids. Obsolete example to avoid: `google/gemini-2.0-flash-001`.
