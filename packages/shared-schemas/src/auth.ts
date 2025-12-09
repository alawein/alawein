/**
 * Authentication Zod Schemas
 * Shared validation for auth flows across all platforms
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import { emailSchema, passwordSchema, simplePasswordSchema, phoneSchema } from './common';

// ============================================================================
// SIGN UP / REGISTRATION
// ============================================================================

/** User registration schema */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    phone: phoneSchema.optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

// ============================================================================
// SIGN IN / LOGIN
// ============================================================================

/** User login schema */
export const signInSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
  rememberMe: z.boolean().default(false),
});

export type SignInInput = z.infer<typeof signInSchema>;

// ============================================================================
// PASSWORD RESET
// ============================================================================

/** Request password reset */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/** Reset password with token */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Change password (when logged in) */
export const changePasswordSchema = z
  .object({
    currentPassword: simplePasswordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================================================
// TOKEN SCHEMAS
// ============================================================================

/** Refresh token request */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/** Token response from auth endpoints */
export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  tokenType: z.literal('Bearer'),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;

// ============================================================================
// OAUTH SCHEMAS
// ============================================================================

/** OAuth provider types */
export const oauthProviderSchema = z.enum(['google', 'github', 'apple', 'microsoft']);

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;

/** OAuth callback data */
export const oauthCallbackSchema = z.object({
  provider: oauthProviderSchema,
  code: z.string().min(1),
  state: z.string().optional(),
  redirectUri: z.string().url().optional(),
});

export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;

// ============================================================================
// MFA / 2FA SCHEMAS
// ============================================================================

/** TOTP verification */
export const totpVerifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be numeric'),
});

export type TotpVerifyInput = z.infer<typeof totpVerifySchema>;

/** MFA setup response */
export const mfaSetupResponseSchema = z.object({
  secret: z.string(),
  qrCodeUrl: z.string().url(),
  backupCodes: z.array(z.string()).length(10),
});

export type MfaSetupResponse = z.infer<typeof mfaSetupResponseSchema>;

// ============================================================================
// SESSION SCHEMAS
// ============================================================================

/** Session info */
export const sessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  isCurrent: z.boolean().default(false),
});

export type Session = z.infer<typeof sessionSchema>;
