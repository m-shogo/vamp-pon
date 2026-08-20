import {
  buildVisualProductionExecutionView,
  VISUAL_PRODUCTION_EXECUTION_POLICY_PATH as LEGACY_VISUAL_PRODUCTION_EXECUTION_POLICY_PATH,
} from './visualProductionExecutionView.ts';

export const VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH =
  'data/character-assets/manifests/visual-autonomous-production-policy.v1.json';
export const VISUAL_AUTONOMOUS_RUNNER_STATE_PATH =
  'data/character-assets/manifests/visual-autonomous-production-runner-state.v1.json';
export const VISUAL_AUTONOMOUS_LIFE_CHOICE_QUEUE_PATH =
  'data/visual/all-character-life-choice-autonomous-authoring-queue-v1.json';
export const VISUAL_AUTONOMOUS_LIFE_CHOICE_DECISION_LOG_PATH =
  'data/visual/all-character-life-choice-codex-author-decisions-v1.json';
export const VISUAL_AUTONOMOUS_PARTIAL_EVIDENCE_CLOSURE_PATH =
  'data/visual/all-character-life-choice-partial-evidence-autonomous-closure-v1.json';
export const VISUAL_AUTONOMOUS_CHARACTER_SHEET_ENTRYPOINT_PATH =
  'src/game/data/characterDesignSheetAutonomousProductionEntrypoint.ts';
export const VISUAL_AUTONOMOUS_CHARACTER_PREGEN_READINESS_PATH =
  'data/character-assets/manifests/visual-character-master-pre-generation-readiness.v1.json';
export const VISUAL_AUTONOMOUS_CORE5_QUEUE_PATH =
  'data/character-assets/manifests/core5-era-setting-board-autonomous-queue.v2.json';
export const VISUAL_AUTONOMOUS_YUI_PACKET_PATH =
  'data/character-assets/reviews/yui-character-design-master-pack-autonomous-v2.json';
export const VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH =
  'docs/visual/visual-autonomous-production-checklist-v1.md';

type ProductionItem = Record<string, any>;

function looksLikeLogo(item: ProductionItem): boolean {
  const haystack = [item.assetId, item.kind, item.outputPath, item.promptPacketId]
    .filter((value) => typeof value === 'string').join(' ').toLowerCase();
  return /(?:^|[-_/\s])logo(?:$|[-_/\s.])/.test(haystack);
}
function isImageBearing(item: ProductionItem): boolean {
  return Array.isArray(item.candidateIds) && item.candidateIds.length > 0 && typeof item.outputPath === 'string' && /\.(?:png|webp|jpg|jpeg)$/i.test(item.outputPath);
}
function annotateCurrentExecution(item: ProductionItem): ProductionItem {
  const logoExcluded = looksLikeLogo(item);
  const imageBearing = isImageBearing(item);
  return {
    ...item,
    currentAutonomousExecution: {
      authority: VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH,
      executor: 'CODEX',
      intermediateHumanReviewRequired: false,
      finalHumanReviewDeferredToProject100Percent: true,
      imageMayAuthorCanon: false,
      generatedOutputMayCloseOpenSetting: false,
      logoExcluded,
      imageBearing,
      requiresMaterializedAuthoritySnapshotBeforePrompt: imageBearing,
      requiresExplicitItemAdmissionBeforeGeneration: imageBearing,
      requiresAutomaticQaBeforePromotion: imageBearing,
      rejectedOrPartialParentingAllowed: false,
      bulkGenerationAuthorizedByThisViewAlone: false,
    },
  };
}

/** Current operational facade. Legacy V2 stays immutable audit evidence. */
export function buildVisualAutonomousProductionExecutionView() {
  const legacy = buildVisualProductionExecutionView() as any;
  const items: ProductionItem[] = legacy.items.map(annotateCurrentExecution);
  const logoRows = items.filter((item) => item.currentAutonomousExecution.logoExcluded);
  const imageBearingRows = items.filter((item) => item.currentAutonomousExecution.imageBearing);

  return {
    schemaVersion: 3,
    viewId: 'yoruno-shirube-visual-autonomous-production-execution-view-v3',
    status: 'CURRENT_AUTONOMOUS_NON_LOGO_EXECUTION_VIEW',
    currentMode: 'AUTONOMOUS_NON_LOGO_PRODUCTION',
    executionAllowed: true,
    executor: 'CODEX',
    delegatedAuthorRole: 'DELEGATED_AUTHOR',
    currentAuthority: VISUAL_AUTONOMOUS_PRODUCTION_POLICY_PATH,
    runnerState: VISUAL_AUTONOMOUS_RUNNER_STATE_PATH,
    productionChecklist: VISUAL_AUTONOMOUS_PRODUCTION_CHECKLIST_PATH,
    legacyAuditView: {
      viewId: legacy.viewId,
      policyPath: LEGACY_VISUAL_PRODUCTION_EXECUTION_POLICY_PATH,
      executionAllowed: legacy.executionAllowed,
      retainedAsAuditEvidence: true,
      mayBlockCurrentExecution: false,
    },
    humanReview: {
      intermediateRequired: false,
      finalRequired: true,
      finalGate: 'PROJECT_100_PERCENT_READY',
      finalRequestAllowedNow: false,
    },
    authoring: {
      settingsAuthoringAllowed: true,
      conflictingSettingResolutionAllowed: true,
      settingsReadyForMasterSpec: true,
      machineReadableAuthorityUpdateRequiredBeforePrompt: true,
      imageOutputMayDecideSetting: false,
      imageOutputMayCreateStoryCanon: false,
      lifeChoiceQueue: VISUAL_AUTONOMOUS_LIFE_CHOICE_QUEUE_PATH,
      lifeChoiceDecisionLog: VISUAL_AUTONOMOUS_LIFE_CHOICE_DECISION_LOG_PATH,
      partialEvidenceClosure: VISUAL_AUTONOMOUS_PARTIAL_EVIDENCE_CLOSURE_PATH,
    },
    phaseGates: {
      SETTINGS: {
        allowed: true,
        current: false,
        complete: true,
        intermediateHumanReviewRequired: false,
      },
      MASTER_SPEC: {
        allowed: true,
        current: true,
        requiresSettingsReady: true,
        characterSheetEntrypoint: VISUAL_AUTONOMOUS_CHARACTER_SHEET_ENTRYPOINT_PATH,
        preGenerationReadiness: VISUAL_AUTONOMOUS_CHARACTER_PREGEN_READINESS_PATH,
        intermediateHumanReviewRequired: false,
      },
      MASTER_IMAGE: {
        allowed: true,
        current: false,
        requiresMaterializedAuthoritySnapshot: true,
        requiresExplicitSubjectAdmission: true,
        defaultCandidateCount: 4,
        automaticQaRequired: true,
        rejectRegenerateLoopRequired: true,
        intermediateHumanReviewRequired: false,
      },
      GUIDE_DB: { allowed: true, requiresApprovedMaster: true, independentDuplicateSubjectRasterDefault: false },
      TOP_PROMO: { allowed: true, reuseFirst: true, requiresExplicitAssetAdmission: true, logoOwnedByThisRunner: false },
      GAMEPLAY: { allowed: true, bulkGenerationAllowedNow: false, requiresApprovedParentMaster: true, requiresContractNormalizationAndAdmission: true },
      RUNTIME_QA: { allowed: true, requiresMaterializedRuntimeAsset: true, failureReturnsToOwningProductionStage: true },
      FINAL_HUMAN_REVIEW: { allowedNow: false, requiredAtProject100Percent: true },
    },
    familyAdapters: {
      characterSheets: VISUAL_AUTONOMOUS_CHARACTER_SHEET_ENTRYPOINT_PATH,
      characterPreGenerationReadiness: VISUAL_AUTONOMOUS_CHARACTER_PREGEN_READINESS_PATH,
      core5: VISUAL_AUTONOMOUS_CORE5_QUEUE_PATH,
      yui: VISUAL_AUTONOMOUS_YUI_PACKET_PATH,
    },
    quality: {
      repeatUntilPass: true,
      structuralHardVetoRequired: true,
      semanticQaRequired: true,
      rejectReasonRequired: true,
      promptRevisionReasonRequired: true,
      rejectedCandidateMayParent: false,
      partialMasterMayParent: false,
      stableAssetIdsRequired: true,
      sha256ForBinaryAssetsRequired: true,
      duplicateBinaryDetectionRequired: true,
      replacementHistoryRequired: true,
    },
    logo: {
      excludedFromRunner: true,
      blocksNonLogoProduction: false,
      integrationRequiredBeforeFinal100Percent: true,
      detectedManagedLogoRows: logoRows.length,
    },
    counts: {
      ...legacy.counts,
      currentAnnotatedRows: items.length,
      currentImageBearingRows: imageBearingRows.length,
      currentLogoExcludedRows: logoRows.length,
      indexedAssetFactoryContracts: legacy.counts.indexedAssetFactoryContracts,
      assetFactoryContractsBulkGenerationAuthorizedNow: 0,
      materializedLifeChoiceDecisions: 42,
      closedPartialEvidenceItems: 56,
      characterMasterPromptSlots: 144,
    },
    items,
  };
}
