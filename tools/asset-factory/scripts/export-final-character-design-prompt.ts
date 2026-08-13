import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { characterAppearanceGenerationContracts } from '../../../src/game/data/characterAppearanceGenerationContracts.ts';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts';
const IDENTITY_DOC = 'docs/visual/all-character-identity-production-master-v1.md';
const IDENTITY_JSON = 'data/visual/all-character-identity-production-master-v1.json';

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

function runBaseExporter(characterId: string, kind: string) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
    '--character', characterId,
    '--kind', kind,
  ], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function resolveIdentityContract(characterId: string, master: any) {
  const contract = characterAppearanceGenerationContracts.find((entry) => entry.id === characterId);
  if (!contract) throw new Error(`Appearance Generation Contract missing for ${characterId}; final production export blocked.`);
  for (const field of master.requiredFields) {
    if (!(field in contract)) throw new Error(`${characterId}: required appearance field missing: ${field}`);
  }
  if (!Array.isArray(contract.forbiddenDrift) || contract.forbiddenDrift.length < 1) throw new Error(`${characterId}: forbiddenDrift missing`);
  if (contract.nearestExistingFace && !contract.differenceFromNearest) throw new Error(`${characterId}: nearestExistingFace requires differenceFromNearest`);
  return contract;
}

function identityPromptBlock(master: any, contract: any) {
  return [
    'ALL CHARACTER IDENTITY PRODUCTION MASTER — FINAL FACE/BODY AUTHORITY.',
    `Authority: ${IDENTITY_DOC}.`,
    `Machine policy: ${IDENTITY_JSON}.`,
    `Canonical machine source: ${master.canonicalMachineSource}.`,
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

const options = parseArgs(process.argv.slice(2));
const identityMaster = loadIdentityMaster();
const base = runBaseExporter(options.characterId, options.kind);
if (base.generationReadyProductionEntrypoint !== true) throw new Error(`${options.characterId}: base exporter is not generation-ready`);
const contract = resolveIdentityContract(options.characterId, identityMaster);
const identityBlock = identityPromptBlock(identityMaster, contract);
const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
const insertAt = Math.min(3, authorityOrder.length);
authorityOrder.splice(insertAt, 0, IDENTITY_DOC, IDENTITY_JSON, identityMaster.canonicalMachineSource);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 13),
  generatedBy: 'tools/asset-factory/scripts/export-final-character-design-prompt.ts',
  finalCharacterDesignProductionEntrypoint: true,
  allCharacterIdentityProductionMasterPath: IDENTITY_JSON,
  allCharacterIdentityProductionAuthorityDocument: IDENTITY_DOC,
  allCharacterIdentityProductionRequired: true,
  appearanceGenerationContractSource: identityMaster.canonicalMachineSource,
  appearanceGenerationContract: contract,
  unknownIdentityGeometryMayBeInventedByImageModel: false,
  candidateAppearanceDetailCreatesCanon: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${identityBlock}`,
  reviewChecklist: [
    'All Character Identity Production Masterとexact Appearance Generation Contractを読む',
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
