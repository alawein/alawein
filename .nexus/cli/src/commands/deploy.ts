import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execa } from 'execa';
import { existsSync } from 'fs';
import path from 'path';

interface DeployOptions {
  env?: string;
  force: boolean;
  skipBuild: boolean;
}

export async function deployCommand(options: DeployOptions) {
  // Check if we're in a Nexus project
  if (!existsSync(path.join(process.cwd(), '.nexus/platform.config.ts'))) {
    console.error(chalk.red('Error: Not in a Nexus platform directory'));
    process.exit(1);
  }

  // Determine environment
  let targetEnv = options.env;

  if (!targetEnv) {
    const currentBranch = await getCurrentBranch();

    // Map branch to environment
    const envMap: Record<string, string> = {
      'nexus/dev': 'development',
      'nexus/main': 'staging',
      'nexus/prod': 'production',
    };

    targetEnv = envMap[currentBranch] || 'development';
  }

  // Confirm deployment
  if (!options.force) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `Deploy to ${chalk.cyan(targetEnv)} environment?`,
        default: false,
      },
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('Deployment cancelled'));
      process.exit(0);
    }
  }

  const spinner = ora(`Deploying to ${targetEnv}...`).start();

  try {
    // Build if not skipped
    if (!options.skipBuild) {
      spinner.text = 'Building application...';
      await execa('npm', ['run', 'build'], { cwd: process.cwd() });
    }

    // Deploy with Amplify
    spinner.text = 'Deploying to Nexus Backend...';
    await execa('npx', ['nexus', 'push', '--yes'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    spinner.succeed(`Successfully deployed to ${targetEnv}!`);
    console.log();
    console.log(chalk.green('Deployment completed successfully'));

    // Show URLs
    const urls = getEnvironmentUrls(targetEnv);
    console.log(chalk.gray('  URLs:'));
    urls.forEach(url => {
      console.log(chalk.cyan(`    - ${url}`));
    });

  } catch (error) {
    spinner.fail('Deployment failed');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

async function getCurrentBranch(): Promise<string> {
  try {
    const { stdout } = await execa('git', ['branch', '--show-current'], {
      cwd: process.cwd(),
    });
    return stdout.trim();
  } catch {
    return 'development';
  }
}

function getEnvironmentUrls(env: string): string[] {
  const urls: Record<string, string[]> = {
    development: ['http://localhost:3000'],
    staging: ['https://staging.{{PLATFORM_DOMAIN}}'],
    production: ['https://app.{{PLATFORM_DOMAIN}}'],
  };

  return urls[env] || [];
}
