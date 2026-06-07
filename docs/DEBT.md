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
