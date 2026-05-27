import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Root-relative URLs — required for Vercel (and correct for custom domains).
  base: '/',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    // Mermaid + viz chunks are large by design; avoid noisy CI warnings.
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('mermaid')) return 'mermaid';
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },

  // Matches `vite preview` locally; Vercel serves `dist` after `vite build`.
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
}));
