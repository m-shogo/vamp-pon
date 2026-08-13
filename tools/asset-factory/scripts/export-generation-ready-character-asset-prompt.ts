import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const CORE5_IDS = new Set(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
const WORLD_MATERIAL_DOC = 'docs/visual/world-material-translation-master-v1.md';
const WORLD_MATERIAL_JSON = 'data/visual/world-material-translation-master-v1.json';
const ALL_GARMENT_DOC = 'docs/visual/all-character-garment-production-master-v1.md';
const ALL_GARMENT_JSON = 'data/visual/all-character-garment-production-master-v1.json';
const ALL_LIGHT_DOC = 'docs/visual/all-character-night-light-rendering-master-v1.md';
const ALL_LIGHT_JSON = 'data/visual/all-character-night-light-rendering-master-v1.json';
const CORE5_GARMENT_DOC = 'docs/visual/core5-garment-construction-master-v1.md';
const CORE5_GARMENT_JSON = 'data/visual/core5-garment-construction-master-v1.json';
const PROFESSIONAL_DOC = 'docs/visual/master-authoring-professional-standard-v1.md';
const PROFESSIONAL_JSON = 'data/visual/master-authoring-professional-standard-v1.json';
const WORLD_MASTER = 'docs/00-current-story-world-master.md';
const BASE_EXPORTER = 'tools/asset-factory/scripts/export-character-asset-prompt.ts';
const LIVING_PATHS = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

type Options = { characterId: string; kind: string; output: string | null };
type BaseResolvedPrompt = Record<string, any> & {
  livingVisualProfile?: Record<string, any>;
  livingVisualProfilePath?: string;
  livingVisualProfileSourceStatus?: string | null;
};

function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  let output: string | null = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { kind = args[++i] ?? ''; continue; }
    if (arg === '--output') { output = args[++i] ?? null; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  if (!kind) throw new Error('--kind is required');
  return { characterId, kind, output };
}

function loadWorldMaterialMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), WORLD_MATERIAL_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`World Material Translation Master is not current: ${WORLD_MATERIAL_JSON}`);
  if (master.doesNotCreateNewStoryCanon !== true || master.worldbuildingAppearsAsConsequenceNotSticker !== true) throw new Error(`World Material governance weakened: ${WORLD_MATERIAL_JSON}`);
  if (master.unknownWorldMaterialMayBeInventedByImageModel !== false) throw new Error(`Image-model world/material invention must remain disabled: ${WORLD_MATERIAL_JSON}`);
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) throw new Error(`World Material image-generation gate incomplete: ${WORLD_MATERIAL_JSON}`);
  return master;
}

function loadAllCharacterGarmentMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), ALL_GARMENT_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`All Character Garment Production Master is not current: ${ALL_GARMENT_JSON}`);
  if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteAuthorCandidates !== true) throw new Error(`All Character Garment provenance governance weakened: ${ALL_GARMENT_JSON}`);
  if (master.scopeCount !== 36) throw new Error(`All Character Garment scope must remain 36: ${ALL_GARMENT_JSON}`);
  if (master.unknownGarmentDetailMayBeInventedByImageModel !== false || master.sharedRules?.unknownGarmentDetailMayBeInventedByImageModel !== false) throw new Error(`Image-model garment invention must remain disabled: ${ALL_GARMENT_JSON}`);
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 14) throw new Error(`All Character Garment image-generation gate incomplete: ${ALL_GARMENT_JSON}`);
  return master;
}

function loadAllCharacterNightLightMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), ALL_LIGHT_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`All Character Night/Light Rendering Master is not current: ${ALL_LIGHT_JSON}`);
  if (master.scopeCount !== 36 || master.doesNotCreateNewStoryCanon !== true) throw new Error(`All Character Night/Light scope/governance weakened: ${ALL_LIGHT_JSON}`);
  if (master.renderingMayRedesignCharacter !== false || master.unknownLightSourceMayBeInventedByImageModel !== false || master.nightIsPalettePreset !== false) throw new Error(`All Character Night/Light rendering guard weakened: ${ALL_LIGHT_JSON}`);
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) throw new Error(`All Character Night/Light image-generation gate incomplete: ${ALL_LIGHT_JSON}`);
  return master;
}

function loadCore5GarmentProfile(characterId: string) {
  if (!CORE5_IDS.has(characterId)) return null;
  const master = JSON.parse(readFileSync(resolve(process.cwd(), CORE5_GARMENT_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`Core5 Garment Construction Master is not current: ${CORE5_GARMENT_JSON}`);
  if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteAuthorCandidates !== true) throw new Error(`Core5 Garment source/candidate governance weakened: ${CORE5_GARMENT_JSON}`);
  if (master.unknownGarmentDetailMayBeInventedByImageModel !== false || master.sharedRules?.unknownGarmentDetailMayBeInventedByImageModel !== false) throw new Error(`Image-model garment invention must remain disabled: ${CORE5_GARMENT_JSON}`);
  const profile = (master.characters ?? []).find((entry: any) => entry.id === characterId);
  if (!profile) throw new Error(`Core5 Garment profile missing for ${characterId}; production export blocked.`);
  return { master, profile };
}

function findLivingProfile(characterId: string) {
  for (const path of LIVING_PATHS) {
    const document = JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
    const profile = (document.characters ?? []).find((entry: any) => entry.id === characterId);
    if (profile) return { path, status: document.status ?? null, profile };
  }
  throw new Error(`Living Visual Profile missing for ${characterId}; fallback export blocked.`);
}

function buildFallbackBase(characterId: string, kind: string): BaseResolvedPrompt {
  if (kind !== 'character_reference') throw new Error(`No Asset Factory prompt for ${characterId}/${kind}; fallback supports character_reference only.`);
  const living = findLivingProfile(characterId);
  const professional = JSON.parse(readFileSync(resolve(process.cwd(), PROFESSIONAL_JSON), 'utf8'));
  if (professional.status !== 'TOP_LEVEL_AUTHORING_GOVERNANCE') throw new Error(`Professional Master Standard invalid: ${PROFESSIONAL_JSON}`);
  if (professional.generationPolicy?.openMeansModelFreedom !== false || professional.generationPolicy?.generatedImageCreatesCanon !== false) throw new Error(`Professional generation policy weakened: ${PROFESSIONAL_JSON}`);
  const name = living.profile.name ?? living.profile.displayName ?? characterId;
  const authorityOrder = [
    PROFESSIONAL_DOC,
    PROFESSIONAL_JSON,
    WORLD_MASTER,
    'docs/visual/character-living-visual-master-v1.md',
    living.path,
    'docs/character-appearance-source-book-v1.md',
    'docs/character-appearance-distinction-generation-contract-v1.md',
    'docs/visual/character-designer-philosophy-master-v1.md',
    'data/visual/character-designer-philosophy-master-v1.json',
    'docs/visual/character-designer-craft-master-v1.md',
    'data/visual/character-designer-craft-master-v1.json',
    'docs/visual/character-designer-precedent-master-v1.md',
    'data/visual/character-designer-precedent-master-v1.json',
    'docs/visual/world-character-scenario-design-council-master-v1.md',
    'data/visual/world-character-scenario-design-council-master-v1.json',
    'docs/visual/relationship-embodied-daily-life-contract-v1.md',
    'data/visual/relationship-embodied-daily-life-contract-v1.json',
    'data/visual/character-designer-ai-brain.json',
  ];
  return {
    schemaVersion: 1,
    generatedBy: 'source-locked-fallback-inside-export-generation-ready-character-asset-prompt.ts',
    characterId,
    kind,
    professionalMasterPath: PROFESSIONAL_DOC,
    professionalMasterDataPath: PROFESSIONAL_JSON,
    professionalGenerationReadinessGate: professional.imageGenerationReadinessGate,
    livingVisualProfilePath: living.path,
    livingVisualProfileSourceStatus: living.status,
    livingVisualProfile: living.profile,
    openMeansImageModelFreedom: false,
    generatedImageCreatesCanon: false,
    unknownLifePreferenceMayBeInventedByImageModel: false,
    authorityOrder,
    prompt: [
      'SOURCE-LOCKED FALLBACK CHARACTER REFERENCE PROMPT.',
      `Character: ${name} (${characterId}).`,
      'Create a single full-body design-review reference on transparent background. This fallback exists only because the legacy Asset Factory prompt pack is absent.',
      'The loaded Living Visual Profile and downstream Masters are the design authority. Do not invent unresolved anatomy, exposure, body modification, garment detail, cultural shorthand, jewelry, ornament, prop history or relationship history.',
      'OPEN is not image-model freedom. Generated output is candidate review only and cannot create canon.',
      `Professional generation readiness gate: ${JSON.stringify(professional.imageGenerationReadinessGate)}.`,
      'LIVING VISUAL PROFILE — REQUIRED CHARACTER AUTHORITY.',
      JSON.stringify(living.profile, null, 2),
    ].join('\n'),
    negativePrompt: 'no text, no letters, no numbers, no logo, no watermark, no generic fantasy/gacha filler, no invented piercing, no invented tattoo, no invented exposure, no premium gold or gemstone escalation',
    reviewChecklist: [
      'Living Visual Profileのbody / exposure / body modification / clothing / absoluteNever / positivePreferenceを守る',
      'legacy prompt欠落を理由にimage modelへdesign decisionを委譲しない',
      'generated detailをCanonへ昇格しない',
    ],
    outputPathHint: `public/assets/prototypes/characters/${characterId}/references/${characterId}-reference-v1.png`,
    sizeSpec: '1024x1024 PNG RGBA, full body, front 3/4 view, transparent background, centered, no baked text.',
    fallbackPromptUsed: true,
  };
}

function runBaseExporter(characterId: string, kind: string): BaseResolvedPrompt {
  try {
    const stdout = execFileSync(process.execPath, [
      '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
      '--character', characterId, '--kind', kind, '--format', 'json',
    ], { cwd: process.cwd(), encoding: 'utf8' });
    return JSON.parse(stdout);
  } catch (error: any) {
    const stderr = String(error?.stderr ?? error?.message ?? '');
    if (!stderr.includes('Character asset prompt not found:')) throw error;
    return buildFallbackBase(characterId, kind);
  }
}

function normalizeAllCharacterGarmentProfile(base: BaseResolvedPrompt, master: any) {
  const p = base.livingVisualProfile;
  if (!p || typeof p !== 'object') throw new Error('Resolved base prompt missing livingVisualProfile; production export blocked.');
  const bodyComfort = typeof p.bodyComfort === 'object' && p.bodyComfort !== null ? p.bodyComfort.value ?? p.bodyComfort : p.bodyComfort;
  const exposure = p.exposurePreference ?? p.exposure ?? null;
  const bodyModification = p.bodyModification ?? {
    piercingPolicy: p.piercingPolicy ?? null,
    tattooPolicy: p.tattooPolicy ?? null,
    jewelryPolicy: p.jewelryPolicy ?? null,
    makeupPolicy: p.makeupPolicy ?? null,
    nailPolicy: p.nailPolicy ?? null,
  };
  const clothing = p.clothing ?? {};
  const silhouette = clothing.silhouette ?? p.silhouettePreference ?? null;
  const fit = clothing.fit ?? p.fitPreference ?? null;
  const materials = clothing.materials ?? p.materialPreference ?? null;
  const patterns = clothing.patterns ?? p.patternPreference ?? null;
  const footwear = clothing.footwear ?? p.footwearPreference ?? null;
  const storage = clothing.storage ?? p.bagPocketBehavior ?? null;
  const wearHabits = p.wearHabits ?? p.clothingWearHabits ?? null;
  const maintenance = p.maintenance ?? p.maintenanceBehavior ?? null;
  if (!Array.isArray(p.absoluteNever) || p.absoluteNever.length < 5) throw new Error(`${p.id}: Living Visual absoluteNever incomplete; production export blocked.`);
  if (!Array.isArray(p.positivePreference) || p.positivePreference.length < 5) throw new Error(`${p.id}: Living Visual positivePreference incomplete; production export blocked.`);
  return {
    id: p.id,
    name: p.name ?? p.displayName ?? p.id,
    species: p.species ?? 'HUMAN_LIKE_OR_UNSPECIFIED',
    sourceProfilePath: base.livingVisualProfilePath ?? null,
    sourceStatus: base.livingVisualProfileSourceStatus ?? null,
    derivationAuthority: 'SOURCE_PRESERVING_PROJECTION_FROM_LIVING_VISUAL_PROFILE',
    doesNotPromoteAuthorCandidate: true,
    lifeFocus: p.lifeFocus ?? null,
    bodyComfort: bodyComfort ?? null,
    movementNeeds: p.movementNeeds ?? null,
    exposure,
    bodyModification,
    silhouette,
    fit,
    materials,
    patterns,
    footwear,
    storage,
    wearHabits,
    maintenance,
    socialPresentation: p.socialPresentation ?? null,
    absoluteNever: p.absoluteNever,
    positivePreference: p.positivePreference,
    worldTranslationRule: master.worldTranslation,
    nonHumanHandling: master.nonHumanHandling,
    unresolvedDetailRule: 'Do not invent missing exact construction; remain conservative or exploratory-only.',
  };
}

function normalizeNightLightProfile(base: BaseResolvedPrompt, garmentProfile: any, master: any) {
  const p = base.livingVisualProfile ?? {};
  return {
    id: garmentProfile.id,
    name: garmentProfile.name,
    species: garmentProfile.species,
    sourceProfilePath: garmentProfile.sourceProfilePath,
    derivationAuthority: 'SOURCE_PRESERVING_RENDERING_PROJECTION',
    bodyComfort: garmentProfile.bodyComfort,
    exposure: garmentProfile.exposure,
    bodyModification: garmentProfile.bodyModification,
    materials: garmentProfile.materials,
    wearMaintenance: garmentProfile.maintenance,
    socialPresentation: garmentProfile.socialPresentation,
    absoluteNever: garmentProfile.absoluteNever,
    positivePreference: garmentProfile.positivePreference,
    skinAgeBodyPreservationRule: 'Preserve loaded neutral authority exactly; lighting cannot lighten skin, smooth age, slim body, change disability equipment, or alter species/body structure.',
    emittedVsReflectedRule: master.emissionRule,
    materialResponseRules: master.materialResponseRules,
    backgroundRules: master.backgroundRules,
    speciesLightRule: master.nonHumanRules?.[p.species ?? garmentProfile.species] ?? null,
    reviewTests: master.reviewTests,
    hardProhibitions: master.hardProhibitions,
  };
}

function buildWorldPromptBlock(master: any, characterId: string): string {
  const core5 = Array.isArray(master.core5) ? master.core5.find((entry: any) => entry.id === characterId) ?? null : null;
  return [
    'WORLD MATERIAL TRANSLATION MASTER — REQUIRED PRODUCTION VISUAL AUTHORITY.',
    `Authority: ${WORLD_MATERIAL_DOC}.`,
    `Machine rules: ${WORLD_MATERIAL_JSON}.`,
    'Worldbuilding must appear as consequence, not stickers. Translate night / route / record / ink / practical light / star-chart / missing-record / repair grammar through construction, storage, wear, handling and material response.',
    'Do not communicate Yoru no Shirube by automatically adding stars, paper scraps, ink splashes, glowing trim, gold edges, constellation jewelry, decorative compasses, lantern pendants, torn hems, patchwork, belts or pouches.',
    'Personal taste and Living Visual boundaries override decorative world shorthand. World context never authorizes extra exposure, piercing, tattoo, jewelry or ornament.',
    'Emitted light must have a real source. Repair must have a cause. Storage must contain something. Asymmetry must come from use/construction/history rather than premium-gacha filler.',
    `World grammar: ${JSON.stringify(master.worldGrammar, null, 2)}`,
    ...(core5 ? ['CHARACTER-SPECIFIC WORLD MATERIAL TRANSLATION — REQUIRED.', JSON.stringify(core5, null, 2)] : []),
    `Anti-generic world drift: ${JSON.stringify(master.antiGenericWorldDrift)}`,
  ].join('\n');
}

function buildAllCharacterGarmentBlock(master: any, profile: any): string {
  return [
    'ALL CHARACTER GARMENT PRODUCTION MASTER — REQUIRED FOR EVERY CHARACTER.',
    `Authority: ${ALL_GARMENT_DOC}.`,
    `Machine rules: ${ALL_GARMENT_JSON}.`,
    'This is a source-preserving projection from the loaded Living Visual Profile. Preserve provenance: AUTHOR_CANDIDATE remains AUTHOR_CANDIDATE and generated details never become canon.',
    'Treat clothing/body equipment as lived construction, not a genre costume surface. Do not invent exact buckle type, pocket count, fiber blend, heel height, repair location, jewelry quantity, exposure, or ornament when absent from source.',
    'For DOG/CAT/ARTIFICIAL_PERSON/MAINTENANCE_ROBOT, do not impose a generic human clothing template. Use body equipment, shell/panel/tool storage or grooming only when supported by the loaded profile.',
    'Age, body size, disability, skin tone, gender presentation, sexuality, artificiality and species are not costume generators.',
    'CHARACTER-SPECIFIC RESOLVED GARMENT PRODUCTION PROFILE — REQUIRED.',
    JSON.stringify(profile, null, 2),
    `All-character garment generation gate: ${JSON.stringify(master.imageGenerationGate)}`,
  ].join('\n');
}

function buildNightLightBlock(master: any, profile: any): string {
  return [
    'ALL CHARACTER NIGHT / LIGHT RENDERING MASTER — REQUIRED FOR EVERY CHARACTER.',
    `Authority: ${ALL_LIGHT_DOC}.`,
    `Machine rules: ${ALL_LIGHT_JSON}.`,
    'Night is not a palette preset. Do not apply universal navy/black recolor, cyan/violet rim, glowing eyes, glowing seams, magical bloom, or premium gold highlights.',
    'Rendering reveals the loaded design and may not redesign anatomy, skin tone, age, body shape, disability equipment, species, clothing construction, exposure, body modification, or object relation.',
    'Separate emitted from reflected light. Every emitted source must be loaded and identifiable. Reflection follows actual material; paper, skin, hair, fur, glass, shell and metal do not become self-luminous by mood.',
    'For transparent character references, use restrained neutral/world-credible inspection light without scenic background. For scene/cutin assets, environment light may affect local response but cannot invent character-side emission or recolor identity.',
    'CHARACTER-SPECIFIC RESOLVED NIGHT/LIGHT PROFILE — REQUIRED.',
    JSON.stringify(profile, null, 2),
    `Night/light generation gate: ${JSON.stringify(master.imageGenerationGate)}`,
  ].join('\n');
}

function buildCore5GarmentPromptBlock(garment: { master: any; profile: any } | null): string {
  if (!garment) return '';
  return [
    'CORE5 GARMENT CONSTRUCTION MASTER — STRONGER DEDICATED OVERRIDE.',
    `Authority: ${CORE5_GARMENT_DOC}.`,
    `Machine rules: ${CORE5_GARMENT_JSON}.`,
    'Resolve material physics, layer construction, closures, actual storage contents, footwear, wear locations, repair causes, prop interference and ordinary movement before decorative detail.',
    'No belt, strap, buckle, pouch, patch, chain, cutout, flap, metal plate, exposed area or ornament may appear without a loaded function/history. High resolution cannot add new garment concepts.',
    JSON.stringify(garment.profile, null, 2),
    `Core5 garment generation gate: ${JSON.stringify(garment.master.imageGenerationGate)}`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const base = runBaseExporter(options.characterId, options.kind);
const worldMaster = loadWorldMaterialMaster();
const allGarmentMaster = loadAllCharacterGarmentMaster();
const allLightMaster = loadAllCharacterNightLightMaster();
const allGarmentProfile = normalizeAllCharacterGarmentProfile(base, allGarmentMaster);
const nightLightProfile = normalizeNightLightProfile(base, allGarmentProfile, allLightMaster);
const core5Garment = loadCore5GarmentProfile(options.characterId);
const worldBlock = buildWorldPromptBlock(worldMaster, options.characterId);
const allGarmentBlock = buildAllCharacterGarmentBlock(allGarmentMaster, allGarmentProfile);
const nightLightBlock = buildNightLightBlock(allLightMaster, nightLightProfile);
const core5GarmentBlock = buildCore5GarmentPromptBlock(core5Garment);

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
const insertionIndex = Math.min(3, authorityOrder.length);
authorityOrder.splice(insertionIndex, 0, WORLD_MATERIAL_DOC, WORLD_MATERIAL_JSON, ALL_GARMENT_DOC, ALL_GARMENT_JSON, ALL_LIGHT_DOC, ALL_LIGHT_JSON);
if (core5Garment) authorityOrder.splice(insertionIndex + 6, 0, CORE5_GARMENT_DOC, CORE5_GARMENT_JSON);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 12),
  generatedBy: 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts',
  generationReadyProductionEntrypoint: true,
  worldMaterialTranslationMasterPath: WORLD_MATERIAL_JSON,
  worldMaterialTranslationAuthorityDocument: WORLD_MATERIAL_DOC,
  worldMaterialTranslationMaster: worldMaster,
  allCharacterGarmentProductionMasterPath: ALL_GARMENT_JSON,
  allCharacterGarmentProductionAuthorityDocument: ALL_GARMENT_DOC,
  allCharacterGarmentProductionRequired: true,
  allCharacterGarmentProductionProfile: allGarmentProfile,
  allCharacterNightLightRenderingMasterPath: ALL_LIGHT_JSON,
  allCharacterNightLightRenderingAuthorityDocument: ALL_LIGHT_DOC,
  allCharacterNightLightRenderingRequired: true,
  allCharacterNightLightRenderingProfile: nightLightProfile,
  core5GarmentConstructionMasterPath: core5Garment ? CORE5_GARMENT_JSON : null,
  core5GarmentConstructionAuthorityDocument: core5Garment ? CORE5_GARMENT_DOC : null,
  core5GarmentConstructionProfile: core5Garment?.profile ?? null,
  core5GarmentConstructionRequired: CORE5_IDS.has(options.characterId),
  unknownWorldMaterialMayBeInventedByImageModel: false,
  unknownGarmentDetailMayBeInventedByImageModel: false,
  unknownLightSourceMayBeInventedByImageModel: false,
  renderingMayRedesignCharacter: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${worldBlock}\n\n${allGarmentBlock}\n\n${nightLightBlock}${core5GarmentBlock ? `\n\n${core5GarmentBlock}` : ''}`,
  reviewChecklist: [
    'All Character Garment Production Masterを全キャラで本文まで読み、Living Visual Profileの衣装・身体境界をproductionへ投影する',
    'AUTHOR_CANDIDATEをUSER_DECIDEDへ昇格せず、欠けたexact detailをimage modelに発明させない',
    '非人間キャラへhuman garment templateを強制しない',
    '年齢・体型・障害・肌色・gender presentation・sexuality・speciesをcostume shorthandへ変換しない',
    'All Character Night/Light Rendering Masterを読み、nightを青filter / rim / bloomで代用しない',
    'skin tone / age / body shape / disability equipment / species / face geometryをlightingで変更しない',
    '全emitted lightに実在sourceがあり、reflectionをemissionへ誤変換しない',
    'rim / bloom / accentを消してもidentityとsilhouetteが残る',
    'World Material Translation Masterを本文まで読み、世界観を装飾記号ではなく構造・素材・使用痕へ翻訳する',
    '星 / 紙 / 墨 / 灯りを全員共通アクセサリーとして貼っていない',
    '素材・留め具・収納・摩耗・修繕が人物の生活・好みと矛盾しない',
    ...(core5Garment ? [
      'Core5 Garment Construction Masterのdedicated material / construction / closure / storage / footwear / wear / repair / prop interferenceを優先する',
      '歩行・着座・しゃがみ・腕上げ・prop取得で衣装構造が破綻しない',
    ] : []),
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
  ],
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`generation-ready character asset prompt exported: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
