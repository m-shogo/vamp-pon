import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const bodyPolicyPath = 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json';
const bodyAuthorityPath = 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[character-production-entrypoint] ${message}`);
}

const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const bodyPolicy = JSON.parse(readFileSync(resolve(root, bodyPolicyPath), 'utf8'));
if (policy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT') fail('policy status invalid');
if (policy.scopeCount !== 36) fail('scopeCount must be 36');
if (policy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter) fail('code/policy exporter mismatch');
if (policy.authorityDocument !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.authority) fail('code/policy authority mismatch');
if (policy.lowerExportersAreProductionEntrypoints !== false) fail('lower exporter bypass guard weakened');
if (policy.handWrittenPromptIsProductionReady !== false) fail('hand prompt bypass guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.lowerExporterOutputIsProductionReady !== false) fail('code lower-exporter guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.handWrittenPromptIsProductionReady !== false) fail('code hand-prompt guard weakened');
if (bodyPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY' || bodyPolicy.scopeCount !== 36 || bodyPolicy.assetKindCount !== 9) fail('body authority invalid');

for (const [groupName, requiredField] of [
  ['hairTerminalWrapperRequiredFlags', 'allCharacterHairGroomingConstructionFidelityRequired'],
  ['faceTerminalWrapperRequiredFlags', 'allCharacterFaceSkullLandmarkConstructionFidelityRequired'],
] as const) {
  const group = policy[groupName] ?? {};
  if (group?.[requiredField] !== true) fail(`${groupName}: required terminal flag missing`);
  for (const [field, expected] of Object.entries(group)) {
    if (field === requiredField) {
      if (expected !== true) fail(`${groupName}: terminal flag must remain true: ${field}`);
    } else if (expected !== false) {
      fail(`${groupName}: terminal guard must remain false: ${field}`);
    }
  }
}

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(json.characters)) fail(`${path}: characters missing`);
  for (const character of json.characters) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique production IDs, got ${ids.length}/${new Set(ids).size}`);

const hairFalseFields = [
  'unknownHairMayBeInventedByImageModel','viewpointMayChangeHairline','viewpointMayChangePart','viewpointMayChangeFringeTopology','viewpointMayChangeEarExposure','viewpointMayChangeTieAnchor','viewpointMayMirrorCanonicalHairAsymmetry','premiumAssetMayBeautifyHairline','premiumAssetMayIncreaseHairOrnament','premiumAssetMayChangeHairVolume','stateMayChangeHairstyleWithoutAuthorizedDelta','weatherMayRedesignHairTopology','motionMayRedesignHairTopology','wetHairMayIncreaseSexualization','lodMayChangeIdentityHairTopology','hairMayHideMobilityEquipmentForComposition','skinToneMayInferHairTextureOrCulturalStyle','generatedHairTreatmentCreatesCanon',
];
const faceFalseFields = [
  'unknownFaceGeometryMayBeInventedByImageModel','viewpointMayRedesignCraniofacialLandmarks','expressionMayRedesignSkullGeometry','premiumMayBeautifyFaceRatios','premiumMayIncreaseEyeSize','premiumMayNarrowJaw','premiumMaySharpenChin','premiumMayShrinkNose','lodMayConvergeToGenericFace','chibiMayConvergeToGenericFace','spriteMayConvergeToGenericFace','stateMayChangeBaselineFaceWithoutTransformationAuthority','lightingMayHideFaceMismatch','hairMayHideFaceMismatch','cropMayHideFaceMismatch','effectsMayHideFaceMismatch','identityTraitsMayBeGuessedFromFacialStereotype','generatedFaceTreatmentCreatesCanon',
];
const bodyFalseFields = [
  'unknownBodyGeometryMayBeInventedByImageModel','premiumMayBeautifyBodyProportions','premiumMayLengthenLegs','premiumMayNarrowWaist','premiumMaySlimBodyCategory','premiumMayIncreaseMuscularity','viewpointMayRedesignBodyProportions','perspectiveMayChangeBodyCategory','poseMayChangeBaselineBodyConstruction','lightingMaySlimAuthorizedBodyMass','surfaceMayInventMusculature','clothingMayImplyUnsupportedBodyShape','wetClothingMayIncreaseBodySexualization','damageMayRevealUnsupportedAnatomy','lodMayConvergeToGenericBody','chibiMayConvergeToGenericBody','spriteMayConvergeToGenericBody','cropMayHideBodyMismatch','effectsMayHideBodyMismatch','hairMayHideShoulderMismatch','mobilityEquipmentMayBeRescaledForBodyBeautification','identityTraitsMayBeGuessedFromBodyStereotype','generatedBodyTreatmentCreatesCanon',
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, policy.productionExporter),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 176 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.productionImageGenerationEntrypoint !== true) fail(`${id}: production entrypoint flag missing`);
  if (exported.productionCharacterPromptReady !== true) fail(`${id}: production ready flag missing`);
  if (exported.productionPromptAuthorityLocked !== true) fail(`${id}: authority lock missing`);
  if (exported.feedbackRecurrenceGenerationEntrypoint !== true) fail(`${id}: feedback recurrence chain missing`);
  if (exported.characterImageGenerationReadinessRequired !== true) fail(`${id}: image readiness chain missing`);
  if (exported.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') fail(`${id}: image readiness not READY`);
  if (Array.isArray(exported.imageGenerationReadinessFailures) && exported.imageGenerationReadinessFailures.length > 0) fail(`${id}: readiness failures present`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (exported.lowerExporterOutputIsProductionReady !== false) fail(`${id}: lower exporter bypass guard weakened`);
  if (exported.handWrittenPromptIsProductionReady !== false) fail(`${id}: hand prompt bypass guard weakened`);
  if (exported.generatedImageCreatesCanon !== false) fail(`${id}: generated image canon guard weakened`);
  if (exported.generatedImageCreatesFeedbackRule !== false) fail(`${id}: generated image feedback guard weakened`);
  if (exported.allCharacterViewpointTurnaroundBackDesignFidelityRequired !== true) fail(`${id}: turnaround terminal chain missing`);
  if (exported.allCharacterHairGroomingConstructionFidelityRequired !== true) fail(`${id}: hair terminal chain missing`);
  if (exported.allCharacterFaceSkullLandmarkConstructionFidelityRequired !== true) fail(`${id}: face terminal chain missing`);
  if (exported.allCharacterBodyMassPostureConstructionFidelityRequired !== true) fail(`${id}: body construction chain missing`);
  for (const field of hairFalseFields) if (exported[field] !== false) fail(`${id}: hair guard weakened: ${field}`);
  for (const field of faceFalseFields) if (exported[field] !== false) fail(`${id}: face guard weakened: ${field}`);
  for (const field of bodyFalseFields) if (exported[field] !== false) fail(`${id}: body guard weakened: ${field}`);
  if ((exported.faceConstructionAxes ?? []).length < 46) fail(`${id}: face construction axes missing`);
  if ((exported.faceLandmarkPreservationPriority ?? []).length < 15) fail(`${id}: face preservation priority missing`);
  if ((exported.bodyConstructionAxes ?? []).length < 52) fail(`${id}: body construction axes missing`);
  if ((exported.bodyPreservationPriority ?? []).length < 12) fail(`${id}: body preservation priority missing`);
  if (!exported.prompt.includes('CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.')) fail(`${id}: final production prompt block missing`);
  if (!exported.prompt.includes('HAIR / GROOMING CONSTRUCTION FIDELITY — FINAL HAIR TOPOLOGY LOCK.')) fail(`${id}: final hair prompt block missing`);
  if (!exported.prompt.includes('FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.')) fail(`${id}: final face prompt block missing`);
  if (!exported.prompt.includes('BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.')) fail(`${id}: final body prompt block missing`);
  for (const path of policy.requiredAuthorityPaths) if (!exported.authorityOrder.includes(path)) fail(`${id}: required authority missing: ${path}`);
  for (const path of [bodyAuthorityPath, bodyPolicyPath]) if (!exported.authorityOrder.includes(path)) fail(`${id}: body authority missing: ${path}`);
  if (!exported.authorityOrder.includes(policy.authorityDocument)) fail(`${id}: production entrypoint authority missing`);
  if (!exported.authorityOrder.includes(policyPath)) fail(`${id}: production entrypoint policy missing`);
}

console.log(`[character-production-entrypoint] OK: ${ids.length}/36 production prompts preserve face and body construction through ${policy.productionExporter}`);
