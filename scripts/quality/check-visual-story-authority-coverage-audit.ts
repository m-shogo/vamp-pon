import { existsSync, readFileSync } from 'node:fs';

const AUDIT_PATH = 'data/character-assets/manifests/visual-story-authority-coverage-audit.v1.json';
const STORY_PATH = 'docs/00-current-story-world-master.md';
const SAKUYAZA_PATH = 'docs/sakuyaza-current-identity-v1.md';
const GUNJO_PATH = 'docs/gunjo-zankyoroku-current-v1.md';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [AUDIT_PATH, STORY_PATH, SAKUYAZA_PATH, GUNJO_PATH]) {
  assert(existsSync(path), `missing required coverage-audit source: ${path}`);
}

const audit = JSON.parse(readFileSync(AUDIT_PATH, 'utf8'));
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
  'DREAM_COMMON_DAILY_LIFE_INFSTRUCTURE_MASTER'.replace('INFSTRUCTURE', 'INFRASTRUCTURE'),
  'SKY_MOON_RESOLUTION_COLOR_SCRIPT_MASTER',
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

assert(audit.mergeGate?.automaticImageGenerationAllowed === false, 'coverage audit must never authorize generation');
assert(audit.mergeGate?.allBlockingLegacyNameContradictionsMustBeResolved === true, 'legacy naming contradictions must remain a merge gate');
assert(audit.mergeGate?.latestMainAuthorityMustBeIntegrated === true, 'latest main authority sync must remain required');
assert(audit.mergeGate?.deterministicInventoryMustBeReexported === true, 'inventory re-export must remain required after sync');
assert(audit.mergeGate?.humanVisualApprovalStillRequiredForFinalAssets === true, 'human approval must remain required for final visual assets');

console.log(JSON.stringify({
  status: 'PASS',
  auditId: audit.auditId,
  legacyMigrationGapCount: contradictionIds.size,
  missingOrUnderModeledMasterFamilyCount: familyIds.size,
  knownPreGameFamilyCount: knownPreGame.size,
  lorebookCoverageGapCount: lorebookMissing.size,
}, null, 2));
