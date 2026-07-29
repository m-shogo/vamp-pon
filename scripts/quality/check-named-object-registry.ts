import {
  allLightsCompletionDraftSpecification,
  evaluateAllLightsCompletion,
} from '../../src/game/data/allLightsCompletion.ts';
import { migrateCollectionProgressSaveToV2 } from '../../src/game/data/collectionProgressSaveV2.ts';
import {
  globalConstellationDefinition,
  validateGlobalConstellationDefinition,
} from '../../src/game/data/globalConstellationDefinition.ts';
import {
  namedObjectMigrationLedger,
  validateNamedObjectMigrationLedger,
} from '../../src/game/data/namedObjectMigrationLedger.ts';
import {
  allLightsCompletionDesign,
  characterObjectLineages,
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
    `${namedObjectMigrationLedger.length} migration entries, ` +
    `${globalConstellationDefinition.migratedStage1Nodes.length} Stage1 constellation nodes, ` +
    `${globalConstellationDefinition.namedObjectLinks.length} constellation links, ` +
    `${allLightsCompletionDesign.groups.length} completion groups, ` +
    `reward=${allLightsCompletionDesign.rewardDisplayName}, ` +
    `runtimeFrozen=${String(allLightsCompletionDesign.runtimeFrozen)}, ` +
    `runtimeConnected=${String(globalConstellationDefinition.runtimeConnected)}`,
);
