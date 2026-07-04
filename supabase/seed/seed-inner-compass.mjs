// One-time seed loader for the Inner Compass workshop page content.
// Reads supabase/seed/innerCompassSeed.json and writes it to the
// public.inner_compass_content row via the save_inner_compass_content RPC.
//
// Usage (from the project root):
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node supabase/seed/seed-inner-compass.mjs
//
// The service role key is required because the RPC is gated on is_cms_admin()
// and this script runs outside the JWT context. Keep the key out of git.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(here, 'innerCompassSeed.json');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const data = JSON.parse(readFileSync(seedPath, 'utf8'));

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.rpc('save_inner_compass_content', { p_data: data });

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log('Seeded public.inner_compass_content with the Inner Compass page data.');
