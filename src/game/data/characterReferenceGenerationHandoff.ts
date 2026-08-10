import { characterAssetPromptPackById } from './assetFactoryCharacterPrompts.ts';
import {
  characterReferenceProductionQueue,
  type CharacterReferenceQueueEntry,
} from './characterReferenceProductionQueue.ts';

export type CharacterReferenceHandoffMode = 'generate' | 'review_existing' | 'revalidate';

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
    reviewChecklist: mode === 'generate'
      ? referencePrompt?.reviewChecklist ?? []
      : [
          '既存masterをCurrent21 silhouette matrixと比較する',
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
  generatedArtStartsAs: 'candidate review required',
  noAutomaticRuntimePromotion: true,
  noAutomaticFinalApproval: true,
  rule: 'Export prompts from Current production data immediately before generation; do not hand-copy stale prompts into an external image session.',
} as const;
