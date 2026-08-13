import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-face-skull-landmark-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.md';

type Options = { characterId: string; kind: string };

function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { kind = args[++i] ?? ''; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  return { characterId, kind };
}

const options = parseArgs(process.argv.slice(2));
const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
const authority = readFileSync(resolve(process.cwd(), AUTHORITY_PATH), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('dressing workflow authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('dressing workflow scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
  'allCharacterFaceSkullLandmarkConstructionFidelityRequired',
  'allCharacterBodyMassPostureConstructionFidelityRequired',
  'allCharacterGarmentBodyFitTensionCompressionFidelityRequired',
  'allCharacterGarmentPatternSeamClosureLoadFidelityRequired',
  'allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired',
]) if (base[required] !== true) throw new Error(`${options.characterId}: lower terminal chain missing: ${required}`);

const result: Record<string, any> = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 40),
  generatedBy: 'tools/asset-factory/scripts/export-dressing-workflow-locked-character-design-prompt.ts',
  allCharacterGarmentDonDoffDressingWorkflowFidelityRequired: true,
  dressingWorkflowAxes: policy.workflowAxes,
  dressingWorkflowPreservationPriority: policy.preservationPriority,
  dressingWorkflowPolicyPath: POLICY_PATH,
  dressingWorkflowAuthorityPath: AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: dressing workflow guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const dressingBlock = [
  'GARMENT DON / DOFF / DRESSING WORKFLOW FIDELITY — FINAL WEARABILITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Every garment must have a mechanically plausible dressing path consistent with the authorized body, mobility state, garment construction, material thickness, major openings, closures, layer order and footwear. Preserve head/shoulder/arm/hand/torso/hip/leg/foot passage, closure reach, grip/dexterity requirements, hair/headwear/accessory clearance and seated or assistive-equipment interaction.',
  'Unknown workflow uses SOURCE_CONSTRAINED_MINIMUM_PLAUSIBLE_DRESSING_WORKFLOW_COMPLETION. Do not resize the body to fit clothing; invent hidden zippers, elastic, stretch, detachable panels, magnetic or magical fastening; invent helper dependency or disability accommodation; remove prosthetic/orthotic/assistive equipment; redesign hair or remove body modifications; or move closures merely to make dressing easier.',
  'Premium art may not increase exposure or add hidden wearability mechanisms. LOD/chibi/sprite may simplify depiction but must preserve critical opening, closure, layer and footwear logic. Generated don/doff workflow remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');

result.prompt = `${base.prompt}\n\n${dressingBlock}`;
result.reviewChecklist = [
  'authorized bodyがhead/shoulder/hand/hip/footを縮小せず実際にopeningを通過できる',
  '必要なopening/closure/stretchは既存construction authorityに根拠がある',
  'hidden zipper/elastic/stretch/detachable/magnetic/magic mechanismを便利さのため捏造しない',
  'closure位置・左右・reachabilityがviewpointで変化しない',
  'layer don/doff orderがmechanically possibleである',
  'hair/headwear/glasses/piercing等を着脱の都合で削除・再設計しない',
  'footwearがauthorized footを縮小せず実際に着脱できる',
  'wheelchair/prosthetic/orthotic/assistive-deviceの着脱関係を勝手に発明しない',
  'premium化でhidden fastenerやexposure増加を追加しない',
  'LOD/chibi/spriteでもcritical opening/closure/layer logicを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
