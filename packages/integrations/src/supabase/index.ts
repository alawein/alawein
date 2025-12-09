/**
 * Supabase Integration
 *
 * Provides database, authentication, and storage functionality.
 *
 * @example
 * ```ts
 * import { supabase, createSupabaseClient } from '@alawein/integrations/supabase';
 *
 * // Use default client
 * const { data } = await supabase.from('users').select('*');
 *
 * // Create custom client
 * const customClient = createSupabaseClient({
 *   supabaseUrl: 'https://xxx.supabase.co',
 *   supabaseKey: 'your-anon-key',
 * });
 * ```
 */

export { supabase, createSupabaseClient, createServerClient } from './client.js';
export {
  useAuth,
  signIn,
  signUp,
  signOut,
  signInWithOAuth,
  resetPassword,
  updatePassword,
  getSession,
  getUser,
} from './auth.js';
export { uploadFile, downloadFile, deleteFile, getPublicUrl, listFiles } from './storage.js';
export type { Database, Tables, Enums } from './types.js';
