import { describe, expect, it } from 'vitest';
import { characterAssetPrompts } from './assetFactoryCharacterPrompts';
import {
  assetFactoryCatalogSummary,
  assetFactoryPromptByKey,
  assetFactoryPromptCatalog,
  assetFactoryPromptCatalogByType,
  getAssetFactoryPrompt,
} from './assetFactoryCatalog';
import { enemyAssetPrompts } from './enemyProductionDatabase';
import { itemAssetPrompts } from './itemAssetProductionDatabase';
import { stageAssetPrompts } from './stageProductionDatabase';

describe('assetFactoryCatalog', () => {
  it('combines character, enemy, item, and stage prompts into one catalog', () => {
    const expectedTotal = characterAssetPrompts.length + enemyAssetPrompts.length + itemAssetPrompts.length + stageAssetPrompts.length;

    expect(assetFactoryPromptCatalog).toHaveLength(expectedTotal);
    expect(assetFactoryCatalogSummary.totalPromptCount).toBe(expectedTotal);
    expect(assetFactoryPromptCatalogByType.character).toHaveLength(characterAssetPrompts.length);
    expect(assetFactoryPromptCatalogByType.enemy).toHaveLength(enemyAssetPrompts.length);
    expect(assetFactoryPromptCatalogByType.item).toHaveLength(itemAssetPrompts.length);
    expect(assetFactoryPromptCatalogByType.stage).toHaveLength(stageAssetPrompts.length);
  });

  it('uses stable unique keys and prototype output paths', () => {
    const keys = assetFactoryPromptCatalog.map((record) => record.key);
    expect(new Set(keys).size).toBe(keys.length);

    for (const record of assetFactoryPromptCatalog) {
      expect(assetFactoryPromptByKey.get(record.key)).toBe(record);
      expect(record.key).toBe(`${record.contentType}:${record.sourceId}:${record.kind}`);
      expect(record.outputPathHint).toContain('public/assets/prototypes/');
      expect(record.prompt).toContain(record.sourceId);
      expect(record.negativePrompt).toContain('no text');
      expect(record.negativePrompt).toContain('no watermark');
      expect(record.reviewChecklist.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('exposes typed lookup for each content type', () => {
    expect(getAssetFactoryPrompt('character', 'yui', 'sprite_sheet_180')?.sourceId).toBe('yui');
    expect(getAssetFactoryPrompt('enemy', 'ombu_small_ink', 'sprite_sheet_180')?.sourceId).toBe('ombu_small_ink');
    expect(getAssetFactoryPrompt('stage', 'forgotten_street', 'background_390x844')?.sourceId).toBe('forgotten_street');

    const firstItem = assetFactoryPromptCatalogByType.item[0];
    expect(getAssetFactoryPrompt('item', firstItem.sourceId, firstItem.kind as never)?.sourceId).toBe(firstItem.sourceId);
    expect(getAssetFactoryPrompt('enemy', 'missing', 'reference')).toBeUndefined();
  });
});
