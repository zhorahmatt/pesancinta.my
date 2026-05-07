import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        workshop: resolve(__dirname, 'the-inner-compass-workshop/index.html'),
      },
    },
  },
});
