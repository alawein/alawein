# Brief: Current GitHub Structure for Claude Opus

**Context:** You previously provided a comprehensive guide on LLCs, DBAs, and repository structure. Here's what has been implemented and the current state.

---

## Current Legal Structure (Planned)

```text
ALAWEIN TECHNOLOGIES LLC (Delaware)     REPZ LLC (Delaware)
├── Librex (optimization)           └── Repz (AI fitness app)
├── MEZAN (orchestration)
├── TalAI (25+ AI tools)
├── HELIOS (research platform)
├── SciLab (5 physics tools)
└── Quantum Scout (quantum research)
```

**Why two LLCs?**
- Repz = consumer fitness app = liability risk (health claims)
- Enterprise products = different audience, different risk profile

---

## GitHub Organizations (4 total)

| Org | Purpose | Status |
|-----|---------|--------|
| `AlaweinOS` | Enterprise products | Active - main org |
| `alaweimm90-science` | Scientific tools | Active |
| `alaweimm90-business` | Consumer apps | Active (Repz) |
| `MeatheadPhysicist` | Quantum research | Active |

**Recommendation from analysis:** Consolidate to 2 orgs (AlaweinLabs + personal)

---

## Root Repository Structure

```text
GitHub/
├── organizations/          # All cloned org repos
│   ├── AlaweinOS/
│   │   ├── Librex/    # Renamed from Optilibria ✓
│   │   ├── MEZAN/
│   │   ├── TalAI/
│   │   ├── HELIOS/
│   │   └── Foundry/
│   ├── alaweimm90-science/
│   ├── alaweimm90-business/
│   └── MeatheadPhysicist/
├── automation/             # AI orchestration (prompts, agents, workflows)
├── tools/                  # Shared utilities
├── business/               # LLC & strategy docs
├── docs/                   # Documentation
└── .archive/               # Historical files
```

---

## Key Products (Revenue Priority)

| Product | Price | Status |
|---------|-------|--------|
| TalAI AdversarialReview | $79/mo | Ready to launch |
| TalAI GrantWriter | $199/mo | Ready |
| Librex Enterprise | $10K+/license | Beta |
| Repz | $9.99/mo | Development |

---

## What's Been Done

1. ✅ Renamed `Optilibria` → `Librex` (100+ files updated)
2. ✅ Decided Repz = separate LLC from day 1
3. ✅ Cleaned up root directory (archived chat exports, planning docs)
4. ✅ Created `STRUCTURE.md` overview
5. ✅ Created `business/` folder for LLC docs

---

## What's Needed Next

1. [ ] Register domains: `alawein.tech`, `Librex.dev`, `repz.app`
2. [ ] Form Alawein Technologies LLC (Delaware)
3. [ ] Form Repz LLC (Delaware)
4. [ ] Create portfolio landing page
5. [ ] Launch first product (TalAI AdversarialReview)

---

## Questions for You

1. **GitHub org consolidation:** Should we rename `AlaweinOS` → `AlaweinLabs` and migrate `alaweimm90-*` repos there?

2. **MeatheadPhysicist:** Keep as separate brand or rebrand to "Quantum Scout" under main org?

3. **Website architecture:** Single portfolio site (`alawein.tech`) with subdomains, or separate domains per product?

4. **DBA vs separate LLCs:** For TalAI, HELIOS, SciLab - should these be DBAs under Alawein Technologies LLC, or does each need its own entity eventually?

---

## Portfolio Metrics

- **Total products:** 40+
- **Lines of code:** 100,000+
- **Estimated value:** $12-27M
- **Current revenue:** $0 (pre-launch)
- **Target:** First revenue in 3 months
