import { existsSync, readFileSync } from 'node:fs';

import { SAKUYAZA_CURRENT_IDENTITY, sakumeiCandidateMembers } from '../../src/game/data/sakumeiCandidateSource.ts';
import { STORY_WORLD_MASTER_SOURCE } from '../../src/game/data/storyWorldMasterSource.ts';

const OVERLAY_PATH = 'data/character-assets/manifests/visual-current-group-record-master.v1.json';
const SAKUYAZA_DOC = 'docs/sakuyaza-current-identity-v1.md';
const GUNJO_DOC = 'docs/gunjo-zankyoroku-current-v1.md';
const BASELINE_PATH = 'data/character-assets/manifests/visual-generation-count-baseline.v1.json';
const EXPANSION_PATH = 'data/character-assets/manifests/visual-pre-game-master-expansion-queue.v1.json';
const CANONICAL_GUNJO_MEDIUM_MASTER_ID = 'gunjo-record-medium-evidence-master-v1';
const SUPERSEDED_GUNJO_MEDIUM_PLANNING_ID = 'gunjo-record-medium-material-master-v1';

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

function readJson(path: string): any {
  if (!existsSync(path)) {
    fail(`missing required file: ${path}`);
    return {};
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`invalid JSON: ${path}: ${String(error)}`);
    return {};
  }
}

function readText(path: string): string {
  if (!existsSync(path)) {
    fail(`missing required file: ${path}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

function sameStrings(actual: unknown, expected: readonly string[]): boolean {
  if (!Array.isArray(actual) || actual.some((entry) => typeof entry !== 'string')) return false;
  return JSON.stringify(actual) === JSON.stringify(expected);
}

const overlay = readJson(OVERLAY_PATH);
const baseline = readJson(BASELINE_PATH);
const expansion = readJson(EXPANSION_PATH);
const sakuyazaDoc = readText(SAKUYAZA_DOC);
const gunjoDoc = readText(GUNJO_DOC);

if (overlay.schemaVersion !== 1) fail('overlay.schemaVersion must be 1');
if (overlay.status !== 'CURRENT_AUTHORITY_OVERLAY_LIST_ONLY_NO_AUTOMATIC_GENERATION') fail('overlay status drifted');
if (overlay.globalRules?.automaticGenerationAllowed !== false) fail('overlay must not enable image generation');
if (overlay.globalRules?.legacyNameMayOverrideCurrentAuthority !== false) fail('legacy naming may not override Current authority');
if (overlay.globalRules?.openMemberCountMayBeConvertedToFixedImageCount !== false) fail('OPEN member count may not become a fixed image count');
if (overlay.globalRules?.generatedImageMayCreateGroupMembership !== false) fail('generated image may not create group membership');
if (overlay.globalRules?.generatedImageMayCreateIncidentCanon !== false) fail('generated image may not create incident canon');

const precedenceTargets = Array.isArray(overlay.precedence?.appliesTo) ? overlay.precedence.appliesTo : [];
for (const required of [BASELINE_PATH, EXPANSION_PATH, 'data/character-assets/manifests/visual-image-production-list.v1.json', 'docs/visual/visual-generation-master-backlog-v1.md']) {
  if (!precedenceTargets.includes(required)) fail(`overlay precedence missing target: ${required}`);
}

// Current Season 1 antagonist production name is Sakuyaza. Yatsukage is legacy only.
const currentMembers = sakumeiCandidateMembers.map((member) => member.callName);
const currentEnemyIds = sakumeiCandidateMembers.map((member) => member.enemyId);
if (SAKUYAZA_CURRENT_IDENTITY.formalName !== '朔夜座') fail('SAKUYAZA_CURRENT_IDENTITY formal name must remain 朔夜座');
if (SAKUYAZA_CURRENT_IDENTITY.currentMemberCount !== 8) fail('Sakuyaza Current member count must remain 8 until Story authority changes');
if (overlay.sakuyaza?.formalName !== SAKUYAZA_CURRENT_IDENTITY.formalName) fail('overlay Sakuyaza formal name drifted');
if (overlay.sakuyaza?.seasonScope !== SAKUYAZA_CURRENT_IDENTITY.seasonScope) fail('overlay Sakuyaza season scope drifted');
if (overlay.sakuyaza?.currentMemberCount !== SAKUYAZA_CURRENT_IDENTITY.currentMemberCount) fail('overlay Sakuyaza member count drifted');
if (!sameStrings(overlay.sakuyaza?.memberCallNames, currentMembers)) fail('overlay Sakuyaza member names drifted');
if (!sameStrings(overlay.sakuyaza?.memberEnemyIds, currentEnemyIds)) fail('overlay Sakuyaza enemy lineage IDs drifted');
if (overlay.sakuyaza?.visualMasterPolicy?.characterMasterCount !== currentMembers.length) fail('Sakuyaza visual character master count must equal Current roster');
if (overlay.sakuyaza?.visualMasterPolicy?.countAsAdditionalEnemyDatabaseIdentity !== false) fail('Sakuyaza may not be double-counted as new enemy identities when lineage already exists');
if (overlay.sakuyaza?.visualMasterPolicy?.teamComparisonMasterRequired !== true) fail('Sakuyaza team comparison master must remain listed');
if (overlay.sakuyaza?.legacyCompatibility?.earlyObserverShortLabel !== SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel) fail('legacy observer label drifted');
if (overlay.sakuyaza?.legacyCompatibility?.legacyLabelsMayBeCurrentProductionName !== false) fail('八影/Yatsukage may not be Current production naming');
if (overlay.sakuyaza?.legacyCompatibility?.legacyVisualAssetsMayBecomeCurrentWithoutMigrationReview !== false) fail('legacy visual assets may not silently become Current');

const storySakuyazaNames = STORY_WORLD_MASTER_SOURCE.sakuyaza.memberCallNames;
if (!sameStrings(storySakuyazaNames, currentMembers)) fail('Story World Master and Sakuyaza member source disagree');
if (!sakuyazaDoc.includes('朔夜座') || !sakuyazaDoc.includes('旧八影') || !sakuyazaDoc.includes('early observer label')) fail('Sakuyaza migration authority wording is missing');

// Old branch fields may temporarily remain because PR #304 predates later visual authority work,
// but they are compatibility-only and this overlay must explicitly outrank them.
if (baseline.phase1MasterSettingBook?.enemyCreature?.yatsukageSubsetCount !== undefined && overlay.sakuyaza?.legacyCompatibility?.legacyDataMayRemainAsCompatibilityInput !== true) {
  fail('legacy yatsukage baseline fields exist without explicit compatibility-only boundary');
}
const enemyFamily = Array.isArray(expansion.families)
  ? expansion.families.find((entry: any) => entry?.familyId === 'enemy-reference-master')
  : undefined;
if (enemyFamily?.yatsukageSubset !== undefined && overlay.sakuyaza?.legacyCompatibility?.legacyDataMayRemainAsCompatibilityInput !== true) {
  fail('legacy yatsukage expansion fields exist without explicit compatibility-only boundary');
}

// Gunjo Zankyoroku is a record taxonomy, not a team/faction or a fixed boss roster.
const gunjo = overlay.gunjoZankyoroku ?? {};
if (gunjo.formalName !== '群青残響録') fail('Gunjo Zankyoroku formal name drifted');
if (gunjo.isOrganization !== false) fail('Gunjo Zankyoroku must not become an organization');
if (gunjo.isAntagonistTeam !== false) fail('Gunjo Zankyoroku must not become an antagonist team');
if (gunjo.isFixedBossRoster !== false) fail('Gunjo Zankyoroku must not become a fixed boss roster');
if (gunjo.fixedMemberCount !== null) fail('Gunjo Zankyoroku member count must remain OPEN/null');
if (gunjo.formalMembersFrozen !== false) fail('Gunjo Zankyoroku formal members must remain OPEN');
if (gunjo.exactIncidentsFrozen !== false) fail('Gunjo Zankyoroku incidents must remain OPEN');
if (gunjo.generationAllowed !== false) fail('Gunjo Zankyoroku generation must remain blocked during listing/visual-authoring');

const foundationMasters = Array.isArray(gunjo.foundationMasters) ? gunjo.foundationMasters : [];
if (foundationMasters.length !== 2) fail('Gunjo Zankyoroku must list exactly two foundation visual masters before incident-specific expansion');
const foundationIds = foundationMasters.map((entry: any) => entry?.masterId);
for (const required of ['gunjo-record-taxonomy-system-master-v1', CANONICAL_GUNJO_MEDIUM_MASTER_ID]) {
  if (!foundationIds.includes(required)) fail(`Gunjo foundation master missing: ${required}`);
}
if (foundationIds.includes(SUPERSEDED_GUNJO_MEDIUM_PLANNING_ID)) fail('superseded Gunjo medium/material planning ID may not remain a Current foundation master');
if (gunjo.foundationMasterIdMigration?.canonicalRecordMediumMasterId !== CANONICAL_GUNJO_MEDIUM_MASTER_ID) fail('Gunjo canonical record-medium master ID migration drifted');
if (gunjo.foundationMasterIdMigration?.supersededPlanningId !== SUPERSEDED_GUNJO_MEDIUM_PLANNING_ID) fail('Gunjo superseded record-medium planning ID history missing');
if (gunjo.foundationMasterIdMigration?.supersededPlanningIdMayReceiveNewAssets !== false) fail('superseded Gunjo planning ID may not receive new assets');
for (const master of foundationMasters) {
  if (master.mandatoryRasterImage !== false) fail(`${String(master.masterId)} must not force raster generation`);
}

const expansionGunjo = Array.isArray(expansion.families)
  ? expansion.families.find((entry: any) => entry?.familyId === 'gunjo-record-foundation-masters')
  : undefined;
if (expansionGunjo) {
  const expansionMasterIds = Array.isArray(expansionGunjo.masterIds) ? expansionGunjo.masterIds : [];
  if (!expansionMasterIds.includes(CANONICAL_GUNJO_MEDIUM_MASTER_ID)) fail('expansion queue is not aligned to canonical Gunjo record-medium master ID');
  if (expansionMasterIds.includes(SUPERSEDED_GUNJO_MEDIUM_PLANNING_ID)) fail('expansion queue still uses superseded Gunjo record-medium planning ID');
}

if (gunjo.futureIncidentMasters?.count !== 'TBD_AFTER_FORMAL_INCIDENT_AUTHORITY') fail('Gunjo incident master count must remain authority-dependent');
if (gunjo.futureIncidentMasters?.generationAllowedNow !== false) fail('Gunjo incident generation must remain blocked');
if (!Array.isArray(gunjo.guideLorebookDbDerivatives) || gunjo.guideLorebookDbDerivatives.length < 4) fail('Gunjo guide/Lorebook/DB derivative list is incomplete');

for (const requiredText of [
  'record taxonomy',
  '本人たちが群青残響録を名乗って集まった',
  'formal member count',
  'formal members',
  'exact incidents',
]) {
  if (!gunjoDoc.includes(requiredText)) fail(`Gunjo Current authority missing expected boundary: ${requiredText}`);
}

if (errors.length > 0) {
  console.error(`Visual Current Group / Record Master check FAILED (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Visual Current Group / Record Master check PASS — Sakuyaza=${currentMembers.length}, Gunjo foundation masters=${foundationMasters.length}, Gunjo record-medium master=${CANONICAL_GUNJO_MEDIUM_MASTER_ID}, Gunjo incident count=OPEN`);
