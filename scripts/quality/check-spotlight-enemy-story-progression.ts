import {
  currentGroupInteractionEntries,
} from '../../src/game/data/currentGroupInteractionSource.ts';
import {
  relationshipStageIntermissionEntries,
  relationshipStageIntermissionSummary,
} from '../../src/game/data/relationshipStageIntermissionSource.ts';
import {
  currentRelationshipSpeechProgressionSummary,
} from '../../src/game/data/relationshipSpeechProgressionSource.ts';
import {
  series1StageCampaignContentEntries,
} from '../../src/game/data/series1StageCampaignContentSource.ts';
import {
  spotlightEnemyCharacterEntries,
} from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import {
  SPOTLIGHT_ENEMY_FRAGMENT_KINDS,
  spotlightEnemyStoryFragments,
  spotlightEnemyStoryFragmentSummary,
} from '../../src/game/data/spotlightEnemyStoryFragmentSource.ts';
import { TITLE1_COLLECTION_SECTION_IDS } from '../../src/game/data/title1AchievementRewardCollectionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Spotlight Enemy Story Progression] ${message}`);
}

const stageNoById = new Map(series1StageCampaignContentEntries.map((stage) => [stage.stageId, stage.stageNo]));
const spotlightIds = new Set(spotlightEnemyCharacterEntries.map((entry) => entry.enemyId));
const groupSceneIds = new Set(currentGroupInteractionEntries.map((entry) => entry.id));

assert(spotlightEnemyCharacterEntries.length === 8, 'Spotlight Enemy source must remain 8');
assert(spotlightEnemyStoryFragmentSummary.fragmentCount === 24, 'Spotlight8 must expose exactly 24 fragments');
assert(spotlightEnemyStoryFragmentSummary.spotlightEnemyCount === 8, 'fragment source must cover all Spotlight8');
assert(spotlightEnemyStoryFragmentSummary.collectionSection === 'bestiary', 'Spotlight fragments belong to bestiary collection lane');
assert(TITLE1_COLLECTION_SECTION_IDS.includes('bestiary'), 'bestiary collection lane must exist');
assert(spotlightEnemyStoryFragmentSummary.optionalReading === true, 'enemy fragment reading must remain optional');
assert(spotlightEnemyStoryFragmentSummary.grantsCombatPower === false, 'enemy story reading may not grant combat power');
assert(spotlightEnemyStoryFragmentSummary.requiredForStoryComplete === false, 'enemy story reading may not gate Story Complete');
assert(spotlightEnemyStoryFragmentSummary.requiredForAllLights === false, '24 new fragments may not silently change All Lights denominator');
assert(spotlightEnemyStoryFragmentSummary.mainMysteryAnswerFrozen === false, 'fragment source may not freeze Main Mystery');
assert(spotlightEnemyStoryFragmentSummary.runtimeAutoPromotionAllowed === false, 'fragment source must remain content-only');

const fragmentIds = new Set<string>();
for (const fragment of spotlightEnemyStoryFragments) {
  assert(!fragmentIds.has(fragment.id), `duplicate fragment ID: ${fragment.id}`);
  fragmentIds.add(fragment.id);
  assert(spotlightIds.has(fragment.enemyId), `${fragment.id}: fragment owner is not Spotlight8`);
  assert(stageNoById.has(fragment.unlockAfterStageId), `${fragment.id}: unknown Stage unlock`);
  assert(fragment.publicText.length >= 45, `${fragment.id}: public fragment text too shallow`);
  assert(fragment.evidenceObject.length >= 5, `${fragment.id}: evidence object missing`);
  assert(fragment.interpretationBoundary.length >= 15, `${fragment.id}: interpretation boundary missing`);
  assert(fragment.collectionSection === 'bestiary', `${fragment.id}: collection placement drift`);
  assert(fragment.optionalReading === true, `${fragment.id}: optional reading drift`);
  assert(fragment.grantsCombatPower === false, `${fragment.id}: story text may not grant power`);
  assert(fragment.requiredForStoryComplete === false, `${fragment.id}: Story Complete gate forbidden`);
  assert(fragment.requiredForAllLights === false, `${fragment.id}: All Lights denominator auto-expansion forbidden`);
  assert(fragment.mainMysteryAnswerFrozen === false, `${fragment.id}: Main Mystery answer freeze forbidden`);
  assert(fragment.runtimeAutoPromotionAllowed === false, `${fragment.id}: runtime auto-promotion forbidden`);
}

for (const enemy of spotlightEnemyCharacterEntries) {
  const fragments = spotlightEnemyStoryFragments.filter((fragment) => fragment.enemyId === enemy.enemyId);
  assert(fragments.length === 3, `${enemy.enemyId}: needs exactly three story fragments`);
  assert(
    JSON.stringify(fragments.map((fragment) => fragment.kind)) === JSON.stringify(SPOTLIGHT_ENEMY_FRAGMENT_KINDS),
    `${enemy.enemyId}: fragment order must remain THREAT_TRACE -> PAST_FRAGMENT -> REINTERPRETATION`,
  );
  const stageNos = fragments.map((fragment) => stageNoById.get(fragment.unlockAfterStageId) ?? 0);
  assert(stageNos[0] <= stageNos[1] && stageNos[1] <= stageNos[2], `${enemy.enemyId}: story reveal may not run backwards in campaign order`);
  assert(fragments[0].publicText !== fragments[1].publicText && fragments[1].publicText !== fragments[2].publicText, `${enemy.enemyId}: fragment roles must be distinct`);
}

assert(currentRelationshipSpeechProgressionSummary.directedTrackCount === 48, 'intermission source depends on Current24 bidirectional speech authority');
assert(relationshipStageIntermissionSummary.sceneLaneCount === 12, 'all 12 group lanes must be placed');
assert(relationshipStageIntermissionSummary.placementCount === 24, 'group lanes need first + repeat placement');
assert(relationshipStageIntermissionSummary.currentGroupSceneCount === 12, 'group scene source drift');
assert(relationshipStageIntermissionSummary.allGroupScenesPlaced === true, 'every group scene must receive stage placement');
assert(relationshipStageIntermissionSummary.choiceOrReadRequiredForPower === false, 'relationship reading must not gate power');
assert(relationshipStageIntermissionSummary.requiredForStoryComplete === false, 'relationship intermissions must not gate Title1 ending');
assert(relationshipStageIntermissionSummary.scriptCanon === false, 'intermission lane is not final dialogue script');
assert(relationshipStageIntermissionSummary.runtimeAutoPromotionAllowed === false, 'intermission source must remain content-only');

const placementSceneIds = new Set<string>();
for (const entry of relationshipStageIntermissionEntries) {
  assert(groupSceneIds.has(entry.sceneId), `${entry.sceneId}: placement references unknown group lane`);
  assert(!placementSceneIds.has(entry.sceneId), `${entry.sceneId}: duplicate placement record`);
  placementSceneIds.add(entry.sceneId);
  const firstNo = stageNoById.get(entry.firstAfterStageId);
  const repeatNo = stageNoById.get(entry.repeatAfterStageId);
  assert(firstNo !== undefined && repeatNo !== undefined, `${entry.sceneId}: unknown Stage`);
  assert(firstNo < repeatNo, `${entry.sceneId}: repeat scene must occur after first scene`);
  assert(['ALLY', 'TRUST'].includes(entry.firstEligibleMoment), `${entry.sceneId}: first semantic moment too late/invalid`);
  assert(['TRUST', 'DEEP_TRUST', 'DAWN'].includes(entry.repeatEligibleMoment), `${entry.sceneId}: repeat semantic moment invalid`);
  assert(entry.choiceOrReadRequiredForPower === false, `${entry.sceneId}: reading/picking dialogue may not gate combat power`);
  assert(entry.requiredForStoryComplete === false, `${entry.sceneId}: optional relationship scene may not gate Story Complete`);
  assert(entry.scriptCanon === false, `${entry.sceneId}: production lane may not pretend final script`);
  assert(entry.runtimeAutoPromotionAllowed === false, `${entry.sceneId}: runtime auto-promotion forbidden`);
}
assert(placementSceneIds.size === currentGroupInteractionEntries.length, 'group placement coverage must be 1:1');

for (const token of ['病気', '死別', '犠牲']) {
  const dreamPast = spotlightEnemyStoryFragments.find((fragment) => fragment.id === 'dream-wave-02-until-morning');
  assert(dreamPast?.interpretationBoundary.includes(token) || dreamPast?.publicText.includes(token), `Dream Wave anti-cheap-tragedy guard missing token: ${token}`);
}

console.log(
  `Spotlight Enemy Story Progression: PASS (spotlight=8, fragments=${spotlightEnemyStoryFragments.length}, groupLanes=${relationshipStageIntermissionSummary.sceneLaneCount}, placements=${relationshipStageIntermissionSummary.placementCount})`,
);
