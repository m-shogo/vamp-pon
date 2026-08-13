import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const layeredPolicies = [
  ['hair', 'data/visual/all-character-hair-grooming-construction-fidelity-master-v1.json', 'docs/visual/all-character-hair-grooming-construction-fidelity-master-v1.md', 'topologyPreservationPriority', 'hairTopologyPreservationPriority', 14],
  ['face', 'data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json', 'docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md', 'preservationPriority', 'faceLandmarkPreservationPriority', 15],
  ['body', 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json', 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md', 'preservationPriority', 'bodyPreservationPriority', 12],
  ['garmentFit', 'data/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.json', 'docs/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.md', 'preservationPriority', 'garmentFitPreservationPriority', 12],
  ['garmentConstruction', 'data/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.json', 'docs/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.md', 'preservationPriority', 'garmentConstructionPreservationPriority', 12],
  ['garmentMaterial', 'data/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.json', 'docs/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.md', 'preservationPriority', 'garmentMaterialPreservationPriority', 12],
  ['dressingWorkflow', 'data/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.json', 'docs/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.md', 'preservationPriority', 'dressingWorkflowPreservationPriority', 12],
  ['longWearComfort', 'data/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.json', 'docs/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.md', 'preservationPriority', 'longWearComfortPreservationPriority', 12],
  ['operationalAccess', 'data/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.json', 'docs/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.md', 'preservationPriority', 'operationalAccessPreservationPriority', 12],
] as const;

function fail(message: string): never {
  throw new Error(`[character-production-entrypoint] ${message}`);
}

function loadJson(path: string): any {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

const terminalPolicyPath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
const terminalPolicy = loadJson(terminalPolicyPath);
if (terminalPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT') fail('terminal policy status invalid');
if (terminalPolicy.scopeCount !== 36) fail('terminal policy scopeCount must be 36');
if (terminalPolicy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter) fail('code/terminal policy exporter mismatch');
if (terminalPolicy.authorityDocument !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.authority) fail('code/terminal policy authority mismatch');
if (terminalPolicy.lowerExportersAreProductionEntrypoints !== false) fail('terminal lower-exporter bypass guard weakened');
if (terminalPolicy.handWrittenPromptIsProductionReady !== false) fail('terminal hand-prompt bypass guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.lowerExporterOutputIsProductionReady !== false) fail('code lower-exporter guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.handWrittenPromptIsProductionReady !== false) fail('code hand-prompt guard weakened');
for (const [field, expected] of Object.entries(CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.requiredOutputFlags ?? {})) {
  if (terminalPolicy.requiredOutputFlags?.[field] !== expected) fail(`code/terminal required flag mismatch: ${field}`);
}

const policyLineage: Array<{ path: string; policy: any }> = [];
const seenPolicyPaths = new Set<string>();
let lineagePath = terminalPolicyPath;
while (true) {
  if (seenPolicyPaths.has(lineagePath)) fail(`entrypoint policy lineage cycle: ${lineagePath}`);
  seenPolicyPaths.add(lineagePath);
  const policy = loadJson(lineagePath);
  if (policy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || policy.scopeCount !== 36) fail(`entrypoint policy invalid: ${lineagePath}`);
  if (typeof policy.productionExporter !== 'string' || typeof policy.authorityDocument !== 'string') fail(`entrypoint policy incomplete: ${lineagePath}`);
  if (policy.lowerExportersAreProductionEntrypoints !== false || policy.handWrittenPromptIsProductionReady !== false) fail(`entrypoint bypass boundary weakened: ${lineagePath}`);
  policyLineage.push({ path: lineagePath, policy });
  if (typeof policy.basePolicy !== 'string') break;
  const parent = loadJson(policy.basePolicy);
  if (policy.wrappedExporter !== parent.productionExporter) fail(`entrypoint wrapper/parent exporter mismatch: ${lineagePath}`);
  lineagePath = policy.basePolicy;
}

const rootPolicy = policyLineage[policyLineage.length - 1]?.policy;
if (!rootPolicy || rootPolicy.id !== 'yoru-no-shirube-character-production-generation-entrypoint-v1') fail('entrypoint lineage must terminate at v1 root policy');

const loadedPolicies = layeredPolicies.map(([name, policyPath, authorityPath, policyPriorityField, outputPriorityField, minimumPriority]) => {
  const policy = loadJson(policyPath);
  if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY' || policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail(`${name}: authority invalid`);
  for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`${name}: machine rule must remain false: ${field}`);
  if ((policy[policyPriorityField] ?? []).length < minimumPriority) fail(`${name}: preservation priority depth weakened`);
  return { name, policyPath, authorityPath, policy, outputPriorityField, minimumPriority };
});

const ids: string[] = [];
for (const path of profilePaths) {
  const json = loadJson(path);
  if (!Array.isArray(json.characters)) fail(`${path}: characters missing`);
  for (const character of json.characters) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique production IDs, got ${ids.length}/${new Set(ids).size}`);

const inheritedFlagGroups = [
  'requiredFlags',
  'wrapperRequiredFlags',
  'finalWrapperRequiredFlags',
  'terminalWrapperRequiredFlags',
  'hairTerminalWrapperRequiredFlags',
  'faceTerminalWrapperRequiredFlags',
];

const promptMarkers = [
  'CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.',
  'HAIR / GROOMING CONSTRUCTION FIDELITY — FINAL HAIR TOPOLOGY LOCK.',
  'FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.',
  'BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.',
  'GARMENT-TO-BODY FIT / TENSION / COMPRESSION FIDELITY — FINAL CLOTH-BODY MECHANICS LOCK.',
  'GARMENT PATTERN / SEAM / CLOSURE / LOAD FIDELITY — FINAL CONSTRUCTION TOPOLOGY LOCK.',
  'GARMENT MATERIAL / DRAPE / FOLD MEMORY FIDELITY — FINAL CLOTH PHYSICS LOCK.',
  'GARMENT DON / DOFF / DRESSING WORKFLOW FIDELITY — FINAL WEARABILITY LOCK.',
  'GARMENT COMFORT / PRESSURE / CHAFING / THERMAL / LONG-WEAR FIDELITY — FINAL LIVED-USE LOCK.',
  'FASTENER / OPERATIONAL ACCESS / SERVICEABILITY FIDELITY — FINAL USABILITY LOCK.',
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, terminalPolicy.productionExporter),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 440 * 1024 * 1024 });
  const exported = JSON.parse(stdout);

  for (const { path, policy } of policyLineage) {
    for (const [field, expected] of Object.entries(policy.requiredOutputFlags ?? {})) {
      if (exported[field] !== expected) fail(`${id}: ${path} required output mismatch: ${field}`);
    }
    for (const authorityPath of [path, policy.authorityDocument, policy.terminalPolicy, policy.terminalAuthorityDocument].filter((value): value is string => typeof value === 'string')) {
      if (!exported.authorityOrder?.includes(authorityPath)) fail(`${id}: entrypoint lineage authority missing: ${authorityPath}`);
    }
  }

  for (const groupName of inheritedFlagGroups) {
    for (const [field, expected] of Object.entries(rootPolicy[groupName] ?? {})) {
      if (exported[field] !== expected) fail(`${id}: inherited ${groupName} mismatch: ${field}`);
    }
  }

  if (exported.productionImageGenerationEntrypoint !== true || exported.productionCharacterPromptReady !== true || exported.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (Array.isArray(exported.imageGenerationReadinessFailures) && exported.imageGenerationReadinessFailures.length > 0) fail(`${id}: readiness failures present`);

  for (const { name, policyPath, authorityPath, policy, outputPriorityField, minimumPriority } of loadedPolicies) {
    for (const field of Object.keys(policy.rules ?? {})) if (exported[field] !== false) fail(`${id}: ${name} guard weakened: ${field}`);
    if (!exported.authorityOrder?.includes(policyPath) || !exported.authorityOrder?.includes(authorityPath)) fail(`${id}: ${name} authority chain missing`);
    if ((exported[outputPriorityField] ?? []).length < minimumPriority) fail(`${id}: ${name} exported preservation priority weakened`);
  }

  if ((exported.faceConstructionAxes ?? []).length < 46) fail(`${id}: face construction axes missing`);
  if ((exported.bodyConstructionAxes ?? []).length < 52) fail(`${id}: body construction axes missing`);
  if ((exported.garmentFitConstructionAxes ?? []).length < 55) fail(`${id}: garment fit axes missing`);
  if ((exported.garmentConstructionAxes ?? []).length < 60) fail(`${id}: garment construction axes missing`);
  if ((exported.garmentMaterialMechanicsAxes ?? []).length < 65) fail(`${id}: garment material mechanics axes missing`);
  if ((exported.dressingWorkflowAxes ?? []).length < 65) fail(`${id}: dressing workflow axes missing`);
  if ((exported.longWearComfortAxes ?? []).length < 80) fail(`${id}: long-wear comfort axes missing`);
  if ((exported.operationalAccessAxes ?? []).length < 80) fail(`${id}: operational access axes missing`);

  for (const marker of promptMarkers) if (!exported.prompt?.includes(marker)) fail(`${id}: prompt marker missing: ${marker}`);
  for (const path of rootPolicy.requiredAuthorityPaths ?? []) if (!exported.authorityOrder?.includes(path)) fail(`${id}: inherited root authority missing: ${path}`);
}

console.log(`[character-production-entrypoint] OK: ${ids.length}/36 production prompts preserve ${policyLineage.length}-generation entrypoint lineage and all layered fidelity authorities through ${terminalPolicy.productionExporter}`);
