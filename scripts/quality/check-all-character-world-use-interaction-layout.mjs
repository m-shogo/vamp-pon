import { readFileSync } from 'node:fs';

const POLICY = 'data/visual/all-character-world-use-interaction-layout-master-v1.json';
const DOC = 'docs/visual/all-character-world-use-interaction-layout-master-v1.md';
const ENTRY = 'data/visual/character-production-generation-entrypoint-v1.json';
const EXPORTER = 'tools/asset-factory/scripts/export-production-character-design-prompt.ts';

const policy = JSON.parse(readFileSync(POLICY, 'utf8'));
const doc = readFileSync(DOC, 'utf8');
const entry = JSON.parse(readFileSync(ENTRY, 'utf8'));
const exporter = readFileSync(EXPORTER, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(policy.status === 'CURRENT_PRODUCTION_VISUAL_AUTHORITY', 'world-use layout Master must be current production authority');
assert(policy.scopeCount === 36, `world-use layout scope must be 36, got ${policy.scopeCount}`);
assert(policy.assetKindCount === 9, `asset-kind count must be 9, got ${policy.assetKindCount}`);
assert(policy.authorityDocument === DOC, 'machine policy must point to world-use layout authority doc');
assert(Array.isArray(policy.layoutInvariants) && policy.layoutInvariants.length >= 18, 'need at least 18 layout invariants');
assert(Array.isArray(policy.forbiddenShortcuts) && policy.forbiddenShortcuts.length >= 25, 'need at least 25 layout failure bans');
assert(policy.unknownUseDefault === 'NEUTRAL_LOW_ASSUMPTION_CLEAR_ROUTE_MINIMAL_STORAGE_NO_LIFESTYLE_CLAIM', 'unknown use must default to low-assumption neutral layout');

const loops = policy.interactionLoops ?? {};
assert(Array.isArray(loops.carryUse) && loops.carryUse.length >= 6, 'carry/use loop incomplete');
assert(Array.isArray(loops.work) && loops.work.length >= 8, 'work loop incomplete');
assert(Array.isArray(loops.waitRest) && loops.waitRest.length >= 5, 'wait/rest loop incomplete');
assert(Array.isArray(loops.repair) && loops.repair.length >= 7, 'repair loop incomplete');

const rules = policy.rules ?? {};
for (const [key, expected] of Object.entries({
  layoutMayInventCharacterRoutine: false,
  layoutMayInventRelationshipEvidence: false,
  layoutMayInventPrivateObjects: false,
  layoutMayBlockEstablishedMobilityRoute: false,
  clutterMayReplaceFunctionalWorldUse: false,
  unknownUseHabitMayBeInventedByImageModel: false,
  generatedLayoutCreatesCanon: false,
  worldMotifMayReplaceUseLogic: false
})) {
  assert(rules[key] === expected, `layout rule mismatch: ${key}`);
}

assert(policy.production?.requiredForCandidateGeneration === true, 'world-use layout Master must be required for candidate generation');
assert(policy.production?.generatedOutputState === 'CANDIDATE_REVIEW_REQUIRED', 'world-use layout output must remain candidate review required');

const requiredPhrases = [
  'This Master is design-only',
  'If none apply, simplify or remove it rather than adding decorative clutter',
  'Unknown habits remain unknown',
  'The visual question is not “what Yoru-no-Shirube motif can be added?”',
  'Generated object placement, clutter pattern, room use, furniture choice or routine implication remains candidate composition evidence'
];
for (const phrase of requiredPhrases) assert(doc.includes(phrase), `authority doc missing required phrase: ${phrase}`);

assert(entry.requiredFlags?.allCharacterWorldUseInteractionLayoutRequired === true, 'production entrypoint must require world-use layout authority');
assert(entry.requiredFlags?.unknownUseHabitMayBeInventedByImageModel === false, 'production entrypoint must prohibit unknown habit invention');
assert(entry.requiredFlags?.layoutMayInventCharacterRoutine === false, 'production entrypoint must prohibit routine invention');
assert(entry.requiredFlags?.layoutMayInventRelationshipEvidence === false, 'production entrypoint must prohibit relationship evidence invention');
assert(entry.requiredFlags?.layoutMayBlockEstablishedMobilityRoute === false, 'production entrypoint must preserve mobility route');
assert(entry.requiredFlags?.generatedLayoutCreatesCanon === false, 'production entrypoint must keep generated layout non-canon');
assert(entry.requiredAuthorityPaths?.includes(DOC), 'production entrypoint missing world-use layout doc authority');
assert(entry.requiredAuthorityPaths?.includes(POLICY), 'production entrypoint missing world-use layout machine authority');

assert(exporter.includes("const LAYOUT_POLICY_PATH = 'data/visual/all-character-world-use-interaction-layout-master-v1.json'"), 'production exporter must load world-use layout policy directly');
assert(exporter.includes('allCharacterWorldUseInteractionLayoutRequired'), 'production exporter must resolve world-use layout required flag');
assert(exporter.includes('worldUseInteractionLayoutPolicyPath'), 'production exporter must expose world-use layout policy path');

console.log('all-character world-use interaction layout: OK');
