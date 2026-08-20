import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../../src/game/data/characterReferenceProductionEntrypoint.ts';

const BRIDGE_PATH = 'data/character-assets/manifests/visual-character-sheet-autonomous-production-bridge.v2.json';
const DECISION_LOG_PATH = 'data/visual/all-character-life-choice-codex-author-decisions-v1.json';
const PARTIAL_CLOSURE_PATH = 'data/visual/all-character-life-choice-partial-evidence-autonomous-closure-v1.json';
const PRE_GENERATION_PATH = 'data/character-assets/manifests/visual-character-master-pre-generation-readiness.v1.json';
const PARENT_ENTRYPOINT_SOURCE = 'src/game/data/characterReferenceProductionEntrypoint.ts';
const PARENT_EXPORTER = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter;
const PARENT_POLICY_PATH = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;

type SheetNumber = '01' | '02' | '03' | '04';
type SheetSelection = SheetNumber | 'all';
type Options = { characterId: string; sheet: SheetSelection; output: string | null };

type SheetConfig = {
  role: string;
  purpose: string;
  composition: string[];
  hardConstraints: string[];
};

const SHEETS: Record<SheetNumber, SheetConfig> = {
  '01': {
    role: 'identity-turnaround',
    purpose: 'Lock one identity across front, anatomical-left, anatomical-right and back inspection views.',
    composition: ['four full-body views at comparable scale', 'head and feet visible', 'neutral inspection pose', 'shared ground/proportion logic'],
    hardConstraints: [
      'Never mirror an asymmetric side to manufacture the opposite view.',
      'Preserve face/skull landmarks, age/species coding, body mass, hair topology, garment construction, equipment and mobility geometry across all views.',
      'Unknown hidden construction stays omitted or source-constrained; high resolution is not permission to invent it.',
      'No beauty-angle correction, body slimming, giant foreground anatomy or generic premium/gacha redesign.',
    ],
  },
  '02': {
    role: 'face-expression-acting',
    purpose: 'Document face construction and bounded acting deformation without changing identity geometry.',
    composition: ['neutral face anchor', 'front/three-quarter construction where authorized', 'secondary bounded expression studies'],
    hardConstraints: [
      'Expression may deform soft tissue but may not rebuild skull, eye spacing, nose, cheek, mouth, jaw, chin, ears or age-bearing cues.',
      'Do not enlarge eyes, sharpen jaws, de-age, auto-blush or converge toward a generic anime beauty face.',
      'Diagnostic acting never creates romance, trauma, signature emotion, recurrence or relationship Canon.',
    ],
  },
  '03': {
    role: 'costume-equipment-material',
    purpose: 'Explain authorized garment, equipment, storage, object contact and material construction.',
    composition: ['front/back construction', 'authorized closures/seams/storage', 'equipment scale/contact', 'authorized material and maintenance behavior'],
    hardConstraints: [
      'Do not add belts, harnesses, pouches, jewelry, piercings, tattoos, straps, armor, cutouts or decorative layers without authority.',
      'Every carried/stored prop needs a physically plausible contact and retrieve/use/return path.',
      'Named Object geometry remains separate authority and may not be redesigned here.',
      'Wear, repair, weather and surface rendering must preserve material class and may not increase exposure.',
    ],
  },
  '04': {
    role: 'silhouette-motion-derivation',
    purpose: 'Stress-test silhouette, posture, motion, perspective and small-scale derivation without redesigning the body.',
    composition: ['neutral silhouette anchor', 'bounded motion envelope', 'authorized contact motion', 'perspective and LOD stress examples'],
    hardConstraints: [
      'Motion/LOD may not change head-body ratio, body volume, age/species, mobility equipment, garment anchors, prop scale or hair topology.',
      'Do not invent handedness, signature gait, combat flourish, intimacy, protectiveness or habitual gesture.',
      'World geometry adapts around the character rather than resizing the character to fit a scene.',
    ],
  },
};

function parseArgs(args: string[]): Options {
  let characterId = '';
  let sheet: SheetSelection = '01';
  let output: string | null = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--sheet') { sheet = (args[++i] ?? '') as SheetSelection; continue; }
    if (arg === '--output') { output = args[++i] ?? null; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  if (!['01', '02', '03', '04', 'all'].includes(sheet)) throw new Error(`invalid --sheet: ${sheet}`);
  return { characterId, sheet, output };
}

function readText(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}
function readJson(path: string): any {
  return JSON.parse(readText(path));
}
function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}
function serialize(value: unknown, output: string | null) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (output) {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, text);
  } else {
    process.stdout.write(text);
  }
}

const options = parseArgs(process.argv.slice(2));
const bridgeText = readText(BRIDGE_PATH);
const decisionText = readText(DECISION_LOG_PATH);
const partialText = readText(PARTIAL_CLOSURE_PATH);
const bridge = JSON.parse(bridgeText);
const decisions = JSON.parse(decisionText);
const partial = JSON.parse(partialText);
const readiness = readJson(PRE_GENERATION_PATH);

if (bridge.status !== 'CURRENT_AUTONOMOUS_PRE_GENERATION_READY') throw new Error('Current autonomous Sheet bridge is not ready');
if (bridge.productionBoundary?.humanReviewRequired !== false) throw new Error('Intermediate Human gate returned');
if (bridge.productionBoundary?.imageGenerationAuthorizedByThisBridge !== false) throw new Error('Prompt bridge must not auto-authorize image execution');
if (decisions.status !== 'AUTHORING_COMPLETE' || decisions.materializedDecisionCount !== 42 || decisions.remainingDecisionCount !== 0) throw new Error('42 Current author decisions are incomplete');
if (partial.status !== 'CURRENT_AUTONOMOUS_PRODUCTION_CLOSURE_COMPLETE' || partial.scope?.reviewedForAutonomousAuthoring !== 56 || partial.scope?.remaining !== 0) throw new Error('56 partial-evidence closures are incomplete');
if (readiness.imageGeneration?.executed !== false) throw new Error('pre-generation readiness unexpectedly reports generated images');

const parentStdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), PARENT_EXPORTER),
  '--character', options.characterId,
  '--kind', 'character_reference',
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 48 * 1024 * 1024 });
const parent = JSON.parse(parentStdout);
if (parent.productionImageGenerationEntrypoint !== true || parent.productionCharacterPromptReady !== true || parent.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: parent production exporter is not ready`);
if (parent.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION' || parent.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') throw new Error(`${options.characterId}: parent readiness boundary invalid`);
if (parent.generatedImageCreatesCanon !== false || parent.handWrittenPromptIsProductionReady !== false || parent.lowerExporterOutputIsProductionReady !== false) throw new Error(`${options.characterId}: parent no-bypass boundary weakened`);

const coveredDecisionIds = (decisions.coveredDecisionIds as string[]).filter((id) => id.includes(`.${options.characterId}.`));
const explicit = decisions.decisionStrategy?.explicitResolutions ?? {};
const decisionLines = coveredDecisionIds.map((id) => `- ${id}: ${explicit[id] ?? 'ACCEPT_SOURCE_CANDIDATE_AS_CURRENT_PRODUCTION_AUTHORITY'}`);
const authoritySnapshot = {
  materialized: true,
  characterId: options.characterId,
  decisionLog: DECISION_LOG_PATH,
  decisionLogSha256: sha256(decisionText),
  characterDecisionIds: coveredDecisionIds,
  partialEvidenceClosure: PARTIAL_CLOSURE_PATH,
  partialEvidenceClosureSha256: sha256(partialText),
  bridge: BRIDGE_PATH,
  bridgeSha256: sha256(bridgeText),
  imageOutputMayAuthorFacts: false,
};

function buildSheet(sheetNumber: SheetNumber) {
  const config = SHEETS[sheetNumber];
  const currentAuthorityBlock = [
    'CURRENT AUTONOMOUS AUTHOR AUTHORITY — MUST BE CONSUMED BEFORE IMAGE GENERATION.',
    `Character: ${options.characterId}`,
    ...(decisionLines.length > 0 ? decisionLines : ['- No life-choice override is needed for this character; use the parent Current authority unchanged.']),
    'PARTIAL-EVIDENCE CLOSURE:',
    '- Preserve direct source evidence already present in the parent authority chain.',
    '- Unsupported grooming meaning, removable-object identity, ownership, gift meaning, relationship meaning, transition or temporary placement is NOT REQUIRED FOR MASTER V1 and MUST NOT be rendered/invented.',
    '- Generated image output is never evidence or authority for closing an unsupported setting.',
    'CHARACTER DESIGN SHEET ROLE:',
    `- Sheet ${sheetNumber}: ${config.role}`,
    `- Purpose: ${config.purpose}`,
    'COMPOSITION:',
    ...config.composition.map((value) => `- ${value}`),
    'HARD CONSTRAINTS:',
    ...config.hardConstraints.map((value) => `- ${value}`),
    'PROMOTION BOUNDARY:',
    '- Output starts as CANDIDATE_REVIEW_REQUIRED.',
    '- Automatic structural and semantic QA is required; rejected output cannot parent any derivative.',
    '- No intermediate Human approval is required. Final Human review is deferred to PROJECT_100_PERCENT_READY.',
  ].join('\n');

  return {
    ...parent,
    schemaVersion: Math.max(Number(parent.schemaVersion ?? 0), 27),
    generatedBy: 'tools/asset-factory/scripts/export-autonomous-character-design-sheet-prompt.ts',
    parentProductionEntrypointSource: PARENT_ENTRYPOINT_SOURCE,
    parentProductionExporter: PARENT_EXPORTER,
    parentProductionPolicy: PARENT_POLICY_PATH,
    sheetBridgePolicy: BRIDGE_PATH,
    characterId: options.characterId,
    sheetNumber,
    sheetRole: config.role,
    currentAutonomousCharacterSheetEntrypoint: true,
    productionReadyForPromptExport: true,
    imageGenerationExecuted: false,
    imageGenerationAuthorizedByPromptExport: false,
    humanReviewRequired: false,
    automaticQaRequired: true,
    structuralHardVetoRequired: true,
    semanticQaRequired: true,
    finalHumanReviewDeferredToProject100Percent: true,
    generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
    generatedSheetMayCreateCanon: false,
    generatedSheetMayCreateCharacterMasterApproval: false,
    generatedSheetMayCreateRuntimeApproval: false,
    authoritySnapshot,
    prompt: `${String(parent.prompt ?? '')}\n\n${currentAuthorityBlock}`,
    reviewChecklist: [
      'Current JIT authority snapshot hashes are present and match source files.',
      '42-decision Current authority and 56-item partial-evidence closure are consumed before generation.',
      'No intermediate Human gate exists; automatic structural/semantic QA owns candidate promotion.',
      'Image output never fills unsupported settings or Story meaning.',
      ...(Array.isArray(parent.reviewChecklist) ? parent.reviewChecklist : []),
    ],
  };
}

if (options.sheet === 'all') {
  const numbers = Object.keys(SHEETS) as SheetNumber[];
  serialize({
    schemaVersion: 2,
    generatedBy: 'tools/asset-factory/scripts/export-autonomous-character-design-sheet-prompt.ts',
    characterId: options.characterId,
    productionReadyForPromptExport: true,
    imageGenerationExecuted: false,
    humanReviewRequired: false,
    automaticQaRequired: true,
    authoritySnapshot,
    generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
    sheets: Object.fromEntries(numbers.map((number) => [number, buildSheet(number)])),
  }, options.output);
} else {
  serialize(buildSheet(options.sheet), options.output);
}
