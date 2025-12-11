import { createNexusConfig } from '@nexus/backend';

export default createNexusConfig('saas', {
  platform: {
    name: 'Nexus Demo',
    description: 'A demonstration of Nexus Framework capabilities',
    domain: 'demo.nexus.dev',
  },

  environments: {
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
      apiUrl: 'https://staging-api.demo.nexus.dev',
      database: {
        provider: 'postgresql',
        connection: process.env.DATABASE_URL,
      },
    },
    production: {
      branch: 'nexus/prod',
      apiUrl: 'https://api.demo.nexus.dev',
      database: {
        provider: 'postgresql',
        connection: process.env.DATABASE_URL,
      },
    },
  },

  features: {
    authentication: {
      enabled: true,
      providers: ['email', 'google', 'github'],
    },
    database: {
      enabled: true,
      migrations: './migrations',
    },
    storage: {
      enabled: true,
      provider: 's3',
      bucket: 'demo-nexus-storage',
    },
    functions: {
      enabled: true,
      runtime: 'node',
      timeout: 30000,
    },
    api: {
      enabled: true,
      cors: true,
      rateLimit: {
        windowMs: 60000,
        max: 100,
      },
    },
  },

  deployment: {
    provider: 'nexus',
    regions: ['us-east', 'eu-west', 'asia-southeast'],
    cdn: true,
    compression: true,
  },

  development: {
    port: 3000,
    hotReload: true,
    mockData: true,
    debug: true,
  },

  monitoring: {
    enabled: true,
    provider: 'nexus',
    errorTracking: true,
    performanceMetrics: true,
    userAnalytics: true,
  },

  ssr: {
    enabled: true,
    timeout: 5000,
    cache: {
      enabled: true,
      ttl: 3600,
    },
  },

  edge: {
    enabled: true,
    functions: [
      'api-proxy',
      'image-optimizer',
      'ab-test',
      'rate-limiter',
    ],
  },
});
