---
document_metadata:
  # ============================================================
  # DOCUMENT IDENTIFICATION (Required)
  # ============================================================
  title: '[Document Title - Clear and Descriptive]'
  document_id: '[CATEGORY-TYPE-NNN]' # e.g., SEC-GDE-001
  version: '1.0.0'
  status: 'Draft' # Draft | Active | Deprecated | Archived
  classification: 'Internal' # Public | Internal | Confidential

  # ============================================================
  # DATE TRACKING (Required - ISO 8601 format)
  # ============================================================
  dates:
    created: 'YYYY-MM-DD'
    last_updated: 'YYYY-MM-DD'
    next_review: 'YYYY-MM-DD' # Created date + review cycle

  # ============================================================
  # OWNERSHIP AND ACCOUNTABILITY (Required)
  # ============================================================
  ownership:
    owner: '[Team or Individual Name]'
    maintainer: '[Primary Maintainer Name]'
    reviewers: ['[Reviewer 1]', '[Reviewer 2]']

  # ============================================================
  # CHANGE SUMMARY (Required - Update with EVERY modification)
  # ============================================================
  change_summary: |
    [YYYY-MM-DD] Initial document creation
    - Created: [Brief description of initial content]

  # ============================================================
  # LLM OPTIMIZATION CONTEXT (Required)
  # ============================================================
  llm_context:
    purpose: '[One-sentence description of what this document does]'
    scope: '[What systems, processes, or areas this document covers]'
    key_concepts: ['[concept1]', '[concept2]', '[concept3]']
    related_documents: ['[related-doc-1.md]', '[related-doc-2.md]']
last_verified: 2025-12-09
---

# [Document Title]

> **Summary:** [One paragraph executive summary of the document. This should
> give readers (human or AI) a complete understanding of what this document
> covers and its key takeaways.]

## Quick Reference

| Attribute        | Value                              |
| ---------------- | ---------------------------------- |
| **Document ID**  | [CATEGORY-TYPE-NNN]                |
| **Status**       | [Draft/Active/Deprecated/Archived] |
| **Owner**        | [Owner Name]                       |
| **Last Updated** | [YYYY-MM-DD]                       |
| **Next Review**  | [YYYY-MM-DD]                       |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Section Two](#2-section-two)
3. [Section Three](#3-section-three)
4. [Related Resources](#related-resources)
5. [Document History](#document-history)

---

## 1. Overview

### 1.1 Purpose

[Explain the purpose of this document. What problem does it solve? Who is the
intended audience?]

### 1.2 Scope

[Define what is covered and what is explicitly NOT covered by this document.]

### 1.3 Prerequisites

[List any prerequisites, required knowledge, or dependencies.]

- Prerequisite 1
- Prerequisite 2
- Prerequisite 3

---

## 2. Section Two

### 2.1 Subsection

[Content for this subsection. Use clear, concise language.]

#### Key Points

- Point 1
- Point 2
- Point 3

### 2.2 Another Subsection

[Additional content. Include examples where helpful.]

**Example:**

```language
// Code example with comments
example_code_here();
```

---

## 3. Section Three

### 3.1 Subsection

[Content organized logically with clear headings.]

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

### 3.2 Subsection

[Continue with well-structured content.]

> **Note:** Important notes should be highlighted like this.

> **Warning:** Warnings should be clearly visible.

> **Tip:** Helpful tips can be formatted this way.

---

## Related Resources

### Internal Documents

- [`Document Name`](./path/to/document.md) - Brief description
- [`Another Document`](./path/to/another.md) - Brief description

### External Resources

- [External Resource Name](https://example.com) - Brief description

---

## Document History

| Version | Date       | Author        | Changes                   |
| ------- | ---------- | ------------- | ------------------------- |
| 1.0.0   | YYYY-MM-DD | [Author Name] | Initial document creation |

---

## Appendix A: [Appendix Title]

[Optional appendix content for supplementary information.]

---

_Document ID: [CATEGORY-TYPE-NNN] | Version: 1.0.0 | Classification: Internal_

# <!--

# TEMPLATE USAGE INSTRUCTIONS (Delete this section when using)

1. COPY this template to create a new document
2. REPLACE all bracketed placeholders [like this]
3. UPDATE the YAML frontmatter with actual values
4. REMOVE sections that don't apply to your document
5. ADD sections as needed for your content
6. DELETE this instruction block

DOCUMENT ID FORMAT:

- Category: GOV, SEC, DEP, OPS, DEV, API, ARC, PRJ
- Type: POL, STD, GDE, RUN, REF, RPT, CHK
- Number: 001-999

REVIEW CYCLES:

- Security docs: 90 days
- Deployment docs: 90 days
- Architecture docs: 180 days
- Operations docs: 90 days
- General docs: 180 days

VERSION INCREMENTS:

- MAJOR: Breaking changes, major restructure
- MINOR: New sections, significant updates
- PATCH: Typos, clarifications, minor fixes

============================================================ -->
