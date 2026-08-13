import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-hair-grooming-construction-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-hair-grooming-construction-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[hair-grooming-construction] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const productionExporterPath = productionPolicy.productionExporter;

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedHairCreatesCanon !== false) fail('generated hair canon guard weakened');
if ((policy.constructionAxes ?? []).length < 36) fail('36 hair construction axes required');
if ((policy.hairInvariants ?? []).length < 40) fail('40 hair invariants required');
if ((policy.topologyPreservationPriority ?? []).length < 14) fail('14 topology preservation priorities required');
if ((policy.allowedNeutralCompletionClasses ?? []).length < 8) fail('8 neutral completion classes required');
if ((policy.forbiddenShortcuts ?? []).length < 50) fail('50+ forbidden shortcuts required');
if (policy.unknownHairDefault !== 'SOURCE_CONSTRAINED_MINIMUM_GROOMING_COMPLETION') fail('unknown hair default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('authority must preserve candidate-only output');
if (!authority.includes('SOURCE_CONSTRAINED_MINIMUM_GROOMING_COMPLETION')) fail('authority unknown-hair default missing');
if (!authority.includes('Hair is a continuous topology attached to one scalp')) fail('core hair-topology rule missing');
if (typeof productionExporterPath !== 'string' || productionExporterPath.length === 0) fail('production exporter missing');
if (productionPolicy.hairTerminalWrapperRequiredFlags?.allCharacterHairGroomingConstructionFidelityRequired !== true) fail('production hair requirement missing');
for (const [field, expected] of Object.entries(productionPolicy.hairTerminalWrapperRequiredFlags ?? {})) {
  if (field === 'allCharacterHairGroomingConstructionFidelityRequired') {
    if (expected !== true) fail(`hair terminal flag must remain true: ${field}`);
  } else if (expected !== false) {
    fail(`hair terminal guard must remain false: ${field}`);
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
  'unknownHairMayBeInventedByImageModel',
  'viewpointMayChangeHairline',
  'viewpointMayChangePart',
  'viewpointMayChangeFringeTopology',
  'viewpointMayChangeEarExposure',
  'viewpointMayChangeTieAnchor',
  'viewpointMayMirrorCanonicalHairAsymmetry',
  'premiumAssetMayBeautifyHairline',
  'premiumAssetMayIncreaseHairOrnament',
  'premiumAssetMayChangeHairVolume',
  'stateMayChangeHairstyleWithoutAuthorizedDelta',
  'weatherMayRedesignHairTopology',
  'motionMayRedesignHairTopology',
  'wetHairMayIncreaseSexualization',
  'lodMayChangeIdentityHairTopology',
  'hairMayHideMobilityEquipmentForComposition',
  'skinToneMayInferHairTextureOrCulturalStyle',
  'generatedHairTreatmentCreatesCanon',
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, productionExporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 120 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.productionImageGenerationEntrypoint !== true || output.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (output.allCharacterViewpointTurnaroundBackDesignFidelityRequired !== true) fail(`${id}: turnaround chain missing`);
  if (output.allCharacterHairGroomingConstructionFidelityRequired !== true) fail(`${id}: hair fidelity flag missing`);
  for (const field of falseFields) if (output[field] !== false) fail(`${id}: hair guard weakened: ${field}`);
  if ((output.hairConstructionAxes ?? []).length < 36) fail(`${id}: construction axes missing`);
  if ((output.hairTopologyPreservationPriority ?? []).length < 14) fail(`${id}: preservation priority missing`);
  if ((output.hairAllowedNeutralCompletionClasses ?? []).length < 8) fail(`${id}: neutral completion classes missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: hair authority chain missing`);
  if (!output.prompt?.includes('HAIR / GROOMING CONSTRUCTION FIDELITY — FINAL HAIR TOPOLOGY LOCK.')) fail(`${id}: hair prompt block missing`);
}

console.log(`[hair-grooming-construction] OK: ${ids.length}/36 final production prompts preserve hair/grooming construction fidelity`);
