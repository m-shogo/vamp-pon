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
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 152 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterFaceSkullLandmarkConstructionFidelityRequired !== true) throw new Error(`${options.characterId}: face/skull chain missing`);

const result: Record<string, any> = {
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
  'Treat the body as one authored three-dimensional mass and proportion construction. Preserve stature family, head/body ratio, neck, shoulder-ribcage-pelvis relationship, torso/limb proportion, hand/foot scale, soft-tissue distribution, muscularity family, age-bearing cues, center of gravity, habitual posture, seated/crouched compression and mobility-equipment clearance according to stronger source-backed authority.',
  'Unknown body geometry uses SOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETION. Do not beautify toward longer legs, narrower waist, slimmer body, broader or more sexualized dimorphism, smaller hands/feet, elongated neck, extra musculature, corrected symmetry or universal model posture.',
  'Perspective, motion, clothing, lighting, wetness, crop and effects may reveal or occlude existing structure but may not redesign body category or hide a mismatch. Generated body geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${bodyBlock}`;
result.reviewChecklist = [
  '肩幅・ribcage・pelvis・torso/limb比率が全視点で同一人物として繋がる',
  'plus-size / broad / soft / child / older bodyをgeneric slim/athleticへ正規化しない',
  'premium化で脚長・細腰・細身・筋肉追加・首長化・手足縮小をしない',
  'pose/perspectiveは重心と圧縮を変えてもbaseline body constructionを作り直さない',
  'seated/crouchでは身体volume・joint clearance・mobility equipmentとの関係を保持する',
  'clothing/light/crop/effectsでbody mismatchを隠さない',
  '未確定身体はSOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETIONに留める',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
