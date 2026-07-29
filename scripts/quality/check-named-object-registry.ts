import {
  allLightsCompletionDraftSpecification,
  evaluateAllLightsCompletion,
} from '../../src/game/data/allLightsCompletion.ts';
import { ACHIEVEMENT_DEFS } from '../../src/game/data/achievements.ts';
import {
  collectionEconomyResources,
  validateCollectionEconomyTerminology,
} from '../../src/game/data/collectionEconomyTerminology.ts';
import { forgottenStreetNightBoard } from '../../src/game/data/collectionProgress.ts';
import {
  forgottenStreetCompatibilitySummary,
  forgottenStreetNightBoardCompatibility,
} from '../../src/game/data/collectionProgressCompatibility.ts';
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
import {
  getAcceptedStage1ProgressIds,
  stage1LegacyRuntimeCompatibilityByBoardCellId,
  stage1LegacyRuntimeCompatibilityEntries,
  validateStage1LegacyRuntimeCompatibility,
} from '../../src/game/data/stage1LegacyRuntimeCompatibility.ts';

const registryResult = validateNamedObjectRegistry();
const migrationResult = validateNamedObjectMigrationLedger();
const constellationResult = validateGlobalConstellationDefinition();
const stage1LegacyRuntimeResult = validateStage1LegacyRuntimeCompatibility();
const economyTerminologyResult = validateCollectionEconomyTerminology();
const warnings = [
  ...registryResult.warnings,
  ...migrationResult.warnings,
  ...stage1LegacyRuntimeResult.warnings,
  ...economyTerminologyResult.warnings,
];
const errors = [
  ...registryResult.errors,
  ...migrationResult.errors,
  ...constellationResult.errors,
  ...stage1LegacyRuntimeResult.errors,
  ...economyTerminologyResult.errors,
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

for (const achievement of ACHIEVEMENT_DEFS) {
  if (achievement.description.includes('黒曜化')) {
    errors.push(`${achievement.id} achievement description still displays legacy 黒曜化`);
  }
  if (achievement.id.startsWith('no-berserk:') && !achievement.description.includes('黒耀化')) {
    errors.push(`${achievement.id} no-berserk achievement must describe 黒耀化`);
  }
}

const expectedLegacyBoardCellIds = [
  'fs_001_release_ink_shadow',
  'fs_002_release_paper_scrap_shadow',
  'fs_003_release_night_haze',
  'fs_004_release_black_label_shadow',
  'fs_005_calm_bag_yorishiro',
  'fs_023_calm_yorishiro_with_ultimate',
  'fs_024_release_onbro_fast',
  'fs_025_view_nemori_record',
];
const actualLegacyBoardCellIds = [
  ...stage1LegacyRuntimeCompatibilityByBoardCellId.keys(),
].sort();
if (JSON.stringify(actualLegacyBoardCellIds) !== JSON.stringify(expectedLegacyBoardCellIds)) {
  errors.push(`Stage1 legacy board-cell bindings must be exactly ${expectedLegacyBoardCellIds.join(', ')}`);
}
if (forgottenStreetNightBoardCompatibility.definitionVersion !== 'stage1-compat-v2') {
  errors.push('Stage1 compatibility definition must be stage1-compat-v2');
}
if (
  forgottenStreetCompatibilitySummary.reviewEnemyRebind !== 7 ||
  forgottenStreetCompatibilitySummary.reviewLegacyStoryBinding !== 1
) {
  errors.push('Stage1 compatibility must classify 7 enemy/boss cells and 1 legacy story cell');
}
if (
  forgottenStreetCompatibilitySummary.exactStage1SuccessorCells !== 1 ||
  forgottenStreetCompatibilitySummary.roleStage1SuccessorCells !== 4 ||
  forgottenStreetCompatibilitySummary.movedToOtherStageCells !== 1 ||
  forgottenStreetCompatibilitySummary.noCurrentSuccessorCells !== 2
) {
  errors.push('Stage1 compatibility successor-relation cell counts are inconsistent');
}
if (
  forgottenStreetCompatibilitySummary.activeCompletionEligible !== 22 ||
  forgottenStreetCompatibilitySummary.legacyArchiveOnly !== 3
) {
  errors.push('Stage1 compatibility must keep 22 active nodes and 3 legacy archive-only nodes');
}
const archiveOnlyIds = forgottenStreetNightBoardCompatibility.cells
  .filter((cell) => cell.completionEligibility === 'LEGACY_ARCHIVE_ONLY')
  .map((cell) => cell.id);
if (
  JSON.stringify(archiveOnlyIds) !==
  JSON.stringify([
    'fs_002_release_paper_scrap_shadow',
    'fs_003_release_night_haze',
    'fs_025_view_nemori_record',
  ])
) {
  errors.push('Stage1 legacy archive-only node set is inconsistent');
}
if (globalConstellationDefinition.activeStage1CompletionNodes.length !== 22) {
  errors.push('global constellation must exclude the three Stage1 legacy archive-only nodes');
}
if (
  JSON.stringify(getAcceptedStage1ProgressIds('ink_shadow')) !==
  JSON.stringify(['ink_shadow', 'ombu_small_ink'])
) {
  errors.push('ink_shadow must dual-read the Current ombu_small_ink id');
}
if (
  JSON.stringify(getAcceptedStage1ProgressIds('black_label_shadow')) !==
  JSON.stringify(['black_label_shadow', 'omburo_ink_arm'])
) {
  errors.push('black_label_shadow must dual-read the Current omburo_ink_arm role successor');
}
if (
  JSON.stringify(getAcceptedStage1ProgressIds('bag_yorishiro')) !==
  JSON.stringify(['bag_yorishiro', 'boss_name_without_owner'])
) {
  errors.push('bag_yorishiro must dual-read the Current Stage1 boss id');
}
if (getAcceptedStage1ProgressIds('paper_scrap_shadow').length !== 1) {
  errors.push('paper_scrap_shadow must not reuse its moved Current48 motif for Stage1 progress');
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
    `${stage1LegacyRuntimeCompatibilityEntries.length} Stage1 legacy runtime entries, ` +
    `${stage1LegacyRuntimeCompatibilityByBoardCellId.size} Stage1 legacy board bindings, ` +
    `${globalConstellationDefinition.activeStage1CompletionNodes.length} active Stage1 completion nodes, ` +
    `${collectionEconomyResources.length} separated economy/mechanic concepts, ` +
    `${namedObjectMigrationLedger.length} migration entries, ` +
    `${globalConstellationDefinition.migratedStage1Nodes.length} Stage1 constellation nodes, ` +
    `${globalConstellationDefinition.namedObjectLinks.length} constellation links, ` +
    `${allLightsCompletionDesign.groups.length} completion groups, ` +
    `reward=${allLightsCompletionDesign.rewardDisplayName}, ` +
    `runtimeFrozen=${String(allLightsCompletionDesign.runtimeFrozen)}, ` +
    `runtimeConnected=${String(globalConstellationDefinition.runtimeConnected)}`,
);
