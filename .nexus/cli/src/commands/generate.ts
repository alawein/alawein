/**
 * Nexus CLI Generate Command
 * Generates code templates and scaffolding
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface GenerateOptions {
  type?: string;
  name?: string;
  path?: string;
  template?: string;
  force?: boolean;
}

export async function generateCommand(options: GenerateOptions) {
  console.log(chalk.cyan('\n⚡ Nexus Code Generator'));
  console.log(chalk.gray('Generate components, pages, APIs, and more...\n'));

  try {
    // Prompt for type if not provided
    if (!options.type) {
      const { type } = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'What would you like to generate?',
          choices: [
            { name: '📄 Component', value: 'component' },
            { name: '📄 Page', value: 'page' },
            { name: '🔌 API Route', value: 'api' },
            { name: '📊 Model', value: 'model' },
            { name: '🔧 Service', value: 'service' },
            { name: '🎨 Hook', value: 'hook' },
            { name: '📦 Store', value: 'store' },
            { name: '🧪 Test', value: 'test' },
            { name: '🔐 Middleware', value: 'middleware' },
            { name: '📋 Type', value: 'type' },
            { name: '🔌 Plugin', value: 'plugin' },
            { name: '🎯 CRUD', value: 'crud' },
            { name: '📱 Layout', value: 'layout' },
            { name: '📄 Form', value: 'form' },
            { name: '🔍 Query', value: 'query' },
          ],
        },
      ]);
      options.type = type;
    }

    // Prompt for name if not provided
    if (!options.name) {
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `Enter name for ${options.type}:`,
          validate: (input) => {
            if (!input.trim()) {
              return 'Name is required';
            }
            if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(input)) {
              return 'Name must start with a letter and contain only letters, numbers, hyphens, and underscores';
            }
            return true;
          },
        },
      ]);
      options.name = name;
    }

    // Generate based on type
    await generateByType(options);

  } catch (error: any) {
    console.error(chalk.red(`\n❌ Generation failed: ${error.message}`));
    process.exit(1);
  }
}

async function generateByType(options: GenerateOptions) {
  const { type, name, path = '', template = 'default' } = options;

  const spinner = ora(`Generating ${type}: ${name}`).start();

  try {
    switch (type) {
      case 'component':
        await generateComponent(name, path, template);
        break;
      case 'page':
        await generatePage(name, path, template);
        break;
      case 'api':
        await generateAPI(name, path, template);
        break;
      case 'model':
        await generateModel(name, path, template);
        break;
      case 'service':
        await generateService(name, path, template);
        break;
      case 'hook':
        await generateHook(name, path, template);
        break;
      case 'store':
        await generateStore(name, path, template);
        break;
      case 'test':
        await generateTest(name, path, template);
        break;
      case 'middleware':
        await generateMiddleware(name, path, template);
        break;
      case 'type':
        await generateType(name, path, template);
        break;
      case 'plugin':
        await generatePlugin(name, path, template);
        break;
      case 'crud':
        await generateCRUD(name, path, template);
        break;
      case 'layout':
        await generateLayout(name, path, template);
        break;
      case 'form':
        await generateForm(name, path, template);
        break;
      case 'query':
        await generateQuery(name, path, template);
        break;
      default:
        throw new Error(`Unknown generator type: ${type}`);
    }

    spinner.succeed(`${chalk.green('✓')} Generated ${type}: ${name}`);

    // Show next steps
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray(`  • Import and use your ${type} in your application`));
    console.log(chalk.gray(`  • Run tests with: npm test`));
    console.log(chalk.gray(`  • Deploy with: nexus deploy`));

  } catch (error: any) {
    spinner.fail(`Failed to generate ${type}`);
    throw error;
  }
}

async function generateComponent(name: string, path: string, template: string) {
  const componentName = toPascalCase(name);
  const componentDir = join('src/components', path, componentName);

  // Create directory
  mkdirSync(componentDir, { recursive: true });

  // Generate component file
  const componentContent = generateComponentTemplate(componentName, template);
  writeFileSync(join(componentDir, `${componentName}.tsx`), componentContent);

  // Generate index file
  const indexContent = `export { default } from './${componentName}';\n`;
  writeFileSync(join(componentDir, 'index.ts'), indexContent);

  // Generate test file
  const testContent = generateComponentTestTemplate(componentName);
  writeFileSync(join(componentDir, `${componentName}.test.tsx`), testContent);

  // Generate story file if Storybook is detected
  if (existsSync('.storybook') || existsSync('stories')) {
    const storyContent = generateStorybookTemplate(componentName);
    writeFileSync(join(componentDir, `${componentName}.stories.tsx`), storyContent);
  }
}

async function generatePage(name: string, path: string, template: string) {
  const pageName = toPascalCase(name);
  const pageDir = join('src/pages', path);

  // Create directory
  mkdirSync(pageDir, { recursive: true });

  // Generate page file
  const pageContent = generatePageTemplate(pageName, template);
  writeFileSync(join(pageDir, `${name}.tsx`), pageContent);

  // Generate test file
  const testContent = generatePageTestTemplate(pageName);
  writeFileSync(join(pageDir, `${name}.test.tsx`), testContent);
}

async function generateAPI(name: string, path: string, template: string) {
  const apiDir = join('src/api', path);

  // Create directory
  mkdirSync(apiDir, { recursive: true });

  // Generate API file
  const apiContent = generateAPITemplate(name, template);
  writeFileSync(join(apiDir, `${name}.ts`), apiContent);

  // Generate types file
  const typesContent = generateAPITypesTemplate(name);
  writeFileSync(join(apiDir, `${name}.types.ts`), typesContent);

  // Generate test file
  const testContent = generateAPITestTemplate(name);
  writeFileSync(join(apiDir, `${name}.test.ts`), testContent);
}

async function generateModel(name: string, path: string, template: string) {
  const modelName = toPascalCase(name);
  const modelDir = join('src/models', path);

  // Create directory
  mkdirSync(modelDir, { recursive: true });

  // Generate model file
  const modelContent = generateModelTemplate(modelName, template);
  writeFileSync(join(modelDir, `${name}.ts`), modelContent);

  // Generate migration file
  const migrationContent = generateMigrationTemplate(name);
  const timestamp = new Date().getTime();
  writeFileSync(join('migrations', `${timestamp}_${name}.sql`), migrationContent);
}

async function generateService(name: string, path: string, template: string) {
  const serviceName = toPascalCase(name);
  const serviceDir = join('src/services', path);

  // Create directory
  mkdirSync(serviceDir, { recursive: true });

  // Generate service file
  const serviceContent = generateServiceTemplate(serviceName, template);
  writeFileSync(join(serviceDir, `${name}.ts`), serviceContent);

  // Generate test file
  const testContent = generateServiceTestTemplate(serviceName);
  writeFileSync(join(serviceDir, `${name}.test.ts`), testContent);
}

async function generateHook(name: string, path: string, template: string) {
  const hookName = toCamelCase(name);
  const hookDir = join('src/hooks', path);

  // Create directory
  mkdirSync(hookDir, { recursive: true });

  // Generate hook file
  const hookContent = generateHookTemplate(hookName, template);
  writeFileSync(join(hookDir, `${name}.ts`), hookContent);

  // Generate test file
  const testContent = generateHookTestTemplate(hookName);
  writeFileSync(join(hookDir, `${name}.test.ts`), testContent);
}

async function generateStore(name: string, path: string, template: string) {
  const storeName = toPascalCase(name);
  const storeDir = join('src/stores', path);

  // Create directory
  mkdirSync(storeDir, { recursive: true });

  // Generate store file
  const storeContent = generateStoreTemplate(storeName, template);
  writeFileSync(join(storeDir, `${name}.ts`), storeContent);

  // Generate test file
  const testContent = generateStoreTestTemplate(storeName);
  writeFileSync(join(storeDir, `${name}.test.ts`), testContent);
}

async function generateCRUD(name: string, path: string, template: string) {
  const entityName = toPascalCase(name);
  const entityPath = toKebabCase(name);

  // Generate all CRUD components
  await generateModel(name, path, template);
  await generateAPI(name, path, 'crud');
  await generateService(name, path, 'crud');

  // Generate CRUD components
  const crudDir = join('src/components', path, entityName);
  mkdirSync(crudDir, { recursive: true });

  // List component
  const listContent = generateCRUDListTemplate(entityName, entityPath);
  writeFileSync(join(crudDir, `${entityName}List.tsx`), listContent);

  // Form component
  const formContent = generateCRUDFormTemplate(entityName, entityPath);
  writeFileSync(join(crudDir, `${entityName}Form.tsx`), formContent);

  // Detail component
  const detailContent = generateCRUDDetailTemplate(entityName, entityPath);
  writeFileSync(join(crudDir, `${entityName}Detail.tsx`), detailContent);

  // Generate page
  const pageContent = generateCRUDPageTemplate(entityName, entityPath);
  writeFileSync(join('src/pages', path, `${entityPath}.tsx`), pageContent);
}

// Template generators
function generateComponentTemplate(name: string, template: string): string {
  const templates = {
    default: `import React from 'react';

export interface ${name}Props {
  /**
   * Children to render inside the component
   */
  children?: React.ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * ${name} component
 */
export default function ${name}({ children, className }: ${name}Props) {
  return (
    <div className={\`nexus-${toKebabCase(name)} \${className || ''}\`}>
      {children}
    </div>
  );
}
`,
    functional: `import React, { useState, useEffect } from 'react';

export interface ${name}Props {
  /**
   * Initial value
   */
  initialValue?: any;
  /**
   * Change callback
   */
  onChange?: (value: any) => void;
}

/**
 * ${name} functional component
 */
export default function ${name}({ initialValue, onChange }: ${name}Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onChange?.(value);
  }, [value, onChange]);

  return (
    <div className="nexus-${toKebabCase(name)}">
      {/* Component implementation */}
    </div>
  );
}
`,
  };

  return templates[template] || templates.default;
}

function generatePageTemplate(name: string, template: string): string {
  return `import React from 'react';
import { Container } from '@nexus/ui-react';
import { Helmet } from 'react-helmet-async';

/**
 * ${name} page
 */
export default function ${name}() {
  return (
    <>
      <Helmet>
        <title>${name} | Nexus App</title>
        <meta name="description" content="${name} page" />
      </Helmet>

      <Container>
        <div className="nexus-page">
          <h1>${name}</h1>
          <p>Welcome to the ${name} page.</p>
        </div>
      </Container>
    </>
  );
}

// Server-side data fetching
export async function getServerSideProps({ url }: { url: string }) {
  return {
    props: {
      // Add server-side props here
    },
  };
}
`;
}

function generateAPITemplate(name: string, template: string): string {
  const entityName = toPascalCase(name);
  const kebabName = toKebabCase(name);

  return `import { NexusFunction } from '@nexus/backend';
import { ${entityName}Request, ${entityName}Response } from './${name}.types';

/**
 * Get ${entityName}
 */
export const get${entityName}: NexusFunction = async (event) => {
  const { id } = event.pathParameters || {};

  try {
    // Fetch ${entityName} from database
    const ${name} = await fetch${entityName}(id);

    return {
      statusCode: 200,
      body: JSON.stringify(${name}),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: '${entityName} not found' }),
    };
  }
};

/**
 * Create ${entityName}
 */
export const create${entityName}: NexusFunction = async (event) => {
  const data = JSON.parse(event.body || '{}') as ${entityName}Request;

  try {
    // Validate and create ${entityName}
    const ${name} = await create${entityName}InDB(data);

    return {
      statusCode: 201,
      body: JSON.stringify(${name}),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Failed to create ${entityName}' }),
    };
  }
};

/**
 * Update ${entityName}
 */
export const update${entityName}: NexusFunction = async (event) => {
  const { id } = event.pathParameters || {};
  const data = JSON.parse(event.body || '{}') as Partial<${entityName}Request>;

  try {
    // Update ${entityName}
    const ${name} = await update${entityName}InDB(id, data);

    return {
      statusCode: 200,
      body: JSON.stringify(${name}),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Failed to update ${entityName}' }),
    };
  }
};

/**
 * Delete ${entityName}
 */
export const delete${entityName}: NexusFunction = async (event) => {
  const { id } = event.pathParameters || {};

  try {
    // Delete ${entityName}
    await delete${entityName}FromDB(id);

    return {
      statusCode: 204,
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Failed to delete ${entityName}' }),
    };
  }
};

// Helper functions (implement these)
async function fetch${entityName}(id?: string): Promise<${entityName}Response[]> {
  // Implementation
  return [];
}

async function create${entityName}InDB(data: ${entityName}Request): Promise<${entityName}Response> {
  // Implementation
  return {} as ${entityName}Response;
}

async function update${entityName}InDB(id: string, data: Partial<${entityName}Request>): Promise<${entityName}Response> {
  // Implementation
  return {} as ${entityName}Response;
}

async function delete${entityName}FromDB(id: string): Promise<void> {
  // Implementation
}
`;
}

function generateModelTemplate(name: string, template: string): string {
  return `import { z } from 'zod';

/**
 * ${name} schema
 */
export const ${toCamelCase(name)}Schema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Add your fields here
  name: z.string().min(1),
  description: z.string().optional(),
});

/**
 * ${name} type
 */
export type ${name} = z.infer<typeof ${toCamelCase(name)}Schema>;

/**
 * Create ${name} input
 */
export const create${name}Schema = ${toCamelCase(name)}Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Create${name} = z.infer<typeof create${name}Schema>;

/**
 * Update ${name} input
 */
export const update${name}Schema = create${name}Schema.partial();

export type Update${name} = z.infer<typeof update${name}Schema>;
`;
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

// Additional template generators would be implemented here...
function generateComponentTestTemplate(name: string): string {
  return `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name}>Test content</${name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<${name} className="custom-class">Test</${name}>>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
  });
});
`;
}

function generatePageTestTemplate(name: string): string {
  return `import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ${name} from './${name}';

describe('${name} Page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <${name} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '${name}' })).toBeInTheDocument();
  });
});
`;
}

function generateAPITypesTemplate(name: string): string {
  const entityName = toPascalCase(name);

  return `/**
 * ${entityName} request types
 */
export interface ${entityName}Request {
  name: string;
  description?: string;
  // Add other request fields
}

/**
 * ${entityName} response types
 */
export interface ${entityName}Response {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  // Add other response fields
}

/**
 * ${entityName} list response
 */
export interface ${entityName}ListResponse {
  items: ${entityName}Response[];
  total: number;
  page: number;
  pageSize: number;
}
`;
}

function generateAPITestTemplate(name: string): string {
  return `import { get${toPascalCase(name)}, create${toPascalCase(name)} } from './${name}';

describe('${name} API', () => {
  describe('get${toPascalCase(name)}', () => {
    it('returns ${name} data', async () => {
      const event = {
        pathParameters: { id: '123' },
      };

      const result = await get${toPascalCase(name)}(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toBeDefined();
    });
  });

  describe('create${toPascalCase(name)}', () => {
    it('creates new ${name}', async () => {
      const event = {
        body: JSON.stringify({ name: 'Test ${name}' }),
      };

      const result = await create${toPascalCase(name)}(event);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toBeDefined();
    });
  });
});
`;
}

function generateServiceTemplate(name: string, template: string): string {
  return `import { ${name}Response, Create${name}, Update${name} } from '../models/${toKebabCase(name)}';

/**
 * ${name} service
 */
export class ${name}Service {
  /**
   * Get all ${toKebabCase(name)}s
   */
  async getAll(): Promise<${name}Response[]> {
    // Implementation
    return [];
  }

  /**
   * Get ${toKebabCase(name)} by ID
   */
  async getById(id: string): Promise<${name}Response | null> {
    // Implementation
    return null;
  }

  /**
   * Create new ${toKebabCase(name)}
   */
  async create(data: Create${name}): Promise<${name}Response> {
    // Implementation
    return {} as ${name}Response;
  }

  /**
   * Update ${toKebabCase(name)}
   */
  async update(id: string, data: Update${name}): Promise<${name}Response> {
    // Implementation
    return {} as ${name}Response;
  }

  /**
   * Delete ${toKebabCase(name)}
   */
  async delete(id: string): Promise<void> {
    // Implementation
  }
}

export const ${toCamelCase(name)}Service = new ${name}Service();
`;
}

function generateServiceTestTemplate(name: string): string {
  return `import { ${toCamelCase(name)}Service } from './${name}';

describe('${name}Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns all ${toKebabCase(name)}s', async () => {
      const result = await ${toCamelCase(name)}Service.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getById', () => {
    it('returns ${toKebabCase(name)} by ID', async () => {
      const result = await ${toCamelCase(name)}Service.getById('123');
      expect(result).toBeDefined();
    });
  });
});
`;
}

function generateHookTemplate(name: string, template: string): string {
  return `import { useState, useEffect, useCallback } from 'react';

/**
 * use${toPascalCase(name)} hook
 */
export function use${toPascalCase(name)}(initialValue?: any) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const update = useCallback(async (newValue: any) => {
    setLoading(true);
    setError(null);

    try {
      // Perform update logic
      setValue(newValue);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    value,
    setValue,
    loading,
    error,
    reset,
    update,
  };
}
`;
}

function generateHookTestTemplate(name: string): string {
  return `import { renderHook, act } from '@testing-library/react';
import { use${toPascalCase(name)} } from './${name}';

describe('use${toPascalCase(name)}', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => use${toPascalCase(name)}('default'));

    expect(result.current.value).toBe('default');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('updates value correctly', async () => {
    const { result } = renderHook(() => use${toPascalCase(name)}());

    await act(async () => {
      await result.current.update('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
`;
}

function generateStoreTemplate(name: string, template: string): string {
  return `import { create } from 'zustand';
import { ${name}Response, Create${name} } from '../models/${toKebabCase(name)}';

interface ${name}Store {
  items: ${name}Response[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Create${name}) => Promise<void>;
  updateItem: (id: string, item: Partial<Create${name}>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export const use${name}Store = create<${name}Store>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch items
      const items = await fetch${toPascalCase(name)}s();
      set({ items, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addItem: async (item) => {
    try {
      const newItem = await create${toPascalCase(name)}(item);
      set(state => ({ items: [...state.items, newItem] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateItem: async (id, item) => {
    try {
      const updatedItem = await update${toPascalCase(name)}(id, item);
      set(state => ({
        items: state.items.map(i => i.id === id ? updatedItem : i)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeItem: async (id) => {
    try {
      await delete${toPascalCase(name)}(id);
      set(state => ({
        items: state.items.filter(i => i.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null }),
}));

// Helper functions
async function fetch${toPascalCase(name)}s(): Promise<${name}Response[]> {
  // Implementation
  return [];
}

async function create${toPascalCase(name)}(item: Create${name}): Promise<${name}Response> {
  // Implementation
  return {} as ${name}Response;
}

async function update${toPascalCase(name)}(id: string, item: Partial<Create${name}>): Promise<${name}Response> {
  // Implementation
  return {} as ${name}Response;
}

async function delete${toPascalCase(name)}(id: string): Promise<void> {
  // Implementation
}
`;
}

function generateStoreTestTemplate(name: string): string {
  return `import { renderHook, act } from '@testing-library/react';
import { use${name}Store } from './${name}';

describe('${name}Store', () => {
  beforeEach(() => {
    // Reset store before each test
    use${name}Store.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => use${name}Store());

    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
`;
}

function generateTestTemplate(name: string, path: string, template: string): string {
  return `import { describe, it, expect, beforeEach } from 'vitest';

describe('${name}', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });
});
`;
}

function generateMiddlewareTemplate(name: string, path: string, template: string): string {
  return `import { Request, Response, NextFunction } from 'express';

/**
 * ${name} middleware
 */
export function ${toCamelCase(name)}Middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Middleware logic
  next();
}
`;
}

function generateTypeTemplate(name: string, path: string, template: string): string {
  return `/**
 * ${name} type definitions
 */

export interface ${toPascalCase(name)} {
  id: string;
  // Add properties
}

export type ${toPascalCase(name)}Config = {
  // Add config properties
};
`;
}

function generatePluginTemplate(name: string, path: string, template: string): string {
  return `import { NexusPlugin, PluginContext } from '@nexus/shared';

export default {
  name: '${name}',
  version: '1.0.0',
  description: '${name} plugin',

  onInit: async (context: PluginContext) => {
    // Initialize plugin
  },

  onBuildStart: async (context: any) => {
    // Run before build
  },

  onBuildEnd: async (context: any) => {
    // Run after build
  },
} as NexusPlugin;
`;
}

function generateLayoutTemplate(name: string, path: string, template: string): string {
  return `import React from 'react';

export interface ${toPascalCase(name)}LayoutProps {
  children: React.ReactNode;
}

/**
 * ${toPascalCase(name)} layout component
 */
export default function ${toPascalCase(name)}Layout({
  children,
}: ${toPascalCase(name)}LayoutProps) {
  return (
    <div className="layout-${toKebabCase(name)}">
      <header>
        {/* Header content */}
      </header>

      <main>
        {children}
      </main>

      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}
`;
}

function generateFormTemplate(name: string, path: string, template: string): string {
  return `import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@nexus/ui-react';

interface ${toPascalCase(name)}FormData {
  // Add form fields
}

/**
 * ${toPascalCase(name)} form component
 */
export default function ${toPascalCase(name)}Form() {
  const { register, handleSubmit, formState: { errors } } = useForm<${toPascalCase(name)}FormData>();

  const onSubmit = (data: ${toPascalCase(name)}FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-${toKebabCase(name)}">
      {/* Add form fields */}

      <Button type="submit">Submit</Button>
    </form>
  );
}
`;
}

function generateQueryTemplate(name: string, path: string, template: string): string {
  return `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * ${toPascalCase(name)} queries
 */
export function use${toPascalCase(name)}(id: string) {
  return useQuery({
    queryKey: ['${toKebabCase(name)}', id],
    queryFn: () => fetch${toPascalCase(name)}(id),
  });
}

export function use${toPascalCase(name)}List() {
  return useQuery({
    queryKey: ['${toKebabCase(name)}s'],
    queryFn: () => fetch${toPascalCase(name)}s(),
  });
}

export function useCreate${toPascalCase(name)}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create${toPascalCase(name)},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${toKebabCase(name)}s'] });
    },
  });
}

// Helper functions
async function fetch${toPascalCase(name)}(id: string) {
  // Implementation
}

async function fetch${toPascalCase(name)}s() {
  // Implementation
}

async function create${toPascalCase(name)}(data: any) {
  // Implementation
}
`;
}

function generateMigrationTemplate(name: string): string {
  return `-- Migration for ${name}
-- Generated on ${new Date().toISOString()}

CREATE TABLE IF NOT EXISTS ${toKebabCase(name)}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Add indexes
CREATE INDEX idx_${toKebabCase(name)}s_name ON ${toKebabCase(name)}s(name);
CREATE INDEX idx_${toKebabCase(name)}s_created_at ON ${toKebabCase(name)}s(created_at);
`;
}

function generateStorybookTemplate(name: string): string {
  return `import type { Meta, StoryObj } from '@storybook/react';
import ${name} from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello World',
  },
};

export const WithClassName: Story = {
  args: {
    children: 'Custom styled',
    className: 'custom-class',
  },
};
`;
}

function generateCRUDListTemplate(name: string, path: string): string {
  return `import React from 'react';
import { use${name}List } from '../../api/${path}';
import { Button, Card } from '@nexus/ui-react';

/**
 * ${name} List component
 */
export default function ${name}List() {
  const { data: items, loading, error } = use${name}List();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card>
      <h2>${name}s</h2>

      {items?.map((item) => (
        <div key={item.id} className="item-row">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="actions">
            <Button variant="secondary" size="sm">
              Edit
            </Button>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
`;
}

function generateCRUDFormTemplate(name: string, path: string): string {
  return `import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreate${name} } from '../../api/${path}';
import { Button, Input } from '@nexus/ui-react';

interface ${name}FormData {
  name: string;
  description?: string;
}

/**
 * ${name} Form component
 */
export default function ${name}Form() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<${name}FormData>();
  const createMutation = useCreate${name}();

  const onSubmit = (data: ${name}FormData) => {
    createMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="${toKebabCase(name)}-form">
      <div className="field">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <Input
          id="description"
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create ${name}'}
      </Button>
    </form>
  );
}
`;
}

function generateCRUDDetailTemplate(name: string, path: string): string {
  return `import React from 'react';
import { useParams } from 'react-router-dom';
import { use${name} } from '../../api/${path}';
import { Card, Button } from '@nexus/ui-react';

/**
 * ${name} Detail component
 */
export default function ${name}Detail() {
  const { id } = useParams<{ id: string }>();
  const { data: item, loading, error } = use${name}(id!);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!item) return <div>Not found</div>;

  return (
    <Card>
      <h2>{item.name}</h2>
      <p>{item.description}</p>

      <div className="actions">
        <Button variant="secondary">Edit</Button>
        <Button variant="danger">Delete</Button>
      </div>
    </Card>
  );
}
`;
}

function generateCRUDPageTemplate(name: string, path: string): string {
  return `import React, { useState } from 'react';
import ${name}List from '../components/${path}/${name}List';
import ${name}Form from '../components/${path}/${name}Form';
import { Button } from '@nexus/ui-react';

/**
 * ${name} CRUD page
 */
export default function ${toPascalCase(path)}Page() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>${name}s</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New'}
        </Button>
      </div>

      {showForm && (
        <div className="form-section">
          <${name}Form />
        </div>
      )}

      <div className="list-section">
        <${name}List />
      </div>
    </div>
  );
}
`;
}
