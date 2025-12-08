# Dependency Mapping Prompt

## Objective
Map all project and system dependencies to identify coupling and abstraction opportunities.

## Mapping Framework

### Inter-Project Dependencies
- Project A depends on Project B
- Shared utilities
- Common libraries
- Cross-project references

### External Dependencies
- NPM packages
- Python packages
- System libraries
- Third-party services

### Circular Dependencies
- A → B → A
- Complex cycles
- Tight coupling
- Refactoring opportunities

### Dependency Graph
- Visual representation
- Dependency chains
- Critical paths
- Bottlenecks

## Analysis

### Coupling Analysis
- Tight coupling areas
- Loose coupling areas
- Abstraction gaps
- Interface opportunities

### Abstraction Opportunities
- Shared interfaces
- Common abstractions
- Reusable components
- Utility libraries

## Output Format

### Dependency Report
- Dependency graph
- Circular dependencies
- Coupling analysis
- Abstraction opportunities
- Refactoring recommendations

### Metrics
- Total dependencies: [count]
- Circular dependencies: [count]
- Coupling score: [0-10]
- Abstraction gaps: [count]

## Success Criteria
- [ ] All dependencies mapped
- [ ] Circular dependencies identified
- [ ] Coupling analyzed
- [ ] Abstraction opportunities listed