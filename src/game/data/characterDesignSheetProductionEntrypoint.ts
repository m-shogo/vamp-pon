import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from './characterReferenceProductionEntrypoint.ts';

export const CHARACTER_DESIGN_SHEET_ROLES = {
  '01': 'identity-turnaround',
  '02': 'face-expression-acting',
  '03': 'costume-equipment-material',
  '04': 'silhouette-motion-derivation',
} as const;

export type CharacterDesignSheetNumber = keyof typeof CHARACTER_DESIGN_SHEET_ROLES;

export const CHARACTER_DESIGN_SHEET_PRODUCTION_ENTRYPOINT = {
  exporter: 'tools/asset-factory/scripts/export-character-design-sheet-prompt.ts',
  parentExporter: CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter,
  parentPolicy: CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy,
  bridgePolicy: 'data/character-assets/manifests/visual-character-sheet-production-entrypoint-bridge.v1.json',
  sourceSheetCountPerCharacter: 4,
  rosterCount: 36,
  currentHeldCharacterIds: ['yui'],
  activeCharacterCount: 35,
  activeSheetPromptCount: 140,
  heldSheetPromptCount: 4,
  directLegacyPacketProductionAllowed: false,
  lowerExporterProductionAllowed: false,
  handWrittenSheetPromptProductionAllowed: false,
  generatedSheetCreatesCanon: false,
  generatedSheetCreatesCharacterMasterApproval: false,
  generatedSheetCreatesRuntimeApproval: false,
  humanReviewRequired: true,
  outputState: 'CANDIDATE_REVIEW_REQUIRED',
} as const;
