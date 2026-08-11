import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import { spotlightEnemyCharacterEntries } from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import {
  spotlightEnemyRecognitionEntries,
  spotlightEnemyRecognitionSummary,
} from '../../src/game/data/spotlightEnemyRecognitionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Spotlight Enemy Recognition] ${message}`);
}

const productionById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const spotlightIds = new Set(spotlightEnemyCharacterEntries.map((entry) => entry.enemyId));

assert(enemyProductionEntries.length === 48, 'Enemy roster must remain exactly 48');
assert(spotlightEnemyCharacterEntries.length === 8, 'Spotlight Enemy source must remain 8');
assert(spotlightEnemyRecognitionSummary.recognitionEntryCount === 8, 'all Spotlight8 need recognition guides');
assert(spotlightEnemyRecognitionSummary.iconicBossCount === 3, 'three Current bosses should be iconic-boss recognition entries');
assert(spotlightEnemyRecognitionSummary.recurringEliteCount === 4, 'four Spotlight nonbosses should be recurring-elite entries');
assert(spotlightEnemyRecognitionSummary.pettyRivalCount === 1, 'Omburo Nameplate should occupy one petty-rival lane');
assert(spotlightEnemyRecognitionSummary.allReuseEnemy48 === true, 'recognition guide may only reuse Enemy48');
assert(spotlightEnemyRecognitionSummary.geometryOverrideAllowed === false, 'recognition layer may not override canonical geometry');
assert(spotlightEnemyRecognitionSummary.paletteOverrideAllowed === false, 'recognition layer may not override canonical palette');
assert(spotlightEnemyRecognitionSummary.finalArtApproved === false, 'recognition guide must not pretend final art approval');
assert(spotlightEnemyRecognitionSummary.enemyRosterExpansionAllowed === false, 'Enemy49 must not be created');
assert(spotlightEnemyRecognitionSummary.runtimeAutoPromotionAllowed === false, 'recognition content may not auto-promote runtime');

const seen = new Set<string>();
for (const entry of spotlightEnemyRecognitionEntries) {
  assert(!seen.has(entry.enemyId), `duplicate recognition entry: ${entry.enemyId}`);
  seen.add(entry.enemyId);
  assert(spotlightIds.has(entry.enemyId), `${entry.enemyId}: not part of Spotlight8`);
  const production = productionById.get(entry.enemyId);
  assert(production, `${entry.enemyId}: not part of Enemy48 production database`);
  assert(entry.baseEnemyName === production.name, `${entry.enemyId}: must derive name from Enemy48 authority`);
  assert(entry.baseSilhouetteAuthority === production.silhouette, `${entry.enemyId}: silhouette authority drift`);
  assert(entry.baseAttackCueAuthority === production.attackCue, `${entry.enemyId}: attack cue authority drift`);
  assert(JSON.stringify(entry.basePaletteAuthority) === JSON.stringify(production.palette), `${entry.enemyId}: palette authority drift`);
  assert(entry.signatureGesture.length >= 20, `${entry.enemyId}: signature gesture too shallow`);
  assert(entry.entranceRitual.length >= 20, `${entry.enemyId}: entrance ritual too shallow`);
  assert(entry.idleRitual.length >= 20, `${entry.enemyId}: idle ritual too shallow`);
  assert(entry.attackAnticipationDelta.length >= 20, `${entry.enemyId}: attack anticipation delta too shallow`);
  assert(entry.defeatGesture.length >= 20, `${entry.enemyId}: defeat gesture too shallow`);
  assert(entry.recurrenceRule.length >= 20, `${entry.enemyId}: recurrence rule too shallow`);
  assert(entry.collectionPose.length >= 15, `${entry.enemyId}: collection pose too shallow`);
  assert(entry.soundTexture.length >= 15, `${entry.enemyId}: sound texture too shallow`);
  assert(entry.humanizingBeatWithoutAbsolution.length >= 20, `${entry.enemyId}: humanizing beat too shallow`);
  assert(entry.mobileRecognitionRule.length >= 20, `${entry.enemyId}: mobile recognition rule too shallow`);
  assert(entry.accessibilityRule.length >= 15, `${entry.enemyId}: accessibility rule too shallow`);
  assert(entry.forbiddenShortcut.length >= 20, `${entry.enemyId}: copy/shortcut guard too shallow`);
  assert(entry.geometryOverrideAllowed === false, `${entry.enemyId}: geometry override forbidden`);
  assert(entry.paletteOverrideAllowed === false, `${entry.enemyId}: palette override forbidden`);
  assert(entry.assetProductionStatus === 'RECOGNITION_GUIDE_NOT_FINAL_ART', `${entry.enemyId}: final-art claim forbidden`);
  assert(entry.enemyRosterExpansionAllowed === false, `${entry.enemyId}: Enemy48 boundary drift`);
  assert(entry.runtimeAutoPromotionAllowed === false, `${entry.enemyId}: runtime auto-promotion forbidden`);
}
assert(seen.size === spotlightIds.size, 'recognition source must cover Spotlight8 exactly once');

const externalNames = ['ベルモット', '奈落', 'エンヴィー', 'フリーザ', 'DIO', 'ヒソカ', 'メルエム', 'グリフィス', '猗窩座'];
const serialized = JSON.stringify(spotlightEnemyRecognitionEntries);
for (const name of externalNames) {
  assert(!serialized.includes(name), `external villain identity leaked into production recognition source: ${name}`);
}

console.log(`Spotlight Enemy Recognition: PASS (entries=${seen.size}, bosses=3, recurring=4, petty=1, Enemy48 preserved)`);
