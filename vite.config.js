import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Required for GitHub Pages project deployment
  base: '/resume-builder/',

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
  },
});