import { characterDefinitions } from '../../src/game/data/characterDatabase.ts';
import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import { itemAssetProductionEntries } from '../../src/game/data/itemAssetProductionDatabase.ts';
import { SAKUYAZA_CURRENT_IDENTITY, sakumeiCandidateMembers } from '../../src/game/data/sakumeiCandidateSource.ts';
import { stageProductionEntries } from '../../src/game/data/stageProductionDatabase.ts';
import { toumonSigils } from '../../src/game/data/toumonSimpleSigilCanon.ts';
import { VISUAL_PRE_GAME_SOURCE_MASTER_INVENTORY } from '../../src/game/data/visualPreGameSourceMasterInventory.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const inventory = VISUAL_PRE_GAME_SOURCE_MASTER_INVENTORY;
const rows = [...inventory.rows];

assert(inventory.schemaVersion === 1, 'source-derived inventory schemaVersion must remain 1');
assert(inventory.status === 'SOURCE_DERIVED_LIST_ONLY_NO_AUTOMATIC_GENERATION', 'source-derived inventory may not become generation-authorized');
assert(inventory.policy.sourceArraysAreAuthoritativeForMembership, 'source arrays must remain membership authority');
assert(inventory.policy.addingOrRemovingSourceRowsAutomaticallyChangesInventory, 'inventory must remain source-derived');
assert(!inventory.policy.imageGenerationAllowed, 'source-derived inventory may not authorize image generation');
assert(inventory.policy.rawItemRowsAreLineageCandidatesNotFinalMasterCount, 'raw Item rows must remain lineage candidates');
assert(inventory.policy.sakuyazaSubsetIsNotAdditionalToEnemy48, 'Sakuyaza subset may not add eight duplicate Enemy masters');
assert(inventory.policy.legacyYatsukageNameMayNotNameCurrentMaster, 'legacy Yatsukage may not name Current masters');
assert(inventory.policy.currentSeason1AntagonistFormalName === '朔夜座', 'Current S1 formal name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Sakuyaza machine authority drift');

assert(inventory.counts.characterStateRows === characterDefinitions.length, 'character-state source count drift');
assert(inventory.counts.enemyReferenceRows === enemyProductionEntries.length, 'enemy reference source count drift');
assert(inventory.counts.sakuyazaEnemySubsetRows === sakumeiCandidateMembers.length, 'Sakuyaza enemy subset count drift');
assert(inventory.counts.itemObjectLineageCandidateRows === itemAssetProductionEntries.length, 'Item lineage candidate source count drift');
assert(inventory.counts.locationEnvironmentRows === stageProductionEntries.length, 'location source count drift');
assert(inventory.counts.toumonVectorRows === toumonSigils.length, 'Toumon source count drift');
const expectedTotal = characterDefinitions.length + enemyProductionEntries.length + itemAssetProductionEntries.length + stageProductionEntries.length + toumonSigils.length;
assert(inventory.counts.totalRows === expectedTotal, `total source-derived row count drift: expected ${expectedTotal}, got ${inventory.counts.totalRows}`);
assert(rows.length === expectedTotal, 'rows.length must equal source-derived total');

const ids = rows.map((row) => row.assetId);
assert(new Set(ids).size === ids.length, 'source-derived pre-game asset IDs must be globally unique');
assert(!rows.some((row) => /yatsukage|夜綴りの八影/i.test(`${row.assetId} ${row.displayName}`)), 'Current source-derived masters may not use legacy Yatsukage formal naming');
for (const row of rows) {
  assert(row.generationAllowed === false, `${row.assetId}: generationAllowed must remain false`);
  assert(row.finalApprovalGranted === false, `${row.assetId}: final approval may not be pre-granted`);
  assert(row.runtimeApprovalGranted === false, `${row.assetId}: runtime approval may not be pre-granted`);
  assert(row.usageTargets.length > 0, `${row.assetId}: usageTargets required`);
}

const stateRows = rows.filter((row) => row.familyId === 'character-state-transformation-master');
assert(stateRows.length === characterDefinitions.length, 'character-state row family count drift');
for (const source of characterDefinitions) {
  const row = stateRows.find((entry) => entry.subjectId === source.id);
  assert(row, `missing character-state row: ${source.id}`);
  assert(row.assetId === `char-${source.id}-state-transformation-master-v1`, `character-state assetId drift: ${source.id}`);
  assert(row.recordType === 'PLANNED_MASTER', `${row.assetId}: character state must be planned master`);
  assert(row.metadata.stateDoesNotCreateNewCharacterIdentity === true, `${row.assetId}: state may not create new character identity`);
}

const enemyRows = rows.filter((row) => row.familyId === 'enemy-reference-master');
assert(enemyRows.length === enemyProductionEntries.length, 'enemy family count drift');
const sakuyazaEnemyIds = new Set(sakumeiCandidateMembers.map((entry) => entry.enemyId));
for (const enemy of enemyProductionEntries) {
  const row = enemyRows.find((entry) => entry.subjectId === enemy.id);
  assert(row, `missing enemy reference row: ${enemy.id}`);
  assert(row.assetId === `enemy-${enemy.id}-reference-master-v1`, `enemy reference assetId drift: ${enemy.id}`);
  const expectedSakuyaza = sakuyazaEnemyIds.has(enemy.id);
  assert(row.metadata.sakuyazaMember === expectedSakuyaza, `${row.assetId}: Sakuyaza subset flag drift`);
  if (expectedSakuyaza) {
    assert(row.displayName.includes('朔夜座'), `${row.assetId}: Sakuyaza member display name must use Current formal name`);
    assert(row.metadata.currentFormalGroupName === '朔夜座', `${row.assetId}: Current formal group name drift`);
    assert(row.metadata.countedAsAdditionalSakuyazaMaster === false, `${row.assetId}: Sakuyaza member may not be additive to Enemy48`);
  }
}

const itemRows = rows.filter((row) => row.familyId === 'item-object-design-master-candidate');
assert(itemRows.length === itemAssetProductionEntries.length, 'Item lineage family count drift');
for (const item of itemAssetProductionEntries) {
  const row = itemRows.find((entry) => entry.subjectId === item.id);
  assert(row, `missing Item lineage candidate: ${item.id}`);
  assert(row.recordType === 'LINEAGE_CANDIDATE', `${row.assetId}: raw Item row must remain lineage candidate`);
  assert(row.artifactType === 'OBJECT_LINEAGE_CANDIDATE', `${row.assetId}: raw Item row may not masquerade as final image master`);
  assert(row.metadata.sameNameDoesNotProveSamePhysicalObject === true, `${row.assetId}: same-name safety missing`);
  assert(row.metadata.mayCollapseIntoAnotherLineageAfterAuthorityReview === true, `${row.assetId}: lineage collapse possibility missing`);
  assert(row.metadata.mayNotParentGameplayBeforeLineageResolution === true, `${row.assetId}: unresolved Item may not parent gameplay`);
}

const locationRows = rows.filter((row) => row.familyId === 'location-environment-setting-master');
assert(locationRows.length === stageProductionEntries.length, 'location family count drift');
for (const stage of stageProductionEntries) {
  const row = locationRows.find((entry) => entry.subjectId === stage.id);
  assert(row?.assetId === `location-${stage.id}-environment-setting-master-v1`, `location row missing/drifted: ${stage.id}`);
  assert(row.metadata.storySeedIsNotExactSceneCanon === true, `${row.assetId}: story seed may not auto-freeze exact scene Canon`);
  assert(row.metadata.readableSignageMayNotBeInvented === true, `${row.assetId}: readable signage invention guard missing`);
}

const toumonRows = rows.filter((row) => row.familyId === 'toumon-sigil-vector-master');
assert(toumonRows.length === toumonSigils.length, 'Toumon family count drift');
for (const sigil of toumonSigils) {
  const row = toumonRows.find((entry) => entry.subjectId === sigil.characterId);
  assert(row?.assetId === `toumon-${sigil.characterId}-vector-master-v1`, `Toumon row missing/drifted: ${sigil.characterId}`);
  assert(row.artifactType === 'VECTOR_SVG_MASTER', `${row.assetId}: Toumon authority must remain vector-first`);
  assert(row.metadata.authorityFormat === 'SVG_VECTOR_NOT_RASTER_GENERATION', `${row.assetId}: Toumon raster authority drift`);
}

console.log(JSON.stringify({
  status: 'PASS',
  inventoryId: inventory.inventoryId,
  counts: inventory.counts,
  currentSeason1AntagonistFormalName: inventory.policy.currentSeason1AntagonistFormalName,
  itemFinalMasterCount: 'TBD_AFTER_LINEAGE_REVIEW',
  generationAllowed: false,
}, null, 2));
