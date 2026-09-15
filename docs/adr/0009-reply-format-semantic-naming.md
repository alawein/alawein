---
type: adr
status: proposed
last_updated: 2026-09-14
owner: meshal
---

# ADR 0009: Name the MAIOS reply contract with semantic versioning

## Context

The chat and status reply contract was labeled by an ad hoc letter sequence,
rev a through rev g. The label appears in `prompt-kits/AGENT.md`, in
`.cursor/rules/maios-reply-style.mdc`, in `docs/governance/slack-agent-voice.md`,
and on the laptop mirror `Desktop/ops-shared-inventory/RESPONSE-STYLE.md`.

Letters do not sort, do not diff, and carry no surface or owner information.
On 2026-09-14 a full contract body labeled "rev g, Slack edition" was pasted
directly into a Slack bot and into an assistant thread as a system contract.
The Slack bot refused it, correctly, because a paste cannot be verified against
canonical source. The bot also reported the saved contract as rev c, while git
canon was rev g. Two surfaces disagreed on the current revision and neither
could prove its claim, which is the exact failure the label invites.

## Decision

Adopt a named, semantically versioned contract identifier:
`maios-reply-format@1.0.0`.

`prompt-kits/AGENT.md` section Reply style remains git canon. The kit moves to
1.9.0. `Desktop/ops-shared-inventory/RESPONSE-STYLE.md` remains the laptop
mirror and is explicitly not a second authority. Surface adapters continue to
own their surfaces: `docs/style/VOICE.md` for governed docs and
`docs/governance/slack-agent-voice.md` for Slack threads.

rev a through rev g collapse into 1.0.0 as the first named baseline. The
historical rev pointers in `prompt-kits/KITS-CHANGELOG.md` are left intact as
receipts.

## Alternatives

1. Keep rev letters. Rejected. Unsortable, and it already produced a disputed
   paste and a two-surface revision disagreement on the same day.
2. Create a new `docs/governance/RESPONSE-STYLE.md` as the home. Rejected.
   `AGENT.md` already declares itself git canon for reply style, and a new file
   would create a second authority for one field.
3. Date-stamped naming. Rejected. Dates are reserved for events and frozen
   snapshots, not version history.

## Implementation

1. Bump `prompt-kits/AGENT.md` to 1.9.0 and replace every rev g label in the
   Reply style section with the contract identifier.
2. Update `.cursor/rules/maios-reply-style.mdc` to cite the kit version and the
   contract identifier, and to state that git canon wins over the laptop mirror.
3. Update the live pointer line in `docs/governance/slack-agent-voice.md`.
4. Re-header the laptop mirror to match. Operator action, outside git.

## Acceptance

No `rev g` label remains outside the changelog and this ADR's context section.
Every adapter names both the kit version and the contract identifier. A reader
of any single adapter can find canon without guessing.

## Consequences and recovery

Adapters must be updated when the contract changes, which is now a visible cost
rather than silent drift. The 2026-09-19 channel and bot gate is untouched by
this change. Recovery is `git revert` of this commit plus re-pasting the prior
RICH block on affected surfaces.

## Authority

Meshal. Scoped approval required for the commit.
