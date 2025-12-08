# Repository Structure Audit Prompt

## Objective
Perform comprehensive audit of the Alawein Technologies monorepo structure to identify redundancies, inefficiencies, and consolidation opportunities.

## Scope
- Directory structure analysis
- File organization patterns
- Project dependencies
- Configuration distribution
- Documentation placement
- Tooling locations

## Analysis Framework

### 1. Directory Structure Analysis
```
Analyze:
- Root-level organization
- Organization-level structure
- Project-level structure
- Module-level structure
- Utility-level structure

Identify:
- Redundant directories
- Unclear naming patterns
- Deep nesting issues
- Scattered related files
- Orphaned directories
```

### 2. File Organization Patterns
```
Categorize files by:
- Type (config, code, docs, tests, scripts)
- Purpose (build, deploy, test, lint, etc.)
- Ownership (project, org, global)
- Frequency of change
- Interdependencies

Identify:
- Duplicate files
- Similar files with different names
- Files in wrong locations
- Orphaned files
- Dead code
```

### 3. Project Dependencies
```
Map:
- Inter-project dependencies
- External dependencies
- Shared utilities
- Common patterns
- Reusable components

Identify:
- Circular dependencies
- Unnecessary dependencies
- Missing abstractions
- Tight coupling
- Opportunities for shared libraries
```

### 4. Configuration Distribution
```
Inventory:
- All configuration files
- Configuration formats
- Configuration locations
- Configuration inheritance
- Environment-specific configs

Identify:
- Duplicate configurations
- Inconsistent formats
- Missing centralization
- Configuration drift
- Opportunities for consolidation
```

### 5. Documentation Placement
```
Catalog:
- All documentation files
- Documentation types
- Documentation locations
- Documentation formats
- Documentation currency

Identify:
- Scattered documentation
- Duplicate documentation
- Outdated documentation
- Missing documentation
- Opportunities for centralization
```

### 6. Tooling Locations
```
Inventory:
- All tools and scripts
- Tool purposes
- Tool locations
- Tool dependencies
- Tool usage patterns

Identify:
- Duplicate tools
- Scattered tools
- Unused tools
- Tool interdependencies
- Opportunities for consolidation
```

## Output Format

### Executive Summary
- Total files analyzed
- Key findings (top 5)
- Consolidation opportunities (top 10)
- Risk assessment
- Recommended next steps

### Detailed Findings

#### Directory Structure
- Current state diagram
- Issues identified
- Recommendations
- Impact assessment

#### File Organization
- File count by type
- Distribution analysis
- Duplication report
- Organization recommendations

#### Dependencies
- Dependency graph
- Circular dependencies
- Coupling analysis
- Abstraction opportunities

#### Configuration
- Configuration inventory
- Format analysis
- Centralization opportunities
- Standardization recommendations

#### Documentation
- Documentation inventory
- Coverage analysis
- Consolidation opportunities
- Standardization recommendations

#### Tooling
- Tool inventory
- Usage analysis
- Consolidation opportunities
- Integration recommendations

### Consolidation Opportunities
1. [Opportunity]: [Current State] → [Proposed State]
   - Impact: [Files affected, complexity, risk]
   - Benefit: [Reduction, clarity, maintainability]
   - Effort: [Estimated hours]

### Risk Assessment
- High-risk consolidations
- Mitigation strategies
- Rollback procedures
- Validation checkpoints

### Recommendations
1. [Priority 1]: [Action]
2. [Priority 2]: [Action]
3. [Priority 3]: [Action]

## Metrics to Track
- Total files: [count]
- Total directories: [count]
- Duplication ratio: [%]
- Configuration files: [count]
- Documentation files: [count]
- Tool files: [count]
- Average directory depth: [number]
- Largest directory: [path] ([file count])
- Most duplicated patterns: [list]

## Success Criteria
- [ ] All directories analyzed
- [ ] All files categorized
- [ ] Dependencies mapped
- [ ] Consolidation opportunities identified
- [ ] Risk assessment completed
- [ ] Recommendations prioritized
- [ ] Metrics calculated
- [ ] Report generated