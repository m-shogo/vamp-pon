import { describe, expect, it } from 'vitest';
import { pairKey } from '../data/characterRelationshipDesign';
import { createDefaultProfile } from '../persistence/profile';
import type { BondProgressState } from '../systems/bondProgress';
import { buildStageSelectSubCharacterViewModel } from './stageSelectViewModel';

describe('stageSelectViewModel', () => {
  it('未選択なら未選択表示を返す', () => {
    const vm = buildStageSelectSubCharacterViewModel(createDefaultProfile(), { pairs: {} }, 'yui');
    expect(vm.selectedLine).toBe('未選択 / サブ効果なし');
    expect(vm.effectLine).toContain('同行すると好感度');
    expect(vm.options.some((option) => option.characterId === 'yui')).toBe(false);
  });

  it('選択中サブキャラの好感度とペア必殺解放状態を返す', () => {
    const progress: BondProgressState = {
      pairs: {
        [pairKey('yui', 'asa')]: {
          pairKey: pairKey('yui', 'asa'),
          points: 150,
          level: 4,
          seenTalkIds: [],
        },
      },
    };
    const vm = buildStageSelectSubCharacterViewModel({
      ...createDefaultProfile(),
      selectedSubCharacterId: 'asa',
    }, progress, 'yui');
    expect(vm.selectedLine).toContain('アサ Lv4');
    expect(vm.effectLine).toContain('合図');
    expect(vm.pairUltimateLine).toContain('解放済み');
    expect(vm.pairUltimateLine).toContain('ふたりの灯り道');
  });
});
