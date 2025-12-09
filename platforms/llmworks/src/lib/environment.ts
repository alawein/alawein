/**
 * Environment configuration system
 * Manages environment-specific settings and feature toggles
 */

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  // Core settings
  environment: Environment;
  apiUrl: string;
  cdnUrl: string;
  wsUrl: string;
  
  // Feature flags
  features: {
    analytics: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
    serviceWorker: boolean;
    pushNotifications: boolean;
    offlineMode: boolean;
    betaFeatures: boolean;
    debugMode: boolean;
  };
  
  // Security settings
  security: {
    enforceHttps: boolean;
    cspEnabled: boolean;
    corsOrigins: string[];
    rateLimiting: boolean;
    captchaEnabled: boolean;
  };
  
  // Performance settings
  performance: {
    lazyLoading: boolean;
    preloading: boolean;
    caching: boolean;
    compression: boolean;
    bundleOptimization: boolean;
  };
  
  // Monitoring settings
  monitoring: {
    sentryDsn?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    telemetryEnabled: boolean;
    sessionRecording: boolean;
  };
  
  // API settings
  api: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    batchRequests: boolean;
    cacheTimeout: number;
  };
  
  // UI settings
  ui: {
    animations: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    focusIndicators: boolean;
  };
}

// Default configurations for each environment
const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    environment: 'development',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    cdnUrl: import.meta.env.VITE_CDN_URL || '',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
    
    features: {
      analytics: false,
      errorReporting: true,
      performanceMonitoring: true,
      serviceWorker: false,
      pushNotifications: false,
      offlineMode: false,
      betaFeatures: true,
      debugMode: true,
    },
    
    security: {
      enforceHttps: false,
      cspEnabled: false,
      corsOrigins: ['http://localhost:8080', 'http://localhost:3000'],
      rateLimiting: false,
      captchaEnabled: false,
    },
    
    performance: {
      lazyLoading: true,
      preloading: false,
      caching: false,
      compression: false,
      bundleOptimization: false,
    },
    
    monitoring: {
      sentryDsn: undefined,
      logLevel: 'debug',
      telemetryEnabled: false,
      sessionRecording: false,
    },
    
    api: {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      batchRequests: false,
      cacheTimeout: 0,
    },
    
    ui: {
      animations: true,
      reducedMotion: false,
      highContrast: false,
      focusIndicators: true,
    },
  },
  
  staging: {
    environment: 'staging',
    apiUrl: import.meta.env.VITE_API_URL || 'https://staging-api.llmworks.dev',
    cdnUrl: import.meta.env.VITE_CDN_URL || 'https://staging-cdn.llmworks.dev',
    wsUrl: import.meta.env.VITE_WS_URL || 'wss://staging-api.llmworks.dev',
    
    features: {
      analytics: true,
      errorReporting: true,
      performanceMonitoring: true,
      serviceWorker: true,
      pushNotifications: false,
      offlineMode: true,
      betaFeatures: true,
      debugMode: false,
    },
    
    security: {
      enforceHttps: true,
      cspEnabled: true,
      corsOrigins: ['https://staging.llmworks.dev'],
      rateLimiting: true,
      captchaEnabled: false,
    },
    
    performance: {
      lazyLoading: true,
      preloading: true,
      caching: true,
      compression: true,
      bundleOptimization: true,
    },
    
    monitoring: {
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      logLevel: 'warn',
      telemetryEnabled: true,
      sessionRecording: false,
    },
    
    api: {
      timeout: 20000,
      retryAttempts: 3,
      retryDelay: 2000,
      batchRequests: true,
      cacheTimeout: 300000, // 5 minutes
    },
    
    ui: {
      animations: true,
      reducedMotion: false,
      highContrast: false,
      focusIndicators: true,
    },
  },
  
  production: {
    environment: 'production',
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.llmworks.dev',
    cdnUrl: import.meta.env.VITE_CDN_URL || 'https://cdn.llmworks.dev',
    wsUrl: import.meta.env.VITE_WS_URL || 'wss://api.llmworks.dev',
    
    features: {
      analytics: true,
      errorReporting: true,
      performanceMonitoring: true,
      serviceWorker: true,
      pushNotifications: true,
      offlineMode: true,
      betaFeatures: false,
      debugMode: false,
    },
    
    security: {
      enforceHttps: true,
      cspEnabled: true,
      corsOrigins: ['https://llmworks.dev', 'https://www.llmworks.dev'],
      rateLimiting: true,
      captchaEnabled: true,
    },
    
    performance: {
      lazyLoading: true,
      preloading: true,
      caching: true,
      compression: true,
      bundleOptimization: true,
    },
    
    monitoring: {
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      logLevel: 'error',
      telemetryEnabled: true,
      sessionRecording: true,
    },
    
    api: {
      timeout: 15000,
      retryAttempts: 3,
      retryDelay: 3000,
      batchRequests: true,
      cacheTimeout: 600000, // 10 minutes
    },
    
    ui: {
      animations: true,
      reducedMotion: false,
      highContrast: false,
      focusIndicators: true,
    },
  },
};

// Get current environment from Vite env or default to development
function getCurrentEnvironment(): Environment {
  const env = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE;
  
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
}

// Current environment configuration
let currentConfig: EnvironmentConfig = configs[getCurrentEnvironment()];

// Override with environment variables if present
function applyEnvironmentOverrides(config: EnvironmentConfig): EnvironmentConfig {
  const overrides = { ...config };
  
  // Apply feature flag overrides from environment variables
  Object.keys(config.features).forEach((key) => {
    const envKey = `VITE_FEATURE_${key.toUpperCase()}`;
    if (import.meta.env[envKey] !== undefined) {
      (overrides.features as any)[key] = import.meta.env[envKey] === 'true';
    }
  });
  
  // Apply security overrides
  Object.keys(config.security).forEach((key) => {
    const envKey = `VITE_SECURITY_${key.toUpperCase()}`;
    if (import.meta.env[envKey] !== undefined) {
      if (key === 'corsOrigins') {
        (overrides.security as any)[key] = import.meta.env[envKey].split(',');
      } else {
        (overrides.security as any)[key] = import.meta.env[envKey] === 'true';
      }
    }
  });
  
  return overrides;
}

// Apply overrides on initialization
currentConfig = applyEnvironmentOverrides(currentConfig);

/**
 * Get the current environment configuration
 */
export function getConfig(): EnvironmentConfig {
  return currentConfig;
}

/**
 * Get a specific configuration value
 */
export function getConfigValue<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
  return currentConfig[key];
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
  return currentConfig.features[feature];
}

/**
 * Get the current environment
 */
export function getEnvironment(): Environment {
  return currentConfig.environment;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return currentConfig.environment === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return currentConfig.environment === 'development';
}

/**
 * Check if running in staging
 */
export function isStaging(): boolean {
  return currentConfig.environment === 'staging';
}

/**
 * Update configuration (for testing purposes)
 */
export function updateConfig(updates: Partial<EnvironmentConfig>): void {
  if (isDevelopment()) {
    currentConfig = { ...currentConfig, ...updates };
  } else {
    console.warn('Configuration updates are only allowed in development mode');
  }
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): void {
  currentConfig = applyEnvironmentOverrides(configs[getCurrentEnvironment()]);
}

// Log configuration on initialization (development only)
if (isDevelopment()) {
  console.log('Environment Configuration:', {
    environment: currentConfig.environment,
    apiUrl: currentConfig.apiUrl,
    features: currentConfig.features,
  });
}