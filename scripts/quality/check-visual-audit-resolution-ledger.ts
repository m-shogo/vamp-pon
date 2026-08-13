import { readFileSync } from 'node:fs';

const LEDGER_PATH = 'data/character-assets/manifests/visual-audit-resolution-ledger.v1.json';
const BRIDGE_PATH = 'data/character-assets/manifests/visual-character-sheet-production-entrypoint-bridge.v1.json';
const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
const bridge = JSON.parse(readFileSync(BRIDGE_PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ledger.schemaVersion === 2, 'resolution ledger schemaVersion must be 2 after latest-main sync/migrations');
assert(ledger.status === 'ACTIVE_RESOLUTION_TRACKING_NO_AUTOMATIC_GENERATION', 'resolution ledger may not authorize generation');
assert(bridge.status === 'ACTIVE_LATEST_MAIN_SHEET_ADAPTER_NO_IMAGE_GENERATION', 'Sheet bridge must remain active and non-generating');
assert(typeof bridge.observedLatestMain?.sha === 'string' && /^[0-9a-f]{40}$/.test(bridge.observedLatestMain.sha), 'Sheet bridge latest-main SHA must be a full Git SHA');
assert(Number.isInteger(bridge.observedLatestMain?.throughPullRequest) && bridge.observedLatestMain.throughPullRequest > 0, 'Sheet bridge latest-main PR boundary missing');
assert(bridge.observedLatestMain?.syncedIntoInventoryBranch === true, 'Sheet bridge latest-main baseline must be synced into branch');
assert(bridge.observedLatestMain?.mustRecheckImmediatelyBeforeAnyImageGenerationOrMerge === true, 'Sheet bridge must require latest-main recheck before generation/merge');

assert(ledger.currentBoundary?.latestMainSyncBaseline === bridge.observedLatestMain.sha, 'ledger/Sheet bridge latest-main SHA mismatch');
assert(ledger.currentBoundary?.latestMainSyncThroughPullRequest === bridge.observedLatestMain.throughPullRequest, 'ledger/Sheet bridge latest-main PR boundary mismatch');
assert(ledger.currentBoundary?.latestMainBaselineMergedIntoBranchWithoutForce === true, 'latest-main baseline must be integrated without force rewrite');
assert(ledger.currentBoundary?.latestMainMustBeRecheckedBeforeImageGenerationOrMerge === true, 'latest main must still be rechecked before generation/merge');
assert(ledger.currentBoundary?.imageGenerationAllowed === false, 'resolution ledger may not authorize image generation');
assert(ledger.currentBoundary?.yuiHold === true, 'Yui HOLD must remain preserved');
for (const state of [
  'STRUCTURED_MASTER_SPEC_IMPLEMENTED_HUMAN_REVIEW_REQUIRED',
  'SOURCE_GROUNDED_AUTHORING_BRIEF_IMPLEMENTED_VISUAL_BOARD_PENDING',
  'STRUCTURED_SETTING_BOARD_SPECS_AUTHORED_HUMAN_REVIEW_PENDING',
  'VECTOR_SYSTEM_SPEC_IMPLEMENTED_GEOMETRY_PENDING',
]) {
  assert(typeof ledger.stateDefinitions?.[state] === 'string', `resolution state definition missing: ${state}`);
}

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
const sakuyaza = fixed.get('SAKUYAZA_TEAM_COMPARISON_MASTER') as any;
assert(sakuyaza?.state === 'MATERIALIZED_PLANNED_NOT_AUTHORED', 'Sakuyaza team comparison must remain planned until individual Masters are approved');

for (const id of [
  'GUNJO_FOUNDATION_MASTERS',
  'DREAM_COMMON_DAILY_LIFE_INFRASTRUCTURE_MASTER',
  'SKY_MOON_RESOLUTION_COLOR_SCRIPT_MASTER',
]) {
  const entry = fixed.get(id) as any;
  assert(entry?.state === 'STRUCTURED_MASTER_SPEC_IMPLEMENTED_HUMAN_REVIEW_REQUIRED', `${id}: structured Master spec authoring state missing`);
  assert(entry?.imageGenerationAuthorized === false, `${id}: structured Master may not authorize image generation`);
  assert(Array.isArray(entry?.files) && entry.files.length >= 1, `${id}: structured Master file evidence missing`);
}

for (const id of ['CORE5_REALITY_ERA_ENVIRONMENT_REFERENCE_MASTERS', 'CORE5_ERA_POPULATION_HOUSEHOLD_REFERENCE_MASTERS']) {
  const entry = fixed.get(id) as any;
  assert(entry?.state === 'STRUCTURED_SETTING_BOARD_SPECS_AUTHORED_HUMAN_REVIEW_PENDING', `${id}: authored setting-board spec state missing`);
  assert(entry?.rowCount === 5, `${id}: board count must remain 5`);
  assert(entry?.editableBoardSpecsAuthored === 5, `${id}: all five editable board specs must be authored`);
  assert(entry?.humanApproved === 0, `${id}: Human approval must remain zero until review`);
  assert(entry?.rasterAuthority === 0, `${id}: raster authority must remain zero`);
  assert(entry?.imageGenerationAuthorized === false, `${id}: authored specs may not authorize image generation`);
  assert(typeof entry?.authoringBrief === 'string' && entry.authoringBrief.endsWith('.json'), `${id}: authoring brief reference missing`);
  assert(entry?.boardDirectory === 'data/visual/setting-boards', `${id}: board directory drift`);
}
const household = fixed.get('CORE5_ERA_POPULATION_HOUSEHOLD_REFERENCE_MASTERS') as any;
assert(household?.exactFamilyMembersFrozen === false, 'Core5 population/household boards may not freeze literal family members');

const iau88 = fixed.get('MODERN_IAU88_CONSTELLATION_LINE_ART_VECTOR_MASTER') as any;
assert(iau88?.state === 'VECTOR_SYSTEM_SPEC_IMPLEMENTED_GEOMETRY_PENDING', 'Modern IAU88 system must remain geometry-pending');
assert(iau88?.all88LinePathsAuthored === false, 'Modern IAU88 may not claim all 88 line paths authored');
assert(iau88?.exactStarCoordinateDatasetBound === false, 'Modern IAU88 exact star-coordinate dataset must remain unbound until explicit work');
assert(iau88?.imageGenerationAuthorized === false, 'Modern IAU88 system spec may not authorize raster/image generation');
assert(Array.isArray(iau88?.files) && iau88.files.includes('data/visual/modern-iau88-project-line-art-vector-master-v1.json'), 'Modern IAU88 system spec evidence missing');

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
assert(sheets?.bridge === BRIDGE_PATH, 'Character Sheet ledger bridge path drift');
assert(sheets?.parentEntrypointSource === bridge.parentProductionEntrypointSource, 'Character Sheet ledger/bridge parent entrypoint source mismatch');
assert(sheets?.parentExporterResolution === bridge.parentExporterResolution, 'Character Sheet ledger/bridge parent exporter resolution mismatch');
assert(sheets?.latestMainSyncBaselineThrough === bridge.observedLatestMain.throughPullRequest, 'Character Sheet ledger/bridge sync PR boundary mismatch');
assert(sheets?.requiredFlagValidation === 'ALL_PARENT_DECLARED_STAR_REQUIRED_FLAGS_GROUPS', 'Character Sheet must validate all parent *RequiredFlags groups dynamically');
const bridgeAuthorityIds = (bridge.latestInheritedAuthorities ?? []).map((entry: any) => entry.id);
assert(bridgeAuthorityIds.length >= 1, 'Sheet bridge must track latest inherited authority additions');
for (const required of bridgeAuthorityIds) {
  assert(Array.isArray(sheets?.latestInheritedAuthorityAdditions) && sheets.latestInheritedAuthorityAdditions.includes(required), `ledger missing Sheet inherited authority: ${required}`);
}
assert(new Set(sheets.latestInheritedAuthorityAdditions ?? []).size === (sheets.latestInheritedAuthorityAdditions ?? []).length, 'Character Sheet inherited authority additions must be unique');
assert(sheets?.oldPromptPacketDirectGenerationAllowed === false, 'old prompt packets may not be used directly');
assert(sheets?.staticPacketReexportRequiredForProduction === false, 'static packet re-export must not be mistaken for the live production path');
assert(sheets?.activeCharacters === bridge.roster?.activeCharacters, 'active Character Sheet character count drift vs bridge');
assert(sheets?.activeLiveSheetPrompts === bridge.roster?.activeLiveAdapterSheetPrompts, 'active live Sheet prompt count drift vs bridge');
assert(Array.isArray(sheets?.heldCharacterIds) && JSON.stringify(sheets.heldCharacterIds) === JSON.stringify(bridge.hold?.characterIds), 'held Character IDs drift vs bridge');
assert(sheets?.heldSheetSlots === bridge.roster?.heldSheetSlots, 'held Sheet slot count drift vs bridge');
assert(sheets?.imageGenerationAllowed === false, 'Character Sheet image generation must remain blocked by listing phase');

console.log(JSON.stringify({
  status: 'PASS',
  ledgerId: ledger.ledgerId,
  latestMainSyncBaseline: ledger.currentBoundary.latestMainSyncBaseline,
  latestMainSyncThroughPullRequest: ledger.currentBoundary.latestMainSyncThroughPullRequest,
  legacyFindingsResolvedSynced: legacy.size,
  fixedMasterFindingsTracked: fixed.size,
  structuredMasterFamilies: [
    'GUNJO_FOUNDATION_MASTERS',
    'DREAM_COMMON_DAILY_LIFE_INFRASTRUCTURE_MASTER',
    'SKY_MOON_RESOLUTION_COLOR_SCRIPT_MASTER',
  ],
  core5SettingBoards: { environmentSpecsAuthored: 5, populationHouseholdSpecsAuthored: 5, humanApproved: 0, rasterAuthority: 0 },
  iau88VectorSystem: { systemSpecImplemented: true, all88LinePathsAuthored: false, exactStarCoordinateDatasetBound: false },
  sourceDerivedFamiliesTracked: sourceDerived.size,
  itemCollisionReview: { groups: item.exactLabelCollisionGroups, collapsesAuthorized: item.collisionRowsAuthorizedToCollapse },
  guideExecution: { imageBearing: guide.currentExecutionImageBearingRows, nonImage: guide.currentExecutionLogicalNonImageRows, migratedLorebook: guide.legacyBakedRowsMigrated },
  sheetAdapter: {
    activePrompts: sheets.activeLiveSheetPrompts,
    heldSlots: sheets.heldSheetSlots,
    parentExporterResolution: sheets.parentExporterResolution,
    requiredFlagValidation: sheets.requiredFlagValidation,
    latestAuthorityAdditions: sheets.latestInheritedAuthorityAdditions,
  },
  assetFactorySnapshot: { existing: assetFactory.existingOutputPathsObserved, missing: assetFactory.missingOutputPathsObserved },
  mustRecheckMainBeforeGenerationOrMerge: true,
  imageGenerationAllowed: false,
}, null, 2));