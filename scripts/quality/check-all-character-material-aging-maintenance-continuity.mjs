import { readFileSync } from 'node:fs';

const POLICY = 'data/visual/all-character-material-aging-maintenance-continuity-master-v1.json';
const DOC = 'docs/visual/all-character-material-aging-maintenance-continuity-master-v1.md';
const ENTRY = 'data/visual/character-production-generation-entrypoint-v1.json';
const EXPORTER = 'tools/asset-factory/scripts/export-production-character-design-prompt.ts';

const policy = JSON.parse(readFileSync(POLICY, 'utf8'));
const doc = readFileSync(DOC, 'utf8');
const entry = JSON.parse(readFileSync(ENTRY, 'utf8'));
const exporter = readFileSync(EXPORTER, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(policy.status === 'CURRENT_PRODUCTION_VISUAL_AUTHORITY', 'maintenance Master must be current production authority');
assert(policy.scopeCount === 36, `maintenance scope must be 36, got ${policy.scopeCount}`);
assert(policy.assetKindCount === 9, `asset-kind count must be 9, got ${policy.assetKindCount}`);
assert(policy.authorityDocument === DOC, 'machine policy must point to maintenance authority doc');
assert(Array.isArray(policy.continuityInvariants) && policy.continuityInvariants.length >= 18, 'need at least 18 maintenance continuity invariants');
assert(Array.isArray(policy.allowedStates) && policy.allowedStates.length === 5, 'maintenance state model must contain exactly five governed states');
assert(Array.isArray(policy.wearMapZones) && policy.wearMapZones.length >= 10, 'need at least 10 causal wear-map zones');
assert(Array.isArray(policy.forbiddenShortcuts) && policy.forbiddenShortcuts.length >= 27, 'need at least 27 maintenance failure bans');
assert(policy.unknownMaintenanceDefault === 'NEUTRAL_MAINTAINED', 'unknown maintenance must default to neutral maintained');

const rules = policy.rules ?? {};
for (const [key, expected] of Object.entries({
  agingMayInventPersonality: false,
  damageMayIncreaseExposure: false,
  premiumAssetMayAddDamage: false,
  highResolutionMayAddWearDetail: false,
  stateTransformMayResetMaintenanceHistory: false,
  unknownMaintenanceMayBeInventedByImageModel: false,
  generatedWearRepairCreatesCanon: false,
  randomDistressingMayReplaceUseCausality: false
})) {
  assert(rules[key] === expected, `maintenance rule mismatch: ${key}`);
}

assert(policy.production?.requiredForCandidateGeneration === true, 'maintenance Master must be required for candidate generation');
assert(policy.production?.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'maintenance output must remain candidate review required');

for (const phrase of [
  'It may not infer that a person is tidy, dirty, careless, obsessive, poor, wealthy, sentimental or wasteful',
  '`OPEN` means preserve a neutral maintained state',
  'higher-resolution/premium art may reveal existing wear more clearly but may not invent more damage',
  'Do not create atmosphere by adding universal distressing',
  'Generated wear/repair states remain candidate rendering evidence'
]) {
  assert(doc.includes(phrase), `authority doc missing required phrase: ${phrase}`);
}

assert(entry.requiredFlags?.allCharacterMaterialAgingMaintenanceContinuityRequired === true, 'production entrypoint must require maintenance continuity');
assert(entry.requiredFlags?.unknownMaintenanceMayBeInventedByImageModel === false, 'production entrypoint must prohibit maintenance invention');
assert(entry.requiredFlags?.agingMayInventPersonality === false, 'production entrypoint must prohibit personality inference from aging');
assert(entry.requiredFlags?.damageMayIncreaseExposure === false, 'production entrypoint must prohibit damage-created exposure');
assert(entry.requiredFlags?.premiumAssetMayAddDamage === false, 'production entrypoint must prohibit premium damage');
assert(entry.requiredFlags?.highResolutionMayAddWearDetail === false, 'production entrypoint must prohibit resolution-driven wear invention');
assert(entry.requiredFlags?.stateTransformMayResetMaintenanceHistory === false, 'production entrypoint must preserve maintenance history through state transforms');
assert(entry.requiredFlags?.generatedWearRepairCreatesCanon === false, 'production entrypoint must keep generated wear non-canon');
assert(entry.requiredAuthorityPaths?.includes(DOC), 'production entrypoint missing maintenance doc authority');
assert(entry.requiredAuthorityPaths?.includes(POLICY), 'production entrypoint missing maintenance machine authority');

assert(exporter.includes("const MAINTENANCE_POLICY_PATH = 'data/visual/all-character-material-aging-maintenance-continuity-master-v1.json'"), 'production exporter must load maintenance policy directly');
assert(exporter.includes('allCharacterMaterialAgingMaintenanceContinuityRequired'), 'production exporter must resolve maintenance required flag');
assert(exporter.includes('materialAgingMaintenanceContinuityPolicyPath'), 'production exporter must expose maintenance policy path');

console.log('all-character material aging/maintenance continuity: OK');
