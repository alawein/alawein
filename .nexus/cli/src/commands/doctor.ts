import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { validateConfig, NexusConfig } from '../../shared/config-schema';

interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fix?: () => Promise<void>;
  autoFixable: boolean;
}

export async function doctorCommand(options: { fix?: boolean; verbose?: boolean }) {
  console.log(chalk.cyan('\n🔍 Nexus Framework Health Check'));
  console.log(chalk.gray('Diagnosing your project for potential issues...\n'));

  const checks: HealthCheck[] = [];
  const spinner = ora('Running diagnostics...').start();

  // Check 1: Project structure
  checks.push(checkProjectStructure());

  // Check 2: Configuration file
  checks.push(await checkConfiguration());

  // Check 3: Dependencies
  checks.push(await checkDependencies());

  // Check 4: Environment variables
  checks.push(await checkEnvironmentVariables());

  // Check 5: Git configuration
  checks.push(checkGitConfiguration());

  // Check 6: Build tools
  checks.push(await checkBuildTools());

  // Check 7: Cloud connectivity
  checks.push(await checkCloudConnectivity());

  spinner.stop();

  // Display results
  const passed = checks.filter(c => c.status === 'pass').length;
  const warnings = checks.filter(c => c.status === 'warn').length;
  const failed = checks.filter(c => c.status === 'fail').length;

  console.log(chalk.bold(`\n📊 Health Check Results:`));
  console.log(`✅ Passed: ${chalk.green(passed)}`);
  console.log(`⚠️  Warnings: ${chalk.yellow(warnings)}`);
  console.log(`❌ Failed: ${chalk.red(failed)}\n`);

  // Show details for failed and warning checks
  const issues = checks.filter(c => c.status !== 'pass');

  if (issues.length > 0) {
    console.log(chalk.bold('🔧 Issues Found:'));

    for (const check of issues) {
      const icon = check.status === 'fail' ? '❌' : '⚠️';
      console.log(`\n${icon} ${check.name}`);
      console.log(chalk.gray(`   ${check.message}`));

      if (check.autoFixable && options.fix) {
        console.log(chalk.blue('   Auto-fixing...'));
        await check.fix!();
        console.log(chalk.green('   ✓ Fixed'));
      } else if (check.autoFixable && !options.fix) {
        console.log(chalk.yellow(`   Can be auto-fixed with: nexus doctor --fix`));
      }
    }
  }

  // Offer to fix issues if not already done
  if (issues.some(c => c.autoFixable) && !options.fix) {
    const { shouldFix } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldFix',
        message: 'Would you like to auto-fix the issues above?',
        default: true,
      },
    ]);

    if (shouldFix) {
      console.log();
      await doctorCommand({ fix: true, verbose: options.verbose });
      return;
    }
  }

  // Show recommendations
  if (options.verbose || issues.length > 0) {
    showRecommendations(checks);
  }

  // Final status
  if (failed === 0) {
    console.log(chalk.bold.green('\n✅ Your Nexus project is healthy!'));
  } else {
    console.log(chalk.bold.red('\n❌ Please fix the critical issues above.'));
    process.exit(1);
  }
}

function checkProjectStructure(): HealthCheck {
  const requiredDirs = ['.nexus', 'src', 'src/components', 'src/pages'];
  const missingDirs = requiredDirs.filter(dir => !existsSync(dir));

  if (missingDirs.length === 0) {
    return {
      name: 'Project Structure',
      status: 'pass',
      message: 'All required directories exist',
      autoFixable: false,
    };
  }

  return {
    name: 'Project Structure',
    status: 'fail',
    message: `Missing directories: ${missingDirs.join(', ')}`,
    autoFixable: true,
    fix: async () => {
      for (const dir of missingDirs) {
        execSync(`mkdir -p ${dir}`, { stdio: 'pipe' });
      }
    },
  };
}

async function checkConfiguration(): Promise<HealthCheck> {
  const configPath = '.nexus/nexus.config.ts';

  if (!existsSync(configPath)) {
    return {
      name: 'Configuration File',
      status: 'fail',
      message: 'nexus.config.ts not found',
      autoFixable: true,
      fix: async () => {
        const defaultConfig = `import { createNexusConfig } from '@nexus/shared';

export default createNexusConfig('saas', {
  platform: {
    name: 'My Platform',
    description: 'A platform built with Nexus Framework',
    domain: 'example.com',
  },
});
`;
        writeFileSync(configPath, defaultConfig);
      },
    };
  }

  try {
    const config = require(configPath);
    validateConfig(config.default || config);
    return {
      name: 'Configuration File',
      status: 'pass',
      message: 'Configuration is valid',
      autoFixable: false,
    };
  } catch (error: any) {
    return {
      name: 'Configuration File',
      status: 'fail',
      message: `Invalid configuration: ${error.message}`,
      autoFixable: false,
    };
  }
}

async function checkDependencies(): Promise<HealthCheck> {
  const packageJsonPath = 'package.json';

  if (!existsSync(packageJsonPath)) {
    return {
      name: 'Dependencies',
      status: 'fail',
      message: 'package.json not found',
      autoFixable: false,
    };
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['@nexus/backend', '@nexus/cli'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]);

  if (missingDeps.length === 0) {
    return {
      name: 'Dependencies',
      status: 'pass',
      message: 'All required dependencies installed',
      autoFixable: false,
    };
  }

  return {
    name: 'Dependencies',
    status: 'warn',
    message: `Missing dependencies: ${missingDeps.join(', ')}`,
    autoFixable: true,
    fix: async () => {
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'pipe' });
    },
  };
}

async function checkEnvironmentVariables(): Promise<HealthCheck> {
  const configPath = '.nexus/nexus.config.ts';

  if (!existsSync(configPath)) {
    return {
      name: 'Environment Variables',
      status: 'warn',
      message: 'Cannot check without configuration file',
      autoFixable: false,
    };
  }

  try {
    const config = require(configPath);
    const nexusConfig: NexusConfig = config.default || config;
    const missingVars: string[] = [];

    // Check required environment variables
    for (const [envName, envConfig] of Object.entries(nexusConfig.environments)) {
      if (envConfig.secrets) {
        for (const secret of envConfig.secrets) {
          if (!process.env[secret]) {
            missingVars.push(`${secret} (for ${envName})`);
          }
        }
      }
    }

    if (missingVars.length === 0) {
      return {
        name: 'Environment Variables',
        status: 'pass',
        message: 'All required environment variables set',
        autoFixable: false,
      };
    }

    return {
      name: 'Environment Variables',
      status: 'warn',
      message: `Missing environment variables: ${missingVars.join(', ')}`,
      autoFixable: false,
    };
  } catch (error) {
    return {
      name: 'Environment Variables',
      status: 'warn',
      message: 'Cannot validate environment variables',
      autoFixable: false,
    };
  }
}

function checkGitConfiguration(): HealthCheck {
  if (!existsSync('.git')) {
    return {
      name: 'Git Configuration',
      status: 'warn',
      message: 'Not a git repository',
      autoFixable: true,
      fix: async () => {
        execSync('git init', { stdio: 'pipe' });
      },
    };
  }

  // Check for required branches
  try {
    const branches = execSync('git branch', { encoding: 'utf8' });
    const requiredBranches = ['nexus/dev', 'nexus/main', 'nexus/prod'];
    const missingBranches = requiredBranches.filter(branch => !branches.includes(branch));

    if (missingBranches.length === 0) {
      return {
        name: 'Git Configuration',
        status: 'pass',
        message: 'All required branches exist',
        autoFixable: false,
      };
    }

    return {
      name: 'Git Configuration',
      status: 'warn',
      message: `Missing branches: ${missingBranches.join(', ')}`,
      autoFixable: true,
      fix: async () => {
        for (const branch of missingBranches) {
          execSync(`git checkout -b ${branch}`, { stdio: 'pipe' });
        }
        execSync('git checkout nexus/dev', { stdio: 'pipe' });
      },
    };
  } catch (error) {
    return {
      name: 'Git Configuration',
      status: 'warn',
      message: 'Unable to check git branches',
      autoFixable: false,
    };
  }
}

async function checkBuildTools(): Promise<HealthCheck> {
  try {
    // Check if TypeScript is configured
    if (!existsSync('tsconfig.json')) {
      return {
        name: 'Build Tools',
        status: 'warn',
        message: 'tsconfig.json not found',
        autoFixable: true,
        fix: async () => {
          const defaultTsConfig = {
            compilerOptions: {
              target: 'ES2020',
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              module: 'ESNext',
              skipLibCheck: true,
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'react-jsx',
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true,
              baseUrl: '.',
              paths: {
                '@/*': ['./src/*'],
              },
            },
            include: ['src'],
            references: [{ path: './tsconfig.node.json' }],
          };
          writeFileSync('tsconfig.json', JSON.stringify(defaultTsConfig, null, 2));
        },
      };
    }

    // Check if build command works
    execSync('npm run build --dry-run', { stdio: 'pipe' });

    return {
      name: 'Build Tools',
      status: 'pass',
      message: 'Build tools configured correctly',
      autoFixable: false,
    };
  } catch (error: any) {
    return {
      name: 'Build Tools',
      status: 'warn',
      message: `Build issue: ${error.message}`,
      autoFixable: false,
    };
  }
}

async function checkCloudConnectivity(): Promise<HealthCheck> {
  // Check if Nexus CLI is authenticated
  try {
    execSync('nexus whoami', { stdio: 'pipe' });

    return {
      name: 'Cloud Connectivity',
      status: 'pass',
      message: 'Connected to Nexus Cloud',
      autoFixable: false,
    };
  } catch (error) {
    return {
      name: 'Cloud Connectivity',
      status: 'warn',
      message: 'Not connected to Nexus Cloud',
      autoFixable: false,
    };
  }
}

function showRecommendations(checks: HealthCheck[]) {
  console.log(chalk.bold('\n💡 Recommendations:'));

  const recommendations = [
    'Enable auto-deployment for faster iterations',
    'Set up monitoring to track performance',
    'Configure environment-specific variables',
    'Add automated tests to your CI/CD pipeline',
    'Enable performance budgets to prevent regressions',
  ];

  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}
