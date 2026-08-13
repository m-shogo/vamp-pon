import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-skin-coverage-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-personal-grooming-cosmetics-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-personal-grooming-cosmetics-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v8.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v8.md';

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
const entrypointPolicy = JSON.parse(readFileSync(resolve(process.cwd(), ENTRYPOINT_POLICY_PATH), 'utf8'));
const entrypointAuthority = readFileSync(resolve(process.cwd(), ENTRYPOINT_AUTHORITY_PATH), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('personal grooming authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('personal grooming scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v8 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-personal-grooming-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v8 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 820 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
  'allCharacterSkinCoverageExposureBoundaryFidelityRequired',
  'allCharacterAccessoryPropInventoryTransitionFidelityRequired',
  'allCharacterBodyAdornmentMarkingTopologyFidelityRequired',
  'allCharacterFastenerOperationalAccessServiceabilityFidelityRequired',
  'allCharacterGarmentLongWearComfortFidelityRequired',
  'allCharacterGarmentDonDoffDressingWorkflowFidelityRequired',
  'allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired',
  'allCharacterGarmentPatternSeamClosureLoadFidelityRequired',
  'allCharacterGarmentBodyFitTensionCompressionFidelityRequired',
  'allCharacterBodyMassPostureConstructionFidelityRequired',
  'allCharacterFaceSkullLandmarkConstructionFidelityRequired',
]) if (base[required] !== true) throw new Error(`${options.characterId}: inherited chain missing: ${required}`);

const result: Record<string, any> = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 46),
  generatedBy: 'tools/asset-factory/scripts/export-personal-grooming-locked-character-design-prompt.ts',
  allCharacterPersonalGroomingCosmeticsFidelityRequired: true,
  personalGroomingAxes: policy.groomingAxes,
  personalGroomingPreservationPriority: policy.preservationPriority,
  personalGroomingPolicyPath: POLICY_PATH,
  personalGroomingAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};
for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: personal grooming guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const block = [
  'PERSONAL GROOMING / COSMETICS / NAILS / FACIAL-HAIR FIDELITY — FINAL GROOMING-CHOICE LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve source-backed presence and source-backed absence of cosmetics, nail treatment, facial hair, eyebrow grooming and visible body-hair treatment. Grooming is not a generic gender, age, rarity, glamour, toughness or attractiveness signal.',
  'Unknown grooming uses SOURCE_CONSTRAINED_NO_INVENTION_PERSONAL_GROOMING_COMPLETION. Do not add makeup, lashes, gloss, polish, nail art, stubble, beard, shaved patterns or body-hair detail from gender presentation, sexuality, ethnicity, age, role, exposure or high resolution. Do not erase source-backed facial hair, cosmetics or age-bearing grooming for beauty.',
  'Weather/wear do not invent makeup smears, nail chips or stubble. Premium does not increase grooming inventory or smooth away identity cues. State variants change grooming only through explicit delta. LOD/chibi/sprite preserve existence and major grooming topology before micro-detail. Generated grooming remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
  entrypointAuthority,
].join('\n');
result.prompt = `${base.prompt}\n\n${block}`;
result.reviewChecklist = [
  'cosmetics/nails/facial hair/body hairのpresence/absenceがsource-backedである',
  'gender/age/ethnicity/role/rarityからgrooming stereotypeを追加しない',
  'source-backed facial hair/cosmeticsをgeneric beauty cleanupで消さない',
  'nail length/shape/colorをhand beautificationのため変更しない',
  'weather/wear/time passageからsmear/chip/stubbleを勝手に作らない',
  'premium化でmakeup/lash/gloss/polish/gem/grooming cleanupを増やさない',
  'groomingからhygiene/wealth/vanity/sexuality/culture/relationship meaningを推測しない',
  'stateはexplicit delta以外baseline groomingを継承する',
  'LOD/chibi/spriteでもpresence/major topologyを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
