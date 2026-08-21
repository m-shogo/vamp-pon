import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from './characterReferenceProductionEntrypoint.ts';

export const AUTONOMOUS_CHARACTER_DESIGN_SHEET_ROLES = {
  '01': 'identity-turnaround',
  '02': 'face-expression-acting',
  '03': 'costume-equipment-material',
  '04': 'silhouette-motion-derivation',
} as const;

export type AutonomousCharacterDesignSheetNumber = keyof typeof AUTONOMOUS_CHARACTER_DESIGN_SHEET_ROLES;

export const CHARACTER_DESIGN_SHEET_AUTONOMOUS_PRODUCTION_ENTRYPOINT = {
  exporter: 'tools/asset-factory/scripts/export-autonomous-character-design-sheet-prompt.ts',
  parentExporter: CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter,
  parentPolicy: CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy,
  bridgePolicy: 'data/character-assets/manifests/visual-character-sheet-autonomous-production-bridge.v2.json',
  legacyAuditBridgePolicy: 'data/character-assets/manifests/visual-character-sheet-production-entrypoint-bridge.v1.json',
  settingsDecisionLog: 'data/visual/all-character-life-choice-codex-author-decisions-v1.json',
  partialEvidenceClosure: 'data/visual/all-character-life-choice-partial-evidence-autonomous-closure-v1.json',
  preGenerationReadiness: 'data/character-assets/manifests/visual-character-master-pre-generation-readiness.v1.json',
  sourceSheetCountPerCharacter: 4,
  rosterCount: 36,
  currentHeldCharacterIds: [] as string[],
  activeCharacterCount: 36,
  activeSheetPromptCount: 144,
  heldSheetPromptCount: 0,
  directLegacyPacketProductionAllowed: false,
  lowerExporterProductionAllowed: false,
  handWrittenSheetPromptProductionAllowed: false,
  generatedSheetCreatesCanon: false,
  generatedSheetCreatesCharacterMasterApproval: false,
  generatedSheetCreatesRuntimeApproval: false,
  humanReviewRequired: false,
  automaticQaRequired: true,
  finalHumanReviewDeferredToProject100Percent: true,
  promptExportAuthorized: true,
  imageGenerationExecuted: false,
  outputState: 'CANDIDATE_REVIEW_REQUIRED',
} as const;
