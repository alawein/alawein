/**
 * REPZ Feature Flags - React Integration
 * Hooks and components for React applications
 */

export { FeatureFlagProvider, FeatureFlagContext } from './FeatureFlagProvider';
export { useFeatureFlags } from './useFeatureFlags';
export { useFeatureFlagVariant } from './useFeatureFlagVariant';
export { VariantSwitch } from './VariantSwitch';
export { ExperimentProvider, useExperimentContext } from './ExperimentProvider';
export { useExperiment } from './useExperiment';

export type {
  FeatureFlagContextValue,
  FeatureFlagProviderProps,
} from './types';
