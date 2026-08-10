import { stageProductionEntries } from './stageProductionDatabase.ts';
import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import {
  stageCombatProfiles,
  type CombatAttribute,
  type StatusKind,
} from './combatAffinitySource.ts';
import {
  baseWeaponCandidates,
  currentBaseWeaponProfiles,
} from './weaponExpansionSource.ts';
import { series1StageCampaignSeedsA } from './series1StageCampaignSeedsA.ts';
import { series1StageCampaignSeedsB } from './series1StageCampaignSeedsB.ts';

export type StageContentUnlockKind =
  | 'SYSTEM_LESSON'
  | 'BASE_WEAPON_CANDIDATE'
  | 'FUSION_RECIPE_CANDIDATE'
  | 'NIGHT_RECORD_SECTION';

export type StageCampaignSeed = {
  stageId: string;
  stageIdentity: string;
  storyBeat: string;
  starBeastMeaning: string;
  waveRule: string;
  pairingPressure: string;
  recommendedCharacterIds: readonly string[];
  favoriteCharacterAlternative: string;
  fusionOpportunityIds: readonly string[];
  reactionOpportunityIds: readonly string[];
  itemCounterIds: readonly string[];
  stageGimmick: string;
  encounterPlan: string;
  vfxEnvironment: string;
  clearGetter: string;
  nightRecordEntry: string;
  unlock: {
    kind: StageContentUnlockKind;
    targetId: string;
    label: string;
  };
  transition: string;
  foreshadowing: string;
};

export type Series1StageCampaignContentEntry = {
  stageId: string;
  stageNo: number;
  stageName: string;
  phase: string;
  centerCharacterIds: readonly string[];
  coreQuestion: string;
  stageIdentity: string;
  storyBeat: string;
  starBeastMeaning: string;
  combat: {
    favoredAttributes: readonly CombatAttribute[];
    suppressedAttribute: CombatAttribute;
    hazardStatus: StatusKind;
    buildQuestion: string;
    enemyIds: readonly string[];
    bossOrEliteEnemyIds: readonly string[];
    waveRule: string;
    pairingPressure: string;
    recommendedCharacterIds: readonly string[];
    favoriteCharacterAlternative: string;
    recommendedBaseWeaponIds: readonly string[];
    fusionOpportunityIds: readonly string[];
    reactionOpportunityIds: readonly string[];
    itemCounterIds: readonly string[];
    stageGimmick: string;
    encounterPlan: string;
  };
  vfxEnvironment: string;
  progression: {
    clearGetter: string;
    nightRecordEntry: string;
    unlock: StageCampaignSeed['unlock'];
    transition: string;
    seriesForeshadowing: string;
  };
  authority: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

const stageProductionById = new Map(stageProductionEntries.map((stage) => [stage.id, stage]));
const stageCombatById = new Map(stageCombatProfiles.map((stage) => [stage.stageId, stage]));
const enemyById = new Map(enemyProductionEntries.map((enemy) => [enemy.id, enemy]));

export const series1StageCampaignSeeds: readonly StageCampaignSeed[] = [
  ...series1StageCampaignSeedsA,
  ...series1StageCampaignSeedsB,
];

export const series1StageCampaignContentEntries: readonly Series1StageCampaignContentEntry[] =
  series1StageCampaignSeeds.map((seed) => {
    const production = stageProductionById.get(seed.stageId);
    const combatProfile = stageCombatById.get(seed.stageId);
    if (!production) throw new Error(`missing stage production source for ${seed.stageId}`);
    if (!combatProfile) throw new Error(`missing stage combat source for ${seed.stageId}`);

    const enemyIds = unique([
      ...production.enemyAffinity,
      ...enemyProductionEntries
        .filter((enemy) => enemy.stageAffinity.includes(seed.stageId))
        .map((enemy) => enemy.id),
    ]);

    const bossOrEliteEnemyIds = enemyIds.filter((enemyId) => {
      const enemy = enemyById.get(enemyId);
      return enemy && enemy.rank !== 'small';
    });

    const directCandidateWeaponIds = baseWeaponCandidates
      .filter((weapon) => weapon.stageAffinityIds.includes(seed.stageId))
      .map((weapon) => weapon.id);
    const compatibleCandidateWeaponIds = baseWeaponCandidates
      .filter((weapon) => weapon.attributes.some((attribute) => combatProfile.favored.includes(attribute)))
      .map((weapon) => weapon.id);
    const compatibleRuntimeBaseWeaponIds = currentBaseWeaponProfiles
      .filter((weapon) => weapon.attributes.some((attribute) => combatProfile.favored.includes(attribute)))
      .map((weapon) => weapon.weaponId);
    const recommendedBaseWeaponIds = unique([
      ...directCandidateWeaponIds,
      ...compatibleRuntimeBaseWeaponIds,
      ...compatibleCandidateWeaponIds,
    ]).slice(0, 6);

    return {
      stageId: seed.stageId,
      stageNo: production.no,
      stageName: production.name,
      phase: production.phase,
      centerCharacterIds: production.leadCharacterIds,
      coreQuestion: production.coreQuestion,
      stageIdentity: seed.stageIdentity,
      storyBeat: seed.storyBeat,
      starBeastMeaning: seed.starBeastMeaning,
      combat: {
        favoredAttributes: combatProfile.favored,
        suppressedAttribute: combatProfile.suppressed,
        hazardStatus: combatProfile.hazardStatus,
        buildQuestion: combatProfile.buildQuestion,
        enemyIds,
        bossOrEliteEnemyIds,
        waveRule: seed.waveRule,
        pairingPressure: seed.pairingPressure,
        recommendedCharacterIds: seed.recommendedCharacterIds,
        favoriteCharacterAlternative: seed.favoriteCharacterAlternative,
        recommendedBaseWeaponIds,
        fusionOpportunityIds: seed.fusionOpportunityIds,
        reactionOpportunityIds: seed.reactionOpportunityIds,
        itemCounterIds: seed.itemCounterIds,
        stageGimmick: seed.stageGimmick,
        encounterPlan: seed.encounterPlan,
      },
      vfxEnvironment: seed.vfxEnvironment,
      progression: {
        clearGetter: seed.clearGetter,
        nightRecordEntry: seed.nightRecordEntry,
        unlock: seed.unlock,
        transition: seed.transition,
        seriesForeshadowing: seed.foreshadowing,
      },
      authority: 'CONTENT_SOURCE_ONLY',
      runtimeAutoPromotionAllowed: false,
    };
  });

export const series1StageCampaignContentSummary = {
  stageCount: series1StageCampaignContentEntries.length,
  stageIds: series1StageCampaignContentEntries.map((stage) => stage.stageId),
  stagesWithCharacterAlternative: series1StageCampaignContentEntries.filter(
    (stage) => stage.combat.favoriteCharacterAlternative.length > 0,
  ).length,
  stagesWithFusionOpportunity: series1StageCampaignContentEntries.filter(
    (stage) => stage.combat.fusionOpportunityIds.length > 0,
  ).length,
  stagesWithItemCounter: series1StageCampaignContentEntries.filter(
    (stage) => stage.combat.itemCounterIds.length > 0,
  ).length,
  stagesWithNightRecordReward: series1StageCampaignContentEntries.filter(
    (stage) => stage.progression.nightRecordEntry.length > 0,
  ).length,
  stagesWithForeshadowing: series1StageCampaignContentEntries.filter(
    (stage) => stage.progression.seriesForeshadowing.length > 0,
  ).length,
  currentEnemyRosterCount: enemyProductionEntries.length,
  runtimeAutoPromotionAllowed: false,
  futureCastPromotionAllowed: false,
} as const;
