# 🏛️ PHASE 11: GOVERNANCE FRAMEWORK - CASCADE HANDOFF

## Mission

Deploy comprehensive governance system with repository classification, approval
workflows, and compliance monitoring. AI-accelerated: 40-60 minutes.

---

## Tasks

### 1. Create Governance Config (10 min)

Create `.metaHub/governance/config.yaml`:

```yaml
version: '1.0'
governance:
  classification:
    tiers:
      critical:
        repos: ['repz-llc/repz', 'live-it-iconic-llc/liveiticonic']
        approvals_required: 2
        ci_required: true
        security_scan: true

      standard:
        repos: ['alawein-technologies-llc/*']
        approvals_required: 1
        ci_required: true

      research:
        repos: ['research/*']
        approvals_required: 0
        ci_required: false

  policies:
    branch_protection:
      main:
        require_pr: true
        require_reviews: 1
        dismiss_stale_reviews: true
        require_status_checks: ['ci', 'lint']

    commit_signing:
      required_for: ['critical']
      recommended_for: ['standard']
```

### 2. Create Governance CLI (15 min)

Create `tools/cli/governance.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Governance CLI
 * Usage: npm run gov <command>
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG_PATH = '.metaHub/governance/config.yaml';

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error('❌ Governance config not found');
    process.exit(1);
  }
  return load(readFileSync(CONFIG_PATH, 'utf-8'));
}

function showStatus() {
  const config = loadConfig();
  console.log('\n🏛️ GOVERNANCE STATUS\n');
  console.log('='.repeat(50));
  console.log('Classification Tiers:');
  console.log('  Critical: 2 approvals, CI required, security scan');
  console.log('  Standard: 1 approval, CI required');
  console.log('  Research: 0 approvals, CI optional');
  console.log('='.repeat(50));
}

function checkCompliance(repoPath: string) {
  console.log(`\n🔍 Checking compliance for: ${repoPath}\n`);
  const checks = [
    { name: 'README exists', pass: existsSync(`${repoPath}/README.md`) },
    { name: 'LICENSE exists', pass: existsSync(`${repoPath}/LICENSE`) },
    { name: 'SECURITY.md exists', pass: existsSync(`${repoPath}/SECURITY.md`) },
  ];
  checks.forEach((c) => console.log(`  ${c.pass ? '✅' : '❌'} ${c.name}`));
}

const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'status':
    showStatus();
    break;
  case 'check':
    checkCompliance(args[0] || '.');
    break;
  default:
    console.log('Usage: npm run gov <status|check [path]>');
}
```

### 3. Create GOVERNANCE.md Template (10 min)

Create `docs/templates/GOVERNANCE.md`:

```markdown
# Governance Policy

## Repository Classification

- **Critical**: Production systems requiring 2 approvals
- **Standard**: Development requiring 1 approval
- **Research**: Experimental with no approval requirements

## Approval Workflow

1. Create PR with description
2. Automated CI checks run
3. Required reviewers approve
4. Merge to main branch

## Compliance Requirements

- [ ] All repos have README.md
- [ ] All repos have LICENSE
- [ ] Critical repos have SECURITY.md
- [ ] Commit messages follow Conventional Commits

## Audit Trail

All changes logged to `.logs/governance-audit.jsonl`
```

### 4. Create Compliance Monitor Script (10 min)

Create `tools/governance/compliance-monitor.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Compliance monitoring for all repositories
 */
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const LLCS = [
  'alawein-technologies-llc',
  'repz-llc',
  'live-it-iconic-llc',
  'research',
];
const REQUIRED_FILES = ['README.md', 'LICENSE'];

function scanCompliance() {
  console.log('\n📋 COMPLIANCE SCAN\n');

  for (const llc of LLCS) {
    if (!existsSync(llc)) continue;
    console.log(`\n${llc}/`);

    const repos = readdirSync(llc, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const repo of repos) {
      const repoPath = join(llc, repo);
      const missing = REQUIRED_FILES.filter(
        (f) => !existsSync(join(repoPath, f)),
      );
      const status = missing.length === 0 ? '✅' : '⚠️';
      console.log(
        `  ${status} ${repo} ${missing.length > 0 ? `(missing: ${missing.join(', ')})` : ''}`,
      );
    }
  }
}

scanCompliance();
```

### 5. Add npm Scripts (5 min)

Add to `package.json`:

```json
"gov": "tsx tools/cli/governance.ts",
"gov:status": "tsx tools/cli/governance.ts status",
"gov:check": "tsx tools/cli/governance.ts check",
"gov:scan": "tsx tools/governance/compliance-monitor.ts"
```

---

## Files to Create/Modify

| File                                     | Action          |
| ---------------------------------------- | --------------- |
| `.metaHub/governance/config.yaml`        | Create          |
| `tools/cli/governance.ts`                | Create          |
| `docs/templates/GOVERNANCE.md`           | Create          |
| `tools/governance/compliance-monitor.ts` | Create          |
| `package.json`                           | Add gov scripts |

---

## Success Criteria

- [ ] `npm run gov status` shows governance tiers
- [ ] `npm run gov:scan` checks all repos
- [ ] Governance config YAML created
- [ ] GOVERNANCE.md template available

---

## Commit

`feat(governance): Complete Phase 11 governance framework`
