import { ACHIEVEMENT_DEFS, type AchievementCategory } from './achievements.ts';
import {
  FORGOTTEN_STREET_BOARD_ID,
  forgottenStreetNightBoardCells,
  type NightBoardCellKind,
  type NightBoardReward,
} from './collectionProgress.ts';
import { allLightsCompletionDesign } from './namedObjectRegistry.ts';
import { stageRecipes } from './waves.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type ProgressionSpoilerTier = 'PUBLIC_SAFE' | 'GUIDE_SPOILER' | 'DEEP_SPOILER';
export type VisualAuthorityLevel = 'SOURCE_DERIVED' | 'CANDIDATE_VISUAL_GRAMMAR';
export type SharedIdOrigin = 'SOURCE_ID' | 'DERIVED_STABLE_ADAPTER_ID';

export type ClearGetterVisualRule = {
  kind: NightBoardCellKind;
  iconShapeRule: string;
  stampRule: string;
  completedRule: string;
  claimedRule: string;
  smallScaleReadability: string;
  avoid: readonly string[];
};

export type ClearGetterSharedSourceEntry = {
  id: string;
  idOrigin: 'SOURCE_ID';
  displayName: string;
  category: NightBoardCellKind;
  boardId: string;
  conditionSummary: string;
  progressType: 'BOOLEAN_COMPLETION';
  progressTarget: 1;
  hiddenUntilUnlocked: boolean;
  spoilerTier: ProgressionSpoilerTier;
  rewardId: string;
  iconShapeRule: string;
  stampRule: string;
  visualAuthority: 'CANDIDATE_VISUAL_GRAMMAR';
  nightRecordSection: 'PENDING_NIGHT_RECORD_SECTION_AUTHORITY';
  characterRelationIds: readonly string[];
  stageRelationIds: readonly string[];
  weaponRelationIds: readonly string[];
  relationStatus: 'SOURCE_TEXT_ONLY_PENDING_STABLE_ID_LINKS';
  goodsPotential: readonly string[];
  generationBriefSeed: string;
  referenceGenerationReady: false;
  runtimeReady: true;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
  authoritySource: 'src/game/data/collectionProgress.ts';
};

export type AchievementSharedSourceEntry = {
  id: string;
  idOrigin: 'SOURCE_ID';
  displayName: string;
  category: AchievementCategory;
  conditionSummary: string;
  progressType: 'BOOLEAN_UNLOCK';
  progressTarget: 1;
  hiddenUntilUnlocked: boolean;
  spoilerTier: ProgressionSpoilerTier;
  rewardId: string;
  iconShapeRule: string;
  stampRule: string;
  visualAuthority: 'CANDIDATE_VISUAL_GRAMMAR';
  nightRecordSection: 'PENDING_NIGHT_RECORD_SECTION_AUTHORITY';
  characterRelationIds: readonly string[];
  stageRelationIds: readonly string[];
  weaponRelationIds: readonly string[];
  relationStatus: 'RUNTIME_STAGE_NUMBER_TO_PRODUCTION_STAGE_ID_UNRESOLVED';
  goodsPotential: readonly string[];
  generationBriefSeed: string;
  referenceGenerationReady: false;
  runtimeReady: true;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
  authoritySource: 'src/game/data/achievements.ts';
};

export type RewardSharedType =
  | 'LIGHT_COIN'
  | 'TRAVEL_PREP'
  | 'MEMORY_TEXT'
  | 'COSMETIC'
  | 'SOUND'
  | 'RUNTIME_META_CURRENCY'
  | 'ALL_LIGHTS_DESIGN_REWARD';

export type RewardSharedSourceEntry = {
  id: string;
  idOrigin: SharedIdOrigin;
  displayName: string;
  rewardType: RewardSharedType;
  sourceType: 'CLEAR_GETTER_CELL' | 'ACHIEVEMENT' | 'ALL_LIGHTS_DESIGN';
  sourceId: string;
  unlockCondition: string;
  amount?: number;
  payloadId?: string;
  isGameplay: boolean;
  isCosmetic: boolean;
  isLore: boolean;
  isCollection: boolean;
  previewSafe: boolean;
  spoilerTier: ProgressionSpoilerTier;
  characterRelationIds: readonly string[];
  starBeastRelationIds: readonly string[];
  namedObjectRelationIds: readonly string[];
  stageRelationIds: readonly string[];
  relationStatus: 'SOURCE_EXPLICIT_ONLY';
  iconRule: string;
  presentationRule: string;
  goodsPotential: readonly string[];
  generationBriefSeed: string;
  referenceGenerationReady: false;
  runtimeReady: boolean;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
  authoritySources: readonly string[];
};

export type UnlockableSharedSourceEntry = {
  id: string;
  idOrigin: 'DERIVED_STABLE_ADAPTER_ID';
  displayName: string;
  rewardType: 'RUNTIME_STAGE_SLOT';
  source: 'RUNTIME_STAGE_RECIPE';
  unlockCondition: string;
  runtimeStageNumber: number;
  runtimeStageRecipeId: string;
  isGameplay: true;
  isCosmetic: false;
  isLore: false;
  isCollection: false;
  previewSafe: false;
  spoilerTier: 'GUIDE_SPOILER';
  productionStageRelation: 'UNRESOLVED_LEGACY_RUNTIME_SLOT';
  iconRule: string;
  presentationRule: string;
  goodsPotential: readonly [];
  generationBriefSeed: string;
  referenceGenerationReady: false;
  runtimeReady: true;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
  authoritySources: readonly ['src/game/data/waves.ts', 'src/game/persistence/profile.ts'];
};

const COMMON_MARK_AVOID = [
  'Toumon itself or a near-copy of any Character Toumon',
  'real railway logo, railway company mark, exact station stamp imitation',
  'zodiac glyph, heraldic shield, crown, wings',
  'neon cyan/purple badge language',
  'glossy game-achievement medal rendering',
  'baked text, letters, numbers, logo, watermark',
] as const;

export const CLEAR_GETTER_VISUAL_RULES: Record<NightBoardCellKind, ClearGetterVisualRule> = {
  natural: {
    kind: 'natural',
    iconShapeRule: 'CANDIDATE: one open paper-dot/ring with a single route-like notch; simplest board mark and no Character-specific motif',
    stampRule: 'CANDIDATE: one-color dry-ink archive mark based on the open ring; distinct from Toumon and from real railway stamps',
    completedRule: 'close the open gap with a thin hand-drawn stroke; do not add gold rarity decoration',
    claimedRule: 'one tiny offset punch/ink dot outside the ring indicates claimed state',
    smallScaleReadability: 'open ring + one notch remains distinct at 16px',
    avoid: COMMON_MARK_AVOID,
  },
  targeted: {
    kind: 'targeted',
    iconShapeRule: 'CANDIDATE: narrow diamond/paper-fold mark with one clipped corner; readable as deliberate challenge without medal language',
    stampRule: 'CANDIDATE: one-color clipped-diamond archive mark, never a Toumon derivative',
    completedRule: 'add one inner short rule parallel to the clipped edge',
    claimedRule: 'one tiny offset punch/ink dot beside the lower point',
    smallScaleReadability: 'diamond + clipped corner remains distinct at 16px',
    avoid: COMMON_MARK_AVOID,
  },
  mastery: {
    kind: 'mastery',
    iconShapeRule: 'CANDIDATE: two nested incomplete paper arcs with deliberately uneven endpoints; complexity comes from layering, not a trophy',
    stampRule: 'CANDIDATE: one-color double-arc archive mark; no crown, laurel, star medal or Toumon reuse',
    completedRule: 'join only the inner arc; outer arc remains intentionally incomplete',
    claimedRule: 'small offset punch/ink dot sits between the two arcs',
    smallScaleReadability: 'double-arc silhouette must still separate at 24px; at 16px fall back to one thick broken arc',
    avoid: COMMON_MARK_AVOID,
  },
  secret: {
    kind: 'secret',
    iconShapeRule: 'CANDIDATE: closed paper tab/seal with one hidden fold line; unrevealed state must not expose condition meaning',
    stampRule: 'CANDIDATE: textless folded-seal archive mark; no question-mark glyph baked into generated art',
    completedRule: 'open one fold edge while preserving the same outer silhouette',
    claimedRule: 'one tiny offset punch/ink dot appears only after the fold opens',
    smallScaleReadability: 'closed tab silhouette remains distinct at 16px without relying on a ? symbol',
    avoid: [...COMMON_MARK_AVOID, 'literal question mark as the canonical icon shape'],
  },
};

function clearGetterRewardId(cellId: string): string {
  return `clear-getter-reward:${cellId}`;
}

function achievementRewardId(achievementId: string): string {
  return `achievement-reward:${achievementId}`;
}

function clearGetterSpoilerTier(kind: NightBoardCellKind): ProgressionSpoilerTier {
  return kind === 'secret' ? 'DEEP_SPOILER' : kind === 'mastery' ? 'GUIDE_SPOILER' : 'PUBLIC_SAFE';
}

function achievementSpoilerTier(category: AchievementCategory, hidden?: boolean): ProgressionSpoilerTier {
  if (hidden) return 'DEEP_SPOILER';
  return category === 'challenge' || category === 'stage' ? 'GUIDE_SPOILER' : 'PUBLIC_SAFE';
}

export const clearGetterSharedSourceEntries: readonly ClearGetterSharedSourceEntry[] = forgottenStreetNightBoardCells.map((cell) => {
  const visual = CLEAR_GETTER_VISUAL_RULES[cell.kind];
  return {
    id: cell.id,
    idOrigin: 'SOURCE_ID',
    displayName: cell.title,
    category: cell.kind,
    boardId: cell.boardId,
    conditionSummary: cell.condition,
    progressType: 'BOOLEAN_COMPLETION',
    progressTarget: 1,
    hiddenUntilUnlocked: cell.kind === 'secret',
    spoilerTier: clearGetterSpoilerTier(cell.kind),
    rewardId: clearGetterRewardId(cell.id),
    iconShapeRule: visual.iconShapeRule,
    stampRule: visual.stampRule,
    visualAuthority: 'CANDIDATE_VISUAL_GRAMMAR',
    nightRecordSection: 'PENDING_NIGHT_RECORD_SECTION_AUTHORITY',
    characterRelationIds: [],
    stageRelationIds: [],
    weaponRelationIds: [],
    relationStatus: 'SOURCE_TEXT_ONLY_PENDING_STABLE_ID_LINKS',
    goodsPotential: ['archive/stamp sheet motif after visual approval'],
    generationBriefSeed: [
      `${cell.title} (${cell.id}) — Clear Getter ${cell.kind}.`,
      `Condition: ${cell.condition}`,
      `Shape candidate: ${visual.iconShapeRule}`,
      `Stamp candidate: ${visual.stampRule}`,
      `Small scale: ${visual.smallScaleReadability}`,
      `This is candidate visual grammar only. Do not imitate Toumon or a real railway stamp.`,
    ].join('\n'),
    referenceGenerationReady: false,
    runtimeReady: true,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
    authoritySource: 'src/game/data/collectionProgress.ts',
  };
});

export const achievementSharedSourceEntries: readonly AchievementSharedSourceEntry[] = ACHIEVEMENT_DEFS.map((achievement) => {
  const visual = achievement.category === 'challenge'
    ? CLEAR_GETTER_VISUAL_RULES.targeted
    : achievement.category === 'combat'
      ? CLEAR_GETTER_VISUAL_RULES.mastery
      : CLEAR_GETTER_VISUAL_RULES.natural;

  return {
    id: achievement.id,
    idOrigin: 'SOURCE_ID',
    displayName: achievement.title,
    category: achievement.category,
    conditionSummary: achievement.description,
    progressType: 'BOOLEAN_UNLOCK',
    progressTarget: 1,
    hiddenUntilUnlocked: Boolean(achievement.hidden),
    spoilerTier: achievementSpoilerTier(achievement.category, achievement.hidden),
    rewardId: achievementRewardId(achievement.id),
    iconShapeRule: visual.iconShapeRule,
    stampRule: visual.stampRule,
    visualAuthority: 'CANDIDATE_VISUAL_GRAMMAR',
    nightRecordSection: 'PENDING_NIGHT_RECORD_SECTION_AUTHORITY',
    characterRelationIds: [],
    stageRelationIds: [],
    weaponRelationIds: [],
    relationStatus: 'RUNTIME_STAGE_NUMBER_TO_PRODUCTION_STAGE_ID_UNRESOLVED',
    goodsPotential: ['achievement/stamp page motif after visual approval'],
    generationBriefSeed: [
      `${achievement.title} (${achievement.id}) — Achievement/${achievement.category}.`,
      `Condition: ${achievement.description}`,
      `Runtime reward amount: ${achievement.reward}`,
      `Shape candidate: ${visual.iconShapeRule}`,
      `Do not infer a production Stage ID from legacy runtime stage numbers. Do not reuse Toumon.`,
    ].join('\n'),
    referenceGenerationReady: false,
    runtimeReady: true,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
    authoritySource: 'src/game/data/achievements.ts',
  };
});

function rewardTypeForNightBoard(reward: NightBoardReward): RewardSharedType {
  if (reward.type === 'light_coin') return 'LIGHT_COIN';
  if (reward.type === 'travel_prep') return 'TRAVEL_PREP';
  if (reward.type === 'memory_text') return 'MEMORY_TEXT';
  if (reward.type === 'cosmetic') return 'COSMETIC';
  return 'SOUND';
}

function rewardDisplayName(reward: NightBoardReward): string {
  if (reward.type === 'light_coin') return `灯貨 ${reward.amount ?? 0}`;
  if (reward.type === 'travel_prep') return `旅支度 ${reward.amount ?? 0}`;
  if (reward.type === 'memory_text') return '記憶文';
  if (reward.type === 'cosmetic') return '装い';
  return '音の記録';
}

const clearGetterRewardEntries: RewardSharedSourceEntry[] = forgottenStreetNightBoardCells.map((cell) => {
  const reward = cell.reward;
  const rewardType = rewardTypeForNightBoard(reward);
  return {
    id: clearGetterRewardId(cell.id),
    idOrigin: 'DERIVED_STABLE_ADAPTER_ID',
    displayName: rewardDisplayName(reward),
    rewardType,
    sourceType: 'CLEAR_GETTER_CELL',
    sourceId: cell.id,
    unlockCondition: cell.condition,
    amount: reward.amount,
    payloadId: reward.memoryTextId,
    isGameplay: reward.type === 'light_coin' || reward.type === 'travel_prep',
    isCosmetic: reward.type === 'cosmetic',
    isLore: reward.type === 'memory_text',
    isCollection: reward.type === 'memory_text' || reward.type === 'sound',
    previewSafe: cell.kind !== 'secret' && reward.type !== 'memory_text',
    spoilerTier: clearGetterSpoilerTier(cell.kind),
    characterRelationIds: [],
    starBeastRelationIds: [],
    namedObjectRelationIds: [],
    stageRelationIds: [],
    relationStatus: 'SOURCE_EXPLICIT_ONLY',
    iconRule: 'use the reward resource/object silhouette, not the Clear Getter cell mark; no rarity frame or Toumon badge',
    presentationRule: 'reward appears as a small paper/archive reveal adjacent to the completed cell; keep condition mark and reward icon visually distinct',
    goodsPotential: [],
    generationBriefSeed: `${rewardDisplayName(reward)} from ${cell.id}. Keep reward icon distinct from Clear Getter mark; no generic treasure chest, gem, orb or medal.`,
    referenceGenerationReady: false,
    runtimeReady: true,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
    authoritySources: ['src/game/data/collectionProgress.ts'],
  };
});

const achievementRewardEntries: RewardSharedSourceEntry[] = ACHIEVEMENT_DEFS.map((achievement) => ({
  id: achievementRewardId(achievement.id),
  idOrigin: 'DERIVED_STABLE_ADAPTER_ID',
  displayName: `実績報酬 ${achievement.reward}`,
  rewardType: 'RUNTIME_META_CURRENCY',
  sourceType: 'ACHIEVEMENT',
  sourceId: achievement.id,
  unlockCondition: achievement.description,
  amount: achievement.reward,
  isGameplay: true,
  isCosmetic: false,
  isLore: false,
  isCollection: false,
  previewSafe: !achievement.hidden,
  spoilerTier: achievementSpoilerTier(achievement.category, achievement.hidden),
  characterRelationIds: [],
  starBeastRelationIds: [],
  namedObjectRelationIds: [],
  stageRelationIds: [],
  relationStatus: 'SOURCE_EXPLICIT_ONLY',
  iconRule: 'use the existing meta-currency identity/read model; never invent a separate achievement coin, gem or medal currency',
  presentationRule: 'show achievement title first and the numeric runtime meta-currency reward second; prevent duplicate-reward implication',
  goodsPotential: [],
  generationBriefSeed: `Runtime meta-currency reward ${achievement.reward} for achievement ${achievement.id}. Reuse existing meta-currency identity; do not invent a new currency icon.`,
  referenceGenerationReady: false,
  runtimeReady: true,
  artworkReady: false,
  artworkState: 'NOT_GENERATED',
  authoritySources: ['src/game/data/achievements.ts', 'src/game/persistence/profile.ts'],
}));

const allLightsRewardEntry: RewardSharedSourceEntry = {
  id: allLightsCompletionDesign.rewardId,
  idOrigin: 'SOURCE_ID',
  displayName: allLightsCompletionDesign.rewardDisplayName,
  rewardType: 'ALL_LIGHTS_DESIGN_REWARD',
  sourceType: 'ALL_LIGHTS_DESIGN',
  sourceId: allLightsCompletionDesign.version,
  unlockCondition: 'All design completion groups complete after a future denominator is explicitly frozen; currently fail-closed.',
  isGameplay: false,
  isCosmetic: false,
  isLore: false,
  isCollection: true,
  previewSafe: false,
  spoilerTier: 'DEEP_SPOILER',
  characterRelationIds: [],
  starBeastRelationIds: [],
  namedObjectRelationIds: [],
  stageRelationIds: [],
  relationStatus: 'SOURCE_EXPLICIT_ONLY',
  iconRule: 'HOLD: do not generate a final reward icon before the 100% denominator and reward presentation are frozen',
  presentationRule: 'HOLD: design reward exists, runtime denominator is not frozen; never present it as True End or a purchase-gated requirement',
  goodsPotential: [],
  generationBriefSeed: `${allLightsCompletionDesign.rewardDisplayName} (${allLightsCompletionDesign.rewardId}) is design-adopted but runtimeFrozen=false. Do not generate final reward art or imply True End.`,
  referenceGenerationReady: false,
  runtimeReady: false,
  artworkReady: false,
  artworkState: 'NOT_GENERATED',
  authoritySources: [
    'src/game/data/namedObjectRegistry.ts',
    'src/game/data/allLightsCompletion.ts',
    'docs/design-targets/generated/named-object-clear-getter-coverage-v1.json',
  ],
};

export const rewardSharedSourceEntries: readonly RewardSharedSourceEntry[] = [
  ...clearGetterRewardEntries,
  ...achievementRewardEntries,
  allLightsRewardEntry,
];

export const unlockableSharedSourceEntries: readonly UnlockableSharedSourceEntry[] = stageRecipes
  .filter((recipe) => recipe.stageNumber > 1)
  .map((recipe) => ({
    id: `unlock:runtime-stage:${recipe.stageNumber}`,
    idOrigin: 'DERIVED_STABLE_ADAPTER_ID',
    displayName: recipe.name,
    rewardType: 'RUNTIME_STAGE_SLOT',
    source: 'RUNTIME_STAGE_RECIPE',
    unlockCondition: `Clear any depth in runtime Stage ${recipe.stageNumber - 1}; profile settlement unlocks the next existing stage recipe.`,
    runtimeStageNumber: recipe.stageNumber,
    runtimeStageRecipeId: recipe.id,
    isGameplay: true,
    isCosmetic: false,
    isLore: false,
    isCollection: false,
    previewSafe: false,
    spoilerTier: 'GUIDE_SPOILER',
    productionStageRelation: 'UNRESOLVED_LEGACY_RUNTIME_SLOT',
    iconRule: 'use runtime stage-slot/route-node presentation only; do not attach a production Stage Shared Source image until IDs are reconciled',
    presentationRule: 'reveal the runtime stage slot after previous-stage clear; keep legacy runtime name separate from production Stage canon',
    goodsPotential: [],
    generationBriefSeed: `Runtime stage unlock ${recipe.stageNumber}: ${recipe.name} (${recipe.id}). Production Stage relation unresolved; do not generate canonical Stage key art from this legacy runtime slot.`,
    referenceGenerationReady: false,
    runtimeReady: true,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
    authoritySources: ['src/game/data/waves.ts', 'src/game/persistence/profile.ts'],
  }));

export const progressionRewardSharedSourceSummary = {
  clearGetterBoardId: FORGOTTEN_STREET_BOARD_ID,
  clearGetterCells: clearGetterSharedSourceEntries.length,
  achievements: achievementSharedSourceEntries.length,
  rewards: rewardSharedSourceEntries.length,
  runtimeStageUnlocks: unlockableSharedSourceEntries.length,
  allLightsRuntimeFrozen: allLightsCompletionDesign.runtimeFrozen,
  candidateVisualGrammarApproved: false,
  referenceGenerationReady: false,
  artworkReady: false,
} as const;
