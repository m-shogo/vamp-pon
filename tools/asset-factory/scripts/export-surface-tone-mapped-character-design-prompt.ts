import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-focus-depth-effects-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-surface-tone-mapping-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-surface-tone-mapping-fidelity-master-v1.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('surface/tone-mapping authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('surface/tone-mapping scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 52 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterFocusDepthEffectsFidelityRequired !== true) throw new Error(`${options.characterId}: focus/depth/effects chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 26),
  generatedBy: 'tools/asset-factory/scripts/export-surface-tone-mapped-character-design-prompt.ts',
  allCharacterSurfaceToneMappingFidelityRequired: true,
  unknownSurfaceMayBeInventedByImageModel: policy.rules?.unknownSurfaceMayBeInventedByImageModel,
  toneMappingMayChangeSkinIdentity: policy.rules?.toneMappingMayChangeSkinIdentity,
  surfacePolishMayDeAgeCharacter: policy.rules?.surfacePolishMayDeAgeCharacter,
  surfacePolishMaySlimBodyByHighlight: policy.rules?.surfacePolishMaySlimBodyByHighlight,
  premiumAssetMayUniversalizeGloss: policy.rules?.premiumAssetMayUniversalizeGloss,
  weatherMaySexualizeWetSurface: policy.rules?.weatherMaySexualizeWetSurface,
  nonHumanSurfaceMayHumanize: policy.rules?.nonHumanSurfaceMayHumanize,
  generatedMicrotextureCreatesCanon: policy.rules?.generatedMicrotextureCreatesCanon,
  surfaceToneMappingPolicyPath: POLICY_PATH,
  surfaceToneMappingAuthorityPath: AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownSurfaceMayBeInventedByImageModel',
  'toneMappingMayChangeSkinIdentity',
  'surfacePolishMayDeAgeCharacter',
  'surfacePolishMaySlimBodyByHighlight',
  'premiumAssetMayUniversalizeGloss',
  'weatherMaySexualizeWetSurface',
  'nonHumanSurfaceMayHumanize',
  'generatedMicrotextureCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: surface/tone guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const block = [
  'SURFACE / TONE-MAPPING FIDELITY — FINAL MATERIAL LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve skin tone, age, body volume, fur/shell identity and material-class differences. Premium polish may not universalize smoothness, gloss or whitening.',
  'Unknown surface detail uses MATERIAL_APPROPRIATE_NEUTRAL_SURFACE. Do not invent freckles, scars, tattoos, beauty marks, fur patterns, shell scratches or premium chrome.',
  'Tone mapping may not lighten dark skin, make pale skin emissive, de-age faces, slim bodies through highlight placement, humanize non-human surfaces or sexualize wet materials.',
  'Generated microtexture and grading treatments remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${block}`;
result.reviewChecklist = [
  '肌色・年齢・体格をtone mappingやbeauty smoothingで変えない',
  'fur/shell/cloth/leather/paper/wood/metalを同一glossにしない',
  '雨濡れを性的なwet glossへ変換しない',
  '高解像度化でfreckles/scars/scratches/poresを発明しない',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
