/**
 * @alawein/shared-schemas
 *
 * Centralized Zod validation schemas for frontend and backend.
 * Provides type-safe validation that can be shared across all platforms.
 *
 * @example
 * ```typescript
 * import { signUpSchema, type SignUpInput } from '@alawein/shared-schemas';
 *
 * // Frontend: React Hook Form
 * const { register, handleSubmit } = useForm<SignUpInput>({
 *   resolver: zodResolver(signUpSchema),
 * });
 *
 * // Backend: Edge Function
 * const result = signUpSchema.safeParse(requestBody);
 * if (!result.success) {
 *   return new Response(JSON.stringify({ errors: result.error.flatten() }), { status: 400 });
 * }
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// COMMON SCHEMAS
// ============================================================================
export {
  // Primitives
  uuidSchema,
  emailSchema,
  passwordSchema,
  simplePasswordSchema,
  phoneSchema,
  urlSchema,
  slugSchema,

  // Date/Time
  isoDateSchema,
  dateRangeSchema,

  // Pagination
  paginationSchema,
  paginatedResponseSchema,
  type PaginationParams,

  // API Response
  apiSuccessSchema,
  apiErrorSchema,
  type ApiError,

  // Money
  currencyCodeSchema,
  moneySchema,
  type Money,

  // Files
  fileMetadataSchema,
  type FileMetadata,

  // Search
  searchQuerySchema,
  type SearchQuery,
} from './common';

// ============================================================================
// AUTH SCHEMAS
// ============================================================================
export {
  // Sign Up
  signUpSchema,
  type SignUpInput,

  // Sign In
  signInSchema,
  type SignInInput,

  // Password Reset
  forgotPasswordSchema,
  type ForgotPasswordInput,
  resetPasswordSchema,
  type ResetPasswordInput,
  changePasswordSchema,
  type ChangePasswordInput,

  // Tokens
  refreshTokenSchema,
  type RefreshTokenInput,
  tokenResponseSchema,
  type TokenResponse,

  // OAuth
  oauthProviderSchema,
  type OAuthProvider,
  oauthCallbackSchema,
  type OAuthCallbackInput,

  // MFA
  totpVerifySchema,
  type TotpVerifyInput,
  mfaSetupResponseSchema,
  type MfaSetupResponse,

  // Sessions
  sessionSchema,
  type Session,
} from './auth';

// ============================================================================
// USER SCHEMAS
// ============================================================================
export {
  // Roles & Permissions
  userRoleSchema,
  type UserRole,
  permissionSchema,
  type Permission,

  // Profile
  userProfileSchema,
  type UserProfile,
  updateProfileSchema,
  type UpdateProfileInput,

  // Preferences
  notificationPreferencesSchema,
  type NotificationPreferences,
  themePreferencesSchema,
  type ThemePreferences,
  userPreferencesSchema,
  type UserPreferences,

  // Multi-tenant
  tenantSchema,
  type Tenant,
  tenantMemberSchema,
  type TenantMember,
  inviteUserSchema,
  type InviteUserInput,

  // API Keys
  apiKeySchema,
  type ApiKey,
  createApiKeySchema,
  type CreateApiKeyInput,
} from './user';
