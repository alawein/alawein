#!/usr/bin/env tsx
/**
 * Predictive analytics dashboard
 * Usage: npm run analytics
 */
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';

function getGitStats() {
  try {
    const commits30d = execSync('git rev-list --count --since="30 days ago" HEAD 2>nul', {
      encoding: 'utf-8',
    }).trim();
    const totalCommits = execSync('git rev-list --count HEAD 2>nul', { encoding: 'utf-8' }).trim();
    return { commits30d: parseInt(commits30d) || 0, totalCommits: parseInt(totalCommits) || 0 };
  } catch {
    return { commits30d: 0, totalCommits: 0 };
  }
}

function getRecentTags(): string[] {
  try {
    const output = execSync('git tag -l "v*" --sort=-creatordate 2>nul', { encoding: 'utf-8' });
    return output
      .trim()
      .split('\n')
      .filter((t) => t)
      .slice(0, 5);
  } catch {
    return [];
  }
}

function calculateRiskScore(commits: number, filesChanged: number): { score: number; level: string } {
  const score = Math.min(100, commits * 2 + filesChanged);
  const level = score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low';
  return { score, level };
}

function showDashboard() {
  console.log('\n📊 PREDICTIVE ANALYTICS DASHBOARD\n');
  console.log('═'.repeat(60));

  const stats = getGitStats();
  const tags = getRecentTags();

  console.log('\n📈 ACTIVITY METRICS\n');
  console.log(`   Total Commits: ${stats.totalCommits}`);
  console.log(`   Commits (30d): ${stats.commits30d}`);
  console.log(`   Avg/Day (30d): ${(stats.commits30d / 30).toFixed(1)}`);

  console.log('\n🚀 RELEASE METRICS\n');
  console.log(`   Recent Releases: ${tags.length}`);
  if (tags.length > 0) {
    console.log(`   Latest: ${tags[0]}`);
  }

  const risk = calculateRiskScore(stats.commits30d, 0);
  const riskIcon = risk.level === 'High' ? '🔴' : risk.level === 'Medium' ? '🟡' : '🟢';

  console.log('\n⚠️ RISK ASSESSMENT\n');
  console.log(`   Change Velocity: ${riskIcon} ${risk.level} (score: ${risk.score})`);

  console.log('\n📋 RECOMMENDATIONS\n');
  if (stats.commits30d > 50) {
    console.log('   • High activity - consider more frequent releases');
  }
  if (stats.commits30d < 10) {
    console.log('   • Low activity - review project priorities');
  }
  console.log('   • Monitor test coverage for changed files');
  console.log('   • Review security scans before releases');

  console.log('\n' + '═'.repeat(60));
}

function generateReport() {
  const stats = getGitStats();
  const tags = getRecentTags();
  const date = new Date().toISOString().split('T')[0];
  const risk = calculateRiskScore(stats.commits30d, 0);

  const report = `# Analytics Report - ${date}

## Activity Summary

| Metric | Value |
|--------|-------|
| Total Commits | ${stats.totalCommits} |
| Commits (30d) | ${stats.commits30d} |
| Avg/Day | ${(stats.commits30d / 30).toFixed(1)} |

## Release History

${tags.length > 0 ? tags.map((t) => `- ${t}`).join('\n') : 'No releases found'}

## Risk Assessment

- **Change Velocity Risk**: ${risk.level} (${risk.score}/100)

## Recommendations

1. Monitor code churn in high-activity areas
2. Review test coverage for recently changed files
3. Consider feature flags for high-risk changes
4. Schedule regular security audits

---

*Generated: ${new Date().toISOString()}*
`;

  const dir = 'docs/analytics';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const filepath = `${dir}/report-${date}.md`;
  writeFileSync(filepath, report);
  console.log(`✅ Report generated: ${filepath}`);
}

function showHelp() {
  console.log(`
📊 Predictive Analytics Dashboard

Usage:
  npm run analytics              Show dashboard
  npm run analytics:report       Generate markdown report

Configuration: .metaHub/analytics/config.yaml
Reports: docs/analytics/
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'report':
    generateReport();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showDashboard();
}
