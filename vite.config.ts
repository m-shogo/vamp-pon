import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/phaser/')) return 'phaser';
          return undefined;
        },
      },
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
});
