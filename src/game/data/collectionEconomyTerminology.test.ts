import { describe, expect, it } from 'vitest';
import {
  BLACK_YOUKA_MECHANIC_ID,
  META_UPGRADE_CURRENCY_ID,
  PROTOTYPE_LIGHT_COIN_COUNTER_ID,
  RUN_EARNED_META_CURRENCY_TRANSIENT_FIELD,
  RUN_MEMORY_FRAGMENT_ID,
  STAGE1_RUN_EARNED_META_CURRENCY_TARGET,
  collectionEconomyResourceById,
  collectionEconomyRuntimeIdOwner,
  collectionEconomyResources,
  meetsStage1RunEarnedMetaCurrencyTarget,
  readRunEarnedMetaCurrency,
  recordRunEarnedMetaCurrency,
  validateCollectionEconomyTerminology,
} from './collectionEconomyTerminology';

describe('collection economy terminology', () => {
  it('永続通貨・記憶片・ラン獲得counter・黒耀化を別conceptへ分離する', () => {
    expect(collectionEconomyResources).toHaveLength(4);
    expect(collectionEconomyResourceById.get(META_UPGRADE_CURRENCY_ID)?.concept).toContain('永続強化');
    expect(collectionEconomyResourceById.get(RUN_MEMORY_FRAGMENT_ID)?.concept).toContain('ラン中');
    expect(collectionEconomyResourceById.get(PROTOTYPE_LIGHT_COIN_COUNTER_ID)?.concept).toContain('実獲得');
    expect(collectionEconomyResourceById.get(BLACK_YOUKA_MECHANIC_ID)?.namingStatus).toBe('NOT_CURRENCY');
  });

  it('profile.currencyとlight_coinは同じ永続資源conceptへ接続する', () => {
    expect(collectionEconomyRuntimeIdOwner.get('profile.currency')).toBe(META_UPGRADE_CURRENCY_ID);
    expect(collectionEconomyRuntimeIdOwner.get('NightBoardReward.type:light_coin')).toBe(
      META_UPGRADE_CURRENCY_ID,
    );
  });

  it('記憶片を永続通貨aliasへしない', () => {
    const meta = collectionEconomyResourceById.get(META_UPGRADE_CURRENCY_ID);
    const fragments = collectionEconomyResourceById.get(RUN_MEMORY_FRAGMENT_ID);
    expect(meta?.currentDisplayLabels).toEqual(['黒曜片']);
    expect(meta?.currentDisplayLabels).not.toContain('記憶片');
    expect(fragments?.currentDisplayLabels).toEqual(['記憶片']);
    expect(fragments?.persistent).toBe(false);
    expect(fragments?.spendable).toBe(false);
  });

  it('灯貨札はwallet残高やproxy式ではなく実ラン獲得額を読む', () => {
    const counter = collectionEconomyResourceById.get(PROTOTYPE_LIGHT_COIN_COUNTER_ID);
    expect(counter?.namingStatus).toBe('CURRENT_TRACKED_COUNTER_PENDING_NAME');
    expect(counter?.runtimeIds).toContain('NightBoardCell:fs_019_collect_100_light_coin');
    expect(counter?.runtimeIds).toContain(
      `transient:RunStats.${RUN_EARNED_META_CURRENCY_TRANSIENT_FIELD}`,
    );
    expect(counter?.runtimeIds).not.toContain('profile.currency');
    expect(counter?.runtimeIds.some((id) => id.startsWith('prototype-formula:'))).toBe(false);
    expect(counter?.persistent).toBe(false);
    expect(counter?.spendable).toBe(false);
  });

  it('確定したrun currencyを整数・非負で記録し100到達だけを判定する', () => {
    const stats: Record<string, unknown> = {};
    expect(readRunEarnedMetaCurrency(stats)).toBe(0);
    expect(meetsStage1RunEarnedMetaCurrencyTarget(stats)).toBe(false);

    expect(recordRunEarnedMetaCurrency(stats, 99.9)).toBe(99);
    expect(readRunEarnedMetaCurrency(stats)).toBe(99);
    expect(meetsStage1RunEarnedMetaCurrencyTarget(stats)).toBe(false);

    expect(recordRunEarnedMetaCurrency(stats, STAGE1_RUN_EARNED_META_CURRENCY_TARGET)).toBe(100);
    expect(meetsStage1RunEarnedMetaCurrencyTarget(stats)).toBe(true);

    expect(recordRunEarnedMetaCurrency(stats, Number.NaN)).toBe(0);
    expect(recordRunEarnedMetaCurrency(stats, -50)).toBe(0);
  });

  it('黒耀化を通貨や黒曜片のaliasとして扱わない', () => {
    const blackYouka = collectionEconomyResourceById.get(BLACK_YOUKA_MECHANIC_ID);
    expect(blackYouka?.currentDisplayLabels).toEqual(['黒耀化']);
    expect(blackYouka?.namingStatus).toBe('NOT_CURRENCY');
    expect(blackYouka?.runtimeIds).toContain('RuntimeStats.berserkUses');
  });

  it('契約検証にerrorがない', () => {
    expect(validateCollectionEconomyTerminology().errors).toEqual([]);
  });
});
