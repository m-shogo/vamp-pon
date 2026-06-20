import { characters } from '../data/characters';
import type { Id } from '../domain/types';
import type { PlayerProfile } from '../persistence/profile';
import type { BondProgressState } from '../systems/bondProgress';
import { bondLevelLabel, bondSummaryForPair } from '../systems/bondSummary';
import { buildSubCharacterOptions, type SubCharacterOption } from '../systems/subCharacterOptions';

export type StageSelectSubCharacterViewModel = {
  mainCharacterId: Id;
  selectedSubCharacterId?: Id;
  selectedLine: string;
  effectLine: string;
  pairUltimateLine: string;
  options: SubCharacterOption[];
};

export function buildStageSelectSubCharacterViewModel(
  profile: PlayerProfile,
  bondProgress: BondProgressState,
  mainCharacterId: Id = characters[0].id,
): StageSelectSubCharacterViewModel {
  const summary = bondSummaryForPair(mainCharacterId, profile.selectedSubCharacterId, bondProgress);
  const options = buildSubCharacterOptions({
    mainCharacterId,
    selectedSubCharacterId: profile.selectedSubCharacterId,
  });

  const selectedLine = summary.subCharacterId
    ? `${summary.subCharacterName ?? summary.subCharacterId} ${bondLevelLabel(summary.level)} / 次 ${summary.pointsToNextLevel ?? '最大'}`
    : '未選択 / サブ効果なし';

  const effectLine = summary.subEffect
    ? `${summary.subEffect.name}: ${summary.subEffect.description}`
    : '同行すると好感度が上がり、能力とペア必殺が育つ';

  const pairUltimateLine = summary.pairUltimate
    ? `${summary.pairUltimate.ready ? '解放済み' : `Lv${summary.pairUltimate.requiredBondLevel}で解放`}: ${summary.pairUltimate.name}`
    : 'ペア必殺: 未選択';

  return {
    mainCharacterId,
    selectedSubCharacterId: summary.subCharacterId,
    selectedLine,
    effectLine,
    pairUltimateLine,
    options,
  };
}
