import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-focus-depth-effects-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-surface-tone-mapping-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-surface-tone-mapping-fidelity-master-v1.md';
const VALUE_POLICY_PATH = 'data/visual/all-character-contrast-value-hierarchy-fidelity-master-v1.json';
const VALUE_AUTHORITY_PATH = 'docs/visual/all-character-contrast-value-hierarchy-fidelity-master-v1.md';

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

function loadAuthority(policyPath: string, authorityPath: string, label: string) {
  const policy = JSON.parse(readFileSync(resolve(process.cwd(), policyPath), 'utf8'));
  const authority = readFileSync(resolve(process.cwd(), authorityPath), 'utf8');
  if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error(`${label} authority status invalid`);
  if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error(`${label} scope weakened`);
  return { policy, authority };
}

const options = parseArgs(process.argv.slice(2));
const surface = loadAuthority(POLICY_PATH, AUTHORITY_PATH, 'surface/tone-mapping');
const value = loadAuthority(VALUE_POLICY_PATH, VALUE_AUTHORITY_PATH, 'contrast/value-hierarchy');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 56 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterFocusDepthEffectsFidelityRequired !== true) throw new Error(`${options.characterId}: focus/depth/effects chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 27),
  generatedBy: 'tools/asset-factory/scripts/export-surface-tone-mapped-character-design-prompt.ts',
  allCharacterSurfaceToneMappingFidelityRequired: true,
  unknownSurfaceMayBeInventedByImageModel: surface.policy.rules?.unknownSurfaceMayBeInventedByImageModel,
  toneMappingMayChangeSkinIdentity: surface.policy.rules?.toneMappingMayChangeSkinIdentity,
  surfacePolishMayDeAgeCharacter: surface.policy.rules?.surfacePolishMayDeAgeCharacter,
  surfacePolishMaySlimBodyByHighlight: surface.policy.rules?.surfacePolishMaySlimBodyByHighlight,
  premiumAssetMayUniversalizeGloss: surface.policy.rules?.premiumAssetMayUniversalizeGloss,
  weatherMaySexualizeWetSurface: surface.policy.rules?.weatherMaySexualizeWetSurface,
  nonHumanSurfaceMayHumanize: surface.policy.rules?.nonHumanSurfaceMayHumanize,
  generatedMicrotextureCreatesCanon: surface.policy.rules?.generatedMicrotextureCreatesCanon,
  allCharacterContrastValueHierarchyFidelityRequired: true,
  unknownValueHierarchyMayBeInventedByImageModel: value.policy.rules?.unknownValueHierarchyMayBeInventedByImageModel,
  contrastMayChangeSkinIdentity: value.policy.rules?.contrastMayChangeSkinIdentity,
  contrastMayHideBodyCategory: value.policy.rules?.contrastMayHideBodyCategory,
  contrastMayHideMobilityEquipment: value.policy.rules?.contrastMayHideMobilityEquipment,
  contrastMayInventOutlineOrGlow: value.policy.rules?.contrastMayInventOutlineOrGlow,
  premiumAssetMayIncreaseContrastAutomatically: value.policy.rules?.premiumAssetMayIncreaseContrastAutomatically,
  nightMayCrushIdentityMidtones: value.policy.rules?.nightMayCrushIdentityMidtones,
  generatedValueTreatmentCreatesCanon: value.policy.rules?.generatedValueTreatmentCreatesCanon,
  surfaceToneMappingPolicyPath: POLICY_PATH,
  surfaceToneMappingAuthorityPath: AUTHORITY_PATH,
  contrastValueHierarchyPolicyPath: VALUE_POLICY_PATH,
  contrastValueHierarchyAuthorityPath: VALUE_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownSurfaceMayBeInventedByImageModel', 'toneMappingMayChangeSkinIdentity', 'surfacePolishMayDeAgeCharacter',
  'surfacePolishMaySlimBodyByHighlight', 'premiumAssetMayUniversalizeGloss', 'weatherMaySexualizeWetSurface',
  'nonHumanSurfaceMayHumanize', 'generatedMicrotextureCreatesCanon', 'unknownValueHierarchyMayBeInventedByImageModel',
  'contrastMayChangeSkinIdentity', 'contrastMayHideBodyCategory', 'contrastMayHideMobilityEquipment',
  'contrastMayInventOutlineOrGlow', 'premiumAssetMayIncreaseContrastAutomatically', 'nightMayCrushIdentityMidtones',
  'generatedValueTreatmentCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: final rendering guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, VALUE_AUTHORITY_PATH, VALUE_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const surfaceBlock = [
  'SURFACE / TONE-MAPPING FIDELITY — FINAL MATERIAL LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve skin tone, age, body volume, fur/shell identity and material-class differences. Premium polish may not universalize smoothness, gloss or whitening.',
  'Unknown surface detail uses MATERIAL_APPROPRIATE_NEUTRAL_SURFACE. Do not invent freckles, scars, tattoos, beauty marks, fur patterns, shell scratches or premium chrome.',
  'Tone mapping may not lighten dark skin, make pale skin emissive, de-age faces, slim bodies through highlight placement, humanize non-human surfaces or sexualize wet materials.',
  'Generated microtexture and grading treatments remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  surface.authority,
].join('\n');

const valueBlock = [
  'CONTRAST / VALUE HIERARCHY FIDELITY — FINAL VALUE LOCK.',
  `Authority: ${VALUE_AUTHORITY_PATH}.`,
  `Machine policy: ${VALUE_POLICY_PATH}.`,
  'Night is not black fill and premium is not maximum contrast. Preserve midtones, body category, face geometry, garment layers, hand/contact, mobility equipment and established palette hierarchy.',
  'Unknown value design uses RESTRAINED_IDENTITY_PRESERVING_VALUE_HIERARCHY. Do not whiten faces, crush dark skin/body information, invent white/neon rim light, or make props emissive merely for separation.',
  'Reduce decorative contrast before identity evidence. Generated contrast and value treatments remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  value.authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${surfaceBlock}\n\n${valueBlock}`;
result.reviewChecklist = [
  '肌色・年齢・体格をtone mappingやbeauty smoothingで変えない',
  'fur/shell/cloth/leather/paper/wood/metalを同一glossにしない',
  '雨濡れを性的なwet glossへ変換しない',
  '高解像度化でfreckles/scars/scratches/poresを発明しない',
  '夜でもmidtoneを残し、顔の白化・黒潰れ・万能rim lightで本人性を作らない',
  'premium/Dawn/Kokuyouを理由にglobal contrastやaccent luminanceを自動増加しない',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
