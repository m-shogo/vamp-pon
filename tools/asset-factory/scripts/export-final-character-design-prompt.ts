import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { characterAppearanceGenerationContracts } from '../../../src/game/data/characterAppearanceGenerationContracts.ts';
import { current21SilhouetteMatrix } from '../../../src/game/data/current21SilhouetteMatrix.ts';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts';
const IDENTITY_DOC = 'docs/visual/all-character-identity-production-master-v1.md';
const IDENTITY_JSON = 'data/visual/all-character-identity-production-master-v1.json';
const EMBODIED_DOC = 'docs/visual/all-character-embodied-acting-production-master-v1.md';
const EMBODIED_JSON = 'data/visual/all-character-embodied-acting-production-master-v1.json';

type Options = { characterId: string; kind: string; output: string | null };

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

function loadIdentityMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), IDENTITY_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`Identity Production Master is not current: ${IDENTITY_JSON}`);
  if (master.scopeCount !== 36) throw new Error(`Identity Production Master scope must remain 36: ${IDENTITY_JSON}`);
  if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteCandidates !== true) throw new Error(`Identity Production provenance governance weakened: ${IDENTITY_JSON}`);
  if (master.unknownIdentityGeometryMayBeInventedByImageModel !== false) throw new Error(`Identity geometry invention must remain disabled: ${IDENTITY_JSON}`);
  if (!Array.isArray(master.requiredFields) || master.requiredFields.length < 20) throw new Error(`Identity required fields incomplete: ${IDENTITY_JSON}`);
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) throw new Error(`Identity image-generation gate incomplete: ${IDENTITY_JSON}`);
  return master;
}

function loadEmbodiedMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), EMBODIED_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`Embodied Acting Production Master is not current: ${EMBODIED_JSON}`);
  if (master.scopeCount !== 36) throw new Error(`Embodied Acting Production Master scope must remain 36: ${EMBODIED_JSON}`);
  if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteCandidates !== true) throw new Error(`Embodied acting provenance governance weakened: ${EMBODIED_JSON}`);
  if (master.unknownEmbodiedDetailMayBeInventedByImageModel !== false || master.generatedPoseCreatesCanon !== false) throw new Error(`Embodied acting generation guards weakened: ${EMBODIED_JSON}`);
  if (!Array.isArray(master.requiredChannels) || master.requiredChannels.length < 15) throw new Error(`Embodied acting required channels incomplete: ${EMBODIED_JSON}`);
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 14) throw new Error(`Embodied acting image-generation gate incomplete: ${EMBODIED_JSON}`);
  return master;
}

function runBaseExporter(characterId: string, kind: string) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
    '--character', characterId,
    '--kind', kind,
  ], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function resolveIdentityContract(characterId: string, base: any, master: any) {
  const livingName = base?.livingVisualProfile?.name ?? base?.livingVisualProfile?.displayName ?? null;
  const byId = characterAppearanceGenerationContracts.find((entry) => entry.id === characterId);
  const byDisplayName = livingName
    ? characterAppearanceGenerationContracts.filter((entry) => entry.displayName === livingName)
    : [];
  if (byDisplayName.length > 1) throw new Error(`${characterId}: ambiguous Appearance Generation Contract displayName match: ${livingName}`);
  const contract = byId ?? byDisplayName[0] ?? null;
  if (!contract) throw new Error(`Appearance Generation Contract missing for ${characterId}${livingName ? ` / ${livingName}` : ''}; final production export blocked.`);
  for (const field of master.requiredFields) {
    if (!(field in contract)) throw new Error(`${characterId}: required appearance field missing: ${field}`);
  }
  if (!Array.isArray(contract.forbiddenDrift) || contract.forbiddenDrift.length < 1) throw new Error(`${characterId}: forbiddenDrift missing`);
  if (contract.nearestExistingFace && !contract.differenceFromNearest) throw new Error(`${characterId}: nearestExistingFace requires differenceFromNearest`);
  return { contract, resolution: byId ? 'DIRECT_ID' : 'LIVING_DISPLAY_NAME_BRIDGE' };
}

function resolveEmbodiedProfile(characterId: string, base: any, master: any) {
  const exact = current21SilhouetteMatrix.find((entry) => entry.characterId === characterId);
  if (exact) {
    for (const field of master.current21RequiredFields ?? []) {
      if (!(field in exact) || !String((exact as any)[field] ?? '').trim()) throw new Error(`${characterId}: exact Current21 embodied field missing: ${field}`);
    }
    return {
      authorityClass: 'EXISTING_CANON_SOURCE_LOCKED',
      resolution: 'CURRENT21_EXACT_SILHOUETTE_MATRIX',
      source: master.current21Source,
      profile: exact,
    };
  }

  const living = base?.livingVisualProfile;
  if (!living) throw new Error(`${characterId}: Living Visual Profile missing; Future15 embodied derivation blocked.`);
  const required = master.future15DerivedFields ?? [];
  for (const field of required) {
    if (!(field in living)) throw new Error(`${characterId}: Future15 embodied derivation source missing: ${field}`);
  }
  return {
    authorityClass: master.future15ResolutionClass,
    resolution: 'FUTURE15_LIVING_VISUAL_CONSERVATIVE_DERIVATION',
    source: base.livingVisualProfilePath ?? master.future15Source,
    profile: {
      id: characterId,
      name: living.name ?? living.displayName ?? null,
      species: living.species ?? null,
      bodyComfort: living.bodyComfort ?? null,
      socialPresentation: living.socialPresentation ?? null,
      clothingSilhouette: living.clothing?.silhouette ?? [],
      clothingFit: living.clothing?.fit ?? null,
      footwear: living.clothing?.footwear ?? null,
      storage: living.clothing?.storage ?? null,
      wearHabits: living.wearHabits ?? [],
      maintenance: living.maintenance ?? null,
      positivePreference: living.positivePreference ?? [],
      absoluteNever: living.absoluteNever ?? [],
      unresolvedPolicy: 'Do not invent exact gesture, handedness, grip, stance angle, stride, support equipment configuration, collar use, breed-specific gait, robot articulation, or interpersonal distance. Omit or keep exploratory-only unless another authority resolves it.',
    },
  };
}

function identityPromptBlock(master: any, contract: any, resolution: string, productionId: string) {
  return [
    'ALL CHARACTER IDENTITY PRODUCTION MASTER — FINAL FACE/BODY AUTHORITY.',
    `Authority: ${IDENTITY_DOC}.`,
    `Machine policy: ${IDENTITY_JSON}.`,
    `Canonical machine source: ${master.canonicalMachineSource}.`,
    `Production ID → Appearance Contract resolution: ${productionId} → ${contract.id} (${resolution}).`,
    'Use the exact loaded Appearance Generation Contract. Do not use one attractive anime face/body base and then distinguish by hair, color, prop, glow, makeup, marks or clothing.',
    'Rendering may not change face anatomy, eye/eyelid/brow/lash construction, nose/mouth geometry, age coding, species, hair/head mass, body shape, or nearest-face distinction.',
    'Candidate surface marks/body modifications remain candidates. They cannot become mandatory identity anchors and generated output never promotes them.',
    'Age, plus-size/soft body, disability, child proportions, gender ambiguity, feminine presentation, artificiality and non-human species must not be normalized for attractiveness.',
    'CHARACTER-SPECIFIC APPEARANCE GENERATION CONTRACT — REQUIRED EXACT SOURCE.',
    JSON.stringify(contract, null, 2),
    `Neutral recognition tests: ${JSON.stringify(master.neutralRecognitionTests)}`,
    `Identity generation gate: ${JSON.stringify(master.imageGenerationGate)}`,
    `Identity hard prohibitions: ${JSON.stringify(master.hardProhibitions)}`,
  ].join('\n');
}

function embodiedPromptBlock(master: any, resolved: any) {
  return [
    'ALL CHARACTER EMBODIED ACTING PRODUCTION MASTER — FINAL POSE/PROP/ENVIRONMENT AUTHORITY.',
    `Authority: ${EMBODIED_DOC}.`,
    `Machine policy: ${EMBODIED_JSON}.`,
    `Embodied source: ${resolved.source}.`,
    `Embodied authority class: ${resolved.authorityClass}.`,
    `Embodied resolution: ${resolved.resolution}.`,
    'Do not use one front-facing hero stance, contrapposto, hand-on-hip, crossed-arms, or floating-prop default across the cast.',
    'A prop must have plausible grip/contact, body support, authored storage, a support surface, or an explicit reason it is not physically carried. Do not invent belts, harnesses, pockets, straps, collars, jewelry, or magical levitation to solve composition.',
    'Pose must not slim, de-age, adultify, remove disability equipment, humanoidize animals, resolve gender ambiguity, or turn artificiality into robot-costume shorthand.',
    'Interpersonal distance, touch, leaning, shared objects, protectiveness, or intimacy may not invent relationship canon.',
    'Future15 derived body acting is AUTHOR_CANDIDATE_DERIVED. It constrains generic drift but does not create exact gesture/handedness/grip/stance canon.',
    'CHARACTER-SPECIFIC EMBODIED PROFILE — REQUIRED.',
    JSON.stringify(resolved.profile, null, 2),
    `Required embodied channels: ${JSON.stringify(master.requiredChannels)}.`,
    `Prop relation gate: ${JSON.stringify(master.propRelationGate)}.`,
    `Embodied image-generation gate: ${JSON.stringify(master.imageGenerationGate)}.`,
    `Embodied hard prohibitions: ${JSON.stringify(master.hardProhibitions)}.`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const identityMaster = loadIdentityMaster();
const embodiedMaster = loadEmbodiedMaster();
const base = runBaseExporter(options.characterId, options.kind);
if (base.generationReadyProductionEntrypoint !== true) throw new Error(`${options.characterId}: base exporter is not generation-ready`);
const resolvedIdentity = resolveIdentityContract(options.characterId, base, identityMaster);
const resolvedEmbodied = resolveEmbodiedProfile(options.characterId, base, embodiedMaster);
const identityBlock = identityPromptBlock(identityMaster, resolvedIdentity.contract, resolvedIdentity.resolution, options.characterId);
const embodiedBlock = embodiedPromptBlock(embodiedMaster, resolvedEmbodied);
const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
const insertAt = Math.min(3, authorityOrder.length);
authorityOrder.splice(insertAt, 0,
  IDENTITY_DOC,
  IDENTITY_JSON,
  identityMaster.canonicalMachineSource,
  EMBODIED_DOC,
  EMBODIED_JSON,
  resolvedEmbodied.source,
);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 15),
  generatedBy: 'tools/asset-factory/scripts/export-final-character-design-prompt.ts',
  finalCharacterDesignProductionEntrypoint: true,
  allCharacterIdentityProductionMasterPath: IDENTITY_JSON,
  allCharacterIdentityProductionAuthorityDocument: IDENTITY_DOC,
  allCharacterIdentityProductionRequired: true,
  appearanceGenerationContractSource: identityMaster.canonicalMachineSource,
  appearanceGenerationContractProductionId: options.characterId,
  appearanceGenerationContractResolution: resolvedIdentity.resolution,
  appearanceGenerationContract: resolvedIdentity.contract,
  unknownIdentityGeometryMayBeInventedByImageModel: false,
  candidateAppearanceDetailCreatesCanon: false,
  allCharacterEmbodiedActingProductionMasterPath: EMBODIED_JSON,
  allCharacterEmbodiedActingProductionAuthorityDocument: EMBODIED_DOC,
  allCharacterEmbodiedActingProductionRequired: true,
  embodiedActingAuthorityClass: resolvedEmbodied.authorityClass,
  embodiedActingResolution: resolvedEmbodied.resolution,
  embodiedActingSource: resolvedEmbodied.source,
  embodiedActingProfile: resolvedEmbodied.profile,
  unknownEmbodiedDetailMayBeInventedByImageModel: false,
  generatedPoseCreatesCanon: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${identityBlock}\n\n${embodiedBlock}`,
  reviewChecklist: [
    'All Character Identity Production Masterとexact Appearance Generation Contractを読む',
    'All Character Embodied Acting Production Masterとcharacter-specific embodied profileを読む',
    'Current21はcurrent21SilhouetteMatrixのposture/object/motionをそのまま維持する',
    'Future15のbody actingはAUTHOR_CANDIDATE_DERIVEDとして扱い、exact gestureをCanon化しない',
    'propにgrip/body/storage/support relationがなければ省く',
    'hero pose / hand-on-hip / floating propで個性を代用しない',
    'relationship距離・touch・shared objectを構図都合で発明しない',
    'hair/color/prop/glow/accessoryをface/body identityの代用にしない',
    'nearestExistingFaceとの差をdifferenceFromNearestどおり維持する',
    'candidate surface/body-modification detailを必須identityへ昇格しない',
    'age / body shape / disability / species / gender ambiguityをbeauty normalizationしない',
    'neutral expression / no glow / no accessoryでも本人識別できる',
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
  ],
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`final character design prompt exported: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
