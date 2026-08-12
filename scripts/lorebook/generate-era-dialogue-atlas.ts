import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildEraDialogueAtlasProjection } from '../../src/game/data/eraDialogueAtlasProjection.ts';

const OUTPUT_PATH = 'public/lorebook/data/era-dialogue-atlas.v1.json';

export { buildEraDialogueAtlasProjection };

export function writeEraDialogueAtlasProjection(outputPath = OUTPUT_PATH) {
  const absolutePath = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(buildEraDialogueAtlasProjection(), null, 2)}\n`, 'utf8');
  return absolutePath;
}

const directRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (directRun) {
  const written = writeEraDialogueAtlasProjection();
  console.log(`[era-dialogue-atlas] generated ${fileURLToPath(pathToFileURL(written))}`);
}
