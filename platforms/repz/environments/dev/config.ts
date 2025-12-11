export const devConfig = {
  supabase: {
    url: process.env.SUPABASE_DEV_URL || 'https://dev-project.supabase.co',
    anonKey: process.env.SUPABASE_DEV_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_DEV_SERVICE_KEY || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_TEST_KEY || 'sk_test_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_DEV || 'whsec_...',
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  },
  vercel: {
    projectId: process.env.VERCEL_PROJECT_ID_DEV || '',
    orgId: process.env.VERCEL_ORG_ID || '',
    token: process.env.VERCEL_TOKEN || '',
  },
  features: {
    debugMode: true,
    mockData: true,
    hotReload: true,
    analytics: false,
    errorTracking: false,
    performanceMonitoring: false,
  },
  endpoints: {
    api: 'https://dev-api.repzcoach.com',
    functions: 'https://dev-functions.supabase.co',
    storage: 'https://dev-storage.supabase.co',
  },
  limits: {
    apiRateLimit: 1000, // requests per hour
    uploadSize: 10 * 1024 * 1024, // 10MB
    concurrentUsers: 50,
  },
  integrations: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY_DEV || '',
      model: 'gpt-4-turbo-preview',
    },
    calendly: {
      token: process.env.CALENDLY_TOKEN_DEV || '',
      webhookUrl: 'https://dev.repzcoach.com/api/calendly/webhook',
    },
    whoop: {
      clientId: process.env.WHOOP_CLIENT_ID_DEV || '',
      clientSecret: process.env.WHOOP_CLIENT_SECRET_DEV || '',
    },
  },
};
