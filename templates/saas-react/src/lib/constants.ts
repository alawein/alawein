export const APP_CONFIG = {
  name: 'SaaS Template',
  version: '1.0.0',
  api: {
    timeout: 30000,
    retries: 3,
  },
  cache: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '*',
} as const;

export const QUERY_KEYS = {
  USER: ['user'],
  PROFILE: ['profile'],
} as const;
