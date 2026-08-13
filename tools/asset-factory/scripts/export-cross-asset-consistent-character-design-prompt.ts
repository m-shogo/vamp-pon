import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-color-aware-character-design-prompt.ts';
const MASTER_DOC = 'docs/visual/all-character-cross-asset-consistency-master-v1.md';
const MASTER_JSON = 'data/visual/all-character-cross-asset-consistency-master-v1.json';

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

function loadMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), MASTER_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`Cross-Asset Master is not current: ${MASTER_JSON}`);
  if (master.scopeCount !== 36) throw new Error('Cross-Asset scope must remain 36');
  if (!Array.isArray(master.assetKinds) || master.assetKinds.length !== 9) throw new Error('Cross-Asset assetKinds incomplete');
  if (!Array.isArray(master.identityPreservationOrder) || master.identityPreservationOrder.length < 12) throw new Error('Cross-Asset preservation hierarchy incomplete');
  if (master.unknownSimplificationMayRedesignCharacter !== false) throw new Error('Simplification redesign guard weakened');
  if (master.smallScaleMayInventReadabilityAccessory !== false) throw new Error('Small-scale readability invention guard weakened');
  if (master.effectsMayRedesignCharacter !== false) throw new Error('Effect redesign guard weakened');
  if (master.emblemMayCreateAppearanceCanon !== false) throw new Error('Emblem appearance canon guard weakened');
  if (master.generatedCrossAssetDetailCreatesCanon !== false) throw new Error('Generated cross-asset canon guard weakened');
  return master;
}

function runBase(characterId: string, kind: string) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
    '--character', characterId,
    '--kind', kind,
  ], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 38 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function promptBlock(master: any, kind: string, rule: any) {
  return [
    'ALL CHARACTER CROSS-ASSET CONSISTENCY MASTER — REQUIRED TRANSFORMATION/SIMPLIFICATION AUTHORITY.',
    `Authority: ${MASTER_DOC}.`,
    `Machine policy: ${MASTER_JSON}.`,
    `Asset kind: ${kind}.`,
    `Asset-kind rule: ${JSON.stringify(rule, null, 2)}.`,
    `Identity preservation order: ${JSON.stringify(master.identityPreservationOrder)}.`,
    'When detail must be reduced, delete lower-priority detail before changing species/age/body identity, face geometry, body mass, head/hair mass, silhouette, clothing construction, exposure/body-modification boundaries, source-backed color or prop relation.',
    'Small-scale readability does not authorize a common chibi head/body template, giant eyes, new ribbons/hats/gems/weapons, floating prop icons, mobility-equipment removal, animal humanoidization or saturated accent invention.',
    'Cut-in/state effects may change crop, motion and effect intensity but may not redesign face, body, age, disability/species, clothing construction, exposure or palette identity.',
    'Emblem assets follow emblem canon and cannot create or overwrite character appearance canon.',
    `Cross-asset review gate: ${JSON.stringify(master.crossAssetReviewGate)}.`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const master = loadMaster();
if (!master.assetKinds.includes(options.kind)) throw new Error(`Unsupported production character asset kind for cross-asset gate: ${options.kind}`);
const rule = master.assetKindRules?.[options.kind];
if (!rule) throw new Error(`Cross-Asset rule missing for kind: ${options.kind}`);
const base = runBase(options.characterId, options.kind);
if (base.allCharacterColorProductionRequired !== true) throw new Error(`${options.characterId}/${options.kind}: color-aware base missing`);
if (base.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') throw new Error(`${options.characterId}/${options.kind}: base prompt not READY`);

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [MASTER_DOC, MASTER_JSON]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
const block = promptBlock(master, options.kind, rule);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 19),
  generatedBy: 'tools/asset-factory/scripts/export-cross-asset-consistent-character-design-prompt.ts',
  allCharacterCrossAssetConsistencyRequired: true,
  allCharacterCrossAssetConsistencyMasterPath: MASTER_JSON,
  allCharacterCrossAssetConsistencyAuthorityDocument: MASTER_DOC,
  crossAssetKind: options.kind,
  crossAssetKindRule: rule,
  crossAssetIdentityPreservationOrder: master.identityPreservationOrder,
  unknownSimplificationMayRedesignCharacter: false,
  smallScaleMayInventReadabilityAccessory: false,
  effectsMayRedesignCharacter: false,
  emblemMayCreateAppearanceCanon: false,
  generatedCrossAssetDetailCreatesCanon: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${block}`,
  reviewChecklist: [
    `asset kind ${options.kind} のsimplification/effect ruleを守る`,
    '小型化でface/body/species/disabilityを共通templateへ正規化しない',
    '小型可読性のための新規アクセサリー・武器・glowを発明しない',
    'Dawn/Kokuyou/cutin effectをcharacter redesignへ変換しない',
    'emblem variantからcharacter appearance canonを逆輸入しない',
    'cross-asset比較でface/body/silhouette/color/prop hierarchyが同一人物として残る',
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
  ],
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`cross-asset consistent character design prompt exported: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
