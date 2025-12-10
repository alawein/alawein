# 🧠 PHASE 24: AI-POWERED CODE REVIEW - CASCADE HANDOFF

## Mission

Implement AI-assisted code review guidelines and automated review checklist
generation. AI-accelerated: 25-35 minutes.

---

## Tasks

### 1. Create AI Review Config (10 min)

Create `.metaHub/ai-review/config.yaml`:

```yaml
version: '1.0'
ai_review:
  enabled: true

  review_areas:
    security:
      priority: critical
      checks:
        - sql_injection
        - xss_vulnerabilities
        - hardcoded_secrets
        - insecure_dependencies

    performance:
      priority: high
      checks:
        - n_plus_one_queries
        - memory_leaks
        - inefficient_algorithms
        - large_bundle_imports

    maintainability:
      priority: medium
      checks:
        - code_complexity
        - duplicate_code
        - naming_conventions
        - documentation_coverage

    best_practices:
      priority: medium
      checks:
        - error_handling
        - type_safety
        - test_coverage
        - accessibility

  automation:
    auto_comment: false
    require_approval: true
    block_on_critical: true

  prompts:
    security_review: |
      Review this code for security vulnerabilities:
      - SQL injection risks
      - XSS vulnerabilities
      - Hardcoded secrets or credentials
      - Insecure data handling

    performance_review: |
      Review this code for performance issues:
      - N+1 query patterns
      - Memory leaks or inefficient memory usage
      - Algorithmic complexity concerns
      - Bundle size impact

  integrations:
    github_actions: true
    pr_comments: true
```

### 2. Create Review Checklist Generator (10 min)

Create `tools/ai-review/checklist.ts`:

```typescript
#!/usr/bin/env tsx
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG = '.metaHub/ai-review/config.yaml';

interface ReviewArea {
  priority: string;
  checks: string[];
}

function loadConfig() {
  if (!existsSync(CONFIG)) {
    console.error('❌ AI Review config not found');
    return null;
  }
  return load(readFileSync(CONFIG, 'utf-8')) as any;
}

function generateChecklist(area?: string) {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🧠 AI CODE REVIEW CHECKLIST\n');
  console.log('═'.repeat(60));

  const areas = config.ai_review.review_areas;
  const targetAreas = area ? { [area]: areas[area] } : areas;

  for (const [name, reviewArea] of Object.entries(targetAreas)) {
    if (!reviewArea) continue;
    const ra = reviewArea as ReviewArea;
    const priorityIcon =
      ra.priority === 'critical' ? '🔴' : ra.priority === 'high' ? '🟠' : '🟡';

    console.log(`\n${priorityIcon} ${name.toUpperCase()} (${ra.priority})\n`);
    ra.checks.forEach((check) => {
      console.log(`   [ ] ${check.replace(/_/g, ' ')}`);
    });
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📋 Copy this checklist to your PR description');
}

function showPrompts() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🤖 AI REVIEW PROMPTS\n');
  console.log('═'.repeat(60));

  for (const [name, prompt] of Object.entries(config.ai_review.prompts)) {
    console.log(`\n### ${name.replace(/_/g, ' ').toUpperCase()}\n`);
    console.log(prompt);
  }
}

function showHelp() {
  console.log(`
🧠 AI Code Review Tool

Usage:
  npm run ai-review                    Generate full checklist
  npm run ai-review checklist          Generate full checklist
  npm run ai-review checklist security Generate security checklist
  npm run ai-review prompts            Show AI review prompts

Configuration: ${CONFIG}
`);
}

const [, , cmd, arg] = process.argv;
switch (cmd) {
  case 'checklist':
    generateChecklist(arg);
    break;
  case 'prompts':
    showPrompts();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    generateChecklist();
}
```

### 3. Create PR Review Template (5 min)

Create `.github/PULL_REQUEST_TEMPLATE/ai-review.md`:

```markdown
## AI-Assisted Code Review

### Security Checklist

- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] No hardcoded secrets
- [ ] Dependencies are secure

### Performance Checklist

- [ ] No N+1 query patterns
- [ ] No memory leaks
- [ ] Efficient algorithms used
- [ ] Bundle size impact considered

### Maintainability Checklist

- [ ] Code complexity is reasonable
- [ ] No duplicate code
- [ ] Naming conventions followed
- [ ] Documentation updated

### Testing Checklist

- [ ] Unit tests added/updated
- [ ] Integration tests if needed
- [ ] Edge cases covered

---

_Use `npm run ai-review` to generate a detailed checklist_
```

### 4. Add npm Scripts (5 min)

```json
"ai-review": "tsx tools/ai-review/checklist.ts",
"ai-review:checklist": "tsx tools/ai-review/checklist.ts checklist",
"ai-review:prompts": "tsx tools/ai-review/checklist.ts prompts"
```

---

## Files to Create/Modify

| File                                         | Action                |
| -------------------------------------------- | --------------------- |
| `.metaHub/ai-review/config.yaml`             | Create                |
| `tools/ai-review/checklist.ts`               | Create                |
| `.github/PULL_REQUEST_TEMPLATE/ai-review.md` | Create                |
| `package.json`                               | Add ai-review scripts |

---

## Commit

`feat(ai-review): Complete Phase 24 AI-powered code review`
