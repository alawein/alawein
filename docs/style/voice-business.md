---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last_updated: 2026-05-16
---

# Block 3 · Business Surfaces

_Switch in the section that matches the surface tag. Block 1 always applies._

## §20a [business-web] — Website and long-form public prose

Applies when surface tag is `[business-web]`.

**Block 2 does not apply.**

### Argument structure — market claim form

Business web copy stakes a market position. Replace technical contribution staking
(Block 2 §7) with the following four-beat structure:

market condition  →  position  →  specific evidence  →  bounded commitment

_Market condition:_ one factual sentence stating what is broken or absent. Not a
TAM. Not a trend. A condition: "Agents open PRs faster than humans can review them."

_Position:_ a direct claim about what Kohyr does. Not a mission statement.
"Kohyr scores every AI-authored PR with a KCI and signs the verdict."

_Specific evidence:_ named, concrete, with units where they exist: "KCI ∈ [0, 100],"
"evidence.json," "sha256-signed."

_Bounded commitment:_ what the product delivers. Not "we aim to" or "we strive for."
"Five minutes to governed."

### Reference implementation

New homepage sections, /about principles, pricing copy, and pilot-page prose pass if
they would sit cleanly alongside the /about principles:

> "Math is the moat."
> "Evidence, not assertions."
> "Refusal is structure."

That section is the calibration surface — not the design system, not the brand kit.

### CTA wording

CTAs are the highest-risk surface for forbidden register. Apply Block 1 preferred
register to every CTA string.

Bad: "Get started today and transform your workflow."
Good: "kohyr doctor — free, no card."

Bad: "Join thousands of teams `leveraging` Kohyr."
Good: "Request access."

CTAs may use imperative CLI-style framing (`> kohyr doctor`, `Start free`) when the
product is a CLI. This is product register, not a style relaxation.

### Em dash budget

0–1 per section. Three or more in a single paragraph is a blocking signal. Treat each
visually distinct section (hero, problem grid, KCI explainer, pricing, CTA) as one
budget unit. Web sections are shorter than long-form docs; the per-section budget is
tighter in practice.

### Blog and changelog

Tag `[business-web]` by default. No YAML frontmatter exposed to readers. Open with a
factual sentence. No motivational footers. Changelog entries are terse and imperative:
state what changed, not why it is exciting.

## §20b [business-outreach] — Email, proposals, pitch materials

Applies when surface tag is `[business-outreach]`.

**Block 2 does not apply.**

### Argument structure — outreach form

Four structural moves, each 2–3 sentences maximum:

1. _The condition._ One sentence. What is broken for this specific recipient right now.
   Named, concrete: "Your team ships 40+ AI-authored PRs per week" — not "AI is
   transforming software development."

2. _The position._ What Kohyr does about it. One sentence. No credentials, no company
   history. "Kohyr scores every commit with a KCI and signs the result — deterministically,
   without an LLM in the gate."

3. _The specific evidence._ One or two concrete artifacts the recipient can verify:
   "The CLI installs in 30 seconds. `kohyr doctor` runs on any git repo without
   configuration."

4. _The ask._ Direct and bounded. "I'd like 20 minutes to show you the live output on
   one of your repos." Not "I would love to connect and explore synergies."

### Opener discipline

Do not open with a preamble, a compliment, or a self-introduction. Open with the
condition. The recipient's name may appear as a salutation line above the body.

Bad: "My name is Meshal and I'm the founder of Kohyr. I came across your work and was
really impressed by what you're building..."

Good: "Hi [Name], [blank line] Your team is shipping AI-authored PRs without a
deterministic merge gate."

### Credential handling

Credentials do not open the email and do not appear in the body. They belong in the
signature below the ask:

Meshal Alawein
PhD EECS, UC Berkeley · Founder, Kohyr
meshal@kohyr.ai · kohyr.ai

If credentials must appear in the body (e.g., a pitch deck bio slide), use the
canonical identity strings from Block 1 §Canonical identity strings exactly.
Do not vary the format.

### Closing

No `I hope this finds you well`, `feel free to reach out`, or `I look forward to
hearing from you`. These are in the forbidden register. Close with the ask and stop.
A one-line factual sign-off is acceptable: "Available Thursday afternoon if that works."

### Em dash budget

0–1 per email. A 4-paragraph cold email with two em dashes fails. Short-form
outreach amplifies the AI-generation signal more than long-form; the budget is harder,
not softer, in email.

## Drift-prevention table

When the startup-speak phrase surfaces first, use the right column:

| Impulse (forbidden) | Voice-compliant replacement |
|---|---|
| `excited to share` | state the news directly |
| `transformative platform` | name the capability and the problem class it resolves |
| `leverage our technology` | name what the technology does |
| `looking to partner with` | state what the partnership accomplishes and what you offer |
| `we believe in` | drop belief framing; state the position |
| `would love to connect` | state the ask and a specific time |
| `happy to answer questions` | drop it, or name the one question you expect |
| `our unique approach` | name the approach; let uniqueness be inferred from the claim |
| `at the forefront of` | name the specific thing you are ahead on |
| `seamlessly integrates` | name what it integrates with and what the integration does |
| `robust solution` | name the mechanism and the failure mode it prevents |
| `world-class team` | drop it entirely or name the relevant credential once |
| `innovative` | name what is novel; if nothing is, drop the word |
