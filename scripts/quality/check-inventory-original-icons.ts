import { existsSync, readFileSync } from 'node:fs';
import { INVENTORY_ORIGINAL_ICONS } from '../../src/game/assets/inventoryOriginalIcons.ts';

const errors: string[] = [];
const PNG_SIGNATURE = '89504e470d0a1a0a';

if (INVENTORY_ORIGINAL_ICONS.length !== 27) {
  errors.push(`expected 27 icons, got ${INVENTORY_ORIGINAL_ICONS.length}`);
}

for (const icon of INVENTORY_ORIGINAL_ICONS) {
  const filePath = `public/${icon.path}`;
  if (!existsSync(filePath)) {
    errors.push(`missing: ${filePath}`);
    continue;
  }

  const buffer = readFileSync(filePath);
  if (buffer.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) {
    errors.push(`${icon.itemId}: invalid PNG signature`);
    continue;
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer[24];
  const colorType = buffer[25];
  if (width !== 180 || height !== 180) {
    errors.push(`${icon.itemId}: expected 180x180, got ${width}x${height}`);
  }
  if (bitDepth !== 8 || colorType !== 6) {
    errors.push(`${icon.itemId}: expected 8-bit RGBA PNG, got bitDepth=${bitDepth} colorType=${colorType}`);
  }
}

if (errors.length > 0) {
  throw new Error(`inventory-original-icons failed\n${errors.join('\n')}`);
}

console.log(`inventory-original-icons: ok total=${INVENTORY_ORIGINAL_ICONS.length}`);
