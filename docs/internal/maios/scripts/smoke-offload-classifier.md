---
type: note
status: active
source: usage-freeze smoke 2026-09-14
last_updated: 2026-09-15
owner: meshal
---

# Smoke: offload classifier cases

Contract for the laptop PowerShell classifier that routes a MAIOS
turn off Grok when the work is not triage. This Cloud VM does not
execute PowerShell. Cases below are the freeze test surface.

Live classifier bytes stay on the laptop under
`Desktop/ops-shared-inventory/` (absent here). Do not copy that tree
into git. Do not ask Grok to re-run these cases.

## Routes

| Intent | Route | Executor | Grok role |
| --- | --- | --- | --- |
| `orient` | `InlineGrok` | Intake chat | Triage only: name the object, pick a lane, stop |
| `code` | `CursorCloud` | Cursor IDE or Cloud Agent | None after handoff |
| `grill` | `OpenRouterPanel` | OpenRouter (`scripts/smoke-openrouter-one.sh` or `scripts/ops/openrouter_route.py`) | None. Do not re-summarize raw dumps |

## Classifier cases

Cues are examples, not a closed lexicon. First matching intent wins.
If cues collide, prefer `code` over `grill` over `orient`.

### Case A: `orient` -> `InlineGrok`

**Input cues:** what is, where is, status, who owns, which lane,
session orientation, "just classify this".

**Expected route:** `InlineGrok`.

**Pass:**

- Reply stays in Intake.
- No Cloud Agent wake.
- No OpenRouter HTTP call.
- No repo edit, test, or PR.

**Fail:** Intake starts a Job A scan, wakes Cursor, or pastes a model
panel.

**Last result:** SKIP 2026-09-15 Cloud. Windows classifier not on
this VM. Grok not invoked (usage freeze).

### Case B: `code` -> `CursorCloud`

**Input cues:** implement, fix, test, smoke, commit, draft PR, CI,
patch this file.

**Expected route:** `CursorCloud`.

**Pass:**

- Cursor owns implementation and checks.
- Grok is not asked to re-run the test.
- Merge stays gated (`promote it` / Meshal exact yes).

**Fail:** Coding stays in Intake, or Grok restates Cursor output as a
second execution.

**Last result:** PASS 2026-09-15 as the Cloud path for this pack
(matrix + script + draft PR). Laptop `.ps1` still UNVERIFIED here.

### Case C: `grill` -> `OpenRouterPanel`

**Input cues:** compare models, panel, red-team grill, multi-model,
hostile review across vendors.

**Expected route:** `OpenRouterPanel`.

**Pass:**

- One OpenRouter caller. Key from env or gitignored env files. Never
  printed.
- Freeze smoke is **one** cheap flash model (`google/gemini-3.8-flash`
  or the live flash fallback), prompt `ping`, `max_tokens` 64.
- A 5-model panel is out of scope for this freeze pack.
- Grok does not ingest or summarize each raw completion.

**Fail:** Grok orchestrates the panel and writes a per-model digest.
Missing `OPENROUTER_API_KEY` is BLOCK, not a Grok fallback.

**Last result:** BLOCK 2026-09-15 Cloud: key missing in this VM
(expected). `bash -n` on `scripts/smoke-openrouter-one.sh` PASS.
5-model panel not run.

## PowerShell sketch (documentation only)

Not executable SoR. Names the three outcomes the laptop script must
return.

```powershell
# Intent in; route out. Do not print secrets.
function Resolve-MaiosOffload([string]$Intent) {
    switch ($Intent.ToLowerInvariant()) {
        'orient' { 'InlineGrok' }
        'code'   { 'CursorCloud' }
        'grill'  { 'OpenRouterPanel' }
        default  { throw "unknown intent: $Intent" }
    }
}

@(
    @{ Intent = 'orient'; Expect = 'InlineGrok' }
    @{ Intent = 'code';   Expect = 'CursorCloud' }
    @{ Intent = 'grill';  Expect = 'OpenRouterPanel' }
) | ForEach-Object {
    $got = Resolve-MaiosOffload $_.Intent
    if ($got -ne $_.Expect) {
        throw "classifier miss: $($_.Intent) -> $got (want $($_.Expect))"
    }
}
```

## Cloud substitute

This VM cannot run the `.ps1`. It can only prove the `code` and
`grill` absorb paths:

```bash
bash -n scripts/smoke-openrouter-one.sh
# grill liveness; skip when the key is absent
if [ -n "${OPENROUTER_API_KEY:-}" ]; then
  bash scripts/smoke-openrouter-one.sh
else
  echo 'BLOCK: OPENROUTER_API_KEY missing in cloud VM (expected)' >&2
  exit 1
fi
```
