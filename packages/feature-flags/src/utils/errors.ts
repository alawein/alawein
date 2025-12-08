/**
 * Feature Flag Error Classes
 */

export class FeatureFlagError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeatureFlagError';
  }
}

export class FlagNotFoundError extends FeatureFlagError {
  constructor(flagKey: string) {
    super(`Feature flag not found: ${flagKey}`);
    this.name = 'FlagNotFoundError';
  }
}
