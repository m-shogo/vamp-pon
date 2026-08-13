import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-face-skull-landmark-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('body/mass/posture authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('body/mass/posture scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 160 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterFaceSkullLandmarkConstructionFidelityRequired !== true) throw new Error(`${options.characterId}: face/skull chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 36),
  generatedBy: 'tools/asset-factory/scripts/export-body-mass-posture-locked-character-design-prompt.ts',
  allCharacterBodyMassPostureConstructionFidelityRequired: true,
  unknownBodyGeometryMayBeInventedByImageModel: policy.rules?.unknownBodyGeometryMayBeInventedByImageModel,
  premiumMayBeautifyBodyProportions: policy.rules?.premiumMayBeautifyBodyProportions,
  premiumMayLengthenLegs: policy.rules?.premiumMayLengthenLegs,
  premiumMayNarrowWaist: policy.rules?.premiumMayNarrowWaist,
  premiumMaySlimBodyCategory: policy.rules?.premiumMaySlimBodyCategory,
  premiumMayIncreaseMuscularity: policy.rules?.premiumMayIncreaseMuscularity,
  viewpointMayRedesignBodyProportions: policy.rules?.viewpointMayRedesignBodyProportions,
  perspectiveMayChangeBodyCategory: policy.rules?.perspectiveMayChangeBodyCategory,
  poseMayChangeBaselineBodyConstruction: policy.rules?.poseMayChangeBaselineBodyConstruction,
  lightingMaySlimAuthorizedBodyMass: policy.rules?.lightingMaySlimAuthorizedBodyMass,
  surfaceMayInventMusculature: policy.rules?.surfaceMayInventMusculature,
  clothingMayImplyUnsupportedBodyShape: policy.rules?.clothingMayImplyUnsupportedBodyShape,
  wetClothingMayIncreaseBodySexualization: policy.rules?.wetClothingMayIncreaseBodySexualization,
  damageMayRevealUnsupportedAnatomy: policy.rules?.damageMayRevealUnsupportedAnatomy,
  lodMayConvergeToGenericBody: policy.rules?.lodMayConvergeToGenericBody,
  chibiMayConvergeToGenericBody: policy.rules?.chibiMayConvergeToGenericBody,
  spriteMayConvergeToGenericBody: policy.rules?.spriteMayConvergeToGenericBody,
  cropMayHideBodyMismatch: policy.rules?.cropMayHideBodyMismatch,
  effectsMayHideBodyMismatch: policy.rules?.effectsMayHideBodyMismatch,
  hairMayHideShoulderMismatch: policy.rules?.hairMayHideShoulderMismatch,
  mobilityEquipmentMayBeRescaledForBodyBeautification: policy.rules?.mobilityEquipmentMayBeRescaledForBodyBeautification,
  identityTraitsMayBeGuessedFromBodyStereotype: policy.rules?.identityTraitsMayBeGuessedFromBodyStereotype,
  generatedBodyTreatmentCreatesCanon: policy.rules?.generatedBodyTreatmentCreatesCanon,
  bodyConstructionAxes: policy.constructionAxes,
  bodyPreservationPriority: policy.preservationPriority,
  bodyMassPosturePolicyPath: POLICY_PATH,
  bodyMassPostureAuthorityPath: AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownBodyGeometryMayBeInventedByImageModel',
  'premiumMayBeautifyBodyProportions',
  'premiumMayLengthenLegs',
  'premiumMayNarrowWaist',
  'premiumMaySlimBodyCategory',
  'premiumMayIncreaseMuscularity',
  'viewpointMayRedesignBodyProportions',
  'perspectiveMayChangeBodyCategory',
  'poseMayChangeBaselineBodyConstruction',
  'lightingMaySlimAuthorizedBodyMass',
  'surfaceMayInventMusculature',
  'clothingMayImplyUnsupportedBodyShape',
  'wetClothingMayIncreaseBodySexualization',
  'damageMayRevealUnsupportedAnatomy',
  'lodMayConvergeToGenericBody',
  'chibiMayConvergeToGenericBody',
  'spriteMayConvergeToGenericBody',
  'cropMayHideBodyMismatch',
  'effectsMayHideBodyMismatch',
  'hairMayHideShoulderMismatch',
  'mobilityEquipmentMayBeRescaledForBodyBeautification',
  'identityTraitsMayBeGuessedFromBodyStereotype',
  'generatedBodyTreatmentCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: body/mass/posture guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const bodyBlock = [
  'BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Treat the body as one coherent embodied construction, not a generic attractive body template. Preserve source-backed head/body ratio, neck, shoulder/ribcage/pelvis relationship, torso and limb proportions, hand/foot scale, soft-tissue distribution, muscularity family, age-bearing body cues, center of gravity and habitual posture across viewpoint, pose, premium art, LOD, chibi and sprite.',
  'Unknown body geometry uses SOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETION. Do not invent thinness, curves, muscularity, height, long legs, narrow waist, broad shoulders or sexual dimorphism from gender presentation, role, rarity, personality, sexuality, skin tone or market expectations.',
  'Perspective may foreshorten and pose may redistribute weight, but neither may redesign baseline body construction. Clothing, hair, crop, shadow, effects or mobility-equipment scaling may not hide a body mismatch. Generated body geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${bodyBlock}`;
result.reviewChecklist = [
  'head/body比・neck・shoulder/ribcage/pelvis関係・torso/limb比率を全視点で保持する',
  'premium化でlong legs/narrow waist/slim body/heroic shouldersへ補正しない',
  'soft tissue・body category・age-bearing cuesをgeneric attractive medianへ均さない',
  'pose/perspectiveは重心を動かしてもbaseline body constructionを変えない',
  'seated/crouchedでtorso/pelvis/limb volumeとjoint clearanceを自然に保つ',
  'hand/foot scaleをprettinessのために縮めない',
  'hair/crop/coat/shadow/effectsでbody mismatchを隠さない',
  'mobility equipmentを身体を細長く見せるために縮小・除去しない',
  'LOD/chibi/spriteではmicro anatomyを先に落としbody-category identityを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
