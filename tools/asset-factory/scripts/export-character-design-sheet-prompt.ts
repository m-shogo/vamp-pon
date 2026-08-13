import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../../src/game/data/characterReferenceProductionEntrypoint.ts';

const BRIDGE_PATH = 'data/character-assets/manifests/visual-character-sheet-production-entrypoint-bridge.v1.json';
const PARENT_ENTRYPOINT_SOURCE = 'src/game/data/characterReferenceProductionEntrypoint.ts';
const PARENT_POLICY_PATH = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
const PARENT_EXPORTER = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter;

type SheetNumber = '01' | '02' | '03' | '04';
type SheetSelection = SheetNumber | 'all';
type Options = { characterId: string; sheet: SheetSelection; output: string | null; inspection: boolean };

type SheetConfig = {
  role: string;
  purpose: string;
  composition: string[];
  hardConstraints: string[];
  review: string[];
};

const SHEETS: Record<SheetNumber, SheetConfig> = {
  '01': {
    role: 'identity-turnaround',
    purpose: 'Lock one character identity across inspectable full-body views without letting turnaround layout create new anatomy, asymmetry, clothing, equipment or pose canon.',
    composition: [
      'full-body front view',
      'full-body anatomical-left side view',
      'full-body anatomical-right side view',
      'full-body back view',
      'all four views at comparable body scale with head and feet visible',
      'neutral inspection presentation rather than hero key-art perspective',
    ],
    hardConstraints: [
      'Use one anatomical coordinate system across all views; never substitute viewer-left/right for body-left/right.',
      'Do not create a side view by mirroring the opposite side when asymmetric hair, clothing, equipment, body marks or mobility equipment exist.',
      'Preserve exactly the same face, body-mass family, age/species coding, garment construction, prop scale, storage relation and mobility equipment across all views.',
      'Unknown handedness, exact asymmetry, hidden closures or hidden body detail remain OPEN and may not be invented to complete the sheet.',
      'Neutral turnaround posture is inspection scaffolding only and does not become the character signature pose.',
      'No crop, foreshortening, giant foreground hand/foot, beauty-angle correction or body slimming is allowed.',
    ],
    review: [
      'front/left/right/back are genuinely distinct anatomical views rather than mirrored duplicates',
      'silhouette and body-mass read remain identical across views',
      'equipment/storage anchors remain body-relative and physically coherent',
      'face and head/hair mass remain the same identity in every view',
    ],
  },
  '02': {
    role: 'face-expression-acting',
    purpose: 'Document face construction and bounded acting deformation while preserving the base face and refusing to invent signature emotional behavior.',
    composition: [
      'neutral face construction as the primary anchor',
      'front and three-quarter construction views where source authority permits',
      'expression deformation studies kept secondary to the neutral identity anchor',
      'acting examples chosen only from existing authority; otherwise use low-intensity diagnostic deformation rather than signature emotion claims',
    ],
    hardConstraints: [
      'Expression may deform soft tissue and jaw opening but may not rebuild skull/head width, brow-eye spacing, eye construction, nose proportion, cheek mass, mouth placement, chin or jaw identity.',
      'Do not enlarge eyes, sharpen jaws, shrink noses, de-age the face, lighten body identity color, add automatic blush or beautify one state relative to another.',
      'Do not infer romance, gender presentation, personality, diagnosis, trauma, signature smile, signature anger or emotional frequency from the generated sheet.',
      'Marks, wrinkles, dimples, scars and asymmetry appear only when upstream authority resolves them.',
      'Dawn/Kokuyou lighting or effects may be referenced only as state overlays; they do not authorize a different face.',
    ],
    review: [
      'neutral face remains the recognizable parent of every expression study',
      'age/species/body-state coding does not drift between expressions',
      'generated acting does not become Character Canon or feedback recurrence automatically',
      'no generic premium-anime expression face replaces the authored identity',
    ],
  },
  '03': {
    role: 'costume-equipment-material',
    purpose: 'Explain authorized garment, equipment, storage, prop and material construction so later art does not solve ambiguity by inventing accessories or impossible handling.',
    composition: [
      'front/back construction read of authorized garments',
      'authorized closures, seams, hems, pockets/storage and attachment points only',
      'equipment and named-prop scale/body relation',
      'material response references for authorized cloth, paper, leather, metal, glass, fur, shell or synthetic surfaces as applicable',
      'maintenance/wear evidence only where the latest production authority allows it',
    ],
    hardConstraints: [
      'Do not add belts, harnesses, pouches, pockets, jewelry, straps, fasteners, armor panels, waterproof gear or decorative layers that are not upstream-authorized.',
      'Every carried/stored prop must have a physically plausible contact and retrieve/use/return path; do not float or teleport equipment.',
      'Unknown hidden construction stays unresolved or minimally diagrammed; high resolution is not permission to invent micro-detail.',
      'Weather, dirt, wear, repair and replacement must follow authorized material/maintenance continuity and may not increase exposure.',
      'Theme/accent/Star Beast colors may not flood garments or recolor skin/fur/shell/body identity.',
      'Named Object geometry remains its own authority; this sheet may document relation/scale but may not redesign the object.',
    ],
    review: [
      'garment construction matches the current production Master rather than a generic gacha outfit',
      'storage/contact/load paths are believable and do not create new equipment',
      'material identity survives lighting/weather without palette replacement',
      'wear/repair continuity is causal rather than random decorative distressing',
    ],
  },
  '04': {
    role: 'silhouette-motion-derivation',
    purpose: 'Stress-test silhouette, posture, motion and perspective derivation without allowing action staging to redesign the body or create unsupported signature choreography.',
    composition: [
      'primary neutral silhouette anchor at readable small scale',
      'bounded motion envelope derived from existing embodied-acting authority',
      'prop/contact motion examples only when handling authority exists',
      'perspective stress examples that prove identity survives camera change',
      'when exact motion is OPEN, use neutral diagnostic movement placeholders explicitly treated as non-canon',
    ],
    hardConstraints: [
      'Motion and perspective may not alter head/body ratio, shoulder/torso/hip mass, limb thickness, hand/foot scale, age/species coding, mobility equipment or clothing anchors.',
      'Do not create heroic low-angle long legs, giant impact hands/feet, tiny waist, enlarged chest/shoulders, floating cloth, orbiting props or action-only hair volume.',
      'Do not infer handedness, signature gait, combat flourish, relationship distance, protectiveness, intimacy or habitual gesture when OPEN.',
      'World geometry and furniture must adapt to the character rather than resizing the character to fit the scene.',
      'Derived silhouettes and poses remain candidate production evidence and cannot promote themselves to Character Master or Canon.',
    ],
    review: [
      'small-scale silhouette remains identifiable without accessory invention',
      'body mass and mobility relation survive motion and perspective stress',
      'prop scale/contact remain continuous through movement',
      'no generated diagnostic pose is treated as a signature behavior without Human/source authority',
    ],
  },
};

function parseArgs(args: string[]): Options {
  let characterId = '';
  let sheet: SheetSelection = '01';
  let output: string | null = null;
  let inspection = false;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--sheet') { sheet = (args[++i] ?? '') as SheetSelection; continue; }
    if (arg === '--output') { output = args[++i] ?? null; continue; }
    if (arg === '--inspection') { inspection = true; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  if (!['01', '02', '03', '04', 'all'].includes(sheet)) throw new Error(`--sheet must be 01, 02, 03, 04 or all: ${sheet}`);
  return { characterId, sheet, output, inspection };
}

function serialize(value: unknown, output: string | null) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (output) {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, text);
    console.log(`character design sheet prompt exported: ${output}`);
  } else {
    process.stdout.write(text);
  }
}

function buildSheet(base: Record<string, unknown>, characterId: string, sheetNumber: SheetNumber, bridge: any) {
  const config = SHEETS[sheetNumber];
  const roleBlock = [
    'CHARACTER DESIGN SHEET ADAPTER — ROLE-SPECIFIC PRODUCTION CONSTRAINTS.',
    `Sheet ${sheetNumber}: ${config.role}.`,
    `Purpose: ${config.purpose}`,
    'COMPOSITION:',
    ...config.composition.map((value) => `- ${value}`),
    'HARD CONSTRAINTS:',
    ...config.hardConstraints.map((value) => `- ${value}`),
    'AUTHORITY BOUNDARY:',
    '- These constraints narrow composition only; they may not replace, weaken or override the parent Production Character Prompt authority chain.',
    '- The generated sheet starts as CANDIDATE_REVIEW_REQUIRED and cannot create Canon, Character Master approval, runtime approval, handedness, hidden construction, relationship evidence or recurrence rules.',
    '- If a Sheet role needs information that upstream authority leaves OPEN, omit/neutralize it rather than inventing a design answer.',
  ].join('\n');

  return {
    ...base,
    schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 26),
    generatedBy: 'tools/asset-factory/scripts/export-character-design-sheet-prompt.ts',
    parentProductionEntrypointSource: PARENT_ENTRYPOINT_SOURCE,
    parentProductionExporter: PARENT_EXPORTER,
    parentProductionPolicy: PARENT_POLICY_PATH,
    sheetBridgePolicy: BRIDGE_PATH,
    characterId,
    sheetNumber,
    sheetRole: config.role,
    characterDesignSheetAdapterEntrypoint: true,
    parentProductionCharacterPromptReadyRequired: true,
    directLegacyPromptPacketProductionAllowed: false,
    handWrittenSheetPromptProductionAllowed: false,
    sheetSpecificPromptMayCreateCanon: false,
    generatedSheetMayCreateCharacterMasterApproval: false,
    generatedSheetMayCreateRuntimeApproval: false,
    generatedSheetMayCreateFeedbackRule: false,
    generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
    humanReviewRequired: true,
    sheetAdapterPolicyVersion: bridge.schemaVersion,
    prompt: `${String(base.prompt ?? '')}\n\n${roleBlock}`,
    reviewChecklist: [
      ...config.review,
      'parent production exporter flags and all required authority paths remain present',
      'Sheet-specific composition never weakens OPEN/no-invention boundaries',
      'candidate sheet is not promoted without Human review and Character Design Master Pack gate',
      ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
    ],
  };
}

const options = parseArgs(process.argv.slice(2));
const bridge = JSON.parse(readFileSync(resolve(process.cwd(), BRIDGE_PATH), 'utf8'));
if (bridge.status !== 'ACTIVE_LATEST_MAIN_SHEET_ADAPTER_NO_IMAGE_GENERATION') throw new Error(`Sheet bridge is not active: ${bridge.status}`);
if (bridge.parentProductionEntrypointSource !== PARENT_ENTRYPOINT_SOURCE) throw new Error('Sheet bridge parent entrypoint source mismatch');
if (bridge.parentExporterResolution !== 'LIVE_FROM_CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT') throw new Error('Sheet bridge must resolve parent exporter live from code entrypoint');
if (bridge.directLegacyPacketProductionAllowed !== false) throw new Error('Legacy packet production bypass was enabled');
if (bridge.generatedSheetMayCreateCanon !== false || bridge.humanReviewRequired !== true) throw new Error('Sheet candidate/Human boundary weakened');

const heldIds = new Set<string>(bridge.hold?.characterIds ?? []);
if (heldIds.has(options.characterId)) {
  const held = {
    schemaVersion: 1,
    generatedBy: 'tools/asset-factory/scripts/export-character-design-sheet-prompt.ts',
    parentProductionEntrypointSource: PARENT_ENTRYPOINT_SOURCE,
    parentProductionExporter: PARENT_EXPORTER,
    characterId: options.characterId,
    requestedSheet: options.sheet,
    productionReady: false,
    state: 'BLOCKED_BY_EXPLICIT_CHARACTER_HOLD',
    reason: bridge.hold.reason,
    imageGenerationAuthorized: false,
    holdMustNotBeBypassedByAdapter: true,
  };
  if (options.inspection) {
    serialize(held, options.output);
    process.exit(0);
  }
  throw new Error(`${options.characterId}: Character Design Sheet production is blocked by explicit HOLD: ${bridge.hold.reason}`);
}

const parentStdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), PARENT_EXPORTER),
  '--character', options.characterId,
  '--kind', 'character_reference',
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 48 * 1024 * 1024 });
const parent = JSON.parse(parentStdout);

if (parent.productionImageGenerationEntrypoint !== true || parent.productionCharacterPromptReady !== true || parent.productionPromptAuthorityLocked !== true) {
  throw new Error(`${options.characterId}: parent production exporter is not production-ready`);
}
if (parent.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION' || parent.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') {
  throw new Error(`${options.characterId}: parent readiness/candidate boundary invalid`);
}
if (parent.generatedImageCreatesCanon !== false || parent.handWrittenPromptIsProductionReady !== false || parent.lowerExporterOutputIsProductionReady !== false) {
  throw new Error(`${options.characterId}: parent bypass/canon guards weakened`);
}

if (options.sheet === 'all') {
  const sheetNumbers = Object.keys(SHEETS) as SheetNumber[];
  serialize({
    schemaVersion: 1,
    generatedBy: 'tools/asset-factory/scripts/export-character-design-sheet-prompt.ts',
    parentProductionEntrypointSource: PARENT_ENTRYPOINT_SOURCE,
    parentProductionExporter: PARENT_EXPORTER,
    characterId: options.characterId,
    productionReady: true,
    generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
    sheets: Object.fromEntries(sheetNumbers.map((sheetNumber) => [sheetNumber, buildSheet(parent, options.characterId, sheetNumber, bridge)])),
  }, options.output);
} else {
  serialize(buildSheet(parent, options.characterId, options.sheet, bridge), options.output);
}
