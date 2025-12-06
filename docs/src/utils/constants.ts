// App Constants
export const APP_NAME = 'MateaHub';
export const APP_DESCRIPTION = 'Full-stack template system with 5 design engines';

// Route paths
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  TEMPLATES: '/templates',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  DESIGN_ENGINE: 'designEngine',
  AUTH_TOKEN: 'auth-storage',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PROFILES: '/profiles',
} as const;
