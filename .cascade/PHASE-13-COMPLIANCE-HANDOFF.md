# ✅ PHASE 13: COMPLIANCE AUTOMATION - CASCADE HANDOFF

## Mission

Implement automated compliance verification for GDPR, license compliance, and
audit trails. AI-accelerated: 35-50 minutes.

---

## Tasks

### 1. Create Compliance Config (10 min)

Create `.metaHub/compliance/config.yaml`:

```yaml
version: '1.0'
compliance:
  frameworks:
    gdpr:
      enabled: true
      checks:
        - data_inventory
        - consent_tracking
        - data_retention_policy
        - privacy_policy_exists

    license:
      enabled: true
      allowed_licenses:
        - MIT
        - Apache-2.0
        - BSD-3-Clause
        - ISC
      denied_licenses:
        - GPL-3.0
        - AGPL-3.0

    security:
      enabled: true
      checks:
        - no_secrets_in_code
        - dependencies_scanned
        - security_policy_exists

  audit:
    enabled: true
    log_path: '.logs/compliance-audit.jsonl'
    retention_days: 365

  reporting:
    schedule: 'weekly'
    format: ['json', 'markdown']
    destination: 'docs/compliance/'
```

### 2. Create License Checker (15 min)

Create `tools/compliance/license-checker.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * License compliance checker
 */
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const ALLOWED = [
  'MIT',
  'Apache-2.0',
  'BSD-3-Clause',
  'ISC',
  'BSD-2-Clause',
  '0BSD',
];
const DENIED = ['GPL-3.0', 'AGPL-3.0', 'GPL-2.0'];

interface LicenseInfo {
  name: string;
  license: string;
  status: 'allowed' | 'denied' | 'review';
}

function checkLicenses(): LicenseInfo[] {
  console.log('\n📜 LICENSE COMPLIANCE CHECK\n');

  try {
    const output = execSync('npx license-checker --json 2>/dev/null', {
      encoding: 'utf-8',
    });
    const licenses = JSON.parse(output);
    const results: LicenseInfo[] = [];

    for (const [pkg, info] of Object.entries(licenses)) {
      const license = (info as any).licenses || 'Unknown';
      let status: 'allowed' | 'denied' | 'review' = 'review';

      if (ALLOWED.some((l) => license.includes(l))) status = 'allowed';
      if (DENIED.some((l) => license.includes(l))) status = 'denied';

      results.push({ name: pkg, license, status });
    }

    return results;
  } catch {
    console.log(
      '⚠️  license-checker not available, run: npm i -g license-checker',
    );
    return [];
  }
}

function showSummary(results: LicenseInfo[]) {
  const allowed = results.filter((r) => r.status === 'allowed').length;
  const denied = results.filter((r) => r.status === 'denied').length;
  const review = results.filter((r) => r.status === 'review').length;

  console.log('='.repeat(50));
  console.log(`✅ Allowed: ${allowed}`);
  console.log(`❌ Denied: ${denied}`);
  console.log(`⚠️  Review: ${review}`);
  console.log('='.repeat(50));

  if (denied > 0) {
    console.log('\n❌ DENIED LICENSES:');
    results
      .filter((r) => r.status === 'denied')
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.license}`);
      });
  }
}

const results = checkLicenses();
if (results.length > 0) showSummary(results);
```

### 3. Create GDPR Checklist (5 min)

Create `docs/compliance/GDPR-CHECKLIST.md`:

```markdown
# GDPR Compliance Checklist

## Data Collection

- [ ] Privacy policy published and accessible
- [ ] Consent obtained before data collection
- [ ] Purpose of data collection clearly stated

## Data Storage

- [ ] Data encrypted at rest
- [ ] Data retention policy defined
- [ ] Data inventory maintained

## Data Subject Rights

- [ ] Access request process documented
- [ ] Deletion request process documented
- [ ] Data portability supported

## Security

- [ ] Data breach notification process
- [ ] Security measures documented
- [ ] Regular security audits

## Third Parties

- [ ] Data processing agreements in place
- [ ] Third-party compliance verified
```

### 4. Create Audit Trail Logger (10 min)

Create `tools/compliance/audit-logger.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Compliance audit trail logger
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname } from 'path';

const AUDIT_LOG = '.logs/compliance-audit.jsonl';

interface AuditEvent {
  timestamp: string;
  event_type: string;
  actor: string;
  resource: string;
  action: string;
  result: string;
  metadata?: Record<string, unknown>;
}

function ensureLogDir() {
  const dir = dirname(AUDIT_LOG);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function logEvent(event: Omit<AuditEvent, 'timestamp'>) {
  ensureLogDir();
  const entry: AuditEvent = { timestamp: new Date().toISOString(), ...event };
  appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
  console.log(`📝 Logged: ${event.event_type} - ${event.action}`);
}

function showRecent(count: number = 10) {
  if (!existsSync(AUDIT_LOG)) {
    console.log('No audit logs found');
    return;
  }

  const lines = readFileSync(AUDIT_LOG, 'utf-8').trim().split('\n');
  const recent = lines.slice(-count);

  console.log('\n📋 RECENT AUDIT EVENTS\n');
  recent.forEach((line) => {
    const e = JSON.parse(line);
    console.log(
      `  ${e.timestamp.slice(0, 19)} | ${e.event_type} | ${e.action}`,
    );
  });
}

const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'log':
    logEvent({
      event_type: args[0],
      actor: 'system',
      resource: args[1] || '',
      action: args[2] || '',
      result: 'success',
    });
    break;
  case 'show':
    showRecent(parseInt(args[0]) || 10);
    break;
  default:
    console.log(
      'Usage: npm run audit <log [type] [resource] [action]|show [count]>',
    );
}
```

### 5. Add npm Scripts (5 min)

```json
"compliance:licenses": "tsx tools/compliance/license-checker.ts",
"compliance:audit": "tsx tools/compliance/audit-logger.ts",
"audit:log": "tsx tools/compliance/audit-logger.ts log",
"audit:show": "tsx tools/compliance/audit-logger.ts show"
```

---

## Files to Create/Modify

| File                                  | Action                 |
| ------------------------------------- | ---------------------- |
| `.metaHub/compliance/config.yaml`     | Create                 |
| `tools/compliance/license-checker.ts` | Create                 |
| `tools/compliance/audit-logger.ts`    | Create                 |
| `docs/compliance/GDPR-CHECKLIST.md`   | Create                 |
| `package.json`                        | Add compliance scripts |

---

## Commit

`feat(compliance): Complete Phase 13 compliance automation`
