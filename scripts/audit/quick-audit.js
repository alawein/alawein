/**
 * Quick Audit - Fast version without slow dependency checks
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 Quick LLC & Project Audit\n');
console.log('='.repeat(80));

const results = [];
const rootPath = process.cwd();

// Phase 1: File Structure
console.log('\n📋 PHASE 1: File Structure Scan');
console.log('-'.repeat(80));

const projects = [];

// Check LLCs
const llcDirs = ['repz-llc', 'live-it-iconic-llc', 'alawein-technologies-llc'];
for (const llc of llcDirs) {
  const llcPath = path.join(rootPath, 'organizations', llc);
  if (fs.existsSync(llcPath)) {
    projects.push({ name: llc, type: 'llc', path: llcPath });
  }
}

// Check research
const researchPath = path.join(rootPath, 'research');
if (fs.existsSync(researchPath)) {
  const dirs = fs.readdirSync(researchPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  dirs.forEach(dir => {
    projects.push({ name: `research/${dir}`, type: 'research', path: path.join(researchPath, dir) });
  });
}

console.log(`✅ Found ${projects.length} projects`);
results.push({ phase: 'Phase 1', category: 'File Structure', status: 'pass', count: projects.length });

// Phase 2: Governance
console.log('\n📊 PHASE 2: Governance Checks');
console.log('-'.repeat(80));

const govChecks = {
  rootStructureContract: fs.existsSync(path.join(rootPath, 'docs/ROOT_STRUCTURE_CONTRACT.md')),
  securityPolicy: fs.existsSync(path.join(rootPath, 'SECURITY.md')),
  licenseFile: fs.existsSync(path.join(rootPath, 'LICENSES.md')),
  readme: fs.existsSync(path.join(rootPath, 'README.md'))
};

const passed = Object.values(govChecks).filter(Boolean).length;
console.log(`✅ ${passed}/4 governance checks passed`);
results.push({ phase: 'Phase 2', category: 'Governance', status: passed >= 3 ? 'pass' : 'warning', passed, total: 4 });

// Phase 3: Documentation
console.log('\n📚 PHASE 3: Documentation Review');
console.log('-'.repeat(80));

const docChecks = {
  docsDirectory: fs.existsSync(path.join(rootPath, 'docs')),
  architectureDocs: fs.existsSync(path.join(rootPath, 'docs/ARCHITECTURE.md')),
  apiDocs: fs.existsSync(path.join(rootPath, 'docs/APIS.md'))
};

const docPassed = Object.values(docChecks).filter(Boolean).length;
console.log(`✅ ${docPassed}/3 documentation checks passed`);
results.push({ phase: 'Phase 3', category: 'Documentation', status: docPassed >= 2 ? 'pass' : 'warning', passed: docPassed, total: 3 });

// Phase 4: Architecture
console.log('\n🏗️  PHASE 4: Architecture Consistency');
console.log('-'.repeat(80));

const archChecks = {
  monorepo: fs.existsSync(path.join(rootPath, 'turbo.json')),
  packages: fs.existsSync(path.join(rootPath, 'packages')),
  organizations: fs.existsSync(path.join(rootPath, 'organizations')),
  tools: fs.existsSync(path.join(rootPath, 'tools'))
};

const archPassed = Object.values(archChecks).filter(Boolean).length;
console.log(`✅ ${archPassed}/4 architecture checks passed`);
results.push({ phase: 'Phase 4', category: 'Architecture', status: archPassed === 4 ? 'pass' : 'warning', passed: archPassed, total: 4 });

// Phase 5: Security
console.log('\n🔒 PHASE 5: Security Scan');
console.log('-'.repeat(80));

const secChecks = {
  secretsBaseline: fs.existsSync(path.join(rootPath, '.secrets.baseline')),
  gitignore: fs.existsSync(path.join(rootPath, '.gitignore')),
  envExample: fs.existsSync(path.join(rootPath, '.env.example'))
};

const secPassed = Object.values(secChecks).filter(Boolean).length;
console.log(`✅ ${secPassed}/3 security checks passed`);
results.push({ phase: 'Phase 5', category: 'Security', status: secPassed === 3 ? 'pass' : 'warning', passed: secPassed, total: 3 });

// Summary
console.log('\n' + '='.repeat(80));
console.log('📊 AUDIT SUMMARY');
console.log('='.repeat(80));

const totalPassed = results.filter(r => r.status === 'pass').length;
const totalWarnings = results.filter(r => r.status === 'warning').length;
const total = results.length;

console.log(`\nTotal Checks: ${total}`);
console.log(`✅ Passed: ${totalPassed} (${((totalPassed/total)*100).toFixed(1)}%)`);
console.log(`⚠️  Warnings: ${totalWarnings} (${((totalWarnings/total)*100).toFixed(1)}%)`);

// Save report
const report = {
  timestamp: new Date().toISOString(),
  projects,
  results,
  summary: { total, passed: totalPassed, warnings: totalWarnings, failed: 0 }
};

fs.writeFileSync('QUICK-AUDIT-REPORT.json', JSON.stringify(report, null, 2));
console.log(`\n📄 Report saved to: QUICK-AUDIT-REPORT.json`);
console.log('='.repeat(80));
