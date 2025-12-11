/**
 * Nexus Framework Shared Types and Utilities
 */

import { z } from 'zod';

// Platform configuration schema
export const PlatformConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  domain: z.string().optional(),
  type: z.enum(['saas', 'oss', 'blog', 'store', 'landing']),
});

// Environment configuration schema
export const EnvironmentConfigSchema = z.object({
  branch: z.string().optional(),
  apiUrl: z.string().optional(),
  database: z.object({
    provider: z.enum(['sqlite', 'postgresql', 'mysql', 'mongodb']),
    connection: z.string(),
  }).optional(),
  secrets: z.array(z.string()).optional(),
});

// Feature configuration schema
export const FeatureConfigSchema = z.object({
  enabled: z.boolean(),
  providers: z.array(z.string()).optional(),
});

// Deployment configuration schema
export const DeploymentConfigSchema = z.object({
  provider: z.string(),
  regions: z.array(z.string()),
  cdn: z.boolean().optional(),
  compression: z.boolean().optional(),
});

// Development configuration schema
export const DevelopmentConfigSchema = z.object({
  port: z.number().default(3000),
  hotReload: z.boolean().default(true),
  mockData: z.boolean().default(true),
  debug: z.boolean().default(false),
});

// Monitoring configuration schema
export const MonitoringConfigSchema = z.object({
  enabled: z.boolean(),
  provider: z.string(),
  errorTracking: z.boolean(),
  performanceMetrics: z.boolean(),
  userAnalytics: z.boolean(),
});

// SSR configuration schema
export const SSRConfigSchema = z.object({
  enabled: z.boolean(),
  timeout: z.number().optional(),
  cache: z.object({
    enabled: z.boolean(),
    ttl: z.number(),
  }).optional(),
  exclude: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
});

// Main Nexus configuration schema
export const NexusConfigSchema = z.object({
  platform: PlatformConfigSchema,
  environments: z.record(EnvironmentConfigSchema),
  features: z.object({
    authentication: FeatureConfigSchema.optional(),
    database: FeatureConfigSchema.optional(),
    storage: FeatureConfigSchema.optional(),
    functions: FeatureConfigSchema.optional(),
    api: FeatureConfigSchema.optional(),
    billing: FeatureConfigSchema.optional(),
    teams: FeatureConfigSchema.optional(),
    search: FeatureConfigSchema.optional(),
    analytics: FeatureConfigSchema.optional(),
  }),
  deployment: DeploymentConfigSchema.optional(),
  development: DevelopmentConfigSchema.optional(),
  monitoring: MonitoringConfigSchema.optional(),
  ssr: SSRConfigSchema.optional(),
  edge: z.object({
    enabled: z.boolean(),
    functions: z.array(z.string()),
  }).optional(),
});

// Type exports
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;
export type FeatureConfig = z.infer<typeof FeatureConfigSchema>;
export type DeploymentConfig = z.infer<typeof DeploymentConfigSchema>;
export type DevelopmentConfig = z.infer<typeof DevelopmentConfigSchema>;
export type MonitoringConfig = z.infer<typeof MonitoringConfigSchema>;
export type SSRConfig = z.infer<typeof SSRConfigSchema>;
export type NexusConfig = z.infer<typeof NexusConfigSchema>;

// Default configurations
export const defaultPlatformConfig: PlatformConfig = {
  name: 'nexus-app',
  description: 'A Nexus Framework application',
  domain: 'localhost:3000',
  type: 'saas',
};

export const defaultEnvironmentConfig: Record<string, EnvironmentConfig> = {
  development: {
    branch: 'nexus/dev',
    apiUrl: 'http://localhost:3001',
    database: {
      provider: 'sqlite',
      connection: './data/dev.db',
    },
  },
  staging: {
    branch: 'nexus/main',
    apiUrl: 'https://staging-api.example.com',
    database: {
      provider: 'postgresql',
      connection: process.env.DATABASE_URL || '',
    },
  },
  production: {
    branch: 'nexus/prod',
    apiUrl: 'https://api.example.com',
    database: {
      provider: 'postgresql',
      connection: process.env.DATABASE_URL || '',
    },
  },
};

export const defaultFeatures = {
  authentication: { enabled: true, providers: ['email'] },
  database: { enabled: true },
  storage: { enabled: false },
  functions: { enabled: true },
  api: { enabled: true },
  billing: { enabled: false },
  teams: { enabled: false },
  search: { enabled: false },
  analytics: { enabled: false },
};

export const defaultDeploymentConfig: DeploymentConfig = {
  provider: 'nexus',
  regions: ['us-east'],
  cdn: true,
  compression: true,
};

export const defaultDevelopmentConfig: DevelopmentConfig = {
  port: 3000,
  hotReload: true,
  mockData: true,
  debug: false,
};

export const defaultMonitoringConfig: MonitoringConfig = {
  enabled: true,
  provider: 'nexus',
  errorTracking: true,
  performanceMetrics: true,
  userAnalytics: false,
};

export const defaultSSRConfig: SSRConfig = {
  enabled: false,
  timeout: 5000,
  cache: {
    enabled: true,
    ttl: 3600,
  },
};

// Configuration creation function
export function createNexusConfig(
  platformType: NexusConfig['platform']['type'],
  overrides: Partial<NexusConfig> = {}
): NexusConfig {
  const config: NexusConfig = {
    platform: {
      ...defaultPlatformConfig,
      type: platformType,
      ...overrides.platform,
    },
    environments: {
      ...defaultEnvironmentConfig,
      ...overrides.environments,
    },
    features: {
      ...defaultFeatures,
      ...overrides.features,
    },
    deployment: {
      ...defaultDeploymentConfig,
      ...overrides.deployment,
    },
    development: {
      ...defaultDevelopmentConfig,
      ...overrides.development,
    },
    monitoring: {
      ...defaultMonitoringConfig,
      ...overrides.monitoring,
    },
    ssr: {
      ...defaultSSRConfig,
      ...overrides.ssr,
    },
    edge: {
      enabled: false,
      functions: [],
      ...overrides.edge,
    },
  };

  // Apply any additional overrides
  Object.keys(overrides).forEach(key => {
    if (key !== 'platform' && key !== 'environments' && key !== 'features') {
      (config as any)[key] = (overrides as any)[key];
    }
  });

  return config;
}

// Configuration validation
export function validateConfig(config: unknown): NexusConfig {
  return NexusConfigSchema.parse(config);
}

// Utility functions
export function getEnvironmentConfig(
  config: NexusConfig,
  environment: string
): EnvironmentConfig {
  const envConfig = config.environments[environment];
  if (!envConfig) {
    throw new Error(`Environment configuration not found: ${environment}`);
  }
  return envConfig;
}

export function isFeatureEnabled(
  config: NexusConfig,
  feature: keyof NexusConfig['features']
): boolean {
  return config.features[feature]?.enabled || false;
}

// Constants
export const NEXUS_VERSION = '1.0.0';
export const SUPPORTED_NODE_VERSIONS = ['18', '20'];
export const DEFAULT_REGIONS = [
  'us-east',
  'us-west',
  'eu-west',
  'eu-central',
  'asia-southeast',
  'asia-northeast',
];

// Error types
export class NexusConfigError extends Error {
  constructor(message: string, public path?: string) {
    super(message);
    this.name = 'NexusConfigError';
  }
}

export class NexusValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'NexusValidationError';
  }
}

// Plugin types (defined here for now)
export interface NexusPlugin {
  name: string;
  version: string;
  description?: string;
  author?: string;
  onInit?: (context: PluginContext) => Promise<void> | void;
  onConfig?: (config: any, context: PluginContext) => Promise<any> | any;
  onBuildStart?: (context: any) => Promise<void> | void;
  onBuildEnd?: (context: any) => Promise<void> | void;
  onDeployStart?: (context: any) => Promise<void> | void;
  onDeployEnd?: (context: any) => Promise<void> | void;
  onDevStart?: (context: any) => Promise<void> | void;
  onDevEnd?: (context: any) => Promise<void> | void;
}

export interface PluginContext {
  rootDir: string;
  config: any;
  logger: any;
  utils: any;
  emitter: any;
}
