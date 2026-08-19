import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  VISUAL_ASSET_INVENTORY_PATHS,
  buildVisualAssetCoverage,
  buildVisualAssetRegistry,
  buildVisualCharacterPromptPackets,
  buildVisualImageProductionList,
  buildVisualGenerationBatches,
} from '../../src/game/data/visualAssetGenerationInventory.ts';

const snapshots = [
  [VISUAL_ASSET_INVENTORY_PATHS.coverage, buildVisualAssetCoverage()],
  [VISUAL_ASSET_INVENTORY_PATHS.registry, buildVisualAssetRegistry()],
  [VISUAL_ASSET_INVENTORY_PATHS.batches, buildVisualGenerationBatches()],
  [VISUAL_ASSET_INVENTORY_PATHS.characterPromptPackets, buildVisualCharacterPromptPackets()],
  [VISUAL_ASSET_INVENTORY_PATHS.imageProductionList, buildVisualImageProductionList()],
] as const;

for (const [path, value] of snapshots) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  console.log(`wrote ${path}`);
}
