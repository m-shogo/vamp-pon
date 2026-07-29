import { describe, expect, it } from 'vitest';
import {
  META_UPGRADE_CURRENCY_ID,
  collectionEconomyResourceById,
} from './collectionEconomyTerminology';
import { lostItemRecords } from './lostItemRecords';

describe('lost item economy connection', () => {
  it('くすんだ灯貨を実counter札と永続通貨candidateへ接続する', () => {
    const item = lostItemRecords.find((record) => record.id === 'lost-dull-light-coin');
    expect(item?.relatedBoardCellId).toBe('fs_019_collect_100_light_coin');
    expect(item?.relatedEconomyConceptId).toBe(META_UPGRADE_CURRENCY_ID);
    expect(item?.economyConnectionStatus).toBe(
      'HIGH_VALUE_CANDIDATE_RELATED_NOT_CANONICAL',
    );
  });

  it('関係を張ってもCurrent通貨名や持ち主を自動確定しない', () => {
    const item = lostItemRecords.find((record) => record.id === 'lost-dull-light-coin');
    const economy = collectionEconomyResourceById.get(META_UPGRADE_CURRENCY_ID);

    expect(item?.connectionStatus).toBe('REVIEW_REQUIRED');
    expect(item?.relatedKeeperId).toBeUndefined();
    expect(economy?.currentDisplayLabels).toEqual(['黒曜片']);
    expect(economy?.currentDisplayLabels).not.toContain('灯貨');
    expect(economy?.namingStatus).toBe('CURRENT_DISPLAY_PENDING_REVIEW');
  });
});
