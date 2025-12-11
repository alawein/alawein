export const productionConfig = {
  supabase: {
    url: process.env.SUPABASE_PROD_URL || 'https://prod-project.supabase.co',
    anonKey: process.env.SUPABASE_PROD_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_PROD_SERVICE_KEY || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_LIVE_KEY || 'sk_live_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_PROD || 'whsec_...',
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_...',
  },
  vercel: {
    projectId: process.env.VERCEL_PROJECT_ID_PROD || '',
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
    api: 'https://api.repzcoach.com',
    functions: 'https://functions.repzcoach.com',
    storage: 'https://storage.repzcoach.com',
  },
  limits: {
    apiRateLimit: 10000, // requests per hour
    uploadSize: 100 * 1024 * 1024, // 100MB
    concurrentUsers: 1000,
  },
  integrations: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY_PROD || '',
      model: 'gpt-4-turbo-preview',
    },
    calendly: {
      token: process.env.CALENDLY_TOKEN_PROD || '',
      webhookUrl: 'https://app.repzcoach.com/api/calendly/webhook',
    },
    whoop: {
      clientId: process.env.WHOOP_CLIENT_ID_PROD || '',
      clientSecret: process.env.WHOOP_CLIENT_SECRET_PROD || '',
    },
  },
};
