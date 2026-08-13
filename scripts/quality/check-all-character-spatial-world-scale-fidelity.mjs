import { readFileSync } from 'node:fs';

const POLICY = 'data/visual/all-character-spatial-world-scale-fidelity-master-v1.json';
const DOC = 'docs/visual/all-character-spatial-world-scale-fidelity-master-v1.md';
const ENTRY = 'data/visual/character-production-generation-entrypoint-v1.json';
const EXPORTER = 'tools/asset-factory/scripts/export-production-character-design-prompt.ts';

const policy = JSON.parse(readFileSync(POLICY, 'utf8'));
const doc = readFileSync(DOC, 'utf8');
const entry = JSON.parse(readFileSync(ENTRY, 'utf8'));
const exporter = readFileSync(EXPORTER, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(policy.status === 'CURRENT_PRODUCTION_VISUAL_AUTHORITY', 'spatial/world-scale Master must be current production authority');
assert(policy.scopeCount === 36, `spatial/world-scale scope must be 36, got ${policy.scopeCount}`);
assert(policy.assetKindCount === 9, `asset-kind count must be 9, got ${policy.assetKindCount}`);
assert(policy.authorityDocument === DOC, 'machine policy must point to spatial/world-scale authority doc');
assert(Array.isArray(policy.spatialInvariants) && policy.spatialInvariants.length >= 16, 'need at least 16 spatial invariants');
assert(Array.isArray(policy.forbiddenShortcuts) && policy.forbiddenShortcuts.length >= 24, 'need at least 24 spatial failure bans');
assert(policy.unknownDimensionDefault === 'PRESERVE_RELATIVE_CATEGORY_NO_UNSUPPORTED_MEASUREMENT', 'unknown dimensions must preserve relative category without invented measurement');

const rules = policy.rules ?? {};
for (const [key, expected] of Object.entries({
  worldScaleMayRedesignCharacter: false,
  architectureMayResizeBody: false,
  mobilityEquipmentMayBeRemovedForComposition: false,
  unknownExactDimensionsMayBeInventedByImageModel: false,
  generatedSpatialRelationshipCreatesCanon: false,
  worldMotifMayOverrideFunctionalScale: false,
  cropMayImplyContradictoryBodyScale: false,
  nonHumanMayBeHumanizedByRoomScale: false
})) {
  assert(rules[key] === expected, `spatial rule mismatch: ${key}`);
}

assert(policy.production?.requiredForCandidateGeneration === true, 'spatial/world-scale Master must be required for candidate generation');
assert(policy.production?.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'spatial/world-scale output must remain candidate review required');

const requiredPhrases = [
  'The world may frame a character differently; it may not resize, normalize or redesign them',
  '`OPEN` is not permission for the image model to invent a precise measurement',
  'Spatial adaptation should happen in composition and world layout before changing the character body',
  'A lamp is not automatically giant because light is important',
  'Generated spatial relationships are candidate composition evidence only'
];
for (const phrase of requiredPhrases) assert(doc.includes(phrase), `authority doc missing required phrase: ${phrase}`);

assert(entry.requiredFlags?.allCharacterSpatialWorldScaleFidelityRequired === true, 'production entrypoint must require spatial/world-scale fidelity');
assert(entry.requiredFlags?.unknownExactDimensionsMayBeInventedByImageModel === false, 'production entrypoint must prohibit exact dimension invention');
assert(entry.requiredFlags?.worldScaleMayRedesignCharacter === false, 'production entrypoint must prohibit world-scale redesign');
assert(entry.requiredFlags?.architectureMayResizeBody === false, 'production entrypoint must prohibit architecture resizing body');
assert(entry.requiredFlags?.mobilityEquipmentMayBeRemovedForComposition === false, 'production entrypoint must preserve mobility equipment');
assert(entry.requiredFlags?.generatedSpatialRelationshipCreatesCanon === false, 'production entrypoint must keep generated spatial relation non-canon');
assert(entry.requiredAuthorityPaths?.includes(DOC), 'production entrypoint missing spatial/world-scale doc authority');
assert(entry.requiredAuthorityPaths?.includes(POLICY), 'production entrypoint missing spatial/world-scale machine authority');

assert(exporter.includes("const SPATIAL_POLICY_PATH = 'data/visual/all-character-spatial-world-scale-fidelity-master-v1.json'"), 'production exporter must load spatial policy directly');
assert(exporter.includes('allCharacterSpatialWorldScaleFidelityRequired'), 'production exporter must resolve spatial required flag');
assert(exporter.includes('spatialWorldScaleFidelityPolicyPath'), 'production exporter must expose spatial policy path');

console.log('all-character spatial/world-scale fidelity: OK');
