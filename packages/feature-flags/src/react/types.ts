/**
 * React Feature Flag Types
 */
import type { FeatureFlagManager } from '../core/FeatureFlagManager';

export interface UserContext {
  id?: string;
  tier?: string;
  role?: string;
  [key: string]: unknown;
}

export interface FeatureFlagContextValue {
  flags: Record<string, boolean>;
  variants: Record<string, unknown>;
  isLoading: boolean;
  error: Error | null;
  manager?: FeatureFlagManager;
  userContext?: UserContext;
}

export interface FeatureFlagProviderProps {
  children: React.ReactNode;
  flags?: Record<string, boolean>;
  variants?: Record<string, unknown>;
  manager?: FeatureFlagManager;
  userContext?: UserContext;
}
