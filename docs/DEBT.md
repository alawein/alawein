---
type: canonical
source: none
sla: on-change
last_updated: 2026-06-06
audience: [ai-agents, contributors]
---

# Technical Debt Ledger

The accumulated cost of deliberate shortcuts. The goal is not zero debt, it is
zero untracked debt. Anything recorded here was a conscious choice with a known
fix. Add entries with `/debt-log`. Remove an entry when the debt is paid (note it
in the PR).

### No .gitattributes enforcing LF line endings
- **Date:** 2026-06-06
- **Where:** repo root (.gitattributes absent)
- **What:** The repo has no `.gitattributes`, so some tracked files drifted to CRLF on Windows checkouts (for example `scripts/doctrine/validate-repo-framework.py` and its test were committed CRLF while sibling `.py` files are LF). Endings were normalized ad hoc during the anti-rot work rather than enforced at the source.
- **Risk if left:** CRLF in a tracked `.sh` breaks bash on the Linux CI runner; mixed endings cause noisy diffs and review friction.
- **Suggested fix:** Add a `.gitattributes` with `* text=auto eol=lf` and `*.sh text eol=lf`, then run `git add --renormalize .`. Whitelist `.gitattributes` in the doc-contract R8 root-file allowlist if the contract requires it.
- **Owner:** alawein

### Anti-rot rollout: six repos not yet seeded (dirty at rollout time)
- **Date:** 2026-06-06
- **Where:** `tools/design-system`, `tools/knowledge-base`, `tools/prompty`, `tools/workspace-tools`, `research/edfp`, `research/optiqap`
- **What:** The Phase 7 fleet rollout skipped these six code-archetype repos because they had uncommitted changes (in-flight work) when it ran, to avoid entangling the anti-rot seed with unrelated edits.
- **Risk if left:** The fleet is not 100 percent covered; `validate-repo-framework.py` will report missing anti-rot artifacts for these repos once the rule is enforced.
- **Suggested fix:** Re-run `scripts/ops/rollout-antirot.sh <repo>` on each once its working tree is clean, then commit on a `docs/anti-rot` branch.
- **Owner:** alawein

### Anti-rot rollout staged unmerged; kohyr ADR path not reconciled
- **Date:** 2026-06-06
- **Where:** 24 alawein code repos (`docs/anti-rot` branches, local, unpushed); `kohyr` org
- **What:** The 24 seeded repos hold their `docs/DEBT.md` and `docs/adr/` on local `docs/anti-rot` branches awaiting the maintainer's merge and push. Separately, `kohyr` already uses ADRs (for example ADR-049, ADR-053) but its ADR location was not reconciled to the standard `docs/adr/` path; it was deliberately not force-migrated.
- **Risk if left:** Working trees do not carry the artifacts until the branches merge, so a working-tree doctrine walk still reports them missing; kohyr's ADR convention stays divergent from the fleet standard.
- **Suggested fix:** Merge and push the `docs/anti-rot` branches per the fleet merge policy; separately, confirm kohyr's ADR directory and align it to `docs/adr/` (or record an ADR documenting the divergence).
- **Owner:** alawein
