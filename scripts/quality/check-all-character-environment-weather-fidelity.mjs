import { readFileSync } from 'node:fs';

const POLICY = 'data/visual/all-character-environment-weather-fidelity-master-v1.json';
const DOC = 'docs/visual/all-character-environment-weather-fidelity-master-v1.md';
const ENTRY = 'data/visual/character-production-generation-entrypoint-v1.json';

const policy = JSON.parse(readFileSync(POLICY, 'utf8'));
const doc = readFileSync(DOC, 'utf8');
const entry = JSON.parse(readFileSync(ENTRY, 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(policy.status === 'CURRENT_PRODUCTION_VISUAL_AUTHORITY', 'environment/weather Master must be current production authority');
assert(policy.scopeCount === 36, `environment/weather scope must be 36, got ${policy.scopeCount}`);
assert(policy.assetKindCount === 9, `asset-kind count must be 9, got ${policy.assetKindCount}`);
assert(policy.authorityDocument === DOC, 'machine policy must point to environment/weather authority doc');
assert(Array.isArray(policy.responseInvariants) && policy.responseInvariants.length >= 14, 'need at least 14 environment response invariants');
assert(Array.isArray(policy.allowedEnvironmentChannels) && policy.allowedEnvironmentChannels.length >= 14, 'need at least 14 allowed physical environment channels');
assert(Array.isArray(policy.forbiddenShortcuts) && policy.forbiddenShortcuts.length >= 20, 'need at least 20 environment failure bans');
assert(policy.unknownEnvironmentDefault === 'NEUTRAL_PHYSICALLY_PLAUSIBLE_MINIMAL_EFFECT', 'unknown environment must default to minimal neutral physical effect');

const rules = policy.rules ?? {};
for (const [key, expected] of Object.entries({
  environmentMayRedesignCharacter: false,
  weatherMayIncreaseExposure: false,
  weatherMayInventWardrobe: false,
  weatherMayInventProtectionGear: false,
  weatherMayEraseMobilityEquipment: false,
  nightMayReplaceIdentityPalette: false,
  unknownEnvironmentMayBeInventedByImageModel: false,
  generatedEnvironmentalReactionCreatesCanon: false,
  worldMotifMayReplacePhysicalMaterialResponse: false,
  cinematicWetLookMayOverrideLivingVisual: false
})) {
  assert(rules[key] === expected, `environment rule mismatch: ${key}`);
}

assert(policy.production?.requiredForCandidateGeneration === true, 'environment/weather Master must be required for candidate generation');
assert(policy.production?.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'environment/weather output must remain candidate review required');

const requiredPhrases = [
  'Environment is not a decorative filter',
  '`OPEN` means omit or stay conservative',
  'transparent wet clothing used to create new exposure',
  'invented scarf, hood, poncho, umbrella, gloves or boots',
  'Do not paste stars, glowing paper, magical fog or gold highlights',
  'Generated environmental reactions remain candidate rendering evidence only'
];
for (const phrase of requiredPhrases) assert(doc.includes(phrase), `authority doc missing required phrase: ${phrase}`);

assert(entry.requiredFlags?.allCharacterEnvironmentWeatherFidelityRequired === true, 'production entrypoint must require environment/weather fidelity');
assert(entry.requiredFlags?.unknownEnvironmentMayBeInventedByImageModel === false, 'production entrypoint must prohibit unknown environment invention');
assert(entry.requiredFlags?.environmentMayRedesignCharacter === false, 'production entrypoint must prohibit environment redesign');
assert(entry.requiredFlags?.weatherMayIncreaseExposure === false, 'production entrypoint must prohibit weather-created exposure');
assert(entry.requiredFlags?.weatherMayInventWardrobe === false, 'production entrypoint must prohibit weather wardrobe invention');
assert(entry.requiredFlags?.generatedEnvironmentalReactionCreatesCanon === false, 'production entrypoint must keep generated environment reaction non-canon');
assert(entry.requiredAuthorityPaths?.includes(DOC), 'production entrypoint missing environment/weather doc authority');
assert(entry.requiredAuthorityPaths?.includes(POLICY), 'production entrypoint missing environment/weather machine authority');

console.log('all-character environment/weather fidelity: OK');
