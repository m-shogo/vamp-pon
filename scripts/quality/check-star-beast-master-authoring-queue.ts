import { starBeastVisualSharedSourceEntries } from '../../src/game/data/starBeastVisualSharedSource.ts';
import {
  activeStarBeastMasterAuthoringQueue,
  heldStarBeastMasterAuthoringQueue,
  STAR_BEAST_MASTER_AUTHORING_QUEUE_VERSION,
  STAR_BEAST_MASTER_YUI_HOLD_CHARACTER_ID,
  starBeastMasterAuthoringQueue,
} from '../../src/game/data/starBeastMasterAuthoringQueue.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[star-beast-master-authoring-queue] ${message}`);
}

assert(STAR_BEAST_MASTER_AUTHORING_QUEUE_VERSION === 1, 'queue version drifted');
assert(starBeastMasterAuthoringQueue.length === starBeastVisualSharedSourceEntries.length, 'queue must cover every Star Beast shared-source entry');
assert(starBeastMasterAuthoringQueue.length === 21, 'Star Beast subject count must remain 21 until source authority changes intentionally');
assert(activeStarBeastMasterAuthoringQueue.length === 20, 'exactly 20 non-Yui Star Beasts must be active for authoring review');
assert(heldStarBeastMasterAuthoringQueue.length === 1, 'exactly one Yui-linked Star Beast must remain held');
assert(heldStarBeastMasterAuthoringQueue[0]?.characterId === STAR_BEAST_MASTER_YUI_HOLD_CHARACTER_ID, 'only Yui-linked Star Beast may be held by the current Yui HOLD');

const sourceByCharacterId = new Map(starBeastVisualSharedSourceEntries.map((entry) => [entry.characterId, entry]));
assert(sourceByCharacterId.size === starBeastVisualSharedSourceEntries.length, 'Star Beast shared source must remain unique by characterId');
assert(new Set(starBeastMasterAuthoringQueue.map((entry) => entry.assetId)).size === starBeastMasterAuthoringQueue.length, 'Master asset IDs must be unique');
assert(new Set(starBeastMasterAuthoringQueue.map((entry) => entry.sourceEntryId)).size === starBeastMasterAuthoringQueue.length, 'source entry IDs must be unique');

for (const packet of starBeastMasterAuthoringQueue) {
  const source = sourceByCharacterId.get(packet.characterId);
  assert(source, `${packet.characterId}: missing shared-source parent`);
  assert(packet.assetId === `star-beast-${packet.characterId}-master-v1`, `${packet.characterId}: stable Master assetId drifted`);
  assert(packet.sourceEntryId === source.id, `${packet.characterId}: sourceEntryId drifted`);
  assert(packet.characterDisplayName === source.characterDisplayName, `${packet.characterId}: display name drifted`);
  assert(packet.constellationKey === source.constellationKey, `${packet.characterId}: constellation key drifted`);
  assert(packet.species === source.species, `${packet.characterId}: species drifted`);
  assert(packet.scope === source.scope, `${packet.characterId}: scope drifted`);
  assert(packet.themeHex === source.themeHex, `${packet.characterId}: theme color drifted`);
  assert(source.referenceGenerationReady === true && packet.referenceGenerationReadyAtSource === true, `${packet.characterId}: referenceGenerationReady parent gate weakened`);

  const expectedHold = packet.characterId === STAR_BEAST_MASTER_YUI_HOLD_CHARACTER_ID;
  assert(packet.subjectHold === expectedHold, `${packet.characterId}: Yui hold classification drifted`);
  assert(packet.authoringState === (expectedHold ? 'HOLD_WITH_YUI' : 'SOURCE_BACKED_PACKET_READY_HUMAN_PROMPT_REVIEW_REQUIRED'), `${packet.characterId}: authoring state drifted`);

  assert(packet.imageGenerationAuthorized === false, `${packet.characterId}: authoring queue may not authorize image generation`);
  assert(packet.generatedOutputCreatesCanon === false, `${packet.characterId}: generated candidate may not create Canon`);
  assert(packet.generatedOutputCreatesMasterApproval === false, `${packet.characterId}: generated candidate may not create Master approval`);
  assert(packet.generatedOutputCreatesRuntimeApproval === false, `${packet.characterId}: generated candidate may not create runtime approval`);
  assert(packet.humanPromptReviewRequired === true, `${packet.characterId}: Human prompt review must remain required`);
  assert(packet.humanVisualReviewRequired === true, `${packet.characterId}: Human visual review must remain required`);

  assert(packet.authoritySources.includes('src/game/data/starBeastVisualSharedSource.ts'), `${packet.characterId}: live shared-source authority path missing`);
  for (const authority of source.authoritySources) {
    assert(packet.authoritySources.includes(authority), `${packet.characterId}: source authority missing from packet: ${authority}`);
  }

  assert(packet.prompt.identity.length >= 4, `${packet.characterId}: identity prompt coverage too small`);
  assert(packet.prompt.construction.length >= 4, `${packet.characterId}: construction prompt coverage too small`);
  assert(packet.prompt.poses.length >= 4, `${packet.characterId}: pose prompt coverage too small`);
  assert(packet.prompt.materialAndMerch.length >= 3, `${packet.characterId}: material/merch prompt coverage too small`);
  assert(packet.prompt.colorAndMarking.length >= 3, `${packet.characterId}: color/marking prompt coverage too small`);
  assert(packet.prompt.recognition.length >= 2, `${packet.characterId}: recognition prompt coverage too small`);
  assert(packet.prompt.negative.length >= source.avoid.length, `${packet.characterId}: negative prompt lost source avoid rules`);
  assert(packet.prompt.sourceBriefSeed === source.generationBriefSeed, `${packet.characterId}: generationBriefSeed drifted`);

  const constructionText = packet.prompt.construction.join('\n');
  assert(constructionText.includes(source.frontSilhouette), `${packet.characterId}: front silhouette missing from packet`);
  assert(constructionText.includes(source.sideSilhouette), `${packet.characterId}: side silhouette missing from packet`);
  assert(constructionText.includes(source.faceRule), `${packet.characterId}: face rule missing from packet`);
  const merchText = packet.prompt.materialAndMerch.join('\n');
  assert(merchText.includes(source.materialFeel), `${packet.characterId}: material feel missing from packet`);
  assert(merchText.includes(source.oneColorRule), `${packet.characterId}: one-color rule missing from packet`);
  assert(merchText.includes(source.plushSewingRule), `${packet.characterId}: plush rule missing from packet`);

  const negativeText = packet.prompt.negative.join('\n').toLowerCase();
  for (const sourceAvoid of source.avoid) {
    assert(negativeText.includes(sourceAvoid.toLowerCase()), `${packet.characterId}: source avoid rule missing from negative prompt`);
  }
  assert(packet.reviewChecklist.length >= 10, `${packet.characterId}: review checklist too small`);
  const reviewText = packet.reviewChecklist.join('\n').toLowerCase();
  assert(reviewText.includes('canon'), `${packet.characterId}: review checklist must retain Canon boundary`);
  assert(reviewText.includes('toumon'), `${packet.characterId}: review checklist must retain Toumon boundary`);
  assert(reviewText.includes('one-color'), `${packet.characterId}: review checklist must cover one-color recognition`);
  assert(reviewText.includes('plush'), `${packet.characterId}: review checklist must cover plush translation`);
  if (expectedHold) {
    assert(reviewText.includes('hold'), `${packet.characterId}: held review checklist must explicitly state HOLD`);
  } else {
    assert(reviewText.includes('human prompt review'), `${packet.characterId}: active packet must require Human prompt review`);
  }
}

console.log(JSON.stringify({
  status: 'PASS',
  sourceSubjects: starBeastVisualSharedSourceEntries.length,
  authoringPackets: starBeastMasterAuthoringQueue.length,
  activePromptReviewPackets: activeStarBeastMasterAuthoringQueue.length,
  heldPackets: heldStarBeastMasterAuthoringQueue.length,
  heldCharacterIds: heldStarBeastMasterAuthoringQueue.map((entry) => entry.characterId),
  imageGenerationAuthorized: false,
  humanPromptReviewRequired: true,
  humanVisualReviewRequired: true,
}, null, 2));
