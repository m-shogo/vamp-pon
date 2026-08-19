import { namedObjectVisualSharedSourceEntries } from './namedObjectVisualSharedSource.ts';

export const NAMED_OBJECT_GEOMETRY_REVIEW_QUEUE_VERSION = 1 as const;
export const NAMED_OBJECT_YUI_HOLD_OWNER_ID = 'yui' as const;

export type NamedObjectGeometryReviewState =
  | 'HOLD_WITH_YUI'
  | 'CANDIDATE_GEOMETRY_REVIEW_READY_HUMAN_DECISION_REQUIRED'
  | 'CANDIDATE_GEOMETRY_REVIEW_READY_NAME_WORKING_HUMAN_DECISION_REQUIRED';

export type NamedObjectGeometryReviewPacket = {
  assetId: string;
  sourceEntryId: string;
  sourceNamedObjectId: string;
  ownerId: string;
  ownerDisplayName: string;
  displayName: string;
  namingStatus: string;
  subjectHold: boolean;
  reviewState: NamedObjectGeometryReviewState;
  geometryAuthorityAtSource: 'CANDIDATE_OBJECT_GEOMETRY';
  referenceGenerationReadyAtSource: false;
  referenceGenerationReadyAfterThisPacket: false;
  imageGenerationAuthorized: false;
  generatedOutputCreatesCanon: false;
  generatedOutputCreatesGeometryApproval: false;
  generatedOutputCreatesFinalOrRuntimeApproval: false;
  humanGeometryReviewRequired: true;
  nameApprovalRequiredBeforeReferenceGenerationReady: boolean;
  authoritySources: readonly string[];
  geometry: {
    frontSilhouette: string;
    backSilhouette: string;
    sideSilhouette: string;
    scale: string;
  };
  materialHistory: {
    material: string;
    wearMarks: string;
    repairMarks: string;
    historyMarkRule: string;
  };
  useAndStorage: {
    handlingGesture: string;
    storageMethod: string;
  };
  storyAndCommercialBoundary: {
    storyAuthorityLevel: string;
    spoilerBoundary: string;
    replicaSafeDetail: string;
    entryGoodsAllowed: boolean;
    collectorGoodsAllowed: boolean;
    functionalReplicaAllowed: false;
    premiumReplicaAllowed: false;
    commercialEntryForm: string;
    commercialCollectorForm: string;
    premiumReplicaCandidate: string;
  };
  authoringSeed: {
    generationBriefSeed: string;
    avoid: readonly string[];
    negativePromptHints: readonly string[];
  };
  reviewChecklist: readonly string[];
};

function masterAssetId(ownerId: string): string {
  return `artifact-${ownerId}-named-object-master-v1`;
}

export const namedObjectMasterGeometryReviewQueue: readonly NamedObjectGeometryReviewPacket[] =
  namedObjectVisualSharedSourceEntries.map((entry) => {
    const subjectHold = entry.ownerId === NAMED_OBJECT_YUI_HOLD_OWNER_ID;
    const nameWorking = entry.namingStatus === 'WORKING';
    return {
      assetId: masterAssetId(entry.ownerId),
      sourceEntryId: entry.id,
      sourceNamedObjectId: entry.sourceNamedObjectId,
      ownerId: entry.ownerId,
      ownerDisplayName: entry.ownerDisplayName,
      displayName: entry.displayName,
      namingStatus: entry.namingStatus,
      subjectHold,
      reviewState: subjectHold
        ? 'HOLD_WITH_YUI'
        : nameWorking
          ? 'CANDIDATE_GEOMETRY_REVIEW_READY_NAME_WORKING_HUMAN_DECISION_REQUIRED'
          : 'CANDIDATE_GEOMETRY_REVIEW_READY_HUMAN_DECISION_REQUIRED',
      geometryAuthorityAtSource: entry.geometryAuthority,
      referenceGenerationReadyAtSource: entry.referenceGenerationReady,
      referenceGenerationReadyAfterThisPacket: false,
      imageGenerationAuthorized: false,
      generatedOutputCreatesCanon: false,
      generatedOutputCreatesGeometryApproval: false,
      generatedOutputCreatesFinalOrRuntimeApproval: false,
      humanGeometryReviewRequired: true,
      nameApprovalRequiredBeforeReferenceGenerationReady: nameWorking,
      authoritySources: [
        'src/game/data/namedObjectVisualSharedSource.ts',
        ...entry.authoritySources,
      ],
      geometry: {
        frontSilhouette: entry.frontSilhouette,
        backSilhouette: entry.backSilhouette,
        sideSilhouette: entry.sideSilhouette,
        scale: entry.scale,
      },
      materialHistory: {
        material: entry.material,
        wearMarks: entry.wearMarks,
        repairMarks: entry.repairMarks,
        historyMarkRule: entry.historyMarkRule,
      },
      useAndStorage: {
        handlingGesture: entry.handlingGesture,
        storageMethod: entry.storageMethod,
      },
      storyAndCommercialBoundary: {
        storyAuthorityLevel: entry.storyAuthorityLevel,
        spoilerBoundary: entry.spoilerBoundary,
        replicaSafeDetail: entry.replicaSafeDetail,
        entryGoodsAllowed: entry.entryGoodsAllowed,
        collectorGoodsAllowed: entry.collectorGoodsAllowed,
        functionalReplicaAllowed: entry.functionalReplicaAllowed,
        premiumReplicaAllowed: entry.premiumReplicaAllowed,
        commercialEntryForm: entry.commercialEntryForm,
        commercialCollectorForm: entry.commercialCollectorForm,
        premiumReplicaCandidate: entry.premiumReplicaCandidate,
      },
      authoringSeed: {
        generationBriefSeed: entry.generationBriefSeed,
        avoid: entry.avoid,
        negativePromptHints: entry.negativePromptHints,
      },
      reviewChecklist: [
        'front/back/side describe one physically coherent object rather than three decorative variants',
        'scale remains usable by the owner and does not inflate for rarity, drama or game readability',
        'material class remains consistent across all views',
        'wear marks follow repeated handling/storage rather than random grunge',
        'repair marks remain visible where source requires them and are not erased for premium polish',
        'handling gesture is physically possible with the proposed geometry',
        'storage method is physically compatible with scale, protrusions, handle/loop/clip and material',
        'history is communicated only through authorized wear/repair/state, never invented engraving or readable backstory text',
        'Toumon, zodiac glyph, rune, logo, owner name, route number or other marking is not invented without separate authority',
        'commercial simplification may not redesign the physical object or erase identity-bearing repair/history marks',
        'candidate geometry review does not create Story Canon, referenceGenerationReady, Master approval, final approval or runtime approval',
        subjectHold
          ? 'Yui-linked Named Object remains HOLD and may not be promoted while Yui HOLD is active'
          : nameWorking
            ? 'Object naming remains WORKING; Human geometry review may proceed, but referenceGenerationReady cannot be promoted until naming/identity authority is resolved'
            : 'Human geometry review must explicitly PASS/REVISE/HOLD before any referenceGenerationReady promotion',
      ],
    } satisfies NamedObjectGeometryReviewPacket;
  });

export const activeNamedObjectGeometryReviewQueue = namedObjectMasterGeometryReviewQueue.filter(
  (entry) => !entry.subjectHold,
);

export const heldNamedObjectGeometryReviewQueue = namedObjectMasterGeometryReviewQueue.filter(
  (entry) => entry.subjectHold,
);

export const workingNameNamedObjectGeometryReviewQueue = namedObjectMasterGeometryReviewQueue.filter(
  (entry) => entry.namingStatus === 'WORKING',
);
