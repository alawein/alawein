/**
 * Component to render different content based on variant
 */

import React from 'react';
import { useFeatureFlagVariant } from './useFeatureFlagVariant';

interface VariantSwitchProps {
  flagKey: string;
  variants: Record<string, React.ReactNode>;
  fallback?: React.ReactNode;
}

export function VariantSwitch({ flagKey, variants, fallback }: VariantSwitchProps): React.ReactElement | null {
  const variant = useFeatureFlagVariant<string>(flagKey);

  if (variant && variants[variant]) {
    return <>{variants[variant]}</>;
  }

  return fallback ? <>{fallback}</> : null;
}
