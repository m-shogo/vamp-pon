import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

type CharacterAsset = {
  id: string;
  spriteSheetPath: string;
  exactSpriteSheetPath: string;
};

type Manifest = {
  productionTouched: boolean;
  characters: CharacterAsset[];
};

const MANIFEST_PATH = 'data/character-assets/core5-character-master-assets.json';
const SOURCE_WIDTH = 1448;
const SOURCE_HEIGHT = 1086;
const SOURCE_CELL_SIZE = 181;
const TARGET_WIDTH = 592;
const TARGET_HEIGHT = 444;
const TARGET_CELL_SIZE = 74;
const COLUMNS = 8;
const ROWS = 6;

function readPngSize(path: string): { width: number; height: number } {
  const data = readFileSync(path);
  if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`${path} is not a PNG`);
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

function resizeWithSips(source: string, output: string): void {
  const result = spawnSync(
    'sips',
    ['--resampleHeightWidth', String(TARGET_HEIGHT), String(TARGET_WIDTH), source, '--out', output],
    { encoding: 'utf8' },
  );

  if (result.error) {
    throw new Error(`failed to start sips: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`sips failed for ${source}:\n${result.stderr || result.stdout}`);
  }
}

if (process.platform !== 'darwin') {
  throw new Error('This resize command currently uses macOS sips. Run it on the project Mac.');
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Manifest;
if (manifest.productionTouched !== false) {
  throw new Error('productionTouched must remain false');
}

if (SOURCE_WIDTH !== COLUMNS * SOURCE_CELL_SIZE || SOURCE_HEIGHT !== ROWS * SOURCE_CELL_SIZE) {
  throw new Error('source grid constants are inconsistent');
}
if (TARGET_WIDTH !== COLUMNS * TARGET_CELL_SIZE || TARGET_HEIGHT !== ROWS * TARGET_CELL_SIZE) {
  throw new Error('target grid constants are inconsistent');
}

for (const character of manifest.characters) {
  const source = character.spriteSheetPath;
  const output = character.exactSpriteSheetPath;

  if (!existsSync(source)) {
    throw new Error(`${character.id}: source image is missing: ${source}`);
  }

  const sourceSize = readPngSize(source);
  if (sourceSize.width !== SOURCE_WIDTH || sourceSize.height !== SOURCE_HEIGHT) {
    throw new Error(
      `${character.id}: expected source ${SOURCE_WIDTH}x${SOURCE_HEIGHT} ` +
      `(${COLUMNS}x${ROWS}, ${SOURCE_CELL_SIZE}px cells), got ${sourceSize.width}x${sourceSize.height}`,
    );
  }

  mkdirSync(dirname(output), { recursive: true });
  resizeWithSips(source, output);

  const outputSize = readPngSize(output);
  if (outputSize.width !== TARGET_WIDTH || outputSize.height !== TARGET_HEIGHT) {
    throw new Error(
      `${character.id}: expected output ${TARGET_WIDTH}x${TARGET_HEIGHT}, ` +
      `got ${outputSize.width}x${outputSize.height}`,
    );
  }

  console.log(
    `resized ${character.id}: ${SOURCE_WIDTH}x${SOURCE_HEIGHT} (${SOURCE_CELL_SIZE}px/cell) ` +
    `-> ${TARGET_WIDTH}x${TARGET_HEIGHT} (${TARGET_CELL_SIZE}px/cell)`,
  );
}

console.log('Core5 exact drafts created by resizing the original PNGs only. No character redraw was performed.');
