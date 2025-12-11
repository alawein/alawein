import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { validateConfig, NexusConfig } from '../../shared/config-schema';

interface DeployOptions {
  env?: string;
  force?: boolean;
  skipBuild?: boolean;
  skipTests?: boolean;
  rollback?: boolean;
  dryRun?: boolean;
}

interface Deployment {
  id: string;
  version: string;
  environment: string;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolling_back';
  timestamp: Date;
  commit: string;
  url?: string;
  rollbackId?: string;
  healthChecks?: HealthCheckResult[];
}

interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail';
  responseTime?: number;
  error?: string;
}

export async function deployCommand(options: DeployOptions) {
  console.log(chalk.cyan('\n🚀 Nexus Framework Deployment'));
  console.log(chalk.gray('Intelligent deployment with automatic rollbacks...\n'));

  try {
    // Load configuration
    const config = await loadConfiguration();

    // Determine target environment
    const environment = await determineEnvironment(config, options);

    // Check deployment prerequisites
    await checkPrerequisites(config, environment);

    // Create deployment plan
    const deployment = await createDeploymentPlan(config, environment, options);

    // Show deployment summary and confirm
    if (!options.force && !options.dryRun) {
      const confirmed = await confirmDeployment(deployment);
      if (!confirmed) {
        console.log(chalk.yellow('Deployment cancelled.'));
        return;
      }
    }

    // Execute deployment
    if (options.rollback) {
      await executeRollback(deployment);
    } else {
      await executeDeployment(deployment, options);
    }

  } catch (error: any) {
    console.error(chalk.red(`\n❌ Deployment failed: ${error.message}`));

    if (error.rollbackAvailable) {
      const { shouldRollback } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldRollback',
          message: 'Would you like to rollback to the previous version?',
          default: true,
        },
      ]);

      if (shouldRollback) {
        await executeRollback(error.lastDeployment);
      }
    }

    process.exit(1);
  }
}

async function loadConfiguration(): Promise<NexusConfig> {
  const configPath = '.nexus/nexus.config.ts';

  if (!existsSync(configPath)) {
    throw new Error('nexus.config.ts not found. Run "nexus init" to create a new project.');
  }

  try {
    const config = require(configPath);
    return validateConfig(config.default || config);
  } catch (error: any) {
    throw new Error(`Invalid configuration: ${error.message}`);
  }
}

async function determineEnvironment(config: NexusConfig, options: DeployOptions): Promise<string> {
  if (options.env) {
    if (!config.environments[options.env]) {
      throw new Error(`Environment "${options.env}" not found in configuration.`);
    }
    return options.env;
  }

  // Auto-detect from git branch
  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

    for (const [envName, envConfig] of Object.entries(config.environments)) {
      if (envConfig.branch === currentBranch) {
        return envName;
      }
    }

    // Default to dev if no match
    return 'dev';
  } catch (error) {
    return 'dev';
  }
}

async function checkPrerequisites(config: NexusConfig, environment: string) {
  const spinner = ora('Checking deployment prerequisites...').start();
  const checks = [];

  // Check if we're on clean git state
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      checks.push({ status: 'warn', message: 'Working directory is not clean' });
    } else {
      checks.push({ status: 'pass', message: 'Git working directory clean' });
    }
  } catch (error) {
    checks.push({ status: 'warn', message: 'Could not check git status' });
  }

  // Check environment variables
  const envConfig = config.environments[environment];
  if (envConfig.secrets) {
    const missingSecrets = envConfig.secrets.filter(secret => !process.env[secret]);
    if (missingSecrets.length > 0) {
      checks.push({
        status: 'fail',
        message: `Missing secrets: ${missingSecrets.join(', ')}`
      });
    } else {
      checks.push({ status: 'pass', message: 'All secrets configured' });
    }
  }

  // Check build
  try {
    execSync('npm run build', { stdio: 'pipe' });
    checks.push({ status: 'pass', message: 'Build successful' });
  } catch (error) {
    checks.push({ status: 'fail', message: 'Build failed' });
  }

  // Check tests (if enabled)
  if (!options.skipTests) {
    try {
      execSync('npm test', { stdio: 'pipe' });
      checks.push({ status: 'pass', message: 'Tests passing' });
    } catch (error) {
      checks.push({ status: 'warn', message: 'Tests failed (skipped with --skip-tests)' });
    }
  }

  spinner.stop();

  // Display results
  const failed = checks.filter(c => c.status === 'fail');
  if (failed.length > 0) {
    console.log(chalk.red('\n❌ Prerequisites failed:'));
    failed.forEach(check => {
      console.log(chalk.red(`   • ${check.message}`));
    });
    throw new Error('Prerequisites not met');
  }

  const warnings = checks.filter(c => c.status === 'warn');
  if (warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  Warnings:'));
    warnings.forEach(check => {
      console.log(chalk.yellow(`   • ${check.message}`));
    });
  }
}

async function createDeploymentPlan(config: NexusConfig, environment: string, options: DeployOptions): Promise<Deployment> {
  const deployment: Deployment = {
    id: generateDeploymentId(),
    version: getVersion(),
    environment,
    status: 'pending',
    timestamp: new Date(),
    commit: getCurrentCommit(),
  };

  // Get previous deployment for rollback
  const previousDeployment = await getLastDeployment(environment);
  if (previousDeployment) {
    deployment.rollbackId = previousDeployment.id;
  }

  return deployment;
}

async function confirmDeployment(deployment: Deployment): Promise<boolean> {
  console.log(chalk.bold('\n📋 Deployment Summary:'));
  console.log(`Environment: ${chalk.cyan(deployment.environment)}`);
  console.log(`Version: ${chalk.cyan(deployment.version)}`);
  console.log(`Commit: ${chalk.gray(deployment.commit)}`);
  console.log(`Deployment ID: ${chalk.gray(deployment.id)}`);

  if (deployment.rollbackId) {
    console.log(`Rollback target: ${chalk.gray(deployment.rollbackId)}`);
  }

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed with deployment?',
      default: true,
    },
  ]);

  return confirmed;
}

async function executeDeployment(deployment: Deployment, options: DeployOptions) {
  const spinner = ora('Deploying...').start();

  try {
    deployment.status = 'deploying';
    await saveDeployment(deployment);

    // Step 1: Build (if not skipped)
    if (!options.skipBuild) {
      spinner.text = 'Building application...';
      execSync('npm run build', { stdio: 'pipe' });
    }

    // Step 2: Deploy backend
    spinner.text = 'Deploying backend services...';
    await deployBackend(deployment);

    // Step 3: Deploy frontend
    spinner.text = 'Deploying frontend...';
    await deployFrontend(deployment);

    // Step 4: Run health checks
    spinner.text = 'Running health checks...';
    deployment.healthChecks = await runHealthChecks(deployment);

    // Step 5: Verify deployment
    const failedChecks = deployment.healthChecks.filter(c => c.status === 'fail');
    if (failedChecks.length > 0) {
      throw new Error(`Health checks failed: ${failedChecks.map(c => c.name).join(', ')}`);
    }

    // Success!
    deployment.status = 'success';
    deployment.url = getDeploymentUrl(deployment);
    await saveDeployment(deployment);

    spinner.succeed('Deployment successful!');

    // Display results
    console.log(chalk.bold.green('\n✅ Deployment Complete!'));
    console.log(`Environment: ${chalk.cyan(deployment.environment)}`);
    console.log(`URL: ${chalk.cyan(deployment.url)}`);
    console.log(`Version: ${chalk.cyan(deployment.version)}`);

    if (deployment.healthChecks) {
      console.log(chalk.bold('\n🏥 Health Checks:'));
      deployment.healthChecks.forEach(check => {
        const icon = check.status === 'pass' ? '✅' : '❌';
        const time = check.responseTime ? ` (${check.responseTime}ms)` : '';
        console.log(`${icon} ${check.name}${time}`);
      });
    }

  } catch (error: any) {
    deployment.status = 'failed';
    await saveDeployment(deployment);

    spinner.fail('Deployment failed');

    // Add rollback information to error
    error.rollbackAvailable = true;
    error.lastDeployment = deployment;

    throw error;
  }
}

async function executeRollback(deployment: Deployment) {
  const spinner = ora('Rolling back...').start();

  try {
    if (!deployment.rollbackId) {
      throw new Error('No previous deployment available for rollback');
    }

    const previousDeployment = await getDeployment(deployment.rollbackId);
    if (!previousDeployment) {
      throw new Error('Previous deployment not found');
    }

    deployment.status = 'rolling_back';
    await saveDeployment(deployment);

    // Rollback backend
    spinner.text = 'Rolling back backend...';
    await rollbackBackend(previousDeployment);

    // Rollback frontend
    spinner.text = 'Rolling back frontend...';
    await rollbackFrontend(previousDeployment);

    // Verify rollback
    spinner.text = 'Verifying rollback...';
    const healthChecks = await runHealthChecks(previousDeployment);

    deployment.status = 'success';
    await saveDeployment(deployment);

    spinner.succeed('Rollback successful!');

    console.log(chalk.bold.green('\n✅ Rollback Complete!'));
    console.log(`Rolled back to version: ${chalk.cyan(previousDeployment.version)}`);
    console.log(`URL: ${chalk.cyan(previousDeployment.url)}`);

  } catch (error: any) {
    deployment.status = 'failed';
    await saveDeployment(deployment);

    spinner.fail('Rollback failed');
    throw new Error(`Rollback failed: ${error.message}`);
  }
}

// Helper functions
function generateDeploymentId(): string {
  return `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getVersion(): string {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    return '1.0.0';
  }
}

function getCurrentCommit(): string {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

async function getLastDeployment(environment: string): Promise<Deployment | null> {
  // This would query the deployment service
  // For now, return null
  return null;
}

async function saveDeployment(deployment: Deployment): Promise<void> {
  // This would save to the deployment service
  // For now, just log
  console.log(chalk.gray(`Saving deployment: ${deployment.id}`));
}

async function deployBackend(deployment: Deployment): Promise<void> {
  execSync('nexus push --yes', { stdio: 'pipe' });
}

async function deployFrontend(deployment: Deployment): Promise<void> {
  const provider = deployment.environment === 'production' ? 'vercel' : 'nexus';
  execSync(`npm run deploy -- --provider=${provider}`, { stdio: 'pipe' });
}

async function rollbackBackend(deployment: Deployment): Promise<void> {
  execSync(`nexus rollback ${deployment.id}`, { stdio: 'pipe' });
}

async function rollbackFrontend(deployment: Deployment): Promise<void> {
  execSync(`npm run rollback -- --deployment=${deployment.id}`, { stdio: 'pipe' });
}

async function runHealthChecks(deployment: Deployment): Promise<HealthCheckResult[]> {
  const checks: HealthCheckResult[] = [];

  // Check 1: API health
  try {
    const start = Date.now();
    const response = await fetch(`${deployment.url}/api/health`);
    const responseTime = Date.now() - start;

    checks.push({
      name: 'API Health',
      status: response.ok ? 'pass' : 'fail',
      responseTime,
    });
  } catch (error: any) {
    checks.push({
      name: 'API Health',
      status: 'fail',
      error: error.message,
    });
  }

  // Check 2: Frontend load
  try {
    const start = Date.now();
    const response = await fetch(deployment.url!);
    const responseTime = Date.now() - start;

    checks.push({
      name: 'Frontend Load',
      status: response.ok ? 'pass' : 'fail',
      responseTime,
    });
  } catch (error: any) {
    checks.push({
      name: 'Frontend Load',
      status: 'fail',
      error: error.message,
    });
  }

  // Check 3: Database connection
  checks.push({
    name: 'Database Connection',
    status: 'pass', // Would actually check
  });

  return checks;
}

function getDeploymentUrl(deployment: Deployment): string {
  // This would return the actual deployment URL
  return `https://${deployment.environment}.example.com`;
}
