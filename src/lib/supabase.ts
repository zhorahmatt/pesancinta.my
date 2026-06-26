import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Don't throw at import time: that would white-screen the whole site (including
// the static landing pages) when env vars are missing. Fall back to a harmless
// placeholder so the app still renders; only Supabase-backed actions will fail.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Supabase features are disabled.');
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient<Database>(
  supabaseUrl ?? 'http://localhost:54321',
  supabaseAnonKey ?? 'missing-anon-key',
);
