import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'drill-down.min.js',
        chunkFileNames: 'chunk.js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
});