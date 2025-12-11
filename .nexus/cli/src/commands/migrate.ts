import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { validateConfig, createNexusConfig } from '../../shared/config-schema';

interface MigrateOptions {
  from?: string;
  dryRun?: boolean;
  force?: boolean;
  skipInstall?: boolean;
}

interface MigrationResult {
  success: boolean;
  migrated: string[];
  errors: string[];
  warnings: string[];
  nextSteps: string[];
}

export async function migrateCommand(options: MigrateOptions) {
  console.log(chalk.cyan('\n🔄 Nexus Framework Migration'));
  console.log(chalk.gray('Migrate your existing project to Nexus...\n'));

  try {
    // Detect current framework if not specified
    const sourceFramework = options.from || await detectFramework();

    // Validate project can be migrated
    await validateMigration(sourceFramework);

    // Show migration plan
    const plan = await createMigrationPlan(sourceFramework, options);

    // Confirm migration
    if (!options.force && !options.dryRun) {
      const { confirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `Proceed with migration from ${sourceFramework} to Nexus?`,
          default: true,
        },
      ]);

      if (!confirmed) {
        console.log(chalk.yellow('Migration cancelled.'));
        return;
      }
    }

    // Execute migration
    const result = await executeMigration(plan, options);

    // Show results
    displayMigrationResults(result);

  } catch (error: any) {
    console.error(chalk.red(`\n❌ Migration failed: ${error.message}`));
    process.exit(1);
  }
}

async function detectFramework(): Promise<string> {
  const spinner = ora('Detecting framework...').start();

  const frameworks = {
    'next': ['next.config.js', 'next.config.mjs'],
    'cra': ['public/index.html', 'src/App.js', 'src/reportWebVitals.js'],
    'vite': ['vite.config.js', 'vite.config.ts'],
    'gatsby': ['gatsby-config.js', 'gatsby-node.js'],
    'nuxt': ['nuxt.config.js', 'nuxt.config.ts'],
    'remix': ['remix.config.js', 'app/root.tsx'],
  };

  const packageJson = existsSync('package.json') ? JSON.parse(readFileSync('package.json', 'utf8')) : {};
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Check by config files
  for (const [framework, configs] of Object.entries(frameworks)) {
    if (configs.some(config => existsSync(config))) {
      spinner.succeed(`Detected: ${framework}`);
      return framework;
    }
  }

  // Check by dependencies
  if (deps.next) {
    spinner.succeed('Detected: next');
    return 'next';
  }

  if (deps.react && deps['react-scripts']) {
    spinner.succeed('Detected: cra');
    return 'cra';
  }

  if (deps.vite) {
    spinner.succeed('Detected: vite');
    return 'vite';
  }

  if (deps.gatsby) {
    spinner.succeed('Detected: gatsby');
    return 'gatsby';
  }

  if (deps.nuxt) {
    spinner.succeed('Detected: nuxt');
    return 'nuxt';
  }

  if (deps['@remix-run/react']) {
    spinner.succeed('Detected: remix');
    return 'remix';
  }

  spinner.fail('Could not detect framework');

  // Ask user to specify
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework are you migrating from?',
      choices: [
        'next',
        'cra',
        'vite',
        'gatsby',
        'nuxt',
        'remix',
        'other',
      ],
    },
  ]);

  return framework;
}

async function validateMigration(framework: string) {
  const checks = [];

  // Check if already a Nexus project
  if (existsSync('.nexus/nexus.config.ts')) {
    throw new Error('This is already a Nexus project');
  }

  // Check for required files
  if (!existsSync('package.json')) {
    throw new Error('package.json not found. Please run this from a project root.');
  }

  // Framework-specific validations
  switch (framework) {
    case 'next':
      if (!existsSync('pages') && !existsSync('src/app')) {
        checks.push('Warning: Could not find Next.js pages or app directory');
      }
      break;

    case 'cra':
      if (!existsSync('src/App.js') && !existsSync('src/App.tsx')) {
        checks.push('Warning: Could not find Create React App App component');
      }
      break;

    case 'vite':
      if (!existsSync('src/main.jsx') && !existsSync('src/main.tsx')) {
        checks.push('Warning: Could not find Vite entry point');
      }
      break;
  }

  if (checks.length > 0) {
    console.log(chalk.yellow('\n⚠️  Warnings:'));
    checks.forEach(check => console.log(chalk.gray(`   • ${check}`)));
  }
}

async function createMigrationPlan(framework: string, options: MigrateOptions) {
  const plan = {
    framework,
    steps: [] as string[],
    filesToMigrate: [] as string[],
    dependenciesToAdd: [] as string[],
    dependenciesToRemove: [] as string[],
  };

  // Read package.json
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

  switch (framework) {
    case 'next':
      plan.steps.push(
        'Create Nexus configuration',
        'Migrate Next.js pages to Nexus routing',
        'Convert API routes to Nexus functions',
        'Update imports from Next.js to Nexus',
        'Migrate environment variables',
        'Update build configuration'
      );
      plan.dependenciesToAdd = ['@nexus/backend', '@nexus/cli', '@nexus/ui-react'];
      plan.dependenciesToRemove = ['next'];
      plan.filesToMigrate = await findFiles('pages/**/*.{js,jsx,ts,tsx}');
      plan.filesToMigrate.push(...await findFiles('src/app/**/*.{js,jsx,ts,tsx}'));
      break;

    case 'cra':
      plan.steps.push(
        'Create Nexus configuration',
        'Migrate CRA routing to Nexus router',
        'Update public folder structure',
        'Convert service worker to Nexus',
        'Update imports from CRA to Nexus'
      );
      plan.dependenciesToAdd = ['@nexus/backend', '@nexus/cli', 'react-router-dom'];
      plan.dependenciesToRemove = ['react-scripts'];
      plan.filesToMigrate = ['src/App.js', 'src/App.tsx', 'src/index.js', 'src/index.tsx'];
      break;

    case 'vite':
      plan.steps.push(
        'Create Nexus configuration',
        'Update Vite config to Nexus',
        'Migrate routing if needed',
        'Add Nexus-specific features'
      );
      plan.dependenciesToAdd = ['@nexus/backend', '@nexus/cli'];
      plan.filesToMigrate = ['vite.config.js', 'vite.config.ts'];
      break;
  }

  return plan;
}

async function executeMigration(plan: any, options: MigrateOptions): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migrated: [],
    errors: [],
    warnings: [],
    nextSteps: [],
  };

  const spinner = ora('Migrating...').start();

  try {
    // Step 1: Create .nexus directory structure
    if (!options.dryRun) {
      spinner.text = 'Creating Nexus directory structure...';
      execSync('mkdir -p .nexus/{functions,data,storage,auth}', { stdio: 'pipe' });
      result.migrated.push('.nexus directory structure');
    }

    // Step 2: Create nexus.config.ts
    spinner.text = 'Creating Nexus configuration...';
    const config = await createNexusConfigForMigration(plan.framework);
    if (!options.dryRun) {
      writeFileSync('.nexus/nexus.config.ts', config);
      result.migrated.push('nexus.config.ts');
    }

    // Step 3: Update package.json
    spinner.text = 'Updating dependencies...';
    await updatePackageJson(plan, options);
    result.migrated.push('package.json');

    // Step 4: Migrate files based on framework
    spinner.text = `Migrating ${plan.framework} files...`;
    await migrateFiles(plan, options);
    result.migrated.push(`${plan.framework} files`);

    // Step 5: Update configuration files
    spinner.text = 'Updating configuration files...';
    await updateConfigFiles(plan, options);
    result.migrated.push('configuration files');

    // Step 6: Install new dependencies
    if (!options.skipInstall && !options.dryRun) {
      spinner.text = 'Installing new dependencies...';
      execSync('npm install', { stdio: 'pipe' });
      result.migrated.push('dependencies installed');
    }

    spinner.succeed('Migration complete!');

    // Generate next steps
    result.nextSteps = [
      'Run "nexus doctor" to check project health',
      'Start development with "nexus dev"',
      'Review migrated files for any manual adjustments',
      'Test your application thoroughly',
      'Deploy with "nexus deploy" when ready',
    ];

    return result;

  } catch (error: any) {
    spinner.fail('Migration failed');
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

async function createNexusConfigForMigration(framework: string): Promise<string> {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const projectName = packageJson.name || 'migrated-app';

  let platformType = 'oss';
  let features = {
    authentication: { enabled: false },
    database: { enabled: false },
    storage: { enabled: false },
    functions: { enabled: false },
    api: { enabled: true },
  };

  // Configure based on source framework
  switch (framework) {
    case 'next':
      platformType = 'saas';
      features.functions.enabled = true; // For API routes
      features.api.enabled = true;
      break;

    case 'cra':
      platformType = 'landing';
      break;

    case 'vite':
      // Keep existing features
      break;
  }

  const config = createNexusConfig(platformType, {
    platform: {
      name: projectName,
      description: `${projectName} - migrated from ${framework}`,
      domain: `${projectName}.example.com`,
    },
    features,
  });

  return `import { createNexusConfig } from '@nexus/shared';

export default createNexusConfig('${platformType}', ${JSON.stringify(config, null, 2)});
`;
}

async function updatePackageJson(plan: any, options: MigrateOptions) {
  if (options.dryRun) return;

  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

  // Remove old dependencies
  plan.dependenciesToRemove.forEach((dep: string) => {
    delete packageJson.dependencies?.[dep];
    delete packageJson.devDependencies?.[dep];
  });

  // Add new dependencies
  if (!packageJson.dependencies) packageJson.dependencies = {};
  if (!packageJson.devDependencies) packageJson.devDependencies = {};

  plan.dependenciesToAdd.forEach((dep: string) => {
    packageJson.devDependencies[dep] = '^1.0.0';
  });

  // Update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    dev: 'nexus dev',
    build: 'nexus build',
    deploy: 'nexus deploy',
    'nexus:push': 'nexus push --yes',
  };

  writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

async function migrateFiles(plan: any, options: MigrateOptions) {
  if (options.dryRun) return;

  switch (plan.framework) {
    case 'next':
      await migrateFromNext(plan);
      break;

    case 'cra':
      await migrateFromCRA(plan);
      break;

    case 'vite':
      await migrateFromVite(plan);
      break;
  }
}

async function migrateFromNext(plan: any) {
  // Migrate pages directory
  if (existsSync('pages')) {
    const pages = await findFiles('pages/**/*.{js,jsx,ts,tsx}');

    for (const page of pages) {
      const content = readFileSync(page, 'utf8');

      // Convert Next.js imports
      let migratedContent = content
        .replace(/from ['"]next['"]/g, 'from "@nexus/backend"')
        .replace(/from ['"]next\/router['"]/g, 'from "react-router-dom"')
        .replace(/from ['"]next\/image['"]/g, 'from "@nexus/ui-react"')
        .replace(/export default/g, '// Next.js export - convert to Nexus routing\n// export default');

      // Handle getServerSideProps
      if (content.includes('getServerSideProps')) {
        migratedContent += '\n\n// TODO: Convert getServerSideProps to Nexus server function';
      }

      // Handle getStaticProps
      if (content.includes('getStaticProps')) {
        migratedContent += '\n\n// TODO: Convert getStaticProps to Nexus static generation';
      }

      writeFileSync(page, migratedContent);
    }
  }

  // Migrate API routes
  if (existsSync('pages/api')) {
    const apiRoutes = await findFiles('pages/api/**/*.{js,ts}');

    for (const route of apiRoutes) {
      const content = readFileSync(route, 'utf8');

      // Convert to Nexus function
      const nexusFunction = `
import { NexusFunction } from '@nexus/backend';

export const handler: NexusFunction = async (event) => {
  // TODO: Convert Next.js API route to Nexus function
  ${content.includes('export default') ? content.split('export default')[1] : content}
};
`;

      const newPath = route.replace('pages/api', '.nexus/functions');
      const dir = dirname(newPath);
      execSync(`mkdir -p ${dir}`, { stdio: 'pipe' });
      writeFileSync(newPath, nexusFunction);
    }
  }
}

async function migrateFromCRA(plan: any) {
  // Update main entry point
  const mainFiles = ['src/index.js', 'src/index.tsx'];

  for (const mainFile of mainFiles) {
    if (existsSync(mainFile)) {
      const content = readFileSync(mainFile, 'utf8');

      let migratedContent = content
        .replace(/import.*reportWebVitals.*;/, '// reportWebVitals removed - use Nexus monitoring instead')
        .replace(/reportWebVitals\(\);/, '// Nexus monitoring automatically tracks performance');

      writeFileSync(mainFile, migratedContent);
    }
  }

  // Update App component
  const appFiles = ['src/App.js', 'src/App.tsx'];

  for (const appFile of appFiles) {
    if (existsSync(appFile)) {
      const content = readFileSync(appFile, 'utf8');

      // Add router if not present
      if (!content.includes('BrowserRouter')) {
        const migratedContent = content.replace(
          'import React from \'react\';',
          `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';`
        );

        // Wrap app in router
        const wrappedContent = migratedContent.replace(
          /export default function App\(\) \{([\s\S]*?)\}/,
          `export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>${migratedContent.includes('<h1>') ? migratedContent.match(/<h1>.*?<\/h1>/)?.[0] || 'Home' : 'Home'}</div>} />
      </Routes>
    </Router>
  );
}`
        );

        writeFileSync(appFile, wrappedContent);
      }
    }
  }
}

async function migrateFromVite(plan: any) {
  // Update vite config
  const viteConfigs = ['vite.config.js', 'vite.config.ts'];

  for (const configFile of viteConfigs) {
    if (existsSync(configFile)) {
      const content = readFileSync(configFile, 'utf8');

      // Add Nexus plugin
      const nexusPlugin = `
import { nexus } from '@nexus/vite-plugin';
`;

      const updatedContent = content.replace(
        'export default defineConfig({',
        nexusPlugin + 'export default defineConfig({'
      ).replace(
        'plugins: [',
        'plugins: [nexus(),'
      );

      writeFileSync(configFile, updatedContent);
    }
  }
}

async function updateConfigFiles(plan: any, options: MigrateOptions) {
  if (options.dryRun) return;

  // Remove old config files
  const oldConfigs = {
    'next': ['next.config.js', 'next.config.mjs'],
    'cra': [],
    'vite': [],
  };

  const configsToRemove = oldConfigs[plan.framework] || [];

  configsToRemove.forEach(config => {
    if (existsSync(config)) {
      execSync(`mv ${config} ${config}.backup`, { stdio: 'pipe' });
    }
  });

  // Create .gitignore updates
  const gitignorePath = '.gitignore';
  let gitignore = '';

  if (existsSync(gitignorePath)) {
    gitignore = readFileSync(gitignorePath, 'utf8');
  }

  if (!gitignore.includes('.nexus/')) {
    gitignore += '\n# Nexus\n.nexus/\nnexus_outputs.json\n';
    writeFileSync(gitignorePath, gitignore);
  }
}

async function findFiles(pattern: string): Promise<string[]> {
  try {
    const files = execSync(`find . -name "${pattern}" -type f`, { encoding: 'utf8' });
    return files.trim().split('\n').filter(f => f);
  } catch (error) {
    return [];
  }
}

function displayMigrationResults(result: MigrationResult) {
  console.log(chalk.bold('\n📊 Migration Results:'));

  if (result.success) {
    console.log(chalk.green('\n✅ Migration Successful!'));

    if (result.migrated.length > 0) {
      console.log(chalk.bold('\n📝 Migrated:'));
      result.migrated.forEach(item => {
        console.log(chalk.green(`   ✓ ${item}`));
      });
    }

    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      result.warnings.forEach(warning => {
        console.log(chalk.yellow(`   • ${warning}`));
      });
    }

    if (result.nextSteps.length > 0) {
      console.log(chalk.bold('\n🚀 Next Steps:'));
      result.nextSteps.forEach((step, index) => {
        console.log(`${index + 1}. ${chalk.cyan(step)}`);
      });
    }

  } else {
    console.log(chalk.red('\n❌ Migration Failed'));

    if (result.errors.length > 0) {
      console.log(chalk.bold('\nErrors:'));
      result.errors.forEach(error => {
        console.log(chalk.red(`   • ${error}`));
      });
    }
  }

  console.log(chalk.gray('\n💡 Need help? Visit https://docs.nexus.dev/migration'));
}
