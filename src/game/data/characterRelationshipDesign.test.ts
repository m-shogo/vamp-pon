import { describe, expect, it } from 'vitest';
import { characterById } from './characters';
import {
  bondLevelRewards,
  genericAffinityRules,
  importantPairBlueprints,
  isImportantPair,
  pairKey,
  pairUltimateTemplates,
  plannedCharacterSeeds,
  subCharacterEffectTemplates,
} from './characterRelationshipDesign';

function expectUnique(values: string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe('characterRelationshipDesign', () => {
  it('実装済みキャラseedは characters データに存在する', () => {
    for (const seed of plannedCharacterSeeds.filter((item) => item.implemented)) {
      expect(characterById.has(seed.id)).toBe(true);
    }
  });

  it('計画キャラID・サブ効果ID・相性ID・ペア必殺IDが重複しない', () => {
    expectUnique(plannedCharacterSeeds.map((seed) => seed.id));
    expectUnique(subCharacterEffectTemplates.map((effect) => effect.id));
    expectUnique(genericAffinityRules.map((rule) => rule.id));
    expectUnique(pairUltimateTemplates.map((ultimate) => ultimate.id));
  });

  it('全キャラのサブ効果IDは定義済みテンプレートに存在する', () => {
    const effectIds = new Set(subCharacterEffectTemplates.map((effect) => effect.id));
    for (const seed of plannedCharacterSeeds) {
      expect(effectIds.has(seed.defaultSubEffectId)).toBe(true);
    }
  });

  it('好感度Lv1..5の解放が揃っている', () => {
    expect(bondLevelRewards.map((reward) => reward.level)).toEqual([1, 2, 3, 4, 5]);
  });

  it('重要ペアは重複せず、対応するペア必殺が存在する', () => {
    expectUnique(importantPairBlueprints.map((pair) => pairKey(pair.pair[0], pair.pair[1])));
    const ultimateIds = new Set(pairUltimateTemplates.map((ultimate) => ultimate.id));
    for (const pair of importantPairBlueprints) {
      expect(ultimateIds.has(pair.uniqueUltimateId)).toBe(true);
    }
  });

  it('重要ペア判定は左右順に依存しない', () => {
    expect(isImportantPair('yui', 'asa')).toBe(true);
    expect(isImportantPair('asa', 'yui')).toBe(true);
    expect(isImportantPair('yui', 'michiru')).toBe(false);
  });
});
