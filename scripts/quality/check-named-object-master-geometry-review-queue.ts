import { namedObjectVisualSharedSourceEntries } from '../../src/game/data/namedObjectVisualSharedSource.ts';
import {
  activeNamedObjectGeometryReviewQueue,
  heldNamedObjectGeometryReviewQueue,
  NAMED_OBJECT_GEOMETRY_REVIEW_QUEUE_VERSION,
  NAMED_OBJECT_YUI_HOLD_OWNER_ID,
  namedObjectMasterGeometryReviewQueue,
  workingNameNamedObjectGeometryReviewQueue,
} from '../../src/game/data/namedObjectMasterGeometryReviewQueue.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[named-object-master-geometry-review] ${message}`);
}

assert(NAMED_OBJECT_GEOMETRY_REVIEW_QUEUE_VERSION === 1, 'queue version drifted');
assert(namedObjectMasterGeometryReviewQueue.length === namedObjectVisualSharedSourceEntries.length, 'review queue must cover every Named Object shared-source entry');
assert(namedObjectMasterGeometryReviewQueue.length === 21, 'Named Object subject count must remain 21 until source authority changes intentionally');
assert(activeNamedObjectGeometryReviewQueue.length === 20, 'exactly 20 non-Yui Named Objects must be active for geometry review');
assert(heldNamedObjectGeometryReviewQueue.length === 1, 'exactly one Yui-linked Named Object must remain held');
assert(heldNamedObjectGeometryReviewQueue[0]?.ownerId === NAMED_OBJECT_YUI_HOLD_OWNER_ID, 'only Yui-linked Named Object may be held by the current Yui HOLD');

const sourceWorkingNameCount = namedObjectVisualSharedSourceEntries.filter((entry) => entry.namingStatus === 'WORKING').length;
assert(workingNameNamedObjectGeometryReviewQueue.length === sourceWorkingNameCount, 'WORKING-name review count must follow source authority');

const sourceByOwnerId = new Map(namedObjectVisualSharedSourceEntries.map((entry) => [entry.ownerId, entry]));
assert(sourceByOwnerId.size === namedObjectVisualSharedSourceEntries.length, 'Named Object shared source must remain unique by ownerId');
assert(new Set(namedObjectMasterGeometryReviewQueue.map((entry) => entry.assetId)).size === namedObjectMasterGeometryReviewQueue.length, 'Master asset IDs must be unique');
assert(new Set(namedObjectMasterGeometryReviewQueue.map((entry) => entry.sourceEntryId)).size === namedObjectMasterGeometryReviewQueue.length, 'source entry IDs must be unique');

for (const packet of namedObjectMasterGeometryReviewQueue) {
  const source = sourceByOwnerId.get(packet.ownerId);
  assert(source, `${packet.ownerId}: missing shared-source parent`);
  assert(packet.assetId === `artifact-${packet.ownerId}-named-object-master-v1`, `${packet.ownerId}: stable Master assetId drifted`);
  assert(packet.sourceEntryId === source.id, `${packet.ownerId}: sourceEntryId drifted`);
  assert(packet.sourceNamedObjectId === source.sourceNamedObjectId, `${packet.ownerId}: sourceNamedObjectId drifted`);
  assert(packet.ownerDisplayName === source.ownerDisplayName, `${packet.ownerId}: owner display name drifted`);
  assert(packet.displayName === source.displayName, `${packet.ownerId}: object display name drifted`);
  assert(packet.namingStatus === source.namingStatus, `${packet.ownerId}: naming status drifted`);

  const expectedHold = packet.ownerId === NAMED_OBJECT_YUI_HOLD_OWNER_ID;
  const nameWorking = source.namingStatus === 'WORKING';
  assert(packet.subjectHold === expectedHold, `${packet.ownerId}: Yui hold classification drifted`);
  const expectedState = expectedHold
    ? 'HOLD_WITH_YUI'
    : nameWorking
      ? 'CANDIDATE_GEOMETRY_REVIEW_READY_NAME_WORKING_HUMAN_DECISION_REQUIRED'
      : 'CANDIDATE_GEOMETRY_REVIEW_READY_HUMAN_DECISION_REQUIRED';
  assert(packet.reviewState === expectedState, `${packet.ownerId}: review state drifted`);

  assert(source.geometryAuthority === 'CANDIDATE_OBJECT_GEOMETRY', `${packet.ownerId}: source geometry authority unexpectedly promoted`);
  assert(packet.geometryAuthorityAtSource === 'CANDIDATE_OBJECT_GEOMETRY', `${packet.ownerId}: packet geometry authority drifted`);
  assert(source.referenceGenerationReady === false, `${packet.ownerId}: source referenceGenerationReady must remain false until explicit review/promotion`);
  assert(packet.referenceGenerationReadyAtSource === false, `${packet.ownerId}: packet source-ready flag must remain false`);
  assert(packet.referenceGenerationReadyAfterThisPacket === false, `${packet.ownerId}: packet may not promote referenceGenerationReady`);
  assert(packet.imageGenerationAuthorized === false, `${packet.ownerId}: geometry review queue may not authorize image generation`);
  assert(packet.generatedOutputCreatesCanon === false, `${packet.ownerId}: generated output may not create Canon`);
  assert(packet.generatedOutputCreatesGeometryApproval === false, `${packet.ownerId}: generated output may not create geometry approval`);
  assert(packet.generatedOutputCreatesFinalOrRuntimeApproval === false, `${packet.ownerId}: generated output may not create final/runtime approval`);
  assert(packet.humanGeometryReviewRequired === true, `${packet.ownerId}: Human geometry review must remain required`);
  assert(packet.nameApprovalRequiredBeforeReferenceGenerationReady === nameWorking, `${packet.ownerId}: naming gate drifted`);

  assert(packet.authoritySources.includes('src/game/data/namedObjectVisualSharedSource.ts'), `${packet.ownerId}: live shared-source authority path missing`);
  for (const authority of source.authoritySources) {
    assert(packet.authoritySources.includes(authority), `${packet.ownerId}: source authority missing from packet: ${authority}`);
  }

  assert(packet.geometry.frontSilhouette === source.frontSilhouette, `${packet.ownerId}: front silhouette drifted`);
  assert(packet.geometry.backSilhouette === source.backSilhouette, `${packet.ownerId}: back silhouette drifted`);
  assert(packet.geometry.sideSilhouette === source.sideSilhouette, `${packet.ownerId}: side silhouette drifted`);
  assert(packet.geometry.scale === source.scale, `${packet.ownerId}: scale drifted`);
  assert(packet.materialHistory.material === source.material, `${packet.ownerId}: material drifted`);
  assert(packet.materialHistory.wearMarks === source.wearMarks, `${packet.ownerId}: wear marks drifted`);
  assert(packet.materialHistory.repairMarks === source.repairMarks, `${packet.ownerId}: repair marks drifted`);
  assert(packet.materialHistory.historyMarkRule === source.historyMarkRule, `${packet.ownerId}: history-mark rule drifted`);
  assert(packet.useAndStorage.handlingGesture === source.handlingGesture, `${packet.ownerId}: handling gesture drifted`);
  assert(packet.useAndStorage.storageMethod === source.storageMethod, `${packet.ownerId}: storage method drifted`);

  assert(packet.storyAndCommercialBoundary.storyAuthorityLevel === source.storyAuthorityLevel, `${packet.ownerId}: Story authority boundary drifted`);
  assert(packet.storyAndCommercialBoundary.spoilerBoundary === source.spoilerBoundary, `${packet.ownerId}: spoiler boundary drifted`);
  assert(packet.storyAndCommercialBoundary.replicaSafeDetail === source.replicaSafeDetail, `${packet.ownerId}: replica-safe detail drifted`);
  assert(packet.storyAndCommercialBoundary.entryGoodsAllowed === source.entryGoodsAllowed, `${packet.ownerId}: entry-goods flag drifted`);
  assert(packet.storyAndCommercialBoundary.collectorGoodsAllowed === source.collectorGoodsAllowed, `${packet.ownerId}: collector-goods flag drifted`);
  assert(packet.storyAndCommercialBoundary.functionalReplicaAllowed === false, `${packet.ownerId}: functional replica must remain blocked`);
  assert(packet.storyAndCommercialBoundary.premiumReplicaAllowed === false, `${packet.ownerId}: premium replica must remain blocked`);

  assert(packet.authoringSeed.generationBriefSeed === source.generationBriefSeed, `${packet.ownerId}: generationBriefSeed drifted`);
  assert(packet.authoringSeed.avoid.length === source.avoid.length, `${packet.ownerId}: avoid rules drifted`);
  assert(packet.authoringSeed.negativePromptHints.length === source.negativePromptHints.length, `${packet.ownerId}: negative prompt hints drifted`);
  for (const avoid of source.avoid) assert(packet.authoringSeed.avoid.includes(avoid), `${packet.ownerId}: source avoid missing: ${avoid}`);

  assert(packet.reviewChecklist.length >= 10, `${packet.ownerId}: review checklist too small`);
  const review = packet.reviewChecklist.join('\n').toLowerCase();
  for (const term of ['front/back/side', 'scale', 'material', 'wear', 'repair', 'handling', 'storage', 'canon', 'toumon']) {
    assert(review.includes(term), `${packet.ownerId}: review checklist missing required concept: ${term}`);
  }
  if (expectedHold) assert(review.includes('hold'), `${packet.ownerId}: held packet must explicitly state HOLD`);
  if (nameWorking) assert(review.includes('naming remains working'), `${packet.ownerId}: WORKING name must remain an explicit promotion blocker`);
}

console.log(JSON.stringify({
  status: 'PASS',
  sourceSubjects: namedObjectVisualSharedSourceEntries.length,
  geometryReviewPackets: namedObjectMasterGeometryReviewQueue.length,
  activeHumanGeometryReview: activeNamedObjectGeometryReviewQueue.length,
  heldPackets: heldNamedObjectGeometryReviewQueue.length,
  workingNamePackets: workingNameNamedObjectGeometryReviewQueue.length,
  sourceReferenceGenerationReady: 0,
  promotedReferenceGenerationReady: 0,
  imageGenerationAuthorized: false,
  humanGeometryReviewRequired: true,
}, null, 2));
