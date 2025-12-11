/**
 * Nexus Test Command
 * Runs and manages tests for Nexus applications
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface TestOptions {
  watch?: boolean;
  coverage?: boolean;
  ui?: boolean;
  type?: 'unit' | 'integration' | 'e2e' | 'all';
  reporter?: string;
  verbose?: boolean;
  runInBand?: boolean;
}

export async function testCommand(options: TestOptions) {
  console.log(chalk.cyan('\n🧪 Nexus Test Runner'));
  console.log(chalk.gray('Running tests with intelligent configuration...\n'));

  try {
    // Ensure test setup exists
    await ensureTestSetup();

    // Run tests based on options
    await runTests(options);

  } catch (error: any) {
    console.error(chalk.red(`\n❌ Test failed: ${error.message}`));
    process.exit(1);
  }
}

async function ensureTestSetup() {
  const spinner = ora('Checking test setup...').start();

  try {
    // Check if test config exists
    if (!existsSync('vitest.config.ts') && !existsSync('jest.config.js')) {
      spinner.text = 'Setting up test configuration...';
      await setupTestConfig();
    }

    // Check if test scripts exist
    if (!existsSync('src/__tests__') && !existsSync('tests')) {
      spinner.text = 'Creating test directories...';
      mkdirSync('src/__tests__', { recursive: true });
      mkdirSync('tests/integration', { recursive: true });
      mkdirSync('tests/e2e', { recursive: true });
    }

    // Check if test utils exist
    if (!existsSync('src/test-utils.ts')) {
      spinner.text = 'Creating test utilities...';
      await createTestUtils();
    }

    spinner.succeed('Test setup complete');

  } catch (error: any) {
    spinner.fail('Failed to setup tests');
    throw error;
  }
}

async function setupTestConfig() {
  // Detect if project uses TypeScript and React
  const hasTypeScript = existsSync('tsconfig.json');
  const hasReact = existsSync('package.json') &&
    require('fs').readFileSync('package.json', 'utf8').includes('react');

  if (hasTypeScript && hasReact) {
    // Create Vitest config for React + TypeScript
    const vitestConfig = `
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-utils.ts',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        '.nexus/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
    writeFileSync('vitest.config.ts', vitestConfig);

    // Update package.json scripts
    await updatePackageJsonScripts('vitest');

  } else {
    // Create Jest config
    const jestConfig = `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-utils.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test-utils.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
};
`;
    writeFileSync('jest.config.js', jestConfig);

    // Update package.json scripts
    await updatePackageJsonScripts('jest');
  }
}

async function updatePackageJsonScripts(testRunner: 'vitest' | 'jest') {
  const packageJsonPath = 'package.json';
  if (!existsSync(packageJsonPath)) return;

  const packageJson = JSON.parse(require('fs').readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson.scripts) packageJson.scripts = {};

  if (testRunner === 'vitest') {
    packageJson.scripts.test = 'vitest';
    packageJson.scripts['test:watch'] = 'vitest --watch';
    packageJson.scripts['test:ui'] = 'vitest --ui';
    packageJson.scripts['test:coverage'] = 'vitest --coverage';
    packageJson.scripts['test:run'] = 'vitest run';
  } else {
    packageJson.scripts.test = 'jest';
    packageJson.scripts['test:watch'] = 'jest --watch';
    packageJson.scripts['test:coverage'] = 'jest --coverage';
    packageJson.scripts['test:run'] = 'jest --runInBand';
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function createTestUtils() {
  const testUtilsContent = `
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock fetch
global.fetch = vitest.fn();

// Setup and cleanup
beforeAll(() => {
  // Global setup
});

afterEach(() => {
  // Cleanup after each test
  vitest.clearAllMocks();
});

afterAll(() => {
  // Global cleanup
});

// Export test utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
`;

  writeFileSync('src/test-utils.ts', testUtilsContent);
}

async function runTests(options: TestOptions) {
  const spinner = ora('Running tests...').start();

  try {
    const testRunner = existsSync('vitest.config.ts') ? 'vitest' : 'jest';
    let command = testRunner;
    const args: string[] = [];

    // Add options
    if (options.watch) {
      args.push('--watch');
    }

    if (options.coverage) {
      args.push('--coverage');
    }

    if (options.ui && testRunner === 'vitest') {
      args.push('--ui');
    }

    if (options.verbose) {
      args.push('--verbose');
    }

    if (options.runInBand) {
      args.push('--runInBand');
    }

    // Filter by test type
    if (options.type && options.type !== 'all') {
      const pattern = options.type === 'unit' ? 'src' :
                     options.type === 'integration' ? 'tests/integration' :
                     'tests/e2e';
      args.push(pattern);
    }

    // Run the command
    if (args.length > 0) {
      command += ' ' + args.join(' ');
    }

    spinner.text = `Running: ${command}`;

    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    spinner.succeed('Tests completed');

    // Show coverage report if generated
    if (options.coverage && existsSync('coverage/lcov-report/index.html')) {
      console.log(chalk.blue('\n📊 Coverage report generated at: coverage/lcov-report/index.html'));
    }

  } catch (error: any) {
    spinner.fail('Tests failed');
    throw error;
  }
}

/**
 * Test generator command
 */
export async function testGenerateCommand(type: string, name: string) {
  console.log(chalk.cyan(`\n🧪 Generating ${type} test: ${name}`));

  const spinner = ora('Creating test file...').start();

  try {
    const testContent = generateTestTemplate(type, name);
    const testPath = getTestPath(type, name);

    // Ensure directory exists
    mkdirSync(dirname(testPath), { recursive: true });

    // Write test file
    writeFileSync(testPath, testContent);

    spinner.succeed(`Test created: ${testPath}`);

  } catch (error: any) {
    spinner.fail('Failed to create test');
    throw error;
  }
}

function generateTestTemplate(type: string, name: string): string {
  const pascalName = toPascalCase(name);
  const camelName = toCamelCase(name);

  const templates = {
    component: `
import { render, screen } from '@testing-library/react';
import { ${pascalName} } from '../${name}';

describe('${pascalName}', () => {
  it('renders correctly', () => {
    render(<${pascalName} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const { user } = setup(<${pascalName} />);

    // Add interaction tests
    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
`,
    api: `
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ${camelName}Handler } from '../${name}';

describe('${pascalName} API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles GET request', async () => {
    const event = {
      httpMethod: 'GET',
      pathParameters: { id: '123' },
    };

    const result = await ${camelName}Handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toBeDefined();
  });

  it('handles POST request', async () => {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    };

    const result = await ${camelName}Handler(event);

    expect(result.statusCode).toBe(201);
  });
});
`,
    service: `
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ${pascalName}Service } from '../${name}';

describe('${pascalName}Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches items', async () => {
    const result = await ${pascalName}Service.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('creates item', async () => {
    const data = { name: 'Test Item' };
    const result = await ${pascalName}Service.create(data);
    expect(result).toBeDefined();
  });
});
`,
    hook: `
import { renderHook, act } from '@testing-library/react';
import { use${pascalName} } from '../${name}';

describe('use${pascalName}', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => use${pascalName}());

    expect(result.current.value).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it('updates value', async () => {
    const { result } = renderHook(() => use${pascalName}());

    await act(async () => {
      await result.current.update('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
`,
    integration: `
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupApp } from '../test-setup';

describe('${pascalName} Integration', () => {
  let app: any;

  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    await app.cleanup();
  });

  it('integrates with database', async () => {
    const result = await app.db.query('SELECT 1');
    expect(result).toBeDefined();
  });
});
`,
    e2e: `
import { test, expect } from '@playwright/test';

test.describe('${pascalName} E2E', () => {
  test('loads page correctly', async ({ page }) => {
    await page.goto('/${toKebabCase(name)}');

    await expect(page.getByRole('heading', { name: '${pascalName}' })).toBeVisible();
  });

  test('submits form', async ({ page }) => {
    await page.goto('/${toKebabCase(name)}');

    await page.fill('[data-testid="name-input"]', 'Test Name');
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Success!')).toBeVisible();
  });
});
`,
  };

  return templates[type] || templates.component;
}

function getTestPath(type: string, name: string): string {
  const kebabName = toKebabCase(name);

  switch (type) {
    case 'component':
      return `src/components/${name}/${name}.test.tsx`;
    case 'api':
      return `src/api/${name}.test.ts`;
    case 'service':
      return `src/services/${name}.test.ts`;
    case 'hook':
      return `src/hooks/${name}.test.ts`;
    case 'integration':
      return `tests/integration/${kebabName}.test.ts`;
    case 'e2e':
      return `tests/e2e/${kebabName}.spec.ts`;
    default:
      return `src/__tests__/${kebabName}.test.ts`;
  }
}

// Utility functions
function toPascalCase(str: string): string {
  return str.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());
}

function toCamelCase(str: string): string {
  return str.replace(/(^|-)([a-z])/g, (_, __, letter, index) =>
    index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  );
}

function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

function dirname(path: string): string {
  return path.split('/').slice(0, -1).join('/');
}
