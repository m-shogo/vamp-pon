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
const CORE5_ERA_LIFE_MASTER_PATH = 'data/visual/core5-era-life-design-master-v1.json';

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
  designerPhilosophyRequired: true;
  designerCraftRequired: true;
  designCouncilRequired: true;
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
  const eraAuthorityPaths = eraLifeMasterPath
    ? ['docs/visual/core5-era-life-design-master-v1.md', eraLifeMasterPath]
    : [];

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
      'docs/visual/world-character-scenario-design-council-master-v1.md',
      'data/visual/world-character-scenario-design-council-master-v1.json',
      'data/visual/character-designer-ai-brain.json',
    ],
    livingVisualProfilePath,
    livingVisualProfileRequired: true,
    eraLifeMasterPath,
    eraLifeMasterRequired: eraLifeMasterPath !== null,
    designerPhilosophyRequired: true,
    designerCraftRequired: true,
    designCouncilRequired: true,
    unknownLifePreferenceMayBeInventedByImageModel: false,
    reviewChecklist: mode === 'generate'
      ? [
          'World Master / Era Life Master（該当時）/ Living Visual Profile / Designer Philosophy / Craft Master / Design Councilを先に読む',
          ...(eraLifeMasterPath
            ? ['Core5 Era差を服だけで表現せず、communication / transport / repair / food / privacy / carried object / conversational assumptionsを確認する']
            : []),
          'Living Visual Profileの露出 / piercing / tattoo / clothing / absoluteNever / positivePreferenceを確認する',
          'Designer Philosophy MasterのDecision Ladderに従い、設定忠実度と本人の選択理由を美観より先に評価する',
          'Craft Masterに従い、face / body / posture / silhouette / clothing construction / material / color / actingを別々に点検する',
          'Council rule: world / character / scenarioの最低2層から必要性を説明できないdetailは削除またはCandidate化する',
          'そのEra / 場所 / 日常動作で服・小物が実際に使えるか確認する',
          '未設定項目をgeneric fantasy / gacha conventionで補完しない',
          'detailを足す前にidentity reason / body-posture / silhouette / clothing construction / color hierarchy / material logicを診断する',
          ...(referencePrompt?.reviewChecklist ?? []),
        ]
      : [
          '既存masterをCurrent21 silhouette matrixと比較する',
          'World Master / Era Life Master（該当時）/ Living Visual Profile / Designer Philosophy / Craft Master / Design Councilと照合する',
          ...(eraLifeMasterPath
            ? ['Core5の年代差が衣装記号だけになっていないか、生活物・収納・修繕・所作まで再評価する']
            : []),
          '本人が選ばない装飾・露出・body modificationが混入していないか確認する',
          'Designer Philosophy Masterの「似合う」と「本人が選ぶ」の分離で既存masterを再評価する',
          'Craft Masterのblack-fill silhouette / neutral posture / clothing feasibility / material logicを確認する',
          'world / character / scenarioの二層以上から理由を説明できないdetailをauthority扱いしない',
          'body / age / posture / clothing mass / Named Object placementを確認する',
          '問題がなければ再生成せずreference registration候補へ進める',
          'reference approvalをruntime/final approvalと混同しない',
        ],
    downstreamRule: entry.downstreamRule,
    approvalStateAfterGeneration: 'CANDIDATE_REVIEW_REQUIRED',
  };
}

export const characterReferenceGenerationHandoff: CharacterReferenceGenerationHandoffItem[] =
  characterReferenceProductionQueue.map(buildHandoffItem);

export const p0CharacterReferenceGenerationHandoff = characterReferenceGenerationHandoff.filter(
  (entry) => entry.priority === 'P0',
);

export const p1CharacterReferenceHandoff = characterReferenceGenerationHandoff.filter(
  (entry) => entry.priority === 'P1',
);

export const p2CharacterReferenceGenerationHandoff = characterReferenceGenerationHandoff.filter(
  (entry) => entry.priority === 'P2',
);

export const CHARACTER_REFERENCE_HANDOFF_POLICY = {
  defaultPriority: 'P0',
  expectedP0Ids: ['hana', 'kage1'],
  referenceFirst: true,
  livingVisualMasterRequired: true,
  core5EraLifeMasterRequired: true,
  designerPhilosophyRequired: true,
  designerCraftRequired: true,
  designCouncilRequired: true,
  worldMasterRequired: true,
  unknownLifePreferenceMayBeInventedByImageModel: false,
  generatedArtStartsAs: 'candidate review required',
  noAutomaticRuntimePromotion: true,
  noAutomaticFinalApproval: true,
  rule: 'Export prompts from Current production data immediately before generation; load World Master, Core5 Era Life Master when applicable, Living Visual Master, per-character Living Visual Profile, Character Designer Philosophy Master, Character Designer Craft Master, and World/Character/Scenario Design Council before the prompt is used; do not hand-copy stale prompts into an external image session.',
} as const;
