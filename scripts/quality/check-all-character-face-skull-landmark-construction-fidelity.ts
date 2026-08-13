import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[face-skull-landmark] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const productionExporterPath = productionPolicy.productionExporter;

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedFaceCreatesCanon !== false) fail('generated face canon guard weakened');
if ((policy.constructionAxes ?? []).length < 46) fail('46 face construction axes required');
if ((policy.landmarkInvariants ?? []).length < 47) fail('47 landmark invariants required');
if ((policy.preservationPriority ?? []).length < 15) fail('15 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 40) fail('40+ forbidden shortcuts required');
if (policy.unknownFaceDefault !== 'SOURCE_CONSTRAINED_IDENTITY_NEUTRAL_FACE_COMPLETION') fail('unknown face default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('candidate boundary missing from authority');
if (!authority.includes('SOURCE_CONSTRAINED_IDENTITY_NEUTRAL_FACE_COMPLETION')) fail('unknown-face default missing from authority');
if (!authority.includes('one three-dimensional craniofacial construction')) fail('core craniofacial construction rule missing');
if (typeof productionExporterPath !== 'string' || productionExporterPath.length === 0) fail('production exporter missing');
if (productionPolicy.faceTerminalWrapperRequiredFlags?.allCharacterFaceSkullLandmarkConstructionFidelityRequired !== true) fail('face terminal requirement missing');
for (const [field, expected] of Object.entries(productionPolicy.faceTerminalWrapperRequiredFlags ?? {})) {
  if (field === 'allCharacterFaceSkullLandmarkConstructionFidelityRequired') {
    if (expected !== true) fail(`face terminal flag must remain true: ${field}`);
  } else if (expected !== false) {
    fail(`face terminal guard must remain false: ${field}`);
  }
}
for (const path of [authorityPath, policyPath]) if (!productionPolicy.requiredAuthorityPaths?.includes(path)) fail(`required authority path missing: ${path}`);

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  for (const character of json.characters ?? []) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

const falseFields = [
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
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, productionExporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 144 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.productionImageGenerationEntrypoint !== true || output.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (output.allCharacterHairGroomingConstructionFidelityRequired !== true) fail(`${id}: hair chain missing`);
  if (output.allCharacterFaceSkullLandmarkConstructionFidelityRequired !== true) fail(`${id}: face/skull flag missing`);
  for (const field of falseFields) if (output[field] !== false) fail(`${id}: face guard weakened: ${field}`);
  if ((output.faceConstructionAxes ?? []).length < 46) fail(`${id}: construction axes missing`);
  if ((output.faceLandmarkPreservationPriority ?? []).length < 15) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: face authority chain missing`);
  if (!output.prompt?.includes('FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.')) fail(`${id}: face prompt block missing`);
}

console.log(`[face-skull-landmark] OK: ${ids.length}/36 final production prompts preserve craniofacial landmark fidelity`);
