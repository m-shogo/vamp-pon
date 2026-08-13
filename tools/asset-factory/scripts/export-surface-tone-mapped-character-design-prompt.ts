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
const LOD_POLICY_PATH = 'data/visual/all-character-feature-scale-proportion-lod-fidelity-master-v1.json';
const LOD_AUTHORITY_PATH = 'docs/visual/all-character-feature-scale-proportion-lod-fidelity-master-v1.md';
const VARIANT_POLICY_PATH = 'data/visual/all-character-variant-delta-state-transformation-fidelity-master-v1.json';
const VARIANT_AUTHORITY_PATH = 'docs/visual/all-character-variant-delta-state-transformation-fidelity-master-v1.md';

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
const lod = loadAuthority(LOD_POLICY_PATH, LOD_AUTHORITY_PATH, 'feature-scale/proportion/lod');
const variant = loadAuthority(VARIANT_POLICY_PATH, VARIANT_AUTHORITY_PATH, 'variant-delta/state-transformation');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 80 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterFocusDepthEffectsFidelityRequired !== true) throw new Error(`${options.characterId}: focus/depth/effects chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 32),
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
  allCharacterFeatureScaleProportionLodFidelityRequired: true,
  unknownLodMayBeInventedByImageModel: lod.policy.rules?.unknownLodMayBeInventedByImageModel,
  lodMayEnlargeEyesForReadability: lod.policy.rules?.lodMayEnlargeEyesForReadability,
  lodMayDeleteIdentityFaceLandmark: lod.policy.rules?.lodMayDeleteIdentityFaceLandmark,
  lodMayBeautifyJawOrChin: lod.policy.rules?.lodMayBeautifyJawOrChin,
  lodMayChangeHeadBodyRatio: lod.policy.rules?.lodMayChangeHeadBodyRatio,
  lodMayLengthenLegs: lod.policy.rules?.lodMayLengthenLegs,
  lodMaySlimBodyCategory: lod.policy.rules?.lodMaySlimBodyCategory,
  lodMayDeAgeCharacter: lod.policy.rules?.lodMayDeAgeCharacter,
  lodMayShrinkMobilityEquipment: lod.policy.rules?.lodMayShrinkMobilityEquipment,
  lodMayMascotifyAnimal: lod.policy.rules?.lodMayMascotifyAnimal,
  lodMayHumanizeRobot: lod.policy.rules?.lodMayHumanizeRobot,
  premiumAssetMayBeautifyProportionAutomatically: lod.policy.rules?.premiumAssetMayBeautifyProportionAutomatically,
  generatedLodTreatmentCreatesCanon: lod.policy.rules?.generatedLodTreatmentCreatesCanon,
  allCharacterVariantDeltaStateTransformationFidelityRequired: true,
  unknownStateDeltaMayBeInventedByImageModel: variant.policy.rules?.unknownStateDeltaMayBeInventedByImageModel,
  stateMayRedesignIdentity: variant.policy.rules?.stateMayRedesignIdentity,
  stateMayChangeBodyCategory: variant.policy.rules?.stateMayChangeBodyCategory,
  stateMayDeAgeCharacter: variant.policy.rules?.stateMayDeAgeCharacter,
  stateMayIncreaseExposureAutomatically: variant.policy.rules?.stateMayIncreaseExposureAutomatically,
  stateMayInventBodyModification: variant.policy.rules?.stateMayInventBodyModification,
  stateMayRemoveMobilityEquipment: variant.policy.rules?.stateMayRemoveMobilityEquipment,
  stateMayResetMaintenanceHistory: variant.policy.rules?.stateMayResetMaintenanceHistory,
  stateMayIncreaseOrnamentAutomatically: variant.policy.rules?.stateMayIncreaseOrnamentAutomatically,
  stateMayReplaceIdentityPaletteAutomatically: variant.policy.rules?.stateMayReplaceIdentityPaletteAutomatically,
  stateMayInventPropOrRelationshipEvidence: variant.policy.rules?.stateMayInventPropOrRelationshipEvidence,
  premiumVariantMayBeautifyCharacterAutomatically: variant.policy.rules?.premiumVariantMayBeautifyCharacterAutomatically,
  generatedStateDeltaCreatesCanon: variant.policy.rules?.generatedStateDeltaCreatesCanon,
  variantBaselineLockedAxes: variant.policy.baselineLockedAxes,
  variantAllowedDeltaClasses: variant.policy.allowedDeltaClasses,
  variantDeltaLedgerRequiredFields: variant.policy.deltaLedgerRequiredFields,
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
  featureScaleProportionLodPolicyPath: LOD_POLICY_PATH,
  featureScaleProportionLodAuthorityPath: LOD_AUTHORITY_PATH,
  variantDeltaStateTransformationPolicyPath: VARIANT_POLICY_PATH,
  variantDeltaStateTransformationAuthorityPath: VARIANT_AUTHORITY_PATH,
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
  'generatedSpacingTreatmentCreatesCanon', 'unknownLodMayBeInventedByImageModel', 'lodMayEnlargeEyesForReadability',
  'lodMayDeleteIdentityFaceLandmark', 'lodMayBeautifyJawOrChin', 'lodMayChangeHeadBodyRatio', 'lodMayLengthenLegs',
  'lodMaySlimBodyCategory', 'lodMayDeAgeCharacter', 'lodMayShrinkMobilityEquipment', 'lodMayMascotifyAnimal',
  'lodMayHumanizeRobot', 'premiumAssetMayBeautifyProportionAutomatically', 'generatedLodTreatmentCreatesCanon',
  'unknownStateDeltaMayBeInventedByImageModel', 'stateMayRedesignIdentity', 'stateMayChangeBodyCategory',
  'stateMayDeAgeCharacter', 'stateMayIncreaseExposureAutomatically', 'stateMayInventBodyModification',
  'stateMayRemoveMobilityEquipment', 'stateMayResetMaintenanceHistory', 'stateMayIncreaseOrnamentAutomatically',
  'stateMayReplaceIdentityPaletteAutomatically', 'stateMayInventPropOrRelationshipEvidence',
  'premiumVariantMayBeautifyCharacterAutomatically', 'generatedStateDeltaCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: final rendering guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [
  AUTHORITY_PATH, POLICY_PATH, VALUE_AUTHORITY_PATH, VALUE_POLICY_PATH, EDGE_AUTHORITY_PATH, EDGE_POLICY_PATH,
  DETAIL_AUTHORITY_PATH, DETAIL_POLICY_PATH, SPACE_AUTHORITY_PATH, SPACE_POLICY_PATH, LOD_AUTHORITY_PATH, LOD_POLICY_PATH,
  VARIANT_AUTHORITY_PATH, VARIANT_POLICY_PATH,
]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const surfaceBlock = [
  'SURFACE / TONE-MAPPING FIDELITY — FINAL MATERIAL LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve skin tone, age, body volume, fur/shell identity and material-class differences. Premium polish may not universalize smoothness, gloss or whitening.',
  'Unknown surface detail uses MATERIAL_APPROPRIATE_NEUTRAL_SURFACE. Do not invent freckles, scars, tattoos, beauty marks, fur patterns, shell scratches or premium chrome.',
  'Generated microtexture and grading treatments remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  surface.authority,
].join('\n');

const valueBlock = [
  'CONTRAST / VALUE HIERARCHY FIDELITY — FINAL VALUE LOCK.',
  `Authority: ${VALUE_AUTHORITY_PATH}.`,
  `Machine policy: ${VALUE_POLICY_PATH}.`,
  'Night is not black fill and premium is not maximum contrast. Preserve midtones, body category, face geometry, garment layers, hand/contact, mobility equipment and established palette hierarchy.',
  'Unknown value design uses RESTRAINED_IDENTITY_PRESERVING_VALUE_HIERARCHY. Do not whiten faces, crush identity information, invent rim light, or make props emissive merely for separation.',
  value.authority,
].join('\n');

const edgeBlock = [
  'EDGE / LINE-WEIGHT / SHAPE BOUNDARY FIDELITY — FINAL CONTOUR LOCK.',
  `Authority: ${EDGE_AUTHORITY_PATH}.`,
  `Machine policy: ${EDGE_POLICY_PATH}.`,
  'Edges describe authorized shape; they do not redesign it. Preserve face contour, age, body category, garment construction, prop and mobility-equipment boundaries.',
  'Unknown edge treatment uses IDENTITY_PRESERVING_NEUTRAL_BOUNDARY. Generated edge treatments remain CANDIDATE_REVIEW_REQUIRED.',
  edge.authority,
].join('\n');

const detailBlock = [
  'DETAIL DENSITY / ORNAMENT BUDGET FIDELITY — FINAL INFORMATION-DENSITY LOCK.',
  `Authority: ${DETAIL_AUTHORITY_PATH}.`,
  `Machine policy: ${DETAIL_POLICY_PATH}.`,
  'Information density is not rarity or importance. Unknown detail density uses MINIMUM_SUFFICIENT_AUTHORIZED_DETAIL. Unsupported ornament budget is zero.',
  'Generated ornament remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  detail.authority,
].join('\n');

const spaceBlock = [
  'NEGATIVE SPACE / CLUSTER SEPARATION FIDELITY — FINAL SPACING LOCK.',
  `Authority: ${SPACE_AUTHORITY_PATH}.`,
  `Machine policy: ${SPACE_POLICY_PATH}.`,
  'Empty space is readability structure. Unknown spacing uses FUNCTIONAL_IDENTITY_PRESERVING_BREATHING_ROOM. Remove clutter before changing anatomy, clothing, mobility, or prop relations.',
  space.authority,
].join('\n');

const lodBlock = [
  'FEATURE SCALE / PROPORTION / LOD FIDELITY — FINAL PROPORTION LOCK.',
  `Authority: ${LOD_AUTHORITY_PATH}.`,
  `Machine policy: ${LOD_POLICY_PATH}.`,
  'LOD is information reduction, not character redesign. Unknown LOD uses PROPORTION_PRESERVING_MINIMUM_SUFFICIENT_LOD. Preserve face ratios, age, body category, proportion family and mobility-equipment scale.',
  'Generated LOD solutions remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  lod.authority,
].join('\n');

const variantBlock = [
  'VARIANT DELTA / STATE TRANSFORMATION FIDELITY — FINAL DELTA LOCK.',
  `Authority: ${VARIANT_AUTHORITY_PATH}.`,
  `Machine policy: ${VARIANT_POLICY_PATH}.`,
  'A state is baseline plus explicitly authorized delta, never blanket redesign permission. Unknown state uses BASELINE_PRESERVING_MINIMUM_AUTHORIZED_DELTA and every unspecified axis inherits baseline.',
  'Dawn/Kokuyou/premium/battle/seasonal labels may not automatically alter body category, age, exposure, piercing/tattoo policy, disability, mobility equipment, garment construction, maintenance history, ornament density, palette identity, props or relationship evidence.',
  'Every candidate state change must be reviewable in a delta ledger. Generated state changes remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  variant.authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${surfaceBlock}\n\n${valueBlock}\n\n${edgeBlock}\n\n${detailBlock}\n\n${spaceBlock}\n\n${lodBlock}\n\n${variantBlock}`;
result.reviewChecklist = [
  '肌色・年齢・体格をtone mappingやbeauty smoothingで変えない',
  '線幅・小型化で顔比率・年齢・体型・服構造を別物にしない',
  'premium/rare/high-resを理由に装飾を増やさない',
  'identity-criticalなnegative spaceをeffect/ornamentで埋めない',
  'LODではmicrodetailを先に落とし、顔比率・体型・mobility equipment相対サイズを保持する',
  'state差分はbaseline + authorized deltaで管理し、未指定軸はbaselineを継承する',
  'Dawn/Kokuyou/premiumを理由に露出・体型・年齢・body modification・mobility・装飾を自動変更しない',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
