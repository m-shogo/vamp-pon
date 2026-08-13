export const CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT = {
  exporter: 'tools/asset-factory/scripts/export-long-wear-comfort-locked-character-design-prompt.ts',
  policy: 'data/visual/character-production-generation-entrypoint-v3.json',
  authority: 'docs/visual/character-production-generation-entrypoint-v3.md',
  requiredOutputFlags: {
    productionImageGenerationEntrypoint: true,
    productionCharacterPromptReady: true,
    productionPromptAuthorityLocked: true,
    imageGenerationReadinessState: 'READY_FOR_CANDIDATE_GENERATION',
    generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
    allCharacterGarmentDonDoffDressingWorkflowFidelityRequired: true,
    allCharacterGarmentLongWearComfortFidelityRequired: true,
  },
  lowerExporterOutputIsProductionReady: false,
  handWrittenPromptIsProductionReady: false,
  generatedImageCreatesCanon: false,
  generatedImageCreatesFeedbackRule: false,
} as const;
