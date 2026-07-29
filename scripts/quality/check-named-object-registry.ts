import {
  allLightsCompletionDesign,
  characterObjectLineages,
  namedObjectRegistry,
  validateNamedObjectRegistry,
} from '../../src/game/data/namedObjectRegistry.ts';

const result = validateNamedObjectRegistry();

for (const warning of result.warnings) {
  console.warn(`[named-object-registry:warn] ${warning}`);
}

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(`[named-object-registry] ${error}`);
  }
  process.exit(1);
}

console.log(
  `[named-object-registry] ok: ${characterObjectLineages.length} lineages, ` +
    `${namedObjectRegistry.length} named objects, ` +
    `${allLightsCompletionDesign.groups.length} completion groups, ` +
    `reward=${allLightsCompletionDesign.rewardDisplayName}, ` +
    `runtimeFrozen=${String(allLightsCompletionDesign.runtimeFrozen)}`,
);
