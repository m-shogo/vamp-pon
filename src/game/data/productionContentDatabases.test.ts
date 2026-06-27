import { describe, expect, it } from 'vitest';
import {
  ENEMY_ASSET_PROMPT_KINDS,
  enemyAssetPrompts,
  enemyProductionEntries,
  enemyProductionSummary,
  getEnemyAssetPrompt,
} from './enemyProductionDatabase';
import {
  ITEM_ASSET_PROMPT_KINDS,
  getItemAssetPrompt,
  itemAssetProductionEntries,
  itemAssetProductionSummary,
  itemAssetPrompts,
} from './itemAssetProductionDatabase';
import {
  STAGE_ASSET_PROMPT_KINDS,
  getStageAssetPrompt,
  stageAssetPrompts,
  stageProductionEntries,
  stageProductionSummary,
} from './stageProductionDatabase';

describe('production content databases', () => {
  it('keeps the enemy database complete enough for the 48-enemy asset plan', () => {
    expect(enemyProductionEntries).toHaveLength(48);
    expect(enemyProductionSummary.small).toBe(35);
    expect(enemyProductionSummary.mediumOrElite).toBe(10);
    expect(enemyProductionSummary.boss).toBe(3);
    expect(enemyAssetPrompts).toHaveLength(enemyProductionEntries.length * ENEMY_ASSET_PROMPT_KINDS.length);
    expect(new Set(enemyProductionEntries.map((enemy) => enemy.id)).size).toBe(enemyProductionEntries.length);

    for (const enemy of enemyProductionEntries) {
      expect(enemy.name).toBeTruthy();
      expect(enemy.wrongReading).toBeTruthy();
      expect(enemy.releasedClue).toBeTruthy();
      expect(enemy.assetKeywords.length).toBeGreaterThan(0);
      for (const kind of ENEMY_ASSET_PROMPT_KINDS) {
        expect(getEnemyAssetPrompt(enemy.id, kind)?.prompt).toContain(enemy.id);
      }
    }
  });

  it('keeps the item asset database tied to character production and field drops', () => {
    expect(itemAssetProductionSummary.total).toBe(itemAssetProductionEntries.length);
    expect(itemAssetProductionSummary.fieldDrops).toBeGreaterThanOrEqual(5);
    expect(itemAssetProductionSummary.characterLinked).toBeGreaterThanOrEqual(100);
    expect(itemAssetPrompts).toHaveLength(itemAssetProductionEntries.length * ITEM_ASSET_PROMPT_KINDS.length);
    expect(new Set(itemAssetProductionEntries.map((item) => item.id)).size).toBe(itemAssetProductionEntries.length);

    for (const item of itemAssetProductionEntries) {
      expect(item.name).toBeTruthy();
      expect(item.visualAnchor).toBeTruthy();
      expect(item.assetKeywords.length).toBeGreaterThan(0);
      for (const kind of ITEM_ASSET_PROMPT_KINDS) {
        expect(getItemAssetPrompt(item.id, kind)?.prompt).toContain(item.id);
      }
    }
  });

  it('keeps stage database and asset prompts available for core and seed stages', () => {
    expect(stageProductionEntries.length).toBeGreaterThanOrEqual(20);
    expect(stageProductionSummary.core5).toBeGreaterThanOrEqual(5);
    expect(stageAssetPrompts).toHaveLength(stageProductionEntries.length * STAGE_ASSET_PROMPT_KINDS.length);
    expect(new Set(stageProductionEntries.map((stage) => stage.id)).size).toBe(stageProductionEntries.length);

    for (const stage of stageProductionEntries) {
      expect(stage.name).toBeTruthy();
      expect(stage.coreQuestion).toBeTruthy();
      expect(stage.backgroundMotifs.length).toBeGreaterThan(0);
      expect(stage.enemyAffinity.length).toBeGreaterThan(0);
      expect(stage.itemSeeds.length).toBeGreaterThan(0);
      for (const kind of STAGE_ASSET_PROMPT_KINDS) {
        expect(getStageAssetPrompt(stage.id, kind)?.prompt).toContain(stage.id);
      }
    }
  });
});
