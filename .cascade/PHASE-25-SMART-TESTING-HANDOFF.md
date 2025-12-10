# 🧪 PHASE 25: SMART TESTING - CASCADE HANDOFF

## Mission

Implement intelligent test selection, coverage optimization, and test impact
analysis. AI-accelerated: 25-35 minutes.

---

## Tasks

### 1. Create Smart Testing Config (10 min)

Create `.metaHub/smart-testing/config.yaml`:

```yaml
version: '1.0'
smart_testing:
  strategies:
    affected_tests:
      enabled: true
      method: 'git_diff'
      fallback: 'run_all'

    priority_tests:
      enabled: true
      criteria:
        - recently_failed
        - high_coverage_impact
        - critical_paths

    parallel_execution:
      enabled: true
      max_workers: 4

  coverage:
    minimum: 80
    target: 90
    exclude:
      - '**/*.test.ts'
      - '**/*.spec.ts'
      - '**/mocks/**'
      - '**/fixtures/**'

  impact_analysis:
    enabled: true
    track_dependencies: true
    generate_report: true

  flaky_detection:
    enabled: true
    retry_count: 3
    quarantine_after: 5

  reporting:
    format: 'json'
    output: 'coverage/'
    badge: true
```

### 2. Create Test Selector (10 min)

Create `tools/smart-testing/selector.ts`:

```typescript
#!/usr/bin/env tsx
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG = '.metaHub/smart-testing/config.yaml';

function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1', {
      encoding: 'utf-8',
    });
    return output
      .trim()
      .split('\n')
      .filter((f) => f);
  } catch {
    return [];
  }
}

function findAffectedTests(changedFiles: string[]): string[] {
  const testPatterns = ['.test.ts', '.test.tsx', '.spec.ts', '.spec.tsx'];
  const affectedTests: string[] = [];

  changedFiles.forEach((file) => {
    // If it's already a test file
    if (testPatterns.some((p) => file.endsWith(p))) {
      affectedTests.push(file);
      return;
    }

    // Find corresponding test file
    const baseName = file.replace(/\.(ts|tsx|js|jsx)$/, '');
    testPatterns.forEach((pattern) => {
      const testFile = `${baseName}${pattern}`;
      if (existsSync(testFile)) {
        affectedTests.push(testFile);
      }
    });
  });

  return [...new Set(affectedTests)];
}

function showAffected() {
  console.log('\n🧪 SMART TEST SELECTION\n');
  console.log('═'.repeat(60));

  const changed = getChangedFiles();
  console.log(`\n📝 Changed Files: ${changed.length}`);
  changed.slice(0, 10).forEach((f) => console.log(`   - ${f}`));
  if (changed.length > 10)
    console.log(`   ... and ${changed.length - 10} more`);

  const affected = findAffectedTests(changed);
  console.log(`\n🎯 Affected Tests: ${affected.length}`);
  affected.forEach((f) => console.log(`   - ${f}`));

  if (affected.length === 0) {
    console.log(
      '\n💡 No specific tests affected. Consider running full suite.',
    );
  } else {
    console.log(`\n🚀 Run affected tests:`);
    console.log(`   npx vitest ${affected.join(' ')}`);
  }
}

function showCoverage() {
  console.log('\n📊 TEST COVERAGE STATUS\n');
  console.log('═'.repeat(50));

  if (existsSync('coverage/coverage-summary.json')) {
    const summary = JSON.parse(
      readFileSync('coverage/coverage-summary.json', 'utf-8'),
    );
    const total = summary.total;

    console.log(`   Lines:      ${total.lines.pct.toFixed(1)}%`);
    console.log(`   Statements: ${total.statements.pct.toFixed(1)}%`);
    console.log(`   Functions:  ${total.functions.pct.toFixed(1)}%`);
    console.log(`   Branches:   ${total.branches.pct.toFixed(1)}%`);
  } else {
    console.log('   No coverage data found. Run tests with coverage first.');
    console.log('   npm run test:coverage');
  }
}

function showHelp() {
  console.log(`
🧪 Smart Testing Tool

Usage:
  npm run smart-test              Show affected tests
  npm run smart-test affected     Show affected tests
  npm run smart-test coverage     Show coverage status

Configuration: ${CONFIG}
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'affected':
    showAffected();
    break;
  case 'coverage':
    showCoverage();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showAffected();
}
```

### 3. Add npm Scripts (5 min)

```json
"smart-test": "tsx tools/smart-testing/selector.ts",
"smart-test:affected": "tsx tools/smart-testing/selector.ts affected",
"smart-test:coverage": "tsx tools/smart-testing/selector.ts coverage"
```

---

## Files to Create/Modify

| File                                 | Action                 |
| ------------------------------------ | ---------------------- |
| `.metaHub/smart-testing/config.yaml` | Create                 |
| `tools/smart-testing/selector.ts`    | Create                 |
| `package.json`                       | Add smart-test scripts |

---

## Commit

`feat(smart-testing): Complete Phase 25 smart testing`
