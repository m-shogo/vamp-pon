import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-hair-grooming-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md';
const BODY_POLICY_PATH = 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json';
const BODY_AUTHORITY_PATH = 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md';

type Options = { characterId: string; kind: string };

function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { kind = args[++i] ?? ''; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  return { characterId, kind };
}

const options = parseArgs(process.argv.slice(2));
const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
const authority = readFileSync(resolve(process.cwd(), AUTHORITY_PATH), 'utf8');
const bodyPolicy = JSON.parse(readFileSync(resolve(process.cwd(), BODY_POLICY_PATH), 'utf8'));
const bodyAuthority = readFileSync(resolve(process.cwd(), BODY_AUTHORITY_PATH), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('face/skull landmark authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('face/skull landmark scope weakened');
if (bodyPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('body/mass/posture authority status invalid');
if (bodyPolicy.scopeCount !== 36 || bodyPolicy.assetKindCount !== 9 || bodyPolicy.production?.requiredForCandidateGeneration !== true) throw new Error('body/mass/posture scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 144 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterHairGroomingConstructionFidelityRequired !== true) throw new Error(`${options.characterId}: hair/grooming chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 36),
  generatedBy: 'tools/asset-factory/scripts/export-face-skull-landmark-locked-character-design-prompt.ts',
  allCharacterFaceSkullLandmarkConstructionFidelityRequired: true,
  unknownFaceGeometryMayBeInventedByImageModel: policy.rules?.unknownFaceGeometryMayBeInventedByImageModel,
  viewpointMayRedesignCraniofacialLandmarks: policy.rules?.viewpointMayRedesignCraniofacialLandmarks,
  expressionMayRedesignSkullGeometry: policy.rules?.expressionMayRedesignSkullGeometry,
  premiumMayBeautifyFaceRatios: policy.rules?.premiumMayBeautifyFaceRatios,
  premiumMayIncreaseEyeSize: policy.rules?.premiumMayIncreaseEyeSize,
  premiumMayNarrowJaw: policy.rules?.premiumMayNarrowJaw,
  premiumMaySharpenChin: policy.rules?.premiumMaySharpenChin,
  premiumMayShrinkNose: policy.rules?.premiumMayShrinkNose,
  lodMayConvergeToGenericFace: policy.rules?.lodMayConvergeToGenericFace,
  chibiMayConvergeToGenericFace: policy.rules?.chibiMayConvergeToGenericFace,
  spriteMayConvergeToGenericFace: policy.rules?.spriteMayConvergeToGenericFace,
  stateMayChangeBaselineFaceWithoutTransformationAuthority: policy.rules?.stateMayChangeBaselineFaceWithoutTransformationAuthority,
  lightingMayHideFaceMismatch: policy.rules?.lightingMayHideFaceMismatch,
  hairMayHideFaceMismatch: policy.rules?.hairMayHideFaceMismatch,
  cropMayHideFaceMismatch: policy.rules?.cropMayHideFaceMismatch,
  effectsMayHideFaceMismatch: policy.rules?.effectsMayHideFaceMismatch,
  identityTraitsMayBeGuessedFromFacialStereotype: policy.rules?.identityTraitsMayBeGuessedFromFacialStereotype,
  generatedFaceTreatmentCreatesCanon: policy.rules?.generatedFaceTreatmentCreatesCanon,
  faceConstructionAxes: policy.constructionAxes,
  faceLandmarkPreservationPriority: policy.preservationPriority,
  faceSkullPolicyPath: POLICY_PATH,
  faceSkullAuthorityPath: AUTHORITY_PATH,
  allCharacterBodyMassPostureConstructionFidelityRequired: true,
  unknownBodyGeometryMayBeInventedByImageModel: bodyPolicy.rules?.unknownBodyGeometryMayBeInventedByImageModel,
  premiumMayBeautifyBodyProportions: bodyPolicy.rules?.premiumMayBeautifyBodyProportions,
  premiumMayLengthenLegs: bodyPolicy.rules?.premiumMayLengthenLegs,
  premiumMayNarrowWaist: bodyPolicy.rules?.premiumMayNarrowWaist,
  premiumMaySlimBodyCategory: bodyPolicy.rules?.premiumMaySlimBodyCategory,
  premiumMayIncreaseMuscularity: bodyPolicy.rules?.premiumMayIncreaseMuscularity,
  viewpointMayRedesignBodyProportions: bodyPolicy.rules?.viewpointMayRedesignBodyProportions,
  perspectiveMayChangeBodyCategory: bodyPolicy.rules?.perspectiveMayChangeBodyCategory,
  poseMayChangeBaselineBodyConstruction: bodyPolicy.rules?.poseMayChangeBaselineBodyConstruction,
  lightingMaySlimAuthorizedBodyMass: bodyPolicy.rules?.lightingMaySlimAuthorizedBodyMass,
  surfaceMayInventMusculature: bodyPolicy.rules?.surfaceMayInventMusculature,
  clothingMayImplyUnsupportedBodyShape: bodyPolicy.rules?.clothingMayImplyUnsupportedBodyShape,
  wetClothingMayIncreaseBodySexualization: bodyPolicy.rules?.wetClothingMayIncreaseBodySexualization,
  damageMayRevealUnsupportedAnatomy: bodyPolicy.rules?.damageMayRevealUnsupportedAnatomy,
  lodMayConvergeToGenericBody: bodyPolicy.rules?.lodMayConvergeToGenericBody,
  chibiMayConvergeToGenericBody: bodyPolicy.rules?.chibiMayConvergeToGenericBody,
  spriteMayConvergeToGenericBody: bodyPolicy.rules?.spriteMayConvergeToGenericBody,
  cropMayHideBodyMismatch: bodyPolicy.rules?.cropMayHideBodyMismatch,
  effectsMayHideBodyMismatch: bodyPolicy.rules?.effectsMayHideBodyMismatch,
  hairMayHideShoulderMismatch: bodyPolicy.rules?.hairMayHideShoulderMismatch,
  mobilityEquipmentMayBeRescaledForBodyBeautification: bodyPolicy.rules?.mobilityEquipmentMayBeRescaledForBodyBeautification,
  identityTraitsMayBeGuessedFromBodyStereotype: bodyPolicy.rules?.identityTraitsMayBeGuessedFromBodyStereotype,
  generatedBodyTreatmentCreatesCanon: bodyPolicy.rules?.generatedBodyTreatmentCreatesCanon,
  bodyConstructionAxes: bodyPolicy.constructionAxes,
  bodyPreservationPriority: bodyPolicy.preservationPriority,
  bodyMassPosturePolicyPath: BODY_POLICY_PATH,
  bodyMassPostureAuthorityPath: BODY_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownFaceGeometryMayBeInventedByImageModel', 'viewpointMayRedesignCraniofacialLandmarks', 'expressionMayRedesignSkullGeometry',
  'premiumMayBeautifyFaceRatios', 'premiumMayIncreaseEyeSize', 'premiumMayNarrowJaw', 'premiumMaySharpenChin', 'premiumMayShrinkNose',
  'lodMayConvergeToGenericFace', 'chibiMayConvergeToGenericFace', 'spriteMayConvergeToGenericFace',
  'stateMayChangeBaselineFaceWithoutTransformationAuthority', 'lightingMayHideFaceMismatch', 'hairMayHideFaceMismatch',
  'cropMayHideFaceMismatch', 'effectsMayHideFaceMismatch', 'identityTraitsMayBeGuessedFromFacialStereotype', 'generatedFaceTreatmentCreatesCanon',
  'unknownBodyGeometryMayBeInventedByImageModel', 'premiumMayBeautifyBodyProportions', 'premiumMayLengthenLegs', 'premiumMayNarrowWaist',
  'premiumMaySlimBodyCategory', 'premiumMayIncreaseMuscularity', 'viewpointMayRedesignBodyProportions', 'perspectiveMayChangeBodyCategory',
  'poseMayChangeBaselineBodyConstruction', 'lightingMaySlimAuthorizedBodyMass', 'surfaceMayInventMusculature', 'clothingMayImplyUnsupportedBodyShape',
  'wetClothingMayIncreaseBodySexualization', 'damageMayRevealUnsupportedAnatomy', 'lodMayConvergeToGenericBody', 'chibiMayConvergeToGenericBody',
  'spriteMayConvergeToGenericBody', 'cropMayHideBodyMismatch', 'effectsMayHideBodyMismatch', 'hairMayHideShoulderMismatch',
  'mobilityEquipmentMayBeRescaledForBodyBeautification', 'identityTraitsMayBeGuessedFromBodyStereotype', 'generatedBodyTreatmentCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: identity construction guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, BODY_AUTHORITY_PATH, BODY_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const faceBlock = [
  'FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`, `Machine policy: ${POLICY_PATH}.`,
  'Treat the face as one three-dimensional craniofacial construction, not a generic attractive anime-face base. Preserve face-height/width family, forehead/temple proportion, inter-eye spacing and axis, brow family, nose root/bridge/projection, cheekbone and soft-tissue volume, mouth width, jaw angle, chin geometry, ear placement, authorized asymmetry and age-bearing structural cues.',
  'Unknown facial geometry uses SOURCE_CONSTRAINED_IDENTITY_NEUTRAL_FACE_COMPLETION. Do not enlarge eyes, shrink nose, narrow jaw, sharpen chin, smooth age, symmetrize, stereotype identity traits, or hide mismatch behind hair, crop, shadow, glow, hands, props or effects.',
  'LOD/chibi/sprite may remove micro-detail but may not converge characters onto one giant-eye/tiny-nose/pointed-chin face base. Generated facial geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');
const bodyBlock = [
  'BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.',
  `Authority: ${BODY_AUTHORITY_PATH}.`, `Machine policy: ${BODY_POLICY_PATH}.`,
  'Treat the body as one authored mass-and-proportion construction with a habitual center of gravity, not as a generic attractive body hidden beneath clothing. Preserve stature family, head/body ratio, neck, shoulder/ribcage/pelvis relationship, torso/limb proportion, hand/foot scale, soft-tissue distribution, age-bearing body cues, posture, weight-bearing habit, seated/crouched compression, and mobility-equipment clearance.',
  'Unknown body geometry uses SOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETION. Do not lengthen legs, narrow waist, slim body category, add muscles, shrink hands/feet, adultize children, de-age adults, normalize broad/soft/plus-size bodies, or hide mismatch with crop, coat, hair, shadow, effects, perspective or pose.',
  'Clothing, wetness, damage, premium rendering, state variants, LOD, chibi and sprite treatment may not redesign the baseline body. Generated body geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  bodyAuthority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${faceBlock}\n\n${bodyBlock}`;
result.reviewChecklist = [
  '髪色・髪型・服・アクセ・照明を外しても顔だけで本人差が残る',
  'front/3-4/profileが同一のskull/nose/jaw/chinを説明している',
  'premium化でeye enlargement/nose shrink/jaw narrow/chin sharpenをしない',
  'age/body category/cheek soft-tissueをgeneric美形へ正規化しない',
  '肩幅・ribcage・pelvis・torso/limb比率・hand/foot scaleを本人の構造として保持する',
  'plus-size/broad/soft/child/older bodyを細身・長脚・若年・athleticへ正規化しない',
  '立位・座位・crouchでcenter of gravityとmass compressionが同じ人物を説明している',
  'mobility equipmentを身体美化や構図のため縮小・除去しない',
  'clothing/crop/hair/shadow/effectsでbody mismatchを隠さない',
  'LOD/chibi/spriteではmicro-detailを先に落としsame-face/same-body convergenceを防ぐ',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
