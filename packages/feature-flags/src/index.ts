/**
 * REPZ Feature Flag Platform
 * Enterprise-grade feature management system for controlled rollouts
 *
 * @version 1.0.0
 * @author REPZ Team
 * @license MIT
 */

// Core feature flag engine
export { FeatureFlagManager, defaultManager } from './core/FeatureFlagManager';
export type { FeatureFlag } from './core/FeatureFlagManager';
export { FeatureFlagCache } from './core/FeatureFlagCache';
export { FeatureFlagEvaluator } from './core/FeatureFlagEvaluator';
export type { EvaluationContext } from './core/FeatureFlagEvaluator';

// Configuration
export { defaultConfig, mergeConfig } from './utils/config';
export type { FeatureFlagsConfig } from './utils/config';

// Validation
export { isValidFlagKey, validateFlagValue } from './utils/validation';

// Errors
export { FeatureFlagError, FlagNotFoundError } from './utils/errors';

// Constants
export { FLAG_REFRESH_INTERVAL, FLAG_CACHE_TTL, MAX_FLAG_KEY_LENGTH } from './constants';
