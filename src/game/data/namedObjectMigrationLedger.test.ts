import { describe, expect, it } from 'vitest';
import {
  namedObjectMigrationLedger,
  validateNamedObjectMigrationLedger,
} from './namedObjectMigrationLedger';

describe('named object migration ledger', () => {
  it('legacy情報を削除しない', () => {
    expect(namedObjectMigrationLedger.length).toBeGreaterThan(0);
    expect(namedObjectMigrationLedger.every((entry) => entry.preserveLegacy)).toBe(true);
    expect(new Set(namedObjectMigrationLedger.map((entry) => entry.id)).size).toBe(
      namedObjectMigrationLedger.length,
    );
  });

  it('ナギとミチルの旧bindingをsilent overwriteせず再接続する', () => {
    const foldedMap = namedObjectMigrationLedger.find(
      (entry) => entry.id === 'lost-folded-map-corner-owner-v0',
    );
    const rustedKey = namedObjectMigrationLedger.find(
      (entry) => entry.id === 'lost-rusted-room-key-owner-v0',
    );

    expect(foldedMap?.action).toBe('REBIND_CURRENT_CONNECTION');
    expect(foldedMap?.currentStableId).toBe('named-object:michiru:rare_item');
    expect(rustedKey?.action).toBe('REBIND_CURRENT_CONNECTION');
    expect(rustedKey?.currentStableId).toBe('named-object:nagi:rare_item');
  });

  it('Shadowは表示名だけ移しstable IDを維持する', () => {
    const expected = new Map([
      ['character:kage1', 'カナメ'],
      ['character:kage2', 'カスミ'],
      ['character:kage3', 'トキ'],
      ['character:kage4', 'ツムギ'],
    ]);

    for (const [stableId, displayName] of expected) {
      const entry = namedObjectMigrationLedger.find(
        (candidate) => candidate.currentStableId === stableId,
      );
      expect(entry?.action).toBe('DISPLAY_ALIAS');
      expect(entry?.currentDisplayName).toBe(displayName);
    }
  });

  it('旧表記はaliasとして保存しCurrent表示は黒耀化にする', () => {
    const entry = namedObjectMigrationLedger.find(
      (candidate) => candidate.id === 'term-kokuyou-old-kanji-v0',
    );
    expect(entry?.legacyDisplayName).toBe('黒曜化');
    expect(entry?.currentDisplayName).toBe('黒耀化');
  });

  it('未確定mappingを推測せずwarningとして残す', () => {
    const result = validateNamedObjectMigrationLedger();
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain(
      'stage1-board-enemy-labels-v0 still requires Human/current-production review',
    );
    expect(result.warnings).toContain(
      'reward-light-coin-v0 still requires Human/current-production review',
    );
  });
});
