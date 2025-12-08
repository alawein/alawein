/**
 * Hook to get multiple feature flags
 */

import { useContext, useMemo } from 'react';
import { FeatureFlagContext } from './FeatureFlagProvider';

export function useFeatureFlags(keys: string[]): Record<string, boolean> {
  const context = useContext(FeatureFlagContext);

  return useMemo(() => {
    const result: Record<string, boolean> = {};
    for (const key of keys) {
      result[key] = context?.flags?.[key] ?? false;
    }
    return result;
  }, [keys, context?.flags]);
}
