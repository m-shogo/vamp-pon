import { characterAssetPromptPackById } from './assetFactoryCharacterPrompts.ts';
import {
  characterReferenceProductionQueue,
  type CharacterReferenceQueueEntry,
} from './characterReferenceProductionQueue.ts';

export type CharacterReferenceHandoffMode = 'generate' | 'review_existing' | 'revalidate';

const CORE5_IDS = new Set(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
const CURRENT21_EXTENDED_IDS = new Set([
  'sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren',
]);
const PROFESSIONAL_MASTER_DOC = 'docs/visual/master-authoring-professional-standard-v1.md';
const PROFESSIONAL_MASTER_DATA = 'data/visual/master-authoring-professional-standard-v1.json';
const VISUAL_DESIGN_MASTER_DOC = 'docs/visual/visual-design-production-master-v1.md';
const VISUAL_DESIGN_MASTER_DATA = 'data/visual/visual-design-production-master-v1.json';
const CORE5_ERA_LIFE_MASTER_PATH = 'data/visual/core5-era-life-design-master-v1.json';
const RELATIONSHIP_EMBODIMENT_DOC = 'docs/visual/relationship-embodied-daily-life-contract-v1.md';
const RELATIONSHIP_EMBODIMENT_DATA = 'data/visual/relationship-embodied-daily-life-contract-v1.json';

function resolveLivingVisualProfilePath(characterId: string): string {
  if (CORE5_IDS.has(characterId)) return 'data/visual/core5-living-visual-profiles-v1.json';
  if (CURRENT21_EXTENDED_IDS.has(characterId)) return 'data/visual/current21-extended-living-visual-profiles-v1.json';
  return 'data/visual/future15-living-visual-profiles-v1.json';
}

function resolveEraLifeMasterPath(characterId: string): string | null {
  return CORE5_IDS.has(characterId) ? CORE5_ERA_LIFE_MASTER_PATH : null;
}

export type CharacterReferenceGenerationHandoffItem = {
  characterId: string;
  displayName: string;
  priority: CharacterReferenceQueueEntry['priority'];
  mode: CharacterReferenceHandoffMode;
  reason: string;
  existingMasterPath: string | null;
  outputPath: string;
  sizeSpec: string | null;
  prompt: string | null;
  negativePrompt: string | null;
  visualAuthorityPaths: string[];
  livingVisualProfilePath: string;
  livingVisualProfileRequired: true;
  eraLifeMasterPath: string | null;
  eraLifeMasterRequired: boolean;
  professionalMasterRequired: true;
  visualDesignProductionMasterRequired: true;
  designerPhilosophyRequired: true;
  designerCraftRequired: true;
  designerPrecedentRequired: true;
  designCouncilRequired: true;
  relationshipEmbodimentRequired: true;
  unknownLifePreferenceMayBeInventedByImageModel: false;
  reviewChecklist: string[];
  downstreamRule: string;
  approvalStateAfterGeneration: 'CANDIDATE_REVIEW_REQUIRED';
};

function buildHandoffItem(entry: CharacterReferenceQueueEntry): CharacterReferenceGenerationHandoffItem {
  const pack = characterAssetPromptPackById.get(entry.characterId);
  const referencePrompt = pack?.prompts.find((prompt) => prompt.kind === 'character_reference');
  if (entry.action === 'generate_reference_then_review' && !referencePrompt) {
    throw new Error(`Missing Asset Factory character_reference prompt: ${entry.characterId}`);
  }
  const mode: CharacterReferenceHandoffMode = entry.action === 'generate_reference_then_review'
    ? 'generate'
    : entry.action === 'review_existing_master_then_register_or_regenerate'
      ? 'review_existing'
      : 'revalidate';
  const livingVisualProfilePath = resolveLivingVisualProfilePath(entry.characterId);
  const eraLifeMasterPath = resolveEraLifeMasterPath(entry.characterId);
  const eraAuthorityPaths = eraLifeMasterPath ? ['docs/visual/core5-era-life-design-master-v1.md', eraLifeMasterPath] : [];

  return {
    characterId: entry.characterId,
    displayName: entry.displayName,
    priority: entry.priority,
    mode,
    reason: entry.reason,
    existingMasterPath: entry.existingMasterPath,
    outputPath: referencePrompt?.outputPathHint ?? entry.expectedReferenceOutput,
    sizeSpec: referencePrompt?.sizeSpec ?? null,
    prompt: mode === 'generate' ? referencePrompt?.prompt ?? null : null,
    negativePrompt: mode === 'generate' ? referencePrompt?.negativePrompt ?? null : null,
    visualAuthorityPaths: [
      PROFESSIONAL_MASTER_DOC,
      PROFESSIONAL_MASTER_DATA,
      VISUAL_DESIGN_MASTER_DOC,
      VISUAL_DESIGN_MASTER_DATA,
      'docs/00-current-story-world-master.md',
      ...eraAuthorityPaths,
      'docs/visual/character-living-visual-master-v1.md',
      livingVisualProfilePath,
      'docs/character-appearance-source-book-v1.md',
      'docs/character-appearance-distinction-generation-contract-v1.md',
      'docs/visual/character-designer-philosophy-master-v1.md',
      'data/visual/character-designer-philosophy-master-v1.json',
      'docs/visual/character-designer-craft-master-v1.md',
      'data/visual/character-designer-craft-master-v1.json',
      'docs/visual/character-designer-precedent-master-v1.md',
      'data/visual/character-designer-precedent-master-v1.json',
      'docs/visual/world-character-scenario-design-council-master-v1.md',
      'data/visual/world-character-scenario-design-council-master-v1.json',
      RELATIONSHIP_EMBODIMENT_DOC,
      RELATIONSHIP_EMBODIMENT_DATA,
      'data/visual/character-designer-ai-brain.json',
    ],
    livingVisualProfilePath,
    livingVisualProfileRequired: true,
    eraLifeMasterPath,
    eraLifeMasterRequired: eraLifeMasterPath !== null,
    professionalMasterRequired: true,
    visualDesignProductionMasterRequired: true,
    designerPhilosophyRequired: true,
    designerCraftRequired: true,
    designerPrecedentRequired: true,
    designCouncilRequired: true,
    relationshipEmbodimentRequired: true,
    unknownLifePreferenceMayBeInventedByImageModel: false,
    reviewChecklist: mode === 'generate'
      ? [
          'Visual Design Production Masterを画像生成の中心Authorityとして読み、identity→body→posture→face→hair→silhouette→clothing→material→color→prop→era→rendering→detailの順序を崩さない',
          'Professional Master Standardを読み、USER_DECIDED / EXISTING_CANON / RESEARCH_BACKED_CURRENT / AUTHOR_CANDIDATE / OPENを混同しない',
          'OPENをimage-model freedomとして扱わず、重要visual項目が未解決ならproduction Character Master生成を止める',
          'Living Visual Profileの露出 / piercing / tattoo / clothing / absoluteNever / positivePreferenceを確認する',
          'face / body / posture / silhouette / clothing construction / material hierarchy / color hierarchy / prop relationを装飾より先に点検する',
          'Core5はEra差をcostume filterだけで表現せず、素材・留め具・収納・靴・修繕・持ち物・groomingへ反映する',
          'World motifを星形アクセ・紙片・墨柄として貼らず、seam / fold / fastening / panel / material agingへ翻訳する',
          'generic gacha filler（金縁・宝石・ベルト・floating cloth・cutout・発光飾り等）で弱いidentityを補わない',
          'Rendering変更でface anatomy / body ratio / exposure / clothing construction / body modificationを変えない',
          'chibi / pixelへ圧縮してもhair mass / body proportion / posture / strongest clothing mass / prop locationが残る設計にする',
          '生成画像に偶然出たdetailをCanonへ逆輸入しない',
          ...(referencePrompt?.reviewChecklist ?? []),
        ]
      : [
          'Visual Design Production MasterのFinal Design QAで既存masterを再評価する',
          'face close-up / neutral posture / black-fill silhouetteの3段階で本人性を確認する',
          'bodyが服の下に存在し、衣装が着脱・着座・移動できる構造か確認する',
          '露出 / piercing / tattoo / body modificationがLiving Visual Profileに忠実か確認する',
          '素材・色・小物・Era視覚差がgeneric genre shorthandではなく本人の生活に接続しているか確認する',
          'high-res detailがidentityを埋めていないか確認する',
          'third-party resemblanceがface / silhouette / costume / accessory / renderingの複数主要層へ集中していないか確認する',
          'generated image由来のdetailをsource-backed Canonと誤認しない',
          '問題がなければ再生成せずreference registration候補へ進める',
        ],
    downstreamRule: entry.downstreamRule,
    approvalStateAfterGeneration: 'CANDIDATE_REVIEW_REQUIRED',
  };
}

export const characterReferenceGenerationHandoff: CharacterReferenceGenerationHandoffItem[] = characterReferenceProductionQueue.map(buildHandoffItem);
export const p0CharacterReferenceGenerationHandoff = characterReferenceGenerationHandoff.filter((entry) => entry.priority === 'P0');
export const p1CharacterReferenceHandoff = characterReferenceGenerationHandoff.filter((entry) => entry.priority === 'P1');
export const p2CharacterReferenceGenerationHandoff = characterReferenceGenerationHandoff.filter((entry) => entry.priority === 'P2');

export const CHARACTER_REFERENCE_HANDOFF_POLICY = {
  defaultPriority: 'P0',
  expectedP0Ids: ['hana', 'kage1'],
  referenceFirst: true,
  professionalMasterRequired: true,
  visualDesignProductionMasterRequired: true,
  livingVisualMasterRequired: true,
  core5EraLifeMasterRequired: true,
  designerPhilosophyRequired: true,
  designerCraftRequired: true,
  designerPrecedentRequired: true,
  designCouncilRequired: true,
  relationshipEmbodimentRequired: true,
  worldMasterRequired: true,
  openMeansImageModelFreedom: false,
  generatedImageCreatesCanon: false,
  unknownLifePreferenceMayBeInventedByImageModel: false,
  generatedArtStartsAs: 'candidate review required',
  noAutomaticRuntimePromotion: true,
  noAutomaticFinalApproval: true,
  rule: 'For character image work, load Professional Governance then Visual Design Production Master as the primary production lens; resolve Living Visual, Appearance, Era and world visual grammar before rendering. Missing visual decisions are never filled by generic genre defaults or by the image model.',
} as const;
