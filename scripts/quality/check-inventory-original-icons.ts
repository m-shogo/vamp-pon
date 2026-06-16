import { existsSync, readFileSync } from 'node:fs';
import { weapons } from '../../src/game/data/weapons.ts';
import { passives } from '../../src/game/data/passives.ts';
import { rareItems } from '../../src/game/data/rareItems.ts';

const errors: string[] = [];
const PNG_SIGNATURE = '89504e470d0a1a0a';
const ROOT = 'public/assets/prototypes/sprite-sheets';
const icons = [
  ...weapons.map((item) => ({ itemId: item.id, filePath: `${ROOT}/weapon/${item.id}.png` })),
  ...passives.map((item) => ({ itemId: item.id, filePath: `${ROOT}/passive/${item.id}.png` })),
  ...rareItems.map((item) => ({ itemId: item.id, filePath: `${ROOT}/rare/${item.id}.png` })),
];

if (icons.length !== 27) {
  errors.push(`expected 27 icons, got ${icons.length}`);
}

for (const icon of icons) {
  if (!existsSync(icon.filePath)) {
    errors.push(`missing: ${icon.filePath}`);
    continue;
  }

  const buffer = readFileSync(icon.filePath);
  if (buffer.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) {
    errors.push(`${icon.itemId}: invalid PNG signature`);
    continue;
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width !== 180 || height !== 180) {
    errors.push(`${icon.itemId}: expected 180x180, got ${width}x${height}`);
  }
}

if (errors.length > 0) {
  throw new Error(`inventory-original-icons failed\n${errors.join('\n')}`);
}

console.log(`inventory-original-icons: ok total=${icons.length}`);
