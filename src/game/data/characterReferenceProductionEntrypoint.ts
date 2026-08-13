export const CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT = {
  exporter: 'tools/asset-factory/scripts/export-face-skull-landmark-locked-character-design-prompt.ts',
  policy: 'data/visual/character-production-generation-entrypoint-v1.json',
  authority: 'docs/visual/character-production-generation-entrypoint-v1.md',
  requiredOutputFlags: {
    productionImageGenerationEntrypoint: true,
    productionCharacterPromptReady: true,
    productionPromptAuthorityLocked: true,
    imageGenerationReadinessState: 'READY_FOR_CANDIDATE_GENERATION',
    generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
  },
  lowerExporterOutputIsProductionReady: false,
  handWrittenPromptIsProductionReady: false,
  generatedImageCreatesCanon: false,
  generatedImageCreatesFeedbackRule: false,
} as const;
