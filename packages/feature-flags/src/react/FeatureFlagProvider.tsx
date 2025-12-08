/**
 * REPZ Feature Flag Provider
 * React context provider for feature flag management
 */

import React, { createContext, useState, ReactNode } from 'react';
import type { FeatureFlagContextValue, FeatureFlagProviderProps } from './types';

export const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

/**
 * Feature Flag Provider Component
 * Provides feature flag functionality to the React component tree
 */
export function FeatureFlagProvider({
  children,
  flags = {},
  variants = {},
}: FeatureFlagProviderProps): React.ReactElement {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const contextValue: FeatureFlagContextValue = {
    flags,
    variants,
    isLoading,
    error,
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
