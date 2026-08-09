import { describe, expect, it } from 'vitest';
import { keeperRecords } from './keeperRecords';
import { lostItemRecords } from './lostItemRecords';

describe('lost item Current and legacy bindings', () => {
  it('全Current／Legacy keeper参照が既存Core5記録へ解決する', () => {
    const keeperIds = new Set(keeperRecords.map((record) => record.id));
    for (const item of lostItemRecords) {
      if (item.relatedKeeperId) {
        expect(keeperIds.has(item.relatedKeeperId), item.id).toBe(true);
      }
      for (const legacyKeeperId of item.legacyRelatedKeeperIds) {
        expect(keeperIds.has(legacyKeeperId), `${item.id}:${legacyKeeperId}`).toBe(true);
      }
    }
  });

  it('折れた地図の角はミチルへCurrent接続しナギ旧接続を残す', () => {
    const item = lostItemRecords.find((record) => record.id === 'lost-folded-map-corner');
    expect(item).toMatchObject({
      relatedKeeperId: 'keeper-michiru',
      legacyRelatedKeeperIds: ['keeper-nagi'],
      connectionStatus: 'CURRENT_WITH_LEGACY_BINDING',
    });
    expect(item?.tags).toContain('michiru');
    expect(item?.tags).toContain('legacy-nagi');
  });

  it('錆びた部屋の鍵はナギへCurrent接続しミチル旧接続を残す', () => {
    const item = lostItemRecords.find((record) => record.id === 'lost-rusted-room-key');
    expect(item).toMatchObject({
      relatedKeeperId: 'keeper-nagi',
      legacyRelatedKeeperIds: ['keeper-michiru'],
      connectionStatus: 'CURRENT_WITH_LEGACY_BINDING',
    });
    expect(item?.tags).toContain('nagi');
    expect(item?.tags).toContain('legacy-michiru');
  });

  it('灯貨はeconomy名称レビュー前に人物へ無理に固定しない', () => {
    const item = lostItemRecords.find((record) => record.id === 'lost-dull-light-coin');
    expect(item?.connectionStatus).toBe('REVIEW_REQUIRED');
    expect(item?.relatedKeeperId).toBeUndefined();
    expect(item?.tags).toContain('economy-review');
  });
});
