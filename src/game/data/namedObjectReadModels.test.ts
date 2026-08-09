import { describe, expect, it } from 'vitest';
import {
  allLightsCompletionGroupReadModels,
  allLightsRewardReadModel,
  characterObjectReadModelByCharacterId,
  characterObjectReadModels,
  lostItemConnectionCompatibilityReadModels,
  normalizeLegacyDisplayTerm,
} from './namedObjectReadModels';

describe('named object read models', () => {
  it('21人分を生成するが既存runtimeへ接続済みとは扱わない', () => {
    expect(characterObjectReadModels).toHaveLength(21);
    expect(
      characterObjectReadModels.every((model) => model.runtimeConnectionState === 'NOT_CONNECTED'),
    ).toBe(true);
    expect(characterObjectReadModelByCharacterId.get('yui')?.luminousPossession).toBe(
      '持ち主待ちのランタン',
    );
    expect(characterObjectReadModelByCharacterId.get('kage1')?.characterDisplayName).toBe('カナメ');
  });

  it('ナギとミチルの旧忘れ物bindingを互換read modelへ残す', () => {
    expect(lostItemConnectionCompatibilityReadModels).toHaveLength(2);

    const mapCorner = lostItemConnectionCompatibilityReadModels.find(
      (model) => model.lostItemId === 'lost-folded-map-corner',
    );
    const rustedKey = lostItemConnectionCompatibilityReadModels.find(
      (model) => model.lostItemId === 'lost-rusted-room-key',
    );

    expect(mapCorner).toMatchObject({
      legacyKeeperId: 'keeper-nagi',
      currentCharacterId: 'michiru',
      currentStableObjectId: 'named-object:michiru:rare_item',
      preserveLegacy: true,
    });
    expect(rustedKey).toMatchObject({
      legacyKeeperId: 'keeper-michiru',
      currentCharacterId: 'nagi',
      currentStableObjectId: 'named-object:nagi:rare_item',
      preserveLegacy: true,
    });
  });

  it('completion groupはdesign targetだけを出しruntime分母をfreezeしない', () => {
    expect(allLightsCompletionGroupReadModels).toHaveLength(6);
    expect(
      allLightsCompletionGroupReadModels.every(
        (group) => group.runtimeDenominatorState === 'NOT_FROZEN',
      ),
    ).toBe(true);
  });

  it('全灯の朝は複合報酬を持つがruntime未接続', () => {
    expect(allLightsRewardReadModel.displayName).toBe('全灯の朝');
    expect(allLightsRewardReadModel.runtimeConnectionState).toBe('NOT_CONNECTED');
    expect(allLightsRewardReadModel.rewardParts).toContain('playable-celebration');
    expect(allLightsRewardReadModel.rewardParts).toContain('constellation-remix-mode');
  });

  it('旧表記を表示時だけCurrent用語へ正規化できる', () => {
    expect(normalizeLegacyDisplayTerm('黒曜化なしで夜明けする')).toBe(
      '黒耀化なしで夜明けする',
    );
  });
});
