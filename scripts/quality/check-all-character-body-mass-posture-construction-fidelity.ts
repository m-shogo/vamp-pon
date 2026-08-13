import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[body-mass-posture] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const productionExporterPath = productionPolicy.productionExporter;

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedBodyCreatesCanon !== false) fail('generated body canon guard weakened');
if ((policy.constructionAxes ?? []).length < 52) fail('52 body construction axes required');
if ((policy.bodyInvariants ?? []).length < 30) fail('30 body invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 50) fail('50+ forbidden shortcuts required');
if (policy.unknownBodyDefault !== 'SOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETION') fail('unknown body default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('candidate boundary missing from authority');
if (!authority.includes('SOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETION')) fail('unknown-body default missing from authority');
if (!authority.includes('body is one authored mass-and-proportion construction')) fail('core embodied construction rule missing');
if (typeof productionExporterPath !== 'string' || productionExporterPath.length === 0) fail('production exporter missing');

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  for (const character of json.characters ?? []) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

const falseFields = [
  'unknownBodyGeometryMayBeInventedByImageModel','premiumMayBeautifyBodyProportions','premiumMayLengthenLegs','premiumMayNarrowWaist','premiumMaySlimBodyCategory','premiumMayIncreaseMuscularity','viewpointMayRedesignBodyProportions','perspectiveMayChangeBodyCategory','poseMayChangeBaselineBodyConstruction','lightingMaySlimAuthorizedBodyMass','surfaceMayInventMusculature','clothingMayImplyUnsupportedBodyShape','wetClothingMayIncreaseBodySexualization','damageMayRevealUnsupportedAnatomy','lodMayConvergeToGenericBody','chibiMayConvergeToGenericBody','spriteMayConvergeToGenericBody','cropMayHideBodyMismatch','effectsMayHideBodyMismatch','hairMayHideShoulderMismatch','mobilityEquipmentMayBeRescaledForBodyBeautification','identityTraitsMayBeGuessedFromBodyStereotype','generatedBodyTreatmentCreatesCanon',
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, productionExporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 176 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.productionImageGenerationEntrypoint !== true || output.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (output.allCharacterFaceSkullLandmarkConstructionFidelityRequired !== true) fail(`${id}: face chain missing`);
  if (output.allCharacterBodyMassPostureConstructionFidelityRequired !== true) fail(`${id}: body construction flag missing`);
  for (const field of falseFields) if (output[field] !== false) fail(`${id}: body guard weakened: ${field}`);
  if ((output.bodyConstructionAxes ?? []).length < 52) fail(`${id}: construction axes missing`);
  if ((output.bodyPreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: body authority chain missing`);
  if (!output.prompt?.includes('BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.')) fail(`${id}: body prompt block missing`);
}

console.log(`[body-mass-posture] OK: ${ids.length}/36 final production prompts preserve embodied body construction fidelity`);
