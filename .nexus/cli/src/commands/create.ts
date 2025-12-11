import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { validateNpmPackageName } from 'validate-npm-package-name';
import { execa } from 'execa';
import { Listr } from 'listr2';

interface CreateOptions {
  type: string;
  directory?: string;
  skipInstall: boolean;
  git: boolean;
}

export async function createCommand(name: string, options: CreateOptions) {
  // Validate project name
  const validation = validateNpmPackageName(name);
  if (!validation.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: ${name}`));
    validation.errors?.forEach((err) => console.error(chalk.red(`Error: ${err}`)));
    process.exit(1);
  }

  // Prompt for missing options
  if (!options.type) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of platform do you want to create?',
        choices: [
          { name: '🚀 SaaS Platform - Full-featured software service', value: 'saas' },
          { name: '📖 OSS Platform - Open source project', value: 'oss' },
          { name: '📝 Blog Platform - Content-focused blog', value: 'blog' },
          { name: '🛍️ Store Platform - E-commerce store', value: 'store' },
          { name: '🎯 Landing Page - Marketing or product page', value: 'landing' },
        ],
      },
    ]);
    options.type = answers.type;
  }

  // Set target directory
  const targetDir = options.directory || path.join(process.cwd(), name);

  // Check if directory exists
  if (await fs.pathExists(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${targetDir} already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'));
      process.exit(0);
    }

    await fs.remove(targetDir);
  }

  // Create tasks
  const tasks = new Listr([
    {
      title: 'Creating platform structure',
      task: async (ctx, task) => {
        task.output = `Creating ${options.type} platform: ${name}`;

        // Get template path
        const templatePath = path.join(__dirname, '../../templates', options.type);

        // Check if template exists
        if (!(await fs.pathExists(templatePath))) {
          throw new Error(`Template for ${options.type} not found`);
        }

        // Copy template
        await fs.copy(templatePath, targetDir);

        // Update package.json
        const packageJsonPath = path.join(targetDir, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);
          packageJson.name = name;
          packageJson.version = '0.1.0';
          await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        }

        // Update platform.config.ts
        const configPath = path.join(targetDir, '.nexus/platform.config.ts');
        if (await fs.pathExists(configPath)) {
          let config = await fs.readFile(configPath, 'utf-8');
          config = config.replace(/{{PLATFORM_NAME}}/g, name);
          config = config.replace(/{{PLATFORM_DESCRIPTION}}/g, `A ${options.type} platform built with Nexus`);
          config = config.replace(/{{PLATFORM_DOMAIN}}/g, `${name}.example.com`);
          config = config.replace(/{{PLATFORM_URL}}/g, `https://app.${name}.example.com`);
          await fs.writeFile(configPath, config);
        }

        ctx.projectPath = targetDir;
      },
    },
    {
      title: 'Initializing git repository',
      task: async (ctx, task) => {
        if (!options.git) {
          task.skip('Git initialization disabled');
          return;
        }

        try {
          await execa('git', ['init'], { cwd: targetDir });
          await execa('git', ['add', '.'], { cwd: targetDir });
          await execa('git', ['commit', '-m', 'Initial commit'], { cwd: targetDir });
        } catch (error) {
          task.skip('Git not available');
        }
      },
    },
    {
      title: 'Installing dependencies',
      task: async (ctx, task) => {
        if (options.skipInstall) {
          task.skip('Skipping dependency installation');
          return;
        }

        const spinner = ora('Installing dependencies...').start();

        try {
          await execa('npm', ['install'], { cwd: targetDir, stdio: 'pipe' });
          spinner.succeed('Dependencies installed');
        } catch (error) {
          spinner.fail('Failed to install dependencies');
          throw error;
        }
      },
    },
    {
      title: 'Setting up Amplify',
      task: async (ctx, task) => {
        task.output = 'Initializing AWS Amplify backend';

        try {
          await execa('npx', ['amplify', 'init', '--yes'], {
            cwd: targetDir,
            stdio: 'pipe'
          });
        } catch (error) {
          task.output = 'Amplify init failed - you may need to run it manually';
          task.skip('Amplify setup requires AWS credentials');
        }
      },
    },
  ]);

  // Run tasks
  try {
    await tasks.run();

    console.log(chalk.green('\n✅ Success! Created Nexus platform:'), chalk.cyan(name));
    console.log();
    console.log('Next steps:');
    console.log(chalk.gray('  1.'), `cd ${name}`);
    console.log(chalk.gray('  2.'), 'Configure your environment variables in .env.local');
    console.log(chalk.gray('  3.'), 'Run', chalk.cyan('nexus dev'), 'to start development');
    console.log();
    console.log('Get started:');
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan('  nexus dev'));
    console.log();
    console.log('Happy building! 🚀');

  } catch (error) {
    console.error(chalk.red('\n❌ Failed to create platform:'), error);
    process.exit(1);
  }
}
