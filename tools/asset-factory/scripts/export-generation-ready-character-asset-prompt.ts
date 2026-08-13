import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const WORLD_MATERIAL_DOC = 'docs/visual/world-material-translation-master-v1.md';
const WORLD_MATERIAL_JSON = 'data/visual/world-material-translation-master-v1.json';
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

const options = parseArgs(process.argv.slice(2));
const worldMaster = loadWorldMaterialMaster();
const base = runBaseExporter(options.characterId, options.kind);
const worldBlock = buildWorldPromptBlock(worldMaster, options.characterId);

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
const insertionIndex = Math.min(3, authorityOrder.length);
authorityOrder.splice(insertionIndex, 0, WORLD_MATERIAL_DOC, WORLD_MATERIAL_JSON);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 8),
  generatedBy: 'tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts',
  generationReadyProductionEntrypoint: true,
  worldMaterialTranslationMasterPath: WORLD_MATERIAL_JSON,
  worldMaterialTranslationAuthorityDocument: WORLD_MATERIAL_DOC,
  worldMaterialTranslationMaster: worldMaster,
  unknownWorldMaterialMayBeInventedByImageModel: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${worldBlock}`,
  reviewChecklist: [
    'World Material Translation Masterを本文まで読み、世界観を装飾記号ではなく構造・素材・使用痕へ翻訳する',
    '星 / 紙 / 墨 / 灯りを全員共通アクセサリーとして貼っていない',
    '素材・留め具・収納・摩耗・修繕が人物のEra / 生活 / 好みと矛盾しない',
    '発光には実際のsourceがあり、premium感のための常時発光をしていない',
    'world shorthandで露出・piercing・tattoo・jewelryを増やしていない',
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
