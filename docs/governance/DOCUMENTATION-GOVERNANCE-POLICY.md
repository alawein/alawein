---
document_metadata:
  title: "Documentation Governance Policy"
  document_id: "GOV-DOC-001"
  version: "1.0.0"
  status: "Active"
  classification: "Internal"
  
  dates:
    created: "2025-12-07"
    last_updated: "2025-12-07"
    next_review: "2026-03-07"
    
  ownership:
    owner: "Documentation Team"
    maintainer: "Meshaal Alawein"
    reviewers: ["Engineering Lead", "Product Manager"]
    
  change_summary: |
    Initial creation of documentation governance policy establishing
    mandatory standards for all documentation including date stamps,
    standardized headers, version control, and ownership assignments.
    
  llm_context:
    purpose: "Establishes organization-wide documentation standards and governance"
    scope: "All documentation in the Alawein Technologies monorepo"
    key_concepts: ["governance", "documentation standards", "version control", "LLM optimization"]
    related_documents: ["DOCUMENTATION-AUDIT-REPORT.md", "DOCUMENT-TEMPLATE.md"]
---

# Documentation Governance Policy

## Executive Summary

This policy establishes mandatory standards for all documentation within the Alawein Technologies monorepo. It defines requirements for date stamps, standardized headers optimized for LLM comprehension, version control protocols, and clear ownership assignments.

**Effective Date:** 2025-12-07  
**Policy Owner:** Documentation Team  
**Review Cycle:** Quarterly

---

## 1. Scope and Applicability

### 1.1 Covered Documentation

This policy applies to ALL documentation including:

| Category | Examples | Location |
|----------|----------|----------|
| **Technical Docs** | Architecture, API references, deployment guides | `docs/` |
| **Operational Docs** | Runbooks, procedures, checklists | `docs/operations/` |
| **Security Docs** | Security policies, implementation guides | `docs/security/` |
| **Project Docs** | READMEs, changelogs, contributing guides | Project roots |
| **Governance Docs** | Policies, standards, compliance | `docs/governance/` |

### 1.2 Exclusions

- Auto-generated documentation (API docs from code comments)
- Third-party documentation
- Temporary working documents (must be deleted within 30 days)

---

## 2. Mandatory Document Header Standard

### 2.1 YAML Frontmatter Requirement

**ALL documentation MUST include a YAML frontmatter header** with the following structure:

```yaml
---
document_metadata:
  # REQUIRED: Document identification
  title: "Human-readable document title"
  document_id: "CATEGORY-TYPE-NNN"  # e.g., "SEC-IMPL-001"
  version: "MAJOR.MINOR.PATCH"       # Semantic versioning
  status: "Draft|Active|Deprecated|Archived"
  classification: "Public|Internal|Confidential"
  
  # REQUIRED: Date tracking (ISO 8601 format)
  dates:
    created: "YYYY-MM-DD"
    last_updated: "YYYY-MM-DD"
    next_review: "YYYY-MM-DD"
    
  # REQUIRED: Ownership and accountability
  ownership:
    owner: "Team or individual name"
    maintainer: "Primary maintainer name"
    reviewers: ["Reviewer 1", "Reviewer 2"]
    
  # REQUIRED: Change summary for each update
  change_summary: |
    Brief description of what changed in this revision.
    Must be updated with EVERY modification.
    
  # REQUIRED: LLM optimization context
  llm_context:
    purpose: "One-sentence description of document purpose"
    scope: "What systems/processes this document covers"
    key_concepts: ["concept1", "concept2", "concept3"]
    related_documents: ["doc1.md", "doc2.md"]
---
```

### 2.2 Document ID Convention

Document IDs follow the pattern: `CATEGORY-TYPE-NNN`

| Category Code | Meaning |
|---------------|---------|
| `GOV` | Governance |
| `SEC` | Security |
| `DEP` | Deployment |
| `OPS` | Operations |
| `DEV` | Development |
| `API` | API Documentation |
| `ARC` | Architecture |
| `PRJ` | Project-specific |

| Type Code | Meaning |
|-----------|---------|
| `POL` | Policy |
| `STD` | Standard |
| `GDE` | Guide |
| `RUN` | Runbook |
| `REF` | Reference |
| `RPT` | Report |
| `CHK` | Checklist |

**Examples:**
- `GOV-POL-001` - Governance Policy #1
- `SEC-GDE-003` - Security Guide #3
- `DEP-RUN-002` - Deployment Runbook #2

### 2.3 Status Definitions

| Status | Definition | Actions Allowed |
|--------|------------|-----------------|
| **Draft** | Under development, not authoritative | Edit freely |
| **Active** | Current, authoritative version | Edit with review |
| **Deprecated** | Superseded, do not use for new work | Read-only, add deprecation notice |
| **Archived** | Historical reference only | Move to archive folder |

---

## 3. Date Stamp Requirements

### 3.1 Mandatory Dates

Every document MUST include:

1. **Created Date** - When the document was first created
2. **Last Updated Date** - When the document was last modified
3. **Next Review Date** - When the document must be reviewed

### 3.2 Review Cycles

| Document Type | Review Cycle | Maximum Age Before Stale |
|---------------|--------------|--------------------------|
| Security policies | 90 days | 120 days |
| Deployment guides | 90 days | 120 days |
| Architecture docs | 180 days | 240 days |
| Operational runbooks | 90 days | 120 days |
| General documentation | 180 days | 365 days |

### 3.3 Stale Document Policy

Documents exceeding their maximum age:
1. Are flagged in automated audits
2. Must be reviewed within 14 days of flagging
3. If not reviewed, status changes to "Deprecated"
4. After 30 additional days, moved to archive

---

## 4. Change Summary Requirements

### 4.1 Update Documentation

Every modification MUST include:

1. **Updated `last_updated` date**
2. **Updated `change_summary`** describing:
   - What was changed
   - Why it was changed
   - Impact of the change

### 4.2 Change Summary Format

```yaml
change_summary: |
  [YYYY-MM-DD] Brief description of changes
  - Added: New section on X
  - Modified: Updated Y to reflect current process
  - Removed: Deprecated Z section
  - Fixed: Corrected error in step 3
```

### 4.3 Version Increment Rules

| Change Type | Version Increment | Example |
|-------------|-------------------|---------|
| Major restructure, breaking changes | MAJOR | 1.0.0 → 2.0.0 |
| New sections, significant updates | MINOR | 1.0.0 → 1.1.0 |
| Typos, clarifications, minor fixes | PATCH | 1.0.0 → 1.0.1 |

---

## 5. LLM Optimization Requirements

### 5.1 Purpose

The `llm_context` section enables AI assistants to:
- Quickly understand document purpose and scope
- Identify relevant documents for queries
- Provide accurate, contextual responses
- Navigate document relationships

### 5.2 Required Fields

| Field | Purpose | Example |
|-------|---------|---------|
| `purpose` | One-sentence document purpose | "Defines security implementation standards" |
| `scope` | Systems/processes covered | "All production deployments" |
| `key_concepts` | Searchable terms (3-7) | ["authentication", "CSRF", "rate limiting"] |
| `related_documents` | Linked documents | ["SECURITY.md", "API-GUIDE.md"] |

### 5.3 Writing for LLM Comprehension

1. **Use clear, descriptive headings** - LLMs use headings for navigation
2. **Include explicit section summaries** - First paragraph should summarize section
3. **Use consistent terminology** - Define terms and use them consistently
4. **Provide concrete examples** - Code blocks, tables, and examples aid understanding
5. **Cross-reference explicitly** - Use full document names, not "see above"

---

## 6. Document Ownership and Accountability

### 6.1 Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Owner** | Strategic direction, approval of major changes, escalation point |
| **Maintainer** | Day-to-day updates, ensuring accuracy, responding to feedback |
| **Reviewers** | Periodic review, technical accuracy validation |

### 6.2 Ownership Assignment Rules

1. Every document MUST have an assigned owner and maintainer
2. Owner and maintainer may be the same person
3. At least one reviewer must be assigned
4. Ownership transfers must be documented in change summary

### 6.3 Accountability Matrix

| Document Category | Default Owner | Default Maintainer |
|-------------------|---------------|-------------------|
| Security | Security Team | Security Engineer |
| Deployment | DevOps Team | DevOps Engineer |
| Architecture | Engineering Lead | Senior Engineer |
| Operations | Operations Team | SRE |
| Project-specific | Project Lead | Project Developer |

---

## 7. Version Control Protocols

### 7.1 Git Commit Requirements

Documentation changes MUST follow commit conventions:

```
docs(scope): brief description

- Detailed change 1
- Detailed change 2

Document-ID: GOV-POL-001
Version: 1.0.0 → 1.1.0
```

### 7.2 Branch Strategy

| Branch Type | Purpose | Naming |
|-------------|---------|--------|
| `main` | Production documentation | - |
| `docs/*` | Documentation updates | `docs/update-security-guide` |
| `docs/review/*` | Major revisions requiring review | `docs/review/architecture-v2` |

### 7.3 Review Requirements

| Change Type | Review Required |
|-------------|-----------------|
| New document | 1 reviewer minimum |
| Major update (MAJOR/MINOR version) | 1 reviewer minimum |
| Minor update (PATCH version) | Self-review acceptable |
| Security documentation | Security team review required |

---

## 8. Document Lifecycle Management

### 8.1 Creation Process

1. Use document template (`DOCUMENT-TEMPLATE.md`)
2. Assign document ID
3. Complete all required header fields
4. Submit for review
5. Merge to main branch

### 8.2 Update Process

1. Create branch from main
2. Update content
3. Update header metadata (dates, version, change_summary)
4. Submit for review if required
5. Merge to main branch

### 8.3 Deprecation Process

1. Update status to "Deprecated"
2. Add deprecation notice at top of document
3. Link to replacement document if applicable
4. Set archive date (30 days from deprecation)

### 8.4 Archive Process

1. Move document to `docs/archive/` folder
2. Update status to "Archived"
3. Remove from navigation/indexes
4. Retain for historical reference

---

## 9. Compliance and Enforcement

### 9.1 Automated Validation

The following checks run automatically:

| Check | Frequency | Action on Failure |
|-------|-----------|-------------------|
| Header validation | Every commit | Block merge |
| Date freshness | Weekly | Create issue |
| Broken links | Weekly | Create issue |
| Orphaned documents | Monthly | Flag for review |

### 9.2 Manual Audits

| Audit Type | Frequency | Scope |
|------------|-----------|-------|
| Full documentation audit | Quarterly | All documents |
| Security documentation review | Monthly | Security docs only |
| Accuracy validation | Per review cycle | Documents due for review |

### 9.3 Non-Compliance Consequences

1. **First occurrence:** Warning and 7-day remediation period
2. **Second occurrence:** Escalation to document owner
3. **Third occurrence:** Escalation to team lead
4. **Persistent non-compliance:** Process improvement review

---

## 10. Document Consolidation Rules

### 10.1 Canonical Document Principle

**One topic = One authoritative document**

When multiple documents cover the same topic:
1. Identify the most complete/accurate version
2. Merge unique content from other versions
3. Deprecate redundant documents
4. Update all references to point to canonical document

### 10.2 Document Location Standards

| Document Type | Canonical Location |
|---------------|-------------------|
| Security implementation | `docs/security/SECURITY-IMPLEMENTATION.md` |
| Deployment guides | `docs/deployment/` |
| Operations runbooks | `docs/operations/` |
| Architecture decisions | `docs/architecture/` |
| Governance policies | `docs/governance/` |
| Project READMEs | Project root |

### 10.3 Prohibited Duplication

The following MUST NOT be duplicated:
- Security policies (single source of truth)
- Deployment procedures (single authoritative guide)
- Architecture decisions (ADR format, single location)
- Governance policies (this document is authoritative)

---

## 11. Retention and Archival Policy

### 11.1 Retention Periods

| Document Type | Active Retention | Archive Retention |
|---------------|------------------|-------------------|
| Policies | Until superseded | 7 years |
| Procedures | Until superseded | 3 years |
| Reports | 1 year | 5 years |
| Meeting notes | 90 days | 1 year |
| Temporary docs | 30 days | Not archived |

### 11.2 Archive Structure

```
docs/archive/
├── YYYY/
│   ├── governance/
│   ├── security/
│   ├── deployment/
│   └── operations/
```

### 11.3 Deletion Criteria

Documents may be permanently deleted when:
1. Archive retention period has expired
2. Document contains no historical value
3. Deletion is approved by document owner
4. No legal or compliance hold exists

---

## 12. Implementation Timeline

### Phase 1: Immediate (Week 1)
- [ ] Publish this governance policy
- [ ] Create document template
- [ ] Identify all existing documentation

### Phase 2: Audit (Week 2)
- [ ] Complete documentation audit
- [ ] Identify duplicates and obsolete documents
- [ ] Create consolidation plan

### Phase 3: Remediation (Weeks 3-4)
- [ ] Add headers to all active documents
- [ ] Consolidate duplicate documents
- [ ] Archive obsolete documents
- [ ] Assign ownership to all documents

### Phase 4: Automation (Week 5+)
- [ ] Implement automated header validation
- [ ] Set up freshness monitoring
- [ ] Configure broken link checking
- [ ] Establish review reminders

---

## Appendix A: Document Template

See [`DOCUMENT-TEMPLATE.md`](./DOCUMENT-TEMPLATE.md) for the standard document template.

## Appendix B: Audit Report

See [`DOCUMENTATION-AUDIT-REPORT.md`](./DOCUMENTATION-AUDIT-REPORT.md) for the current audit findings.

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Canonical Document** | The single authoritative source for a topic |
| **Document Owner** | Person accountable for document accuracy and relevance |
| **Maintainer** | Person responsible for day-to-day document updates |
| **Stale Document** | Document that has exceeded its review cycle |
| **LLM Context** | Metadata optimized for AI assistant comprehension |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-07 | Documentation Team | Initial policy creation |

---

*This policy is effective immediately upon publication and supersedes all previous documentation standards.*
