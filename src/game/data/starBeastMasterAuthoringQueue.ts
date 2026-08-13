import { starBeastVisualSharedSourceEntries } from './starBeastVisualSharedSource.ts';

export const STAR_BEAST_MASTER_AUTHORING_QUEUE_VERSION = 1 as const;
export const STAR_BEAST_MASTER_YUI_HOLD_CHARACTER_ID = 'yui' as const;

export type StarBeastMasterAuthoringState =
  | 'HOLD_WITH_YUI'
  | 'SOURCE_BACKED_PACKET_READY_HUMAN_PROMPT_REVIEW_REQUIRED';

export type StarBeastMasterAuthoringPacket = {
  assetId: string;
  sourceEntryId: string;
  characterId: string;
  characterDisplayName: string;
  constellationKey: string;
  species: string;
  scope: string;
  themeHex: string;
  subjectHold: boolean;
  authoringState: StarBeastMasterAuthoringState;
  referenceGenerationReadyAtSource: true;
  imageGenerationAuthorized: false;
  generatedOutputCreatesCanon: false;
  generatedOutputCreatesMasterApproval: false;
  generatedOutputCreatesRuntimeApproval: false;
  humanPromptReviewRequired: true;
  humanVisualReviewRequired: true;
  authoritySources: readonly string[];
  prompt: {
    purpose: string;
    identity: readonly string[];
    construction: readonly string[];
    poses: readonly string[];
    materialAndMerch: readonly string[];
    colorAndMarking: readonly string[];
    recognition: readonly string[];
    negative: readonly string[];
    sourceBriefSeed: string;
  };
  reviewChecklist: readonly string[];
};

function masterAssetId(characterId: string): string {
  return `star-beast-${characterId}-master-v1`;
}

export const starBeastMasterAuthoringQueue: readonly StarBeastMasterAuthoringPacket[] =
  starBeastVisualSharedSourceEntries.map((entry) => {
    const subjectHold = entry.characterId === STAR_BEAST_MASTER_YUI_HOLD_CHARACTER_ID;
    return {
      assetId: masterAssetId(entry.characterId),
      sourceEntryId: entry.id,
      characterId: entry.characterId,
      characterDisplayName: entry.characterDisplayName,
      constellationKey: entry.constellationKey,
      species: entry.species,
      scope: entry.scope,
      themeHex: entry.themeHex,
      subjectHold,
      authoringState: subjectHold
        ? 'HOLD_WITH_YUI'
        : 'SOURCE_BACKED_PACKET_READY_HUMAN_PROMPT_REVIEW_REQUIRED',
      referenceGenerationReadyAtSource: entry.referenceGenerationReady,
      imageGenerationAuthorized: false,
      generatedOutputCreatesCanon: false,
      generatedOutputCreatesMasterApproval: false,
      generatedOutputCreatesRuntimeApproval: false,
      humanPromptReviewRequired: true,
      humanVisualReviewRequired: true,
      authoritySources: [
        'src/game/data/starBeastVisualSharedSource.ts',
        ...entry.authoritySources,
      ],
      prompt: {
        purpose:
          'Author a clean commercial-production Star Beast Master reference candidate. Preserve species morphology and project identity; do not turn the beast into a miniature human character, zodiac mascot, generic cute animal, or final/runtime asset.',
        identity: [
          `Owner linkage: ${entry.characterDisplayName} (${entry.characterId}); linkage is reference context, not permission to copy the Character as an animal costume.`,
          `Constellation key: ${entry.constellationKey}; species: ${entry.species}. Do not invent constellation history or literal zodiac branding.`,
          `Size relation: ${entry.sizeRelation}.`,
          `Duplicate-constellation difference: ${entry.duplicateConstellationDifference}`,
        ],
        construction: [
          `Front silhouette: ${entry.frontSilhouette}`,
          `Side silhouette: ${entry.sideSilhouette}`,
          `Face rule: ${entry.faceRule}`,
          `Extremity mark rule: ${entry.pawFinWingMark}`,
        ],
        poses: [
          `Sit/settled pose: ${entry.sitPose}`,
          `Rest pose: ${entry.restPose}`,
          `Sleep pose: ${entry.sleepPose}`,
          `Pose priority: ${entry.posePriority.join(' / ')}`,
        ],
        materialAndMerch: [
          `Material feel: ${entry.materialFeel}`,
          `One-color rule: ${entry.oneColorRule}`,
          `Plush sewing rule: ${entry.plushSewingRule}`,
        ],
        colorAndMarking: [
          `Theme color reference: ${entry.themeHex}. Color supports recognition but may not replace species silhouette.`,
          `Palette family: ${entry.paletteFamilyKey ?? 'none fixed'}. Shared-color reason: ${entry.sharedColorReason ?? 'none fixed'}.`,
          `Toumon tag position: ${entry.toumonTagPosition}. Toumon geometry itself may not be invented or used as a body marking before its vector authority permits it.`,
        ],
        recognition: [
          `Commercial recognition hook: ${entry.commercialRecognitionHook}`,
          'The design must remain recognizable in front view, side view, one-color silhouette, small icon treatment, and plush translation without changing species/body proportions.',
        ],
        negative: [...entry.avoid, ...entry.negativePromptHints],
        sourceBriefSeed: entry.generationBriefSeed,
      },
      reviewChecklist: [
        'species/body-family silhouette survives front and side views',
        'face remains animal/species-specific and does not inherit a generic human/anime face',
        'owner linkage does not become human clothing/job costume/body imitation',
        'constellation identity does not become zodiac glyph/body branding or invented historical fact',
        'Toumon geometry is not invented or promoted from an unapproved/generated marking',
        'theme color supports rather than replaces silhouette identity',
        'sit/rest/sleep poses remain the same body construction',
        'one-color recognition remains viable without gradients or text',
        'plush sewing translation preserves identity without unsafe/thin loose parts or mascotification',
        'no baked text, logo, letters, numbers or watermark',
        'candidate output does not create Story Canon, Master approval, final approval or runtime approval',
        subjectHold
          ? 'Yui-linked subject remains HOLD and may not proceed to generation while Yui HOLD is active'
          : 'Human prompt review is required before any image-execution admission',
      ],
    } satisfies StarBeastMasterAuthoringPacket;
  });

export const activeStarBeastMasterAuthoringQueue = starBeastMasterAuthoringQueue.filter(
  (entry) => !entry.subjectHold,
);

export const heldStarBeastMasterAuthoringQueue = starBeastMasterAuthoringQueue.filter(
  (entry) => entry.subjectHold,
);
