"use strict";
/**
 * Environment configuration system
 * Manages environment-specific settings and feature toggles
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.getConfigValue = getConfigValue;
exports.isFeatureEnabled = isFeatureEnabled;
exports.getEnvironment = getEnvironment;
exports.isProduction = isProduction;
exports.isDevelopment = isDevelopment;
exports.isStaging = isStaging;
exports.updateConfig = updateConfig;
exports.resetConfig = resetConfig;
// Default configurations for each environment
var configs = {
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
function getCurrentEnvironment() {
    var env = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE;
    if (env === 'production')
        return 'production';
    if (env === 'staging')
        return 'staging';
    return 'development';
}
// Current environment configuration
var currentConfig = configs[getCurrentEnvironment()];
// Override with environment variables if present
function applyEnvironmentOverrides(config) {
    var overrides = __assign({}, config);
    // Apply feature flag overrides from environment variables
    Object.keys(config.features).forEach(function (key) {
        var envKey = "VITE_FEATURE_".concat(key.toUpperCase());
        if (import.meta.env[envKey] !== undefined) {
            overrides.features[key] = import.meta.env[envKey] === 'true';
        }
    });
    // Apply security overrides
    Object.keys(config.security).forEach(function (key) {
        var envKey = "VITE_SECURITY_".concat(key.toUpperCase());
        if (import.meta.env[envKey] !== undefined) {
            if (key === 'corsOrigins') {
                overrides.security[key] = import.meta.env[envKey].split(',');
            }
            else {
                overrides.security[key] = import.meta.env[envKey] === 'true';
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
function getConfig() {
    return currentConfig;
}
/**
 * Get a specific configuration value
 */
function getConfigValue(key) {
    return currentConfig[key];
}
/**
 * Check if a feature is enabled
 */
function isFeatureEnabled(feature) {
    return currentConfig.features[feature];
}
/**
 * Get the current environment
 */
function getEnvironment() {
    return currentConfig.environment;
}
/**
 * Check if running in production
 */
function isProduction() {
    return currentConfig.environment === 'production';
}
/**
 * Check if running in development
 */
function isDevelopment() {
    return currentConfig.environment === 'development';
}
/**
 * Check if running in staging
 */
function isStaging() {
    return currentConfig.environment === 'staging';
}
/**
 * Update configuration (for testing purposes)
 */
function updateConfig(updates) {
    if (isDevelopment()) {
        currentConfig = __assign(__assign({}, currentConfig), updates);
    }
    else {
        console.warn('Configuration updates are only allowed in development mode');
    }
}
/**
 * Reset configuration to defaults
 */
function resetConfig() {
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
