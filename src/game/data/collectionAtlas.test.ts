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
import { namedObjectById } from './namedObjectRegistry';
import { isStrictlyApprovedKnowledgeLine, launchCoreKnowledgeLines } from './knowledgeLines';
import { collectionWordRecordLines } from './collectionWordRecords';
import { launchCoreCharacterKnowledgeReplies } from './characterKnowledgeReplies';
import { nightBoardRewardLabel } from '../ui/collectionAtlasLabels';

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

  it('忘れ物絵札の関連先は存在する記録だけを参照する', () => {
    const keeperIds = new Set(keeperRecords.map((record) => record.id));
    const boardCellIds = new Set(forgottenStreetNightBoard.cells.map((cell) => cell.id));
    for (const record of lostItemRecords) {
      if (record.relatedKeeperId) {
        expect(keeperIds.has(record.relatedKeeperId), `${record.id} references missing keeper`).toBe(true);
      }
      if (record.relatedBoardCellId) {
        expect(boardCellIds.has(record.relatedBoardCellId), `${record.id} references missing board cell`).toBe(true);
      }
      expect(record.shortFlavor.trim().length).toBeGreaterThan(0);
    }
  });

  it('灯し手記録はCurrentの光る持ち物へstable接続し旧小物も保持する', () => {
    for (const record of keeperRecords) {
      const object = namedObjectById.get(record.luminousPossessionId);
      expect(object, record.id).toBeDefined();
      expect(object?.phase, record.id).toBe('luminous_possession');
      expect(object?.characterId, record.id).toBe(record.characterId);
      expect(object?.displayName, record.id).toBe(record.luminousPossessionName);
      expect(record.personalItem, record.id).toBe(record.luminousPossessionName);
      expect(record.legacyPersonalItems.length, record.id).toBeGreaterThan(0);
      expect(record.blackFormName, record.id).toContain('黒耀化');
      expect(record.blackFormName, record.id).not.toContain('黒曜化');
    }
  });

  it('灯し手記録はIP設計と見た目連続性を持つ', () => {
    for (const record of keeperRecords) {
      expect(record.personalItem.trim().length).toBeGreaterThan(0);
      expect(record.hairstyle.trim().length).toBeGreaterThan(0);
      expect(record.lightType.trim().length).toBeGreaterThan(0);
      expect(record.reasonToFight.trim().length).toBeGreaterThan(0);
      expect(record.merchandiseEmblem.trim().length).toBeGreaterThan(0);
      expect(record.blackFormRisk.trim().length).toBeGreaterThan(0);
      expect(record.dawnAftereffect.trim().length).toBeGreaterThan(0);
      expect(record.visualContinuityNotes.length).toBeGreaterThan(0);
    }
  });

  it('夜明け星図の報酬文言は世界観に沿う', () => {
    expect(nightBoardRewardLabel({ type: 'light_coin', amount: 10 })).toBe('黒曜片が少し戻った +10');
    expect(nightBoardRewardLabel({ type: 'travel_prep', amount: 1 })).toBe('旅支度がひとつ整った');
    expect(nightBoardRewardLabel({ type: 'memory_text' })).toContain('読めるようになった');
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
    expect(collectionWordRecordLines.some((line) => line.id === 'rare-jp-kanwa-kyudai')).toBe(true);
  });

  it('言葉の記録の通常表示はsafe-candidateだけに限る', () => {
    expect(collectionWordRecordLines.length).toBeGreaterThan(0);
    expect(collectionWordRecordLines.every((line) => line.commercialStatus === 'safe-candidate')).toBe(true);
    expect(collectionWordRecordLines.some((line) => line.commercialStatus === 'final-check-required')).toBe(false);
    expect(collectionWordRecordLines.some((line) => line.commercialStatus === 'do-not-display')).toBe(false);
  });

  it('厳格承認filterは表示対象をsafe-candidateから広げない', () => {
    const safe = launchCoreKnowledgeLines.find((line) => line.commercialStatus === 'safe-candidate');
    const common = launchCoreKnowledgeLines.find((line) => line.commercialStatus === 'common-expression-candidate');
    const publicDomain = launchCoreKnowledgeLines.find((line) => line.commercialStatus === 'public-domain-candidate');
    const finalCheck = launchCoreKnowledgeLines.find((line) => line.commercialStatus === 'final-check-required');
    expect(safe && isStrictlyApprovedKnowledgeLine(safe)).toBe(true);
    expect(common && isStrictlyApprovedKnowledgeLine(common)).toBe(false);
    expect(publicDomain && isStrictlyApprovedKnowledgeLine(publicDomain)).toBe(false);
    expect(finalCheck && isStrictlyApprovedKnowledgeLine(finalCheck)).toBe(false);
  });

  it('図鑑タブ背景アセットは全タブ分ある', () => {
    const SECTIONS_WITHOUT_BACKDROP = new Set(['achievements']);
    const sectionIds = new Set(collectionSections.filter((s) => !SECTIONS_WITHOUT_BACKDROP.has(s.id)).map((s) => s.id));
    const assetSectionIds = new Set(collectionAtlasSectionAssets.map((asset) => asset.sectionId));
    expect(assetSectionIds).toEqual(sectionIds);
    for (const asset of collectionAtlasSectionAssets) {
      expect(asset.backdrop.path.startsWith('assets/prototypes/collection-atlas/tabs/')).toBe(true);
    }
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
