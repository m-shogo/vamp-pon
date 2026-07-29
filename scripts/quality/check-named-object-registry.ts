import {
  allLightsCompletionDraftSpecification,
  evaluateAllLightsCompletion,
} from '../../src/game/data/allLightsCompletion.ts';
import { forgottenStreetNightBoard } from '../../src/game/data/collectionProgress.ts';
import { migrateCollectionProgressSaveToV2 } from '../../src/game/data/collectionProgressSaveV2.ts';
import {
  globalConstellationDefinition,
  validateGlobalConstellationDefinition,
} from '../../src/game/data/globalConstellationDefinition.ts';
import { keeperRecords } from '../../src/game/data/keeperRecords.ts';
import { lostItemRecords } from '../../src/game/data/lostItemRecords.ts';
import {
  namedObjectMigrationLedger,
  validateNamedObjectMigrationLedger,
} from '../../src/game/data/namedObjectMigrationLedger.ts';
import {
  allLightsCompletionDesign,
  characterObjectLineages,
  namedObjectById,
  namedObjectRegistry,
  validateNamedObjectRegistry,
} from '../../src/game/data/namedObjectRegistry.ts';

const registryResult = validateNamedObjectRegistry();
const migrationResult = validateNamedObjectMigrationLedger();
const constellationResult = validateGlobalConstellationDefinition();
const warnings = [...registryResult.warnings, ...migrationResult.warnings];
const errors = [
  ...registryResult.errors,
  ...migrationResult.errors,
  ...constellationResult.errors,
];

const activeBlackFormCell = forgottenStreetNightBoard.cells.find(
  (cell) => cell.id === 'fs_008_clear_depth_1_no_black_form',
);
if (!activeBlackFormCell?.condition.includes('黒耀化')) {
  errors.push('active Stage1 constellation must display 黒耀化');
}
if (activeBlackFormCell?.condition.includes('黒曜化')) {
  errors.push('active Stage1 constellation still displays the legacy 黒曜化 term');
}

if (keeperRecords.length !== 5) {
  errors.push(`Core5 keeper runtime scope must remain 5 until asset expansion, got ${keeperRecords.length}`);
}
for (const record of keeperRecords) {
  const object = namedObjectById.get(record.luminousPossessionId);
  if (!object) {
    errors.push(`${record.id} references missing luminous object ${record.luminousPossessionId}`);
    continue;
  }
  if (object.phase !== 'luminous_possession') {
    errors.push(`${record.id} luminous object must use luminous_possession phase`);
  }
  if (object.characterId !== record.characterId || object.displayName !== record.luminousPossessionName) {
    errors.push(`${record.id} luminous object connection does not match Current registry`);
  }
  if (record.lightMotif !== record.luminousPossessionName) {
    errors.push(`${record.id} must display its luminous possession name in the current keeper UI`);
  }
  if (record.legacyPersonalItems.length === 0) {
    errors.push(`${record.id} must preserve at least one legacy personal item during migration`);
  }
  if (!record.blackFormName.includes('黒耀化') || record.blackFormName.includes('黒曜化')) {
    errors.push(`${record.id} black form display must use 黒耀化`);
  }
}

const keeperIds = new Set(keeperRecords.map((record) => record.id));
for (const item of lostItemRecords) {
  if (item.relatedKeeperId && !keeperIds.has(item.relatedKeeperId)) {
    errors.push(`${item.id} references missing current keeper ${item.relatedKeeperId}`);
  }
  for (const legacyKeeperId of item.legacyRelatedKeeperIds) {
    if (!keeperIds.has(legacyKeeperId)) {
      errors.push(`${item.id} references missing legacy keeper ${legacyKeeperId}`);
    }
  }
}
const mapCorner = lostItemRecords.find((item) => item.id === 'lost-folded-map-corner');
if (
  mapCorner?.relatedKeeperId !== 'keeper-michiru' ||
  !mapCorner.legacyRelatedKeeperIds.includes('keeper-nagi')
) {
  errors.push('lost-folded-map-corner must use Michiru current binding and preserve Nagi legacy binding');
}
const rustedKey = lostItemRecords.find((item) => item.id === 'lost-rusted-room-key');
if (
  rustedKey?.relatedKeeperId !== 'keeper-nagi' ||
  !rustedKey.legacyRelatedKeeperIds.includes('keeper-michiru')
) {
  errors.push('lost-rusted-room-key must use Nagi current binding and preserve Michiru legacy binding');
}

const migratedFixture = migrateCollectionProgressSaveToV2({
  schemaVersion: 2,
  nightBoard: {
    completedCellIds: ['fs_006_clear_depth_1', 'legacy-checker-cell'],
  },
  completion: {
    groupStates: {},
    unknownLegacyGroupIds: ['legacy-checker-group'],
  },
});
if (!migratedFixture.nightBoard.completedCellIds.includes('legacy-checker-cell')) {
  errors.push('save v2 migration removed an unknown legacy cell from completedCellIds');
}
if (!migratedFixture.nightBoard.unknownLegacyCellIds.includes('legacy-checker-cell')) {
  errors.push('save v2 migration did not quarantine an unknown legacy cell');
}
if (!migratedFixture.completion.unknownLegacyGroupIds.includes('legacy-checker-group')) {
  errors.push('save v2 migration removed an explicit unknown legacy completion group');
}
if (migratedFixture.completion.completionRewardClaimed) {
  errors.push('save v2 migration must not auto-claim the completion reward');
}

const draftEvaluation = evaluateAllLightsCompletion(
  allLightsCompletionDraftSpecification,
  migratedFixture,
);
if (
  draftEvaluation.state !== 'LOCKED' ||
  draftEvaluation.reason !== 'DENOMINATOR_NOT_FROZEN'
) {
  errors.push('all lights draft must stay LOCKED until the runtime denominator is frozen');
}

for (const warning of warnings) {
  console.warn(`[named-object-registry:warn] ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[named-object-registry] ${error}`);
  }
  process.exit(1);
}

console.log(
  `[named-object-registry] ok: ${characterObjectLineages.length} lineages, ` +
    `${namedObjectRegistry.length} named objects, ` +
    `${keeperRecords.length} current keeper records, ` +
    `${lostItemRecords.length} lost-item records, ` +
    `${namedObjectMigrationLedger.length} migration entries, ` +
    `${globalConstellationDefinition.migratedStage1Nodes.length} Stage1 constellation nodes, ` +
    `${globalConstellationDefinition.namedObjectLinks.length} constellation links, ` +
    `${allLightsCompletionDesign.groups.length} completion groups, ` +
    `reward=${allLightsCompletionDesign.rewardDisplayName}, ` +
    `runtimeFrozen=${String(allLightsCompletionDesign.runtimeFrozen)}, ` +
    `runtimeConnected=${String(globalConstellationDefinition.runtimeConnected)}`,
);
