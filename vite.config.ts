/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages ينشر في subpath /ebook-store/ → base يجب أن يطابقه.
  // (Vercel يخدم من root، لكن الـ base النسبي لا يؤذيه.)
  base: '/ebook-store/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
