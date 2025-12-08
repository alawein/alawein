/**
 * API validation utilities
 */

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
