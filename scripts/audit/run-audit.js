/**
 * Simple CLI wrapper to run comprehensive audit
 */

import { ComprehensiveAuditSystem } from './tools/orchex/audit/comprehensive-audit.ts';

console.log('Starting Comprehensive LLC & Project Audit...\n');

const audit = new ComprehensiveAuditSystem();
await audit.executeFullAudit();

console.log('\n✅ Audit complete! Check AUDIT-REPORT.json for full results.');
