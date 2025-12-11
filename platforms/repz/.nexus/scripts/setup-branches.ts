#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';

interface BranchConfig {
  name: string;
  description: string;
  environment: string;
  url: string;
  protected: boolean;
}

const branches: BranchConfig[] = [
  {
    name: 'app/dev',
    description: 'Development branch with sandbox environment',
    environment: 'development',
    url: 'dev.repzcoach.com',
    protected: false,
  },
  {
    name: 'app/main',
    description: 'Staging branch for pre-production testing',
    environment: 'staging',
    url: 'staging.repzcoach.com',
    protected: true,
  },
  {
    name: 'production',
    description: 'Production branch for live deployment',
    environment: 'production',
    url: 'app.repzcoach.com',
    protected: true,
  },
];

async function setupBranchStrategy() {
  console.log(chalk.cyan('🌳 Setting up REPZ branch strategy...\n'));

  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
  } catch {
    console.error(chalk.red('❌ Not in a git repository'));
    process.exit(1);
  }

  // Get current branch
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  console.log(chalk.gray(`Current branch: ${currentBranch}\n`));

  // Create branches if they don't exist
  for (const branch of branches) {
    await createBranch(branch, currentBranch);
  }

  // Set up branch protections
  await setupBranchProtections();

  // Configure Vercel projects
  await configureVercelProjects();

  console.log(chalk.green('\n✅ Branch strategy setup complete!'));
  console.log(chalk.gray('\nNext steps:'));
  console.log(chalk.gray('  1. Push branches to remote: git push -u origin app/dev app/main production'));
  console.log(chalk.gray('  2. Configure Vercel projects for each environment'));
  console.log(chalk.gray('  3. Set up environment variables in Vercel'));
}

async function createBranch(branch: BranchConfig, currentBranch: string) {
  try {
    // Check if branch exists locally
    execSync(`git rev-parse --verify ${branch.name}`, { stdio: 'pipe' });
    console.log(chalk.yellow(`⚠️ Branch ${branch.name} already exists`));
  } catch {
    // Create branch from main if it doesn't exist
    console.log(chalk.cyan(`📦 Creating branch ${branch.name}...`));
    execSync(`git checkout -b ${branch.name}`, { stdio: 'pipe' });

    // Create environment-specific README
    await createEnvironmentReadme(branch);

    // Return to original branch
    execSync(`git checkout ${currentBranch}`, { stdio: 'pipe' });
  }
}

async function createEnvironmentReadme(branch: BranchConfig) {
  const fs = require('fs-extra');
  const readme = `# ${branch.environment.charAt(0).toUpperCase() + branch.environment.slice(1)} Environment

## Overview
This branch deploys to the ${branch.environment} environment at ${branch.url}

## Environment Variables
Copy the appropriate environment file:
\`\`\`bash
cp .env.example .env.local
# Configure with ${branch.environment} variables
\`\`\`

## Deployment
- Push to ${branch.name} to trigger deployment
- ${branch.protected ? 'Requires PR approval' : 'Direct push allowed'}

## Features
${branch.environment === 'development' ? '- Debug mode enabled\n- Mock data available\n- Hot reload active' : ''}
${branch.environment === 'staging' ? '- Production-like data\n- Full feature set\n- Performance monitoring' : ''}
${branch.environment === 'production' ? '- Live environment\n- Full monitoring\n- Optimized builds' : ''}
`;

  await fs.writeFile(`ENVIRONMENT-${branch.environment.toUpperCase()}.md`, readme);
  execSync(`git add ENVIRONMENT-${branch.environment.toUpperCase()}.md`, { stdio: 'pipe' });
  execSync(`git commit -m "docs: add ${branch.environment} environment documentation"`, { stdio: 'pipe' });
}

async function setupBranchProtections() {
  console.log(chalk.cyan('\n🔒 Setting up branch protections...'));

  console.log(chalk.yellow('Note: Branch protections must be configured in GitHub settings'));
  console.log(chalk.gray('\nRequired protections:'));

  for (const branch of branches.filter(b => b.protected)) {
    console.log(chalk.white(`\n${branch.name}:`));
    console.log(chalk.gray('  ✓ Require PR review'));
    console.log(chalk.gray('  ✓ Require status checks to pass'));
    console.log(chalk.gray('  ✓ Require up-to-date branches'));
    console.log(chalk.gray('  ✓ Restrict pushes'));
  }

  console.log(chalk.gray('\nConfigure at: https://github.com/repz-llc/repz/settings/branches'));
}

async function configureVercelProjects() {
  console.log(chalk.cyan('\n🚀 Vercel project configuration...'));

  console.log(chalk.yellow('\nCreate separate Vercel projects:'));
  for (const branch of branches) {
    console.log(chalk.white(`\n${branch.environment}:`));
    console.log(chalk.gray(`  Project: repz-${branch.environment}`));
    console.log(chalk.gray(`  Framework: Vite`));
    console.log(chalk.gray(`  Build Command: npm run build${branch.environment === 'production' ? ':production' : ''}`));
    console.log(chalk.gray(`  Output Directory: dist`));
    console.log(chalk.gray(`  Install Command: npm ci`));
    console.log(chalk.gray(`  Root Directory: ./`));
    console.log(chalk.gray(`  Environment Variables: See .env.example`));
  }

  console.log(chalk.gray('\nAdd to vercel.json:'));
  console.log(chalk.white(`{
  "version": 2,
  "projects": {
    "dev": "./",
    "staging": "./",
    "production": "./"
  }
}`));
}

// Run setup
if (require.main === module) {
  setupBranchStrategy().catch(console.error);
}

export { setupBranchStrategy };
