/**
 * Nexus Framework Plugin System
 * Provides hooks and events for extending framework functionality
 */

export interface NexusPlugin {
  name: string;
  version: string;
  description?: string;
  author?: string;

  // Plugin lifecycle hooks
  onInit?: (context: PluginContext) => Promise<void> | void;
  onConfig?: (config: any, context: PluginContext) => Promise<any> | any;
  onBuildStart?: (context: BuildContext) => Promise<void> | void;
  onBuildEnd?: (context: BuildContext) => Promise<void> | void;
  onDeployStart?: (context: DeployContext) => Promise<void> | void;
  onDeployEnd?: (context: DeployContext) => Promise<void> | void;
  onDevStart?: (context: DevContext) => Promise<void> | void;
  onDevEnd?: (context: DevContext) => Promise<void> | void;

  // File system hooks
  onFileAdd?: (file: FileContext) => Promise<void> | void;
  onFileChange?: (file: FileContext) => Promise<void> | void;
  onFileRemove?: (file: FileContext) => Promise<void> | void;

  // Route hooks
  onRouteAdd?: (route: RouteContext) => Promise<void> | void;
  onRouteRemove?: (route: RouteContext) => Promise<void> | void;

  // Component hooks
  onComponentAdd?: (component: ComponentContext) => Promise<void> | void;
  onComponentGenerate?: (template: string, context: ComponentContext) => Promise<string> | string;

  // CLI command hooks
  onCommandRegister?: (commands: CommandRegistry) => Promise<void> | void;
  onCommandExecute?: (command: string, args: any[], context: CommandContext) => Promise<void> | void;

  // Error handling
  onError?: (error: Error, context: ErrorContext) => Promise<void> | void;

  // Plugin configuration
  config?: Record<string, any>;
}

export interface PluginContext {
  rootDir: string;
  config: any;
  logger: Logger;
  utils: PluginUtils;
  emitter: EventEmitter;
}

export interface BuildContext extends PluginContext {
  buildId: string;
  environment: string;
  entryPoints: string[];
  assets: Asset[];
}

export interface DeployContext extends PluginContext {
  deploymentId: string;
  environment: string;
  url?: string;
  version: string;
}

export interface DevContext extends PluginContext {
  port: number;
  server: any;
  watcher: any;
}

export interface FileContext extends PluginContext {
  path: string;
  content: string;
  type: 'add' | 'change' | 'remove';
}

export interface RouteContext extends PluginContext {
  path: string;
  component: string;
  methods: string[];
  middleware?: string[];
}

export interface ComponentContext extends PluginContext {
  name: string;
  template: string;
  props: Record<string, any>;
  outputPath: string;
}

export interface CommandContext extends PluginContext {
  command: string;
  args: any[];
  options: Record<string, any>;
}

export interface ErrorContext extends PluginContext {
  phase: 'init' | 'build' | 'deploy' | 'dev';
  severity: 'error' | 'warning' | 'info';
}

export interface Asset {
  path: string;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  size: number;
  hash: string;
}

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  success(message: string, ...args: any[]): void;
}

export interface PluginUtils {
  // File system utilities
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  copyFile(src: string, dest: string): Promise<void>;
  deleteFile(path: string): Promise<void>;

  // Path utilities
  resolve(...paths: string[]): string;
  relative(from: string, to: string): string;
  dirname(path: string): string;
  basename(path: string): string;

  // String utilities
  kebabCase(str: string): string;
  camelCase(str: string): string;
  pascalCase(str: string): string;

  // Code generation utilities
  generateTemplate(template: string, data: any): string;
  formatCode(code: string, language?: string): Promise<string>;

  // Package utilities
  addDependency(name: string, version?: string): Promise<void>;
  removeDependency(name: string): Promise<void>;
  hasDependency(name: string): boolean;
}

export interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

export interface CommandRegistry {
  register(command: string, handler: CommandHandler): void;
  unregister(command: string): void;
  list(): string[];
}

export type CommandHandler = (args: any[], options: Record<string, any>) => Promise<void> | void;

/**
 * Plugin Manager
 * Manages loading, initialization, and execution of plugins
 */
export class PluginManager {
  private plugins: Map<string, NexusPlugin> = new Map();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * Load a plugin
   */
  async load(plugin: NexusPlugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already loaded`);
    }

    this.context.logger.info(`Loading plugin: ${plugin.name}`);

    try {
      // Initialize plugin
      if (plugin.onInit) {
        await plugin.onInit(this.context);
      }

      this.plugins.set(plugin.name, plugin);
      this.context.emitter.emit('plugin:loaded', plugin.name);

      this.context.logger.success(`Plugin loaded: ${plugin.name}`);
    } catch (error: any) {
      this.context.logger.error(`Failed to load plugin ${plugin.name}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unload(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} is not loaded`);
    }

    this.context.logger.info(`Unloading plugin: ${name}`);

    // Cleanup if plugin has cleanup method
    if ('onUnload' in plugin && typeof plugin.onUnload === 'function') {
      await (plugin as any).onUnload();
    }

    this.plugins.delete(name);
    this.context.emitter.emit('plugin:unloaded', name);

    this.context.logger.success(`Plugin unloaded: ${name}`);
  }

  /**
   * Execute a hook on all loaded plugins
   */
  async executeHook<K extends keyof NexusPlugin>(
    hookName: K,
    ...args: Parameters<NonNullable<NexusPlugin[K]>>
  ): Promise<void> {
    const promises = Array.from(this.plugins.values())
      .filter(plugin => plugin[hookName])
      .map(plugin => {
        const hook = plugin[hookName] as Function;
        return hook.apply(plugin, args);
      });

    await Promise.all(promises);
  }

  /**
   * Execute a hook and collect results
   */
  async executeHookWithResults<K extends keyof NexusPlugin>(
    hookName: K,
    ...args: Parameters<NonNullable<NexusPlugin[K]>>
  ): Promise<any[]> {
    const results = await Promise.all(
      Array.from(this.plugins.values())
        .filter(plugin => plugin[hookName])
        .map(async plugin => {
          const hook = plugin[hookName] as Function;
          return await hook.apply(plugin, args);
        })
    );

    return results.filter(result => result !== undefined);
  }

  /**
   * Get loaded plugins
   */
  getLoadedPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get plugin info
   */
  getPluginInfo(name: string): NexusPlugin | undefined {
    return this.plugins.get(name);
  }
}

/**
 * Built-in plugins
 */

// TypeScript plugin
export const typescriptPlugin: NexusPlugin = {
  name: '@nexus/plugin-typescript',
  version: '1.0.0',
  description: 'TypeScript support for Nexus projects',

  onConfig: async (config, context) => {
    if (!config.typescript) {
      config.typescript = {
        enabled: true,
        strict: true,
        target: 'ES2020',
        module: 'ESNext',
      };
    }
    return config;
  },

  onBuildStart: async (context) => {
    context.logger.info('TypeScript build started');
    // Run type checking
  },
};

// Tailwind CSS plugin
export const tailwindPlugin: NexusPlugin = {
  name: '@nexus/plugin-tailwind',
  version: '1.0.0',
  description: 'Tailwind CSS integration',

  onConfig: async (config, context) => {
    if (!config.tailwind) {
      config.tailwind = {
        enabled: true,
        config: 'tailwind.config.js',
        css: 'src/styles/tailwind.css',
      };
    }
    return config;
  },

  onFileAdd: async (file) => {
    if (file.path.endsWith('.css')) {
      // Process Tailwind classes
    }
  },
};

// PWA plugin
export const pwaPlugin: NexusPlugin = {
  name: '@nexus/plugin-pwa',
  version: '1.0.0',
  description: 'Progressive Web App support',

  onConfig: async (config, context) => {
    config.pwa = {
      enabled: true,
      manifest: 'public/manifest.json',
      sw: 'public/sw.js',
    };
    return config;
  },

  onBuildEnd: async (context) => {
    // Generate service worker
    context.logger.info('Generating PWA service worker');
  },
};

// Analytics plugin
export const analyticsPlugin: NexusPlugin = {
  name: '@nexus/plugin-analytics',
  version: '1.0.0',
  description: 'Analytics integration',

  onConfig: async (config, context) => {
    config.analytics = {
      enabled: true,
      providers: ['google', 'mixpanel', 'custom'],
    };
    return config;
  },

  onComponentAdd: async (component) => {
    // Add analytics tracking to components
  },
};

// GraphQL plugin
export const graphqlPlugin: NexusPlugin = {
  name: '@nexus/plugin-graphql',
  version: '1.0.0',
  description: 'GraphQL API support',

  onConfig: async (config, context) => {
    config.graphql = {
      enabled: true,
      endpoint: '/api/graphql',
      playground: true,
      schema: '.nexus/graphql/schema.graphql',
    };
    return config;
  },

  onRouteAdd: async (route) => {
    if (route.path.startsWith('/api/graphql')) {
      // Setup GraphQL route
    }
  },
};

/**
 * Plugin development utilities
 */
export function createPlugin(config: NexusPlugin): NexusPlugin {
  return {
    ...config,
    // Add default implementations
    onInit: async (context) => {
      context.logger.info(`Initializing plugin: ${config.name}`);
      if (config.onInit) {
        await config.onInit(context);
      }
    },
  };
}

export function definePlugin(config: NexusPlugin): NexusPlugin {
  return createPlugin(config);
}

/**
 * Plugin loader
 */
export async function loadPluginsFromDirectory(
  dir: string,
  context: PluginContext
): Promise<NexusPlugin[]> {
  const plugins: NexusPlugin[] = [];

  // This would scan directory for plugin files
  // For now, return built-in plugins

  return plugins;
}
