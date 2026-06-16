import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type CharacterAsset = {
  id: 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';
  name: string;
  exactSpriteSheetPath: string;
};

type Manifest = { productionTouched: boolean; characters: CharacterAsset[] };

const OUT_DIR = 'public/assets/prototypes/sprite-sheets/core5-52px-normalized';
const EXPECTED_WIDTH = 592;
const EXPECTED_HEIGHT = 444;
const OUTPUTS: Record<CharacterAsset['id'], string> = {
  yui: `${OUT_DIR}/yui.png`,
  asa: `${OUT_DIR}/asa.png`,
  nagi: `${OUT_DIR}/nagi.png`,
  michiru: `${OUT_DIR}/michiru.png`,
  tomori: `${OUT_DIR}/tomori.png`,
};

function pngSize(path: string): { width: number; height: number } {
  const data = readFileSync(path);
  if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`${path} is not PNG`);
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

const manifest = JSON.parse(readFileSync('data/character-assets/core5-character-master-assets.json', 'utf8')) as Manifest;
if (manifest.productionTouched !== false) throw new Error('productionTouched must remain false');

mkdirSync(OUT_DIR, { recursive: true });
const reports: Array<Record<string, unknown>> = [];

for (const character of manifest.characters) {
  const output = OUTPUTS[character.id];
  if (!output) throw new Error(`unexpected character id: ${character.id}`);
  if (!existsSync(character.exactSpriteSheetPath)) throw new Error(`missing exact draft: ${character.exactSpriteSheetPath}`);

  const size = pngSize(character.exactSpriteSheetPath);
  if (size.width !== EXPECTED_WIDTH || size.height !== EXPECTED_HEIGHT) {
    throw new Error(`${character.id} must be ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}; got ${size.width}x${size.height}`);
  }

  copyFileSync(character.exactSpriteSheetPath, output);
  reports.push({
    id: character.id,
    name: character.name,
    source: character.exactSpriteSheetPath,
    output,
    width: size.width,
    height: size.height,
    status: 'prototype-generated-draft-preview',
    productionTouched: false,
  });
  console.log(`copied ${character.id}: ${character.exactSpriteSheetPath} -> ${output}`);
}

writeFileSync(join(OUT_DIR, 'exact-draft-manifest.json'), `${JSON.stringify({
  status: 'prototype-generated-draft-preview',
  productionTouched: false,
  grid: { columns: 8, rows: 6, cellSizePx: 74, width: EXPECTED_WIDTH, height: EXPECTED_HEIGHT },
  reports,
}, null, 2)}\n`);

console.log(`Core5 preview normalization completed: ${OUT_DIR}`);
