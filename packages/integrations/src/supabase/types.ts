/**
 * Supabase Database Types
 *
 * This file should be regenerated using the Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/supabase/types.ts
 *
 * For now, we provide a base template that projects can extend.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Base Database interface - extend this per project
 *
 * @example
 * ```ts
 * // In your project's types file:
 * import type { Database as BaseDatabase } from '@alawein/integrations/supabase';
 *
 * export interface Database extends BaseDatabase {
 *   public: {
 *     Tables: {
 *       users: {
 *         Row: { id: string; email: string; created_at: string };
 *         Insert: { id?: string; email: string; created_at?: string };
 *         Update: { id?: string; email?: string; created_at?: string };
 *       };
 *       // ... more tables
 *     };
 *   };
 * }
 * ```
 */
export interface Database {
  public: {
    Tables: {
      // Base tables that all projects might have
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/**
 * Helper type to extract table row types
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/**
 * Helper type to extract enum types
 */
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

/**
 * Helper type for insert operations
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

/**
 * Helper type for update operations
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
