import { describe, expect, it } from 'vitest';
import { characterDefinitionById } from './characterDatabase';
import { enemyById, enemyProductionEntries } from './enemyProductionDatabase';
import { itemAssetProductionEntries } from './itemAssetProductionDatabase';
import { stageById, stageProductionEntries } from './stageProductionDatabase';

const allowedGlobalStageSeedNames = new Set([
  '灯紋具',
]);

describe('production content cross references', () => {
  it('keeps stage lead characters resolvable from the character database', () => {
    for (const stage of stageProductionEntries) {
      for (const characterId of stage.leadCharacterIds) {
        expect(characterDefinitionById.has(characterId), `${stage.id} lead character ${characterId}`).toBe(true);
      }
    }
  });

  it('keeps stage enemy affinity ids resolvable from the enemy database', () => {
    for (const stage of stageProductionEntries) {
      for (const enemyId of stage.enemyAffinity) {
        expect(enemyById.has(enemyId), `${stage.id} enemy affinity ${enemyId}`).toBe(true);
      }
    }
  });

  it('keeps enemy stage affinity ids resolvable from the stage database', () => {
    for (const enemy of enemyProductionEntries) {
      for (const stageId of enemy.stageAffinity) {
        expect(stageById.has(stageId), `${enemy.id} stage affinity ${stageId}`).toBe(true);
      }
    }
  });

  it('keeps stage item seed display names backed by item asset entries or approved global seeds', () => {
    const itemNames = new Set(itemAssetProductionEntries.map((item) => item.name));

    for (const stage of stageProductionEntries) {
      for (const itemSeed of stage.itemSeeds) {
        expect(
          itemNames.has(itemSeed) || allowedGlobalStageSeedNames.has(itemSeed),
          `${stage.id} item seed ${itemSeed}`,
        ).toBe(true);
      }
    }
  });
});
