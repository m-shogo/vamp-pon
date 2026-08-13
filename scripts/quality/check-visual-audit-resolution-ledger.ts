import { readFileSync } from 'node:fs';

const PATH = 'data/character-assets/manifests/visual-audit-resolution-ledger.v1.json';
const ledger = JSON.parse(readFileSync(PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ledger.schemaVersion === 1, 'resolution ledger schemaVersion must remain 1');
assert(ledger.status === 'ACTIVE_RESOLUTION_TRACKING_NO_AUTOMATIC_GENERATION', 'resolution ledger may not authorize generation');
assert(ledger.currentBoundary?.latestMainSyncStillRequired === true, 'latest main sync must remain required');
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
  assert(entry.state === 'RESOLVED_ON_BRANCH_PENDING_MAIN_SYNC', `${id}: branch resolution state drift`);
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
assert(item?.state === 'SOURCE_DERIVED_INVENTORY_IMPLEMENTED', 'Item source-derived inventory missing');
assert(item.rawLineageCandidateRows === 105, 'Item raw lineage candidate count drift');
assert(item.finalMasterCount === 'TBD_AFTER_LINEAGE_REVIEW', 'Item final master count must remain unresolved before lineage review');

const top = ledger.reuseAndDerivativeAudits?.topLoading;
assert(top?.state === 'REUSE_AUDIT_IMPLEMENTED', 'TOP/Loading reuse audit state drift');
assert(top?.loadingCommittedSources === 4, 'Loading reuse source count drift');
assert(top?.topV3ExistingCandidate === 1, 'TOP V3 existing candidate count drift');
assert(top?.newAuthorizedReplacementRowsNow === 0, 'TOP/Loading may not gain replacement rows without explicit decision');

const guide = ledger.reuseAndDerivativeAudits?.guideDb;
assert(guide?.state === 'PENDING_CONTENT_MIGRATION', 'Guide/DB must remain pending old baked-row migration');
assert(guide?.independentGuideBinariesDefault === 0, 'Guide/DB may not default to independent generated binaries');

const assetFactory = ledger.reuseAndDerivativeAudits?.assetFactory977;
assert(assetFactory?.state === 'REUSE_AUDIT_IMPLEMENTED', '977 output audit state drift');
assert(assetFactory?.totalContracts === 977, '977 output audit total drift');
assert(assetFactory?.existingOutputPathsObserved === 0, 'persisted audit existing count drift');
assert(assetFactory?.missingOutputPathsObserved === 977, 'persisted audit missing count drift');
assert(assetFactory?.automaticGenerationAuthorized === false, '977 missing outputs may not auto-authorize generation');
assert(assetFactory?.mustRevalidateAfterLatestMainSync === true, '977 snapshot must be revalidated after sync');

assert(ledger.characterSheetExecution?.state === 'BLOCKED_LATEST_MAIN_ADAPTER', 'Character Sheet execution must remain latest-main-adapter blocked');
assert(ledger.characterSheetExecution?.oldPromptPacketDirectGenerationAllowed === false, 'old prompt packets may not be used directly');
assert(ledger.characterSheetExecution?.sheetAdapterImplemented === false, 'sheet adapter may not be claimed implemented yet');
assert(ledger.characterSheetExecution?.imageGenerationAllowed === false, 'Character Sheet image generation must remain blocked');

console.log(JSON.stringify({
  status: 'PASS',
  ledgerId: ledger.ledgerId,
  legacyFindingsResolvedOnBranch: legacy.size,
  fixedMasterFindingsTracked: fixed.size,
  sourceDerivedFamiliesTracked: sourceDerived.size,
  assetFactorySnapshot: { existing: assetFactory.existingOutputPathsObserved, missing: assetFactory.missingOutputPathsObserved },
  latestMainSyncStillRequired: ledger.currentBoundary.latestMainSyncStillRequired,
  imageGenerationAllowed: false,
}, null, 2));
