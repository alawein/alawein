import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_URL: z.string().url().optional(),
  VITE_API_URL: z.string().url().optional(),
  VITE_MONITORING_ENDPOINT: z.string().url().optional(),
});

export const env = envSchema.parse(import.meta.env);
