import { buildVisualImageProductionList } from './visualAssetGenerationInventory.ts';

export const VISUAL_PRODUCTION_EXECUTION_POLICY_PATH = 'data/character-assets/manifests/visual-production-execution-policy.v2.json';

export const LEGACY_BAKED_LOREBOOK_KINDS = [
  'lorebook-profile',
  'lorebook-era',
  'lorebook-reality-root',
  'lorebook-relationship',
  'lorebook-foreshadow',
] as const;

const legacyLorebookKinds = new Set<string>(LEGACY_BAKED_LOREBOOK_KINDS);

type ProductionItem = Record<string, any>;

function compositionOutput(assetId: string): string {
  return `data/character-assets/lorebook-compositions/${assetId}.json`;
}

function migrateLegacyLorebookRasterRow(item: ProductionItem): ProductionItem {
  if (item.layer !== 'lorebook' || !legacyLorebookKinds.has(item.kind)) return item;
  return {
    ...item,
    recordType: 'lorebook-composition-read-model',
    reviewStatus: 'not-materialized',
    promptPacketId: null,
    outputPath: compositionOutput(item.assetId),
    candidateIds: [],
    generationMode: 'MASTER_REUSE_PLUS_HTML_CSS_SVG_DATA',
    independentBinaryGenerationAllowed: false,
    approvedMasterReuseRequired: true,
    compositionMayCreateCanon: false,
    compositionMayParentGameplay: false,
    qaChecklist: [
      'master-reference-or-approved-crop-only',
      'html-css-svg-data-composition',
      'status-and-authority-visible',
      'no-baked-card-text',
      'no-independent-raster-generation',
      ...(Array.isArray(item.qaChecklist) ? item.qaChecklist : []),
    ],
    blocker: 'Approved parent Master/reference lineage is required before composition materialization. Independent Lorebook raster generation is not authorized.',
    notes: `${item.notes ?? ''} Legacy baked-card row migrated to a non-image composition/read-model; reuse approved Masters instead of generating duplicate subject art.`.trim(),
  };
}

export function buildVisualProductionExecutionView() {
  const legacy = buildVisualImageProductionList() as any;
  const legacyItems: ProductionItem[] = legacy.items;
  const items = legacyItems.map(migrateLegacyLorebookRasterRow);
  const migratedLorebookRows = items.filter((item) => item.recordType === 'lorebook-composition-read-model');
  const imageBearingItems = items.filter((item) => Array.isArray(item.candidateIds) && item.candidateIds.length > 0 && typeof item.outputPath === 'string' && /\.(?:png|webp|jpg|jpeg)$/i.test(item.outputPath));
  const logicalNonImageItems = items.filter((item) => !imageBearingItems.includes(item));
  const independentLorebookRasterRows = items.filter((item) => item.layer === 'lorebook' && legacyLorebookKinds.has(item.kind) && item.independentBinaryGenerationAllowed !== false);

  return {
    schemaVersion: 2,
    viewId: 'yoruno-shirube-visual-production-execution-view-v2',
    status: 'CURRENT_PRE_GENERATION_EXECUTION_VIEW',
    generatedFrom: 'src/game/data/visualAssetGenerationInventory.ts',
    migrationSource: 'src/game/data/visualProductionExecutionView.ts',
    legacyInputListId: legacy.listId,
    legacyInputMayAuthorizeGenerationDirectly: false,
    currentMode: 'PRE_GENERATION_NO_IMAGE_OUTPUT',
    executionAllowed: false,
    policy: {
      masterFirst: true,
      duplicateSubjectArtForbiddenByDefault: true,
      lorebookUsesApprovedMasterReuse: true,
      lorebookCompositionUsesHtmlCssSvgData: true,
      lorebookIndependentRasterDefault: false,
      guideAndLorebookMayNotParentGameplay: true,
      humanReviewRequired: true,
      imageMayNotPromoteStoryAuthority: true,
      yuiHoldPreserved: true,
    },
    counts: {
      totalManagedRows: items.length,
      imageBearingRows: imageBearingItems.length,
      logicalNonImageRows: logicalNonImageItems.length,
      migratedLegacyLorebookBakedRows: migratedLorebookRows.length,
      independentLorebookRasterRows: independentLorebookRasterRows.length,
      characterDesignMasterPacks: items.filter((item) => item.recordType === 'master-pack').length,
      characterDesignSourceSheets: items.filter((item) => item.recordType === 'source-sheet').length,
      characterDesignOverviewReadModels: items.filter((item) => item.recordType === 'overview-read-model').length,
      lorebookCompositionReadModels: migratedLorebookRows.length,
      gameplayImageRows: items.filter((item) => item.layer === 'gameplay' && Array.isArray(item.candidateIds) && item.candidateIds.length > 0).length,
      indexedAssetFactoryContracts: legacy.existingAssetGenerationContractIndex?.contractCount ?? 0,
    },
    lorebookMigration: {
      migratedKinds: [...LEGACY_BAKED_LOREBOOK_KINDS],
      migratedAssetIds: migratedLorebookRows.map((item) => item.assetId),
      outputKind: 'JSON_COMPOSITION_READ_MODEL',
      subjectArtworkSource: 'APPROVED_MASTER_REFERENCE_OR_CROP',
      newIndependentGuideBinaryDefault: 0,
    },
    omittedUntilAuthorityExists: legacy.omittedUntilAuthorityExists,
    items,
  };
}
