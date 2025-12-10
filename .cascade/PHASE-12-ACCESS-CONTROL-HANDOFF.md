# 🔐 PHASE 12: ACCESS CONTROL ENHANCEMENT - CASCADE HANDOFF

## Mission

Implement role-based access control documentation and permission auditing.
AI-accelerated: 25-35 minutes.

---

## Tasks

### 1. Create RBAC Configuration (10 min)

Create `.metaHub/access-control/rbac.yaml`:

```yaml
version: '1.0'
access_control:
  roles:
    owner:
      description: 'Full access to all resources'
      permissions: ['*']
      members: ['alawein']

    admin:
      description: 'Administrative access'
      permissions:
        - 'repo:*'
        - 'settings:read'
        - 'settings:write'
        - 'members:manage'

    developer:
      description: 'Development access'
      permissions:
        - 'repo:read'
        - 'repo:write'
        - 'pr:create'
        - 'pr:review'

    reviewer:
      description: 'Code review access'
      permissions:
        - 'repo:read'
        - 'pr:review'
        - 'issues:read'

    readonly:
      description: 'Read-only access'
      permissions:
        - 'repo:read'
        - 'issues:read'

  assignments:
    critical_repos:
      required_roles: ['admin', 'developer']
      review_required_from: ['admin']

    standard_repos:
      required_roles: ['developer']
      review_required_from: ['developer', 'admin']

    research_repos:
      required_roles: ['developer', 'readonly']
      review_required_from: []

  security:
    mfa_required_for: ['owner', 'admin']
    session_timeout_minutes: 480
    ip_allowlist_enabled: false
```

### 2. Create Access Audit Tool (10 min)

Create `tools/security/access-audit.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Access control audit tool
 */
import { readFileSync, existsSync, appendFileSync } from 'fs';
import { load } from 'js-yaml';

const RBAC_PATH = '.metaHub/access-control/rbac.yaml';
const AUDIT_LOG = '.logs/access-audit.jsonl';

interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  resource: string;
  result: 'allowed' | 'denied';
}

function logAudit(entry: AuditEntry) {
  appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
}

function showRoles() {
  if (!existsSync(RBAC_PATH)) {
    console.error('❌ RBAC config not found');
    return;
  }

  const config = load(readFileSync(RBAC_PATH, 'utf-8')) as any;
  console.log('\n🔐 ACCESS CONTROL ROLES\n');
  console.log('='.repeat(50));

  for (const [role, details] of Object.entries(config.access_control.roles)) {
    const d = details as any;
    console.log(`\n${role.toUpperCase()}`);
    console.log(`  ${d.description}`);
    console.log(
      `  Permissions: ${Array.isArray(d.permissions) ? d.permissions.slice(0, 3).join(', ') + '...' : d.permissions}`,
    );
  }
}

function checkPermission(role: string, permission: string) {
  const config = load(readFileSync(RBAC_PATH, 'utf-8')) as any;
  const roleConfig = config.access_control.roles[role];

  if (!roleConfig) {
    console.log(`❌ Role '${role}' not found`);
    return false;
  }

  const perms = roleConfig.permissions;
  const allowed = perms.includes('*') || perms.includes(permission);
  console.log(
    `${allowed ? '✅' : '❌'} ${role} -> ${permission}: ${allowed ? 'ALLOWED' : 'DENIED'}`,
  );
  return allowed;
}

const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'roles':
    showRoles();
    break;
  case 'check':
    checkPermission(args[0], args[1]);
    break;
  default:
    console.log('Usage: npm run access <roles|check [role] [permission]>');
}
```

### 3. Create Access Request Template (5 min)

Create `.github/ISSUE_TEMPLATE/access-request.yml`:

```yaml
name: Access Request
description: Request repository or resource access
labels: ['access-request']
body:
  - type: dropdown
    id: access-type
    attributes:
      label: Access Type
      options:
        - Repository Read
        - Repository Write
        - Admin Access
        - Reviewer Access
    validations:
      required: true

  - type: input
    id: resource
    attributes:
      label: Resource
      placeholder: 'e.g., alawein-technologies-llc/librex'
    validations:
      required: true

  - type: textarea
    id: justification
    attributes:
      label: Business Justification
      placeholder: 'Why do you need this access?'
    validations:
      required: true

  - type: input
    id: duration
    attributes:
      label: Duration
      placeholder: 'e.g., permanent, 30 days, 1 week'
```

### 4. Add npm Scripts (5 min)

Add to `package.json`:

```json
"access": "tsx tools/security/access-audit.ts",
"access:roles": "tsx tools/security/access-audit.ts roles",
"access:check": "tsx tools/security/access-audit.ts check"
```

---

## Files to Create/Modify

| File                                        | Action             |
| ------------------------------------------- | ------------------ |
| `.metaHub/access-control/rbac.yaml`         | Create             |
| `tools/security/access-audit.ts`            | Create             |
| `.github/ISSUE_TEMPLATE/access-request.yml` | Create             |
| `package.json`                              | Add access scripts |

---

## Success Criteria

- [ ] `npm run access roles` shows role definitions
- [ ] RBAC config documents all roles
- [ ] Access request issue template available

---

## Commit

`feat(access): Complete Phase 12 access control enhancement`
