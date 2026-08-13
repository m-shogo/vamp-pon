import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-focus-depth-effects-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-surface-tone-mapping-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-surface-tone-mapping-fidelity-master-v1.md';
const VALUE_POLICY_PATH = 'data/visual/all-character-contrast-value-hierarchy-fidelity-master-v1.json';
const VALUE_AUTHORITY_PATH = 'docs/visual/all-character-contrast-value-hierarchy-fidelity-master-v1.md';
const EDGE_POLICY_PATH = 'data/visual/all-character-edge-line-shape-boundary-fidelity-master-v1.json';
const EDGE_AUTHORITY_PATH = 'docs/visual/all-character-edge-line-shape-boundary-fidelity-master-v1.md';
const DETAIL_POLICY_PATH = 'data/visual/all-character-detail-density-ornament-budget-fidelity-master-v1.json';
const DETAIL_AUTHORITY_PATH = 'docs/visual/all-character-detail-density-ornament-budget-fidelity-master-v1.md';
const SPACE_POLICY_PATH = 'data/visual/all-character-negative-space-cluster-separation-fidelity-master-v1.json';
const SPACE_AUTHORITY_PATH = 'docs/visual/all-character-negative-space-cluster-separation-fidelity-master-v1.md';

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
const edge = loadAuthority(EDGE_POLICY_PATH, EDGE_AUTHORITY_PATH, 'edge/line/shape-boundary');
const detail = loadAuthority(DETAIL_POLICY_PATH, DETAIL_AUTHORITY_PATH, 'detail-density/ornament-budget');
const space = loadAuthority(SPACE_POLICY_PATH, SPACE_AUTHORITY_PATH, 'negative-space/cluster-separation');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 68 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterFocusDepthEffectsFidelityRequired !== true) throw new Error(`${options.characterId}: focus/depth/effects chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 30),
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
  allCharacterEdgeLineShapeBoundaryFidelityRequired: true,
  unknownEdgeMayBeInventedByImageModel: edge.policy.rules?.unknownEdgeMayBeInventedByImageModel,
  lineWeightMayRedesignFace: edge.policy.rules?.lineWeightMayRedesignFace,
  lineWeightMayRedesignBodyCategory: edge.policy.rules?.lineWeightMayRedesignBodyCategory,
  smallScaleMayEnlargeEyesForReadability: edge.policy.rules?.smallScaleMayEnlargeEyesForReadability,
  smallScaleMayInventOutlineForReadability: edge.policy.rules?.smallScaleMayInventOutlineForReadability,
  premiumAssetMayBeautifyContourAutomatically: edge.policy.rules?.premiumAssetMayBeautifyContourAutomatically,
  lineCleanupMayHideMobilityEquipment: edge.policy.rules?.lineCleanupMayHideMobilityEquipment,
  lineCleanupMayInventExposure: edge.policy.rules?.lineCleanupMayInventExposure,
  nonHumanBoundaryMayHumanize: edge.policy.rules?.nonHumanBoundaryMayHumanize,
  generatedEdgeTreatmentCreatesCanon: edge.policy.rules?.generatedEdgeTreatmentCreatesCanon,
  allCharacterDetailDensityOrnamentBudgetFidelityRequired: true,
  unknownDetailMayBeInventedByImageModel: detail.policy.rules?.unknownDetailMayBeInventedByImageModel,
  premiumAssetMayIncreaseOrnamentCountAutomatically: detail.policy.rules?.premiumAssetMayIncreaseOrnamentCountAutomatically,
  highResolutionMayInventMicroDecoration: detail.policy.rules?.highResolutionMayInventMicroDecoration,
  importanceMayIncreaseOrnamentDensity: detail.policy.rules?.importanceMayIncreaseOrnamentDensity,
  rarityMayIncreaseOrnamentDensity: detail.policy.rules?.rarityMayIncreaseOrnamentDensity,
  ornamentMayCompensateForWeakIdentity: detail.policy.rules?.ornamentMayCompensateForWeakIdentity,
  ornamentMayAlterExposurePolicy: detail.policy.rules?.ornamentMayAlterExposurePolicy,
  ornamentMayAlterBodyModificationPolicy: detail.policy.rules?.ornamentMayAlterBodyModificationPolicy,
  worldMotifMayBeRepeatedAsFiller: detail.policy.rules?.worldMotifMayBeRepeatedAsFiller,
  generatedOrnamentCreatesCanon: detail.policy.rules?.generatedOrnamentCreatesCanon,
  detailOrnamentDefaultBudgets: detail.policy.defaultBudgets,
  allCharacterNegativeSpaceClusterSeparationFidelityRequired: true,
  unknownSpacingMayBeInventedByImageModel: space.policy.rules?.unknownSpacingMayBeInventedByImageModel,
  premiumAssetMayReduceNegativeSpaceAutomatically: space.policy.rules?.premiumAssetMayReduceNegativeSpaceAutomatically,
  effectsMayFillIdentityCriticalNegativeSpace: space.policy.rules?.effectsMayFillIdentityCriticalNegativeSpace,
  ornamentMayFillIdentityCriticalNegativeSpace: space.policy.rules?.ornamentMayFillIdentityCriticalNegativeSpace,
  spacingMayIncreaseExposure: space.policy.rules?.spacingMayIncreaseExposure,
  spacingMayInventGarmentCutout: space.policy.rules?.spacingMayInventGarmentCutout,
  spacingMayDetachPropFromUseRelation: space.policy.rules?.spacingMayDetachPropFromUseRelation,
  spacingMayHideMobilityEquipment: space.policy.rules?.spacingMayHideMobilityEquipment,
  relationshipMayForceTouchingSilhouette: space.policy.rules?.relationshipMayForceTouchingSilhouette,
  generatedSpacingTreatmentCreatesCanon: space.policy.rules?.generatedSpacingTreatmentCreatesCanon,
  surfaceToneMappingPolicyPath: POLICY_PATH,
  surfaceToneMappingAuthorityPath: AUTHORITY_PATH,
  contrastValueHierarchyPolicyPath: VALUE_POLICY_PATH,
  contrastValueHierarchyAuthorityPath: VALUE_AUTHORITY_PATH,
  edgeLineShapeBoundaryPolicyPath: EDGE_POLICY_PATH,
  edgeLineShapeBoundaryAuthorityPath: EDGE_AUTHORITY_PATH,
  detailDensityOrnamentBudgetPolicyPath: DETAIL_POLICY_PATH,
  detailDensityOrnamentBudgetAuthorityPath: DETAIL_AUTHORITY_PATH,
  negativeSpaceClusterSeparationPolicyPath: SPACE_POLICY_PATH,
  negativeSpaceClusterSeparationAuthorityPath: SPACE_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownSurfaceMayBeInventedByImageModel', 'toneMappingMayChangeSkinIdentity', 'surfacePolishMayDeAgeCharacter',
  'surfacePolishMaySlimBodyByHighlight', 'premiumAssetMayUniversalizeGloss', 'weatherMaySexualizeWetSurface',
  'nonHumanSurfaceMayHumanize', 'generatedMicrotextureCreatesCanon', 'unknownValueHierarchyMayBeInventedByImageModel',
  'contrastMayChangeSkinIdentity', 'contrastMayHideBodyCategory', 'contrastMayHideMobilityEquipment',
  'contrastMayInventOutlineOrGlow', 'premiumAssetMayIncreaseContrastAutomatically', 'nightMayCrushIdentityMidtones',
  'generatedValueTreatmentCreatesCanon', 'unknownEdgeMayBeInventedByImageModel', 'lineWeightMayRedesignFace',
  'lineWeightMayRedesignBodyCategory', 'smallScaleMayEnlargeEyesForReadability', 'smallScaleMayInventOutlineForReadability',
  'premiumAssetMayBeautifyContourAutomatically', 'lineCleanupMayHideMobilityEquipment', 'lineCleanupMayInventExposure',
  'nonHumanBoundaryMayHumanize', 'generatedEdgeTreatmentCreatesCanon', 'unknownDetailMayBeInventedByImageModel',
  'premiumAssetMayIncreaseOrnamentCountAutomatically', 'highResolutionMayInventMicroDecoration',
  'importanceMayIncreaseOrnamentDensity', 'rarityMayIncreaseOrnamentDensity', 'ornamentMayCompensateForWeakIdentity',
  'ornamentMayAlterExposurePolicy', 'ornamentMayAlterBodyModificationPolicy', 'worldMotifMayBeRepeatedAsFiller',
  'generatedOrnamentCreatesCanon', 'unknownSpacingMayBeInventedByImageModel',
  'premiumAssetMayReduceNegativeSpaceAutomatically', 'effectsMayFillIdentityCriticalNegativeSpace',
  'ornamentMayFillIdentityCriticalNegativeSpace', 'spacingMayIncreaseExposure', 'spacingMayInventGarmentCutout',
  'spacingMayDetachPropFromUseRelation', 'spacingMayHideMobilityEquipment', 'relationshipMayForceTouchingSilhouette',
  'generatedSpacingTreatmentCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: final rendering guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, VALUE_AUTHORITY_PATH, VALUE_POLICY_PATH, EDGE_AUTHORITY_PATH, EDGE_POLICY_PATH, DETAIL_AUTHORITY_PATH, DETAIL_POLICY_PATH, SPACE_AUTHORITY_PATH, SPACE_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

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

const edgeBlock = [
  'EDGE / LINE-WEIGHT / SHAPE BOUNDARY FIDELITY — FINAL CONTOUR LOCK.',
  `Authority: ${EDGE_AUTHORITY_PATH}.`,
  `Machine policy: ${EDGE_POLICY_PATH}.`,
  'Edges describe authorized shape; they do not redesign it. Preserve face contour, eye/brow geometry, age, body category, garment construction, hand/contact, prop and mobility-equipment boundaries.',
  'Unknown edge treatment uses IDENTITY_PRESERVING_NEUTRAL_BOUNDARY. Do not enlarge eyes, sharpen or soften jaws, slim bodies, invent exposure, hide mobility equipment, humanize animal/robot contours, or add white/neon outlines for readability.',
  'For small-scale assets, remove non-identity edge information before adding anything. Generated edge treatments remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  edge.authority,
].join('\n');

const detailBlock = [
  'DETAIL DENSITY / ORNAMENT BUDGET FIDELITY — FINAL INFORMATION-DENSITY LOCK.',
  `Authority: ${DETAIL_AUTHORITY_PATH}.`,
  `Machine policy: ${DETAIL_POLICY_PATH}.`,
  'Information density is not rarity, importance, beauty or professionalism. Every visible detail needs an authorized job in identity, construction, use, storage, repair, material transition, world/era translation or source-backed history.',
  'Unknown detail density uses MINIMUM_SUFFICIENT_AUTHORIZED_DETAIL. Default unsupported budgets for gems/emissive nodes, jewelry, piercings, tattoos, decorative harnesses, decorative cutouts and floating decorative cloth are zero.',
  'Do not add gold trim, gems, extra belts, harnesses, floating cloth, glow nodes, matching accessories, exposure, micro-decoration or repeated motifs to make an asset feel premium, complete or rare.',
  'Generated ornament remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  detail.authority,
].join('\n');

const spaceBlock = [
  'NEGATIVE SPACE / CLUSTER SEPARATION FIDELITY — FINAL SPACING LOCK.',
  `Authority: ${SPACE_AUTHORITY_PATH}.`,
  `Machine policy: ${SPACE_POLICY_PATH}.`,
  'Empty space is a readability structure, not missing detail. Preserve readable gaps around face, body-category cues, garment construction, hand/prop contact, main props and mobility equipment.',
  'Unknown spacing uses FUNCTIONAL_IDENTITY_PRESERVING_BREATHING_ROOM. Do not fill identity-critical gaps with effects or ornament, invent exposure/cutouts, detach props from believable use, hide mobility equipment, or force relationship silhouettes to touch.',
  'For crowded assets, remove decorative/effect clutter before changing anatomy, clothing, mobility, or prop relations. Generated spacing remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  space.authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${surfaceBlock}\n\n${valueBlock}\n\n${edgeBlock}\n\n${detailBlock}\n\n${spaceBlock}`;
result.reviewChecklist = [
  '肌色・年齢・体格をtone mappingやbeauty smoothingで変えない',
  'fur/shell/cloth/leather/paper/wood/metalを同一glossにしない',
  '夜でもmidtoneを残し、顔の白化・黒潰れ・万能rim lightで本人性を作らない',
  '線幅・輪郭整理・小型化で顔形、目、年齢、体型、服構造を別物にしない',
  'premium/重要/rare/high-resを理由にgold trim・gem・belt・harness・floating cloth・glow nodeを増やさない',
  '顔・手/prop・脚/衣服・mobility equipmentのidentity-criticalな空白をeffect/ornamentで埋めない',
  'spacingのために露出・cutout・浮遊prop・白縁・relationship接触を発明しない',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
