/**
 * Supabase Client Configuration
 *
 * Creates and exports Supabase client instances for browser and server usage.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types.js';
import { getEnvVar, requireEnvVar } from '../env.js';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
      storage?: Storage;
    };
    global?: {
      headers?: Record<string, string>;
    };
  };
}

// Singleton instance for default client
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Create a new Supabase client with custom configuration
 */
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient<Database> {
  return createClient<Database>(config.supabaseUrl, config.supabaseKey, {
    auth: {
      autoRefreshToken: config.options?.auth?.autoRefreshToken ?? true,
      persistSession: config.options?.auth?.persistSession ?? true,
      detectSessionInUrl: config.options?.auth?.detectSessionInUrl ?? true,
      storage: config.options?.auth?.storage,
    },
    global: {
      headers: config.options?.global?.headers,
    },
  });
}

/**
 * Get the default Supabase client (browser)
 * Uses environment variables for configuration
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
    const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase environment variables. ' + 'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
      );
    }

    supabaseInstance = createSupabaseClient({
      supabaseUrl,
      supabaseKey,
    });
  }
  return supabaseInstance;
}

/**
 * Create a server-side Supabase client with service role key
 * Use this for server-side operations that bypass RLS
 */
export function createServerClient(): SupabaseClient<Database> {
  const supabaseUrl = requireEnvVar('VITE_SUPABASE_URL');
  const serviceRoleKey = requireEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Default Supabase client instance
 * Lazy-initialized on first access
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    const client = getSupabaseClient();
    const value = (client as Record<string, unknown>)[prop as string];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
