import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildVisualImageProductionList } from '../../src/game/data/visualAssetGenerationInventory.ts';
import { buildVisualProductionExecutionView, LEGACY_BAKED_LOREBOOK_KINDS, VISUAL_PRODUCTION_EXECUTION_POLICY_PATH } from '../../src/game/data/visualProductionExecutionView.ts';

const BACKLOG_PATH = 'data/character-assets/manifests/visual-image-generation-backlog.v1.json';

function fail(message: string): never {
  throw new Error(`[visual-production-execution-view] ${message}`);
}

const policy = JSON.parse(readFileSync(resolve(process.cwd(), VISUAL_PRODUCTION_EXECUTION_POLICY_PATH), 'utf8'));
const backlog = JSON.parse(readFileSync(resolve(process.cwd(), BACKLOG_PATH), 'utf8'));
const legacy = buildVisualImageProductionList() as any;
const current = buildVisualProductionExecutionView() as any;
const expectedCounts = policy.expectedCounts ?? {};

if (policy.schemaVersion !== 2 || policy.status !== 'CURRENT_PRE_GENERATION_EXECUTION_VIEW') fail('execution policy must be schema v2/current');
if (policy.legacyInput?.directGenerationAuthority !== false) fail('legacy image-production list must not directly authorize generation');
if (policy.authorityBoundary?.executionAllowed !== false || policy.authorityBoundary?.imageGenerationAuthorized !== false) fail('listing/execution policy must not authorize generation');
if (policy.authorityBoundary?.yuiHoldMustRemain !== true) fail('Yui hold must remain explicit');
if (policy.authorityBoundary?.guideLorebookMayParentGameplay !== false) fail('Guide/Lorebook may not parent gameplay');
if (current.executionAllowed !== false || current.legacyInputMayAuthorizeGenerationDirectly !== false) fail('current execution view bypass boundary weakened');

for (const [field, expected] of Object.entries(expectedCounts)) {
  if (current.counts?.[field] !== expected) fail(`count drift for ${field}: expected ${String(expected)}, got ${String(current.counts?.[field])}`);
}

const legacyItems = Array.isArray(legacy.items) ? legacy.items : [];
const currentItems = Array.isArray(current.items) ? current.items : [];
if (legacyItems.length !== currentItems.length || currentItems.length !== 486) fail(`stable managed row count must remain 486: legacy=${legacyItems.length}, current=${currentItems.length}`);

const legacyKindSet = new Set<string>(LEGACY_BAKED_LOREBOOK_KINDS);
const legacyBakedRows = legacyItems.filter((item: any) => item.layer === 'lorebook' && legacyKindSet.has(item.kind));
const migratedRows = currentItems.filter((item: any) => item.recordType === 'lorebook-composition-read-model');
if (legacyBakedRows.length !== 148 || migratedRows.length !== 148) fail(`expected 148 legacy/migrated Lorebook rows, got ${legacyBakedRows.length}/${migratedRows.length}`);

const breakdown = new Map<string, number>();
for (const row of migratedRows) breakdown.set(row.kind, (breakdown.get(row.kind) ?? 0) + 1);
for (const [kind, expected] of Object.entries(policy.lorebookMigration?.legacyBreakdown ?? {})) {
  if (breakdown.get(kind) !== expected) fail(`${kind}: expected ${String(expected)} migrated rows, got ${String(breakdown.get(kind))}`);
}
if (breakdown.size !== LEGACY_BAKED_LOREBOOK_KINDS.length) fail(`unexpected migrated Lorebook kind count: ${breakdown.size}`);

const legacyById = new Map(legacyItems.map((item: any) => [item.assetId, item]));
const currentById = new Map(currentItems.map((item: any) => [item.assetId, item]));
if (legacyById.size !== legacyItems.length || currentById.size !== currentItems.length) fail('asset IDs must remain unique across legacy/current views');
if (legacyById.size !== currentById.size) fail('migration may not add/delete stable managed asset IDs');

for (const [assetId, legacyItem] of legacyById) {
  const item: any = currentById.get(assetId);
  if (!item) fail(`current execution view lost assetId: ${assetId}`);
  const migrated = legacyItem.layer === 'lorebook' && legacyKindSet.has(legacyItem.kind);
  if (!migrated) {
    if (JSON.stringify(item) !== JSON.stringify(legacyItem)) fail(`${assetId}: non-Lorebook row changed during execution-view migration`);
    continue;
  }
  if (item.kind !== legacyItem.kind || item.subjectId !== legacyItem.subjectId || item.authorityStatus !== legacyItem.authorityStatus) fail(`${assetId}: migration must preserve traceability/authority identity`);
  if (item.recordType !== 'lorebook-composition-read-model') fail(`${assetId}: migrated Lorebook row must be a composition read model`);
  if (item.generationMode !== 'MASTER_REUSE_PLUS_HTML_CSS_SVG_DATA') fail(`${assetId}: invalid Guide/Lorebook generationMode`);
  if (item.independentBinaryGenerationAllowed !== false || item.approvedMasterReuseRequired !== true) fail(`${assetId}: duplicate binary prevention flags invalid`);
  if (item.compositionMayCreateCanon !== false || item.compositionMayParentGameplay !== false) fail(`${assetId}: composition authority/parent boundary weakened`);
  if (item.reviewStatus !== 'not-materialized') fail(`${assetId}: composition row must be not-materialized before approved parent reuse`);
  if (item.promptPacketId !== null) fail(`${assetId}: composition row may not carry an image prompt packet`);
  if (!Array.isArray(item.candidateIds) || item.candidateIds.length !== 0) fail(`${assetId}: composition row may not allocate image candidates`);
  if (typeof item.outputPath !== 'string' || !item.outputPath.endsWith('.json') || item.outputPath.startsWith('assets/import-staging/lorebook/')) fail(`${assetId}: composition output must be JSON, not raster staging`);
  if (!String(item.blocker).includes('Independent Lorebook raster generation is not authorized')) fail(`${assetId}: raster-generation blocker missing`);
}

const currentIndependentBaked = currentItems.filter((item: any) => item.layer === 'lorebook' && legacyKindSet.has(item.kind) && (Array.isArray(item.candidateIds) && item.candidateIds.length > 0 || /\.(?:png|webp|jpe?g)$/i.test(String(item.outputPath ?? ''))));
if (currentIndependentBaked.length !== 0) fail(`current execution view still has ${currentIndependentBaked.length} independently generated Lorebook raster rows`);

const imageBearing = currentItems.filter((item: any) => Array.isArray(item.candidateIds) && item.candidateIds.length > 0 && /\.(?:png|webp|jpe?g)$/i.test(String(item.outputPath ?? '')));
if (imageBearing.length !== 266) fail(`expected 266 image-bearing managed rows after Lorebook migration, got ${imageBearing.length}`);
const nonImage = currentItems.length - imageBearing.length;
if (nonImage !== 220) fail(`expected 220 non-image logical rows after Lorebook migration, got ${nonImage}`);

// The human-facing image-generation backlog must describe this Current execution view,
// not the superseded 408-image interpretation that counted 142 Lorebook cards as PNGs.
if (backlog.schemaVersion !== 2 || backlog.status !== 'ACTIVE_CURRENT_EXECUTION_NO_AUTOMATIC_GENERATION') fail('image-generation backlog must be schema v2/current execution');
const requiredOrder = ['MASTER', 'GUIDE_DB', 'TOP_PROMO', 'GAMEPLAY'];
if (JSON.stringify(backlog.productionOrder) !== JSON.stringify(requiredOrder)) fail(`image-generation backlog production order drifted: ${JSON.stringify(backlog.productionOrder)}`);
if (backlog.sourceOfTruth?.currentExecutionPolicy !== VISUAL_PRODUCTION_EXECUTION_POLICY_PATH) fail('backlog must point to Current execution policy');

const managed = backlog.currentManagedExecution ?? {};
if (managed.stableManagedRows !== currentItems.length) fail(`backlog stableManagedRows drifted: ${String(managed.stableManagedRows)}`);
if (managed.imageBearingRows !== imageBearing.length) fail(`backlog imageBearingRows drifted: ${String(managed.imageBearingRows)}`);
if (managed.logicalNonImageRows !== nonImage) fail(`backlog logicalNonImageRows drifted: ${String(managed.logicalNonImageRows)}`);
if (managed.imageBearingRows + managed.logicalNonImageRows !== managed.stableManagedRows) fail('backlog managed-row arithmetic invalid');

const imageBreakdown = managed.imageBearingBreakdown ?? {};
if (imageBreakdown.characterDesignSourceSheets !== 144) fail('backlog character source-sheet count must remain 144');
if (imageBreakdown.sakuyazaMasters !== 8) fail('backlog Sakuyaza master-image count must remain 8');
if (imageBreakdown.starBeastMasters !== 21) fail('backlog Star Beast master-image count must remain 21');
if (imageBreakdown.namedObjectMasters !== 21) fail('backlog Named Object master-image count must remain 21');
if (imageBreakdown.gameplayCharacterDerivatives !== 72) fail('backlog Gameplay managed image count must remain 72');
if (Object.values(imageBreakdown).reduce((sum: number, value: any) => sum + Number(value), 0) !== imageBearing.length) fail('backlog image-bearing breakdown must sum to Current image-bearing rows');

const logicalBreakdown = managed.logicalNonImageBreakdown ?? {};
if (logicalBreakdown.characterDesignMasterPacks !== 36 || logicalBreakdown.characterDesignOverviewReadModels !== 36 || logicalBreakdown.lorebookCompositionReadModels !== migratedRows.length) fail('backlog logical non-image breakdown drifted');
if (Object.values(logicalBreakdown).reduce((sum: number, value: any) => sum + Number(value), 0) !== nonImage) fail('backlog logical non-image breakdown must sum to Current logical rows');

const superseded = backlog.legacy408Interpretation ?? {};
if (superseded.state !== 'SUPERSEDED_TRACEABILITY_ONLY' || superseded.oldImageBearingRows !== 408) fail('old 408-image model must remain explicit superseded traceability');
if (superseded.migratedLegacyLorebookRows !== migratedRows.length || superseded.currentIndependentLorebookRasterRows !== currentIndependentBaked.length) fail('backlog Lorebook migration counts drifted');
if (superseded.currentIndependentLorebookRasterRows !== 0 || superseded.directGenerationAuthority !== false) fail('old Lorebook raster interpretation may not regain generation authority');

if (backlog.yuiHold?.status !== 'HOLD_DO_NOT_REGENERATE_NOW' || backlog.yuiHold?.logicalSheetSlots !== 4) fail('backlog must preserve four-slot Yui HOLD');
if (backlog.yuiHold?.generationAllowed !== false || backlog.yuiHold?.mayParentDerivatives !== false || backlog.yuiHold?.rejectedHistoryMustRemain !== true) fail('Yui HOLD/rejected-lineage boundary weakened');

const phases = Array.isArray(backlog.phases) ? backlog.phases : [];
if (phases.length !== 4) fail(`backlog must contain exactly four phases, got ${phases.length}`);
const phaseById = new Map(phases.map((entry: any) => [entry.phase, entry]));
for (const [index, phase] of requiredOrder.entries()) {
  const entry: any = phaseById.get(phase);
  if (!entry || entry.order !== index + 1) fail(`${phase}: missing or wrong execution order`);
  if (entry.generationAllowed !== false) fail(`${phase}: backlog may not authorize generation`);
}
const master: any = phaseById.get('MASTER');
if (master.managedImageRows !== 194) fail('MASTER managed image rows must remain 194 before Gameplay derivatives');
if (master.nonRasterOrNotYetAdmittedMasterWork?.core5EraSettingBoards?.count !== 10 || master.nonRasterOrNotYetAdmittedMasterWork?.core5EraSettingBoards?.imageGenerationRows !== 0) fail('Core5 editable setting boards must remain ten non-raster generation rows');
if (master.nonRasterOrNotYetAdmittedMasterWork?.toumon?.format !== 'SVG_VECTOR' || master.nonRasterOrNotYetAdmittedMasterWork?.toumon?.countedInManaged266 !== false) fail('Toumon must remain non-raster vector authority');

const guide: any = phaseById.get('GUIDE_DB');
if (guide.managedIndependentImageRows !== 0 || guide.lorebookCompositionReadModels !== migratedRows.length) fail('Guide/DB must remain 148 compositions and zero independent images');
if (guide.compositionOutput !== 'JSON_COMPOSITION_READ_MODEL' || guide.subjectArtwork !== 'APPROVED_MASTER_REFERENCE_OR_CROP' || guide.layout !== 'HTML_CSS_SVG_DATA') fail('Guide/DB reuse composition contract drifted');
if (guide.bakedReadableTextIntoRaster !== false || guide.guideDbMayParentGameplay !== false) fail('Guide/DB raster/gameplay-parent boundary weakened');

const topPromo: any = phaseById.get('TOP_PROMO');
if (topPromo.defaultNewGenerationRowsNow !== 0) fail('TOP/PROMO must review reuse before admitting new generation rows');
if (topPromo.existingReuseReview?.loadingSeasonalCommittedSources !== 4 || topPromo.existingReuseReview?.topV3ExistingCandidate !== 1 || topPromo.existingReuseReview?.topV2LayerSources !== 17) fail('TOP/Loading reuse counts drifted');
if (topPromo.existingReuseReview?.runtimeEvidenceScreenshotsAreGenerationRows !== false || topPromo.newKeyArtMustBeExplicitlyEnumerated !== true) fail('TOP/PROMO evidence/admission boundary weakened');

const gameplay: any = phaseById.get('GAMEPLAY');
if (gameplay.managedCharacterDerivativeImages !== expectedCounts.gameplayImageRows) fail('Gameplay managed image rows must match Current policy');
if (gameplay.assetFactoryIndex?.contractCount !== expectedCounts.indexedAssetFactoryContracts || gameplay.assetFactoryIndex?.contractCount !== 977) fail('Asset Factory index count drifted');
if (gameplay.assetFactoryIndex?.missingMeansGenerateNow !== false || gameplay.assetFactoryIndex?.mustRevalidateOnCurrentHeadBeforeExecution !== true) fail('Asset Factory missing-output execution boundary weakened');

for (const key of ['thisFileIsAuthority', 'mayPromoteStoryCanon', 'mayPromoteCharacterMasterApproval', 'mayPromoteFinalOrRuntime', 'automaticGenerationAllowed', 'imageGenerationAuthorizedByThisFile']) {
  if (backlog.authorityBoundary?.[key] !== false) fail(`backlog authorityBoundary.${key} must remain false`);
}
if (backlog.authorityBoundary?.humanReviewRequired !== true || backlog.authorityBoundary?.openFieldsMayNotBeInvented !== true || backlog.authorityBoundary?.legacyPlanningRowsMayNotAuthorizeGeneration !== true) fail('backlog Human/OPEN/legacy authority boundary weakened');

console.log(JSON.stringify({
  status: 'PASS',
  stableManagedRows: currentItems.length,
  legacyLorebookBakedRows: legacyBakedRows.length,
  migratedLorebookCompositionRows: migratedRows.length,
  independentLorebookRasterRows: currentIndependentBaked.length,
  imageBearingRows: imageBearing.length,
  logicalNonImageRows: nonImage,
  lorebookBreakdown: Object.fromEntries([...breakdown.entries()].sort()),
  backlogProductionOrder: backlog.productionOrder,
  yuiHold: backlog.yuiHold.status,
  assetFactoryContractsIndexed: gameplay.assetFactoryIndex.contractCount,
  executionAllowed: current.executionAllowed,
  imageGenerationPerformed: false,
}, null, 2));
