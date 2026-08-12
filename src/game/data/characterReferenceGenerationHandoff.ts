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

function resolveLivingVisualProfilePath(characterId: string): string {
  if (CORE5_IDS.has(characterId)) return 'data/visual/core5-living-visual-profiles-v1.json';
  if (CURRENT21_EXTENDED_IDS.has(characterId)) return 'data/visual/current21-extended-living-visual-profiles-v1.json';
  return 'data/visual/future15-living-visual-profiles-v1.json';
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
  designerPhilosophyRequired: true;
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
      'docs/visual/character-living-visual-master-v1.md',
      livingVisualProfilePath,
      'docs/character-appearance-source-book-v1.md',
      'docs/character-appearance-distinction-generation-contract-v1.md',
      'docs/visual/character-designer-philosophy-master-v1.md',
      'docs/visual/world-character-scenario-design-council-master-v1.md',
      'data/visual/world-character-scenario-design-council-master-v1.json',
      'data/visual/character-designer-philosophy-master-v1.json',
      'data/visual/character-designer-ai-brain.json',
    ],
    livingVisualProfilePath,
    livingVisualProfileRequired: true,
    designerPhilosophyRequired: true,
    designCouncilRequired: true,
    unknownLifePreferenceMayBeInventedByImageModel: false,
    reviewChecklist: mode === 'generate'
      ? [
          'World Master / Living Visual Profile / Design Councilを先に読む',
          'Living Visual Profileの露出 / piercing / tattoo / clothing / absoluteNever / positivePreferenceを確認する',
          'Designer Philosophy MasterのDecision Ladderに従い、設定忠実度と本人の選択理由を美観より先に評価する',
          'Council rule: world / character / scenarioの最低2層から必要性を説明できないdetailは削除またはCandidate化する',
          'そのEra / 場所 / 日常動作で服・小物が実際に使えるか確認する',
          '未設定項目をgeneric fantasy / gacha conventionで補完しない',
          'detailを足す前にsilhouette / body-posture / clothing construction / signature object / color hierarchyを確認する',
          ...(referencePrompt?.reviewChecklist ?? []),
        ]
      : [
          '既存masterをCurrent21 silhouette matrixと比較する',
          'World Master / Living Visual Profile / Design Councilと照合する',
          '本人が選ばない装飾・露出・body modificationが混入していないか確認する',
          'Designer Philosophy Masterの「似合う」と「本人が選ぶ」の分離で既存masterを再評価する',
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
  designerPhilosophyRequired: true,
  designCouncilRequired: true,
  worldMasterRequired: true,
  unknownLifePreferenceMayBeInventedByImageModel: false,
  generatedArtStartsAs: 'candidate review required',
  noAutomaticRuntimePromotion: true,
  noAutomaticFinalApproval: true,
  rule: 'Export prompts from Current production data immediately before generation; load World Master, Living Visual Master, per-character Living Visual Profile, Character Designer Philosophy Master, and World/Character/Scenario Design Council before the prompt is used; do not hand-copy stale prompts into an external image session.',
} as const;
