import { existsSync, readFileSync } from 'node:fs';
import { INVENTORY_ORIGINAL_ICONS } from '../../src/game/assets/inventoryOriginalIcons.ts';
import { decodePng } from '../prototypes/core5-image/png-rgba.ts';

const errors: string[] = [];

if (INVENTORY_ORIGINAL_ICONS.length !== 27) {
  errors.push(`expected 27 icons, got ${INVENTORY_ORIGINAL_ICONS.length}`);
}

for (const icon of INVENTORY_ORIGINAL_ICONS) {
  const filePath = `public/${icon.path}`;
  if (!existsSync(filePath)) {
    errors.push(`missing: ${filePath}`);
    continue;
  }

  const image = decodePng(readFileSync(filePath));
  if (image.width !== 180 || image.height !== 180) {
    errors.push(`${icon.itemId}: expected 180x180, got ${image.width}x${image.height}`);
  }

  let transparent = 0;
  let visible = 0;
  for (let offset = 3; offset < image.data.length; offset += 4) {
    if (image.data[offset] === 0) transparent += 1;
    else visible += 1;
  }
  if (transparent === 0) errors.push(`${icon.itemId}: no transparent pixels`);
  if (visible === 0) errors.push(`${icon.itemId}: image is empty`);
}

if (errors.length > 0) {
  throw new Error(`inventory-original-icons failed\n${errors.join('\n')}`);
}

console.log(`inventory-original-icons: ok total=${INVENTORY_ORIGINAL_ICONS.length}`);
