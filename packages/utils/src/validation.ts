import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email();
export const urlSchema = z.string().url();
export const uuidSchema = z.string().uuid();

// Utility functions
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function isValidUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}

export function isValidUuid(uuid: string): boolean {
  return uuidSchema.safeParse(uuid).success;
}

export function validateRequired<T>(obj: T, required: (keyof T)[]): string[] {
  const missing: string[] = [];
  for (const key of required) {
    if (!obj[key]) {
      missing.push(String(key));
    }
  }
  return missing;
}
