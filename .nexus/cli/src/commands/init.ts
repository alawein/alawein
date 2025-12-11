import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createNexusConfig } from '../shared/config-schema';

interface InitOptions {
  template?: string;
  name?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.cyan('\n🚀 Nexus Framework Initialization'));
  console.log(chalk.gray('Creating a new Nexus project with zero-config setup...\n'));

  // Check if we're in an empty directory or if project already exists
  if (existsSync('package.json') || existsSync('.nexus')) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Directory is not empty. Continue anyway?',
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Initialization cancelled.'));
      process.exit(0);
    }
  }

  // Gather project information
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name',
      default: options.name || 'my-nexus-app',
      validate: (input) => input.trim() !== '' || 'Project name is required',
    },
    {
      type: 'list',
      name: 'template',
      message: 'Choose a template',
      choices: [
        { name: '🚀 SaaS Platform - Full-featured with auth, billing, teams', value: 'saas' },
        { name: '📚 Blog - Content-focused with CMS and SEO', value: 'blog' },
        { name: '🛍️  E-commerce Store - Product catalog with payments', value: 'store' },
        { name: '🏠 Landing Page - Marketing site with analytics', value: 'landing' },
        { name: '📦 OSS Library - Open source project with docs', value: 'oss' },
      ],
      default: options.template || 'saas',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'A platform built with Nexus Framework',
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Production domain',
      default: (answers: any) => `${answers.name}.example.com`,
      validate: (input) => input.trim() !== '' || 'Domain is required',
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Include Tailwind CSS?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Configure ESLint and Prettier?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'testing',
      message: 'Set up testing framework?',
      default: true,
    },
  ]);

  const spinner = ora('Initializing project...').start();

  try {
    // 1. Create project structure
    spinner.text = 'Creating project structure...';
    createProjectStructure(answers);

    // 2. Generate configuration files
    spinner.text = 'Generating configuration files...';
    await generateConfigFiles(answers);

    // 3. Create source files
    spinner.text = 'Creating source files...';
    await createSourceFiles(answers);

    // 4. Initialize git
    if (!options.skipGit) {
      spinner.text = 'Initializing git repository...';
      await initGit();
    }

    // 5. Install dependencies
    if (!options.skipInstall) {
      spinner.text = 'Installing dependencies...';
      await installDependencies(answers);
    }

    spinner.succeed('Project initialized successfully!');

    // Show next steps
    showNextSteps(answers);

  } catch (error: any) {
    spinner.fail('Initialization failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function createProjectStructure(answers: any) {
  const dirs = [
    '.nexus',
    '.nexus/functions',
    '.nexus/data',
    '.nexus/storage',
    '.nexus/auth',
    'src',
    'src/components',
    'src/pages',
    'src/hooks',
    'src/lib',
    'src/types',
    'src/styles',
    'tests',
    'tests/unit',
    'tests/integration',
    'tests/e2e',
    '.github',
    '.github/workflows',
  ];

  // Add template-specific directories
  if (answers.template === 'saas') {
    dirs.push('src/app', 'src/app/dashboard', 'src/app/settings', 'src/app/billing');
  } else if (answers.template === 'blog') {
    dirs.push('src/posts', 'src/content');
  } else if (answers.template === 'store') {
    dirs.push('src/products', 'src/cart', 'src/checkout');
  }

  dirs.forEach(dir => {
    mkdirSync(dir, { recursive: true });
  });
}

async function generateConfigFiles(answers: any) {
  // 1. nexus.config.ts
  const nexusConfig = createNexusConfig(answers.template, {
    platform: {
      name: answers.name,
      description: answers.description,
      domain: answers.domain,
    },
  });

  writeFileSync(
    '.nexus/nexus.config.ts',
    `import { createNexusConfig } from '@nexus/shared';

export default createNexusConfig('${answers.template}', ${JSON.stringify(nexusConfig, null, 2)});
`
  );

  // 2. package.json
  const packageJson = {
    name: answers.name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'nexus dev',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: answers.eslint ? 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0' : undefined,
      'lint:fix': answers.eslint ? 'eslint . --ext ts,tsx --fix' : undefined,
      'type-check': 'tsc --noEmit',
      test: answers.testing ? 'vitest' : undefined,
      'test:ui': answers.testing ? 'vitest --ui' : undefined,
      'test:coverage': answers.testing ? 'vitest --coverage' : undefined,
      'test:e2e': answers.testing ? 'playwright test' : undefined,
      deploy: 'nexus deploy',
      'nexus:push': 'nexus push --yes',
      'nexus:sandbox': 'nexus sandbox',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.20.1',
      '@nexus/backend': '^1.0.0',
      '@nexus/ui-react': '^1.0.0',
      ...(answers.tailwind ? { 'tailwindcss': '^3.3.0' } : {}),
    },
    devDependencies: {
      '@types/react': answers.typescript ? '^18.2.45' : undefined,
      '@types/react-dom': answers.typescript ? '^18.2.18' : undefined,
      '@nexus/cli': '^1.0.0',
      '@vitejs/plugin-react': '^4.2.1',
      typescript: answers.typescript ? '^5.3.3' : undefined,
      vite: '^5.0.8',
      ...(answers.eslint ? {
        '@typescript-eslint/eslint-plugin': '^6.15.0',
        '@typescript-eslint/parser': '^6.15.0',
        eslint: '^8.56.0',
        prettier: '^3.1.1',
      } : {}),
      ...(answers.testing ? {
        '@playwright/test': '^1.40.1',
        '@testing-library/react': '^14.1.2',
        '@testing-library/jest-dom': '^6.1.6',
        vitest: '^1.1.0',
      } : {}),
    },
  };

  // Remove undefined values
  const cleanPackageJson = JSON.parse(JSON.stringify(packageJson, (k, v) => v === undefined ? undefined : v));
  writeFileSync('package.json', JSON.stringify(cleanPackageJson, null, 2));

  // 3. tsconfig.json (if TypeScript)
  if (answers.typescript) {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
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
    writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
  }

  // 4. vite.config.ts
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
`;
  writeFileSync('vite.config.ts', viteConfig);

  // 5. Tailwind config (if selected)
  if (answers.tailwind) {
    const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    writeFileSync('tailwind.config.js', tailwindConfig);
  }

  // 6. ESLint config (if selected)
  if (answers.eslint) {
    const eslintConfig = {
      root: true,
      env: { browser: true, es2020: true },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      ignorePatterns: ['dist', '.eslintrc.cjs'],
      parser: '@typescript-eslint/parser',
      plugins: ['react-refresh'],
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    };
    writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
  }

  // 7. GitHub Actions workflow
  const workflow = `
name: Nexus CI/CD

on:
  push:
    branches: ['nexus/dev', 'nexus/main', 'nexus/prod']
  pull_request:
    branches: ['nexus/main', 'nexus/prod']

env:
  NODE_VERSION: '20'
  NEXUS_REGION: us-east-1

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      ${answers.testing ? '- run: npm test' : ''}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/nexus/prod'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - uses: nexus-actions/configure-credentials@v1
        with:
          NEXUS_ACCESS_KEY_ID: \${{ secrets.NEXUS_ACCESS_KEY_ID }}
          NEXUS_SECRET_ACCESS_KEY: \${{ secrets.NEXUS_SECRET_ACCESS_KEY }}
          nexus-region: \${{ env.NEXUS_REGION }}
      - run: npm run deploy
`;
  writeFileSync('.github/workflows/nexus-ci-cd.yml', workflow);
}

async function createSourceFiles(answers: any) {
  // 1. index.html
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${answers.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  writeFileSync('index.html', indexHtml);

  // 2. src/main.tsx
  const mainTsx = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Nexus } from '@nexus/backend';
import App from './App';
import './index.css';

// Initialize Nexus
Nexus.configure({
  Auth: {
    mandatorySignIn: false,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
  writeFileSync('src/main.tsx', mainTsx);

  // 3. src/App.tsx
  const appTsx = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withAuthenticator } from '@nexus/ui-react';
import React, { FC } from 'react';

const Home: FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Welcome to ${answers.name}</h1>
    <p>${answers.description}</p>
  </div>
);

const App: FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default withAuthenticator(App);
`;
  writeFileSync('src/App.tsx', appTsx);

  // 4. src/index.css
  const indexCss = `
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

${answers.tailwind ? '@tailwind base;\n@tailwind components;\n@tailwind utilities;' : ''}
`;
  writeFileSync('src/index.css', indexCss);

  // 5. README.md
  const readme = `# ${answers.name}

${answers.description}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run deploy\` - Deploy to Nexus
- \`npm run nexus:push\` - Push backend changes
- \`npm run nexus:sandbox\` - Start local sandbox

## Learn More

- [Nexus Framework Documentation](https://docs.nexus.dev/)
- [React Documentation](https://react.dev/)
${answers.tailwind ? '- [Tailwind CSS Documentation](https://tailwindcss.com/)' : ''}

## Deploy

Deploy your app to production with:
\`\`\`bash
npm run deploy
\`\`\`
`;
  writeFileSync('README.md', readme);
}

async function initGit() {
  try {
    execSync('git init', { stdio: 'pipe' });
    execSync('git add .', { stdio: 'pipe' });
    execSync('git commit -m "Initial commit: Nexus project initialized"', { stdio: 'pipe' });

    // Create required branches
    execSync('git checkout -b nexus/main', { stdio: 'pipe' });
    execSync('git checkout -b nexus/prod', { stdio: 'pipe' });
    execSync('git checkout nexus/dev', { stdio: 'pipe' });
  } catch (error) {
    // Git might not be installed, which is okay
  }
}

async function installDependencies(answers: any) {
  try {
    execSync('npm install', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('Failed to install dependencies. Try running `npm install` manually.');
  }
}

function showNextSteps(answers: any) {
  console.log(chalk.bold.green('\n✨ Project created successfully!'));
  console.log(chalk.gray('\nNext steps:'));
  console.log(`1. ${chalk.cyan(`cd ${answers.name}`)}`);
  console.log(`2. ${chalk.cyan('npm run dev')} - Start development server`);
  console.log(`3. ${chalk.cyan('nexus doctor')} - Check project health`);
  console.log(`4. ${chalk.cyan('nexus deploy --env staging')} - Deploy to staging`);

  console.log(chalk.bold('\n📚 Useful commands:'));
  console.log(`${chalk.cyan('nexus sandbox')} - Start local backend sandbox`);
  console.log(`${chalk.cyan('nexus push')} - Deploy backend changes`);
  console.log(`${chalk.cyan('nexus status')} - Check deployment status`);

  console.log(chalk.bold('\n🔗 Links:'));
  console.log(`Documentation: ${chalk.underline('https://docs.nexus.dev/')}`);
  console.log(`Dashboard: ${chalk.underline('https://app.nexus.dev/')}`);
  console.log(`Community: ${chalk.underline('https://community.nexus.dev/')}`);

  console.log(chalk.gray('\nHappy coding! 🚀'));
}
