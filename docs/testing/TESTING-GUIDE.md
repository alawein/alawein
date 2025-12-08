# Testing Guide - Alawein Technologies Monorepo

**Last Updated**: 2024  
**Status**: Active  
**Test Framework**: Vitest 3.2.4  

---

## 📋 Overview

This guide provides comprehensive information about testing in the Alawein Technologies monorepo. We use Vitest as our primary testing framework for TypeScript/JavaScript tests and pytest for Python tests.

---

## 🎯 Test Structure

### Directory Organization

```
tests/
├── ai/                          # AI tools tests (114 tests)
│   ├── cache.test.ts           # Cache functionality (13 tests)
│   ├── compliance.test.ts      # Compliance checks (18 tests)
│   ├── errors.test.ts          # Error handling (17 tests)
│   ├── index.test.ts           # Main AI tools (19 tests)
│   ├── issues.test.ts          # Issue tracking (21 tests)
│   ├── monitor.test.ts         # Monitoring (23 tests)
│   └── security.test.ts        # Security (21 tests)
├── atlas/                       # Atlas service tests (20 tests)
│   ├── services/
│   │   └── optimizer.test.ts   # Optimizer (19 tests)
│   └── utils/
│       └── testing-framework.test.ts  # Framework (1 test)
├── e2e/                         # End-to-end tests (6 tests)
│   └── api-endpoints.test.ts   # API endpoints
├── integration/                 # Integration tests (12 tests)
│   └── mcp-servers.test.ts     # MCP servers
├── unit/                        # Unit tests (11 tests)
│   └── websocket.test.ts       # WebSocket
├── devops_cli.test.ts          # DevOps CLI (3 tests)
├── devops_coder.test.ts        # DevOps coder (4 tests)
├── devops_config.test.ts       # DevOps config (12 tests)
├── devops_validate.test.ts     # DevOps validation (7 tests)
├── meta-cli.test.ts            # Meta CLI (14 tests)
├── test_*.py                   # Python tests (18 tests)
├── conftest.py                 # Pytest configuration
└── README.md                   # Test documentation
```

**Total**: 17 TypeScript test files, 6 Python test files, 221 total tests

---

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests
npm test

# Run tests once (no watch mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Vitest Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/ai/cache.test.ts

# Run tests matching pattern
npm test -- --grep "cache"

# Run tests with UI
npm test -- --ui

# Run tests with coverage
npm run test:coverage

# Run tests in specific directory
npm test -- tests/ai/
```

### Python Tests

```bash
# Run all Python tests
pytest tests/

# Run specific Python test
pytest tests/test_catalog.py

# Run with coverage
pytest --cov=. tests/

# Run with verbose output
pytest -v tests/
```

---

## ⚙️ Configuration

### Vitest Configuration

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'automation/**/*.test.ts'],
    exclude: ['tests/**/*.py', 'tests/__pycache__/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '*.config.*'],
    },
  },
});
```

**Key Features**:
- **Environment**: Node.js
- **Globals**: Enabled (describe, it, expect available globally)
- **Coverage**: V8 provider with text, JSON, and HTML reports
- **Test Patterns**: `**/*.test.ts` and `**/*.spec.ts`

### Enhanced Configuration Available

**File**: `vitest.config.enhanced.ts`

Enhanced configuration with additional features:
- jsdom environment for browser-like testing
- 90% coverage thresholds
- Path aliases (@, @llcs, @research, etc.)
- Advanced reporters
- Performance optimizations

**Note**: Requires `jsdom` package. Available for future use.

---

## 📊 Test Categories

### 1. AI Tools Tests (114 tests)
**Location**: `tests/ai/`  
**Coverage**: AI tooling, cache, compliance, errors, issues, monitoring, security

**Example**:
```typescript
import { describe, it, expect } from 'vitest';

describe('AI Cache', () => {
  it('should cache results', () => {
    // Test implementation
  });
});
```

### 2. DevOps Tests (26 tests)
**Location**: `tests/devops_*.test.ts`  
**Coverage**: CLI, code generation, configuration, validation

### 3. Meta CLI Tests (14 tests)
**Location**: `tests/meta-cli.test.ts`  
**Coverage**: CLI commands, help, error handling

### 4. Atlas Tests (20 tests)
**Location**: `tests/atlas/`  
**Coverage**: Service optimization, testing framework

### 5. Integration Tests (12 tests)
**Location**: `tests/integration/`  
**Coverage**: MCP server integration

### 6. E2E Tests (6 tests)
**Location**: `tests/e2e/`  
**Coverage**: API endpoints

### 7. Unit Tests (11 tests)
**Location**: `tests/unit/`  
**Coverage**: WebSocket functionality

### 8. Python Tests (18 tests)
**Location**: `tests/test_*.py`  
**Coverage**: Catalog, checkpoint, enforcement, meta

---

## 📈 Coverage

### Current Coverage

Run coverage report:
```bash
npm run test:coverage
```

Coverage reports are generated in:
- **Text**: Console output
- **JSON**: `coverage/coverage-final.json`
- **HTML**: `coverage/index.html`

### Coverage Thresholds

Current configuration does not enforce thresholds. Enhanced configuration includes:
- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 90%
- **Statements**: 90%

---

## ✅ Best Practices

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('Specific Functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      // Test edge cases
    });
  });
});
```

### Naming Conventions

- **Test Files**: `*.test.ts` or `*.spec.ts`
- **Test Suites**: Descriptive names (e.g., "AI Cache", "DevOps CLI")
- **Test Cases**: Start with "should" (e.g., "should cache results")

### Test Organization

1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the code under test
3. **Assert**: Verify the results

### Mocking

```typescript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();

// Mock a module
vi.mock('./module', () => ({
  default: vi.fn(),
}));

// Spy on a method
const spy = vi.spyOn(object, 'method');
```

---

## 🔍 Debugging Tests

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--run"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Console Debugging

```typescript
import { describe, it } from 'vitest';

describe('Debug Test', () => {
  it('should debug', () => {
    console.log('Debug output');
    debugger; // Breakpoint
  });
});
```

---

## 📝 Writing New Tests

### 1. Create Test File

```bash
# Create test file
touch tests/feature.test.ts
```

### 2. Write Test

```typescript
import { describe, it, expect } from 'vitest';
import { featureFunction } from '../src/feature';

describe('Feature', () => {
  it('should work correctly', () => {
    const result = featureFunction('input');
    expect(result).toBe('expected');
  });
});
```

### 3. Run Test

```bash
npm test -- tests/feature.test.ts
```

---

## 🎯 Test Performance

### Current Performance

- **Total Duration**: 31.58 seconds
- **Test Files**: 17 files
- **Tests**: 221 tests
- **Average per Test**: 163ms

### Performance Tips

1. **Use `beforeEach` wisely**: Only set up what's needed
2. **Mock external dependencies**: Avoid real API calls
3. **Parallel execution**: Vitest runs tests in parallel by default
4. **Isolate tests**: Each test should be independent

---

## 🔧 Troubleshooting

### Common Issues

#### Tests Not Found
```bash
# Check test pattern
npm test -- --reporter=verbose
```

#### Import Errors
```bash
# Check tsconfig.json paths
# Verify module resolution
```

#### Timeout Errors
```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // Test code
}, 10000); // 10 second timeout
```

#### Coverage Issues
```bash
# Clear coverage cache
rm -rf coverage/
npm run test:coverage
```

---

## 📚 Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Pytest Documentation](https://docs.pytest.org/)

### Internal Resources
- Test Results: `reports/PHASE-5-TEST-RESULTS.md`
- Implementation Summary: `reports/PHASE-5-IMPLEMENTATION-SUMMARY.md`
- Phase 5 Complete: `reports/PHASE-5-COMPLETE.md`

---

## 📊 Test Statistics

### Current Status (as of 2024)

| Metric | Value |
|--------|-------|
| **Total Tests** | 221 |
| **Test Files** | 17 TypeScript, 6 Python |
| **Pass Rate** | 100% |
| **Duration** | 31.58 seconds |
| **Coverage** | Available via `npm run test:coverage` |

### Test Distribution

| Category | Tests | Percentage |
|----------|-------|------------|
| AI Tools | 114 | 51.6% |
| DevOps | 26 | 11.8% |
| Atlas | 20 | 9.0% |
| Python | 18 | 8.1% |
| Meta CLI | 14 | 6.3% |
| Integration | 12 | 5.4% |
| Unit | 11 | 5.0% |
| E2E | 6 | 2.7% |

---

## 🎉 Recent Improvements

### Phase 5: Testing Framework Consolidation

**Completed**: 2024

**Improvements**:
- ✅ Removed 25 duplicate test files (61% reduction)
- ✅ Simplified Cypress configuration (68% reduction)
- ✅ Enhanced Vitest configuration available
- ✅ All 221 tests validated and passing
- ✅ Comprehensive test documentation

**Impact**:
- Cleaner test structure
- Simplified configurations
- Better maintainability
- 100% test pass rate

---

## 📞 Support

For questions or issues with testing:
1. Check this guide
2. Review test examples in `tests/` directory
3. Consult Vitest documentation
4. Check implementation reports in `reports/`

---

**Last Updated**: 2024  
**Test Framework**: Vitest 3.2.4  
**Total Tests**: 221  
**Pass Rate**: 100%  
**Status**: ✅ All systems operational
