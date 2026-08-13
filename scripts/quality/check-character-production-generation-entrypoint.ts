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
  ['hair', 'data/visual/all-character-hair-grooming-construction-fidelity-master-v1.json', 'docs/visual/all-character-hair-grooming-construction-fidelity-master-v1.md'],
  ['face', 'data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json', 'docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md'],
  ['body', 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json', 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md'],
  ['garmentFit', 'data/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.json', 'docs/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.md'],
  ['garmentConstruction', 'data/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.json', 'docs/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.md'],
  ['garmentMaterial', 'data/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.json', 'docs/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.md'],
  ['dressingWorkflow', 'data/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.json', 'docs/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.md'],
] as const;

function fail(message: string): never {
  throw new Error(`[character-production-entrypoint] ${message}`);
}

const terminalPolicyPath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
const terminalPolicy = JSON.parse(readFileSync(resolve(root, terminalPolicyPath), 'utf8'));
if (terminalPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT') fail('terminal policy status invalid');
if (terminalPolicy.scopeCount !== 36) fail('terminal policy scopeCount must be 36');
if (terminalPolicy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter) fail('code/terminal policy exporter mismatch');
if (terminalPolicy.authorityDocument !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.authority) fail('code/terminal policy authority mismatch');
if (terminalPolicy.lowerExportersAreProductionEntrypoints !== false) fail('terminal lower-exporter bypass guard weakened');
if (terminalPolicy.handWrittenPromptIsProductionReady !== false) fail('terminal hand-prompt bypass guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.lowerExporterOutputIsProductionReady !== false) fail('code lower-exporter guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.handWrittenPromptIsProductionReady !== false) fail('code hand-prompt guard weakened');
if (typeof terminalPolicy.basePolicy !== 'string') fail('terminal basePolicy missing');

const basePolicy = JSON.parse(readFileSync(resolve(root, terminalPolicy.basePolicy), 'utf8'));
if (basePolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || basePolicy.scopeCount !== 36) fail('base production policy invalid');
if (terminalPolicy.wrappedExporter !== basePolicy.productionExporter) fail('terminal wrapper/base exporter mismatch');

const loadedPolicies = layeredPolicies.map(([name, policyPath, authorityPath]) => {
  const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
  if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY' || policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail(`${name}: authority invalid`);
  for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`${name}: machine rule must remain false: ${field}`);
  return { name, policyPath, authorityPath, policy };
});

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
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
];

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, terminalPolicy.productionExporter),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 280 * 1024 * 1024 });
  const exported = JSON.parse(stdout);

  for (const [field, expected] of Object.entries(terminalPolicy.requiredOutputFlags ?? {})) {
    if (exported[field] !== expected) fail(`${id}: terminal required output mismatch: ${field}`);
  }
  for (const groupName of inheritedFlagGroups) {
    for (const [field, expected] of Object.entries(basePolicy[groupName] ?? {})) {
      if (exported[field] !== expected) fail(`${id}: inherited ${groupName} mismatch: ${field}`);
    }
  }

  if (exported.productionImageGenerationEntrypoint !== true || exported.productionCharacterPromptReady !== true || exported.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (Array.isArray(exported.imageGenerationReadinessFailures) && exported.imageGenerationReadinessFailures.length > 0) fail(`${id}: readiness failures present`);

  for (const { name, policyPath, authorityPath, policy } of loadedPolicies) {
    for (const field of Object.keys(policy.rules ?? {})) if (exported[field] !== false) fail(`${id}: ${name} guard weakened: ${field}`);
    if (!exported.authorityOrder?.includes(policyPath) || !exported.authorityOrder?.includes(authorityPath)) fail(`${id}: ${name} authority chain missing`);
  }

  if ((exported.faceConstructionAxes ?? []).length < 46) fail(`${id}: face construction axes missing`);
  if ((exported.bodyConstructionAxes ?? []).length < 52) fail(`${id}: body construction axes missing`);
  if ((exported.garmentFitConstructionAxes ?? []).length < 55) fail(`${id}: garment fit axes missing`);
  if ((exported.garmentConstructionAxes ?? []).length < 60) fail(`${id}: garment construction axes missing`);
  if ((exported.garmentMaterialMechanicsAxes ?? []).length < 65) fail(`${id}: garment material mechanics axes missing`);
  if ((exported.dressingWorkflowAxes ?? []).length < 65) fail(`${id}: dressing workflow axes missing`);

  for (const marker of promptMarkers) if (!exported.prompt?.includes(marker)) fail(`${id}: prompt marker missing: ${marker}`);
  for (const path of basePolicy.requiredAuthorityPaths ?? []) if (!exported.authorityOrder?.includes(path)) fail(`${id}: inherited required authority missing: ${path}`);
  for (const path of [terminalPolicy.authorityDocument, terminalPolicyPath, terminalPolicy.terminalAuthorityDocument, terminalPolicy.terminalPolicy]) if (!exported.authorityOrder?.includes(path) && path !== terminalPolicy.authorityDocument && path !== terminalPolicyPath) fail(`${id}: terminal authority missing: ${path}`);
}

console.log(`[character-production-entrypoint] OK: ${ids.length}/36 production prompts preserve inherited v1 authority plus dressing workflow terminal lock through ${terminalPolicy.productionExporter}`);
