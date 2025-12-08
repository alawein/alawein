/**
 * Feature flags system for controlled feature rollout
 * Supports user-based, percentage-based, and conditional targeting
 */

import { getConfig, isProduction } from './environment';

export interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetGroups?: string[];
  conditions?: FeatureCondition[];
  metadata?: Record<string, unknown>;
}

export interface FeatureCondition {
  type: 'user' | 'group' | 'property' | 'time' | 'custom';
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'regex';
  field: string;
  value: unknown;
}

export interface UserContext {
  id?: string;
  email?: string;
  groups?: string[];
  properties?: Record<string, unknown>;
  registeredAt?: Date;
  plan?: 'free' | 'pro' | 'enterprise';
}

// Feature flag definitions
const featureFlags: Record<string, FeatureFlag> = {
  // Arena features
  'arena.multimodel': {
    name: 'arena.multimodel',
    description: 'Enable multi-model comparisons in Arena',
    enabled: true,
    rolloutPercentage: 100,
  },
  
  'arena.realtime': {
    name: 'arena.realtime',
    description: 'Real-time streaming responses in Arena',
    enabled: true,
    rolloutPercentage: 100,
  },
  
  'arena.collaboration': {
    name: 'arena.collaboration',
    description: 'Collaborative testing sessions',
    enabled: false,
    rolloutPercentage: 0,
    targetGroups: ['beta-testers'],
  },
  
  // Benchmark features
  'bench.custom': {
    name: 'bench.custom',
    description: 'Custom benchmark creation',
    enabled: true,
    rolloutPercentage: 100,
  },
  
  'bench.schedule': {
    name: 'bench.schedule',
    description: 'Scheduled benchmark runs',
    enabled: false,
    rolloutPercentage: 50,
    targetGroups: ['pro', 'enterprise'],
  },
  
  'bench.parallel': {
    name: 'bench.parallel',
    description: 'Parallel benchmark execution',
    enabled: false,
    rolloutPercentage: 25,
    conditions: [
      {
        type: 'property',
        operator: 'equals',
        field: 'plan',
        value: 'enterprise',
      },
    ],
  },
  
  // Dashboard features
  'dashboard.analytics': {
    name: 'dashboard.analytics',
    description: 'Advanced analytics dashboard',
    enabled: true,
    rolloutPercentage: 100,
  },
  
  'dashboard.export': {
    name: 'dashboard.export',
    description: 'Export dashboard data',
    enabled: true,
    rolloutPercentage: 100,
  },
  
  'dashboard.realtime': {
    name: 'dashboard.realtime',
    description: 'Real-time dashboard updates',
    enabled: false,
    rolloutPercentage: 75,
  },
  
  // AI features
  'ai.suggestions': {
    name: 'ai.suggestions',
    description: 'AI-powered prompt suggestions',
    enabled: false,
    rolloutPercentage: 10,
    targetGroups: ['beta-testers', 'pro', 'enterprise'],
  },
  
  'ai.autoeval': {
    name: 'ai.autoeval',
    description: 'Automatic evaluation generation',
    enabled: false,
    rolloutPercentage: 5,
    targetGroups: ['beta-testers'],
  },
  
  // Performance features
  'perf.webworkers': {
    name: 'perf.webworkers',
    description: 'Use Web Workers for heavy computations',
    enabled: true,
    rolloutPercentage: 100,
  },
  
  'perf.wasm': {
    name: 'perf.wasm',
    description: 'WebAssembly acceleration',
    enabled: false,
    rolloutPercentage: 25,
  },
  
  // Security features
  'security.2fa': {
    name: 'security.2fa',
    description: 'Two-factor authentication',
    enabled: false,
    rolloutPercentage: 100,
    conditions: [
      {
        type: 'property',
        operator: 'contains',
        field: 'plan',
        value: ['pro', 'enterprise'],
      },
    ],
  },
  
  'security.encryption': {
    name: 'security.encryption',
    description: 'End-to-end encryption for sensitive data',
    enabled: false,
    rolloutPercentage: 100,
    targetGroups: ['enterprise'],
  },
  
  // Experimental features
  'experimental.newui': {
    name: 'experimental.newui',
    description: 'New UI design system',
    enabled: false,
    rolloutPercentage: 5,
    targetGroups: ['internal', 'beta-testers'],
  },
  
  'experimental.voice': {
    name: 'experimental.voice',
    description: 'Voice input for prompts',
    enabled: false,
    rolloutPercentage: 0,
    targetUsers: ['dev@llmworks.dev'],
  },
};

// Local storage key for feature flag overrides
const OVERRIDE_KEY = 'llm_works_feature_overrides';

// Get feature flag overrides from local storage
function getOverrides(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(OVERRIDE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Set feature flag override
export function setOverride(flagName: string, enabled: boolean): void {
  if (typeof window === 'undefined') return;
  
  const overrides = getOverrides();
  overrides[flagName] = enabled;
  
  try {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.error('Failed to save feature flag override:', error);
  }
}

// Clear all overrides
export function clearOverrides(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(OVERRIDE_KEY);
  } catch (error) {
    console.error('Failed to clear feature flag overrides:', error);
  }
}

// Hash function for consistent percentage rollout
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Check if user is in rollout percentage
function isInRollout(flagName: string, userId: string, percentage: number): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;
  
  const hash = hashString(`${flagName}:${userId}`);
  const bucket = hash % 100;
  return bucket < percentage;
}

// Evaluate conditions
function evaluateConditions(conditions: FeatureCondition[], context: UserContext): boolean {
  return conditions.every(condition => {
    const fieldValue = condition.field.split('.').reduce((obj: any, key) => {
      return obj?.[key];
    }, context.properties || context);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(condition.value);
        }
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(condition.value as string);
        }
        return false;
      
      case 'greater':
        return Number(fieldValue) > Number(condition.value);
      
      case 'less':
        return Number(fieldValue) < Number(condition.value);
      
      case 'between':
        if (Array.isArray(condition.value) && condition.value.length === 2) {
          const num = Number(fieldValue);
          return num >= Number(condition.value[0]) && num <= Number(condition.value[1]);
        }
        return false;
      
      case 'regex':
        if (typeof fieldValue === 'string' && typeof condition.value === 'string') {
          return new RegExp(condition.value).test(fieldValue);
        }
        return false;
      
      default:
        return false;
    }
  });
}

/**
 * Check if a feature flag is enabled
 */
export function isFeatureFlagEnabled(
  flagName: string,
  context?: UserContext
): boolean {
  // Check environment configuration first
  const config = getConfig();
  if (!config.features.betaFeatures && flagName.startsWith('experimental.')) {
    return false;
  }
  
  // Check for override
  const overrides = getOverrides();
  if (flagName in overrides) {
    return overrides[flagName];
  }
  
  // Get flag definition
  const flag = featureFlags[flagName];
  if (!flag) {
    console.warn(`Unknown feature flag: ${flagName}`);
    return false;
  }
  
  // Check if globally disabled
  if (!flag.enabled) {
    return false;
  }
  
  // No context provided, use default behavior
  if (!context) {
    return flag.rolloutPercentage ? flag.rolloutPercentage >= 100 : flag.enabled;
  }
  
  // Check target users
  if (flag.targetUsers && context.id) {
    if (flag.targetUsers.includes(context.id) || 
        (context.email && flag.targetUsers.includes(context.email))) {
      return true;
    }
  }
  
  // Check target groups
  if (flag.targetGroups && context.groups) {
    if (flag.targetGroups.some(group => context.groups!.includes(group))) {
      return true;
    }
  }
  
  // Check conditions
  if (flag.conditions && flag.conditions.length > 0) {
    if (!evaluateConditions(flag.conditions, context)) {
      return false;
    }
  }
  
  // Check rollout percentage
  if (flag.rolloutPercentage !== undefined && context.id) {
    return isInRollout(flagName, context.id, flag.rolloutPercentage);
  }
  
  return flag.enabled;
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): Record<string, FeatureFlag> {
  return { ...featureFlags };
}

/**
 * Get enabled feature flags for a user
 */
export function getEnabledFeatures(context?: UserContext): string[] {
  return Object.keys(featureFlags).filter(flagName => 
    isFeatureFlagEnabled(flagName, context)
  );
}

/**
 * React hook for feature flags
 */
export function useFeatureFlag(flagName: string, context?: UserContext): boolean {
  return isFeatureFlagEnabled(flagName, context);
}

/**
 * Initialize feature flags system
 */
export function initFeatureFlags(): void {
  // Log enabled features in development
  if (!isProduction()) {
    console.log('Feature Flags:', getEnabledFeatures());
  }
  
  // Set up debug interface in development
  if (!isProduction() && typeof window !== 'undefined') {
    (window as any).__llm_works_features = {
      isEnabled: isFeatureFlagEnabled,
      setOverride,
      clearOverrides,
      getAllFlags: getAllFeatureFlags,
      getEnabled: getEnabledFeatures,
    };
  }
}

// Auto-initialize on import
initFeatureFlags();