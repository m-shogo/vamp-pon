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
const warnings = [...registryResult.warnings, ...migrationResult.warnings];
const errors = [...registryResult.errors, ...migrationResult.errors];

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
    `${allLightsCompletionDesign.groups.length} completion groups, ` +
    `reward=${allLightsCompletionDesign.rewardDisplayName}, ` +
    `runtimeFrozen=${String(allLightsCompletionDesign.runtimeFrozen)}`,
);
