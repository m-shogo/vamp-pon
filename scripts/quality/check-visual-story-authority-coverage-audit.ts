import { existsSync, readFileSync } from 'node:fs';

const AUDIT_PATH = 'data/character-assets/manifests/visual-story-authority-coverage-audit.v1.json';
const SHEET_BRIDGE_PATH = 'data/character-assets/manifests/visual-character-sheet-production-entrypoint-bridge.v1.json';
const STORY_PATH = 'docs/00-current-story-world-master.md';
const SAKUYAZA_PATH = 'docs/sakuyaza-current-identity-v1.md';
const GUNJO_PATH = 'docs/gunjo-zankyoroku-current-v1.md';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [AUDIT_PATH, SHEET_BRIDGE_PATH, STORY_PATH, SAKUYAZA_PATH, GUNJO_PATH]) {
  assert(existsSync(path), `missing required coverage-audit source: ${path}`);
}

const audit = JSON.parse(readFileSync(AUDIT_PATH, 'utf8'));
const sheetBridge = JSON.parse(readFileSync(SHEET_BRIDGE_PATH, 'utf8'));
const story = readFileSync(STORY_PATH, 'utf8');
const sakuyaza = readFileSync(SAKUYAZA_PATH, 'utf8');
const gunjo = readFileSync(GUNJO_PATH, 'utf8');

assert(audit.schemaVersion === 1, 'coverage audit schemaVersion must remain 1');
assert(audit.status === 'ACTIVE_BLOCKING_GAPS_IDENTIFIED_NO_AUTOMATIC_GENERATION', 'coverage audit must remain an active non-generation gap audit');
assert(audit.currentFormalNames?.season1AntagonistTeam === '朔夜座', 'S1 Current antagonist name must be 朔夜座');
assert(audit.currentFormalNames?.gunjoRecordTaxonomy === '群青残響録', 'Gunjo Current name must be 群青残響録');
assert(audit.currentFormalNames?.legacyObserverLabelOnly === '八影', '八影 must remain explicitly legacy observer label only');

assert(story.includes('朔夜座'), 'highest Story authority must contain 朔夜座');
assert(story.includes('群青残響録'), 'highest Story authority must contain 群青残響録');
assert(story.includes('八影 = early observer label'), 'highest Story authority must preserve 八影 as early observer label only');
assert(sakuyaza.includes('朔夜座'), 'Sakuyaza authority file must contain formal name');
assert(sakuyaza.includes('八影\n= early observer label') || sakuyaza.includes('八影 = early observer label'), 'Sakuyaza authority must preserve the legacy observer boundary');
assert(gunjo.includes('fixed count') || gunjo.includes('固定'), 'Gunjo authority must describe non-fixed membership');

const contradictionIds = new Set((audit.legacyCurrentContradictions ?? []).map((entry: any) => entry.id));
for (const id of [
  'LEGACY-YATSUKAGE-IDENTITY-DOC-CURRENT',
  'LEGACY-YATSUKAGE-MACHINE-AUTHORITY-CURRENT',
  'LEGACY-YATSUKAGE-PAIR-CURRENT',
  'LEGACY-YATSUKAGE-RELATIONSHIP-CURRENT',
  'LEGACY-YATSUKAGE-PLAYER-PRESENTATION',
]) {
  assert(contradictionIds.has(id), `coverage audit missing known legacy migration gap: ${id}`);
}

const familyIds = new Set((audit.missingOrUnderModeledMasterFamilies ?? []).map((entry: any) => entry.id));
for (const id of [
  'SAKUYAZA_TEAM_COMPARISON_MASTER',
  'GUNJO_FOUNDATION_MASTERS',
  'CORE5_REALITY_ERA_ENVIRONMENT_REFERENCE_MASTERS',
  'CORE5_ERA_POPULATION_HOUSEHOLD_REFERENCE_MASTERS',
  'DREAM_COMMON_DAILY_LIFE_INFRASTRUCTURE_MASTER',
  'SKY_MOON_RESOLUTION_COLOR_SCRIPT_MASTER',
  'MODERN_IAU88_CONSTELLATION_LINE_ART_VECTOR_MASTER',
  'ERA_INCIDENT_VISUAL_ADMISSION_POLICY',
  'DREAM_REALITY_FORM_COMPARISON_MASTERS',
  'SUNNY_IF_REWARD_ENSEMBLE_MASTER_FAMILY',
  'SEASON_ANTAGONIST_VISUAL_ADMISSION_POLICY',
  'TITLE_LOGO_LOCKUP_MASTER',
  'MATERIAL_REFERENCE_PLATES',
]) {
  assert(familyIds.has(id), `coverage audit missing visual family gap: ${id}`);
}

const knownPreGame = new Set(audit.alreadyKnownPreGameFamiliesStillNotMaterialized ?? []);
for (const id of [
  'ITEM_OBJECT_DESIGN_MASTERS',
  'ENEMY_CREATURE_REFERENCE_MASTERS',
  'LOCATION_ENVIRONMENT_SETTING_MASTERS',
  'CHARACTER_STATE_TRANSFORMATION_MASTERS',
  'WORLD_VISUAL_EFFECT_LANGUAGE_MASTER',
  'CHARACTER_SCALE_ENSEMBLE_MASTERS',
  'TOUMON_SIGIL_AND_SYMBOL_MASTERS',
  'CONSTELLATION_HISTORICAL_ARCHIVE_MASTERS',
  'GROUP_FACTION_VISUAL_MASTERS',
  'STORY_SCENE_KEYFRAME_MASTERS',
]) {
  assert(knownPreGame.has(id), `coverage audit lost known pre-game master family: ${id}`);
}

const lorebookMissing = new Set(audit.lorebookCoverageMismatch?.declaredCoverageKindsNotYetMaterialized ?? []);
for (const id of [
  'lorebook-constellation',
  'lorebook-glossary',
  'lorebook-group',
  'lorebook-star-beast',
  'lorebook-artifact',
]) {
  assert(lorebookMissing.has(id), `coverage audit lost Lorebook coverage gap: ${id}`);
}

// The coverage audit above intentionally preserves historical findings. Current Sheet production
// readiness is resolved by the live v3 bridge, not by mutating/deleting old audit findings.
assert(sheetBridge.schemaVersion === 3, 'character-sheet bridge must use current live-adapter schemaVersion 3');
assert(sheetBridge.status === 'ACTIVE_LATEST_MAIN_SHEET_ADAPTER_NO_IMAGE_GENERATION', 'character-sheet bridge must be the active latest-main live adapter while generation remains blocked');
assert(typeof sheetBridge.observedLatestMain?.sha === 'string' && /^[0-9a-f]{40}$/.test(sheetBridge.observedLatestMain.sha), 'character-sheet bridge must record a full latest-main synchronization SHA');
assert(Number.isInteger(sheetBridge.observedLatestMain?.throughPullRequest) && sheetBridge.observedLatestMain.throughPullRequest > 0, 'character-sheet bridge latest-main PR boundary missing');
assert(sheetBridge.observedLatestMain?.syncedIntoInventoryBranch === true, 'character-sheet bridge latest-main baseline must be integrated into this branch');
assert(sheetBridge.observedLatestMain?.mustRecheckImmediatelyBeforeAnyImageGenerationOrMerge === true, 'latest main must still be rechecked immediately before generation/merge');
assert(sheetBridge.parentProductionEntrypointSource === 'src/game/data/characterReferenceProductionEntrypoint.ts', 'Sheet adapter must resolve from the single Character Reference Production Entrypoint');
assert(sheetBridge.parentExporterResolution === 'LIVE_FROM_CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT', 'Sheet parent exporter must resolve live rather than remain a stale hard-coded wrapper');
assert(sheetBridge.parentPolicyResolution === 'LIVE_FROM_CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT', 'Sheet parent policy must resolve live rather than remain stale');
assert(sheetBridge.existingInventoryPacket?.mayBeUsedDirectlyForProductionImageGeneration === false, 'legacy inventory prompt packet may not directly authorize production generation');
assert(sheetBridge.directLegacyPacketProductionAllowed === false, 'legacy static packet production must remain forbidden');
assert(sheetBridge.handWrittenSheetPromptProductionAllowed === false, 'hand-written Sheet prompt must not be production-ready');
assert(sheetBridge.lowerExporterProductionAllowed === false, 'lower exporter output must not bypass the Current production entrypoint');
assert(sheetBridge.generatedSheetMayCreateCanon === false, 'generated Sheet may not create Canon');
assert(sheetBridge.generatedSheetMayCreateCharacterMasterApproval === false, 'generated Sheet may not approve its own Character Master');
assert(sheetBridge.generatedSheetMayCreateRuntimeApproval === false, 'generated Sheet may not grant runtime approval');
assert(sheetBridge.generatedSheetMayCreateFeedbackRule === false, 'generated Sheet may not create feedback authority');
assert(sheetBridge.humanReviewRequired === true, 'Character Sheet production must remain Human-review gated');
assert(sheetBridge.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'generated Sheet output must begin as review-required candidate');

assert(sheetBridge.roster?.totalCharacters === 36, 'Sheet bridge roster must remain 36 characters');
assert(sheetBridge.roster?.sheetsPerCharacter === 4, 'Sheet bridge must retain four source Sheet roles per character');
assert(sheetBridge.roster?.totalLogicalSheetSlots === 144, 'Sheet bridge total logical Sheet slot count drift');
assert(sheetBridge.roster?.activeCharacters === 35, 'Sheet bridge must have 35 active non-Yui characters');
assert(sheetBridge.roster?.activeLiveAdapterSheetPrompts === 140, 'Sheet bridge must expose 140 active live Sheet prompts');
assert(sheetBridge.roster?.heldCharacters === 1 && sheetBridge.roster?.heldSheetSlots === 4, 'Yui HOLD must account for one character/four Sheet slots');
assert(Array.isArray(sheetBridge.hold?.characterIds) && sheetBridge.hold.characterIds.length === 1 && sheetBridge.hold.characterIds[0] === 'yui', 'Yui must remain the explicit held character');
assert(sheetBridge.hold?.adapterMustFailClosedOutsideInspectionMode === true, 'Yui HOLD must fail closed outside inspection mode');
assert(sheetBridge.hold?.imageGenerationAuthorized === false, 'Yui HOLD may not authorize image generation');

assert(sheetBridge.validationGate?.syncLatestMainSatisfiedForObservedBaseline === true, 'observed latest-main baseline must be integrated for the recorded bridge state');
assert(sheetBridge.validationGate?.sheetAdapterImplemented === true, 'Sheet adapter must remain implemented');
assert(sheetBridge.validationGate?.parentExporterMustResolveLive === true, 'Sheet validation must require live parent exporter resolution');
assert(sheetBridge.validationGate?.liveExportValidationRequired === true, 'live Sheet export validation must remain required');
assert(sheetBridge.validationGate?.expectedActiveLiveExports === 140, 'Sheet validation expected live export count drift');
assert(sheetBridge.validationGate?.expectedHeldSlots === 4, 'Sheet validation held slot count drift');
assert(sheetBridge.validationGate?.legacyStaticPromptHashesMayAuthorizeGeneration === false, 'legacy static hashes may not authorize generation');
assert(sheetBridge.validationGate?.allParentDeclaredRequiredFlagGroupsMustPass === true, 'all parent-declared *RequiredFlags groups must pass');
assert(sheetBridge.validationGate?.allParentRequiredAuthorityPathsMustPass === true, 'all parent required authority paths must pass');
assert(sheetBridge.validationGate?.imageGenerationAuthorizedByThisBridge === false, 'Sheet bridge itself may not authorize image generation');

const inheritedAuthorityIds = (sheetBridge.latestInheritedAuthorities ?? []).map((entry: any) => entry.id);
for (const id of [
  'occlusion-layering-fidelity',
  'crop-silhouette-readability',
  'focus-depth-effects-fidelity',
  'surface-tone-mapping-fidelity',
  'contrast-value-hierarchy-fidelity',
  'edge-line-shape-boundary-fidelity',
  'detail-density-ornament-budget-fidelity',
  'negative-space-cluster-separation-fidelity',
]) {
  assert(inheritedAuthorityIds.includes(id), `Sheet bridge missing current inherited fidelity authority: ${id}`);
}

assert(audit.mergeGate?.automaticImageGenerationAllowed === false, 'coverage audit must never authorize generation');
assert(audit.mergeGate?.allBlockingLegacyNameContradictionsMustBeResolved === true, 'legacy naming contradictions must remain a merge gate in the historical audit');
assert(audit.mergeGate?.latestMainAuthorityMustBeIntegrated === true, 'latest main authority sync must remain required');
assert(audit.mergeGate?.deterministicInventoryMustBeReexported === true, 'historical audit must preserve its deterministic inventory remediation requirement');
assert(audit.mergeGate?.humanVisualApprovalStillRequiredForFinalAssets === true, 'human approval must remain required for final visual assets');

console.log(JSON.stringify({
  status: 'PASS',
  auditId: audit.auditId,
  legacyMigrationGapCount: contradictionIds.size,
  missingOrUnderModeledMasterFamilyCount: familyIds.size,
  knownPreGameFamilyCount: knownPreGame.size,
  lorebookCoverageGapCount: lorebookMissing.size,
  historicalAuditFindingsPreserved: true,
  currentSheetBridge: {
    schemaVersion: sheetBridge.schemaVersion,
    latestMainThroughPullRequest: sheetBridge.observedLatestMain.throughPullRequest,
    parentExporterResolution: sheetBridge.parentExporterResolution,
    activeLiveSheetPrompts: sheetBridge.roster.activeLiveAdapterSheetPrompts,
    heldCharacterIds: sheetBridge.hold.characterIds,
    heldSheetSlots: sheetBridge.roster.heldSheetSlots,
    inheritedFidelityAuthorityCount: inheritedAuthorityIds.length,
    imageGenerationAuthorized: sheetBridge.validationGate.imageGenerationAuthorizedByThisBridge,
  },
}, null, 2));
