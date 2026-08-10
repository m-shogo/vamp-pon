import { readFileSync } from 'node:fs';

import {
  WORLD_EFFECT_GENERATION_IDS,
  worldEffectGenerationHandoffById,
  worldEffectGenerationHandoffs,
  worldEffectGenerationHandoffSummary,
} from '../../src/game/data/worldEffectGenerationHandoff.ts';

function fail(message: string): never {
  throw new Error(`[World Effect Generation Handoff] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const semanticSource = readFileSync('src/game/data/worldEffectSharedSource.ts', 'utf8');
const expectedIds = [...WORLD_EFFECT_GENERATION_IDS];

for (const id of expectedIds) {
  const matches = semanticSource.match(new RegExp(`id: '${id}'`, 'g')) ?? [];
  assert(matches.length === 1, `${id}: semantic source coverage drift (${matches.length})`);
}
assert(worldEffectGenerationHandoffs.length === expectedIds.length, 'handoff coverage drift');
assert(
  JSON.stringify(worldEffectGenerationHandoffs.map((entry) => entry.id)) === JSON.stringify(expectedIds),
  'event ID/order drift',
);
assert(new Set(worldEffectGenerationHandoffs.map((entry) => entry.handoffId)).size === worldEffectGenerationHandoffs.length, 'duplicate handoff ID');
assert(semanticSource.includes("import { GLOW_ALPHA_MAX } from '../ui/visualDesign.ts'"), 'semantic source must continue to bind the existing glow cap');
assert(semanticSource.includes('const PHOTOSENSITIVE_BASE'), 'photosensitive semantic source missing');
assert(semanticSource.includes('REDUCED_MOTION_BASE') && semanticSource.includes('REDUCED_FLASH_BASE'), 'reduced-motion/flash semantic source missing');
assert(/TOUMON[\s\S]*AI-generated final Toumon geometry/.test(semanticSource), 'semantic Toumon final-geometry guard missing');
assert(/DAWN[\s\S]*NO WHITEOUT/.test(semanticSource), 'semantic Dawn no-whiteout guard missing');
assert(/BOSS_DEATH[\s\S]*not explosion/.test(semanticSource), 'semantic Boss Death not-explosion direction missing');

const expectedGenerated = ['WEAPON_EVOLUTION', 'KOKUYOU', 'BOSS_DEATH'];
assert(
  JSON.stringify(worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents) === JSON.stringify(expectedGenerated),
  `generated texture lane drift: ${worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents.join(', ')}`,
);
assert(
  JSON.stringify(worldEffectGenerationHandoffSummary.blockedEvents) === JSON.stringify(['TOUMON']),
  'Toumon must be the only fully blocked World Effect event',
);
assert(worldEffectGenerationHandoffSummary.semanticAuthorityLoadedAtGeneration === true, 'semantic source must be required at generation time');

for (const handoff of worldEffectGenerationHandoffs) {
  assert(handoff.sourceAuthority === 'src/game/data/worldEffectSharedSource.ts', `${handoff.id}: authority path drift`);
  assert(handoff.sourceEntryRequired === true, `${handoff.id}: source entry requirement missing`);
  assert(handoff.generationDirection.length > 0, `${handoff.id}: generation direction missing`);
  assert(handoff.approval.sourceReady === true, `${handoff.id}: source readiness drift`);
  assert(handoff.approval.generatedCandidateDefault === false, `${handoff.id}: candidate must not be inferred`);
  assert(handoff.approval.approvedReferenceDefault === false, `${handoff.id}: reference approval inferred`);
  assert(handoff.approval.approvedWebDefault === false, `${handoff.id}: Web approval inferred`);
  assert(handoff.approval.approvedUnityDefault === false, `${handoff.id}: Unity approval inferred`);
  assert(handoff.approval.runtimeApprovedDefault === false, `${handoff.id}: runtime approval inferred`);
  assert(handoff.approval.oneShotFinalForbidden === true, `${handoff.id}: one-shot final boundary missing`);
  assert(handoff.referenceTarget.runtimeDirectUseForbidden === true, `${handoff.id}: reference master must not ship directly`);
  assert(handoff.qa.gameplaySizeReviewRequired === true, `${handoff.id}: gameplay-size review missing`);
  assert(handoff.qa.deviceCreativeApprovalRequired === true, `${handoff.id}: device creative review missing`);
  assert(handoff.qa.photosensitiveQaRequired === true, `${handoff.id}: photosensitive QA missing`);
  assert(handoff.qa.reducedMotionQaRequired === true, `${handoff.id}: reduced-motion QA missing`);
  assert(handoff.qa.reducedFlashQaRequired === true, `${handoff.id}: reduced-flash QA missing`);
  assert(handoff.qa.performanceReviewRequired === true, `${handoff.id}: performance review missing`);
  assert(handoff.negativePromptSeed.includes('no full-screen composition'), `${handoff.id}: full-screen generation guard missing`);
  assert(handoff.negativePromptSeed.includes('no final Toumon geometry'), `${handoff.id}: Toumon guard missing`);
  assert(handoff.negativePromptSeed.includes('no whiteout or strobe sequence'), `${handoff.id}: flash/strobe guard missing`);

  if (handoff.imageCandidateGenerationAllowed) {
    assert(handoff.assetStrategy === 'HYBRID_TEXTURE_REFERENCE', `${handoff.id}: image generation requires hybrid texture strategy`);
    assert(handoff.imageCandidateCount === 4, `${handoff.id}: candidate count must remain 4`);
    assert(handoff.generatedTextureLanes.length > 0, `${handoff.id}: generated lane missing`);
    assert(handoff.promptSeed !== null, `${handoff.id}: prompt seed missing`);
    assert(handoff.promptSeed.includes('load and obey the matching entry'), `${handoff.id}: semantic-source prompt binding missing`);
    assert(handoff.referenceTarget.sizeSpec === '1024x1024 TRANSPARENT RGBA REFERENCE_MASTER', `${handoff.id}: reference target drift`);
    assert(handoff.referenceTarget.alphaPolicy === 'required', `${handoff.id}: alpha policy drift`);
    assert(handoff.qa.humanComparisonRequired === true, `${handoff.id}: candidate comparison missing`);
  } else {
    assert(handoff.imageCandidateCount === 0, `${handoff.id}: non-image lane cannot request candidates`);
    assert(handoff.generatedTextureLanes.length === 0, `${handoff.id}: non-image lane has texture targets`);
    assert(handoff.promptSeed === null, `${handoff.id}: non-image lane must not expose a generator prompt`);
    assert(handoff.referenceTarget.sizeSpec === 'NO_GENERATED_IMAGE_TARGET', `${handoff.id}: non-image target drift`);
    assert(handoff.referenceTarget.alphaPolicy === 'not-applicable', `${handoff.id}: non-image alpha policy drift`);
    assert(handoff.qa.humanComparisonRequired === false, `${handoff.id}: non-image lane should not require generated-candidate comparison`);
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
assert(dawn.unityImplementation.some((rule) => /No generated sunrise background/.test(rule)), 'Dawn generated-sunrise guard missing');

const bossDeath = worldEffectGenerationHandoffById.get('BOSS_DEATH');
assert(bossDeath?.generatedTextureLanes.includes('paper-fiber-tear'), 'Boss Death paper-fiber lane missing');

const clear = worldEffectGenerationHandoffById.get('CLEAR');
assert(clear?.assetStrategy === 'NATIVE_UI_FIRST', 'Clear should remain native-UI-first');
assert(clear.generationDirection.some((rule) => /Dawn is a separate semantic event/.test(rule)), 'Clear/Dawn separation missing');

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
