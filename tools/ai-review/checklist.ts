#!/usr/bin/env tsx
/**
 * AI-powered code review checklist generator
 * Usage: npm run ai-review
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG = '.metaHub/ai-review/config.yaml';

interface ReviewArea {
  priority: string;
  checks: string[];
}

interface AIReviewConfig {
  ai_review: {
    enabled: boolean;
    review_areas: Record<string, ReviewArea>;
    automation: {
      auto_comment: boolean;
      require_approval: boolean;
      block_on_critical: boolean;
    };
  };
}

function loadConfig(): AIReviewConfig | null {
  if (!existsSync(CONFIG)) {
    console.error('❌ AI Review config not found at', CONFIG);
    return null;
  }
  return load(readFileSync(CONFIG, 'utf-8')) as AIReviewConfig;
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
    const priorityIcon = reviewArea.priority === 'critical' ? '🔴' : reviewArea.priority === 'high' ? '🟠' : '🟡';

    console.log(`\n${priorityIcon} ${name.toUpperCase()} (${reviewArea.priority})\n`);
    reviewArea.checks.forEach((check) => {
      console.log(`   [ ] ${check.replace(/_/g, ' ')}`);
    });
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📋 Copy this checklist to your PR description');
}

function showMarkdown() {
  const config = loadConfig();
  if (!config) return;

  console.log('## Code Review Checklist\n');

  for (const [name, area] of Object.entries(config.ai_review.review_areas)) {
    console.log(`### ${name.charAt(0).toUpperCase() + name.slice(1)}\n`);
    area.checks.forEach((check) => {
      console.log(`- [ ] ${check.replace(/_/g, ' ')}`);
    });
    console.log('');
  }
}

function showHelp() {
  console.log(`
🧠 AI Code Review Tool

Usage:
  npm run ai-review                    Generate checklist
  npm run ai-review checklist          Generate checklist
  npm run ai-review checklist security Generate security checklist only
  npm run ai-review markdown           Output as markdown

Configuration: ${CONFIG}
`);
}

const [, , cmd, arg] = process.argv;
switch (cmd) {
  case 'checklist':
    generateChecklist(arg);
    break;
  case 'markdown':
    showMarkdown();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    generateChecklist();
}
