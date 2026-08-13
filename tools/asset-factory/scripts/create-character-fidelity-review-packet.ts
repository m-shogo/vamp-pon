import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { CHARACTER_ASSET_PROMPT_KINDS, type CharacterAssetPromptKind } from '../../../src/game/data/assetFactoryCharacterPrompts.ts';

const MASTER_PATH = 'data/visual/cross-asset-fidelity-review-master-v1.json';

type Options = {
  characterId: string;
  kind: CharacterAssetPromptKind | '';
  candidate: string;
  reference: string[];
  output: string | null;
};

function parseArgs(args: string[]): Options {
  const result: Options = { characterId: '', kind: '', candidate: '', reference: [], output: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { result.characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { result.kind = (args[++i] ?? '') as CharacterAssetPromptKind; continue; }
    if (arg === '--candidate') { result.candidate = args[++i] ?? ''; continue; }
    if (arg === '--reference') { result.reference.push(args[++i] ?? ''); continue; }
    if (arg === '--output') { result.output = args[++i] ?? null; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!result.characterId) throw new Error('--character is required');
  if (!result.kind || !CHARACTER_ASSET_PROMPT_KINDS.includes(result.kind)) throw new Error(`--kind must be one of: ${CHARACTER_ASSET_PROMPT_KINDS.join(', ')}`);
  if (!result.candidate) throw new Error('--candidate is required');
  if (result.reference.length < 1) throw new Error('at least one --reference is required');
  return result;
}

const options = parseArgs(process.argv.slice(2));
const master = JSON.parse(readFileSync(resolve(process.cwd(), MASTER_PATH), 'utf8'));
if (master.status !== 'CURRENT_POST_GENERATION_VISUAL_REVIEW_AUTHORITY') throw new Error(`Fidelity master not current: ${MASTER_PATH}`);
const kindPolicy = master.assetKinds?.[options.kind];
if (!kindPolicy) throw new Error(`Fidelity master missing asset kind: ${options.kind}`);

const emblem = kindPolicy.appearanceFidelityNotApplicable === true;
const axisScores: Record<string, number | null> = {};
for (const axis of [...(master.identityCriticalAxes ?? []), ...(master.supportAxes ?? [])]) axisScores[axis.id] = null;

const packet = {
  schemaVersion: 1,
  generatedBy: 'tools/asset-factory/scripts/create-character-fidelity-review-packet.ts',
  masterPath: MASTER_PATH,
  characterId: options.characterId,
  assetKind: options.kind,
  candidateIdOrPath: options.candidate,
  authoritySources: options.reference,
  appearanceFidelityApplicable: !emblem,
  axisScores: emblem ? {} : axisScores,
  hardGateFailures: [] as string[],
  weightedScore: null as number | null,
  fidelityState: emblem ? 'NOT_APPLICABLE' : 'PENDING_REVIEW',
  systemRecommendation: emblem ? 'EMBLEM_CANON_REVIEW_REQUIRED' : null,
  reviewerVerdict: null as 'KEEP' | 'REWORK' | 'REJECT' | null,
  keepRemoveReplaceBanNotes: [] as string[],
  recurrenceDirectivePromotionState: 'NONE' as 'NONE' | 'PROPOSED' | 'ACTIVE',
  reviewComplete: emblem,
  promotionBlocked: true,
  generatedImageCreatesAuthority: false,
  generatedImageCreatesRecurrenceDirective: false,
  systemMaySetHumanVerdict: false,
  hardGatePolicy: emblem ? null : {
    identityCriticalAxes: master.identityCriticalAxes,
    assetKindMin: options.kind === 'sprite_sheet_180' ? 85 : 90,
    weightedScoreMayOverrideHardGate: false,
  },
};

const serialized = `${JSON.stringify(packet, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`fidelity review packet created: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
