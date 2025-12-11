#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create';
import { initCommand } from './commands/init';
import { migrateCommand } from './commands/migrate';
import { generateCommand } from './commands/generate';
import { testCommand } from './commands/test';
import { devCommand } from './commands/dev';
import { deployCommand } from './commands/deploy';
import { configCommand } from './commands/config';
import { listCommand } from './commands/list';
import { deleteCommand } from './commands/delete';
import { doctorCommand } from './commands/doctor';
import { monitorCommand } from './commands/monitor';
import { docsCommand } from './commands/docs';
import { updateCommand } from './commands/update';

const program = new Command();

program
  .name('nexus')
  .description('Nexus Framework CLI - Create and manage multi-platform applications')
  .version('1.0.0');

// ASCII Art Logo
const logo = chalk.cyan(`
  _   _                 _      _   _           _
 | | | |               | |    | | | |         | |
 | |_| | __ _ _ __   __| | ___| | | | ___  ___| |
 |  _  |/ _\` | '_ \\ / _\` |/ _ \\ | | |/ _ \\/ _ \\ |
 | | | | (_| | | | | (_| |  __/ \\ | |  __/  __/ |
 \\_| |_/\\__,_|_| |_|\\__,_|\\___|  \\_|_|\\___|\\___|_|

 Framework - Build Multi-Platform SaaS Applications
`);

program.addHelpText('beforeAll', logo);

// Create command
program
  .command('create')
  .description('Create a new Nexus platform')
  .argument('<name>', 'Name of the platform')
  .option('-t, --type <type>', 'Type of platform (saas, oss, blog, store, landing)', 'saas')
  .option('-d, --directory <directory>', 'Directory to create the platform in')
  .option('--skip-install', 'Skip installing dependencies')
  .option('--git', 'Initialize git repository', true)
  .action(createCommand);

// Init command
program
  .command('init')
  .description('Initialize a new Nexus project')
  .option('-t, --template <type>', 'Project template (saas, blog, store, landing, oss)', 'saas')
  .option('-n, --name <name>', 'Project name')
  .option('--skip-install', 'Skip installing dependencies')
  .option('--skip-git', 'Skip git initialization')
  .action(initCommand);

// Migrate command
program
  .command('migrate')
  .description('Migrate existing project to Nexus')
  .option('-f, --from <framework>', 'Source framework (next, cra, vite, gatsby, nuxt, remix)')
  .option('--dry-run', 'Preview changes without applying')
  .option('--force', 'Skip confirmation prompts')
  .option('--skip-install', 'Skip installing dependencies')
  .action(migrateCommand);

// Generate command
program
  .command('generate')
  .alias('g')
  .description('Generate code templates and scaffolding')
  .option('-t, --type <type>', 'Type of generator (component, page, api, model, etc.)')
  .option('-n, --name <name>', 'Name for the generated item')
  .option('-p, --path <path>', 'Output path for generated files')
  .option('--template <template>', 'Template to use', 'default')
  .option('--force', 'Overwrite existing files')
  .action(generateCommand);

// Test command
program
  .command('test')
  .description('Run tests with intelligent configuration')
  .option('-w, --watch', 'Run tests in watch mode')
  .option('-c, --coverage', 'Generate coverage report')
  .option('-u, --ui', 'Open test UI (Vitest only)')
  .option('-t, --type <type>', 'Test type: unit, integration, e2e, or all', 'all')
  .option('-r, --reporter <reporter>', 'Test reporter')
  .option('-v, --verbose', 'Verbose output')
  .option('--run-in-band', 'Run tests serially')
  .action(testCommand);

// Test generate command
program
  .command('test:generate')
  .description('Generate test file for component, API, or service')
  .argument('<type>', 'Type of test (component, api, service, hook, integration, e2e)')
  .argument('<name>', 'Name of the item to test')
  .action((type, name) => {
    const { testGenerateCommand } = require('./commands/test');
    testGenerateCommand(type, name);
  });

// Dev command
program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port to run on', '3000')
  .option('--sandbox', 'Enable cloud sandbox', true)
  .option('--mock', 'Use mock data', true)
  .option('--debug', 'Enable debug mode', true)
  .action(devCommand);

// Deploy command
program
  .command('deploy')
  .description('Deploy platform to environment')
  .option('-e, --env <env>', 'Environment to deploy to (dev, staging, production)')
  .option('--force', 'Force deployment without confirmation')
  .option('--skip-build', 'Skip build step')
  .action(deployCommand);

// Config command
program
  .command('config')
  .description('Manage platform configuration')
  .option('-g, --get <key>', 'Get configuration value')
  .option('-s, --set <key>', 'Set configuration value')
  .option('-v, --value <value>', 'Value to set')
  .option('--validate', 'Validate configuration')
  .action(configCommand);

// List command
program
  .command('list')
  .description('List all Nexus platforms')
  .option('--json', 'Output in JSON format')
  .action(listCommand);

// Delete command
program
  .command('delete <name>')
  .description('Delete a Nexus platform')
  .option('--force', 'Force deletion without confirmation')
  .action(deleteCommand);

// Doctor command
program
  .command('doctor')
  .description('Check system health and dependencies')
  .option('--fix', 'Attempt to fix issues automatically')
  .option('--verbose', 'Show detailed information')
  .action(doctorCommand);

// Monitor command
program
  .command('monitor')
  .description('Monitor application performance and metrics')
  .option('--dashboard', 'Open monitoring dashboard')
  .option('--alerts', 'Configure alerts')
  .option('--setup', 'Set up monitoring for project')
  .option('-e, --env <env>', 'Target environment')
  .action(monitorCommand);

// Docs command
program
  .command('docs')
  .description('View interactive documentation')
  .option('-p, --port <port>', 'Port to run documentation server', '3002')
  .option('--build', 'Build static documentation')
  .option('--deploy', 'Deploy documentation')
  .option('--watch', 'Watch for changes')
  .action(docsCommand);

// Update command
program
  .command('update')
  .description('Update Nexus framework and dependencies')
  .option('--check', 'Check for updates only')
  .action(updateCommand);

// Global error handler
program.exitOverride();

process.on('uncaughtException', (error) => {
  console.error(chalk.red('Unexpected error:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('Unhandled rejection:'), reason);
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
