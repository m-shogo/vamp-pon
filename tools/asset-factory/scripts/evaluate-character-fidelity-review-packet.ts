import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MASTER_PATH = 'data/visual/cross-asset-fidelity-review-master-v1.json';

type Options = { input: string; output: string | null };
function parseArgs(args: string[]): Options {
  let input = '';
  let output: string | null = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--input') { input = args[++i] ?? ''; continue; }
    if (arg === '--output') { output = args[++i] ?? null; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!input) throw new Error('--input is required');
  return { input, output };
}

const options = parseArgs(process.argv.slice(2));
const master = JSON.parse(readFileSync(resolve(process.cwd(), MASTER_PATH), 'utf8'));
const packet = JSON.parse(readFileSync(resolve(process.cwd(), options.input), 'utf8'));
if (packet.masterPath !== MASTER_PATH) throw new Error(`Packet master mismatch: ${packet.masterPath}`);
if (packet.systemMaySetHumanVerdict !== false) throw new Error('Packet must keep human verdict outside system evaluation');
const kindPolicy = master.assetKinds?.[packet.assetKind];
if (!kindPolicy) throw new Error(`Unknown asset kind: ${packet.assetKind}`);
if (kindPolicy.appearanceFidelityNotApplicable === true) {
  const result = { ...packet, hardGateFailures: [], weightedScore: null, fidelityState: 'NOT_APPLICABLE', systemRecommendation: 'EMBLEM_CANON_REVIEW_REQUIRED', reviewerVerdict: null, reviewComplete: true, promotionBlocked: true };
  const out = `${JSON.stringify(result, null, 2)}\n`;
  if (options.output) writeFileSync(options.output, out); else process.stdout.write(out);
  process.exit(0);
}

const allAxes = [...master.identityCriticalAxes, ...master.supportAxes];
const missing: string[] = [];
for (const axis of allAxes) {
  const value = packet.axisScores?.[axis.id];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) missing.push(axis.id);
}
if (missing.length > 0) throw new Error(`Packet has missing/invalid axis scores: ${missing.join(', ')}`);

const hardMin = packet.assetKind === 'sprite_sheet_180' ? 85 : 90;
const hardGateFailures = master.identityCriticalAxes
  .filter((axis: any) => packet.axisScores[axis.id] < hardMin)
  .map((axis: any) => `${axis.id}:${packet.axisScores[axis.id]}<${hardMin}`);

const weightedScore = allAxes.reduce((sum: number, axis: any) => sum + (packet.axisScores[axis.id] * axis.weight / 100), 0);
let fidelityState = 'REWORK_MAJOR';
if (hardGateFailures.length > 0) fidelityState = master.hardGateFailureState;
else if (weightedScore >= 95) fidelityState = 'FIDELITY_PASS_STRONG';
else if (weightedScore >= 90) fidelityState = 'FIDELITY_PASS';
else if (weightedScore >= 85) fidelityState = 'REWORK_SUPPORTING_AXES';

const systemRecommendation = fidelityState === 'FIDELITY_PASS_STRONG' || fidelityState === 'FIDELITY_PASS'
  ? 'ELIGIBLE_FOR_HUMAN_KEEP_REVIEW'
  : fidelityState === master.hardGateFailureState || fidelityState === 'REWORK_MAJOR'
    ? 'REJECT_OR_MAJOR_REWORK_RECOMMENDED'
    : 'SUPPORTING_AXIS_REWORK_RECOMMENDED';

const result = {
  ...packet,
  hardGateFailures,
  weightedScore: Math.round(weightedScore * 100) / 100,
  fidelityState,
  systemRecommendation,
  reviewerVerdict: null,
  reviewComplete: true,
  promotionBlocked: fidelityState !== 'FIDELITY_PASS_STRONG' && fidelityState !== 'FIDELITY_PASS',
  generatedImageCreatesAuthority: false,
  generatedImageCreatesRecurrenceDirective: false,
  systemMaySetHumanVerdict: false,
};

const out = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) writeFileSync(options.output, out); else process.stdout.write(out);
