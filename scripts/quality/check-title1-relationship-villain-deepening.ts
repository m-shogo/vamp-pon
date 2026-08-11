import { readFileSync } from 'node:fs';

import {
  currentGroupInteractionEntries,
  currentGroupInteractionSummary,
} from '../../src/game/data/currentGroupInteractionSource.ts';
import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventory,
  currentRelationshipInventoryById,
} from '../../src/game/data/currentRelationshipInventory.ts';
import {
  RELATIONSHIP_SPEECH_MOMENTS,
  currentRelationshipSpeechProgressionEntries,
  currentRelationshipSpeechProgressionSummary,
} from '../../src/game/data/relationshipSpeechProgressionSource.ts';
import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import {
  spotlightEnemyCharacterEntries,
  spotlightEnemyCharacterSummary,
} from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import { stageProductionEntries } from '../../src/game/data/stageProductionDatabase.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Title1 Relationship/Villain Deepening] ${message}`);
}

const currentIds = new Set(CURRENT_RELATIONSHIP_CHARACTER_IDS);
const futureIds = new Set([
  'hiyori', 'serika', 'chloe', 'renji', 'touma', 'kuu', 'yomo', 'noa', 'rum', 'maki', 'suzu', 'io', 'kai', 'nao', 'amane',
]);
const stageIds = new Set(stageProductionEntries.map((stage) => stage.id));
const enemyById = new Map(enemyProductionEntries.map((enemy) => [enemy.id, enemy]));

assert(currentRelationshipInventory.length === 24, 'Current relationship inventory must remain 24');
assert(currentRelationshipSpeechProgressionSummary.relationCount === 24, 'speech progression must cover Current24 relations');
assert(currentRelationshipSpeechProgressionSummary.directedTrackCount === 48, 'speech progression must have 48 directed tracks');
assert(currentRelationshipSpeechProgressionSummary.momentCount === 6, 'speech progression must keep six semantic moments');
assert(RELATIONSHIP_SPEECH_MOMENTS[4] === 'CRISIS', 'CRISIS must stay separate from monotonic Bond growth');
assert(
  JSON.stringify(currentRelationshipSpeechProgressionSummary.nonRomanceLockedRelationIds) === JSON.stringify(['yui-asa', 'ritsu-koyori']),
  'non-romance locks must remain Yui/Asa and Ritsu/Koyori only',
);
assert(currentRelationshipSpeechProgressionSummary.numericBondThresholdsLocked === false, 'numeric Bond thresholds must stay unfrozen');
assert(currentRelationshipSpeechProgressionSummary.runtimeAutoPromotionAllowed === false, 'speech source must stay content-only');

const relationIds = new Set<string>();
for (const entry of currentRelationshipSpeechProgressionEntries) {
  assert(!relationIds.has(entry.relationId), `duplicate speech relation: ${entry.relationId}`);
  relationIds.add(entry.relationId);
  const relation = currentRelationshipInventoryById.get(entry.relationId);
  assert(relation, `speech relation missing from Current inventory: ${entry.relationId}`);
  const expected = new Set(relation.participants);
  assert(entry.tracks.length === 2, `${entry.relationId}: two directed tracks required`);
  const seenSpeakers = new Set<string>();
  for (const item of entry.tracks) {
    assert(expected.has(item.speakerId), `${entry.relationId}: speaker outside relation`);
    assert(expected.has(item.targetId), `${entry.relationId}: target outside relation`);
    assert(item.speakerId !== item.targetId, `${entry.relationId}: self-track is invalid`);
    assert(!seenSpeakers.has(item.speakerId), `${entry.relationId}: duplicate speaker track`);
    seenSpeakers.add(item.speakerId);
    assert(item.addressPath.length === 6, `${entry.relationId}/${item.speakerId}: address path must have six moments`);
    assert(item.speechDeltaPath.length === 6, `${entry.relationId}/${item.speakerId}: speech path must have six moments`);
    assert(item.intimacySignalPath.length === 6, `${entry.relationId}/${item.speakerId}: intimacy path must have six moments`);
    assert(item.addressPath.every((value) => value.trim().length > 0), `${entry.relationId}/${item.speakerId}: empty address`);
    assert(item.speechDeltaPath.every((value) => value.trim().length > 0), `${entry.relationId}/${item.speakerId}: empty speech delta`);
    assert(item.intimacySignalPath.every((value) => value.trim().length > 0), `${entry.relationId}/${item.speakerId}: empty intimacy signal`);
    assert(item.invariant.trim().length > 0, `${entry.relationId}/${item.speakerId}: invariant missing`);
    assert(!futureIds.has(item.speakerId) && !futureIds.has(item.targetId), `${entry.relationId}: Future15 leaked into Current speech`);
  }
  assert([...expected].every((id) => seenSpeakers.has(id)), `${entry.relationId}: both directions must be authored`);
  assert(entry.runtimeAutoPromotionAllowed === false, `${entry.relationId}: runtime auto-promotion must stay false`);
}

assert(currentGroupInteractionSummary.sceneCount === 12, 'group interaction source must keep 12 scene lanes');
assert(currentGroupInteractionSummary.characterCountCovered === 21, 'all Current21 must appear in group scenes');
assert(currentGroupInteractionSummary.minimumSceneCountPerCurrentCharacter >= 1, 'every Current21 character needs a group scene');
assert(currentGroupInteractionSummary.maxParticipantsPerScene <= 5, 'group scene must stay small (<=5 participants)');
assert(currentGroupInteractionSummary.allCastSceneCount === 0, 'all-cast scene must not be introduced');
assert(currentGroupInteractionSummary.scriptCanon === false, 'group scene seeds are not final script Canon');

const groupIds = new Set<string>();
for (const entry of currentGroupInteractionEntries) {
  assert(!groupIds.has(entry.id), `duplicate group scene ID: ${entry.id}`);
  groupIds.add(entry.id);
  assert(entry.participants.length >= 3 && entry.participants.length <= 5, `${entry.id}: group size must be 3..5`);
  assert(new Set(entry.participants).size === entry.participants.length, `${entry.id}: duplicate participant`);
  assert(entry.participants.every((id) => currentIds.has(id)), `${entry.id}: non-Current participant`);
  assert(entry.participants.every((id) => !futureIds.has(id)), `${entry.id}: Future15 leaked into group scene`);
  assert(entry.participants.includes(entry.primaryPair[0]) && entry.participants.includes(entry.primaryPair[1]), `${entry.id}: primary pair must be inside scene`);
  assert(entry.stageEchoIds.every((id) => stageIds.has(id)), `${entry.id}: unknown Stage echo ID`);
  assert(entry.sideActions.length >= 1, `${entry.id}: side action required to avoid two-person scene disguised as group scene`);
  assert(entry.scriptCanon === false && entry.runtimeAutoPromotionAllowed === false, `${entry.id}: content boundary drift`);
}

assert(enemyProductionEntries.length === 48, 'Enemy roster must remain exactly 48');
assert(spotlightEnemyCharacterSummary.spotlightCount === 8, 'exactly eight spotlight enemies expected in v1');
assert(spotlightEnemyCharacterSummary.enemyRosterCount === 48, 'spotlight source must observe Enemy48');
assert(spotlightEnemyCharacterSummary.bossSpotlightCount === 3, 'all three current bosses must be spotlighted');
assert(spotlightEnemyCharacterSummary.nonBossSpotlightCount === 5, 'five non-boss recurring spotlight enemies expected');
assert(spotlightEnemyCharacterSummary.allExistingEnemyIds === true, 'spotlight enemies must reuse existing Enemy48 IDs');
assert(spotlightEnemyCharacterSummary.enemyRosterExpansionAllowed === false, 'Enemy49 must not be created');
assert(spotlightEnemyCharacterSummary.sympathyDoesNotEraseHarm === true, 'past story must not absolve current harm');

const spotlightIds = new Set<string>();
for (const entry of spotlightEnemyCharacterEntries) {
  assert(!spotlightIds.has(entry.enemyId), `duplicate spotlight enemy: ${entry.enemyId}`);
  spotlightIds.add(entry.enemyId);
  assert(enemyById.has(entry.enemyId), `spotlight enemy outside Enemy48: ${entry.enemyId}`);
  assert(entry.mirrorCharacterIds.length >= 3, `${entry.enemyId}: needs multiple Current21 relationship mirrors`);
  assert(entry.mirrorCharacterIds.every((id) => currentIds.has(id)), `${entry.enemyId}: unknown mirror character`);
  assert(entry.mirrorCharacterIds.every((id) => !futureIds.has(id)), `${entry.enemyId}: Future15 mirror leak`);
  assert(entry.storyBeats.length >= 3, `${entry.enemyId}: encounter + reinterpretation beats required`);
  assert(entry.storyBeats.every((beat) => stageIds.has(beat.stageId)), `${entry.enemyId}: story beat references unknown Stage`);
  assert(entry.characterHook.trim().length > 20, `${entry.enemyId}: character hook too shallow`);
  assert(entry.pastStory.trim().length > 30, `${entry.enemyId}: past story too shallow`);
  assert(entry.contradiction.trim().length > 20, `${entry.enemyId}: contradiction required`);
  assert(entry.sympathyDoesNotEraseHarm === true, `${entry.enemyId}: sympathy boundary drift`);
  assert(entry.redemptionRequired === false, `${entry.enemyId}: forced redemption is forbidden`);
  assert(entry.enemyRosterExpansionAllowed === false, `${entry.enemyId}: roster expansion must stay false`);
  assert(entry.runtimeAutoPromotionAllowed === false, `${entry.enemyId}: runtime auto-promotion must stay false`);
}
for (const bossId of ['boss_name_without_owner', 'boss_closed_morning_box', 'boss_night_without_route']) {
  assert(spotlightIds.has(bossId), `missing Current boss spotlight: ${bossId}`);
}

const spotlightSource = readFileSync('src/game/data/spotlightEnemyCharacterSource.ts', 'utf8');
for (const copiedCharacterName of ['ベルモット', '奈落', 'エンヴィー', 'フリーザ', 'DIO', 'ヒソカ', 'メルエム', 'グリフィス', '猗窩座']) {
  assert(!spotlightSource.includes(copiedCharacterName), `external villain name leaked into machine Canon: ${copiedCharacterName}`);
}

const humanDoc = readFileSync('docs/title1-character-relationship-villain-deepening-v1.md', 'utf8');
assert(humanDoc.includes('Enemy49を追加しない'), 'human doc must keep Enemy48 boundary');
assert(humanDoc.includes('悲しい過去は免罪符にしない'), 'human doc must keep no-absolution rule');
assert(humanDoc.includes('全員を最終的に呼び捨てへしない'), 'human doc must keep non-uniform address progression');
assert(humanDoc.includes('全Current21を最低1scene以上へ含める'), 'human doc must keep ensemble coverage target');
assert(humanDoc.includes('他作品のキャラクターをコピーしない'), 'human doc must keep inspiration/copy boundary');

console.log(
  `Title1 Relationship/Villain Deepening: PASS (relations=${currentRelationshipSpeechProgressionSummary.relationCount}, directed=${currentRelationshipSpeechProgressionSummary.directedTrackCount}, groups=${currentGroupInteractionSummary.sceneCount}, current21=${currentGroupInteractionSummary.characterCountCovered}, spotlight=${spotlightEnemyCharacterSummary.spotlightCount}, enemyRoster=${enemyProductionEntries.length})`,
);
