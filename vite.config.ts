import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: 'viewer',
  plugins: [react()],
  publicDir: '../public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'viewer/src'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
