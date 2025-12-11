/**
 * Nexus Framework Unified Configuration Schema
 * One configuration to rule them all - platform, environments, features, and deployment
 */

import { z } from 'zod';

// Base schemas
const EnvironmentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url(),
  branch: z.string(),
  variables: z.record(z.string()).optional(),
  secrets: z.array(z.string()).optional(),
  features: z.record(z.boolean()).optional(),
});

const TierSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string().default('USD'),
  interval: z.enum(['month', 'quarter', 'semiannual', 'year']),
  features: z.array(z.string()),
  limits: z.record(z.number()).optional(),
  stripePriceId: z.string().optional(),
});

const FeatureSchema = z.object({
  enabled: z.boolean(),
  config: z.record(z.any()).optional(),
});

// Main configuration schema
export const NexusConfigSchema = z.object({
  // Platform metadata
  platform: z.object({
    name: z.string(),
    type: z.enum(['saas', 'oss', 'blog', 'store', 'landing']),
    description: z.string(),
    domain: z.string(),
    version: z.string().default('1.0.0'),
  }),

  // Environments (dev, staging, prod)
  environments: z.record(EnvironmentSchema),

  // Feature flags and configuration
  features: z.object({
    // Core features
    authentication: FeatureSchema,
    database: FeatureSchema,
    storage: FeatureSchema,
    functions: FeatureSchema,
    api: FeatureSchema,

    // Optional features
    billing: FeatureSchema.optional(),
    teams: FeatureSchema.optional(),
    analytics: FeatureSchema.optional(),
    search: FeatureSchema.optional(),
    cache: FeatureSchema.optional(),
    queue: FeatureSchema.optional(),
    email: FeatureSchema.optional(),
    notifications: FeatureSchema.optional(),
    webhooks: FeatureSchema.optional(),
  }),

  // Tier configuration (for SaaS)
  tiers: z.record(TierSchema).optional(),

  // Deployment configuration
  deployment: z.object({
    provider: z.enum(['nexus', 'vercel', 'netlify', 'aws', 'custom']).default('nexus'),
    autoDeploy: z.boolean().default(true),
    rollbackOnFailure: z.boolean().default(true),
    healthCheck: z.string().optional(),
    performanceBudget: z.object({
      lcp: z.number().default(2500), // Largest Contentful Paint (ms)
      fid: z.number().default(100), // First Input Delay (ms)
      cls: z.number().default(0.1), // Cumulative Layout Shift
    }).optional(),
  }).optional(),

  // Development configuration
  development: z.object({
    port: z.number().default(3000),
    hotReload: z.boolean().default(true),
    mockData: z.boolean().default(true),
    debugMode: z.boolean().default(false),
    openBrowser: z.boolean().default(true),
    proxy: z.record(z.string()).optional(),
  }).optional(),

  // Monitoring and observability
  monitoring: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['nexus', 'datadog', 'newrelic', 'custom']).default('nexus'),
    errorTracking: z.boolean().default(true),
    performanceMetrics: z.boolean().default(true),
    userAnalytics: z.boolean().default(false),
    alerts: z.array(z.object({
      type: z.enum(['error', 'performance', 'usage']),
      threshold: z.number(),
      channel: z.enum(['email', 'slack', 'webhook']),
    })).optional(),
  }).optional(),

  // Security configuration
  security: z.object({
    cors: z.object({
      origins: z.array(z.string()),
      credentials: z.boolean().default(true),
    }).optional(),
    rateLimit: z.object({
      windowMs: z.number().default(900000), // 15 minutes
      max: z.number().default(100),
    }).optional(),
    headers: z.record(z.string()).optional(),
    csrf: z.boolean().default(true),
    contentSecurityPolicy: z.boolean().default(true),
  }).optional(),
});

// Type inference
export type NexusConfig = z.infer<typeof NexusConfigSchema>;

// Default configurations for different platform types
export const defaultConfigs = {
  saas: {
    features: {
      authentication: { enabled: true },
      database: { enabled: true },
      storage: { enabled: true },
      functions: { enabled: true },
      api: { enabled: true },
      billing: { enabled: true },
      teams: { enabled: true },
      analytics: { enabled: true },
      email: { enabled: true },
    },
    deployment: {
      provider: 'nexus' as const,
      autoDeploy: true,
      rollbackOnFailure: true,
    },
    monitoring: {
      enabled: true,
      provider: 'nexus' as const,
      errorTracking: true,
      performanceMetrics: true,
    },
  },

  oss: {
    features: {
      authentication: { enabled: false },
      database: { enabled: false },
      storage: { enabled: true },
      functions: { enabled: false },
      api: { enabled: false },
      analytics: { enabled: true },
    },
    deployment: {
      provider: 'vercel' as const,
      autoDeploy: true,
    },
  },

  blog: {
    features: {
      authentication: { enabled: false },
      database: { enabled: true },
      storage: { enabled: true },
      functions: { enabled: false },
      api: { enabled: false },
      search: { enabled: true },
      analytics: { enabled: true },
    },
    deployment: {
      provider: 'vercel' as const,
      autoDeploy: true,
    },
  },
};

// Helper function to create a new config
export function createNexusConfig(type: keyof typeof defaultConfigs, overrides: Partial<NexusConfig> = {}): NexusConfig {
  const baseConfig = {
    platform: {
      name: 'My Nexus Platform',
      type,
      description: 'A platform built with Nexus Framework',
      domain: 'example.com',
    },
    environments: {
      dev: {
        name: 'Development',
        description: 'Development environment',
        url: 'https://dev.example.com',
        branch: 'nexus/dev',
      },
      staging: {
        name: 'Staging',
        description: 'Staging environment',
        url: 'https://staging.example.com',
        branch: 'nexus/main',
      },
      production: {
        name: 'Production',
        description: 'Production environment',
        url: 'https://example.com',
        branch: 'nexus/prod',
      },
    },
    ...defaultConfigs[type],
    development: {
      port: 3000,
      hotReload: true,
      mockData: true,
      debugMode: false,
      openBrowser: true,
    },
    security: {
      cors: {
        origins: ['http://localhost:3000'],
        credentials: true,
      },
      rateLimit: {
        windowMs: 900000,
        max: 100,
      },
      csrf: true,
      contentSecurityPolicy: true,
    },
  };

  return NexusConfigSchema.parse({ ...baseConfig, ...overrides });
}

// Validation helper
export function validateConfig(config: unknown): NexusConfig {
  return NexusConfigSchema.parse(config);
}
