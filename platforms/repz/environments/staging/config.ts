export const stagingConfig = {
  supabase: {
    url: process.env.SUPABASE_STAGING_URL || 'https://staging-project.supabase.co',
    anonKey: process.env.SUPABASE_STAGING_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_STAGING_SERVICE_KEY || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_TEST_KEY || 'sk_test_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_STAGING || 'whsec_...',
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  },
  vercel: {
    projectId: process.env.VERCEL_PROJECT_ID_STAGING || '',
    orgId: process.env.VERCEL_ORG_ID || '',
    token: process.env.VERCEL_TOKEN || '',
  },
  features: {
    debugMode: false,
    mockData: false,
    hotReload: false,
    analytics: true,
    errorTracking: true,
    performanceMonitoring: true,
  },
  endpoints: {
    api: 'https://staging-api.repzcoach.com',
    functions: 'https://staging-functions.supabase.co',
    storage: 'https://staging-storage.supabase.co',
  },
  limits: {
    apiRateLimit: 5000, // requests per hour
    uploadSize: 50 * 1024 * 1024, // 50MB
    concurrentUsers: 500,
  },
  integrations: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY_STAGING || '',
      model: 'gpt-4-turbo-preview',
    },
    calendly: {
      token: process.env.CALENDLY_TOKEN_STAGING || '',
      webhookUrl: 'https://staging.repzcoach.com/api/calendly/webhook',
    },
    whoop: {
      clientId: process.env.WHOOP_CLIENT_ID_STAGING || '',
      clientSecret: process.env.WHOOP_CLIENT_SECRET_STAGING || '',
    },
  },
};
