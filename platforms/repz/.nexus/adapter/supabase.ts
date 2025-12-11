import { z } from 'zod';

export const NexusDBAdapterSchema = z.object({
  platform: z.object({
    type: z.literal('saas'),
    name: z.string(),
    description: z.string(),
    domain: z.string(),
  }),
  environments: z.object({
    dev: z.object({
      branch: z.string(),
      url: z.string(),
      supabaseUrl: z.string(),
      supabaseAnonKey: z.string(),
      stripeKey: z.string(),
    }),
    staging: z.object({
      branch: z.string(),
      url: z.string(),
      supabaseUrl: z.string(),
      supabaseAnonKey: z.string(),
      stripeKey: z.string(),
    }),
    production: z.object({
      branch: z.string(),
      url: z.string(),
      supabaseUrl: z.string(),
      supabaseAnonKey: z.string(),
      stripeKey: z.string(),
    }),
  }),
  features: z.object({
    authentication: z.object({
      provider: z.literal('nexusdb'),
      methods: z.array(z.enum(['email', 'google', 'apple', 'github'])),
      mfa: z.boolean(),
    }),
    database: z.object({
      type: z.literal('postgresql'),
      provider: z.literal('nexusdb'),
      pooling: z.boolean(),
    }),
    functions: z.object({
      type: z.literal('edge'),
      provider: z.literal('nexusdb'),
      region: z.string(),
    }),
    payments: z.object({
      provider: z.literal('stripe'),
      webhooks: z.boolean(),
      subscriptions: z.boolean(),
    }),
    storage: z.object({
      provider: z.literal('nexusdb'),
      buckets: z.array(z.string()),
    }),
  }),
  tiers: z.record(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    currency: z.string(),
    interval: z.enum(['month', 'quarter', 'semiannual', 'year']),
    features: z.array(z.string()),
    limits: z.record(z.union([z.number(), z.literal(-1)])),
  })),
});

export type NexusDBAdapterConfig = z.infer<typeof NexusDBAdapterSchema>;

export const repzConfig: NexusDBAdapterConfig = {
  platform: {
    type: 'saas',
    name: 'REPZ Coach Pro',
    description: 'Elite fitness coaching platform connecting certified trainers with clients',
    domain: 'repzcoach.com',
  },
  environments: {
    dev: {
      branch: 'app/dev',
      url: 'dev.repzcoach.com',
      supabaseUrl: process.env.SUPABASE_DEV_URL || '',
      supabaseAnonKey: process.env.SUPABASE_DEV_ANON_KEY || '',
      stripeKey: process.env.STRIPE_TEST_KEY || '',
    },
    staging: {
      branch: 'app/main',
      url: 'staging.repzcoach.com',
      supabaseUrl: process.env.SUPABASE_STAGING_URL || '',
      supabaseAnonKey: process.env.SUPABASE_STAGING_ANON_KEY || '',
      stripeKey: process.env.STRIPE_TEST_KEY || '',
    },
    production: {
      branch: 'production',
      url: 'app.repzcoach.com',
      supabaseUrl: process.env.SUPABASE_PROD_URL || '',
      supabaseAnonKey: process.env.SUPABASE_PROD_ANON_KEY || '',
      stripeKey: process.env.STRIPE_LIVE_KEY || '',
    },
  },
  features: {
    authentication: {
      provider: 'nexusdb',
      methods: ['email', 'google', 'apple', 'github'],
      mfa: true,
    },
    database: {
      type: 'postgresql',
      provider: 'nexusdb',
      pooling: true,
    },
    functions: {
      type: 'edge',
      provider: 'nexusdb',
      region: 'us-east-1',
    },
    payments: {
      provider: 'stripe',
      webhooks: true,
      subscriptions: true,
    },
    storage: {
      provider: 'nexusdb',
      buckets: ['avatars', 'documents', 'videos', 'exports'],
    },
  },
  tiers: {
    core: {
      id: 'core',
      name: 'Core',
      price: 8900,
      currency: 'USD',
      interval: 'month',
      features: [
        'training_program',
        'nutrition_plan',
        'email_support',
        'progress_tracking',
        'mobile_app',
      ],
      limits: {
        consultations: 2,
        program_updates: 1,
        message_responses: 72, // hours
      },
    },
    adaptive: {
      id: 'adaptive',
      name: 'Adaptive',
      price: 14900,
      currency: 'USD',
      interval: 'month',
      features: [
        'all_core_features',
        'biomarkers_tracking',
        'wearable_integration',
        'weekly_checkins',
        'advanced_analytics',
      ],
      limits: {
        consultations: 4,
        program_updates: 2,
        message_responses: 48, // hours
        wearable_syncs: -1,
      },
    },
    performance: {
      id: 'performance',
      name: 'Performance',
      price: 22900,
      currency: 'USD',
      interval: 'month',
      features: [
        'all_adaptive_features',
        'ai_coaching_assistant',
        'form_analysis',
        'peds_protocols',
        'priority_support',
      ],
      limits: {
        consultations: 8,
        program_updates: 4,
        message_responses: 24, // hours
        ai_sessions: 10,
      },
    },
    longevity: {
      id: 'longevity',
      name: 'Longevity',
      price: 34900,
      currency: 'USD',
      interval: 'month',
      features: [
        'all_performance_features',
        'in_person_training',
        'concierge_service',
        'medical_oversight',
        'custom_protocols',
      ],
      limits: {
        consultations: -1,
        program_updates: -1,
        message_responses: 12, // hours
        in_person_sessions: 4,
      },
    },
  },
};
