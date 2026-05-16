---
type: derived
source: brainstorming session 2026-05-11
sync: none
sla: none
authority: spec
audience: [contributors, agents]
owner: meshal@kohyr.ai
status: draft
last_updated: 2026-05-11
---

# Voice business surface: design spec

> **NON-NORMATIVE.** This spec is a design artifact. The normative contract
> will be `docs/style/voice-business.md` once implemented.

Add `[business-web]` and `[business-outreach]` as Block 3 surface sections
(§20a and §20b) in `voice-surfaces.md`, backed by a standalone source file
`docs/style/voice-business.md`. The surface covers all Kohyr commercial and
public-facing prose: website copy, investor outreach, design-partner proposals,
and pitch materials.

## §1 Goal and non-goals

**Goal.** Codify the principles that make the existing Kohyr website copy work
and extend them to outreach, so that future contributors and agents applying
voice to business contexts don't over-correct into startup-speak.

**Non-goals.**

- Not relaxing Block 1. No forbidden-register exceptions for business contexts.
- Not introducing a softer register. The claim is that the existing voice is
  already the correct business voice — the spec formalizes why.
- Not covering press releases or marketing campaigns. Those are a later block
  if the volume justifies it.
- Not covering the authenticated dashboard. Internal product UI copy is out of
  scope.

## §2 The core insight

The over-correction failure mode — reaching for "excited to," "transformative,"
"seamlessly" when writing for a business audience — reflects a false belief that
business contexts require a different voice. They don't. The strongest investor
and partner register is the same as the strongest technical register: direct
claims, honest scope, no credential-preambles. The /about principles section of
`apps/web/src/app/about/page.tsx` is the canonical reference:

> "Math is the moat."
> "Evidence, not assertions."
> "Refusal is structure."

These pass every Block 1 check. They also work better as business copy than
"We leverage cutting-edge category theory to deliver transformative governance."
The spec does not teach a new voice. It prevents the drift.

## §3 Tag split rationale

Two tags rather than one `[business]` tag because the failure modes differ:

| Tag | Surface | Primary failure mode |
|-----|---------|---------------------|
| `[business-web]` | Homepage, /about, /pricing, /pilot, /blog, /changelog | Drift over time as more contributors add copy |
| `[business-outreach]` | Investor emails, design-partner proposals, pitch materials | Over-correction at the moment of writing |

Both tags carry identical Block 1 obligations. The surface-specific conventions
in §20b differ from §20a because the structural moves for a 4-paragraph email
differ from the structural moves for a 1200-word homepage.

## §4 Block 3 §20 design

### §20a `[business-web]` — Website and long-form public prose

**Blocks active:** Block 1 fully (all rules, no relaxations). Block 2 off.

**Argument structure — market claim form.**

Business web copy stakes a market position. This replaces technical contribution
staking (Block 2 §7) with the following four-beat structure:

```
market condition  →  Kohyr's position  →  specific evidence  →  bounded commitment
```

*Market condition:* one factual sentence stating what is broken or absent in the
world. Not a TAM. Not "the AI space is evolving." A specific condition:
"Agents open PRs faster than humans can review them."

*Position:* a direct claim about what Kohyr does. Not a mission statement.
"Kohyr scores every AI-authored PR with a KCI and signs the verdict."

*Specific evidence:* follows Block 1 preferred register. Named, concrete, with
units where they exist: "KCI ∈ [0, 100]," "evidence.json," "sha256-signed."

*Bounded commitment:* what you will do and by when, or what the product
delivers. Not "we aim to" or "we strive for." "Five minutes to governed."

**Reference implementation.** New homepage sections, /about principles, pricing
copy, and pilot-page prose pass if they would sit cleanly alongside the existing
/about principles. That section is the calibration surface — not the design
system, not the brand kit.

**CTA wording.** CTAs are the highest-risk surface for forbidden register.
Apply Block 1 §4 (preferred register) to every CTA string:

Bad: "Get started today and transform your workflow."
Good: "kohyr doctor — free, no card."

Bad: "Join thousands of teams leveraging Kohyr."
Good: "Request access."

CTAs may use imperative CLI-style framing (`> kohyr doctor`, `Start free`) when
the product is a CLI. This is not stylistic — it signals product register and
is already established in the homepage.

**Em dash budget on web.** 0–1 per section. Three or more in a single paragraph
is a blocking signal even in short copy blocks (pricing cards, feature bullets,
hero subheads). Web sections are shorter than long-form docs — the per-section
budget is tighter in practice. Treat each visually distinct section (hero,
problem grid, KCI explainer, pricing, CTA) as one budget unit.

**Blog and changelog.** The blog `[slug]` surface is `[business-web]` by
default. No YAML frontmatter exposed to readers. Open with a factual sentence.
No motivational footers. Changelog entries are terse and imperative: state what
changed, not why it is exciting.

### §20b `[business-outreach]` — Email, proposals, pitch materials

**Blocks active:** Block 1 fully (all rules, no relaxations). Block 2 off.

**Argument structure — outreach form.**

Four structural moves, each a maximum of 2–3 sentences:

1. *The condition.* One sentence. What is broken for this specific recipient
   right now. Named, concrete, not generic: "Your team ships 40+ AI-authored
   PRs per week" not "AI is transforming software development."

2. *The position.* What Kohyr does about it. One sentence. No credentials,
   no company history. "Kohyr scores every commit with a KCI and signs the
   result — deterministically, without an LLM in the gate."

3. *The specific evidence.* One or two concrete artifacts the recipient can
   verify: "The CLI installs in 30 seconds. `kohyr doctor` runs on any git repo
   without configuration."

4. *The ask.* Direct and bounded. "I'd like 20 minutes to show you the live
   output on one of your repos." Not "I would love to connect and explore
   synergies."

**Opener discipline.** Do not open with a preamble, a compliment, or a
self-introduction. Open with the condition. The recipient's name may appear as
a salutation line above the body (standard epistolary convention — it is not
a preamble). The first sentence of the body is the condition.

Bad: "My name is Meshal and I'm the founder of Kohyr. I came across your work
and was really impressed by..."

Good: "Hi [Name], [blank line] Your team is shipping AI-authored PRs without
a deterministic merge gate..."

**Credential handling.** Credentials do not open the email and do not appear in
the body. They belong in the signature line below the ask:

```
Meshal Alawein
PhD EECS, UC Berkeley · Founder, Kohyr
meshal@kohyr.ai · kohyr.ai
```

If credentials must appear in the body (e.g., a pitch deck bio slide), use the
canonical identity strings from VOICE.md §Canonical identity strings exactly.
Do not vary the format.

**Closing.** No "I hope this finds you well," "feel free to reach out,"
"I look forward to hearing from you," or "best wishes." These are in the
forbidden register. Close with the ask and stop. A one-line factual sign-off
is acceptable: "Available Thursday afternoon if that works."

**Em dash budget for outreach.** 0–1 per email. A 4-paragraph cold email with
two em dashes fails. Short-form outreach amplifies the AI-generation signal
more than long-form does; the budget is harder, not softer, in email.

## §5 Drift-prevention table

When the startup-speak phrase is what surfaces first, use the right column:

| Impulse (forbidden) | Voice-compliant replacement |
|---|---|
| "excited to share" | state the news directly |
| "transformative platform" | name the capability and the problem class it resolves |
| "leverage our technology" | name what the technology does |
| "looking to partner with" | state what the partnership accomplishes and what you offer |
| "we believe in" | drop belief framing; state the position |
| "would love to connect" | state the ask and a specific time |
| "happy to answer questions" | drop it, or name the one question you expect |
| "our unique approach" | name the approach; let uniqueness be inferred from the claim |
| "at the forefront of" | name the specific thing you are ahead on |
| "seamlessly integrates" | name what it integrates with and what the integration does |
| "robust solution" | name the mechanism and the failure mode it prevents |
| "world-class team" | drop it entirely or name the relevant credential once |
| "innovative" | name what is novel; if nothing is, drop the word |

## §6 Block 1 enforcement in business contexts

Block 1 applies fully. Three rules most at risk in business writing:

**Em dash budget.** Addressed in §4 per surface. The through-line: em dashes
for drama or punch are the most common AI-generation signal in business drafts.
Budget 0–1 per section or per email; treat overrun as a blocking finding before
any copy ships.

**Forbidden register.** The full §5 list applies with no carve-outs. "Excited
to," "leveraging," "seamlessly," "transformative," "passionate about" are not
softened by a business context. They are still banned. Run the Block 4 §25 scan
command on web copy before it ships.

**Opener discipline.** Every Block 1 rule about opening with the claim applies
directly to business surfaces. In web copy this means section H2s and the first
sentence of each section body carry the claim. In outreach it means the first
sentence of the body (after the optional salutation) is the condition.

## §7 Assembler slot

`voice-business.md` slots into the `BLOCKS` constant in
`scripts/ops/build_voice_unified.py` as a new entry after `voice-surfaces.md`
and before `voice-workflow.md`. The section numbers §20a and §20b follow the
existing §19 (`[claude-md]`) and precede §21 (`[prompt-kit]`).

The `voice-workflow.md` §22 application table gains a new row:

| Tag | Blocks active |
|-----|---------------|
| `[business-web]` | Block 1 + §20a |
| `[business-outreach]` | Block 1 + §20b |

## §8 Enforcement tier

| Surface | Tier |
|---------|------|
| Homepage (`/`), /about, /pricing, /pilot | Blocking |
| /blog, /changelog | Advisory |
| Investor email, design-partner proposal | Blocking |
| Pitch deck body copy | Advisory |

Advisory surfaces drift to blocking when a linter or voice-check CI step covers
them. Do not tighten to blocking without a linter that catches the violation
automatically.
