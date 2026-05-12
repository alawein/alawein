---
type: derived
source: docs/internal/specs/2026-05-11-voice-business-design.md
sync: none
sla: none
authority: plan
audience: [contributors, agents]
owner: meshal@kohyr.ai
status: draft
last_updated: 2026-05-11
---

# Voice Business Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `[business-web]` and `[business-outreach]` as Block 3 surface sections (§20a and §20b) to the voice contract, backed by a new source file `docs/style/voice-business.md` that slots into the assembler and regenerates `voice-unified.md`.

**Architecture:** Four changes, one per file, in dependency order. Create the source file first; then wire it into the assembler (with a test); then update the §22 reference table; then regenerate the unified output and commit all four together.

**Tech Stack:** Python 3, unittest, `pathlib`, existing `build_voice_unified.py` assembler.

---

## File map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `docs/style/voice-business.md` | Block 3b source: §20a `[business-web]`, §20b `[business-outreach]`, drift-prevention table |
| Modify | `scripts/ops/build_voice_unified.py` | Add `voice-business.md` to BLOCKS tuple; add `[business-web]` and `[business-outreach]` to "How to use" string |
| Modify | `docs/style/voice-workflow.md` | Add two rows to §22 AI application instructions table |
| Regenerate | `docs/style/voice-unified.md` | Run assembler; do not hand-edit |
| Modify | `scripts/tests/test_build_voice_unified.py` | Add test for new surface tags appearing in assembled "How to use" |

---

### Task 1: Create `docs/style/voice-business.md`

**Files:**
- Create: `docs/style/voice-business.md`

Work from the alawein repo root:
`C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\alawein`

- [ ] **Step 1: Create the source file**

Create `docs/style/voice-business.md` with exactly this content:

```markdown
---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [contributors, agents]
last_updated: 2026-05-11
---

# Block 3 · Business Surfaces

_Switch in the section that matches the surface tag. Block 1 always applies._

## §20a [business-web] — Website and long-form public prose

Applies when surface tag is `[business-web]`.

**Block 2 does not apply.**

### Argument structure — market claim form

Business web copy stakes a market position. Replace technical contribution staking
(Block 2 §7) with the following four-beat structure:

```text
market condition  →  position  →  specific evidence  →  bounded commitment
```

*Market condition:* one factual sentence stating what is broken or absent. Not a
TAM. Not a trend. A condition: "Agents open PRs faster than humans can review them."

*Position:* a direct claim about what Kohyr does. Not a mission statement.
"Kohyr scores every AI-authored PR with a KCI and signs the verdict."

*Specific evidence:* named, concrete, with units where they exist: "KCI ∈ [0, 100],"
"evidence.json," "sha256-signed."

*Bounded commitment:* what the product delivers. Not "we aim to" or "we strive for."
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

Bad: "Join thousands of teams leveraging Kohyr."
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

1. *The condition.* One sentence. What is broken for this specific recipient right now.
   Named, concrete: "Your team ships 40+ AI-authored PRs per week" — not "AI is
   transforming software development."

2. *The position.* What Kohyr does about it. One sentence. No credentials, no company
   history. "Kohyr scores every commit with a KCI and signs the result — deterministically,
   without an LLM in the gate."

3. *The specific evidence.* One or two concrete artifacts the recipient can verify:
   "The CLI installs in 30 seconds. `kohyr doctor` runs on any git repo without
   configuration."

4. *The ask.* Direct and bounded. "I'd like 20 minutes to show you the live output on
   one of your repos." Not "I would love to connect and explore synergies."

### Opener discipline

Do not open with a preamble, a compliment, or a self-introduction. Open with the
condition. The recipient's name may appear as a salutation line above the body.

Bad:
```text
My name is Meshal and I'm the founder of Kohyr. I came across your work and was
really impressed by what you're building...
```

Good:
```text
Hi [Name],

Your team is shipping AI-authored PRs without a deterministic merge gate.
```

### Credential handling

Credentials do not open the email and do not appear in the body. They belong in the
signature below the ask:

```text
Meshal Alawein
PhD EECS, UC Berkeley · Founder, Kohyr
meshal@kohyr.ai · kohyr.ai
```

If credentials must appear in the body (e.g., a pitch deck bio slide), use the
canonical identity strings from Block 1 §Canonical identity strings exactly.
Do not vary the format.

### Closing

No "I hope this finds you well," "feel free to reach out," or "I look forward to
hearing from you." These are in the forbidden register. Close with the ask and stop.
A one-line factual sign-off is acceptable: "Available Thursday afternoon if that works."

### Em dash budget

0–1 per email. A 4-paragraph cold email with two em dashes fails. Short-form
outreach amplifies the AI-generation signal more than long-form; the budget is harder,
not softer, in email.

## Drift-prevention table

When the startup-speak phrase surfaces first, use the right column:

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
```

- [ ] **Step 2: Verify file structure**

```bash
python -c "
from pathlib import Path
p = Path('docs/style/voice-business.md')
text = p.read_text(encoding='utf-8')
assert text.startswith('---'), 'missing frontmatter'
assert '## §20a' in text, 'missing §20a'
assert '## §20b' in text, 'missing §20b'
assert '[business-web]' in text, 'missing [business-web] tag'
assert '[business-outreach]' in text, 'missing [business-outreach] tag'
print('OK')
"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add docs/style/voice-business.md
git commit -m "docs(style): add voice-business.md block 3 business surfaces source"
```

---

### Task 2: Wire into assembler and add test

**Files:**
- Modify: `scripts/ops/build_voice_unified.py` (BLOCKS tuple + "How to use" string)
- Modify: `scripts/tests/test_build_voice_unified.py` (new test class)

- [ ] **Step 1: Write the failing test**

Open `scripts/tests/test_build_voice_unified.py`. Add this class after `class MainTests`:

```python
class BusinessSurfaceTagsTests(unittest.TestCase):
    """Verify [business-web] and [business-outreach] appear in assembled output."""

    def test_business_tags_in_how_to_use(self):
        """The 'How to use' prose must list both business surface tags."""
        result = assemble(
            list(build_voice_unified.BLOCKS),
            today="2026-05-11",
            last_updated="2026-05-11",
        )
        self.assertIn("[business-web]", result)
        self.assertIn("[business-outreach]", result)
```

- [ ] **Step 2: Run it to verify it fails**

```bash
python -m pytest scripts/tests/test_build_voice_unified.py::BusinessSurfaceTagsTests -v
```

Expected: FAIL — `AssertionError` on `assertIn("[business-web]", result)` because neither the BLOCKS entry nor the "How to use" string contains that tag yet.

- [ ] **Step 3: Add `voice-business.md` to BLOCKS**

In `scripts/ops/build_voice_unified.py`, replace the BLOCKS tuple (lines 34–58) with:

```python
BLOCKS: tuple[BlockSpec, ...] = (
    {
        "file": STYLE_DIR / "VOICE.md",
        "title": "Block 1 · Universal Core",
        "subtitle": "_Source: `alawein/docs/style/VOICE.md`. Applies to every surface, no exceptions._",
    },
    # Blocks 2-4 source files carry their own subtitle paragraph after the
    # leading H1, so the assembler should not synthesize one (would duplicate).
    # Block 1 (VOICE.md) does not, so its subtitle is synthesized above.
    {
        "file": STYLE_DIR / "voice-software-register.md",
        "title": "Block 2 · Design-Defense Register",
        "subtitle": None,
    },
    {
        "file": STYLE_DIR / "voice-surfaces.md",
        "title": "Block 3 · Surface Adjustments",
        "subtitle": None,
    },
    {
        "file": STYLE_DIR / "voice-business.md",
        "title": "Block 3 · Business Surfaces",
        "subtitle": None,
    },
    {
        "file": STYLE_DIR / "voice-workflow.md",
        "title": "Block 4 · Polish Workflow",
        "subtitle": None,
    },
)
```

- [ ] **Step 4: Update the "How to use" string**

In `assemble()`, replace the hardcoded surface tag line (the string starting with
`"**As an AI system prompt:**"`). The current text is:

```python
"**As an AI system prompt:** paste this guide in full, then tag the target surface: "
"`[software-doc]`, `[notebook]`, `[readme]`, `[physics-paper]`, `[claude-md]`, or `[prompt-kit]`. "
```

Replace with:

```python
"**As an AI system prompt:** paste this guide in full, then tag the target surface: "
"`[software-doc]`, `[notebook]`, `[readme]`, `[physics-paper]`, `[claude-md]`, `[prompt-kit]`, "
"`[business-web]`, or `[business-outreach]`. "
```

The three lines after it remain unchanged:

```python
"Apply Block 1 universally. Apply Block 2 to `[software-doc]` and `[notebook]` surfaces. "
"For `[physics-paper]`, apply only §10 and §11 from Block 2; all other Block 2 sections are inactive. "
"Apply the matching § from Block 3 for surface-specific adjustments. "
"Run §24 as a final audit pass before returning output.\n\n",
```

- [ ] **Step 5: Run the new test to verify it passes**

```bash
python -m pytest scripts/tests/test_build_voice_unified.py::BusinessSurfaceTagsTests -v
```

Expected: PASS

- [ ] **Step 6: Run the full test suite to verify nothing regressed**

```bash
python -m pytest scripts/tests/test_build_voice_unified.py -v
```

Expected: all existing tests pass, one new test passes.

- [ ] **Step 7: Commit**

```bash
git add scripts/ops/build_voice_unified.py scripts/tests/test_build_voice_unified.py
git commit -m "feat(scripts): add voice-business.md to assembler BLOCKS and how-to-use string"
```

---

### Task 3: Update `voice-workflow.md` §22 table

**Files:**
- Modify: `docs/style/voice-workflow.md` (§22 AI application instructions table)

- [ ] **Step 1: Add the two new rows**

In `docs/style/voice-workflow.md`, find the §22 table (currently 6 rows). Insert two
new rows between `\`[claude-md]\`` and `\`[prompt-kit]\``:

Current table:
```markdown
| Tag | Blocks active |
|-----|---------------|
| `[software-doc]` | Block 1 + Block 2 + §15 |
| `[notebook]` | Block 1 + Block 2 + §15 + §16 |
| `[physics-paper]` | Block 1 + §17 (Block 2 §10, §11 only) |
| `[readme]` | Block 1 + §18 |
| `[claude-md]` | Block 1 + §19 |
| `[prompt-kit]` | Block 1 + §21 |
```

Replace with:
```markdown
| Tag | Blocks active |
|-----|---------------|
| `[software-doc]` | Block 1 + Block 2 + §15 |
| `[notebook]` | Block 1 + Block 2 + §15 + §16 |
| `[physics-paper]` | Block 1 + §17 (Block 2 §10, §11 only) |
| `[readme]` | Block 1 + §18 |
| `[claude-md]` | Block 1 + §19 |
| `[business-web]` | Block 1 + §20a |
| `[business-outreach]` | Block 1 + §20b |
| `[prompt-kit]` | Block 1 + §21 |
```

Also bump `last_updated` in the frontmatter to `2026-05-11`.

- [ ] **Step 2: Verify the table**

```bash
python -c "
from pathlib import Path
text = Path('docs/style/voice-workflow.md').read_text(encoding='utf-8')
assert '[business-web]' in text
assert '[business-outreach]' in text
assert '§20a' in text
assert '§20b' in text
print('OK')
"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add docs/style/voice-workflow.md
git commit -m "docs(style): add business surface tags to voice-workflow §22 table"
```

---

### Task 4: Regenerate `voice-unified.md` and verify

**Files:**
- Regenerate: `docs/style/voice-unified.md`

- [ ] **Step 1: Run the assembler**

```bash
python scripts/ops/build_voice_unified.py
```

Expected output (the exact char count will differ):
```
Wrote .../docs/style/voice-unified.md (NNNNN chars, last_updated=2026-05-11)
```

If it prints `ERROR:`, check that `docs/style/voice-business.md` exists and has
valid (terminated) YAML frontmatter.

- [ ] **Step 2: Spot-check the unified output**

```bash
python -c "
from pathlib import Path
text = Path('docs/style/voice-unified.md').read_text(encoding='utf-8')
assert 'type: generated' in text, 'not marked generated'
assert '[business-web]' in text, 'business-web tag missing'
assert '[business-outreach]' in text, 'business-outreach tag missing'
assert '## Block 3 · Business Surfaces' in text, 'block header missing'
assert '### §20a' in text, 'section §20a missing'
assert '### §20b' in text, 'section §20b missing'
assert 'Drift-prevention table' in text, 'drift table missing'
# Exactly one H1 in the output (the title line)
import re
h1s = re.findall(r'^# (?!#)', text, re.MULTILINE)
assert len(h1s) == 1, f'expected 1 H1, found {len(h1s)}'
print('OK')
"
```

Expected: `OK`

- [ ] **Step 3: Run the full test suite one final time**

```bash
python -m pytest scripts/tests/test_build_voice_unified.py -v
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add docs/style/voice-unified.md
git commit -m "chore(generated): regenerate voice-unified.md with business surface block"
```

---

## Self-review

**Spec coverage check:**

| Spec section | Covered by |
|---|---|
| §1 Goal and non-goals | Task 1 creates the file; Task 2 wires it in |
| §2 Core insight + reference implementation | Task 1 `voice-business.md` §20a "Reference implementation" |
| §3 Tag split rationale | Task 1 §20a/§20b header structure; Task 3 §22 table split |
| §4 §20a market claim structure | Task 1 §20a "Argument structure" |
| §4 §20a CTA wording | Task 1 §20a "CTA wording" |
| §4 §20a em dash budget | Task 1 §20a "Em dash budget" |
| §4 §20a blog and changelog | Task 1 §20a "Blog and changelog" |
| §4 §20b outreach form | Task 1 §20b "Argument structure — outreach form" |
| §4 §20b opener discipline | Task 1 §20b "Opener discipline" |
| §4 §20b credential handling | Task 1 §20b "Credential handling" |
| §4 §20b closing | Task 1 §20b "Closing" |
| §4 §20b em dash budget | Task 1 §20b "Em dash budget" |
| §5 Drift-prevention table | Task 1 §20b "Drift-prevention table" |
| §6 Block 1 carry-through | Implicit — §20a/§20b both state "Block 1 fully active" |
| §7 Assembler slot | Task 2 BLOCKS update |
| §7 §22 table update | Task 3 |
| §8 Enforcement tier | Not in a source file; lives in the spec as reference |

**Placeholder scan:** No TBD, TODO, or incomplete sections found.

**Type consistency:** No type definitions changed. The `BlockSpec` TypedDict is unchanged; the new BLOCKS entry uses the same three keys (`file`, `title`, `subtitle`).

**One gap noted:** §8 (enforcement tier table) is in the design spec but is not reproduced in `voice-business.md`. This is intentional — enforcement tiers are a spec-level policy decision, not a rule the voice contract itself restates. The §22 table in `voice-workflow.md` is the contract-level reference.
