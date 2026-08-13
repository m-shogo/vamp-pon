import { readFileSync } from 'node:fs';

const PATH = 'data/character-assets/manifests/visual-audit-resolution-ledger.v1.json';
const ledger = JSON.parse(readFileSync(PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ledger.schemaVersion === 2, 'resolution ledger schemaVersion must be 2 after latest-main sync/migrations');
assert(ledger.status === 'ACTIVE_RESOLUTION_TRACKING_NO_AUTOMATIC_GENERATION', 'resolution ledger may not authorize generation');
assert(ledger.currentBoundary?.latestMainSyncBaseline === '4e6b49bdf02208ffd9637a2d3a8904baee8365b9', 'latest-main sync baseline drift');
assert(ledger.currentBoundary?.latestMainSyncThroughPullRequest === 329, 'latest-main sync PR boundary drift');
assert(ledger.currentBoundary?.latestMainBaselineMergedIntoBranchWithoutForce === true, 'latest-main baseline must be integrated without force rewrite');
assert(ledger.currentBoundary?.latestMainMustBeRecheckedBeforeImageGenerationOrMerge === true, 'latest main must still be rechecked before generation/merge');
assert(ledger.currentBoundary?.imageGenerationAllowed === false, 'resolution ledger may not authorize image generation');
assert(ledger.currentBoundary?.yuiHold === true, 'Yui HOLD must remain preserved');

const legacy = new Map((ledger.legacySakuyazaMigration ?? []).map((entry: any) => [entry.findingId, entry]));
for (const id of [
  'LEGACY-YATSUKAGE-IDENTITY-DOC-CURRENT',
  'LEGACY-YATSUKAGE-MACHINE-AUTHORITY-CURRENT',
  'LEGACY-YATSUKAGE-PAIR-CURRENT',
  'LEGACY-YATSUKAGE-RELATIONSHIP-CURRENT',
  'LEGACY-YATSUKAGE-PLAYER-PRESENTATION',
]) {
  const entry = legacy.get(id) as any;
  assert(entry, `resolution ledger missing legacy finding: ${id}`);
  assert(entry.state === 'RESOLVED_SYNCED', `${id}: synced resolution state drift`);
}

const fixed = new Map((ledger.fixedMasterFamilies ?? []).map((entry: any) => [entry.findingId, entry]));
for (const id of [
  'SAKUYAZA_TEAM_COMPARISON_MASTER',
  'GUNJO_FOUNDATION_MASTERS',
  'CORE5_REALITY_ERA_ENVIRONMENT_REFERENCE_MASTERS',
  'CORE5_ERA_POPULATION_HOUSEHOLD_REFERENCE_MASTERS',
  'DREAM_COMMON_DAILY_LIFE_INFRASTRUCTURE_MASTER',
  'SKY_MOON_RESOLUTION_COLOR_SCRIPT_MASTER',
  'MODERN_IAU88_CONSTELLATION_LINE_ART_VECTOR_MASTER',
]) {
  const entry = fixed.get(id) as any;
  assert(entry?.state === 'MATERIALIZED_PLANNED_NOT_AUTHORED', `${id}: must remain materialized-but-not-authored`);
}
for (const id of ['ERA_INCIDENT_VISUAL_ADMISSION_POLICY', 'SEASON_ANTAGONIST_VISUAL_ADMISSION_POLICY']) {
  const entry = fixed.get(id) as any;
  assert(entry?.state === 'POLICY_IMPLEMENTED_NOT_CONTENT_ADMITTED', `${id}: admission policy state drift`);
}
for (const id of ['DREAM_REALITY_FORM_COMPARISON_MASTERS', 'SUNNY_IF_REWARD_ENSEMBLE_MASTER_FAMILY', 'TITLE_LOGO_LOCKUP_MASTER', 'MATERIAL_REFERENCE_PLATES']) {
  const entry = fixed.get(id) as any;
  assert(entry?.state === 'OPEN_AUTHORITY_DEPENDENT', `${id}: must remain authority-dependent until explicitly resolved`);
}

const sourceDerived = new Map((ledger.sourceDerivedPreGameFamilies ?? []).map((entry: any) => [entry.familyId, entry]));
for (const [id, expected] of [
  ['CHARACTER_STATE_TRANSFORMATION_MASTERS', 20],
  ['ENEMY_CREATURE_REFERENCE_MASTERS', 48],
  ['LOCATION_ENVIRONMENT_SETTING_MASTERS', 20],
  ['TOUMON_SIGIL_AND_SYMBOL_MASTERS', 21],
] as const) {
  const entry = sourceDerived.get(id) as any;
  assert(entry?.state === 'SOURCE_DERIVED_INVENTORY_IMPLEMENTED', `${id}: source-derived state drift`);
  assert(entry.rowCount === expected, `${id}: expected ${expected} rows, got ${entry.rowCount}`);
}
const item = sourceDerived.get('ITEM_OBJECT_DESIGN_MASTERS') as any;
assert(item?.state === 'COLLISION_REVIEW_IMPLEMENTED_CONTENT_UNRESOLVED', 'Item exact-label collision review state missing');
assert(item.rawLineageCandidateRows === 105, 'Item raw lineage candidate count drift');
assert(item.exactLabelCollisionGroups === 11, 'Item exact-label collision group count drift');
assert(item.collisionRowsAuthorizedToCollapse === 0, 'Item collision rows may not be auto-collapsed');
assert(item.finalMasterCount === 'TBD_AFTER_AUTHORITY_REVIEW', 'Item final master count must remain unresolved before explicit lineage authority');

const top = ledger.reuseAndDerivativeAudits?.topLoading;
assert(top?.state === 'REUSE_AUDIT_IMPLEMENTED', 'TOP/Loading reuse audit state drift');
assert(top?.loadingCommittedSources === 4, 'Loading reuse source count drift');
assert(top?.topV3ExistingCandidate === 1, 'TOP V3 existing candidate count drift');
assert(top?.newAuthorizedReplacementRowsNow === 0, 'TOP/Loading may not gain replacement rows without explicit decision');

const guide = ledger.reuseAndDerivativeAudits?.guideDb;
assert(guide?.state === 'NON_RASTER_MIGRATION_IMPLEMENTED', 'Guide/DB non-raster migration must remain implemented');
assert(guide?.independentGuideBinariesDefault === 0, 'Guide/DB may not default to independent generated binaries');
assert(guide?.legacyBakedRowsMigrated === 142, 'Guide/DB migrated baked-row count drift');
assert(guide?.currentExecutionImageBearingRows === 266, 'current execution image-bearing count drift');
assert(guide?.currentExecutionLogicalNonImageRows === 214, 'current execution non-image count drift');
assert(guide?.legacyPlanningListDirectGenerationAuthority === false, 'legacy image list may not directly authorize generation');

const assetFactory = ledger.reuseAndDerivativeAudits?.assetFactory977;
assert(assetFactory?.state === 'REUSE_AUDIT_IMPLEMENTED', '977 output audit state drift');
assert(assetFactory?.totalContracts === 977, '977 output audit total drift');
assert(assetFactory?.existingOutputPathsObserved === 0, 'persisted audit existing count drift');
assert(assetFactory?.missingOutputPathsObserved === 977, 'persisted audit missing count drift');
assert(assetFactory?.automaticGenerationAuthorized === false, '977 missing outputs may not auto-authorize generation');
assert(assetFactory?.mustRevalidateOnCurrentHead === true, '977 snapshot must be revalidated on current head before gameplay generation');

const sheets = ledger.characterSheetExecution;
assert(sheets?.state === 'LIVE_ADAPTER_IMPLEMENTED', 'Character Sheet live adapter state missing');
assert(sheets?.parentEntrypointSource === 'src/game/data/characterReferenceProductionEntrypoint.ts', 'Character Sheet parent entrypoint source drift');
assert(sheets?.parentExporterResolution === 'LIVE_FROM_CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT', 'Character Sheet parent exporter must resolve live');
assert(sheets?.latestMainSyncBaselineThrough === 329, 'Character Sheet latest-main baseline must include PR #329');
assert(
  Array.isArray(sheets?.latestInheritedAuthorityAdditions)
    && sheets.latestInheritedAuthorityAdditions.includes('occlusion-layering-fidelity')
    && sheets.latestInheritedAuthorityAdditions.includes('crop-silhouette-readability')
    && sheets.latestInheritedAuthorityAdditions.includes('focus-depth-effects-fidelity'),
  'Character Sheet latest authority additions missing',
);
assert(sheets?.oldPromptPacketDirectGenerationAllowed === false, 'old prompt packets may not be used directly');
assert(sheets?.staticPacketReexportRequiredForProduction === false, 'static packet re-export must not be mistaken for the live production path');
assert(sheets?.activeCharacters === 35, 'active Character Sheet character count drift');
assert(sheets?.activeLiveSheetPrompts === 140, 'active live Sheet prompt count drift');
assert(Array.isArray(sheets?.heldCharacterIds) && sheets.heldCharacterIds.length === 1 && sheets.heldCharacterIds[0] === 'yui', 'Yui must remain the only explicit held character');
assert(sheets?.heldSheetSlots === 4, 'Yui held Sheet slot count drift');
assert(sheets?.imageGenerationAllowed === false, 'Character Sheet image generation must remain blocked by listing phase');

console.log(JSON.stringify({
  status: 'PASS',
  ledgerId: ledger.ledgerId,
  latestMainSyncBaseline: ledger.currentBoundary.latestMainSyncBaseline,
  latestMainSyncThroughPullRequest: ledger.currentBoundary.latestMainSyncThroughPullRequest,
  legacyFindingsResolvedSynced: legacy.size,
  fixedMasterFindingsTracked: fixed.size,
  sourceDerivedFamiliesTracked: sourceDerived.size,
  itemCollisionReview: { groups: item.exactLabelCollisionGroups, collapsesAuthorized: item.collisionRowsAuthorizedToCollapse },
  guideExecution: { imageBearing: guide.currentExecutionImageBearingRows, nonImage: guide.currentExecutionLogicalNonImageRows, migratedLorebook: guide.legacyBakedRowsMigrated },
  sheetAdapter: {
    activePrompts: sheets.activeLiveSheetPrompts,
    heldSlots: sheets.heldSheetSlots,
    parentExporterResolution: sheets.parentExporterResolution,
    latestAuthorityAdditions: sheets.latestInheritedAuthorityAdditions,
  },
  assetFactorySnapshot: { existing: assetFactory.existingOutputPathsObserved, missing: assetFactory.missingOutputPathsObserved },
  mustRecheckMainBeforeGenerationOrMerge: true,
  imageGenerationAllowed: false,
}, null, 2));
