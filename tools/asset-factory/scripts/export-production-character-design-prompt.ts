import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

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
for (const path of policy.requiredAuthorityPaths ?? []) {
  if (!Array.isArray(base.authorityOrder) || !base.authorityOrder.includes(path)) failures.push(`authority missing: ${path}`);
}
if (failures.length > 0) throw new Error(`${options.characterId}: production character prompt blocked:\n- ${failures.join('\n- ')}`);

const authorityOrder = [...base.authorityOrder, AUTHORITY_DOC, POLICY_PATH];
const promptBlock = [
  'CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.',
  `Authority: ${AUTHORITY_DOC}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'This output is the only production-ready character-image prompt export. Lower exporters and hand-written prompts are diagnostic/drafting inputs only.',
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
  lowerExporterOutputIsProductionReady: false,
  handWrittenPromptIsProductionReady: false,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
  authorityOrder,
  prompt: `${base.prompt}\n\n${promptBlock}`,
  reviewChecklist: [
    'productionImageGenerationEntrypoint=trueの出力だけを本番画像生成へ渡す',
    '下位exporter直出力・手打ちpromptをproduction-readyとして扱わない',
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
