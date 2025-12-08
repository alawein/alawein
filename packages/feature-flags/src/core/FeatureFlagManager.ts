/**
 * Feature Flag Manager - Core management class
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  variants?: Record<string, unknown>;
  payload?: unknown;
}

export interface EvaluationContext {
  user?: {
    id?: string;
    tier?: string;
    role?: string;
    [key: string]: unknown;
  };
  timestamp?: string;
  custom?: Record<string, unknown>;
}

export interface EvaluationResult {
  enabled: boolean;
  variant?: string;
  payload?: unknown;
  reason?: string;
}

export class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();

  setFlag(key: string, enabled: boolean, payload?: unknown): void {
    this.flags.set(key, { key, enabled, payload });
  }

  getFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  isEnabled(key: string): boolean {
    return this.flags.get(key)?.enabled ?? false;
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  async evaluate(flagId: string, context: EvaluationContext): Promise<EvaluationResult> {
    const flag = this.flags.get(flagId);

    if (!flag) {
      return {
        enabled: false,
        reason: 'FLAG_NOT_FOUND',
      };
    }

    return {
      enabled: flag.enabled,
      variant: flag.variants ? Object.keys(flag.variants)[0] : undefined,
      payload: flag.payload,
      reason: 'MATCH',
    };
  }
}

export const defaultManager = new FeatureFlagManager();
