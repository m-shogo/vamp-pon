import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-hair-grooming-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('face/skull landmark authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('face/skull landmark scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 136 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterHairGroomingConstructionFidelityRequired !== true) throw new Error(`${options.characterId}: hair/grooming chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 35),
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
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownFaceGeometryMayBeInventedByImageModel',
  'viewpointMayRedesignCraniofacialLandmarks',
  'expressionMayRedesignSkullGeometry',
  'premiumMayBeautifyFaceRatios',
  'premiumMayIncreaseEyeSize',
  'premiumMayNarrowJaw',
  'premiumMaySharpenChin',
  'premiumMayShrinkNose',
  'lodMayConvergeToGenericFace',
  'chibiMayConvergeToGenericFace',
  'spriteMayConvergeToGenericFace',
  'stateMayChangeBaselineFaceWithoutTransformationAuthority',
  'lightingMayHideFaceMismatch',
  'hairMayHideFaceMismatch',
  'cropMayHideFaceMismatch',
  'effectsMayHideFaceMismatch',
  'identityTraitsMayBeGuessedFromFacialStereotype',
  'generatedFaceTreatmentCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: face/skull guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const faceBlock = [
  'FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Treat the face as one three-dimensional craniofacial construction, not a generic attractive anime-face base. Preserve face-height/width family, forehead/temple proportion, inter-eye spacing and axis, brow family, nose root/bridge/projection, cheekbone and soft-tissue volume, mouth width, jaw angle, chin geometry, ear placement, authorized asymmetry and age-bearing structural cues.',
  'Unknown facial geometry uses SOURCE_CONSTRAINED_IDENTITY_NEUTRAL_FACE_COMPLETION. Do not enlarge eyes, shrink nose, narrow jaw, sharpen chin, smooth age, symmetrize, stereotype identity traits, or hide mismatch behind hair, crop, shadow, glow, hands, props or effects.',
  'LOD/chibi/sprite may remove micro-detail but may not converge characters onto one giant-eye/tiny-nose/pointed-chin face base. Generated facial geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${faceBlock}`;
result.reviewChecklist = [
  '髪色・髪型・服・アクセ・照明を外しても顔だけで本人差が残る',
  'front/3-4/profileが同一のskull/nose/jaw/chinを説明している',
  'premium化でeye enlargement/nose shrink/jaw narrow/chin sharpenをしない',
  'age/body category/cheek soft-tissueをgeneric美形へ正規化しない',
  'expression/lighting/perspectiveはlandmark比率を作り直さない',
  'hair/crop/shadow/effects/hand/propでface mismatchを隠さない',
  'LOD/chibi/spriteではmicro-detailを先に落としsame-face convergenceを防ぐ',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
