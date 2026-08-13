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
const layers = [
  ['hair','data/visual/all-character-hair-grooming-construction-fidelity-master-v1.json','docs/visual/all-character-hair-grooming-construction-fidelity-master-v1.md','topologyPreservationPriority','hairTopologyPreservationPriority',14,'hairConstructionAxes',36,'HAIR / GROOMING CONSTRUCTION FIDELITY — FINAL HAIR TOPOLOGY LOCK.'],
  ['face','data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json','docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md','preservationPriority','faceLandmarkPreservationPriority',15,'faceConstructionAxes',46,'FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.'],
  ['body','data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json','docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md','preservationPriority','bodyPreservationPriority',12,'bodyConstructionAxes',52,'BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.'],
  ['garmentFit','data/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.json','docs/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.md','preservationPriority','garmentFitPreservationPriority',12,'garmentFitConstructionAxes',55,'GARMENT-TO-BODY FIT / TENSION / COMPRESSION FIDELITY — FINAL CLOTH-BODY MECHANICS LOCK.'],
  ['garmentConstruction','data/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.json','docs/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.md','preservationPriority','garmentConstructionPreservationPriority',12,'garmentConstructionAxes',60,'GARMENT PATTERN / SEAM / CLOSURE / LOAD FIDELITY — FINAL CONSTRUCTION TOPOLOGY LOCK.'],
  ['garmentMaterial','data/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.json','docs/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.md','preservationPriority','garmentMaterialPreservationPriority',12,'garmentMaterialMechanicsAxes',65,'GARMENT MATERIAL / DRAPE / FOLD MEMORY FIDELITY — FINAL CLOTH PHYSICS LOCK.'],
  ['dressingWorkflow','data/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.json','docs/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.md','preservationPriority','dressingWorkflowPreservationPriority',12,'dressingWorkflowAxes',65,'GARMENT DON / DOFF / DRESSING WORKFLOW FIDELITY — FINAL WEARABILITY LOCK.'],
  ['longWearComfort','data/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.json','docs/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.md','preservationPriority','longWearComfortPreservationPriority',12,'longWearComfortAxes',80,'GARMENT COMFORT / PRESSURE / CHAFING / THERMAL / LONG-WEAR FIDELITY — FINAL LIVED-USE LOCK.'],
  ['operationalAccess','data/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.json','docs/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.md','preservationPriority','operationalAccessPreservationPriority',12,'operationalAccessAxes',80,'FASTENER / OPERATIONAL ACCESS / SERVICEABILITY FIDELITY — FINAL USABILITY LOCK.'],
  ['bodyAdornment','data/visual/all-character-body-adornment-marking-topology-fidelity-master-v1.json','docs/visual/all-character-body-adornment-marking-topology-fidelity-master-v1.md','preservationPriority','bodyAdornmentPreservationPriority',12,'bodyAdornmentTopologyAxes',70,'BODY ADORNMENT / PIERCING / JEWELRY / SKIN-MARKING TOPOLOGY FIDELITY — FINAL BODY-ATTACHED IDENTITY LOCK.'],
  ['accessoryInventory','data/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.json','docs/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.md','preservationPriority','accessoryPropInventoryPreservationPriority',12,'accessoryPropInventoryAxes',70,'ACCESSORY / PROP INVENTORY / STATE-TRANSITION FIDELITY — FINAL DISCRETE OBJECT IDENTITY LOCK.'],
  ['skinCoverage','data/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.json','docs/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.md','preservationPriority','skinCoveragePreservationPriority',12,'skinCoverageAxes',80,'SKIN COVERAGE / EXPOSURE BOUNDARY FIDELITY — FINAL AUTHORED COVERAGE LOCK.'],
] as const;

const fail = (m: string): never => { throw new Error(`[character-production-entrypoint] ${m}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const terminalPolicyPath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
const terminalPolicy = loadJson(terminalPolicyPath);
if (terminalPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || terminalPolicy.scopeCount !== 36) fail('terminal policy invalid');
if (terminalPolicy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter) fail('code/terminal exporter mismatch');
if (terminalPolicy.authorityDocument !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.authority) fail('code/terminal authority mismatch');
if (terminalPolicy.lowerExportersAreProductionEntrypoints !== false || terminalPolicy.handWrittenPromptIsProductionReady !== false) fail('terminal bypass guard weakened');
for (const [field, expected] of Object.entries(CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.requiredOutputFlags ?? {})) if (terminalPolicy.requiredOutputFlags?.[field] !== expected) fail(`code/terminal required flag mismatch: ${field}`);

const lineage: Array<{path:string;policy:any}> = [];
const seen = new Set<string>();
let currentPath = terminalPolicyPath;
while (true) {
  if (seen.has(currentPath)) fail(`entrypoint lineage cycle: ${currentPath}`);
  seen.add(currentPath);
  const policy = loadJson(currentPath);
  if (policy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || policy.scopeCount !== 36) fail(`invalid lineage policy: ${currentPath}`);
  if (policy.lowerExportersAreProductionEntrypoints !== false || policy.handWrittenPromptIsProductionReady !== false) fail(`lineage bypass weakened: ${currentPath}`);
  lineage.push({path:currentPath,policy});
  if (typeof policy.basePolicy !== 'string') break;
  const parent = loadJson(policy.basePolicy);
  if (policy.wrappedExporter !== parent.productionExporter) fail(`wrapper/parent mismatch: ${currentPath}`);
  currentPath = policy.basePolicy;
}
if (lineage.at(-1)?.policy?.id !== 'yoru-no-shirube-character-production-generation-entrypoint-v1') fail('lineage must terminate at v1');

const loadedLayers = layers.map(([name,policyPath,authorityPath,policyPriorityField,outputPriorityField,minPriority,axesField,minAxes,promptMarker]) => {
  const policy = loadJson(policyPath);
  if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY' || policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail(`${name}: authority invalid`);
  if ((policy[policyPriorityField] ?? []).length < minPriority) fail(`${name}: preservation priority weakened`);
  for (const [field,value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`${name}: rule must remain false: ${field}`);
  return {name,policyPath,authorityPath,policy,outputPriorityField,minPriority,axesField,minAxes,promptMarker};
});

const ids: string[] = [];
for (const path of profilePaths) for (const c of loadJson(path).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath,['--experimental-strip-types',resolve(root,terminalPolicy.productionExporter),'--character',id,'--kind','character_reference'],{cwd:root,encoding:'utf8',maxBuffer:760*1024*1024});
  const output = JSON.parse(stdout);
  if (output.productionImageGenerationEntrypoint !== true || output.productionCharacterPromptReady !== true || output.productionPromptAuthorityLocked !== true) fail(`${id}: production lock missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (Array.isArray(output.imageGenerationReadinessFailures) && output.imageGenerationReadinessFailures.length) fail(`${id}: readiness failures present`);
  for (const {path,policy} of lineage) {
    for (const [field,expected] of Object.entries(policy.requiredOutputFlags ?? {})) if (output[field] !== expected) fail(`${id}: ${path} flag mismatch: ${field}`);
    for (const evidencePath of [path,policy.authorityDocument,policy.terminalPolicy,policy.terminalAuthorityDocument].filter((v):v is string => typeof v === 'string')) if (!output.authorityOrder?.includes(evidencePath)) fail(`${id}: lineage authority missing: ${evidencePath}`);
  }
  for (const layer of loadedLayers) {
    for (const field of Object.keys(layer.policy.rules ?? {})) if (output[field] !== false) fail(`${id}: ${layer.name} guard weakened: ${field}`);
    if (!output.authorityOrder?.includes(layer.policyPath) || !output.authorityOrder?.includes(layer.authorityPath)) fail(`${id}: ${layer.name} authority missing`);
    if ((output[layer.outputPriorityField] ?? []).length < layer.minPriority) fail(`${id}: ${layer.name} priority weakened`);
    if ((output[layer.axesField] ?? []).length < layer.minAxes) fail(`${id}: ${layer.name} axes missing`);
    if (!output.prompt?.includes(layer.promptMarker)) fail(`${id}: ${layer.name} prompt marker missing`);
  }
  if (!output.prompt?.includes('CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.')) fail(`${id}: root production marker missing`);
}

console.log(`[character-production-entrypoint] OK: ${ids.length}/36 prompts preserve ${lineage.length}-generation lineage and ${loadedLayers.length} layered fidelity authorities through ${terminalPolicy.productionExporter}`);
