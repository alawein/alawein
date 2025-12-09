/**
 * Common Zod Schemas
 * Reusable validation patterns for all platforms
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// ============================================================================
// PRIMITIVE SCHEMAS
// ============================================================================

/** UUID v4 validation */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/** Email validation with normalization */
export const emailSchema = z.string().email('Invalid email format').toLowerCase().trim();

/** Strong password validation */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/** Simple password (for login, not registration) */
export const simplePasswordSchema = z.string().min(1, 'Password is required');

/** Phone number validation (E.164 format) */
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/** URL validation */
export const urlSchema = z.string().url('Invalid URL format');

/** Slug validation (URL-safe string) */
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must not exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only');

// ============================================================================
// DATE/TIME SCHEMAS
// ============================================================================

/** ISO 8601 date string */
export const isoDateSchema = z.string().datetime({ message: 'Invalid ISO date format' });

/** Date range validation */
export const dateRangeSchema = z
  .object({
    startDate: isoDateSchema,
    endDate: isoDateSchema,
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date',
  });

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/** Standard pagination parameters */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/** Paginated response wrapper */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

/** Standard API success response */
export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

/** Standard API error response */
export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z
      .array(
        z.object({
          field: z.string().optional(),
          message: z.string(),
        }),
      )
      .optional(),
    requestId: z.string().optional(),
    timestamp: z.string().optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// ============================================================================
// MONEY/CURRENCY SCHEMAS
// ============================================================================

/** Currency code (ISO 4217) */
export const currencyCodeSchema = z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']);

/** Money amount (in cents for precision) */
export const moneySchema = z.object({
  amount: z.number().int().min(0),
  currency: currencyCodeSchema,
});

export type Money = z.infer<typeof moneySchema>;

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

/** File metadata for uploads */
export const fileMetadataSchema = z.object({
  name: z.string().min(1).max(255),
  size: z
    .number()
    .int()
    .min(0)
    .max(50 * 1024 * 1024), // 50MB max
  type: z.string(),
  lastModified: z.number().optional(),
});

export type FileMetadata = z.infer<typeof fileMetadataSchema>;

// ============================================================================
// SEARCH SCHEMAS
// ============================================================================

/** Search query parameters */
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).trim(),
  filters: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  ...paginationSchema.shape,
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
