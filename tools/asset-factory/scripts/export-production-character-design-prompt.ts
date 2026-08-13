import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { characterReferenceGenerationHandoff } from '../../../src/game/data/characterReferenceGenerationHandoff.ts';

const POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v1.json';
const AUTHORITY_DOC = 'docs/visual/character-production-generation-entrypoint-v1.md';

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

const options = parseArgs(process.argv.slice(2));
const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
if (policy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT') throw new Error(`Production entrypoint policy invalid: ${POLICY_PATH}`);
if (policy.scopeCount !== 36) throw new Error(`Production entrypoint scope must remain 36: ${POLICY_PATH}`);
if (policy.lowerExportersAreProductionEntrypoints !== false || policy.handWrittenPromptIsProductionReady !== false) throw new Error('Production bypass guards weakened');
if (policy.generatedImageCreatesCanon !== false || policy.generatedArtStartsAs !== 'CANDIDATE_REVIEW_REQUIRED') throw new Error('Candidate boundary weakened');

const handoff = characterReferenceGenerationHandoff.find((entry) => entry.characterId === options.characterId);
if (!handoff) throw new Error(`${options.characterId}: Character Reference Generation Handoff missing`);

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), policy.wrappedExporter),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 36 * 1024 * 1024 });
const base = JSON.parse(stdout);

const failures: string[] = [];
for (const [field, expected] of Object.entries(policy.requiredFlags ?? {})) {
  if (base[field] !== expected) failures.push(`${field}: expected ${String(expected)}, got ${String(base[field])}`);
}
if (Array.isArray(base.imageGenerationReadinessFailures) && base.imageGenerationReadinessFailures.length > 0) {
  failures.push(`imageGenerationReadinessFailures: ${base.imageGenerationReadinessFailures.join(' | ')}`);
}

const baseAuthorityOrder: string[] = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
const handoffAuthoritySet = new Set(handoff.visualAuthorityPaths ?? []);
const supplementedAuthorityPaths: string[] = [];
const supplementedAuthorityBlocks: string[] = [];

for (const path of policy.requiredAuthorityPaths ?? []) {
  if (baseAuthorityOrder.includes(path)) continue;
  if (!handoffAuthoritySet.has(path)) {
    failures.push(`required authority absent from resolved chain and handoff: ${path}`);
    continue;
  }
  let content = '';
  try {
    content = readFileSync(resolve(process.cwd(), path), 'utf8');
  } catch {
    failures.push(`required handoff authority unreadable: ${path}`);
    continue;
  }
  if (!content.trim()) {
    failures.push(`required handoff authority empty: ${path}`);
    continue;
  }
  supplementedAuthorityPaths.push(path);
  supplementedAuthorityBlocks.push([
    'PRODUCTION HANDOFF AUTHORITY SUPPLEMENT — REQUIRED CONTENT.',
    `Path: ${path}.`,
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
  `Handoff authority supplement count: ${supplementedAuthorityPaths.length}.`,
  'This output is the only production-ready character-image prompt export. Lower exporters and hand-written prompts are diagnostic/drafting inputs only.',
  'If a required authority was not already embedded by the resolved exporter chain but was declared mandatory by Character Reference Generation Handoff, its actual file content has been read and appended above this final lock.',
  'productionCharacterPromptReady means ready to request a CANDIDATE image only. It is not final-art approval, Character Master approval, legal/commercial clearance, runtime registration, or canon promotion.',
  'Do not remove or bypass earlier Master blocks. Do not reinterpret OPEN as model freedom. Generated images remain CANDIDATE_REVIEW_REQUIRED.',
].join('\n');

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 18),
  generatedBy: 'tools/asset-factory/scripts/export-production-character-design-prompt.ts',
  productionImageGenerationEntrypoint: true,
  productionCharacterPromptReady: true,
  productionPromptAuthorityLocked: true,
  productionGenerationEntrypointPolicyPath: POLICY_PATH,
  productionGenerationEntrypointAuthorityDocument: AUTHORITY_DOC,
  characterReferenceGenerationHandoffResolved: true,
  handoffAuthoritySupplementPaths: supplementedAuthorityPaths,
  lowerExporterOutputIsProductionReady: false,
  handWrittenPromptIsProductionReady: false,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
  authorityOrder,
  prompt: `${base.prompt}${supplementBlock}\n\n${promptBlock}`,
  reviewChecklist: [
    'productionImageGenerationEntrypoint=trueの出力だけを本番画像生成へ渡す',
    '下位exporter直出力・手打ちpromptをproduction-readyとして扱わない',
    'Handoff必須Authorityがresolved chainに無い場合は本文を読み込んだsupplementを確認する',
    'READYはcandidate generation許可でありfinal approvalではない',
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
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
