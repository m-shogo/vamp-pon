import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.md';
const bodyPolicyPath = 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json';
const bodyAuthorityPath = 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[garment-body-fit] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const bodyPolicy = JSON.parse(readFileSync(resolve(root, bodyPolicyPath), 'utf8'));
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const productionExporterPath = productionPolicy.productionExporter;

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedGarmentFitCreatesCanon !== false) fail('generated fit canon guard weakened');
if ((policy.constructionAxes ?? []).length < 55) fail('55+ garment/body fit construction axes required');
if ((policy.fitInvariants ?? []).length < 36) fail('36 fit invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 55) fail('55+ forbidden shortcuts required');
if (policy.unknownFitDefault !== 'SOURCE_CONSTRAINED_MECHANICALLY_PLAUSIBLE_FIT_COMPLETION') fail('unknown fit default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (bodyPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('body authority missing');
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('candidate boundary missing from authority');
if (!authority.includes('SOURCE_CONSTRAINED_MECHANICALLY_PLAUSIBLE_FIT_COMPLETION')) fail('unknown-fit default missing from authority');
if (!authority.includes('Garment fit follows the authorized body rather than replacing it.')) fail('core fit rule missing');
if (!authority.includes('Every visible tension line requires a plausible load path.')) fail('tension causality rule missing');
if (typeof productionExporterPath !== 'string' || productionExporterPath.length === 0) fail('production exporter missing');

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  for (const character of json.characters ?? []) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

const falseFields = [
  'unknownGarmentFitMayBeInventedByImageModel','garmentMayRedesignAuthorizedBody','looseGarmentMayImplyThinnerBody','tightGarmentMayInventUnsupportedAnatomy','premiumMayIncreaseBodyCling','premiumMaySuppressWaist','premiumMayIncreaseExposureForFit','poseMayChangeGarmentConstruction','seatedPoseMaySlimBodyForClearance','crouchMaySlimBodyForOverlap','wetnessMayIncreaseAnatomicalRevelation','damageMayChangeFitOrExposureWithoutAuthority','foldsMayInventMusculature','strapsMayReshapeBodyBeyondLocalizedPressure','beltsMayManufactureNarrowerWaist','layersMayEraseAuthorizedBodyMass','mobilityEquipmentMayBeHiddenToSimplifyFit','wheelchairContactMayBeIgnored','assistiveDeviceClearanceMayBeIgnored','lodMayConvergeToGenericSlimFit','chibiMayConvergeToGenericSlimFit','spriteMayConvergeToGenericSlimFit','identityTraitsMayBeGuessedFromFitStereotype','generatedGarmentFitCreatesCanon',
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, productionExporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 192 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.productionImageGenerationEntrypoint !== true || output.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (output.allCharacterBodyMassPostureConstructionFidelityRequired !== true) fail(`${id}: body chain missing`);
  if (output.allCharacterGarmentBodyFitTensionCompressionFidelityRequired !== true) fail(`${id}: garment/body fit flag missing`);
  for (const field of falseFields) if (output[field] !== false) fail(`${id}: garment/body fit guard weakened: ${field}`);
  if ((output.garmentFitConstructionAxes ?? []).length < 55) fail(`${id}: fit construction axes missing`);
  if ((output.garmentFitPreservationPriority ?? []).length < 12) fail(`${id}: fit preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [bodyAuthorityPath, bodyPolicyPath, authorityPath, policyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: authority chain missing: ${path}`);
  if (!output.prompt?.includes('GARMENT-TO-BODY FIT / TENSION / COMPRESSION FIDELITY — FINAL CLOTH-BODY MECHANICS LOCK.')) fail(`${id}: garment/body fit prompt block missing`);
}

console.log(`[garment-body-fit] OK: ${ids.length}/36 final production prompts preserve body-consistent garment fit, tension and compression`);
