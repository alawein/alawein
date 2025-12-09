/**
 * User Zod Schemas
 * Shared validation for user profiles and settings
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import { emailSchema, phoneSchema, urlSchema, uuidSchema } from './common';

// ============================================================================
// USER ROLES & PERMISSIONS
// ============================================================================

/** User role enum */
export const userRoleSchema = z.enum(['user', 'admin', 'moderator', 'owner']);

export type UserRole = z.infer<typeof userRoleSchema>;

/** Permission types */
export const permissionSchema = z.enum([
  'read',
  'write',
  'delete',
  'admin',
  'manage_users',
  'manage_billing',
  'manage_settings',
]);

export type Permission = z.infer<typeof permissionSchema>;

// ============================================================================
// USER PROFILE
// ============================================================================

/** User profile schema */
export const userProfileSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: urlSchema.optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  timezone: z.string().default('UTC'),
  locale: z.string().default('en-US'),
  role: userRoleSchema.default('user'),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  mfaEnabled: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/** Update profile schema (partial) */
export const updateProfileSchema = userProfileSchema
  .pick({
    firstName: true,
    lastName: true,
    displayName: true,
    avatarUrl: true,
    phone: true,
    bio: true,
    timezone: true,
    locale: true,
  })
  .partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================================
// USER PREFERENCES
// ============================================================================

/** Notification preferences */
export const notificationPreferencesSchema = z.object({
  email: z.object({
    marketing: z.boolean().default(false),
    productUpdates: z.boolean().default(true),
    securityAlerts: z.boolean().default(true),
    weeklyDigest: z.boolean().default(false),
  }),
  push: z.object({
    enabled: z.boolean().default(true),
    newMessages: z.boolean().default(true),
    mentions: z.boolean().default(true),
    reminders: z.boolean().default(true),
  }),
  sms: z.object({
    enabled: z.boolean().default(false),
    securityAlerts: z.boolean().default(true),
  }),
});

export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;

/** Theme preferences */
export const themePreferencesSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']).default('system'),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
});

export type ThemePreferences = z.infer<typeof themePreferencesSchema>;

/** Combined user preferences */
export const userPreferencesSchema = z.object({
  notifications: notificationPreferencesSchema,
  theme: themePreferencesSchema,
  language: z.string().default('en'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// ============================================================================
// MULTI-TENANT SCHEMAS
// ============================================================================

/** Tenant/Organization schema */
export const tenantSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  logoUrl: urlSchema.optional().nullable(),
  plan: z.enum(['free', 'starter', 'pro', 'enterprise']).default('free'),
  ownerId: uuidSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Tenant = z.infer<typeof tenantSchema>;

/** Tenant member schema */
export const tenantMemberSchema = z.object({
  id: uuidSchema,
  tenantId: uuidSchema,
  userId: uuidSchema,
  role: userRoleSchema,
  permissions: z.array(permissionSchema).default([]),
  invitedBy: uuidSchema.optional(),
  joinedAt: z.string().datetime(),
});

export type TenantMember = z.infer<typeof tenantMemberSchema>;

/** Invite user to tenant */
export const inviteUserSchema = z.object({
  email: emailSchema,
  role: userRoleSchema.default('user'),
  permissions: z.array(permissionSchema).optional(),
  message: z.string().max(500).optional(),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

// ============================================================================
// API KEY SCHEMAS
// ============================================================================

/** API key schema */
export const apiKeySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  prefix: z.string().length(8),
  permissions: z.array(permissionSchema),
  expiresAt: z.string().datetime().optional().nullable(),
  lastUsedAt: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

/** Create API key */
export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(permissionSchema).min(1),
  expiresIn: z.enum(['30d', '90d', '1y', 'never']).default('90d'),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
