import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { characterReferenceGenerationHandoff } from '../../../src/game/data/characterReferenceGenerationHandoff.ts';

const POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v1.json';
const AUTHORITY_DOC = 'docs/visual/character-production-generation-entrypoint-v1.md';
const ENVIRONMENT_POLICY_PATH = 'data/visual/all-character-environment-weather-fidelity-master-v1.json';
const SPATIAL_POLICY_PATH = 'data/visual/all-character-spatial-world-scale-fidelity-master-v1.json';
const LAYOUT_POLICY_PATH = 'data/visual/all-character-world-use-interaction-layout-master-v1.json';

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

function loadCurrentProductionAuthority(path: string, label: string) {
  const value = JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
  if (value.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error(`${label} production authority invalid: ${path}`);
  if (value.scopeCount !== 36 || value.production?.requiredForCandidateGeneration !== true) throw new Error(`${label} production scope or requirement weakened`);
  return value;
}

const options = parseArgs(process.argv.slice(2));
const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
if (policy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT') throw new Error(`Production entrypoint policy invalid: ${POLICY_PATH}`);
if (policy.scopeCount !== 36) throw new Error(`Production entrypoint scope must remain 36: ${POLICY_PATH}`);
if (policy.lowerExportersAreProductionEntrypoints !== false || policy.handWrittenPromptIsProductionReady !== false) throw new Error('Production bypass guards weakened');
if (policy.generatedImageCreatesCanon !== false || policy.generatedArtStartsAs !== 'CANDIDATE_REVIEW_REQUIRED') throw new Error('Candidate boundary weakened');

const environmentPolicy = loadCurrentProductionAuthority(ENVIRONMENT_POLICY_PATH, 'Environment/weather');
const spatialPolicy = loadCurrentProductionAuthority(SPATIAL_POLICY_PATH, 'Spatial/world-scale');
const layoutPolicy = loadCurrentProductionAuthority(LAYOUT_POLICY_PATH, 'World-use/interaction-layout');

const handoff = characterReferenceGenerationHandoff.find((entry) => entry.characterId === options.characterId) ?? null;
const handoffAuthoritySet = new Set(handoff?.visualAuthorityPaths ?? []);

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), policy.wrappedExporter),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 36 * 1024 * 1024 });
const base = JSON.parse(stdout);

const effectiveBase = {
  ...base,
  allCharacterEnvironmentWeatherFidelityRequired: environmentPolicy.production.requiredForCandidateGeneration === true,
  unknownEnvironmentMayBeInventedByImageModel: environmentPolicy.rules?.unknownEnvironmentMayBeInventedByImageModel,
  environmentMayRedesignCharacter: environmentPolicy.rules?.environmentMayRedesignCharacter,
  weatherMayIncreaseExposure: environmentPolicy.rules?.weatherMayIncreaseExposure,
  weatherMayInventWardrobe: environmentPolicy.rules?.weatherMayInventWardrobe,
  generatedEnvironmentalReactionCreatesCanon: environmentPolicy.rules?.generatedEnvironmentalReactionCreatesCanon,
  allCharacterSpatialWorldScaleFidelityRequired: spatialPolicy.production.requiredForCandidateGeneration === true,
  unknownExactDimensionsMayBeInventedByImageModel: spatialPolicy.rules?.unknownExactDimensionsMayBeInventedByImageModel,
  worldScaleMayRedesignCharacter: spatialPolicy.rules?.worldScaleMayRedesignCharacter,
  architectureMayResizeBody: spatialPolicy.rules?.architectureMayResizeBody,
  mobilityEquipmentMayBeRemovedForComposition: spatialPolicy.rules?.mobilityEquipmentMayBeRemovedForComposition,
  generatedSpatialRelationshipCreatesCanon: spatialPolicy.rules?.generatedSpatialRelationshipCreatesCanon,
  allCharacterWorldUseInteractionLayoutRequired: layoutPolicy.production.requiredForCandidateGeneration === true,
  unknownUseHabitMayBeInventedByImageModel: layoutPolicy.rules?.unknownUseHabitMayBeInventedByImageModel,
  layoutMayInventCharacterRoutine: layoutPolicy.rules?.layoutMayInventCharacterRoutine,
  layoutMayInventRelationshipEvidence: layoutPolicy.rules?.layoutMayInventRelationshipEvidence,
  layoutMayBlockEstablishedMobilityRoute: layoutPolicy.rules?.layoutMayBlockEstablishedMobilityRoute,
  generatedLayoutCreatesCanon: layoutPolicy.rules?.generatedLayoutCreatesCanon,
};

const failures: string[] = [];
for (const [field, expected] of Object.entries(policy.requiredFlags ?? {})) {
  if (effectiveBase[field] !== expected) failures.push(`${field}: expected ${String(expected)}, got ${String(effectiveBase[field])}`);
}
if (Array.isArray(effectiveBase.imageGenerationReadinessFailures) && effectiveBase.imageGenerationReadinessFailures.length > 0) {
  failures.push(`imageGenerationReadinessFailures: ${effectiveBase.imageGenerationReadinessFailures.join(' | ')}`);
}

const baseAuthorityOrder: string[] = Array.isArray(effectiveBase.authorityOrder) ? [...effectiveBase.authorityOrder] : [];
const supplementedAuthorityPaths: string[] = [];
const supplementedAuthorityBlocks: string[] = [];

for (const path of policy.requiredAuthorityPaths ?? []) {
  if (baseAuthorityOrder.includes(path)) continue;
  let content = '';
  try {
    content = readFileSync(resolve(process.cwd(), path), 'utf8');
  } catch {
    failures.push(`required production authority unreadable: ${path}`);
    continue;
  }
  if (!content.trim()) {
    failures.push(`required production authority empty: ${path}`);
    continue;
  }
  supplementedAuthorityPaths.push(path);
  supplementedAuthorityBlocks.push([
    'PRODUCTION AUTHORITY SUPPLEMENT — REQUIRED CONTENT.',
    `Path: ${path}.`,
    `Declared by Character Reference Handoff for this character: ${handoffAuthoritySet.has(path) ? 'yes' : 'no; supplied by top-level 36-character production policy'}.`,
    content,
  ].join('\n'));
}

if (failures.length > 0) throw new Error(`${options.characterId}: production character prompt blocked:\n- ${failures.join('\n- ')}`);

const authorityOrder = [...baseAuthorityOrder, ...supplementedAuthorityPaths, AUTHORITY_DOC, POLICY_PATH];
const supplementBlock = supplementedAuthorityBlocks.length > 0
  ? `\n\n${supplementedAuthorityBlocks.join('\n\n')}`
  : '';
const promptBlock = [
  'CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.',
  `Authority: ${AUTHORITY_DOC}.`,
  `Machine policy: ${POLICY_PATH}.`,
  `Environment/weather machine authority: ${ENVIRONMENT_POLICY_PATH}.`,
  `Spatial/world-scale machine authority: ${SPATIAL_POLICY_PATH}.`,
  `World-use/interaction-layout machine authority: ${LAYOUT_POLICY_PATH}.`,
  `Character Reference Generation Handoff present: ${handoff ? 'yes' : 'no — top-level production policy remains authoritative for this roster member'}.`,
  `Production authority supplement count: ${supplementedAuthorityPaths.length}.`,
  'This output is the only production-ready character-image prompt export. Lower exporters and hand-written prompts are diagnostic/drafting inputs only.',
  'Every required production authority missing from the wrapped resolved chain has had its actual file content read and appended before this final lock. A legacy queue/handoff omission does not reduce the 36-character production authority set.',
  'Environment/weather rules may affect authorized materials physically but may not invent wardrobe, exposure, identity or canon.',
  'Spatial/world-scale rules may adapt composition and world layout but may not resize, slim, age-shift, humanize, remove mobility equipment or invent exact unsupported dimensions.',
  'World-use/interaction-layout rules may arrange already-authorized space for plausible use but may not invent routine, intimacy, private possessions, decorative clutter or blocked mobility routes.',
  'productionCharacterPromptReady means ready to request a CANDIDATE image only. It is not final-art approval, Character Master approval, legal/commercial clearance, runtime registration, or canon promotion.',
  'Do not remove or bypass earlier Master blocks. Do not reinterpret OPEN as model freedom. Generated images remain CANDIDATE_REVIEW_REQUIRED.',
].join('\n');

const result = {
  ...effectiveBase,
  schemaVersion: Math.max(Number(effectiveBase.schemaVersion ?? 0), 21),
  generatedBy: 'tools/asset-factory/scripts/export-production-character-design-prompt.ts',
  productionImageGenerationEntrypoint: true,
  productionCharacterPromptReady: true,
  productionPromptAuthorityLocked: true,
  productionGenerationEntrypointPolicyPath: POLICY_PATH,
  productionGenerationEntrypointAuthorityDocument: AUTHORITY_DOC,
  environmentWeatherFidelityPolicyPath: ENVIRONMENT_POLICY_PATH,
  spatialWorldScaleFidelityPolicyPath: SPATIAL_POLICY_PATH,
  worldUseInteractionLayoutPolicyPath: LAYOUT_POLICY_PATH,
  characterReferenceGenerationHandoffPresent: handoff !== null,
  handoffDeclaredAuthorityPaths: handoff?.visualAuthorityPaths ?? [],
  productionAuthoritySupplementPaths: supplementedAuthorityPaths,
  lowerExporterOutputIsProductionReady: false,
  handWrittenPromptIsProductionReady: false,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
  authorityOrder,
  prompt: `${effectiveBase.prompt}${supplementBlock}\n\n${promptBlock}`,
  reviewChecklist: [
    'productionImageGenerationEntrypoint=trueの出力だけを本番画像生成へ渡す',
    '下位exporter直出力・手打ちpromptをproduction-readyとして扱わない',
    'resolved chainに無いproduction必須Authorityは実ファイル本文を読んだsupplementで補完されていることを確認する',
    '環境・天候は素材へ物理的に作用しても、服・露出・体型・色Authority・canonを追加しない',
    '建築・家具・地面・背景の都合で人物の体格、年齢、species、mobility equipment、prop比率を変更しない',
    '空間の使い方は動線・収納・作業・待機の物理から作り、未確定の生活習慣・親密さ・私物を発明しない',
    'legacy handoff/queueに未列挙のcharacterでも36-character production policyを弱めない',
    'READYはcandidate generation許可でありfinal approvalではない',
    ...(Array.isArray(effectiveBase.reviewChecklist) ? effectiveBase.reviewChecklist : []),
  ],
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`production character design prompt exported: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
