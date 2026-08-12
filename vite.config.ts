import { defineConfig, type Plugin } from 'vite';
import { buildEraDialogueAtlasProjection } from './src/game/data/eraDialogueAtlasProjection.ts';

const ERA_DIALOGUE_ASSET_PATH = 'lorebook/data/era-dialogue-atlas.v1.json';

function eraDialogueAtlasPlugin(): Plugin {
  const source = () => `${JSON.stringify(buildEraDialogueAtlasProjection(), null, 2)}\n`;
  return {
    name: 'lorebook-era-dialogue-atlas',
    configureServer(server) {
      server.middlewares.use(`/${ERA_DIALOGUE_ASSET_PATH}`, (_request, response) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(source());
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: ERA_DIALOGUE_ASSET_PATH,
        source: source(),
      });
    },
  };
}

export default defineConfig({
  plugins: [eraDialogueAtlasPlugin()],
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
