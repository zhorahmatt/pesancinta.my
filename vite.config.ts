import type { ServerResponse } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const contentFile = resolve(__dirname, 'src/content/innerCompass.json');
const uploadsDir = resolve(__dirname, 'public/uploads');
const allowedUploadExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolvePromise, rejectPromise) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 25 * 1024 * 1024) {
        rejectPromise(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolvePromise(raw));
    req.on('error', rejectPromise);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

// Dev-only API that lets the local admin editor (/admin/inner-compass) read and
// rewrite src/content/innerCompass.json and upload images into public/uploads.
// `apply: 'serve'` keeps it entirely out of the production build.
function innerCompassEditorPlugin(): Plugin {
  return {
    name: 'inner-compass-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__editor/inner-compass', async (req, res) => {
        try {
          if (req.method === 'GET') {
            const json = readFileSync(contentFile, 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
            return;
          }

          if (req.method === 'POST') {
            const raw = await readBody(req);
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object' || !parsed.locales || !Array.isArray(parsed.layout)) {
              sendJson(res, 400, { error: 'Invalid content shape' });
              return;
            }
            writeFileSync(contentFile, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
            sendJson(res, 200, { ok: true });
            return;
          }

          sendJson(res, 405, { error: 'Method not allowed' });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });

      server.middlewares.use('/__editor/upload', async (req, res) => {
        try {
          if (req.method !== 'POST') {
            sendJson(res, 405, { error: 'Method not allowed' });
            return;
          }

          const raw = await readBody(req);
          const { filename, dataBase64 } = JSON.parse(raw) as { filename?: string; dataBase64?: string };
          if (!filename || !dataBase64) {
            sendJson(res, 400, { error: 'filename and dataBase64 are required' });
            return;
          }

          const safeBase = basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
          const ext = extname(safeBase).toLowerCase();
          if (!allowedUploadExt.has(ext)) {
            sendJson(res, 400, { error: `Unsupported file type: ${ext || '(none)'}` });
            return;
          }

          if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

          const stem = safeBase.slice(0, safeBase.length - ext.length) || 'image';
          let finalName = safeBase;
          if (existsSync(resolve(uploadsDir, finalName))) {
            finalName = `${stem}-${Date.now()}${ext}`;
          }

          const base64 = dataBase64.includes(',') ? dataBase64.slice(dataBase64.indexOf(',') + 1) : dataBase64;
          writeFileSync(resolve(uploadsDir, finalName), Buffer.from(base64, 'base64'));
          sendJson(res, 200, { path: `/uploads/${finalName}` });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), innerCompassEditorPlugin()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        workshop: resolve(__dirname, 'the-inner-compass-workshop/index.html'),
      },
    },
  },
});
