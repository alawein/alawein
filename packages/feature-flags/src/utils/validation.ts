/**
 * Feature Flag Validation Utilities
 */

export function isValidFlagKey(key: string): boolean {
  return /^[a-z][a-z0-9_-]*$/i.test(key);
}

export function validateFlagValue(value: unknown): boolean {
  return typeof value === 'boolean';
}
