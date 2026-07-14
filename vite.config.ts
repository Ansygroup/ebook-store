/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages ينشر في subpath /ebook-store/ → base في الإنتاج فقط.
  // في dev/e2e نخدم من root حتى تعمل المسارات المطلقة (/, /shop, /privacy).
  base: command === 'build' ? '/ebook-store/' : '/',
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
}));
