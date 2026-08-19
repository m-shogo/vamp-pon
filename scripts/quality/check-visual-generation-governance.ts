import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

import { CHARACTER_AUTHOR_DB_IDENTITIES } from '../../src/game/data/characterAuthorDbCoverageManifest.ts';
import { characterDefinitions } from '../../src/game/data/characterDatabase.ts';
import { characterProductionPlans } from '../../src/game/data/characterProductionPlans.ts';
import { CONSTELLATION_STORY_CLUE_CANDIDATES } from '../../src/game/data/constellationStoryClueReservoir.ts';
import { ENEMY_ASSET_PROMPT_KINDS, enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import { ITEM_ASSET_PROMPT_KINDS, itemAssetProductionEntries } from '../../src/game/data/itemAssetProductionDatabase.ts';
import { FIELD_DROP_CANON } from '../../src/game/data/itemProductionCanon.ts';
import { namedObjectVisualSharedSourceEntries } from '../../src/game/data/namedObjectVisualSharedSource.ts';
import { STAGE_ASSET_PROMPT_KINDS, stageProductionEntries } from '../../src/game/data/stageProductionDatabase.ts';
import { starBeastVisualSharedSourceEntries } from '../../src/game/data/starBeastVisualSharedSource.ts';
import { toumonSigils } from '../../src/game/data/toumonSimpleSigilCanon.ts';
import { yatsukageCallNames } from '../../src/game/data/yatsukageIdentitySource.ts';
import { CHARACTER_ASSET_PROMPT_KINDS } from '../../src/game/data/assetFactoryCharacterPrompts.ts';

const BASELINE_PATH = 'data/character-assets/manifests/visual-generation-count-baseline.v1.json';
const EXPANSION_PATH = 'data/character-assets/manifests/visual-pre-game-master-expansion-queue.v1.json';
const LINEAGE_PATH = 'data/character-assets/manifests/visual-item-lineage-review-queue.v1.json';
const REGISTRY_PATH = 'data/character-assets/manifests/visual-asset-master-registry.v1.json';

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

function readJson(path: string): any {
  if (!existsSync(path)) {
    fail(`missing governance file: ${path}`);
    return {};
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`invalid JSON: ${path}: ${String(error)}`);
    return {};
  }
}

function sameStringSet(actual: unknown, expected: readonly string[]): boolean {
  if (!Array.isArray(actual) || actual.some((value) => typeof value !== 'string')) return false;
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function expectNumber(actual: unknown, expected: number, label: string): void {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${String(actual)}`);
}

function expectFalse(actual: unknown, label: string): void {
  if (actual !== false) fail(`${label} must remain false`);
}

function familyById(expansion: any, id: string): any {
  const families = Array.isArray(expansion.families) ? expansion.families : [];
  const family = families.find((entry: any) => entry?.familyId === id);
  if (!family) fail(`expansion queue missing family: ${id}`);
  return family ?? {};
}

const baseline = readJson(BASELINE_PATH);
const expansion = readJson(EXPANSION_PATH);
const lineage = readJson(LINEAGE_PATH);
const registry = readJson(REGISTRY_PATH);

if (baseline.schemaVersion !== 1) fail('baseline.schemaVersion must be 1');
if (expansion.schemaVersion !== 1) fail('expansion.schemaVersion must be 1');
if (lineage.schemaVersion !== 1) fail('lineage.schemaVersion must be 1');
if (registry.schemaVersion !== 1) fail('registry.schemaVersion must be 1');

const requiredOrder = [
  'MASTER_SETTING_BOOK',
  'GUIDE_LOREBOOK_DATABASE',
  'TOP_LOADING_PRESENTATION',
  'GAMEPLAY_DERIVATIVES_LAST',
] as const;
if (JSON.stringify(baseline.productionOrder) !== JSON.stringify(requiredOrder)) {
  fail(`baseline production order drifted: ${JSON.stringify(baseline.productionOrder)}`);
}
expectFalse(baseline.authorityBoundary?.thisFileIsStoryAuthority, 'baseline authorityBoundary.thisFileIsStoryAuthority');
expectFalse(baseline.authorityBoundary?.thisFileIsVisualFinalApproval, 'baseline authorityBoundary.thisFileIsVisualFinalApproval');
expectFalse(baseline.authorityBoundary?.automaticGenerationAllowed, 'baseline authorityBoundary.automaticGenerationAllowed');
if (baseline.authorityBoundary?.yuiRegenerationOnHold !== true) fail('Yui regeneration must remain on hold in listing phase');

// Source-derived counts. These are intentionally computed from production sources so
// adding/removing a character, enemy, item, stage, sigil, etc. forces the listing to be updated.
expectNumber(baseline.phase1MasterSettingBook?.characterBaseDesign?.characterCount, CHARACTER_AUTHOR_DB_IDENTITIES.length, 'character master characterCount');
expectNumber(baseline.phase1MasterSettingBook?.characterBaseDesign?.logicalPackCount, CHARACTER_AUTHOR_DB_IDENTITIES.length, 'character master logicalPackCount');
expectNumber(baseline.phase1MasterSettingBook?.characterBaseDesign?.sourceSheetRows, CHARACTER_AUTHOR_DB_IDENTITIES.length * 4, 'character master sourceSheetRows');
expectNumber(baseline.phase1MasterSettingBook?.characterStateTransformation?.eligibleCharacterCount, characterDefinitions.length, 'transformation eligibleCharacterCount');
expectNumber(baseline.phase1MasterSettingBook?.characterStateTransformation?.proposedLogicalComparisonMasters, characterDefinitions.length, 'transformation logical masters');
expectNumber(baseline.phase1MasterSettingBook?.starBeast?.masterCount, starBeastVisualSharedSourceEntries.length, 'star beast masterCount');
expectNumber(baseline.phase1MasterSettingBook?.starBeast?.referenceGenerationReadyCount, starBeastVisualSharedSourceEntries.filter((entry) => entry.referenceGenerationReady).length, 'star beast generation-ready count');
expectNumber(baseline.phase1MasterSettingBook?.namedObject?.luminousPossessionMasterCount, namedObjectVisualSharedSourceEntries.length, 'named object masterCount');
expectNumber(baseline.phase1MasterSettingBook?.namedObject?.referenceGenerationReadyCount, namedObjectVisualSharedSourceEntries.filter((entry) => entry.referenceGenerationReady).length, 'named object generation-ready count');
expectNumber(baseline.phase1MasterSettingBook?.enemyCreature?.enemyDatabaseCount, enemyProductionEntries.length, 'enemyDatabaseCount');
expectNumber(baseline.phase1MasterSettingBook?.enemyCreature?.masterReferenceCount, enemyProductionEntries.length, 'enemy masterReferenceCount');
expectNumber(baseline.phase1MasterSettingBook?.locationEnvironment?.stageDatabaseCount, stageProductionEntries.length, 'stageDatabaseCount');
expectNumber(baseline.phase1MasterSettingBook?.locationEnvironment?.locationSettingMasterCount, stageProductionEntries.length, 'locationSettingMasterCount');
expectNumber(baseline.phase1MasterSettingBook?.toumonSigil?.vectorMasterCount, toumonSigils.length, 'Toumon vectorMasterCount');
expectNumber(baseline.phase1MasterSettingBook?.toumonSigil?.current20, toumonSigils.filter((entry) => entry.scope === 'current20').length, 'Toumon current20 count');
expectNumber(baseline.phase1MasterSettingBook?.toumonSigil?.officialReserve, toumonSigils.filter((entry) => entry.scope === 'official_reserve').length, 'Toumon reserve count');
expectNumber(baseline.phase1MasterSettingBook?.constellationArchive?.researchBackedCandidateClueCount, CONSTELLATION_STORY_CLUE_CANDIDATES.length, 'constellation clue count');

// Yatsukage are a subset of the enemy database, never an additive +8 master family.
const enemyIds = new Set(enemyProductionEntries.map((entry) => entry.id));
const yatsukageIds = yatsukageCallNames.map((entry) => entry.enemyId);
if (new Set(yatsukageIds).size !== yatsukageIds.length) fail('Yatsukage contains duplicate enemy IDs');
for (const id of yatsukageIds) if (!enemyIds.has(id)) fail(`Yatsukage enemy is not present in enemyProductionEntries: ${id}`);
expectNumber(baseline.phase1MasterSettingBook?.enemyCreature?.yatsukageSubsetCount, yatsukageIds.length, 'Yatsukage subset count');
expectNumber(baseline.phase1MasterSettingBook?.enemyCreature?.uniqueMasterCountAfterYatsukageDedupe, enemyProductionEntries.length, 'enemy unique count after Yatsukage dedupe');
if (!sameStringSet(baseline.phase1MasterSettingBook?.enemyCreature?.yatsukageEnemyIds, yatsukageIds)) fail('baseline Yatsukage enemy IDs drifted');

// Item rows and duplicate-label review queue are source-derived rather than manually trusted.
const phaseFields = ['starterGear', 'passiveItem', 'rareItem', 'lampTsugi', 'akatsukiBiraki'] as const;
const itemPhaseRows = characterProductionPlans.flatMap((plan) => phaseFields.map((field) => ({
  characterId: plan.characterId,
  field,
  label: plan[field],
})));
const distinctCharacterLabels = new Set(itemPhaseRows.map((row) => row.label));
const grouped = new Map<string, { characterId: string; label: string; fields: string[] }>();
for (const row of itemPhaseRows) {
  const key = `${row.characterId}\u0000${row.label}`;
  const value = grouped.get(key) ?? { characterId: row.characterId, label: row.label, fields: [] };
  value.fields.push(row.field);
  grouped.set(key, value);
}
const duplicateGroups = [...grouped.values()]
  .filter((entry) => entry.fields.length > 1)
  .sort((a, b) => `${a.characterId}:${a.label}`.localeCompare(`${b.characterId}:${b.label}`, 'ja'));
const fieldDropLabels = FIELD_DROP_CANON.map((entry) => entry.label);
const distinctAllLabels = new Set([...itemPhaseRows.map((row) => row.label), ...fieldDropLabels]);

expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.characterProductionPlanCount, characterProductionPlans.length, 'item characterProductionPlanCount');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.characterLinkedPhasesPerCharacter, phaseFields.length, 'item phases per character');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.characterLinkedRawRows, itemPhaseRows.length, 'item characterLinkedRawRows');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.fieldDropRows, FIELD_DROP_CANON.length, 'item fieldDropRows');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.rawItemRows, itemAssetProductionEntries.length, 'item rawItemRows');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.exactDistinctCharacterLinkedLabels, distinctCharacterLabels.size, 'item distinct character labels');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.exactDistinctLabelsIncludingFieldDrops, distinctAllLabels.size, 'item distinct labels including field drops');
expectNumber(baseline.phase1MasterSettingBook?.itemObjectDesign?.exactDuplicateLabelGroups, duplicateGroups.length, 'item duplicate groups');
if (!sameStringSet(baseline.phase1MasterSettingBook?.itemObjectDesign?.fieldDrops, fieldDropLabels)) fail('baseline field-drop labels drifted');

const baselineDuplicateCandidates = Array.isArray(baseline.phase1MasterSettingBook?.itemObjectDesign?.exactDuplicateCandidates)
  ? baseline.phase1MasterSettingBook.itemObjectDesign.exactDuplicateCandidates
  : [];
if (baselineDuplicateCandidates.length !== duplicateGroups.length) fail('baseline exactDuplicateCandidates length drifted');
for (const expected of duplicateGroups) {
  const found = baselineDuplicateCandidates.find((entry: any) => entry?.characterId === expected.characterId && entry?.label === expected.label);
  if (!found) fail(`baseline missing duplicate item candidate: ${expected.characterId}/${expected.label}`);
  else if (!sameStringSet(found.fields, expected.fields)) fail(`baseline duplicate item fields drifted: ${expected.characterId}/${expected.label}`);
}

expectNumber(lineage.sourceCharacterCount, characterProductionPlans.length, 'lineage sourceCharacterCount');
expectNumber(lineage.sourcePhaseRows, itemPhaseRows.length, 'lineage sourcePhaseRows');
expectNumber(lineage.exactDistinctLabels, distinctCharacterLabels.size, 'lineage exactDistinctLabels');
expectNumber(lineage.exactDuplicateGroups, duplicateGroups.length, 'lineage exactDuplicateGroups');
if (lineage.automaticSamePhysicalObjectDecisionAllowed !== false) fail('item lineage may not auto-collapse same-name items');
const allowedDecisions = new Set(Array.isArray(lineage.allowedDecisions) ? lineage.allowedDecisions : []);
const lineageItems = Array.isArray(lineage.items) ? lineage.items : [];
if (lineageItems.length !== duplicateGroups.length) fail(`lineage queue must contain exactly ${duplicateGroups.length} duplicate groups`);
for (const expected of duplicateGroups) {
  const reviewId = `item-lineage:${expected.characterId}:${expected.label}`;
  const review = lineageItems.find((entry: any) => entry?.reviewId === reviewId);
  if (!review) {
    fail(`lineage queue missing ${reviewId}`);
    continue;
  }
  if (!sameStringSet(review.occurrences, expected.fields)) fail(`${reviewId}: occurrence fields drifted`);
  if (!allowedDecisions.has(review.decision)) fail(`${reviewId}: unsupported decision ${String(review.decision)}`);
  if (review.decision === 'UNRESOLVED') {
    if (review.masterCountAfterDecision !== null) fail(`${reviewId}: unresolved review must keep masterCountAfterDecision=null`);
  } else {
    const required = ['authoritySources', 'physicalConstructionContinuity', 'materialContinuity', 'ownerContinuity', 'stateChangeDescription', 'notes'];
    for (const field of required) {
      const value = review[field];
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) fail(`${reviewId}: resolved decision requires ${field}`);
    }
    if (!Number.isInteger(review.masterCountAfterDecision) || review.masterCountAfterDecision < 1) fail(`${reviewId}: resolved decision requires positive masterCountAfterDecision`);
  }
}
if (!sameStringSet(lineage.fieldDrops?.labels, fieldDropLabels)) fail('lineage field-drop labels drifted');
expectNumber(lineage.namedObjectBoundary?.count, namedObjectVisualSharedSourceEntries.length, 'lineage Named Object boundary count');
if (lineage.namedObjectBoundary?.automaticallyMergedWithCharacterItemRows !== false) fail('Named Objects may not auto-merge with item rows');

// Expansion queue counts must follow their source arrays.
const transformFamily = familyById(expansion, 'character-state-transformation-master');
expectNumber(transformFamily.sourceCount, characterDefinitions.length, 'expansion transformation sourceCount');
expectNumber(transformFamily.logicalMasterCount, characterDefinitions.length, 'expansion transformation logicalMasterCount');
expectFalse(transformFamily.generationAllowed, 'expansion transformation generationAllowed');

const enemyFamily = familyById(expansion, 'enemy-reference-master');
expectNumber(enemyFamily.sourceCount, enemyProductionEntries.length, 'expansion enemy sourceCount');
expectNumber(enemyFamily.logicalMasterCount, enemyProductionEntries.length, 'expansion enemy logicalMasterCount');
expectNumber(enemyFamily.yatsukageSubset?.count, yatsukageIds.length, 'expansion Yatsukage subset count');
if (enemyFamily.yatsukageSubset?.countedAsAdditionalEnemyMasters !== false) fail('Yatsukage may not be counted as additive enemy masters');
if (!sameStringSet(enemyFamily.yatsukageSubset?.enemyIds, yatsukageIds)) fail('expansion Yatsukage IDs drifted');
expectFalse(enemyFamily.generationAllowed, 'expansion enemy generationAllowed');

const itemFamily = familyById(expansion, 'item-object-design-master');
expectNumber(itemFamily.rawSourceCount, itemAssetProductionEntries.length, 'expansion item rawSourceCount');
expectNumber(itemFamily.characterLinkedRawCount, itemPhaseRows.length, 'expansion item characterLinkedRawCount');
expectNumber(itemFamily.fieldDropCount, FIELD_DROP_CANON.length, 'expansion item fieldDropCount');
expectNumber(itemFamily.exactDistinctLabelCount, distinctAllLabels.size, 'expansion item exactDistinctLabelCount');
expectFalse(itemFamily.generationAllowed, 'expansion item generationAllowed');

const locationFamily = familyById(expansion, 'location-environment-setting-master');
expectNumber(locationFamily.sourceCount, stageProductionEntries.length, 'expansion stage sourceCount');
expectNumber(locationFamily.logicalMasterCount, stageProductionEntries.length, 'expansion stage logicalMasterCount');
expectFalse(locationFamily.generationAllowed, 'expansion location generationAllowed');

const toumonFamily = familyById(expansion, 'toumon-sigil-vector-master');
expectNumber(toumonFamily.sourceCount, toumonSigils.length, 'expansion Toumon sourceCount');
expectNumber(toumonFamily.logicalMasterCount, toumonSigils.length, 'expansion Toumon logicalMasterCount');
if (toumonFamily.imageGenerationAllowedForAuthority !== false) fail('Toumon raster generation may not become authority');

const constellationFamily = familyById(expansion, 'constellation-historical-archive-master');
expectNumber(constellationFamily.sourceCandidateCount, CONSTELLATION_STORY_CLUE_CANDIDATES.length, 'expansion constellation sourceCandidateCount');
expectFalse(constellationFamily.generationAllowed, 'expansion constellation generationAllowed');

if (expansion.downstreamBlockedUntilNormalized?.gameplayDerivatives !== true) fail('gameplay derivatives must remain blocked until pre-game masters normalize');

// Asset Factory contract math must remain explicit and update whenever source/kind arrays change.
const contractIndex = baseline.phase4GameplayLast?.existingAssetFactoryContractIndex ?? {};
const characterContracts = characterDefinitions.length * CHARACTER_ASSET_PROMPT_KINDS.length;
const enemyContracts = enemyProductionEntries.length * ENEMY_ASSET_PROMPT_KINDS.length;
const itemContracts = itemAssetProductionEntries.length * ITEM_ASSET_PROMPT_KINDS.length;
const stageContracts = stageProductionEntries.length * STAGE_ASSET_PROMPT_KINDS.length;
expectNumber(contractIndex.character?.sourceCharacterCount, characterDefinitions.length, 'Asset Factory character source count');
expectNumber(contractIndex.character?.kindsPerCharacter, CHARACTER_ASSET_PROMPT_KINDS.length, 'Asset Factory character kinds');
expectNumber(contractIndex.character?.contractCount, characterContracts, 'Asset Factory character contracts');
expectNumber(contractIndex.enemy?.sourceEnemyCount, enemyProductionEntries.length, 'Asset Factory enemy source count');
expectNumber(contractIndex.enemy?.kindsPerEnemy, ENEMY_ASSET_PROMPT_KINDS.length, 'Asset Factory enemy kinds');
expectNumber(contractIndex.enemy?.contractCount, enemyContracts, 'Asset Factory enemy contracts');
expectNumber(contractIndex.item?.sourceItemCount, itemAssetProductionEntries.length, 'Asset Factory item source count');
expectNumber(contractIndex.item?.kindsPerItem, ITEM_ASSET_PROMPT_KINDS.length, 'Asset Factory item kinds');
expectNumber(contractIndex.item?.contractCount, itemContracts, 'Asset Factory item contracts');
expectNumber(contractIndex.stage?.sourceStageCount, stageProductionEntries.length, 'Asset Factory stage source count');
expectNumber(contractIndex.stage?.kindsPerStage, STAGE_ASSET_PROMPT_KINDS.length, 'Asset Factory stage kinds');
expectNumber(contractIndex.stage?.contractCount, stageContracts, 'Asset Factory stage contracts');
expectNumber(contractIndex.totalContractCount, characterContracts + enemyContracts + itemContracts + stageContracts, 'Asset Factory total contracts');

// One visual binary should have one asset registration. Reuse belongs in usageTargets,
// not as a copied file or a second asset ID. Metadata JSON records may be shared; raster/vector binaries may not.
const VISUAL_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tga', '.svg']);
const assets = Array.isArray(registry.assets) ? registry.assets : [];
const visualPathOwner = new Map<string, string>();
const visualHashOwner = new Map<string, { assetId: string; path: string }>();
let registeredVisualBinaryCount = 0;
for (const asset of assets) {
  if (!asset || typeof asset !== 'object') continue;
  const assetId = String(asset.id ?? '');
  const files = Array.isArray(asset.files) ? asset.files : [];
  for (const file of files) {
    if (!file || typeof file !== 'object') continue;
    const path = typeof file.path === 'string' ? file.path : '';
    if (!VISUAL_EXTENSIONS.has(extname(path).toLowerCase())) continue;
    registeredVisualBinaryCount += 1;
    const previousPathOwner = visualPathOwner.get(path);
    if (previousPathOwner) fail(`duplicate visual binary path registered by ${previousPathOwner} and ${assetId}: ${path}`);
    else visualPathOwner.set(path, assetId);
    if (!existsSync(path)) continue; // existing central checker reports missing registered files.
    const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
    if (typeof file.sha256 === 'string' && file.sha256 !== hash) fail(`${assetId}: registered sha256 drifted for ${path}`);
    const previousHashOwner = visualHashOwner.get(hash);
    if (previousHashOwner && (previousHashOwner.assetId !== assetId || previousHashOwner.path !== path)) {
      fail(`duplicate visual binary content: ${assetId}:${path} is byte-identical to ${previousHashOwner.assetId}:${previousHashOwner.path}`);
    } else {
      visualHashOwner.set(hash, { assetId, path });
    }
  }
}

if (errors.length > 0) {
  console.error(`Visual generation governance check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Visual generation governance check PASS');
console.log(`- Author DB characters: ${CHARACTER_AUTHOR_DB_IDENTITIES.length}`);
console.log(`- Character gameplay/state sources: ${characterDefinitions.length}`);
console.log(`- Star Beasts: ${starBeastVisualSharedSourceEntries.length}`);
console.log(`- Named Objects: ${namedObjectVisualSharedSourceEntries.length}`);
console.log(`- Enemies: ${enemyProductionEntries.length} (Yatsukage subset: ${yatsukageIds.length})`);
console.log(`- Item rows: ${itemAssetProductionEntries.length}; distinct labels: ${distinctAllLabels.size}; lineage reviews: ${duplicateGroups.length}`);
console.log(`- Locations: ${stageProductionEntries.length}`);
console.log(`- Toumon vectors: ${toumonSigils.length}`);
console.log(`- Constellation clue candidates: ${CONSTELLATION_STORY_CLUE_CANDIDATES.length}`);
console.log(`- Asset Factory contracts: ${characterContracts + enemyContracts + itemContracts + stageContracts}`);
console.log(`- Registered visual binaries checked for duplicate path/hash: ${registeredVisualBinaryCount}`);
