# 🔄 PHASE 15: CHANGE MANAGEMENT - CASCADE HANDOFF

## Mission

Implement structured change management with RFC process, impact analysis, and
rollback procedures. AI-accelerated: 25-35 minutes.

---

## Tasks

### 1. Create RFC Template (10 min)

Create `.github/ISSUE_TEMPLATE/rfc.yml`:

```yaml
name: RFC (Request for Comments)
description: Propose a significant change or new feature
labels: ['rfc', 'needs-discussion']
body:
  - type: markdown
    attributes:
      value: |
        ## Request for Comments
        Use this template for proposing significant changes.

  - type: input
    id: title
    attributes:
      label: RFC Title
      placeholder: 'RFC-XXXX: Short descriptive title'
    validations:
      required: true

  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: One paragraph explaining the proposal
    validations:
      required: true

  - type: textarea
    id: motivation
    attributes:
      label: Motivation
      description: Why is this change needed?
    validations:
      required: true

  - type: textarea
    id: design
    attributes:
      label: Detailed Design
      description: Technical details of the proposal
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: What other approaches were considered?

  - type: textarea
    id: impact
    attributes:
      label: Impact Analysis
      description: |
        - Breaking changes?
        - Migration required?
        - Performance impact?
        - Security implications?
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: Priority
      options:
        - P0 - Critical
        - P1 - High
        - P2 - Medium
        - P3 - Low
```

### 2. Create Change Management Config (5 min)

Create `.metaHub/change-management/config.yaml`:

```yaml
version: '1.0'
change_management:
  rfc_process:
    required_for:
      - breaking_changes
      - new_features
      - architecture_changes
      - security_changes

    approval_required:
      critical: 2
      standard: 1

    discussion_period_days: 7

  change_types:
    breaking:
      requires_rfc: true
      requires_migration_plan: true
      announcement_required: true

    feature:
      requires_rfc: true
      documentation_required: true

    bugfix:
      requires_rfc: false
      test_required: true

    hotfix:
      requires_rfc: false
      post_mortem_required: true

  rollback:
    automatic_triggers:
      - error_rate_spike
      - latency_spike
      - failed_health_check

    manual_command: 'npm run rollback'
    max_rollback_time_minutes: 5
```

### 3. Create Rollback Script (10 min)

Create `tools/devops/rollback.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Deployment rollback utility
 */
import { execSync } from 'child_process';
import { appendFileSync } from 'fs';

const ROLLBACK_LOG = '.logs/rollback-history.jsonl';

interface RollbackEntry {
  timestamp: string;
  from_commit: string;
  to_commit: string;
  reason: string;
  actor: string;
}

function getCurrentCommit(): string {
  return execSync('git rev-parse HEAD', { encoding: 'utf-8' })
    .trim()
    .slice(0, 8);
}

function getPreviousCommit(): string {
  return execSync('git rev-parse HEAD~1', { encoding: 'utf-8' })
    .trim()
    .slice(0, 8);
}

function rollback(reason: string = 'manual') {
  const from = getCurrentCommit();
  const to = getPreviousCommit();

  console.log('\n🔄 ROLLBACK INITIATED\n');
  console.log(`  From: ${from}`);
  console.log(`  To:   ${to}`);
  console.log(`  Reason: ${reason}`);

  // Log the rollback
  const entry: RollbackEntry = {
    timestamp: new Date().toISOString(),
    from_commit: from,
    to_commit: to,
    reason,
    actor: 'system',
  };
  appendFileSync(ROLLBACK_LOG, JSON.stringify(entry) + '\n');

  // In production, this would trigger actual rollback
  console.log('\n⚠️  DRY RUN - No actual rollback performed');
  console.log('    To rollback: git revert HEAD --no-edit');
}

function showHistory() {
  console.log('\n📜 ROLLBACK HISTORY\n');
  try {
    const { readFileSync } = require('fs');
    const lines = readFileSync(ROLLBACK_LOG, 'utf-8').trim().split('\n');
    lines.slice(-5).forEach((line) => {
      const e = JSON.parse(line);
      console.log(
        `  ${e.timestamp.slice(0, 19)} | ${e.from_commit} → ${e.to_commit} | ${e.reason}`,
      );
    });
  } catch {
    console.log('  No rollback history');
  }
}

const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'now':
    rollback(args.join(' ') || 'manual');
    break;
  case 'history':
    showHistory();
    break;
  default:
    console.log('Usage: npm run rollback <now [reason]|history>');
}
```

### 4. Create CHANGELOG Template (5 min)

Create `docs/templates/CHANGELOG-TEMPLATE.md`:

```markdown
# Changelog

All notable changes documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- New features

### Changed

- Changes to existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Removed features

### Fixed

- Bug fixes

### Security

- Security updates

## [1.0.0] - YYYY-MM-DD

### Added

- Initial release
```

### 5. Add npm Scripts (5 min)

```json
"rollback": "tsx tools/devops/rollback.ts",
"rollback:now": "tsx tools/devops/rollback.ts now",
"rollback:history": "tsx tools/devops/rollback.ts history"
```

---

## Files to Create/Modify

| File                                     | Action               |
| ---------------------------------------- | -------------------- |
| `.github/ISSUE_TEMPLATE/rfc.yml`         | Create               |
| `.metaHub/change-management/config.yaml` | Create               |
| `tools/devops/rollback.ts`               | Create               |
| `docs/templates/CHANGELOG-TEMPLATE.md`   | Create               |
| `package.json`                           | Add rollback scripts |

---

## Commit

`feat(change-mgmt): Complete Phase 15 change management`
