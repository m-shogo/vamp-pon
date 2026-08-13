import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const CORE5_IDS = new Set(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
const WORLD_MATERIAL_DOC = 'docs/visual/world-material-translation-master-v1.md';
const WORLD_MATERIAL_JSON = 'data/visual/world-material-translation-master-v1.json';
const CORE5_GARMENT_DOC = 'docs/visual/core5-garment-construction-master-v1.md';
const CORE5_GARMENT_JSON = 'data/visual/core5-garment-construction-master-v1.json';
const BASE_EXPORTER = 'tools/asset-factory/scripts/export-character-asset-prompt.ts';

type Options = {
  characterId: string;
  kind: string;
  output: string | null;
};

function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  let output: string | null = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') {
      characterId = args[++i] ?? '';
      continue;
    }
    if (arg === '--kind') {
      kind = args[++i] ?? '';
      continue;
    }
    if (arg === '--output') {
      output = args[++i] ?? null;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  if (!kind) throw new Error('--kind is required');
  return { characterId, kind, output };
}

function loadWorldMaterialMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), WORLD_MATERIAL_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') {
    throw new Error(`World Material Translation Master is not current: ${WORLD_MATERIAL_JSON}`);
  }
  if (master.doesNotCreateNewStoryCanon !== true) {
    throw new Error(`World Material Translation Master must not create new story canon: ${WORLD_MATERIAL_JSON}`);
  }
  if (master.worldbuildingAppearsAsConsequenceNotSticker !== true) {
    throw new Error(`World Material Translation consequence rule weakened: ${WORLD_MATERIAL_JSON}`);
  }
  if (master.unknownWorldMaterialMayBeInventedByImageModel !== false) {
    throw new Error(`Image-model world/material invention must remain disabled: ${WORLD_MATERIAL_JSON}`);
  }
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) {
    throw new Error(`World Material image-generation gate incomplete: ${WORLD_MATERIAL_JSON}`);
  }
  return master;
}

function loadCore5GarmentProfile(characterId: string) {
  if (!CORE5_IDS.has(characterId)) return null;
  const master = JSON.parse(readFileSync(resolve(process.cwd(), CORE5_GARMENT_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') {
    throw new Error(`Core5 Garment Construction Master is not current: ${CORE5_GARMENT_JSON}`);
  }
  if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteAuthorCandidates !== true) {
    throw new Error(`Core5 Garment source/candidate governance weakened: ${CORE5_GARMENT_JSON}`);
  }
  if (master.unknownGarmentDetailMayBeInventedByImageModel !== false || master.sharedRules?.unknownGarmentDetailMayBeInventedByImageModel !== false) {
    throw new Error(`Image-model garment invention must remain disabled: ${CORE5_GARMENT_JSON}`);
  }
  if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) {
    throw new Error(`Core5 Garment image-generation gate incomplete: ${CORE5_GARMENT_JSON}`);
  }
  const profile = (master.characters ?? []).find((entry: any) => entry.id === characterId);
  if (!profile) throw new Error(`Core5 Garment profile missing for ${characterId}; production export blocked.`);
  return { master, profile };
}

function runBaseExporter(characterId: string, kind: string) {
  const stdout = execFileSync(
    process.execPath,
    [
      '--experimental-strip-types',
      resolve(process.cwd(), BASE_EXPORTER),
      '--character', characterId,
      '--kind', kind,
      '--format', 'json',
    ],
    { cwd: process.cwd(), encoding: 'utf8' },
  );
  return JSON.parse(stdout);
}

function buildWorldPromptBlock(master: any, characterId: string): string {
  const core5 = Array.isArray(master.core5)
    ? master.core5.find((entry: any) => entry.id === characterId) ?? null
    : null;
  return [
    'WORLD MATERIAL TRANSLATION MASTER — REQUIRED PRODUCTION VISUAL AUTHORITY.',
    `Authority: ${WORLD_MATERIAL_DOC}.`,
    `Machine rules: ${WORLD_MATERIAL_JSON}.`,
    'Worldbuilding must appear as consequence, not stickers. Translate night / route / record / ink / practical light / star-chart / missing-record / repair grammar through construction, storage, wear, handling and material response.',
    'Do not communicate Yoru no Shirube by automatically adding stars, paper scraps, ink splashes, glowing trim, gold edges, constellation jewelry, decorative compasses, lantern pendants, torn hems, patchwork, belts or pouches.',
    'Personal taste and Living Visual boundaries override decorative world shorthand. World context never authorizes extra exposure, piercing, tattoo, jewelry or ornament.',
    'Every major garment/prop must have material weight, stiffness, fold behavior, reflection, wear location, repairability, closure logic, storage relation and ordinary-use behavior resolved before production generation.',
    'Emitted light must have a real source. Repair must have a cause. Storage must contain something. Asymmetry must come from use/construction/history rather than premium-gacha filler.',
    `World grammar: ${JSON.stringify(master.worldGrammar, null, 2)}`,
    ...(core5
      ? [
          'CHARACTER-SPECIFIC WORLD MATERIAL TRANSLATION — REQUIRED.',
          JSON.stringify(core5, null, 2),
        ]
      : []),
    `Anti-generic world drift: ${JSON.stringify(master.antiGenericWorldDrift)}`,
    `World/material generation gate: ${JSON.stringify(master.imageGenerationGate)}`,
  ].join('\n');
}

function buildGarmentPromptBlock(garment: { master: any; profile: any } | null): string {
  if (!garment) return '';
  return [
    'CORE5 GARMENT CONSTRUCTION MASTER — REQUIRED PRODUCTION CLOTHING AUTHORITY.',
    `Authority: ${CORE5_GARMENT_DOC}.`,
    `Machine rules: ${CORE5_GARMENT_JSON}.`,
    'Treat clothing as wearable lived equipment, not as a fantasy costume surface. Resolve material physics, layer construction, closures, actual storage contents, footwear, wear locations, repair causes, prop interference and ordinary movement before decorative detail.',
    'Worldbuilding must appear through garment consequence: seams, folds, fastening, pocket placement, edge treatment, repair history, object access, friction and local light response. Do not paste project motifs onto clothes.',
    'No belt, strap, buckle, pouch, patch, chain, cutout, flap, metal plate, exposed area or ornament may appear without a loaded function/history. High resolution cannot add new garment concepts.',
    'OPEN or unspecified garment detail is not image-model freedom. If a required construction field is unresolved, production generation is blocked or explicitly exploratory-only.',
    `Shared garment rules: ${JSON.stringify(garment.master.sharedRules, null, 2)}`,
    'CHARACTER-SPECIFIC GARMENT CONSTRUCTION — REQUIRED.',
    JSON.stringify(garment.profile, null, 2),
    `Garment generation gate: ${JSON.stringify(garment.master.imageGenerationGate)}`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const worldMaster = loadWorldMaterialMaster();
const garment = loadCore5GarmentProfile(options.characterId);
const base = runBaseExporter(options.characterId, options.kind);
const worldBlock = buildWorldPromptBlock(worldMaster, options.characterId);
const garmentBlock = buildGarmentPromptBlock(garment);

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
const insertionIndex = Math.min(3, authorityOrder.length);
authorityOrder.splice(insertionIndex, 0, WORLD_MATERIAL_DOC, WORLD_MATERIAL_JSON);
if (garment) {
  authorityOrder.splice(insertionIndex + 2, 0, CORE5_GARMENT_DOC, CORE5_GARMENT_JSON);
}

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 9),
  generatedBy: 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts',
  generationReadyProductionEntrypoint: true,
  worldMaterialTranslationMasterPath: WORLD_MATERIAL_JSON,
  worldMaterialTranslationAuthorityDocument: WORLD_MATERIAL_DOC,
  worldMaterialTranslationMaster: worldMaster,
  core5GarmentConstructionMasterPath: garment ? CORE5_GARMENT_JSON : null,
  core5GarmentConstructionAuthorityDocument: garment ? CORE5_GARMENT_DOC : null,
  core5GarmentConstructionProfile: garment?.profile ?? null,
  core5GarmentConstructionRequired: CORE5_IDS.has(options.characterId),
  unknownWorldMaterialMayBeInventedByImageModel: false,
  unknownGarmentDetailMayBeInventedByImageModel: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${worldBlock}${garmentBlock ? `\n\n${garmentBlock}` : ''}`,
  reviewChecklist: [
    'World Material Translation Masterを本文まで読み、世界観を装飾記号ではなく構造・素材・使用痕へ翻訳する',
    '星 / 紙 / 墨 / 灯りを全員共通アクセサリーとして貼っていない',
    '素材・留め具・収納・摩耗・修繕が人物のEra / 生活 / 好みと矛盾しない',
    '発光には実際のsourceがあり、premium感のための常時発光をしていない',
    'world shorthandで露出・piercing・tattoo・jewelryを増やしていない',
    ...(garment ? [
      'Core5 Garment Construction Masterのmaterial / construction / closure / storage / footwear / wear / repair / prop interferenceを本文まで読む',
      'すべてのpocket / pouch / strap / buckle / patch / hardwareに実際の用途または履歴がある',
      '歩行・着座・しゃがみ・腕上げ・prop取得で衣装構造が破綻しない',
      '摩耗は接触・摩擦・天候、補修は実際のdamage/stressから発生している',
      '色と小物を消しても服構造だけでCore5の差が残る',
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
