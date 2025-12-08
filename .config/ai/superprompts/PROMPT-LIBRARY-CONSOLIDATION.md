# Prompt Library Consolidation Prompt

## Objective
Consolidate 100+ prompts across 5+ directories into a unified, versioned, searchable prompt library system.

## Current State
- 100+ prompts scattered across multiple directories
- Multiple directory structures
- Inconsistent naming conventions
- No versioning system
- No categorization system
- Difficult to discover and reuse prompts
- Duplicate prompts with different names

## Target State
- Single unified prompt library
- Clear categorization system
- Versioning and inheritance
- Easy discovery and search
- Minimal duplication
- Reusable prompt components
- Prompt composition framework

## Consolidation Strategy

### Phase 1: Prompt Inventory & Analysis
```
1. Catalog all 100+ prompts
   - Name and location
   - Purpose and use case
   - Content and structure
   - Dependencies
   - Version information

2. Identify prompt categories
   - Architecture prompts
   - Code review prompts
   - Debugging prompts
   - Refactoring prompts
   - Testing prompts
   - Deployment prompts
   - Security prompts
   - Performance prompts
   - Documentation prompts
   - Project-specific prompts

3. Analyze duplication
   - Duplicate prompts
   - Similar prompts
   - Overlapping content
   - Reusable components

4. Map dependencies
   - Prompt dependencies
   - Prompt inheritance
   - Prompt composition
```

### Phase 2: Unified Library Structure
```
Create unified structure:

prompts/
├── README.md
├── CATALOG.md
├── VERSION.md
├── architecture/
│   ├── monorepo-architecture.md
│   ├── microservices-architecture.md
│   ├── api-design.md
│   └── system-design.md
├── code-review/
│   ├── general-code-review.md
│   ├── security-code-review.md
│   ├── performance-code-review.md
│   └── physics-code-review.md
├── debugging/
│   ├── general-debugging.md
│   ├── performance-debugging.md
│   └── security-debugging.md
├── refactoring/
│   ├── general-refactoring.md
│   ├── performance-refactoring.md
│   └── security-refactoring.md
├── testing/
│   ├── unit-testing.md
│   ├── integration-testing.md
│   ├── e2e-testing.md
│   └── performance-testing.md
├── deployment/
│   ├── ci-cd-pipeline.md
│   ├── kubernetes-deployment.md
│   └── serverless-deployment.md
├── security/
│   ├── security-audit.md
│   ├── vulnerability-assessment.md
│   └── compliance-review.md
├── performance/
│   ├── performance-optimization.md
│   ├── gpu-optimization.md
│   └── memory-optimization.md
├── documentation/
│   ├── api-documentation.md
│   ├── architecture-documentation.md
│   └── user-documentation.md
├── project-specific/
│   ├── librex/
│   ├── helios/
│   ├── mezan/
│   ├── talai/
│   ├── llmworks/
│   ├── attributa/
│   ├── qmlab/
│   ├── simcore/
│   ├── liveiticonic/
│   └── repz/
├── system/
│   ├── chain-of-thought-reasoning.md
│   ├── constitutional-ai-alignment.md
│   ├── context-engineering.md
│   ├── state-of-the-art-ai-practices.md
│   └── multi-agent-coordination.md
├── tasks/
│   ├── agentic-code-review.md
│   ├── test-generation.md
│   ├── multi-hop-rag-processing.md
│   └── brainstorming.md
├── components/
│   ├── base-prompt.md
│   ├── analysis-component.md
│   ├── recommendation-component.md
│   └── validation-component.md
└── templates/
    ├── new-prompt-template.md
    ├── superprompt-template.md
    └── task-prompt-template.md
```

### Phase 3: Prompt Versioning System
```
Implement versioning:

1. Version Format
   - MAJOR.MINOR.PATCH
   - MAJOR: Breaking changes
   - MINOR: New features
   - PATCH: Bug fixes

2. Version Metadata
   - Version number
   - Release date
   - Author
   - Changes
   - Compatibility notes

3. Version Management
   - Current version
   - Previous versions
   - Deprecation notices
   - Migration guides

4. Version Control
   - Git tags for versions
   - Changelog documentation
   - Version history
```

### Phase 4: Prompt Composition Framework
```
Create composition system:

1. Base Prompt Components
   - Objective
   - Scope
   - Context
   - Instructions
   - Output format
   - Success criteria

2. Prompt Inheritance
   - Base prompts
   - Specialized prompts
   - Override mechanisms
   - Composition rules

3. Prompt Mixins
   - Security mixin
   - Performance mixin
   - Documentation mixin
   - Testing mixin

4. Prompt Composition
   - Combine base + mixins
   - Override specific sections
   - Validate composition
   - Generate final prompt
```

### Phase 5: Discovery & Search System
```
Implement discovery:

1. Catalog System
   - Searchable catalog
   - Category browsing
   - Tag-based search
   - Full-text search

2. Metadata System
   - Prompt metadata
   - Usage statistics
   - Related prompts
   - Recommendations

3. Documentation
   - Prompt descriptions
   - Use case examples
   - Best practices
   - Common patterns

4. Integration
   - IDE integration
   - CLI tools
   - Web interface
   - API access
```

## Unified Prompt Format

### Prompt Header
```markdown
# Prompt Name

**Version**: 1.0.0  
**Category**: [Category]  
**Tags**: [tag1, tag2, tag3]  
**Author**: [Author]  
**Last Updated**: [Date]  
**Status**: [Active/Deprecated/Beta]  

## Related Prompts
- [Related Prompt 1](link)
- [Related Prompt 2](link)

## Objective
[Clear objective statement]

## Scope
[What is included/excluded]

## Context
[Background information]

## Instructions
[Step-by-step instructions]

## Output Format
[Expected output structure]

## Success Criteria
[How to measure success]

## Examples
[Usage examples]

## Best Practices
[Tips and tricks]

## Common Patterns
[Reusable patterns]

## Troubleshooting
[Common issues and solutions]

## Changelog
- v1.0.0: Initial release
```

## Prompt Catalog Structure

### CATALOG.md
```markdown
# Prompt Catalog

## Architecture Prompts
- [Monorepo Architecture](architecture/monorepo-architecture.md) - v1.0.0
- [Microservices Architecture](architecture/microservices-architecture.md) - v1.0.0
- [API Design](architecture/api-design.md) - v1.0.0

## Code Review Prompts
- [General Code Review](code-review/general-code-review.md) - v1.0.0
- [Security Code Review](code-review/security-code-review.md) - v1.0.0
- [Performance Code Review](code-review/performance-code-review.md) - v1.0.0

[... more categories ...]

## Search Index
[Full-text search index]

## Statistics
- Total Prompts: 100+
- Categories: 10
- Average Version: 1.0.0
- Last Updated: [Date]
```

## Migration Plan

### Step 1: Audit & Categorize
- [ ] Catalog all 100+ prompts
- [ ] Categorize by type
- [ ] Identify duplicates
- [ ] Map dependencies

### Step 2: Create Unified Structure
- [ ] Create directory structure
- [ ] Create templates
- [ ] Create versioning system
- [ ] Create composition framework

### Step 3: Migrate Prompts
- [ ] Migrate architecture prompts
- [ ] Migrate code review prompts
- [ ] Migrate debugging prompts
- [ ] Migrate refactoring prompts
- [ ] Migrate testing prompts
- [ ] Migrate deployment prompts
- [ ] Migrate security prompts
- [ ] Migrate performance prompts
- [ ] Migrate documentation prompts
- [ ] Migrate project-specific prompts

### Step 4: Implement Discovery
- [ ] Create catalog
- [ ] Implement search
- [ ] Create documentation
- [ ] Create examples

### Step 5: Validate & Deploy
- [ ] Validate all prompts
- [ ] Test discovery system
- [ ] Gather feedback
- [ ] Deploy to production

## Success Metrics
- [ ] 60% reduction in prompt files
- [ ] 100% of prompts categorized
- [ ] <5% prompt duplication
- [ ] 100% of prompts documented
- [ ] <2 second search response time
- [ ] Developer satisfaction >8/10

## Rollback Procedures
1. Keep all original prompts in archive
2. Maintain compatibility layer
3. Monitor for issues
4. Rollback if needed
5. Document lessons learned

## Validation Checkpoints
- [ ] All prompts cataloged
- [ ] Structure created
- [ ] Versioning system implemented
- [ ] First batch migrated
- [ ] Discovery system working
- [ ] All prompts migrated
- [ ] Documentation complete