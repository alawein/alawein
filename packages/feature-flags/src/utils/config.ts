/**
 * Feature Flags Configuration
 */

export interface FeatureFlagsConfig {
  apiEndpoint?: string;
  refreshInterval?: number;
  defaultFlags?: Record<string, boolean>;
}

export const defaultConfig: FeatureFlagsConfig = {
  refreshInterval: 60000,
  defaultFlags: {},
};

export function mergeConfig(config: Partial<FeatureFlagsConfig>): FeatureFlagsConfig {
  return { ...defaultConfig, ...config };
}
