import {
  worldEffectGenerationHandoffById,
  worldEffectGenerationHandoffs,
  worldEffectGenerationHandoffSummary,
} from '../../src/game/data/worldEffectGenerationHandoff.ts';
import { worldEffectSharedSourceEntries } from '../../src/game/data/worldEffectSharedSource.ts';

function fail(message: string): never {
  throw new Error(`[World Effect Generation Handoff] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const expectedIds = worldEffectSharedSourceEntries.map((entry) => entry.id);
assert(worldEffectGenerationHandoffs.length === worldEffectSharedSourceEntries.length, 'source coverage drift');
assert(
  JSON.stringify(worldEffectGenerationHandoffs.map((entry) => entry.id)) === JSON.stringify(expectedIds),
  'event ID/order drift',
);
assert(new Set(worldEffectGenerationHandoffs.map((entry) => entry.handoffId)).size === worldEffectGenerationHandoffs.length, 'duplicate handoff ID');

const expectedGenerated = ['WEAPON_EVOLUTION', 'KOKUYOU', 'BOSS_DEATH'];
assert(
  JSON.stringify(worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents) === JSON.stringify(expectedGenerated),
  `generated texture lane drift: ${worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents.join(', ')}`,
);
assert(
  JSON.stringify(worldEffectGenerationHandoffSummary.blockedEvents) === JSON.stringify(['TOUMON']),
  'Toumon must be the only fully blocked World Effect event',
);

for (const source of worldEffectSharedSourceEntries) {
  const handoff = worldEffectGenerationHandoffById.get(source.id);
  assert(handoff, `${source.id}: handoff missing`);
  assert(handoff.sourceAuthority === 'src/game/data/worldEffectSharedSource.ts', `${source.id}: authority path drift`);
  assert(handoff.approval.sourceReady === true, `${source.id}: source readiness drift`);
  assert(handoff.approval.generatedCandidateDefault === false, `${source.id}: candidate must not be inferred`);
  assert(handoff.approval.approvedReferenceDefault === false, `${source.id}: reference approval inferred`);
  assert(handoff.approval.approvedWebDefault === false, `${source.id}: Web approval inferred`);
  assert(handoff.approval.approvedUnityDefault === false, `${source.id}: Unity approval inferred`);
  assert(handoff.approval.runtimeApprovedDefault === false, `${source.id}: runtime approval inferred`);
  assert(handoff.approval.oneShotFinalForbidden === true, `${source.id}: one-shot final boundary missing`);
  assert(handoff.referenceTarget.runtimeDirectUseForbidden === true, `${source.id}: reference master must not ship directly`);
  assert(handoff.qa.gameplaySizeReviewRequired === true, `${source.id}: gameplay-size review missing`);
  assert(handoff.qa.deviceCreativeApprovalRequired === true, `${source.id}: device creative review missing`);
  assert(handoff.qa.photosensitiveQaRequired === true, `${source.id}: photosensitive QA missing`);
  assert(handoff.qa.reducedMotionQaRequired === true, `${source.id}: reduced-motion QA missing`);
  assert(handoff.qa.reducedFlashQaRequired === true, `${source.id}: reduced-flash QA missing`);
  assert(handoff.qa.performanceReviewRequired === true, `${source.id}: performance review missing`);
  assert(handoff.negativePromptSeed.includes('no full-screen composition'), `${source.id}: full-screen generation guard missing`);
  assert(handoff.negativePromptSeed.includes('no final Toumon geometry'), `${source.id}: Toumon guard missing`);
  assert(handoff.negativePromptSeed.includes('no whiteout or strobe sequence'), `${source.id}: flash/strobe guard missing`);

  if (handoff.imageCandidateGenerationAllowed) {
    assert(handoff.assetStrategy === 'HYBRID_TEXTURE_REFERENCE', `${source.id}: image generation requires hybrid texture strategy`);
    assert(handoff.imageCandidateCount === 4, `${source.id}: candidate count must remain 4`);
    assert(handoff.generatedTextureLanes.length > 0, `${source.id}: generated lane missing`);
    assert(handoff.promptSeed !== null, `${source.id}: prompt seed missing`);
    assert(handoff.referenceTarget.sizeSpec === '1024x1024 TRANSPARENT RGBA REFERENCE_MASTER', `${source.id}: reference target drift`);
    assert(handoff.referenceTarget.alphaPolicy === 'required', `${source.id}: alpha policy drift`);
    assert(handoff.qa.humanComparisonRequired === true, `${source.id}: candidate comparison missing`);
  } else {
    assert(handoff.imageCandidateCount === 0, `${source.id}: non-image lane cannot request candidates`);
    assert(handoff.generatedTextureLanes.length === 0, `${source.id}: non-image lane has texture targets`);
    assert(handoff.promptSeed === null, `${source.id}: non-image lane must not expose a generator prompt`);
    assert(handoff.referenceTarget.sizeSpec === 'NO_GENERATED_IMAGE_TARGET', `${source.id}: non-image target drift`);
    assert(handoff.referenceTarget.alphaPolicy === 'not-applicable', `${source.id}: non-image alpha policy drift`);
    assert(handoff.qa.humanComparisonRequired === false, `${source.id}: non-image lane should not require generated-candidate comparison`);
  }
}

const normalAttack = worldEffectGenerationHandoffById.get('NORMAL_ATTACK');
assert(normalAttack?.assetStrategy === 'PROCEDURAL_ONLY', 'Normal Attack must remain weapon-native/procedural');
assert(normalAttack.unityImplementation.some((rule) => /universal attack atlas/.test(rule)), 'Normal Attack universal-atlas guard missing');

const levelUp = worldEffectGenerationHandoffById.get('LEVEL_UP');
assert(levelUp?.assetStrategy === 'NATIVE_UI_FIRST', 'Level Up must remain native-UI-first');

const toumon = worldEffectGenerationHandoffById.get('TOUMON');
assert(toumon?.assetStrategy === 'BLOCKED', 'Toumon effect must remain blocked before final vector');
assert(toumon.blockedReason === 'FINAL_TOUMON_VECTOR_NOT_DRAWN', 'Toumon blocker drift');
assert(toumon.imageCandidateGenerationAllowed === false, 'Toumon effect image generation must remain disabled');

const kokuyou = worldEffectGenerationHandoffById.get('KOKUYOU');
assert(kokuyou?.generatedTextureLanes.includes('ink-pressure-edge'), 'Kokuyou ink pressure lane missing');
assert(kokuyou.generatedTextureLanes.includes('ink-slash-edge'), 'Kokuyou slash lane missing');
assert(kokuyou.generatedTextureLanes.includes('layer-peel-fragment'), 'Kokuyou recovery peel lane missing');

const dawn = worldEffectGenerationHandoffById.get('DAWN');
assert(dawn?.assetStrategy === 'PROCEDURAL_ONLY', 'Dawn should remain procedural value/material transition');
assert(dawn.unityImplementation.some((rule) => /No generated sunrise background|No generated sunrise/.test(rule)), 'Dawn generated-sunrise guard missing');

const bossDeath = worldEffectGenerationHandoffById.get('BOSS_DEATH');
assert(bossDeath?.generatedTextureLanes.includes('paper-fiber-tear'), 'Boss Death paper-fiber lane missing');

const clear = worldEffectGenerationHandoffById.get('CLEAR');
assert(clear?.assetStrategy === 'NATIVE_UI_FIRST', 'Clear should remain native-UI-first');
assert(clear.unityImplementation.some((rule) => /Dawn is a separate semantic event/.test(rule)), 'Clear/Dawn separation missing');

const reward = worldEffectGenerationHandoffById.get('REWARD_UNLOCK');
assert(reward?.assetStrategy === 'NATIVE_UI_FIRST', 'Reward Unlock must remain native-UI-first');
assert(reward.unityImplementation.some((rule) => /Reward icon artwork authority is separate/.test(rule)), 'Reward icon authority guard missing');

assert(worldEffectGenerationHandoffSummary.deviceCreativeApprovalReady === false, 'device creative approval must remain false');
assert(worldEffectGenerationHandoffSummary.runtimeApprovedDefault === false, 'runtime approval default must remain false');

console.log(
  `World Effect Generation Handoff: PASS (` +
    `events=${worldEffectGenerationHandoffSummary.total}, ` +
    `generated=${worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents.join('/')}, ` +
    `procedural=${worldEffectGenerationHandoffSummary.proceduralOnlyEvents.length}, ` +
    `nativeUI=${worldEffectGenerationHandoffSummary.nativeUiFirstEvents.length}, ` +
    `blocked=${worldEffectGenerationHandoffSummary.blockedEvents.join('/')})`,
);
