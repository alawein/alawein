import { PlatformConfig } from '@nexus/types';

export const config: PlatformConfig = {
  // Platform metadata
  platform: {
    type: 'saas',
    name: '{{PLATFORM_NAME}}',
    description: '{{PLATFORM_DESCRIPTION}}',
    version: '1.0.0',
  },

  // Environment mappings
  environments: {
    dev: {
      branch: 'app/dev',
      url: 'dev.{{PLATFORM_DOMAIN}}',
      sandbox: true,
      features: {
        debugMode: true,
        mockData: true,
        hotReload: true,
        stripeTestMode: true,
      },
    },
    staging: {
      branch: 'app/main',
      url: 'staging.{{PLATFORM_DOMAIN}}',
      sandbox: false,
      features: {
        debugMode: false,
        mockData: false,
        analytics: true,
        stripeTestMode: true,
      },
    },
    production: {
      branch: 'production',
      url: 'app.{{PLATFORM_DOMAIN}}',
      sandbox: false,
      features: {
        debugMode: false,
        analytics: true,
        monitoring: true,
        backups: true,
        stripeTestMode: false,
      },
    },
  },

  // Feature flags
  features: {
    authentication: {
      enabled: true,
      providers: ['email', 'google', 'github'],
      mfa: 'optional',
    },
    subscriptions: {
      enabled: true,
      provider: 'stripe',
      tiers: {
        free: {
          name: 'Free',
          price: 0,
          limits: {
            users: 3,
            projects: 5,
            storage: 1000, // MB
            apiCalls: 10000, // per month
          },
          features: [
            'core_features',
            'community_support',
            'basic_analytics',
          ],
        },
        starter: {
          name: 'Starter',
          price: 29,
          limits: {
            users: 10,
            projects: 25,
            storage: 10000,
            apiCalls: 100000,
          },
          features: [
            'core_features',
            'email_support',
            'advanced_analytics',
            'api_access',
            'team_collaboration',
          ],
        },
        pro: {
          name: 'Pro',
          price: 99,
          limits: {
            users: 50,
            projects: 100,
            storage: 100000,
            apiCalls: 1000000,
          },
          features: [
            'all_starter_features',
            'priority_support',
            'custom_integrations',
            'advanced_security',
            'sso',
            'audit_logs',
          ],
        },
        enterprise: {
          name: 'Enterprise',
          price: 299,
          limits: {
            users: -1, // unlimited
            projects: -1,
            storage: -1,
            apiCalls: -1,
          },
          features: [
            'all_pro_features',
            'dedicated_support',
            'custom_contract',
            'on_premise_option',
            'sla_guarantee',
            'custom_training',
          ],
        },
      },
    },
    teams: {
      enabled: true,
      maxMembersPerTeam: {
        free: 3,
        starter: 10,
        pro: 50,
        enterprise: -1,
      },
    },
    api: {
      enabled: true,
      rateLimiting: {
        free: '100/hour',
        starter: '1000/hour',
        pro: '10000/hour',
        enterprise: 'unlimited',
      },
      features: {
        webhooks: ['starter', 'pro', 'enterprise'],
        bulkOperations: ['pro', 'enterprise'],
        customEndpoints: ['enterprise'],
      },
    },
    analytics: {
      provider: 'plausible',
      events: ['page_view', 'sign_up', 'subscription', 'feature_use', 'api_call'],
    },
  },

  // AWS resource configuration
  aws: {
    region: 'us-east-1',
    resources: {
      auth: {
        mfa: true,
        passwordPolicy: {
          minLength: 12,
          requireSymbols: true,
          requireNumbers: true,
          requireUppercase: true,
          requireLowercase: true,
        },
      },
      database: {
        type: 'dynamodb',
        backup: true,
        encryption: true,
        ttl: {
          enabled: true,
          fields: ['sessionExpiry', 'trialEnd'],
        },
      },
      storage: {
        buckets: [
          {
            name: 'user-uploads',
            public: false,
            encryption: true,
            cors: true,
            maxSize: '10MB',
          },
          {
            name: 'public-assets',
            public: true,
            cdn: true,
            encryption: true,
            cors: true,
          },
        ],
      },
      functions: {
        timeout: 30,
        memory: 512,
        concurrency: 100,
        layers: ['axios', 'lodash'],
      },
    },
  },

  // Development settings
  development: {
    port: 3000,
    hotReload: true,
    mockApis: true,
    debugMode: true,
    localstack: true, // For local AWS emulation
  },

  // Build settings
  build: {
    optimization: true,
    minification: true,
    sourceMaps: false,
    bundleAnalysis: true,
    chunking: {
      enabled: true,
      strategy: 'route-based',
    },
  },

  // Monitoring
  monitoring: {
    alerts: {
      enabled: true,
      channels: ['email', 'slack'],
      thresholds: {
        errorRate: 0.05, // 5%
        responseTime: 2000, // 2 seconds
        cpuUsage: 80, // 80%
      },
    },
    logging: {
      level: 'info',
      retention: 30, // days
      structured: true,
    },
  },

  // Security
  security: {
    cors: {
      enabled: true,
      origins: ['http://localhost:3000', '{{PLATFORM_URL}}'],
      credentials: true,
    },
    rateLimiting: {
      enabled: true,
      windowMs: 900000, // 15 minutes
      max: 100, // requests per window
    },
    headers: {
      csp: true,
      hsts: true,
      xFrameOptions: true,
      xContentTypeOptions: true,
    },
  },
};
