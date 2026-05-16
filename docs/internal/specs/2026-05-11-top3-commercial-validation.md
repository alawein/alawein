---
type: derived
source: workspace product discovery ranking (commercialization candidates)
sync: none
sla: none
authority: working-note
audience: [contributors, agents]
last_updated: 2026-05-11
category: portfolio
tags: [product-discovery, validation, competitiveness, attributa, llmworks, prompty]
title: Lightweight commercial validation · top-three ranked candidates
---

# Lightweight commercial validation · top three (desk pass)

This note executes the todo **optional-deeper-due-diligence** from the 2026-05-11 product-discovery plan. It assumes the ranked **top three** from that plan: **`attributa`**, **`llmworks`**, **`prompty`**. Evidence is desk-level competitor mapping plus interview framing; no implied revenue forecast or legal review.

Cross-reference: workspace policy and prior audits flagged **truthfulness of live claims** versus README and catalog posture for several repos; outbound messaging must reconcile with observable product behavior before any customer-facing assertions.

---

## Shared customer validation playbook (reuse across all three)

**Target respondent count:** 8 to 12 per wedge (avoid single-source optimism).

**Recruiting filters:** Builders who shipped LLM features in production within 12 months; mix of regulated-adjacent and nonregulated.

**Interview flow (45 minutes)**

1. **Job-to-be-done:** what artifact must be defensible externally (submission, procurement, editorial, SOC2 appendix, regulator packet).
2. **Current stack:** spreadsheets, SaaS vendors, bespoke scripts.
3. **Switching friction:** SSO, tenancy, VPC, model vendor approvals, SOC2 questionnaires.
4. **Willingness to pay probe:** hypothetical annual band for eliminating one outage class.

**Desk outputs:** short decision memo per wedge (fit, wedge statement, risks) before building more surface area.

---

## 1 · attributa (trust · attribution · AI signals)

### Problem hypothesis (commercial)

Teams need audits on deliverables: provenance cues, citation integrity, synthetic or AI-assisted content signals for internal risk review or external submission boxes.

### Competitor framing (partial map)

| Bucket | Representative firms or patterns |
| ------ | ---------------------------------- |
| Cryptographic provenance / C2PA-style | Embedding manifest and rights metadata in assets (sector firms position machine-readable credentials and quote integrity narratives). |
| Statistical AI detection suites | Horizontal vendors marketing multimodal detector APIs and LMS-style integrations at enterprise contract sizes. |
| Enterprise trust platforms | Platforms bundling watermarking narratives with GDPR or regional compliance framing and marketplace distribution. |

**Differentiation wedge to test:** combined “lightweight assurance report” spanning citation or CWE-inspired checks plus provenance cues, **privacy-first posture** emphasized in catalog copy versus pure detection-score APIs.

### Customer validation probes

- Ask for recent incident where attribution ambiguity blocked a publication, partner review, or security review gate.
- Ask whether cryptographic provenance mandates exist in their funnel (media, defense, regulated publishing).

### Competitive risk

Crowded narratives; differentiation lives in **narrow ICP**, honest accuracy bounds for detectors, and **claims discipline** aligned with outbound copy (see companion compliance gates note).

---

## 2 · llmworks (eval · benchmarking · security-adjacent testing)

### Problem hypothesis (commercial)

Squads repeat one-off regressions across model swaps; fewer have continuous jailbreak-inspired suites wired to CI with shareable attestations.

### Competitor framing (partial map)

| Pattern | Capability emphasis |
| ------- | ------------------- |
| OSS-first red-team CI | Automated adversarial probes, CI integration paths, Fortune-scale adoption narratives. |
| Evaluation + observability | Synthetic data, regression detection, dashboards; often broader than narrow security benchmarking. |
| Agent security scanners | Specialized probe libraries tuned to agents and leakage classes. |

**Differentiation wedge to test:** “security regression benchmarking as a repeatable product artifact” tighter than horizontal observability, coupled with transparent methodology cards.

### Customer validation probes

- Model change frequency and who owns the eval budget line item.
- Whether procurement requires enumerated control mapping (for example OWASP LLM-informed language without overclaim).

### Competitive risk

Model vendor Terms of Use; reproducibility burdens; misuse of benchmarks as comparative marketing absent statistical discipline.

---

## 3 · prompty (prompt design · versioning · eval in monorepo context)

### Problem hypothesis (commercial)

Growing teams collapse when prompt deltas are only in repo PRs without golden-set regressions comparable across services.

### Competitor framing (partial map)

| Pattern | Capability emphasis |
| ------- | ------------------- |
| Hosted registries | Version labels, evaluations, workspaces; strong collaboration affordances. |
| Ecosystem-coupled observability | Tight coupling to specific agent stacks; SSO and VPC options for enterprise tiers. |
| Experimentation hybrids | Platforms blending experiments, prompts, evaluations; enterprise security positioning. |

**Differentiation wedge to test:** “monorepo-native prompt workflows” meaning diff review in Git-shaped developer flows plus hosted eval runner tenancy; credible only after one hero packaged app emerges.

### Customer validation probes

- Where canonical prompt truth lives today (Git versus vendor UI).
- How golden sets stay synchronized across locales and model vendors.

### Competitive risk

Feature overlap with incumbent registries unless ICP narrows sharply; outbound must avoid fuzzy “we do everything” positioning.

---

## Next desk steps (recommended)

| Candidate | Narrow ICP hypothesis to falsify next | Artifact |
| --------- | --------------------------------------- | -------- |
| attributa | Mid-market SaaS editorial plus security reviewer sign-off cadence | One-page teardown versus two provenance vendors plus one detector vendor |
| llmworks | Platform teams swapping models monthly | Scripted CI eval demo storyline |
| prompty | Series B app teams with Turborepo or multi-package agents | Guided tour of hero package plus pricing imagination test |

_No product repository source files were edited for this note._
