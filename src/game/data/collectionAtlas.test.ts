import { describe, expect, it } from 'vitest';
import {
  collectionAtlasSectionAssets,
  keeperEmblemAssets,
  lostItemCardAssets,
} from './collectionAtlasAssets';
import { forgottenStreetNightBoard } from './collectionProgress';
import { collectionSections } from './collectionSections';
import { keeperRecords } from './keeperRecords';
import { lostItemRecords } from './lostItemRecords';
import { launchCoreKnowledgeLines } from './knowledgeLines';
import { launchCoreCharacterKnowledgeReplies } from './characterKnowledgeReplies';

function expectUniqueIds(items: Array<{ id: string }>, label: string): void {
  const ids = items.map((item) => item.id);
  const unique = new Set(ids);
  expect(unique.size, `${label} ids must be unique`).toBe(ids.length);
}

function expectUniqueKeys(items: Array<{ image: { key: string } }>, label: string): void {
  const keys = items.map((item) => item.image.key);
  expect(new Set(keys).size, `${label} keys must be unique`).toBe(keys.length);
}

describe('collection atlas data', () => {
  it('図鑑タブIDが重複しない', () => {
    expectUniqueIds(collectionSections, 'collectionSections');
  });

  it('夜明け星図のセルIDと座標が重複しない', () => {
    expectUniqueIds(forgottenStreetNightBoard.cells, 'nightBoard cells');
    const positions = forgottenStreetNightBoard.cells.map((cell) => `${cell.x},${cell.y}`);
    expect(new Set(positions).size, 'nightBoard cell positions must be unique').toBe(positions.length);
  });

  it('夜明け星図の revealBy は存在するセルだけを参照する', () => {
    const ids = new Set(forgottenStreetNightBoard.cells.map((cell) => cell.id));
    for (const cell of forgottenStreetNightBoard.cells) {
      for (const parentId of cell.revealBy ?? []) {
        expect(ids.has(parentId), `${cell.id} references missing parent ${parentId}`).toBe(true);
      }
    }
  });

  it('灯し手記録のIDとcharacterIdが重複しない', () => {
    expectUniqueIds(keeperRecords, 'keeperRecords');
    const characterIds = keeperRecords.map((record) => record.characterId);
    expect(new Set(characterIds).size, 'keeper characterIds must be unique').toBe(characterIds.length);
  });

  it('忘れ物絵札のIDが重複しない', () => {
    expectUniqueIds(lostItemRecords, 'lostItemRecords');
  });

  it('言葉の記録は返信先のKnowledgeLineを参照している', () => {
    const lineIds = new Set(launchCoreKnowledgeLines.map((line) => line.id));
    for (const reply of launchCoreCharacterKnowledgeReplies) {
      expect(lineIds.has(reply.knowledgeLineId), `${reply.id} references missing knowledge line ${reply.knowledgeLineId}`).toBe(true);
    }
  });

  it('CollectionSceneの初期選択IDが存在する', () => {
    expect(keeperRecords.some((record) => record.id === 'keeper-yui')).toBe(true);
    expect(lostItemRecords.some((record) => record.id === 'lost-small-bag-tag')).toBe(true);
    expect(launchCoreKnowledgeLines.some((line) => line.id === 'quote-dickinson-dark')).toBe(true);
  });

  it('図鑑タブ背景アセットは全タブ分ある', () => {
    const sectionIds = new Set(collectionSections.map((section) => section.id));
    const assetSectionIds = new Set(collectionAtlasSectionAssets.map((asset) => asset.sectionId));
    expect(assetSectionIds).toEqual(sectionIds);
  });

  it('忘れ物絵札アセットは全忘れ物分ある', () => {
    const lostItemIds = new Set(lostItemRecords.map((record) => record.id));
    const assetIds = new Set(lostItemCardAssets.map((asset) => asset.id));
    expect(assetIds).toEqual(lostItemIds);
    expectUniqueKeys(lostItemCardAssets, 'lostItemCardAssets');
  });

  it('灯し手エンブレムアセットは全灯し手分ある', () => {
    const keeperIds = new Set(keeperRecords.map((record) => record.id));
    const assetIds = new Set(keeperEmblemAssets.map((asset) => asset.id));
    expect(assetIds).toEqual(keeperIds);
    expectUniqueKeys(keeperEmblemAssets, 'keeperEmblemAssets');
  });
});
