import { Command } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';
import ora from 'ora';
import { existsSync } from 'fs';
import path from 'path';

interface DevOptions {
  port: string;
  sandbox: boolean;
  mock: boolean;
  debug: boolean;
}

export async function devCommand(options: DevOptions) {
  // Check if we're in a Nexus project
  if (!existsSync(path.join(process.cwd(), '.nexus/platform.config.ts'))) {
    console.error(chalk.red('Error: Not in a Nexus platform directory'));
    console.log(chalk.gray('Run "nexus create" to create a new platform'));
    process.exit(1);
  }

  const spinner = ora('Starting development server...').start();

  try {
    // Start Nexus sandbox if enabled
    if (options.sandbox) {
      spinner.text = 'Starting Nexus sandbox...';
      const sandboxProcess = execa('npx', ['nexus', 'sandbox'], {
        stdio: 'pipe',
        cwd: process.cwd(),
      });

      // Wait a bit for sandbox to start
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Start Vite dev server
    spinner.text = `Starting dev server on port ${options.port}...`;

    const devServer = execa('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        VITE_PORT: options.port,
        VITE_SANDBOX: options.sandbox.toString(),
        VITE_MOCK_DATA: options.mock.toString(),
        VITE_DEBUG: options.debug.toString(),
      },
    });

    spinner.succeed('Development server started!');
    console.log();
    console.log(chalk.green('🚀 Development server is running'));
    console.log(chalk.gray('  Local:  '), chalk.cyan(`http://localhost:${options.port}`));
    console.log(chalk.gray('  Network:'), chalk.cyan(`http://localhost:${options.port}`));
    console.log();
    console.log(chalk.gray('Press Ctrl+C to stop'));

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\n\nShutting down development server...'));
      devServer.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    spinner.fail('Failed to start development server');
    console.error(chalk.red(error));
    process.exit(1);
  }
}
