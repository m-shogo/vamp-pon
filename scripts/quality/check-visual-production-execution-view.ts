import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildVisualImageProductionList } from '../../src/game/data/visualAssetGenerationInventory.ts';
import { buildVisualProductionExecutionView, LEGACY_BAKED_LOREBOOK_KINDS, VISUAL_PRODUCTION_EXECUTION_POLICY_PATH } from '../../src/game/data/visualProductionExecutionView.ts';

function fail(message: string): never {
  throw new Error(`[visual-production-execution-view] ${message}`);
}

const policy = JSON.parse(readFileSync(resolve(process.cwd(), VISUAL_PRODUCTION_EXECUTION_POLICY_PATH), 'utf8'));
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
if (legacyItems.length !== currentItems.length || currentItems.length !== 480) fail(`stable managed row count must remain 480: legacy=${legacyItems.length}, current=${currentItems.length}`);

const legacyKindSet = new Set<string>(LEGACY_BAKED_LOREBOOK_KINDS);
const legacyBakedRows = legacyItems.filter((item: any) => item.layer === 'lorebook' && legacyKindSet.has(item.kind));
const migratedRows = currentItems.filter((item: any) => item.recordType === 'lorebook-composition-read-model');
if (legacyBakedRows.length !== 142 || migratedRows.length !== 142) fail(`expected 142 legacy/migrated Lorebook rows, got ${legacyBakedRows.length}/${migratedRows.length}`);

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
if (nonImage !== 214) fail(`expected 214 non-image logical rows after Lorebook migration, got ${nonImage}`);

console.log(JSON.stringify({
  status: 'PASS',
  stableManagedRows: currentItems.length,
  legacyLorebookBakedRows: legacyBakedRows.length,
  migratedLorebookCompositionRows: migratedRows.length,
  independentLorebookRasterRows: currentIndependentBaked.length,
  imageBearingRows: imageBearing.length,
  logicalNonImageRows: nonImage,
  lorebookBreakdown: Object.fromEntries([...breakdown.entries()].sort()),
  executionAllowed: current.executionAllowed,
  imageGenerationPerformed: false,
}, null, 2));
