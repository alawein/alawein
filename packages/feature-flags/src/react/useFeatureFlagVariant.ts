/**
 * Hook to get feature flag variant
 */

import { useContext } from 'react';
import { FeatureFlagContext } from './FeatureFlagProvider';

export function useFeatureFlagVariant<T = unknown>(key: string): T | undefined {
  const context = useContext(FeatureFlagContext);
  return context?.variants?.[key] as T | undefined;
}
