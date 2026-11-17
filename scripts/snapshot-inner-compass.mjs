// Saves a copy of the live Inner Compass CMS content into the bundle so the
// workshop page can still render when Supabase is slow, paused or down.
//
// Runs automatically before `npm run build` (see "prebuild" in package.json),
// so every deploy ships the latest published content. It never fails the
// build: if Supabase can't be reached, the previously committed snapshot stays.
//
// Manual run: npm run snapshot:inner-compass

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const snapshotPath = resolve(root, 'src/content/innerCompassSnapshot.json');
const requestTimeoutMs = 15_000;

// Vite reads .env files itself, but this script runs in plain Node first.
// Values already set in the environment (e.g. on Vercel) take precedence.
function loadEnvFile(fileName) {
  const filePath = resolve(root, fileName);
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

['.env.local', '.env'].forEach(loadEnvFile);

const keepExisting = (reason) => {
  const fallbackNote = existsSync(snapshotPath) ? 'keeping the existing snapshot' : 'no snapshot exists yet';
  console.warn(`[inner-compass snapshot] ${reason}; ${fallbackNote}.`);
};

const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  keepExisting('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set');
  process.exit(0);
}

try {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_inner_compass_content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: '{}',
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok) {
    keepExisting(`Supabase responded ${response.status}`);
    process.exit(0);
  }

  const data = await response.json();
  const looksValid = data && typeof data === 'object' && data.locales && Array.isArray(data.layout);

  if (!looksValid) {
    keepExisting('Supabase returned empty or unexpected content');
    process.exit(0);
  }

  const next = `${JSON.stringify(data, null, 2)}\n`;
  const previous = existsSync(snapshotPath) ? readFileSync(snapshotPath, 'utf8') : '';

  if (next === previous) {
    console.log('[inner-compass snapshot] Already up to date.');
  } else {
    writeFileSync(snapshotPath, next);
    console.log('[inner-compass snapshot] Updated from Supabase.');
  }
} catch (error) {
  keepExisting(`could not reach Supabase (${error instanceof Error ? error.message : String(error)})`);
}
